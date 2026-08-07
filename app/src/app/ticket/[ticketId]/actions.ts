"use server";

import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { sendMail, ticketEmailHtml, qrAttachment } from "@/lib/email";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";

export async function resendTicketEmail(ticketId: string) {
  const attendee = await prisma.attendee.findUnique({ where: { ticketId } });
  if (!attendee) return { error: "Ticket not found." };

  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(attendee.ticketId);
  await sendMail({
    to: attendee.email,
    subject: `Your invitation to ${settings.name}`,
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
