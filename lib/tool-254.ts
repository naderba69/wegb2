/**
 * 254 — Quests — المهام المغامرة
 * Dickey 2005: narrative quests engage; clear goal + challenge + reward
 * Level: A1-B2 | Bloom: أنشئ | Family: Gamification
 */
export const TOOL_254 = {
  id: 254,
  titleDe: "Quests",
  titleAr: "المهام المغامرة",
  family: "Gamification",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Dickey 2005",
  structure: "Auftrag → Hindernis → Belohnung",
} as const;
export function questFor(topic: string): string { return `Quest: Finde 3 Beispiele für ${topic} in der Stadt!`; }
export function questReward(difficulty: number): number { return Math.round(difficulty*50); }
