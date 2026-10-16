"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createFrameSequence } from "@/lib/frame-sequence";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 121;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const sequence = createFrameSequence(canvas, "/frames/hero", FRAME_COUNT);
    if (!sequence) return;

    /* =====================================================
        SCROLL TIMELINE
    ====================================================== */

    const gctx = gsap.context(() => {
      gsap.set([headingRef.current, subHeadingRef.current], {
        opacity: 0,
        y: 80,
        filter: "blur(16px)",
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // Video frames span the full scroll (0 → 1)
      tl.to(
        sequence.playhead,
        {
          frame: FRAME_COUNT - 1,
          duration: 1,
          onUpdate: sequence.render,
        },
        0
      );

      // Scroll hint fades out as soon as the user starts scrolling
      tl.to(indicatorRef.current, { opacity: 0, duration: 0.06 }, 0);

      // Heading reveals once the building emerges
      tl.to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.18,
          ease: "power3.out",
        },
        0.6
      );

      tl.to(
        subHeadingRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.16,
          ease: "power3.out",
        },
        0.7
      );

      // Hold on the final frame briefly before the section releases
      tl.to({}, { duration: 0.12 });
    }, section);

    return () => {
      gctx.revert();
      sequence.destroy();
    };
  }, []);

  return (
    // Tall scroll track; the inner stage stays pinned via sticky
    <section ref={sectionRef} className="relative h-[400vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Scroll-driven frame sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-[88%] max-w-[1120px] pb-24">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/70">

            </p>

            <h1
              ref={headingRef}
              className="max-w-4xl text-6xl font-light leading-none tracking-[-0.04em] text-white md:text-8xl"
            >
              Redefining Luxury Living.
            </h1>

            <p
              ref={subHeadingRef}
              className="mt-8 max-w-xl text-base leading-7 text-white/70 md:text-lg"
            >
              An architectural landmark crafted for timeless elegance,
              breathtaking views, and an uncompromising lifestyle.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Scroll
            </span>

            <div className="h-10 w-[1px] bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
