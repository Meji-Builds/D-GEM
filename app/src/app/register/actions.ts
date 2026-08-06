"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateTicketId, ticketQrDataUrl } from "@/lib/ticket";
import { sendMail, ticketEmailHtml } from "@/lib/email";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";

export type RegisterState = { error?: string };

export async function registerAttendee(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const school = String(formData.get("school") || "").trim();
  const level = String(formData.get("level") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const howHeard = String(formData.get("howHeard") || "").trim();
  const consentReminders = formData.get("consentReminders") === "on";

  if (!fullName || !email || !phone || !school || !level || !department) {
    return { error: "Please fill in all required fields." };
  }

  const settings = await getEventSettings();
  if (settings.registrationState !== "OPEN") {
    return { error: "Registration is currently closed." };
  }

  let ticketId = generateTicketId();
  for (let i = 0; i < 5; i++) {
    const existing = await prisma.attendee.findUnique({ where: { ticketId } });
    if (!existing) break;
    ticketId = generateTicketId();
  }

  const attendee = await prisma.attendee.create({
    data: {
      ticketId,
      fullName,
      email,
      phone,
      school,
      level,
      department,
      howHeard,
      consentReminders,
    },
  });

  const qrDataUrl = await ticketQrDataUrl(attendee.ticketId);
  await sendMail({
    to: attendee.email,
    subject: `Your invitation to ${settings.name}`,
    html: ticketEmailHtml({
      fullName: attendee.fullName,
      ticketId: attendee.ticketId,
      qrDataUrl,
      eventName: settings.name,
      eventDateLabel: formatEventDateLabel(settings.eventDate),
      venue: settings.venue,
      kind: "invitation",
    }),
  });

  redirect(`/ticket/${attendee.ticketId}`);
}
