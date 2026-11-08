/** `true`, wenn der Browser reduzierte Bewegung wünscht; ohne `matchMedia` (z. B. jsdom) `false`. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Scrollt einen auf-/zuklappbaren Abschnitt (`app-sidebar-section`) mit seiner Kopfzeile nach oben ins Bild und
 * fokussiert die Überschrift. Bei reduzierter Bewegung ohne Animation. Ohne Element passiert nichts.
 */
export function revealSection(
  section: Element | null,
  reducedMotion: boolean = prefersReducedMotion(),
): void {
  if (!section) return;
  section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  section.querySelector<HTMLElement>('.sidebar-section__toggle')?.focus({ preventScroll: true });
}
