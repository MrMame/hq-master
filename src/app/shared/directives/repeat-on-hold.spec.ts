import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatOnHold } from './repeat-on-hold';

@Component({
  imports: [RepeatOnHold],
  template: `
    <button
      type="button"
      appRepeatOnHold
      [disabled]="disabled()"
      (stepRequested)="steps = steps + 1"
    >
      +
    </button>
  `,
})
class StepButtonHost {
  steps: number = 0;
  readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
}

describe('RepeatOnHold', () => {
  let fixture: ComponentFixture<StepButtonHost>;
  let button: HTMLButtonElement;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(StepButtonHost);
    fixture.detectChanges();
    button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  });

  afterEach(() => vi.useRealTimers());

  const steps: () => number = (): number => fixture.componentInstance.steps;
  const pointer: (type: string, pressed?: number) => void = (
    type: string,
    pressed: number = 0,
  ): void => {
    button.dispatchEvent(new PointerEvent(type, { button: pressed }));
  };

  it('steps once at once for a short press', () => {
    pointer('pointerdown');
    expect(steps()).toBe(1);

    pointer('pointerup');
    vi.advanceTimersByTime(2000);
    expect(steps()).toBe(1);
  });

  it('repeats after the delay and then every 80 ms while held', () => {
    pointer('pointerdown');
    vi.advanceTimersByTime(399);
    expect(steps()).toBe(1);

    vi.advanceTimersByTime(1);
    expect(steps()).toBe(2);

    vi.advanceTimersByTime(160);
    expect(steps()).toBe(4);
  });

  it.each<string>(['pointerup', 'pointerleave', 'pointercancel'])(
    'stops repeating on %s',
    (type) => {
      pointer('pointerdown');
      vi.advanceTimersByTime(480);
      expect(steps()).toBe(3);

      pointer(type);
      vi.advanceTimersByTime(1000);
      expect(steps()).toBe(3);
    },
  );

  it('stops repeating once the button is disabled, e.g. at the end of the range', () => {
    pointer('pointerdown');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    vi.advanceTimersByTime(1000);
    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);

    expect(steps()).toBe(1);
  });

  it('ignores the secondary mouse button', () => {
    pointer('pointerdown', 2);
    vi.advanceTimersByTime(1000);
    expect(steps()).toBe(0);
  });

  it('steps once for a click from the keyboard, but not again for the click after a press', () => {
    button.dispatchEvent(new MouseEvent('click', { detail: 0 }));
    expect(steps()).toBe(1);

    pointer('pointerdown');
    pointer('pointerup');
    button.dispatchEvent(new MouseEvent('click', { detail: 1 }));
    expect(steps()).toBe(2);
  });

  it('stops repeating when destroyed', () => {
    pointer('pointerdown');
    fixture.destroy();
    vi.advanceTimersByTime(1000);
    expect(steps()).toBe(1);
  });
});
