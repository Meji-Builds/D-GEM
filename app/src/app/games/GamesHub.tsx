"use client";

import { useActionState, useEffect, useTransition } from "react";
import Link from "next/link";
import { verifyPlayer, clearPlayerCookie, type VerifyPlayerState } from "./actions";
import { useGamePlayer } from "./useGamePlayer";
import { Button } from "@/components/Button";

export function GamesHub() {
  const { player, savePlayer, clearPlayer } = useGamePlayer();
  const [state, formAction, pending] = useActionState<VerifyPlayerState, FormData>(verifyPlayer, {});
  const [clearing, startClear] = useTransition();

  useEffect(() => {
    if (state?.ticketId && state.fullName) {
      queueMicrotask(() => savePlayer({ ticketId: state.ticketId!, fullName: state.fullName! }));
    }
    // `state` is a fresh object on every action dispatch, including repeat
    // submissions with identical values — depend on the object itself, not
    // its fields, so re-entering the same ticket after "Not you?" still works.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function switchPlayer() {
    startClear(async () => {
      await clearPlayerCookie();
      clearPlayer();
    });
  }

  if (player === undefined) return null;

  if (!player) {
    return (
      <div className="mx-auto max-w-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Networking session</p>
        <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight">D-GEM Games</h1>
        <p className="mt-3 text-sm leading-relaxed text-bodyfg">
          Riddles and a word search, both about D-GEM. Enter your ticket ID (or the email you registered with) to play —
          your score goes on the leaderboard under your name.
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
