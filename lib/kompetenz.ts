// lib/kompetenz.ts — سجل نشاط وأداء تدريبي داخلي؛ ليس ملف CEFR ولا توقع امتحان.
// يفصل نوع الدليل: measured / self_report / activity / external_review.
// الإكمال والتقييم الذاتي لا يدخلان نسبة الأداء، والبيانات القديمة بلا provenance تُعامل نشاطاً.

import { lokalesDatum } from "./datum";
import type {
  Progress,
  Kompetenz,
  KompetenzEvidenceLevel,
  KompetenzEvidenceType,
  KompetenzLogEintrag,
  KompetenzResponseMode,
} from "./types";

export const KOMPETENZEN: Kompetenz[] = ["Lesen", "Hoeren", "Schreiben", "Sprechen", "Grammatik", "Wortschatz"];
export const MIN_MEASURED_PER_SKILL = 8;

export const KOMPETENZ_AR: Record<Kompetenz, string> = {
  Lesen: "قراءة",
  Hoeren: "استماع",
  Schreiben: "كتابة",
  Sprechen: "محادثة",
  Grammatik: "قواعد",
  Wortschatz: "مفردات",
};

/** فئات الأخطاء ← مجال التدريب المتأثر. */
export const FEHLER_ZU_KOMPETENZ: Record<string, Kompetenz> = {
  "falsche-freunde": "Wortschatz",
  wortstellung: "Grammatik",
  artikel: "Grammatik",
  praeposition: "Grammatik",
  zeitform: "Grammatik",
  "zahlen-zeit": "Hoeren",
  konstruktion: "Schreiben",
  schreibung: "Schreiben",
  wortschatz: "Wortschatz",
  sonst: "Grammatik",
};

export type KompetenzEvidenceMeta = {
  evidenceType?: KompetenzEvidenceType;
  level?: KompetenzEvidenceLevel;
  weight?: number;
  assisted?: boolean;
  responseMode?: KompetenzResponseMode;
  method?: string;
  sourceId?: string;
};

/**
 * يسجل حدثاً في المجال. الافتراضي activity عمداً: لا يُرقّى أي استدعاء قديم
 * أو زر إكمال إلى قياس أداء من دون تصريح provenance عند نقطة القياس نفسها.
 */
export function logK(
  p: Progress,
  h: Kompetenz,
  ok: boolean,
  meta: KompetenzEvidenceMeta = {},
): Progress {
  const entry: KompetenzLogEintrag = {
    h,
    ok,
    d: lokalesDatum(),
    evidenceType: meta.evidenceType ?? "activity",
    level: meta.level,
    weight: meta.weight,
    assisted: meta.assisted,
    responseMode: meta.responseMode,
    method: meta.method,
    sourceId: meta.sourceId,
  };
  return { ...p, kompetenzLog: [...(p.kompetenzLog || []), entry].slice(-600) };
}

/** نقطة صريحة لمحركات التصحيح المحلي؛ تبقى النتيجة أداءً تدريبياً لا حكماً CEFR. */
export function logMeasuredK(
  p: Progress,
  h: Kompetenz,
  ok: boolean,
  meta: Omit<KompetenzEvidenceMeta, "evidenceType"> = {},
): Progress {
  return logK(p, h, ok, {
    ...meta,
    evidenceType: "measured",
    method: meta.method ?? "local_auto_grader",
  });
}

/** غياب النوع في السجلات القديمة لا يتحول إلى measured بأثر رجعي. */
export function evidenceTypeOf(entry: KompetenzLogEintrag): KompetenzEvidenceType {
  return entry.evidenceType ?? "activity";
}

export function isMeasuredEvidence(entry: KompetenzLogEintrag): boolean {
  const typ = evidenceTypeOf(entry);
  return (typ === "measured" || typ === "external_review") && entry.assisted !== true;
}

