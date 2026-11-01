import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'vitest';

import { GameLogList } from './game-log-list';
import { GameLogService } from '../../../../core/services/game-log/game-log.service';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestLogEntry } from '../../../../core/testing/game-log.fixtures';
import { ConfirmationService } from '../../../../shared/services/confirmation.service';

const at: (day: number, hours: number) => string = (day: number, hours: number): string =>
  new Date(2381, 0, day, hours).toISOString();

describe('GameLogList', () => {
  let fixture: ComponentFixture<GameLogList>;
  let host: HTMLElement;
  let gameLog: GameLogService;
  const confirm: Mock = vi.fn();

  /** Zeilentext; die Spalten (Zeit, Text) einer Eintragszeile mit Leerzeichen verbunden. */
  const rowTexts: () => string[] = () =>
    Array.from(host.querySelectorAll('li')).map((li) =>
      li.children.length === 0
        ? (li.textContent?.trim() ?? '')
        : Array.from(li.querySelectorAll('span'))
            .map((span) => span.textContent?.trim())
            .join(' '),
    );
  const button: (text: string) => HTMLButtonElement = (text) =>
    Array.from(host.querySelectorAll('button')).find((b) => b.textContent?.trim() === text)!;
  const click: (text: string) => Promise<void> = async (text) => {
    button(text).click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    confirm.mockReset();
    TestBed.configureTestingModule({
      imports: [GameLogList],
      providers: [{ provide: ConfirmationService, useValue: { confirm } }],
    });
    gameLog = TestBed.inject(GameLogService);
    fixture = TestBed.createComponent(GameLogList);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const fillLog: () => Promise<void> = async () => {
    gameLog.restore([
      createTestLogEntry({
        id: '1',
        type: 'condition-set',
        conditionId: 'poison',
        gameTime: at(1, 23),
        text: 'Gift bei Ork gesetzt',
      }),
      createTestLogEntry({
        id: '2',
        type: 'time',
        gameTime: at(2, 1),
        text: '+2 h (23:00:00 → 01:00:00)',
      }),
      createTestLogEntry({
        id: '3',
        type: 'damage',
        damageType: DamageTypes.Critical,
        gameTime: at(2, 1),
        text: 'Ork: 2 Schaden auf Leben',
      }),
    ]);
    await fixture.whenStable();
  };

  it('shows "Noch keine Ereignisse" and a disabled clear button without entries', () => {
    expect(host.textContent).toContain('Noch keine Ereignisse');
    expect(button('Log leeren').disabled).toBe(true);
  });

  it('lists the newest entries first with time, icon and a date row at the day change', async () => {
    await fillLog();

    expect(rowTexts()).toEqual([
      '01:00:00 Ork: 2 Schaden auf Leben',
      '01:00:00 +2 h (23:00:00 → 01:00:00)',
      '2381-01-01',
      '23:00:00 Gift bei Ork gesetzt',
    ]);
    const icons: string[] = Array.from(host.querySelectorAll('img')).map(
      (img) => img.getAttribute('src') ?? '',
    );
    expect(icons).toEqual([
      './img/hit-critical.svg',
      './img/clock.svg',
      './img/conditions/poison.svg',
    ]);
    expect(host.textContent).not.toContain('Noch keine Ereignisse');
  });

  it('filters the entries via the chips and marks the active chip', async () => {
    await fillLog();

    await click('Zeit');
    expect(rowTexts()).toEqual(['01:00:00 +2 h (23:00:00 → 01:00:00)']);
    expect(button('Zeit').getAttribute('aria-pressed')).toBe('true');
    expect(button('Alle').getAttribute('aria-pressed')).toBe('false');

    await click('Zustände');
    expect(rowTexts()).toEqual(['23:00:00 Gift bei Ork gesetzt']);

    await click('Schaden');
    expect(rowTexts()).toEqual(['01:00:00 Ork: 2 Schaden auf Leben']);

    await click('Alle');
    expect(rowTexts()).toHaveLength(4);
  });

  it('shows the empty hint when a filter matches nothing', async () => {
    gameLog.restore([createTestLogEntry()]);
    await fixture.whenStable();

    await click('Schaden');
    expect(host.textContent).toContain('Noch keine Ereignisse');
  });

  it('clears the log after confirmation', async () => {
    await fillLog();
    confirm.mockResolvedValue(true);

    await click('Log leeren');

    expect(confirm).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ title: 'Log leeren' }),
    );
    expect(gameLog.entries()).toEqual([]);
    expect(host.textContent).toContain('Noch keine Ereignisse');
  });

  it('keeps the log when the confirmation is cancelled', async () => {
    await fillLog();
    confirm.mockResolvedValue(false);

    await click('Log leeren');

    expect(gameLog.entries()).toHaveLength(3);
  });
});
