import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { vi } from 'vitest';

import { ActiveCardOverlay } from './active-card-overlay';
import { Card } from '../../../../core/models/card.model';
import { createDeckInstance, RUNE_ARMOR } from '../../../../core/testing/deck.fixtures';

const [FIRST, SECOND]: Card[] = createDeckInstance().config.cards;

@Component({
  imports: [ActiveCardOverlay],
  template: `<app-active-card-overlay
    [card]="card()"
    backImagePath="cards/back.svg"
    [deckName]="deckName()"
    [assignDisabledReason]="reason()"
    (cardClick)="clicked()"
    (assignClick)="assigned()"
  />`,
})
class OverlayHost {
  readonly card: WritableSignal<Card | null> = signal<Card | null>(null);
  readonly reason: WritableSignal<string | null> = signal<string | null>(null);
  readonly deckName: WritableSignal<string> = signal<string>('');
  readonly clicked: () => void = vi.fn();
  readonly assigned: () => void = vi.fn();
}

describe('ActiveCardOverlay', () => {
  let fixture: ComponentFixture<OverlayHost>;
  let container: HTMLElement;

  const show: (card: Card | null) => Promise<void> = async (card: Card | null): Promise<void> => {
    fixture.componentInstance.card.set(card);
    await fixture.whenStable();
  };
  const floatingCards: () => HTMLElement[] = (): HTMLElement[] =>
    Array.from(container.querySelectorAll<HTMLElement>('app-card-display'));

  const assignButton: () => HTMLButtonElement | null = () =>
    container.querySelector<HTMLButtonElement>('.floating-card__assign');

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [OverlayHost] });
    fixture = TestBed.createComponent(OverlayHost);
    container = TestBed.inject(OverlayContainer).getContainerElement();
    await fixture.whenStable();
  });

  it('shows no overlay without an active card', () => {
    expect(floatingCards()).toHaveLength(0);
    expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
  });

  it('shows exactly one card in the overlay container, not inside the host', async () => {
    await show(FIRST);

    expect(floatingCards()).toHaveLength(1);
    expect(floatingCards()[0].querySelector('.card-name')?.textContent).toBe(FIRST.name);
    expect((fixture.nativeElement as HTMLElement).querySelector('app-card-display')).toBeNull();
  });

  it('opens without a backdrop', async () => {
    await show(FIRST);

    expect(container.querySelector('.cdk-overlay-backdrop')).toBeNull();
  });

  it('shows the new card after a change and removes the layer when reset to null', async () => {
    await show(FIRST);
    await show(SECOND);

    expect(floatingCards()).toHaveLength(1);
    expect(floatingCards()[0].querySelector('.card-name')?.textContent).toBe(SECOND.name);

    await show(null);
    expect(floatingCards()).toHaveLength(0);
    expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
  });

  it('emits cardClick when the floating card is clicked', async () => {
    await show(FIRST);
    floatingCards()[0].querySelector<HTMLElement>('.card-display')!.click();

    expect(fixture.componentInstance.clicked).toHaveBeenCalledOnce();
  });

  it('offers "Charakter zuweisen" only for equipment cards', async () => {
    await show(FIRST);
    expect(assignButton()).toBeNull();

    await show(RUNE_ARMOR);
    assignButton()!.click();
    expect(fixture.componentInstance.assigned).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.clicked).not.toHaveBeenCalled();
  });

  it('disables "Charakter zuweisen" and names the reason in the tooltip', async () => {
    fixture.componentInstance.reason.set('Keine Charaktere in der Session');
    await show(RUNE_ARMOR);

    expect(assignButton()!.disabled).toBe(true);
    expect(assignButton()!.parentElement!.title).toBe('Keine Charaktere in der Session');
  });

  it('leaves an empty overlay container after the component is destroyed', async () => {
    await show(FIRST);
    fixture.destroy();

    expect(container.querySelector('.cdk-overlay-pane')).toBeNull();
    expect(container.childElementCount).toBe(0);
  });

  it('shows the name of the deck above the card only when given', async () => {
    await show(FIRST);
    const deckLabel: () => Element | null = () =>
      container.querySelector('[data-testid="active-card-deck"]');
    expect(deckLabel()).toBeNull();

    fixture.componentInstance.deckName.set('Monster (2)');
    await fixture.whenStable();
    expect(deckLabel()?.textContent).toBe('Monster (2)');
  });
});
