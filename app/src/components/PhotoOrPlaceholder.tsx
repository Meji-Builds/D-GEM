import Image from "next/image";

export function PhotoOrPlaceholder({
  src,
  alt,
  label,
  className = "",
  dark = false,
}: {
  src?: string | null;
  alt: string;
  label: string;
  className?: string;
  dark?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-line shadow-sm ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="400px" />
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
