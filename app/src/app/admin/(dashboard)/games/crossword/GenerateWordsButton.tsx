"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateWordsForLevel } from "./actions";
import { Button } from "@/components/Button";

export function GenerateWordsButton({ level }: { level: number }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ error?: string; ok?: boolean } | null>(null);
  const router = useRouter();

  return (
    <div>
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Replace this level's auto-generated words with a fresh batch? Anything you've hand-written stays.")) return;
          start(async () => {
            const result = await generateWordsForLevel(level);
            setMessage(result);
            router.refresh();
          });
        }}
      >
        {pending ? "Generating…" : "Generate words"}
      </Button>
      {message?.error && <p className="mt-2 text-xs font-semibold text-red-800">{message.error}</p>}
      {message?.ok && <p className="mt-2 text-xs font-semibold text-gold">Generated from the current speakers, sponsors, convener, venue, and agenda.</p>}
    </div>
  );
}
