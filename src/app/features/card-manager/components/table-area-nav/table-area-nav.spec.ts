import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { CardTableArea } from '../../models/card-table-area.model';
import { cardTableAreas } from '../../utils/card-table-areas.util';
import { TableAreaNav } from './table-area-nav';

describe('TableAreaNav', () => {
  let fixture: ComponentFixture<TableAreaNav>;
  const areas: CardTableArea[] = cardTableAreas({
    hand: 3,
    equipped: 2,
    inventory: 0,
    belt: 1,
    decks: 2,
  });

  const entries: () => HTMLButtonElement[] = () =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));

  beforeEach(async () => {
    fixture = TestBed.createComponent(TableAreaNav);
    fixture.componentRef.setInput('areas', areas);
    await fixture.whenStable();
  });

  it('lists every area in order with its count', () => {
    expect(entries().map((entry) => entry.textContent?.trim())).toEqual([
      'Hand (3)',
      'Ausgerüstet (2)',
      'Inventar (–)',
      'Gürtel (1)',
      'Spieltisch (2)',
    ]);
  });

  it('disables an empty area and names the reason in the tooltip', () => {
    const inventory: HTMLButtonElement = entries()[2];
    expect(inventory.disabled).toBe(true);
    expect(inventory.title).toBe('Keine Karten im Inventar');
    expect(entries()[3].disabled).toBe(false);
    expect(entries()[3].hasAttribute('title')).toBe(false);
  });

  it('reports the clicked area', () => {
    const selected: (area: CardTableArea) => void = vi.fn();
    fixture.componentInstance.selected.subscribe(selected);

    entries()[3].click();
    expect(selected).toHaveBeenCalledWith(areas[3]);
  });
});
