/**
 * 185 — Mathematisches Interleaving — خلط رياضي
 * Family: طرائق | Bloom: طبّق | Level: A1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_185 = {
  id: 185,
  titleDe: "Mathematisches Interleaving",
  titleAr: "خلط رياضي",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1",
  transferGain: 0.43,
  blockedVsInterleaved: "AAAA BBBB → ABAB ABAB",
} as const;

export function interleave<T>(blocked: T[][]): T[] {
  const maxLen = Math.max(...blocked.map(g => g.length));
  const result: T[] = [];
  for (let i = 0; i < maxLen; i++) {
    for (const group of blocked) {
      if (group[i] !== undefined) result.push(group[i]);
    }
  }
  return result;
}
