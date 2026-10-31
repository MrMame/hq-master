import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkKind, isExpectedFailure, isFailedCheck, outputText } from './check-output.mjs';

describe('checkKind', () => {
  for (const [command, kind] of [
    ['npm run test -- --watch=false --coverage 2>&1 | tail -20', 'test'],
    ['npm run lint 2>&1 | tail -5', 'lint'],
    ['npm run build', 'build'],
    ['npx playwright test --project=probe e2e/probe/x.spec.ts | grep passed', 'e2e'],
    ['git status', undefined],
  ]) {
    it(`classifies "${command}" as ${kind}`, () => assert.equal(checkKind(command), kind));
  }
});

describe('isFailedCheck', () => {
  for (const [command, output] of [
    ['npm run lint 2>&1 | tail -5', 'Lint errors found in the listed files.'],
    ['npm run lint', '✖ 3 problems (3 errors, 0 warnings)'],
    ['npm run test -- --watch=false', ' Test Files  2 failed | 113 passed (115)'],
    ['npm run test -- --watch=false', '      Tests  3 failed | 861 passed (864)'],
    [
      'npm run test -- --coverage',
      'ERROR: Coverage for lines (94.1%) does not meet global threshold (95%)',
    ],
    ['npm run build', 'Application bundle generation failed. [3.2 seconds]'],
    ['npm run build', '✘ [ERROR] TS2322: Type string is not assignable'],
    ['npx playwright test --project=probe', '  2 failed\n  3 passed (11.4s)'],
  ]) {
    it(`detects "${output.trim()}"`, () => assert.equal(isFailedCheck(command, output), true));
  }

  for (const [command, output] of [
    ['npm run lint', 'All files pass linting.'],
    ['npm run lint', '✖ 2 problems (0 errors, 2 warnings)'],
    [
      'npm run test -- --watch=false',
      ' Test Files  115 passed (115)\n      Tests  864 passed (864)',
    ],
    ['npx playwright test --project=probe', '  5 passed (6.9s)'],
    ['grep -n failed .claude/logs/activity.log', '  2 failed'],
    [undefined, 'Lint errors found'],
  ]) {
    it(`ignores "${output.trim()}" for "${command}"`, () =>
      assert.equal(isFailedCheck(command, output), false));
  }
});

describe('outputText', () => {
  it('joins stdout and stderr of a Bash tool response', () => {
    assert.equal(outputText({ stdout: 'out', stderr: 'err' }), 'out\nerr');
    assert.equal(outputText({ stdout: 'out', stderr: '' }), 'out');
  });

  it('removes color codes so colored Vitest output is detected', () => {
    const colored =
      '\x1b[2m Test Files \x1b[22m \x1b[1m\x1b[31m2 failed\x1b[39m\x1b[22m | 113 passed';
    assert.equal(outputText({ stdout: colored }), ' Test Files  2 failed | 113 passed');
    assert.equal(isFailedCheck('npm run test', outputText({ stdout: colored })), true);
  });

  it('accepts a plain string and a missing response', () => {
    assert.equal(outputText('text'), 'text');
    assert.equal(outputText(undefined), '');
  });
});

describe('isExpectedFailure', () => {
  for (const detail of [
    'Bash (Run probe (erwartet rot)) npx playwright test',
    'Bash (Run probe, expect red) npx playwright test',
    'Bash (Probe is expected to fail) npx playwright test',
  ]) {
    it(`treats "${detail}" as expected`, () => assert.equal(isExpectedFailure(detail), true));
  }

  it('treats other failures as unexpected', () =>
    assert.equal(isExpectedFailure('Bash (Run lint) npm run lint'), false));
});
