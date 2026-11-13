#!/usr/bin/env tsx
/** PA-009–PA-011: regression gate for one workload source and non-inferential time claims. */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { planArbeitslast, planMinBis, planTagesMinuten } from "../lib/plan";
import { DEFAULT_SESSION_GOAL_MINUTES } from "../lib/session-clock";
import { vergleicheZeitlast } from "../lib/cefr";

const tests: Array<{ name: string; run: () => void }> = [];
const test = (name: string, run: () => void) => tests.push({ name, run });
const source = (path: string) => readFileSync(path, "utf8");

const runtimePaths = [
  "app/page.tsx",
  "app/einstellungen/page.tsx",
  "components/onboarding-wizard.tsx",
  "components/stundenvertrag.tsx",
  "lib/cefr.ts",
  "lib/phasen.ts",
];
const runtime = runtimePaths.map((path) => `${path}\n${source(path)}`).join("\n");

test("single computed workload baseline", () => {
  const workload = planArbeitslast();
  assert.equal(workload.minuten, planMinBis(workload.tage));
  assert.equal(workload.minuten, 71_595);
  assert.equal(workload.stunden, 1_193.25);
  assert.equal(Number(workload.durchschnittMinutenProTag.toFixed(1)), 189.4);
  assert.equal(workload.phasen.B2.minuten, 26_645);
  assert.equal(Number(workload.phasen.B2.durchschnittMinutenProTag.toFixed(1)), 261.2);
  assert.equal(workload.sitzungszielMinuten, DEFAULT_SESSION_GOAL_MINUTES);
});

test("session goal, full-day estimate, and measured time stay distinct", () => {
  const workload = planArbeitslast();
  assert.notEqual(workload.sitzungszielMinuten, workload.durchschnittMinutenProTag);
  assert.equal(planTagesMinuten(378), planMinBis(378) - planMinBis(377));
  const ui = source("components/stundenvertrag.tsx");
  for (const testId of ["sitzungsziel-minuten", "tageslast-minuten", "heute-gemessen-minuten"]) {
    assert.match(ui, new RegExp(`data-testid=["']${testId}["']`));
  }
});

test("time comparison cannot return an inferred CEFR level", () => {
  const rows = vergleicheZeitlast((day) => planMinBis(day) / 60);
  assert.deepEqual(rows.map((row) => row.level), ["A1", "A2", "B1", "B2"]);
  assert.ok(rows.every((row) => ["unterhalb", "innerhalb", "oberhalb"].includes(row.position)));
  assert.ok(rows.every((row) => !("niveau" in row) && !("examReadiness" in row) && !("urteil" in row)));
  const cefr = source("lib/cefr.ts");
  assert.doesNotMatch(cefr, /erreichbaresNiveau|function\s+urteileStunden/);
  assert.match(cefr, /لا تستنتج هذه[\s\S]*أداءً مقاساً في مهارات/);
});

test("runtime copy contains no stale workload or outcome promise", () => {
  const forbidden = [
    /152د/, /152 دقيقة/, /643\.8/, /≈900/, /249\.3/, /74د/, /ALTERNATIVE_PFADE/,
    /In 378 Tagen erreichst du B2/, /unverlierbar deterministisch/,
    /بهذا الحمل[^\n]{0,80}تبلغ/, /الحكمُ الصريح/,
  ];
  for (const pattern of forbidden) assert.doesNotMatch(runtime, pattern);
  assert.match(source("components/onboarding-wizard.tsx"), /تدعم التقدّم نحو B2 ولا تضمن بلوغه/);
  assert.match(source("components/stundenvertrag.tsx"), /الساعات تصف حملاً زمنياً ولا تقيس الكفاءة/);
});

test("mislabeled recording is removed and voice type is disclosed", () => {
  assert.equal(existsSync("public/willkommen-60s.mp3"), false);
  const onboarding = source("components/onboarding-wizard.tsx");
  assert.doesNotMatch(onboarding, /willkommen-60s|60 ثانية|تسجيل بشري قادم/);
  assert.match(onboarding, /الصوت مولّد آلياً عند الطلب عبر TTS في متصفحك؛ ليس تسجيلاً بشرياً/);
});

test("all visible workload copy consumes the computed source", () => {
  assert.match(source("components/onboarding-wizard.tsx"), /planArbeitslast/);
  assert.match(source("components/stundenvertrag.tsx"), /planArbeitslast/);
  assert.match(source("app/einstellungen/page.tsx"), /planArbeitslast/);
  const today = source("app/page.tsx");
  assert.match(today, /plan\.zielMin/);
  assert.match(today, /totalMinutes/);
});

let passed = 0;
for (const { name, run } of tests) {
  try {
    run();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}
console.log(`\nTime-model audit: ${passed}/${tests.length} passed (PA-009–PA-011).`);
