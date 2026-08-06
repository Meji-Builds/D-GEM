import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ state: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const rawQuery = String(body.query || body.ticketId || "").trim();
  const gate = String(body.gate || "Gate A").trim();
  const override = Boolean(body.override);

  if (!rawQuery) {
    return NextResponse.json({ state: "invalid", message: "Empty code." });
  }

  const ticketId = rawQuery.toUpperCase();
  const attendee =
    (await prisma.attendee.findUnique({ where: { ticketId } })) ??
    (await prisma.attendee.findFirst({
      where: { OR: [{ email: rawQuery }, { phone: rawQuery }, { fullName: { contains: rawQuery, mode: "insensitive" } }] },
    }));

  if (!attendee) {
    return NextResponse.json({ state: "invalid" });
  }

  if (attendee.checkedIn && !override) {
    const firstScan = await prisma.checkIn.findFirst({
      where: { attendeeId: attendee.id },
      orderBy: { createdAt: "asc" },
      include: { scannedBy: true },
    });
    return NextResponse.json({
      state: "already",
      attendee: {
        id: attendee.id,
        fullName: attendee.fullName,
        ticketId: attendee.ticketId,
      },
      firstScannedAt: attendee.checkedInAt,
      firstGate: attendee.checkedInGate,
      firstSteward: firstScan?.scannedBy?.name ?? null,
    });
  }

  await prisma.attendee.update({
    where: { id: attendee.id },
    data: { checkedIn: true, checkedInAt: new Date(), checkedInGate: gate },
  });
  await prisma.checkIn.create({
    data: { attendeeId: attendee.id, gate, overridden: override, scannedById: session.sub },
  });

  return NextResponse.json({
    state: "granted",
    attendee: {
      id: attendee.id,
      fullName: attendee.fullName,
      ticketId: attendee.ticketId,
      school: attendee.school,
      level: attendee.level,
      department: attendee.department,
    },
    gate,
    time: new Date().toISOString(),
  });
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ results: [] });

  const results = await prisma.attendee.findMany({
    where: {
      OR: [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { ticketId: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 8,
  });
  return NextResponse.json({
    results: results.map((a) => ({ id: a.id, fullName: a.fullName, ticketId: a.ticketId, checkedIn: a.checkedIn })),
  });
}
