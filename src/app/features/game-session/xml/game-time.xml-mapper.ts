import { textOf } from './xml.util';

export function writeGameTime(doc: XMLDocument, gameTime: Date): Element {
  const el: Element = doc.createElement('gameTime');
  el.textContent = gameTime.toISOString();
  return el;
}

export function readGameTime(el: Element): Date {
  const gameTime: Date = new Date(textOf(el).trim());
  if (isNaN(gameTime.getTime())) {
    throw new Error('Ungültige Session-Datei: <gameTime> enthält kein gültiges Datum.');
  }
  return gameTime;
}
