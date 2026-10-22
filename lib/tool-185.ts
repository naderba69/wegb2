/**
 * 185 — Interleaving Mathematics — رياضيات الخلط
 * Rohrer 2012: interleaved math improves transfer 43% vs blocked
 * Application: mix grammar topics within one lesson, not blocked AAAA BBBB
 * Level: A0-B2 | Bloom: أنشئ
 */
export const TOOL_185 = {
  id: 185,
  titleDe: "Mathematisches Interleaving",
  titleAr: "خلط رياضي",
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
