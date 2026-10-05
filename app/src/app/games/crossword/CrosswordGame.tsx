"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitLevelScore } from "../actions";
import { useGamePlayer } from "../useGamePlayer";
import { Button } from "@/components/Button";
import type { CrosswordPlacement } from "@/lib/crossword";

type Layout = { width: number; height: number; placements: CrosswordPlacement[] } | null;

function cellKey(r: number, c: number) {
  return `${r},${c}`;
}

export function CrosswordGame({ layoutsByLevel }: { layoutsByLevel: Record<number, Layout> }) {
  const router = useRouter();
  const { player } = useGamePlayer();
  const [level, setLevel] = useState(1);
  const [cells, setCells] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [totals, setTotals] = useState<Record<number, number>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const layout = layoutsByLevel[level];

  const cellOrder = useMemo(() => {
    if (!layout) return [];
    const positions = new Set<string>();
    for (const p of layout.placements) {
      const dr = p.dir === "down" ? 1 : 0;
      const dc = p.dir === "across" ? 1 : 0;
      for (let i = 0; i < p.word.length; i++) positions.add(cellKey(p.row + dr * i, p.col + dc * i));
    }
    return Array.from(positions).sort((a, b) => {
      const [ar, ac] = a.split(",").map(Number);
      const [br, bc] = b.split(",").map(Number);
      return ar - br || ac - bc;
    });
  }, [layout]);

  const occupied = useMemo(() => {
    const map = new Map<string, number | undefined>();
    for (const key of cellOrder) map.set(key, undefined);
    if (layout) {
      for (const p of layout.placements) {
        map.set(cellKey(p.row, p.col), p.number);
      }
    }
    return map;
  }, [cellOrder, layout]);

  const maxScore = useMemo(() => (layout ? layout.placements.reduce((sum, p) => sum + p.points, 0) : 0), [layout]);

  if (player === undefined) return null;
  if (player === null) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-sm text-mutefg">You need to enter your ticket ID first.</p>
        <Button type="button" className="mt-4" onClick={() => router.push("/games")}>Go to games</Button>
      </div>
    );
  }

  if (!layout || layout.placements.length === 0) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-sm text-mutefg">Level {level} isn&apos;t ready yet — check back soon.</p>
      </div>
    );
  }

  function handleChange(key: string, value: string) {
    const letter = value.slice(-1).toUpperCase().replace(/[^A-Z]/g, "");
    setCells((prev) => ({ ...prev, [key]: letter }));

    if (letter) {
      const idx = cellOrder.indexOf(key);
      const next = cellOrder[idx + 1];
      if (next) inputRefs.current[next]?.focus();
    }
  }

  async function handleSubmit() {
    if (!layout || !player) return;
    setSubmitting(true);
    let score = 0;
    for (const p of layout.placements) {
      const dr = p.dir === "down" ? 1 : 0;
      const dc = p.dir === "across" ? 1 : 0;
      let correct = true;
      for (let i = 0; i < p.word.length; i++) {
        if ((cells[cellKey(p.row + dr * i, p.col + dc * i)] ?? "") !== p.word[i]) {
          correct = false;
          break;
        }
      }
      if (correct) score += p.points;
    }
    await submitLevelScore(player.ticketId, "CROSSWORD", level, score, maxScore);
    setResult({ score, maxScore });
    setTotals((t) => ({ ...t, [level]: score }));
    setSubmitting(false);
  }

  function nextLevel() {
    setLevel((l) => l + 1);
    setCells({});
    setResult(null);
  }

  if (result) {
    const isLastLevel = level >= 3 || !layoutsByLevel[level + 1]?.placements.length;
    const runningTotal = Object.values({ ...totals, [level]: result.score }).reduce((a, b) => a + b, 0);
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Level {level} complete</p>
        <div className="font-display mt-2 text-3xl font-extrabold">{result.score}/{result.maxScore}</div>
        <p className="mt-2 text-xs text-mutefg">Running total: {runningTotal} points</p>
        <div className="mt-6">
          {isLastLevel ? (
            <>
              <p className="text-sm font-semibold">That&apos;s the whole crossword — nice work!</p>
              <Button type="button" className="mt-4" full onClick={() => router.push("/games/leaderboard")}>View leaderboard</Button>
            </>
          ) : (
            <Button type="button" full onClick={nextLevel}>Next level →</Button>
          )}
        </div>
      </div>
    );
  }

  const across = layout.placements.filter((p) => p.dir === "across").sort((a, b) => a.number - b.number);
  const down = layout.placements.filter((p) => p.dir === "down").sort((a, b) => a.number - b.number);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Crossword · Level {level} of 3</p>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">Fill in what you know</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr]">
        <div className="overflow-x-auto">
          <div
            className="inline-grid border-2 border-ink"
            style={{ gridTemplateColumns: `repeat(${layout.width}, 28px)` }}
          >
            {Array.from({ length: layout.height }, (_, r) =>
              Array.from({ length: layout.width }, (_, c) => {
                const key = cellKey(r, c);
                const isOccupied = occupied.has(key);
                const number = occupied.get(key);
                if (!isOccupied) {
                  return <div key={key} className="h-[28px] w-[28px] border border-line bg-ink" />;
                }
                return (
                  <div key={key} className="relative h-[28px] w-[28px] border border-line bg-white">
                    {number && <span className="pointer-events-none absolute left-0.5 top-0 text-[7px] font-bold leading-none text-mutefg">{number}</span>}
                    <input
                      ref={(el) => { inputRefs.current[key] = el; }}
                      value={cells[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      maxLength={1}
                      className="h-full w-full bg-transparent text-center text-sm font-bold uppercase text-ink focus:outline-none focus:bg-gold/20"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Across</p>
            <ul className="mt-2 space-y-1.5 text-xs text-bodyfg">
              {across.map((p) => (
                <li key={`${p.dir}-${p.number}`}><strong>{p.number}.</strong> {p.clue}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Down</p>
            <ul className="mt-2 space-y-1.5 text-xs text-bodyfg">
              {down.map((p) => (
                <li key={`${p.dir}-${p.number}`}><strong>{p.number}.</strong> {p.clue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Button type="button" className="mt-6" full disabled={submitting} onClick={handleSubmit}>
        {submitting ? "Checking…" : "Submit level"}
      </Button>
    </div>
  );
}
