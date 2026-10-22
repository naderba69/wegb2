/**
 * 187 — Dual Coding with Sketchnoting — ترميز مزدوج بالرسم
 * Mayer 2009: drawing + labeling improves recall 30%
 * Level: A1 | Bloom: فهم
 */
export const TOOL_187 = {
  id: 187,
  titleDe: "Sketchnoting Dual Coding",
  titleAr: "رسم + كلمة",
} as const;

export interface SketchCard {
  wort: string;
  bildUrl?: string;
  skizzeAnleitungAr: string;
}

export function sketchAnleitung(wort: string): string {
  return `ارسم "${wort}" في 10 ثوانٍ — لا جمال، فقط تذكر`;
}
