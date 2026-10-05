import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";
import { pickPlayerSet, createSeededRandom } from "@/lib/gameRandom";
import { CROSSWORD_WORDS_PER_LEVEL, WORD_SEARCH_SIZE_PER_LEVEL } from "@/lib/gameLevels";
import { buildPlayerWordSearch, type WordSearchResult } from "@/lib/wordsearch";
import { getVerifiedPlayer } from "../actions";
import { WordSearchGame } from "./WordSearchGame";

export default async function WordSearchPage() {
  const [settings, player] = await Promise.all([getEventSettings(), getVerifiedPlayer()]);

  if (!player) {
    return (
      <div className="flex min-h-full flex-col">
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

  const allWords = await prisma.crosswordWord.findMany({ orderBy: [{ level: "asc" }, { order: "asc" }] });
  const puzzlesByLevel: Record<number, WordSearchResult | null> = { 1: null, 2: null, 3: null };
  for (const level of [1, 2, 3]) {
    const pool = allWords.filter((w) => w.level === level);
    if (pool.length === 0) continue;
    puzzlesByLevel[level] = buildPlayerWordSearch(
      pool.map((w) => ({ id: w.id, word: w.word, clue: w.clue, points: w.points })),
      `${player.ticketId}:WORDSEARCH:${level}`,
      CROSSWORD_WORDS_PER_LEVEL[level],
      WORD_SEARCH_SIZE_PER_LEVEL[level],
      pickPlayerSet,
      createSeededRandom
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <WordSearchGame player={player} puzzlesByLevel={puzzlesByLevel} />
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
