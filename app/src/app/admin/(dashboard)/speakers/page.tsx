import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SpeakerForm } from "./SpeakerForm";
import { DeleteButton } from "./DeleteButton";
import { accentForIndex, accentBgClass } from "@/components/PhotoOrPlaceholder";

export default async function AdminSpeakersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [speakers, editing] = await Promise.all([
    prisma.speaker.findMany({ orderBy: { order: "asc" } }),
    edit ? prisma.speaker.findUnique({ where: { id: edit } }) : Promise.resolve(null),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Speakers · {speakers.length}</h1>
        {edit && (
          <Link href="/admin/speakers" className="text-xs font-semibold text-bodyfg hover:text-gold">
            + New speaker instead
          </Link>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
              <th className="py-2 pr-4"></th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Session</th>
              <th className="py-2 pr-4">State</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((s) => (
              <tr key={s.id} className="border-b border-hair transition-colors hover:bg-mist">
                <td className="py-2 pr-4">
                  {s.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photoUrl} alt={s.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className={`h-7 w-7 rounded-full ${accentBgClass(accentForIndex(s.order))}`} />
                  )}
                </td>
                <td className="py-2 pr-4 font-semibold whitespace-nowrap">{s.name}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{s.role}, {s.organisation}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{s.session || "-"}</td>
                <td className="py-2 pr-4">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${s.state === "LIVE" ? "border-gold bg-gold" : "border-ink"}`}>
                    {s.state === "LIVE" ? "Live" : !s.photoUrl ? "No photo" : "Draft"}
                  </span>
                </td>
                <td className="py-2 text-right text-xs font-semibold whitespace-nowrap">
                  <Link href={`/admin/speakers?edit=${s.id}`} className="text-bodyfg hover:text-gold">Edit</Link>
                  {" · "}
                  <DeleteButton id={s.id} />
                </td>
              </tr>
            ))}
            {speakers.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-mutefg">No speakers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl border-t-2 border-ink bg-mist p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
          {editing ? `Edit speaker: ${editing.name}` : "Add speaker"}
        </p>
        <div className="mt-4">
          <SpeakerForm
            key={editing?.id ?? "new"}
            initial={
              editing
                ? {
                    id: editing.id,
                    name: editing.name,
                    role: editing.role,
                    organisation: editing.organisation,
                    session: editing.session,
                    bio: editing.bio,
                    linkedinUrl: editing.linkedinUrl,
                    socialUrl: editing.socialUrl,
                    photoUrl: editing.photoUrl,
                  }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
