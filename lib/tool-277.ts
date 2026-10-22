/**
 * 277 — Input i+1 Fine-Tuned — المدخلات i+1 المضبوطة
 * Krashen 1985: comprehensible input slightly above level → acquisition
 * Level: A1-B2 | Bloom: فهم | Family: SLA
 */
export const TOOL_277 = {
  id: 277,
  titleDe: "Input i+1 (fein)",
  titleAr: "المدخلات i+1 المضبوطة",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Krashen 1985",
  rule: "95% verstehen + 5% neu = optimal",
} as const;
export function isIPlusOne(knownPercent: number): boolean { return knownPercent>=93 && knownPercent<=97; }
export function iPlusOneLevel(current: string): string { const o=["A0","A1","A2","B1","B2"]; return o[Math.min(o.indexOf(current)+1,o.length-1)]; }
