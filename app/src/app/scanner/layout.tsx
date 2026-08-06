import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ScannerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <div className="min-h-full bg-mist">{children}</div>;
}
