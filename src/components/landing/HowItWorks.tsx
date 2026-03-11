"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    num: "01",
    title: "Define Your Aesthetic",
    description:
      "Choose from curated visual styles — dark & moody, bright & airy, editorial, and more. No guesswork, just pure visual language.",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=350&fit=crop&q=80",
    imageAlt: "Photography style selection",
  },
  {
    num: "02",
    title: "Set Your Parameters",
    description:
      "Budget, date, event type — our system filters out mismatches before they happen. No awkward conversations about pricing.",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&h=350&fit=crop&q=80",
    imageAlt: "Camera and photography setup",
  },
  {
    num: "03",
    title: "Get Matched",
    description:
      "Our algorithm scores compatibility across aesthetics, availability, and budget. You see only photographers who truly fit.",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&h=350&fit=crop&q=80",
    imageAlt: "Photographer at work",
  },
];

export default function HowItWorks() {
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
    <section ref={sectionRef} id="how-it-works" className="relative py-24 px-6 sm:py-32">
      {/* Cinematic divider */}
      <hr className="cinematic-hr mx-auto mb-20 max-w-md" />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-20 text-center">
          <span className="mb-4 inline-block font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
            The Process
          </span>
          <h2 className="font-display text-4xl font-light tracking-tight sm:text-5xl">
            Three steps to your
            <br />
            <span className="italic text-gallery-accent">perfect match</span>
          </h2>
        </div>

        {/* Steps — alternating image/text layout */}
        <div className="space-y-20 lg:space-y-28">
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 0;

            return (
              <div
                key={step.num}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
                  transitionDelay: `${i * 200}ms`,
                }}
              >
                {/* Image side */}
                <div
                  className={`relative overflow-hidden rounded-xl ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="h-64 w-full object-cover sm:h-80 lg:h-96"
                    loading="lazy"
                  />
                  {/* Number overlay on image */}
                  <div className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-sm">
                    <span className="font-display text-lg font-light text-gallery-accent">
                      {step.num}
                    </span>
                  </div>
                  {/* Light-leak on image */}
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Text side */}
                <div
                  className={`${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <span className="mb-2 block font-display text-5xl font-light text-gallery-accent/15">
                    {step.num}
                  </span>
                  <h3 className="mb-4 font-display text-2xl font-medium tracking-tight sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="max-w-md font-body text-base font-light leading-[1.8] text-gallery-text-secondary">
                    {step.description}
                  </p>

                  {/* Decorative line */}
                  <div className="mt-6 h-[1px] w-16 bg-gallery-accent/30" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
