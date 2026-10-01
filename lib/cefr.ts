/**
 * ═══════════════════════════════════════════════════════════════════
 *  عقد الساعات — CEFR-Stundenvertrag
 * ═══════════════════════════════════════════════════════════════════
 *  المشكلة التي وُجدت هذه الوحدة لسدّها:
 *    المشروع يَعِدُ بـ «A0 → B2 في 270 يوماً»، لكنّه كان
 *      (١) لا يعرف كم ساعةً يخطِّط فعلاً — الرقمُ لم يُحسَب قط،
 *      (٢) لا يسجِّل دقيقةً واحدةً قضَاها المتعلِّم — فلا يستطيع الإثبات،
 *      (٣) لا يقارن ذلك بمرجع CEFR — فلا يعرف إن كان الوعدُ قابلاً للتحقيق.
 *
 *  المبدأ الحاكم (من ثقافة المشروع): كلُّ رقمٍ تراه مشتقٌّ بصيغةٍ موثَّقة،
 *  ولا أرقامَ زينة. فإن كان الوعدُ لا يتحقَّق بالحملِ المخطَّط، يُقال ذلك
 *  صراحةً على الشاشة — لأنَّ أداةً تدَّعي أنَّها «المدرِّس المسؤول» ثم تُسلِّمُ
 *  متعلِّمَها إلى قاعةِ B2 وهو في B1 تكونُ قد ضرَّتْه ضرراً حقيقياً.
 *
 *  المصادر المرجعية للساعات التراكمية (Unterrichtseinheiten à 45 Min bzw.
 *  Lernstunden): Goethe-Institut / telc — وهي **نطاقات** لا أرقامٌ حاسمة،
 *  وتختلف باختلاف اللغة الأم والخبرة السابقة بالتعلّم.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Level, Progress } from "./types";
import { PHASE_END_DAY } from "./phasen";
export { PHASE_END_DAY };

/** ساعات CEFR **التراكمية** من الصفر — [أدنى, أعلى] */
export const CEFR_STUNDEN: Record<Level, [number, number]> = {
  A1: [60, 150],
  A2: [150, 300],
  B1: [350, 500],
  B2: [600, 800],
};

/** ترتيب المستويات للمقارنة */
export const LEVEL_ORDER: Level[] = ["A1", "A2", "B1", "B2"];


export type StundenUrteil =
  | "erreicht"   // تجاوز أعلى النطاق المرجعي
  | "imBereich"  // داخل النطاق
  | "darunter"   // دون أدنى النطاق
  | "weitDarunter"; // دون نصف أدنى النطاق — خطر حقيقي

export interface CefrVergleich {
  level: Level;
  /** ساعات الخطة التراكمية حتى نهاية هذه المرحلة */
  planStd: number;
  /** النطاق المرجعي التراكمي */
  ref: [number, number];
  urteil: StundenUrteil;
  /** كم ساعة تنقص للوصول إلى أدنى النطاق (0 إن وُفّي) */
  fehlendBisMinimum: number;
  /** نسبة التغطية من أدنى النطاق */
  deckungProzent: number;
}

/**
 * الحكم على ساعةٍ مخطَّطة مقابل نطاق CEFR — القاعدة موثَّقة هنا لا في الواجهة.
 * `weitDarunter` عند أقلّ من نصف أدنى النطاق: هناك لا ينفع «قرِّبْت»، بل إعادة تصميم.
 */
export function urteileStunden(planStd: number, ref: [number, number]): StundenUrteil {
  const [min, max] = ref;
  if (planStd >= max) return "erreicht";
  if (planStd >= min) return "imBereich";
  if (planStd >= min / 2) return "darunter";
  return "weitDarunter";
}

export const URTEIL_AR: Record<StundenUrteil, { text: string; emoji: string; farb: string }> = {
  erreicht:     { text: "يفي بمرجع CEFR ويتجاوزه",       emoji: "🟢", farb: "var(--color-ok)" },
  imBereich:    { text: "داخل نطاق CEFR المرجعي",         emoji: "🟢", farb: "var(--color-ok)" },
  darunter:     { text: "دون أدنى النطاق — يحتاج زيادة",  emoji: "🟡", farb: "var(--color-gold)" },
  weitDarunter: { text: "ناقص نقصاً جوهرياً — الوعد لا يتحقّق بهذا الحمل", emoji: "🔴", farb: "var(--color-cola)" },
};

/**
 * مقارنة كل مرحلة بما خُطِّط لها تراكمياً.
 * `stundenBis` يجب أن تكون دالةً تراكمية: تُعطى يوماً فتردُّ ساعات الخطة حتى ذلك اليوم.
 */
export function vergleichePlan(stundenBis: (day: number) => number): CefrVergleich[] {
  return LEVEL_ORDER.map((level) => {
    const planStd = stundenBis(PHASE_END_DAY[level]);
    const ref = CEFR_STUNDEN[level];
    return {
      level,
      planStd: Math.round(planStd * 10) / 10,
      ref,
      urteil: urteileStunden(planStd, ref),
      fehlendBisMinimum: Math.max(0, Math.round((ref[0] - planStd) * 10) / 10),
      deckungProzent: Math.round((planStd / ref[0]) * 100),
    };
  });
}

/** أعمق مستوى يصل إليه المتعلّم بهذا الحمل — مشتقّ لا مُدَّعى */
export function erreichbaresNiveau(v: CefrVergleich[]): Level {
  let out: Level = "A1";
  for (const x of v) if (x.urteil === "erreicht" || x.urteil === "imBereich") out = x.level;
  return out;
}

/* ── الوقت الفعلي: ما لا يُقاس لا يُدَّعى ─────────────────────────── */

/** دقائق فعلية مسجَّلة في كل الخطة (تُملأ من تسليم المهام) */
export function minutenEffektiv(p: Progress): number {
  const q = p.plan.minutenEffektiv;
  if (typeof q === "number" && Number.isFinite(q) && q >= 0) return q;
  return 0;
}

/** دقائق مخططة مُنجَزة: مجموع دقائق المهام التي أُغلقت فعلاً */
export function minutenGeplantErledigt(p: Progress): number {
  let sum = 0;
  for (const key of Object.keys(p.plan.tasks)) {
    const t = p.plan.tasks[key];
    if (t && t.done) sum += t.geplantMin ?? 0;
  }
  return sum;
}

export const minutenZuStunden = (m: number) => Math.round((m / 60) * 10) / 10;

/**
 * تسجيل دقائق فعلية — يُستدعى عند تسليم مهمة.
 * لا يزيد إلا بمقدار موجب محدود: ساعة في تسليم واحد = قياس كاذب أو تبويب مفتوح ومنسيّ.
 */
export const MAX_MIN_PRO_TASK = 90;

export function clampMinuten(min: number): number {
  if (!Number.isFinite(min) || min <= 0) return 0;
  return Math.min(MAX_MIN_PRO_TASK, Math.round(min));
}

/** صياغة عربية صادقة للساعات — لا «≈» بلا مرجع */
export function stundenTextAr(std: number): string {
  const s = Math.round(std * 10) / 10;
  return `${s} ساعة`;
}
