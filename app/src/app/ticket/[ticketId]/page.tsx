import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { LinkButton } from "@/components/Button";
import { ResendButton } from "./ResendButton";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const attendee = await prisma.attendee.findUnique({ where: { ticketId } });
  if (!attendee) notFound();

  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(attendee.ticketId);
  const firstName = attendee.fullName.split(" ")[0];

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="animate-fade-in-up mx-auto max-w-2xl px-5 py-12">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
            {attendee.checkedIn ? "Checked in" : "You're in"}
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
            {attendee.checkedIn ? `Welcome back, ${firstName}.` : `You're in, ${firstName}.`}
          </h1>

          <div className="animate-scale-in mt-8 border-2 border-ink bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
                  Attendee
                </div>
                <div className="mt-1 text-lg font-bold">{attendee.fullName}</div>
              </div>
              <span className="border border-gold bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                General
              </span>
            </div>

            <Image
              src={qrDataUrl}
              alt="Ticket QR code"
              width={200}
              height={200}
              unoptimized
              className="my-5 border-2 border-ink"
            />

            <p className="text-xs leading-relaxed text-bodyfg">
              Ticket ID · {attendee.ticketId}
              <br />
              {formatEventDateLabel(settings.eventDate)} · {settings.venue}
            </p>

            {attendee.checkedIn && attendee.checkedInAt && (
              <p className="mt-3 text-xs text-mutefg">
                Checked in {new Date(attendee.checkedInAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                {attendee.checkedInGate ? ` · ${attendee.checkedInGate}` : ""}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <ResendButton ticketId={attendee.ticketId} />
              <LinkButton href={`/api/calendar/${attendee.ticketId}`} variant="outline">
                Add to calendar
              </LinkButton>
              <LinkButton href={`/ticket/${attendee.ticketId}/print`} variant="outline">
                Download ticket
              </LinkButton>
            </div>
          </div>

          <p className="mt-4 text-xs text-mutefg">
            Present this QR at the gate to be scanned. Screenshot works offline.
          </p>
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
