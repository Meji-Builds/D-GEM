"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const TICKET_COOKIE = "dgem_game_ticket";

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

  // Set server-side so the riddles/crossword pages can resolve who's asking
  // and build that player's own random question set — not just trust
  // whatever ticketId a client happened to send.
  const store = await cookies();
  store.set(TICKET_COOKIE, attendee.ticketId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return { ticketId: attendee.ticketId, fullName: attendee.fullName };
}

export async function clearPlayerCookie() {
  const store = await cookies();
  store.delete(TICKET_COOKIE);
}

export async function getVerifiedPlayer(): Promise<{ ticketId: string; fullName: string } | null> {
  const store = await cookies();
  const ticketId = store.get(TICKET_COOKIE)?.value;
  if (!ticketId) return null;
  const attendee = await prisma.attendee.findUnique({ where: { ticketId } });
  if (!attendee) return null;
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
