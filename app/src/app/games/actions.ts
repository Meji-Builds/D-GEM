"use server";

import { prisma } from "@/lib/prisma";

export type VerifyPlayerState = { error?: string; ticketId?: string; fullName?: string };

export async function verifyPlayer(_prev: VerifyPlayerState, formData: FormData): Promise<VerifyPlayerState> {
  const query = String(formData.get("query") || "").trim();
  if (!query) return { error: "Enter your ticket ID or the email you registered with." };

  const attendee = query.includes("@")
    ? await prisma.attendee.findFirst({
        where: { email: { equals: query, mode: "insensitive" } },
        orderBy: { registeredAt: "desc" },
      })
    : await prisma.attendee.findUnique({ where: { ticketId: query.toUpperCase() } });

  if (!attendee) return { error: "We couldn't find a ticket matching that. Check the ID, or use your email instead." };

  return { ticketId: attendee.ticketId, fullName: attendee.fullName };
}

export type SubmitScoreState = { error?: string; ok?: boolean; best?: number };

export async function submitLevelScore(
  ticketId: string,
  game: "RIDDLES" | "CROSSWORD",
  level: number,
  score: number,
  maxScore: number
): Promise<SubmitScoreState> {
  const attendee = await prisma.attendee.findUnique({ where: { ticketId } });
  if (!attendee) return { error: "Ticket not recognized — please re-enter it from the games page." };
  if (level < 1 || level > 3) return { error: "Invalid level." };

  const clampedScore = Math.max(0, Math.min(score, maxScore));

  const existing = await prisma.gameLevelScore.findUnique({
    where: { ticketId_game_level: { ticketId, game, level } },
  });
  const best = Math.max(existing?.score ?? 0, clampedScore);

  await prisma.gameLevelScore.upsert({
    where: { ticketId_game_level: { ticketId, game, level } },
    update: { score: best, maxScore },
    create: { ticketId, game, level, score: best, maxScore },
  });

  return { ok: true, best };
}
