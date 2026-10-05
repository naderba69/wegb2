"use client";
import { useCallback, useEffect, useState } from "react";
import {
  emptyProgress,
  type DebtItem,
  type FehlerEintrag,
  type Kompetenz,
  type Progress,
  type SrsState,
  type TaskKind,
  type TaskResult,
} from "./types";
import { clampMinuten } from "./cefr";
import { logSicherheit } from "./sicherheit";
import { upsertFehler, gradeFehlerIn } from "./fehler";
import { checkAbzeichen } from "./spiel";
import { logK, KIND_KOMPETENZ, FEHLER_ZU_KOMPETENZ } from "./kompetenz";
import { progressKeyActive } from "./profiles";
import { migrateCurriculumSchedule } from "./curriculum-schedule";

const KEY = "weg-b2-progress";
export const PROGRESS_EVENT = "weg-progress-changed";

/** Move legacy, source-unknown minute totals out of the measured-time field. Before the session timer,
 *  the UI's only way to add time was manual booking, so old totals are self-reported, not measured. */
export function separateLegacyManualMinutes(progress: Progress): Progress {
  const plan = progress.plan;
  if (plan.minutenTrennungVersion === 1) return progress;

  const safeMinutes = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
  const manualByDay: Record<number, number> = {};
  for (const [day, value] of Object.entries(plan.minutenManuellTage ?? {})) {
    const parsedDay = Number(day);
    const minutes = safeMinutes(value);
    if (Number.isInteger(parsedDay) && parsedDay >= 1 && minutes > 0) manualByDay[parsedDay] = minutes;
  }
  for (const [day, value] of Object.entries(plan.minutenEffektivTage ?? {})) {
    const parsedDay = Number(day);
    const minutes = safeMinutes(value);
    if (Number.isInteger(parsedDay) && parsedDay >= 1 && minutes > 0) {
      manualByDay[parsedDay] = (manualByDay[parsedDay] ?? 0) + minutes;
    }
  }

  return {
    ...progress,
    plan: {
      ...plan,
      minutenEffektiv: 0,
      minutenEffektivTage: {},
      minutenManuell: safeMinutes(plan.minutenManuell) + safeMinutes(plan.minutenEffektiv),
      minutenManuellTage: manualByDay,
      minutenTrennungVersion: 1,
    },
  };
}

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(progressKeyActive());
    if (!raw) return emptyProgress;
    const p = JSON.parse(raw) as Progress;
    if (p.v !== emptyProgress.v) {
      // ترحيل: الاحتفاظ بالمفردات والتقدّم البشري، إعادة ضبط الخطة
      return separateLegacyManualMinutes(migrateCurriculumSchedule({
        ...emptyProgress,
        srs: p.srs ?? {},
        canDo: p.canDo ?? {},
        streak: p.streak ?? { last: null, count: 0 },
        fehler: p.fehler ?? {},
        weak: p.weak ?? {},
        exams: p.exams ?? {},
        modulPruefungen: p.modulPruefungen ?? {},
        xp: p.xp ?? 0,
        abzeichen: p.abzeichen ?? {},
        kompetenzLog: p.kompetenzLog ?? [],
        gesundheit: p.gesundheit ?? { augenPause: true },
        settings: { ...emptyProgress.settings, ...(p.settings ?? {}) },
      }));
    }
    return separateLegacyManualMinutes(migrateCurriculumSchedule({
      ...emptyProgress,
      ...p,
      plan: { ...emptyProgress.plan, ...p.plan },
      settings: { ...emptyProgress.settings, ...p.settings },
    }));
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(p: Progress) {
  try {
    const migrated = migrateCurriculumSchedule(separateLegacyManualMinutes(p));
    window.localStorage.setItem(progressKeyActive(), JSON.stringify(migrated));
    emit();
  } catch {
    /* التخزين ممتلئ أو محظور */
  }
}

export const MAX_STREAK = 7; // K-StreakCap: لا سلاسل عدوانية — السقف 7 مع حماية «يوم سيّئ»

