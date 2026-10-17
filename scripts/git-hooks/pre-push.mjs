// Git pre-push (husky): Vollständige Prüfung vor dem Push – Unit-Tests mit
// Coverage (Schwellen aus vitest.config.ts) und Production-Build. Bei Fehlern,
// unterschrittener Schwelle oder Timeout wird der Push abgebrochen (Exit 1).
import { lastLines, runCommand } from './run-with-timeout.mjs';

const TIMEOUT_S = Number(process.env.HQ_PRE_PUSH_TIMEOUT_S) || 600;

const steps = [
  { name: 'Unit-Tests + Coverage', command: 'npm run test -- --watch=false --coverage' },
  { name: 'Build', command: 'npm run build' },
];

for (const step of steps) {
  console.log(`pre-push: ${step.name} …`);
  const run = await runCommand(step.command, { timeoutS: TIMEOUT_S });
  if (run.timedOut) {
    console.error(
      `Push blockiert – ${step.name} nach ${TIMEOUT_S} s abgebrochen.\n${lastLines(run.output, 30)}`,
    );
    process.exit(1);
  }
  if (run.status !== 0) {
    console.error(`Push blockiert – ${step.name} schlägt fehl:\n${lastLines(run.output, 80)}`);
    process.exit(1);
  }
}
console.log('pre-push: alle Prüfungen bestanden.');
