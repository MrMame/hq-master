import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatNumber, parseNumber, parseTable, renderTable } from './markdown-table.mjs';

describe('renderTable / parseTable', () => {
  it('renders a header, a separator and one line per row', () => {
    assert.equal(
      renderTable(['A', 'B'], [['1', '2']]),
      ['| A | B |', '| --- | --- |', '| 1 | 2 |'].join('\n'),
    );
  });

  it('reads back cells including escaped pipes and line breaks', () => {
    const table = renderTable(['Text'], [['a | b'], ['zeile\nzwei']]);
    assert.deepEqual(parseTable(`Einleitung\n\n${table}\n\nDanach`), [['a | b'], ['zeile zwei']]);
  });

  it('ignores the padding prettier adds to aligned tables', () => {
    const aligned = ['| A    | B |', '| ---- | - |', '| lang | 2 |'].join('\n');
    assert.deepEqual(parseTable(aligned), [['lang', '2']]);
  });

  it('returns no rows without a table', () => {
    assert.deepEqual(parseTable('Noch keine Läufe.'), []);
  });
});

describe('formatNumber / parseNumber', () => {
  it('round-trips German thousands separators', () => {
    assert.equal(formatNumber(8567528), '8.567.528');
    assert.equal(parseNumber('8.567.528'), 8567528);
  });

  it('uses a dash for missing values', () => {
    assert.equal(formatNumber(null), '–');
    assert.equal(parseNumber('–'), null);
    assert.equal(parseNumber(''), null);
    assert.equal(parseNumber(undefined), null);
    assert.equal(parseNumber('abc'), null);
  });

  it('reads decimal commas', () => {
    assert.equal(parseNumber('2,5'), 2.5);
  });
});
