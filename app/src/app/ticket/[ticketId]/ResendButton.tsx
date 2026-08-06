"use client";

import { useState, useTransition } from "react";
import { resendTicketEmail } from "./actions";
import { Button } from "@/components/Button";

export function ResendButton({ ticketId }: { ticketId: string }) {
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <Button
      type="button"
      variant="solid"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await resendTicketEmail(ticketId);
          setSent(true);
        })
      }
    >
      {pending ? "Sending…" : sent ? "Sent ✓" : "Resend email"}
    </Button>
  );
}
