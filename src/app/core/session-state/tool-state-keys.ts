/**
 * localStorage-Keys für Werkzeug-Zustand außerhalb der Spielesession (z. B. Dungeon Builder).
 * Der `GameSessionService` kennt sie nicht: Sie stehen nicht in der SaveSession und eine neue
 * Session setzt sie nicht zurück. Werte nicht ändern, sonst gehen gespeicherte Stände verloren.
 */
export const TOOL_STATE_KEYS: {
  readonly dungeonBuilderLayout: 'dungeon_builder_layout';
  readonly dungeonBuilderRecent: 'dungeon_builder_recent';
  readonly sidebarSections: 'sidebar_sections';
  readonly collapsedSidebars: 'collapsed_sidebars';
  readonly cardViewerMenuOpen: 'card_viewer_menu_open';
} = {
  dungeonBuilderLayout: 'dungeon_builder_layout',
  /** Zuletzt verwendete Türen und Möbel der Bibliothek (Katalog-IDs, neueste zuerst). */
  dungeonBuilderRecent: 'dungeon_builder_recent',
  /** Zugeklappte Abschnitte der Seitenleisten aller Features. */
  sidebarSections: 'sidebar_sections',
  /** Eingeklappte Seitenleisten (`CollapsibleSidebar`) je Feature. */
  collapsedSidebars: 'collapsed_sidebars',
  /** Aufgeklapptes Aktionsmenü des Card Viewers (für alle Einsatzorte gleich). */
  cardViewerMenuOpen: 'card_viewer_menu_open',
};

export type ToolStateKey = (typeof TOOL_STATE_KEYS)[keyof typeof TOOL_STATE_KEYS];
