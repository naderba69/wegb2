/**
 * 255 — Narrative Quests — السرد المغامر
 * Cover 2010: story-driven quests deeper than point quests
 * Level: A2-B2 | Bloom: أنشئ | Family: Narrative
 */
export const TOOL_255 = {
  id: 255,
  titleDe: "Narrative Quests",
  titleAr: "السرد المغامر",
  family: "Narrative",
  bloom: "أنشئ",
  level: "A2-B2",
  research: "Cover 2010",
  arc: "Held → Ruf → Prüfung → Rückkehr",
} as const;
export function narrativeArc(): string[] { return ["Held","Ruf","Prüfung","Rückkehr","Belohnung"]; }
export function narrativeQuest(level: string): string { const m: Record<string,string>={A1:"Rette die Katze", B2:"Verhandle den Frieden"}; return m[level]??"Finde den Schatz"; }
