"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playWhileVisible } from "@/lib/play-while-visible";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Shopping",
    color: "#FFD84D",
    places: [
      { name: "Phoenix Marketcity", distance: "2.8 KM", x: 68, y: 30 },
      { name: "Lulu Hypermarket", distance: "3.4 KM", x: 80, y: 58 },
    ],
  },
  {
    title: "Schools",
    color: "#73E9FF",
    places: [
      { name: "Delhi Public School", distance: "1.9 KM", x: 28, y: 48 },
      { name: "VIBGYOR High School", distance: "3.2 KM", x: 55, y: 68 },
    ],
  },
  {
    title: "Hospitals",
    color: "#90FFB6",
    places: [
      { name: "Apollo Hospital", distance: "2.5 KM", x: 38, y: 20 },
      { name: "Manipal Hospital", distance: "4.1 KM", x: 18, y: 72 },
    ],
  },
  {
    title: "Metro",
    color: "#C89EFF",
    places: [
      { name: "Central Metro Station", distance: "900 M", x: 48, y: 34 },
      { name: "IT Corridor Metro", distance: "2.1 KM", x: 66, y: 64 },
    ],
  },
];

export default function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      gsap.from(".location-heading", {
        opacity: 0,
        y: 60,
        filter: "blur(12px)",
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(lampRef.current, {
        opacity: 0,
        x: -120,
        rotate: -18,
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(mapRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 80,
        duration: 1.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 80%",
        },
      });

      gsap.to(lampRef.current, {
        rotate: 2,
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 5,
        ease: "sine.inOut",
      });

      gsap.to(beamRef.current, {
        opacity: 0.9,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Ambient loops only run while this section is on screen
      playWhileVisible(sectionRef.current, self);
    }, sectionRef);

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % categories.length);
    }, 2800);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  const current = categories[active];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />

      <div className="mx-auto w-[94%] max-w-[1600px]">
        <div className="mb-24 text-center">
          <p className="location-heading text-[11px] uppercase tracking-[0.45em] text-white/40">
            PRIME LOCATION
          </p>

          <h2 className="location-heading mt-5 text-6xl font-light leading-none tracking-[-0.05em] text-white md:text-8xl">
            Everything Around You.
          </h2>

          <p className="location-heading mt-7 uppercase tracking-[0.35em] text-white/45 text-sm">
            Connected to lifestyle • education • healthcare • entertainment.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          {/* Lamp */}
          <div className="relative flex justify-center">
           <div ref={lampRef} className="designer-lamp">

  <div className="lamp-head" />

  <div className="lamp-joint joint-top" />
  <div className="lamp-joint joint-bottom" />

  <div className="lamp-arm arm-one" />
  <div className="lamp-arm arm-two" />

  <div className="lamp-pole" />

  <div className="lamp-base" />

  <div ref={beamRef} className="lamp-light" />

</div>
          </div>

          {/* Map */}
          <div
            ref={mapRef}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0D0D0D] p-8 shadow-[0_30px_120px_rgba(255,255,255,0.05)]"
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                  Nearby Connectivity
                </p>

                <h3 className="mt-3 text-4xl font-light text-white">
                  {current.title}
                </h3>
              </div>

              <div
                className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.35em]"
                style={{
                  backgroundColor: `${current.color}20`,
                  color: current.color,
                  border: `1px solid ${current.color}50`,
                }}
              >
                Live
              </div>
            </div>

            {/* 3D Map */}
            <div className="location-map relative h-[420px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#181818] to-[#050505]">
              <div className="map-grid" />

              <div className="map-road road-1" />
              <div className="map-road road-2" />
              <div className="map-road road-3" />
              <div className="map-road road-4" />

              {/* Your Site */}
              <div className="site-pin">
                <div className="site-circle" />
                <span>PROJECT SITE</span>
              </div>

              {/* Dynamic Nearby Pins */}
              {current.places.map((place) => (
                <div
                  key={place.name}
                  className="dynamic-pin"
                  style={{
                    left: `${place.x}%`,
                    top: `${place.y}%`,
                  }}
                >
                  <div
                    className="pin-marker"
                    style={{
                      backgroundColor: current.color,
                      boxShadow: `0 0 24px ${current.color}`,
                    }}
                  >
                    <MapPin size={14} color="#000" />
                  </div>

                  <div className="pin-label">
                    <p>{place.name}</p>
                    <span>{place.distance}</span>
                  </div>
                </div>
              ))}

              <div className="map-float-glow" />
            </div>

            {/* Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {current.places.map((place) => (
                <div
                  key={place.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                    {current.title}
                  </p>

                  <h4 className="mt-2 text-lg text-white">{place.name}</h4>

                  <p
                    className="mt-3 text-sm font-medium"
                    style={{ color: current.color }}
                  >
                    {place.distance} Away
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Tabs */}
            <div className="mt-8 flex flex-wrap gap-3">
              {categories.map((cat, index) => (
                <button
                  key={cat.title}
                  onClick={() => setActive(index)}
                  className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.3em] transition-all duration-500 ${
                    active === index
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/5 text-white/45"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}