"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ticketQrDataUrl } from "@/lib/ticket";
import { sendMail, ticketEmailHtml, qrAttachment } from "@/lib/email";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";

export async function manualCheckIn(attendeeId: string) {
  const session = await getSession();
  const attendee = await prisma.attendee.update({
    where: { id: attendeeId },
    data: { checkedIn: true, checkedInAt: new Date(), checkedInGate: "Admin desk" },
  });
  await prisma.checkIn.create({
    data: { attendeeId, gate: "Admin desk", scannedById: session?.sub },
  });
  revalidatePath("/admin/attendees");
  return attendee;
}

export async function resendReminderEmail(attendeeId: string) {
  const attendee = await prisma.attendee.findUnique({ where: { id: attendeeId } });
  if (!attendee) return { error: "Not found" };
  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(attendee.ticketId);
  await sendMail({
    to: attendee.email,
    subject: `Reminder: ${settings.name}`,
    html: ticketEmailHtml({
      fullName: attendee.fullName,
      ticketId: attendee.ticketId,
      eventName: settings.name,
      eventDateLabel: formatEventDateLabel(settings.eventDate),
      venue: settings.venue,
      kind: "reminder-1d",
    }),
    attachments: [qrAttachment(qrDataUrl)],
  });
  return { ok: true };
}
