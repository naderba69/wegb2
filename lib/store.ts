"use client";
import { lokalesDatum, lokalesDatumPlus } from "./datum";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { recordTodayUxClosed, recordTodayUxSubmission } from "./metriken";
import type { TodayStepId } from "./today-steps";
import { idbGet, idbSet } from "./idb";

export const PROGRESS_EVENT = "weg-progress-changed";
export const PROGRESS_SAVE_ERROR_EVENT = "weg-progress-save-error";

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

/** Reduce storage pressure while retaining complete detail for the latest 45 study days. */
function pruneForQuota(p: Progress): Progress {
  if (JSON.stringify(p).length < 4_200_000) return p;
  const days = p.plan.days ?? {};
  const keys = Object.keys(days).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (keys.length <= 45) return p;
  const keep = new Set(keys.slice(-45));
  const pruned = Object.fromEntries(Object.entries(days).map(([key, day]) => {
    if (keep.has(Number(key))) return [key, day];
    return [key, {
      score: day.score,
      total: day.total,
      closed: day.closed,
      tasksDone: day.tasksDone,
      tasksTotal: day.tasksTotal,
      at: day.at,
    }];
  })) as typeof days;
  return { ...p, plan: { ...p.plan, days: pruned } };
}

function signalSaveError() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PROGRESS_SAVE_ERROR_EVENT));
}

export function saveProgress(p: Progress): boolean {
  if (typeof window === "undefined") return false;
  const key = progressKeyActive();
  try {
    const migrated = migrateCurriculumSchedule(separateLegacyManualMinutes(pruneForQuota(p)));
    const raw = JSON.stringify(migrated);
    try {
      window.localStorage.setItem(key, raw);
      void idbSet(key, raw); // best-effort mirror; localStorage remains the synchronous source of truth
      emit();
      return true;
    } catch (error) {
      const quota = error instanceof DOMException && (error.name === "QuotaExceededError" || error.code === 22);
      if (!quota) throw error;
      const compact = {
        ...migrated,
        kompetenzLog: [],
        sicherheit: [],
      } as Progress;
      const compactRaw = JSON.stringify(pruneForQuota(compact));
      try {
        window.localStorage.setItem(key, compactRaw);
        void idbSet(key, compactRaw);
        emit();
        return true;
      } catch {
        // Keep the UI honest until IndexedDB confirms persistence, then reload through PROGRESS_EVENT.
        void idbSet(key, raw).then((saved) => {
          if (!saved) return;
          try { window.localStorage.removeItem(key); } catch { /* IndexedDB still contains the data. */ }
          emit();
        });
      }
    }
  } catch {
    // handled below
  }
  signalSaveError();
  return false;
}

