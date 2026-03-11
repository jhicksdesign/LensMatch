"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authFetch, isAuthenticated } from "@/lib/auth";

interface Photo {
  id: string;
  url: string;
  caption: string;
  style: string;
  sort_order: number;
}

const CLOUDINARY_CLOUD = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "")
  : "";
const CLOUDINARY_PRESET = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "")
  : "";
const HAS_CLOUDINARY = CLOUDINARY_CLOUD !== "" && CLOUDINARY_PRESET !== "";

export default function PortfolioPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [error, setError] = useState("");

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await authFetch("/api/photos");
      const data = await res.json();
      setPhotos(data.photos ?? []);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    fetchPhotos();
  }, [router, fetchPhotos]);

  const savePhoto = async (url: string, caption = "") => {
    setError("");
    try {
      const res = await authFetch("/api/photos", {
        method: "POST",
        body: JSON.stringify({ url, caption }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to save photo");
        return;
      }
      await fetchPhotos();
    } catch {
      setError("Connection error");
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUploading(true);
    await savePhoto(urlInput.trim(), captionInput.trim());
    setUrlInput("");
    setCaptionInput("");
    setUploading(false);
  };

  const handleCloudinaryUpload = () => {
    if (!HAS_CLOUDINARY) return;

    // Dynamically load Cloudinary widget
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.onload = () => {
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD,
          uploadPreset: CLOUDINARY_PRESET,
          multiple: true,
          maxFiles: 20 - photos.length,
          sources: ["local", "url", "camera"],
          resourceType: "image",
          maxFileSize: 10_000_000, // 10MB
          cropping: false,
          showAdvancedOptions: false,
          styles: {
            palette: {
              window: "#141414",
              windowBorder: "#1f1f1f",
              tabIcon: "#c9a96e",
              menuIcons: "#8a8278",
              textDark: "#0a0a0a",
              textLight: "#f5f0eb",
              link: "#c9a96e",
              action: "#c9a96e",
              inactiveTabIcon: "#5a5650",
              error: "#c44b4b",
              inProgress: "#c9a96e",
              complete: "#4b8c6b",
              sourceBg: "#0a0a0a",
            },
          },
        },
        async (error: any, result: any) => {
          if (!error && result?.event === "success") {
            await savePhoto(result.info.secure_url, "");
          }
        },
      );
      widget.open();
    };
    document.head.appendChild(script);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!HAS_CLOUDINARY) {
      setError("Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable file uploads. Use URL paste instead.");
      return;
    }

    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      if (photos.length >= 20) break;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          { method: "POST", body: formData },
        );
        const data = await res.json();
        if (data.secure_url) {
          await savePhoto(data.secure_url, "");
        }
      } catch {
        setError("Upload failed for one or more files");
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (photoId: string) => {
    try {
      await authFetch(`/api/photos/${photoId}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch {
      // fail silently
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
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-light tracking-tight">
              Your <span className="italic text-gallery-accent">Portfolio</span>
            </h1>
            <p className="mt-1 text-sm font-light text-gallery-text-secondary">
              {photos.length} of 20 photos &middot; Clients see these when you&apos;re matched
            </p>
          </div>
        </div>

        {/* Upload section */}
        <div className="mb-8 rounded-2xl border border-gallery-border bg-gallery-surface/40 p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-gallery-text-muted">
            Add Photos
          </h2>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* File upload */}
            <div>
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
                  photos.length >= 20
                    ? "border-gallery-border opacity-50 cursor-not-allowed"
                    : "border-gallery-border hover:border-gallery-accent/40"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 h-8 w-8 text-gallery-text-muted">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-light text-gallery-text-secondary">
                  {uploading ? "Uploading..." : "Drop images or click to browse"}
                </span>
                <span className="mt-1 text-[10px] text-gallery-text-muted">
                  {HAS_CLOUDINARY
                    ? "JPG, PNG up to 10MB each"
                    : "Requires Cloudinary config"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={photos.length >= 20 || uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* URL paste */}
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-light text-gallery-text-secondary">
                  Or paste an image URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  disabled={photos.length >= 20}
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full rounded-xl border border-gallery-border bg-gallery-bg/60 px-4 py-3 text-sm font-light text-gallery-text placeholder:text-gallery-text-muted outline-none transition-all focus:border-gallery-accent/40 focus:ring-1 focus:ring-gallery-accent/20"
                />
              </div>
              <button
                type="submit"
                disabled={!urlInput.trim() || photos.length >= 20 || uploading}
                className="w-full rounded-xl bg-gallery-accent py-3 text-xs font-medium uppercase tracking-wider text-gallery-bg transition-all hover:bg-gallery-accent-hover disabled:opacity-50"
              >
                {uploading ? "Adding..." : "Add Photo"}
              </button>
            </form>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-gallery-error/30 bg-gallery-error/5 px-4 py-3 text-xs text-gallery-error">
              {error}
            </div>
          )}
        </div>

        {/* Photo grid */}
        {photos.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-gallery-border bg-gallery-surface/20">
            <div className="text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 h-12 w-12 text-gallery-text-muted/30">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="text-sm font-light text-gallery-text-muted">
                Your portfolio is empty. Add photos above to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-gallery-border bg-gallery-surface"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || "Portfolio image"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between p-3">
                    {photo.caption && (
                      <span className="text-[11px] font-light text-white/80">
                        {photo.caption}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(photo.id)}
                      className="ml-auto rounded-lg bg-gallery-error/80 p-1.5 text-white transition-all hover:bg-gallery-error"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
