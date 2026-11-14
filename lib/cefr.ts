/**
 * مقارنة حمل زمني إرشادية + أدوات سجل الوقت.
 *
 * نطاقات الساعات أدناه تقديرات تراكمية منشورة لدورات Goethe-Institut
 * (ساعات 60 دقيقة محوّلة من وحدات تدريسية طولها 45 دقيقة). هي سياق تخطيطي
 * للمؤسسات، وليست سلماً يحوّل الوقت الفردي إلى مستوى CEFR. لا تستنتج هذه
 * الوحدة مستوى المتعلم أو جاهزيته للامتحان؛ ذلك يحتاج أداءً مقاساً في مهارات
 * متعددة ومعايير تقويم مناسبة.
 */

import type { Level, Progress } from "./types";
import { PHASE_END_DAY } from "./phasen";
export { PHASE_END_DAY };

export type KursLevel = Exclude<Level, "A0">;

/** تقديرات ساعات دورات Goethe التراكمية من الصفر، بساعات 60 دقيقة حقيقية. */
export const GOETHE_KURSSTUNDEN: Record<KursLevel, readonly [number, number]> = {
  A1: [60, 150],
  A2: [150, 260],
  B1: [260, 490],
  B2: [450, 600],
};

export const KURS_LEVELS: KursLevel[] = ["A1", "A2", "B1", "B2"];

export type ZeitlastPosition = "unterhalb" | "innerhalb" | "oberhalb";

export interface ZeitlastVergleich {
  level: KursLevel;
  /** تقدير ساعات مهام الخطة التراكمي حتى نهاية القسم. */
  planStd: number;
  /** نطاق تقديري لساعات دورة مؤسسية؛ لا عتبة كفاءة فردية. */
  kursSpanne: readonly [number, number];
  position: ZeitlastPosition;
}

export const ZEITLAST_POSITION_AR: Record<ZeitlastPosition, { text: string; farb: string }> = {
  unterhalb: { text: "أقل من نطاق ساعات الدورة المنشور", farb: "var(--color-ink2)" },
  innerhalb: { text: "ضمن نطاق ساعات الدورة المنشور", farb: "var(--color-ink2)" },
  oberhalb: { text: "أعلى من نطاق ساعات الدورة المنشور", farb: "var(--color-ink2)" },
};

/** موقع رقم زمني داخل نطاق زمني، بلا تحويله إلى حكم على المتعلم. */
export function zeitlastPosition(planStd: number, spanne: readonly [number, number]): ZeitlastPosition {
  if (planStd < spanne[0]) return "unterhalb";
  if (planStd > spanne[1]) return "oberhalb";
  return "innerhalb";
}

/**
 * يقارن تقدير وقت الخطة بنطاقات دورات مؤسسية لأغراض السياق فقط.
 * لا تعيد الدالة مستوى «قابلاً للتحقيق» ولا نتيجة نجاح/رسوب.
 */
export function vergleicheZeitlast(stundenBis: (day: number) => number): ZeitlastVergleich[] {
  return KURS_LEVELS.map((level) => {
    const planStd = Math.round(stundenBis(PHASE_END_DAY[level]) * 10) / 10;
    const kursSpanne = GOETHE_KURSSTUNDEN[level];
    return {
      level,
      planStd,
      kursSpanne,
      position: zeitlastPosition(planStd, kursSpanne),
    };
  });
}

/* ── الوقت الفعلي: قياس منفصل عن تقدير المهام ─────────────────────── */

/** مجموع الدقائق التي قاسها مؤقت الجلسة في الخطة كلها. */
export function minutenEffektiv(p: Progress): number {
  const q = p.plan.minutenEffektiv;
  if (typeof q === "number" && Number.isFinite(q) && q >= 0) return q;
  return 0;
}

/** دقائق المهام المقدّرة التي أغلقت فعلاً؛ ليست وقتاً مقاساً. */
export function minutenGeplantErledigt(p: Progress): number {
  let sum = 0;
  for (const key of Object.keys(p.plan.tasks)) {
    const t = p.plan.tasks[key];
    if (t && t.done) sum += t.geplantMin ?? 0;
  }
  return sum;
}

export const minutenZuStunden = (m: number) => Math.round((m / 60) * 10) / 10;

/** سقف حماية للإدخال اليدوي الواحد؛ الإدخال يبقى منفصلاً عن قياس المؤقت. */
export const MAX_MIN_PRO_TASK = 90;

export function clampMinuten(min: number): number {
  if (!Number.isFinite(min) || min <= 0) return 0;
  return Math.min(MAX_MIN_PRO_TASK, Math.round(min));
}

/** صياغة عربية للساعات مع منزلة عشرية واحدة عند الحاجة. */
export function stundenTextAr(std: number): string {
  const s = Math.round(std * 10) / 10;
  return `${s} ساعة`;
}
