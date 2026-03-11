"use client";

import { useState } from "react";

const BUDGET_MIN = 500;
const BUDGET_MAX = 10000;
const BUDGET_STEP = 100;

const TIERS = [
  { min: 500, max: 1500, label: "Essential", desc: "Perfect for portraits & mini sessions" },
  { min: 1500, max: 3500, label: "Premium", desc: "Ideal for events & extended shoots" },
  { min: 3500, max: 6000, label: "Luxury", desc: "Full-day coverage & editorial projects" },
  { min: 6000, max: 10000, label: "Bespoke", desc: "Multi-day & destination work" },
];

function getTier(budget: number) {
  return TIERS.find((t) => budget >= t.min && budget <= t.max) ?? TIERS[TIERS.length - 1];
}

interface Props {
  budget: number;
  onBudgetChange: (budget: number) => void;
}

export default function BudgetStep({ budget, onBudgetChange }: Props) {
  const [touched, setTouched] = useState(false);
  const tier = getTier(budget);
  const belowMin = budget < BUDGET_MIN;
  const percentage = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <div>
      <p className="mb-8 text-sm font-light text-gallery-text-secondary">
        Set your investment range. This helps us match you with photographers
        whose pricing aligns with your expectations.
      </p>

      {/* Budget display */}
      <div className="mb-10 text-center">
        <div className="mb-2 font-display text-6xl font-light tracking-tight text-gallery-accent">
          ${budget.toLocaleString()}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wider ${
              belowMin
                ? "bg-gallery-error/10 text-gallery-error"
                : "bg-gallery-accent-muted text-gallery-accent"
            }`}
          >
            {belowMin ? "Below Minimum" : tier.label}
          </span>
          {!belowMin && (
            <span className="text-xs font-light text-gallery-text-muted">
              {tier.desc}
            </span>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-6 px-2">
        {/* Track fill */}
        <div className="pointer-events-none absolute left-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gallery-accent/40"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={0}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={budget}
          onChange={(e) => {
            setTouched(true);
            onBudgetChange(Number(e.target.value));
          }}
          className="relative z-10 w-full"
        />

        {/* Min/Max labels */}
        <div className="mt-3 flex justify-between">
          <span className="text-xs text-gallery-text-muted">$0</span>
          <span className="text-xs text-gallery-text-muted">
            $10,000+
          </span>
        </div>
      </div>

      {/* Hard guardrail warning */}
      {touched && belowMin && (
        <div className="mt-6 rounded-xl border border-gallery-error/30 bg-gallery-error/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-gallery-error"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gallery-error">
                Minimum budget is $500
              </p>
              <p className="mt-1 text-xs font-light text-gallery-text-secondary">
                Our vetted photographers maintain quality standards that require
                a minimum investment of $500. This ensures you receive
                exceptional work.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tier breakdown */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIERS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setTouched(true);
              onBudgetChange(Math.round((t.min + t.max) / 2 / BUDGET_STEP) * BUDGET_STEP);
            }}
            className={`rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
              tier.label === t.label
                ? "border-gallery-accent/40 bg-gallery-accent-muted"
                : "border-gallery-border bg-gallery-surface/30 hover:border-gallery-border-light"
            }`}
          >
            <div className="text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
              {t.label}
            </div>
            <div className="mt-1 text-xs font-light text-gallery-text-secondary">
              ${t.min.toLocaleString()}&ndash;${t.max.toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
