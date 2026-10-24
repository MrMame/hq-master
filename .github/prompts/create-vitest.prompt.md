---
description: 'Add focused Vitest coverage for HQ-Master services, Signals, persistence, or Angular components.'
name: 'Create HQ-Master Vitest Tests'
argument-hint: 'Select the code or describe the behavior to cover'
agent: 'agent'
---

Add or improve Vitest tests for the selected HQ-Master behavior.

- Inspect neighboring `*.spec.ts` files and reuse their setup patterns.
- Cover the normal path, relevant boundary cases, and explicit error behavior.
- Test observable behavior and Signal state transitions, not private
  implementation details.
- Keep test state isolated, especially LocalStorage.
- Do not change production behavior just to make a weak test pass.
- Run the smallest affected test command and report the result.
