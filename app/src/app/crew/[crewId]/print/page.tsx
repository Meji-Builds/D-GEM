import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { Logo } from "@/components/Logo";

export default async function PrintCrewBadgePage({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const volunteer = await prisma.volunteerApplication.findUnique({ where: { crewId } });
  if (!volunteer || volunteer.status !== "ACCEPTED") notFound();
  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(crewId);

  return (
    <div className="mx-auto max-w-md rounded-2xl border-2 border-ink p-8 shadow-md print:rounded-none print:border-0 print:shadow-none">
      <div className="flex items-center justify-between">
        <Logo size="md" />
        <span className="rounded-full border border-gold bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
          Crew
        </span>
      </div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-mutefg">Crew badge</p>
      <h1 className="font-display mt-1 text-xl font-extrabold">{volunteer.fullName}</h1>
      <div className="mt-1 text-xs uppercase tracking-wide text-mutefg">{volunteer.role}</div>

      <div className="my-5 inline-block rounded-xl border-2 border-ink bg-white p-3 print:rounded-none">
        <Image src={qrDataUrl} alt="Crew QR badge" width={220} height={220} unoptimized />
      </div>

      <p className="text-xs leading-relaxed text-bodyfg">
        Crew ID · {crewId}
        <br />
        {formatEventDateLabel(settings.eventDate)} · {settings.venue}
      </p>

      <p className="mt-6 text-[10px] text-mutefg print:hidden">
        Use your browser&apos;s Print → Save as PDF to download this badge.
      </p>
    </div>
  );
}
