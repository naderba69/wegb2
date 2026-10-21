/**
 * 076 Dynamic Assessment — التقييم الدينامي
 * مقياس تلميح متدرج: بلا تلميح = 3، تلميح خفيف = 2، تلميح قوي = 1، إظهار = 0.
 */
export type HintStufe = 0|1|2|3;
export interface DynFrage { id: string; frageDe: string; loesung: string; hints: string[]; }
export function bewerteDyn(versuche: number, hintStufe: HintStufe): number {
  // كل استخدام تلميح يخفض درجة
  const base = [0,1,2,3][hintStufe] ?? 0;
  return Math.max(0, base - Math.max(0, versuche-1));
}
export function hintFuer(frage: DynFrage, stufe: HintStufe): string | null {
  if (stufe===3) return null;
  return frage.hints[2-stufe] ?? null;
}
