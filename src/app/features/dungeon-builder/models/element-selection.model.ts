/** Verweis auf ein platziertes Element, z. B. für Markierung, Verschieben und Drehen. */
export interface ElementSelection {
  kind: 'piece' | 'wall' | 'door';
  id: string;
}
