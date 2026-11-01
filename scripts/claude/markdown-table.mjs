// Markdown-Tabellen für docs/project-logs/harness-statistics.md schreiben und wieder lesen.
// Das Log wird bei jedem Aufruf aus den gelesenen Zeilen neu erzeugt.
const CELL_SEPARATOR = /(?<!\\)\|/;

const escapeCell = (value) =>
  String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|');
const unescapeCell = (text) => text.trim().replace(/\\\|/g, '|');

export function renderTable(headers, rows) {
  const line = (cells) => `| ${cells.map(escapeCell).join(' | ')} |`;
  return [line(headers), line(headers.map(() => '---')), ...rows.map(line)].join('\n');
}

// Zellen aller Datenzeilen der ersten Tabelle im Text (ohne Kopf- und Trennzeile).
export function parseTable(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));
  return lines.slice(2).map((line) => line.slice(1, -1).split(CELL_SEPARATOR).map(unescapeCell));
}

export const formatNumber = (value) => (value === null ? '–' : value.toLocaleString('de-DE'));

export function parseNumber(text) {
  const digits = String(text ?? '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  return digits === '' || digits === '–' || Number.isNaN(Number(digits)) ? null : Number(digits);
}
