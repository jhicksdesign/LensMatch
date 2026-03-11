"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, getUser, clearAuth, type AuthUser } from "@/lib/auth";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Leads",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      // Allow viewing with mock data if no DB
      setChecked(true);
      return;
    }
    setUser(getUser());
    setChecked(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (!checked) return null;

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b border-gallery-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-light tracking-wide text-gallery-text"
          >
            Lens<span className="font-medium text-gallery-accent">Match</span>
          </Link>

          {/* Nav tabs */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium tracking-wider transition-all ${
                    active
                      ? "bg-gallery-accent-muted text-gallery-accent"
                      : "text-gallery-text-muted hover:text-gallery-text-secondary"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User / auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gallery-accent-muted font-display text-xs font-medium text-gallery-accent">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <span className="hidden text-sm font-light text-gallery-text-secondary sm:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-[11px] font-light text-gallery-text-muted transition-colors hover:text-gallery-error"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border border-gallery-accent/40 px-4 py-1.5 text-xs font-medium tracking-wider text-gallery-accent transition-all hover:bg-gallery-accent hover:text-gallery-bg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="border-b border-gallery-border/30 px-4 py-2 md:hidden">
        <div className="flex gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[10px] font-medium tracking-wider ${
                  active
                    ? "bg-gallery-accent-muted text-gallery-accent"
                    : "text-gallery-text-muted"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
