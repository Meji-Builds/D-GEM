// How many riddles/words each player is given per level, drawn at random
// from that level's admin-maintained pool. Keep pools well above these
// counts (see admin copy) so two players rarely see an identical round.
export const RIDDLES_PER_LEVEL: Record<number, number> = { 1: 4, 2: 5, 3: 6 };
export const CROSSWORD_WORDS_PER_LEVEL: Record<number, number> = { 1: 5, 2: 7, 3: 9 };
export const WORD_SEARCH_SIZE_PER_LEVEL: Record<number, number> = { 1: 10, 2: 12, 3: 14 };

// One clock for the whole networking session — it starts the moment a
// player's ticket is verified and covers riddles + word search together,
// across all levels of both. The actual length is admin-configurable
// (EventSettings.gameDurationMinutes); this is only the fallback default.
export const DEFAULT_GAME_DURATION_MINUTES = 5;

export function gameDeadline(gameStartedAt: string, durationMs: number): string {
  return new Date(new Date(gameStartedAt).getTime() + durationMs).toISOString();
}
