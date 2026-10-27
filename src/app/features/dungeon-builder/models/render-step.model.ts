import { Rotation } from './rotation.model';

/**
 * Lage einer Grafik: erst verschieben (`translate`), dann drehen, dann das Bild in `x, y, width,
 * height` zeichnen. Gilt gleich für SVG (`transform`) und Canvas (`translate`/`rotate`/`drawImage`).
 */
export interface ImagePlacement {
  translateX: number;
  translateY: number;
  rotation: Rotation;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Rechteck in Einheiten bzw. Kacheln. */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Ein Zeichenschritt in Einheiten (`tile` je Kachel); `key` hält DOM-Elemente auf dem Plan stabil. */
export type RenderStep =
  | ({ kind: 'rect'; key: string; color: string } & Bounds)
  | { kind: 'image'; key: string; src: string; placement: ImagePlacement }
  | {
      kind: 'line';
      key: string;
      color: string;
      width: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  /** Element ohne Katalogeintrag: graue Fläche mit Fragezeichen. */
  | ({ kind: 'unknown'; key: string } & Bounds);
