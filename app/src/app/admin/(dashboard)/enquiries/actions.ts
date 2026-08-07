"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/email";
import { escapeHtml } from "@/lib/html";
import { getEventSettings } from "@/lib/data";
import type { EnquiryStatus } from "@prisma/client";

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  await prisma.sponsorshipEnquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
}

export async function replyToEnquiry(id: string, message: string) {
  const enquiry = await prisma.sponsorshipEnquiry.findUnique({ where: { id } });
  if (!enquiry) return { error: "Enquiry not found." };
  if (!message.trim()) return { error: "Write a message first." };

  const settings = await getEventSettings();
  await sendMail({
    to: enquiry.email,
    subject: `Re: Your sponsorship enquiry — ${settings.name}`,
    html: `<!doctype html>
<html><body style="margin:0;background:#f0eee9;font-family:Archivo,Arial,sans-serif;color:#141210;">
  <div style="max-width:460px;margin:24px auto;background:#fff;border:2px solid #141210;">
    <div style="padding:14px 18px;background:#141210;">
      <span style="display:inline-flex;align-items:center;gap:6px;color:#fff;font-weight:800;font-size:16px;letter-spacing:.04em;">D<span style="color:#C9A227;">GEM</span></span>
    </div>
    <div style="padding:20px 18px;">
      <p style="font-size:13px;line-height:1.7;color:#141210;white-space:pre-wrap;margin:0;">${escapeHtml(message.trim())}</p>
      <p style="font-size:12px;color:#94908a;margin-top:20px;border-top:1px solid #ddd9d4;padding-top:14px;">
        In reply to your ${enquiry.tier.charAt(0) + enquiry.tier.slice(1).toLowerCase()} tier enquiry for ${settings.name}.
      </p>
    </div>
  </div>
</body></html>`,
  });

  await prisma.sponsorshipEnquiry.update({ where: { id }, data: { status: "CONTACTED" } });
  revalidatePath("/admin/enquiries");
  return { ok: true };
}
