"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: 1,
    label: "MASTERPLANNING",
    title: "Architectural Precision",
    description:
      "Every residence is positioned to maximize natural light, privacy and uninterrupted skyline views through timeless planning principles.",
    reverse: false,
    image: "/images/bend1.png",
  },
  {
    id: 2,
    label: "LANDSCAPE EXPERIENCE",
    title: "Nature Meets Luxury",
    description:
      "Water bodies, gardens, shaded walkways and curated landscapes transform the project into a living sanctuary.",
    reverse: true,
    image: "/images/bend2.png",
  },
  {
    id: 3,
    label: "INTERIOR LANGUAGE",
    title: "Timeless Modern Living",
    description:
      "Italian marble flooring, warm wood textures, premium lighting and bespoke interiors create an understated luxury experience.",
    reverse: false,
    image: "/images/bend3.png",
  },
];

export default function Info() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* =========================
         SECTION HEADING
      ========================= */

      gsap.from(".info-heading", {
        opacity: 0,
        y: 80,
        filter: "blur(12px)",
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      /* =========================
         EACH ROW REVEAL
      ========================= */

      gsap.utils.toArray<HTMLElement>(".info-row").forEach((row, index) => {
        const model = row.querySelector(".model-wrapper");
        const image = row.querySelector(".model-image");
        const content = row.querySelector(".info-content");

        // Image reveal
        gsap.fromTo(
          model,
          {
            opacity: 0,
            x: index % 2 === 0 ? -180 : 180,
            rotateY: index % 2 === 0 ? -25 : 25,
            rotateX: 10,
            scale: 0.82,
            filter: "blur(20px)",
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 72%",
            },
          }
        );

        // Text reveal
        gsap.fromTo(
          content,
          {
            opacity: 0,
            y: 70,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 72%",
            },
          }
        );

        /* =========================
           CONTINUOUS FLOAT MOTION
        ========================= */

        gsap.to(model, {
          y: index % 2 === 0 ? -22 : -16,
          x: index % 2 === 0 ? 8 : -8,
          rotateZ: index % 2 === 0 ? 1.5 : -1.5,
          rotateY: index % 2 === 0 ? 2 : -2,
          duration: 8 + index * 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Slow breathing zoom
        gsap.to(image, {
          scale: 1.08,
          duration: 12 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Scroll parallax
        gsap.to(model, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });

        // Ease out on exit
        gsap.to(row, {
          opacity: 0,
          y: -70,
          filter: "blur(12px)",
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "bottom 25%",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      /* =========================
         MOVING GRID BACKGROUND
      ========================= */

      gsap.to(".grid-overlay", {
        backgroundPositionY: "180px",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="info"
      className="relative overflow-hidden bg-black py-44"
    >
      {/* Grid Background */}
      <div className="grid-overlay absolute inset-0" />

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />

      <div className="relative mx-auto w-[92%] max-w-[1500px]">
        {/* Heading */}

        <div className="info-heading mb-40 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/35">
            DESIGN PHILOSOPHY
          </p>

          <h2 className="mt-6 text-6xl font-light leading-none tracking-[-0.05em] text-white md:text-8xl">
            Every Detail.
            <br />
            Every Configuration.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/55">
            Luxury is never loud. It lives in proportion, craftsmanship and
            experience.
          </p>
        </div>

        {/* Content Rows */}

        {sections.map((item) => (
          <div
            key={item.id}
            className={`info-row mb-44 grid items-center gap-24 md:grid-cols-2 ${
              item.reverse ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Image */}

            <div className="render-model flex items-center justify-center">
              <div className="model-glow" />

              <div className="model-wrapper">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={item.id === 1}
                  className="model-image object-contain select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Text */}

            <div className="info-content">
              <p className="mb-6 text-[11px] uppercase tracking-[0.45em] text-white/35">
                {item.label}
              </p>

              <h3 className="text-5xl font-light leading-none tracking-[-0.05em] text-white md:text-6xl">
                {item.title}
              </h3>

              <p className="mt-10 max-w-xl text-lg leading-8 text-white/65">
                {item.description}
              </p>

              <div className="mt-14 flex items-center gap-4">
                <div className="h-px w-24 bg-white/20" />

                <span className="text-xs uppercase tracking-[0.35em] text-white/40">
                  Explore Design
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}