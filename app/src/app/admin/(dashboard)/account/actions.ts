"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, verifyPassword, createSessionCookie } from "@/lib/auth";

export type AccountState = { error?: string; ok?: boolean };

export async function updateAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const session = await getSession();
  if (!session) return { error: "Session expired — please log in again." };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email) return { error: "Name and email are required." };
  if (!currentPassword) return { error: "Enter your current password to save changes." };

  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: "Current password is incorrect." };
  }

  if (newPassword || confirmPassword) {
    if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };
    if (newPassword !== confirmPassword) return { error: "New passwords don't match." };
  }

  if (email !== user.email) {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing && existing.id !== user.id) return { error: "That email is already in use." };
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      name,
      email,
      ...(newPassword ? { passwordHash: await hashPassword(newPassword) } : {}),
    },
  });

  await createSessionCookie({ sub: updated.id, email: updated.email, name: updated.name, role: updated.role });
  revalidatePath("/admin", "layout");
  return { ok: true };
}
