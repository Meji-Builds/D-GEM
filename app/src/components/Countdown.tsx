"use client";

import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hrs = Math.floor((ms % 86400000) / 3600000);
  const min = Math.floor((ms % 3600000) / 60000);
  return { days, hrs, min };
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
  const [t, setT] = useState(() => (target ? diff(target) : { days: 0, hrs: 0, min: 0 }));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setT(diff(target)), 30000);
    return () => clearInterval(id);
  }, [eventDate]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {[
        { v: t.days, l: "days" },
        { v: t.hrs, l: "hrs" },
        { v: t.min, l: "min" },
      ].map((c) => (
        <div key={c.l} className={`px-3 py-2 text-center ${cellClassName}`}>
          <div className="font-display text-xl font-extrabold tracking-tight text-white">
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
