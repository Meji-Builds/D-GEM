"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dgem_game_player";

export type GamePlayer = { ticketId: string; fullName: string };

// `undefined` = not yet hydrated from localStorage, `null` = no player saved.
export function useGamePlayer() {
  const [player, setPlayer] = useState<GamePlayer | null | undefined>(undefined);

  useEffect(() => {
    // Reading localStorage is a read from an external system, so the actual
    // setState happens inside a queued callback rather than synchronously
    // in the effect body (react-hooks/set-state-in-effect).
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setPlayer(raw ? JSON.parse(raw) : null);
      } catch {
        setPlayer(null);
      }
    });
  }, []);

  function savePlayer(next: GamePlayer) {
    setPlayer(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore — localStorage unavailable
    }
  }

  function clearPlayer() {
    setPlayer(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return { player, savePlayer, clearPlayer };
}
