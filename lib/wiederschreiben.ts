import { pruefeText } from "./schreibpruefer";
import type { Progress, WiederEintrag } from "./types";

/**
 * 🔁 M9 (R288, Experten-Audit): verbesserte Pflicht-Wiederholung.
 * Nach jeder Schreibkorrektur wird der erste Absatz für eine kurze
 * Neufassung in 48 Stunden vorgemerkt. Die Abgabe wird automatisch
 * mit denselben Muster-Kategorien verglichen (behoben / geblieben /
 * neu) — ein lokaler Mustervergleich, kein menschliches Urteil.
 */
export function ersterAbsatz(text: string): string {
  const absatz = text.split(/\n\s*\n/).map((s) => s.trim()).find((s) => s.length > 0) ?? text.trim();
  const woerter = absatz.split(/\s+/).filter(Boolean);
  return woerter.slice(0, 60).join(" ");
}

export function spaltenVon(text: string): string[] {
  return [...new Set(pruefeText(text).filter((b) => b.schwere !== "stil").map((b) => b.spalte))];
}

export function planeWiederschreiben(p: Progress, text: string, jetzt = new Date()): Progress {
  const absatz = ersterAbsatz(text);
  if (!absatz) return p;
  const liste = p.wiederschreiben ?? [];
  if (liste.some((e) => e.status === "offen" && e.absatz === absatz)) return p;
  const eintrag: WiederEintrag = {
    id: `ws-${jetzt.getTime()}`,
    erstellt: jetzt.toISOString(),
    faellig: new Date(jetzt.getTime() + 48 * 3600000).toISOString(),
    absatz,
    spalten: spaltenVon(text),
    status: "offen",
  };
  const behalten = [...liste].sort((a, b) => a.erstellt.localeCompare(b.erstellt)).slice(-11);
  return { ...p, wiederschreiben: [...behalten, eintrag] };
}

export function faelligeWiederschreiben(p: Progress, jetzt = new Date()): WiederEintrag[] {
  return (p.wiederschreiben ?? []).filter((e) => e.status === "offen" && e.faellig <= jetzt.toISOString());
}

export function vergleicheWiederschreiben(e: WiederEintrag, neuerText: string): { behoben: string[]; geblieben: string[]; neuHinzu: string[] } {
  const neu = spaltenVon(neuerText);
  return {
    behoben: e.spalten.filter((s) => !neu.includes(s)),
    geblieben: e.spalten.filter((s) => neu.includes(s)),
    neuHinzu: neu.filter((s) => !e.spalten.includes(s)),
  };
}

export function erledigeWiederschreiben(p: Progress, id: string, neuerText: string, jetzt = new Date()): Progress {
  return {
    ...p,
    wiederschreiben: (p.wiederschreiben ?? []).map((e) =>
      e.id === id
        ? { ...e, status: "erledigt" as const, erledigtAm: jetzt.toISOString(), vergleich: vergleicheWiederschreiben(e, neuerText) }
        : e
    ),
  };
}
