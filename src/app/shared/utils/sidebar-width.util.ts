/** Schmaler als das wird die Seitenleiste nie, auch nicht beim Ziehen. */
export const SIDEBAR_MIN_WIDTH: number = 200;

/** Ab dieser waagerechten Zeigerstrecke (px) gilt die Geste am Griff als Ziehen statt als Klick. */
export const SIDEBAR_DRAG_THRESHOLD: number = 4;

/** Höchstbreite: die Hälfte des Fensters, aber nie unter der Mindestbreite. */
export function maxSidebarWidth(viewportWidth: number): number {
  return Math.max(SIDEBAR_MIN_WIDTH, viewportWidth / 2);
}

/** Begrenzt eine Breite auf `SIDEBAR_MIN_WIDTH` … `maxSidebarWidth(viewportWidth)`. */
export function clampSidebarWidth(width: number, viewportWidth: number): number {
  return Math.min(Math.max(width, SIDEBAR_MIN_WIDTH), maxSidebarWidth(viewportWidth));
}

/** `true`, sobald sich der Zeiger mindestens die Schwelle waagerecht bewegt hat. */
export function isResizeDrag(deltaX: number): boolean {
  return Math.abs(deltaX) >= SIDEBAR_DRAG_THRESHOLD;
}
