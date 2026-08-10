import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { Countdown } from "@/components/Countdown";
import { LinkButton } from "@/components/Button";
import { PhotoOrPlaceholder, accentForIndex } from "@/components/PhotoOrPlaceholder";
import { Reveal } from "@/components/Reveal";
import { InstagramIcon, XIcon, TikTokIcon } from "@/components/Icon";
import {
  getEventSettings,
  getLiveSpeakers,
  getConvener,
  getSponsorsByTier,
  getAgenda,
  formatEventDateLabel,
} from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const [settings, speakers, convener, sponsors, agenda, registeredCount] = await Promise.all([
    getEventSettings(),
    getLiveSpeakers(),
    getConvener(),
    getSponsorsByTier(),
    getAgenda(),
    prisma.attendee.count(),
  ]);

  const seatsLabel = `${settings.capacity}+ students`;
  const previewSpeakers = speakers.slice(0, 4);
  const previewAgenda = agenda.slice(0, 3);
  const socials = [
    settings.instagramUrl && { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    settings.twitterUrl && { href: settings.twitterUrl, label: "X", Icon: XIcon },
    settings.tiktokUrl && { href: settings.tiktokUrl, label: "TikTok", Icon: TikTokIcon },
  ].filter((s): s is { href: string; label: string; Icon: typeof InstagramIcon } => Boolean(s));

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b-2 border-ink px-5 py-14 sm:px-8">
          <div className="animate-fade-in-up mx-auto max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              D-GEM · Conference 1.0
            </p>
            <h1 className="font-display mt-3 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
              Don&apos;t Graduate
              <br />
              Empty Movement
              <br />
              Conference 1.0
            </h1>
            {settings.tagline && (
              <div className="mt-5 max-w-xl rounded-2xl bg-ink px-5 py-4 text-white shadow-md sm:px-6 sm:py-5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold">Theme</span>
                <p className="mt-1 text-lg font-extrabold leading-snug sm:text-xl">{settings.tagline}</p>
              </div>
            )}
            {settings.heroText && (
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-bodyfg sm:text-base">
                {settings.heroText}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LinkButton href="/register">Register free</LinkButton>
              <LinkButton href="/volunteer" variant="outline">Become a volunteer</LinkButton>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t-2 border-ink pt-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Date</div>
                <div className="mt-1 text-sm font-bold sm:text-base">{formatEventDateLabel(settings.eventDate)}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Venue</div>
                <div className="mt-1 text-sm font-bold sm:text-base">{settings.venue}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Seats</div>
                <div className="mt-1 text-sm font-bold sm:text-base">{seatsLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown */}
        <section className="flex flex-wrap items-center gap-4 border-b-2 border-ink bg-ink px-5 py-5 sm:px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
            Counting down
          </span>
          <Countdown eventDate={settings.eventDate?.toISOString() ?? null} className="ml-auto" />
        </section>

        {/* About */}
        <section id="about" className="border-b-2 border-ink px-5 py-12 sm:px-8">
          <Reveal className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 sm:items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
                About the movement
              </p>
              <p className="mt-3 text-sm leading-relaxed text-bodyfg">{settings.aboutText}</p>
              {socials.length > 0 && (
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Follow us</span>
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <PhotoOrPlaceholder
              src={settings.movementPhotoUrl}
              alt="D-GEM movement"
              label="Movement photo"
              fit="contain"
              className="aspect-[4/5] w-full max-w-sm mx-auto sm:mx-0"
            />
          </Reveal>
        </section>

        {/* Mission / Vision */}
        <section className="grid border-b-2 border-ink sm:grid-cols-2">
          <Reveal className="border-b-2 border-ink px-5 py-10 sm:border-b-0 sm:border-r-2 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Mission</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-bodyfg">{settings.missionText}</p>
          </Reveal>
          <Reveal className="px-5 py-10 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Vision</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-bodyfg">{settings.visionText}</p>
          </Reveal>
        </section>

        {/* Speakers preview */}
        <section className="border-b-2 border-ink px-5 py-12 sm:px-8">
          <Reveal className="mx-auto max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Guest speakers
            </p>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {previewSpeakers.length === 0 && (
                <p className="col-span-full text-sm text-mutefg">Speaker lineup coming soon.</p>
              )}
              {previewSpeakers.map((s, i) => (
                <a key={s.id} href={`/speakers/${s.id}`} className="group block">
                  <div className="overflow-hidden">
                    <PhotoOrPlaceholder
                      src={s.photoUrl}
                      alt={s.name}
                      label={s.name.split(" ")[0]}
                      accent={accentForIndex(i)}
                      className="aspect-square transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2 text-sm font-bold transition-colors group-hover:text-gold">{s.name}</div>
                  <div className="text-xs text-mutefg">{s.role}, {s.organisation}</div>
                </a>
              ))}
            </div>
            <div className="mt-6">
              <LinkButton href="/speakers" variant="outline">See all speakers</LinkButton>
            </div>
          </Reveal>
        </section>

        {/* Convener */}
        <section className="border-b-2 border-ink px-5 py-12 sm:px-8">
          <Reveal className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-center">
            <PhotoOrPlaceholder
              src={convener.photoUrl}
              alt={convener.name || "Convener"}
              label={convener.name ? convener.name.split(" ")[0] : "Host"}
              accent="gold"
              className="h-48 w-48 flex-none sm:h-64 sm:w-64"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
                The convener
              </p>
              <div className="font-display mt-1 text-xl font-extrabold">
                {convener.name || "Convener name"}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-bodyfg">
                {convener.note || "Welcome note from the convener."}
              </p>
              {convener.whatsappNumber && (
                <div className="mt-4">
                  <LinkButton
                    href={`https://wa.me/${convener.whatsappNumber}${convener.whatsappMessage ? `?text=${encodeURIComponent(convener.whatsappMessage)}` : ""}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Connect with {convener.whatsappLabel || (convener.name ? convener.name.split(" ")[0] : "the host")}
                  </LinkButton>
                </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* Agenda preview */}
        <section className="border-b-2 border-ink px-5 py-12 sm:px-8">
          <Reveal className="mx-auto max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Agenda · One day
            </p>
            <div className="mt-5 space-y-3">
              {previewAgenda.map((a) => (
                <div key={a.id} className="flex items-center gap-4 border-b border-hair pb-3 transition-colors hover:border-gold">
                  <span className="rounded-full border border-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {a.time}
                  </span>
                  <span className="text-sm font-semibold">{a.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <LinkButton href="/agenda" variant="outline">See full agenda</LinkButton>
            </div>
          </Reveal>
        </section>

        {/* Sponsors */}
        <section id="sponsors" className="border-b-2 border-ink px-5 py-12 sm:px-8">
          <Reveal className="mx-auto max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Sponsors &amp; partners
            </p>
            {(["gold", "silver", "bronze"] as const).map((tier) =>
              sponsors[tier].length ? (
                <div key={tier} className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      tier === "gold" ? "border-gold bg-gold" : "border-ink"
                    }`}
                  >
                    {tier}
                  </span>
                  {sponsors[tier].map((s) => (
                    <PhotoOrPlaceholder
                      key={s.id}
                      src={s.logoUrl}
                      alt={s.name}
                      label={s.name}
                      className={`transition-transform duration-200 hover:scale-105 ${tier === "gold" ? "h-11 flex-1 min-w-24" : "h-8 flex-1 min-w-20"}`}
                    />
                  ))}
                </div>
              ) : null
            )}
            <div className="mt-6">
              <LinkButton href="/sponsorship" variant="outline">Sponsor this event</LinkButton>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="border-b-2 border-ink bg-gold px-5 py-12 sm:px-8">
          <Reveal className="mx-auto max-w-4xl">
            <div className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Seats are free.
              <br />
              They will not last.
            </div>
            <p className="mt-2 text-xs font-semibold">
              {registeredCount} of {settings.capacity} seats taken
            </p>
            <div className="mt-5">
              <LinkButton href="/register" square>Register now</LinkButton>
            </div>
          </Reveal>
        </section>
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
