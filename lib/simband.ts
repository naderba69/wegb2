import type { Progress } from "./types";

/**
 * 🎯 M5 (R286, Experten-Audit ← N3): vereinfachtes Vertrauensband für
 * Simulationsergebnisse — Mittelwert ± halbe Spannweite der eigenen Versuche
 * je Fertigkeit. Ehrlich: Streuung der eigenen Trainingswerte, kein
 * psychometrischer Messfehler und keine Prognose.
 */
export type SimKey = "lesen" | "hoeren" | "schreiben" | "sprechen";
export interface SimBandZeile {
  key: SimKey;
  evidenceType: "local_auto_grader" | "self_report";
  n: number;
  mittel: number;
  band: number | null;
  min: number;
  max: number;
}

export const SIM_KEYS: SimKey[] = ["lesen", "hoeren", "schreiben", "sprechen"];

export function simBand(p: Progress): SimBandZeile[] {
  const sims = p.simulationen ?? [];
  return SIM_KEYS.map((key) => {
    const evidenceType = key === "schreiben" || key === "sprechen" ? "self_report" as const : "local_auto_grader" as const;
    const werte = sims.map((s) => s.punkte[key]).filter((x) => typeof x === "number");
    if (!werte.length) return { key, evidenceType, n: 0, mittel: 0, band: null, min: 0, max: 0 };
    const min = Math.min(...werte);
    const max = Math.max(...werte);
    return {
      key,
      evidenceType,
      n: werte.length,
      mittel: Math.round(werte.reduce((a, b) => a + b, 0) / werte.length),
      band: werte.length >= 2 ? Math.round((max - min) / 2) : null,
      min,
      max,
    };
  });
}
