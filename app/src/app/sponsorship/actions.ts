"use server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/email";
import { getEventSettings } from "@/lib/data";
import { escapeHtml } from "@/lib/html";
import type { SponsorTier } from "@prisma/client";

export type SponsorshipState = { error?: string; ok?: boolean };

export async function submitSponsorshipEnquiry(
  _prev: SponsorshipState,
  formData: FormData
): Promise<SponsorshipState> {
  const company = String(formData.get("company") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const tier = String(formData.get("tier") || "GOLD").toUpperCase() as SponsorTier;
  const message = String(formData.get("message") || "").trim();

  if (!company || !contactName || !email) {
    return { error: "Please fill in company, contact person and email." };
  }

  await prisma.sponsorshipEnquiry.create({
    data: { company, contactName, email, tier, message },
  });

  const settings = await getEventSettings();
  if (settings.contactEmail) {
    const safeCompany = escapeHtml(company);
    const safeContactName = escapeHtml(contactName);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    await sendMail({
      to: settings.contactEmail,
      subject: `New sponsorship enquiry: ${company} (${tier})`,
      html: `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#141210;">
  <div style="max-width:480px;margin:0 auto;padding:20px;border:2px solid #141210;">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8a8580;margin:0 0 10px;">New sponsorship enquiry</p>
    <p style="font-size:15px;font-weight:700;margin:0 0 4px;">${safeCompany}</p>
    <p style="font-size:13px;color:#5a564f;margin:0 0 14px;">${safeContactName} &middot; <a href="mailto:${safeEmail}">${safeEmail}</a> &middot; ${tier} tier</p>
    ${safeMessage ? `<p style="font-size:13px;line-height:1.6;color:#141210;white-space:pre-wrap;">${safeMessage}</p>` : ""}
    <p style="font-size:11px;color:#8a8580;margin-top:16px;">Reply to review and manage this in the admin dashboard under Enquiries.</p>
  </div>
</body></html>`,
    });
  }

  return { ok: true };
}
