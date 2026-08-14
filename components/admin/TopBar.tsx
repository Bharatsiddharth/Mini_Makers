"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-plum/15 bg-white px-3.5 py-2 sm:flex">
          <Search className="h-4 w-4 text-ink-soft" />
          <input
            placeholder="Search..."
            className="w-40 bg-transparent text-sm outline-none placeholder:text-ink-soft/60"
          />
        </div>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-plum/15 bg-white hover:bg-blush-soft"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-ink-soft" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-xs font-medium text-white">
          SH
        </div>
      </div>
    </div>
  );
}
