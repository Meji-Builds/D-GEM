import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { prisma } from "@/lib/prisma";
import { getEventSettings } from "@/lib/data";
import type { CrosswordPlacement } from "@/lib/crossword";
import { CrosswordGame } from "./CrosswordGame";

export default async function CrosswordPage() {
  const [settings, layouts] = await Promise.all([
    getEventSettings(),
    prisma.crosswordLayout.findMany(),
  ]);

  const layoutsByLevel: Record<number, { width: number; height: number; placements: CrosswordPlacement[] } | null> = {
    1: null,
    2: null,
    3: null,
  };
  for (const l of layouts) {
    layoutsByLevel[l.level] = { width: l.width, height: l.height, placements: l.placements as unknown as CrosswordPlacement[] };
  }

  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
          <CrosswordGame layoutsByLevel={layoutsByLevel} />
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
