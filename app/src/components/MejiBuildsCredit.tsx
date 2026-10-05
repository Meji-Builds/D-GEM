import Image from "next/image";

// Plain site credit — not an entry point to anything. The games now have
// their own visible launcher (see GamesFab); this just names who built it,
// deliberately understated like a watermark.
export function MejiBuildsCredit() {
  return (
    <span className="inline-flex items-center gap-1.5 opacity-30 grayscale">
      <Image src="/brand/meji-builds-logo.png" alt="" width={48} height={35} className="h-4 w-auto" />
      <span className="text-[9px] tracking-wide">Designed and Built by Meji Builds</span>
    </span>
  );
}
