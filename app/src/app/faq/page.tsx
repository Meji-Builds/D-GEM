import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { PhotoOrPlaceholder } from "@/components/PhotoOrPlaceholder";
import { getEventSettings, getFaqs } from "@/lib/data";
import { FaqAccordion } from "./FaqAccordion";
import { FeedbackForm } from "./FeedbackForm";

export default async function FaqPage() {
  const [settings, faqs] = await Promise.all([getEventSettings(), getFaqs()]);
  const eventPassed = settings.eventDate ? settings.eventDate.getTime() < Date.now() : false;

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
                <br />
                {settings.instagramUrl && <a href={settings.instagramUrl} className="hover:text-gold">Instagram</a>}
                {settings.instagramUrl && settings.twitterUrl && " · "}
                {settings.twitterUrl && <a href={settings.twitterUrl} className="hover:text-gold">X</a>}
              </p>
            </div>
            <PhotoOrPlaceholder src={null} alt="Campus map" label="Campus map" className="h-32" />
          </div>

          <div className="mt-12 rounded-2xl border-t-2 border-ink bg-mist p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Post-event feedback {!eventPassed && "(opens after the event)"}
            </p>
            <div className="mt-2 text-base font-bold">How was {settings.name}?</div>
            <div className="mt-4">
              {eventPassed ? (
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
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
