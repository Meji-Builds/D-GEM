"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdown(deadlineIso: string, onExpire?: () => void) {
  const deadlineMs = new Date(deadlineIso).getTime();
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, deadlineMs - Date.now()));
  const firedRef = useRef(false);

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, deadlineMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineMs]);

  useEffect(() => {
    if (remainingMs > 0 || firedRef.current) return;
    firedRef.current = true;
    onExpire?.();
  }, [remainingMs, onExpire]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const label = `${minutes}:${String(seconds).padStart(2, "0")}`;

  return { remainingMs, expired: remainingMs <= 0, label };
}
