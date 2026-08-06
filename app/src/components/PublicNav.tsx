"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { LinkButton } from "./Button";
import { MenuIcon, CloseIcon } from "./Icon";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/speakers", label: "Speakers" },
  { href: "/agenda", label: "Agenda" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/faq", label: "FAQ" },
  { href: "/my-ticket", label: "My ticket" },
];

export function PublicNav({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`relative border-b-2 ${dark ? "bg-ink border-gold text-white" : "border-ink text-ink"}`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Logo size="sm" />
        <button
          className="relative z-10 p-1 transition-transform duration-150 active:scale-90 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className="hidden w-full flex-col gap-4 md:flex md:w-auto md:flex-row md:items-center md:gap-6">
          <div
            className={`flex flex-col gap-3 text-xs font-semibold tracking-wide md:flex-row md:items-center md:gap-6 ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}
          >
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative py-1 transition-colors hover:text-gold"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-gold transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
          <LinkButton href="/register" tone={dark ? "onDark" : "onLight"}>
            Register now
          </LinkButton>
        </div>
      </div>

      {open && (
        <div
          className={`animate-fade-in-up absolute inset-x-0 top-full z-20 border-b-2 ${dark ? "border-gold bg-ink" : "border-ink bg-white"} px-5 py-5 shadow-lg md:hidden`}
        >
          <div
            className={`flex flex-col gap-4 text-sm font-semibold tracking-wide ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}
          >
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="animate-fade-in-up transition-colors hover:text-gold"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-5">
            <LinkButton href="/register" tone={dark ? "onDark" : "onLight"} full>
              Register now
            </LinkButton>
          </div>
        </div>
      )}
    </nav>
  );
}
