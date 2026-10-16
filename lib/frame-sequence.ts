/* ==========================================================
    SCROLL FRAME SEQUENCE
    Downloads a numbered WebP sequence and draws the frame under
    the playhead onto a canvas (object-fit: cover). Frames are
    exported from the source videos with scripts/export-frames.mjs.

    Frames are fetched as Blobs and decoded with
    createImageBitmap(blob), which always decodes off the main
    thread. Only already-decoded frames are ever drawn, so a
    scroll frame never waits on a decode: if the exact frame
    isn't ready yet, the nearest decoded one is shown instead.
========================================================== */

export type FrameSequence = {
  /** Fractional frame index; tween this with GSAP. */
  playhead: { frame: number };
  frameCount: number;
  render: () => void;
  destroy: () => void;
};

type Options = {
  /** Network priority for the frame downloads. */
  priority?: Priority;
};

// Decoded frames kept around the playhead (~8MB each at 1080p)
const KEEP_RADIUS = 14;
// How far ahead (in the direction of travel) to decode
const DECODE_AHEAD = 12;
// Parallel decodes. More just queues stale work behind fresh work.
const MAX_IN_FLIGHT = 6;
// Typical createImageBitmap latency; decodes aim where the playhead
// will be by the time they finish, not where it is now.
const DECODE_LATENCY_MS = 50;
// How far from the playhead to look for a stand-in decoded frame
const FALLBACK_RADIUS = 24;

/* -----------------------------------------------------------
    Shared download queue. Firing ~1,400 fetches at once makes
    the browser reject most of them ("Failed to fetch"), so every
    sequence on the page shares a small pool: high-priority jobs
    (the hero) first, failed downloads retried with backoff.
----------------------------------------------------------- */

const MAX_DOWNLOADS = 8;
const MAX_RETRIES = 3;

type Priority = "high" | "auto" | "low";
type Job = {
  url: string;
  priority: Priority;
  signal: AbortSignal;
  onBlob: (blob: Blob) => void;
  attempt: number;
};

const queues: Record<Priority, Job[]> = { high: [], auto: [], low: [] };
let activeDownloads = 0;

function enqueue(job: Job) {
  queues[job.priority].push(job);
  drainQueue();
}

function drainQueue() {
  while (activeDownloads < MAX_DOWNLOADS) {
    const job =
      queues.high.shift() ?? queues.auto.shift() ?? queues.low.shift();
    if (!job) return;
    if (job.signal.aborted) continue;

    activeDownloads++;
    fetch(job.url, { priority: job.priority, signal: job.signal })
      .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
      .then(job.onBlob)
      .catch(() => {
        if (job.signal.aborted || job.attempt >= MAX_RETRIES) return;
        job.attempt++;
        setTimeout(() => enqueue(job), 250 * job.attempt);
      })
      .finally(() => {
        activeDownloads--;
        drainQueue();
      });
  }
}

