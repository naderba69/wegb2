import { alleVokabeln, grammarMap, redemittelBank } from "./content";
import { kollokationen } from "./kollokationen";

/**
 * 🔎 M14 (R286, Experten-Audit ← N44): eine Suche über alle Banken —
 * Vokabeln, Kollokationen, Grammatikthemen, Redemittel. Reine Teilstring-
 * Treffer (de/ar), deterministisch begrenzt; kein Fuzzy, keine Erfindungen.
 */
export interface SuchErgebnis {
  vokabeln: { de: string; ar: string; level?: string }[];
  kollok: { phrase: string; karteAr: string }[];
  grammatik: { id: string; titelDe: string; titelAr: string }[];
  redemittel: { de: string; ar: string; funktion: string }[];
  trefferGesamt: number;
}

const norm = (s: string) => s.toLowerCase().trim();

export function sucheAlles(q: string, limit = 6): SuchErgebnis {
  const leer: SuchErgebnis = { vokabeln: [], kollok: [], grammatik: [], redemittel: [], trefferGesamt: 0 };
  const nq = norm(q);
  if (nq.length < 2) return leer;
  const trifft = (s?: string) => !!s && norm(s).includes(nq);

  const vokAlle = alleVokabeln.filter((k) => trifft(k.de) || trifft(k.ar));
  const karteArVon = new Map(alleVokabeln.map((k) => [k.id, k.ar]));
  const kollAlle: SuchErgebnis["kollok"] = [];
  for (const [kartenId, phrasen] of Object.entries(kollokationen)) {
    for (const p of phrasen) if (trifft(p)) kollAlle.push({ phrase: p, karteAr: karteArVon.get(kartenId) ?? "" });
  }
  const gramAlle = Object.values(grammarMap).filter((t) => trifft(t.titleDe) || trifft(t.titleAr) || trifft(t.ziel));
  const redeAlle = redemittelBank.filter((r) => trifft(r.de) || trifft(r.ar) || trifft(r.funktion));

  return {
    vokabeln: vokAlle.slice(0, limit).map((k) => ({ de: k.de, ar: k.ar, level: k.level })),
    kollok: kollAlle.slice(0, limit),
    grammatik: gramAlle.slice(0, limit).map((t) => ({ id: t.id, titelDe: t.titleDe, titelAr: t.titleAr })),
    redemittel: redeAlle.slice(0, limit).map((r) => ({ de: r.de, ar: r.ar, funktion: r.funktion })),
    trefferGesamt: vokAlle.length + kollAlle.length + gramAlle.length + redeAlle.length,
  };
}
