import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { getEventSettings } from "@/lib/data";
import { VolunteerForm } from "./VolunteerForm";

export default async function VolunteerPage() {
  const settings = await getEventSettings();
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Join the crew</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Build it with us.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-bodyfg">
            Conference 1.0 runs on volunteers. Pick a role that fits you — no experience required,
            just willingness to show up.
          </p>
          <div className="mt-10">
            <VolunteerForm />
          </div>
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
