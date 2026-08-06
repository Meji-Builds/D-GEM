"use client";

import { useState } from "react";
import { compressFileInput } from "@/lib/compressImage";

export function ImageInput({
  name,
  className = "",
  onChange,
}: {
  name: string;
  className?: string;
  onChange?: (file: File | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="relative">
      <input
        type="file"
        name={name}
        accept="image/*"
        className={className}
        disabled={busy}
        onChange={async (e) => {
          const input = e.currentTarget;
          setBusy(true);
          try {
            await compressFileInput(input);
          } finally {
            setBusy(false);
            onChange?.(input.files?.[0] ?? null);
          }
        }}
      />
      {busy && <span className="ml-2 align-middle text-[10px] text-mutefg">Compressing…</span>}
    </div>
  );
}
