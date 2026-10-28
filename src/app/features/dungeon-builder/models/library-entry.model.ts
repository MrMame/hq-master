/** Eintrag der Bibliothek (Bodenart, Tür, Möbel, Treppe, Hindernis). */
export interface LibraryItem {
  /** Katalog-ID; bei Fels `ROCK_ID`. */
  id: string;
  name: string;
  /** Grafik aus dem Katalog; leer bei einem reinen Farbfeld (Fels). */
  image: string;
  /** Größe in Kacheln, z. B. „3 × 2“; leer bei Böden und Türen. */
  size: string;
  /** Barrierefreier Name, z. B. „Tisch (3 × 2)“. */
  label: string;
  /** Farbfeld statt Grafik, z. B. für Fels. */
  swatch?: string;
}

/** Gruppe der Bibliothek, z. B. „Türen“ oder „Grundmöbel“. */
export interface LibraryGroup {
  /** Stabiler Teil der Abschnitts-ID, z. B. `doors` oder der Kategoriename. */
  key: string;
  name: string;
  items: LibraryItem[];
}

/** Zeigerposition beim Ziehen eines Eintrags aus der Bibliothek. */
export interface LibraryDrag {
  catalogId: string;
  clientX: number;
  clientY: number;
}

/** Eintrag „Fels“ der Bodengruppe; steht für keine Bodenart (`floorId` `null`). */
export const ROCK_ID: string = '';

export const FLOOR_GROUP_KEY: string = 'floor';
export const DOOR_GROUP_KEY: string = 'doors';
export const RECENT_GROUP_KEY: string = 'recent';
