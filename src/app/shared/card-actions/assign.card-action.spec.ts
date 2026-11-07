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

  it('offers the characters and then the hands, the free one first, naming the replaced card', () => {
    const characters: CardMenuEntry[] = submenu('assign', deck1Ref('h1'));
    expect(labels(characters)).toEqual(['Barbar', 'Zwerg']);
    expect(labels(characters[0].choices!())).toEqual([
      'Rechte Hand',
      'Linke Hand – ersetzt Schild 5',
    ]);
    expect(labels(characters[1].choices!())).toEqual([
      'Linke Hand',
      'Rechte Hand – ersetzt Schild 5',
    ]);
  });

  it('assigns in at most three clicks: action, character, hand', async () => {
    const [barbarian] = submenu('assign', deck1Ref('h1'));
    await barbarian.choices!()[0].run!();
    expect(findCardAt(cardManager.state(), deck1Ref('h1'))?.location).toEqual({
      kind: 'equipped',
      characterId: 'a',
      slot: 'rightHand',
    });
  });

  it('offers only the other hand of the wearer for an equipped hand card', () => {
    const characters: CardMenuEntry[] = submenu('assign', deck1Ref('h5'));
    expect(labels(characters[0].choices!())).toEqual(['Rechte Hand']);
  });

  it('assigns a card with a single slot directly from the character entry', async () => {
    cardManager.restore({
      ...createMoveState(),
      hand: [{ deckId: 'deck-1', card: RUNE_ARMOR }],
      assigned: [],
    });
    const characters: CardMenuEntry[] = submenu('assign', deck1Ref('e1'));
    expect(characters.map((entry) => entry.choices)).toEqual([null, null]);
    await characters[1].run!();
    expect(cardManager.state().assigned).toEqual([assignedCard(RUNE_ARMOR, 'b', 'body')]);

    expect(labels(submenu('assign', deck1Ref('e1')))).toEqual(['Barbar']);
  });

  it('hides assigning when the only character already wears the card in its only slot', () => {
    charactersDb.reset();
    charactersDb.writeCharacter({ ...createTestCharacter('a'), name: 'Barbar' });
    cardManager.restore({
      ...createMoveState(),
      assigned: [assignedCard(RUNE_ARMOR, 'a', 'body')],
    });
    const actions: CardAction[] = TestBed.inject(CARD_ACTIONS).filter((a) => a.id === 'assign');
    expect(cardMenuEntries(actions, context(deck1Ref('e1')))).toEqual([]);
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
