import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterInventoryEditor } from './character-inventory-editor';
import { CardRef } from '../../../core/models/deck-state.model';
import { BASIC_CARD, inventoryCard, RUNE_ARMOR } from '../../../core/testing/deck.fixtures';

// Zusammenspiel mit Card Viewer und „Übernehmen“: character-editor-dialog-inventory.spec.ts.
describe('CharacterInventoryEditor', () => {
  let fixture: ComponentFixture<CharacterInventoryEditor>;
  let host: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CharacterInventoryEditor);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('shows "Keine Karten im Inventar" without cards', () => {
    expect(host.querySelector('legend')?.textContent).toBe('Inventar');
    expect(host.textContent).toContain('Keine Karten im Inventar');
  });

  it('lists every card with image and name and reports a click', async () => {
    const viewed: CardRef[] = [];
    fixture.componentInstance.view.subscribe((ref) => viewed.push(ref));
    fixture.componentRef.setInput('cards', [
      inventoryCard(RUNE_ARMOR, 'a'),
      inventoryCard(BASIC_CARD, 'a', 'deck-2'),
    ]);
    await fixture.whenStable();

    const names: string[] = Array.from(host.querySelectorAll('.inventory-editor__name')).map(
      (el) => el.textContent ?? '',
    );
    expect(names).toEqual(['Runenrüstung', 'Fackel']);
    expect(host.querySelector<HTMLImageElement>('.inventory-editor__image img')?.src).toContain(
      'cards/e1.svg',
    );
    expect(host.textContent).not.toContain('Keine Karten im Inventar');

    host.querySelector<HTMLButtonElement>('button[aria-label="Fackel ansehen"]')!.click();
    expect(viewed).toEqual([{ deckId: 'deck-2', cardId: 'b1' }]);
  });
});
