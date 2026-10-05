import { prisma } from "./prisma";

export type GeneratedRiddle = { question: string; answer: string; points: number };
export type GeneratedWord = { word: string; clue: string; points: number };

function cleanWord(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, "");
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function acronym(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

// Spreads a list across the 3 levels round-robin so the same speaker/sponsor/
// agenda item never shows up as the answer to more than one level — without
// this, every level looped over the *same* full list and only the clue
// wording changed, so all three levels ended up testing the same answers.
function splitByLevel<T>(items: T[], level: number): T[] {
  return items.filter((_, i) => i % 3 === level - 1);
}

async function getPlatformData() {
  const [settings, convener, speakers, sponsors, agenda] = await Promise.all([
    prisma.eventSettings.upsert({ where: { id: "event" }, update: {}, create: { id: "event" } }),
    prisma.convener.upsert({ where: { id: "convener" }, update: {}, create: { id: "convener" } }),
    prisma.speaker.findMany({ where: { state: "LIVE" }, orderBy: { order: "asc" } }),
    prisma.sponsor.findMany({ orderBy: { order: "asc" } }),
    prisma.agendaItem.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { settings, convener, speakers, sponsors, agenda };
}

const THEME_WORDS = [
  { word: "Mentor", clue: "The first word of D-GEM's theme — the one who shows you the way" },
  { word: "Grow", clue: "The second word of the theme — what a seed does with sunlight and time" },
  { word: "Excel", clue: "The third word of the theme — don't just pass, do this instead" },
  { word: "Impact", clue: "The fourth and final word of the theme — the mark you leave behind" },
];

// Evergreen content: built from the movement's fixed brand identity, so it
// reads the same every generate regardless of what's live on the platform.
// Each theme word/phrase belongs to exactly one level — levels never share
// an answer, so solving level 1 doesn't hand you level 2's or 3's answers.
function evergreenRiddles(level: number): GeneratedRiddle[] {
  const pointsFor = level * 10;
  const theme = (word: string) => THEME_WORDS.find((t) => t.word === word)!;
  if (level === 1) {
    return [
      { question: `I'm the theme word that means "${theme("Mentor").clue.split(" — ")[1]}" — what am I?`, answer: "Mentor", points: pointsFor },
      { question: `I'm the theme word that means "${theme("Grow").clue.split(" — ")[1]}" — what am I?`, answer: "Grow", points: pointsFor },
    ];
  }
  if (level === 2) {
    return [
      { question: `I'm the theme word that means "${theme("Excel").clue.split(" — ")[1]}" — what am I?`, answer: "Excel", points: pointsFor },
      { question: "Don't Graduate ___ — fill in the one word this movement won't let you leave as.", answer: "Empty", points: pointsFor },
    ];
  }
  return [
    { question: "I'm not a grade, a GPA, or a certificate — I'm the one thing D-GEM measures success by. Three syllables, starts with 'I'.", answer: "Impact", points: pointsFor },
    { question: "Four words, four letters each on average, one promise: find the full name this whole movement is built on.", answer: "Don't Graduate Empty Movement", points: pointsFor },
  ];
}

function evergreenCrosswordWords(level: number): GeneratedWord[] {
  const points = 10 + level * 10;
  const theme = (word: string) => THEME_WORDS.find((t) => t.word === word)!;
  if (level === 1) {
    return [
      { word: "MENTOR", clue: theme("Mentor").clue, points },
      { word: "GROW", clue: theme("Grow").clue, points },
    ];
  }
  if (level === 2) {
    return [
      { word: "EXCEL", clue: theme("Excel").clue, points },
      { word: "EMPTY", clue: "Don't Graduate ___ — the one word this movement won't let you leave as", points },
    ];
  }
  return [
    { word: "IMPACT", clue: theme("Impact").clue, points },
    { word: "DONTGRADUATEEMPTY", clue: "D-GEM's full movement name, no spaces", points },
  ];
}

// Live-platform content: regenerated from whatever is currently published —
// speakers, sponsors, convener, venue, agenda — so it never goes stale.
async function livePlatformRiddles(level: number): Promise<GeneratedRiddle[]> {
  const { convener, speakers, sponsors, agenda, settings } = await getPlatformData();
  const pointsFor = level * 10;
  const out: GeneratedRiddle[] = [];
  const levelSpeakers = splitByLevel(speakers, level);

  if (level === 1) {
    for (const s of levelSpeakers) {
      if (!s.role || !s.organisation) continue;
      out.push({
        question: `I'm the ${s.role} at ${s.organisation}, speaking at Conference 1.0 — what's my first name?`,
        answer: firstName(s.name),
        points: pointsFor,
      });
    }
    if (convener.name && convener.name !== "Convener Name") {
      out.push({
        question: `I open Conference 1.0 with the welcome note, as ${convener.title || "the convener"} — what's my first name?`,
        answer: firstName(convener.name),
        points: pointsFor,
      });
    }
  }

  if (level === 2) {
    for (const s of levelSpeakers) {
      if (!s.session) continue;
      out.push({
        question: `I'm speaking in "${s.session}" today — my organisation is ${s.organisation || "a secret for now"}. First name?`,
        answer: firstName(s.name),
        points: pointsFor,
      });
    }
    for (const sp of sponsors.filter((x) => x.tier === "GOLD")) {
      out.push({
        question: `I'm one of the gold sponsors making Conference 1.0 possible — company name, one word.`,
        answer: sp.name,
        points: pointsFor,
      });
    }
    if (settings.venue) {
      out.push({
        question: `Arrive by ${settings.startTime} or miss the start — what's the full name of the venue?`,
        answer: settings.venue,
        points: pointsFor,
      });
    }
  }

  if (level === 3) {
    for (const s of levelSpeakers) {
      out.push({
        question: `My role is "${s.role || "unannounced"}" and I speak today — but you only get my role, not my company. First name?`,
        answer: firstName(s.name),
        points: pointsFor,
      });
    }
    for (let i = 0; i < agenda.length - 1; i++) {
      const [before, after] = [agenda[i], agenda[i + 1]];
      if (!before.title || !after.title) continue;
      out.push({
        question: `What's the name of the agenda item that comes right after "${before.title}"?`,
        answer: after.title,
        points: pointsFor,
      });
    }
  }

  return out;
}

async function livePlatformCrosswordWords(level: number): Promise<GeneratedWord[]> {
  const { convener, speakers, sponsors, agenda, settings } = await getPlatformData();
  const out: GeneratedWord[] = [];
  const usedWords = new Set<string>();
  const points = level * 10;

  function addWord(raw: string, clue: string) {
    const w = cleanWord(raw);
    if (w.length < 2 || usedWords.has(w)) return;
    usedWords.add(w);
    out.push({ word: w, clue, points });
  }

  for (const s of splitByLevel(speakers, level)) {
    const clue =
      level === 1
        ? `${s.role || "Speaker"}${s.organisation ? ` at ${s.organisation}` : ""}`
        : level === 2
          ? `Speaking in "${s.session || "today's lineup"}"`
          : `Role: ${s.role || "unannounced"} (org kept secret)`;
    addWord(firstName(s.name), clue);
  }
  for (const sp of splitByLevel(sponsors, level)) {
    const clue = level === 1 ? `A ${sp.tier.toLowerCase()} sponsor of Conference 1.0` : "A sponsor of Conference 1.0 (tier kept secret)";
    addWord(sp.name.split(/\s+/)[0], clue);
  }
  // Convener and venue are singletons, so (unlike speakers/sponsors/agenda
  // above) they're pinned to one level each rather than split — splitting
  // a single item would just drop it from the other two levels for nothing.
  if (level === 1 && convener.name && convener.name !== "Convener Name") {
    addWord(firstName(convener.name), `First name of our convener, ${convener.title || "the host"}`);
  }
  if (level === 2 && settings.venue) {
    const venueWord = settings.venue.trim().split(/\s+/).length > 1 ? acronym(settings.venue) : settings.venue;
    addWord(venueWord, "Where Conference 1.0 is held (short form)");
  }
  for (const a of splitByLevel(agenda, level)) {
    const [beforeColon, afterColon] = a.title.split(":");
    // A title with a colon ("Keynote: Building before you're ready") has a
    // clean single-word label before it. One without ("Convener's welcome")
    // doesn't — the last word avoids possessive apostrophes ("Convener's").
    const candidate = afterColon ? beforeColon.trim().split(/\s+/)[0] : a.title.trim().split(/\s+/).pop();
    if (!candidate) continue;
    const clue = level === 1 ? `Agenda item: "${a.title}"` : `An agenda item at ${a.time}`;
    addWord(candidate, clue);
  }

  return out;
}

export async function generateRiddlePool(level: number): Promise<GeneratedRiddle[]> {
  const [live] = await Promise.all([livePlatformRiddles(level)]);
  return [...evergreenRiddles(level), ...live];
}

export async function generateWordPool(level: number): Promise<GeneratedWord[]> {
  const [live] = await Promise.all([livePlatformCrosswordWords(level)]);
  return [...evergreenCrosswordWords(level), ...live];
}
