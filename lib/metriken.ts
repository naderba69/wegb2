// 📊 مقاييس النجاح الثلاثة (R34/HANDOFF §10) — دوالّ نقية حتمية من بيانات Progress:
//   M1 نسبة المهام الحرّة المسلَّمة بتقييم مسجّل (الهدف ≥90٪)
//   M2 شفاء أخطاء الدفتر خلال 3 إعادات (العالق = 3+ تعثّر بلا نجاح)
//   M3 منحنى امتحانات المراحل + الوحدات المعادة مرتين (خلل في تصميمنا)
import type { Progress, TodayUxDayMetric } from "./types";
import type { TodayStepId } from "./today-steps";

export const FREI_ARTEN: readonly string[] = ["schreiben", "sprechen", "aussprache"];

export function feedbackQuote(p: Progress): { done: number; graded: number; pct: number | null } {
  const tasks = Object.values(p.plan.tasks ?? {}).filter(
    (t) => t.done && FREI_ARTEN.includes(t.kind ?? "")
  );
  const graded = tasks.filter((t) => t.total > 0).length;
  return { done: tasks.length, graded, pct: tasks.length ? Math.round((graded / tasks.length) * 100) : null };
}

export function fehlerHeilung(p: Progress): { total: number; geheilt: number; stuck: number; pct: number | null } {
  const alle = Object.values(p.fehler ?? {});
  const geheilt = alle.filter((f) => f.treffer === 0 && (f.srs?.reps ?? 0) > 0).length;
  const stuck = alle.filter((f) => f.treffer >= 3).length;
  return { total: alle.length, geheilt, stuck, pct: alle.length ? Math.round((geheilt / alle.length) * 100) : null };
}

export type KurvenTrend = "steigend" | "fallend" | "stabil" | null;

export function pruefungsKurve(p: Progress): {
  punkte: { day: number; score: number }[];
  trend: KurvenTrend;
  wiederholt: number[];
} {
  const alle = Object.entries(p.exams ?? {})
    .map(([d, e]) => ({ day: Number(d), score: e.score }))
    .sort((a, b) => a.day - b.day);
  let trend: KurvenTrend = null;
  if (alle.length >= 2) {
    const halb = Math.floor(alle.length / 2);
    const avg = (xs: { score: number }[]) => xs.reduce((n, x) => n + x.score, 0) / xs.length;
    const d = avg(alle.slice(halb)) - avg(alle.slice(0, halb));
    trend = d >= 5 ? "steigend" : d <= -5 ? "fallend" : "stabil";
  }
  const wiederholt = Object.entries(p.modulPruefungen ?? {})
    .filter(([, m]) => m.versuche >= 3)
    .map(([n]) => Number(n))
    .sort((a, b) => a - b);
  return { punkte: alle.slice(-8), trend, wiederholt };
}

export interface TodayUxSummary {
  attemptedDays: number;
  firstSuccessDays: number;
  medianFirstSuccessMin: number | null;
  step5EligibleDays: number;
  step5ReachedDays: number;
  step5ReachedPct: number | null;
  closedDays: number;
  closedPct: number | null;
}

const safeActiveMs = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

/**
 * يسجل تسليم مهمة «اليوم» محلياً. الزمن يأتي حصراً من مؤقت الجلسة النشط؛
 * لا نستخدم Date.now ولا تقدير دقائق المهمة، ولا نحفظ نص الإجابة.
 */
export function recordTodayUxSubmission(
  current: Progress["todayUx"],
  day: number,
  activeMs: number,
  step: TodayStepId,
  passed: boolean,
  hasStep5: boolean,
): NonNullable<Progress["todayUx"]> {
  const ms = safeActiveMs(activeMs);
  if (!Number.isInteger(day) || day < 1 || ms === null) return current ?? { version: 1, days: {} };

  const previous = current?.days?.[day];
  const next: TodayUxDayMetric = {
    ...previous,
    hasStep5: !!previous?.hasStep5 || hasStep5,
    firstAttemptActiveMs: safeActiveMs(previous?.firstAttemptActiveMs) ?? ms,
  };
  if (passed && safeActiveMs(next.firstSuccessActiveMs) === null) next.firstSuccessActiveMs = ms;
  if (step === 5 && safeActiveMs(next.reachedStep5ActiveMs) === null) next.reachedStep5ActiveMs = ms;

  return {
    version: 1,
    days: { ...(current?.days ?? {}), [day]: next },
  };
}

/** الإغلاق العادي فقط يُسجَّل إكمالاً؛ مسار «يوم سيئ» لا يستدعي هذه الدالة. */
export function recordTodayUxClosed(
  current: Progress["todayUx"],
  day: number,
  activeMs: number,
): NonNullable<Progress["todayUx"]> {
  const ms = safeActiveMs(activeMs);
  if (!Number.isInteger(day) || day < 1 || ms === null) return current ?? { version: 1, days: {} };
  const previous = current?.days?.[day];
  return {
    version: 1,
    days: {
      ...(current?.days ?? {}),
      [day]: {
        ...previous,
        hasStep5: previous?.hasStep5 === true,
        closedActiveMs: safeActiveMs(previous?.closedActiveMs) ?? ms,
      },
    },
  };
}

const median = (values: number[]): number | null => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** ملخص وصفي لملف هذا المتعلم على هذا الجهاز — ليس تحليلات جماعية ولا نتيجة ميدانية عامة. */
export function todayUxSummary(progress: Progress): TodayUxSummary {
  const days = Object.values(progress.todayUx?.days ?? {});
  const attempted = days.filter((day) => safeActiveMs(day.firstAttemptActiveMs) !== null);
  const firstSuccess = attempted.flatMap((day) => {
    const ms = safeActiveMs(day.firstSuccessActiveMs);
    return ms === null ? [] : [ms];
  });
  const eligible = attempted.filter((day) => day.hasStep5);
  const reached = eligible.filter((day) => safeActiveMs(day.reachedStep5ActiveMs) !== null);
  const closed = attempted.filter((day) => safeActiveMs(day.closedActiveMs) !== null);
  const medianMs = median(firstSuccess);

  return {
    attemptedDays: attempted.length,
    firstSuccessDays: firstSuccess.length,
    medianFirstSuccessMin: medianMs === null ? null : Math.round((medianMs / 60_000) * 10) / 10,
    step5EligibleDays: eligible.length,
    step5ReachedDays: reached.length,
    step5ReachedPct: eligible.length ? Math.round((reached.length / eligible.length) * 100) : null,
    closedDays: closed.length,
    closedPct: attempted.length ? Math.round((closed.length / attempted.length) * 100) : null,
  };
}
