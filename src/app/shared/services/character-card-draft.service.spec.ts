import { TestBed } from '@angular/core/testing';

import { CharacterCardDraftService } from './character-card-draft.service';
import { CardDraft } from '../models/card-action.model';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../core/models/character-info.model';
import { DeckState } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import {
  assignedCard,
  createEquipmentDeckState,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../core/testing/deck.fixtures';

describe('CharacterCardDraftService', () => {
  let service: CharacterCardDraftService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  let draft: CardDraft;
  // Rüstung 4/4, Turmschild links, Runenrüstung (+2 Rüstung) im Inventar.
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', armor: 4 };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CharacterCardDraftService] });
    service = TestBed.inject(CharacterCardDraftService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    const s: DeckState = createEquipmentDeckState('a');
    cardManager.restore({ ...s, hand: [], inventory: [inventoryCard(RUNE_ARMOR, 'a')] });
    draft = service.start('a');
  });

  it('shows the cards of the character as in the session before any move', () => {
    expect(draft.characterId).toBe('a');
    expect(service.cards()).toEqual({
      equipped: [assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
      inventory: [inventoryCard(RUNE_ARMOR, 'a')],
    });
    expect(draft.equipped()).toEqual(service.cards().equipped);
  });

  it('shows recorded moves in the draft cards without touching the session', () => {
    const before: DeckState = cardManager.state();
    draft.move({ deckId: 'deck-1', cardId: 'e1' }, { kind: 'equipped', slot: 'body' });
    draft.move({ deckId: 'deck-1', cardId: 'e2' }, { kind: 'inventory' });

    expect(draft.moves()).toHaveLength(2);
    expect(service.cards()).toEqual({
      equipped: [assignedCard(RUNE_ARMOR, 'a', 'body')],
      inventory: [inventoryCard(TOWER_SHIELD, 'a')],
    });
    expect(cardManager.state()).toBe(before);
  });

  it('applies the moves in order with bonus and limits (4/4 → 6/6)', () => {
    draft.move({ deckId: 'deck-1', cardId: 'e1' }, { kind: 'equipped', slot: 'body' });
    draft.move({ deckId: 'deck-1', cardId: 'e2' }, { kind: 'discardPile' });
    service.apply();

    expect(cardManager.state().assigned).toEqual([assignedCard(RUNE_ARMOR, 'a', 'body')]);
    expect(cardManager.state().inventory).toEqual([]);
    expect(cardManager.state().decks[0].discardPile).toEqual([TOWER_SHIELD]);
    expect(charactersDb.characters()[0].armor).toBe(6);
  });
});
