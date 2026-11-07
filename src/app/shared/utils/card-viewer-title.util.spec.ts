import { CardLocation } from '../../core/models/card-location.model';
import { cardViewerTitle, locationLabel } from './card-viewer-title.util';

describe('card-viewer-title.util', () => {
  it.each<[CardLocation, string]>([
    [{ kind: 'hand' }, 'Hand'],
    [{ kind: 'drawPile' }, 'Nachziehstapel'],
    [{ kind: 'discardPile' }, 'Ablagestapel'],
    [{ kind: 'bank' }, 'Bank'],
    [{ kind: 'equipped', characterId: 'a', slot: 'leftHand' }, 'Barbar · Linke Hand'],
  ])('names the location %o as „%s“', (location, label) => {
    expect(locationLabel(location, 'Barbar')).toBe(label);
  });

  it('names the inventory of a character, also of an unknown one', () => {
    expect(locationLabel({ kind: 'inventory', characterId: 'a' }, 'Barbar')).toBe(
      'Barbar · Inventar',
    );
    expect(locationLabel({ kind: 'inventory', characterId: 'x' }, undefined)).toBe(
      'Unbekannt · Inventar',
    );
  });

  it('names a slot of an unknown owner', () => {
    expect(locationLabel({ kind: 'equipped', characterId: 'x', slot: 'body' }, undefined)).toBe(
      'Unbekannt · Körper',
    );
  });

  it('puts the deck before the location', () => {
    expect(cardViewerTitle('Monster (2)', { kind: 'discardPile' }, undefined, false)).toBe(
      'Monster (2) · Ablagestapel',
    );
  });

  it('shows the draft state instead of the location', () => {
    const slot: CardLocation = { kind: 'equipped', characterId: 'a', slot: 'body' };
    expect(cardViewerTitle('Monster', slot, 'Barbar', true)).toBe('Monster · wird abgelegt');
  });
});
