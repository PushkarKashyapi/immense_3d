/* ==========================================================
    SCROLL FRAME SEQUENCE
    Preloads a numbered WebP sequence and draws a frame onto a
    canvas (object-fit: cover, DPR aware). Frames are exported
    from the source video with:
    ffmpeg -i in.mp4 -an -c:v libwebp -quality 70 out/%03d.webp
========================================================== */

export type FrameSequence = {
  /** Fractional frame index; tween this with GSAP. */
  playhead: { frame: number };
  frameCount: number;
  render: () => void;
  destroy: () => void;
};

export function createFrameSequence(
  canvas: HTMLCanvasElement,
  dir: string,
  frameCount: number
): FrameSequence | null {
  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return null;

  const images: HTMLImageElement[] = [];
  const loaded: boolean[] = new Array(frameCount).fill(false);
  const playhead = { frame: 0 };
  let drawnFrame = -1;

  // Draw the requested frame, falling back to the nearest
  // earlier frame that has finished loading.
  const draw = (force: boolean) => {
    let i = Math.round(playhead.frame);
    while (i > 0 && !loaded[i]) i--;
    if (!loaded[i] || (i === drawnFrame && !force)) return;
    drawnFrame = i;

    const img = images[i];
    const cw = canvas.width;
    const ch = canvas.height;

    // object-fit: cover
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
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

  for (const i of order) {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      loaded[i] = true;
      // Redraw if this frame is a better match than what's on screen
      if (i <= Math.round(playhead.frame) && i > drawnFrame) draw(true);
    };
    img.src = `${dir}/${String(i + 1).padStart(3, "0")}.webp`;
    images[i] = img;
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
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
      window.removeEventListener("resize", resize);
      images.forEach((img) => (img.onload = null));
    },
  };
}
