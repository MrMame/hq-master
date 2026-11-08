import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterProperties } from './character-properties';
import { Card } from '../../../core/models/card.model';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  assignedCard,
  createDeckInstance,
  createPropertyCard,
  inventoryCard,
} from '../../../core/testing/deck.fixtures';

const GLOVE: Card = createPropertyCard('g1', 'Stachelhandschuh', [
  { name: 'Angriff', value: 2 },
  { name: 'Leben', value: 5 },
]);
const RING: Card = createPropertyCard('r1', 'Ring', [
  { name: 'Angriff', value: 1 },
  { name: 'Blitzschaden', value: 2 },
]);
const BOOK: Card = createPropertyCard('b9', 'Buch', [{ name: 'Weisheit', value: 4 }]);

describe('CharacterProperties', () => {
  let fixture: ComponentFixture<CharacterProperties>;
  const character: CharacterInfo = createTestCharacter('a');

  const items: () => HTMLElement[] = () =>
    Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        '[data-testid="character-property"]',
      ),
    );
  const texts: () => string[] = () => items().map((item) => item.textContent?.trim() ?? '');

  beforeEach(() => {
    TestBed.inject(CardManagerService).restore({
      decks: [createDeckInstance('deck-1')],
      hand: [],
      assigned: [assignedCard(GLOVE, 'a', 'rightHand')],
      inventory: [inventoryCard(BOOK, 'a')],
      belt: [inventoryCard(RING, 'a')],
    });
    fixture = TestBed.createComponent(CharacterProperties);
    fixture.componentRef.setInput('character', character);
  });

  it('shows the dynamic properties of slot and belt cards with their sources, not those of the inventory', () => {
    fixture.detectChanges();

    expect(texts()).toEqual(['Angriff 3', 'Blitzschaden 2']);
    expect(items()[0].title).toBe('Stachelhandschuh +2, Ring +1');
    expect(items()[1].title).toBe('Ring +2');
  });

  it('uses the cards it is given, e.g. those of the editor draft', () => {
    fixture.componentRef.setInput('cards', [BOOK]);
    fixture.detectChanges();

    expect(texts()).toEqual(['Weisheit 4']);
  });

  it('stays empty without dynamic properties and marks its variant', () => {
    fixture.componentRef.setInput('cards', []);
    fixture.componentRef.setInput('variant', 'selected');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(items()).toEqual([]);
    expect(host.classList).toContain('character-properties--selected');
  });

  it('follows changes of the session', () => {
    fixture.detectChanges();
    TestBed.inject(CardManagerService).moveCard(
      { deckId: 'deck-1', cardId: 'r1' },
      { kind: 'inventory', characterId: 'a' },
    );
    fixture.detectChanges();

    expect(texts()).toEqual(['Angriff 2']);
  });
});
