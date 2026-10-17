import {
  DEFAULT_DUNGEON_BOARD_STATE,
  DungeonBoardState,
} from '../../dungeon-tracker/models/dungeon-board-state.model';
import { DungeonPosition } from '../../dungeon-tracker/models/dungeon-position.model';
import {
  appendElement,
  appendTextElement,
  childElements,
  firstChild,
  readNumber,
  readString,
  setAttributes,
} from './xml.util';

export interface DungeonXmlData {
  board: DungeonBoardState;
  positions: DungeonPosition[];
}

export function writeDungeonBoard(doc: XMLDocument, data: DungeonXmlData): Element {
  const { board, positions }: DungeonXmlData = data;
  const el: Element = doc.createElement('dungeonBoard');
  setAttributes(el, {
    gridColumns: board.gridColumns,
    gridRows: board.gridRows,
    gridCellSizePx: board.gridCellSizePx,
    gridOffsetX: board.gridOffsetX,
    gridOffsetY: board.gridOffsetY,
    gridOpacity: board.gridOpacity,
  });
  if (board.boardImageBase64 !== null) {
    appendTextElement(el, 'image', board.boardImageBase64);
  }
  for (const p of positions) {
    setAttributes(appendElement(el, 'position'), {
      characterId: p.characterId,
      col: p.col,
      row: p.row,
    });
  }
  return el;
}

export function readDungeonBoard(el: Element): DungeonXmlData {
  const d: DungeonBoardState = DEFAULT_DUNGEON_BOARD_STATE;
  const image: Element | null = firstChild(el, 'image');
  return {
    board: {
      boardImageBase64: image ? (image.textContent ?? '').trim() : null,
      gridColumns: readNumber(el, 'gridColumns', d.gridColumns),
      gridRows: readNumber(el, 'gridRows', d.gridRows),
      gridCellSizePx: readNumber(el, 'gridCellSizePx', d.gridCellSizePx),
      gridOffsetX: readNumber(el, 'gridOffsetX', d.gridOffsetX),
      gridOffsetY: readNumber(el, 'gridOffsetY', d.gridOffsetY),
      gridOpacity: readNumber(el, 'gridOpacity', d.gridOpacity),
    },
    positions: childElements(el, 'position').map((p) => ({
      characterId: readString(p, 'characterId'),
      col: readNumber(p, 'col'),
      row: readNumber(p, 'row'),
    })),
  };
}
