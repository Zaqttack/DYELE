import type { GameState } from "../types";

const STORAGE_PREFIX = "dyele:daily:";

export const loadGameState = (dateKey: string): GameState | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${dateKey}`);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
};

export const saveGameState = (dateKey: string, state: GameState): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    `${STORAGE_PREFIX}${dateKey}`,
    JSON.stringify(state)
  );
};

export const clearGameState = (dateKey: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(`${STORAGE_PREFIX}${dateKey}`);
};
