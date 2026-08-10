"use server";

import { prisma } from "@/lib/prisma";

export type FeedbackState = { error?: string; ok?: boolean };

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const rating = Number(formData.get("rating") || 0);
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const testimonial = String(formData.get("testimonial") || "").trim();
  const bestSession = String(formData.get("bestSession") || "").trim();
  const improvement = String(formData.get("improvement") || "").trim();

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Please choose a rating from 1 to 5." };
  }

  await prisma.feedbackResponse.create({
    data: { rating, name, role, testimonial, bestSession, improvement },
  });
  return { ok: true };
}
