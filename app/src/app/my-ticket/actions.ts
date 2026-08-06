"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type LookupState = { error?: string };

export async function lookupTicket(
  _prev: LookupState,
  formData: FormData
): Promise<LookupState> {
  const query = String(formData.get("query") || "").trim();
  if (!query) return { error: "Enter your ticket ID or the email you registered with." };

  const attendee = query.includes("@")
    ? await prisma.attendee.findFirst({ where: { email: query }, orderBy: { registeredAt: "desc" } })
    : await prisma.attendee.findUnique({ where: { ticketId: query.toUpperCase() } });

  if (!attendee) return { error: "We couldn't find a ticket matching that." };
  redirect(`/ticket/${attendee.ticketId}`);
}
