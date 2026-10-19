import { KOMPETENZEN } from "./kompetenz";
import type { Kompetenz, Progress } from "./types";

/**
 * ⚖️ M3 (R287, Experten-Audit): weiche Skill-Umschichtung.
 * Dominiert eine Fertigkeit in den datierten Versuchen der letzten
 * 14 Tage mit mehr als 60%, schlägt der Plan eine konkrete
 * Umverteilung für freie Übung vor und begründet sie.
 * Pflichtaufgaben des 378-Tage-Plans bleiben unverändert.
 */
export interface SkillUmschichtung {
  eintraege: number;
  dominant: Kompetenz | null;
  anteil: number;
  vonMinuten: number;
  ziele: { hand: Kompetenz; minuten: number; anteil: number }[];
}

export function skillUmschichtung(p: Progress, jetzt = new Date()): SkillUmschichtung {
  const grenze = new Date(jetzt.getTime() - 13 * 86400000).toISOString().slice(0, 10);
  const basis = (p.kompetenzLog ?? []).filter((e) => e.d && e.d >= grenze);
  const leer: SkillUmschichtung = { eintraege: basis.length, dominant: null, anteil: 0, vonMinuten: 0, ziele: [] };
  if (basis.length < 20) return leer;

  const zeilen = KOMPETENZEN.map((hand) => {
    const n = basis.filter((e) => e.h === hand).length;
    return { hand, n, anteil: n / basis.length };
  }).sort((a, b) => b.anteil - a.anteil || a.hand.localeCompare(b.hand));
  const dominant = zeilen[0];
  if (!dominant || dominant.anteil <= 0.6) return leer;

  const ziele = [...zeilen]
    .filter((z) => z.hand !== dominant.hand)
    .sort((a, b) => a.anteil - b.anteil || a.hand.localeCompare(b.hand))
    .slice(0, 2)
    .map((z) => ({ hand: z.hand, minuten: 10, anteil: Math.round(z.anteil * 1000) / 1000 }));

  return {
    eintraege: basis.length,
    dominant: dominant.hand,
    anteil: Math.round(dominant.anteil * 1000) / 1000,
    vonMinuten: 20,
    ziele,
  };
}
