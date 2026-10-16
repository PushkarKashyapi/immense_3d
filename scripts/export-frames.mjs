#!/usr/bin/env node
/* ==========================================================
    EXPORT SCROLL FRAME SEQUENCES
    Turns each source video into a numbered WebP sequence for
    lib/frame-sequence.ts and records frame counts in
    lib/frame-manifest.json. Requires ffmpeg on PATH.

    node scripts/export-frames.mjs                    # all, 24fps
    node scripts/export-frames.mjs demo               # just one
    node scripts/export-frames.mjs --rife <exe>       # 48fps via RIFE

    --rife takes the path to rife-ncnn-vulkan(.exe) from
    https://github.com/nihui/rife-ncnn-vulkan/releases; its
    rife-v4.6 model folder must sit next to the executable.
    RIFE runs on the source-resolution frames; the result is
    then upscaled to 1080p with Lanczos and lightly sharpened,
    which reads noticeably crisper than letting the browser
    upscale the 720p source.
========================================================== */

import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST = path.join(ROOT, "lib/frame-manifest.json");

const SEQUENCES = {
  hero: "public/videos/hero-reveal.mp4",
  animal: "public/videos/animal.mp4",
  demo: "public/videos/demo.mp4",
};

const SOURCE_FPS = 24;
const WIDTH = 1920;
const HEIGHT = 1080;
const QUALITY = 95;
const RIFE_MODEL = "rife-v4.6";

const filters = [
  `scale=${WIDTH}:${HEIGHT}:flags=lanczos`,
  "unsharp=5:5:0.6:5:5:0.0", // luma only, avoids colour halos
].join(",");

/* ---------------- args ---------------- */

const args = process.argv.slice(2);
const rifeAt = args.indexOf("--rife");
const rife = rifeAt >= 0 ? path.resolve(args[rifeAt + 1]) : null;
const only = args.filter((a, i) => i !== rifeAt && i !== rifeAt + 1);

const run = (cmd, cmdArgs) =>
  execFileSync(cmd, cmdArgs, { stdio: ["ignore", "inherit", "inherit"] });

const countFiles = (dir, ext) =>
  readdirSync(dir).filter((f) => f.endsWith(ext)).length;

const encodeWebp = (input, inputArgs, out) =>
  run("ffmpeg", [
    "-v", "error",
    ...inputArgs,
    "-i", input,
    "-an",
    "-vf", filters,
    "-c:v", "libwebp",
    "-quality", String(QUALITY),
    "-compression_level", "6",
    path.join(out, "%03d.webp"),
  ]);

/* ---------------- export ---------------- */

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));

for (const [name, src] of Object.entries(SEQUENCES)) {
  if (only.length && !only.includes(name)) continue;

  const out = path.join(ROOT, "public/frames", name);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  console.log(`→ ${name}: ${src}${rife ? " (RIFE 2x)" : ""}`);

  let fps = SOURCE_FPS;

  if (rife) {
    const tmp = mkdtempSync(path.join(os.tmpdir(), `frames-${name}-`));
    const inDir = path.join(tmp, "in");
    const midDir = path.join(tmp, "out");
    mkdirSync(inDir);
    mkdirSync(midDir);

    // Lossless source frames for RIFE
    run("ffmpeg", ["-v", "error", "-i", path.join(ROOT, src), "-an", path.join(inDir, "%08d.png")]);
    const n = countFiles(inDir, ".png");

    // RIFE places output frame i at source time i * n / count, so a
    // count of 2n lands exactly on 0, 0.5, 1, 1.5 ... (odd outputs are
    // the untouched source frames). The last one, n - 0.5, has no
    // right-hand neighbour and just repeats the final frame: drop it.
    run(rife, [
      "-i", inDir,
      "-o", midDir,
      "-m", path.join(path.dirname(rife), RIFE_MODEL),
      "-n", String(2 * n),
      "-f", "%08d.png",
    ]);
    rmSync(path.join(midDir, `${String(2 * n).padStart(8, "0")}.png`));

    encodeWebp(path.join(midDir, "%08d.png"), ["-framerate", String(SOURCE_FPS * 2)], out);
    rmSync(tmp, { recursive: true, force: true });
    fps = SOURCE_FPS * 2;
  } else {
    encodeWebp(path.join(ROOT, src), [], out);
  }

  const count = countFiles(out, ".webp");
  manifest[name] = { count, fps };
  console.log(`  ${count} frames @ ${fps}fps → public/frames/${name}`);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
