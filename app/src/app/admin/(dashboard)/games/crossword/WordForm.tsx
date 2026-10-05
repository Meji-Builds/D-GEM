"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveCrosswordWord, type CrosswordFormState } from "./actions";
import { Button } from "@/components/Button";

const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";
const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";

type WordInitial = { id: string; level: number; word: string; clue: string; points: number };

export function WordForm({ initial, defaultLevel }: { initial: WordInitial | null; defaultLevel: number }) {
  const [state, formAction, pending] = useActionState<CrosswordFormState, FormData>(saveCrosswordWord, {});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.push("/admin/games/crossword");
      router.refresh();
    }
  }, [state?.ok, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ""} />
      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="level">Level</label>
          <select id="level" name="level" defaultValue={initial?.level ?? defaultLevel} className={fieldClass}>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="word">Word</label>
          <input required id="word" name="word" defaultValue={initial?.word} placeholder="e.g. a speaker's name" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="points">Points</label>
          <input id="points" type="number" name="points" defaultValue={initial?.points ?? 10} className={fieldClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="clue">Note (optional — not shown to players)</label>
        <input id="clue" name="clue" defaultValue={initial?.clue} placeholder="e.g. who this is, or why it's in the pool" className={fieldClass} />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : initial ? "Save changes" : "Add word"}</Button>
    </form>
  );
}
