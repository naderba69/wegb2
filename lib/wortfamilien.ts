import { alleVokabeln } from "./content";
import type { VocabCard } from "./types";

/**
 * 🌳 A22 (R293, Experten-Audit): Wortfamilien & systematische
 * Ableitung. Familien werden aus dem eigenen Vokabelbank-Bestand
 * per Stamm-Heuristik gruppiert; Übungsantworten sind immer
 * bankbelegte Formen. Die Gruppierung ist als automatisch und
 * annähernd gekennzeichnet — nicht als Etymologie.
 */
export interface FamilienMitglied {
  karte: VocabCard;
  suffix: string;
}

export interface WortFamilie {
  stamm: string;
  mitglieder: FamilienMitglied[];
  suffixe: string[];
}

const SUFFIXE = [
  "ungen", "heit", "keit", "schaft", "ungen", "ung", "isch", "lich", "bar", "los", "nis", "tum", "ig", "ern", "en", "er", "e", "n", "t", "s",
].sort((a, b) => b.length - a.length);

const falte = (w: string) =>
  w.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");

export function stammVon(wort: string): { stamm: string; suffix: string } {
  const k = falte(wort).replace(/[^a-z]/g, "");
  for (const suf of SUFFIXE) {
    if (k.length - suf.length >= 4 && k.endsWith(suf)) {
      return { stamm: k.slice(0, k.length - suf.length), suffix: suf };
    }
  }
  return { stamm: k, suffix: "" };
}

let cache: WortFamilie[] | null = null;

export function wortfamilien(minMitglieder = 3, limit = 24): WortFamilie[] {
  if (cache) return cache.slice(0, limit);
  const gruppen = new Map<string, FamilienMitglied[]>();
  for (const karte of alleVokabeln) {
    const rein = karte.de.replace(/^(der|die|das)\s+/i, "").split(/[\s,]/)[0];
    if (!rein || rein.length < 4) continue;
    const { stamm, suffix } = stammVon(rein);
    const eintrag: FamilienMitglied = { karte, suffix };
    gruppen.set(stamm, [...(gruppen.get(stamm) ?? []), eintrag]);
  }
  cache = [...gruppen.entries()]
    .filter(([, m]) => new Set(m.map((x) => x.karte.id)).size >= minMitglieder)
    .map(([stamm, mitglieder]) => ({
      stamm,
      mitglieder,
      suffixe: [...new Set(mitglieder.map((m) => m.suffix).filter(Boolean))],
    }))
    .sort((a, b) => b.mitglieder.length - a.mitglieder.length || a.stamm.localeCompare(b.stamm));
  return cache.slice(0, limit);
}

export interface AbleitungsFrage {
  stamm: string;
  frageAr: string;
  optionen: string[];
  richtig: number;
}

export function ableitungsFrage(familie: WortFamilie, index: number): AbleitungsFrage {
  const ziel = familie.mitglieder[index % familie.mitglieder.length];
  const form = ziel.karte.de.replace(/^(der|die|das)\s+/i, "").split(/[\s,]/)[0];
  const falscheSuffixe = ["ung", "heit", "keit", "bar", "los", "isch"].filter((s) => s !== ziel.suffix);
  const optionen = [form, `${familie.stamm}${falscheSuffixe[0]}`, `${familie.stamm}${falscheSuffixe[1]}`];
  const richtig = index % 3;
  const [echt] = optionen.splice(0, 1);
  optionen.splice(richtig, 0, echt);
  return {
    stamm: familie.stamm,
    frageAr: `أيّ شكل موجود فعلًا في بنك مفرداتك من عائلة «${familie.stamm}…»؟`,
    optionen,
    richtig,
  };
}
