import { readDungeonBoard } from './dungeon.xml-mapper';
import { DEFAULT_DUNGEON_BOARD_STATE } from '../../dungeon-tracker/models/dungeon-board-state.model';
import { DungeonSessionState } from '../../dungeon-tracker/models/dungeon-session-state.model';

function read(xml: string): DungeonSessionState {
  return readDungeonBoard(new DOMParser().parseFromString(xml, 'application/xml').documentElement);
}

describe('dungeon.xml-mapper – fallbacks for old or hand-edited files', () => {
  it('reads an empty board as the default state without positions', () => {
    expect(read('<dungeonBoard/>')).toEqual({
      board: DEFAULT_DUNGEON_BOARD_STATE,
      positions: [],
    });
  });

  it.each<[string, string, number]>([
    ['not numeric', 'zehn', DEFAULT_DUNGEON_BOARD_STATE.gridColumns],
    ['infinite', 'Infinity', DEFAULT_DUNGEON_BOARD_STATE.gridColumns],
    ['empty (Number("") is 0)', '', 0],
    ['valid', '12', 12],
  ])('reads a %s gridColumns value as %s', (_case, raw, expected) => {
    expect(read(`<dungeonBoard gridColumns="${raw}"/>`).board.gridColumns).toBe(expected);
  });

  it.each<[string, string, string | null]>([
    ['no <image>', '<dungeonBoard/>', null],
    ['an empty <image/>', '<dungeonBoard><image/></dungeonBoard>', ''],
    ['a padded image', '<dungeonBoard><image>\n  data:x\n</image></dungeonBoard>', 'data:x'],
  ])('reads %s', (_case, xml, expected) => {
    expect(read(xml).board.boardImageBase64).toBe(expected);
  });

  it('reads a position without attributes with fallback values', () => {
    expect(read('<dungeonBoard><position/></dungeonBoard>').positions).toEqual([
      { characterId: '', col: 0, row: 0 },
    ]);
  });
});
