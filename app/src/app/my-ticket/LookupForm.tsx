"use client";

import { useActionState } from "react";
import { lookupTicket, type LookupState } from "./actions";
import { Button } from "@/components/Button";

export function LookupForm() {
  const [state, formAction, pending] = useActionState<LookupState, FormData>(lookupTicket, {});
  return (
    <form action={formAction} className="mt-6 space-y-3">
      {state?.error && (
        <div className="border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <input
        name="query"
        required
        placeholder="Ticket ID (DGEM-1.0-xxxxxx) or email"
        className="h-11 w-full border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Looking up…" : "Find my ticket"}
      </Button>
    </form>
  );
}
