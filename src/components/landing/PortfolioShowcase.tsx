"use client";

import { useEffect, useRef, useState } from "react";

const PORTFOLIO_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1000&fit=crop&q=80",
    label: "Classic & Timeless",
    photographer: "James Whitfield",
    cols: "col-span-4",
    rows: "row-span-3",
  },
  {
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=800&fit=crop&q=80",
    label: "Bright & Airy",
    photographer: "Sofia Ramirez",
    cols: "col-span-4",
    rows: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&q=80",
    label: "Fine Art",
    photographer: "Elena Voss",
    cols: "col-span-4",
    rows: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1513807016779-d51c0c026263?w=800&h=600&fit=crop&q=80",
    label: "Editorial",
    photographer: "Elena Voss",
    cols: "col-span-5",
    rows: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&h=900&fit=crop&q=80",
    label: "Documentary",
    photographer: "Marcus Chen",
    cols: "col-span-3",
    rows: "row-span-3",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&q=80",
    label: "Dark & Moody",
    photographer: "James Whitfield",
    cols: "col-span-4",
    rows: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=500&fit=crop&q=80",
    label: "Classic & Timeless",
    photographer: "Marcus Chen",
    cols: "col-span-5",
    rows: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=600&h=800&fit=crop&q=80",
    label: "Fine Art",
    photographer: "Sofia Ramirez",
    cols: "col-span-4",
    rows: "row-span-3",
  },
];

export default function PortfolioShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="portfolio" className="relative py-24 px-6 sm:py-32">
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-6xl text-center">
        <span className="mb-4 inline-block font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
          Our Network
        </span>
        <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
          Work that speaks{" "}
          <span className="italic text-gallery-accent">for itself</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-gallery-text-secondary">
          Every photographer in our network is hand-vetted. Here&apos;s a glimpse of
          the caliber you&apos;ll be matched with.
        </p>
      </div>

      {/* Bento grid */}
      <div className="mx-auto max-w-6xl">
        <div className="bento-grid">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`bento-item ${item.cols} ${item.rows} transition-all duration-1000`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <img src={item.src} alt={item.label} loading="lazy" />
              <div className="bento-label">
                <span className="block font-display text-sm font-medium text-white">
                  {item.label}
                </span>
                <span className="text-[10px] font-light tracking-wider text-white/60">
                  by {item.photographer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
