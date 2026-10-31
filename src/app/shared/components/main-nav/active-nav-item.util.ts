import { MainNavItem } from './main-nav-items';

/** Eintrag, dessen Route zum Pfad der URL passt (Query und Fragment zählen nicht); sonst `undefined`. */
export function findNavItem(items: readonly MainNavItem[], url: string): MainNavItem | undefined {
  const path: string = url.split(/[?#]/)[0];
  return items.find(
    (item: MainNavItem) => path === item.route || path.startsWith(`${item.route}/`),
  );
}
