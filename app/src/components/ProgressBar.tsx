"use client";

import { useEffect, useState } from "react";

export function ProgressBar({ pct, className = "h-2 bg-line" }: { pct: number; className?: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      <div className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out" style={{ width: `${width}%` }} />
    </div>
  );
}