export function touchStreak(p: Progress): Progress {
  const today = new Date().toISOString().slice(0, 10);
  const last = p.streak.last;
  if (last === today) return p;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  // يوم سيّئ أو غياب معلَن: تُجمَّد السلسلة عند قيمتها الحالية (≤7) بلا كسر
  if (p.badDay === today || p.badDay === yesterday) {
    return { ...p, streak: { last: today, count: Math.min(p.streak.count, MAX_STREAK) } };
  }
  const count = last === yesterday ? Math.min(p.streak.count + 1, MAX_STREAK) : 1;
  return { ...p, streak: { last: today, count } };
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
    const onChange = () => setProgress(loadProgress());
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setProgress((prev) => {
      const next = touchStreak(fn(prev));
      saveProgress(next);
      return next;
    });
  }, []);

  /** تسجيل نتيجة مهمة — النجاح ≥80% (ومهمةُ التحقق تُغلِق سجلَّ درسِها استقلالاً أو حاجةً) */
    const submitTask = useCallback(
    (day: number, taskId: string, score: number, total: number, kind?: TaskKind, geplantMin?: number, verifyFor?: string, minutenEffektiv?: number) => {
      update((p) => {
        const prev = p.plan.tasks[taskId];
        const passed = total > 0 && score / total >= 0.8;
        const result: TaskResult = {
          done: true,
          passed: passed || !!prev?.passed,
          score: Math.max(score, prev?.score ?? 0),
          total,
          attempts: (prev?.attempts ?? 0) + 1,
          kind: kind ?? prev?.kind,
          at: new Date().toISOString(),
          geplantMin: geplantMin ?? prev?.geplantMin,
          minutenEffektiv: Number.isFinite(minutenEffektiv)
            ? Math.max(prev?.minutenEffektiv ?? 0, Math.max(0, minutenEffektiv as number))
            : prev?.minutenEffektiv,
        };
        const rec = verifyFor ? p.verify?.[verifyFor] : undefined;
        const verify =
          verifyFor && rec && rec.doneDay === undefined
            ? { ...(p.verify ?? {}), [verifyFor]: { ...rec, doneDay: day, passed: result.passed } }
            : p.verify;
        return checkAbzeichen(
          logK(
            {
              ...p,
              verify,
              xp: (p.xp ?? 0) + (result.passed ? 15 : 5),
              plan: { ...p.plan, tasks: { ...p.plan.tasks, [taskId]: result } },
            },
            KIND_KOMPETENZ[kind ?? prev?.kind ?? "check"] ?? "Grammatik",
            result.passed
          )
        );
      });
    },
    [update]
  );

  /** إغلاق اليوم: تسجيل النتيجة، تحويل ما لم يُتقَن إلى تعويضات، فتح الغد */
  const closeDay = useCallback(
    (
      day: number,
      dayScore: number,
      dayTotal: number,
      tasksDone: number,
      tasksTotal: number,
      debts: DebtItem[]
    ) => {
      update((p) =>
        checkAbzeichen({
          ...p,
          xp: (p.xp ?? 0) + 30,
          plan: {
            ...p.plan,
            day: day + 1, // يتقدّم يوماً بيوم حتى TOTAL_DAYS (378) ثمّ يثبت عليه levelOf
            days: {
              ...p.plan.days,
              [day]: {
                closed: true,
                score: dayScore,
                total: dayTotal,
                tasksDone,
                tasksTotal,
                at: new Date().toISOString(),
                minutenEffektiv: p.plan.minutenEffektivTage?.[day] ?? 0,
              },
            },
            debt: debts,
          },
        })
      );
    },
    [update]
  );

  const setSrs = useCallback(
    (cardId: string, state: SrsState) => {
      update((p) => ({ ...p, srs: { ...p.srs, [cardId]: state } }));
    },
    [update]
  );

  /** حفظ نتيجة امتحان مرحلة/ختام */
  const saveExam = useCallback(
    (day: number, score: number, passed: boolean) => {
      update((p) => ({
        ...p,
        exams: { ...(p.exams ?? {}), [day]: { score, passed } },
      }));
    },
    [update]
  );

  const toggleCanDo = useCallback(
    (id: string) => {
      update((p) => {
        const canDo = { ...p.canDo };
        if (canDo[id]) delete canDo[id];
        else canDo[id] = true;
        return { ...p, canDo };
      });
    },
    [update]
  );

  const importProgress = useCallback((json: string) => {
    const p = JSON.parse(json) as Progress;
    const merged = separateLegacyManualMinutes(migrateCurriculumSchedule({
      ...emptyProgress,
      ...p,
      plan: { ...emptyProgress.plan, ...p.plan },
      settings: { ...emptyProgress.settings, ...p.settings },
    }));
    saveProgress(merged);
    setProgress(merged);
  }, []);

  const reset = useCallback(() => {
    try {
      const prefix = `${progressKeyActive()}:study-clock:`;
      for (let i = window.localStorage.length - 1; i >= 0; i--) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(prefix)) window.localStorage.removeItem(key);
      }
    } catch { /* progress reset still works if optional timer storage is unavailable */ }
    saveProgress(emptyProgress);
    setProgress(emptyProgress);
  }, []);

  return { progress, ready, update, submitTask, closeDay, setSrs, saveExam, toggleCanDo, importProgress, reset };
}

