"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitLevelScore } from "../actions";
import { Button } from "@/components/Button";
import { GameTimer } from "../GameTimer";
import { gameDeadline } from "@/lib/gameLevels";

type Riddle = { id: string; question: string; answer: string; points: number };
type Player = { ticketId: string; fullName: string; gameStartedAt: string };

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
  const [expired, setExpired] = useState(false);
  const autoSubmittedRef = useRef(false);

  const current = riddlesByLevel[level] ?? [];
  const maxScore = current.reduce((sum, r) => sum + r.points, 0);

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

  // Deliberately not memoized: GameTimer must always call the version of
  // this closed over the latest level/inputs/result, not whatever was
  // current when the timer first mounted.
  function handleExpire() {
    setExpired(true);
    if (!autoSubmittedRef.current && !result) {
      autoSubmittedRef.current = true;
      handleSubmit();
    }
  }

  if (expired) {
    const runningTotal = Object.values(totals).reduce((a, b) => a + b, 0);
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-red-800">Time&apos;s up</p>
        <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">That&apos;s the 5 minutes!</h1>
        <p className="mt-2 text-xs text-mutefg">Running total: {runningTotal} points</p>
        <Button type="button" className="mt-6" full onClick={() => router.push("/games/leaderboard")}>View leaderboard</Button>
      </div>
    );
  }

  if (current.length === 0 && !result) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <GameTimer deadline={gameDeadline(player.gameStartedAt)} onExpire={handleExpire} />
        <p className="text-sm text-mutefg">Level {level} isn&apos;t ready yet — check back soon.</p>
      </div>
    );
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
        <GameTimer deadline={gameDeadline(player.gameStartedAt)} onExpire={handleExpire} />
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
      <GameTimer deadline={gameDeadline(player.gameStartedAt)} onExpire={handleExpire} />
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
