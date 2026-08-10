"use client";

import { useActionState, useState } from "react";
import { updateEventSettings, type FormState } from "./actions";
import { Button } from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";

const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

type Initial = {
  name: string;
  tagline: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  registrationState: string;
  feedbackState: string;
  heroText: string;
  aboutText: string;
  missionText: string;
  visionText: string;
  sponsorshipPitch: string;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  twitterUrl: string;
  tiktokUrl: string;
  communityUrl: string;
  mapUrl: string;
  mapEmbedUrl: string;
  movementPhotoUrl: string | null;
};

export function EventDetailsForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateEventSettings, {});
  const [preview, setPreview] = useState<string | null>(null);
  const [dateConfirmed, setDateConfirmed] = useState(Boolean(initial.eventDate));

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg border border-gold bg-gold/20 px-3 py-2 text-xs font-semibold">Event details updated.</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Event name</label>
          <input id="name" name="name" defaultValue={initial.name} className={fieldClass} required />
        </div>
        <div>
          <label className={labelClass} htmlFor="tagline">Theme</label>
          <input id="tagline" name="tagline" defaultValue={initial.tagline} className={fieldClass} placeholder="Building a life after school while still in school" />
        </div>
        <div>
          <label className={labelClass} htmlFor="eventDate">Date</label>
          <div className="mb-1.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => setDateConfirmed(true)}
              className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                dateConfirmed ? "border-gold bg-gold" : "border-ink hover:bg-mist"
              }`}
            >
              Date set
            </button>
            <button
              type="button"
              onClick={() => setDateConfirmed(false)}
              className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                !dateConfirmed ? "border-gold bg-gold" : "border-ink hover:bg-mist"
              }`}
            >
              Not yet announced
            </button>
          </div>
          <input type="hidden" name="dateConfirmed" value={dateConfirmed ? "true" : "false"} />
          {dateConfirmed ? (
            <input id="eventDate" type="date" name="eventDate" defaultValue={initial.eventDate} className={fieldClass} required />
          ) : (
            <div className="flex h-10 w-full items-center rounded-lg border border-dashed border-line bg-mist px-3 text-sm text-mutefg">
              Will show as &quot;Date to be announced&quot;
            </div>
          )}
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
          <label className={labelClass} htmlFor="feedbackState">Post-event feedback form</label>
          <select id="feedbackState" name="feedbackState" defaultValue={initial.feedbackState} className={fieldClass}>
            <option value="AUTO">Auto — opens after the event date</option>
            <option value="OPEN">Force open</option>
            <option value="CLOSED">Force closed</option>
          </select>
          <p className="mt-1 text-[10px] text-mutefg">
            Auto shows the form on the FAQ page as soon as the event date above has passed — no need to flip anything yourself. Use Force open/closed only to override that. Approve submissions under Feedback to show them as testimonials.
          </p>
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
        <div>
          <label className={labelClass} htmlFor="tiktokUrl">TikTok URL</label>
          <input id="tiktokUrl" name="tiktokUrl" defaultValue={initial.tiktokUrl} placeholder="https://tiktok.com/@dgemmovement" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="mapUrl">Campus map link</label>
          <p className="mb-1.5 text-[10px] text-mutefg">
            Google Maps link — the &quot;Open in Google Maps&quot; button under the map preview uses this.
          </p>
          <input id="mapUrl" name="mapUrl" defaultValue={initial.mapUrl} placeholder="https://maps.google.com/..." className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="mapEmbedUrl">Campus map embed (for the preview on the FAQ page)</label>
          <p className="mb-2 text-[10px] text-mutefg">
            On Google Maps: search the venue → Share → Embed a map → Copy HTML, then paste just the
            <code className="mx-1 rounded bg-mist px-1">src=&quot;...&quot;</code>
            URL from inside that code here. Without this, only the click-through link above is shown.
          </p>
          <input id="mapEmbedUrl" name="mapEmbedUrl" defaultValue={initial.mapEmbedUrl} placeholder="https://www.google.com/maps/embed?pb=..." className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="communityUrl">WhatsApp community/group link</label>
          <p className="mb-1.5 text-[10px] text-mutefg">
            Shown as a &quot;Join the D-GEM Community&quot; button on the ticket page after someone registers.
          </p>
          <input id="communityUrl" name="communityUrl" defaultValue={initial.communityUrl} placeholder="https://chat.whatsapp.com/..." className={fieldClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="heroText">Hero intro (short, top of the homepage)</label>
        <p className="mb-2 text-[10px] text-mutefg">
          Shown right under the Theme banner at the very top. Keep this different from the About text below — they display on the same page.
        </p>
        <textarea id="heroText" name="heroText" rows={3} defaultValue={initial.heroText} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <div>
        <label className={labelClass} htmlFor="aboutText">About the movement (longer, About section with photo)</label>
        <textarea id="aboutText" name="aboutText" rows={4} defaultValue={initial.aboutText} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
      </div>
      <div>
        <label className={labelClass} htmlFor="movementPhoto">Movement photo (shown in the About section)</label>
        <p className="mb-2 text-[10px] text-mutefg">
          Can be a full flyer or poster — it&apos;s shown in full, not cropped to a square.
        </p>
        <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
          {preview || initial.movementPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview ?? initial.movementPhotoUrl!} alt="Movement" className="aspect-[4/5] w-full max-w-[200px] rounded-xl border border-line bg-mist object-contain" />
          ) : (
            <div className="placeholder-fill flex aspect-[4/5] w-full max-w-[200px] items-center justify-center rounded-xl border border-line text-center text-[9px] font-bold uppercase tracking-wider text-mutefg">
              No photo yet
            </div>
          )}
          <ImageInput
            name="movementPhoto"
            className="w-full self-start text-[10px]"
            onChange={(file) => setPreview(file ? URL.createObjectURL(file) : null)}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="missionText">Mission</label>
          <textarea id="missionText" name="missionText" rows={3} defaultValue={initial.missionText} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
        </div>
        <div>
          <label className={labelClass} htmlFor="visionText">Vision</label>
          <textarea id="visionText" name="visionText" rows={3} defaultValue={initial.visionText} className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none" />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="sponsorshipPitch">Sponsorship pitch (shown on the Sponsorship page)</label>
        <p className="mb-2 text-[10px] text-mutefg">
          Full write-up for prospective sponsors — line breaks are kept, so paragraphs and lists display as typed.
        </p>
        <textarea
          id="sponsorshipPitch"
          name="sponsorshipPitch"
          rows={10}
          defaultValue={initial.sponsorshipPitch}
          placeholder="Be Part of the Movement..."
          className="w-full rounded-lg border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Update event"}</Button>
    </form>
  );
}
