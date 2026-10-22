/**
 * 265 — Concrete Examples Deep — أمثلة محسوسة عميقة
 * Rawson 2015: concrete > abstract by 15%; mix both for transfer
 * Level: A1-B2 | Bloom: فهم | Family: تلقين
 */
export const TOOL_265 = {
  id: 265,
  titleDe: "Konkrete Beispiele (tief)",
  titleAr: "أمثلة محسوسة عميقة",
  family: "تلقين",
  bloom: "فهم",
  level: "A1-B2",
  research: "Rawson 2015",
  rule: "konkret + abstrakt mischen",
} as const;
export function concreteExample(abstractRule: string): string { return `Abstrakt: ${abstractRule} → Konkret: z.B. "Ich gebe dem Mann das Buch"`; }
export function mixRatio(): string { return "2 konkret : 1 abstrakt"; }
