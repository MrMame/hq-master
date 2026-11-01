// Abschnitt „Übersicht“ des Statistiklogs: je Messverfahren eine Tabelle mit einer Zeile je
// wirkungsrelevantem Harness-Stand (Mediane je Punkt und Effizienz-Index).
import { PROVISIONAL_BELOW } from './efficiency-index.mjs';
import { renderTable } from './markdown-table.mjs';

const HEADERS = [
  'Stand',
  'Seit',
  'Läufe',
  'Dauer (min)',
  'Tools',
  'Tokens gesamt',
  'Output-Tokens',
  'Fehlschläge + 1',
  'Diff-Zeilen',
  'Index',
];
const LEGEND =
  'Werte je umgesetztem Punkt (Median). Index: 100 = Median aller Läufe desselben Messverfahrens, ' +
  `höher = effizienter. „vorläufig“: weniger als ${PROVISIONAL_BELOW} Läufe. ` +
  'Nacharbeit zählt zum früheren Lauf; `interview-me` zählt nicht.';

const decimal = (value, digits) =>
  value === null
    ? '–'
    : value.toLocaleString('de-DE', { maximumFractionDigits: digits, minimumFractionDigits: 0 });

function summaryCells({ stand, count, medians, index }) {
  const provisional = count > 0 && count < PROVISIONAL_BELOW ? ' (vorläufig)' : '';
  return [
    stand.stand,
    stand.since,
    `${count}`,
    decimal(medians.minutes, 1),
    decimal(medians.tools, 1),
    decimal(medians.tokens, 0),
    decimal(medians.output, 0),
    decimal(medians.failures, 2),
    decimal(medians.diff, 0),
    index === null ? '–' : `${index}${provisional}`,
  ];
}

export function formatOverview({ summaries }) {
  if (summaries.length === 0) return 'Noch keine Läufe.';
  const epochs = [...new Set(summaries.map((summary) => summary.epoch))];
  const sections = epochs.map((epoch) => {
    const own = summaries.filter((summary) => summary.epoch === epoch);
    const first = own[0].stand;
    const title = `### Messverfahren ${epoch + 1} (ab ${first.stand}, ${first.since})`;
    return `${title}\n\n${renderTable(HEADERS, own.map(summaryCells))}`;
  });
  return [LEGEND, ...sections].join('\n\n');
}
