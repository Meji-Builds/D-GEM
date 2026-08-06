"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveSponsor, type FormState } from "./actions";
import { Button } from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";

const fieldClass = "h-10 w-full border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";

export function SponsorForm({
  initial,
  onDone,
}: {
  initial: { id: string; name: string; tier: string; url: string } | null;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveSponsor, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setPreview(null);
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.ok]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ""} />
      <div>
        <label className="mb-1 block text-[9px] font-bold uppercase text-mutefg">Name</label>
        <input required name="name" defaultValue={initial?.name} className={fieldClass} />
      </div>
      <div>
        <label className="mb-1 block text-[9px] font-bold uppercase text-mutefg">Tier</label>
        <select name="tier" defaultValue={initial?.tier ?? "GOLD"} className={fieldClass}>
          <option value="GOLD">Gold</option>
          <option value="SILVER">Silver</option>
          <option value="BRONZE">Bronze</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[9px] font-bold uppercase text-mutefg">Link</label>
        <input name="url" defaultValue={initial?.url} className={fieldClass} placeholder="https://" />
      </div>
      <div>
        <label className="mb-1 block text-[9px] font-bold uppercase text-mutefg">Logo</label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Logo preview" className="mb-1 h-8 w-14 border border-line object-contain" />
        )}
        <ImageInput
          name="logo"
          className="h-10 text-[10px]"
          onChange={(file) => setPreview(file ? URL.createObjectURL(file) : null)}
        />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : initial ? "Save" : "Add sponsor"}</Button>
    </form>
  );
}
