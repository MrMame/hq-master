import { strict as assert } from 'node:assert';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { buildDeckIndex, readDeckEntry, writeDeckIndex } from './build-deck-index.mjs';

let publicDir;

function addDeck(folder, file, xml) {
  mkdirSync(join(publicDir, 'decks', folder), { recursive: true });
  writeFileSync(join(publicDir, 'decks', folder, file), xml);
}

const deckXml = (id, name) =>
  `<?xml version="1.0"?>\n<deck id="${id}" name="${name}"><card/></deck>`;
const indexPath = () => join(publicDir, 'decks', 'index.json');

beforeEach(() => {
  publicDir = mkdtempSync(join(tmpdir(), 'deck-index-'));
});

afterEach(() => {
  rmSync(publicDir, { recursive: true, force: true });
});

describe('readDeckEntry', () => {
  it('reads id and name of the deck element across lines and after comments', () => {
    const xml =
      '<?xml version="1.0"?>\n<!-- <deck name="x"> -->\n<deck\n  id="m"\n  name="Monster &amp; Co"\n>';
    assert.deepEqual(readDeckEntry(xml, 'decks/m/m.xml'), {
      id: 'm',
      name: 'Monster & Co',
      url: 'decks/m/m.xml',
    });
  });

  it('rejects a file without deck element and names the file', () => {
    assert.throws(() => readDeckEntry('<catalog name="x"/>', 'decks/a/a.xml'), {
      message: 'decks/a/a.xml: kein Deck (kein <deck>-Element).',
    });
  });

  it('rejects a deck without name', () => {
    assert.throws(() => readDeckEntry('<deck id="a" name=" ">', 'decks/a/a.xml'), {
      message: 'decks/a/a.xml: Attribut „name“ am <deck>-Element fehlt.',
    });
  });
});

describe('buildDeckIndex', () => {
  it('lists all decks sorted by name ignoring case, with forward slashes', () => {
    addDeck('monster', 'monster.xml', deckXml('monster', 'monster'));
    addDeck('items', 'items.xml', deckXml('items', 'Ausrüstung'));
    addDeck('items', 'zauber.xml', deckXml('zauber', 'Zauber'));
    addDeck('items', 'card.svg', '<svg/>');

    assert.deepEqual(buildDeckIndex(publicDir), [
      { id: 'items', name: 'Ausrüstung', url: 'decks/items/items.xml' },
      { id: 'monster', name: 'monster', url: 'decks/monster/monster.xml' },
      { id: 'zauber', name: 'Zauber', url: 'decks/items/zauber.xml' },
    ]);
  });

  it('is empty without deck folders', () => {
    assert.deepEqual(buildDeckIndex(publicDir), []);
  });
});

describe('writeDeckIndex', () => {
  it('writes the index as JSON', () => {
    addDeck('default', 'default-deck.xml', deckXml('default-deck', 'Beispieldeck'));
    writeDeckIndex(publicDir);
    assert.deepEqual(JSON.parse(readFileSync(indexPath(), 'utf8')), [
      { id: 'default-deck', name: 'Beispieldeck', url: 'decks/default/default-deck.xml' },
    ]);
  });

  it('leaves no index behind when a deck is invalid', () => {
    addDeck('default', 'default-deck.xml', deckXml('default-deck', 'Beispieldeck'));
    writeDeckIndex(publicDir);
    addDeck('broken', 'broken.xml', '<deck id="broken">');

    assert.throws(() => writeDeckIndex(publicDir), /decks\/broken\/broken.xml: Attribut „name“/);
    assert.equal(existsSync(indexPath()), false);
  });
});
