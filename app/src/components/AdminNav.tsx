"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/logout-action";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/speakers", label: "Speakers" },
  { href: "/admin/sponsors", label: "Sponsors & event" },
  { href: "/admin/attendees", label: "Attendees" },
  { href: "/admin/volunteers", label: "Volunteers" },
];

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-5 py-3">
        <span className="font-display text-sm font-extrabold">
          D<span className="text-gold">GEM</span> Admin
        </span>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-mutefg">{userName}</span>
          <Link href="/scanner" className="hover:text-gold">Scanner</Link>
          <Link href="/" className="hover:text-gold">Preview site</Link>
          <form action={logout}>
            <button type="submit" className="hover:text-gold">Log out</button>
          </form>
        </div>
      </div>
      <div className="flex flex-wrap border-b-2 border-ink">
        {TABS.map((t) => {
          const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider ${
                active ? "bg-gold text-ink" : "text-bodyfg hover:bg-mist"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
