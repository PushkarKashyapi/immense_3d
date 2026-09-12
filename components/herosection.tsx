"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial hidden state
    tl.set([headingRef.current, subHeadingRef.current], {
      opacity: 0,
      y: 80,
      filter: "blur(16px)",
    });

    // Hero heading reveal after 2.5s
    tl.to(headingRef.current, {
      delay: 2.5,
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.9,
      ease: "power4.out", // Premium fast cinematic ease
    });

    // Paragraph follows slightly after
    tl.to(
      subHeadingRef.current,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "power3.out",
      },
      "-=0.35"
    );
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background 3D Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-reveal.mp4"
        autoPlay
        muted
        loop
        playsInline
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
      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
            Scroll
          </span>

          <div className="h-10 w-[1px] bg-white/40" />
        </div>
      </div>
    </section>
  );
}