import { CardProperty } from '../../models/card-property.model';

/** Ganze Zahl mit optionalem Vorzeichen, z. B. `+30`, `-1`, `2`. */
const INTEGER: RegExp = /^[+-]?\d+$/;

/** Eigenschaft aus Name und Wert; leerer Name oder kein Integer → `null`. Der Name wird an den Rändern getrimmt. */
export function toCardProperty(name: unknown, value: unknown): CardProperty | null {
  const trimmed: string = typeof name === 'string' ? name.trim() : '';
  const text: string =
    typeof value === 'number' || typeof value === 'string' ? String(value).trim() : '';
  return trimmed !== '' && INTEGER.test(text) ? { name: trimmed, value: Number(text) } : null;
}

function warnInvalid(cardId: string): void {
  console.warn(
    `Karte „${cardId}“: ungültige <property> (leerer Name oder kein Integer) wird ignoriert.`,
  );
}

/** Gültige Eigenschaften; ungültige Einträge fehlen, je Eintrag mit Konsolenwarnung inkl. Karten-ID. */
function validProperties(entries: readonly [unknown, unknown][], cardId: string): CardProperty[] {
  return entries.flatMap(([name, value]) => {
    const property: CardProperty | null = toCardProperty(name, value);
    if (!property) warnInvalid(cardId);
    return property ? [property] : [];
  });
}

/**
 * Liest die `<property name="…" value="…"/>`-Kinder einer `<card>` (Deck-XML und Spielstand). Ungültige
 * Einträge fehlen; `<modifier>` wird nicht mehr gelesen.
 */
export function readCardProperties(el: Element, cardId: string): CardProperty[] {
  const entries: [unknown, unknown][] = Array.from(el.children)
    .filter((child) => child.tagName === 'property')
    .map((child) => [child.getAttribute('name'), child.getAttribute('value')]);
  return validProperties(entries, cardId);
}

/** Gespeicherte Eigenschaften einer Karte aus der Browser-Session; fehlt die Liste, ist sie leer. */
export function readStoredProperties(stored: unknown, cardId: string): CardProperty[] {
  if (!Array.isArray(stored)) return [];
  const entries: [unknown, unknown][] = stored.map((entry: unknown) => {
    const record: Record<string, unknown> =
      typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {};
    return [record['name'], record['value']];
  });
  return validProperties(entries, cardId);
}

/** Schreibt die Eigenschaften in dasselbe Format, das `readCardProperties` liest (`value` mit Vorzeichen). */
export function writeCardProperties(el: Element, properties: readonly CardProperty[]): void {
  properties.forEach(({ name, value }) => {
    const child: Element = el.ownerDocument.createElement('property');
    child.setAttribute('name', name);
    child.setAttribute('value', value < 0 ? String(value) : `+${value}`);
    el.appendChild(child);
  });
}
