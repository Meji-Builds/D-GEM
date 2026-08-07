import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEventSettings, formatEventDateLabel } from "@/lib/data";
import { ArrowRightIcon } from "@/components/Icon";
import { ProgressBar } from "@/components/ProgressBar";

export default async function AdminOverviewPage() {
  const settings = await getEventSettings();
  const [registered, checkedIn, speakers, sponsors, volunteersPending, newEnquiries, todayStart] =
    await Promise.all([
      prisma.attendee.count(),
      prisma.attendee.count({ where: { checkedIn: true } }),
      prisma.speaker.findMany(),
      prisma.sponsor.count(),
      prisma.volunteerApplication.count({ where: { status: "PENDING" } }),
      prisma.sponsorshipEnquiry.count({ where: { status: "NEW" } }),
      (() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      })(),
    ]);
  const registeredToday = await prisma.attendee.count({ where: { registeredAt: { gte: todayStart } } });

  const speakersMissingPhoto = speakers.filter((s) => !s.photoUrl).length;
  const speakersDraft = speakers.filter((s) => s.state === "DRAFT").length;
  const pct = settings.capacity ? Math.round((registered / settings.capacity) * 100) : 0;
  const checkinPct = registered ? Math.round((checkedIn / registered) * 100) : 0;

  const needsAttention: string[] = [];
  if (speakersMissingPhoto > 0) needsAttention.push(`${speakersMissingPhoto} speaker(s) missing a photo`);
  if (speakersDraft > 0) needsAttention.push(`${speakersDraft} speaker(s) still in draft`);
  if (sponsors === 0) needsAttention.push("No sponsors added yet");
  if (volunteersPending > 0) needsAttention.push(`${volunteersPending} volunteer application(s) awaiting review`);
  if (newEnquiries > 0) needsAttention.push(`${newEnquiries} new sponsorship enquiry(ies)`);
  if (needsAttention.length === 0) needsAttention.push("Nothing needs attention right now.");

  const contentBlocks = [
    { name: "Event details", state: settings.venue && settings.eventDate ? "Live" : "Draft" },
    { name: `Speakers (${speakers.length})`, state: speakersDraft === 0 && speakers.length > 0 ? "Live" : "Draft" },
    { name: `Sponsors (${sponsors})`, state: sponsors > 0 ? "Live" : "Draft" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">{settings.name}</p>
          <h1 className="font-display mt-1 text-xl font-extrabold">
            {formatEventDateLabel(settings.eventDate)} · {settings.venue}
          </h1>
        </div>
        <Link href="/admin/sponsors" className="border border-ink px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-ink hover:text-white">
          Edit event details
        </Link>
      </div>

      <div className="mt-6 grid gap-0 sm:grid-cols-3">
        <div className="border-b-2 border-ink pb-4 sm:border-b-0 sm:border-r-2 sm:pr-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Registrations</p>
          <div className="font-display mt-1 text-3xl font-extrabold">{registered}</div>
          <p className="mt-1 text-xs text-mutefg">+{registeredToday} today · {pct}% of {settings.capacity}</p>
          <ProgressBar pct={pct} className="mt-2 h-2 bg-line" />
        </div>
        <div className="border-b-2 border-ink py-4 sm:border-b-0 sm:border-r-2 sm:px-6 sm:py-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Checked in</p>
          <div className="font-display mt-1 text-3xl font-extrabold">{checkedIn}</div>
          <p className="mt-1 text-xs text-mutefg">{checkinPct}% of registered</p>
        </div>
        <div className="pt-4 sm:pl-6 sm:pt-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Needs attention</p>
          <ul className="mt-2 space-y-1 text-xs text-bodyfg">
            {needsAttention.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Content blocks · Publish state</p>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
                <th className="py-2">Block</th>
                <th className="py-2">State</th>
              </tr>
            </thead>
            <tbody>
              {contentBlocks.map((b) => (
                <tr key={b.name} className="border-b border-hair">
                  <td className="py-2">{b.name}</td>
                  <td className="py-2">
                    <span
                      className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        b.state === "Live" ? "border-gold bg-gold" : "border-ink"
                      }`}
                    >
                      {b.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Quick actions</p>
          <div className="mt-3 flex flex-col gap-2">
            {[
              { href: "/admin/speakers", label: "Add speaker" },
              { href: "/admin/sponsors", label: "Edit date & venue" },
              { href: "/admin/sponsors", label: "Add sponsor" },
              { href: "/admin/attendees", label: "Export attendees" },
              { href: "/admin/volunteers", label: "Review volunteers" },
              { href: "/admin/enquiries", label: "View enquiries" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="group flex items-center justify-between border border-ink px-4 py-2.5 text-xs font-bold transition-colors hover:bg-ink hover:text-white"
              >
                {a.label}
                <ArrowRightIcon className="h-3.5 w-3.5 text-gold transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
