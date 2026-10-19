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
/** خ5 (R304): نطاق لفظي لكل نتيجة 0–100 — بلا ربط CEFR صارم (تقييم داخلي داخلي فقط). */
export function sprechBand(punkte: number): { labelAr: string; farbe: string } {
  if (punkte >= 80) return { labelAr: "قويّ جدًا", farbe: "var(--good, #3f9e4d)" };
  if (punkte >= 60) return { labelAr: "جيّد — على الطريق", farbe: "var(--green, #7ab648)" };
  if (punkte >= 40) return { labelAr: "يبني الأساس", farbe: "var(--gold, #c9a227)" };
  return { labelAr: "بداية — واصل", farbe: "var(--warn, #d2691e)" };
}

/** خطوة تحسين واحدة عملية لكل معيار — ثابتة وقابلة للتنفيذ فورًا. */
export const KRITERIUM_SCHRITT: Record<string, string> = {
  "Gesprächsführung": "خطوتك: اختم كل ردّ بسؤال يعيد الكرة لشريكك (مثلاً: Und was meinen Sie dazu؟)",
  "Wortschatz": "خطوتك: استعمل في المحادثة التالية 3 كلمات جديدة من آخر درس تعلّمته",
  "Grammatik": "خطوتك: اكتب جملك قصيرة بفعلٍ في الموضع الثاني (Verb-Zweit) — جملة قصيرة صحيحة خير من طويلة مربكة",
  "Höflichkeit und Register": "خطوتك: التزم صيغة الاحترام (Sie + «Ich würde gerne…») في كل طلب",
};

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
