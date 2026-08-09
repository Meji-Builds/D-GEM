"use client";

import { useActionState } from "react";
import { updateTierPerks, type FormState } from "./actions";
import { Button } from "@/components/Button";

const fieldClass = "w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

type Initial = { goldPerks: string; silverPerks: string; bronzePerks: string };

export function TierPerksForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateTierPerks, {});

  return (
    <form action={formAction} className="space-y-3">
      {state?.ok && <div className="text-xs font-semibold text-gold">Tiers updated.</div>}
      <p className="text-[10px] text-mutefg">One perk per line — each line becomes a bullet on the Sponsorship page.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="goldPerks">Gold</label>
          <textarea id="goldPerks" name="goldPerks" rows={5} defaultValue={initial.goldPerks} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="silverPerks">Silver</label>
          <textarea id="silverPerks" name="silverPerks" rows={5} defaultValue={initial.silverPerks} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bronzePerks">Bronze</label>
          <textarea id="bronzePerks" name="bronzePerks" rows={5} defaultValue={initial.bronzePerks} className={fieldClass} />
        </div>
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save tiers"}</Button>
    </form>
  );
}
