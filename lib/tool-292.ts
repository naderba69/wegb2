/**
 * 292 — Growth Mindset — عقلية النمو
 * Family: تلقين | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_292 = {
  id: 292,
  titleDe: "Growth Mindset",
  titleAr: "عقلية النمو",
  family: "تلقين",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Dweck 2006",
  desc: "intelligence malleable → effort + strategies",
} as const;

export function tool292Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool292Check(v: number): boolean { return v > 0; }
