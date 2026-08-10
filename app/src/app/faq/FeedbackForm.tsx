"use client";

import { useActionState, useState } from "react";
import { submitFeedback, type FeedbackState } from "./actions";
import { Button } from "@/components/Button";

export function FeedbackForm() {
  const [state, formAction, pending] = useActionState<FeedbackState, FormData>(submitFeedback, {});
  const [rating, setRating] = useState(0);

  if (state?.ok) {
    return <p className="text-sm font-semibold">Thanks for the feedback. It helps us improve Conference 2.0.</p>;
  }

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-3 rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            className={`h-9 w-9 rounded-full border text-xs font-bold transition-colors ${
              rating === n ? "border-gold bg-gold" : "border-ink hover:bg-mist"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={rating} />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="name">
            Name (optional)
          </label>
          <input id="name" name="name" className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none" placeholder="Leave blank to stay anonymous" />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="role">
            School / role (optional)
          </label>
          <input id="role" name="role" className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none" placeholder="e.g. 300L, Physics, OOU" />
        </div>
      </div>
      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="testimonial">
          Sum up your experience
        </label>
        <p className="mb-1.5 text-[10px] text-mutefg">
          May be shown publicly as a testimonial if the team picks it — leave blank to keep your feedback private.
        </p>
        <textarea id="testimonial" name="testimonial" rows={2} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" placeholder="D-GEM gave me..." />
      </div>
      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="bestSession">
          Best session
        </label>
        <input id="bestSession" name="bestSession" className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none" placeholder="e.g. Keynote: Building before you're ready" />
      </div>
      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="improvement">
          What should we improve?
        </label>
        <textarea id="improvement" name="improvement" rows={3} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <div className="mt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting…" : "Submit feedback"}
        </Button>
      </div>
    </form>
  );
}
