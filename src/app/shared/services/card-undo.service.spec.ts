import { TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { CardUndoService, UNDO_HINT_DURATION_MS } from './card-undo.service';
import { CardManagerService } from '../../core/services/card-deck/card-manager.service';
import { findCardAt } from '../../core/services/card-deck/card-location.util';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { EquipmentService } from '../../core/services/equipment/equipment.service';
import { CardLocation } from '../../core/models/card-location.model';
import { CardRef, DeckState } from '../../core/models/deck-state.model';
import { Card } from '../../core/models/card.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { createMoveState, deck1Ref } from '../../core/testing/card-move.fixtures';
import { createPropertyCard } from '../../core/testing/deck.fixtures';
import { createSnackBarMock, SnackBarHintMock, SnackBarMock } from '../testing/snack-bar.fixtures';

describe('CardUndoService', () => {
  let service: CardUndoService;
  let cardManager: CardManagerService;
  let equipment: EquipmentService;
  let charactersDb: CharactersDbService;
  let open: Mock;
  let hints: SnackBarHintMock[];

  const where: (ref: CardRef) => CardLocation | undefined = (ref) =>
    findCardAt(cardManager.state(), ref)?.location;
  const barbarian: () => { Ruestung: number; Leben: number } = () =>
    charactersDb.characters().find((c) => c.id === 'a')!;

  beforeEach(() => {
    const snackBar: SnackBarMock = createSnackBarMock();
    ({ open, hints } = snackBar);
    TestBed.configureTestingModule({ providers: [snackBar.provider] });
    service = TestBed.inject(CardUndoService);
    cardManager = TestBed.inject(CardManagerService);
    equipment = TestBed.inject(EquipmentService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter({
      ...createTestCharacter('a'),
      name: 'Barbar',
      Ruestung: 2,
    });
    charactersDb.writeCharacter({ ...createTestCharacter('b'), name: 'Zwerg' });
    // deck-1: h1 Hand, h2 Nachziehstapel, h3 Ablage, h4 Bank, h5 bei „a“ links, h6 im Inventar von „a“.
    cardManager.restore(createMoveState());
  });

  /** Legt eine zusätzliche Ausrüstungskarte aus deck-1 in die Hand. */
  function withHandCard(card: Card): void {
    const state: DeckState = createMoveState();
    cardManager.restore({ ...state, hand: [...state.hand, { deckId: 'deck-1', card }] });
  }

  async function act(ref: CardRef, target: CardLocation): Promise<void> {
    await service.track(ref, () => equipment.moveCard(ref, target));
    TestBed.tick();
  }

  it('offers undo with a text for the action and reverts an assignment with a displaced card', async () => {
    const plate: CardRef = deck1Ref('p1');
    withHandCard(createPropertyCard('p1', 'Platte', [{ name: 'Ruestung', value: 3 }]));

    await act(plate, { kind: 'equipped', characterId: 'a', slot: 'leftHand' });
    expect(open).toHaveBeenCalledWith('Platte an Barbar angelegt', 'Rückgängig', {
      duration: UNDO_HINT_DURATION_MS,
    });
    expect(where(deck1Ref('h5'))).toEqual({ kind: 'discardPile' });
    expect(barbarian()).toMatchObject({ Ruestung: 5 });

    hints[0].action.next();
    TestBed.tick();
    expect(where(plate)).toEqual({ kind: 'hand' });
    expect(where(deck1Ref('h5'))).toEqual({ kind: 'equipped', characterId: 'a', slot: 'leftHand' });
    expect(barbarian()).toMatchObject({ Ruestung: 2 });
    expect(service.canUndo()).toBe(false);
  });

  it.each<[string, CardLocation, string]>([
    ['h1', { kind: 'drawPile' }, 'Schild 1 in den Nachziehstapel gelegt'],
    ['h6', { kind: 'inventory', characterId: 'b' }, 'Schild 6 ins Inventar von Zwerg gelegt'],
    ['h5', { kind: 'discardPile' }, 'Schild 5 in den Ablagestapel gelegt'],
    ['h3', { kind: 'hand' }, 'Schild 3 in die Hand genommen'],
    ['h2', { kind: 'bank' }, 'Schild 2 in die Bank gelegt'],
    ['h7', { kind: 'belt', characterId: 'b' }, 'Schild 7 in den Gürtel von Zwerg gelegt'],
    ['h1', { kind: 'belt', characterId: 'a' }, 'Schild 1 in den Gürtel von Barbar gelegt'],
  ])('brings %s back from %o', async (cardId, target, text) => {
    const ref: CardRef = deck1Ref(cardId);
    const from: CardLocation | undefined = where(ref);
    await act(ref, target);
    expect(open.mock.calls[0][0]).toBe(text);
    service.undo();
    expect(where(ref)).toEqual(from);
  });

  it('restores the bonus of a discarded equipped card', async () => {
    withHandCard(createPropertyCard('s9', 'Wall', [{ name: 'Ruestung', value: 2 }]));
    equipment.moveCard(deck1Ref('s9'), { kind: 'equipped', characterId: 'a', slot: 'rightHand' });
    expect(barbarian()).toMatchObject({ Ruestung: 4 });

    await act(deck1Ref('s9'), { kind: 'discardPile' });
    expect(barbarian()).toMatchObject({ Ruestung: 2 });
    service.undo();
    expect(barbarian()).toMatchObject({ Ruestung: 4 });
  });

  it('restores Leben when a belt move is undone', async () => {
    withHandCard(createPropertyCard('l9', 'Lebensband', [{ name: 'Leben', value: 30 }]));
    const before: number = barbarian().Leben;
    await act(deck1Ref('l9'), { kind: 'belt', characterId: 'a' });
    expect(barbarian().Leben).toBe(before + 30);
    service.undo();
    expect(where(deck1Ref('l9'))).toEqual({ kind: 'hand' });
    expect(barbarian().Leben).toBe(before);
  });

  it('drops the hint when the card was moved elsewhere or its former owner is gone', async () => {
    await act(deck1Ref('h1'), { kind: 'bank' });
    cardManager.moveCard(deck1Ref('h1'), { kind: 'discardPile' });
    TestBed.tick();
    expect(service.canUndo()).toBe(false);
    expect(hints[0].dismiss).toHaveBeenCalled();
    service.undo();
    expect(where(deck1Ref('h1'))).toEqual({ kind: 'discardPile' });

    await act(deck1Ref('h6'), { kind: 'hand' });
    charactersDb.removeCharacter(charactersDb.characters().find((c) => c.id === 'a')!);
    TestBed.tick();
    expect(service.canUndo()).toBe(false);
  });

  it('keeps only the last action and offers nothing when the card did not move', async () => {
    await act(deck1Ref('h1'), { kind: 'bank' });
    await act(deck1Ref('h3'), { kind: 'hand' });
    expect(hints[0].dismiss).toHaveBeenCalled();
    service.undo();
    expect(where(deck1Ref('h1'))).toEqual({ kind: 'bank' });
    expect(where(deck1Ref('h3'))).toEqual({ kind: 'discardPile' });

    await act(deck1Ref('h1'), { kind: 'bank' });
    expect(open).toHaveBeenCalledTimes(2);
    expect(service.canUndo()).toBe(false);
  });

  it('forgets the action when the hint closes after its time', async () => {
    await act(deck1Ref('h1'), { kind: 'bank' });
    hints[0].dismissed.next();
    expect(service.canUndo()).toBe(false);
  });
});
