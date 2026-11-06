import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseCard, Card, CardType, EquipmentCard } from '../../models/card.model';
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

    const defaultCardType: CardType = (deckEl.getAttribute('type') ?? 'basic') as CardType;
    const cards: Card[] = Array.from(deckEl.querySelectorAll('card')).map((el: Element) =>
      this.parseCard(el, defaultCardType),
    );

    return {
      id: deckEl.getAttribute('id') ?? crypto.randomUUID(),
      name: deckEl.getAttribute('name') ?? '',
      backImagePath: deckEl.getAttribute('backImage') ?? '',
      defaultCardType,
      cards,
    };
  }

  private parseCard(el: Element, defaultCardType: CardType): Card {
    const cardType: CardType = (el.getAttribute('type') ?? defaultCardType) as CardType;
    const base: BaseCard = {
      id: el.getAttribute('id') ?? crypto.randomUUID(),
      name: el.getAttribute('name') ?? '',
      imagePath: el.getAttribute('image') ?? '',
      description: el.querySelector('description')?.textContent?.trim() ?? '',
      cardType,
    };

    if (cardType === 'combat') {
      return {
        ...base,
        cardType: 'combat',
        attack: Number(el.querySelector('attack')?.textContent ?? 0),
        defense: Number(el.querySelector('defense')?.textContent ?? 0),
      };
    }

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
