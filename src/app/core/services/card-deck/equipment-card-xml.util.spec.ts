import { BaseCard, EquipmentCard } from '../../models/card.model';
import { RUNE_ARMOR } from '../../testing/deck.fixtures';
import { readEquipmentCard, writeEquipmentCard } from './equipment-card-xml.util';

describe('equipment card XML', () => {
  const base: BaseCard = { ...RUNE_ARMOR, cardType: 'equipment' };

  it('reads what it writes', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'card');
    const el: Element = doc.documentElement;
    writeEquipmentCard(el, RUNE_ARMOR);

    expect(el.getAttribute('slot')).toBe('body');
    expect(el.children).toHaveLength(2);
    const read: EquipmentCard | null = readEquipmentCard(el, base);
    expect(read).toEqual(RUNE_ARMOR);
  });

  it('ignores other child elements such as the description', () => {
    const el: Element = new DOMParser().parseFromString(
      '<card slot="hand"><description>x</description><modifier stat="defense" value="2"/></card>',
      'application/xml',
    ).documentElement;
    expect(readEquipmentCard(el, base)?.modifiers).toEqual([{ stat: 'defense', value: 2 }]);
  });
});
