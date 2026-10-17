import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { GameSessionPage } from './game-session-page';
import { GameSessionService } from '../../services/game-session.service';
import { SessionFileService } from '../../services/session-file.service';
import { SessionXmlService } from '../../services/session-xml.service';
import { createSessionSnapshot } from '../../testing/session.fixtures';

describe('GameSessionPage', () => {
  let component: GameSessionPage;
  let fixture: ComponentFixture<GameSessionPage>;
  let service: GameSessionService;
  const dialogResult: { value: boolean } = { value: true };
  const dialogMock: { open: ReturnType<typeof vi.fn> } = {
    open: vi.fn(() => ({ afterClosed: () => of(dialogResult.value) })),
  };

  beforeEach(async () => {
    localStorage.clear();
    dialogResult.value = true;
    dialogMock.open.mockClear();
    await TestBed.configureTestingModule({
      imports: [GameSessionPage],
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GameSessionPage);
    component = fixture.componentInstance;
    service = TestBed.inject(GameSessionService);
    await fixture.whenStable();
  });

  const readText: (testId: string) => string = (testId: string): string => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement as HTMLElement;
    return element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim() ?? '';
  };

  it('should create and show an inactive session', () => {
    expect(component).toBeTruthy();
    expect(readText('session-state')).toContain('Inaktiv');
  });

  it('should start a session after confirmation', async () => {
    const start: ReturnType<typeof vi.spyOn> = vi.spyOn(service, 'startSession');
    await component.startSession();
    expect(start).toHaveBeenCalledWith({
      name: '',
      startTime: { year: 2390, month: 5, day: 6, hours: 7, minutes: 0, seconds: 0 },
    });
    expect(readText('session-state')).toContain('Aktiv');
  });

  it('should not start a session when the dialog is cancelled', async () => {
    dialogResult.value = false;
    const start: ReturnType<typeof vi.spyOn> = vi.spyOn(service, 'startSession');
    await component.startSession();
    expect(start).not.toHaveBeenCalled();
  });

  const setStartTime: (value: string) => void = (value: string): void => {
    const input: HTMLInputElement = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="session-start-time"]',
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  const clickStart: () => Promise<void> = async (): Promise<void> => {
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('[data-testid="start-session"]')!
      .click();
    await fixture.whenStable();
  };

  it('should show an error and not start a session without a valid start time', async () => {
    const start: ReturnType<typeof vi.spyOn> = vi.spyOn(service, 'startSession');
    setStartTime('');

    await clickStart();

    expect(readText('session-error')).toBe('Bitte eine gültige Ingame-Startzeit angeben.');
    expect(dialogMock.open).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });

  it('should clear the error after a successful start', async () => {
    setStartTime('');
    await clickStart();
    setStartTime('2390-05-06T08:30');

    await clickStart();

    expect(readText('session-error')).toBe('');
    expect(readText('session-state')).toContain('Aktiv');
  });

  it('should end the session', async () => {
    await component.startSession();
    component.endSession();
    expect(service.meta().active).toBe(false);
  });

  it('should serialize the snapshot and download it on save', () => {
    const download: ReturnType<typeof vi.spyOn> = vi
      .spyOn(TestBed.inject(SessionFileService), 'download')
      .mockImplementation(() => undefined);
    component.saveSession();
    expect(download).toHaveBeenCalledWith(
      expect.stringContaining('<gameSession'),
      'game-session.xml',
    );
  });

  it('should restore a loaded session file', async () => {
    const xml: string = TestBed.inject(SessionXmlService).serialize(createSessionSnapshot());
    const input: HTMLInputElement = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [new File([xml], 'gruft.xml')] });

    await component.loadSession({ target: input } as unknown as Event);

    expect(service.meta().name).toBe('Gruft');
  });

  it('should show an error for an invalid session file', async () => {
    const input: HTMLInputElement = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [new File(['kein xml'], 'x.xml')] });

    await component.loadSession({ target: input } as unknown as Event);

    expect(readText('session-error')).toContain('Ungültige Session-Datei');
  });
});
