import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { clickButton } from '../../../../shared/testing/click-button';
import { createDeckState, createEquipmentDeckState } from '../../../../core/testing/deck.fixtures';
import {
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

describe('CardManagerPage – equipment', () => {
  let harness: CardManagerPageHarness;
  let host: HTMLElement;

  const overlay: () => HTMLElement = () => TestBed.inject(OverlayContainer).getContainerElement();
  const equipped: () => HTMLElement | null = () =>
    host.querySelector('section[aria-label="Ausgerüstet"]');

  beforeEach(async () => {
    harness = await setupCardManagerPage();
    host = harness.host;
  });

  it('shows assigned cards with the current owner name', async () => {
    harness.assignment.ownerNames.set(new Map([['a', 'Barbar']]));
    await harness.render(createEquipmentDeckState('a'));

    expect(equipped()?.querySelector('h3')?.textContent).toBe('Ausgerüstet (1)');
    expect(equipped()?.textContent).toContain('Turmschild');
    expect(equipped()?.querySelector('.card-owner')?.textContent).toBe('Im Besitz von Barbar');
  });

  it('hides the equipped area without assignments', async () => {
    await harness.render(createDeckState());
    expect(equipped()).toBeNull();
  });

  it('starts the assignment from the floating card', async () => {
    await harness.render(createEquipmentDeckState('a'));
    overlay().querySelector<HTMLButtonElement>('.floating-card__assign')!.click();

    expect(harness.assignment.assignActiveCard).toHaveBeenCalledOnce();
    expect(harness.service.discardActiveCard).not.toHaveBeenCalled();
  });

  it('passes the reason for a disabled assignment to the floating card', async () => {
    harness.assignment.assignDisabledReason.set('Keine Charaktere in der Session');
    await harness.render(createEquipmentDeckState('a'));

    const button: HTMLButtonElement = overlay().querySelector('.floating-card__assign')!;
    expect(button.disabled).toBe(true);
    expect(button.parentElement?.title).toBe('Keine Charaktere in der Session');
  });

  it('keeps the deck when the DM declines replacing assigned cards', async () => {
    harness.assignment.confirmNewDeck.mockResolvedValue(false);
    await harness.render(createEquipmentDeckState('a'));
    clickButton(host, 'Deck Laden');
    await harness.fixture.whenStable();

    expect(harness.assignment.confirmNewDeck).toHaveBeenCalledOnce();
    expect(harness.service.loadDeck).not.toHaveBeenCalled();
  });

  it('loads a new deck after confirming, and without asking when nothing is assigned', async () => {
    await harness.render(createEquipmentDeckState('a'));
    clickButton(host, 'Deck Laden');
    await harness.fixture.whenStable();
    expect(harness.service.loadDeck).toHaveBeenCalledOnce();

    await harness.render(createDeckState());
    clickButton(host, 'Deck Laden');
    await harness.fixture.whenStable();
    expect(harness.assignment.confirmNewDeck).toHaveBeenCalledOnce();
    expect(harness.service.loadDeck).toHaveBeenCalledTimes(2);
  });
});
