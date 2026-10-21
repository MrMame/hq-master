import { createTestCharacter } from '../../../core/testing/character.fixtures';
import { DeckState } from '../../card-manager/models/deck-state.model';
import { Card } from '../../card-manager/models/card.model';
import { SessionSnapshot } from '../models/session-snapshot.model';

const combatCard: Card = {
  id: 'c1',
  name: 'Schwert',
  imagePath: 'cards/sword.svg',
  description: 'Scharf',
  cardType: 'combat',
  attack: 3,
  defense: 1,
};

const basicCard: Card = {
  id: 'b1',
  name: 'Fackel',
  imagePath: 'cards/torch.svg',
  description: '',
  cardType: 'basic',
};

export function createDeckState(): DeckState {
  return {
    config: {
      id: 'deck-1',
      name: 'Testdeck',
      backImagePath: 'cards/back.svg',
      defaultCardType: 'basic',
      cards: [combatCard, basicCard],
    },
    drawPile: [basicCard],
    discardPile: [],
    activeCard: combatCard,
    bank: [],
  };
}

export function createSessionSnapshot(): SessionSnapshot {
  return {
    meta: { name: 'Gruft', active: true, startedAt: '2026-10-16T10:00:00.000Z' },
    gameTime: new Date(2390, 4, 6, 7, 30, 15),
    characters: [createTestCharacter('a'), createTestCharacter('b')],
    dungeon: {
      board: {
        boardImageBase64: 'data:image/png;base64,iVBORw0KGgo=',
        gridColumns: 12,
        gridRows: 8,
        gridCellSizePx: 55,
        gridOffsetX: 3,
        gridOffsetY: -4,
        gridOpacity: 0.25,
      },
      positions: [
        { characterId: 'a', col: 1, row: 2 },
        { characterId: 'b', col: 3, row: 4 },
      ],
    },
    deck: createDeckState(),
    characterCards: {
      cards: {
        a: { x: 50, y: 50, isMinimised: true },
        b: { x: 320, y: -10, isMinimised: false },
      },
      topCardId: 'b',
    },
  };
}
