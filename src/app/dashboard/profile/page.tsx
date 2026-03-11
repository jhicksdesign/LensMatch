"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch, isAuthenticated } from "@/lib/auth";
import type { PhotographyStyle } from "@/types";

const STYLE_OPTIONS: { id: PhotographyStyle; label: string }[] = [
  { id: "dark_moody", label: "Dark & Moody" },
  { id: "bright_airy", label: "Bright & Airy" },
  { id: "editorial", label: "Editorial" },
  { id: "documentary", label: "Documentary" },
  { id: "fine_art", label: "Fine Art" },
  { id: "classic_timeless", label: "Classic & Timeless" },
];

const MONTHS_AHEAD = 4;

function generateDateGrid() {
  const dates: string[] = [];
  const now = new Date();
  for (let m = 1; m <= MONTHS_AHEAD; m++) {
    const year = now.getFullYear();
    const month = now.getMonth() + m;
    for (let w = 0; w < 5; w++) {
      const d = new Date(year, month, w * 7 + 1);
      // Use Saturdays and Sundays
      const sat = new Date(d);
      sat.setDate(d.getDate() + (6 - d.getDay()));
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);
      const satStr = sat.toISOString().split("T")[0];
      const sunStr = sun.toISOString().split("T")[0];
      if (!dates.includes(satStr)) dates.push(satStr);
      if (!dates.includes(sunStr)) dates.push(sunStr);
    }
  }
  return [...new Set(dates)].sort();
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [styles, setStyles] = useState<PhotographyStyle[]>([]);
  const [minBudget, setMinBudget] = useState(500);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [photoCount, setPhotoCount] = useState(0);

  const possibleDates = generateDateGrid();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    async function load() {
      try {
        const res = await authFetch("/api/auth/me");
        const data = await res.json();
        const ph = data.photographer;
        setName(ph.name || "");
        setBio(ph.bio || "");
        setLocation(ph.location || "");
        setStyles(ph.styles || []);
        setMinBudget(ph.min_budget || 500);
        setAvailableDates(ph.available_dates || []);
        setPhotoCount(ph.photo_count || 0);
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const toggleStyle = (id: PhotographyStyle) => {
    setStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleDate = (date: string) => {
    setAvailableDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await authFetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          name,
          bio,
          location,
          styles,
          min_budget: minBudget,
          available_dates: availableDates,
        }),
      });
      if (res.ok) setSuccess(true);
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gallery-accent/30 border-t-gallery-accent" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-light tracking-tight">
          Edit <span className="italic text-gallery-accent">Profile</span>
        </h1>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic info */}
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6">
            <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-light text-gallery-text-secondary">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-light text-gallery-text-secondary">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-light text-gallery-text-secondary">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-light text-gallery-text-secondary">
                    Min. Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gallery-text-muted">$</span>
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
            </div>
          </div>

          {/* Styles */}
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6">
            <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
              Your Styles
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStyle(s.id)}
                  className={`rounded-xl border px-4 py-3 text-xs font-medium tracking-wider transition-all ${
                    styles.includes(s.id)
                      ? "border-gallery-accent/50 bg-gallery-accent-muted text-gallery-accent"
                      : "border-gallery-border text-gallery-text-muted hover:border-gallery-border-light"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                Availability
              </h2>
              <span className="text-[10px] text-gallery-text-muted">
                {availableDates.length} dates selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {possibleDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => toggleDate(date)}
                  className={`rounded-lg border px-3 py-1.5 text-[11px] font-light transition-all ${
                    availableDates.includes(date)
                      ? "border-gallery-accent/40 bg-gallery-accent-muted text-gallery-accent"
                      : "border-gallery-border text-gallery-text-muted hover:border-gallery-border-light"
                  }`}
                >
                  {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio link */}
          <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
                  Portfolio
                </h2>
                <p className="mt-1 text-sm font-light text-gallery-text-secondary">
                  {photoCount} of 20 photos uploaded
                </p>
              </div>
              <a
                href="/dashboard/portfolio"
                className="rounded-lg border border-gallery-accent/40 px-4 py-2 text-xs font-medium tracking-wider text-gallery-accent transition-all hover:bg-gallery-accent hover:text-gallery-bg"
              >
                Manage Photos
              </a>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gallery-accent px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-gallery-bg transition-all hover:bg-gallery-accent-hover disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {success && (
              <span className="text-sm font-light text-gallery-success">
                Profile saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
