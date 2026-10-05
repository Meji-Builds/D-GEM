import { prisma } from "./prisma";

export async function getEventSettings() {
  return prisma.eventSettings.upsert({
    where: { id: "event" },
    update: {},
    create: { id: "event" },
  });
}

export function formatEventDateLabel(eventDate: Date | null) {
  if (!eventDate) return "Date to be announced";
  return eventDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getLiveSpeakers() {
  return prisma.speaker.findMany({
    where: { state: "LIVE" },
    orderBy: { order: "asc" },
  });
}

export async function getConvener() {
  return prisma.convener.upsert({
    where: { id: "convener" },
    update: {},
    create: { id: "convener" },
  });
}

export async function getSponsorsByTier() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { order: "asc" } });
  return {
    gold: sponsors.filter((s) => s.tier === "GOLD"),
    silver: sponsors.filter((s) => s.tier === "SILVER"),
    bronze: sponsors.filter((s) => s.tier === "BRONZE"),
  };
}

export async function getAgenda() {
  return prisma.agendaItem.findMany({
    orderBy: { order: "asc" },
    include: { speakers: { include: { speaker: true } } },
  });
}

export async function getFaqs() {
  return prisma.faqItem.findMany({ orderBy: { order: "asc" } });
}

export async function getApprovedTestimonials(limit?: number) {
  return prisma.feedbackResponse.findMany({
    where: { status: "APPROVED", testimonial: { not: "" } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type LeaderboardEntry = {
  ticketId: string;
  fullName: string;
  school: string;
  total: number;
  riddlesScore: number;
  crosswordScore: number;
};

export async function getLeaderboard(limit?: number): Promise<LeaderboardEntry[]> {
  const scores = await prisma.gameLevelScore.groupBy({
    by: ["ticketId", "game"],
    _sum: { score: true },
  });
  if (scores.length === 0) return [];

  const ticketIds = Array.from(new Set(scores.map((s) => s.ticketId)));
  const attendees = await prisma.attendee.findMany({
    where: { ticketId: { in: ticketIds } },
    select: { ticketId: true, fullName: true, school: true },
  });
  const attendeeByTicket = new Map(attendees.map((a) => [a.ticketId, a]));

  const byTicket = new Map<string, { riddles: number; crossword: number }>();
  for (const s of scores) {
    const entry = byTicket.get(s.ticketId) ?? { riddles: 0, crossword: 0 };
    if (s.game === "RIDDLES") entry.riddles = s._sum.score ?? 0;
    if (s.game === "CROSSWORD") entry.crossword = s._sum.score ?? 0;
    byTicket.set(s.ticketId, entry);
  }

  const leaderboard: LeaderboardEntry[] = Array.from(byTicket.entries())
    .map(([ticketId, { riddles, crossword }]) => {
      const attendee = attendeeByTicket.get(ticketId);
      return {
        ticketId,
        fullName: attendee?.fullName ?? "Unknown",
        school: attendee?.school ?? "",
        total: riddles + crossword,
        riddlesScore: riddles,
        crosswordScore: crossword,
      };
    })
    // Tie-broken by ticketId so the order is stable across polls — Prisma's
    // groupBy doesn't guarantee row order, and without a tiebreaker a tie at
    // the top would shuffle on every refresh and falsely look like a lead change.
    .sort((a, b) => b.total - a.total || a.ticketId.localeCompare(b.ticketId));

  return limit ? leaderboard.slice(0, limit) : leaderboard;
}

