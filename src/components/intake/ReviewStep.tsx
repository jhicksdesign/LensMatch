"use client";

import type { IntakeFormData, MatchResult } from "@/types";

const STYLE_LABELS: Record<string, string> = {
  dark_moody: "Dark & Moody",
  bright_airy: "Bright & Airy",
  editorial: "Editorial",
  documentary: "Documentary",
  fine_art: "Fine Art",
  classic_timeless: "Classic & Timeless",
};

interface Props {
  data: IntakeFormData;
  results: MatchResult[] | null;
  loading: boolean;
  onNotesChange: (notes: string) => void;
}

export default function ReviewStep({
  data,
  results,
  loading,
  onNotesChange,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6">
        <h3 className="mb-4 font-display text-lg font-medium tracking-tight">
          Your Preferences
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
              Styles
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {data.selectedStyles.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-gallery-accent-muted px-3 py-1 text-xs font-medium text-gallery-accent"
                >
                  {STYLE_LABELS[s] ?? s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
              Budget
            </span>
            <p className="mt-1 font-display text-xl font-light text-gallery-accent">
              ${data.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
              Event
            </span>
            <p className="mt-1 text-sm font-light capitalize text-gallery-text">
              {data.eventType} &middot; {data.eventDate || "No date selected"}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
              Location
            </span>
            <p className="mt-1 text-sm font-light text-gallery-text">
              {data.location || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-light text-gallery-text-secondary">
          Additional Notes{" "}
          <span className="text-gallery-text-muted">(optional)</span>
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="Anything else your photographer should know..."
          className="w-full rounded-xl border border-gallery-border bg-gallery-surface/40 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all duration-300 focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20 resize-none"
        />
      </div>

      {/* Match Results */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gallery-accent/30 border-t-gallery-accent" />
          <p className="text-sm font-light text-gallery-text-secondary">
            Finding your perfect matches...
          </p>
        </div>
      )}

      {results && results.length > 0 && (
        <div>
          <h3 className="mb-4 font-display text-lg font-medium tracking-tight">
            Your Matches
          </h3>
          <div className="stagger-children space-y-3">
            {results.map((r, i) => (
              <div
                key={r.photographer_name}
                className={`rounded-2xl border p-5 transition-all duration-300 ${
                  i === 0
                    ? "border-gallery-accent/30 bg-gallery-accent-muted"
                    : "border-gallery-border bg-gallery-surface/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-display text-lg font-medium">
                        {r.photographer_name}
                      </h4>
                      {i === 0 && (
                        <span className="rounded-full bg-gallery-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gallery-bg">
                          Top Match
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-light text-gallery-text-secondary">
                      {r.message}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.styles_overlap.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-gallery-border px-2 py-0.5 text-[10px] text-gallery-text-secondary"
                        >
                          {STYLE_LABELS[s] ?? s}
                        </span>
                      ))}
                      {r.available ? (
                        <span className="rounded-full border border-gallery-success/30 px-2 py-0.5 text-[10px] text-gallery-success">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full border border-gallery-error/30 px-2 py-0.5 text-[10px] text-gallery-error">
                          Date Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score ring */}
                  <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
                    <svg className="h-14 w-14 -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gallery-border"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={`${r.match_score * 125.6} 125.6`}
                        className="text-gallery-accent"
                      />
                    </svg>
                    <span className="absolute text-xs font-medium text-gallery-accent">
                      {Math.round(r.match_score * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results && results.length === 0 && (
        <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 px-6 py-12 text-center">
          <p className="text-sm font-light text-gallery-text-secondary">
            No strong matches found for your criteria. Try adjusting your styles
            or date.
          </p>
        </div>
      )}
    </div>
  );
}
