type AttributeValue = string | number | boolean | null;

/** Setzt alle Attribute; `null`-Werte werden ausgelassen. */
export function setAttributes(el: Element, attributes: Record<string, AttributeValue>): void {
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== null) el.setAttribute(name, String(value));
  }
}

export function appendElement(parent: Element, name: string): Element {
  const el: Element = parent.ownerDocument.createElement(name);
  parent.appendChild(el);
  return el;
}

export function appendTextElement(parent: Element, name: string, text: string): Element {
  const el: Element = appendElement(parent, name);
  el.textContent = text;
  return el;
}

/** Direkte Kind-Elemente mit dem Namen (keine tieferen Nachfahren). */
export function childElements(parent: Element, name: string): Element[] {
  return Array.from(parent.children).filter((child) => child.tagName === name);
}

export function firstChild(parent: Element, name: string): Element | null {
  return childElements(parent, name)[0] ?? null;
}

export function requireChild(parent: Element, name: string): Element {
  const child: Element | null = firstChild(parent, name);
  if (!child) {
    throw new Error(`Ungültige Session-Datei: <${name}> fehlt in <${parent.tagName}>.`);
  }
  return child;
}

export function readString(el: Element, name: string, fallback: string = ''): string {
  return el.getAttribute(name) ?? fallback;
}

export function readNumber(el: Element, name: string, fallback: number = 0): number {
  const raw: string | null = el.getAttribute(name);
  const value: number = raw === null ? NaN : Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export function readBoolean(el: Element, name: string): boolean {
  return el.getAttribute(name) === 'true';
}

export function textOf(el: Element | null): string {
  return el?.textContent ?? '';
}

/** Fügt Zeilenumbrüche und Einrückung ein, damit die Datei von Hand lesbar bleibt. */
export function indentXml(el: Element, depth: number = 0): void {
  const children: Element[] = Array.from(el.children);
  if (children.length === 0) return;
  const doc: Document = el.ownerDocument;
  for (const child of children) {
    el.insertBefore(doc.createTextNode(`\n${'  '.repeat(depth + 1)}`), child);
    indentXml(child, depth + 1);
  }
  el.appendChild(doc.createTextNode(`\n${'  '.repeat(depth)}`));
}
