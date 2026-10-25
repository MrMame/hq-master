/**
 * Scrollt die Elemente nacheinander nur so weit wie nötig ins Bild; sind sie schon sichtbar, bleibt
 * alles stehen. Mehrere Elemente, wenn ein Kind über sein Elternelement hinausragt.
 */
export function scrollIntoViewIfNeeded(...elements: Element[]): void {
  for (const element of elements) {
    element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}