/** تسجيل دقائق جلسة قاسها المؤقّت؛ لا تُستمد من تقدير المهمة ولا من إدخال يدوي. */
export function recordStudyMinutes(day: number, minutes: number): number {
  if (!Number.isInteger(day) || day < 1 || !Number.isFinite(minutes) || minutes <= 0) return 0;
  try {
    const p = loadProgress();
    const byDay = p.plan.minutenEffektivTage ?? {};
    saveProgress({
      ...p,
      plan: {
        ...p.plan,
        minutenEffektiv: (p.plan.minutenEffektiv ?? 0) + minutes,
        minutenEffektivTage: { ...byDay, [day]: (byDay[day] ?? 0) + minutes },
        minutenTrennungVersion: 1,
      },
    });
    return minutes;
  } catch {
    return 0;
  }
}

/** Store a learner-reported duration separately; manual entries never count as measured timer time. */
export function bucheMinuten(minuten: number, day?: number): number {
  const z = clampMinuten(minuten);
  if (z <= 0) return 0;
  try {
    const p = loadProgress();
    const minutenManuellTage = Number.isInteger(day) && (day as number) >= 1
      ? { ...(p.plan.minutenManuellTage ?? {}), [day as number]: ((p.plan.minutenManuellTage ?? {})[day as number] ?? 0) + z }
      : p.plan.minutenManuellTage;
    saveProgress({
      ...p,
      plan: {
        ...p.plan,
        minutenManuell: (p.plan.minutenManuell ?? 0) + z,
        minutenManuellTage,
        minutenTrennungVersion: 1,
      },
    });
  } catch {
    return 0;
  }
  return z;
}

/** تسجيلُ تقييمِ الثقةِ فوراً (يعيشُ داخلَ Progress فيُزامَنُ معَ الملفِّ الشخصيّ) */
export function logSicherheitNow(e: import("./types").SicherheitsEintrag) {
  saveProgress(logSicherheit(loadProgress(), e));
}

export function addFehlerNow(e: FehlerEintrag) {
  saveProgress(upsertFehler(loadProgress(), e));
}

/** 🎯 جدولة تحقق استقلال لدرسٍ أُنجِز تدريبُه — مستحق بعد 3 أيام (قرار المنهج).
 *  غبيةٌ عمداً: المتحقق من وجود بنود التحقق هو المنادي (يملك grammarMap) لا المخزن. */
export function planeVerifikation(topicId: string, day: number) {
  const p = loadProgress();
  if (p.verify?.[topicId]) return;
  saveProgress({ ...p, verify: { ...(p.verify ?? {}), [topicId]: { dueDay: day + 3 } } });
}

/** ⌨️ بديل كتابي لمهمة شفوية مستحيلة: إثبات إنجاز لا إثبات نطق (R16) */
export function markiereSchriftlich(taskId: string) {
  const p = loadProgress();
  saveProgress({ ...p, schriftlich: { ...(p.schriftlich ?? {}), [taskId]: true } });
}

/** 🤔 اعتراض على قاعدة كاشفة: 3 اعتراضات تخفّض حدّتها تلقائياً (R33) */
export function disputeRegel(regelId: string) {
  const p = loadProgress();
  const n = (p.disputiert?.[regelId] ?? 0) + 1;
  saveProgress({ ...p, disputiert: { ...(p.disputiert ?? {}), [regelId]: n } });
}

/** تقييم مراجعة خطأ في الدفتر فوراً — ويُسجَّل على شبكة الكفاءات المتأثرة */
export function gradeFehlerNow(key: string, ok: boolean) {
  const p = gradeFehlerIn(loadProgress(), key, ok);
  const art = p.fehler?.[key]?.art ?? "sonst";
  saveProgress(logK(p, FEHLER_ZU_KOMPETENZ[art] ?? "Grammatik", ok));
}

/** تسجيل محاولة كفاءة مباشرة (للمحركات خارج حلقة update) */
export function logKN(h: Kompetenz, ok: boolean) {
  saveProgress(logK(loadProgress(), h, ok));
}
