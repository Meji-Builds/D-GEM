import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.eventSettings.upsert({
    where: { id: "event" },
    update: {},
    create: {
      id: "event",
      name: "Don't Graduate Empty Movement Conference 1.0",
      tagline: "Mentor · Grow · Excel · Impact",
      eventDate: new Date("2026-11-14T09:00:00"),
      startTime: "09:00",
      endTime: "17:00",
      venue: "Olabisi Onabanjo University",
      capacity: 500,
      registrationState: "OPEN",
      aboutText:
        "D-GEM (Don't Graduate Empty Movement) exists to close the gap between graduation and readiness. We equip university students with mentorship, skills and a network before they leave campus, so no one walks out with a certificate and nothing else.",
      missionText:
        "To mentor and equip university students with the practical skills, network and mindset they need to leave campus prepared, not empty-handed.",
      visionText:
        "A generation of graduates who leave university already building, already connected, and already growing. Never empty.",
      contactEmail: "info@dgem.org",
      contactPhone: "+234 800 000 0000",
      instagramUrl: "https://instagram.com/dgemmovement",
      twitterUrl: "https://x.com/dgemmovement",
    },
  });

  await prisma.convener.upsert({
    where: { id: "convener" },
    update: {},
    create: {
      id: "convener",
      name: "Convener Name",
      title: "Founder & Convener, D-GEM",
      note:
        "Welcome to Conference 1.0. This movement started with one question: how do we make sure students don't graduate empty? This day is our answer, and I can't wait to have you here.",
    },
  });

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@dgem.org" },
    update: {},
    create: {
      email: "donotgraduateempty1@gmail.com",
      name: "D-GEM Admin",
      role: "ADMIN",
      passwordHash: await bcrypt.hash("DGEM-Admin-2026!", 10),
    },
  });

  await prisma.adminUser.upsert({
    where: { email: "steward@dgem.org" },
    update: {},
    create: {
      email: "steward@dgem.org",
      name: "Gate Steward",
      role: "STEWARD",
      passwordHash: await bcrypt.hash("DGEM-Steward-2026!", 10),
    },
  });
  void admin;

  const speakerData = [
    { name: "Adaeze Okonkwo", role: "Product Lead", organisation: "Flutterwave", session: "Session 1 · Keynote" },
    { name: "Tunde Bakare", role: "Founder", organisation: "Riverside Studio", session: "Session 2" },
    { name: "Chiamaka Eze", role: "Career Coach", organisation: "The Launch Room", session: "Panel" },
    { name: "Yusuf Ibrahim", role: "Software Engineer", organisation: "Paystack", session: "Session 2" },
    { name: "Ngozi Umeh", role: "Founder", organisation: "GreenPath Africa", session: "Panel" },
    { name: "David Afolabi", role: "Investor", organisation: "Aduna Capital", session: "Session 1" },
  ];
  for (let i = 0; i < speakerData.length; i++) {
    const s = speakerData[i];
    await prisma.speaker.upsert({
      where: { id: `seed-speaker-${i}` },
      update: {},
      create: {
        id: `seed-speaker-${i}`,
        ...s,
        bio: "A short, motivating biography goes here: background, achievements and what this speaker will cover on the day.",
        state: "LIVE",
        order: i,
      },
    });
  }

  const sponsorData = [
    { name: "Nova Bank", tier: "GOLD" as const, order: 0 },
    { name: "Flux Telecom", tier: "GOLD" as const, order: 1 },
    { name: "Riverside Studio", tier: "SILVER" as const, order: 2 },
    { name: "Paystack", tier: "SILVER" as const, order: 3 },
    { name: "GreenPath Africa", tier: "SILVER" as const, order: 4 },
    { name: "Campus Press", tier: "BRONZE" as const, order: 5 },
    { name: "OOU Alumni Assoc.", tier: "BRONZE" as const, order: 6 },
  ];
  for (let i = 0; i < sponsorData.length; i++) {
    const s = sponsorData[i];
    await prisma.sponsor.upsert({
      where: { id: `seed-sponsor-${i}` },
      update: {},
      create: { id: `seed-sponsor-${i}`, ...s },
    });
  }

  const agendaData = [
    { time: "09:00", durationMin: 30, title: "Arrival & check-in", order: 0 },
    { time: "09:30", durationMin: 20, title: "Convener's welcome", order: 1 },
    { time: "10:00", durationMin: 45, title: "Keynote: Building before you're ready", order: 2, speakerIdx: 0 },
    { time: "11:00", durationMin: 60, title: "Panel: Life after the last exam", order: 3, speakerIdx: [1, 2, 4] },
    { time: "12:00", durationMin: 45, title: "Break & networking", order: 4 },
    { time: "13:00", durationMin: 45, title: "Workshop: Getting your first offer", order: 5, speakerIdx: 3 },
    { time: "14:00", durationMin: 45, title: "Fireside: Raising your first cheque", order: 6, speakerIdx: 5 },
    { time: "15:00", durationMin: 60, title: "Closing charge & group photo", order: 7 },
  ];
  for (let i = 0; i < agendaData.length; i++) {
    const { speakerIdx, ...a } = agendaData[i] as (typeof agendaData)[number] & {
      speakerIdx?: number | number[];
    };
    const item = await prisma.agendaItem.upsert({
      where: { id: `seed-agenda-${i}` },
      update: {},
      create: { id: `seed-agenda-${i}`, ...a },
    });
    const idxs = speakerIdx === undefined ? [] : Array.isArray(speakerIdx) ? speakerIdx : [speakerIdx];
    for (const idx of idxs) {
      await prisma.agendaSpeaker.upsert({
        where: {
          agendaItemId_speakerId: {
            agendaItemId: item.id,
            speakerId: `seed-speaker-${idx}`,
          },
        },
        update: {},
        create: { agendaItemId: item.id, speakerId: `seed-speaker-${idx}` },
      });
    }
  }

  const faqData = [
    { q: "Is registration free?", a: "Yes, Conference 1.0 is completely free to attend. You only need to register to reserve a seat.", order: 0 },
    { q: "What do I bring to the gate?", a: "Just the QR code from your confirmation email or ticket dashboard, shown on your phone or printed.", order: 1 },
    { q: "I lost my QR code.", a: "Visit the attendee dashboard and re-download your ticket, or ask a steward at the registration desk on the day.", order: 2 },
    { q: "Can non-students attend?", a: "Conference 1.0 is built for university students and recent graduates, but recent graduates and mentors are welcome too.", order: 3 },
  ];
  for (let i = 0; i < faqData.length; i++) {
    const f = faqData[i];
    await prisma.faqItem.upsert({
      where: { id: `seed-faq-${i}` },
      update: {},
      create: { id: `seed-faq-${i}`, question: f.q, answer: f.a, order: f.order },
    });
  }

  console.log("Seed complete.");
  console.log("Admin login:   admin@dgem.org / DGEM-Admin-2026!");
  console.log("Steward login: steward@dgem.org / DGEM-Steward-2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
