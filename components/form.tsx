"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FormSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------- Heading ---------- */
      gsap.from(".form-heading > *", {
        opacity: 0,
        y: 70,
        filter: "blur(10px)",
        stagger: 0.18,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      /* ---------- Blender Model ---------- */
      gsap.from(".blender-model", {
        opacity: 0,
        x: -120,
        rotateY: -25,
        rotateX: 12,
        scale: 0.86,
        filter: "blur(18px)",
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

     /* ---------- Premium Floating Motion ---------- */

const floatTL = gsap.timeline({
  repeat: -1,
  yoyo: true,
  defaults: {
    ease: "sine.inOut",
  },
});

floatTL
  .to(".blender-model", {
    y: -22,
    x: 10,
    rotateZ: 1.8,
    rotateY: 3,
    scale: 1.02,
    duration: 3.2,
  })
  .to(".blender-model", {
    y: 14,
    x: -8,
    rotateZ: -1.2,
    rotateY: -2,
    scale: 0.995,
    duration: 3.2,
  });

/* Floating spotlight */

gsap.to(".model-glow", {
  scale: 1.12,
  opacity: 0.9,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

      /* ---------- White Form ---------- */
      gsap.from(".enquiry-card", {
        opacity: 0,
        x: 100,
        scale: 0.94,
        filter: "blur(12px)",
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".enquiry-card",
          start: "top 82%",
        },
      });

      gsap.from(".input-group", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".enquiry-card",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="form-section">
      <div className="form-container">
        {/* LEFT SIDE */}
        <div className="model-side">
          <div className="form-heading">
            <p className="mini-label">PRIVATE SITE EXPERIENCE</p>

            <h2 className="model-heading">
              Discover Your
              <br />
              Future Address.
            </h2>

            <p className="model-description">
              Experience every elevation, courtyard, landscape and architectural
              detail before your first visit through our immersive luxury
              presentation.
            </p>
          </div>

          <div className="model-shell">
            <div className="model-glow" />

            {/* Replace with your PNG render */}
            <img
              src="/images/former.png"
              alt="Luxury Residential Tower"
              className="blender-model"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="enquiry-card">
          <p className="card-label">BOOK A PRIVATE VISIT</p>

          <h3>
            Schedule Your
            <br />
            Walkthrough.
          </h3>

          <p className="card-description">
            Receive pricing, brochure, floor plans and an exclusive site visit
            with our luxury property consultant.
          </p>

          <form className="luxury-form">
            <div className="input-group">
              <label>FULL NAME</label>
              <input placeholder="Enter your full name" />
            </div>

            <div className="input-group">
              <label>CONTACT NUMBER</label>
              <input placeholder="+91 98765 43210" />
            </div>

            <div className="input-group">
              <label>EMAIL ADDRESS</label>
              <input placeholder="your@email.com" />
            </div>

            <div className="input-group">
              <label>PREFERRED VISIT DATE</label>
              <input placeholder="Choose your preferred date" />
            </div>

            <button className="submit-button">
              Book Site Visit
              <ArrowUpRight size={18} strokeWidth={1.7} />
            </button>
          </form>

          <div className="form-footer">
            <span>RERA APPROVED PROJECT</span>
            <span>100% SECURE ENQUIRY</span>
          </div>
        </div>
      </div>
    </section>
  );
}