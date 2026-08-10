import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { getEventSettings } from "@/lib/data";
import { LinkButton } from "@/components/Button";

export default async function VolunteerAppliedPage() {
  const settings = await getEventSettings();
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Application received</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
            Thank you for stepping up.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bodyfg">
            The D-GEM team reviews volunteer applications in the run-up to the event. If you&apos;re
            accepted, we&apos;ll email you your crew badge and role briefing.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton href="/">Back to home</LinkButton>
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
