import { texts, dialogues, sentences } from "./content";
import type { VocabCard } from "./types";
import { stammVon } from "./verknuepfung";

/**
 * 📊 M11 (R286, Experten-Audit ← N21-Anzeige): Häufigkeits-Badge aus dem
 * App-eigenen Korpus (Lesetexte + Dialoge + Aufnahmesätze). Ehrlich begrenzt:
 * gezählt wird das Vorkommen im App-Korpus — kein Goethe-/Frequenzlisten-Abgleich
 * (das bleibt A21); „kommt hier nicht vor" heißt nicht „selten im Deutschen".
 */
export type FrequenzStufe = "sehr-haeufig" | "haeufig" | "selten" | "nicht-im-korpus";
export const FREQUENZ_AR: Record<FrequenzStufe, string> = {
  "sehr-haeufig": "شائع جدًا في نصوص التطبيق",
  "haeufig": "شائع في نصوص التطبيق",
  "selten": "يظهر قليلًا في نصوص التطبيق",
  "nicht-im-korpus": "لا يظهر في نصوص التطبيق",
};

let cache: Map<string, number> | null = null;

function korpus(): Map<string, number> {
  if (cache) return cache;
  const m = new Map<string, number>();
  const zaehle = (text: string) => {
    for (const tok of text.toLowerCase().replace(/[.,!?;:()„“"«»–—-]/g, " ").split(/\s+/)) {
      const st = stammVon(tok);
      if (st) m.set(st, (m.get(st) ?? 0) + 1);
    }
  };
  for (const t of texts) zaehle(t.de ?? "");
  for (const d of dialogues) for (const l of d.lines ?? []) zaehle(l.de ?? "");
  for (const s of sentences) zaehle(s.de ?? "");
  cache = m;
  return m;
}

export function frequenzVonWort(de: string): { n: number; stufe: FrequenzStufe } {
  const lemma = de.replace(/^(der|die|das)\s+/i, "").split(/[\s,]/)[0] ?? "";
  const n = korpus().get(stammVon(lemma.toLowerCase())) ?? 0;
  const stufe: FrequenzStufe = n >= 10 ? "sehr-haeufig" : n >= 4 ? "haeufig" : n >= 1 ? "selten" : "nicht-im-korpus";
  return { n, stufe };
}

export function frequenzStufe(karte: VocabCard): { n: number; stufe: FrequenzStufe } {
  return frequenzVonWort(karte.de);
}
