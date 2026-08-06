import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { ActionButtons } from "./ActionButtons";

export default async function AdminAttendeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const attendee = await prisma.attendee.findUnique({
    where: { id },
    include: { checkIns: { orderBy: { createdAt: "desc" } } },
  });
  if (!attendee) notFound();
  const qrDataUrl = await ticketQrDataUrl(attendee.ticketId);

  return (
    <div>
      <Link href="/admin/attendees" className="text-xs font-semibold text-bodyfg hover:text-gold">
        ← All attendees
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-[200px_1fr]">
        <Image src={qrDataUrl} alt="Ticket QR" width={200} height={200} unoptimized className="border-2 border-ink" />
        <div>
          <h1 className="font-display text-2xl font-extrabold">{attendee.fullName}</h1>
          <p className="mt-1 text-sm text-bodyfg">{attendee.email} · {attendee.phone}</p>
          <p className="mt-1 text-sm text-bodyfg">{attendee.school} · {attendee.level} · {attendee.department}</p>
          <p className="mt-3 text-xs text-mutefg">Ticket ID · {attendee.ticketId}</p>
          <p className="mt-1 text-xs text-mutefg">
            Registered {attendee.registeredAt.toLocaleString("en-GB")}
          </p>
          <div className="mt-4">
            {attendee.checkedIn ? (
              <span className="border border-gold bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                Checked in {attendee.checkedInAt?.toLocaleString("en-GB")} · {attendee.checkedInGate}
              </span>
            ) : (
              <span className="border border-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wider">Not checked in</span>
            )}
          </div>
          <div className="mt-5">
            <ActionButtons attendeeId={attendee.id} checkedIn={attendee.checkedIn} />
          </div>
        </div>
      </div>

      {attendee.checkIns.length > 0 && (
        <div className="mt-8 border-t-2 border-ink pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Check-in history</p>
          <ul className="mt-2 space-y-1 text-sm text-bodyfg">
            {attendee.checkIns.map((c) => (
              <li key={c.id}>
                {c.createdAt.toLocaleString("en-GB")} · {c.gate}
                {c.overridden ? " · override" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
