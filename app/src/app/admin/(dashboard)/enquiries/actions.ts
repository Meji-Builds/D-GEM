"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { EnquiryStatus } from "@prisma/client";

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  await prisma.sponsorshipEnquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
}
