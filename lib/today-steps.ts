import type { DayTask, TaskResult } from "@/lib/types";

/** المحطات البصرية الخمس لليوم الموحّد. */
export type TodayStepId = 1 | 2 | 3 | 4 | 5;
export type LocalTaskScore = { score: number; total: number };

/**
 * تجميع بصري فقط: لا يغيّر ترتيب buildDay ولا محتواه.
 * تحقق الاستقلال والاسترجاع يسبقان الجديد دائماً.
 */
export function todayStepOf(task: DayTask): TodayStepId {
  if (task.kind === "wiederholen" || task.verifyFor) return 1;
  if (task.kind === "grammatik") return 2;
  if (["wortschatz", "lesen", "hoeren", "aussprache"].includes(task.kind)) return 3;
  if (["schreiben", "sprechen", "partner", "briefe", "schulsim"].includes(task.kind)) return 4;
  return 5;
}

export function groupTasksByTodayStep(tasks: DayTask[]): Map<TodayStepId, DayTask[]> {
  const grouped = new Map<TodayStepId, DayTask[]>([[1, []], [2, []], [3, []], [4, []], [5, []]]);
  for (const task of tasks) grouped.get(todayStepOf(task))!.push(task);
  return grouped;
}

/**
 * الخطأ محاولة تعلّم لا حائط مسدود: تسليم النتيجة — ناجحة أو غير ناجحة —
 * يفتح المحطة التالية. النقاط المحلية تعني أن النشاط اكتمل في الواجهة لكنه
 * لم يُثبّت بعد في Progress؛ وهي نفس دلالة allSubmitted في صفحة اليوم.
 */
export function todayTaskSubmitted(
  result: TaskResult | undefined,
  local: LocalTaskScore,
): boolean {
  return !!result || local.total > 0;
}
