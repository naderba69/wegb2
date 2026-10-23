/**
 * 182 — Schlafkonsolidierung — تثبيت أثناء النوم
 * Family: الذاكرة | Bloom: طبّق | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_182 = {
  id: 182,
  titleDe: "Schlafkonsolidierung",
  titleAr: "تثبيت أثناء النوم",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A0-B2",
  protocol: "Lernen 21:00-22:00 → Schlaf 23:00-07:00 → Abruf 07:30",
  gain: "+30% Retention",
} as const;

export interface SleepSlot {
  lernenStart: string; // "21:00"
  schlafenStart: string; // "23:00"
  abrufZeit: string; // "07:30"
}

export function getEveningReviewSlot(day: number): SleepSlot | null {
  // Only on heavy days (day % 3 === 0) to avoid overload
  if (day % 3 !== 0) return null;
  return { lernenStart: "21:00", schlafenStart: "23:00", abrufZeit: "07:30" };
}

export function shouldPrioritizeSleep(cardsDue: number): boolean {
  return cardsDue > 15; // prioritize sleep over extra cards if overloaded
}
