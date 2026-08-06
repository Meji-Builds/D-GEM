"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { LinkButton } from "./Button";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/speakers", label: "Speakers" },
  { href: "/agenda", label: "Agenda" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/faq", label: "FAQ" },
];

export function PublicNav({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`border-b-2 ${dark ? "bg-ink border-gold text-white" : "border-ink text-ink"}`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Logo size="sm" />
        <button
          className="text-xs font-bold tracking-wider md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
        <div
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-4 md:flex md:w-auto md:flex-row md:items-center md:gap-6`}
        >
          <div
            className={`flex flex-col gap-3 text-xs font-semibold tracking-wide md:flex-row md:items-center md:gap-6 ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}
          >
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gold">
                {l.label}
              </Link>
            ))}
          </div>
          <LinkButton href="/register" tone={dark ? "onDark" : "onLight"}>
            Register now
          </LinkButton>
        </div>
      </div>
    </nav>
  );
}
