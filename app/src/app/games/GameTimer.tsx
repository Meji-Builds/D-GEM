"use client";

import { useCountdown } from "./useCountdown";

export function GameTimer({ deadline, onExpire }: { deadline: string; onExpire?: () => void }) {
  const { remainingMs, label } = useCountdown(deadline, onExpire);
  const low = remainingMs <= 30_000;

  return (
    <div
      className={`sticky top-0 z-10 -mx-5 mb-4 flex items-center justify-between border-b px-5 py-2 text-xs font-bold uppercase tracking-widest sm:-mx-8 sm:px-8 ${
        low ? "border-red-800 bg-red-50 text-red-800" : "border-line bg-paper text-mutefg"
      }`}
    >
      <span>Time left</span>
      <span className="font-display text-base tabular-nums">{label}</span>
    </div>
  );
}
