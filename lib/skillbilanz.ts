import { lokalesDatumPlus } from "./datum";
import type { Progress } from "./types";
import { evidenceTypeOf, isMeasuredEvidence, KOMPETENZEN } from "./kompetenz";
import type { Kompetenz } from "./types";

/**
 * ⚖️ A30 (R284, Experten-Audit ← N30): Skill-Balance-Wächter.
 * Neu geloggte Versuche tragen ein Datum (logK, R284); die Bilanz nutzt die
 * letzten 7 Tage, sobald genug datierte Einträge existieren — sonst ehrlich
 * das Verlaufsfenster der letzten 120 Versuche (kein Datum wird erfunden).
 */
export interface SkillZeile { hand: Kompetenz; versuche: number; gemessen: number; selbst: number; anteil: number; quote: number | null }
export interface SkillBilanz { fenster: "7-tage" | "verlauf"; eintraege: number; zeilen: SkillZeile[]; warnung: string | null }

export function skillBilanz(p: Progress, jetzt = new Date()): SkillBilanz {
  const log = p.kompetenzLog ?? [];
  const grenze = lokalesDatumPlus(-7, jetzt);
  const datiert = log.filter((e) => e.d && e.d >= grenze);
  const fenster: SkillBilanz["fenster"] = datiert.length >= 10 ? "7-tage" : "verlauf";
  const basis = fenster === "7-tage" ? datiert : log.slice(-120);
  const zeilen: SkillZeile[] = KOMPETENZEN.map((hand) => {
    const teil = basis.filter((e) => e.h === hand);
    const gemessen = teil.filter(isMeasuredEvidence);
    return {
      hand,
      versuche: teil.length,
      gemessen: gemessen.length,
      selbst: teil.filter((e) => evidenceTypeOf(e) === "self_report").length,
      anteil: basis.length ? Math.round((teil.length / basis.length) * 1000) / 1000 : 0,
      quote: gemessen.length ? Math.round((gemessen.filter((e) => e.ok).length / gemessen.length) * 100) / 100 : null,
    };
  });
  let warnung: string | null = null;
  if (basis.length >= 20) {
    const fehlend = zeilen.filter((z) => z.anteil < 0.08);
    const dominant = zeilen.filter((z) => z.anteil > 0.55);
    if (fehlend.length) warnung = `مهارة شبه غائبة في تدريبك الأخير: ${fehlend.map((z) => z.hand).join("، ")} — خصّص لها جلسة هذا الأسبوع.`;
    else if (dominant.length) warnung = `مهارة واحدة تهيمن (${dominant[0].hand}: ${Math.round(dominant[0].anteil * 100)}٪) — التوازن يحمي نتيجتك لأن الامتحان بلا تعويض بين المهارات.`;
  }
  return { fenster, eintraege: basis.length, zeilen, warnung };
}
