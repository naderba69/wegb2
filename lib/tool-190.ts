/**
 * 190 — Transfergerechtes Üben — تدريب مطابق للاختبار
 * Family: الذاكرة | Bloom: قيّم | Level: B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_190 = {
  id: 190,
  titleDe: "Transfergerechtes Üben",
  titleAr: "تدريب مطابق للاختبار",
  family: "الذاكرة",
  bloom: "قيّم",
  level: "B2",
  principle: "Übe wie geprüft wird",
} as const;

export function isTransferAppropriate(lernformat: string, pruefformat: string): boolean {
  return lernformat === pruefformat;
}

export function transferCheck(lern: string[], pruefung: string[]): { match: number; total: number } {
  const match = lern.filter(f => pruefung.includes(f)).length;
  return { match, total: pruefung.length };
}
