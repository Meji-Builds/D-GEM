import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RiddleForm } from "./RiddleForm";
import { DeleteButton } from "./DeleteButton";

export default async function AdminRiddlesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; level?: string }>;
}) {
  const { edit, level } = await searchParams;
  const defaultLevel = Number(level || 1);
  const [riddles, editing] = await Promise.all([
    prisma.gameRiddle.findMany({ orderBy: [{ level: "asc" }, { order: "asc" }] }),
    edit ? prisma.gameRiddle.findUnique({ where: { id: edit } }) : Promise.resolve(null),
  ]);

  const byLevel = [1, 2, 3].map((lvl) => ({ level: lvl, items: riddles.filter((r) => r.level === lvl) }));

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Riddles · {riddles.length}</h1>
        <Link href="/admin/games" className="text-xs font-semibold text-bodyfg hover:text-gold">← Games</Link>
      </div>
      <p className="mt-2 text-xs text-mutefg">Three rounds, each harder than the last. Players play Level 1 → 2 → 3 in order.</p>

      {byLevel.map(({ level: lvl, items }) => (
        <div key={lvl} className="mt-8">
          <h2 className="font-display text-sm font-extrabold">Level {lvl} · {items.length} riddles</h2>
          <div className="mt-3 divide-y divide-hair">
            {items.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-bold">{r.question}</div>
                  <p className="mt-1 text-xs text-bodyfg">Answer: {r.answer} · {r.points} pts</p>
                </div>
                <div className="shrink-0 text-xs font-semibold whitespace-nowrap">
                  <Link href={`/admin/games/riddles?edit=${r.id}`} className="text-bodyfg hover:text-gold">Edit</Link>
                  {" · "}
                  <DeleteButton id={r.id} />
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="py-3 text-sm text-mutefg">No riddles in this level yet.</p>}
          </div>
        </div>
      ))}

      <div className="mt-8 rounded-2xl border-t-2 border-ink bg-mist p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
            {editing ? "Edit riddle" : "Add riddle"}
          </p>
          {edit && (
            <Link href="/admin/games/riddles" className="text-xs font-semibold text-bodyfg hover:text-gold">
              + New riddle instead
            </Link>
          )}
        </div>
        <div className="mt-4">
          <RiddleForm
            key={editing?.id ?? "new"}
            defaultLevel={defaultLevel}
            initial={editing ? { id: editing.id, level: editing.level, question: editing.question, answer: editing.answer, points: editing.points } : null}
          />
        </div>
      </div>
    </div>
  );
}
