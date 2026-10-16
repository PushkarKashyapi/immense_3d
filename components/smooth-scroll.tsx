"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Mobile URL bar show/hide resizes the viewport mid-scroll; recomputing
// every trigger then causes visible jumps in pinned sections.
ScrollTrigger.config({ ignoreMobileResize: true });

/* ==========================================================
    SMOOTH SCROLL
    Lenis interpolates wheel input; GSAP's ticker drives it so
    ScrollTrigger scrubs (and the canvas frame sequences) read
    the same smoothed position on the same frame.
========================================================== */

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      anchors: true,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Never let GSAP "catch up" after a slow frame; that reads as a jump
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
