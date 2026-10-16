// Stop: Wenn src/ uncommittete Änderungen hat, müssen die Tests grün sein.
// Exit-Code 2 hält Claude an, die Fehler zu beheben. Beim zweiten Versuch
// (stop_hook_active) wird nicht erneut blockiert, sondern der Nutzer gewarnt.
import { readFileSync } from 'node:fs';
import { execSync, spawnSync } from 'node:child_process';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const srcChanged = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim() !== '';
if (!srcChanged) process.exit(0);

const tests = spawnSync('npm run test -- --watch=false', { shell: true, encoding: 'utf8' });
if (tests.status === 0) process.exit(0);

const output = `${tests.stdout}\n${tests.stderr}`.slice(-4000);
if (input.stop_hook_active) {
  console.log(
    JSON.stringify({ systemMessage: '⚠ Unit-Tests schlagen weiterhin fehl (npm run test).' }),
  );
  process.exit(0);
}
console.error(`Unit-Tests schlagen fehl – bitte beheben:\n${output}`);
process.exit(2);
