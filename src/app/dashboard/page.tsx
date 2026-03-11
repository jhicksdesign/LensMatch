"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lead } from "@/types";
import LeadCard from "@/components/dashboard/LeadCard";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        setLeads(data.leads ?? []);
      } catch {
        // Fallback mock data
        setLeads([
          {
            id: "lead_001",
            clientName: "Amara Johnson",
            clientEmail: "amara@example.com",
            eventType: "wedding",
            selectedStyles: ["dark_moody", "editorial"],
            budget: 3500,
            eventDate: "2026-06-14",
            location: "Brooklyn, NY",
            notes: "Intimate ceremony, 80 guests. Love dramatic lighting.",
            matchScore: 0.94,
            status: "QUALIFIED",
            createdAt: "2026-03-08T14:30:00Z",
          },
          {
            id: "lead_002",
            clientName: "David Park",
            clientEmail: "david.p@example.com",
            eventType: "portrait",
            selectedStyles: ["fine_art", "editorial"],
            budget: 1200,
            eventDate: "2026-05-03",
            location: "Manhattan, NY",
            notes: "Executive headshots for a creative agency rebrand.",
            matchScore: 0.87,
            status: "QUALIFIED",
            createdAt: "2026-03-09T09:15:00Z",
          },
          {
            id: "lead_003",
            clientName: "Priya Mehta",
            clientEmail: "priya.m@example.com",
            eventType: "wedding",
            selectedStyles: ["bright_airy", "classic_timeless"],
            budget: 5000,
            eventDate: "2026-07-19",
            location: "Hudson Valley, NY",
            notes: "Outdoor garden wedding, golden hour ceremony.",
            matchScore: 0.78,
            status: "NEW",
            createdAt: "2026-03-10T11:45:00Z",
          },
          {
            id: "lead_004",
            clientName: "Leo Fischer",
            clientEmail: "leo.f@example.com",
            eventType: "commercial",
            selectedStyles: ["editorial", "dark_moody"],
            budget: 2800,
            eventDate: "2026-05-17",
            location: "SoHo, NY",
            notes: "Product shoot for luxury watch brand. Need cinematic feel.",
            matchScore: 0.91,
            status: "CONTACTED",
            createdAt: "2026-03-07T16:20:00Z",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const totalRevenue = leads.reduce((sum, l) => sum + l.budget, 0);
  const avgScore =
    leads.length > 0
      ? leads.reduce((sum, l) => sum + (l.matchScore ?? 0), 0) / leads.length
      : 0;

  return (
    <main className="relative min-h-screen">
      {/* Background accents */}
      <div
        className="light-leak"
        style={{ top: "-50px", left: "-100px", width: "500px", height: "500px" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="border-b border-gallery-border/50 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-light tracking-wide text-gallery-text"
          >
            Lens<span className="font-medium text-gallery-accent">Match</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gallery-accent-muted font-display text-xs font-medium text-gallery-accent">
              EV
            </div>
            <span className="text-sm font-light text-gallery-text-secondary">
              Elena Voss
            </span>
          </div>
        </div>
      </header>

      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Page title */}
          <div className="mb-10">
            <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
              Your{" "}
              <span className="italic text-gallery-accent">Qualified</span>{" "}
              Leads
            </h1>
            <p className="mt-2 text-sm font-light text-gallery-text-secondary">
              Only clients who passed budget and style matching appear here.
            </p>
          </div>

          {/* Stats bar */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Leads",
                value: leads.length.toString(),
                accent: false,
              },
              {
                label: "Qualified",
                value: leads
                  .filter((l) => l.status === "QUALIFIED")
                  .length.toString(),
                accent: true,
              },
              {
                label: "Avg Match",
                value: `${Math.round(avgScore * 100)}%`,
                accent: true,
              },
              {
                label: "Pipeline Value",
                value: `$${totalRevenue.toLocaleString()}`,
                accent: false,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gallery-border bg-gallery-surface/40 px-5 py-4"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
                  {stat.label}
                </span>
                <p
                  className={`mt-1 font-display text-2xl font-light ${
                    stat.accent ? "text-gallery-accent" : "text-gallery-text"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto">
            {[
              { id: "all", label: "All" },
              { id: "NEW", label: "New" },
              { id: "QUALIFIED", label: "Qualified" },
              { id: "CONTACTED", label: "Contacted" },
              { id: "BOOKED", label: "Booked" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                  filter === f.id
                    ? "bg-gallery-accent-muted text-gallery-accent"
                    : "text-gallery-text-muted hover:text-gallery-text-secondary"
                }`}
              >
                {f.label}
                {f.id !== "all" && (
                  <span className="ml-1.5 text-gallery-text-muted">
                    {leads.filter((l) =>
                      f.id === "all" ? true : l.status === f.id,
                    ).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Lead grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gallery-accent/30 border-t-gallery-accent" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-gallery-border bg-gallery-surface/20">
              <p className="text-sm font-light text-gallery-text-muted">
                No leads matching this filter.
              </p>
            </div>
          ) : (
            <div className="stagger-children grid gap-4 lg:grid-cols-2">
              {filteredLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
