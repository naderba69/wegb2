/**
 * 243 — Peer Assessment — تقييم الأقران
 * Family: تقويم | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_243 = {
  id: 243,
  titleDe: "Peer Assessment",
  titleAr: "تقييم الأقران",
  family: "تقويم",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Falchikov 2005",
  rubric: "Inhalt, Sprache, Organisation",
} as const;

export function peerRubric(): string[] { return ["Inhalt","Sprache","Organisation","Interaktion"]; }
export function peerScore(scores: number[]): number { return scores.reduce((a,b)=>a+b,0)/Math.max(scores.length,1); }
