import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SpeakerForm } from "./SpeakerForm";
import { DeleteButton } from "./DeleteButton";

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

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
            <th className="py-2"></th>
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Session</th>
            <th className="py-2">State</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {speakers.map((s) => (
            <tr key={s.id} className="border-b border-hair">
              <td className="py-2">
                {s.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.photoUrl} alt={s.name} className="h-7 w-7 object-cover" />
                ) : (
                  <div className="placeholder-fill h-7 w-7 border border-line" />
                )}
              </td>
              <td className="py-2 font-semibold">{s.name}</td>
              <td className="py-2 text-bodyfg">{s.role}, {s.organisation}</td>
              <td className="py-2 text-bodyfg">{s.session || "—"}</td>
              <td className="py-2">
                <span className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${s.state === "LIVE" ? "border-gold bg-gold" : "border-ink"}`}>
                  {s.state === "LIVE" ? "Live" : !s.photoUrl ? "No photo" : "Draft"}
                </span>
              </td>
              <td className="py-2 text-right text-xs font-semibold">
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

      <div className="mt-8 border-t-2 border-ink bg-mist p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
          {editing ? `Edit speaker — ${editing.name}` : "Add speaker"}
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
