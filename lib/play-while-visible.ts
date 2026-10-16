import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Run a section's looping "ambient" animations (floats, pulses, shines)
 * only while it is on screen, so off-screen loops don't spend main-thread
 * and paint time while the user scrolls elsewhere.
 *
 * Collects every `repeat: -1` tween created so far in `ctx`; timelines
 * aren't tracked by Context, so pass looping ones in `extra`. CSS
 * keyframe loops inside the section are paused via `data-offscreen`
 * (see globals.css).
 */
export function playWhileVisible(
  trigger: gsap.DOMTarget,
  ctx: gsap.Context,
  extra: gsap.core.Animation[] = []
) {
  const tweens: gsap.core.Tween[] = ctx.getTweens();
  const loops = [...extra, ...tweens.filter((t) => t.repeat() === -1)];
  const [el] = gsap.utils.toArray<HTMLElement>(trigger);

  loops.forEach((a) => a.pause());
  el?.setAttribute("data-offscreen", "");

  return ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: ({ isActive }) => {
      loops.forEach((a) => (isActive ? a.resume() : a.pause()));
      el?.toggleAttribute("data-offscreen", !isActive);
    },
  });
}
