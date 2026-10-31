/** Ein Eintrag der Hauptnavigation. */
export interface MainNavItem {
  readonly label: string;
  readonly route: string;
}

/**
 * Alle Seiten der Hauptnavigation in Anzeigereihenfolge. Linkleiste, Menü und Seitenname lesen
 * daraus; ein neues Feature wird nur hier ergänzt.
 */
export const MAIN_NAV_ITEMS: readonly MainNavItem[] = [
  { label: 'Game Session', route: '/gamesession' },
  { label: 'Card Manager', route: '/cardmanager' },
  { label: 'Time Tracker', route: '/timetracker' },
  { label: 'Dungeon Tracker', route: '/dungeontracker' },
  { label: 'Dungeon Builder', route: '/dungeonbuilder' },
];
