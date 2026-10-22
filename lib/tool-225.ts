/**
 * 225 — Information Gap — فجوة المعلومات
 * Pica 1994: each learner has unique info → must communicate to complete task
 * Level: A1-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_225 = {
  id: 225,
  titleDe: "Information Gap",
  titleAr: "فجوة المعلومات",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Pica 1994",
  example: "A hat Hälfte der Info, B die andere — zusammen lösen",
} as const;
export function gapTask(type: "find"|"describe"|"arrange"): string {
  const t = { find: "Finde den Unterschied", describe: "Beschreibe dein Bild", arrange: "Ordne die Geschichte" };
  return t[type];
}
export function needsGap(level: string): boolean { return level!=="A0"; }
