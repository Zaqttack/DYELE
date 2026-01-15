import type { GameState, HistoryEntry } from "../types";

const STORAGE_PREFIX = "dyele:daily:";
const HISTORY_KEY = "dyele:history";

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

export const loadAllGameStates = (): GameState[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const states: GameState[] = [];
  for (const key of Object.keys(window.localStorage)) {
    if (!key.startsWith(STORAGE_PREFIX)) {
      continue;
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      continue;
    }
    try {
      const parsed = JSON.parse(raw) as GameState;
      const dateKey = parsed.dateKey || key.replace(STORAGE_PREFIX, "");
      states.push({ ...parsed, dateKey });
    } catch {
      // Ignore malformed entries.
    }
  }
  return states;
};

export const loadHistory = (): HistoryEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveHistory = (entries: HistoryEntry[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
};

export const upsertHistoryEntry = (entry: HistoryEntry): HistoryEntry[] => {
  const entries = loadHistory();
  const nextEntries = [
    entry,
    ...entries.filter((existing) => existing.dateKey !== entry.dateKey)
  ];
  saveHistory(nextEntries);
  return nextEntries;
};
