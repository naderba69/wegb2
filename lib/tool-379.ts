/**
 * 379 — Awareness Levels — مستويات الوعي
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_379 = {
  id: 379,
  titleDe: "Awareness Levels",
  titleAr: "مستويات الوعي",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Leow 2015",
  desc: "Awareness Levels classroom",
} as const;

export function tool379Gain(a: boolean): number { return a?1.2:1.0; }
export function tool379Check(v:number):boolean { return v>0; }
