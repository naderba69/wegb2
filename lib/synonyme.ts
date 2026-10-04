import raw from "@/content/synonyme-kontext.json";
import type { VocabCard } from "./types";

export type SynonymKontextEintrag = {
  basisKollokation: string;
  alternativKollokation: string;
  basisDe: string;
  basisAr: string;
  alternativDe: string;
  alternativAr: string;
  nuanceAr: string;
};

type SynonymKontextBank = Record<string, Record<string, SynonymKontextEintrag>>;
const bank = raw as SynonymKontextBank;

const norm = (value: string) => value.trim().toLowerCase();
const lemmaVon = (de: string) => norm(de).replace(/^(der|die|das)\s+/i, "");

/** يعيد فقط المرادفات التي لها أمثلة متقابلة وملاحظة سياقية مُنتَجة. */
export function synonymKontexteFuer(card: VocabCard): { synonym: string; kontext: SynonymKontextEintrag }[] {
  const kontexte = bank[lemmaVon(card.de)];
  if (!kontexte) return [];
  const erlaubteSynonyme = new Set((card.syn ?? []).map(norm));
  return Object.entries(kontexte)
    .filter(([synonym]) => erlaubteSynonyme.has(norm(synonym)))
    .map(([synonym, kontext]) => ({ synonym, kontext }));
}

export function synonymKontextAnzahl(): number {
  return Object.values(bank).reduce((sum, eintraege) => sum + Object.keys(eintraege).length, 0);
}
