"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CLICKS_NEEDED = 3;
const WINDOW_MS = 1500;

export function MejiBuildsEasterEgg() {
  const router = useRouter();
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    clicksRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (clicksRef.current >= CLICKS_NEEDED) {
      clicksRef.current = 0;
      router.push("/games");
      return;
    }

    timerRef.current = setTimeout(() => {
      clicksRef.current = 0;
    }, WINDOW_MS);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Site credit"
      className="opacity-20 grayscale transition-opacity hover:opacity-40"
    >
      <Image src="/brand/meji-builds-logo.png" alt="" width={48} height={35} className="h-5 w-auto" />
    </button>
  );
}
