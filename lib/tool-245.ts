/**
 * 245 — Kontrastive Analyse (fortgeschritten) — التحليل التقابلي المتقدم
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_245 = {
  id: 245,
  titleDe: "Kontrastive Analyse (fortgeschritten)",
  titleAr: "التحليل التقابلي المتقدم",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Ringbom 2007",
  distance: "AR→DE fern = mehr Interferenz",
} as const;

export function transferDistance(l1: string, l2: string): number { if(l1==="AR"&&l2==="DE") return 0.8; return 0.5; }
export function predictedDifficulty(distance: number): string { return distance>0.7?"hoch": distance>0.4?"mittel":"niedrig"; }
