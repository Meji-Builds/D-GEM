"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setEnquiryStatus } from "./actions";
import type { EnquiryStatus, SponsorTier } from "@prisma/client";

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  NEW: "border-gold bg-gold",
  CONTACTED: "border-ink bg-ink text-white",
  CLOSED: "border-line text-mutefg",
};

export function EnquiryCard({
  enquiry,
}: {
  enquiry: {
    id: string;
    company: string;
    contactName: string;
    email: string;
    tier: SponsorTier;
    message: string;
    status: EnquiryStatus;
    createdAt: Date;
  };
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const setStatus = (status: EnquiryStatus) =>
    start(async () => {
      await setEnquiryStatus(enquiry.id, status);
      router.refresh();
    });

  return (
    <div className="border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold">{enquiry.company}</div>
          <div className="text-xs text-bodyfg">
            {enquiry.contactName} · <a href={`mailto:${enquiry.email}`} className="hover:text-gold">{enquiry.email}</a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            {enquiry.tier.charAt(0) + enquiry.tier.slice(1).toLowerCase()}
          </span>
          <span className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${STATUS_STYLE[enquiry.status]}`}>
            {enquiry.status.toLowerCase()}
          </span>
        </div>
      </div>
      {enquiry.message && (
        <p className="mt-3 text-sm leading-relaxed text-bodyfg">{enquiry.message}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-mutefg">
          {enquiry.createdAt.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </span>
        <div className="flex gap-3 text-xs font-semibold">
          {enquiry.status !== "CONTACTED" && (
            <button disabled={pending} onClick={() => setStatus("CONTACTED")} className="text-bodyfg hover:text-gold">
              Mark contacted
            </button>
          )}
          {enquiry.status !== "CLOSED" && (
            <button disabled={pending} onClick={() => setStatus("CLOSED")} className="text-bodyfg hover:text-gold">
              Close
            </button>
          )}
          {enquiry.status === "CLOSED" && (
            <button disabled={pending} onClick={() => setStatus("NEW")} className="text-bodyfg hover:text-gold">
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
