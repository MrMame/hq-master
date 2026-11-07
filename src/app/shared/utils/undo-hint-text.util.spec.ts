import { CardLocation } from '../../core/models/card-location.model';
import { undoHintText } from './undo-hint-text.util';

describe('undoHintText', () => {
  it.each<[CardLocation, string | undefined, string]>([
    [
      { kind: 'equipped', characterId: 'a', slot: 'body' },
      'Barbar',
      'Runenrüstung an Barbar angelegt',
    ],
    [
      { kind: 'inventory', characterId: 'a' },
      'Zwerg',
      'Runenrüstung ins Inventar von Zwerg gelegt',
    ],
    [
      { kind: 'inventory', characterId: 'x' },
      undefined,
      'Runenrüstung ins Inventar von Unbekannt gelegt',
    ],
    [{ kind: 'hand' }, undefined, 'Runenrüstung in die Hand genommen'],
    [{ kind: 'drawPile' }, undefined, 'Runenrüstung in den Nachziehstapel gelegt'],
    [{ kind: 'discardPile' }, undefined, 'Runenrüstung in den Ablagestapel gelegt'],
    [{ kind: 'bank' }, undefined, 'Runenrüstung in die Bank gelegt'],
  ])('describes a move to %o', (to, owner, text) => {
    expect(undoHintText('Runenrüstung', to, owner)).toBe(text);
  });
});
