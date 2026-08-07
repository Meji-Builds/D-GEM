"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveAgendaItem, type AgendaFormState } from "./actions";
import { Button } from "@/components/Button";

const fieldClass = "h-10 w-full border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

type AgendaInitial = {
  id: string;
  time: string;
  durationMin: number;
  title: string;
  description: string;
  order: number;
  speakerIds: string[];
};

export function AgendaForm({
  initial,
  speakers,
}: {
  initial: AgendaInitial | null;
  speakers: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<AgendaFormState, FormData>(saveAgendaItem, {});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.push("/admin/agenda");
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
      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <label className={labelClass} htmlFor="time">Time</label>
          <input required id="time" name="time" defaultValue={initial?.time} placeholder="09:00" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="durationMin">Duration (min)</label>
          <input id="durationMin" type="number" name="durationMin" defaultValue={initial?.durationMin ?? 30} className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="title">Title</label>
          <input required id="title" name="title" defaultValue={initial?.title} className={fieldClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={2} defaultValue={initial?.description} className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <div>
        <label className={labelClass} htmlFor="order">Order (lower shows first)</label>
        <input id="order" type="number" name="order" defaultValue={initial?.order ?? 0} className={`${fieldClass} sm:w-32`} />
      </div>
      {speakers.length > 0 && (
        <div>
          <label className={labelClass}>Speakers on this session</label>
          <div className="flex flex-wrap gap-3">
            {speakers.map((s) => (
              <label key={s.id} className="flex items-center gap-1.5 text-xs text-bodyfg">
                <input
                  type="checkbox"
                  name="speakerIds"
                  value={s.id}
                  defaultChecked={initial?.speakerIds.includes(s.id)}
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      )}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : initial ? "Save changes" : "Add to agenda"}</Button>
    </form>
  );
}
