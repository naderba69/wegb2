/**
 * 336 — Wiki Collaboration — التعاون الويكي
 * Family: طرائق | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_336 = {
  id: 336,
  titleDe: "Wiki Collaboration",
  titleAr: "التعاون الويكي",
  family: "طرائق",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Wheeler 2008",
  desc: "Wiki Collaboration applied in classroom",
} as const;

export function tool336Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool336Check(v: number): boolean { return v>0; }
