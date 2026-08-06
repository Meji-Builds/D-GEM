import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { RegisterForm } from "./RegisterForm";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function RegisterPage() {
  const settings = await getEventSettings();
  const registered = await prisma.attendee.count();
  const pct = Math.min(100, Math.round((registered / Math.max(1, settings.capacity)) * 100));

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto grid max-w-5xl gap-0 md:grid-cols-[1.4fr_1fr]">
          <div className="border-b-2 border-ink px-5 py-10 md:border-b-0 md:border-r-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              Free registration
            </p>
            <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Reserve your seat
            </h1>
            <div className="mt-6">
              <RegisterForm />
            </div>
          </div>
          <div className="bg-mist px-5 py-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
              You&apos;re registering for
            </p>
            <div className="mt-2 text-base font-bold">{settings.name}</div>
            <p className="mt-3 text-xs leading-8 text-bodyfg">
              {formatEventDateLabel(settings.eventDate)}
              <br />
              {settings.venue}
              <br />
              {settings.startTime} – {settings.endTime}
              <br />
              General admission · Free
            </p>
            <div className="mt-6 border-t-2 border-ink pt-4">
              <div className="font-display text-2xl font-extrabold">{registered}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-mutefg">
                of {settings.capacity} seats taken
              </div>
              <div className="mt-2 h-2 bg-line">
                <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter contactEmail={settings.contactEmail} contactPhone={settings.contactPhone} />
    </div>
  );
}
