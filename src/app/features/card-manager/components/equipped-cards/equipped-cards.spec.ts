import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquippedCards } from './equipped-cards';
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

    expect(host.querySelector('h2')?.textContent).toBe('Ausgerüstet (2)');
    expect(host.classList).not.toContain('equipped--empty');
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

  it('renders nothing without assignments', async () => {
    testbed.cardManager.restore(createTwoDeckState());
    await fixture.whenStable();
    expect(host.querySelector('section')).toBeNull();
    expect(host.classList).toContain('equipped--empty');
  });
});
