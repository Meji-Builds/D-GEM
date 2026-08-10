import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { PhotoOrPlaceholder } from "@/components/PhotoOrPlaceholder";
import { getEventSettings, getFaqs } from "@/lib/data";
import { FaqAccordion } from "./FaqAccordion";
import { FeedbackForm } from "./FeedbackForm";

export default async function FaqPage() {
  const [settings, faqs] = await Promise.all([getEventSettings(), getFaqs()]);
  const eventPassed = settings.eventDate ? settings.eventDate.getTime() < Date.now() : false;
  const feedbackOpen =
    settings.feedbackState === "OPEN" || (settings.feedbackState === "AUTO" && eventPassed);
  const socialLinks = [
    settings.instagramUrl && { href: settings.instagramUrl, label: "Instagram" },
    settings.twitterUrl && { href: settings.twitterUrl, label: "X" },
    settings.tiktokUrl && { href: settings.tiktokUrl, label: "TikTok" },
  ].filter((s): s is { href: string; label: string } => Boolean(s));

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Questions</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">FAQ</h1>
          <div className="mt-6 border-t-2 border-ink">
            <FaqAccordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
          </div>

          <div id="contact" className="mt-12 grid gap-8 border-t-2 border-ink pt-10 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Contact</p>
              <p className="mt-3 text-sm leading-loose text-bodyfg">
                {settings.contactEmail}
                <br />
                {settings.contactPhone}
                {socialLinks.length > 0 && (
                  <>
                    <br />
                    {socialLinks.map((s, i) => (
                      <span key={s.label}>
                        {i > 0 && " · "}
                        <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-gold">{s.label}</a>
                      </span>
                    ))}
                  </>
                )}
              </p>
            </div>
            <div>
              {settings.mapEmbedUrl ? (
                <iframe
                  src={settings.mapEmbedUrl}
                  title="Campus map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-40 w-full rounded-lg border border-line"
                />
              ) : settings.mapUrl ? (
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-40 items-center justify-center rounded-lg border border-line bg-mist text-center text-[10px] font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  View campus map
                </a>
              ) : (
                <PhotoOrPlaceholder src={null} alt="Campus map" label="Campus map" className="h-40" />
              )}
              {settings.mapEmbedUrl && settings.mapUrl && (
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-mutefg hover:text-gold"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border-t-2 border-ink bg-mist p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Post-event feedback {!feedbackOpen && "(not open yet)"}
            </p>
            <div className="mt-2 text-base font-bold">How was {settings.name}?</div>
            <div className="mt-4">
              {feedbackOpen ? (
                <FeedbackForm />
              ) : (
                <p className="text-sm text-mutefg">
                  Check back after the event to tell us how it went.
                </p>
              )}
            </div>
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
