import { Directive, ElementRef, inject, output, OutputEmitterRef } from '@angular/core';

/** Ab dieser Zeigerstrecke (px) gilt die Geste als Verschieben und nicht mehr als Klick. */
const PAN_THRESHOLD_PX: number = 3;

interface PanStart {
  pointerX: number;
  pointerY: number;
  scrollLeft: number;
  scrollTop: number;
}

/**
 * Verschiebt den Ausschnitt eines Scroll-Containers per Ziehen mit Maus, Finger oder Stift.
 * Gezogene Elemente (`.cdk-drag`, z. B. Tokens) und die Bildlaufleisten selbst starten kein Verschieben.
 */
@Directive({
  selector: '[appBoardPan]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'endPan()',
    '(pointercancel)': 'endPan()',
    '(click)': 'onClick()',
  },
})
export class BoardPan {
  private readonly viewport: HTMLElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Klick auf eine freie Stelle, ohne dass dabei verschoben wurde. */
  readonly clickWithoutPan: OutputEmitterRef<void> = output<void>();

  private panStart: PanStart | null = null;
  private panned: boolean = false;

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 || this.startsOnDraggable(event) || this.startsOnScrollbar(event)) {
      return;
    }
    this.panStart = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      scrollLeft: this.viewport.scrollLeft,
      scrollTop: this.viewport.scrollTop,
    };
    this.panned = false;
    this.viewport.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.panStart) return;
    const deltaX: number = event.clientX - this.panStart.pointerX;
    const deltaY: number = event.clientY - this.panStart.pointerY;
    if (Math.hypot(deltaX, deltaY) > PAN_THRESHOLD_PX) this.panned = true;
    this.viewport.scrollLeft = this.panStart.scrollLeft - deltaX;
    this.viewport.scrollTop = this.panStart.scrollTop - deltaY;
  }

  endPan(): void {
    this.panStart = null;
  }

  /** Der Klick folgt auf `pointerup`; nach einem Verschieben wird er verschluckt. */
  onClick(): void {
    if (!this.panned) this.clickWithoutPan.emit();
    this.panned = false;
  }

  private startsOnDraggable(event: PointerEvent): boolean {
    return (event.target as Element).closest('.cdk-drag') !== null;
  }

  /** Ein Druck auf die Bildlaufleiste liegt außerhalb der Client-Fläche des Containers. */
  private startsOnScrollbar(event: PointerEvent): boolean {
    const bounds: DOMRect = this.viewport.getBoundingClientRect();
    return (
      event.clientX - bounds.left >= this.viewport.clientWidth ||
      event.clientY - bounds.top >= this.viewport.clientHeight
    );
  }
}
