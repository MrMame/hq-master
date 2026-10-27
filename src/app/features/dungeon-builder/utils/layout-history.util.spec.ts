import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout } from '../testing/builder.fixtures';
import {
  EMPTY_HISTORY,
  HISTORY_LIMIT,
  LayoutHistory,
  recordChange,
  redoChange,
  undoChange,
} from './layout-history.util';

const first: DungeonLayout = createTestLayout({ name: 'eins' });
const second: DungeonLayout = createTestLayout({ name: 'zwei' });
const third: DungeonLayout = createTestLayout({ name: 'drei' });

describe('layout-history.util', () => {
  it('has nothing to undo or redo at the start', () => {
    expect(undoChange(EMPTY_HISTORY, first)).toBeNull();
    expect(redoChange(EMPTY_HISTORY, first)).toBeNull();
  });

  it('undoes and redoes changes in order', () => {
    const history: LayoutHistory = recordChange(recordChange(EMPTY_HISTORY, first), second);

    const undone: { history: LayoutHistory; layout: DungeonLayout } | null = undoChange(
      history,
      third,
    );
    expect(undone?.layout).toBe(second);

    const redone: { history: LayoutHistory; layout: DungeonLayout } | null = redoChange(
      undone!.history,
      second,
    );
    expect(redone?.layout).toBe(third);
    expect(redone?.history.past).toEqual([first, second]);
  });

  it('clears redo when a new change is recorded', () => {
    const undone: { history: LayoutHistory } | null = undoChange(
      recordChange(EMPTY_HISTORY, first),
      second,
    );
    expect(recordChange(undone!.history, first).future).toEqual([]);
  });

  it('keeps at most 50 steps', () => {
    let history: LayoutHistory = EMPTY_HISTORY;
    for (let i: number = 0; i < HISTORY_LIMIT + 5; i++) {
      history = recordChange(history, createTestLayout({ name: `${i}` }));
    }
    expect(history.past).toHaveLength(50);
    expect(history.past[0].name).toBe('5');
  });
});
