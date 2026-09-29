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
import { upsertFehler, gradeFehlerIn } from "./fehler";
import { checkAbzeichen } from "./spiel";
import { logK, KIND_KOMPETENZ, FEHLER_ZU_KOMPETENZ } from "./kompetenz";
import { progressKeyActive } from "./profiles";

const KEY = "weg-b2-progress";
export const PROGRESS_EVENT = "weg-progress-changed";

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
    return {
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
    };
    }
    return {
      ...emptyProgress,
      ...p,
      plan: { ...emptyProgress.plan, ...p.plan },
      settings: { ...emptyProgress.settings, ...p.settings },
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(progressKeyActive(), JSON.stringify(p));
    emit();
  } catch {
    /* التخزين ممتلئ أو محظور */
  }
}

export function touchStreak(p: Progress): Progress {
  const today = new Date().toISOString().slice(0, 10);
  const last = p.streak.last;
  if (last === today) return p;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = last === yesterday ? p.streak.count + 1 : 1;
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

  /** تسجيل نتيجة مهمة — النجاح ≥80% */
  const submitTask = useCallback(
    (day: number, taskId: string, score: number, total: number, kind?: TaskKind) => {
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
        };
        return checkAbzeichen(
          logK(
            {
              ...p,
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
            day: day + 1, // يسمح بالوصول إلى 271 = «الحصيلة النهائية»
            days: {
              ...p.plan.days,
              [day]: {
                closed: true,
                score: dayScore,
                total: dayTotal,
                tasksDone,
                tasksTotal,
                at: new Date().toISOString(),
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
    const merged = {
      ...emptyProgress,
      ...p,
      plan: { ...emptyProgress.plan, ...p.plan },
      settings: { ...emptyProgress.settings, ...p.settings },
    };
    saveProgress(merged);
    setProgress(merged);
  }, []);

  const reset = useCallback(() => {
    saveProgress(emptyProgress);
    setProgress(emptyProgress);
  }, []);

  return { progress, ready, update, submitTask, closeDay, setSrs, saveExam, toggleCanDo, importProgress, reset };
}

/** إدراج خطأ في الدفتر فوراً (بلا hook — من أي مكوّن/أي حدث) */
export function addFehlerNow(e: FehlerEintrag) {
  saveProgress(upsertFehler(loadProgress(), e));
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
