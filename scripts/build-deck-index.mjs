// Erzeugt public/decks/index.json aus allen Deck-Dateien public/decks/*/*.xml (Auswahlliste im Card Manager).
// Läuft vor start/build/watch/deploy und vor dem Playwright-Server; die Datei ist ein Build-Ergebnis.
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DECKS_DIR = 'decks';
const INDEX_FILE = 'index.json';
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** Ersetzt die vordefinierten XML-Entities und Zeichenreferenzen. */
function decodeXml(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, ref) => {
    if (ref[0] !== '#') return ENTITIES[ref] ?? match;
    const hex = ref[1].toLowerCase() === 'x';
    return String.fromCodePoint(parseInt(ref.slice(hex ? 2 : 1), hex ? 16 : 10));
  });
}

function readAttributes(tagBody) {
  const attributes = {};
  for (const [, key, , value] of tagBody.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)) {
    attributes[key] = decodeXml(value);
  }
  return attributes;
}

/** Liest einen Katalog-Eintrag aus dem Text einer Deck-Datei; `url` ist relativ zu `public/`. */
export function readDeckEntry(xmlText, url) {
  const content = xmlText.replace(/<!--[\s\S]*?-->/g, '').replace(/<\?[\s\S]*?\?>/g, '');
  const root = /<([\w:-]+)([^>]*)>/.exec(content);
  if (!root || root[1] !== 'deck') throw new Error(`${url}: kein Deck (kein <deck>-Element).`);
  const { id, name } = readAttributes(root[2]);
  if (!name?.trim()) throw new Error(`${url}: Attribut „name“ am <deck>-Element fehlt.`);
  return { id: id ?? '', name: name.trim(), url };
}

function compareEntries(a, b) {
  return a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }) || a.url.localeCompare(b.url);
}

/** Alle Decks unter `<publicDir>/decks/*\/*.xml`, sortiert nach Name. */
export function buildDeckIndex(publicDir) {
  const decksDir = join(publicDir, DECKS_DIR);
  if (!existsSync(decksDir)) return [];
  const folders = readdirSync(decksDir, { withFileTypes: true }).filter((e) => e.isDirectory());
  return folders
    .flatMap((folder) =>
      readdirSync(join(decksDir, folder.name))
        .filter((file) => file.toLowerCase().endsWith('.xml'))
        .map((file) => {
          const url = [DECKS_DIR, folder.name, file].join('/');
          return readDeckEntry(readFileSync(join(decksDir, folder.name, file), 'utf8'), url);
        }),
    )
    .sort(compareEntries);
}

/** Schreibt `index.json`; bei einem fehlerhaften Deck bleibt keine (alte) Datei zurück. */
export function writeDeckIndex(publicDir) {
  const indexPath = join(publicDir, DECKS_DIR, INDEX_FILE);
  try {
    const entries = buildDeckIndex(publicDir);
    writeFileSync(indexPath, `${JSON.stringify(entries, null, 2)}\n`);
    return entries;
  } catch (error) {
    rmSync(indexPath, { force: true });
    throw error;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const entries = writeDeckIndex(process.argv[2] ?? 'public');
    console.log(`Deck-Katalog: ${entries.length} Deck(s) in public/decks/${INDEX_FILE}.`);
  } catch (error) {
    console.error(`Deck-Katalog konnte nicht erzeugt werden: ${error.message}`);
    process.exit(1);
  }
}
