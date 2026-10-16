"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playWhileVisible } from "@/lib/play-while-visible";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const pages = [
  {
    id: 1,
    chapter: "01 / 06",
    title: "The Arrival",
    subtitle: "A Grand Welcome",
    description:
      "Step into a timeless arrival experience where architecture, landscape and luxury converge.",
    image: "/images/hello.jpg",
  },
  {
    id: 2,
    chapter: "02 / 06",
    title: "Infinity Pool",
    subtitle: "Skyline Leisure",
    description:
      "An infinity-edge pool crafted for sunrise reflections and evening skyline views.",
    image: "/images/behan1.jpg",
  },
  {
    id: 3,
    chapter: "03 / 06",
    title: "Private Interiors",
    subtitle: "Designed For Elegance",
    description:
      "Italian marble, natural oak textures and bespoke lighting define every residence.",
    image: "/images/behan2.avif",
  },
  {
    id: 4,
    chapter: "04 / 06",
    title: "Wellness Pavilion",
    subtitle: "Mind • Body • Nature",
    description:
      "Yoga decks, spa rituals and meditation spaces surrounded by lush landscaping.",
    image: "/images/hello.jpg",
  },
  {
    id: 5,
    chapter: "05 / 06",
    title: "Sky Lounge",
    subtitle: "Evening Panorama",
    description:
      "A rooftop destination overlooking the city with curated luxury experiences.",
    image: "/images/behan1.jpg",
  },
  {
    id: 6,
    chapter: "06 / 06",
    title: "Clubhouse",
    subtitle: "Luxury Lives Here",
    description:
      "Cinema, café, library and entertainment spaces wrapped in contemporary architecture.",
    image: "/images/hello.jpg",
  },
];

export default function Books() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      /* ---------------- GRAND BOOK ENTRY ---------------- */

      gsap.from(bookRef.current, {
        y: 220,
        scale: 0.75,
        rotateX: -28,
        rotateZ: -4,
        opacity: 0,
        duration: 2.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      /* Heading reveal */

      gsap.from(".book-heading", {
        opacity: 0,
        y: 60,
        filter: "blur(12px)",
        stagger: 0.15,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      });

      /* Floating breathing effect */

      gsap.to(bookRef.current, {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Ambient loops only run while this section is on screen
      playWhileVisible(sectionRef.current, self);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextPage = () => {
    if (page === pages.length - 1 || flipping) return;

    setFlipping(true);

    gsap.to(pageRef.current, {
      rotateY: -180,
      duration: 0.85,
      ease: "power3.inOut",
      onComplete: () => {
        setPage((prev) => prev + 1);

        gsap.set(pageRef.current, { rotateY: 180 });

        gsap.to(pageRef.current, {
          rotateY: 0,
          duration: 0.85,
          ease: "power3.out",
          onComplete: () => setFlipping(false),
        });
      },
    });
  };

  const prevPage = () => {
    if (page === 0 || flipping) return;

    setFlipping(true);

    gsap.to(pageRef.current, {
      rotateY: 180,
      duration: 0.85,
      ease: "power3.inOut",
      onComplete: () => {
        setPage((prev) => prev - 1);

        gsap.set(pageRef.current, { rotateY: -180 });

        gsap.to(pageRef.current, {
          rotateY: 0,
          duration: 0.85,
          ease: "power3.out",
          onComplete: () => setFlipping(false),
        });
      },
    });
  };

  const current = pages[page];

  return (

    <section
  ref={sectionRef}
  className="relative bg-[#FAFAF8] py-40 overflow-hidden"
  style={{ perspective: "2200px" }}
>
  <div className="mx-auto w-[92%] max-w-[1500px]">

    {/* ---------- Top Header ---------- */}

    <div className="text-center mb-20">
  <p className="book-tag">OUR STORY</p>

  <h2 className="book-heading">
    <span>Stories Within</span>
    <span>Every Space.</span>
  </h2>

  <p className="book-description-top">
    Explore our luxury residence page by page.
  </p>
</div>

    {/* ================================================= */}
    {/* 3D BOOK */}
    {/* ================================================= */}
<div
  ref={bookRef}
  className="book-3d relative mx-auto w-[92vw] max-w-[1320px]"
>
  {/* Hardcover */}
  <div className="book-cover" />

  {/* Pages */}
  <div className="book-pages">
    <div
      ref={pageRef}
      className="book-page"
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      {/* LEFT PAGE */}
      <div className="book-left">
        <div className="book-page-top">
          <p className="book-chapter">{current.chapter}</p>

          <h3 className="book-title">{current.title}</h3>

          <p className="book-subtitle">{current.subtitle}</p>

          <p className="book-description">{current.description}</p>
        </div>

        <div className="book-divider" />

        <span className="book-collection">
          Luxury Collection
        </span>
      </div>

      {/* RIGHT PAGE */}
      <div className="book-right">
        <div className="book-image-frame">
          <Image
            src={current.image}
            alt={current.title}
            fill
            sizes="(max-width: 768px) 90vw, 45vw"
            className="book-image"
          />

          <div className="book-caption">
            <p>Featured Space</p>
            <h4>{current.title}</h4>
          </div>
        </div>

        <span className="book-page-number">
          {current.chapter}
        </span>
      </div>
    </div>
  </div>

  {/* Shadow */}
  <div className="book-shadow" />
</div>

{/* Navigation */}
<div className="book-controls">
  <button
    onClick={prevPage}
    disabled={page === 0}
    className="book-nav previous"
  >
    <ChevronLeft size={18}/>
    <span>Previous</span>
  </button>

  <div className="book-progress">
    {pages.map((_, index) => (
      <div
        key={index}
        className={`book-progress-dot ${
          index === page ? "active" : ""
        }`}
      />
    ))}
  </div>

  <button
    onClick={nextPage}
    disabled={page === pages.length - 1}
    className="book-nav next"
  >
    <span>Next</span>
    <ChevronRight size={18}/>
  </button>
</div>
    {/* Bottom Editorial Quote */}

    <div className="book-quote mt-28 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-black/35">
        Every Page. Every Detail.
      </p>

      <h3 className="mt-5 text-4xl font-light leading-tight tracking-[-0.04em] text-black md:text-6xl">
        Designed Like a Luxury
        <br />
        Coffee Table Book.
      </h3>
    </div>

  </div>
</section>
);
}