import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { readCardProperties } from './card-property-xml.util';
import { cardCount } from './card-count.util';
import { duplicateIds, withUniqueCardIds } from './card-id.util';

@Injectable({ providedIn: 'root' })
export class DeckXmlLoaderService {
  private readonly http: HttpClient = inject(HttpClient);

  async loadFromUrl(url: string): Promise<DeckConfig> {
    const xmlText: string = await firstValueFrom(this.http.get(url, { responseType: 'text' }));
    return this.parseXml(xmlText);
  }

  /**
   * Eine `<card>` mit `count="n"` ergibt n Exemplare. Jede Karte erhält eine eindeutige ID (`id`, `id-2`, …);
   * doppelte IDs in der XML erzeugen eine Konsolenwarnung. Attribute `type` (an `<deck>` und `<card>`) und
   * `slot` (an `<card>`) älterer Decks werden ignoriert.
   */
  parseXml(xmlText: string): DeckConfig {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(xmlText, 'application/xml');
    const deckEl: Element | null = doc.querySelector('deck');
    if (!deckEl) throw new Error('Invalid deck XML: missing <deck> element');

    const id: string = deckEl.getAttribute('id') ?? crypto.randomUUID();
    const backImagePath: string = deckEl.getAttribute('backImage') ?? '';
    const parsed: Card[][] = Array.from(deckEl.querySelectorAll('card')).map((el: Element) =>
      this.parseCopies(el, backImagePath),
    );
    this.warnDuplicates(
      id,
      parsed.map(([card]) => card.id),
    );

    return {
      id,
      name: deckEl.getAttribute('name') ?? '',
      backImagePath,
      cards: withUniqueCardIds(parsed.flat()),
    };
  }

  private parseCopies(el: Element, deckBack: string): Card[] {
    const card: Card = this.parseCard(el, deckBack);
    return Array.from({ length: cardCount(el.getAttribute('count'), card.id) }, () => ({
      ...card,
    }));
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

  private warnDuplicates(deckId: string, ids: string[]): void {
    const duplicates: string[] = duplicateIds(ids);
    if (duplicates.length === 0) return;
    console.warn(
      `Deck „${deckId}“: doppelte Karten-IDs ${duplicates.join(', ')} – weitere Exemplare erhalten ein Suffix (-2, -3, …).`,
    );
  }
}
