"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type AgendaFormState = { error?: string; ok?: boolean };

export async function saveAgendaItem(
  _prev: AgendaFormState,
  formData: FormData
): Promise<AgendaFormState> {
  const id = String(formData.get("id") || "").trim();
  const time = String(formData.get("time") || "").trim();
  const durationMin = Number(formData.get("durationMin") || 30);
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const order = Number(formData.get("order") || 0);
  const speakerIds = formData.getAll("speakerIds").map(String);

  if (!time || !title) return { error: "Time and title are required." };

  if (id) {
    await prisma.agendaItem.update({
      where: { id },
      data: { time, durationMin, title, description, order },
    });
    await prisma.agendaSpeaker.deleteMany({ where: { agendaItemId: id } });
    if (speakerIds.length) {
      await prisma.agendaSpeaker.createMany({
        data: speakerIds.map((speakerId) => ({ agendaItemId: id, speakerId })),
      });
    }
  } else {
    const count = await prisma.agendaItem.count();
    const created = await prisma.agendaItem.create({
      data: { time, durationMin, title, description, order: order || count },
    });
    if (speakerIds.length) {
      await prisma.agendaSpeaker.createMany({
        data: speakerIds.map((speakerId) => ({ agendaItemId: created.id, speakerId })),
      });
    }
  }

  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
  return { ok: true };
}

export async function deleteAgendaItem(id: string) {
  await prisma.agendaItem.delete({ where: { id } });
  revalidatePath("/admin/agenda");
  revalidatePath("/agenda");
}
