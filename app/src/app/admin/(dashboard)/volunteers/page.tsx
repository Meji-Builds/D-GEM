import { prisma } from "@/lib/prisma";
import { VolunteerRow } from "./VolunteerRow";

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteerApplication.findMany({ orderBy: { appliedAt: "desc" } });
  const acceptedWithBadge = volunteers.filter((v) => v.status === "ACCEPTED" && v.crewId).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Volunteers · {volunteers.length}</h1>
        {acceptedWithBadge > 0 && (
          <a
            href="/admin/volunteers/badges"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white"
          >
            Print all badges ({acceptedWithBadge})
          </a>
        )}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">School</th>
              <th className="py-2 pr-4">Availability</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v) => (
              <VolunteerRow key={v.id} v={v} />
            ))}
            {volunteers.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-mutefg">No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
