/**
 * Verwaltungsdaten der aktuellen Spielesession.
 * `startedAt` ist der reale Startzeitpunkt (ISO-String), nicht die Ingame-Zeit.
 */
export interface SessionMeta {
  name: string;
  active: boolean;
  startedAt: string | null;
}

export const DEFAULT_SESSION_META: SessionMeta = {
  name: '',
  active: false,
  startedAt: null,
};
