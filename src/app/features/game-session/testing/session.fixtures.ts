import { createTestCharacter } from '../../../core/testing/character.fixtures';
import { createTestLog } from '../../../core/testing/game-log.fixtures';
import { createDeckState } from '../../../core/testing/deck.fixtures';
import { SessionSnapshot } from '../models/session-snapshot.model';

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
        tokenScale: 1.1,
      },
      positions: [
        { characterId: 'a', col: 1, row: 2 },
        { characterId: 'b', col: 3, row: 4 },
      ],
    },
    deck: createDeckState(),
    gameLog: createTestLog(),
  };
}
