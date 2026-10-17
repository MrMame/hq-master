/**
 * Alle localStorage-Keys, unter denen Session-Zustand liegt.
 * Werte nicht ändern: sonst werden vorhandene Spielstände im Browser nicht mehr gefunden.
 */
export const SESSION_KEYS: {
  readonly characters: 'characters';
  readonly gameTime: 'game_time';
  readonly dungeonBoard: 'dungeon_board';
  readonly dungeonPositions: 'dungeon_positions';
  readonly deckState: 'card_manager_deck_state';
  readonly sessionMeta: 'game_session_meta';
} = {
  characters: 'characters',
  gameTime: 'game_time',
  dungeonBoard: 'dungeon_board',
  dungeonPositions: 'dungeon_positions',
  deckState: 'card_manager_deck_state',
  sessionMeta: 'game_session_meta',
};

export type SessionStateKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS];
