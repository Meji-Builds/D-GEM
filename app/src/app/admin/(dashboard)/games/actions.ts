"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type GamesFormState = { error?: string; ok?: boolean };

export async function updateGameDuration(_prev: GamesFormState, formData: FormData): Promise<GamesFormState> {
  const minutes = Number(formData.get("gameDurationMinutes"));
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 120) {
    return { error: "Enter a duration between 1 and 120 minutes." };
  }

  await prisma.eventSettings.upsert({
    where: { id: "event" },
    update: { gameDurationMinutes: Math.round(minutes) },
    create: { id: "event", gameDurationMinutes: Math.round(minutes) },
  });

  revalidatePath("/admin/games");
  revalidatePath("/games", "layout");
  return { ok: true };
}

// Clears every player's started-at timestamp, so the next time anyone opens
// a game their countdown restamps from scratch at whatever the duration is
// set to now — handy while still testing, not meant for mid-event use.
export async function resetAllGameTimers(): Promise<GamesFormState> {
  await prisma.attendee.updateMany({ data: { gameStartedAt: null } });
  revalidatePath("/admin/games");
  return { ok: true };
}

export async function resetPlayerTimer(_prev: GamesFormState, formData: FormData): Promise<GamesFormState> {
  const ticketId = String(formData.get("ticketId") || "").trim().toUpperCase();
  if (!ticketId) return { error: "Enter a ticket ID." };

  const result = await prisma.attendee.updateMany({ where: { ticketId }, data: { gameStartedAt: null } });
  if (result.count === 0) return { error: "No attendee with that ticket ID." };

  revalidatePath("/admin/games");
  return { ok: true };
}
