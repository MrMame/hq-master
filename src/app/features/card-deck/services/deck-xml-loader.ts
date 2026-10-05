import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';
import { DeckConfig } from '../models/deck-config.model';

@Injectable({ providedIn: 'root' })
export class DeckXmlLoaderService {
  async loadFromUrl(url: string): Promise<DeckConfig> {
    const response: Response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load deck: ${url}`);
    const text: string = await response.text();
    return this.parseXml(text);
  }

  parseXml(xmlText: string): DeckConfig {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(xmlText, 'application/xml');

    const parseError: Element | null = doc.querySelector('parsererror');
    if (parseError) throw new Error('Invalid XML: ' + parseError.textContent);

    const deckEl: Element | null = doc.querySelector('deck');
    if (!deckEl) throw new Error('Missing <deck> element in XML');

    const name: string = deckEl.getAttribute('name') ?? 'Unknown Deck';
    const backImagePath: string = deckEl.getAttribute('backImage') ?? '';

    const cards: Card[] = Array.from(doc.querySelectorAll('card')).map(
      (cardEl: Element): Card => ({
        id: cardEl.getAttribute('id') ?? crypto.randomUUID(),
        name: cardEl.getAttribute('name') ?? '',
        imagePath: cardEl.getAttribute('image') ?? '',
        description: cardEl.querySelector('description')?.textContent?.trim() ?? '',
      })
    );

    return { name, backImagePath, cards };
  }
}
