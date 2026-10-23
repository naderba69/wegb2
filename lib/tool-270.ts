/**
 * 270 — Wiedererkennen vs Abruf — التعرف مقابل الاستدعاء
 * Family: الذاكرة | Bloom: تذكّر | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_270 = {
  id: 270,
  titleDe: "Wiedererkennen vs Abruf",
  titleAr: "التعرف مقابل الاستدعاء",
  family: "الذاكرة",
  bloom: "تذكّر",
  level: "A0-B2",
  research: "Haist 1992",
  training: "Multiple Choice = Wiedererkennen; Lücken = Abruf",
} as const;

export function recognitionVsRecall(type: string): string { return type==="choice"?"Wiedererkennen (leicht)":"Abruf (schwer, produktiv)"; }
export function trainRecall(level: string): boolean { return level==="B1"||level==="B2"; }
