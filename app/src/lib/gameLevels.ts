// How many riddles/words each player is given per level, drawn at random
// from that level's admin-maintained pool. Keep pools well above these
// counts (see admin copy) so two players rarely see an identical round.
export const RIDDLES_PER_LEVEL: Record<number, number> = { 1: 4, 2: 5, 3: 6 };
export const CROSSWORD_WORDS_PER_LEVEL: Record<number, number> = { 1: 5, 2: 7, 3: 9 };
export const WORD_SEARCH_SIZE_PER_LEVEL: Record<number, number> = { 1: 10, 2: 12, 3: 14 };
