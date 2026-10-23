/**
 * 235 — ICQ (Instruction Check) — التحقق من التعليمات
 * Family: طرائق | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_235 = {
  id: 235,
  titleDe: "ICQ (Instruction Check)",
  titleAr: "التحقق من التعليمات",
  family: "طرائق",
  bloom: "فهم",
  level: "A0-B2",
  research: "Scrivener 2011",
  example: "Lest ihr allein oder zusammen?",
} as const;

export function icqFor(task: string): string { return `ICQ: ${task} — Was machst du zuerst?`; }
export function icqPassed(asked: boolean): boolean { return asked; }
