import Link from "next/link";
import { GameControllerIcon } from "./Icon";

// Deliberately near-invisible — it lives in the top-right corner of the
// dark Theme card on the homepage, blending into that background rather
// than announcing itself. Visibility is admin-controlled (EventSettings
// .gamesIconVisible), so it can stay off until event day.
export function HiddenGamesIcon() {
  return (
    <Link
      href="/games"
      aria-label="Games"
      className="absolute right-3 top-3 text-white/15 transition-colors hover:text-gold/70"
    >
      <GameControllerIcon className="h-3.5 w-3.5" />
    </Link>
  );
}
