import { CardAction, CardActionContext } from '../models/card-action.model';
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

function action(id: string, overrides: Partial<CardAction> = {}): CardAction {
  return {
    id,
    label: id,
    group: 'move',
    order: 0,
    modes: ['live'],
    isAvailable: () => true,
    run: () => undefined,
    ...overrides,
  };
}

const ids: (entries: CardMenuEntry[]) => string[] = (entries) =>
  entries.map((entry) => entry.action.id);

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
});
