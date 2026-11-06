/** Neue, zufällig gemischte Liste (Fisher-Yates); die Eingabe bleibt unverändert. */
export function shuffled<T>(items: readonly T[]): T[] {
  const result: T[] = [...items];
  for (let i: number = result.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
