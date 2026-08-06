"use client";

import { useActionState } from "react";
import { submitSponsorshipEnquiry, type SponsorshipState } from "./actions";
import { Button } from "@/components/Button";

const fieldClass =
  "h-11 w-full border border-line bg-white px-3 text-sm placeholder:text-mutefg focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState<SponsorshipState, FormData>(
    submitSponsorshipEnquiry,
    {}
  );

  if (state?.ok) {
    return (
      <div className="border-2 border-ink bg-mist p-6 text-sm">
        Thanks, your enquiry has been sent. The D-GEM partnerships team will reach out shortly.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="company">Company</label>
          <input required id="company" name="company" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactName">Contact person</label>
          <input required id="contactName" name="contactName" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="s-email">Email</label>
          <input required id="s-email" type="email" name="email" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="tier">Tier of interest</label>
          <select id="tier" name="tier" className={fieldClass}>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="BRONZE">Bronze</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={3} className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
