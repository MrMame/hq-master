import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { provideDefaultCardActions } from './default-card-actions';
import { CARD_ACTIONS, CardAction, CardActionContext } from '../models/card-action.model';
import { CardMenuEntry, cardMenuEntries } from '../utils/card-menu-entries.util';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCardAt, LocatedCard } from '../../core/services/card-deck/card-location.util';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { CardRef, DeckInstance, DeckState } from '../../core/models/deck-state.model';
import { createMoveState, deck1Ref } from '../../core/testing/card-move.fixtures';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { assignedCard, RUNE_ARMOR } from '../../core/testing/deck.fixtures';

describe('assign and give-to-inventory card actions – submenus', () => {
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;

  function context(ref: CardRef): CardActionContext {
    const s: DeckState = cardManager.state();
    const found: LocatedCard = findCardAt(s, ref)!;
    const deck: DeckInstance = s.decks.find((d) => d.id === ref.deckId)!;
    return { ...found, ref, deck, mode: 'live', draft: null };
  }

  /** Untermenü der Aktion `id`, beschriftet; bei verschachtelten Einträgen mit „›“ und deren Einträgen. */
  function submenu(id: string, ref: CardRef): CardMenuEntry[] {
    const actions: CardAction[] = TestBed.inject(CARD_ACTIONS).filter((a) => a.id === id);
    return cardMenuEntries(actions, context(ref))[0].choices!();
  }
  const labels: (entries: CardMenuEntry[]) => string[] = (entries) => entries.map((e) => e.label);

  beforeEach(() => {
    const open: Mock = vi.fn(() => ({ afterClosed: (): Observable<string> => of('discardPile') }));
    TestBed.configureTestingModule({
      providers: [...provideDefaultCardActions(), { provide: MatDialog, useValue: { open } }],
    });
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter({ ...createTestCharacter('a'), name: 'Barbar' });
    charactersDb.writeCharacter({ ...createTestCharacter('b'), name: 'Zwerg' });
    // h1 in der Hand, h5 bei „a“ links, h6 im Inventar von „a“; deck-2: h5 bei „b“ rechts.
    cardManager.restore(createMoveState());
  });

  it('offers the characters and then all 5 slots in order, naming the replaced card', () => {
    const characters: CardMenuEntry[] = submenu('assign', deck1Ref('h1'));
    expect(labels(characters)).toEqual(['Barbar', 'Zwerg']);
    expect(labels(characters[0].choices!())).toEqual([
      'Kopf',
      'Körper',
      'Linke Hand – ersetzt Schild 5',
      'Rechte Hand',
      'Amulett',
    ]);
    expect(labels(characters[1].choices!())).toEqual([
      'Kopf',
      'Körper',
      'Linke Hand',
      'Rechte Hand – ersetzt Schild 5',
      'Amulett',
    ]);
  });

  it('assigns in three clicks: action, character, slot', async () => {
    const [barbarian] = submenu('assign', deck1Ref('h1'));
    await barbarian.choices!()[0].run!();
    expect(findCardAt(cardManager.state(), deck1Ref('h1'))?.location).toEqual({
      kind: 'equipped',
      characterId: 'a',
      slot: 'head',
    });
  });

  it('leaves out the slot the card lies in', () => {
    const characters: CardMenuEntry[] = submenu('assign', deck1Ref('h5'));
    expect(labels(characters[0].choices!())).toEqual(['Kopf', 'Körper', 'Rechte Hand', 'Amulett']);
  });

  it.each<[string, string]>([
    ['the inventory', 'h6'],
    ['the bank', 'h4'],
  ])('offers assigning for a card from %s as well', (_case, cardId) => {
    expect(labels(submenu('assign', deck1Ref(cardId)))).toEqual(['Barbar', 'Zwerg']);
  });

  it('puts a card without slot information into any slot of the chosen character', async () => {
    cardManager.restore({ ...createMoveState(), hand: [{ deckId: 'deck-1', card: RUNE_ARMOR }] });
    const [, dwarf] = submenu('assign', deck1Ref('e1'));
    await dwarf.choices!()[4].run!();
    expect(cardManager.state().assigned).toContainEqual(assignedCard(RUNE_ARMOR, 'b', 'amulet'));
  });

  it('gives a card to the inventory of the chosen character, without the current owner', async () => {
    const targets: CardMenuEntry[] = submenu('give-to-inventory', deck1Ref('h6'));
    expect(labels(targets)).toEqual(['Zwerg']);
    await targets[0].run!();
    expect(findCardAt(cardManager.state(), deck1Ref('h6'))?.location).toEqual({
      kind: 'inventory',
      characterId: 'b',
    });
  });
});
