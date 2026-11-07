import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardActionMenu } from './card-action-menu';
import { CardAction } from '../../models/card-action.model';
import { CardMenuEntry } from '../../utils/card-menu-entries.util';

function entry(id: string, disabledReason: string | null, dividerBefore: boolean): CardMenuEntry {
  const action: CardAction = {
    id,
    label: `Aktion ${id}`,
    group: 'g',
    order: 0,
    modes: ['live'],
    isAvailable: () => true,
    run: () => undefined,
  };
  return { action, disabledReason, dividerBefore };
}

describe('CardActionMenu', () => {
  let fixture: ComponentFixture<CardActionMenu>;
  let host: HTMLElement;
  let chosen: string[];

  const items: () => HTMLButtonElement[] = () =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));

  beforeEach(async () => {
    fixture = TestBed.createComponent(CardActionMenu);
    host = fixture.nativeElement as HTMLElement;
    chosen = [];
    fixture.componentInstance.run.subscribe((action) => chosen.push(action.id));
    fixture.componentRef.setInput('entries', [
      entry('a', null, false),
      entry('b', 'Keine Charaktere in der Session', true),
    ]);
    await fixture.whenStable();
  });

  it('lists the entries as menu items with a divider before a new group', () => {
    expect(host.querySelector('[role="menu"]')?.getAttribute('aria-label')).toBe('Kartenaktionen');
    expect(items().map((item) => item.textContent?.trim())).toEqual(['Aktion a', 'Aktion b']);
    expect(host.querySelectorAll('[role="separator"]')).toHaveLength(1);
  });

  it('reports a chosen entry and ignores a disabled one', () => {
    items()[0].click();
    items()[1].click();
    expect(chosen).toEqual(['a']);
    expect(items()[1].disabled).toBe(true);
    expect(items()[1].parentElement?.title).toBe('Keine Charaktere in der Session');
  });

  it('shows a hint without entries', async () => {
    fixture.componentRef.setInput('entries', []);
    await fixture.whenStable();
    expect(items()).toHaveLength(0);
    expect(host.textContent).toContain('Keine Aktionen');
  });
});
