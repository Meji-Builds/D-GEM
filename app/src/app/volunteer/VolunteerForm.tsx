"use client";

import { useActionState, useState } from "react";
import { applyVolunteer, type VolunteerState } from "./actions";
import { Button } from "@/components/Button";
import { CheckIcon } from "@/components/Icon";
import { LevelField } from "@/components/LevelField";

const ROLES = [
  { id: "Registration desk", desc: "Check-in, scanning, badges" },
  { id: "Ushering / Protocol", desc: "Seating, guests, flow" },
  { id: "Media", desc: "Photo, video, livestream" },
  { id: "Content creators", desc: "Social, reels, recaps" },
  { id: "Idealists", desc: "Ideas, programming, partnerships" },
  { id: "Logistics", desc: "Setup, vendors, transport" },
];

const fieldClass =
  "h-11 w-full border border-line bg-white px-3 text-sm placeholder:text-mutefg transition-colors focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

export function VolunteerForm() {
  const [state, formAction, pending] = useActionState<VolunteerState, FormData>(applyVolunteer, {});
  const [role, setRole] = useState(ROLES[0].id);
  const [availability, setAvailability] = useState("Event day");

  return (
    <form action={formAction}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <button
            type="button"
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`border p-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
              role === r.id ? "border-2 border-gold" : "border-line"
            }`}
          >
            <div className="text-sm font-bold">{r.id}</div>
            <div className="mt-1 text-xs text-mutefg">{r.desc}</div>
            {role === r.id && (
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-gold">
                <CheckIcon className="animate-pop h-3.5 w-3.5" />
                Selected
              </div>
            )}
          </button>
        ))}
      </div>
      <input type="hidden" name="role" value={role} />

      <div className="mt-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Your details</p>
        {state?.error && (
          <div className="animate-fade-in-up mt-3 border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
            {state.error}
          </div>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="v-fullName">Full name</label>
            <input required id="v-fullName" name="fullName" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="v-email">Email</label>
            <input required id="v-email" type="email" name="email" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="v-phone">Phone</label>
            <input required id="v-phone" name="phone" className={fieldClass} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={labelClass} htmlFor="v-school">School</label>
              <input required id="v-school" name="school" className={fieldClass} />
            </div>
            <LevelField id="v-level" name="level" label="Level" />
            <div>
              <label className={labelClass} htmlFor="v-dept">Dept</label>
              <input id="v-dept" name="department" className={fieldClass} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass} htmlFor="v-exp">
            Why do you want to volunteer? / Relevant experience
          </label>
          <textarea id="v-exp" name="experience" rows={3} className="w-full border border-line bg-white p-3 text-sm transition-colors focus:border-ink focus:outline-none" />
        </div>

        <div className="mt-4">
          <div className={labelClass}>Availability</div>
          <div className="flex gap-2">
            {["Setup day", "Event day", "Both"].map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAvailability(a)}
                className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  availability === a ? "border-gold bg-gold" : "border-ink hover:bg-mist"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <input type="hidden" name="availability" value={availability} />
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting…" : "Apply to volunteer"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-mutefg">
          Applications are reviewed in the admin dashboard; accepted volunteers get a crew QR badge.
        </p>
      </div>
    </form>
  );
}
