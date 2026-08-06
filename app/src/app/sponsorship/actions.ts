"use server";

import { prisma } from "@/lib/prisma";
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

  return { ok: true };
}
