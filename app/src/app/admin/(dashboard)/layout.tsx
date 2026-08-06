import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full bg-white">
      <AdminNav userName={session.name} />
      <div className="mx-auto max-w-6xl px-5 py-6">{children}</div>
    </div>
  );
}
