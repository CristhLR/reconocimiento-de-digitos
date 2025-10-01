import type { HistoryEntry } from "../models/Image";

const KEY = "history";

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry) {
  const prev = loadHistory();
  localStorage.setItem(KEY, JSON.stringify([entry, ...prev]));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
