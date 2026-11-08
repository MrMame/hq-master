import { Card } from '../../models/card.model';
import { InventoryLocation } from '../../models/card-location.model';
import { CharacterInfo } from '../../models/character-info.model';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { BASIC_CARD, RUNE_ARMOR } from '../../testing/deck.fixtures';
import { inventoryAddedEntry, inventoryRemovedEntry, moveEntries } from './inventory-log.util';

const now: Date = new Date('2026-01-01T12:00:00');
const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };
const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg' };
const texts: (entries: NewGameLogEntry[]) => string[] = (entries) => entries.map((e) => e.text);

describe('inventory log', () => {
  it('writes an entry into the inventory with receiver, time and previous owner', () => {
    expect(inventoryAddedEntry(dwarf, BASIC_CARD, undefined, now)).toEqual({
      type: 'inventory-added',
      gameTime: now.toISOString(),
      characterId: 'b',
      characterName: 'Zwerg',
      text: 'Fackel ins Inventar von Zwerg',
    });
    expect(inventoryAddedEntry(dwarf, BASIC_CARD, barbarian, now).text).toBe(
      'Fackel von Barbar ins Inventar von Zwerg',
    );
    expect(inventoryAddedEntry(dwarf, BASIC_CARD, dwarf, now).text).toBe(
      'Fackel ins Inventar von Zwerg',
    );
  });

  it.each<[string, Parameters<typeof inventoryRemovedEntry>[2], CharacterInfo | undefined, string]>(
    [
      [
        'own slot',
        { kind: 'equipped', characterId: 'a', slot: 'body' },
        barbarian,
        'Runenrüstung von Barbar aus dem Inventar angelegt',
      ],
      [
        'slot of another',
        { kind: 'equipped', characterId: 'b', slot: 'body' },
        dwarf,
        'Runenrüstung aus dem Inventar von Barbar an Zwerg angelegt',
      ],
      ['hand', { kind: 'hand' }, undefined, 'Runenrüstung aus dem Inventar von Barbar in die Hand'],
      [
        'draw pile',
        { kind: 'drawPile' },
        undefined,
        'Runenrüstung aus dem Inventar von Barbar in den Nachziehstapel',
      ],
      [
        'discard pile',
        { kind: 'discardPile' },
        undefined,
        'Runenrüstung aus dem Inventar von Barbar in den Ablagestapel',
      ],
      ['bank', { kind: 'bank' }, undefined, 'Runenrüstung aus dem Inventar von Barbar in die Bank'],
    ],
  )('names the target %s when a card leaves the inventory', (_, target, receiver, text) => {
    const entry: NewGameLogEntry = inventoryRemovedEntry(
      barbarian,
      RUNE_ARMOR,
      target,
      receiver,
      now,
    );
    expect(entry).toMatchObject({ type: 'inventory-removed', characterId: 'a', text });
  });

  it('writes one entry per move and none without the characters involved', () => {
    const inventoryA: InventoryLocation = { kind: 'inventory', characterId: 'a' };
    const base: { card: Card; now: Date } = { card: RUNE_ARMOR, now };
    expect(
      texts(
        moveEntries({
          ...base,
          from: { kind: 'hand' },
          target: inventoryA,
          giver: undefined,
          receiver: barbarian,
        }),
      ),
    ).toEqual(['Runenrüstung ins Inventar von Barbar']);
    expect(
      texts(
        moveEntries({
          ...base,
          from: inventoryA,
          target: { kind: 'bank' },
          giver: barbarian,
          receiver: undefined,
        }),
      ),
    ).toEqual(['Runenrüstung aus dem Inventar von Barbar in die Bank']);
    expect(
      texts(
        moveEntries({
          ...base,
          from: { kind: 'equipped', characterId: 'a', slot: 'body' },
          target: { kind: 'hand' },
          giver: barbarian,
          receiver: undefined,
        }),
      ),
    ).toEqual(['Barbar legt Runenrüstung ab']);
    expect(
      moveEntries({
        ...base,
        from: { kind: 'hand' },
        target: inventoryA,
        giver: undefined,
        receiver: undefined,
      }),
    ).toEqual([]);
    expect(
      moveEntries({
        ...base,
        from: { kind: 'hand' },
        target: { kind: 'bank' },
        giver: undefined,
        receiver: undefined,
      }),
    ).toEqual([]);
    expect(
      moveEntries({
        ...base,
        card: BASIC_CARD,
        from: { kind: 'bank' },
        target: { kind: 'hand' },
        giver: barbarian,
        receiver: undefined,
      }),
    ).toEqual([]);
  });
});
