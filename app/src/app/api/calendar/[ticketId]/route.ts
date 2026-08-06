import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";

function icsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const attendee = await prisma.attendee.findUnique({ where: { ticketId } });
  if (!attendee) return new NextResponse("Not found", { status: 404 });

  const settings = await getEventSettings();
  const start = settings.eventDate ?? new Date();
  const [sh, sm] = settings.startTime.split(":").map(Number);
  const [eh, em] = settings.endTime.split(":").map(Number);
  const dtStart = new Date(start);
  dtStart.setHours(sh || 9, sm || 0, 0, 0);
  const dtEnd = new Date(start);
  dtEnd.setHours(eh || 17, em || 0, 0, 0);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//D-GEM//Conference 1.0//EN",
    "BEGIN:VEVENT",
    `UID:${attendee.ticketId}@dgem.local`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(dtStart)}`,
    `DTEND:${icsDate(dtEnd)}`,
    `SUMMARY:${settings.name}`,
    `LOCATION:${settings.venue}`,
    `DESCRIPTION:Ticket ID ${attendee.ticketId}. Present your QR code at the gate.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="dgem-conference-1.0.ics"`,
    },
  });
}
