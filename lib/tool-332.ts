/**
 * 332 — Digital Storytelling — السرد الرقمي
 * Family: Narrative | Bloom: أنشئ | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_332 = {
  id: 332,
  titleDe: "Digital Storytelling",
  titleAr: "السرد الرقمي",
  family: "Narrative",
  bloom: "أنشئ",
  level: "A2-B2",
  research: "Robin 2008",
  desc: "Digital Storytelling applied in classroom",
} as const;

export function tool332Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool332Check(v: number): boolean { return v>0; }
