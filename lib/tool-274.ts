/**
 * 274 — Loci Advanced — قصر الذاكرة المتقدم
 * Yates 1966: method of loci — 80 items in order with palace navigation
 * Level: A1-B2 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_274 = {
  id: 274,
  titleDe: "Loci-Methode (fortgeschritten)",
  titleAr: "قصر الذاكرة المتقدم",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Yates 1966",
  palace: "20 Räume × 4 Slots = 80 Items",
} as const;
export function lociRoute(rooms: number): string[] { return Array.from({length: rooms}, (_,i)=> `Raum ${i+1}`); }
export function lociPlace(word: string, room: string): string { return `${word} → ${room}`; }
