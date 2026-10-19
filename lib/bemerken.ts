import { grammarMap } from "./content";
import { grammatikImText } from "./grammatikRadar";
import { grammarAssignmentForDay } from "./plan";
import type { Progress } from "./types";

/**
 * 🔎 M10 (R290, Experten-Audit): Noticing — die neue Regel der Woche
 * wird in den Lesetexten der Woche gesucht: erster Beleg farbig
 * markiert + genau eine Beobachtungsfrage.
 * Ehrlichkeit: der Beleg kommt aus dem Oberflächen-Radar
 * (lib/grammatikRadar) — ein Musterfund im Text, kein Parse.
 */
export interface WochenRegel {
  id: string;
  titelDe: string;
  titelAr: string;
}

export function wochenNeueRegeln(p: Progress, day: number): WochenRegel[] {
  const wochenStart = day - ((day - 1) % 7);
  const gesehen = new Set<string>();
  const regeln: WochenRegel[] = [];
  for (let d = wochenStart; d <= day; d++) {
    const a = grammarAssignmentForDay(d, p);
    if (a && a.status === "new" && !gesehen.has(a.topicId)) {
      gesehen.add(a.topicId);
      const t = grammarMap[a.topicId];
      regeln.push({ id: a.topicId, titelDe: t?.titleDe ?? a.topicId, titelAr: t?.titleAr ?? a.topicId });
    }
  }
  return regeln;
}

export interface BemerkenFrage {
  topicId: string;
  nameDe: string;
  nameAr: string;
  beleg: string;
  belegSatz: string;
  saetze: string[];
  richtig: number;
}

const saetzeVon = (text: string): string[] =>
  text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 12);

export function bemerkenFrage(textDe: string, regeln: WochenRegel[]): BemerkenFrage | null {
  if (regeln.length === 0) return null;
  const ids = new Set(regeln.map((r) => r.id));
  const fund = grammatikImText(textDe, 12).find((f) => ids.has(f.topicId));
  if (!fund) return null;
  const saetze = saetzeVon(textDe);
  const belegSatz = saetze.find((s) => s.includes(fund.beleg)) ?? fund.beleg;
  const ablenker = saetze.filter((s) => s !== belegSatz).slice(0, 2);
  if (ablenker.length === 0) return null;
  const optionen = [...ablenker];
  const dreh = (fund.topicId.length + fund.beleg.length) % (ablenker.length + 1);
  optionen.splice(dreh, 0, belegSatz);
  return {
    topicId: fund.topicId,
    nameDe: fund.nameDe,
    nameAr: fund.nameAr,
    beleg: fund.beleg,
    belegSatz,
    saetze: optionen,
    richtig: optionen.indexOf(belegSatz),
  };
}
