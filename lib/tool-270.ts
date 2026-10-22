/**
 * 270 — Recognition vs Recall — التعرف مقابل الاستدعاء
 * Haist 1992: recognition easier than recall; train recall for production
 * Level: A0-B2 | Bloom: تذكّر | Family: الذاكرة
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
