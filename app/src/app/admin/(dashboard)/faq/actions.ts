"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type FaqFormState = { error?: string; ok?: boolean };

export async function saveFaqItem(_prev: FaqFormState, formData: FormData): Promise<FaqFormState> {
  const id = String(formData.get("id") || "").trim();
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!question || !answer) return { error: "Question and answer are required." };

  if (id) {
    await prisma.faqItem.update({ where: { id }, data: { question, answer, order } });
  } else {
    const count = await prisma.faqItem.count();
    await prisma.faqItem.create({ data: { question, answer, order: order || count } });
  }

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { ok: true };
}

export async function deleteFaqItem(id: string) {
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
