import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCards } from './inventory-cards';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import {
  BASIC_CARD,
  COMBAT_CARD,
  createTwoDeckState,
  inventoryCard,
} from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('InventoryCards', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<InventoryCards>;
  let host: HTMLElement;

  const headings: () => string[] = () =>
    Array.from(host.querySelectorAll('h3')).map((el) => el.textContent?.trim() ?? '');

  beforeEach(() => {
    testbed = configureCardManagerTestbed();
    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter({ ...createTestCharacter('a'), name: 'Barbar' });
    charactersDb.writeCharacter({ ...createTestCharacter('b'), name: 'Zwerg' });
    charactersDb.writeCharacter({ ...createTestCharacter('c'), name: 'Elf' });
    fixture = TestBed.createComponent(InventoryCards);
    host = fixture.nativeElement as HTMLElement;
  });

  it('groups the cards by character in session order with count and origin', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      inventory: [
        inventoryCard(BASIC_CARD, 'b', 'deck-2'),
        inventoryCard(BASIC_CARD, 'a'),
        inventoryCard(COMBAT_CARD, 'b'),
      ],
    });
    await fixture.whenStable();

    expect(host.querySelector('h2')?.textContent).toBe('Inventar');
    // Elf ohne Inventarkarten erscheint nicht.
    expect(headings()).toEqual(['Barbar (1)', 'Zwerg (2)']);
    const dwarf: Element | null = host.querySelector('[aria-label="Inventar von Zwerg"]');
    expect(Array.from(dwarf!.querySelectorAll('.card-origin')).map((el) => el.textContent)).toEqual(
      ['aus Testdeck (2)', 'aus Testdeck'],
    );
  });

  it('follows renames at once', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      inventory: [inventoryCard(BASIC_CARD, 'a')],
    });
    await fixture.whenStable();
    TestBed.inject(CharactersDbService).writeCharacter({
      ...createTestCharacter('a'),
      name: 'Barbar der Rote',
    });
    await fixture.whenStable();
    expect(headings()).toEqual(['Barbar der Rote (1)']);
  });

  it('is hidden without inventory cards or with cards of unknown characters only', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      inventory: [inventoryCard(BASIC_CARD, 'x')],
    });
    await fixture.whenStable();
    expect(host.querySelector('section')).toBeNull();
    expect(host.classList).toContain('inventory--empty');
  });

  it('opens a clicked card in the card viewer without moving it', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      inventory: [inventoryCard(COMBAT_CARD, 'a', 'deck-2')],
    });
    await fixture.whenStable();
    (host.querySelector('.card-display') as HTMLElement).click();
    expect(TestBed.inject(CardViewerService).viewed()?.ref).toEqual({
      deckId: 'deck-2',
      cardId: 'c1',
    });
    expect(testbed.cardManager.state().inventory).toHaveLength(1);
  });
});
