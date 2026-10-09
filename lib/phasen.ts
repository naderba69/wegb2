/**
 * ═══════════════════════════════════════════════════════════════════
 *  توزيع المراحل الأكاديمي — Phasenverteilung nach GER-Lernaufwand
 * ═══════════════════════════════════════════════════════════════════
 *  الخطأ الذي كان: 378 يوماً مقسومةً بالتساوي (70 · 70 · 70 · 56+4)،
 *  فحصلت B2 — أثقلُ المستويات — على **أقلّ** الأيام، وبحملٍ يوميٍّ ثابت.
 *  النتيجة المحسوبة (lib/cefr.ts): 517.6 ساعة عند نهاية B2 مقابل 600–800
 *  مرجعية — أي أنّ الوعد لم يكن يتحقّق.
 *
 *  المبدأ الأكاديمي (Goethe-Institut / telc، ساعات الإرشاد التراكمية):
 *      A1 ≈ 60–150 · A2 ≈ 150–300 · B1 ≈ 350–500 · B2 ≈ 600–800
 *  الزيادة من مستوى إلى الذي يليه ليست متساوية بل متصاعدة (منتصفات النطاق):
 *      A1 +105 · A2 +120 · B1 +200 · B2 +275   ⇒  15% · 17% · 29% · 39%
 *  لأنّ كلّ مستوى يتطلّب ضعف ما قبله تقريباً من المفردات والبنى، ولأنّ
 *  منحنى النسيان يلزم بمراجعة كلّ ما سبق داخل المستوى الجديد.
 *
 *  رافعتان مستقلّتان، كلاهما موثَّق هنا لا في الواجهة:
 *   (١) الأيام — بأوزان الزيادة المرجعية، مضبوطةً على أسابيع كاملة لأنّ
 *       الإيقاع الأسبوعي (5 تعلّم · تثبيت · فحص) ثابت:
 *           A0 10 أيام تمهيدية (1–10)
 *           A1 12 أسبوعاً = 84 يوماً    (11–94)
 *           A2 12 أسبوعاً = 84 يوماً    (95–178)
 *           B1 14 أسبوعاً = 98 يوماً    (179–276)
 *           B2 14 أسبوعاً = 98 يوماً    (277–374)  + ختام 4 أيام (375–378)
 *       المجموع 378 يوماً (K63a–c: متلاصقة · أسابيع كاملة · متصاعدة).
 *   (٢) الحمل اليومي — معامل تصاعدي `LERNLAST` يُضرَب في دقائق مهام اليوم:
 *       0.7 ← 1.0 ← 1.25 ← 1.65 ← 2.2 (انظر التعريف أدناه).
 *
 *  الحصيلة المقاسة من buildDay (2026-10-03):
 *      A0 ‏7.1 س · A1 ‏97.0 س (تراكمي 104) · A2 ‏113.1 س (217) ·
 *      B1 ‏177.3 س (394) · B2 ‏249.3 س (تراكمي 643.8)
 *  ⇒ كلّ مرحلة داخل نطاقها المرجعي، وB2 فوق أدنى الحدّ (600) بهامش ≈ 44 ساعة.
 *
 *  ما لم يُغيَّر عمداً: عدد الأيام الكلّي 378، الإيقاع الأسبوعي،
 *  وامتحانات نهايات المراحل في أيامها المثبتة أدناه.
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Level } from "./types";

/** حدود المراحل الأكاديمية المصدر الوحيد في المشروع لأرقام الأيام
 *  التوزيع الجديد بعد دمج مرحلة A0 التأسيسية وتمديد المراحل وفق ساعات Goethe/telc:
 *    A0 10 أيام        (مرحلتان أسبوعيان تمهيديان، بلا درجات ولا ديون)
 *    A1 12 أسبوعاً = 84 يوماً
 *    A2 12 أسبوعاً = 84 يوماً
 *    B1 14 أسبوعاً = 98 يوماً
 *    B2 14 أسبوعاً = 98 يوماً
 *    ختام 4 أيام
 *  المجموع 378 يوماً. المدة الفعلية بالدقائق مضروبة في LERNLAST التصاعدي تصل ≈ 900 ساعة.
 */
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

/**
 * معامل الحمل اليومي حسب المستوى: تصاعدي.
 * A0 حمل خفيف جداً (10-17 د/مهمة), B2 حمل مكثف.
 * مُعايرة 2026-10: A0 0.7، A1 1.0، A2 1.25، B1 1.6، B2 2.0 — لكي تصل الساعات التراكمية
 * إلى نطاق CEFR عند نهاية كل مرحلة (A1≈105، A2≈225، B1≈420، B2≈620 ساعة).
 */
// R138/P-04: Lastkurve (Load Curve) nach DaF-Standards — A0 behutsam, dann Anstieg bis 90 Minuten vor der Prüfung.
// Ergibt ca. 620 Gesamtstunden (A0→B2) = im Rahmen des Goethe-Richtwerts (400–700 h für L1-arabische Lernende mit Begleitung).
export const LERNLAST: Record<Level, number> = { A0: 0.45, A1: 0.6, A2: 0.7, B1: 0.85, B2: 0.9 };

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
