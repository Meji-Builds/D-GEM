"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resetAllScores } from "./actions";

export function ResetButton() {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-full border border-line px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-bodyfg transition-colors hover:border-red-800 hover:text-red-800"
      onClick={() => {
        if (confirm("Clear every score on the leaderboard? This can't be undone — use this before the event, not during.")) {
          start(async () => {
            await resetAllScores();
            router.refresh();
          });
        }
      }}
    >
      {pending ? "Clearing…" : "Reset all scores"}
    </button>
  );
}
