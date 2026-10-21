/**
 * 241 — Portfolio Assessment — ملف الإنجاز
 * Hamp-Lyons 1997: collections of work show growth over time; reflection deepens learning
 * Level: A1-B2 | Bloom: قيّم | Family: تقويم
 */
export const TOOL_241 = {
  id: 241,
  titleDe: "Portfolio",
  titleAr: "ملف الإنجاز",
  family: "تقويم",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Hamp-Lyons 1997",
  types: "Schreib-Portfolio, Sprech-Portfolio",
} as const;
export function portfolioEntries(level: string): number { const m: Record<string,number>={A1:5,A2:8,B1:12,B2:15}; return m[level]??8; }
export function portfolioReflect(prompt: string): string { return `Reflexion: ${prompt} — was habe ich gelernt?`; }
