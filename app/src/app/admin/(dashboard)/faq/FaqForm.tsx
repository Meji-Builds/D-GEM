"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveFaqItem, type FaqFormState } from "./actions";
import { Button } from "@/components/Button";

const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

type FaqInitial = { id: string; question: string; answer: string; order: number };

export function FaqForm({ initial }: { initial: FaqInitial | null }) {
  const [state, formAction, pending] = useActionState<FaqFormState, FormData>(saveFaqItem, {});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.push("/admin/faq");
      router.refresh();
    }
  }, [state?.ok, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ""} />
      {state?.error && (
        <div className="border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}
      <div>
        <label className={labelClass} htmlFor="question">Question</label>
        <input
          required
          id="question"
          name="question"
          defaultValue={initial?.question}
          className="h-10 w-full border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="answer">Answer</label>
        <textarea
          required
          id="answer"
          name="answer"
          rows={3}
          defaultValue={initial?.answer}
          className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none"
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="order">Order (lower shows first)</label>
        <input
          id="order"
          type="number"
          name="order"
          defaultValue={initial?.order ?? 0}
          className="h-10 w-32 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : initial ? "Save changes" : "Add question"}</Button>
    </form>
  );
}
