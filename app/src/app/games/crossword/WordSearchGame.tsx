"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitLevelScore } from "../actions";
import { Button } from "@/components/Button";
import type { WordSearchResult } from "@/lib/wordsearch";

type Player = { ticketId: string; fullName: string };
type Cell = { r: number; c: number };

const DIRECTION_VECTORS: Record<string, [number, number]> = {
  E: [0, 1], W: [0, -1], N: [-1, 0], S: [1, 0], NE: [-1, 1], NW: [-1, -1], SE: [1, 1], SW: [1, -1],
};

function cellsForPlacement(placement: WordSearchResult["placements"][number]): string[] {
  const [dr, dc] = DIRECTION_VECTORS[placement.dir];
  const cells: string[] = [];
  for (let i = 0; i < placement.word.length; i++) {
    cells.push(`${placement.row + dr * i},${placement.col + dc * i}`);
  }
  return cells;
}

function selectionPath(start: Cell, end: Cell): string[] | null {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  if (dr === 0 && dc === 0) return null;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) return null; // not a straight 8-direction line
  const stepR = Math.sign(dr);
  const stepC = Math.sign(dc);
  const cells: string[] = [];
  for (let i = 0; i <= steps; i++) cells.push(`${start.r + stepR * i},${start.c + stepC * i}`);
  return cells;
}

export function WordSearchGame({ player, puzzlesByLevel }: { player: Player; puzzlesByLevel: Record<number, WordSearchResult | null> }) {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [start, setStart] = useState<Cell | null>(null);
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<string[] | null>(null);
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [totals, setTotals] = useState<Record<number, number>>({});

  const puzzle = puzzlesByLevel[level];
  const maxScore = puzzle ? puzzle.placements.reduce((sum, p) => sum + p.points, 0) : 0;
  const score = puzzle ? puzzle.placements.filter((p) => foundIds.has(p.id)).reduce((sum, p) => sum + p.points, 0) : 0;

  if (!puzzle || puzzle.placements.length === 0) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-sm text-mutefg">Level {level} isn&apos;t ready yet — check back soon.</p>
      </div>
    );
  }

  function handleCellClick(r: number, c: number) {
    if (!puzzle) return;
    if (!start) {
      setStart({ r, c });
      return;
    }
    const path = selectionPath(start, { r, c });
    setStart(null);
    if (!path) return;

    const match = puzzle.placements.find((p) => {
      if (foundIds.has(p.id)) return false;
      const cells = cellsForPlacement(p);
      return cells.length === path.length && (cells.join("|") === path.join("|") || [...cells].reverse().join("|") === path.join("|"));
    });

    if (match) {
      setFoundIds((prev) => new Set(prev).add(match.id));
    } else {
      setFlash(path);
      setTimeout(() => setFlash(null), 400);
    }
  }

  async function finishLevel() {
    setSubmitting(true);
    await submitLevelScore(player.ticketId, "CROSSWORD", level, score, maxScore);
    setResult({ score, maxScore });
    setTotals((t) => ({ ...t, [level]: score }));
    setSubmitting(false);
  }

  function nextLevel() {
    setLevel((l) => l + 1);
    setStart(null);
    setFoundIds(new Set());
    setResult(null);
  }

  if (result) {
    const isLastLevel = level >= 3 || !puzzlesByLevel[level + 1]?.placements.length;
    const runningTotal = Object.values({ ...totals, [level]: result.score }).reduce((a, b) => a + b, 0);
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Level {level} complete</p>
        <div className="font-display mt-2 text-3xl font-extrabold">{result.score}/{result.maxScore}</div>
        <p className="mt-2 text-xs text-mutefg">Running total: {runningTotal} points</p>
        <div className="mt-6">
          {isLastLevel ? (
            <>
              <p className="text-sm font-semibold">That&apos;s the whole word search — nice work!</p>
              <Button type="button" className="mt-4" full onClick={() => router.push("/games/leaderboard")}>View leaderboard</Button>
            </>
          ) : (
            <Button type="button" full onClick={nextLevel}>Next level →</Button>
          )}
        </div>
      </div>
    );
  }

  const allFound = foundIds.size === puzzle.placements.length;
  const flashSet = new Set(flash ?? []);
  const foundCellSet = new Set(puzzle.placements.filter((p) => foundIds.has(p.id)).flatMap(cellsForPlacement));

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Word Search · Level {level} of 3</p>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">Find every word</h1>
      <p className="mt-2 text-xs text-mutefg">Tap the first letter of a word, then tap its last letter.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr]">
        <div className="overflow-x-auto">
          <div className="inline-grid border-2 border-ink" style={{ gridTemplateColumns: `repeat(${puzzle.size}, 28px)` }}>
            {puzzle.grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r},${c}`;
                const isStart = start?.r === r && start?.c === c;
                const isFound = foundCellSet.has(key);
                const isFlashed = flashSet.has(key);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    className={`flex h-[28px] w-[28px] items-center justify-center border border-line text-sm font-bold uppercase transition-colors ${
                      isFound
                        ? "bg-gold text-ink"
                        : isStart
                          ? "bg-ink text-white"
                          : isFlashed
                            ? "bg-red-200 text-ink"
                            : "bg-white text-ink hover:bg-mist"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Word bank</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {puzzle.placements.map((p) => (
              <li
                key={p.id}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  foundIds.has(p.id) ? "border-gold bg-gold text-ink line-through" : "border-line text-bodyfg"
                }`}
              >
                {p.word}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold">{score}/{maxScore} points found</p>
        </div>
      </div>

      <Button type="button" className="mt-6" full disabled={submitting} onClick={finishLevel}>
        {submitting ? "Checking…" : allFound ? "Submit level" : "I'm done — submit what I have"}
      </Button>
    </div>
  );
}
