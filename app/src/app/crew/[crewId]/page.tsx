import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { Logo } from "@/components/Logo";

export default async function CrewBadgePage({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const volunteer = await prisma.volunteerApplication.findUnique({ where: { crewId } });
  if (!volunteer || volunteer.status !== "ACCEPTED") notFound();
  const settings = await getEventSettings();
  const qrDataUrl = await ticketQrDataUrl(crewId);
  const firstName = volunteer.fullName.split(" ")[0];

  return (
    <div className="flex min-h-full items-center justify-center bg-mist px-5 py-16">
      <div className="animate-scale-in w-full max-w-sm rounded-2xl border-2 border-ink bg-ink text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#3a3733] px-6 py-4">
          <Logo size="sm" dark />
          <span className="rounded-full border border-gold bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            Crew
          </span>
        </div>
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Crew badge</p>
          <h1 className="font-display mt-1 text-2xl font-extrabold">Welcome, {firstName}.</h1>
          <div className="mt-1 text-xs uppercase tracking-wide text-[#a8a29a]">{volunteer.role}</div>

          <Image
            src={qrDataUrl}
            alt="Crew QR badge"
            width={200}
            height={200}
            unoptimized
            className="my-5 rounded-xl border-2 border-white bg-white p-2"
          />

          <p className="text-xs leading-relaxed text-[#a8a29a]">
            Crew ID · {crewId}
            <br />
            {formatEventDateLabel(settings.eventDate)} · {settings.venue}
          </p>

          {volunteer.badgeScannedAt && (
            <p className="mt-3 text-xs text-[#a8a29a]">
              Scanned {new Date(volunteer.badgeScannedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              {volunteer.badgeScannedGate ? ` · ${volunteer.badgeScannedGate}` : ""}
            </p>
          )}

          <p className="mt-4 border-t border-[#3a3733] pt-4 text-xs leading-relaxed text-[#a8a29a]">
            Show this badge at accreditation on event day. Screenshot works offline.
          </p>
        </div>
      </div>
    </div>
  );
}
