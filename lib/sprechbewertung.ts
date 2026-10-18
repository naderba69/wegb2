import type { LlmCfg } from "./grader";
import { llmBereit, llmGespraech } from "./grader";
import type { BegleiterZeile, SprechSzenario } from "./sprechbegleiter";

/**
 * 🏁 R299 (vom Besitzer genehmigt): Gesprächs-Auswertung durch das
 * freie KI-Modell des Lernenden (BYOK + Zustimmung, wie überall).
 * Bewertet wird ausschließlich der geschriebene/transkribierte Text:
 * Inhalt & Gesprächsführung, Wortschatz, Grammatik, Höflichkeit &
 * Register. Aussprache wird NIEMALS bewertet — das Modell hört nichts.
 * Ergebnis ist eine interne Trainings-Einschätzung, kein offizielles Urteil.
 */
export interface SprechKriterium { name: string; punkte: number; kommentar: string }
export interface SprechBewertung { kriterien: SprechKriterium[]; fazit: string; naechsteUebung: string }

export const SPRECH_KRITERIEN = ["Gesprächsführung", "Wortschatz", "Grammatik", "Höflichkeit und Register"] as const;

export function parseSprechBewertung(raw: string): SprechBewertung | null {
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const p = JSON.parse(m[0]) as { kriterien?: { name?: unknown; punkte?: unknown; kommentar?: unknown }[]; fazit?: unknown; naechsteUebung?: unknown };
    const liste: SprechKriterium[] = (Array.isArray(p.kriterien) ? p.kriterien : [])
      .map((k) => ({
        name: String(k?.name ?? ""),
        punkte: Math.max(0, Math.min(100, Math.round(Number(k?.punkte) || 0))),
        kommentar: String(k?.kommentar ?? ""),
      }))
      .filter((k) => (SPRECH_KRITERIEN as readonly string[]).includes(k.name));
    if (liste.length < 4) return null;
    return { kriterien: liste, fazit: String(p.fazit ?? ""), naechsteUebung: String(p.naechsteUebung ?? "") };
  } catch {
    return null;
  }
}

export async function sprechBewerten(
  cfg: LlmCfg,
  szenario: SprechSzenario,
  verlauf: BegleiterZeile[]
): Promise<SprechBewertung | null> {
  if (!llmBereit(cfg)) return null;
  const meine = verlauf.filter((z) => z.wer === "ich");
  if (meine.length < 2) return null;
  const protokoll = verlauf.map((z) => `${z.wer === "ki" ? "Partner" : "Lernender"}: ${z.text}`).join("\n");
  const raw = await llmGespraech(cfg, [
    {
      role: "system",
      content:
        'Du bist ein erfahrener Prüfer für mündliches Deutsch (Niveau B1/B2), der arabischsprachige Lernende fair beurteilt. Bewerte NUR die Sätze des Lernenden im folgenden Gesprächsprotokoll nach vier Kriterien (je 0–100): "Gesprächsführung" (Inhalt, Reagieren, Gespräch am Laufen halten), "Wortschatz" (Breite und Passung), "Grammatik" (Strukturen, Wortstellung), "Höflichkeit und Register" (Anrede, Bitten, Ton). Kommentiere je Kriterium kurz auf Arabisch mit einem konkreten Beispiel aus dem Text. Sprich NIEMALS über Aussprache — du liest nur Text. Antworte AUSSCHLIESSLICH mit JSON: {"kriterien":[{"name":"Gesprächsführung","punkte":0,"kommentar":"..."},{"name":"Wortschatz","punkte":0,"kommentar":"..."},{"name":"Grammatik","punkte":0,"kommentar":"..."},{"name":"Höflichkeit und Register","punkte":0,"kommentar":"..."}],"fazit":"جملة عربية ختامية مشجعة وصادقة","naechsteUebung":"اقتراح تمرين تالي واحد بالعربية"}',
    },
    { role: "user", content: `Szenario: ${szenario.titelAr} (Niveau ${szenario.niveau})\n\n${protokoll}` },
  ]);
  return raw ? parseSprechBewertung(raw) : null;
}
