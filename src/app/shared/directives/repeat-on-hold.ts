import { DestroyRef, Directive, ElementRef, inject, output, OutputEmitterRef } from '@angular/core';

/** Wartezeit bis zur ersten Wiederholung (ms). */
const REPEAT_DELAY_MS: number = 400;
/** Abstand der weiteren Wiederholungen (ms). */
const REPEAT_INTERVAL_MS: number = 80;

/**
 * Schritt-Button, der beim Gedrückthalten wiederholt: Ein Druck mit Maus, Finger oder Stift löst
 * sofort einen Schritt aus, nach `REPEAT_DELAY_MS` folgen weitere alle `REPEAT_INTERVAL_MS`.
 * Loslassen, Verlassen des Buttons und `pointercancel` beenden die Wiederholung, ebenso ein
 * deaktivierter Button (z. B. am Bereichsende). Per Tastatur löst der Button genau einen Schritt aus.
 */
@Directive({
  selector: 'button[appRepeatOnHold]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerup)': 'stop()',
    '(pointerleave)': 'stop()',
    '(pointercancel)': 'stop()',
    '(click)': 'onClick($event)',
  },
})
export class RepeatOnHold {
  private readonly button: HTMLButtonElement =
    inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  /** Ein Schritt ist fällig. */
  readonly stepRequested: OutputEmitterRef<void> = output<void>();

  private delay: ReturnType<typeof setTimeout> | undefined;
  private interval: ReturnType<typeof setInterval> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.stop();
    this.stepRequested.emit();
    this.delay = setTimeout(() => {
      this.repeat();
      this.interval = setInterval(() => this.repeat(), REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  }

  stop(): void {
    clearTimeout(this.delay);
    clearInterval(this.interval);
  }

  /** Nach einem Zeiger-Druck kam der Schritt schon; nur ein Tastatur-Klick (`detail` 0) zählt. */
  onClick(event: MouseEvent): void {
    if (event.detail === 0) this.stepRequested.emit();
  }

  private repeat(): void {
    if (this.button.disabled) {
      this.stop();
      return;
    }
    this.stepRequested.emit();
  }
}
