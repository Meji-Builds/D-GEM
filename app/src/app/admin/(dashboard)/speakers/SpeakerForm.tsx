"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSpeaker, type SpeakerFormState } from "./actions";
import { Button } from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";

const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

type SpeakerInitial = {
  id: string;
  name: string;
  role: string;
  organisation: string;
  session: string;
  bio: string;
  linkedinUrl: string;
  socialUrl: string;
  photoUrl: string | null;
};

export function SpeakerForm({ initial }: { initial: SpeakerInitial | null }) {
  const [state, formAction, pending] = useActionState<SpeakerFormState, FormData>(saveSpeaker, {});
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.push("/admin/speakers");
      router.refresh();
    }
  }, [state?.ok, router]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-[130px_1fr]">
      <input type="hidden" name="id" defaultValue={initial?.id ?? ""} />
      <div>
        {preview || initial?.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview ?? initial!.photoUrl!} alt={initial?.name ?? "Preview"} className="h-28 w-full rounded-xl border border-line object-cover" />
        ) : (
          <div className="placeholder-fill flex h-28 w-full items-center justify-center rounded-xl border border-line text-center text-[9px] font-bold uppercase tracking-wider text-mutefg">
            Drop photo
            <br />
            or browse
          </div>
        )}
        <ImageInput
          name="photo"
          className="mt-2 w-full text-[10px]"
          onChange={(file) => setPreview(file ? URL.createObjectURL(file) : null)}
        />
        <p className="mt-1 text-[10px] text-mutefg">Photos are compressed automatically on upload.</p>
      </div>
      <div className="space-y-3">
        {state?.error && (
          <div className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
            {state.error}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Full name</label>
            <input required id="name" name="name" defaultValue={initial?.name} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="role">Role / Title</label>
            <input id="role" name="role" defaultValue={initial?.role} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="organisation">Organisation</label>
            <input id="organisation" name="organisation" defaultValue={initial?.organisation} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="session">Session</label>
            <input id="session" name="session" defaultValue={initial?.session} className={fieldClass} placeholder="Session 1 · Keynote" />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="bio">Biography</label>
          <textarea id="bio" name="bio" rows={3} defaultValue={initial?.bio} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="linkedinUrl">LinkedIn</label>
            <input id="linkedinUrl" name="linkedinUrl" defaultValue={initial?.linkedinUrl} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="socialUrl">X / Instagram</label>
            <input id="socialUrl" name="socialUrl" defaultValue={initial?.socialUrl} className={fieldClass} />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <Button type="submit" name="intent" value="publish" disabled={pending}>
            {pending ? "Saving…" : "Save & publish"}
          </Button>
          <Button type="submit" name="intent" value="draft" variant="outline" disabled={pending}>
            Save draft
          </Button>
        </div>
      </div>
    </form>
  );
}
