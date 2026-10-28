import { Point } from '../models/point.model';
import { Size } from '../models/size.model';
import { clamp, ORIGIN_LIMITS, roundTo } from './grid-step.util';

/**
 * Nullpunkt nach dem Ziehen des Markers: die Zugstrecke in Bildschirm-Pixeln wird durch den Maßstab
 * in Einheiten umgerechnet. Der Marker bleibt auf der Spielfläche und in `ORIGIN_LIMITS`; gerundet
 * wird auf eine Nachkommastelle.
 */
export function draggedOrigin(start: Point, distance: Point, scale: number, stage: Size): Point {
  const axis: (from: number, pixels: number, length: number) => number = (
    from: number,
    pixels: number,
    length: number,
  ): number => {
    const limits: { min: number; max: number } = {
      min: Math.max(0, ORIGIN_LIMITS.min),
      max: Math.min(length, ORIGIN_LIMITS.max),
    };
    return roundTo(clamp(from + pixels / scale, limits), 1);
  };
  return { x: axis(start.x, distance.x, stage.width), y: axis(start.y, distance.y, stage.height) };
}

/**
 * Feld (Spalte bzw. Zeile) unter der Porträtmitte, gezählt ab dem Nullpunkt: links bzw. oberhalb
 * davon negativ. Eine Mitte links bzw. oberhalb der Spielfläche zählt als ihr Rand, damit kein
 * Token dort außerhalb des Fotos landet.
 */
export function fieldAt(portraitCenter: number, gridOffset: number, cellSize: number): number {
  return Math.floor((Math.max(0, portraitCenter) - gridOffset) / cellSize);
}
