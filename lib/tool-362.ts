/**
 * 362 — Negotiation for Meaning — التفاوض على المعنى
 * Pica 1987: classroom-ready application with tasks
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_362 = {
  id: 362,
  titleDe: "Negotiation for Meaning",
  titleAr: "التفاوض على المعنى",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Pica 1987",
  desc: "Negotiation for Meaning classroom application",
} as const;
export function tool362Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool362Check(v: number): boolean { return v>0; }
