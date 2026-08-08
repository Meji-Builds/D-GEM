"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptVolunteer, rejectVolunteer, resendCrewEmail } from "./actions";
import { CheckIcon } from "@/components/Icon";

export function VolunteerRow({
  v,
}: {
  v: { id: string; fullName: string; email: string; role: string; school: string; availability: string; status: string; crewId: string | null };
}) {
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);
  const router = useRouter();

  return (
    <tr className="border-b border-hair transition-colors hover:bg-mist">
      <td className="py-2 pr-4 font-semibold whitespace-nowrap">{v.fullName}</td>
      <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{v.email}</td>
      <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{v.role}</td>
      <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{v.school}</td>
      <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{v.availability}</td>
      <td className="py-2 pr-4 whitespace-nowrap">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            v.status === "ACCEPTED" ? "border-gold bg-gold" : v.status === "REJECTED" ? "border-line text-mutefg" : "border-ink"
          }`}
        >
          {v.status.toLowerCase()}
        </span>
      </td>
      <td className="py-2 text-right text-xs font-semibold whitespace-nowrap">
        {v.status === "PENDING" && (
          <>
            <button
              disabled={pending}
              className="text-bodyfg hover:text-gold"
              onClick={() => start(async () => { await acceptVolunteer(v.id); router.refresh(); })}
            >
              Accept
            </button>
            {" · "}
            <button
              disabled={pending}
              className="text-bodyfg hover:text-red-700"
              onClick={() => start(async () => { await rejectVolunteer(v.id); router.refresh(); })}
            >
              Reject
            </button>
          </>
        )}
        {v.status === "ACCEPTED" && v.crewId && (
          <>
            <a href={`/crew/${v.crewId}`} className="text-bodyfg hover:text-gold">View badge</a>
            {" · "}
            <button
              disabled={pending}
              className="inline-flex items-center gap-1 text-bodyfg hover:text-gold"
              onClick={() => start(async () => { await resendCrewEmail(v.id); setSent(true); })}
            >
              {sent && <CheckIcon className="animate-pop h-3 w-3" />}
              {sent ? "Sent" : "Resend email"}
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
