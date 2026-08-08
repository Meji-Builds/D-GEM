"use client";

import { useActionState } from "react";
import { adminLogin, type LoginState } from "./actions";
import { Button } from "@/components/Button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(adminLogin, {});
  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="email">
          Email
        </label>
        <input required id="email" type="email" name="email" className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none" placeholder="admin@dgem.org" />
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg" htmlFor="password">
          Password
        </label>
        <input required id="password" type="password" name="password" className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <Button type="submit" full disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
