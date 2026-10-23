/**
 * 280 — Lücken bemerken — ملاحظة الفجوة
 * Family: SLA | Bloom: حلّل | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_280 = {
  id: 280,
  titleDe: "Lücken bemerken",
  titleAr: "ملاحظة الفجوة",
  family: "SLA",
  bloom: "حلّل",
  level: "A2-B2",
  research: "Schmidt 1986",
  task: "mein Satz vs. Muttersprachler — was fehlt?",
} as const;

export function noticeGap(mySentence: string, target: string): string { return `Du: "${mySentence}" → Ziel: "${target}" — Unterschied?`; }
export function gapNoticed(compared: boolean): boolean { return compared; }
