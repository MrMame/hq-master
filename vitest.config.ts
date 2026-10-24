import { defineConfig } from 'vitest/config';

// Wird vom @angular/build:unit-test-Builder über `runnerConfig` (angular.json)
// geladen. Der Builder bietet keine eigene Option für Coverage-Schwellen.
// Schwellen knapp unter dem Stand vom 2026-10-17
// (98,3 % Lines, 94,0 % Branches, 89,8 % Functions, 96,8 % Statements).
export default defineConfig({
  test: {
    // Ab Node 25 ist Nodes eigenes Web Storage standardmäßig aktiv und verdeckt
    // das localStorage von jsdom (Folge: localStorage === undefined in Specs).
    execArgv: ['--no-experimental-webstorage'],
    coverage: {
      thresholds: {
        lines: 95,
        branches: 90,
        functions: 85,
        statements: 95,
      },
    },
  },
});
