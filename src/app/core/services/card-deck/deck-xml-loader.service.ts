import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseCard, Card, CardType, EquipmentCard, toCardType } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { readEquipmentCard } from './equipment-card-xml.util';

@Injectable({ providedIn: 'root' })
export class DeckXmlLoaderService {
  private readonly http: HttpClient = inject(HttpClient);

  async loadFromUrl(url: string): Promise<DeckConfig> {
    const xmlText: string = await firstValueFrom(this.http.get(url, { responseType: 'text' }));
    return this.parseXml(xmlText);
  }

  parseXml(xmlText: string): DeckConfig {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(xmlText, 'application/xml');
    const deckEl: Element | null = doc.querySelector('deck');
    if (!deckEl) throw new Error('Invalid deck XML: missing <deck> element');

    const defaultCardType: CardType = toCardType(deckEl.getAttribute('type'));
    const backImagePath: string = deckEl.getAttribute('backImage') ?? '';
    const cards: Card[] = Array.from(deckEl.querySelectorAll('card')).map((el: Element) =>
      this.parseCard(el, defaultCardType, backImagePath),
    );

    return {
      id: deckEl.getAttribute('id') ?? crypto.randomUUID(),
      name: deckEl.getAttribute('name') ?? '',
      backImagePath,
      defaultCardType,
      cards,
    };
  }

  /** Eine karteneigene Rückseite ersetzt die des Decks; `combat` und Unbekanntes laden als `basic`. */
  private parseCard(el: Element, defaultCardType: CardType, deckBack: string): Card {
    const cardType: CardType = toCardType(el.getAttribute('type') ?? defaultCardType);
    const base: BaseCard = {
      id: el.getAttribute('id') ?? crypto.randomUUID(),
      name: el.getAttribute('name') ?? '',
      imagePath: el.getAttribute('image') ?? '',
      backImagePath: el.getAttribute('backImage') ?? deckBack,
      description: el.querySelector('description')?.textContent?.trim() ?? '',
      cardType,
    };

    if (cardType === 'equipment') {
      const equipment: EquipmentCard | null = readEquipmentCard(el, base);
      if (equipment) return equipment;
      console.warn(
        `Ausrüstungskarte „${base.name}“ ist ungültig und wird als einfache Karte geladen.`,
      );
    }

    return { ...base, cardType: 'basic' };
  }
}
