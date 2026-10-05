import type { LeaderboardEntry } from "@/lib/data";

const RANK_STYLE = ["border-gold bg-gold text-ink", "border-ink bg-mist text-ink", "border-ink bg-white text-ink"];

export function LeaderboardTable({ entries, dark = false }: { entries: LeaderboardEntry[]; dark?: boolean }) {
  if (entries.length === 0) {
    return (
      <p className={`text-sm ${dark ? "text-[#a8a29a]" : "text-mutefg"}`}>No scores yet — be the first to play!</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left">
        <thead>
          <tr className={`border-b-2 text-[10px] font-bold uppercase tracking-widest ${dark ? "border-[#3a3733] text-[#a8a29a]" : "border-ink text-mutefg"}`}>
            <th className="py-2 pr-4">Rank</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">School</th>
            <th className="py-2 pr-4 text-right">Riddles</th>
            <th className="py-2 pr-4 text-right">Crossword</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.ticketId} className={`border-b ${dark ? "border-[#3a3733]" : "border-hair"}`}>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                    i < 3 ? RANK_STYLE[i] : dark ? "border-[#3a3733] text-[#a8a29a]" : "border-line text-mutefg"
                  }`}
                >
                  {i + 1}
                </span>
              </td>
              <td className={`py-3 pr-4 text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>{e.fullName}</td>
              <td className={`py-3 pr-4 text-xs ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.school}</td>
              <td className={`py-3 pr-4 text-right text-sm ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.riddlesScore}</td>
              <td className={`py-3 pr-4 text-right text-sm ${dark ? "text-[#a8a29a]" : "text-bodyfg"}`}>{e.crosswordScore}</td>
              <td className={`py-3 text-right text-base font-extrabold ${dark ? "text-gold" : "text-ink"}`}>{e.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
