"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuth } from "@/lib/auth";
import type { PhotographyStyle } from "@/types";

const STYLE_OPTIONS: {
  id: PhotographyStyle;
  label: string;
  gradient: string;
}[] = [
  { id: "dark_moody", label: "Dark & Moody", gradient: "from-neutral-950 via-neutral-900 to-amber-950" },
  { id: "bright_airy", label: "Bright & Airy", gradient: "from-sky-100 via-rose-50 to-amber-50" },
  { id: "editorial", label: "Editorial", gradient: "from-zinc-900 via-stone-800 to-zinc-900" },
  { id: "documentary", label: "Documentary", gradient: "from-stone-900 via-stone-800 to-stone-900" },
  { id: "fine_art", label: "Fine Art", gradient: "from-purple-950 via-indigo-950 to-slate-900" },
  { id: "classic_timeless", label: "Classic & Timeless", gradient: "from-amber-950 via-stone-900 to-neutral-900" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 0: Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Step 1: Profile
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [styles, setStyles] = useState<PhotographyStyle[]>([]);
  const [minBudget, setMinBudget] = useState(500);

  const [token, setToken] = useState("");

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      setAuth(data.token, data.photographer);
      setToken(data.token);
      setStep(1);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          location,
          styles,
          min_budget: minBudget,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to save profile");
        return;
      }

      setStep(2);
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStyle = (id: PhotographyStyle) => {
    setStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div
        className="light-leak"
        style={{ top: "-50px", left: "-100px", width: "500px", height: "500px" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-10 block text-center">
          <span className="font-display text-2xl font-light tracking-wide text-gallery-text">
            Lens<span className="font-medium text-gallery-accent">Match</span>
          </span>
        </Link>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {["Account", "Profile", "Ready"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition-all ${
                  i < step
                    ? "bg-gallery-accent/20 text-gallery-accent"
                    : i === step
                      ? "bg-gallery-accent text-gallery-bg"
                      : "bg-gallery-border text-gallery-text-muted"
                }`}
              >
                {i < step ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="hidden text-[11px] font-light tracking-wider text-gallery-text-muted sm:inline">
                {label}
              </span>
              {i < 2 && (
                <div className="mx-1 h-[1px] w-6 bg-gallery-border sm:w-10" />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Create Account */}
        {step === 0 && (
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-light tracking-tight">
                Join as a{" "}
                <span className="italic text-gallery-accent">photographer</span>
              </h1>
              <p className="mt-2 text-sm font-light text-gallery-text-secondary">
                Create your account to start receiving style-matched leads.
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                  placeholder="Min. 8 characters"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-gallery-error/30 bg-gallery-error/5 px-4 py-3 text-xs text-gallery-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gallery-accent py-3.5 text-sm font-medium uppercase tracking-wider text-gallery-bg transition-all hover:bg-gallery-accent-hover disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-light text-gallery-text-muted">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-gallery-accent hover:text-gallery-accent-hover"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* Step 1: Profile Setup */}
        {step === 1 && (
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-light tracking-tight">
                Your{" "}
                <span className="italic text-gallery-accent">creative profile</span>
              </h1>
              <p className="mt-2 text-sm font-light text-gallery-text-secondary">
                Tell clients what you shoot and how you see the world.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Styles */}
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                  Your Styles
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {STYLE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStyle(s.id)}
                      className={`relative overflow-hidden rounded-xl border px-3 py-4 text-center transition-all duration-300 ${
                        styles.includes(s.id)
                          ? "border-gallery-accent/50 bg-gallery-accent-muted"
                          : "border-gallery-border bg-gallery-bg/40 hover:border-gallery-border-light"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-20`}
                      />
                      <span className="relative text-xs font-medium tracking-wider text-gallery-text">
                        {s.label}
                      </span>
                      {styles.includes(s.id) && (
                        <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gallery-accent">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5 text-gallery-bg">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20 resize-none"
                  placeholder="Tell clients about your approach and what makes your work unique..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                    Min. Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gallery-text-muted">
                      $
                    </span>
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      min={500}
                      step={100}
                      className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 pl-8 pr-4 py-3 text-sm font-light text-gallery-text outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-gallery-error/30 bg-gallery-error/5 px-4 py-3 text-xs text-gallery-error">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border border-gallery-border py-3.5 text-sm font-light text-gallery-text-secondary transition-all hover:border-gallery-border-light"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={loading || styles.length === 0}
                  className="flex-1 rounded-xl bg-gallery-accent py-3.5 text-sm font-medium uppercase tracking-wider text-gallery-bg transition-all hover:bg-gallery-accent-hover disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Done */}
        {step === 2 && (
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gallery-accent-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-gallery-accent">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="mb-3 font-display text-3xl font-light tracking-tight">
              You&apos;re <span className="italic text-gallery-accent">in</span>
            </h1>
            <p className="mb-8 text-sm font-light text-gallery-text-secondary">
              Your account is live. Upload your portfolio to start receiving
              style-matched leads.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gallery-accent px-6 py-3.5 text-sm font-medium uppercase tracking-wider text-gallery-bg transition-all hover:bg-gallery-accent-hover"
              >
                Upload Portfolio
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-gallery-border px-6 py-3.5 text-sm font-light text-gallery-text-secondary transition-all hover:border-gallery-border-light"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
