"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { manualCheckIn, resendReminderEmail } from "../actions";
import { Button } from "@/components/Button";
import { CheckIcon } from "@/components/Icon";

export function ActionButtons({ attendeeId, checkedIn }: { attendeeId: string; checkedIn: boolean }) {
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant={sent ? "outline" : "solid"}
        disabled={pending}
        onClick={() =>
          start(async () => {
            await resendReminderEmail(attendeeId);
            setSent(true);
          })
        }
      >
        {sent && <CheckIcon className="animate-pop h-3.5 w-3.5" />}
        {sent ? "Sent" : "Resend email"}
      </Button>
      {!checkedIn && (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await manualCheckIn(attendeeId);
              router.refresh();
            })
          }
        >
          Manual check-in
        </Button>
      )}
    </div>
  );
}
