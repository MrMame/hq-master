import { afterEach, beforeEach, Mock, vi } from 'vitest';

/**
 * jsdom kennt `Element.scrollIntoView` nicht. Innerhalb eines `describe` aufrufen: stellt die Methode
 * für jeden Test als Spy bereit und stellt danach den Ausgangszustand wieder her. Die zurückgegebene
 * Funktion liefert die Elemente, die bisher ins Bild gescrollt wurden.
 */
export function spyOnScrollIntoView(): () => Element[] {
  const original: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(
    Element.prototype,
    'scrollIntoView',
  );
  let spy: Mock<Element['scrollIntoView']> = vi.fn<Element['scrollIntoView']>();

  beforeEach(() => {
    spy = vi.fn<Element['scrollIntoView']>();
    Element.prototype.scrollIntoView = spy;
  });

  afterEach(() => {
    if (original) Object.defineProperty(Element.prototype, 'scrollIntoView', original);
    else Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  return (): Element[] => spy.mock.contexts as Element[];
}
