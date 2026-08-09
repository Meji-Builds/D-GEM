import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings } from "@/lib/data";
import { CrewBadgeCard } from "@/components/CrewBadgeCard";

export default async function AdminVolunteerBadgesPage() {
  const [volunteers, settings] = await Promise.all([
    prisma.volunteerApplication.findMany({
      where: { status: "ACCEPTED", crewId: { not: null } },
      orderBy: { fullName: "asc" },
    }),
    getEventSettings(),
  ]);

  const badges = await Promise.all(
    volunteers.map(async (v) => ({
      ...v,
      qrDataUrl: await ticketQrDataUrl(v.crewId!),
    }))
  );

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3 print:hidden">
        <h1 className="font-display text-lg font-extrabold">Crew badges · {badges.length}</h1>
        <p className="text-xs text-mutefg">
          Use your browser&apos;s Print → Save as PDF (with &quot;Background graphics&quot; on) to get every badge in one file.
        </p>
      </div>

      {badges.length === 0 && (
        <p className="mt-6 text-sm text-mutefg print:hidden">No accepted volunteers with a crew badge yet.</p>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 print:mt-0 print:grid-cols-1 print:gap-0 print:bg-white">
        {badges.map((v) => (
          <div key={v.id} className="break-after-page flex justify-center print:justify-start print:py-6">
            <CrewBadgeCard
              volunteer={{ fullName: v.fullName, role: v.role, crewId: v.crewId! }}
              settings={{ eventDate: settings.eventDate, venue: settings.venue }}
              qrDataUrl={v.qrDataUrl}
              footerNote="Show this badge at accreditation on event day."
            />
          </div>
        ))}
      </div>
    </div>
  );
}
