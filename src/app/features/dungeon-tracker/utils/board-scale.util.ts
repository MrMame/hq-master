import { Size } from '../models/size.model';

/** Breite der Spielfläche in Einheiten; Raster und Tokens rechnen in diesen Einheiten. */
export const STAGE_WIDTH: number = 1000;

/** Seitenverhältnis (Breite / Höhe) der Spielfläche, solange kein Foto geladen ist. */
const DEFAULT_ASPECT_RATIO: number = 4 / 3;

/** Spielfläche: immer `STAGE_WIDTH` breit, die Höhe folgt dem Seitenverhältnis des Fotos. */
export function stageSize(photo: Size | null): Size {
  const aspectRatio: number =
    photo && photo.width > 0 && photo.height > 0
      ? photo.width / photo.height
      : DEFAULT_ASPECT_RATIO;
  return { width: STAGE_WIDTH, height: STAGE_WIDTH / aspectRatio };
}

/** Maßstab, mit dem die ganze Spielfläche in den Spielbrettbereich passt (wie `object-fit: contain`). */
export function fitScale(board: Size, stage: Size): number {
  return Math.min(board.width / stage.width, board.height / stage.height);
}
