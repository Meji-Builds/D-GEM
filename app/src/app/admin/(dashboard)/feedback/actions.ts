"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function approveFeedback(id: string) {
  await prisma.feedbackResponse.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/feedback");
  revalidatePath("/", "layout");
  revalidatePath("/testimonials");
}

export async function rejectFeedback(id: string) {
  await prisma.feedbackResponse.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/feedback");
  revalidatePath("/", "layout");
  revalidatePath("/testimonials");
}

export async function resetFeedbackStatus(id: string) {
  await prisma.feedbackResponse.update({ where: { id }, data: { status: "PENDING" } });
  revalidatePath("/admin/feedback");
  revalidatePath("/", "layout");
  revalidatePath("/testimonials");
}
