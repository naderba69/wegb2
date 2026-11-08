import type { DayTask, TaskResult } from "@/lib/types";

/** المحطات البصرية الخمس لليوم الموحّد. */
export type TodayStepId = 1 | 2 | 3 | 4 | 5;
export type TodayStepStatus = "done" | "active" | "locked";
export type LocalTaskScore = { score: number; total: number };

/**
 * تجميع بصري فقط: لا يغيّر ترتيب buildDay ولا محتواه. الديون الإلزامية
 * والتحقق المستقل والاسترجاع تسبق الجديد دائماً، مهما كان نوع المهمة الأصلي.
 */
export function todayStepOf(task: DayTask): TodayStepId {
  if (task.mandatory || task.kind === "wiederholen" || task.verifyFor) return 1;
  if (task.kind === "grammatik") return 2;
  if (["wortschatz", "lesen", "hoeren", "aussprache"].includes(task.kind)) return 3;
  if (["schreiben", "sprechen", "partner", "briefe", "schulsim"].includes(task.kind)) return 4;
  return 5;
}

export function groupTasksByTodayStep(tasks: readonly DayTask[]): Map<TodayStepId, DayTask[]> {
  const grouped = new Map<TodayStepId, DayTask[]>([[1, []], [2, []], [3, []], [4, []], [5, []]]);
  for (const task of tasks) grouped.get(todayStepOf(task))!.push(task);
  return grouped;
}

/**
 * الخطأ محاولة تعلّم لا حائط مسدود: النتيجة المحفوظة — ناجحة أو غير ناجحة —
 * تُعد تسليماً. النقاط المحلية مسودة وليست تسليماً ولا تفتح محطة أخرى.
 * الوسيط الثاني القديم مقبول للتوافق لكنه لا يغيّر الحكم عمداً.
 */
export function todayTaskSubmitted(
  result: TaskResult | undefined,
  _local?: LocalTaskScore,
): boolean {
  return !!result;
}

/**
 * حكم المحطات المركزي الذي تشترك فيه الخريطة والمشغّل وقائمة المهام. المحطة
 * الفارغة تبقى مقفلة ما دامت محطة سابقة مفتوحة، ثم تُعد متجاوزة بعد التسليم.
 */
export function todayStepStatuses(
  tasks: readonly DayTask[],
  wurdeAbgegeben: (task: DayTask) => boolean,
  istRitualGesperrt: (index: number) => boolean,
): Map<TodayStepId, TodayStepStatus> {
  const gruppen = groupTasksByTodayStep(tasks);
  const status = new Map<TodayStepId, TodayStepStatus>();
  let offeneStationDavor = false;

  for (let station = 1 as TodayStepId; station <= 5; station = (station + 1) as TodayStepId) {
    const aufgaben = gruppen.get(station) ?? [];
    if (aufgaben.length === 0) {
      status.set(station, offeneStationDavor ? "locked" : "done");
      continue;
    }
    if (aufgaben.every(wurdeAbgegeben)) {
      status.set(station, "done");
      continue;
    }

    const offeneAufgaben = aufgaben.filter((task) => !wurdeAbgegeben(task));
    const ritualGesperrt = offeneAufgaben.length > 0 && offeneAufgaben.every((task) => {
      const index = tasks.indexOf(task);
      return index >= 0 && istRitualGesperrt(index);
    });
    if (offeneStationDavor || ritualGesperrt) {
      status.set(station, "locked");
      offeneStationDavor = true;
      continue;
    }

    status.set(station, "active");
    offeneStationDavor = true;
  }

  return status;
}
