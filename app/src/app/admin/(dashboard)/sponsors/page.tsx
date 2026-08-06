import { getEventSettings, getConvener } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { EventDetailsForm } from "./EventDetailsForm";
import { ConvenerForm } from "./ConvenerForm";
import { SponsorsSection } from "./SponsorsSection";

export default async function AdminSponsorsPage() {
  const [settings, convener, sponsors] = await Promise.all([
    getEventSettings(),
    getConvener(),
    prisma.sponsor.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">Event details (editable)</h1>
        <div className="mt-4">
          <EventDetailsForm
            initial={{
              name: settings.name,
              eventDate: settings.eventDate ? settings.eventDate.toISOString().slice(0, 10) : "",
              startTime: settings.startTime,
              endTime: settings.endTime,
              venue: settings.venue,
              capacity: settings.capacity,
              registrationState: settings.registrationState,
              aboutText: settings.aboutText,
              missionText: settings.missionText,
              visionText: settings.visionText,
              contactEmail: settings.contactEmail,
              contactPhone: settings.contactPhone,
              instagramUrl: settings.instagramUrl,
              twitterUrl: settings.twitterUrl,
            }}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">Convener</h2>
        <div className="mt-4">
          <ConvenerForm initial={{ name: convener.name, title: convener.title, note: convener.note, photoUrl: convener.photoUrl }} />
        </div>
      </div>

      <div>
        <h2 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">Sponsors by tier</h2>
        <p className="mt-2 text-xs text-mutefg">Sponsors appear on the landing page grouped by tier, in the order added.</p>
        <div className="mt-4">
          <SponsorsSection sponsors={sponsors} />
        </div>
      </div>
    </div>
  );
}
