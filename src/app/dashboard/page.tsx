"use client";

import { useEffect, useState } from "react";
import { authFetch, isAuthenticated } from "@/lib/auth";
import type { Lead } from "@/types";
import LeadCard from "@/components/dashboard/LeadCard";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchLeads = async () => {
    try {
      const fetcher = isAuthenticated() ? authFetch : fetch;
      const res = await fetcher("/api/leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      await authFetch(`/api/leads/${leadId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: status as Lead["status"] } : l)),
      );
    } catch {
      // Silently fail for mock data
    }
  };

  const filteredLeads =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const totalRevenue = leads.reduce((sum, l) => sum + l.budget, 0);
  const avgScore =
    leads.length > 0
      ? leads.reduce((sum, l) => sum + (l.matchScore ?? 0), 0) / leads.length
      : 0;

  return (
    <div className="relative px-6 py-10">
      <div
        className="light-leak"
        style={{ top: "-50px", left: "-100px", width: "500px", height: "500px" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
            Your{" "}
            <span className="italic text-gallery-accent">Qualified</span>{" "}
            Leads
          </h1>
          <p className="mt-2 text-sm font-light text-gallery-text-secondary">
            {isAuthenticated()
              ? "Clients matched to your style and availability."
              : "Sign in to see your real leads. Showing demo data."}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Leads", value: leads.length.toString(), accent: false },
            { label: "Qualified", value: leads.filter((l) => l.status === "QUALIFIED").length.toString(), accent: true },
            { label: "Avg Match", value: `${Math.round(avgScore * 100)}%`, accent: true },
            { label: "Pipeline Value", value: `$${totalRevenue.toLocaleString()}`, accent: false },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gallery-border bg-gallery-surface/40 px-5 py-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
                {stat.label}
              </span>
              <p className={`mt-1 font-display text-2xl font-light ${stat.accent ? "text-gallery-accent" : "text-gallery-text"}`}>
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
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wider transition-all ${
                filter === f.id
                  ? "bg-gallery-accent-muted text-gallery-accent"
                  : "text-gallery-text-muted hover:text-gallery-text-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Leads */}
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
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
