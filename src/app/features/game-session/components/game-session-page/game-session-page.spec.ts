import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSessionPage } from './game-session-page';
import { GameSessionService } from '../../services/game-session.service';
import {
  GameSessionPageSetup,
  setupGameSessionPage,
  typeInto,
} from '../../testing/game-session-page.fixtures';

describe('GameSessionPage', () => {
  let fixture: ComponentFixture<GameSessionPage>;
  let page: GameSessionPageSetup;
  let service: GameSessionService;
  let start: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    page = await setupGameSessionPage();
    fixture = page.fixture;
    service = TestBed.inject(GameSessionService);
    start = vi.spyOn(service, 'startSession');
  });

  const click: (testId: string) => Promise<void> = async (testId: string): Promise<void> => {
    page.byTestId<HTMLButtonElement>(testId).click();
    await fixture.whenStable();
  };

  it('should show an inactive session that cannot be ended', () => {
    expect(page.readText('session-state')).toContain('Inaktiv');
    expect(page.byTestId<HTMLButtonElement>('end-session').disabled).toBe(true);
  });

  it('should start a session with the default start time after confirmation', async () => {
    await click('start-session');
    expect(start).toHaveBeenCalledWith({
      name: '',
      startTime: { year: 2390, month: 5, day: 6, hours: 7, minutes: 0, seconds: 0 },
    });
    expect(page.readText('session-state')).toContain('Aktiv');
  });

  it('should start a session with the entered, trimmed name', async () => {
    typeInto(page.byTestId<HTMLInputElement>('session-name'), '  Gruft  ');
    await click('start-session');
    expect(start).toHaveBeenCalledWith(expect.objectContaining({ name: 'Gruft' }));
    expect(page.readText('session-state')).toContain('– Gruft');
  });

  it('should not start a session when the dialog is cancelled', async () => {
    page.confirmWith(false);
    await click('start-session');
    expect(start).not.toHaveBeenCalled();
  });

  it('should show an error and not start a session without a valid start time', async () => {
    typeInto(page.byTestId<HTMLInputElement>('session-start-time'), '');

    await click('start-session');

    expect(page.readText('session-error')).toBe('Bitte eine gültige Ingame-Startzeit angeben.');
    expect(page.dialogOpen).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });

  it('should clear the error after a successful start', async () => {
    typeInto(page.byTestId<HTMLInputElement>('session-start-time'), '');
    await click('start-session');
    typeInto(page.byTestId<HTMLInputElement>('session-start-time'), '2390-05-06T08:30');

    await click('start-session');

    expect(page.readText('session-error')).toBe('');
    expect(page.readText('session-state')).toContain('Aktiv');
  });

  it('should end the session', async () => {
    await click('start-session');
    await click('end-session');
    expect(service.meta().active).toBe(false);
    expect(page.readText('session-state')).toContain('Inaktiv');
  });
});
