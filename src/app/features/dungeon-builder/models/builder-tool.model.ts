/** Werkzeuge des Werkzeugstreifens. */
export type StripToolKind = 'select' | 'brush' | 'rectangle' | 'fill' | 'eraser' | 'wall';

/** Aktives Werkzeug; `stamp` setzt bei jedem Tipp eine Kopie des Katalogeintrags. */
export type BuilderTool = { kind: StripToolKind } | { kind: 'stamp'; catalogId: string };

/** Werkzeuge, die die gewählte Bodenart nutzen. */
export const FLOOR_TOOLS: readonly StripToolKind[] = ['brush', 'rectangle', 'fill'];

/** Reihenfolge, Beschriftung und Icon der Werkzeuge im Streifen. */
export const STRIP_TOOLS: readonly { kind: StripToolKind; label: string; icon: string }[] = [
  { kind: 'select', label: 'Auswahl', icon: './img/tool-select.svg' },
  { kind: 'brush', label: 'Pinsel', icon: './img/tool-brush.svg' },
  { kind: 'rectangle', label: 'Rechteck', icon: './img/tool-rectangle.svg' },
  { kind: 'fill', label: 'Füllen', icon: './img/tool-fill.svg' },
  { kind: 'eraser', label: 'Radierer', icon: './img/tool-eraser.svg' },
  { kind: 'wall', label: 'Wand', icon: './img/tool-wall.svg' },
];
