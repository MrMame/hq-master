// Testdaten für Läufe und Harness-Stände des Statistiklogs (nur für *.test.mjs).
export const createRun = (overrides = {}) => ({
  date: '2026-11-01 10:00',
  skill: 'implement-refactor',
  slug: 'beispiel',
  points: 2,
  added: 100,
  removed: 20,
  minutes: 10,
  prompts: 1,
  questions: 1,
  tools: 40,
  failures: 1,
  expected: 0,
  output: 20000,
  tokens: 2000000,
  model: 'claude-opus-5-5 (medium)',
  stand: 'aaaa1111',
  changesHarness: false,
  ...overrides,
});

export const createStand = (overrides = {}) => ({
  stand: 'aaaa1111',
  since: '2026-11-01 09:00',
  model: 'claude-opus-5-5 (medium)',
  version: '2.1.314',
  breaks: false,
  impact: 'wirkungsrelevant',
  note: '–',
  hypothesis: '–',
  files: '–',
  ...overrides,
});
