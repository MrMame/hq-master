import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquippedCards } from './equipped-cards';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';
import {
  assignedCard,
  createTwoDeckState,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('EquippedCards', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<EquippedCards>;
  let host: HTMLElement;

  beforeEach(() => {
    testbed = configureCardManagerTestbed();
    fixture = TestBed.createComponent(EquippedCards);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows the same card of two decks with owner and origin', async () => {
    testbed.assignment.ownerNames.set(new Map([['a', 'Barbar']]));
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      assigned: [
        assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
        assignedCard(TOWER_SHIELD, 'a', 'rightHand', 'deck-2'),
      ],
    });
    await fixture.whenStable();

    expect(Array.from(host.querySelectorAll('.card-origin')).map((el) => el.textContent)).toEqual([
      'aus Testdeck',
      'aus Testdeck (2)',
    ]);
  });

  it('shows no owner or origin for unknown characters and decks', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      assigned: [assignedCard(RUNE_ARMOR, 'x', 'body', 'gone')],
    });
    await fixture.whenStable();
    expect(host.querySelector('.card-owner')).toBeNull();
    expect(host.querySelector('.card-origin')).toBeNull();
  });

  it('opens a clicked card in the card viewer without moving it', async () => {
    testbed.cardManager.restore({
      ...createTwoDeckState(),
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'rightHand', 'deck-2')],
    });
    await fixture.whenStable();
    (host.querySelector('.card-display') as HTMLElement).click();
    expect(TestBed.inject(CardViewerService).viewed()?.ref).toEqual({
      deckId: 'deck-2',
      cardId: 'e2',
    });
    expect(testbed.cardManager.assigned()).toHaveLength(1);
  });

  it('renders no cards without assignments', async () => {
    testbed.cardManager.restore(createTwoDeckState());
    await fixture.whenStable();
    expect(host.querySelector('app-card-display')).toBeNull();
  });
});
