import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function csvCell(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const attendees = await prisma.attendee.findMany({ orderBy: { registeredAt: "asc" } });
  const header = ["Ticket ID", "Name", "Email", "Phone", "School", "Level", "Department", "Checked in", "Checked in at", "Registered at"];
  const rows = attendees.map((a) =>
    [
      a.ticketId,
      a.fullName,
      a.email,
      a.phone,
      a.school,
      a.level,
      a.department,
      a.checkedIn ? "yes" : "no",
      a.checkedInAt ? a.checkedInAt.toISOString() : "",
      a.registeredAt.toISOString(),
    ]
      .map(csvCell)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dgem-attendees.csv"`,
    },
  });
}
