"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type RiddleFormState = { error?: string; ok?: boolean };

export async function saveRiddle(_prev: RiddleFormState, formData: FormData): Promise<RiddleFormState> {
  const id = String(formData.get("id") || "").trim();
  const level = Number(formData.get("level") || 1);
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const points = Number(formData.get("points") || 10);

  if (!question || !answer) return { error: "Question and answer are required." };
  if (level < 1 || level > 3) return { error: "Level must be 1, 2, or 3." };

  if (id) {
    await prisma.gameRiddle.update({ where: { id }, data: { level, question, answer, points } });
  } else {
    const count = await prisma.gameRiddle.count({ where: { level } });
    await prisma.gameRiddle.create({ data: { level, question, answer, points, order: count } });
  }

  revalidatePath("/admin/games/riddles");
  return { ok: true };
}

export async function deleteRiddle(id: string) {
  await prisma.gameRiddle.delete({ where: { id } });
  revalidatePath("/admin/games/riddles");
}
