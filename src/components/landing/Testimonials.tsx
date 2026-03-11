"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "I spent weeks browsing photographer websites before finding LensMatch. Within 48 hours, I was connected with Elena — she captured our day exactly how I dreamed it.",
    name: "Amara & David",
    event: "Brooklyn Wedding",
    photographer: "Matched with Elena Voss",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&q=80",
  },
  {
    quote:
      "The style quiz was a revelation. I didn't even know how to articulate what I wanted until LensMatch showed me the visual language. Marcus was the perfect fit.",
    name: "Priya Mehta",
    event: "Family Portrait Session",
    photographer: "Matched with Marcus Chen",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop&q=80",
  },
  {
    quote:
      "As a creative director, I'm particular about aesthetic. LensMatch understood that and paired me with a photographer whose portfolio looked like it was shot for our brand.",
    name: "Leo Fischer",
    event: "Commercial Campaign",
    photographer: "Matched with Sofia Ramirez",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop&q=80",
  },
];

export default function Testimonials() {
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
      {/* Background accent */}
      <div
        className="light-leak"
        style={{
          top: "20%",
          right: "-10%",
          width: "500px",
          height: "500px",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
            Love Letters
          </span>
          <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
            What our clients{" "}
            <span className="italic text-gallery-accent">say</span>
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card rounded-2xl border border-gallery-border bg-gallery-surface/40 p-8"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {/* Preview image */}
              <div className="mb-6 overflow-hidden rounded-lg">
                <img
                  src={t.image}
                  alt={`${t.name} session`}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Quote */}
              <blockquote className="mb-6 font-body text-sm font-light leading-[1.8] text-gallery-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="border-t border-gallery-border pt-4">
                <p className="font-display text-base font-medium tracking-tight text-gallery-text">
                  {t.name}
                </p>
                <p className="mt-0.5 text-[11px] font-light text-gallery-text-muted">
                  {t.event}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-light text-gallery-accent">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-3 w-3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {t.photographer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
