/** Breite und Höhe in Pixeln bzw. Einheiten. */
export interface Extent {
  width: number;
  height: number;
}

/**
 * Maßstab des Plans: Bei Zoom 1 passt der ganze Plan in den sichtbaren Bereich. Solange der Bereich
 * noch nicht gemessen ist, gilt der Zoom allein.
 */
export function planScale(viewport: Extent, plan: Extent, zoom: number): number {
  const fit: number = Math.min(viewport.width / plan.width, viewport.height / plan.height);
  return fit > 0 && Number.isFinite(fit) ? fit * zoom : zoom;
}
