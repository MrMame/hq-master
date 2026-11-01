import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerPage } from './time-tracker-page';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { GameLogService } from '../../../../core/services/game-log/game-log.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { clickButton } from '../../../../shared/testing/click-button';

describe('TimeTrackerPage', () => {
  let fixture: ComponentFixture<TimeTrackerPage>;
  let host: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TimeTrackerPage] });
    fixture = TestBed.createComponent(TimeTrackerPage);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const gameTime: () => string = () =>
    host.querySelector('[data-testid="game-time-label"]')?.textContent?.trim() ?? '';
  const byName: (name: string) => HTMLButtonElement = (name) =>
    host.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
  const act: (action: () => void) => Promise<void> = async (action) => {
    action();
    await fixture.whenStable();
  };

  it('shows the sidebar with title, toggle-all and the group "Zeit vorrücken"', () => {
    const aside: HTMLElement = host.querySelector('aside')!;
    expect(aside.querySelector('h2')?.textContent?.trim()).toBe('Time Tracker');
    expect(aside.querySelector('[aria-label="Alle Gruppen einklappen"]')).not.toBeNull();
    expect(aside.querySelector('h3')?.textContent?.trim()).toBe('Zeit vorrücken');
  });

  it('shows the game time under the heading "Spielzeit" outside the sidebar', () => {
    const section: HTMLElement = host.querySelector('[aria-labelledby="game-time-title"]')!;
    expect(section.closest('aside')).toBeNull();
    expect(section.querySelector('h2')?.textContent?.trim()).toBe('Spielzeit');
    expect(gameTime()).toBe('23:55:00 2381-01-01');
  });

  it('collapses and expands the group via its heading', async () => {
    const heading: HTMLButtonElement = host.querySelector('h3 button')!;
    const content: () => HTMLElement = () => host.querySelector('.sidebar-section__content')!;

    await act(() => heading.click());
    expect(heading.getAttribute('aria-expanded')).toBe('false');
    expect(content().hidden).toBe(true);

    await act(() => heading.click());
    expect(content().hidden).toBe(false);
  });

  it.each([
    ['1 Sekunde vorrücken', '+1 s', '23:55:01 2381-01-01'],
    ['5 Sekunden vorrücken', '+5 s', '23:55:05 2381-01-01'],
    ['10 Sekunden vorrücken', '+10 s', '23:55:10 2381-01-01'],
    ['1 Stunde vorrücken', '+1 h', '00:55:00 2381-01-02'],
    ['8 Stunden vorrücken', '+8 h', '07:55:00 2381-01-02'],
  ])('"%s" (label %s) advances the game time', async (name, label, expected) => {
    const button: HTMLButtonElement = byName(name);
    expect(button.textContent?.trim()).toBe(label);
    expect(button.title).toBe(name);

    await act(() => button.click());

    expect(gameTime()).toBe(expected);
  });

  it('keeps the test ids of the second steps', () => {
    for (const step of [1, 5, 10]) {
      expect(host.querySelector(`[data-testid="add-seconds-${step}"]`)).not.toBeNull();
    }
  });

  it('keeps the round state on a time step', async () => {
    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter({ ...createTestCharacter('a'), movedThisRound: true });

    await act(() => byName('1 Stunde vorrücken').click());

    expect(charactersDb.characters()[0].movedThisRound).toBe(true);
  });

  it('"Neue Runde" logs the round, adds 10 s and resets the moved characters', async () => {
    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter({ ...createTestCharacter('a'), movedThisRound: true });

    await act(() => clickButton(host, 'Neue Runde'));

    expect(gameTime()).toBe('23:55:10 2381-01-01');
    expect(
      TestBed.inject(GameLogService)
        .entries()
        .map((e) => e.text),
    ).toContain('Neue Runde');
    expect(charactersDb.characters()[0].movedThisRound).toBe(false);
    expect(host.querySelector('[data-testid="game-log-list"]')?.textContent).toContain(
      'Neue Runde',
    );
  });
});
