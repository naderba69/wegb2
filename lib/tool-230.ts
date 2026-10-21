/**
 * 230 — Debate / Discussion — المناظرة والنقاش
 * Kennedy 2007: structured debate → argumentation + critical thinking + fluency
 * Level: B1-B2 | Bloom: قيّم | Family: طرائق
 */
export const TOOL_230 = {
  id: 230,
  titleDe: "Debatte / Diskussion",
  titleAr: "المناظرة والنقاش",
  family: "طرائق",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Kennedy 2007",
  format: "Pro/Contra, Moderator, Zeitlimit",
} as const;
export function debateFormat(topic: string): string { return `Debatte: ${topic} — Pro vs Contra (je 2 Min)`; }
export function debateRoles(): string[] { return ["Pro","Contra","Moderator","Publikum"]; }
