import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { readCardProperties } from './card-property-xml.util';

@Injectable({ providedIn: 'root' })
export class DeckXmlLoaderService {
  private readonly http: HttpClient = inject(HttpClient);

  async loadFromUrl(url: string): Promise<DeckConfig> {
    const xmlText: string = await firstValueFrom(this.http.get(url, { responseType: 'text' }));
    return this.parseXml(xmlText);
  }

  /** Attribute `type` (an `<deck>` und `<card>`) und `slot` (an `<card>`) älterer Decks werden ignoriert. */
  parseXml(xmlText: string): DeckConfig {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(xmlText, 'application/xml');
    const deckEl: Element | null = doc.querySelector('deck');
    if (!deckEl) throw new Error('Invalid deck XML: missing <deck> element');

    const backImagePath: string = deckEl.getAttribute('backImage') ?? '';
    const cards: Card[] = Array.from(deckEl.querySelectorAll('card')).map((el: Element) =>
      this.parseCard(el, backImagePath),
    );

    return {
      id: deckEl.getAttribute('id') ?? crypto.randomUUID(),
      name: deckEl.getAttribute('name') ?? '',
      backImagePath,
      cards,
    };
  }

  /** Eine karteneigene Rückseite ersetzt die des Decks. */
  private parseCard(el: Element, deckBack: string): Card {
    const id: string = el.getAttribute('id') ?? crypto.randomUUID();
    return {
      id,
      name: el.getAttribute('name') ?? '',
      imagePath: el.getAttribute('image') ?? '',
      backImagePath: el.getAttribute('backImage') ?? deckBack,
      description: el.querySelector('description')?.textContent?.trim() ?? '',
      properties: readCardProperties(el, id),
    };
  }
}