/** Legacy entries keep neutral weight 1; malformed/non-positive weights cannot erase evidence. */
export function evidenceWeightOf(entry: KompetenzLogEintrag): number {
  return typeof entry.weight === "number" && Number.isFinite(entry.weight) && entry.weight > 0
    ? Math.min(entry.weight, 1)
    : 1;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export type KompetenzWert = {
  /** نسبة أداء تدريبي داخلي، أو null حتى تتوافر العينة الدنيا الصريحة. */
  wert: number | null;
  kern: number | null;
  /** وحدات الدليل الموزونة في المجال؛ المهمة المختلطة لا تُحسب كاملةً في كل مجال. */
  versuche: number;
  /** الأدلة المقاسة المؤهلة فقط؛ assisted لا يدخل النسبة. */
  measured: number;
  /** مجموع أوزان الأدلة المقاسة؛ هو الذي يحقق حد العينة الدنيا. */
  measuredWeight: number;
  selfReported: number;
  activity: number;
  externalReviewed: number;
  status: "unknown" | "insufficient" | "measured";
};

/**
 * لا تمزج هذه الدالة الإكمال أو Can-Do أو SRS أو الأيام المغلقة بالأداء.
 * النسبة حديثة وموزونة، لكنها تبقى «أداء تدريب داخلي» لا مستوى CEFR.
 */
export function kompetenzWerte(p: Progress): Record<Kompetenz, KompetenzWert> {
  const out = {} as Record<Kompetenz, KompetenzWert>;
  for (const h of KOMPETENZEN) {
    const log = (p.kompetenzLog || []).filter((entry) => entry.h === h).slice(-80);
    const measured = log.filter(isMeasuredEvidence);
    const selfReported = log.filter((entry) => evidenceTypeOf(entry) === "self_report").length;
    const activity = log.filter((entry) => evidenceTypeOf(entry) === "activity").length;
    const externalReviewed = log.filter((entry) => evidenceTypeOf(entry) === "external_review" && entry.assisted !== true).length;
    const measuredWeight = measured.reduce((sum, entry) => sum + evidenceWeightOf(entry), 0);

    let kern: number | null = null;
    if (measuredWeight >= MIN_MEASURED_PER_SKILL) {
      const last = measured.slice(-40);
      let gewichtSumme = 0;
      let erfolgSumme = 0;
      last.forEach((entry, index) => {
        const gewicht = (1 + index / last.length) * evidenceWeightOf(entry);
        gewichtSumme += gewicht;
        erfolgSumme += (entry.ok ? 1 : 0) * gewicht;
      });
      kern = clamp((erfolgSumme / gewichtSumme) * 100);
    }

    out[h] = {
      wert: kern,
      kern,
      versuche: Math.round(log.reduce((sum, entry) => sum + evidenceWeightOf(entry), 0) * 1000) / 1000,
      measured: measured.length,
      measuredWeight,
      selfReported,
      activity,
      externalReviewed,
      status: kern !== null ? "measured" : log.length > 0 ? "insufficient" : "unknown",
    };
  }
  return out;
}

export type EvidenzUebersicht = {
  measuredSkills: number;
  requiredSkills: number;
  measuredEntries: number;
  selfReportedEntries: number;
  activityEntries: number;
  externalReviewedEntries: number;
  /** لا يحسب إلا إذا استوفت المجالات الستة العينة الدنيا؛ وليس حكماً CEFR. */
  completeTrainingPerformance: number | null;
  /** التطبيق لا يملك معايرة خارجية لازمة لإصدار حكم جاهزية. */
  examReadiness: "not_assessed";
};

export function evidenzUebersicht(p: Progress): EvidenzUebersicht {
  const werte = kompetenzWerte(p);
  const measuredSkills = KOMPETENZEN.filter((h) => werte[h].wert !== null).length;
  const completeTrainingPerformance = measuredSkills === KOMPETENZEN.length
    ? clamp(KOMPETENZEN.reduce((sum, h) => sum + (werte[h].wert ?? 0), 0) / KOMPETENZEN.length)
    : null;
  return {
    measuredSkills,
    requiredSkills: KOMPETENZEN.length,
    measuredEntries: KOMPETENZEN.reduce((sum, h) => sum + werte[h].measured, 0),
    selfReportedEntries: KOMPETENZEN.reduce((sum, h) => sum + werte[h].selfReported, 0),
    activityEntries: KOMPETENZEN.reduce((sum, h) => sum + werte[h].activity, 0),
    externalReviewedEntries: KOMPETENZEN.reduce((sum, h) => sum + werte[h].externalReviewed, 0),
    completeTrainingPerformance,
    examReadiness: "not_assessed",
  };
}
