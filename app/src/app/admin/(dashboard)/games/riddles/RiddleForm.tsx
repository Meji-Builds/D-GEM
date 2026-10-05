"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveRiddle, type RiddleFormState } from "./actions";
import { Button } from "@/components/Button";

const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";
const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";

type RiddleInitial = { id: string; level: number; question: string; answer: string; points: number };

export function RiddleForm({ initial, defaultLevel }: { initial: RiddleInitial | null; defaultLevel: number }) {
  const [state, formAction, pending] = useActionState<RiddleFormState, FormData>(saveRiddle, {});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.push("/admin/games/riddles");
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="level">Level</label>
          <select id="level" name="level" defaultValue={initial?.level ?? defaultLevel} className={fieldClass}>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="points">Points</label>
          <input id="points" type="number" name="points" defaultValue={initial?.points ?? 10} className={fieldClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="question">Riddle</label>
        <textarea required id="question" name="question" rows={3} defaultValue={initial?.question} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <div>
        <label className={labelClass} htmlFor="answer">Answer</label>
        <input required id="answer" name="answer" defaultValue={initial?.answer} className={fieldClass} />
        <p className="mt-1 text-[10px] text-mutefg">Matched case-insensitively, extra spaces ignored.</p>
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : initial ? "Save changes" : "Add riddle"}</Button>
    </form>
  );
}
