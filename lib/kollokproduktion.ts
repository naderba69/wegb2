import { alleVokabeln } from "./content";
import { kollokationenFuer, partnerWort } from "./kollokationen";
import { rng } from "./plan";
import type { VocabCard } from "./types";

/**
 * 🔗 A14 (R295, Experten-Audit): Kollokations-Produktion in geführten
 * Sätzen — nicht Wiedererkennen per Auswahl, sondern Abruf: der
 * Lernende schreibt das Partnerwort selbst in den Rahmen.
 * Prüfung per Normalisierung (Groß/Klein frei) — keine Satzbewertung.
 */
export interface KollokProduktion {
  karte: VocabCard;
  kollok: string;
  partner: string;
  rahmen: string;
}

export function kollokProduktion(samen: number, anzahl = 6): KollokProduktion[] {
  const rand = rng(samen * 104729 + 7);
  const kandidaten = alleVokabeln.filter((k) => kollokationenFuer(k).some((x) => partnerWort(k, x)));
  const out: KollokProduktion[] = [];
  const start = Math.floor(rand() * Math.max(1, kandidaten.length));
  for (let i = 0; i < kandidaten.length && out.length < anzahl; i++) {
    const karte = kandidaten[(start + i) % kandidaten.length];
    const brauchbar = kollokationenFuer(karte).filter((x) => partnerWort(karte, x));
    if (!brauchbar.length) continue;
    const kollok = brauchbar[Math.floor(rand() * brauchbar.length)];
    const partner = partnerWort(karte, kollok)!;
    const rahmen = kollok.split(/\s+/).map((w) => (w === partner ? "_____" : w)).join(" ");
    out.push({ karte, kollok, partner, rahmen });
  }
  return out;
}

export function partnerOk(eingabe: string, partner: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return norm(eingabe) === norm(partner);
}
