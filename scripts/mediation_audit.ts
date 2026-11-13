#!/usr/bin/env tsx
/** PA-013/PA-026 regression gate: executable mediation cycle, reviewed schema, and language direction. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  MEDIATION_CRITERIA,
  mediationFeedback,
  parseMediationBank,
  zaehleMediationWoerter,
} from "../lib/mediation";

const raw = JSON.parse(readFileSync("content/mediation.json", "utf8"));
const tasks = parseMediationBank(raw);
const page = readFileSync("app/mediation/page.tsx", "utf8");
const generator = readFileSync("scripts/gen_orientierung_mediation.mjs", "utf8");
const checks: Array<[string, () => void]> = [];
const check = (name: string, run: () => void) => checks.push([name, run]);

check("all 12 rows satisfy the executable schema", () => {
  assert.equal(tasks.length, 12);
  assert.equal(tasks.length, raw.length);
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
});

check("A2-B1-B2 progression is represented", () => {
  for (const level of ["A2", "B1", "B2"] as const) {
    assert.ok(tasks.filter((task) => task.level === level).length >= 3, `${level} has fewer than 3 tasks`);
  }
});

check("every task has a unique complete input and model", () => {
  assert.equal(new Set(tasks.map((task) => task.inputDe)).size, tasks.length);
  assert.equal(new Set(tasks.map((task) => `${task.sampleAr ?? ""}\n${task.sampleDe}`)).size, tasks.length);
  assert.ok(tasks.every((task) => task.inputDe.length >= 100 && task.sampleDe.length >= 100));
  assert.ok(tasks.every((task) => task.keyPointsAr.length >= 4 && task.scaffoldsDe.length >= 3));
});

check("rubrics are explicit and bounded to four self-review constructs", () => {
  const allowed = new Set(Object.keys(MEDIATION_CRITERIA));
  assert.ok(tasks.every((task) => task.criteria.length === 4 && new Set(task.criteria).size === 4));
  assert.ok(tasks.every((task) => task.criteria.every((criterion) => allowed.has(criterion))));
});

check("German fields contain no Arabic and known malformed prompts are gone", () => {
  const arabic = /[\u0600-\u06ff]/u;
  for (const task of tasks) {
    for (const field of [task.titleDe, task.inputLabelDe, task.inputDe, task.taskDe, task.sampleDe, ...task.scaffoldsDe]) {
      assert.doesNotMatch(field, arabic, `${task.id} mixes Arabic into a German field`);
    }
  }
  const serialized = JSON.stringify(raw);
  for (const stale of ["Erkläre Nachbar Herrn Lehmann", "Behörde schreibt:", "Mietvertrag sagt:", "Du erhältst Einladung zu Fest", "In Gruppenchat schreiben"]) {
    assert.ok(!serialized.includes(stale), `stale malformed wording: ${stale}`);
  }
});

check("models stay near their stated training ranges without becoming scores", () => {
  for (const task of tasks) {
    const words = zaehleMediationWoerter(`${task.sampleAr ?? ""} ${task.sampleDe}`);
    const [min, max] = task.wordGuide;
    assert.ok(words >= Math.floor(min * 0.75) && words <= Math.ceil(max * 1.25), `${task.id}: model ${words}, guide ${min}-${max}`);
  }
});

check("feedback is structural self-review, not automatic language grading", () => {
  const task = tasks[0];
  const unchecked = mediationFeedback(task, "Kurzer Entwurf", []);
  const checked = mediationFeedback(task, task.sampleDe, task.criteria);
  assert.ok(unchecked.some((hint) => hint.includes("راجع")));
  assert.ok(checked.some((hint) => hint.includes("مراجعة ذاتية") && hint.includes("ليست تصحيحاً آلياً")));
});

check("the UI implements input-draft-rubric-feedback-revision-save", () => {
  for (const marker of [
    "mediation-input-de-", "mediation-draft-", "mediation-rubric-", "mediation-feedback-",
    "mediation-revision-", "mediation-save-", "mediationStorageKey", "localStorage.setItem",
  ]) assert.ok(page.includes(marker), `missing UI marker ${marker}`);
  assert.ok(page.includes('lang="de" dir="ltr"'));
  assert.ok(page.includes('lang="ar" dir="rtl"'));
  assert.ok(page.includes("ليست اختبار CEFR أو تصحيحاً آلياً"));
  assert.ok(!page.includes("كل مهمة تُقيّم") && !page.includes("as any"));
});

check("the historical generator cannot restore the placeholder bank", () => {
  assert.ok(generator.includes("mediation.json must contain the maintained 12-task progression"));
  assert.ok(!generator.includes("Liebe Aisha, im Artikel steht... Viele Grüße"));
  assert.ok(!generator.includes("fs.writeFileSync(path.join(ROOT, 'content/mediation.json')"));
});

let passed = 0;
for (const [name, run] of checks) {
  try {
    run();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}
console.log(`\nMediation audit: ${passed}/${checks.length} passed (PA-013/PA-026).`);
