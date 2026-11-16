import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildDay, planArbeitslast } from "../lib/plan";
import { emptyProgress, TOTAL_DAYS, type DayTask } from "../lib/types";
import { PROSODIE_EINHEITEN, getProsodieEinheit } from "../lib/prosodie";

let passed = 0;
const check = (condition: unknown, label: string) => {
  assert.ok(condition, label);
  passed++;
  console.log(`✓ ${label}`);
};

const levels = ["B1", "B2"] as const;
const focuses = ["satzakzent", "rhythmus", "reduktion", "verbindung", "intonation", "arabisch-transfer"];

check(PROSODIE_EINHEITEN.length === 12 && new Set(PROSODIE_EINHEITEN.map((unit) => unit.id)).size === 12,
  "twelve unique B1/B2 prosody units are registered");

check(levels.every((level) => {
  const units = PROSODIE_EINHEITEN.filter((unit) => unit.level === level);
  return units.length === 6 && focuses.every((focus) => units.some((unit) => unit.fokus === focus));
}), "each level covers stress, rhythm, reduction, linking, intonation, and Arabic-transfer focus");

check(PROSODIE_EINHEITEN.every((unit) =>
  unit.satzDe.length > 30 && unit.satzAr.length > 20 && unit.markierungDe.length > 30
  && unit.zielAr.length > 30 && unit.coachingAr.length === 3
  && !/[\u0600-\u06ff]/u.test(`${unit.id}${unit.titelDe}${unit.satzDe}${unit.markierungDe}`)),
"every unit has complete bilingual material and German fields contain no Arabic script");

const scheduled: Array<{ day: number; task: DayTask }> = [];
let totalTasks = 0;
for (let day = 1; day <= TOTAL_DAYS; day++) {
  const plan = buildDay(day, emptyProgress);
  totalTasks += plan.tasks.length;
  for (const task of plan.tasks) if (task.pronunciationId) scheduled.push({ day, task });
}

check(totalTasks === 2_500, "the pronunciation path reuses existing plan slots and preserves all 2,500 tasks");
check(scheduled.length === 14
  && scheduled.filter(({ day }) => day >= 179 && day <= 276).length === 7
  && scheduled.filter(({ day }) => day >= 277 && day <= 374).length === 7,
"seven explicit comparison tasks are scheduled in each of B1 and B2");

check(scheduled.every(({ day, task }) => day > 167 && task.kind === "aussprache"
  && !!getProsodieEinheit(task.pronunciationId) && task.sentenceIds?.length === 4),
"every advanced task is explicit pronunciation work after day 167 and retains four transfer sentences");

check(scheduled.every(({ task }) => task.evidence?.length === 1
  && task.evidence[0].construct === "Sprechen"
  && task.evidence[0].evidenceType === "self_report"
  && task.evidence[0].assisted === true
  && task.evidence[0].responseMode === "spoken_response"
  && task.evidence[0].method === "plan_submission"),
"before/after completion remains assisted spoken self-report and never becomes measured competence evidence");

const days = scheduled.map(({ day }) => day);
check(days[0] <= 188 && days.at(-1)! >= 370
  && days.slice(1).every((day, index) => day - days[index] === 14),
"the B1/B2 path starts early, continues to the final regular B2 week, and has no gap over 14 days");

const workload = planArbeitslast();
check(workload.minuten === 71_595 && workload.kernMinuten === 24_495 && workload.vertiefungMinuten === 47_100,
  "PA-015 reuses time slots and leaves the guarded full/core/deepening workload unchanged");

const taskUi = readFileSync("components/tasks.tsx", "utf8");
const trainerUi = readFileSync("components/aussprachetrainer.tsx", "utf8");
check(taskUi.includes('data-testid="prosodie-before"')
  && taskUi.includes('data-testid="prosodie-after"')
  && taskUi.includes('data-testid="prosodie-comparison"')
  && taskUi.includes("فرق تقدير الإيقاع الداخلي")
  && taskUi.includes("لم ألاحظ فرقاً واضحاً بعد"),
"the task UI implements an explicit before-coaching-after-comparison cycle rather than a completion checkbox");

check(trainerUi.includes("الإيقاع والوقفات والمقاطع فقط")
  && trainerUi.includes("مؤشر الإيقاع المحلي")
  && taskUi.includes('data-testid="prosodie-local-metrics"')
  && taskUi.includes("الأرقام وصف للطاقة والصمت")
  && taskUi.includes("لا يقيس الفونيمات أو اللكنة")
  && taskUi.includes("لا يثبت مستوى CEFR")
  && taskUi.includes("لا قياس تحسن نطقي عام"),
"measurement copy limits local audio analysis to session rhythm and forbids phoneme, accent, CEFR, or general-improvement claims");

console.log(`\nPronunciation-path audit: ${passed}/${passed} passed (PA-015; internal rhythm comparison, no external pronunciation validity claim).`);
