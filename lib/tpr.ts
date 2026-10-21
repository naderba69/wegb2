/**
 * 018 TPR — الاستجابة الجسدية الكاملة
 * أمر + حركة: المتعلم ينفذ الحركة جسدياً أو يتخيلها.
 */
export interface TprCmd { de: string; ar: string; aktion: string; }
export const TPR_CMDS: TprCmd[] = [
  { de: "Steh auf!", ar: "قف!", aktion: "stand_up" },
  { de: "Setz dich!", ar: "اجلس!", aktion: "sit_down" },
  { de: "Komm her!", ar: "تعال!", aktion: "come_here" },
];
export function tprFuer(tag: number): TprCmd { return TPR_CMDS[tag % TPR_CMDS.length]; }
