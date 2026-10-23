/**
 * 226 — Jigsaw (Puzzle-Lesen) — القراءة التركيبية
 * Family: طرائق | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_226 = {
  id: 226,
  titleDe: "Jigsaw (Puzzle-Lesen)",
  titleAr: "القراءة التركيبية",
  family: "طرائق",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Aronson 1978",
  steps: "Experten-Gruppe → Stamm-Gruppe → lehren",
} as const;

export function jigsawGroups(total: number, experts: number): number[][] {
  return Array.from({length: experts}, (_,i)=> Array.from({length: Math.ceil(total/experts)}, (_,j)=> i*3+j));
}
export function jigsawGain(cooperative: boolean): number { return cooperative?1.3:1.0; }
