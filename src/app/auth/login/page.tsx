"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      setAuth(data.token, data.photographer);
      router.push("/dashboard");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      {/* Background accent */}
      <div
        className="light-leak"
        style={{ top: "-100px", right: "-50px", width: "400px", height: "400px" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-12 block text-center">
          <span className="font-display text-2xl font-light tracking-wide text-gallery-text">
            Lens<span className="font-medium text-gallery-accent">Match</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-light tracking-tight">
              Welcome <span className="italic text-gallery-accent">back</span>
            </h1>
            <p className="mt-2 text-sm font-light text-gallery-text-secondary">
              Sign in to your photographer dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-light text-gallery-text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-gallery-accent hover:text-gallery-accent-hover"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
