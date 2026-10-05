"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function resetAllScores() {
  await prisma.gameLevelScore.deleteMany({});
  revalidatePath("/admin/games/leaderboard");
  revalidatePath("/games/leaderboard");
}
