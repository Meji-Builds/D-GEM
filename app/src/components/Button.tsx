import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { ArrowRightIcon } from "./Icon";

type CommonProps = {
  variant?: "solid" | "outline";
  tone?: "onLight" | "onDark";
  full?: boolean;
  /** Keep sharp corners instead of the default pill shape — reserve for the odd intentional accent. */
  square?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  "group inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 disabled:hover:shadow-sm";

function styles(variant: "solid" | "outline", tone: "onLight" | "onDark") {
  if (variant === "solid") {
    return tone === "onDark"
      ? "bg-gold text-ink border border-gold hover:bg-[#dab63f]"
      : "bg-ink text-white border border-ink hover:bg-[#2a2622]";
  }
  return tone === "onDark"
    ? "bg-transparent text-white border border-white hover:bg-white/10"
    : "bg-transparent text-ink border border-ink hover:bg-ink/5";
}

function Arrow() {
  return (
    <ArrowRightIcon className="h-3.5 w-3.5 text-gold transition-transform duration-150 group-hover:translate-x-0.5" />
  );
}

export function LinkButton({
  href,
  variant = "solid",
  tone = "onLight",
  full,
  square,
  className = "",
  children,
  ...rest
}: CommonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      {...rest}
      className={`${base} ${square ? "rounded-none" : "rounded-full"} ${styles(variant, tone)} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
      {variant === "solid" && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "solid",
  tone = "onLight",
  full,
  square,
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`${base} ${square ? "rounded-none" : "rounded-full"} ${styles(variant, tone)} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
      {variant === "solid" && <Arrow />}
    </button>
  );
}
