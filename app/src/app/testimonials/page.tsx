import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { getEventSettings, getApprovedTestimonials } from "@/lib/data";

export default async function TestimonialsPage() {
  const [settings, testimonials] = await Promise.all([
    getEventSettings(),
    getApprovedTestimonials(),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Feedback</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
            What attendees are saying
          </h1>

          {testimonials.length === 0 ? (
            <p className="mt-8 text-sm text-mutefg">No feedback published yet — check back after the event.</p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-xl border border-line p-5">
                  <span className="text-xs tracking-wider text-gold" aria-label={`${t.rating} out of 5 stars`}>
                    {"★".repeat(t.rating)}
                    <span className="text-line">{"★".repeat(5 - t.rating)}</span>
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-bodyfg">&ldquo;{t.testimonial}&rdquo;</p>
                  {(t.name || t.role) && (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-mutefg">
                      {t.name || "Anonymous"}{t.name && t.role ? " · " : ""}{t.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
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
