/** Punkte für eine richtige Antwort: erster Versuch voll, jeder spätere Versuch halb. */
export function punkteFuerRichtigenVersuch(maxPoints: number, versuch: number): number {
  if (!Number.isFinite(maxPoints) || maxPoints < 0) return 0;
  return versuch <= 1 ? maxPoints : maxPoints / 2;
}
