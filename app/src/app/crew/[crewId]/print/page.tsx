import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings } from "@/lib/data";
import { CrewBadgeCard } from "@/components/CrewBadgeCard";

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
    <div className="flex min-h-full items-center justify-center bg-mist px-5 py-16 print:bg-white print:py-0">
      <CrewBadgeCard
        volunteer={{ fullName: volunteer.fullName, role: volunteer.role, crewId }}
        settings={{ eventDate: settings.eventDate, venue: settings.venue }}
        qrDataUrl={qrDataUrl}
        footerNote="Show this badge at accreditation on event day."
      />
      <p className="fixed bottom-4 left-0 right-0 text-center text-[10px] text-mutefg print:hidden">
        Use your browser&apos;s Print → Save as PDF (with &quot;Background graphics&quot; turned on) to download this badge.
      </p>
    </div>
  );
}
