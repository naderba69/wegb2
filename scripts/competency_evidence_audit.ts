import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { evidenceWeightOf, kompetenzWerte, logK, MIN_MEASURED_PER_SKILL } from "../lib/kompetenz";
import { buildDay } from "../lib/plan";
import { emptyProgress, TOTAL_DAYS, type DayTask, type Progress } from "../lib/types";

const fresh = (): Progress => structuredClone(emptyProgress);
const tasks: DayTask[] = [];
for (let day = 1; day <= TOTAL_DAYS; day++) tasks.push(...buildDay(day, fresh()).tasks);
assert.equal(tasks.length, 2500);

let assertions = 0;
const check = (condition: unknown, message: string) => {
  assert.ok(condition, message);
  assertions++;
  console.log(`✓ ${message}`);
};

check(tasks.every((task) => (task.evidence?.length ?? 0) > 0), "all 2,500 generated tasks carry explicit construct evidence");

for (const task of tasks) {
  const evidence = task.evidence ?? [];
  const weight = evidence.reduce((sum, item) => sum + item.weight, 0);
  assert.ok(Math.abs(weight - 1) < 1e-9, `${task.id}: construct weights must sum to 1`);
  assert.equal(new Set(evidence.map((item) => item.construct)).size, evidence.length, `${task.id}: duplicate construct`);
  assert.equal(new Set(evidence.map((item) => item.sourceId)).size, evidence.length, `${task.id}: duplicate source id`);
  for (const item of evidence) {
    assert.ok(item.level && item.level !== "unknown", `${task.id}: level missing`);
    assert.ok(item.weight > 0 && item.weight <= 1, `${task.id}: invalid weight`);
    assert.ok(["activity", "self_report"].includes(item.evidenceType), `${task.id}: plan completion must not fake measured evidence`);
    assert.equal(item.method, "plan_submission");
    assert.equal(typeof item.assisted, "boolean");
    assert.ok(item.responseMode);
  }
}
console.log("✓ every descriptor has level, normalized weight, evidence type, assistance, response mode, method, and source");
assertions++;

const constructs = (task: DayTask) => new Set(task.evidence?.map((item) => item.construct));
const checks = tasks.filter((task) => task.kind === "check");
check(checks.some((task) => constructs(task).has("Wortschatz") && !constructs(task).has("Grammatik")), "check tasks are not all routed to grammar");
check(tasks.filter((task) => task.kind === "wiederholen").some((task) => (task.evidence?.length ?? 0) > 1), "review tasks can preserve multiple constructs instead of vocabulary-only routing");
check(tasks.filter((task) => task.kind === "partner").every((task) => constructs(task).has("Sprechen")), "partner tasks explicitly route to spoken production");
check(tasks.filter((task) => task.kind === "schulsim").every((task) => constructs(task).has("Schreiben")), "school simulator shells explicitly route to written production");

const dailyChecks = tasks.filter((task) => task.titleDe === "Tagescheck" && task.quiz?.length);
check(dailyChecks.every((task) => task.quiz?.every((item) => item.evidenceConstruct && item.evidenceLevel)), "generated daily-check items retain source construct and level");
const daily = dailyChecks.find((task) => task.evidence?.some((item) => item.level === "mixed"));
assert.ok(daily);
check(constructs(daily).has("Grammatik") && constructs(daily).has("Wortschatz"), "cross-level daily checks disclose mixed form/lexis evidence instead of a grammar-only label");
const pretest = tasks.find((task) => task.titleDe.startsWith("Vortest:"));
assert.ok(pretest);
check(pretest.evidence?.length === 1 && constructs(pretest).has("Grammatik"), "grammar pretests remain narrowly classified");
const finalExam = tasks.find((task) => task.exam && task.textId && task.dialogueId && task.writeId);
assert.ok(finalExam);
check(["Lesen", "Hoeren", "Schreiben", "Grammatik", "Wortschatz"].every((construct) => constructs(finalExam).has(construct as never)), "integrated final exam preserves all attached constructs");
check(tasks.every((task) => task.evidence?.every((item) => item.evidenceType !== "measured")), "plan submission metadata never upgrades completion to measured performance");

let light = fresh();
for (let i = 0; i < MIN_MEASURED_PER_SKILL * 2 - 1; i++) {
  light = logK(light, "Lesen", true, { evidenceType: "measured", weight: 0.5 });
}
assert.equal(kompetenzWerte(light).Lesen.measuredWeight, 7.5);
check(kompetenzWerte(light).Lesen.wert === null, "weighted evidence below the effective sample threshold stays insufficient");
light = logK(light, "Lesen", false, { evidenceType: "measured", weight: 0.5 });
check(kompetenzWerte(light).Lesen.measuredWeight === 8 && kompetenzWerte(light).Lesen.wert !== null, "effective measured weight—not raw event count—opens the internal performance sample");
check(evidenceWeightOf({ h: "Lesen", ok: true }) === 1, "legacy records retain neutral weight without retrospective invention");
let routed = fresh();
for (const descriptor of daily.evidence ?? []) {
  routed = logK(routed, descriptor.construct, true, descriptor);
}
const routedUnits = Object.values(kompetenzWerte(routed)).reduce((sum, value) => sum + value.versuche, 0);
check(Math.abs(routedUnits - 1) < 1e-9, "mixed-task weights prevent one completion from inflating total profile activity");

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const competenceSource = read("lib/kompetenz.ts");
const storeSource = read("lib/store.ts");
check(!competenceSource.includes("KIND_KOMPETENZ") && !storeSource.includes("KIND_KOMPETENZ"), "coarse TaskKind-to-skill map is removed from runtime routing");
check(storeSource.includes("for (const descriptor of result.evidence ?? [])"), "submission persists each explicit construct descriptor into the competency log");
check(read("lib/types.ts").includes("evidence?: TaskEvidenceDescriptor[]"), "task results preserve an immutable evidence snapshot");

console.log(`\nCompetency evidence audit: ${assertions}/${assertions} passed (PA-016; no CEFR/exam-validity claim).`);
