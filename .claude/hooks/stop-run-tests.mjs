// Stop: Wenn src/ uncommittete Änderungen hat, müssen die Tests grün sein.
// Exit-Code 2 hält Claude an, die Fehler zu beheben. Beim zweiten Versuch
// (stop_hook_active) wird nicht erneut blockiert, sondern der Nutzer gewarnt.
// Eigenes Timeout (unter den 300 s aus settings.json); Prozessbaum-Abbruch
// und Laufwerksbuchstaben-Workaround kommen aus dem gemeinsamen Modul.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { lastLines, runCommand } from '../../scripts/git-hooks/run-with-timeout.mjs';

const TIMEOUT_S = Number(process.env.HQ_STOP_HOOK_TIMEOUT_S) || 240;

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const srcChanged = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim() !== '';
if (!srcChanged) process.exit(0);

const tests = await runCommand('npm run test -- --watch=false', { timeoutS: TIMEOUT_S });
if (tests.status === 0 && !tests.timedOut) process.exit(0);

const output = tests.timedOut
  ? `Testlauf nach ${TIMEOUT_S} s abgebrochen – vermutlich Endlosschleife.\nLetzte Ausgabe:\n${lastLines(tests.output, 30)}`
  : `Unit-Tests schlagen fehl – bitte beheben:\n${tests.output.slice(-4000)}`;
if (input.stop_hook_active) {
  const reason = tests.timedOut ? 'hängen weiterhin' : 'schlagen weiterhin fehl';
  console.log(JSON.stringify({ systemMessage: `⚠ Unit-Tests ${reason} (npm run test).` }));
  process.exit(0);
}
console.error(output);
process.exit(2);
