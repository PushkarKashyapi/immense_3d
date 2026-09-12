"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-[1120px]">
      <nav className="relative flex h-16 items-center rounded-full bg-[#F4F4F4] px-3">
        {/* Left Logo */}
        <Link href="/" className="flex items-center gap-3 pl-4 z-10">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 20L10.5 4H13.5L20 20H16.8L15.2 16H8.8L7.2 20H4Z"
              fill="black"
            />
          </svg>

          <span className="text-[15px] font-semibold tracking-tight text-black">
            DevStudio
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10">
          <Link
            href="#services"
            className="text-[13px] font-medium text-[#565656] hover:text-black transition-colors duration-300"
          >
            Services
          </Link>

          <Link
            href="#products"
            className="text-[13px] font-medium text-[#565656] hover:text-black transition-colors duration-300"
          >
            Products
          </Link>

          <Link
            href="#pricing"
            className="text-[13px] font-medium text-[#565656] hover:text-black transition-colors duration-300"
          >
            Pricing
          </Link>
        </div>

        {/* Right CTA */}
        <div className="ml-auto pr-2 z-10">
          <button className="h-11 rounded-full bg-black px-7 text-[13px] font-medium text-white transition-transform duration-300 hover:scale-[1.03]">
            Book a call
          </button>
        </div>
      </nav>
    </header>
  );
}