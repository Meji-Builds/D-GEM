"use client";

import { useEffect, useRef, useState } from "react";
import type { LeaderboardEntry } from "@/lib/data";

const RANK_STYLE = ["border-gold bg-gold text-ink", "border-ink bg-mist text-ink", "border-ink bg-white text-ink"];

// Deterministic little burst of gold specks around the rank-1 badge —
// fixed angles/distances so it reads the same every time, no randomness.
const CONFETTI = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
  const angle = (i / 8) * Math.PI * 2;
  const distance = 22 + (i % 3) * 6;
  return {
    tx: Math.round(Math.cos(angle) * distance),
    ty: Math.round(Math.sin(angle) * distance),
    rot: Math.round((i * 47) % 360),
    delay: i * 25,
  };
});

export function LeaderboardTable({ entries, dark = false }: { entries: LeaderboardEntry[]; dark?: boolean }) {
  // `undefined` = not yet observed a leader (first render); `null`/ticketId
  // afterwards. Only a *change* between two known leaders should celebrate —
  // not the leaderboard simply loading in for the first time.
  const prevLeaderRef = useRef<string | null | undefined>(undefined);
  const [celebration, setCelebration] = useState<{ name: string; key: number } | null>(null);

  useEffect(() => {
    const newLeaderId = entries[0]?.ticketId ?? null;
    const prevLeaderId = prevLeaderRef.current;
    if (prevLeaderId !== undefined && prevLeaderId && newLeaderId && prevLeaderId !== newLeaderId) {
      setCelebration({ name: entries[0].fullName, key: Date.now() });
    }
    prevLeaderRef.current = newLeaderId;
  }, [entries]);

  useEffect(() => {
    if (!celebration) return;
    const t = setTimeout(() => setCelebration(null), 3600);
    return () => clearTimeout(t);
  }, [celebration]);

  if (entries.length === 0) {
    return (
      <p className={`text-sm ${dark ? "text-[#a8a29a]" : "text-mutefg"}`}>No scores yet — be the first to play!</p>
    );
  }

  return (
    <div className="relative">
      {celebration && (
        <div
          key={celebration.key}
          className="animate-lead-toast pointer-events-none absolute -top-4 left-1/2 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-gold bg-ink px-4 py-2 text-xs font-bold text-gold shadow-[0_0_24px_rgba(201,162,39,0.55)]"
        >
          🏆 {celebration.name.split(" ")[0]} just took the lead!
        </div>
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
            {entries.map((e, i) => {
              const isNewLeader = i === 0 && celebration !== null;
              return (
                <tr
                  key={e.ticketId}
                  className={`border-b ${dark ? "border-[#3a3733]" : "border-hair"} ${isNewLeader ? "animate-lead-glow rounded-lg" : ""}`}
                >
                  <td className="py-3 pr-4">
                    <span
                      className={`relative inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                        i < 3 ? RANK_STYLE[i] : dark ? "border-[#3a3733] text-[#a8a29a]" : "border-line text-mutefg"
                      }`}
                    >
                      {i + 1}
                      {isNewLeader &&
                        CONFETTI.map((c, ci) => (
                          <span
                            key={ci}
                            className="animate-confetti pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-gold"
                            style={{ "--tx": `${c.tx}px`, "--ty": `${c.ty}px`, "--rot": `${c.rot}deg`, animationDelay: `${c.delay}ms` } as React.CSSProperties}
                          />
                        ))}
                    </span>
                  </td>
                  <td className={`py-3 pr-4 text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>{e.fullName}</td>
                  <td className={`py-3 pr-4 text-xs ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.school}</td>
                  <td className={`py-3 pr-4 text-right text-sm ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.riddlesScore}</td>
                  <td className={`py-3 pr-4 text-right text-sm ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.crosswordScore}</td>
                  <td className={`py-3 text-right text-base font-extrabold ${dark ? "text-gold" : "text-ink"}`}>{e.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
