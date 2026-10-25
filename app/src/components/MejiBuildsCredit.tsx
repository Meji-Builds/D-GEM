import Image from "next/image";

// Plain site credit — not an entry point to anything, just names who built it.
export function MejiBuildsCredit() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#a8a29a]">
      <Image src="/brand/meji-builds-logo.png" alt="" width={48} height={35} className="h-4 w-auto" />
      <span className="text-[9px] tracking-wide">Designed and Built by Meji Builds</span>
    </span>
  );
}
