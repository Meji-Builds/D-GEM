import Link from "next/link";
import { GameControllerIcon } from "./Icon";

// The visible entry point to the games — replaces the old hidden,
// click-the-logo easter egg with an actual discoverable launcher.
export function GamesFab() {
  return (
    <Link
      href="/games"
      aria-label="Play the D-GEM games"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/15 text-gold shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:scale-105 hover:bg-white/25 active:scale-95"
    >
      <GameControllerIcon className="h-6 w-6" />
    </Link>
  );
}
