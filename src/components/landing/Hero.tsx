"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&q=85",
    alt: "Bride in golden light",
    style: "Bright & Airy",
    photographer: "Sofia Ramirez",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop&q=85",
    alt: "Wedding ceremony moment",
    style: "Documentary",
    photographer: "Marcus Chen",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=900&fit=crop&q=85",
    alt: "Editorial fashion portrait",
    style: "Editorial",
    photographer: "Elena Voss",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=700&fit=crop&q=85",
    alt: "Natural light portrait",
    style: "Fine Art",
    photographer: "James Whitfield",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop&q=85",
    alt: "Couple in dramatic light",
    style: "Dark & Moody",
    photographer: "Elena Voss",
  },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background ambient wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(166,124,61,0.045) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 items-center gap-8 px-6 py-24 lg:grid-cols-2 lg:gap-12 lg:py-0">
        {/* Left — Typography */}
        <div className="order-2 lg:order-1">
          {/* Overline */}
          <div
            className={`mb-6 flex items-center gap-3 transition-all duration-1000 ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="h-[1px] w-10 bg-gallery-accent/50" />
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
              Boutique Photography Matchmaking
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`mb-6 transition-all duration-1000 ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <span className="block font-display text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              Your Vision,
            </span>
            <span className="mt-1 block font-display text-5xl font-light italic leading-[1.05] tracking-tight text-gallery-accent sm:text-6xl xl:text-7xl">
              Perfectly Matched
            </span>
          </h1>

          {/* Subhead */}
          <p
            className={`mb-10 max-w-lg font-body text-base font-light leading-[1.8] text-gallery-text-secondary transition-all duration-1000 sm:text-lg ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            Stop scrolling through hundreds of portfolios. Tell us your
            aesthetic, and we&apos;ll connect you with photographers who see the
            world the way you do.
          </p>

          {/* CTA */}
          <div
            className={`flex flex-wrap items-center gap-5 transition-all duration-1000 ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <Link
              href="/intake"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gallery-accent px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover hover:shadow-[0_0_40px_rgba(166,124,61,0.25)]"
            >
              Start Your Match
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#portfolio"
              className="inline-flex items-center gap-2 text-sm font-light tracking-wider text-gallery-text-secondary transition-colors hover:text-gallery-text"
            >
              View Work
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className={`mt-16 flex flex-wrap gap-10 border-t border-gallery-border pt-8 transition-all duration-1000 ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            {[
              { num: "200+", label: "Vetted Photographers" },
              { num: "96%", label: "Match Satisfaction" },
              { num: "48hr", label: "Avg. Response" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="block font-display text-3xl font-light text-gallery-accent">
                  {stat.num}
                </span>
                <span className="mt-1 block text-[11px] font-light uppercase tracking-[0.15em] text-gallery-text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Image Mosaic */}
        <div className="order-1 lg:order-2">
          <div
            className={`grid grid-cols-6 grid-rows-6 gap-2 transition-all duration-[1.5s] sm:gap-3 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            }`}
            style={{
              transitionDelay: "300ms",
              height: "min(75vh, 680px)",
            }}
          >
            {/* Large hero image — spans 4 cols, 4 rows */}
            <div
              className="hero-image-cell col-span-4 row-span-4"
              style={{ animationDelay: "0.1s" }}
            >
              <img
                src={HERO_IMAGES[0].src}
                alt={HERO_IMAGES[0].alt}
                loading="eager"
              />
              <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/80 px-3 py-1 shadow-sm backdrop-blur-sm">
                <span className="text-[10px] font-light tracking-wider text-gallery-text">
                  {HERO_IMAGES[0].style} &middot; {HERO_IMAGES[0].photographer}
                </span>
              </div>
            </div>

            {/* Top-right tall image — 2 cols, 3 rows */}
            <div className="hero-image-cell col-span-2 row-span-3">
              <img
                src={HERO_IMAGES[2].src}
                alt={HERO_IMAGES[2].alt}
                loading="eager"
              />
            </div>

            {/* Bottom-right small — 2 cols, 3 rows */}
            <div className="hero-image-cell col-span-2 row-span-3">
              <img
                src={HERO_IMAGES[1].src}
                alt={HERO_IMAGES[1].alt}
                loading="eager"
              />
            </div>

            {/* Bottom-left wide — 2 cols, 2 rows */}
            <div className="hero-image-cell col-span-2 row-span-2">
              <img
                src={HERO_IMAGES[3].src}
                alt={HERO_IMAGES[3].alt}
                loading="lazy"
              />
            </div>

            {/* Bottom-center — 2 cols, 2 rows */}
            <div className="hero-image-cell col-span-2 row-span-2">
              <img
                src={HERO_IMAGES[4].src}
                alt={HERO_IMAGES[4].alt}
                loading="lazy"
              />
              <div className="absolute bottom-2 right-2 z-10 rounded-full bg-white/80 px-2 py-0.5 shadow-sm backdrop-blur-sm">
                <span className="text-[10px] font-light text-gallery-text">
                  {HERO_IMAGES[4].style}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1.4s" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-gallery-text-muted">
            Scroll
          </span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-gallery-accent/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
