/**
 * 326 — Humor in Learning — الفكاهة في التعلّم
 * Family: تلقين | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_326 = {
  id: 326,
  titleDe: "Humor in Learning",
  titleAr: "الفكاهة في التعلّم",
  family: "تلقين",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Bell 2009",
  desc: "Humor in Learning applied in classroom",
} as const;

export function tool326Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool326Check(v: number): boolean { return v>0; }
