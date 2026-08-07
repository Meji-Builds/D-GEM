"use client";

import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hrs = Math.floor((ms % 86400000) / 3600000);
  const min = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return { days, hrs, min, sec };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({
  eventDate,
  className = "",
  cellClassName = "bg-[#211f1c] border border-[#3a3733]",
}: {
  eventDate: string | null;
  className?: string;
  cellClassName?: string;
}) {
  const target = eventDate ? new Date(eventDate) : null;
  // Starts null on both server and client so the first paint always
  // matches (avoids a hydration mismatch from computing Date.now() during
  // render); the real value fills in a moment after mount, client-only.
  const [t, setT] = useState<{ days: number; hrs: number; min: number; sec: number } | null>(null);

  useEffect(() => {
    if (!target) return;
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  if (!target) {
    return (
      <div className={`text-sm font-bold text-[#a8a29a] ${className}`}>Date to be announced</div>
    );
  }

  const display = t ?? { days: 0, hrs: 0, min: 0, sec: 0 };

  return (
    <div className={`flex gap-2 ${className}`}>
      {[
        { v: display.days, l: "days" },
        { v: display.hrs, l: "hrs" },
        { v: display.min, l: "min" },
        { v: display.sec, l: "sec" },
      ].map((c) => (
        <div key={c.l} className={`px-3 py-2 text-center ${cellClassName}`}>
          <div className="font-display text-xl font-extrabold tracking-tight text-white tabular-nums">
            {pad(c.v)}
          </div>
          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#a8a29a]">
            {c.l}
          </div>
        </div>
      ))}
    </div>
  );
}
