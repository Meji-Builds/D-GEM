"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendMail, volunteerAcceptedEmailHtml, qrAttachment } from "@/lib/email";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";

async function sendCrewEmail(v: { fullName: string; email: string; role: string; crewId: string }) {
  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(v.crewId);
  await sendMail({
    to: v.email,
    subject: "You're on the D-GEM crew",
    html: volunteerAcceptedEmailHtml({
      fullName: v.fullName,
      role: v.role,
      crewId: v.crewId,
      eventName: settings.name,
      eventDateLabel: formatEventDateLabel(settings.eventDate),
      venue: settings.venue,
    }),
    attachments: [qrAttachment(qrDataUrl)],
  });
}

export async function acceptVolunteer(id: string) {
  const crewId = `CREW-${randomUUID().slice(0, 8).toUpperCase()}`;
  const v = await prisma.volunteerApplication.update({
    where: { id },
    data: { status: "ACCEPTED", crewId },
  });
  await sendCrewEmail({ fullName: v.fullName, email: v.email, role: v.role, crewId });
  revalidatePath("/admin/volunteers");
}

export async function rejectVolunteer(id: string) {
  await prisma.volunteerApplication.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/volunteers");
}

export async function resendCrewEmail(id: string) {
  const v = await prisma.volunteerApplication.findUnique({ where: { id } });
  if (!v || !v.crewId) return { error: "Not accepted yet." };
  await sendCrewEmail({ fullName: v.fullName, email: v.email, role: v.role, crewId: v.crewId });
  return { ok: true };
}
