"use client";

import { useEffect, useRef, useState } from "react";

const PHOTOGRAPHERS = [
  {
    name: "Elena Voss",
    specialty: "Dark & Moody / Editorial",
    location: "Brooklyn, NY",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&q=80",
    rating: 4.9,
    bookings: 142,
  },
  {
    name: "Marcus Chen",
    specialty: "Bright & Airy / Documentary",
    location: "Manhattan, NY",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&q=80",
    rating: 4.8,
    bookings: 98,
  },
  {
    name: "Sofia Ramirez",
    specialty: "Editorial / Fine Art",
    location: "Williamsburg, NY",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&q=80",
    rating: 4.7,
    bookings: 116,
  },
  {
    name: "James Whitfield",
    specialty: "Classic & Timeless",
    location: "Upper East Side, NY",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80",
    rating: 4.9,
    bookings: 187,
  },
];

export default function FeaturedPhotographers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header row */}
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-block font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
              Featured Creatives
            </span>
            <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
              Meet the{" "}
              <span className="italic text-gallery-accent">artists</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-gallery-text-secondary">
            Each photographer brings a distinct voice. We match you to the one
            whose vision mirrors yours.
          </p>
        </div>

        {/* Photographer grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHOTOGRAPHERS.map((ph, i) => (
            <div
              key={ph.name}
              className="photographer-card group cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="aspect-[3/4] w-full">
                <img
                  src={ph.image}
                  alt={ph.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="overlay" />

              {/* Info block */}
              <div className="info absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl font-medium tracking-tight text-white">
                  {ph.name}
                </h3>
                <p className="mt-1 text-xs font-light tracking-wider text-white/60">
                  {ph.specialty}
                </p>

                {/* Expanded info on hover */}
                <div className="mt-3 flex items-center gap-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="flex items-center gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3 w-3 text-gallery-accent"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-[11px] font-light text-white/80">
                      {ph.rating}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/40">|</span>
                  <span className="text-[11px] font-light text-white/60">
                    {ph.bookings} bookings
                  </span>
                  <span className="text-[10px] text-white/40">|</span>
                  <span className="text-[11px] font-light text-white/60">
                    {ph.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
