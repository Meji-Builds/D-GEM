"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

export type SpeakerFormState = { error?: string; ok?: boolean };

export async function saveSpeaker(
  _prev: SpeakerFormState,
  formData: FormData
): Promise<SpeakerFormState> {
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const organisation = String(formData.get("organisation") || "").trim();
  const session = String(formData.get("session") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") || "").trim();
  const socialUrl = String(formData.get("socialUrl") || "").trim();
  const publish = formData.get("intent") === "publish";
  const photo = formData.get("photo") as File | null;

  if (!name) return { error: "Name is required." };

  const photoUrl = await saveUploadedFile(photo, "speaker");

  if (id) {
    await prisma.speaker.update({
      where: { id },
      data: {
        name,
        role,
        organisation,
        session,
        bio,
        linkedinUrl,
        socialUrl,
        state: publish ? "LIVE" : "DRAFT",
        ...(photoUrl ? { photoUrl } : {}),
      },
    });
  } else {
    const count = await prisma.speaker.count();
    await prisma.speaker.create({
      data: {
        name,
        role,
        organisation,
        session,
        bio,
        linkedinUrl,
        socialUrl,
        state: publish ? "LIVE" : "DRAFT",
        order: count,
        ...(photoUrl ? { photoUrl } : {}),
      },
    });
  }

  revalidatePath("/admin/speakers");
  revalidatePath("/speakers");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSpeaker(id: string) {
  await prisma.speaker.delete({ where: { id } });
  revalidatePath("/admin/speakers");
  revalidatePath("/speakers");
  revalidatePath("/");
}
