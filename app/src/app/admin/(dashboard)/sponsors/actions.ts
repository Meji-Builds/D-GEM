"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import type { SponsorTier, RegistrationState } from "@prisma/client";

export type FormState = { error?: string; ok?: boolean };

export async function updateEventSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const dateConfirmed = formData.get("dateConfirmed") === "true";
  const dateStr = String(formData.get("eventDate") || "").trim();
  const startTime = String(formData.get("startTime") || "09:00").trim();
  const endTime = String(formData.get("endTime") || "17:00").trim();
  const venue = String(formData.get("venue") || "").trim();
  const capacity = Number(formData.get("capacity") || 500);
  const registrationState = String(formData.get("registrationState") || "OPEN") as RegistrationState;
  const heroText = String(formData.get("heroText") || "").trim();
  const aboutText = String(formData.get("aboutText") || "").trim();
  const missionText = String(formData.get("missionText") || "").trim();
  const visionText = String(formData.get("visionText") || "").trim();
  const sponsorshipPitch = String(formData.get("sponsorshipPitch") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const instagramUrl = String(formData.get("instagramUrl") || "").trim();
  const twitterUrl = String(formData.get("twitterUrl") || "").trim();
  const tiktokUrl = String(formData.get("tiktokUrl") || "").trim();
  const communityUrl = String(formData.get("communityUrl") || "").trim();
  const mapUrl = String(formData.get("mapUrl") || "").trim();
  const mapEmbedUrl = String(formData.get("mapEmbedUrl") || "").trim();
  const movementPhoto = formData.get("movementPhoto") as File | null;
  const movementPhotoUrl = await saveUploadedFile(movementPhoto, "movement");

  if (!name || !venue) return { error: "Event name and venue are required." };
  if (dateConfirmed && !dateStr) return { error: "Pick a date, or mark it as not yet announced." };

  await prisma.eventSettings.upsert({
    where: { id: "event" },
    update: {
      name,
      tagline,
      eventDate: dateConfirmed && dateStr ? new Date(dateStr) : null,
      startTime,
      endTime,
      venue,
      capacity,
      registrationState,
      heroText,
      aboutText,
      missionText,
      visionText,
      sponsorshipPitch,
      contactEmail,
      contactPhone,
      instagramUrl,
      twitterUrl,
      tiktokUrl,
      communityUrl,
      mapUrl,
      mapEmbedUrl,
      ...(movementPhotoUrl ? { movementPhotoUrl } : {}),
    },
    create: { id: "event", name, tagline, venue, movementPhotoUrl: movementPhotoUrl ?? undefined },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateConvener(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const note = String(formData.get("note") || "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") || "").replace(/[^\d]/g, "");
  const whatsappMessage = String(formData.get("whatsappMessage") || "").trim();
  const whatsappLabel = String(formData.get("whatsappLabel") || "").trim();
  const photo = formData.get("photo") as File | null;
  const photoUrl = await saveUploadedFile(photo, "convener");

  await prisma.convener.upsert({
    where: { id: "convener" },
    update: { name, title, note, whatsappNumber, whatsappMessage, whatsappLabel, ...(photoUrl ? { photoUrl } : {}) },
    create: { id: "convener", name, title, note, whatsappNumber, whatsappMessage, whatsappLabel, photoUrl: photoUrl ?? undefined },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateTierPerks(_prev: FormState, formData: FormData): Promise<FormState> {
  const goldPerks = String(formData.get("goldPerks") || "").trim();
  const silverPerks = String(formData.get("silverPerks") || "").trim();
  const bronzePerks = String(formData.get("bronzePerks") || "").trim();

  await prisma.eventSettings.upsert({
    where: { id: "event" },
    update: { goldPerks, silverPerks, bronzePerks },
    create: { id: "event", goldPerks, silverPerks, bronzePerks },
  });

  revalidatePath("/admin/sponsors");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveSponsor(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const tier = String(formData.get("tier") || "BRONZE") as SponsorTier;
  const url = String(formData.get("url") || "").trim();
  const logo = formData.get("logo") as File | null;
  if (!name) return { error: "Sponsor name is required." };
  const logoUrl = await saveUploadedFile(logo, "sponsor");

  if (id) {
    await prisma.sponsor.update({ where: { id }, data: { name, tier, url, ...(logoUrl ? { logoUrl } : {}) } });
  } else {
    const count = await prisma.sponsor.count();
    await prisma.sponsor.create({ data: { name, tier, url, order: count, logoUrl: logoUrl ?? undefined } });
  }

  revalidatePath("/admin/sponsors");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteSponsor(id: string) {
  await prisma.sponsor.delete({ where: { id } });
  revalidatePath("/admin/sponsors");
  revalidatePath("/", "layout");
}
