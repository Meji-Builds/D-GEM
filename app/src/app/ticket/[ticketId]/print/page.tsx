import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { Logo } from "@/components/Logo";

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
    <div className="mx-auto max-w-md border-2 border-ink p-8 print:border-0">
      <Logo size="md" />
      <h1 className="font-display mt-6 text-xl font-extrabold">{settings.name}</h1>
      <p className="mt-1 text-xs text-bodyfg">
        {formatEventDateLabel(settings.eventDate)} · {settings.venue}
      </p>
      <div className="mt-6 border-t-2 border-ink pt-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Attendee</div>
        <div className="mt-1 text-lg font-bold">{attendee.fullName}</div>
        <Image src={qrDataUrl} alt="Ticket QR code" width={220} height={220} unoptimized className="my-5 border-2 border-ink" />
        <p className="text-xs leading-relaxed text-bodyfg">
          Ticket ID · {attendee.ticketId}
          <br />
          {attendee.school} · {attendee.level} · {attendee.department}
          <br />
          General admission
        </p>
      </div>
      <p className="mt-6 text-[10px] text-mutefg print:hidden">
        Use your browser&apos;s Print → Save as PDF to download this ticket.
      </p>
    </div>
  );
}
