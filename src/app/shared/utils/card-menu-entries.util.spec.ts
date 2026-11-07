import { Mock, vi } from 'vitest';
import {
  CardAction,
  CardActionContext,
  CardActionInfo,
  CardChoice,
} from '../models/card-action.model';
import { BASIC_CARD, createDeckInstance } from '../../core/testing/deck.fixtures';
import { cardMenuEntries, CardMenuEntry } from './card-menu-entries.util';

const CONTEXT: CardActionContext = {
  card: BASIC_CARD,
  ref: { deckId: 'deck-1', cardId: 'b1' },
  deck: createDeckInstance(),
  location: { kind: 'hand' },
  mode: 'live',
  draft: null,
};

function info(id: string, overrides: Partial<CardActionInfo> = {}): CardActionInfo {
  return {
    id,
    label: id,
    group: 'move',
    order: 0,
    modes: ['live'],
    isAvailable: () => true,
    ...overrides,
  };
}

function action(id: string, overrides: Partial<CardActionInfo> = {}): CardAction {
  return { ...info(id, overrides), run: () => undefined };
}

const ids: (entries: CardMenuEntry[]) => string[] = (entries) => entries.map((entry) => entry.id);

describe('cardMenuEntries', () => {
  it('sorts by order and puts a divider where the group changes', () => {
    const entries: CardMenuEntry[] = cardMenuEntries(
      [
        action('assign', { group: 'equip', order: 50 }),
        action('bank', { order: 40 }),
        action('hand', { order: 10 }),
      ],
      CONTEXT,
    );
    expect(ids(entries)).toEqual(['hand', 'bank', 'assign']);
    expect(entries.map((entry) => entry.dividerBefore)).toEqual([false, false, true]);
  });

  it('hides unavailable actions and actions of another mode', () => {
    const entries: CardMenuEntry[] = cardMenuEntries(
      [
        action('hidden', { isAvailable: (c) => c.location.kind !== 'hand' }),
        action('draft-only', { modes: ['draft'] }),
        action('both', { modes: ['live', 'draft'] }),
      ],
      CONTEXT,
    );
    expect(ids(entries)).toEqual(['both']);
  });

  it('passes the reason for a disabled action and enables actions without one', () => {
    const entries: CardMenuEntry[] = cardMenuEntries(
      [
        action('blocked', { order: 1, disabledReason: () => 'Keine Charaktere in der Session' }),
        action('free', { order: 2, disabledReason: () => null }),
        action('plain', { order: 3 }),
      ],
      CONTEXT,
    );
    expect(entries.map((entry) => entry.disabledReason)).toEqual([
      'Keine Charaktere in der Session',
      null,
      null,
    ]);
  });

  it('runs an action with the context it was listed for', () => {
    const run: Mock<(context: CardActionContext) => void> = vi.fn();
    const [entry] = cardMenuEntries([{ ...info('hand'), run }], CONTEXT);
    expect(entry.choices).toBeNull();
    void entry.run?.();
    expect(run).toHaveBeenCalledExactlyOnceWith(CONTEXT);
  });

  it('builds submenu entries only when opened, nested and with their reasons', () => {
    const leaf: Mock<() => void> = vi.fn();
    const choices: Mock<(context: CardActionContext) => readonly CardChoice[]> = vi.fn(() => [
      { id: 'a', label: 'Barbar', disabledReason: 'Belegt', run: leaf },
      { id: 'b', label: 'Zwerg', choices: () => [{ id: 'left', label: 'Linke Hand', run: leaf }] },
    ]);
    const [entry] = cardMenuEntries([{ ...info('assign'), choices }], CONTEXT);
    expect(entry.run).toBeNull();
    expect(choices).not.toHaveBeenCalled();

    const level: CardMenuEntry[] = entry.choices!();
    expect(choices).toHaveBeenCalledWith(CONTEXT);
    expect(level.map((e) => [e.label, e.disabledReason, e.dividerBefore])).toEqual([
      ['Barbar', 'Belegt', false],
      ['Zwerg', null, false],
    ]);
    const [hand] = level[1].choices!();
    void hand.run?.();
    expect(hand.label).toBe('Linke Hand');
    expect(leaf).toHaveBeenCalledOnce();
  });
});
