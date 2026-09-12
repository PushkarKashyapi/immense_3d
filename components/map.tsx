"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const points = [
  { id: 1, title: "Main Entry Plaza", x: 620, y: 520 },
  { id: 2, title: "Tower A", x: 230, y: 360 },
  { id: 3, title: "Tower B", x: 430, y: 260 },
  { id: 4, title: "Tower C", x: 455, y: 430 },
  { id: 5, title: "Clubhouse", x: 180, y: 190 },
  { id: 6, title: "Swimming Pool", x: 270, y: 180 },
  { id: 7, title: "Garden", x: 650, y: 430 },
  { id: 8, title: "Buddha Landscape", x: 560, y: 290 },
  { id: 9, title: "Walkway", x: 445, y: 365 },
  { id: 10, title: "Play Area", x: 330, y: 350 },
  { id: 11, title: "Basketball Court", x: 220, y: 450 },
  { id: 12, title: "Yoga Lawn", x: 340, y: 300 },
  { id: 13, title: "Amphitheatre", x: 415, y: 70 },
];

export default function MapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading Reveal
      gsap.from(".map-heading", {
        opacity: 0,
        y: 60,
        filter: "blur(12px)",
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      });

      // Floating Map Entry
      gsap.fromTo(
        mapRef.current,
        {
          opacity: 0,
          y: 140,
          rotateX: 18,
          scale: 0.92,
          filter: "blur(14px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 78%",
          },
        }
      );

      // Continuous Floating Motion
      gsap.to(mapRef.current, {
        y: -18,
        rotateZ: 0.8,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Pins appear one by one
      gsap.from(".map-pin", {
        opacity: 0,
        scale: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 70%",
        },
      });

      // Floating pulse animation
      gsap.utils.toArray<HTMLElement>(".map-pin").forEach((pin) => {
        gsap.to(pin, {
          y: -6,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

    return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-40"
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_65%)]" />

      <div className="relative mx-auto w-[95%] max-w-[1600px]">
        {/* Heading */}
        <div className="mb-24 text-center">
          <p className="map-heading text-[11px] uppercase tracking-[0.45em] text-black/40">
            MASTER PLAN
          </p>

          <h2 className="map-heading mt-5 text-6xl font-light tracking-[-0.05em] text-black md:text-8xl">
            Explore Every Corner.
          </h2>

          <p className="map-heading mt-8 text-sm uppercase tracking-[0.35em] text-black/50">
            Interactive Site Layout • Luxury Community Experience
          </p>
        </div>

        {/* Layout */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.55fr_0.75fr]">
          {/* Floating Map */}
          <div
            ref={mapRef}
            className="master-map relative h-[760px] overflow-hidden rounded-[42px] bg-[#F8F8F8]"
          >
            {/* Floating shadow */}
            <div className="absolute bottom-5 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-full bg-black/10 blur-[36px]" />

            <svg viewBox="0 0 820 620" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="surface" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#ECECEC" />
                </linearGradient>

                <linearGradient id="tower" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#D8D8D8" />
                </linearGradient>

                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="16"
                    stdDeviation="14"
                    floodOpacity="0.15"
                  />
                </filter>
              </defs>

              {/* Floating Base */}
              <polygon
                points="410,20 760,220 670,560 170,560 60,220"
                fill="url(#surface)"
                stroke="#D6D6D6"
                strokeWidth="2"
                filter="url(#softShadow)"
              />

              {/* Roads */}
              <path
                d="M140 510 L680 510 L720 470 L180 470 Z"
                fill="#F1F1F1"
                stroke="#D2D2D2"
              />

              <path
                d="M110 245 L720 245"
                stroke="#D1D1D1"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <path
                d="M205 120 L205 525"
                stroke="#D9D9D9"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Walkways */}
              {Array.from({ length: 14 }).map((_, i) => (
                <rect
                  key={i}
                  x={165 + i * 34}
                  y="237"
                  width="12"
                  height="16"
                  rx="4"
                  fill="#E6E6E6"
                />
              ))}

              {/* Trees */}
              {[
                [140, 330],
                [190, 295],
                [280, 470],
                [540, 350],
                [590, 290],
                [620, 430],
                [320, 180],
                [450, 100],
                [505, 210],
                [650, 210],
                [210, 520],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="10" fill="#E8E8E8" />
                  <circle cx={x - 6} cy={y + 3} r="4" fill="#D7D7D7" />
                  <circle cx={x + 6} cy={y + 3} r="4" fill="#D7D7D7" />
                </g>
              ))}

              {/* Towers */}
              {[
                [220, 300],
                [300, 220],
                [390, 260],
                [480, 220],
                [550, 340],
                [455, 420],
              ].map(([x, y], i) => (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width="58"
                    height="110"
                    rx="8"
                    fill="url(#tower)"
                    stroke="#BDBDBD"
                  />

                  {Array.from({ length: 7 }).map((_, row) => (
                    <rect
                      key={row}
                      x={x + 8}
                      y={y + 12 + row * 14}
                      width="42"
                      height="6"
                      rx="3"
                      fill="#C9C9C9"
                    />
                  ))}
                </g>
              ))}

              {/* Clubhouse */}
              <rect
                x="120"
                y="155"
                width="150"
                height="72"
                rx="12"
                fill="#F2F2F2"
                stroke="#CFCFCF"
              />

              {/* Infinity Pool */}
              <rect
                x="260"
                y="158"
                width="120"
                height="60"
                rx="26"
                fill="#EFEFEF"
                stroke="#CFCFCF"
              />

              {/* Basketball Court */}
              <rect
                x="120"
                y="430"
                width="120"
                height="55"
                rx="8"
                fill="#EEEEEE"
                stroke="#D5D5D5"
              />

              {/* Yoga Lawn */}
              <rect
                x="320"
                y="338"
                width="120"
                height="60"
                rx="22"
                fill="#F1F1F1"
                stroke="#DADADA"
              />

              {/* Garden */}
              <circle
                cx="610"
                cy="400"
                r="42"
                fill="#F2F2F2"
                stroke="#D5D5D5"
              />

              {/* Amphitheatre */}
              <circle
                cx="405"
                cy="70"
                r="28"
                fill="#F3F3F3"
                stroke="#D8D8D8"
              />
            </svg>

            {/* Floating Number Pins */}
            {points.map((point) => (
              <div
                key={point.id}
                className="map-pin absolute"
                style={{ left: point.x, top: point.y }}
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-semibold text-white shadow-xl">
                  {point.id}
                  <span className="absolute inset-0 rounded-full bg-black/20 animate-ping" />
                </div>

                <div className="marker-tooltip absolute left-11 top-1/2 -translate-y-1/2 rounded-xl bg-white px-4 py-2 whitespace-nowrap text-[11px] uppercase tracking-[0.22em] text-black shadow-2xl opacity-0 transition-all duration-300">
                  {point.title}
                </div>
              </div>
            ))}
          </div>

          {/* Legend Panel */}
          <div className="rounded-[34px] border border-black/5 bg-[#FAFAFA] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] uppercase tracking-[0.45em] text-black/40">
              LEGEND
            </p>

            <h3 className="mt-4 text-5xl font-light tracking-[-0.04em] text-black">
              Master Plan Key
            </h3>

            <div className="mt-10 space-y-5">
              {points.map((point) => (
                <div
                  key={point.id}
                  className="flex items-center justify-between border-b border-black/5 pb-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      {point.id}
                    </div>

                    <span className="text-sm tracking-wide text-black/75">
                      {point.title}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.3em] text-black/30">
                    POI
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}