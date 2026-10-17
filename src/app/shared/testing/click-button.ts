/** Klickt den Button mit genau dieser Beschriftung (nur für Specs). */
export function clickButton(host: HTMLElement, label: string): void {
  const button: HTMLButtonElement | undefined = Array.from(host.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === label,
  );
  if (!button) throw new Error(`Button "${label}" nicht gefunden`);
  button.click();
}
