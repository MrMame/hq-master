/**
 * Anzahl der Exemplare einer `<card>` aus ihrem Attribut `count`: eine ganze Zahl ≥ 1. Fehlt es, gilt 1; jeder
 * andere Wert (z. B. `0`, `-1`, `2.5`, `drei`) gilt ebenfalls als 1 und erzeugt eine Konsolenwarnung mit Karten-ID.
 */
export function cardCount(raw: string | null, cardId: string): number {
  if (raw === null) return 1;
  const value: string = raw.trim();
  if (/^\d+$/.test(value) && Number(value) >= 1) return Number(value);
  console.warn(`Karte „${cardId}“: ungültiges count="${raw}", es gilt 1.`);
  return 1;
}
