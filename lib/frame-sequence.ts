/* ==========================================================
    SCROLL FRAME SEQUENCE
    Preloads a numbered WebP sequence and draws a frame onto a
    canvas (object-fit: cover). Frames are exported from the
    source video with:
    ffmpeg -i in.mp4 -an -c:v libwebp -quality 70 out/%03d.webp
========================================================== */

export type FrameSequence = {
  /** Fractional frame index; tween this with GSAP. */
  playhead: { frame: number };
  frameCount: number;
  render: () => void;
  destroy: () => void;
};

// Frames kept pre-decoded on each side of the playhead. Decoding
// happens off the main thread, so drawing never stalls on a decode.
const DECODE_RADIUS = 8;

export function createFrameSequence(
  canvas: HTMLCanvasElement,
  dir: string,
  frameCount: number
): FrameSequence | null {
  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return null;

  const images: HTMLImageElement[] = [];
  const loaded: boolean[] = new Array(frameCount).fill(false);
  const bitmaps = new Map<number, ImageBitmap>();
  const decoding = new Set<number>();
  const playhead = { frame: 0 };
  let drawnFrame = -1;
  let drawnWidth = 0;
  let destroyed = false;

  const source = (i: number) => bitmaps.get(i) ?? images[i];

  // Nearest loaded frame at or before i
  const nearestLoaded = (i: number) => {
    while (i > 0 && !loaded[i]) i--;
    return loaded[i] ? i : -1;
  };

  const drawCover = (img: CanvasImageSource, w0: number, h0: number) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / w0, ch / h0);
    const w = w0 * scale;
    const h = h0 * scale;
    ctx2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  // Draw the requested frame, falling back to the nearest
  // earlier frame that has finished loading.
  const draw = (force: boolean) => {
    const target = Math.round(
      Math.min(Math.max(playhead.frame, 0), frameCount - 1)
    );
    const i = nearestLoaded(target);
    if (i < 0) return;
    if (i === drawnFrame && canvas.width === drawnWidth && !force) return;
    drawnFrame = i;
    drawnWidth = canvas.width;

    const { naturalWidth, naturalHeight } = images[i];
    drawCover(source(i), naturalWidth, naturalHeight);

    updateDecodeWindow(target);
  };

  // Keep ImageBitmaps for frames near the playhead, release the rest
  const updateDecodeWindow = (center: number) => {
    if (typeof createImageBitmap !== "function") return;

    for (const [i, bm] of bitmaps) {
      if (Math.abs(i - center) > DECODE_RADIUS + 4) {
        bm.close();
        bitmaps.delete(i);
      }
    }

    for (let d = 0; d <= DECODE_RADIUS; d++) {
      for (const i of d === 0 ? [center] : [center + d, center - d]) {
        if (i < 0 || i >= frameCount || !loaded[i]) continue;
        if (bitmaps.has(i) || decoding.has(i)) continue;
        decoding.add(i);
        createImageBitmap(images[i])
          .then((bm) => {
            decoding.delete(i);
            const c = Math.round(playhead.frame);
            if (destroyed || Math.abs(i - c) > DECODE_RADIUS + 4) {
              bm.close();
              return;
            }
            bitmaps.set(i, bm);
          })
          .catch(() => decoding.delete(i));
      }
    }
  };

  // Coarse-to-fine load order (every 16th frame, then 8th, 4th...)
  // so fast scrubbing has a nearby frame long before all have loaded.
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

  let sized = false;

  for (const i of order) {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      loaded[i] = true;
      if (!sized) resize(); // first frame tells us the source resolution
      // Redraw if this frame is a better match than what's on screen
      if (i === nearestLoaded(Math.round(playhead.frame))) draw(true);
    };
    img.src = `${dir}/${String(i + 1).padStart(3, "0")}.webp`;
    images[i] = img;
  }

  /* -----------------------------------------------------------
      Canvas backing store: never larger than the source frames
      can fill. A 720p frame on a 2x screen gains no detail from
      a 2x canvas, it only costs 4x the pixels per draw.
  ----------------------------------------------------------- */

  const resize = () => {
    const ref = images.find((img, i) => img && loaded[i]);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (ref) {
      sized = true;
      const cover = Math.max(cssW / ref.naturalWidth, cssH / ref.naturalHeight);
      dpr = Math.min(dpr, Math.max(1, 1 / cover));
    }

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx2d.imageSmoothingQuality = "high";
    draw(true);
  };

  resize();
  window.addEventListener("resize", resize);

  return {
    playhead,
    frameCount,
    render: () => draw(false),
    destroy: () => {
      destroyed = true;
      window.removeEventListener("resize", resize);
      images.forEach((img) => (img.onload = null));
      bitmaps.forEach((bm) => bm.close());
      bitmaps.clear();
    },
  };
}
