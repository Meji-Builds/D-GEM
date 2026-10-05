import type { WordSearchPlacement } from "@/lib/wordsearch";

export function LayoutPreview({ grid, words }: { grid: string[][]; words: WordSearchPlacement[] }) {
  const highlighted = new Set<string>();
  for (const w of words) {
    const vectors: Record<string, [number, number]> = {
      E: [0, 1], W: [0, -1], N: [-1, 0], S: [1, 0], NE: [-1, 1], NW: [-1, -1], SE: [1, 1], SW: [1, -1],
    };
    const [dr, dc] = vectors[w.dir];
    for (let i = 0; i < w.word.length; i++) highlighted.add(`${w.row + dr * i},${w.col + dc * i}`);
  }

  return (
    <div className="inline-block overflow-x-auto">
      <div className="inline-grid border border-ink" style={{ gridTemplateColumns: `repeat(${grid.length}, 22px)` }}>
        {grid.map((row, r) =>
          row.map((letter, c) => (
            <div
              key={`${r}-${c}`}
              className={`flex h-[22px] w-[22px] items-center justify-center border border-line text-[10px] font-bold ${
                highlighted.has(`${r},${c}`) ? "bg-gold text-ink" : "bg-white text-mutefg"
              }`}
            >
              {letter}
            </div>
          ))
        )}
      </div>
      <p className="mt-2 text-xs text-bodyfg">Word bank: {words.map((w) => w.word).join(", ")}</p>
    </div>
  );
}