export function createFrameSequence(
  canvas: HTMLCanvasElement,
  dir: string,
  frameCount: number,
  { priority = "auto" }: Options = {}
): FrameSequence | null {
  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return null;

  const blobs: (Blob | undefined)[] = new Array(frameCount);
  const bitmaps = new Map<number, ImageBitmap>();
  const decoding = new Set<number>();
  const abort = new AbortController();
  const playhead = { frame: 0 };
  let drawnFrame = -1;
  let destroyed = false;
  let visible = true;

  /* -----------------------------------------------------------
      Visible-region decoding. A portrait phone only shows a
      narrow vertical slice of each 16:9 frame (object-fit: cover),
      so frames are decoded cropped to that slice: ~3x less bitmap
      memory, identical pixels on screen. Learned from the first
      decode; skipped when the crop would save little (desktop).
  ----------------------------------------------------------- */
  let sourceSize: [number, number] | null = null;
  let crop: [number, number, number, number] | null = null;
  let cropSupported = true;

  const computeCrop = (): typeof crop => {
    if (!sourceSize || !cropSupported || !canvas.width || !canvas.height) return null;
    const [sw, sh] = sourceSize;
    const canvasAspect = canvas.width / canvas.height;
    const sourceAspect = sw / sh;
    const rect: [number, number, number, number] =
      canvasAspect < sourceAspect
        ? [0, 0, Math.ceil(sh * canvasAspect), sh]
        : [0, 0, sw, Math.ceil(sw / canvasAspect)];
    rect[0] = Math.floor((sw - rect[2]) / 2);
    rect[1] = Math.floor((sh - rect[3]) / 2);
    // Only worth it when it drops at least a quarter of the pixels
    return (rect[2] * rect[3]) / (sw * sh) < 0.75 ? rect : null;
  };

  const decode = (blob: Blob) =>
    crop ? createImageBitmap(blob, ...crop) : createImageBitmap(blob);

  const target = () =>
    Math.round(Math.min(Math.max(playhead.frame, 0), frameCount - 1));

  // Playhead velocity in frames/ms, smoothed, for decode prediction
  let lastTarget = 0;
  let lastMove = 0;
  let velocity = 0;

  const trackVelocity = (t: number) => {
    const now = performance.now();
    if (t !== lastTarget) {
      const dt = Math.max(now - lastMove, 1);
      velocity = velocity * 0.6 + ((t - lastTarget) / dt) * 0.4;
      lastTarget = t;
      lastMove = now;
    }
  };

  // Closest decoded frame to i, preferring i itself
  const nearestDecoded = (i: number) => {
    for (let d = 0; d <= FALLBACK_RADIUS; d++) {
      if (bitmaps.has(i - d)) return i - d;
      if (bitmaps.has(i + d)) return i + d;
    }
    return -1;
  };

  const draw = (force: boolean) => {
    const t = target();
    trackVelocity(t);
    evictFarFrames(t);
    pump();

    const i = nearestDecoded(t);
    if (i < 0 || (i === drawnFrame && !force)) return;
    drawnFrame = i;

    const bm = bitmaps.get(i)!;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / bm.width, ch / bm.height);
    const w = bm.width * scale;
    const h = bm.height * scale;
    ctx2d.drawImage(bm, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  const releaseBitmaps = () => {
    bitmaps.forEach((bm) => bm.close());
    bitmaps.clear();
    drawnFrame = -1;
  };

  const evictFarFrames = (t: number) => {
    for (const [i, bm] of bitmaps) {
      if (Math.abs(i - t) > KEEP_RADIUS) {
        bm.close();
        bitmaps.delete(i);
      }
    }
  };

  /* -----------------------------------------------------------
      Decode scheduler. A small pool of decodes; each free slot
      takes the undecoded frame nearest to where the playhead is
      predicted to be when the decode lands, looking ahead in the
      direction of travel first. Frames the playhead has already
      passed are never queued, so fast scrolling doesn't build a
      backlog of stale work.
  ----------------------------------------------------------- */

  const nextToDecode = () => {
    const t = target();
    const moving = performance.now() - lastMove < 120;
    const v = moving ? velocity : 0;
    const lead = Math.max(-10, Math.min(10, Math.round(v * DECODE_LATENCY_MS)));
    const center = Math.min(Math.max(t + lead, 0), frameCount - 1);
    const dir = v < 0 ? -1 : 1;

    for (let d = 0; d <= DECODE_AHEAD; d++) {
      for (const i of d === 0 ? [center] : [center + dir * d, center - dir * d]) {
        if (i < 0 || i >= frameCount || Math.abs(i - t) > KEEP_RADIUS) continue;
        if (blobs[i] && !bitmaps.has(i) && !decoding.has(i)) return i;
      }
    }
    return -1;
  };

  const pump = () => {
    while (visible && !destroyed && decoding.size < MAX_IN_FLIGHT) {
      const i = nextToDecode();
      if (i < 0) return;
      decoding.add(i);
      const cropped = crop !== null;
      decode(blobs[i]!)
        .then((bm) => {
          decoding.delete(i);
          if (!sourceSize && !cropped) {
            sourceSize = [bm.width, bm.height];
            crop = computeCrop();
          }
          const t = target();
          if (!visible || destroyed || Math.abs(i - t) > KEEP_RADIUS) {
            bm.close();
          } else {
            bitmaps.set(i, bm);
            // Show it if it beats what's on screen
            if (drawnFrame < 0 || Math.abs(i - t) < Math.abs(drawnFrame - t)) {
              draw(true);
            }
          }
          pump();
        })
        .catch(() => {
          decoding.delete(i);
          // Browsers without cropped createImageBitmap: decode whole frames
          if (cropped) {
            cropSupported = false;
            crop = null;
          }
          pump();
        });
    }
  };

  /* -----------------------------------------------------------
      Download coarse-to-fine (every 16th frame, then 8th, 4th...)
      so fast scrubbing has a nearby frame long before all arrive.
  ----------------------------------------------------------- */

  const order: number[] = [];
  const queued = new Set<number>();
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < frameCount; i += step) {
      if (!queued.has(i)) {
        queued.add(i);
        order.push(i);
      }
    }
  }

  for (const i of order) {
    enqueue({
      url: `${dir}/${String(i + 1).padStart(3, "0")}.webp`,
      priority,
      signal: abort.signal,
      attempt: 0,
      onBlob: (blob) => {
        blobs[i] = blob;
        if (Math.abs(i - target()) <= KEEP_RADIUS) pump();
      },
    });
  }

  /* -----------------------------------------------------------
      Full-density backing store so scaling uses the canvas's
      high-quality smoothing. Only reallocate when the element
      really changes size (mobile URL bar show/hide fires window
      resizes constantly).
  ----------------------------------------------------------- */

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    ctx2d.imageSmoothingQuality = "high";

    // A new aspect ratio needs a new crop; re-decode at the new one
    const next = computeCrop();
    if (String(next) !== String(crop)) {
      crop = next;
      releaseBitmaps();
    }
    draw(true);
  };

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // Drop decoded frames while the canvas is far off screen; idle
  // sequences shouldn't hold ~200MB of bitmaps.
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) draw(true);
      else releaseBitmaps();
    },
    { rootMargin: "100% 0px" }
  );
  visibilityObserver.observe(canvas);

  return {
    playhead,
    frameCount,
    render: () => draw(false),
    destroy: () => {
      destroyed = true;
      abort.abort();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      releaseBitmaps();
    },
  };
}
