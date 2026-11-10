/**
 * Gemeinsame deterministische Zufallsquelle für Plan und Aufgabengeneratoren.
 * Park–Miller mit sicherem Modulo statt Math.abs: negative Seeds bleiben
 * plattformübergreifend stabil und unterscheiden sich von ihren Gegenwerten.
 */
const MOD = 2147483647;
const MULTIPLIKATOR = 16807;

export function rng(seed: number): () => number {
  let zustand = Math.floor(seed) % MOD;
  if (zustand <= 0) zustand += MOD - 1;
  if (zustand <= 0 || zustand >= MOD) zustand = 1;
  return () => {
    zustand = (zustand * MULTIPLIKATOR) % MOD;
    return (zustand - 1) / (MOD - 1);
  };
}

/** Fisher–Yates ohne Mutation; nimmt einen Seed oder eine bestehende Zufallsquelle. */
export function seededShuffle<T>(
  werte: readonly T[],
  seedOderZufall: number | (() => number)
): T[] {
  const zufall = typeof seedOderZufall === "number" ? rng(seedOderZufall) : seedOderZufall;
  const ergebnis = [...werte];
  for (let index = ergebnis.length - 1; index > 0; index--) {
    const tauschIndex = Math.floor(zufall() * (index + 1));
    [ergebnis[index], ergebnis[tauschIndex]] = [ergebnis[tauschIndex], ergebnis[index]];
  }
  return ergebnis;
}
