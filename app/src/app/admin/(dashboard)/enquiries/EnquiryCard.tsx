"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setEnquiryStatus, replyToEnquiry } from "./actions";
import { Button } from "@/components/Button";
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
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);
  const router = useRouter();

  const setStatus = (status: EnquiryStatus) =>
    start(async () => {
      await setEnquiryStatus(enquiry.id, status);
      router.refresh();
    });

  const sendReply = () =>
    start(async () => {
      const res = await replyToEnquiry(enquiry.id, reply);
      if (res.error) {
        setReplyError(res.error);
        return;
      }
      setReplyError(null);
      setReplySent(true);
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

      {replying && (
        <div className="animate-fade-in-up mt-3 border-t border-hair pt-3">
          {replyError && (
            <div className="mb-2 border border-red-800 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">{replyError}</div>
          )}
          {replySent ? (
            <p className="text-xs font-semibold text-gold">Sent to {enquiry.email}.</p>
          ) : (
            <>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder={`Hi ${enquiry.contactName}, thanks for your interest in sponsoring...`}
                className="w-full border border-line bg-white p-3 text-sm focus:border-ink focus:outline-none"
              />
              <div className="mt-2 flex gap-2">
                <Button type="button" disabled={pending} onClick={sendReply}>
                  {pending ? "Sending…" : "Send & mark contacted"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setReplying(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-mutefg">
          {enquiry.createdAt.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </span>
        {!replying && (
          <div className="flex gap-3 text-xs font-semibold">
            <button disabled={pending} onClick={() => setReplying(true)} className="text-bodyfg hover:text-gold">
              Reply
            </button>
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
        )}
      </div>
    </div>
  );
}
