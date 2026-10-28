import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { Point } from '../../models/point.model';
import { Size } from '../../models/size.model';
import { draggedOrigin } from '../../utils/grid-origin.util';

/** Wo das Ziehen begann: Zeiger in Bildschirm-Pixeln, Nullpunkt in Einheiten. */
interface DragStart {
  pointer: Point;
  origin: Point;
}

/**
 * Ziehbarer Marker am Nullpunkt des Rasters (Modus „Nullpunkt verschieben“). Er behält bei jedem
 * Zoom dieselbe Bildschirmgröße. Beim Ziehen meldet er die Vorschau, beim Loslassen den neuen
 * Nullpunkt, beide umgerechnet, begrenzt und gerundet; speichern muss das Spielbrett.
 * Druck und Klick erreichen das Spielbrett nicht: kein Verschieben des Ausschnitts, keine
 * aufgehobene Markierung.
 */
@Component({
  selector: 'app-grid-origin-marker',
  templateUrl: './grid-origin-marker.html',
  styleUrl: './grid-origin-marker.css',
  host: {
    '[style.left.px]': 'origin().x',
    '[style.top.px]': 'origin().y',
    '[style.transform]': 'transform()',
  },
})
export class GridOriginMarker {
  /** Nullpunkt in Einheiten der Spielfläche. */
  readonly origin: InputSignal<Point> = input.required<Point>();
  /** Maßstab der Spielfläche: Bildschirm-Pixel je Einheit. */
  readonly scale: InputSignal<number> = input.required<number>();
  readonly stage: InputSignal<Size> = input.required<Size>();

  /** Nullpunkt während des Ziehens; `null`, wenn das Ziehen abgebrochen wurde. */
  readonly originPreview: OutputEmitterRef<Point | null> = output<Point | null>();
  /** Nullpunkt beim Loslassen. */
  readonly originMoved: OutputEmitterRef<Point> = output<Point>();

  /** Hebt den Maßstab der Spielfläche auf, damit der Marker auf dem Bildschirm gleich groß bleibt. */
  protected readonly transform: Signal<string> = computed(
    () => `scale(${this.scale() > 0 ? 1 / this.scale() : 1})`,
  );

  private dragStart: DragStart | null = null;

  protected onPointerDown(event: PointerEvent): void {
    event.stopPropagation();
    if (event.button !== 0) return;
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
    this.dragStart = { pointer: { x: event.clientX, y: event.clientY }, origin: this.origin() };
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.dragStart) this.originPreview.emit(this.originAt(this.dragStart, event));
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragStart) return;
    const origin: Point = this.originAt(this.dragStart, event);
    this.dragStart = null;
    this.originMoved.emit(origin);
  }

  protected onPointerCancel(): void {
    if (!this.dragStart) return;
    this.dragStart = null;
    this.originPreview.emit(null);
  }

  private originAt(start: DragStart, event: PointerEvent): Point {
    const distance: Point = {
      x: event.clientX - start.pointer.x,
      y: event.clientY - start.pointer.y,
    };
    return draggedOrigin(start.origin, distance, this.scale(), this.stage());
  }
}
