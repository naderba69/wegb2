/**
 * 265 — Konkrete Beispiele (tief) — أمثلة محسوسة عميقة
 * Family: تلقين | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
