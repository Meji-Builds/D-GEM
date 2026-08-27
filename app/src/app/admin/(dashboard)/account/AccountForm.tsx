"use client";

import { useActionState } from "react";
import { updateAccount, type AccountState } from "./actions";
import { Button } from "@/components/Button";

const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

export function AccountForm({ initial }: { initial: { name: string; email: string } }) {
  const [state, formAction, pending] = useActionState<AccountState, FormData>(updateAccount, {});

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg border border-gold bg-gold/20 px-3 py-2 text-xs font-semibold">Account updated.</div>
      )}
      <div>
        <label className={labelClass} htmlFor="name">Name</label>
        <input id="name" name="name" defaultValue={initial.name} className={fieldClass} required />
      </div>
      <div>
        <label className={labelClass} htmlFor="email">Email</label>
        <input id="email" type="email" name="email" defaultValue={initial.email} className={fieldClass} required />
        <p className="mt-1 text-[10px] text-mutefg">This is also what you sign in with.</p>
      </div>

      <div className="border-t border-hair pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Change password (optional)</p>
        <div className="mt-3 space-y-3">
          <div>
            <label className={labelClass} htmlFor="newPassword">New password</label>
            <input id="newPassword" type="password" name="newPassword" className={fieldClass} placeholder="Leave blank to keep current password" autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass} htmlFor="confirmPassword">Confirm new password</label>
            <input id="confirmPassword" type="password" name="confirmPassword" className={fieldClass} autoComplete="new-password" />
          </div>
        </div>
      </div>

      <div className="border-t border-hair pt-4">
        <label className={labelClass} htmlFor="currentPassword">Current password</label>
        <input id="currentPassword" type="password" name="currentPassword" className={fieldClass} required autoComplete="current-password" />
        <p className="mt-1 text-[10px] text-mutefg">Required to confirm any change on this page.</p>
      </div>

      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
