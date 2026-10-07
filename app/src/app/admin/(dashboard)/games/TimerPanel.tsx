"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGameDuration, resetAllGameTimers, resetPlayerTimer, type GamesFormState } from "./actions";

const fieldClass = "h-10 rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

export function TimerPanel({ gameDurationMinutes }: { gameDurationMinutes: number }) {
  const router = useRouter();
  const [durationState, durationAction, durationPending] = useActionState<GamesFormState, FormData>(updateGameDuration, {});
  const [resetState, resetAction, resetPending] = useActionState<GamesFormState, FormData>(resetPlayerTimer, {});
  const [resettingAll, startResetAll] = useTransition();

  return (
    <div className="rounded-2xl border border-line p-5">
      <div className="font-display text-base font-extrabold">Game timer</div>
      <p className="mt-1 text-xs text-mutefg">
        One countdown covers riddles + word search together. While still testing, use the resets below to replay without
        waiting it out.
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        <form action={durationAction} className="sm:col-span-1">
          <label className={labelClass} htmlFor="gameDurationMinutes">Duration (minutes)</label>
          <div className="flex gap-2">
            <input
              id="gameDurationMinutes"
              name="gameDurationMinutes"
              type="number"
              min={1}
              max={120}
              defaultValue={gameDurationMinutes}
              className={`${fieldClass} w-20`}
            />
            <button
              type="submit"
              disabled={durationPending}
              className="rounded-lg border border-ink px-3 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white disabled:opacity-50"
            >
              {durationPending ? "Saving…" : "Save"}
            </button>
          </div>
          {durationState?.error && <p className="mt-1.5 text-[10px] font-semibold text-red-800">{durationState.error}</p>}
          {durationState?.ok && <p className="mt-1.5 text-[10px] font-semibold text-bodyfg">Applies to timers started from now on.</p>}
        </form>

        <form action={resetAction} className="sm:col-span-1">
          <label className={labelClass} htmlFor="ticketId">Reset one player&apos;s timer</label>
          <div className="flex gap-2">
            <input id="ticketId" name="ticketId" placeholder="Ticket ID" className={`${fieldClass} flex-1`} />
            <button
              type="submit"
              disabled={resetPending}
              className="shrink-0 rounded-lg border border-ink px-3 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white disabled:opacity-50"
            >
              {resetPending ? "…" : "Reset"}
            </button>
          </div>
          {resetState?.error && <p className="mt-1.5 text-[10px] font-semibold text-red-800">{resetState.error}</p>}
          {resetState?.ok && <p className="mt-1.5 text-[10px] font-semibold text-bodyfg">Fresh countdown starts next time they open a game.</p>}
        </form>

        <div className="sm:col-span-1">
          <label className={labelClass}>Reset everyone</label>
          <button
            type="button"
            disabled={resettingAll}
            className="h-10 w-full rounded-lg border border-line text-[10px] font-bold uppercase tracking-wider text-bodyfg transition-colors hover:border-red-800 hover:text-red-800 disabled:opacity-50"
            onClick={() => {
              if (confirm("Clear every player's timer? Everyone's countdown restarts the next time they open a game.")) {
                startResetAll(async () => {
                  await resetAllGameTimers();
                  router.refresh();
                });
              }
            }}
          >
            {resettingAll ? "Clearing…" : "Reset all players' timers"}
          </button>
        </div>
      </div>
    </div>
  );
}
