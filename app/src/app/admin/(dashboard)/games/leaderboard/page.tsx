import Link from "next/link";
import { getLeaderboard } from "@/lib/data";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { ResetButton } from "./ResetButton";

export default async function AdminLeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <h1 className="font-display text-lg font-extrabold">Leaderboard · {entries.length}</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/games" className="text-xs font-semibold text-bodyfg hover:text-gold">← Games</Link>
          <a
            href="/games/leaderboard"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-ink hover:text-white"
          >
            Open presentation view
          </a>
          <ResetButton />
        </div>
      </div>
      <div className="mt-4">
        <LeaderboardTable entries={entries} />
      </div>
    </div>
  );
}
