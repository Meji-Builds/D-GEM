import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";
import { pickPlayerSet } from "@/lib/gameRandom";
import { RIDDLES_PER_LEVEL } from "@/lib/gameLevels";
import { getVerifiedPlayer } from "../actions";
import { RiddlesGame } from "./RiddlesGame";

export default async function RiddlesPage() {
  const [settings, player] = await Promise.all([getEventSettings(), getVerifiedPlayer()]);

  if (!player) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicNav />
        <main className="flex-1">
          <div className="mx-auto max-w-sm px-5 py-12 text-center sm:px-8">
            <p className="text-sm text-mutefg">You need to enter your ticket ID first.</p>
            <Link href="/games" className="mt-4 inline-block text-sm font-bold underline hover:text-gold">Go to games</Link>
          </div>
        </main>
        <PublicFooter
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          instagramUrl={settings.instagramUrl}
          twitterUrl={settings.twitterUrl}
          tiktokUrl={settings.tiktokUrl}
        />
      </div>
    );
  }

  const allRiddles = await prisma.gameRiddle.findMany({ orderBy: [{ level: "asc" }, { order: "asc" }] });
  const riddlesByLevel: Record<number, { id: string; question: string; answer: string; points: number }[]> = { 1: [], 2: [], 3: [] };
  for (const level of [1, 2, 3]) {
    const pool = allRiddles.filter((r) => r.level === level);
    riddlesByLevel[level] = pickPlayerSet(pool, `${player.ticketId}:RIDDLES:${level}`, RIDDLES_PER_LEVEL[level]);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <RiddlesGame player={player} riddlesByLevel={riddlesByLevel} />
        </div>
      </main>
      <PublicFooter
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        instagramUrl={settings.instagramUrl}
        twitterUrl={settings.twitterUrl}
        tiktokUrl={settings.tiktokUrl}
      />
    </div>
  );
}
