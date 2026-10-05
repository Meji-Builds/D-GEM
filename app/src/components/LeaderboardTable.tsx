"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { LeaderboardEntry } from "@/lib/data";

const RANK_STYLE = ["border-gold bg-gold text-ink", "border-ink bg-mist text-ink", "border-ink bg-white text-ink"];

const SHIFT_MS = 550;
const TOAST_MS = 4200;

type Trail = { top: number; height: number; key: number };

export function LeaderboardTable({ entries, dark = false }: { entries: LeaderboardEntry[]; dark?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());
  // `null` = no prior measurement yet (first paint) — nothing should
  // animate off of that, only off a real change between two live reads.
  const prevTopsRef = useRef<Map<string, number> | null>(null);
  const prevLeaderRef = useRef<string | null>(null);
  const [celebrateLeader, setCelebrateLeader] = useState<string | null>(null);
  const [trail, setTrail] = useState<Trail | null>(null);

  // Classic FLIP: by the time this runs, the DOM already reflects the new
  // order (React committed it). We read each row's new position, diff it
  // against the position we measured last time, then jump each row back to
  // its old spot with transitions off and immediately transition it to 0 —
  // so instead of popping into the new order, rows visibly travel there.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top;

    const newTops = new Map<string, number>();
    rowRefs.current.forEach((el, ticketId) => {
      if (el) newTops.set(ticketId, el.getBoundingClientRect().top - containerTop);
    });

    const newLeaderId = entries[0]?.ticketId ?? null;
    const prevTops = prevTopsRef.current;
    const leaderChanged = Boolean(prevTops && prevLeaderRef.current && newLeaderId && prevLeaderRef.current !== newLeaderId);

    if (prevTops) {
      newTops.forEach((top, ticketId) => {
        const el = rowRefs.current.get(ticketId);
        const prevTop = prevTops.get(ticketId);
        if (!el || prevTop === undefined) return;
        const delta = prevTop - top;
        if (Math.abs(delta) < 1) return;

        if (leaderChanged && ticketId === newLeaderId) {
          // The new leader gets the special treatment: float up past its
          // slot, hover, then settle — handled entirely by the
          // `lead-levitate` keyframes via the --flip-start custom property.
          el.style.transition = "none";
          el.style.setProperty("--flip-start", `${delta}px`);
          el.style.transform = `translateY(${delta}px)`;
          el.style.zIndex = "20";
          void el.offsetHeight; // force reflow before switching to the animation
          el.style.transform = "";
          el.classList.add("animate-lead-levitate");
          el.addEventListener(
            "animationend",
            () => {
              el.classList.remove("animate-lead-levitate");
              el.style.zIndex = "";
            },
            { once: true }
          );
        } else {
          // Every other displaced row just slides to its new slot.
          el.style.transition = "none";
          el.style.transform = `translateY(${delta}px)`;
          void el.offsetHeight;
          el.style.transition = `transform ${SHIFT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          el.style.transform = "";
        }
      });

      if (leaderChanged && newLeaderId) {
        const el = rowRefs.current.get(newLeaderId);
        const prevTop = prevTops.get(newLeaderId);
        const newTop = newTops.get(newLeaderId);
        if (el && prevTop !== undefined && newTop !== undefined) {
          setTrail({ top: Math.min(prevTop, newTop), height: Math.abs(prevTop - newTop) + el.offsetHeight, key: Date.now() });
          setCelebrateLeader(newLeaderId);
        }
      }
    }

    prevTopsRef.current = newTops;
    prevLeaderRef.current = newLeaderId;
  }, [entries]);

  useLayoutEffect(() => {
    if (!celebrateLeader) return;
    const t = setTimeout(() => {
      setCelebrateLeader(null);
      setTrail(null);
    }, TOAST_MS);
    return () => clearTimeout(t);
  }, [celebrateLeader]);

  if (entries.length === 0) {
    return (
      <p className={`text-sm ${dark ? "text-[#a8a29a]" : "text-mutefg"}`}>No scores yet — be the first to play!</p>
    );
  }

  const celebrateName = celebrateLeader ? entries.find((e) => e.ticketId === celebrateLeader)?.fullName : null;

  return (
    <div ref={containerRef} className="relative">
      {celebrateName && (
        <div
          key={celebrateLeader}
          className="animate-lead-toast pointer-events-none absolute -top-4 left-1/2 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-gold bg-ink px-4 py-2 text-xs font-bold text-gold shadow-[0_0_24px_rgba(201,162,39,0.55)]"
        >
          🏆 {celebrateName.split(" ")[0]} just took the lead!
        </div>
      )}
      {trail && (
        <div
          key={trail.key}
          className="animate-lead-trail pointer-events-none absolute inset-x-0 z-10"
          style={{ top: trail.top, height: trail.height }}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className={`border-b-2 text-[10px] font-bold uppercase tracking-widest ${dark ? "border-[#3a3733] text-[#a8a29a]" : "border-ink text-mutefg"}`}>
              <th className="py-2 pr-4">Rank</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">School</th>
              <th className="py-2 pr-4 text-right">Riddles</th>
              <th className="py-2 pr-4 text-right">Word Search</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr
                key={e.ticketId}
                ref={(el) => {
                  if (el) rowRefs.current.set(e.ticketId, el);
                  else rowRefs.current.delete(e.ticketId);
                }}
                className={`relative border-b ${dark ? "border-[#3a3733]" : "border-hair"}`}
              >
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                      i < 3 ? RANK_STYLE[i] : dark ? "border-[#3a3733] text-[#a8a29a]" : "border-line text-mutefg"
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className={`py-3 pr-4 text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>{e.fullName}</td>
                <td className={`py-3 pr-4 text-xs ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.school}</td>
                <td className={`py-3 pr-4 text-right text-sm ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.riddlesScore}</td>
                <td className={`py-3 pr-4 text-right text-sm ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.crosswordScore}</td>
                <td className={`py-3 text-right text-base font-extrabold ${dark ? "text-gold" : "text-ink"}`}>{e.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
