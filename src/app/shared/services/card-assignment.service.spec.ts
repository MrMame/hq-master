import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { CardAssignmentService } from './card-assignment.service';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { SlotOccupiedDialog } from '../components/slot-occupied-dialog/slot-occupied-dialog';
import { SlotOccupiedChoice } from '../models/slot-occupied.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import {
  assignedCard,
  BUCKLER,
  createDeckState,
  createEquipmentDeckState,
  inventoryCard,
  TOWER_SHIELD,
} from '../../core/testing/deck.fixtures';

const RUNE_ARMOR_REF: CardRef = { deckId: 'deck-1', cardId: 'e1' };
const SHIELD_REF: CardRef = { deckId: 'deck-1', cardId: 'e2' };
const BUCKLER_REF: CardRef = { deckId: 'deck-1', cardId: 'e3' };

describe('CardAssignmentService', () => {
  let service: CardAssignmentService;
  let cardManager: CardManagerService;
  let charactersDb: CharactersDbService;
  let open: Mock;
  let displaced: SlotOccupiedChoice | undefined;
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar' };

  const deck: () => DeckState = () => cardManager.state();
  const withBuckler: () => void = () =>
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      hand: [{ deckId: 'deck-1', card: BUCKLER }],
    });

  beforeEach(() => {
    displaced = 'discardPile';
    open = vi.fn(() => ({ afterClosed: (): Observable<unknown> => of(displaced) }));
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open } }],
    });
    service = TestBed.inject(CardAssignmentService);
    cardManager = TestBed.inject(CardManagerService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(barbarian);
    // Runenrüstung in der Hand, Turmschild in der linken Hand von „a“.
    cardManager.restore(createEquipmentDeckState('a'));
  });

  it('assigns a card to a free slot without asking', async () => {
    await service.assignTo(RUNE_ARMOR_REF, 'a', 'body');
    expect(open).not.toHaveBeenCalled();
    expect(deck().hand).toEqual([]);
    expect(deck().assigned.map((entry) => entry.card.id)).toEqual(['e2', 'e1']);
  });

  it('asks where the card of an occupied slot goes and stops on cancel', async () => {
    withBuckler();
    displaced = undefined;
    await service.assignTo(BUCKLER_REF, 'a', 'leftHand');
    expect(open.mock.calls[0]).toEqual([
      SlotOccupiedDialog,
      { data: { cardName: 'Turmschild', characterName: 'Barbar' } },
    ]);
    expect(deck().hand.map((entry) => entry.card)).toEqual([BUCKLER]);
  });

  it('puts the previous card into the discard pile when chosen', async () => {
    withBuckler();
    await service.assignTo(BUCKLER_REF, 'a', 'leftHand');
    expect(deck().assigned).toEqual([assignedCard(BUCKLER, 'a', 'leftHand')]);
    expect(deck().decks[0].discardPile).toEqual([TOWER_SHIELD]);
  });

  it('puts the previous card into the inventory when chosen', async () => {
    withBuckler();
    displaced = 'inventory';
    await service.assignTo(BUCKLER_REF, 'a', 'leftHand');
    expect(deck().assigned).toEqual([assignedCard(BUCKLER, 'a', 'leftHand')]);
    expect(deck().inventory).toEqual([inventoryCard(TOWER_SHIELD, 'a')]);
  });

  it('moves an equipped card to the other hand without asking about the card itself', async () => {
    await service.assignTo(SHIELD_REF, 'a', 'rightHand');
    expect(open).not.toHaveBeenCalled();
    expect(deck().assigned).toEqual([assignedCard(TOWER_SHIELD, 'a', 'rightHand')]);
  });

  it('assigns nothing without characters or for an unknown card', async () => {
    expect(service.assignDisabledReason()).toBeNull();
    charactersDb.reset();
    expect(service.assignDisabledReason()).toBe('Keine Charaktere in der Session');
    await service.assignTo(RUNE_ARMOR_REF, 'a', 'body');
    expect(deck().hand).toHaveLength(1);

    charactersDb.writeCharacter(barbarian);
    cardManager.restore(createDeckState());
    const before: DeckState = deck();
    await service.assignTo(RUNE_ARMOR_REF, 'a', 'body');
    expect(deck()).toBe(before);
    await service.assignTo({ deckId: 'deck-1', cardId: 'c1' }, 'a', 'head');
    expect(deck().assigned.map((entry) => entry.card.id)).toEqual(['c1']);
  });

  it('looks up owner names by id so renaming shows at once', () => {
    expect(service.ownerNames().get('a')).toBe('Barbar');
    charactersDb.writeCharacter({ ...barbarian, name: 'Barbar der Rote' });
    expect(service.ownerNames().get('a')).toBe('Barbar der Rote');
  });
});
