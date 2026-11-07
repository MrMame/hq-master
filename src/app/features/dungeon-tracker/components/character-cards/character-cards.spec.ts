import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock, vi } from 'vitest';

import { CharacterCards } from './character-cards';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import {
  assignedCard,
  BASIC_CARD,
  createDeckState,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../../../core/testing/deck.fixtures';

describe('CharacterCards', () => {
  let fixture: ComponentFixture<CharacterCards>;
  let host: HTMLElement;
  let cardManager: CardManagerService;
  let viewer: CardViewerService;

  const buttons: () => HTMLButtonElement[] = () =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('button'));
  const labels: () => (string | null)[] = () => buttons().map((b) => b.getAttribute('aria-label'));

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    cardManager = TestBed.inject(CardManagerService);
    viewer = TestBed.inject(CardViewerService);
    cardManager.restore({
      ...createDeckState(),
      assigned: [
        assignedCard(TOWER_SHIELD, 'a', 'rightHand'),
        assignedCard(RUNE_ARMOR, 'a', 'body'),
        assignedCard(RUNE_ARMOR, 'b', 'body', 'deck-2'),
      ],
      inventory: [inventoryCard(BASIC_CARD, 'a'), inventoryCard(RUNE_ARMOR, 'b', 'deck-2')],
    });
    fixture = TestBed.createComponent(CharacterCards);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('character', createTestCharacter('a'));
    await fixture.whenStable();
  });

  it('shows the equipped cards of the character as images in slot order and his inventory count', () => {
    expect(labels()).toEqual([
      'Runenrüstung ansehen',
      'Turmschild ansehen',
      'Inventar ansehen (1)',
    ]);
    expect(host.querySelector('img')?.getAttribute('src')).toBe(RUNE_ARMOR.imagePath);
    expect(buttons()[2].textContent).toContain('1');
  });

  it('opens a card or the first inventory card in the live viewer', () => {
    buttons()[1].click();
    expect(viewer.viewed()).toEqual({
      ref: { deckId: 'deck-1', cardId: 'e2' },
      context: { mode: 'live' },
    });
    buttons()[2].click();
    expect(viewer.viewed()?.ref).toEqual({ deckId: 'deck-1', cardId: 'b1' });
  });

  it('keeps clicks and double clicks away from the token or legend', () => {
    const outer: Mock<(event: Event) => void> = vi.fn();
    host.parentElement?.addEventListener('click', outer);
    host.parentElement?.addEventListener('dblclick', outer);
    buttons()[0].click();
    buttons()[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(outer).not.toHaveBeenCalled();
  });

  it('shows nothing for a character without cards', async () => {
    fixture.componentRef.setInput('character', createTestCharacter('c'));
    await fixture.whenStable();
    expect(buttons()).toEqual([]);
  });
});
