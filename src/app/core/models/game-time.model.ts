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

/** Vollständiger `GameTime` (inkl. Datum) aus einem `Date`, z. B. beim Laden eines Spielstands. */
export function gameTimeFromDate(date: Date): GameTime {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}
