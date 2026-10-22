/**
 * 245 — Contrastive Analysis Advanced — التحليل التقابلي المتقدم
 * Lado 1957 + Ringbom 2007: transfer distance predicts difficulty; close languages easier
 * Level: B1-B2 | Bloom: حلّل | Family: SLA
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
