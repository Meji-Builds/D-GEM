"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptVolunteer, rejectVolunteer } from "./actions";

export function VolunteerRow({
  v,
}: {
  v: { id: string; fullName: string; email: string; role: string; school: string; availability: string; status: string; crewId: string | null };
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <tr className="border-b border-hair">
      <td className="py-2 font-semibold">{v.fullName}</td>
      <td className="py-2 text-bodyfg">{v.email}</td>
      <td className="py-2 text-bodyfg">{v.role}</td>
      <td className="py-2 text-bodyfg">{v.school}</td>
      <td className="py-2 text-bodyfg">{v.availability}</td>
      <td className="py-2">
        <span
          className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            v.status === "ACCEPTED" ? "border-gold bg-gold" : v.status === "REJECTED" ? "border-line text-mutefg" : "border-ink"
          }`}
        >
          {v.status.toLowerCase()}
        </span>
      </td>
      <td className="py-2 text-right text-xs font-semibold">
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
          <a href={`/crew/${v.crewId}`} className="text-bodyfg hover:text-gold">View badge</a>
        )}
      </td>
    </tr>
  );
}
