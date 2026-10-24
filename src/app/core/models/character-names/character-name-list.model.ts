/** Vor- und Nachnamen einer Charakterklasse für die Zufallsnamen. */
export interface CharacterNameList {
  /** Höchstens 8 Zeichen je Eintrag. */
  firstNames: string[];
  /** Höchstens 11 Zeichen je Eintrag; mit Vorname und Leerzeichen also höchstens 20 Zeichen. */
  lastNames: string[];
}
