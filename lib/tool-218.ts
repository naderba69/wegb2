/**
 * 218 — Lexikalischer Ansatz — المدخل المعجمي
 * Family: طرائق | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_218 = {
  id: 218,
  titleDe: "Lexikalischer Ansatz",
  titleAr: "المدخل المعجمي",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lewis 1993",
  focus: "Kollokationen, Chunks, feste Wendungen",
} as const;

export function lexicalChunk(de: string, ar: string): string { return `${de} ↔ ${ar} (Chunk lernen!)`; }
export function chunkGain(chunkLearned: boolean): number { return chunkLearned ? 1.3 : 1.0; }
