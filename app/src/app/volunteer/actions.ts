"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type VolunteerState = { error?: string };

export async function applyVolunteer(
  _prev: VolunteerState,
  formData: FormData
): Promise<VolunteerState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const school = String(formData.get("school") || "").trim();
  const level = String(formData.get("level") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const availability = String(formData.get("availability") || "Event day");

  if (!fullName || !email || !phone || !school || !role) {
    return { error: "Please fill in your details and pick a role." };
  }

  await prisma.volunteerApplication.create({
    data: { fullName, email, phone, school, level, department, role, experience, availability },
  });

  redirect("/volunteer/applied");
}
