import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings } from "@/lib/data";
import { AttendeeTicketCard } from "@/components/AttendeeTicketCard";

export default async function PrintTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const attendee = await prisma.attendee.findUnique({ where: { ticketId } });
  if (!attendee) notFound();
  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(attendee.ticketId);

  return (
    <div className="flex min-h-full items-center justify-center bg-mist px-5 py-16 print:bg-white print:py-0">
      <AttendeeTicketCard
        attendee={{
          fullName: attendee.fullName,
          ticketId: attendee.ticketId,
          school: attendee.school,
          level: attendee.level,
          department: attendee.department,
        }}
        settings={{ eventDate: settings.eventDate, venue: settings.venue }}
        qrDataUrl={qrDataUrl}
        footerNote="Present this QR at the gate to be scanned."
        className="max-w-md"
      />
      <p className="fixed bottom-4 left-0 right-0 text-center text-[10px] text-mutefg print:hidden">
        Use your browser&apos;s Print → Save as PDF (with &quot;Background graphics&quot; turned on) to download this ticket.
      </p>
    </div>
  );
}
