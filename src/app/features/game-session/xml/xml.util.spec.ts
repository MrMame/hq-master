import { indentXml, readBoolean, readNumber, readString, requireChild, textOf } from './xml.util';

function parse(xml: string): Element {
  return new DOMParser().parseFromString(xml, 'application/xml').documentElement;
}

describe('xml.util – reading', () => {
  it('reads a present string attribute and falls back when it is missing', () => {
    const el: Element = parse('<a name="Orc"/>');
    expect(readString(el, 'name')).toBe('Orc');
    expect(readString(el, 'missing')).toBe('');
    expect(readString(el, 'missing', 'x')).toBe('x');
  });

  it('keeps an empty string attribute instead of the fallback', () => {
    expect(readString(parse('<a name=""/>'), 'name', 'x')).toBe('');
  });

  it.each<[string, string, number]>([
    ['valid integer', '<a n="12"/>', 12],
    ['valid negative decimal', '<a n="-0.5"/>', -0.5],
    ['missing', '<a/>', 7],
    ['empty', '<a n=""/>', 0],
    ['not numeric', '<a n="abc"/>', 7],
    ['Infinity', '<a n="Infinity"/>', 7],
  ])('readNumber: %s', (_case, xml, expected) => {
    expect(readNumber(parse(xml), 'n', 7)).toBe(expected);
  });

  it('readNumber falls back to 0 by default', () => {
    expect(readNumber(parse('<a n="x"/>'), 'n')).toBe(0);
  });

  it.each<[string, boolean]>([
    ['<a b="true"/>', true],
    ['<a b="false"/>', false],
    ['<a b="TRUE"/>', false],
    ['<a/>', false],
  ])('readBoolean(%s) is %s', (xml, expected) => {
    expect(readBoolean(parse(xml), 'b')).toBe(expected);
  });

  it('textOf returns the text, or an empty string for a missing element', () => {
    expect(textOf(parse('<a>Hallo</a>'))).toBe('Hallo');
    expect(textOf(parse('<a/>'))).toBe('');
    expect(textOf(null)).toBe('');
  });

  it('requireChild returns a direct child and names the missing element otherwise', () => {
    const root: Element = parse('<root><meta/><deep><time/></deep></root>');
    expect(requireChild(root, 'meta').tagName).toBe('meta');
    expect(() => requireChild(root, 'time')).toThrow(
      'Ungültige Session-Datei: <time> fehlt in <root>.',
    );
  });
});

describe('xml.util – indentXml', () => {
  const serialize: (el: Element) => string = (el: Element): string =>
    new XMLSerializer().serializeToString(el);

  it('leaves an element without children unchanged', () => {
    const el: Element = parse('<a>text</a>');
    indentXml(el);
    expect(serialize(el)).toBe('<a>text</a>');
  });

  it('indents nested elements by two spaces per level', () => {
    const el: Element = parse('<a><b><c/></b><d/></a>');
    indentXml(el);
    expect(serialize(el)).toBe('<a>\n  <b>\n    <c/>\n  </b>\n  <d/>\n</a>');
  });
});
