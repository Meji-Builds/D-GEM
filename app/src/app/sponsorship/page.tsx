import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { getEventSettings } from "@/lib/data";
import { EnquiryForm } from "./EnquiryForm";

export default async function SponsorshipPage() {
  const settings = await getEventSettings();
  const tiers = [
    { name: "Gold", perks: settings.goldPerks.split("\n").filter(Boolean), gold: true },
    { name: "Silver", perks: settings.silverPerks.split("\n").filter(Boolean), gold: false },
    { name: "Bronze", perks: settings.bronzePerks.split("\n").filter(Boolean), gold: false },
  ];
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="border-b-2 border-ink px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Partner with D-GEM
            </p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Put your brand in front of {settings.capacity}+ students.
            </h1>
            {settings.sponsorshipPitch && (
              <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-bodyfg">
                {settings.sponsorshipPitch}
              </p>
            )}
          </div>
        </div>

        <div className="grid border-b-2 border-ink sm:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`border-b-2 border-ink px-5 py-8 transition-colors last:border-b-0 sm:border-b-0 sm:border-r-2 sm:px-8 sm:last:border-r-0 ${
                t.gold ? "bg-gold" : "hover:bg-mist"
              }`}
            >
              <div className="text-base font-bold">{t.name}</div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {t.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Enquiry</p>
            <div className="mt-4">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
