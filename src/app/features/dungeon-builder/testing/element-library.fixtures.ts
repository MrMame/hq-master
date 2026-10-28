/** Bibliothekseintrag mit genau diesem barrierefreien Namen (nur für Specs). */
export function libraryButton(host: HTMLElement, label: string): HTMLButtonElement {
  const found: HTMLButtonElement | undefined = Array.from(
    host.querySelectorAll<HTMLButtonElement>('button'),
  ).find((b) => b.getAttribute('aria-label') === label);
  if (!found) throw new Error(`Eintrag "${label}" nicht gefunden`);
  return found;
}

/** Überschriften der angezeigten Gruppen, z. B. „Möbel (2)“ (nur für Specs). */
export function sectionHeadings(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('h3 button')).map((b) => b.textContent?.trim() ?? '');
}
