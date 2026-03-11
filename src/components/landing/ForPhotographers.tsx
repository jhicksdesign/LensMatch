"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PERKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: "Pre-Qualified Leads Only",
    description:
      "Clients must meet your minimum budget and match your style before they ever reach your inbox.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    title: "Portfolio That Works For You",
    description:
      "Upload your 20 best shots. Our algorithm uses them to match clients who love your specific aesthetic.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Zero Time Wasted",
    description:
      "No more back-and-forth on pricing or style. Every lead that reaches you has already passed your guardrails.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Style-First Matching",
    description:
      "Clients choose aesthetics visually — dark & moody, editorial, bright & airy — and we match them to you.",
  },
];

export default function ForPhotographers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="for-photographers" className="relative py-24 px-6 sm:py-32">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(166,124,61,0.02) 30%, rgba(166,124,61,0.02) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — copy + perks */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "100ms",
            }}
          >
            <span className="mb-4 inline-block font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
              For Photographers
            </span>
            <h2 className="mb-4 font-display text-4xl font-light tracking-tight sm:text-5xl">
              Stop chasing leads.
              <br />
              <span className="italic text-gallery-accent">Let them find you.</span>
            </h2>
            <p className="mb-10 max-w-lg text-base font-light leading-[1.8] text-gallery-text-secondary">
              Join a curated network of photographers who receive pre-qualified,
              style-matched clients — no bidding wars, no price shoppers, no
              wasted consultations.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {PERKS.map((perk, i) => (
                <div
                  key={perk.title}
                  className="group"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${300 + i * 100}ms`,
                  }}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gallery-border text-gallery-text-muted transition-colors group-hover:border-gallery-accent/30 group-hover:text-gallery-accent">
                      {perk.icon}
                    </div>
                    <h3 className="text-sm font-medium tracking-tight text-gallery-text">
                      {perk.title}
                    </h3>
                  </div>
                  <p className="pl-11 text-xs font-light leading-relaxed text-gallery-text-muted">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — signup CTA card */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "200ms",
            }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-gallery-border bg-gallery-surface/60 p-8 sm:p-10">
              {/* Corner accents */}
              <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-gallery-accent/15" />
              <div className="absolute right-4 top-4 h-8 w-8 border-r border-t border-gallery-accent/15" />
              <div className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-gallery-accent/15" />
              <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-gallery-accent/15" />

              {/* Background image peek */}
              <div className="absolute -right-20 -top-20 h-64 w-64 opacity-[0.04]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-gallery-accent">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>

              <div className="relative">
                <h3 className="mb-2 font-display text-2xl font-light tracking-tight sm:text-3xl">
                  Join the{" "}
                  <span className="italic text-gallery-accent">network</span>
                </h3>
                <p className="mb-8 text-sm font-light leading-relaxed text-gallery-text-secondary">
                  Create your profile in under 5 minutes. Upload your portfolio,
                  set your rates and availability, and start receiving
                  style-matched leads.
                </p>

                {/* Quick stats */}
                <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-gallery-border bg-gallery-bg/40 p-4">
                  {[
                    { value: "Free", label: "To join" },
                    { value: "20", label: "Portfolio shots" },
                    { value: "96%", label: "Match rate" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <span className="block font-display text-xl font-light text-gallery-accent">
                        {stat.value}
                      </span>
                      <span className="text-[10px] font-light uppercase tracking-wider text-gallery-text-muted">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <Link
                  href="/auth/signup"
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gallery-accent py-4 text-sm font-medium uppercase tracking-[0.15em] text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover hover:shadow-[0_0_30px_rgba(166,124,61,0.2)]"
                >
                  Create Photographer Account
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
                  href="/auth/login"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-gallery-border py-3.5 text-xs font-light tracking-wider text-gallery-text-secondary transition-all hover:border-gallery-border-light hover:text-gallery-text"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
