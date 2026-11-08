import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDisplay, CardSide } from './card-display';
import { Card } from '../../../core/models/card.model';
import { BASIC_CARD, OWN_BACK_CARD, RUNE_ARMOR } from '../../../core/testing/deck.fixtures';

describe('CardDisplay', () => {
  let fixture: ComponentFixture<CardDisplay>;
  let host: HTMLElement;

  const render: (card: Card, side?: CardSide) => Promise<void> = async (card, side) => {
    fixture.componentRef.setInput('card', card);
    if (side) fixture.componentRef.setInput('side', side);
    await fixture.whenStable();
  };

  const image: () => HTMLImageElement | null = () => host.querySelector('img');
  const placeholder: () => HTMLElement | null = () => host.querySelector('.card-placeholder');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardDisplay] }).compileComponents();
    fixture = TestBed.createComponent(CardDisplay);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows only the front image with the card name as alt text', async () => {
    await render(RUNE_ARMOR);

    expect(image()?.getAttribute('src')).toBe('cards/e1.svg');
    expect(image()?.alt).toBe('Runenrüstung');
    // Weder Name noch Slot oder Werte stehen auf der Karte.
    expect(host.textContent?.trim()).toBe('');
  });

  it('shows the back image of the card when side is back', async () => {
    await render(OWN_BACK_CARD, 'back');

    expect(image()?.getAttribute('src')).toBe('cards/special-back.svg');
    expect(image()?.alt).toBe('Kartenrückseite');
  });

  it('emits the card id on click', async () => {
    await render(BASIC_CARD);
    const clicked: string[] = [];
    fixture.componentInstance.cardClick.subscribe((id: string) => clicked.push(id));

    (host.querySelector('.card-display') as HTMLElement).click();

    expect(clicked).toEqual(['b1']);
  });

  it('shows owner and origin as caption below the card only when given', async () => {
    await render(RUNE_ARMOR);
    expect(host.querySelector('.card-caption')).toBeNull();
    expect(host.classList).not.toContain('card-display--captioned');

    fixture.componentRef.setInput('owner', 'Barbar');
    fixture.componentRef.setInput('origin', 'Monster (2)');
    await fixture.whenStable();

    const caption: HTMLElement = host.querySelector('.card-face + .card-caption') as HTMLElement;
    expect(caption.querySelector('.card-owner')?.textContent).toBe('Im Besitz von Barbar');
    expect(caption.querySelector('.card-origin')?.textContent).toBe('aus Monster (2)');
    expect(host.querySelector('.card-face')?.textContent?.trim()).toBe('');
    expect(host.classList).toContain('card-display--captioned');
  });

  it('shows a placeholder with the card name when the front cannot be loaded', async () => {
    await render(BASIC_CARD);
    image()!.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(image()).toBeNull();
    expect(placeholder()?.getAttribute('aria-label')).toBe('Fackel');
    expect(placeholder()?.textContent?.trim()).toBe('Fackel');
  });

  it('shows a placeholder without name when the back cannot be loaded', async () => {
    await render(BASIC_CARD, 'back');
    image()!.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(placeholder()?.getAttribute('aria-label')).toBe('Kartenrückseite');
    expect(placeholder()?.textContent?.trim()).toBe('');
  });

  it('tries to load again when the image changes', async () => {
    await render(BASIC_CARD);
    image()!.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    await render(BASIC_CARD, 'back');

    expect(image()?.getAttribute('src')).toBe('cards/back.svg');
  });

  it('shows the placeholder for a card without image path', async () => {
    await render({ ...BASIC_CARD, imagePath: '' });

    expect(image()).toBeNull();
    expect(placeholder()).not.toBeNull();
  });
});
