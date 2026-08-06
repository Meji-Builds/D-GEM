"use client";

import { useActionState, useState } from "react";
import { updateEventSettings, type FormState } from "./actions";
import { Button } from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";

const fieldClass = "h-10 w-full border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

type Initial = {
  name: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  registrationState: string;
  aboutText: string;
  missionText: string;
  visionText: string;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  twitterUrl: string;
  movementPhotoUrl: string | null;
};

export function EventDetailsForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateEventSettings, {});
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">{state.error}</div>
      )}
      {state?.ok && (
        <div className="border border-gold bg-gold/20 px-3 py-2 text-xs font-semibold">Event details updated.</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Event name</label>
          <input id="name" name="name" defaultValue={initial.name} className={fieldClass} required />
        </div>
        <div>
          <label className={labelClass} htmlFor="eventDate">Date</label>
          <input id="eventDate" type="date" name="eventDate" defaultValue={initial.eventDate} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="startTime">Start time</label>
          <input id="startTime" name="startTime" defaultValue={initial.startTime} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="endTime">End time</label>
          <input id="endTime" name="endTime" defaultValue={initial.endTime} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="venue">Venue</label>
          <input id="venue" name="venue" defaultValue={initial.venue} className={fieldClass} required />
        </div>
        <div>
          <label className={labelClass} htmlFor="capacity">Capacity</label>
          <input id="capacity" type="number" name="capacity" defaultValue={initial.capacity} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="registrationState">Registration</label>
          <select id="registrationState" name="registrationState" defaultValue={initial.registrationState} className={fieldClass}>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="contactEmail">Contact email</label>
          <input id="contactEmail" name="contactEmail" defaultValue={initial.contactEmail} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactPhone">Contact phone</label>
          <input id="contactPhone" name="contactPhone" defaultValue={initial.contactPhone} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="instagramUrl">Instagram URL</label>
          <input id="instagramUrl" name="instagramUrl" defaultValue={initial.instagramUrl} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="twitterUrl">X / Twitter URL</label>
          <input id="twitterUrl" name="twitterUrl" defaultValue={initial.twitterUrl} className={fieldClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="aboutText">About the movement</label>
        <textarea id="aboutText" name="aboutText" rows={3} defaultValue={initial.aboutText} className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
        {preview || initial.movementPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview ?? initial.movementPhotoUrl!} alt="Movement" className="h-28 w-full border border-line object-cover" />
        ) : (
          <div className="placeholder-fill flex h-28 w-full items-center justify-center border border-line text-center text-[9px] font-bold uppercase tracking-wider text-mutefg">
            No photo yet
          </div>
        )}
        <div>
          <label className={labelClass} htmlFor="movementPhoto">Movement photo (shown in the About section)</label>
          <ImageInput
            name="movementPhoto"
            className="w-full text-[10px]"
            onChange={(file) => setPreview(file ? URL.createObjectURL(file) : null)}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="missionText">Mission</label>
          <textarea id="missionText" name="missionText" rows={3} defaultValue={initial.missionText} className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
        </div>
        <div>
          <label className={labelClass} htmlFor="visionText">Vision</label>
          <textarea id="visionText" name="visionText" rows={3} defaultValue={initial.visionText} className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
        </div>
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Update event"}</Button>
    </form>
  );
}
