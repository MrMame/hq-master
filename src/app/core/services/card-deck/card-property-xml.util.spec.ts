import { MockInstance } from 'vitest';
import { CardProperty } from '../../models/card-property.model';
import {
  readCardProperties,
  readStoredProperties,
  toCardProperty,
  writeCardProperties,
} from './card-property-xml.util';

function card(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('card-property-xml.util', () => {
  let warn: MockInstance<(...data: unknown[]) => void>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it.each<[unknown, unknown, CardProperty | null]>([
    ['Leben', '+30', { name: 'Leben', value: 30 }],
    ['Abwehr', '-1', { name: 'Abwehr', value: -1 }],
    ['  Angriff ', ' 2 ', { name: 'Angriff', value: 2 }],
    ['Tempo', 3, { name: 'Tempo', value: 3 }],
    ['', '1', null],
    ['Tempo', '1.5', null],
    ['Tempo', '+', null],
    ['Tempo', null, null],
    [7, '1', null],
  ])('turns name %j and value %j into %j', (name, value, expected) => {
    expect(toCardProperty(name, value)).toEqual(expected);
  });

  it('reads what it writes, with the sign in front of positive values', () => {
    const properties: CardProperty[] = [
      { name: 'Leben', value: 30 },
      { name: 'Abwehr', value: -1 },
      { name: 'Angriff', value: 0 },
    ];
    const el: Element = card('<card/>');
    writeCardProperties(el, properties);

    expect(Array.from(el.children, (child) => child.getAttribute('value'))).toEqual([
      '+30',
      '-1',
      '+0',
    ]);
    expect(readCardProperties(el, 'c1')).toEqual(properties);
    expect(warn).not.toHaveBeenCalled();
  });

  it('keeps the order, ignores other children and warns once per invalid property', () => {
    const el: Element = card(
      '<card><description>x</description><property name="B" value="1"/>' +
        '<property name="" value="1"/><modifier stat="armor" value="2"/><property name="A" value="2"/></card>',
    );
    expect(readCardProperties(el, 'c9')).toEqual([
      { name: 'B', value: 1 },
      { name: 'A', value: 2 },
    ]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('„c9“'));
  });

  it('reads stored properties of the browser session and drops invalid entries', () => {
    expect(
      readStoredProperties([{ name: 'Angriff', value: 3 }, null, { name: 'X' }], 'c1'),
    ).toEqual([{ name: 'Angriff', value: 3 }]);
    expect(warn).toHaveBeenCalledTimes(2);
    expect(readStoredProperties(undefined, 'c1')).toEqual([]);
  });
});
