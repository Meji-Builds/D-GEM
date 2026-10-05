"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateCrossword } from "@/lib/crossword";

export type CrosswordFormState = { error?: string; ok?: boolean };

export async function saveCrosswordWord(_prev: CrosswordFormState, formData: FormData): Promise<CrosswordFormState> {
  const id = String(formData.get("id") || "").trim();
  const level = Number(formData.get("level") || 1);
  const word = String(formData.get("word") || "").trim();
  const clue = String(formData.get("clue") || "").trim();
  const points = Number(formData.get("points") || 10);

  if (!word || !clue) return { error: "Word and clue are required." };
  if (level < 1 || level > 3) return { error: "Level must be 1, 2, or 3." };

  if (id) {
    await prisma.crosswordWord.update({ where: { id }, data: { level, word, clue, points } });
  } else {
    const count = await prisma.crosswordWord.count({ where: { level } });
    await prisma.crosswordWord.create({ data: { level, word, clue, points, order: count } });
  }

  revalidatePath("/admin/games/crossword");
  return { ok: true };
}

export async function deleteCrosswordWord(id: string) {
  await prisma.crosswordWord.delete({ where: { id } });
  revalidatePath("/admin/games/crossword");
}

export async function regenerateLayout(level: number): Promise<CrosswordFormState> {
  const words = await prisma.crosswordWord.findMany({ where: { level }, orderBy: { order: "asc" } });
  if (words.length === 0) {
    await prisma.crosswordLayout.deleteMany({ where: { level } });
    revalidatePath("/admin/games/crossword");
    return { error: "Add at least one word to this level first." };
  }

  const result = generateCrossword(words.map((w) => ({ id: w.id, word: w.word, clue: w.clue, points: w.points })));

  await prisma.crosswordLayout.upsert({
    where: { level },
    update: { width: result.width, height: result.height, placements: result.placements, unplaced: result.unplaced },
    create: { level, width: result.width, height: result.height, placements: result.placements, unplaced: result.unplaced },
  });

  revalidatePath("/admin/games/crossword");
  revalidatePath("/games/crossword");

  if (result.unplaced.length > 0) {
    return { error: `Generated, but couldn't fit: ${result.unplaced.join(", ")}. Try editing or removing those words.` };
  }
  return { ok: true };
}
