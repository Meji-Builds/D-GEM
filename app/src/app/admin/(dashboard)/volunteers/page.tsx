import { prisma } from "@/lib/prisma";
import { VolunteerRow } from "./VolunteerRow";

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteerApplication.findMany({ orderBy: { appliedAt: "desc" } });

  return (
    <div>
      <h1 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">
        Volunteers · {volunteers.length}
      </h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">School</th>
              <th className="py-2">Availability</th>
              <th className="py-2">Status</th>
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
