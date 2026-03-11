"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gallery-bg/80 backdrop-blur-xl border-b border-gallery-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-gallery-accent/40 transition-all duration-300 group-hover:border-gallery-accent group-hover:shadow-[0_0_16px_rgba(201,169,110,0.2)]" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-gallery-accent"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </div>
          <span className="font-display text-xl font-light tracking-wide text-gallery-text">
            Lens<span className="font-medium text-gallery-accent">Match</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm font-light tracking-wider text-gallery-text-secondary transition-colors hover:text-gallery-text"
          >
            How It Works
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-light tracking-wider text-gallery-text-secondary transition-colors hover:text-gallery-text"
          >
            Photographer Dashboard
          </Link>
          <Link
            href="/intake"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-gallery-accent/50 px-6 py-2.5 text-sm font-medium tracking-wider text-gallery-accent transition-all duration-300 hover:border-gallery-accent hover:bg-gallery-accent hover:text-gallery-bg"
          >
            Find Your Match
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Link
          href="/intake"
          className="rounded-full border border-gallery-accent/50 px-4 py-2 text-xs font-medium tracking-wider text-gallery-accent md:hidden"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
