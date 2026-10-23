/**
 * 299 — Flow Theory — نظرية التدفق
 * Family: تلقين | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_299 = {
  id: 299,
  titleDe: "Flow Theory",
  titleAr: "نظرية التدفق",
  family: "تلقين",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Csikszentmihalyi 1990",
  desc: "challenge=skill → flow; anxiety if challenge>skill",
} as const;

export function tool299Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool299Check(v: number): boolean { return v > 0; }
