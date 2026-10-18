import type { Progress, Level } from "./types";
import { PHASEN } from "./phasen";
import { alleVokabeln } from "./content";
import { abrufbarkeit } from "./srs";

/**
 * 🔧 A17 (R284, Experten-Audit ← N29): Wartungs-Bericht für abgeschlossene
 * Stufen — was in A0/A1/A2 gelernt wurde, darf in B1/B2 nicht zerfallen.
 * Der SRS-Fälligkeitsstrom trägt die Karten bereits (Fällige zuerst, LX0e);
 * dieser Bericht macht den Wartungsstand je Stufe sichtbar.
 */
export interface WartungZeile { level: Level; karten: number; retention: number | null; faellig: number; abgeschlossen: boolean }
export interface WartungBericht { zeilen: WartungZeile[]; faelligGesamt: number }

const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2"];

export function wartungsBericht(p: Progress, now = new Date()): WartungBericht {
  const stufeVon = new Map<string, string>();
  for (const k of alleVokabeln) if (k.level) stufeVon.set(k.id, k.level);
  const heute = now.toISOString().slice(0, 10);
  const zeilen: WartungZeile[] = LEVELS.map((level) => {
    const karten = Object.entries(p.srs ?? {}).filter(([id, st]) => st.reps > 0 && stufeVon.get(id) === level);
    const rs = karten.map(([, st]) => abrufbarkeit(st, now)).filter((x): x is number => x !== null);
    return {
      level,
      karten: karten.length,
      retention: rs.length ? Math.round((rs.reduce((a, b) => a + b, 0) / rs.length) * 1000) / 1000 : null,
      faellig: karten.filter(([, st]) => (st.due ?? "") <= heute && st.reps > 0).length,
      abgeschlossen: PHASEN[level].bis < p.plan.day,
    };
  }).filter((z) => z.karten > 0);
  return { zeilen, faelligGesamt: zeilen.reduce((a, z) => a + z.faellig, 0) };
}
