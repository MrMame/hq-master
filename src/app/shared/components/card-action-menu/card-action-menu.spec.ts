import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock, vi } from 'vitest';

import { CardActionMenu } from './card-action-menu';
import { CardMenuEntry, CardMenuRun } from '../../utils/card-menu-entries.util';

function entry(
  id: string,
  overrides: Partial<CardMenuEntry> = {},
  run: CardMenuRun = () => undefined,
): CardMenuEntry {
  return {
    id,
    label: `Aktion ${id}`,
    disabledReason: null,
    dividerBefore: false,
    run,
    choices: null,
    ...overrides,
  };
}

describe('CardActionMenu', () => {
  let fixture: ComponentFixture<CardActionMenu>;
  let host: HTMLElement;
  let ran: CardMenuRun[];
  let leaf: Mock<CardMenuRun>;

  const items: () => HTMLButtonElement[] = () =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
  const labels: () => string[] = () => items().map((item) => item.textContent?.trim() ?? '');
  const item: (label: string) => HTMLButtonElement = (label) =>
    items().find((candidate) => candidate.textContent?.includes(label))!;
  const back: () => HTMLButtonElement | null = () =>
    host.querySelector<HTMLButtonElement>('button[aria-label="Zurück"]');

  async function click(button: HTMLButtonElement | null): Promise<void> {
    button?.click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(CardActionMenu);
    host = fixture.nativeElement as HTMLElement;
    ran = [];
    leaf = vi.fn<CardMenuRun>();
    fixture.componentInstance.run.subscribe((run) => ran.push(run));
    const hands: CardMenuEntry[] = [entry('left', { label: 'Linke Hand' }, leaf)];
    fixture.componentRef.setInput('entries', [
      entry('a'),
      entry('b', { disabledReason: 'Keine Charaktere in der Session', dividerBefore: true }),
      entry('assign', {
        label: 'Anlegen',
        run: null,
        choices: () => [entry('barbar', { label: 'Barbar', run: null, choices: () => hands })],
      }),
    ]);
    fixture.componentRef.setInput('cardKey', 'deck-1/e1');
    await fixture.whenStable();
  });

  it('lists the entries as menu items with a divider before a new group', () => {
    expect(host.querySelector('[role="menu"]')?.getAttribute('aria-label')).toBe('Kartenaktionen');
    expect(labels()).toEqual(['Aktion a', 'Aktion b', 'Anlegen›']);
    expect(item('Anlegen').getAttribute('aria-haspopup')).toBe('menu');
    expect(host.querySelectorAll('[role="separator"]')).toHaveLength(1);
    expect(back()).toBeNull();
  });

  it('reports a chosen entry and ignores a disabled one', () => {
    items()[0].click();
    items()[1].click();
    expect(ran).toHaveLength(1);
    expect(items()[1].disabled).toBe(true);
    expect(items()[1].parentElement?.title).toBe('Keine Charaktere in der Session');
  });

  it('opens nested submenus, goes back one level and returns to the top after running', async () => {
    await click(item('Anlegen'));
    expect(labels()).toEqual(['Barbar›']);
    expect(host.querySelector('[role="menu"]')?.getAttribute('aria-label')).toBe('Anlegen');
    expect(host.querySelector('[data-testid="card-action-menu-heading"]')?.textContent).toContain(
      'Anlegen',
    );

    await click(item('Barbar'));
    expect(labels()).toEqual(['Linke Hand']);
    await click(back());
    expect(labels()).toEqual(['Barbar›']);

    await click(item('Barbar'));
    await click(item('Linke Hand'));
    expect(ran).toEqual([leaf]);
    expect(labels()).toEqual(['Aktion a', 'Aktion b', 'Anlegen›']);
  });

  it('closes open submenus when another card is shown or the entry disappears', async () => {
    await click(item('Anlegen'));
    fixture.componentRef.setInput('cardKey', 'deck-1/e2');
    await fixture.whenStable();
    expect(back()).toBeNull();

    await click(item('Anlegen'));
    fixture.componentRef.setInput('entries', [entry('a')]);
    await fixture.whenStable();
    expect(labels()).toEqual(['Aktion a']);
  });

  it('shows a hint without entries', async () => {
    fixture.componentRef.setInput('entries', []);
    await fixture.whenStable();
    expect(items()).toHaveLength(0);
    expect(host.textContent).toContain('Keine Aktionen');
  });
});
