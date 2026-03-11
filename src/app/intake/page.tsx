"use client";

import { useState } from "react";
import Link from "next/link";
import type { IntakeFormData, MatchResult, PhotographyStyle, EventType } from "@/types";
import StyleSelection from "@/components/intake/StyleSelection";
import BudgetStep from "@/components/intake/BudgetStep";
import AvailabilityStep from "@/components/intake/AvailabilityStep";
import ReviewStep from "@/components/intake/ReviewStep";

const STEPS = [
  { id: "info", label: "About You" },
  { id: "style", label: "Aesthetic" },
  { id: "budget", label: "Investment" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review & Match" },
];

export default function IntakePage() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData>({
    clientName: "",
    clientEmail: "",
    eventType: "" as unknown as EventType,
    selectedStyles: [],
    budget: 2000,
    eventDate: "",
    location: "",
    notes: "",
  });
  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);
  const [matching, setMatching] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goTo = (nextStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 300);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.clientName.trim() !== "" && formData.clientEmail.trim() !== "";
      case 1:
        return formData.selectedStyles.length > 0;
      case 2:
        return formData.budget >= 500;
      case 3:
        return (formData.eventType as string) !== "" && formData.eventDate !== "";
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (formData.budget < 500) return;

    setMatching(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          event_type: formData.eventType,
          selected_styles: formData.selectedStyles,
          budget: formData.budget,
          event_date: formData.eventDate,
          location: formData.location || null,
          notes: formData.notes || null,
        }),
      });
      const data = await res.json();
      setMatchResults(data);
    } catch {
      // Mock fallback
      setMatchResults([
        {
          photographer_name: "Elena Voss",
          match_score: 0.92,
          styles_overlap: ["dark_moody", "editorial"],
          available: true,
          message:
            "Excellent match! Elena specialises in your chosen aesthetic.",
        },
        {
          photographer_name: "Sofia Ramirez",
          match_score: 0.78,
          styles_overlap: ["editorial"],
          available: true,
          message:
            "Good match. Sofia covers several of your preferred styles.",
        },
      ]);
    } finally {
      setMatching(false);
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    if (step === STEPS.length - 2) {
      goTo(step + 1);
      handleSubmit();
    } else if (step < STEPS.length - 1) {
      goTo(step + 1);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="relative min-h-screen">
      {/* Background accents */}
      <div
        className="light-leak"
        style={{ top: "-100px", right: "-100px", width: "400px", height: "400px" }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="border-b border-gallery-border/50 px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-light tracking-wide text-gallery-text"
          >
            Lens<span className="font-medium text-gallery-accent">Match</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-light text-gallery-text-muted">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-light text-gallery-accent">
              {STEPS[step].label}
            </span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-[2px] bg-gallery-border">
        <div
          className="h-full bg-gallery-accent transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator pills */}
      <div className="border-b border-gallery-border/30 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (i < step) goTo(i);
              }}
              disabled={i > step}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wider transition-all duration-300 ${
                i === step
                  ? "bg-gallery-accent-muted text-gallery-accent"
                  : i < step
                    ? "text-gallery-text-secondary cursor-pointer hover:text-gallery-text"
                    : "text-gallery-text-muted/40 cursor-not-allowed"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  i < step
                    ? "bg-gallery-accent/20 text-gallery-accent"
                    : i === step
                      ? "bg-gallery-accent text-gallery-bg"
                      : "bg-gallery-border text-gallery-text-muted"
                }`}
              >
                {i < step ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-2.5 w-2.5"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div
            className={`transition-all duration-300 ${
              transitioning
                ? "opacity-0 translate-x-8"
                : "opacity-100 translate-x-0"
            }`}
          >
            {/* Step title */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
                {step === 0 && "Let's get acquainted"}
                {step === 1 && (
                  <>
                    What&apos;s your{" "}
                    <span className="italic text-gallery-accent">aesthetic</span>?
                  </>
                )}
                {step === 2 && (
                  <>
                    Your{" "}
                    <span className="italic text-gallery-accent">investment</span>
                  </>
                )}
                {step === 3 && (
                  <>
                    Event{" "}
                    <span className="italic text-gallery-accent">details</span>
                  </>
                )}
                {step === 4 && (
                  <>
                    Review &{" "}
                    <span className="italic text-gallery-accent">match</span>
                  </>
                )}
              </h1>
            </div>

            {/* Step 0: Contact info */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-light text-gallery-text-secondary">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Full name"
                    className="w-full rounded-xl border border-gallery-border bg-gallery-surface/40 px-4 py-3.5 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all duration-300 focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-light text-gallery-text-secondary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, clientEmail: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gallery-border bg-gallery-surface/40 px-4 py-3.5 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all duration-300 focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Style selection */}
            {step === 1 && (
              <StyleSelection
                selected={formData.selectedStyles}
                onSelect={(styles) =>
                  setFormData({
                    ...formData,
                    selectedStyles: styles as PhotographyStyle[],
                  })
                }
              />
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <BudgetStep
                budget={formData.budget}
                onBudgetChange={(budget) =>
                  setFormData({ ...formData, budget })
                }
              />
            )}

            {/* Step 3: Event details */}
            {step === 3 && (
              <AvailabilityStep
                eventDate={formData.eventDate}
                onDateChange={(date) =>
                  setFormData({ ...formData, eventDate: date })
                }
                eventType={formData.eventType}
                onEventTypeChange={(type) =>
                  setFormData({ ...formData, eventType: type as EventType })
                }
                location={formData.location}
                onLocationChange={(loc) =>
                  setFormData({ ...formData, location: loc })
                }
              />
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <ReviewStep
                data={formData}
                results={matchResults}
                loading={matching}
                onNotesChange={(notes) =>
                  setFormData({ ...formData, notes })
                }
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-gallery-border/30 pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="flex items-center gap-2 text-sm font-light text-gallery-text-secondary transition-colors hover:text-gallery-text"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="text-sm font-light text-gallery-text-secondary transition-colors hover:text-gallery-text"
              >
                Cancel
              </Link>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className={`group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wider transition-all duration-300 ${
                  canProceed()
                    ? "bg-gallery-accent text-gallery-bg hover:bg-gallery-accent-hover hover:shadow-[0_0_24px_rgba(166,124,61,0.2)]"
                    : "bg-gallery-border text-gallery-text-muted cursor-not-allowed"
                }`}
              >
                {step === STEPS.length - 2 ? "Find Matches" : "Continue"}
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : submitted ? (
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-full bg-gallery-accent px-6 py-3 text-sm font-medium tracking-wider text-gallery-bg transition-all duration-300 hover:bg-gallery-accent-hover"
              >
                View Dashboard
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
