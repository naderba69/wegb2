import { alleVokabeln } from "./content";
import { buildDay } from "./plan";
import type { Progress, TaskKind } from "./types";

/**
 * 🗓️ M19 (R290, Experten-Audit): lokaler Wochenbericht —
 * Minuten je Aufgabenart (diese Woche), neu produktive Wörter,
 * wiederkehrende Fehler, Plan der nächsten Woche.
 * Alles aus dem lokalen Verlauf; geplante Minuten sind als
 * Schätzung gekennzeichnet, gemessene bevorzugt.
 */
export interface WochenBericht {
  von: string;
  bis: string;
  minutenProArt: { art: string; minuten: number }[];
  produktivNeu: { anzahl: number; woerter: string[] };
  fehlerWiederholt: { falsch: string; richtig: string; treffer: number }[];
  naechsteWoche: { day: number; typ: string; phase: string; minuten: number }[];
}

const ART_AR: Partial<Record<TaskKind, string>> = {
  hoeren: "استماع",
  lesen: "قراءة",
  schreiben: "كتابة",
  sprechen: "تحدّث",
  aussprache: "نطق",
  grammatik: "قواعد",
  wortschatz: "مفردات",
  wiederholen: "مراجعة",
  check: "فحص",
};

const montagVon = (jetzt: Date): string => {
  const d = new Date(Date.UTC(jetzt.getUTCFullYear(), jetzt.getUTCMonth(), jetzt.getUTCDate()));
  const wd = (d.getUTCDay() + 6) % 7; // Montag = 0
  d.setUTCDate(d.getUTCDate() - wd);
  return d.toISOString().slice(0, 10);
};

export function wochenBericht(p: Progress, jetzt = new Date()): WochenBericht {
  const von = montagVon(jetzt);
  const bis = jetzt.toISOString().slice(0, 10);

  const proArt = new Map<string, number>();
  for (const r of Object.values(p.plan.tasks ?? {})) {
    if (!r.at || r.at.slice(0, 10) < von) continue;
    const label = (r.kind && ART_AR[r.kind]) || r.kind || "—";
    proArt.set(label, (proArt.get(label) ?? 0) + (r.minutenEffektiv ?? r.geplantMin ?? 0));
  }

  const neuKarten = Object.entries(p.srs ?? {})
    .filter(([, st]) => st.introduced && st.introduced.slice(0, 10) >= von && st.reps >= 2)
    .map(([id]) => alleVokabeln.find((k) => k.id === id)?.de ?? id);

  const fehlerWiederholt = Object.values(p.fehler ?? {})
    .filter((f) => (f.treffer ?? 0) >= 2)
    .sort((a, b) => (b.treffer ?? 0) - (a.treffer ?? 0))
    .slice(0, 6)
    .map((f) => ({ falsch: f.falsch, richtig: f.richtig, treffer: f.treffer ?? 0 }));

  const naechsteWoche: WochenBericht["naechsteWoche"] = [];
  for (let d = p.plan.day + 1; d <= Math.min(p.plan.day + 7, 378); d++) {
    const plan = buildDay(d, p);
    naechsteWoche.push({ day: d, typ: plan.type, phase: plan.phase, minuten: plan.tasks.reduce((a, t) => a + t.minutes, 0) });
  }

  return {
    von,
    bis,
    minutenProArt: [...proArt.entries()].map(([art, minuten]) => ({ art, minuten: Math.round(minuten) })).sort((a, b) => b.minuten - a.minuten),
    produktivNeu: { anzahl: neuKarten.length, woerter: neuKarten.slice(0, 10) },
    fehlerWiederholt,
    naechsteWoche,
  };
}
