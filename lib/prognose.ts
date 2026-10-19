import type { SrsState } from "./types";
import { abrufbarkeit, MAX_REVIEWS_PER_DAY } from "./srs";

/**
 * 📈 A2+A13 (R281, Experten-Audit): Retentions- und Fälligkeits-Prognose aus den
 * FSRS-Zuständen — reine Ableitung, keine Server, keine Fremddaten.
 *  • aktuelleRetention: mittleres FSRS-R aller eingeführten Karten.
 *  • Fälligkeits-Prognose: fällige Karten pro Kalendertag (aus `due`), Überfällige separat.
 *  • Retentionskurve ohne Wiederholung: mittleres R in +7/+14/+30 Tagen (Warnung, kein Urteil).
 *  • Kohorten A13: Karten, die vor ~30/~90 Tagen eingeführt wurden — Anteil mit R ≥ 0.85 heute.
 * Ehrlichkeit: Modell-Schätzung des FSRS, keine beobachtete menschliche Leistung.
 */
export interface PrognoseTag { datum: string; faellig: number }
export interface Kohorte { tage: 30 | 90; n: number; quote: number | null }
export interface Prognose {
  karten: number;
  retention: number | null;
  ueberfaellig: number;
  tage: PrognoseTag[];
  spitze: number;
  spitzenWarnung: boolean;
  kurve: { inTagen: number; retention: number | null }[];
  kohorten: Kohorte[];
}

const tagIso = (d: Date) => d.toISOString().slice(0, 10);

export function prognose(srs: Record<string, SrsState>, now = new Date(), tage = 7): Prognose {
  const karten = Object.values(srs).filter((st) => st.reps > 0 && st.stab !== undefined);
  const mittel = (werte: (number | null)[]) => {
    const v = werte.filter((x): x is number => x !== null);
    return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 1000) / 1000 : null;
  };
  const heute = tagIso(now);
  const faelligProTag = new Map<string, number>();
  let ueberfaellig = 0;
  for (const st of karten) {
    const d = (st.due ?? "").slice(0, 10);
    if (!d) continue;
    if (d < heute) ueberfaellig += 1;
    else faelligProTag.set(d, (faelligProTag.get(d) ?? 0) + 1);
  }
  const tageListe: PrognoseTag[] = [];
  for (let i = 0; i < tage; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const iso = tagIso(d);
    tageListe.push({ datum: iso, faellig: faelligProTag.get(iso) ?? 0 });
  }
  const kohorte = (ziel: 30 | 90): Kohorte => {
    const von = new Date(now.getTime() - (ziel + 10) * 86400000).getTime();
    const bis = new Date(now.getTime() - (ziel - 5) * 86400000).getTime();
    const gruppe = karten.filter((st) => {
      if (st.reps < 2 || !st.introduced) return false;
      const t = new Date(st.introduced).getTime();
      return t >= von && t <= bis;
    });
    const okAnteil = gruppe.filter((st) => (abrufbarkeit(st, now) ?? 0) >= 0.85).length;
    return { tage: ziel, n: gruppe.length, quote: gruppe.length ? Math.round((okAnteil / gruppe.length) * 1000) / 1000 : null };
  };
  return {
    karten: karten.length,
    retention: mittel(karten.map((st) => abrufbarkeit(st, now))),
    ueberfaellig,
    tage: tageListe,
    spitze: Math.max(0, ...tageListe.map((t) => t.faellig)),
    spitzenWarnung: tageListe.some((t) => t.faellig > MAX_REVIEWS_PER_DAY),
    kurve: [7, 14, 30].map((h) => ({ inTagen: h, retention: mittel(karten.map((st) => abrufbarkeit(st, now, h))) })),
    kohorten: [kohorte(30), kohorte(90)],
  };
}
