import { DungeonLayout } from '../models/dungeon-layout.model';

/** Höchstzahl der Rückgängig-Schritte. */
export const HISTORY_LIMIT: number = 50;

/** Frühere (`past`, ältester zuerst) und rückgängig gemachte Stände (`future`, nächster zuletzt). */
export interface LayoutHistory {
  past: DungeonLayout[];
  future: DungeonLayout[];
}

export const EMPTY_HISTORY: LayoutHistory = { past: [], future: [] };

/** Merkt sich den Stand vor einer Änderung; eine neue Änderung leert „Wiederholen“. */
export function recordChange(history: LayoutHistory, previous: DungeonLayout): LayoutHistory {
  return { past: [...history.past, previous].slice(-HISTORY_LIMIT), future: [] };
}

/** Schritt zurück: liefert den neuen Verlauf und das wiederhergestellte Layout, sonst `null`. */
export function undoChange(
  history: LayoutHistory,
  current: DungeonLayout,
): { history: LayoutHistory; layout: DungeonLayout } | null {
  const layout: DungeonLayout | undefined = history.past.at(-1);
  if (!layout) return null;
  return {
    history: { past: history.past.slice(0, -1), future: [...history.future, current] },
    layout,
  };
}

/** Schritt vor: Gegenstück zu `undoChange`. */
export function redoChange(
  history: LayoutHistory,
  current: DungeonLayout,
): { history: LayoutHistory; layout: DungeonLayout } | null {
  const layout: DungeonLayout | undefined = history.future.at(-1);
  if (!layout) return null;
  return {
    history: { past: [...history.past, current], future: history.future.slice(0, -1) },
    layout,
  };
}
