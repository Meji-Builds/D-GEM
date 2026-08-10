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
