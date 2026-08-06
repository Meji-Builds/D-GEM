import { getSession } from "@/lib/auth";
import { logout } from "@/app/admin/logout-action";
import { ScannerClient } from "./ScannerClient";

export default async function ScannerPage() {
  const session = await getSession();

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink bg-white px-4 py-3">
        <span className="font-display text-sm font-extrabold">
          D<span className="text-gold">GEM</span> Gate
        </span>
        <form action={logout}>
          <button type="submit" className="text-xs font-semibold text-bodyfg hover:text-gold">
            Sign out
          </button>
        </form>
      </div>
      <ScannerClient gate="Gate A" stewardName={session?.name ?? "Steward"} />
    </div>
  );
}
