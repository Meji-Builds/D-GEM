"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { regenerateLayout } from "./actions";
import { Button } from "@/components/Button";

export function RegenerateButton({ level }: { level: number }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ error?: string; ok?: boolean } | null>(null);
  const router = useRouter();

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await regenerateLayout(level);
            setMessage(result);
            router.refresh();
          })
        }
      >
        {pending ? "Generating…" : "Regenerate layout"}
      </Button>
      {message?.error && <p className="mt-2 text-xs font-semibold text-red-800">{message.error}</p>}
      {message?.ok && <p className="mt-2 text-xs font-semibold text-gold">All words fit — layout updated.</p>}
    </div>
  );
}
