import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { isResizeDrag } from '../utils/sidebar-width.util';

/** Klasse am `<html>` während des Ziehens: Zeiger überall `col-resize`, keine Textmarkierung. */
export const SIDEBAR_RESIZING_CLASS: string = 'sidebar-resizing';

interface ResizeStart {
  pointerX: number;
  width: number;
}

/**
 * Macht einen Griff zugleich zum Ziehgriff für die Breite eines Elements (Maus, Finger, Stift).
 * Unter der Bewegungsschwelle bleibt es ein Klick (`activate`); nach einem Ziehen wird der Klick verschluckt.
 * Begrenzen und Speichern der Breite übernimmt der Verwender.
 */
@Directive({
  selector: '[appSidebarResize]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerCancel()',
    '(click)': 'onClick($event)',
  },
})
export class SidebarResize {
  private readonly handle: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Element, dessen Breite gezogen wird (liefert die Startbreite). */
  readonly resizeTarget: InputSignal<HTMLElement> = input.required<HTMLElement>({
    alias: 'appSidebarResize',
  });
  /** Ohne Freigabe (z. B. eingeklappt) ist der Griff nur ein Knopf. */
  readonly resizeEnabled: InputSignal<boolean> = input<boolean>(true);

  /** Ungebremste Breite während des Ziehens, bei jeder Bewegung. */
  readonly widthChange: OutputEmitterRef<number> = output<number>();
  /** Breite beim Loslassen nach einem Ziehen. */
  readonly widthCommit: OutputEmitterRef<number> = output<number>();
  /** Klick oder Enter/Leertaste ohne Ziehen. */
  readonly activate: OutputEmitterRef<void> = output<void>();

  private start: ResizeStart | null = null;
  private lastWidth: number = 0;
  private dragging: boolean = false;
  private swallowClick: boolean = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.setResizingClass(false));
  }

  onPointerDown(event: PointerEvent): void {
    this.swallowClick = false;
    if (!this.resizeEnabled() || event.button !== 0) return;
    const width: number = this.resizeTarget().getBoundingClientRect().width;
    this.start = { pointerX: event.clientX, width };
    this.lastWidth = width;
    this.dragging = false;
    this.handle.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.start) return;
    const deltaX: number = event.clientX - this.start.pointerX;
    if (!this.dragging && !isResizeDrag(deltaX)) return;
    if (!this.dragging) this.beginDrag();
    this.lastWidth = this.start.width + deltaX;
    this.widthChange.emit(this.lastWidth);
  }

  onPointerUp(event: PointerEvent): void {
    if (this.start && this.dragging) {
      this.lastWidth = this.start.width + event.clientX - this.start.pointerX;
    }
    this.finish();
  }

  onPointerCancel(): void {
    this.finish();
  }

  /** Tastatur-Klicks (`detail === 0`) zählen immer, auch direkt nach einem Ziehen. */
  onClick(event: MouseEvent): void {
    const swallow: boolean = this.swallowClick && event.detail !== 0;
    this.swallowClick = false;
    if (!swallow) this.activate.emit();
  }

  private beginDrag(): void {
    this.dragging = true;
    this.setResizingClass(true);
  }

  private finish(): void {
    if (this.dragging) {
      this.widthCommit.emit(this.lastWidth);
      this.swallowClick = true;
      this.setResizingClass(false);
    }
    this.start = null;
    this.dragging = false;
  }

  private setResizingClass(active: boolean): void {
    this.handle.ownerDocument.documentElement.classList.toggle(SIDEBAR_RESIZING_CLASS, active);
  }
}
