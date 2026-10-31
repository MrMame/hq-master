// Erkennt Prüfbefehle (Test, Lint, Build, E2E) und Fehler in ihrer Ausgabe. Genutzt vom Hook
// .claude/hooks/log-activity.mjs, wenn ein Befehl trotz Fehlern mit Exit-Code 0 endet (z. B. über
// eine Pipe), und von scripts/claude/activity-log.mjs zum Gruppieren der Fehlschläge.
export const CHECK_COMMANDS = [
  ['test', /npm run test|ng test|vitest/],
  ['lint', /npm run lint|ng lint|eslint/],
  ['build', /npm run build|ng build/],
  ['e2e', /npm run e2e|playwright/],
];

const FAILURE_MARKERS = [
  /Lint errors found/,
  /✖ \d+ problems? \([1-9]\d* errors?/,
  /Test Files\s+\d+ failed/,
  /Tests\s+\d+ failed/,
  /does not meet (the )?global threshold/,
  /Application bundle generation failed/,
  /✘ \[ERROR\]/,
  /^\s*\d+ failed\b/m,
];

// „erwartet rot“ markiert absichtlich rote Läufe, z. B. eine Probe als Beleg für „fehlt noch“.
const EXPECTED_FAILURE = /erwartet rot|expect(ed)? (red|to fail)/i;

export function checkKind(command) {
  return CHECK_COMMANDS.find(([, pattern]) => pattern.test(command))?.[0];
}

// Farbcodes entfernen: Vitest färbt auch umgeleitete Ausgabe ("Test Files \x1b[31m2 failed").
const ANSI_COLOR = /\x1b\[[0-9;]*m/g;

export function outputText(toolResponse) {
  const text =
    typeof toolResponse === 'string'
      ? toolResponse
      : [toolResponse?.stdout, toolResponse?.stderr].filter(Boolean).join('\n');
  return text.replace(ANSI_COLOR, '');
}

export function isFailedCheck(command, output) {
  return (
    checkKind(String(command ?? '')) !== undefined &&
    FAILURE_MARKERS.some((marker) => marker.test(output))
  );
}

export function isExpectedFailure(detail) {
  return EXPECTED_FAILURE.test(detail);
}
