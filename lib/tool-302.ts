/**
 * 302 — WTC Willingness — الاستعداد للتواصل
 * MacIntyre 1998: WTC = confidence + desire → speak more
 * Level: B1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_302 = {
  id: 302,
  titleDe: "WTC Willingness",
  titleAr: "الاستعداد للتواصل",
  family: "SLA",
  bloom: "طبّق",
  level: "B1-B2",
  research: "MacIntyre 1998",
  desc: "WTC = confidence + desire → speak more",
} as const;

export function tool302Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool302Check(v: number): boolean { return v > 0; }