/** Asynchronous fallback used only when no synchronous localStorage record is available. */
export async function loadProgressAsync(): Promise<Progress> {
  const sync = loadProgress();
  if (sync !== emptyProgress) return sync;
  try {
    const raw = await idbGet(progressKeyActive());
    if (!raw) return emptyProgress;
    const p = JSON.parse(raw) as Progress;
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

export const MAX_STREAK = 7; // K-StreakCap: لا سلاسل عدوانية — السقف 7 مع حماية «يوم سيّئ»

export function touchStreak(p: Progress): Progress {
  const today = lokalesDatum();
  const last = p.streak.last;
  if (last === today) return p;
  const yesterday = lokalesDatumPlus(-1);
  // يوم سيّئ أو غياب معلَن: تُجمَّد السلسلة عند قيمتها الحالية (≤7) بلا كسر
  if (p.badDay === today || p.badDay === yesterday) {
    return { ...p, streak: { last: today, count: Math.min(p.streak.count, MAX_STREAK) } };
  }
  const count = last === yesterday ? Math.min(p.streak.count + 1, MAX_STREAK) : 1;
  return { ...p, streak: { last: today, count } };
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const progressRef = useRef<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      const sync = loadProgress();
      if (sync !== emptyProgress) {
        progressRef.current = sync;
        setProgress(sync);
        setReady(true);
        return;
      }
      void loadProgressAsync().then((loaded) => {
        if (!cancelled) {
          progressRef.current = loaded;
          setProgress(loaded);
          setReady(true);
        }
      });
    };
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(PROGRESS_EVENT, refresh);
    };
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    // Persist outside React's state-updater callback. saveProgress emits a synchronous
    // cross-hook event; emitting it from inside setProgress(prev => …) makes another
    // useProgress subscriber update while this component is still rendering.
    const next = touchStreak(fn(progressRef.current));
    if (!saveProgress(next)) return;
    progressRef.current = next;
    setProgress(next);
  }, []);

  /** تسجيل نتيجة مهمة — النجاح ≥80% (ومهمةُ التحقق تُغلِق سجلَّ درسِها استقلالاً أو حاجةً) */
  const submitTask = useCallback(
    (
      day: number,
      taskId: string,
      score: number,
      total: number,
      kind?: TaskKind,
      geplantMin?: number,
      verifyFor?: string,
      minutenEffektiv?: number,
      ux?: { activeMs: number; step: TodayStepId; hasStep5: boolean },
    ) => {
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
              todayUx: ux
                ? recordTodayUxSubmission(p.todayUx, day, ux.activeMs, ux.step, passed, ux.hasStep5)
                : p.todayUx,
              xp: (p.xp ?? 0) + (result.passed ? 15 : 5),
              plan: { ...p.plan, tasks: { ...p.plan.tasks, [taskId]: result } },
            },
            KIND_KOMPETENZ[kind ?? prev?.kind ?? "check"] ?? "Grammatik",
            result.passed,
            {
              // مهام الإنتاج تُصحَّح ذاتياً في مسار اليوم؛ غيرها يبقى حدث نشاط
              // ما لم يسجّل محرك تقويم صريح دليلاً measured عند مصدره.
              evidenceType: (["schreiben", "sprechen", "aussprache", "schulsim", "briefe", "partner"] as TaskKind[])
                .includes(kind ?? prev?.kind ?? "check") ? "self_report" : "activity",
              method: "plan_submission",
              sourceId: taskId,
            },
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
      debts: DebtItem[],
      activeSessionMs?: number,
    ) => {
      update((p) =>
        checkAbzeichen({
          ...p,
          todayUx: Number.isFinite(activeSessionMs)
            ? recordTodayUxClosed(p.todayUx, day, activeSessionMs as number)
            : p.todayUx,
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
    if (!saveProgress(merged)) throw new Error("progress-storage-failed");
    progressRef.current = merged;
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
    if (!saveProgress(emptyProgress)) return;
    progressRef.current = emptyProgress;
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
    const gespeichert = saveProgress({
      ...p,
      plan: {
        ...p.plan,
        minutenEffektiv: (p.plan.minutenEffektiv ?? 0) + minutes,
        minutenEffektivTage: { ...byDay, [day]: (byDay[day] ?? 0) + minutes },
        minutenTrennungVersion: 1,
      },
    });
    return gespeichert ? minutes : 0;
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
    if (!saveProgress({
      ...p,
      plan: {
        ...p.plan,
        minutenManuell: (p.plan.minutenManuell ?? 0) + z,
        minutenManuellTage,
        minutenTrennungVersion: 1,
      },
    })) return 0;
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

/** تقييم ذاتي لمراجعة خطأ: يحرك SRS ويُحفظ self_report، لا أداءً مقاساً. */
export function gradeFehlerNow(key: string, ok: boolean) {
  const p = gradeFehlerIn(loadProgress(), key, ok);
  const art = p.fehler?.[key]?.art ?? "sonst";
  saveProgress(logK(p, FEHLER_ZU_KOMPETENZ[art] ?? "Grammatik", ok, {
    evidenceType: "self_report",
    method: "error_retrieval_self_report",
    sourceId: key,
  }));
}

/** تسجيل محاولة كفاءة مباشرة (للمحركات خارج حلقة update) */
export function logKN(h: Kompetenz, ok: boolean) {
  saveProgress(logK(loadProgress(), h, ok));
}
