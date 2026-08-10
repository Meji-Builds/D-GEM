import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { getEventSettings, getAgenda } from "@/lib/data";

export default async function AgendaPage() {
  const [settings, agenda] = await Promise.all([getEventSettings(), getAgenda()]);

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
            One day · {settings.startTime} – {settings.endTime}
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Programme</h1>

          <div className="mt-8 divide-y divide-hair border-t-2 border-ink">
            {agenda.length === 0 && <p className="py-8 text-sm text-mutefg">Agenda coming soon.</p>}
            {agenda.map((a) => (
              <div key={a.id} className="grid gap-3 py-6 sm:grid-cols-[90px_1fr]">
                <div>
                  <div className="font-display text-lg font-extrabold">{a.time}</div>
                  <div className="text-xs text-mutefg">{a.durationMin} min</div>
                </div>
                <div>
                  <div className="text-base font-bold">{a.title}</div>
                  {a.description && <p className="mt-1 text-sm text-bodyfg">{a.description}</p>}
                  {a.speakers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {a.speakers.map(({ speaker }) => (
                        <a
                          key={speaker.id}
                          href={`/speakers/${speaker.id}`}
                          className="text-xs font-semibold text-bodyfg hover:text-gold"
                        >
                          {speaker.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        instagramUrl={settings.instagramUrl}
        twitterUrl={settings.twitterUrl}
        tiktokUrl={settings.tiktokUrl}
      />
    </div>
  );
}
