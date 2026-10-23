/**
 * 234 — CCQ (Concept Check) — التحقق من المفهوم
 * Family: طرائق | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_234 = {
  id: 234,
  titleDe: "CCQ (Concept Check)",
  titleAr: "التحقق من المفهوم",
  family: "طرائق",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Scrivener 2011",
  example: "Perfekt: Ist es jetzt fertig? Ja/Nein?",
} as const;

export function ccqFor(topic: string): string { const m: Record<string,string>={Perfekt:"Ist die Handlung jetzt fertig?", Präteritum:"Ist es Vergangenheit?"}; return m[topic]??`Verstehst du ${topic}?`; }
export function ccqGain(answered: boolean): number { return answered?1.15:1.0; }
