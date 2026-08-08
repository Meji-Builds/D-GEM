"use client";

import { useActionState } from "react";
import { registerAttendee, type RegisterState } from "./actions";
import { Button } from "@/components/Button";
import { LevelField } from "@/components/LevelField";

const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-mutefg transition-colors focus:border-ink focus:outline-none";
const labelClass =
  "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerAttendee,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="animate-fade-in-up rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">Full name</label>
          <input required id="fullName" name="fullName" className={fieldClass} placeholder="Jane Doe" />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input required id="email" type="email" name="email" className={fieldClass} placeholder="you@email.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone number</label>
          <input required id="phone" name="phone" className={fieldClass} placeholder="+234…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="school">School / University</label>
          <input required id="school" name="school" className={fieldClass} placeholder="Olabisi Onabanjo University" />
        </div>
        <LevelField id="level" name="level" required />
        <div>
          <label className={labelClass} htmlFor="department">Department</label>
          <input required id="department" name="department" className={fieldClass} placeholder="Mass Communication" />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="howHeard">How did you hear about D-GEM? (optional)</label>
        <input id="howHeard" name="howHeard" className={fieldClass} placeholder="Instagram, a friend, campus fellowship…" />
      </div>
      <label className="flex items-start gap-2 text-xs text-bodyfg">
        <input type="checkbox" name="consentReminders" className="mt-0.5 h-3.5 w-3.5 rounded accent-ink" />
        I agree to receive event reminders by email and SMS.
      </label>
      <Button type="submit" full disabled={pending}>
        {pending ? "Submitting…" : "Complete registration"}
      </Button>
      <p className="text-xs text-mutefg">Your QR invitation is emailed instantly.</p>
    </form>
  );
}
