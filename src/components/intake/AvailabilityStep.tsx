"use client";

import { useEffect, useState } from "react";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";

interface Props {
  eventDate: string;
  onDateChange: (date: string) => void;
  eventType: string;
  onEventTypeChange: (type: string) => void;
  location: string;
  onLocationChange: (loc: string) => void;
}

const EVENT_TYPES = [
  { id: "wedding", label: "Wedding", icon: "💍" },
  { id: "portrait", label: "Portrait", icon: "🖼" },
  { id: "commercial", label: "Commercial", icon: "📸" },
  { id: "event", label: "Event", icon: "🎉" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧" },
  { id: "newborn", label: "Newborn", icon: "👶" },
];

export default function AvailabilityStep({
  eventDate,
  onDateChange,
  eventType,
  onEventTypeChange,
  location,
  onLocationChange,
}: Props) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  });

  useEffect(() => {
    async function fetchDates() {
      try {
        const res = await fetch("/api/available-dates");
        const data = await res.json();
        setAvailableDates(data.dates ?? []);
      } catch {
        // Fallback mock dates if API not running
        setAvailableDates([
          "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26",
          "2026-05-03", "2026-05-10", "2026-05-17", "2026-05-24", "2026-05-31",
          "2026-06-07", "2026-06-14", "2026-06-21", "2026-06-28",
          "2026-07-05", "2026-07-12", "2026-07-19", "2026-07-26",
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchDates();
  }, []);

  const today = startOfDay(new Date());
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const selectedDate = eventDate ? new Date(eventDate + "T00:00:00") : null;

  const calendarDays = [];
  for (let i = 0; i < startDow; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="space-y-8">
      {/* Event type */}
      <div>
        <label className="mb-3 block text-sm font-light text-gallery-text-secondary">
          Event Type
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {EVENT_TYPES.map((et) => (
            <button
              key={et.id}
              type="button"
              onClick={() => onEventTypeChange(et.id)}
              className={`rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
                eventType === et.id
                  ? "border-gallery-accent/40 bg-gallery-accent-muted"
                  : "border-gallery-border bg-gallery-surface/30 hover:border-gallery-border-light"
              }`}
            >
              <div className="text-lg">{et.icon}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gallery-text-secondary">
                {et.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div>
        <label className="mb-3 block text-sm font-light text-gallery-text-secondary">
          Preferred Date
        </label>

        <div className="rounded-2xl border border-gallery-border bg-gallery-surface/40 p-5">
          {/* Month nav */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-2 text-gallery-text-muted transition-colors hover:text-gallery-text"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-display text-lg font-light tracking-wide">
              {format(viewMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-2 text-gallery-text-muted transition-colors hover:text-gallery-text"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="py-1 text-[10px] font-medium uppercase tracking-wider text-gallery-text-muted">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gallery-accent/30 border-t-gallery-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (day === null)
                  return <div key={`empty-${idx}`} className="h-10" />;

                const date = new Date(year, month, day);
                const dateStr = format(date, "yyyy-MM-dd");
                const isAvailable = availableDates.includes(dateStr);
                const isPast = isBefore(date, today);
                const isSelected = selectedDate
                  ? isSameDay(date, selectedDate)
                  : false;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={!isAvailable || isPast}
                    onClick={() => onDateChange(dateStr)}
                    className={`relative flex h-10 items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-gallery-accent text-gallery-bg font-medium shadow-[0_0_16px_rgba(201,169,110,0.3)]"
                        : isAvailable && !isPast
                          ? "text-gallery-text hover:bg-gallery-accent/10 cursor-pointer"
                          : "text-gallery-text-muted/30 cursor-not-allowed"
                    }`}
                  >
                    {day}
                    {isAvailable && !isPast && !isSelected && (
                      <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gallery-accent/60" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 border-t border-gallery-border pt-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gallery-accent/60" />
              <span className="text-[10px] text-gallery-text-muted">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gallery-text-muted/30" />
              <span className="text-[10px] text-gallery-text-muted">Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="mb-2 block text-sm font-light text-gallery-text-secondary">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="e.g., Brooklyn, NY"
          className="w-full rounded-xl border border-gallery-border bg-gallery-surface/40 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all duration-300 focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
        />
      </div>
    </div>
  );
}
