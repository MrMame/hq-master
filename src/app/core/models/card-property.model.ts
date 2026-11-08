/**
 * Eigenschaft einer Karte aus `<property name="…" value="…"/>`, z. B. „Leben +30“ oder „Abwehr -1“. Der Name ist
 * zugleich der Name der Eigenschaft am Charakter (exakt, Groß-/Kleinschreibung zählt); der Wert ist eine ganze Zahl.
 */
export interface CardProperty {
  name: string;
  value: number;
}
