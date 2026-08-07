import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export default async function AdminAttendeesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; gate?: string }>;
}) {
  const { q, status, gate } = await searchParams;

  const where: Prisma.AttendeeWhereInput = {};
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { ticketId: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status === "in") where.checkedIn = true;
  if (status === "out") where.checkedIn = false;
  if (gate) where.checkedInGate = gate;

  const [attendees, total, checkedIn, overrides, gateBreakdown] = await Promise.all([
    prisma.attendee.findMany({ where, orderBy: { registeredAt: "desc" }, take: 100 }),
    prisma.attendee.count(),
    prisma.attendee.count({ where: { checkedIn: true } }),
    prisma.checkIn.count({ where: { overridden: true } }),
    prisma.attendee.groupBy({
      by: ["checkedInGate"],
      where: { checkedIn: true, checkedInGate: { not: null } },
      _count: true,
      orderBy: { _count: { checkedInGate: "desc" } },
    }),
  ]);
  const turnout = total ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Attendees · {total}</h1>
        <a href="/api/admin/attendees/export" className="border border-ink px-4 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-ink hover:text-white">
          Export CSV
        </a>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-0 border-b-2 border-ink sm:grid-cols-4">
        <div className="border-b border-r border-hair py-3 pr-3 sm:border-b-0">
          <div className="font-display text-2xl font-extrabold">{total}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-mutefg">Registered</div>
        </div>
        <div className="border-b border-hair py-3 pl-3 sm:border-b-0 sm:border-r">
          <div className="font-display text-2xl font-extrabold">{checkedIn}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-mutefg">Scanned in</div>
        </div>
        <div className="border-r border-hair py-3 pr-3">
          <div className="font-display text-2xl font-extrabold">{turnout}%</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-mutefg">Turnout</div>
        </div>
        <div className="py-3 pl-3">
          <div className="font-display text-2xl font-extrabold">{overrides}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-mutefg">Gate overrides</div>
        </div>
      </div>

      {gateBreakdown.length > 0 && (
        <div className="mt-4 border-b-2 border-ink pb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">Check-ins by gate</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {gateBreakdown.map((g) => (
              <Link
                key={g.checkedInGate}
                href={`/admin/attendees?gate=${encodeURIComponent(g.checkedInGate!)}`}
                className={`border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  gate === g.checkedInGate ? "border-gold bg-gold" : "border-ink hover:bg-mist"
                }`}
              >
                {g.checkedInGate} · {g._count}
              </Link>
            ))}
            {gate && (
              <Link href="/admin/attendees" className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-mutefg underline decoration-dotted hover:text-gold">
                Clear gate filter
              </Link>
            )}
          </div>
        </div>
      )}

      <form className="mt-4 flex flex-wrap items-center gap-2" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone or ticket ID"
          className="h-10 min-w-[240px] flex-1 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
        />
        <input type="hidden" name="status" value={status ?? ""} />
        <input type="hidden" name="gate" value={gate ?? ""} />
        <Link href="/admin/attendees" className={`border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${!status ? "border-gold bg-gold" : "border-ink"}`}>All</Link>
        <Link href="/admin/attendees?status=in" className={`border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${status === "in" ? "border-gold bg-gold" : "border-ink"}`}>Checked in</Link>
        <Link href="/admin/attendees?status=out" className={`border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${status === "out" ? "border-gold bg-gold" : "border-ink"}`}>Not yet</Link>
        <button className="border border-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-ink hover:text-white" type="submit">Search</button>
      </form>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">School</th>
              <th className="py-2 pr-4">Level</th>
              <th className="py-2 pr-4">Ticket</th>
              <th className="py-2 pr-4">Gate</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a) => (
              <tr key={a.id} className="border-b border-hair transition-colors hover:bg-mist">
                <td className="py-2 pr-4 whitespace-nowrap">
                  <Link href={`/admin/attendees/${a.id}`} className="font-semibold hover:text-gold">{a.fullName}</Link>
                </td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.email}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.school}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.level}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.ticketId}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.checkedInGate || "-"}</td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {a.checkedIn ? (
                    <span className="border border-gold bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      In {a.checkedInAt ? new Date(a.checkedInAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  ) : (
                    <span className="border border-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Not yet</span>
                  )}
                </td>
              </tr>
            ))}
            {attendees.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-mutefg">No attendees match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mutefg">Row click opens the attendee: full details, QR, resend email, manual check-in.</p>
    </div>
  );
}
