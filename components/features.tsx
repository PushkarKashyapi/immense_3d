"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createFrameSequence } from "@/lib/frame-sequence";

gsap.registerPlugin(ScrollTrigger);

// Frames exported from /videos/animal.mp4 (241 frames @ 24fps)
const AMENITIES_FRAME_COUNT = 241;

export default function Features() {
  /* ==========================================================
      REFS
  ========================================================== */

  const sectionRef = useRef<HTMLElement>(null);

  // White World Video (scroll-scrubbed frame sequence)
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLCanvasElement>(null);

  // Black Theatre
  const theatreRef = useRef<HTMLDivElement>(null);
  const theatreVideoRef = useRef<HTMLVideoElement>(null);

  // Story Progress
  const progressFillRef = useRef<HTMLDivElement>(null);

  /* ==========================================================
      GSAP TIMELINES
  ========================================================== */

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;

    const sequence = createFrameSequence(
      videoRef.current,
      "/frames/animal",
      AMENITIES_FRAME_COUNT
    );

    const ctx = gsap.context(() => {
      /* =====================================================
          WHITE WORLD SCRUB
          Pin the video and drive its frames purely by scroll.
          Created first so later triggers account for the pin.
      ====================================================== */

      if (sequence) {
        gsap.to(sequence.playhead, {
          frame: AMENITIES_FRAME_COUNT - 1,
          ease: "none",
          onUpdate: sequence.render,
          scrollTrigger: {
            trigger: videoWrapperRef.current,
            start: "center center",
            end: "+=250%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });
      }

      /* =====================================================
          INITIAL STATE
      ====================================================== */

      gsap.set(
        [
          ".editorial-tag",
          ".heading-line",
          ".editorial-info",
          ".editorial-btn",
          ".feature-panel",
          ".story-panel",
          ".story-overlay",
        ],
        {
          opacity: 0,
        }
      );

      gsap.set(".story-panel", {
        y: 40,
        filter: "blur(14px)",
      });

      gsap.set(".heading-line", {
        yPercent: 120,
      });

      /* =====================================================
          WHITE WORLD INTRO
          Ferrari / Apple Editorial Animation
      ====================================================== */

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      // Background video slowly sharpens
      intro.fromTo(
        videoRef.current,
        {
          scale: 1.12,
          filter: "blur(10px) brightness(1.15)",
        },
        {
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 2,
          ease: "power2.out",
        }
      );

      // Small label
      intro.to(
        ".editorial-tag",
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
        },
        "-=1.55"
      );

      // Heading line by line
      intro.to(
        ".heading-line",
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          stagger: 0.18,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.35"
      );

      // Description
      intro.to(
        ".editorial-info",
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.55"
      );

      // CTA Button
      intro.to(
        ".editorial-btn",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.45"
      );

      // Right feature cards one-by-one
      intro.to(
        ".feature-panel",
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          stagger: {
            each: 0.18,
          },
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.15"
      );

      /* =====================================================
          WHITE WORLD OUTRO
          Everything floats away elegantly
      ====================================================== */

      const outro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 38%",
          end: "bottom top",
          scrub: 2,
        },
      });

      // Tag leaves first
      outro.to(
        ".editorial-tag",
        {
          opacity: 0,
          y: -28,
          filter: "blur(10px)",
          ease: "power2.out",
        },
        0
      );

      // Heading disappears in reverse order
      outro.to(
        ".heading-line",
        {
          opacity: 0,
          yPercent: -120,
          filter: "blur(18px)",
          stagger: {
            each: 0.08,
            from: "end",
          },
          ease: "power2.out",
        },
        0
      );

      // Description
      outro.to(
        ".editorial-info",
        {
          opacity: 0,
          y: -30,
          filter: "blur(10px)",
          ease: "power2.out",
        },
        0.05
      );

      // Button
      outro.to(
        ".editorial-btn",
        {
          opacity: 0,
          y: -20,
          scale: 0.92,
          filter: "blur(8px)",
          ease: "power2.out",
        },
        0.08
      );

      // Cards disappear one by one
      outro.to(
        ".feature-panel",
        {
          opacity: 0,
          x: 40,
          y: -20,
          scale: 0.92,
          filter: "blur(14px)",
          stagger: {
            each: 0.08,
            from: "end",
          },
          ease: "power2.out",
        },
        0.12
      );

      // Video melts into black
      outro.to(
        videoRef.current,
        {
          opacity: 0,
          scale: 1.06,
          filter: "brightness(0) blur(10px)",
          ease: "power2.inOut",
        },
        0
      );

      /* =====================================================
          BLACK THEATRE EXPERIENCE
      ====================================================== */

      const theatre = gsap.timeline({
        scrollTrigger: {
          trigger: theatreRef.current,
          start: "top top",
          end: "+=2600",
          pin: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      // Hold black for dramatic pause
      theatre.to({}, { duration: 0.18 });

      // Fade in walkthrough video
      theatre.fromTo(
        theatreVideoRef.current,
        {
          opacity: 0,
          scale: 1.08,
          filter: "brightness(.25) blur(8px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "brightness(1) blur(0px)",
          ease: "power4.out",
          duration: 0.35,
          onStart: () => theatreVideoRef.current?.play(),
        }
      );

      // Overlay container appears
      theatre.to(
        ".story-overlay",
        {
          opacity: 1,
          duration: 0.2,
        },
        "-=0.15"
      );

      /* =====================================================
          STORY 01 — PRIVATE POOL
      ====================================================== */

      theatre.to(progressFillRef.current, {
        width: "33%",
        duration: 0.2,
      });

      theatre.to(".story-1", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.2,
        ease: "power4.out",
      });

      theatre.to({}, { duration: 0.42 });

      theatre.to(".story-1", {
        opacity: 0,
        y: -35,
        filter: "blur(12px)",
        duration: 0.16,
        ease: "power2.inOut",
      });

      /* =====================================================
          STORY 02 — WATERFALL
      ====================================================== */

      theatre.to(progressFillRef.current, {
        width: "66%",
        duration: 0.2,
      });

      theatre.to(".story-2", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.2,
        ease: "power4.out",
      });

      theatre.to({}, { duration: 0.42 });

      theatre.to(".story-2", {
        opacity: 0,
        y: -35,
        filter: "blur(12px)",
        duration: 0.16,
        ease: "power2.inOut",
      });

      /* =====================================================
          STORY 03 — INTERIORS
      ====================================================== */

      theatre.to(progressFillRef.current, {
        width: "100%",
        duration: 0.2,
      });

      theatre.to(".story-3", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.22,
        ease: "power4.out",
      });

      theatre.to({}, { duration: 0.48 });

      /* =====================================================
          THEATRE OUTRO
      ====================================================== */

      theatre.to(
        ".story-overlay",
        {
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.2,
          ease: "power2.out",
        },
        "-=0.05"
      );

      theatre.to(
        theatreVideoRef.current,
        {
          opacity: 0,
          scale: 0.97,
          filter: "brightness(.3) blur(10px)",
          duration: 0.25,
          ease: "power2.inOut",
        },
        "<"
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      sequence?.destroy();
    };
  }, []);

  /* ==========================================================
      PART 2 CONTINUES FROM HERE (JSX)
  ========================================================== */

  return (

    <section ref={sectionRef} id="features" className="relative bg-white overflow-hidden">

  {/* ========================================================= */}
  {/* WHITE WORLD — LUXURY AMENITIES */}
  {/* ========================================================= */}

  <div className="features-white">

    {/* Section Heading */}

    <div className="features-heading">

      <p className="text-[11px] uppercase tracking-[0.45em] text-black/40">
        Signature Amenities
      </p>

      <h2 className="mt-4 text-6xl md:text-8xl font-light tracking-[-0.05em] text-black">
        Crafted Around Luxury.
      </h2>

    </div>

    {/* Main Video Container */}

    <div ref={videoWrapperRef} className="features-video-wrapper">

      {/* Background Video — scroll-driven frame sequence */}

      <canvas
        ref={videoRef}
        className="feature-video"
        aria-hidden="true"
      />

      {/* Cinematic Overlay */}

      <div className="video-dark-overlay"/>

      {/* Soft White Glow */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-black/35"/>

      {/* ===================================================== */}
      {/* EDITORIAL UI */}
      {/* ===================================================== */}

      <div className="editorial-ui">

        {/* ================= LEFT CONTENT ================= */}

        <div className="editorial-left">

          <p className="editorial-tag">
            SIGNATURE AMENITIES
          </p>

          <h2 className="editorial-heading">

            <span className="heading-line">CRAFTED</span>

            <span className="heading-line">FOR</span>

            <span className="heading-line">LUXURY</span>

          </h2>

          <div className="editorial-info">

            <div className="editorial-thumb">
              <div className="thumb-circle"/>
            </div>

            <p>
              Every residence is surrounded by curated experiences,
              timeless architecture, breathtaking landscapes and
              world-class amenities designed for elevated living.
            </p>

          </div>

          <button className="editorial-btn">
            Explore Amenities
          </button>

        </div>

        {/* ================= RIGHT GRID ================= */}

        <div className="editorial-grid">

          {/* Card 01 */}

          <div className="feature-panel dark">

            <span className="panel-index">01</span>

            <div className="panel-content">

              <span className="panel-label">
                SKY LOUNGE
              </span>

              <h3>
                Rooftop Sky Lounge
              </h3>

              <p>
                Panoramic skyline lounge crafted for evening gatherings
                and uninterrupted city views.
              </p>

            </div>

            <div className="panel-arrow">
              ↗
            </div>

          </div>

          {/* Card 02 */}

          <div className="feature-panel light">

            <span className="panel-index">02</span>

            <div className="panel-content">

              <span className="panel-label">
                INFINITY POOL
              </span>

              <h3>
                Infinity Edge Pool
              </h3>

              <p>
                Temperature-controlled rooftop pool overlooking landscaped
                courtyards and private decks.
              </p>

            </div>

            <div className="panel-arrow">
              ↗
            </div>

          </div>

          {/* Card 03 */}

          <div className="feature-panel light">

            <span className="panel-index">03</span>

            <div className="panel-content">

              <span className="panel-label">
                WELLNESS SPA
              </span>

              <h3>
                Wellness Pavilion
              </h3>

              <p>
                Yoga, meditation, luxury spa and wellness experiences
                inspired by modern resorts.
              </p>

            </div>

            <div className="panel-arrow">
              ↗
            </div>

          </div>

          {/* Card 04 */}

          <div className="feature-panel dark">

            <span className="panel-index">04</span>

            <div className="panel-content">

              <span className="panel-label">
                CLUBHOUSE
              </span>

              <h3>
                Private Clubhouse
              </h3>

              <p>
                Double-height clubhouse with lounge, café,
                cinema and entertainment spaces.
              </p>

            </div>

            <div className="panel-arrow">
              ↗
            </div>

          </div>

        </div>

      </div>

      {/* Floating Luxury Accent */}

      <div className="floating-accent"/>

    </div>

  </div>

  {/* ========================================================= */}
  {/* PART 3 STARTS HERE — BLACK THEATRE */}
  {/* ========================================================= */}

    {/* ========================================================= */}
  {/* BLACK THEATRE EXPERIENCE */}
  {/* ========================================================= */}

  <div ref={theatreRef} className="black-theatre">

    {/* Fullscreen Walkthrough Video */}
    <video
      ref={theatreVideoRef}
      src="/videos/demo.mp4"
      muted
      playsInline
      preload="auto"
      className="theatre-video"
    />

    {/* Cinematic Overlay */}
    <div className="theatre-overlay" />

    {/* Grain + Vignette */}
    <div className="theatre-vignette" />

    {/* ===================================================== */}
    {/* STORY OVERLAY */}
    {/* ===================================================== */}

    <div className="story-overlay">

      {/* ---------------- STORY 01 ---------------- */}

      <div className="story-panel story-1">

        <div className="story-top">
          <span className="story-count">01</span>
          <div className="story-divider"/>
        </div>

        <p className="story-tag">
          PRIVATE EXPERIENCE
        </p>

        <h2 className="story-title">
          Private
          <br />
          Swimming Pool
        </h2>

        <p className="story-description">
          An infinity-edge private swimming pool overlooking lush gardens,
          crafted for exclusive sunrise and sunset experiences.
        </p>

        <div className="story-card">
          <div className="story-card-icon"/>
          <div>
            <span className="story-card-label">FEATURE</span>
            <h4>Private Infinity Pool</h4>
          </div>
        </div>

      </div>

      {/* ---------------- STORY 02 ---------------- */}

      <div className="story-panel story-2">

        <div className="story-top">
          <span className="story-count">02</span>
          <div className="story-divider"/>
        </div>

        <p className="story-tag">
          NATURE EXPERIENCE
        </p>

        <h2 className="story-title">
          Cascading
          <br />
          Waterfall Court
        </h2>

        <p className="story-description">
          A landscaped waterfall courtyard designed with natural stone,
          ambient lighting and immersive walking trails.
        </p>

        <div className="story-card">
          <div className="story-card-icon"/>
          <div>
            <span className="story-card-label">LANDSCAPE</span>
            <h4>Waterfall Courtyard</h4>
          </div>
        </div>

      </div>

      {/* ---------------- STORY 03 ---------------- */}

      <div className="story-panel story-3">

        <div className="story-top">
          <span className="story-count">03</span>
          <div className="story-divider"/>
        </div>

        <p className="story-tag">
          INTERIOR EXPERIENCE
        </p>

        <h2 className="story-title">
          Timeless
          <br />
          Interior Design
        </h2>

        <p className="story-description">
          Italian marble flooring, premium wood textures, double-height
          living rooms and bespoke luxury finishes.
        </p>

        <div className="story-card">
          <div className="story-card-icon"/>
          <div>
            <span className="story-card-label">INTERIOR</span>
            <h4>Designer Living Spaces</h4>
          </div>
        </div>

      </div>

      {/* ===================================================== */}
      {/* RIGHT SIDE GLASS INFO CARD */}
      {/* ===================================================== */}

      <div className="story-floating-card">

        <div className="floating-number">
          03
        </div>

        <h4>
          Walkthrough
          <br />
          Experience
        </h4>

        <p>
          Drone-inspired cinematic journey through rooftop, waterfall,
          clubhouse and premium interiors.
        </p>

        <div className="floating-line"/>

        <span>
          15 SECOND IMMERSIVE TOUR
        </span>

      </div>

      {/* ===================================================== */}
      {/* BOTTOM PROGRESS BAR */}
      {/* ===================================================== */}

      <div className="story-progress">

        <div className="story-progress-track">
          <div
            ref={progressFillRef}
            className="story-progress-fill"
          />
        </div>

        <div className="story-progress-labels">

          <div className="progress-item active">
            <span>01</span>
            <p>POOL</p>
          </div>

          <div className="progress-item">
            <span>02</span>
            <p>WATERFALL</p>
          </div>

          <div className="progress-item">
            <span>03</span>
            <p>INTERIOR</p>
          </div>

        </div>

      </div>

      {/* Scroll Hint */}

      <div className="theatre-scroll">

        <span>Continue Scrolling</span>

        <div className="scroll-line"/>

      </div>

    </div>

  </div>

</section>)}