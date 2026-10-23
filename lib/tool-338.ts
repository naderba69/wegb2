/**
 * 338 — Telecollaboration — التعاون عن بعد
 * Family: Immersion | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_338 = {
  id: 338,
  titleDe: "Telecollaboration",
  titleAr: "التعاون عن بعد",
  family: "Immersion",
  bloom: "طبّق",
  level: "B1-B2",
  research: "O Dowd 2007",
  desc: "Telecollaboration applied in classroom",
} as const;

export function tool338Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool338Check(v: number): boolean { return v>0; }
