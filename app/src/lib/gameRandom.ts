// Deterministic per-player randomization: the same ticketId + level always
// produces the same subset and order, so a player's puzzle is stable across
// reloads, but different players get different subsets and orders — so
// "the answer to riddle 3" doesn't transfer from one player to the next.

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seedKey: string): () => number {
  return mulberry32(hashSeed(seedKey));
}

export function seededShuffle<T>(arr: T[], seedKey: string): T[] {
  const rand = createSeededRandom(seedKey);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickPlayerSet<T>(pool: T[], seedKey: string, count: number): T[] {
  return seededShuffle(pool, seedKey).slice(0, Math.min(count, pool.length));
}
