/**
 * 187 — Sketchnoting Dual Coding — رسم + كلمة
 * Family: الذاكرة | Bloom: طبّق | Level: A1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_187 = {
  id: 187,
  titleDe: "Sketchnoting Dual Coding",
  titleAr: "رسم + كلمة",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1",
} as const;

export interface SketchCard {
  wort: string;
  bildUrl?: string;
  skizzeAnleitungAr: string;
}

export function sketchAnleitung(wort: string): string {
  return `ارسم "${wort}" في 10 ثوانٍ — لا جمال، فقط تذكر`;
}
