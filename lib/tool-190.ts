/**
 * 190 — Transfer-Appropriate Processing — معالجة مناسبة للنقل
 * Morris et al. 1977: test conditions should match learning conditions
 * Level: B2 | Bloom: قيّم
 */
export const TOOL_190 = {
  id: 190,
  titleDe: "Transfergerechtes Üben",
  titleAr: "تدريب مطابق للاختبار",
  principle: "Übe wie geprüft wird",
} as const;

export function isTransferAppropriate(lernformat: string, pruefformat: string): boolean {
  return lernformat === pruefformat;
}

export function transferCheck(lern: string[], pruefung: string[]): { match: number; total: number } {
  const match = lern.filter(f => pruefung.includes(f)).length;
  return { match, total: pruefung.length };
}
