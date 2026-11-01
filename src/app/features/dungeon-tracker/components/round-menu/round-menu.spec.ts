import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundMenu } from './round-menu';
import { RoundService } from '../../../../shared/services/round.service';

describe('RoundMenu', () => {
  let fixture: ComponentFixture<RoundMenu>;
  const startNewRound: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    startNewRound.mockReset();
    TestBed.configureTestingModule({
      imports: [RoundMenu],
      providers: [{ provide: RoundService, useValue: { startNewRound } }],
    });
    fixture = TestBed.createComponent(RoundMenu);
    await fixture.whenStable();
  });

  const toggleButton: () => HTMLButtonElement = () =>
    (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  // Das Flyout hängt im Overlay-Container am Dokument, nicht im Host.
  const newRoundButton: () => HTMLButtonElement | null = () =>
    document.querySelector<HTMLButtonElement>('.round-menu__action');

  const act: (action: () => void) => Promise<void> = async (action) => {
    action();
    await fixture.whenStable();
  };

  it('starts closed with the toggle "Runden-Menü" not pressed', () => {
    expect(toggleButton().getAttribute('aria-label')).toBe('Runden-Menü');
    expect(toggleButton().getAttribute('aria-pressed')).toBe('false');
    expect(newRoundButton()).toBeNull();
  });

  it('opens the flyout with "Neue Runde" on a click and closes it on a second click', async () => {
    await act(() => toggleButton().click());
    expect(toggleButton().getAttribute('aria-pressed')).toBe('true');
    expect(newRoundButton()?.textContent?.trim()).toBe('Neue Runde');

    await act(() => toggleButton().click());
    expect(toggleButton().getAttribute('aria-pressed')).toBe('false');
    expect(newRoundButton()).toBeNull();
  });

  it('starts a new round and stays open', async () => {
    await act(() => toggleButton().click());
    await act(() => newRoundButton()?.click());

    expect(startNewRound).toHaveBeenCalledOnce();
    expect(newRoundButton()).not.toBeNull();
  });

  it('closes on a click outside', async () => {
    await act(() => toggleButton().click());
    await act(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      document.body.click();
    });

    expect(newRoundButton()).toBeNull();
    expect(toggleButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('closes on Escape', async () => {
    await act(() => toggleButton().click());
    await act(() =>
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }),
      ),
    );

    expect(newRoundButton()).toBeNull();
    expect(toggleButton().getAttribute('aria-pressed')).toBe('false');
  });
});
