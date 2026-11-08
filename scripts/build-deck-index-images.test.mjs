import { strict as assert } from 'node:assert';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { readDeckImages, writeDeckIndex } from './build-deck-index.mjs';

let publicDir;

function addFile(path, content = '') {
  const full = join(publicDir, ...path.split('/'));
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, content);
}

const DECK_XML = `<?xml version="1.0"?>
<!-- <card id="kommentar" image="decks/z/fehlt.png"/> -->
<deck id="z" name="Zwerg" backImage="decks/z/back.png">
  <card id="wirbel" name="Wirbelattacke" image="decks/z/wirbel.png" type="basic">
    <description>Text</description>
  </card>
  <card id="sonder" name="Sonder" image="decks/z/sonder.png" backImage="decks/z/sonder-back.png"/>
</deck>`;

const ALL_IMAGES = [
  'decks/z/back.png',
  'decks/z/wirbel.png',
  'decks/z/sonder.png',
  'decks/z/sonder-back.png',
];

function addDeckWithImages(missing) {
  addFile('decks/z/zwerg.xml', DECK_XML);
  ALL_IMAGES.filter((path) => path !== missing).forEach((path) => addFile(path));
}

const indexPath = () => join(publicDir, 'decks', 'index.json');

beforeEach(() => {
  publicDir = mkdtempSync(join(tmpdir(), 'deck-images-'));
});

afterEach(() => {
  rmSync(publicDir, { recursive: true, force: true });
});

describe('readDeckImages', () => {
  it('lists the deck back, every front and own backs, ignoring comments', () => {
    assert.deepEqual(
      readDeckImages(DECK_XML).map((image) => image.path),
      ALL_IMAGES,
    );
  });
});

describe('writeDeckIndex – images', () => {
  it('writes the index when every image exists', () => {
    addDeckWithImages(null);
    assert.equal(writeDeckIndex(publicDir).length, 1);
    assert.ok(existsSync(indexPath()));
  });

  for (const [label, missing, message] of [
    [
      'a front',
      'decks/z/wirbel.png',
      /Karte „wirbel“: Vorderseite: Grafik „decks\/z\/wirbel\.png“/,
    ],
    ['the deck back', 'decks/z/back.png', /Rückseite des Decks: Grafik „decks\/z\/back\.png“/],
    [
      'an own back of a card',
      'decks/z/sonder-back.png',
      /Karte „sonder“: Rückseite: Grafik „decks\/z\/sonder-back\.png“/,
    ],
  ]) {
    it(`fails with deck file, card and path when ${label} is missing and writes no index`, () => {
      addDeckWithImages(missing);
      writeFileSync(join(publicDir, 'decks', 'index.json'), '[]');

      assert.throws(
        () => writeDeckIndex(publicDir),
        (error) => {
          assert.match(error.message, /^decks\/z\/zwerg\.xml: /);
          assert.match(error.message, message);
          return true;
        },
      );
      assert.equal(existsSync(indexPath()), false);
    });
  }
});
