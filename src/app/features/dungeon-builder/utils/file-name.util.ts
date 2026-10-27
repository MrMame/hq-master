const UMLAUTS: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };

/** Dateiname aus dem Layoutnamen, z. B. „Gruft des Hexers“ → `gruft-des-hexers.xml`. */
export function layoutFileName(layoutName: string, extension: 'xml' | 'jpg'): string {
  const slug: string = layoutName
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => UMLAUTS[char])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'dungeon-layout'}.${extension}`;
}
