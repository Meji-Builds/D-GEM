"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export function MejiBuildsEasterEgg() {
  const router = useRouter();

  function handleClick() {
    router.push("/games");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Play the D-GEM games"
      className="opacity-70 transition-opacity hover:opacity-100"
    >
      <Image src="/brand/meji-builds-logo.png" alt="" width={48} height={35} className="h-6 w-auto" />
    </button>
  );
}
