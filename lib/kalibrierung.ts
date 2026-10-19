import { KOMPETENZEN } from "./kompetenz";
import { abrufbarkeit } from "./srs";
import type { Kompetenz, Progress } from "./types";

/**
 * 🎚️ M4 (R288, Experten-Audit): Schwierigkeits-Kalibrierung aus den
 * eigenen Daten des Lernenden — keine externen Normen:
 *  · Skill-Trends: Erfolgsquoten der letzten 14 Tage gegen die
 *    14 Tage davor (nur datierte Versuche zählen).
 *  · Karten-Ausreißer: hartnäckige Karten (viele Lapses trotz
 *    Wiederholungen) werden zur bewussten Reparatur aufgelistet.
 *    Die automatische Reaktion existiert bereits: FSRS senkt ihre
 *    Stabilität und legt sie früher wieder vor.
 */
export interface SkillTrend {
  hand: Kompetenz;
  aktuell: number | null;
  vorher: number | null;
  nAktuell: number;
  nVorher: number;
  richtung: "schwerer" | "leichter" | "stabil" | "neu";
}

const tag = (d: Date) => d.toISOString().slice(0, 10);

export function skillTrends(p: Progress, jetzt = new Date()): SkillTrend[] {
  const heute = tag(jetzt);
  const vor14 = tag(new Date(jetzt.getTime() - 14 * 86400000));
  const vor28 = tag(new Date(jetzt.getTime() - 28 * 86400000));
  const log = (p.kompetenzLog ?? []).filter((e) => e.d);
  return KOMPETENZEN.map((hand) => {
    const aktuellE = log.filter((e) => e.h === hand && e.d! > vor14 && e.d! <= heute);
    const vorherE = log.filter((e) => e.h === hand && e.d! > vor28 && e.d! <= vor14);
    const quote = (xs: typeof log) => (xs.length ? xs.filter((e) => e.ok).length / xs.length : null);
    const aktuell = quote(aktuellE);
    const vorher = quote(vorherE);
    let richtung: SkillTrend["richtung"] = "neu";
    if (aktuell !== null && vorher !== null && vorherE.length >= 5 && aktuellE.length >= 5) {
      const d = aktuell - vorher;
      richtung = d >= 0.1 ? "schwerer" : d <= -0.1 ? "leichter" : "stabil";
    } else if (aktuell !== null) richtung = "stabil";
    return { hand, aktuell, vorher, nAktuell: aktuellE.length, nVorher: vorherE.length, richtung };
  });
}

export interface AusreisserKarte {
  id: string;
  lapses: number;
  reps: number;
  abruf: number | null;
}

export function kartenAusreisser(p: Progress, jetzt = new Date(), limit = 8): { hartnaeckig: AusreisserKarte[]; sicherAnzahl: number } {
  const alle = Object.entries(p.srs ?? {});
  const hartnaeckig = alle
    .filter(([, st]) => st.reps >= 3 && st.lapses >= 2)
    .map(([id, st]) => ({ id, lapses: st.lapses, reps: st.reps, abruf: abrufbarkeit(st, jetzt) }))
    .sort((a, b) => b.lapses - a.lapses || (a.abruf ?? 1) - (b.abruf ?? 1))
    .slice(0, limit);
  const sicherAnzahl = alle.filter(([, st]) => st.reps >= 4 && st.lapses === 0 && (st.stab ?? 0) >= 45).length;
  return { hartnaeckig, sicherAnzahl };
}
