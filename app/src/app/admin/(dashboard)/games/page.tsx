import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";
import { TimerPanel } from "./TimerPanel";

export default async function AdminGamesHubPage() {
  const [riddleCount, wordCount, scoreCount, settings] = await Promise.all([
    prisma.gameRiddle.count(),
    prisma.crosswordWord.count(),
    prisma.gameLevelScore.count(),
    getEventSettings(),
  ]);

  const cards = [
    { href: "/admin/games/riddles", title: "Riddles", desc: `${riddleCount} riddles across 3 levels` },
    { href: "/admin/games/crossword", title: "Word Search", desc: `${wordCount} words across 3 levels` },
    { href: "/admin/games/leaderboard", title: "Leaderboard", desc: `${scoreCount} scores recorded — present on screen` },
  ];

  return (
    <div>
      <h1 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">Games & Leaderboard</h1>
      <p className="mt-3 text-xs text-mutefg">
        The networking-session game: riddles and a word search, both themed around D-GEM. Players enter their ticket ID to play,
        so every score is tied to a real attendee.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-line p-5 shadow-sm transition-colors hover:border-ink hover:bg-mist"
          >
            <div className="font-display text-base font-extrabold">{c.title}</div>
            <p className="mt-1 text-xs text-mutefg">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <TimerPanel gameDurationMinutes={settings.gameDurationMinutes} />
      </div>
    </div>
  );
}
