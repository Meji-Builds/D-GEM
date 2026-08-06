import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { PhotoOrPlaceholder } from "@/components/PhotoOrPlaceholder";
import { getEventSettings, getLiveSpeakers } from "@/lib/data";

export default async function SpeakersPage() {
  const [settings, speakers] = await Promise.all([getEventSettings(), getLiveSpeakers()]);

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
            Guest speakers
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
            Meet the people speaking.
          </h1>

          <div className="mt-10 divide-y divide-hair border-t-2 border-ink">
            {speakers.length === 0 && (
              <p className="py-8 text-sm text-mutefg">Speaker lineup coming soon.</p>
            )}
            {speakers.map((s, i) => (
              <a
                key={s.id}
                href={`/speakers/${s.id}`}
                className={`grid gap-6 py-8 sm:grid-cols-[160px_1fr] sm:items-start ${
                  i % 2 === 1 ? "sm:[direction:rtl]" : ""
                }`}
              >
                <div className="sm:[direction:ltr]">
                  <PhotoOrPlaceholder src={s.photoUrl} alt={s.name} label="Photo" className="aspect-square" />
                </div>
                <div className="sm:[direction:ltr]">
                  <div className="font-display text-xl font-extrabold">{s.name}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-mutefg">
                    {s.role}, {s.organisation} · {s.session}
                  </div>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-bodyfg">{s.bio}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
