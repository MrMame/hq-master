import { readGameLog, writeGameLog } from './game-log.xml-mapper';
import { GameLogEntry } from '../../../core/models/game-log-entry.model';
import { createTestLog } from '../../../core/testing/game-log.fixtures';

const toElement: (xml: string) => Element = (xml: string): Element =>
  new DOMParser().parseFromString(xml, 'application/xml').documentElement;

const roundTrip: (entries: GameLogEntry[]) => GameLogEntry[] = (entries) => {
  const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
  const xml: string = new XMLSerializer().serializeToString(writeGameLog(doc, entries));
  return readGameLog(toElement(xml));
};

describe('game-log.xml-mapper', () => {
  it('round-trips entries with and without optional fields, including special characters', () => {
    expect(roundTrip(createTestLog())).toEqual(createTestLog());
  });

  it('writes the text as element content and omits missing attributes', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
    const xml: string = new XMLSerializer().serializeToString(
      writeGameLog(doc, createTestLog().slice(0, 1)),
    );
    expect(xml).toMatch(/<entry id="log-1" type="time" gameTime="[^"]+" value="10">\+10 s/);
    expect(xml).not.toContain('characterId');
  });

  it('returns an empty log for older files without <gameLog>', () => {
    expect(readGameLog(null)).toEqual([]);
  });

  it('skips entries with an unknown type or a missing id', () => {
    const el: Element = toElement(
      '<gameLog><entry id="a" type="trap" gameTime="x">Falle</entry>' +
        '<entry type="time" gameTime="x">ohne ID</entry>' +
        '<entry id="b" type="time" gameTime="x">ok</entry></gameLog>',
    );
    expect(readGameLog(el)).toEqual([{ id: 'b', type: 'time', gameTime: 'x', text: 'ok' }]);
  });
});
