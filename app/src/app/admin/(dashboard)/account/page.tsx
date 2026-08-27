import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountForm } from "./AccountForm";

export default async function AdminAccountPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!user) redirect("/admin/login");

  return (
    <div>
      <h1 className="font-display border-b-2 border-ink pb-3 text-lg font-extrabold">My account</h1>
      <div className="mt-4">
        <AccountForm initial={{ name: user.name, email: user.email }} />
      </div>
    </div>
  );
}
