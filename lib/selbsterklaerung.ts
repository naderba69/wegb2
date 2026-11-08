export interface SelbsterklaerungRegel {
  de: string;
  ar: string;
}

export interface SelbsterklaerungDetail {
  de: string;
  schluessel: string[];
  treffer: string[];
  ok: boolean;
}

export interface SelbsterklaerungAuswertung {
  anteil: number;
  getroffen: number;
  gesamt: number;
  bestanden: boolean;
  details: SelbsterklaerungDetail[];
}

const AR_STOP = new Set(
  "على عن في من الى ان لكن ما هذا هذه التي الذي مع قد لم لن حتى بين عند كل بعض كما اذا كان كانت يكون هناك يتم يمكن يجب".split(" "),
);

export function normalisiereErklaertext(text: string): string[] {
  const woerter = text
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((wort) => {
      let basis = wort;
      if (basis.startsWith("و") && basis.length > 4) basis = basis.slice(1);
      if (basis.startsWith("ال") && basis.length > 4) basis = basis.slice(2);
      return basis;
    });
  return woerter;
}

export function schluesselwoerterFuerRegel(ar: string, maximum = 4): string[] {
  const eindeutig = [...new Set(normalisiereErklaertext(ar))]
    .filter((wort) => wort.length >= 3 && !AR_STOP.has(wort));
  return eindeutig.slice(0, Math.max(0, maximum));
}

/**
 * Lokaler, absichtlich begrenzter Abdeckungshinweis: prüft Wortmaterial, nicht
 * fachliche Richtigkeit, Kausalbeziehungen oder pädagogische Qualität.
 */
export function bewerteSelbsterklaerung(
  text: string,
  regeln: readonly SelbsterklaerungRegel[],
): SelbsterklaerungAuswertung {
  const textWoerter = new Set(normalisiereErklaertext(text));
  const details = regeln.map((regel) => {
    const schluessel = schluesselwoerterFuerRegel(regel.ar);
    const treffer = schluessel.filter((wort) => textWoerter.has(wort));
    const mindestTreffer = schluessel.length ? Math.max(1, Math.ceil(schluessel.length * 0.34)) : Number.POSITIVE_INFINITY;
    return { de: regel.de, schluessel, treffer, ok: treffer.length >= mindestTreffer };
  });
  const getroffen = details.filter((detail) => detail.ok).length;
  const anteil = details.length ? Math.round((100 * getroffen) / details.length) : 0;
  return {
    anteil,
    getroffen,
    gesamt: details.length,
    bestanden: details.length > 0 && anteil >= 50,
    details,
  };
}
