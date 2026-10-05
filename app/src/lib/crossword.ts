export type CrosswordDirection = "across" | "down";

export type CrosswordInputWord = {
  id: string;
  word: string;
  clue: string;
  points: number;
};

export type CrosswordPlacement = {
  id: string;
  word: string; // normalized A-Z only, uppercase
  clue: string;
  points: number;
  row: number;
  col: number;
  dir: CrosswordDirection;
  number: number;
};

export type CrosswordLayoutResult = {
  width: number;
  height: number;
  placements: CrosswordPlacement[];
  unplaced: string[]; // original (unnormalized) words that couldn't be placed
};

function normalize(word: string): string {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

type Grid = Map<string, string>;
const key = (r: number, c: number) => `${r},${c}`;

function canPlace(grid: Grid, word: string, row: number, col: number, dir: CrosswordDirection): boolean {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;

  // Cell immediately before the start and immediately after the end must be empty,
  // so this word doesn't visually run into another word end-to-end.
  const beforeR = row - dr;
  const beforeC = col - dc;
  if (grid.has(key(beforeR, beforeC))) return false;
  const afterR = row + dr * word.length;
  const afterC = col + dc * word.length;
  if (grid.has(key(afterR, afterC))) return false;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = grid.get(key(r, c));
    if (existing !== undefined) {
      if (existing !== word[i]) return false;
      // Intersection — fine, no perpendicular-neighbor check needed here.
      continue;
    }
    // New cell: the perpendicular neighbors must be empty, otherwise this
    // letter would sit directly alongside another word's letter with no gap.
    if (dir === "across") {
      if (grid.has(key(r - 1, c)) || grid.has(key(r + 1, c))) return false;
    } else {
      if (grid.has(key(r, c - 1)) || grid.has(key(r, c + 1))) return false;
    }
  }
  return true;
}

function placeOnGrid(grid: Grid, word: string, row: number, col: number, dir: CrosswordDirection) {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    grid.set(key(row + dr * i, col + dc * i), word[i]);
  }
}

function findBestPlacement(
  grid: Grid,
  word: string
): { row: number; col: number; dir: CrosswordDirection; intersections: number } | null {
  let best: { row: number; col: number; dir: CrosswordDirection; intersections: number } | null = null;

  for (const [cellKey, letter] of grid) {
    const [gr, gc] = cellKey.split(",").map(Number);
    for (let i = 0; i < word.length; i++) {
      if (word[i] !== letter) continue;

      const candidates: Array<{ row: number; col: number; dir: CrosswordDirection }> = [
        { row: gr, col: gc - i, dir: "across" },
        { row: gr - i, col: gc, dir: "down" },
      ];

      for (const cand of candidates) {
        if (!canPlace(grid, word, cand.row, cand.col, cand.dir)) continue;
        let intersections = 0;
        const dr = cand.dir === "down" ? 1 : 0;
        const dc = cand.dir === "across" ? 1 : 0;
        for (let j = 0; j < word.length; j++) {
          if (grid.has(key(cand.row + dr * j, cand.col + dc * j))) intersections++;
        }
        if (!best || intersections > best.intersections) {
          best = { ...cand, intersections };
        }
      }
    }
  }
  return best;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type WorkingPlacement = { input: CrosswordInputWord; word: string; row: number; col: number; dir: CrosswordDirection };

export function generateCrossword(rawWords: CrosswordInputWord[], attempts = 60): CrosswordLayoutResult {
  const words = rawWords
    .map((w) => ({ ...w, word: normalize(w.word) }))
    .filter((w) => w.word.length >= 2);

  if (words.length === 0) {
    return { width: 0, height: 0, placements: [], unplaced: rawWords.map((w) => w.word) };
  }

  const byLength = [...words].sort((a, b) => b.word.length - a.word.length);

  let best: { placements: WorkingPlacement[]; unplaced: CrosswordInputWord[] } | null = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const order = attempt === 0 ? byLength : shuffle(byLength);
    const grid: Grid = new Map();
    const placements: WorkingPlacement[] = [];
    const unplaced: CrosswordInputWord[] = [];

    const first = order[0];
    placeOnGrid(grid, first.word, 0, 0, "across");
    placements.push({ input: first, word: first.word, row: 0, col: 0, dir: "across" });

    for (let k = 1; k < order.length; k++) {
      const w = order[k];
      const candidate = findBestPlacement(grid, w.word);
      if (candidate) {
        placeOnGrid(grid, w.word, candidate.row, candidate.col, candidate.dir);
        placements.push({ input: w, word: w.word, row: candidate.row, col: candidate.col, dir: candidate.dir });
      } else {
        unplaced.push(w);
      }
    }

    if (!best || unplaced.length < best.unplaced.length) {
      best = { placements, unplaced };
    }
    if (unplaced.length === 0) break;
  }

  if (!best) {
    return { width: 0, height: 0, placements: [], unplaced: rawWords.map((w) => w.word) };
  }

  // Normalize coordinates to start at (0,0)
  let minRow = Infinity;
  let minCol = Infinity;
  let maxRow = -Infinity;
  let maxCol = -Infinity;
  for (const p of best.placements) {
    const dr = p.dir === "down" ? 1 : 0;
    const dc = p.dir === "across" ? 1 : 0;
    const endRow = p.row + dr * (p.word.length - 1);
    const endCol = p.col + dc * (p.word.length - 1);
    minRow = Math.min(minRow, p.row, endRow);
    minCol = Math.min(minCol, p.col, endCol);
    maxRow = Math.max(maxRow, p.row, endRow);
    maxCol = Math.max(maxCol, p.col, endCol);
  }

  const shifted = best.placements.map((p) => ({ ...p, row: p.row - minRow, col: p.col - minCol }));
  const width = maxCol - minCol + 1;
  const height = maxRow - minRow + 1;

  // Standard crossword numbering: one number per starting cell, shared by
  // across/down placements that both begin there.
  const startNumbers = new Map<string, number>();
  const startKeys = Array.from(new Set(shifted.map((p) => key(p.row, p.col)))).sort((a, b) => {
    const [ar, ac] = a.split(",").map(Number);
    const [br, bc] = b.split(",").map(Number);
    return ar - br || ac - bc;
  });
  startKeys.forEach((k, i) => startNumbers.set(k, i + 1));

  const placements: CrosswordPlacement[] = shifted.map((p) => ({
    id: p.input.id,
    word: p.word,
    clue: p.input.clue,
    points: p.input.points,
    row: p.row,
    col: p.col,
    dir: p.dir,
    number: startNumbers.get(key(p.row, p.col))!,
  }));

  return {
    width,
    height,
    placements,
    unplaced: best.unplaced.map((w) => w.word),
  };
}
