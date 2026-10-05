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
function evergreenRiddles(level: number): GeneratedRiddle[] {
  const pointsFor = level * 10;
  if (level === 1) {
    return THEME_WORDS.map((t) => ({
      question: `I'm the theme word that means "${t.clue.split(" — ")[1]}" — what am I?`,
      answer: t.word,
      points: pointsFor,
    })).concat([
      { question: "Don't Graduate ___ — fill in the one word this movement won't let you leave as.", answer: "Empty", points: pointsFor },
    ]);
  }
  if (level === 2) {
    return [
      { question: "I'm a movement, not a module — four words long, and 'Empty' is the one I refuse to let you be.", answer: "Don't Graduate Empty Movement", points: pointsFor },
      { question: "Say the theme in order and I'm the word sitting right between 'Grow' and 'Impact'.", answer: "Excel", points: pointsFor },
      { question: "Say the theme in order and I'm the word sitting right between 'Mentor' and 'Excel'.", answer: "Grow", points: pointsFor },
    ];
  }
  return [
    { question: "Four words, four letters each on average, one promise: find the full name this whole movement is built on.", answer: "Don't Graduate Empty Movement", points: pointsFor },
    { question: "I'm not a grade, a GPA, or a certificate — I'm the one thing D-GEM measures success by. Three syllables, starts with 'I'.", answer: "Impact", points: pointsFor },
  ];
}

function evergreenCrosswordWords(level: number): GeneratedWord[] {
  const spinePoints = 10 + level * 10;
  const words: GeneratedWord[] = [
    { word: "DONTGRADUATEEMPTY", clue: "D-GEM's full movement name, no spaces", points: spinePoints },
  ];
  for (const t of THEME_WORDS) {
    words.push({ word: cleanWord(t.word), clue: t.clue, points: 10 });
  }
  return words;
}

// Live-platform content: regenerated from whatever is currently published —
// speakers, sponsors, convener, venue, agenda — so it never goes stale.
async function livePlatformRiddles(level: number): Promise<GeneratedRiddle[]> {
  const { convener, speakers, sponsors, agenda, settings } = await getPlatformData();
  const pointsFor = level * 10;
  const out: GeneratedRiddle[] = [];

  if (level === 1) {
    for (const s of speakers) {
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
    for (const s of speakers) {
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
    for (const s of speakers) {
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

  for (const s of speakers) {
    const clue =
      level === 1
        ? `${s.role || "Speaker"}${s.organisation ? ` at ${s.organisation}` : ""}`
        : level === 2
          ? `Speaking in "${s.session || "today's lineup"}"`
          : `Role: ${s.role || "unannounced"} (org kept secret)`;
    addWord(firstName(s.name), clue);
  }
  for (const sp of sponsors) {
    const clue = level === 1 ? `A ${sp.tier.toLowerCase()} sponsor of Conference 1.0` : "A sponsor of Conference 1.0 (tier kept secret)";
    addWord(sp.name.split(/\s+/)[0], clue);
  }
  if (convener.name && convener.name !== "Convener Name") {
    addWord(firstName(convener.name), level === 1 ? `First name of our convener, ${convener.title || "the host"}` : "First name of our convener");
  }
  if (settings.venue) {
    const venueWord = settings.venue.trim().split(/\s+/).length > 1 ? acronym(settings.venue) : settings.venue;
    addWord(venueWord, "Where Conference 1.0 is held (short form)");
  }
  for (const a of agenda) {
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
