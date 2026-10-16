"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playWhileVisible } from "@/lib/play-while-visible";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    id: "01",
    title: "Sky Lounge",
    value: "51M+",
    description:
      "Panoramic skyline lounge crafted for evening gatherings and uninterrupted city views.",
    dark: true,
  },
  {
    id: "02",
    title: "Infinity Pool",
    value: "200+",
    description:
      "Temperature-controlled rooftop pool overlooking landscaped courtyards and private decks.",
    dark: false,
  },
  {
    id: "03",
    title: "Wellness Pavilion",
    value: "86+",
    description:
      "Yoga, meditation, luxury spa and wellness experiences inspired by modern resorts.",
    dark: false,
  },
  {
    id: "04",
    title: "Private Clubhouse",
    value: "2 Lakh+",
    description:
      "Double-height clubhouse with lounge, café, cinema and entertainment spaces.",
    dark: true,
  },
];

export default function Proof() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
  const ctx = gsap.context((self) => {
    // Entire section fades in slowly
    gsap.from(".proof-container", {
      opacity: 0,
      y: 80,
      filter: "blur(20px)",
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
      },
    });

    // Tag
    gsap.from(".proof-tag", {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 82%",
      },
    });

    // Heading line by line
    gsap.from(".proof-heading span", {
      opacity: 0,
      y: 100,
      filter: "blur(18px)",
      stagger: 0.15,
      duration: 1.3,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 78%",
      },
    });

    // Description
    gsap.from(".proof-description", {
      opacity: 0,
      y: 40,
      filter: "blur(12px)",
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 74%",
      },
    });

    // Cards — one by one, very smooth
    gsap.from(".proof-card", {
      opacity: 0,
      y: 120,
      scale: 0.82,
      rotateX: 12,
      filter: "blur(18px)",
      duration: 1.35,
      ease: "power4.out",
      stagger: {
        each: 0.22,
        from: "start",
      },
      scrollTrigger: {
        trigger: ".proof-grid",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    // Continuous floating motion after appearing.
    // yPercent, not y: the entrance animates y, and a loop started
    // mid-entrance would take that offset as its resting position.
    gsap.utils.toArray<HTMLElement>(".proof-card").forEach((card, i) => {
      gsap.to(card, {
        yPercent: -3,
        rotateZ: i % 2 === 0 ? 0.4 : -0.4,
        duration: 5 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Reflection sweep
    gsap.to(".glass-shine", {
      x: 220,
      duration: 5.5,
      repeat: -1,
      ease: "none",
      stagger: 0.2,
    });

    // Ambient loops only run while this section is on screen
    playWhileVisible(sectionRef.current, self);
  }, sectionRef);

  return () => ctx.revert();
}, []);

  return (
    <section ref={sectionRef} className="proof-section">
      <div className="proof-container">

        <p className="proof-tag">ABOUT PURAVANKARA</p>

        <h2 className="proof-heading">
          <span>Perfecting Luxury</span>
          <span>Since 1975.</span>
        </h2>

        <p className="proof-description">
          Puravankara isn’t just a developer—it’s a legacy. Nearly five decades
          of creating landmark residences across Bengaluru, Mumbai, Chennai,
          Pune and India’s fastest-growing luxury destinations.
        </p>

        <div className="proof-grid">
          {stats.map((item) => (
            <div
              key={item.id}
              className={`proof-card ${item.dark ? "dark" : "light"}`}
            >
              <div className="glass-shine" />

              <div className="proof-number">{item.id}</div>

              <p className="proof-title">{item.title}</p>

              <h3 className="proof-value">{item.value}</h3>

              <p className="proof-text">{item.description}</p>

              <button className="proof-arrow">↗</button>
            </div>
          ))}
        </div>

        <div className="proof-footer">
          <span className="proof-line" />
          <p>TRUSTED BY GENERATIONS OF HOMEOWNERS ACROSS INDIA</p>
          <span className="proof-line" />
        </div>
      </div>
    </section>
  );
}