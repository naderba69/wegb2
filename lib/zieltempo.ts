/**
 * ═══════════════════════════════════════════════════════════════════
 *  📅 U6/R192 · هدف بتاريخ — إعادة إيقاع داخل السقوف فقط
 * ═══════════════════════════════════════════════════════════════════
 *  من موعد الامتحان وموضع المتعلّم الحالي يُشتقّ الإيقاع المطلوب:
 *  أيام خطة لكلّ يوم تقويمي، وحملٌ يومي بالدقائق من دقائق الخطة
 *  المخطّطة نفسها (planMinBis). الإعادة لا تلمس الخطة: سقوف اليوم
 *  (سقفا D1-B الموثّقان في K260) وتغطية 157/164/90 ثابتة بنيويًا،
 *  فلا نضغط يومًا فوق سقفه ولا نحذف محتوى. وإن صار الحمل فوق ما
 *  يُحتمل مستدامًا قلنا ذلك صراحةً واقترحنا أقرب موعد واقعي.
 * ═══════════════════════════════════════════════════════════════════
 */
import { planMinBis } from "./plan";
import { D1_B2_DECKEL_MIN } from "./phasen";
import { TOTAL_DAYS } from "./types";
import type { Progress } from "./types";

/**
 * أقصى حمل يومي نعرضه كـ«ممكن باستدامة»: يومُ خطةٍ كاملٌ بأثقل سقفٍ
 * مخطط (D1_B2_DECKEL_MIN من lib/phasen — مصدر الثوابت الأوحد، وبه
 * يبقى ملفّنا بلا الرقم المحروس كما تطلبه K123a).
 */
export const ZIEL_MINUTEN_OK = D1_B2_DECKEL_MIN;
/** فوق ١٫٥ ضعفِ أثقلِ يومٍ لا ندّعي الواقعية بالحفاظ على السقوف */
export const ZIEL_MINUTEN_MAX = Math.round(D1_B2_DECKEL_MIN * 1.5);

export type ZielStatus = "kein-datum" | "vorbei" | "fertig" | "ruhig" | "eng" | "unrealistisch";

export interface ZielTempo {
  status: ZielStatus;
  /** Tage der Plan, die noch offen sind */
  restPlanTage: number;
  /** Kalendertage bis zur Prüfung */
  kalenderTage: number;
  /** benötigte Plantage pro Kalendertag (1 = Normalrhythmus) */
  tempoProTag: number;
  /** Ø geplante Minuten der offenen Plantage */
  minutenJePlanTag: number;
  /** empfohlene geplante Minuten pro Kalendertag bei diesem Tempo */
  minutenProTag: number;
  /** frühestes Datum, an dem der Rest bei ZIEL_MINUTEN_OK pro Tag schaffbar ist */
  fruehestesRuhigesDatum?: string;
}

function tageZwischen(heuteIso: string, zielIso: string): number {
  const a = new Date(heuteIso + "T00:00:00Z").getTime();
  const b = new Date(zielIso + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86400000);
}
function plusTage(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * الإيقاع المطلوب لبلوغ نهاية الخطة عند تاريخ الامتحان — اشتقاق نقي.
 * اليوم الحالي يبدأ من plan.day؛ ما أُغلق لا يُعاد حسابه.
 */
export function zielTempo(progress: Progress, heuteIso: string): ZielTempo {
  const exam = progress.settings.examDate;
  const heuteTag = Math.min(Math.max(progress.plan.day, 1), TOTAL_DAYS);
  const restPlanTage = Math.max(0, TOTAL_DAYS - heuteTag + 1);
  const restMinuten = planMinBis(TOTAL_DAYS) - planMinBis(heuteTag - 1);
  const minutenJePlanTag = restPlanTage > 0 ? restMinuten / restPlanTage : 0;

  if (!exam) {
    return { status: "kein-datum", restPlanTage, kalenderTage: 0, tempoProTag: 0, minutenJePlanTag, minutenProTag: 0 };
  }
  const kalenderTage = tageZwischen(heuteIso, exam);
  if (kalenderTage < 0) {
    return { status: "vorbei", restPlanTage, kalenderTage, tempoProTag: 0, minutenJePlanTag, minutenProTag: 0 };
  }
  if (restPlanTage === 0) {
    return { status: "fertig", restPlanTage: 0, kalenderTage, tempoProTag: 0, minutenJePlanTag: 0, minutenProTag: 0 };
  }
  const tempoProTag = kalenderTage > 0 ? restPlanTage / kalenderTage : Infinity;
  const minutenProTag = tempoProTag * minutenJePlanTag;
  const status: ZielStatus =
    minutenProTag <= ZIEL_MINUTEN_OK ? "ruhig" : minutenProTag <= ZIEL_MINUTEN_MAX ? "eng" : "unrealistisch";
  const fruehestesRuhigesDatum =
    status === "ruhig"
      ? undefined
      : plusTage(heuteIso, Math.ceil(restMinuten / ZIEL_MINUTEN_OK));
  return {
    status,
    restPlanTage,
    kalenderTage,
    tempoProTag: Math.round(tempoProTag * 100) / 100,
    minutenJePlanTag: Math.round(minutenJePlanTag),
    minutenProTag: Math.round(minutenProTag),
    fruehestesRuhigesDatum,
  };
}
