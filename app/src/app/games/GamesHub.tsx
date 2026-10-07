"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { verifyPlayer, clearPlayerCookie, type VerifyPlayerState } from "./actions";
import { Button } from "@/components/Button";
import { GameTimer } from "./GameTimer";
import { gameDeadline } from "@/lib/gameLevels";

type Player = { ticketId: string; fullName: string; gameStartedAt: string; gameDurationMs: number };

export function GamesHub({ initialPlayer, gameDurationMinutes }: { initialPlayer: Player | null; gameDurationMinutes: number }) {
  const [state, formAction, pending] = useActionState<VerifyPlayerState, FormData>(verifyPlayer, {});
  const [cleared, setCleared] = useState(false);
  const [clearing, startClear] = useTransition();

  const verified: Player | null =
    state?.ticketId && state.fullName && state.gameStartedAt && state.gameDurationMs
      ? { ticketId: state.ticketId, fullName: state.fullName, gameStartedAt: state.gameStartedAt, gameDurationMs: state.gameDurationMs }
      : null;

  // `state` is a fresh object on every action dispatch, including repeat
  // submissions with identical values, so a successful re-verify always
  // clears "Not you?"'s override. The setState is queued (not called
  // synchronously in the effect body) per react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!state?.ticketId) return;
    queueMicrotask(() => setCleared(false));
  }, [state]);

  // `cleared` (from "Not you?") always wins until the next successful
  // verify, even over an already-verified `state` from earlier this
  // session — otherwise clicking "Not you?" wouldn't do anything once
  // someone had verified once.
  const player = cleared ? null : verified ?? initialPlayer;

  function switchPlayer() {
    setCleared(true);
    startClear(async () => {
      await clearPlayerCookie();
    });
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-sm">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">D-GEM Games</h1>
        <p className="mt-3 text-sm leading-relaxed text-bodyfg">
          Riddles and a word search, both about D-GEM. Enter your ticket ID (or the email you registered with) to play —
          your score goes on the leaderboard under your name. You&apos;ll get {gameDurationMinutes} minute{gameDurationMinutes === 1 ? "" : "s"},
          starting the moment you start playing, to get through everything.
        </p>
        <form action={formAction} className="mt-6 space-y-3">
          {state?.error && (
            <div className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">{state.error}</div>
          )}
          <input
            required
            name="query"
            placeholder="Ticket ID or email"
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
          />
          <Button type="submit" full disabled={pending}>{pending ? "Checking…" : "Start playing"}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <GameTimer deadline={gameDeadline(player.gameStartedAt, player.gameDurationMs)} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Welcome</p>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">{player.fullName.split(" ")[0]}, let&apos;s play.</h1>
      <p className="mt-2 text-xs text-mutefg">
        Playing as {player.fullName}.{" "}
        <button type="button" onClick={switchPlayer} disabled={clearing} className="underline hover:text-gold">Not you?</button>
      </p>

      <div className="mt-6 space-y-3">
        <Link href="/games/riddles" className="block rounded-2xl border-2 border-ink p-5 transition-colors hover:bg-mist">
          <div className="font-display text-lg font-extrabold">Riddles</div>
          <p className="mt-1 text-xs text-mutefg">Three rounds, each harder than the last.</p>
        </Link>
        <Link href="/games/crossword" className="block rounded-2xl border-2 border-ink p-5 transition-colors hover:bg-mist">
          <div className="font-display text-lg font-extrabold">Word Search</div>
          <p className="mt-1 text-xs text-mutefg">Speaker names, the theme, and more — find them all.</p>
        </Link>
        <Link href="/games/leaderboard" className="block rounded-2xl border border-line p-4 text-center transition-colors hover:bg-mist">
          <span className="text-xs font-bold uppercase tracking-widest text-mutefg">View leaderboard</span>
        </Link>
      </div>
    </div>
  );
}
