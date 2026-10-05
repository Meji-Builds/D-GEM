import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { CrosswordPlacement } from "@/lib/crossword";
import { WordForm } from "./WordForm";
import { DeleteButton } from "./DeleteButton";
import { RegenerateButton } from "./RegenerateButton";
import { LayoutPreview } from "./LayoutPreview";

export default async function AdminCrosswordPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; level?: string }>;
}) {
  const { edit, level } = await searchParams;
  const defaultLevel = Number(level || 1);
  const [words, layouts, editing] = await Promise.all([
    prisma.crosswordWord.findMany({ orderBy: [{ level: "asc" }, { order: "asc" }] }),
    prisma.crosswordLayout.findMany(),
    edit ? prisma.crosswordWord.findUnique({ where: { id: edit } }) : Promise.resolve(null),
  ]);

  const byLevel = [1, 2, 3].map((lvl) => ({
    level: lvl,
    items: words.filter((w) => w.level === lvl),
    layout: layouts.find((l) => l.level === lvl),
  }));

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Crossword · {words.length} words</h1>
        <Link href="/admin/games" className="text-xs font-semibold text-bodyfg hover:text-gold">← Games</Link>
      </div>
      <p className="mt-2 text-xs text-mutefg">
        Three rounds. After adding or editing a level&apos;s words, click &quot;Regenerate layout&quot; to rebuild its grid.
        Keep each level to around 10 words or fewer for a reliable fit.
      </p>

      {byLevel.map(({ level: lvl, items, layout }) => (
        <div key={lvl} className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-sm font-extrabold">Level {lvl} · {items.length} words</h2>
            <RegenerateButton level={lvl} />
          </div>

          {layout ? (
            <div className="mt-3 rounded-lg border border-line bg-mist p-3">
              <LayoutPreview width={layout.width} height={layout.height} placements={layout.placements as unknown as CrosswordPlacement[]} />
              {Array.isArray(layout.unplaced) && layout.unplaced.length > 0 && (
                <p className="mt-2 text-xs font-semibold text-red-800">Couldn&apos;t fit: {(layout.unplaced as string[]).join(", ")}</p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-xs text-mutefg">No layout generated yet.</p>
          )}

          <div className="mt-3 divide-y divide-hair">
            {items.map((w) => (
              <div key={w.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-bold">{w.word}</div>
                  <p className="mt-1 text-xs text-bodyfg">{w.clue} · {w.points} pts</p>
                </div>
                <div className="shrink-0 text-xs font-semibold whitespace-nowrap">
                  <Link href={`/admin/games/crossword?edit=${w.id}`} className="text-bodyfg hover:text-gold">Edit</Link>
                  {" · "}
                  <DeleteButton id={w.id} />
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="py-3 text-sm text-mutefg">No words in this level yet.</p>}
          </div>
        </div>
      ))}

      <div className="mt-8 rounded-2xl border-t-2 border-ink bg-mist p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-mutefg">
            {editing ? "Edit word" : "Add word"}
          </p>
          {edit && (
            <Link href="/admin/games/crossword" className="text-xs font-semibold text-bodyfg hover:text-gold">
              + New word instead
            </Link>
          )}
        </div>
        <div className="mt-4">
          <WordForm
            key={editing?.id ?? "new"}
            defaultLevel={defaultLevel}
            initial={editing ? { id: editing.id, level: editing.level, word: editing.word, clue: editing.clue, points: editing.points } : null}
          />
        </div>
      </div>
    </div>
  );
}
