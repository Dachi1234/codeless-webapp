"use server";

import { revalidatePath } from "next/cache";
import { prisma, LeadStatus } from "@codeless/db";
import { auth } from "@/auth";

const VALID = new Set<string>(Object.values(LeadStatus));

export async function updateLeadStatus(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !VALID.has(status)) return;

  await prisma.lead.update({
    where: { id },
    data: { status: status as LeadStatus },
  });

  revalidatePath("/leads");
}
