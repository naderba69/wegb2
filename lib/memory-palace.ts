/**
 * 014 Memory Palace / Loci — قصر الذاكرة
 * 7 غرف ثابتة في B2: Eingang · Küche · Wohnzimmer · Schlafzimmer · Bad · Balkon · Keller
 * كل كلمة تُثبت في غرفة + موضع. الاسترجاع = جولة ذهنية.
 */
export const PALACE_RAEUME = ["Eingang", "Küche", "Wohnzimmer", "Schlafzimmer", "Bad", "Balkon", "Keller"] as const;
export type PalaceRaum = (typeof PALACE_RAEUME)[number];

export interface PalaceEintrag {
  wortDe: string;
  raum: PalaceRaum;
  ort: string; // "auf dem Tisch", "hinter der Tür" ...
  bildAr: string;
}

export function palacePosition(index: number): { raum: PalaceRaum; slot: number } {
  const raum = PALACE_RAEUME[index % PALACE_RAEUME.length];
  const slot = Math.floor(index / PALACE_RAEUME.length) + 1;
  return { raum, slot };
}

export function palaceVoll(eintraege: PalaceEintrag[]): boolean {
  // لا أكثر من 4 كلمات/غرفة لمنع الازدحام
  const perRaum: Record<string, number> = {};
  for (const e of eintraege) perRaum[e.raum] = (perRaum[e.raum] ?? 0) + 1;
  return Object.values(perRaum).every((n) => n <= 4);
}
