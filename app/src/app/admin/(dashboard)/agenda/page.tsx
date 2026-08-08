import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAgenda } from "@/lib/data";
import { AgendaForm } from "./AgendaForm";
import { DeleteButton } from "./DeleteButton";

export default async function AdminAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const [agenda, speakers, editing] = await Promise.all([
    getAgenda(),
    prisma.speaker.findMany({ orderBy: { order: "asc" } }),
    edit
      ? prisma.agendaItem.findUnique({ where: { id: edit }, include: { speakers: true } })
      : Promise.resolve(null),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Agenda · {agenda.length}</h1>
        {edit && (
          <Link href="/admin/agenda" className="text-xs font-semibold text-bodyfg hover:text-gold">
            + New item instead
          </Link>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[9px] font-bold uppercase tracking-wider text-mutefg">
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Duration</th>
              <th className="py-2 pr-4">Speakers</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {agenda.map((a) => (
              <tr key={a.id} className="border-b border-hair transition-colors hover:bg-mist">
                <td className="py-2 pr-4 font-semibold whitespace-nowrap">{a.time}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.title}</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">{a.durationMin} min</td>
                <td className="py-2 pr-4 whitespace-nowrap text-bodyfg">
                  {a.speakers.map(({ speaker }) => speaker.name).join(", ") || "-"}
                </td>
                <td className="py-2 text-right text-xs font-semibold whitespace-nowrap">
                  <Link href={`/admin/agenda?edit=${a.id}`} className="text-bodyfg hover:text-gold">Edit</Link>
                  {" · "}
                  <DeleteButton id={a.id} />
                </td>
              </tr>
            ))}
            {agenda.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-mutefg">No agenda items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl border-t-2 border-ink bg-mist p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
          {editing ? `Edit: ${editing.title}` : "Add agenda item"}
        </p>
        <div className="mt-4">
          <AgendaForm
            key={editing?.id ?? "new"}
            initial={
              editing
                ? {
                    id: editing.id,
                    time: editing.time,
                    durationMin: editing.durationMin,
                    title: editing.title,
                    description: editing.description,
                    order: editing.order,
                    speakerIds: editing.speakers.map((s) => s.speakerId),
                  }
                : null
            }
            speakers={speakers.map((s) => ({ id: s.id, name: s.name }))}
          />
        </div>
      </div>
    </div>
  );
}
