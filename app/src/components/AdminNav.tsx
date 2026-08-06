"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/logout-action";
import { MenuIcon, CloseIcon } from "./Icon";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/speakers", label: "Speakers" },
  { href: "/admin/sponsors", label: "Sponsors & event" },
  { href: "/admin/attendees", label: "Attendees" },
  { href: "/admin/volunteers", label: "Volunteers" },
];

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="relative border-b-2 border-ink">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <span className="font-display text-sm font-extrabold">
          D<span className="text-gold">GEM</span> Admin
        </span>

        <button
          className="p-1 transition-transform duration-150 active:scale-90 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle admin menu"
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div className="hidden items-center gap-4 text-xs font-semibold md:flex">
          <span className="text-mutefg">{userName}</span>
          <Link href="/scanner" className="transition-colors hover:text-gold">Scanner</Link>
          <Link href="/" className="transition-colors hover:text-gold">Preview site</Link>
          <form action={logout}>
            <button type="submit" className="transition-colors hover:text-gold">Log out</button>
          </form>
        </div>
      </div>

      {/* Desktop tab row */}
      <div className="hidden border-t border-hair md:flex md:flex-wrap">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive(t.href) ? "bg-gold text-ink" : "text-bodyfg hover:bg-mist"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Mobile slide-down menu */}
      {open && (
        <div className="animate-fade-in-up absolute inset-x-0 top-full z-20 border-b-2 border-ink bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {TABS.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setOpen(false)}
                className={`animate-fade-in-up px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive(t.href) ? "bg-gold text-ink" : "text-bodyfg hover:bg-mist"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-hair pt-4 text-sm font-semibold text-bodyfg">
            <span className="text-xs text-mutefg">Signed in as {userName}</span>
            <Link href="/scanner" onClick={() => setOpen(false)} className="transition-colors hover:text-gold">
              Scanner
            </Link>
            <Link href="/" onClick={() => setOpen(false)} className="transition-colors hover:text-gold">
              Preview site
            </Link>
            <form action={logout}>
              <button type="submit" className="text-left transition-colors hover:text-gold">
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
