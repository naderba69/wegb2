import { alleVokabeln, dialogues, sentences, texts } from "./content";
import type { Level, Progress, VocabCard } from "./types";

/**
 * PA-020 — honest lexical inventory.
 * Cards are not headwords: normalize/deduplicate them, split single words from
 * multiword units, and report only attestation in the app's own documented corpus.
 * No Goethe/CEFR coverage ratio and no productive-vocabulary claim is inferred.
 */
export type LexikArt = "einzelwort" | "mehrwort";
export interface LexikEinheit {
  lemma: string;
  art: LexikArt;
  level: Level;
  karten: VocabCard[];
  imAppKorpus: boolean;
  korpusTreffer: number;
}

export interface ReferenzZeile {
  level: Level;
  eindeutigHier: number;
  kumuliertEindeutig: number;
  einzelwoerter: number;
  mehrwortEinheiten: number;
  rezeptivImAppKorpus: number;
  rezeptivAbdeckungPct: number;
  produktivAusgewiesen: null;
}

export interface LexikUebersicht {
  roheKarten: number;
  eindeutigeEinheiten: number;
  einzelwoerter: number;
  mehrwortEinheiten: number;
  rezeptivImAppKorpus: number;
  rezeptivAbdeckungPct: number;
  produktivAusgewiesen: null;
  externeAbdeckung: "not_assessed";
}

const STUFEN: Level[] = ["A0", "A1", "A2", "B1", "B2"];
const RANG = new Map(STUFEN.map((level, index) => [level, index]));
let einheitenCache: LexikEinheit[] | null = null;

/** Conservative display-form normalization, not a morphological German lemmatizer. */
export function normalisiereLemma(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("de")
    .replace(/\([^)]*\)/g, " ")
    .split(/[;,/]/, 1)[0]
    .trim()
    .replace(/^(?:der|die|das|ein|eine)\s+/i, "")
    .replace(/[„“"'’!?.:–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function corpusIndex(): { tokens: Map<string, number>; text: string } {
  const chunks = [
    ...texts.map((item) => item.de),
    ...dialogues.flatMap((dialogue) => dialogue.lines.map((line) => line.de)),
    ...sentences.map((sentence) => sentence.de),
  ];
  const text = ` ${chunks.join(" ").normalize("NFKC").toLocaleLowerCase("de")
    .replace(/[.,!?;:()„“"«»–—/\\-]/g, " ").replace(/\s+/g, " ").trim()} `;
  const tokens = new Map<string, number>();
  for (const token of text.trim().split(/\s+/)) {
    if (token) tokens.set(token, (tokens.get(token) ?? 0) + 1);
  }
  return { tokens, text };
}

export function lexikEinheiten(): LexikEinheit[] {
  if (einheitenCache) return einheitenCache;
  const groups = new Map<string, VocabCard[]>();
  for (const card of alleVokabeln) {
    const lemma = normalisiereLemma(card.de);
    if (!lemma) continue;
    const cards = groups.get(lemma) ?? [];
    cards.push(card);
    groups.set(lemma, cards);
  }
  const corpus = corpusIndex();
  einheitenCache = [...groups.entries()].map(([lemma, cards]) => {
    const level = cards.reduce((earliest, card) =>
      (RANG.get(card.level) ?? 99) < (RANG.get(earliest) ?? 99) ? card.level : earliest, cards[0].level);
    const art: LexikArt = lemma.includes(" ") ? "mehrwort" : "einzelwort";
    const korpusTreffer = art === "einzelwort"
      ? corpus.tokens.get(lemma) ?? 0
      : Math.max(0, corpus.text.split(` ${lemma} `).length - 1);
    return { lemma, art, level, karten: cards, imAppKorpus: korpusTreffer > 0, korpusTreffer };
  }).sort((a, b) => (RANG.get(a.level) ?? 99) - (RANG.get(b.level) ?? 99) || a.lemma.localeCompare(b.lemma, "de"));
  return einheitenCache;
}

export function referenzBericht(): ReferenzZeile[] {
  const units = lexikEinheiten();
  let kumuliertEindeutig = 0;
  return STUFEN.map((level) => {
    const own = units.filter((unit) => unit.level === level);
    const rezeptivImAppKorpus = own.filter((unit) => unit.imAppKorpus).length;
    kumuliertEindeutig += own.length;
    return {
      level,
      eindeutigHier: own.length,
      kumuliertEindeutig,
      einzelwoerter: own.filter((unit) => unit.art === "einzelwort").length,
      mehrwortEinheiten: own.filter((unit) => unit.art === "mehrwort").length,
      rezeptivImAppKorpus,
      rezeptivAbdeckungPct: own.length ? Math.round(rezeptivImAppKorpus * 1000 / own.length) / 10 : 0,
      // The schema has no card-level productive/receptive target or externally rated production.
      produktivAusgewiesen: null,
    };
  });
}

export function lexikUebersicht(): LexikUebersicht {
  const units = lexikEinheiten();
  const rezeptivImAppKorpus = units.filter((unit) => unit.imAppKorpus).length;
  return {
    roheKarten: alleVokabeln.length,
    eindeutigeEinheiten: units.length,
    einzelwoerter: units.filter((unit) => unit.art === "einzelwort").length,
    mehrwortEinheiten: units.filter((unit) => unit.art === "mehrwort").length,
    rezeptivImAppKorpus,
    rezeptivAbdeckungPct: units.length ? Math.round(rezeptivImAppKorpus * 1000 / units.length) / 10 : 0,
    produktivAusgewiesen: null,
    externeAbdeckung: "not_assessed",
  };
}

/** Frequent in the app corpus but first assigned at B2 — review candidates, not error verdicts. */
export function frequenzAnomalien(limit = 8): { karte: VocabCard; n: number }[] {
  const byLemma = new Map<string, { karte: VocabCard; n: number }>();
  for (const unit of lexikEinheiten().filter((entry) => entry.level === "B2")) {
    const ranked = { karte: unit.karten[0], n: unit.korpusTreffer };
    if (ranked.n >= 15) byLemma.set(unit.lemma, ranked);
  }
  return [...byLemma.values()].sort((a, b) => b.n - a.n).slice(0, limit);
}

/** Highest-attested unique units not yet introduced through any duplicate card ID. */
export function schnellsteRezeptiv(p: Progress, limit = 12): { karte: VocabCard; n: number }[] {
  return lexikEinheiten()
    .filter((unit) => unit.karten.every((card) => !p.srs[card.id]) && unit.korpusTreffer > 0)
    .map((unit) => ({ karte: unit.karten[0], n: unit.korpusTreffer }))
    .sort((a, b) => b.n - a.n || normalisiereLemma(a.karte.de).localeCompare(normalisiereLemma(b.karte.de), "de"))
    .slice(0, limit);
}
