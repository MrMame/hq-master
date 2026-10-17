import { TestBed } from '@angular/core/testing';

import { CharacterCardLayoutService } from './character-card-layout.service';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { SESSION_KEYS } from '../../../core/session-state/session-keys';
import { describePersistedState } from '../../../core/session-state/testing/describe-persisted-state';
import { CardLayoutState, DEFAULT_CARD_LAYOUT_STATE } from '../models/card-layout.model';
import { CharacterInfo } from '../models/character-info.model';

function character(id: string): CharacterInfo {
  return {
    id,
    name: `Char ${id}`,
    type: 'Feuer',
    health: 10,
    armor: 2,
    attack: 3,
    defense: 4,
    speed: 5,
    abilities: [],
    image: '',
    description: '',
  };
}

describe('CharacterCardLayoutService', () => {
  let service: CharacterCardLayoutService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = TestBed.inject(CharacterCardLayoutService);
  });

  describePersistedState<CharacterCardLayoutService, CardLayoutState>('layout', {
    key: SESSION_KEYS.characterCardLayout,
    create: () => {
      TestBed.resetTestingModule();
      return TestBed.inject(CharacterCardLayoutService);
    },
    read: (s) => s.layout(),
    fallback: DEFAULT_CARD_LAYOUT_STATE,
    stored: {
      raw: { cards: { a: { x: 1, y: 2, isMinimised: false } }, topCardId: 'a' },
      expected: { cards: { a: { x: 1, y: 2, isMinimised: false } }, topCardId: 'a' },
    },
    mutate: (s) => s.moveBy('a', { x: 5, y: 5 }),
  });

  it('should move a card by the drag offset', () => {
    service.moveBy('a', { x: 10, y: -20 });
    service.moveBy('a', { x: 5, y: 5 });
    expect(service.layoutFor('a')).toEqual({ x: 65, y: 35, isMinimised: true });
  });

  it('should toggle the minimised view', () => {
    service.toggleMinimised('a');
    expect(service.layoutFor('a').isMinimised).toBe(false);
    service.toggleMinimised('a');
    expect(service.layoutFor('a').isMinimised).toBe(true);
  });

  it('should keep exactly one card on top', () => {
    service.bringToFront('a');
    service.bringToFront('b');
    expect(service.isOnTop('a')).toBe(false);
    expect(service.isOnTop('b')).toBe(true);
  });

  it('should update immutably', () => {
    service.moveBy('a', { x: 1, y: 1 });
    const before: CardLayoutState = service.layout();
    const cardBefore: object = before.cards['a'];
    service.moveBy('a', { x: 1, y: 1 });
    expect(service.layout()).not.toBe(before);
    expect(service.layout().cards['a']).not.toBe(cardBefore);
    expect(before.cards['a']).toEqual({ x: 51, y: 51, isMinimised: true });
  });

  it('should add staggered layouts for new characters and drop removed ones', () => {
    const db: CharactersDbService = TestBed.inject(CharactersDbService);
    db.writeCharacter(character('a'));
    db.writeCharacter(character('b'));
    TestBed.tick();
    expect(Object.keys(service.layout().cards)).toEqual(['a', 'b']);
    expect(service.layoutFor('b')).toEqual({ x: 150, y: 150, isMinimised: true });

    service.bringToFront('a');
    db.removeCharacter(character('a'));
    TestBed.tick();
    expect(Object.keys(service.layout().cards)).toEqual(['b']);
    expect(service.layout().topCardId).toBeNull();
  });

  it('should replace the layout on restore and clear it on reset', () => {
    const layout: CardLayoutState = {
      cards: { x: { x: 9, y: 9, isMinimised: false } },
      topCardId: 'x',
    };
    service.restore(layout);
    expect(service.layout()).toEqual(layout);
    service.reset();
    expect(service.layout()).toEqual(DEFAULT_CARD_LAYOUT_STATE);
  });
});
