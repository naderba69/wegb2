import { bankRoh, beiBankenBereit } from "./bankload";
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
const bank = {} as SynonymKontextBank;
/** R163: in Node sofort befüllt, im Browser nach /banks.json. */
function fuelleSynonyme(): void {
  const r = bankRoh("synonyme-kontext.json");
  if (r) Object.assign(bank, r);
}
fuelleSynonyme();
beiBankenBereit(fuelleSynonyme);

const norm = (value: string) => value.trim().toLowerCase();
const bankNachQuelle = new Map(Object.entries(bank).map(([quelle, eintraege]) => [norm(quelle), eintraege]));
const lemmaVon = (de: string) => norm(de).replace(/^(der|die|das)\s+/i, "");

/** يعيد فقط المرادفات التي لها أمثلة متقابلة وملاحظة سياقية مُنتَجة. */
export function synonymKontexteFuer(card: VocabCard): { synonym: string; kontext: SynonymKontextEintrag }[] {
  const kontexte = bankNachQuelle.get(norm(card.de)) ?? bankNachQuelle.get(lemmaVon(card.de));
  if (!kontexte) return [];
  const erlaubteSynonyme = new Set((card.syn ?? []).map(norm));
  return Object.entries(kontexte)
    .filter(([synonym]) => erlaubteSynonyme.has(norm(synonym)))
    .map(([synonym, kontext]) => ({ synonym, kontext }));
}

export function synonymKontextAnzahl(): number {
  return Object.values(bank).reduce((sum, eintraege) => sum + Object.keys(eintraege).length, 0);
}
