import type { CrosswordPlacement } from "@/lib/crossword";

export function LayoutPreview({ width, height, placements }: { width: number; height: number; placements: CrosswordPlacement[] }) {
  const cells = new Map<string, { letter: string; number?: number }>();
  for (const p of placements) {
    const dr = p.dir === "down" ? 1 : 0;
    const dc = p.dir === "across" ? 1 : 0;
    for (let i = 0; i < p.word.length; i++) {
      const r = p.row + dr * i;
      const c = p.col + dc * i;
      const key = `${r},${c}`;
      const existing = cells.get(key);
      cells.set(key, { letter: p.word[i], number: i === 0 ? p.number : existing?.number });
    }
  }

  const rows = Array.from({ length: height }, (_, r) => r);
  const cols = Array.from({ length: width }, (_, c) => c);

  return (
    <div className="inline-block overflow-x-auto">
      <div className="inline-grid border border-ink" style={{ gridTemplateColumns: `repeat(${width}, 22px)` }}>
        {rows.map((r) =>
          cols.map((c) => {
            const cell = cells.get(`${r},${c}`);
            return (
              <div
                key={`${r}-${c}`}
                className={`relative h-[22px] w-[22px] border border-line text-center text-[9px] font-bold leading-[22px] ${
                  cell ? "bg-white text-ink" : "bg-ink"
                }`}
              >
                {cell?.number && <span className="absolute left-0.5 top-0 text-[6px] font-normal leading-none text-mutefg">{cell.number}</span>}
                {cell?.letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
