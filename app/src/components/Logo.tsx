import Image from "next/image";
import Link from "next/link";

export function Logo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const dims = {
    sm: { w: 108, h: 35, className: "h-8 w-auto" },
    md: { w: 160, h: 52, className: "h-11 w-auto" },
    lg: { w: 260, h: 85, className: "h-20 w-auto" },
  }[size];
  return (
    <Link href="/" className="inline-flex items-center" aria-label="D-GEM home">
      <Image
        src="/dgem-logo.jpg"
        alt="D-GEM — Don't Graduate Empty"
        width={dims.w}
        height={dims.h}
        className={dims.className}
        priority
      />
    </Link>
  );
}
