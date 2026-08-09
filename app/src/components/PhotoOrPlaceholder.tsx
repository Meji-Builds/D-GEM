import Image from "next/image";

export const ACCENTS = ["teal", "amber", "magenta", "gold"] as const;
export type Accent = (typeof ACCENTS)[number];

const ACCENT_STYLE: Record<Accent, string> = {
  teal: "bg-teal text-white",
  amber: "bg-amber text-ink",
  magenta: "bg-magenta text-white",
  gold: "bg-gold text-ink",
};

export function accentForIndex(i: number): Accent {
  return ACCENTS[i % ACCENTS.length];
}

export function accentBgClass(accent: Accent): string {
  return ACCENT_STYLE[accent].split(" ")[0];
}

export function PhotoOrPlaceholder({
  src,
  alt,
  label,
  className = "",
  dark = false,
  fit = "cover",
  accent,
}: {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  dark?: boolean;
  fit?: "cover" | "contain";
  accent?: Accent;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-line shadow-sm ${fit === "contain" ? "bg-mist" : ""} ${className}`}>
        <Image src={src} alt={alt} fill className={fit === "contain" ? "object-contain" : "object-cover"} sizes="500px" />
      </div>
    );
  }
  if (accent) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg text-center text-[9px] font-bold uppercase tracking-wider ${ACCENT_STYLE[accent]} ${className}`}
      >
        {label}
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line text-center text-[9px] font-bold uppercase tracking-wider ${dark ? "dark-placeholder-fill text-[#a8a29a]" : "placeholder-fill text-mutefg"} ${className}`}
    >
      {label}
    </div>
  );
}
