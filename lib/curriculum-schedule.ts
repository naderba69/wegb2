import {
  CURRICULUM_SCHEDULE_VERSION,
  TOTAL_DAYS,
  type Progress,
} from "./types";

function boundedDay(day: number): number {
  return Math.min(TOTAL_DAYS, Math.max(1, Number.isFinite(day) ? Math.floor(day) : 1));
}

/**
 * حدّ الترحيل الذي يحمي الأيام المحفوظة والأسبوع الجاري عند الانتقال من
 * ترتيب الدروس القديم إلى الترتيب المرتّب حسب المتطلبات السابقة.
 * لا تُستخدم هذه الدالة لتغيير أي نتيجة؛ إنها تحدد فقط أي أيام تبقى على
 * مخططها السابق.
 */
export function legacyThroughDayFor(progress: Progress): number {
  const plan = progress.plan;
  if (plan.curriculumScheduleVersion === CURRICULUM_SCHEDULE_VERSION) {
    const stored = plan.curriculumLegacyThroughDay ?? 0;
    return Math.min(TOTAL_DAYS, Math.max(0, Math.floor(stored)));
  }

  let protectedDay = boundedDay(plan.day ?? 1);
  for (const day of Object.keys(plan.days ?? {})) {
    const parsed = Number(day);
    if (Number.isFinite(parsed) && parsed > 0) protectedDay = Math.max(protectedDay, boundedDay(parsed));
  }
  for (const key of Object.keys(plan.tasks ?? {})) {
    const match = /^(\d+):/.exec(key);
    if (!match) continue;
    const parsed = Number(match[1]);
    if (Number.isFinite(parsed) && parsed > 0) protectedDay = Math.max(protectedDay, boundedDay(parsed));
  }

  // الأسبوع يبدأ بأيام الخطة 1، 8، 15…؛ نثبّت نهايته لا اليوم وحده.
  return Math.min(TOTAL_DAYS, Math.ceil(protectedDay / 7) * 7);
}

/** ترحيل إضافي غير هدّام: يحتفظ بسجلّ المستخدم ويضيف وسم إصدار الجدولة وحدّها فقط. */
export function migrateCurriculumSchedule(progress: Progress): Progress {
  const legacyThroughDay = legacyThroughDayFor(progress);
  if (
    progress.plan.curriculumScheduleVersion === CURRICULUM_SCHEDULE_VERSION &&
    progress.plan.curriculumLegacyThroughDay === legacyThroughDay
  ) {
    return progress;
  }
  return {
    ...progress,
    plan: {
      ...progress.plan,
      curriculumScheduleVersion: CURRICULUM_SCHEDULE_VERSION,
      curriculumLegacyThroughDay: legacyThroughDay,
    },
  };
}
