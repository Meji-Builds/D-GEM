import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { PhotoOrPlaceholder, accentForIndex } from "@/components/PhotoOrPlaceholder";
import { LinkButton } from "@/components/Button";
import { ArrowLeftIcon } from "@/components/Icon";

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [settings, speaker] = await Promise.all([
    getEventSettings(),
    prisma.speaker.findUnique({
      where: { id },
      include: { agendaItems: { include: { agendaItem: true } } },
    }),
  ]);
  if (!speaker || speaker.state !== "LIVE") notFound();

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <a href="/speakers" className="group inline-flex items-center gap-1.5 text-xs font-semibold text-bodyfg transition-colors hover:text-gold">
            <ArrowLeftIcon className="h-3 w-3 transition-transform duration-150 group-hover:-translate-x-0.5" />
            All speakers
          </a>

          <div className="mt-6 grid gap-8 sm:grid-cols-[220px_1fr]">
            <PhotoOrPlaceholder
              src={speaker.photoUrl}
              alt={speaker.name}
              label={speaker.name.split(" ")[0]}
              accent={accentForIndex(speaker.order)}
              className="aspect-[3/4]"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Speaker</p>
              <h1 className="font-display mt-2 text-4xl font-extrabold tracking-tight">{speaker.name}</h1>
              <p className="mt-2 text-sm font-semibold text-bodyfg">
                {speaker.role}, {speaker.organisation}
              </p>
              <div className="mt-4 flex gap-2">
                {speaker.linkedinUrl && (
                  <a href={speaker.linkedinUrl} className="rounded-full border border-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white">
                    LinkedIn
                  </a>
                )}
                {speaker.socialUrl && (
                  <a href={speaker.socialUrl} className="rounded-full border border-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white">
                    Social
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t-2 border-ink pt-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Biography</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bodyfg">{speaker.bio}</p>
          </div>

          {speaker.agendaItems.length > 0 && (
            <div className="mt-8 border-t-2 border-ink pt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Speaking at</p>
              <div className="mt-3 space-y-2">
                {speaker.agendaItems.map(({ agendaItem }) => (
                  <div key={agendaItem.id} className="flex items-center gap-3">
                    <span className="rounded-full border border-gold bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {agendaItem.time}
                    </span>
                    <span className="text-sm font-semibold">{agendaItem.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <LinkButton href="/register">Register to attend</LinkButton>
          </div>
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
