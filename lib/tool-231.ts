/**
 * 231 — Shadowing — التظليل الصوتي
 * Family: طرائق | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_231 = {
  id: 231,
  titleDe: "Shadowing",
  titleAr: "التظليل الصوتي",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Hamada 2018",
  steps: "hören → sofort nachsprechen (0.5s delay)",
} as const;

export function shadowingDelay(level: string): number { return level==="A1"?1000: level==="A2"?700:500; }
export function shadowingGain(repetitions: number): number { return Math.min(1.3, 1+repetitions*0.05); }
