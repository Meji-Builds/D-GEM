export type WordSearchDirection = "E" | "W" | "N" | "S" | "NE" | "NW" | "SE" | "SW";

const DIRECTION_VECTORS: Record<WordSearchDirection, [number, number]> = {
  E: [0, 1],
  W: [0, -1],
  N: [-1, 0],
  S: [1, 0],
  NE: [-1, 1],
  NW: [-1, -1],
  SE: [1, 1],
  SW: [1, -1],
};

export type WordSearchInputWord = {
  id: string;
  word: string;
  clue: string;
  points: number;
};

export type WordSearchPlacement = {
  id: string;
  word: string; // normalized A-Z only, uppercase
  clue: string;
  points: number;
  row: number;
  col: number;
  dir: WordSearchDirection;
};

export type WordSearchResult = {
  size: number;
  grid: string[][];
  placements: WordSearchPlacement[];
  unplaced: string[];
};

function normalize(word: string): string {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIRECTIONS = Object.keys(DIRECTION_VECTORS) as WordSearchDirection[];

function canPlace(grid: (string | null)[][], word: string, row: number, col: number, dir: WordSearchDirection, size: number): boolean {
  const [dr, dc] = DIRECTION_VECTORS[dir];
  const endRow = row + dr * (word.length - 1);
  const endCol = col + dc * (word.length - 1);
  if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) return false;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = grid[r][c];
    if (existing !== null && existing !== word[i]) return false;
  }
  return true;
}

function place(grid: (string | null)[][], word: string, row: number, col: number, dir: WordSearchDirection) {
  const [dr, dc] = DIRECTION_VECTORS[dir];
  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i][col + dc * i] = word[i];
  }
}

export function generateWordSearch(
  rawWords: WordSearchInputWord[],
  size: number,
  rand: () => number = Math.random
): WordSearchResult {
  const words = rawWords
    .map((w) => ({ ...w, word: normalize(w.word) }))
    .filter((w) => w.word.length >= 2 && w.word.length <= size)
    .sort((a, b) => b.word.length - a.word.length);

  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const placements: WordSearchPlacement[] = [];
  const unplaced: string[] = [];

  for (const w of words) {
    let placed = false;
    const attemptsPerWord = 150;
    for (let attempt = 0; attempt < attemptsPerWord && !placed; attempt++) {
      const dir = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)];
      const row = Math.floor(rand() * size);
      const col = Math.floor(rand() * size);
      if (canPlace(grid, w.word, row, col, dir, size)) {
        place(grid, w.word, row, col, dir);
        placements.push({ id: w.id, word: w.word, clue: w.clue, points: w.points, row, col, dir });
        placed = true;
      }
    }
    if (!placed) unplaced.push(w.word);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = ALPHABET[Math.floor(rand() * ALPHABET.length)];
      }
    }
  }

  return {
    size,
    grid: grid as string[][],
    placements,
    unplaced: [...unplaced, ...rawWords.filter((w) => normalize(w.word).length > size).map((w) => w.word)],
  };
}

// Mirrors the crossword builder's fairness fix: a straight random draw of
// exactly `target` words sometimes leaves one or two unplaced (the grid
// just doesn't have room given where earlier words landed), which would
// quietly give that player a smaller word bank — and a lower max score —
// than someone else purely from bad luck. Try several full-size deterministic
// draws (same seedKey always tries them in the same order, so a given player
// still always lands on the same puzzle) and keep the first one that places
// every word.
export function buildPlayerWordSearch(
  pool: WordSearchInputWord[],
  seedKey: string,
  target: number,
  size: number,
  pickSet: (pool: WordSearchInputWord[], seedKey: string, count: number) => WordSearchInputWord[],
  createRandom: (seedKey: string) => () => number,
  maxDraws = 8
): WordSearchResult {
  const count = Math.min(pool.length, target);
  let best: WordSearchResult | null = null;

  for (let attempt = 0; attempt < maxDraws; attempt++) {
    const candidates = pickSet(pool, `${seedKey}:draw${attempt}`, count);
    const result = generateWordSearch(candidates, size, createRandom(`${seedKey}:draw${attempt}:grid`));
    if (result.unplaced.length === 0) return result;
    if (!best || result.unplaced.length < best.unplaced.length) best = result;
  }

  return best!;
}
