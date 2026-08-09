"use client";

import { useActionState, useState } from "react";
import { updateConvener, type FormState } from "./actions";
import { Button } from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";

const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";

export function ConvenerForm({
  initial,
}: {
  initial: {
    name: string;
    title: string;
    note: string;
    photoUrl: string | null;
    whatsappNumber: string;
    whatsappMessage: string;
  };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateConvener, {});
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-[100px_1fr]">
      <div>
        {preview || initial.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview ?? initial.photoUrl!} alt={initial.name} className="h-20 w-20 rounded-full border border-line object-cover" />
        ) : (
          <div className="placeholder-fill flex h-20 w-20 items-center justify-center rounded-full border border-line text-center text-[8px] font-bold uppercase text-mutefg">
            Upload photo
          </div>
        )}
        <ImageInput
          name="photo"
          className="mt-2 w-20 text-[9px]"
          onChange={(file) => setPreview(file ? URL.createObjectURL(file) : null)}
        />
      </div>
      <div className="space-y-2">
        {state?.ok && <div className="text-xs font-semibold text-gold">Convener updated.</div>}
        <input name="name" defaultValue={initial.name} placeholder="Name" className={fieldClass} />
        <input name="title" defaultValue={initial.title} placeholder="Title" className={fieldClass} />
        <textarea name="note" defaultValue={initial.note} rows={2} placeholder="Welcome note" className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
        <div className="grid gap-2 border-t border-hair pt-2 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase text-mutefg">
              WhatsApp number (with country code, digits only)
            </label>
            <input
              name="whatsappNumber"
              defaultValue={initial.whatsappNumber}
              placeholder="2348012345678"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase text-mutefg">
              Pre-filled message
            </label>
            <input
              name="whatsappMessage"
              defaultValue={initial.whatsappMessage}
              placeholder="Hi! I have a question about D-GEM..."
              className={fieldClass}
            />
          </div>
        </div>
        <p className="text-[10px] text-mutefg">
          When set, a &quot;Connect with {initial.title || initial.name.split(" ")[0] || "the host"}&quot; button appears under the welcome note on the homepage, opening WhatsApp with this message ready to send. Uses the Title above if set, otherwise the first name.
        </p>
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save convener"}</Button>
      </div>
    </form>
  );
}
