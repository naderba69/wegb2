/**
 * 235 — ICQ — أسئلة التحقق من التعليمات
 * Scrivener 2011: ICQs ensure task understanding before execution: "What do you do first?"
 * Level: A0-B2 | Bloom: فهم | Family: طرائق
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
