"use client";

import { useState, useTransition } from "react";
import { resendTicketEmail } from "./actions";
import { Button } from "@/components/Button";
import { CheckIcon } from "@/components/Icon";

export function ResendButton({ ticketId, tone = "onLight" }: { ticketId: string; tone?: "onLight" | "onDark" }) {
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <Button
      type="button"
      variant={sent ? "outline" : "solid"}
      tone={tone}
      disabled={pending}
      onClick={() =>
        start(async () => {
          await resendTicketEmail(ticketId);
          setSent(true);
        })
      }
    >
      {sent && <CheckIcon className="animate-pop h-3.5 w-3.5" />}
      {pending ? "Sending…" : sent ? "Sent" : "Resend email"}
    </Button>
  );
}
