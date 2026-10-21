/**
 * 229 — Role-play — لعب الأدوار
 * Ladousse 1987: simulated social roles → fluency + sociolinguistic competence
 * Level: A1-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_229 = {
  id: 229,
  titleDe: "Rollenspiel",
  titleAr: "لعب الأدوار",
  family: "طرائق",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Ladousse 1987",
  example: "Kunde-Verkäufer, Arzt-Patient, Bewerbung",
} as const;
export function rolePlayScenario(level: string): string {
  const s: Record<string,string>={A1:"Im Supermarkt",A2:"Beim Arzt",B1:"Bewerbungsgespräch",B2:"Verhandlung"};
  return s[level]??"Im Café";
}
export function rolePlayGain(played: boolean): number { return played?1.2:1.0; }
