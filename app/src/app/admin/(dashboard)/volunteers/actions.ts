"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/email";

export async function acceptVolunteer(id: string) {
  const crewId = `CREW-${randomUUID().slice(0, 8).toUpperCase()}`;
  const v = await prisma.volunteerApplication.update({
    where: { id },
    data: { status: "ACCEPTED", crewId },
  });
  await sendMail({
    to: v.email,
    subject: "You're on the D-GEM crew",
    html: `<p>Hi ${v.fullName},</p><p>You're accepted as a <strong>${v.role}</strong> volunteer for Conference 1.0. Your crew badge: <a href="/crew/${crewId}">view badge</a>.</p>`,
  });
  revalidatePath("/admin/volunteers");
}

export async function rejectVolunteer(id: string) {
  await prisma.volunteerApplication.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/volunteers");
}
