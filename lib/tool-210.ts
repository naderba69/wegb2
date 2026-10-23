/**
 * 210 — Kontrastanalyse AR-DE — التحليل التقابلي عربي-ألماني
 * Family: SLA | Bloom: حلّل | Level: A0-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_210 = {
  id: 210,
  titleDe: "Kontrastanalyse AR-DE",
  titleAr: "التحليل التقابلي عربي-ألماني",
  family: "SLA",
  bloom: "حلّل",
  level: "A0-B1",
  research: "Lado 1957",
  interference: "Kasus, Genus, V2 fehlt im Arabischen",
} as const;

export function contrastHint(arFeature: string): string {
  const map: Record<string, string> = {
    kasus: "Arabisch hat 3 Fälle, Deutsch 4 — übe Akk/Dat besonders!",
    genus: "Arabisch 2 Genera, Deutsch 3 — lerne Artikel mit Nomen!",
    v2: "Arabisch VSO/SVO, Deutsch V2 — Verb immer Position 2!",
  };
  return map[arFeature] ?? "Achte auf Unterschiede AR↔DE";
}
export function isHighInterference(topic: string): boolean {
  return ["kasus", "genus", "v2", "Nebensatz"].includes(topic);
}
