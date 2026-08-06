"use client";

import { useState } from "react";

const LEVEL_OPTIONS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
  "600 Level",
  "Postgraduate",
  "Not a student (Alumni)",
];

const fieldClass =
  "h-11 w-full border border-line bg-white px-3 text-sm text-ink placeholder:text-mutefg focus:border-ink focus:outline-none";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-mutefg";

export function LevelField({
  id,
  name,
  label = "Level / Year",
  required = false,
}: {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
}) {
  const [selected, setSelected] = useState("");
  const [other, setOther] = useState("");
  const isOther = selected === "Other";

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        required={required}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        name={isOther ? undefined : name}
        className={fieldClass}
      >
        <option value="" disabled>
          Select…
        </option>
        {LEVEL_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>
      {isOther && (
        <input
          name={name}
          required={required}
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder="Please specify"
          className={`${fieldClass} animate-fade-in-up mt-2`}
        />
      )}
    </div>
  );
}
