/**
 * ⏱️ A3 (R283, Experten-Audit ← N5): Fluenz-Messung — Lesetempo in Woertern/Minute,
 * gemessen vom Oeffnen eines Leiter-Textes bis zur Abgabe (Lesen + Fragen ehrlich
 * als Gesamtzeit deklariert). Zielbaender sind interne Orientierung aus der
 * Leseforschung fuer L2-Lesende, keine amtlichen CEFR-Messwerte.
 */
export function leseWpm(woerter: number, sekunden: number): number {
  if (woerter <= 0 || sekunden < 5) return 0;
  return Math.round(woerter / (sekunden / 60));
}

/** Orientierungsband je Leseleiter-Stufe (1..6) in WpM */
export const FLUENZ_ZIEL: Record<number, { von: number; bis: number }> = {
  1: { von: 30, bis: 60 },
  2: { von: 45, bis: 75 },
  3: { von: 60, bis: 90 },
  4: { von: 75, bis: 105 },
  5: { von: 90, bis: 120 },
  6: { von: 100, bis: 140 },
};

export function fluenzBand(wpm: number, stufe: number): "unter" | "im-band" | "ueber" {
  const z = FLUENZ_ZIEL[stufe] ?? FLUENZ_ZIEL[3];
  if (wpm < z.von) return "unter";
  if (wpm > z.bis) return "ueber";
  return "im-band";
}
