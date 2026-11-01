import { GameLogEntryType } from '../../../core/models/game-log-entry.model';

/** Filter-Chips des Ereignis-Logs (UI-Zustand, nicht persistiert). */
export type GameLogFilter = 'all' | 'time' | 'conditions' | 'damage';

/** Eine Zeile der Log-Liste: Trennzeile beim Tageswechsel oder ein Eintrag. */
export type GameLogRow =
  | { kind: 'date'; key: string; date: string }
  | {
      kind: 'entry';
      key: string;
      type: GameLogEntryType;
      time: string;
      icon: string;
      text: string;
    };
