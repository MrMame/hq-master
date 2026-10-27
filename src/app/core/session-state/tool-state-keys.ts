/**
 * localStorage-Keys für Werkzeug-Zustand außerhalb der Spielesession (z. B. Dungeon Builder).
 * Der `GameSessionService` kennt sie nicht: Sie stehen nicht in der SaveSession und eine neue
 * Session setzt sie nicht zurück. Werte nicht ändern, sonst gehen gespeicherte Stände verloren.
 */
export const TOOL_STATE_KEYS: {
  readonly dungeonBuilderLayout: 'dungeon_builder_layout';
} = {
  dungeonBuilderLayout: 'dungeon_builder_layout',
};

export type ToolStateKey = (typeof TOOL_STATE_KEYS)[keyof typeof TOOL_STATE_KEYS];
