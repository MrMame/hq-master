export interface DungeonBoardState {
  boardImageBase64: string | null;
  gridColumns: number;
  gridRows: number;
  gridCellSizePx: number;
  gridOffsetX: number;
  gridOffsetY: number;
  gridOpacity: number;
}

export const DEFAULT_DUNGEON_BOARD_STATE: DungeonBoardState = {
  boardImageBase64: null,
  gridColumns: 10,
  gridRows: 10,
  gridCellSizePx: 60,
  gridOffsetX: 0,
  gridOffsetY: 0,
  gridOpacity: 0.4,
};
