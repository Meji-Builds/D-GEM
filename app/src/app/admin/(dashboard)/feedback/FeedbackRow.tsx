"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveFeedback, rejectFeedback, resetFeedbackStatus } from "./actions";

export function FeedbackRow({
  f,
}: {
  f: {
    id: string;
    rating: number;
    name: string;
    role: string;
    testimonial: string;
    bestSession: string;
    improvement: string;
    status: string;
    createdAt: Date;
  };
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <tr className="border-b border-hair align-top transition-colors hover:bg-mist">
      <td className="py-3 pr-4 whitespace-nowrap">
        <span className="font-bold">{f.rating}</span>
        <span className="text-mutefg">/5</span>
      </td>
      <td className="py-3 pr-4 whitespace-nowrap">
        <div className="font-semibold">{f.name || "Anonymous"}</div>
        {f.role && <div className="text-xs text-mutefg">{f.role}</div>}
      </td>
      <td className="py-3 pr-4 max-w-xs">
        {f.testimonial ? <p className="text-bodyfg">&ldquo;{f.testimonial}&rdquo;</p> : <span className="text-mutefg">—</span>}
      </td>
      <td className="py-3 pr-4 max-w-xs text-bodyfg">
        {f.bestSession && <p><span className="text-mutefg">Best:</span> {f.bestSession}</p>}
        {f.improvement && <p className="mt-1"><span className="text-mutefg">Improve:</span> {f.improvement}</p>}
        {!f.bestSession && !f.improvement && <span className="text-mutefg">—</span>}
      </td>
      <td className="py-3 pr-4 whitespace-nowrap">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            f.status === "APPROVED" ? "border-gold bg-gold" : f.status === "REJECTED" ? "border-line text-mutefg" : "border-ink"
          }`}
        >
          {f.status.toLowerCase()}
        </span>
      </td>
      <td className="py-3 text-right text-xs font-semibold whitespace-nowrap">
        {f.status !== "APPROVED" && f.testimonial && (
          <button
            disabled={pending}
            className="text-bodyfg hover:text-gold"
            onClick={() => start(async () => { await approveFeedback(f.id); router.refresh(); })}
          >
            Approve
          </button>
        )}
        {f.status !== "APPROVED" && f.testimonial && f.status !== "REJECTED" && " · "}
        {f.status !== "REJECTED" && (
          <button
            disabled={pending}
            className="text-bodyfg hover:text-red-700"
            onClick={() => start(async () => { await rejectFeedback(f.id); router.refresh(); })}
          >
            Reject
          </button>
        )}
        {f.status !== "PENDING" && (
          <>
            {" · "}
            <button
              disabled={pending}
              className="text-bodyfg hover:text-gold"
              onClick={() => start(async () => { await resetFeedbackStatus(f.id); router.refresh(); })}
            >
              Reset
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
