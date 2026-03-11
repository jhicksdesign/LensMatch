"use client";

import type { PhotographyStyle, StyleOption } from "@/types";

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "dark_moody",
    label: "Dark & Moody",
    description: "Rich shadows, dramatic contrast, cinematic depth",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&q=80",
    gradient: "from-neutral-950 via-neutral-900 to-amber-950",
  },
  {
    id: "bright_airy",
    label: "Bright & Airy",
    description: "Soft light, pastel tones, ethereal atmosphere",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&q=80",
    gradient: "from-sky-100 via-rose-50 to-amber-50",
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Magazine-ready, bold compositions, fashion-forward",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop&q=80",
    gradient: "from-zinc-900 via-stone-800 to-zinc-900",
  },
  {
    id: "documentary",
    label: "Documentary",
    description: "Candid moments, raw emotion, storytelling first",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&q=80",
    gradient: "from-stone-900 via-stone-800 to-stone-900",
  },
  {
    id: "fine_art",
    label: "Fine Art",
    description: "Painterly quality, artistic vision, museum-worthy",
    image:
      "https://images.unsplash.com/photo-1513807016779-d51c0c026263?w=600&h=400&fit=crop&q=80",
    gradient: "from-purple-950 via-indigo-950 to-slate-900",
  },
  {
    id: "classic_timeless",
    label: "Classic & Timeless",
    description: "Elegant, enduring beauty, never goes out of style",
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop&q=80",
    gradient: "from-amber-950 via-stone-900 to-neutral-900",
  },
];

interface Props {
  selected: PhotographyStyle[];
  onSelect: (styles: PhotographyStyle[]) => void;
}

export default function StyleSelection({ selected, onSelect }: Props) {
  const toggle = (id: PhotographyStyle) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      onSelect([...selected, id]);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-light text-gallery-text-secondary">
          Select up to 3 styles that resonate with your vision
        </p>
        <span className="text-xs font-light text-gallery-text-muted">
          {selected.length}/3 selected
        </span>
      </div>

      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selected.includes(style.id);
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => toggle(style.id)}
              className={`style-card group relative h-48 w-full text-left ${
                isSelected ? "selected" : ""
              } ${
                selected.length >= 3 && !isSelected
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
              disabled={selected.length >= 3 && !isSelected}
            >
              {/* Background gradient (placeholder for real images) */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${style.gradient} transition-transform duration-700 group-hover:scale-105`}
              />

              {/* Image overlay */}
              <img
                src={style.image}
                alt={style.label}
                className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-80"
                loading="lazy"
              />

              {/* Content overlay */}
              <div className="relative z-10 flex h-full flex-col justify-end p-5">
                <h3 className="mb-1 font-display text-lg font-medium tracking-tight text-white">
                  {style.label}
                </h3>
                <p className="text-xs font-light leading-relaxed text-white/60">
                  {style.description}
                </p>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-gallery-accent text-gallery-bg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
