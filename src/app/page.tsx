import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PortfolioShowcase from "@/components/landing/PortfolioShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedPhotographers from "@/components/landing/FeaturedPhotographers";
import Testimonials from "@/components/landing/Testimonials";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Portfolio showcase — the visual proof */}
      <PortfolioShowcase />

      {/* Cinematic divider */}
      <div className="mx-auto max-w-xs">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gallery-accent/20 to-transparent" />
      </div>

      <FeaturedPhotographers />
      <HowItWorks />
      <Testimonials />

      {/* Final CTA — with background image */}
      <section className="relative mx-6 mb-16 overflow-hidden rounded-2xl sm:mx-8 lg:mx-auto lg:max-w-6xl">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=600&fit=crop&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gallery-bg/95 via-gallery-bg/80 to-gallery-bg/95" />

        <div className="relative z-10 px-8 py-20 text-center sm:px-16 sm:py-28">
          {/* Corner accents */}
          <div className="absolute left-6 top-6 h-10 w-10 border-l border-t border-gallery-accent/20" />
          <div className="absolute right-6 top-6 h-10 w-10 border-r border-t border-gallery-accent/20" />
          <div className="absolute bottom-6 left-6 h-10 w-10 border-b border-l border-gallery-accent/20" />
          <div className="absolute bottom-6 right-6 h-10 w-10 border-b border-r border-gallery-accent/20" />

          <span className="mb-4 inline-block font-body text-[11px] font-medium uppercase tracking-[0.3em] text-gallery-accent">
            Ready?
          </span>
          <h2 className="mb-4 font-display text-3xl font-light tracking-tight sm:text-5xl">
            Find your{" "}
            <span className="italic text-gallery-accent">photographer</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg font-body text-sm font-light leading-relaxed text-gallery-text-secondary">
            It takes less than 3 minutes. No commitment, no spam — just a
            curated connection with someone who matches your vision.
          </p>
          <Link
            href="/intake"
            className="group inline-flex items-center gap-3 rounded-full bg-gallery-accent px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover hover:shadow-[0_0_40px_rgba(201,169,110,0.25)]"
          >
            Begin Your Match
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gallery-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <span className="font-display text-base font-light tracking-wide text-gallery-text-muted">
            Lens<span className="text-gallery-accent">Match</span>
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-xs font-light tracking-wider text-gallery-text-muted transition-colors hover:text-gallery-text-secondary"
            >
              How It Works
            </Link>
            <Link
              href="#portfolio"
              className="text-xs font-light tracking-wider text-gallery-text-muted transition-colors hover:text-gallery-text-secondary"
            >
              Portfolio
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-light tracking-wider text-gallery-text-muted transition-colors hover:text-gallery-text-secondary"
            >
              For Photographers
            </Link>
          </div>
          <span className="text-[11px] font-light text-gallery-text-muted">
            &copy; {new Date().getFullYear()} LensMatch. Crafted with intention.
          </span>
        </div>
      </footer>
    </main>
  );
}
