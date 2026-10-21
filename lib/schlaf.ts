/**
 * 011 Schlaf — المراجعة قبل النوم
 * نافذة النوم: 21:00-23:30 بتوقيت المتعلم. مراجعة 5-7 بطاقات صعبة في هذه النافذة تحسن التثبيت 20% (Gais et al.).
 */
export const SCHLAF_FENSTER_START = 21; // 21:00
export const SCHLAF_FENSTER_ENDE = 23.5; // 23:30

export function inSchlafFenster(hour: number): boolean {
  return hour >= SCHLAF_FENSTER_START && hour < SCHLAF_FENSTER_ENDE;
}

export interface SchlafEmpfehlung {
  anzahl: number;
  grund: string;
}

export function schlafEmpfehlung(fehlkarten: number, hour: number): SchlafEmpfehlung | null {
  if (!inSchlafFenster(hour)) return null;
  if (fehlkarten < 3) return null;
  return {
    anzahl: Math.min(7, Math.max(5, Math.ceil(fehlkarten * 0.5))),
    grund: "مراجعة مسائية قصيرة قبل النوم — تثبت 20% أكثر حتى الصباح",
  };
}
