/**
 * Ingame-Zeitpunkt.
 * Nicht angegebene Datumsteile (year, month, day) bleiben unverändert,
 * nicht angegebene Uhrzeitteile (hours, minutes, seconds) zählen als 0.
 * `month` ist 1-basiert (1 = Januar).
 */
export interface GameTime {
  year?: number;
  month?: number;
  day?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}
