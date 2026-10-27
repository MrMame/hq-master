/** Ziehbarer Eintrag der Bibliothek (Tür, Möbel, Treppe, Hindernis). */
export interface LibraryItem {
  id: string;
  name: string;
  image: string;
  /** Größe in Kacheln, z. B. „3 × 2“; leer bei Türen. */
  size: string;
  /** Barrierefreier Name, z. B. „Tisch (3 × 2)“. */
  label: string;
}

/** Gruppe der Bibliothek, z. B. „Türen“ oder „Grundmöbel“. */
export interface LibraryGroup {
  name: string;
  items: LibraryItem[];
}

/** Zeigerposition beim Ziehen eines Eintrags aus der Bibliothek. */
export interface LibraryDrag {
  catalogId: string;
  clientX: number;
  clientY: number;
}
