// ➕ R307: «زائدُ الدرس» — تمارينُ موضوعِ القواعدِ التي تجاوزت حدَّ المعالجِ (3) فتُرحَّلُ
// محليًا (weg-park-<topicId>). كانت مُستخرَجةً محليًا فقط داخل app/ueben/page.tsx (موجةٌ
// واحدة خلف قفل «المساء»)؛ استُخرجت هنا كدالةٍ مشتركةٍ لإعادةِ استخدامها أيضًا في صفحة
// «اليوم» (دمجٌ في التدفّق اليومي نفسه، لا انتظار المساء) دون تكرار المنطق أو تفرّعه.
import type { Exercise } from "./types";
import { grammarMap } from "./content";

export type DayPlanLike = { tasks: { kind: string; topicId?: string }[] };

/** موضوعُ قواعدِ اليوم (إن وُجد) — نفسُ المصدر الذي يُولِّدُ «weg-park-<topicId>». */
export function heutigesGrammatikThema(plan: DayPlanLike): string | null {
  const gramTask = plan.tasks.find((t) => t.kind === "grammatik" && t.topicId);
  return gramTask?.topicId ?? null;
}

/** التمارينُ المُرحَّلةُ فعليًا من موضوع اليوم — بلا طرفٍ آخر يقرأ localStorage مباشرةً. */
export function parkedExercisesFor(topicId: string | null): Exercise[] {
  if (!topicId) return [];
  let ids: string[] = [];
  try {
    const raw = localStorage.getItem(`weg-park-${topicId}`);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    ids = Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    ids = [];
  }
  if (ids.length === 0) return [];
  const t = grammarMap[topicId];
  if (!t) return [];
  return t.exercises.filter((e) => ids.includes(e.id));
}
