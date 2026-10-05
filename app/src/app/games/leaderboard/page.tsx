import { getLeaderboard } from "@/lib/data";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Logo } from "@/components/Logo";
import { AutoRefresh } from "./AutoRefresh";

export default async function PublicLeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div className="badge-texture print-exact-colors min-h-screen px-6 py-10 text-white sm:px-12">
      <AutoRefresh />
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Logo size="md" dark />
          <span className="rounded-full border border-gold bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-[0_0_16px_rgba(201,162,39,0.5)]">
            Live
          </span>
        </div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-widest text-gold">Games leaderboard</p>
        <h1 className="font-display mt-1 text-3xl font-extrabold sm:text-4xl">Who&apos;s leading?</h1>

        <div className="mt-8 rounded-2xl border border-[#3a3733] bg-black/20 p-4 sm:p-6">
          <LeaderboardTable entries={entries} dark />
        </div>
      </div>
    </div>
  );
}
