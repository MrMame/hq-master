import { GameTimeSpan } from '../../../core/models/game-time-span.model';

/** Zeit-Button der Gruppe „Zeit vorrücken“: kurze Beschriftung, voller Name für `aria-label`/`title`. */
export interface TimeStep {
  label: string;
  name: string;
  span: GameTimeSpan;
  /** Spalten im 6er-Raster der Gruppe: Sekunden je 2, Stunden je 3. */
  columns: 2 | 3;
  /** Nur Sekundenschritte, z. B. `add-seconds-5`. */
  testId?: string;
}

export const TIME_STEPS: readonly TimeStep[] = [
  {
    label: '+1 s',
    name: '1 Sekunde vorrücken',
    span: { seconds: 1 },
    columns: 2,
    testId: 'add-seconds-1',
  },
  {
    label: '+5 s',
    name: '5 Sekunden vorrücken',
    span: { seconds: 5 },
    columns: 2,
    testId: 'add-seconds-5',
  },
  {
    label: '+10 s',
    name: '10 Sekunden vorrücken',
    span: { seconds: 10 },
    columns: 2,
    testId: 'add-seconds-10',
  },
  { label: '+1 h', name: '1 Stunde vorrücken', span: { hours: 1 }, columns: 3 },
  { label: '+8 h', name: '8 Stunden vorrücken', span: { hours: 8 }, columns: 3 },
];
