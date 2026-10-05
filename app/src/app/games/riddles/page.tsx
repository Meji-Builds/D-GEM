import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";
import { RiddlesGame } from "./RiddlesGame";

export default async function RiddlesPage() {
  const [settings, riddles] = await Promise.all([
    getEventSettings(),
    prisma.gameRiddle.findMany({ orderBy: [{ level: "asc" }, { order: "asc" }] }),
  ]);

  const riddlesByLevel: Record<number, typeof riddles> = { 1: [], 2: [], 3: [] };
  for (const r of riddles) {
    riddlesByLevel[r.level] = [...(riddlesByLevel[r.level] ?? []), r];
  }

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <RiddlesGame riddlesByLevel={riddlesByLevel} />
        </div>
      </main>
      <PublicFooter
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        instagramUrl={settings.instagramUrl}
        twitterUrl={settings.twitterUrl}
        tiktokUrl={settings.tiktokUrl}
      />
    </div>
  );
}
