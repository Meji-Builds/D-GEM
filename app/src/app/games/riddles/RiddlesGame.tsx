"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitLevelScore } from "../actions";
import { Button } from "@/components/Button";

type Riddle = { id: string; question: string; answer: string; points: number };
type Player = { ticketId: string; fullName: string };

function normalizeAnswer(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function RiddlesGame({ player, riddlesByLevel }: { player: Player; riddlesByLevel: Record<number, Riddle[]> }) {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; maxScore: number; correctIds: string[] } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [totals, setTotals] = useState<Record<number, number>>({});

  const current = riddlesByLevel[level] ?? [];
  const maxScore = current.reduce((sum, r) => sum + r.points, 0);

  if (current.length === 0 && !result) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-sm text-mutefg">Level {level} isn&apos;t ready yet — check back soon.</p>
      </div>
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    let score = 0;
    const correctIds: string[] = [];
    for (const r of current) {
      if (normalizeAnswer(inputs[r.id] ?? "") === normalizeAnswer(r.answer)) {
        score += r.points;
        correctIds.push(r.id);
      }
    }
    await submitLevelScore(player.ticketId, "RIDDLES", level, score, maxScore);
    setResult({ score, maxScore, correctIds });
    setTotals((t) => ({ ...t, [level]: score }));
    setSubmitting(false);
  }

  function nextLevel() {
    setLevel((l) => l + 1);
    setInputs({});
    setResult(null);
  }

  if (result) {
    const isLastLevel = level >= 3 || !riddlesByLevel[level + 1]?.length;
    const runningTotal = Object.values({ ...totals, [level]: result.score }).reduce((a, b) => a + b, 0);
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Level {level} complete</p>
        <div className="font-display mt-2 text-3xl font-extrabold">{result.score}/{result.maxScore}</div>
        <p className="mt-2 text-xs text-mutefg">Running total: {runningTotal} points</p>
        <div className="mt-6">
          {isLastLevel ? (
            <>
              <p className="text-sm font-semibold">That&apos;s all the riddles — nice work!</p>
              <Button type="button" className="mt-4" full onClick={() => router.push("/games/leaderboard")}>View leaderboard</Button>
            </>
          ) : (
            <Button type="button" full onClick={nextLevel}>Next level →</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Riddles · Level {level} of 3</p>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">Answer what you can</h1>
      <div className="mt-6 space-y-5">
        {current.map((r, i) => (
          <div key={r.id}>
            <label className="mb-1.5 block text-sm font-bold" htmlFor={`riddle-${r.id}`}>
              {i + 1}. {r.question} <span className="text-xs font-normal text-mutefg">({r.points} pts)</span>
            </label>
            <input
              id={`riddle-${r.id}`}
              value={inputs[r.id] ?? ""}
              onChange={(e) => setInputs((v) => ({ ...v, [r.id]: e.target.value }))}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
              placeholder="Your answer"
            />
          </div>
        ))}
      </div>
      <Button type="button" className="mt-6" full disabled={submitting} onClick={handleSubmit}>
        {submitting ? "Checking…" : "Submit level"}
      </Button>
    </div>
  );
}
