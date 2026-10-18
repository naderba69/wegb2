import { vocabMap } from "./content";
import { newCard } from "./srs";
import type { Progress, VocabCard } from "./types";

/**
 * 📚 R298 (vom Besitzer genehmigte Erweiterung): B2-Rezeptiv-Erweiterung.
 * 16 Themen-Decks (j01–j16, 912 Karten), die die in R295 ehrlich
 * ausgewiesene Lücke zum B2-Rezeptivumfang (~4500) schließen.
 * Freies Erkennungstraining außerhalb des 378-Tage-Plans: Korrekte
 * Antworten führen die Karte rezeptiv in den SRS-Bestand ein —
 * produktive Meisterung bleibt Sache der Plan- und Produktionsstationen.
 */
export interface ErweiterungDeck { id: string; titleDe: string; titleAr: string; anzahl: number }

export function erweiterungDecks(): ErweiterungDeck[] {
  return Object.entries(vocabMap)
    .filter(([id]) => id.startsWith("j"))
    .map(([id, g]) => ({ id, titleDe: g.titleDe, titleAr: g.titleAr, anzahl: g.cards.length }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export interface ErweiterungFrage { karte: VocabCard; optionen: string[]; richtig: string }

function misch<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed * 2654435761 % 4294967296;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function erweiterungSitzung(deckId: string, p: Progress, seed: number, anzahl = 8): ErweiterungFrage[] {
  const deck = vocabMap[deckId];
  if (!deck) return [];
  const frisch = deck.cards.filter((c) => !p.srs[c.id]);
  const bekannt = deck.cards.filter((c) => !!p.srs[c.id]);
  const pool = misch([...frisch, ...bekannt], seed);
  return pool.slice(0, anzahl).map((karte, i) => {
    const andere = misch(deck.cards.filter((c) => c.id !== karte.id && c.ar !== karte.ar), seed + i * 7 + 1)
      .slice(0, 3).map((c) => c.ar);
    return { karte, optionen: misch([karte.ar, ...andere], seed + i * 13 + 5), richtig: karte.ar };
  });
}

export function erweiterungFortschritt(p: Progress): { eingefuehrt: number; gesamt: number } {
  const decks = erweiterungDecks();
  const gesamt = decks.reduce((a, d) => a + d.anzahl, 0);
  const ids = new Set(decks.map((d) => d.id));
  let eingefuehrt = 0;
  for (const [id] of Object.entries(vocabMap)) {
    if (!ids.has(id)) continue;
    for (const c of vocabMap[id].cards) if (p.srs[c.id]) eingefuehrt++;
  }
  return { eingefuehrt, gesamt };
}

export { newCard };
