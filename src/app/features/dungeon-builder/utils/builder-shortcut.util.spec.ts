import { BuilderShortcut, shortcutFor } from './builder-shortcut.util';

function press(key: string, init: KeyboardEventInit = {}, target?: HTMLElement): KeyboardEvent {
  const event: KeyboardEvent = new KeyboardEvent('keydown', { key, ...init });
  if (target) Object.defineProperty(event, 'target', { value: target });
  return event;
}

describe('builder-shortcut.util', () => {
  it.each<[string, KeyboardEventInit, BuilderShortcut | null]>([
    ['r', {}, 'rotate'],
    ['R', {}, 'rotate'],
    ['Delete', {}, 'remove'],
    ['Backspace', {}, 'remove'],
    ['Escape', {}, 'escape'],
    ['z', { ctrlKey: true }, 'undo'],
    ['z', { metaKey: true }, 'undo'],
    ['Z', { ctrlKey: true, shiftKey: true }, 'redo'],
    ['y', { ctrlKey: true }, 'redo'],
    ['s', { ctrlKey: true }, null],
    ['r', { altKey: true }, null],
    ['x', {}, null],
  ])('maps %s %o to %s', (key, init, expected) => {
    expect(shortcutFor(press(key, init))).toBe(expected);
  });

  it('ignores keys while typing in a field', () => {
    expect(shortcutFor(press('r', {}, document.createElement('input')))).toBeNull();
    expect(shortcutFor(press('Delete', {}, document.createElement('textarea')))).toBeNull();
    const editable: HTMLElement = document.createElement('div');
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    expect(shortcutFor(press('r', {}, editable))).toBeNull();
    expect(shortcutFor(press('r', {}, document.createElement('button')))).toBe('rotate');
  });
});
