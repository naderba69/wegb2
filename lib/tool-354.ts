/**
 * 354 — Scanning Lesestrategie — المسح الباحث
 * Grabe 2009: classroom-ready application with tasks
 * Level: A2-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_354 = {
  id: 354,
  titleDe: "Scanning Lesestrategie",
  titleAr: "المسح الباحث",
  family: "طرائق",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Grabe 2009",
  desc: "Scanning Lesestrategie classroom application",
} as const;
export function tool354Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool354Check(v: number): boolean { return v>0; }
