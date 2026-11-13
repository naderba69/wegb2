/**
 * حدود مراحل الخطة ومعاملات تقدير مهامها.
 *
 * هذا الملف هو مصدر حدود الأيام والثوابت فقط. لا تُنسخ هنا مجاميع أو متوسطات
 * زمنية: `planArbeitslast()` في lib/plan.ts يحسبها من المهام الفعلية، وهو المصدر
 * الوحيد للنصوص المعروضة. معاملات الحمل تنظّم تقدير الوقت ولا تثبت مستوى CEFR
 * أو جاهزية امتحان، ولا توجد مسارات 180/600 يوم غير منفذة.
 */

import type { Level } from "./types";

/** حدود المراحل: A0 تمهيدي، ثم A1/A2 (12 أسبوعاً لكل منهما)،
 * B1/B2 (14 أسبوعاً لكل منهما)، ثم أربعة أيام ختامية. */
export const PHASEN: Record<Exclude<Level, "B2"> extends never ? never : Level, { von: number; bis: number; wochen: number }> = {
  A0: { von: 1,   bis: 10,  wochen: 2 },
  A1: { von: 11,  bis: 94,  wochen: 12 },
  A2: { von: 95,  bis: 178, wochen: 12 },
  B1: { von: 179, bis: 276, wochen: 14 },
  B2: { von: 277, bis: 374, wochen: 14 },
};

/** أيام الختام (تقرير + امتحان نهائي) */
export const ABSCHLUSS_VON = 375;
export const TOTAL_DAYS = 378;
export const PRUEFUNG_B2_GESAMT = 400;
export const PRUEFUNG_B2_BESTEHEN = 240;

/** سقفا الحمل اليومي المخطط (D1-B · قرار المالك 2026-10-16 · R168/R392) — دقائق مخطَّطة من buildDay لا زمن مقيس ميدانياً.
 *  B1+B2 معاً تُكشَط ذرواتها داخل lib/plan.ts من المراجعة المتكررة فقط؛ لا بطاقات أدوات صورية ولا قطع لمحتوى بنكي فريد. */
export const D1_B1_DECKEL_MIN = 240;
export const D1_B2_DECKEL_MIN = 270;

/** أول يوم في كل مستوى */
export const PHASE_START: Record<Level, number> = {
  A0: PHASEN.A0.von, A1: PHASEN.A1.von, A2: PHASEN.A2.von, B1: PHASEN.B1.von, B2: PHASEN.B2.von,
};

/** آخر يوم يُحسب على المستوى في عقد الساعات (B2 تشمل الختام) */
export const PHASE_END_DAY: Record<Level, number> = {
  A0: PHASEN.A0.bis, A1: PHASEN.A1.bis, A2: PHASEN.A2.bis, B1: PHASEN.B1.bis, B2: TOTAL_DAYS,
};

/** أيام امتحان نهاية المرحلة (A1 · A2 · B1 · B2) */
export const PHASEN_PRUEFUNGSTAGE: number[] = [PHASEN.A0.bis, PHASEN.A1.bis, PHASEN.A2.bis, PHASEN.B1.bis];

/** معامل نسبي لتقدير دقائق المهمة حسب قسم الخطة. لا يُحوَّل إلى حكم كفاءة. */
export const LERNLAST: Record<Level, number> = { A0: 0.7, A1: 1.0, A2: 1.25, B1: 1.65, B2: 2.2 };

/** المستوى الذي يقع فيه اليوم */
export function levelAmTag(day: number): Level {
  if (day >= PHASEN.B2.von) return "B2";
  if (day >= PHASEN.B1.von) return "B1";
  if (day >= PHASEN.A2.von) return "A2";
  if (day >= PHASEN.A1.von) return "A1";
  return "A0";
}

/** هل اليوم يوم امتحان نهاية مرحلة؟ */
export function istPhasenPruefung(day: number): boolean {
  return PHASEN_PRUEFUNGSTAGE.includes(day);
}

/** تطبيق معامل الحمل على دقائق مهمة — تقريب إلى 5 دقائق، ولا يقلّ عن 5 */
export function lastMinuten(minuten: number, level: Level): number {
  const m = Math.round((minuten * LERNLAST[level]) / 5) * 5;
  return Math.max(5, m);
}
