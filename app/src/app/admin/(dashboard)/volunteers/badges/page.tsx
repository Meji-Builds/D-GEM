import { prisma } from "@/lib/prisma";
import { ticketQrDataUrl } from "@/lib/ticket";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { Logo } from "@/components/Logo";

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
        <p className="text-xs text-mutefg">Use your browser&apos;s Print → Save as PDF to get every badge in one file.</p>
      </div>

      {badges.length === 0 && (
        <p className="mt-6 text-sm text-mutefg print:hidden">No accepted volunteers with a crew badge yet.</p>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 print:mt-0 print:grid-cols-1 print:gap-0">
        {badges.map((v) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={v.id} className="break-after-page rounded-2xl border-2 border-ink p-6 shadow-sm print:rounded-none print:border print:shadow-none">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <span className="rounded-full border border-gold bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                Crew
              </span>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-mutefg">Crew badge</p>
            <h2 className="font-display mt-1 text-lg font-extrabold">{v.fullName}</h2>
            <div className="mt-1 text-xs uppercase tracking-wide text-mutefg">{v.role}</div>
            <div className="my-4 inline-block rounded-xl border-2 border-ink bg-white p-2">
              <img src={v.qrDataUrl} alt={`QR for ${v.fullName}`} width={160} height={160} />
            </div>
            <p className="text-xs leading-relaxed text-bodyfg">
              Crew ID · {v.crewId}
              <br />
              {formatEventDateLabel(settings.eventDate)} · {settings.venue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
