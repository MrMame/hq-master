import { readDungeonBoard, writeDungeonBoard } from './dungeon.xml-mapper';
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

describe('dungeon.xml-mapper – grid with decimals', () => {
  it('keeps a cell size with all decimals, e.g. for an image of 26 columns', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'gameSession', null);
    const state: DungeonSessionState = {
      board: { ...DEFAULT_DUNGEON_BOARD_STATE, gridColumns: 26, gridCellSizePx: 1000 / 26 },
      positions: [],
    };

    expect(readDungeonBoard(writeDungeonBoard(doc, state))).toEqual(state);
  });

  it('keeps an origin with a decimal and positions left of and above the origin', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'gameSession', null);
    const state: DungeonSessionState = {
      board: { ...DEFAULT_DUNGEON_BOARD_STATE, gridOffsetX: 412.4, gridOffsetY: -12.5 },
      positions: [
        { characterId: 'a', col: -2, row: -1 },
        { characterId: 'b', col: 0, row: -3 },
      ],
    };

    expect(readDungeonBoard(writeDungeonBoard(doc, state))).toEqual(state);
  });

  it('reads an old offset from the slider range -100 to 100 unchanged', () => {
    expect(read('<dungeonBoard gridOffsetX="-100" gridOffsetY="100"/>').board).toMatchObject({
      gridOffsetX: -100,
      gridOffsetY: 100,
    });
  });
});
