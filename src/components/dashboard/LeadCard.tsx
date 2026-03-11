"use client";

import type { Lead } from "@/types";

const STYLE_LABELS: Record<string, string> = {
  dark_moody: "Dark & Moody",
  bright_airy: "Bright & Airy",
  editorial: "Editorial",
  documentary: "Documentary",
  fine_art: "Fine Art",
  classic_timeless: "Classic & Timeless",
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  NEW: { bg: "bg-blue-500/10", text: "text-blue-400" },
  QUALIFIED: { bg: "bg-gallery-accent-muted", text: "text-gallery-accent" },
  CONTACTED: { bg: "bg-gallery-success/10", text: "text-gallery-success" },
  BOOKED: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  DECLINED: { bg: "bg-gallery-error/10", text: "text-gallery-error" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface Props {
  lead: Lead;
  onStatusChange?: (leadId: string, status: string) => void;
}

export default function LeadCard({ lead, onStatusChange }: Props) {
  const status = STATUS_STYLES[lead.status] ?? STATUS_STYLES.NEW;
  const score = lead.matchScore ?? 0;

  return (
    <div className="group rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6 transition-all duration-300 hover:border-gallery-border-light hover:bg-gallery-surface/60">
      {/* Top row */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gallery-accent-muted font-display text-sm font-medium text-gallery-accent">
            {lead.clientName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-display text-base font-medium tracking-tight">
              {lead.clientName}
            </h3>
            <p className="text-xs font-light text-gallery-text-muted">
              {lead.clientEmail}
            </p>
          </div>
        </div>

        <div className="relative flex h-12 w-12 items-center justify-center">
          <svg className="-rotate-90 h-12 w-12" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-gallery-border" />
            <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${score * 113.1} 113.1`} className="text-gallery-accent" />
          </svg>
          <span className="absolute text-[11px] font-medium text-gallery-accent">
            {Math.round(score * 100)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">Event</span>
          <p className="mt-0.5 text-xs font-light capitalize text-gallery-text">{lead.eventType}</p>
        </div>
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">Date</span>
          <p className="mt-0.5 text-xs font-light text-gallery-text">{lead.eventDate}</p>
        </div>
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">Budget</span>
          <p className="mt-0.5 text-xs font-light text-gallery-accent">${lead.budget.toLocaleString()}</p>
        </div>
      </div>

      {/* Styles + status */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {lead.selectedStyles.map((s) => (
            <span key={s} className="rounded-full border border-gallery-border px-2 py-0.5 text-[10px] font-light text-gallery-text-secondary">
              {STYLE_LABELS[s] ?? s}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gallery-text-muted">{timeAgo(lead.createdAt)}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${status.bg} ${status.text}`}>
            {lead.status}
          </span>
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="mt-4 border-t border-gallery-border/50 pt-3">
          <p className="text-xs font-light italic leading-relaxed text-gallery-text-muted">
            &ldquo;{lead.notes}&rdquo;
          </p>
        </div>
      )}

      {/* Actions */}
      {onStatusChange && (
        <div className="mt-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {lead.status !== "BOOKED" && lead.status !== "DECLINED" && (
            <>
              {lead.status === "NEW" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(lead.id, "CONTACTED")}
                  className="flex-1 rounded-lg border border-gallery-accent/40 px-3 py-2 text-xs font-medium tracking-wider text-gallery-accent transition-all hover:bg-gallery-accent hover:text-gallery-bg"
                >
                  Contact Client
                </button>
              )}
              {lead.status === "QUALIFIED" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(lead.id, "CONTACTED")}
                  className="flex-1 rounded-lg border border-gallery-accent/40 px-3 py-2 text-xs font-medium tracking-wider text-gallery-accent transition-all hover:bg-gallery-accent hover:text-gallery-bg"
                >
                  Accept Lead
                </button>
              )}
              {lead.status === "CONTACTED" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(lead.id, "BOOKED")}
                  className="flex-1 rounded-lg border border-gallery-success/40 px-3 py-2 text-xs font-medium tracking-wider text-gallery-success transition-all hover:bg-gallery-success hover:text-white"
                >
                  Mark Booked
                </button>
              )}
              <button
                type="button"
                onClick={() => onStatusChange(lead.id, "DECLINED")}
                className="rounded-lg border border-gallery-border px-3 py-2 text-xs font-light text-gallery-text-muted transition-all hover:border-gallery-error/40 hover:text-gallery-error"
              >
                Decline
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
