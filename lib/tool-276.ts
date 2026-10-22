/**
 * 276 — Sleep Optimization — تحسين النوم للتعلم
 * Diekelmann 2009: slow-wave sleep consolidates declarative memory; REM for procedural
 * Level: A0-B2 | Bloom: طبّق | Family: الذاكرة
 */
export const TOOL_276 = {
  id: 276,
  titleDe: "Schlaf-Optimierung",
  titleAr: "تحسين النوم",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Diekelmann 2009",
  rule: "21:30 lernen → 23:00 schlafen → 6h Tiefschlaf",
} as const;
export function sleepWindow(): string { return "lernen 21:00-21:30 → schlafen 23:00 → Abruf 07:00"; }
export function consolidationGain(sleptHours: number): number { return sleptHours>=7?1.3: sleptHours>=6?1.15:1.0; }
