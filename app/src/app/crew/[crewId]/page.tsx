import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings } from "@/lib/data";
import { CrewBadgeCard } from "@/components/CrewBadgeCard";

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

  return (
    <div className="flex min-h-full items-center justify-center bg-mist px-5 py-16">
      <CrewBadgeCard
        volunteer={{ fullName: volunteer.fullName, role: volunteer.role, crewId }}
        settings={{ eventDate: settings.eventDate, venue: settings.venue }}
        qrDataUrl={qrDataUrl}
        scanInfo={{ scannedAt: volunteer.badgeScannedAt, gate: volunteer.badgeScannedGate }}
        footerNote="Show this badge at accreditation on event day. Screenshot works offline."
        className="animate-scale-in"
      />
    </div>
  );
}
