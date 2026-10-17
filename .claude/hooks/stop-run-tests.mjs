// Stop: Wenn src/ uncommittete Änderungen hat, müssen die Tests grün sein.
// Exit-Code 2 hält Claude an, die Fehler zu beheben. Beim zweiten Versuch
// (stop_hook_active) wird nicht erneut blockiert, sondern der Nutzer gewarnt.
// Eigenes Timeout (unter den 300 s aus settings.json): Ein hängender Testlauf
// (z. B. synchrone Endlosschleife) wird samt Prozessbaum beendet, damit keine
// verwaisten node-Prozesse (npm → ng test → vitest) zurückbleiben.
import { readFileSync } from 'node:fs';
import { execSync, spawn, spawnSync } from 'node:child_process';

const TIMEOUT_S = Number(process.env.HQ_STOP_HOOK_TIMEOUT_S) || 240;
const isWindows = process.platform === 'win32';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const srcChanged = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim() !== '';
if (!srcChanged) process.exit(0);

// Vitest findet unter Windows seinen Runner nicht, wenn der Laufwerksbuchstabe klein ist (f:\…).
const cwd = process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());
const tests = await runTests('npm run test -- --watch=false', cwd);
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

function runTests(command, workingDir) {
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, cwd: workingDir, detached: !isWindows });
    let collected = '';
    const collect = (chunk) => (collected = (collected + chunk).slice(-16000));
    child.stdout.setEncoding('utf8').on('data', collect);
    child.stderr.setEncoding('utf8').on('data', collect);
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child.pid);
    }, TIMEOUT_S * 1000);
    child.on('close', (status) => {
      clearTimeout(timer);
      resolve({ status, output: collected, timedOut });
    });
  });
}

function killProcessTree(pid) {
  if (isWindows) {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F']);
    return;
  }
  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    // Prozessgruppe bereits beendet
  }
}

function lastLines(text, count) {
  return text.trimEnd().split(/\r?\n/).slice(-count).join('\n');
}
