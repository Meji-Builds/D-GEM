import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings } from "@/lib/data";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { LinkButton } from "@/components/Button";
import { AttendeeTicketCard } from "@/components/AttendeeTicketCard";
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
            checkedInInfo={{ checkedInAt: attendee.checkedInAt, gate: attendee.checkedInGate }}
            footerNote="Present this QR at the gate to be scanned. Screenshot works offline."
            className="animate-scale-in mt-8"
            actions={
              <>
                <ResendButton ticketId={attendee.ticketId} tone="onDark" />
                <LinkButton href={`/api/calendar/${attendee.ticketId}`} variant="outline" tone="onDark">
                  Add to calendar
                </LinkButton>
                <LinkButton href={`/ticket/${attendee.ticketId}/print`} variant="outline" tone="onDark">
                  Download ticket
                </LinkButton>
              </>
            }
          />
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
