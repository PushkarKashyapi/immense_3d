"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const links = [
  "Home",
  "Amenities",
  "Master Plan",
  "Gallery",
  "Location",
  "Contact",
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-item", {
        opacity: 0,
        y: 60,
        filter: "blur(10px)",
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 82%",
        },
      });

      gsap.from(".footer-link", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-links",
          start: "top 88%",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="luxury-footer">
      <div className="footer-container">

        {/* Top CTA */}

        <div className="footer-top footer-item">
          <p className="footer-label">PURAVANKARA LUXURY RESIDENCES</p>

          <h2 className="footer-heading">
            Lets Build Your
            <br />
            Next Address.
          </h2>

          <button className="footer-cta">
            Book A Private Visit
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Divider */}

        <div className="footer-divider footer-item" />

        {/* Middle */}

        <div className="footer-middle">

          {/* Brand */}

          <div className="footer-brand footer-item">
            <h3>PURAVANKARA</h3>

            <p>
              Luxury residences crafted with timeless architecture, curated
              landscapes and world-class amenities for elevated living.
            </p>
          </div>

          {/* Navigation */}

          <div className="footer-links footer-item">
            {links.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "")}`} className="footer-link">
                {item}
              </a>
            ))}
          </div>

          {/* Contact */}

          <div className="footer-contact footer-item">

            <div className="contact-row">
              <MapPin size={18} strokeWidth={1.6} />
              <span>Bengaluru, Karnataka, India</span>
            </div>

            <div className="contact-row">
              <Phone size={18} strokeWidth={1.6} />
              <span>+91 98765 43210</span>
            </div>

            <div className="contact-row">
              <Mail size={18} strokeWidth={1.6} />
              <span>sales@puravankara.com</span>
            </div>

            <div className="footer-socials">
             
            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="footer-bottom footer-item">
          <span>© 2026 Puravankara. All Rights Reserved.</span>

          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}