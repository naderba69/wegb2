/**
 * 375 — Garden Path — مسار الحديقة
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_375 = {
  id: 375,
  titleDe: "Garden Path",
  titleAr: "مسار الحديقة",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Tomasello 2003",
  desc: "Garden Path classroom",
} as const;

export function tool375Gain(a: boolean): number { return a?1.2:1.0; }
export function tool375Check(v:number):boolean { return v>0; }
