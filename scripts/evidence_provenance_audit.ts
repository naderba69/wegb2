import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { emptyProgress, type Kompetenz, type Progress } from "../lib/types";
import {
  evidenzUebersicht,
  evidenceTypeOf,
  kompetenzWerte,
  KOMPETENZEN,
  logK,
  logMeasuredK,
  MIN_MEASURED_PER_SKILL,
} from "../lib/kompetenz";

const fresh = (): Progress => structuredClone(emptyProgress);

// PA-001: الفراغ وبيانات النشاط لا يتحولان إلى نقاط أداء أو حكم جاهزية.
const emptyValues = kompetenzWerte(fresh());
for (const hand of KOMPETENZEN) {
  assert.equal(emptyValues[hand].wert, null);
  assert.equal(emptyValues[hand].status, "unknown");
}
assert.deepEqual(evidenzUebersicht(fresh()).examReadiness, "not_assessed");
assert.equal(evidenzUebersicht(fresh()).completeTrainingPerformance, null);

let activity = fresh();
for (let i = 0; i < 120; i++) activity = logK(activity, KOMPETENZEN[i % KOMPETENZEN.length], true);
for (const hand of KOMPETENZEN) {
  assert.equal(kompetenzWerte(activity)[hand].wert, null);
  assert.equal(kompetenzWerte(activity)[hand].measured, 0);
}
const activityRich: Progress = {
  ...activity,
  xp: 999_999,
  canDo: { "self-report": true },
  plan: { ...activity.plan, day: 350 },
};
assert.equal(evidenzUebersicht(activityRich).completeTrainingPerformance, null);
assert.equal(evidenzUebersicht(activityRich).examReadiness, "not_assessed");

// البيانات القديمة بلا provenance محافظة: activity، لا measured.
assert.equal(evidenceTypeOf({ h: "Lesen", ok: true }), "activity");

// PA-002/003: التقييم الذاتي في الكتابة/التحدث محفوظ، لكنه لا يدخل الأداء.
for (const hand of ["Schreiben", "Sprechen"] as Kompetenz[]) {
  let selfRated = fresh();
  for (let i = 0; i < 20; i++) selfRated = logK(selfRated, hand, true, { evidenceType: "self_report", method: "learner_checklist" });
  const value = kompetenzWerte(selfRated)[hand];
  assert.equal(value.wert, null);
  assert.equal(value.selfReported, 20);
  assert.equal(value.measured, 0);
}

// لا يظهر أداء تدريبي حتى الحد الأدنى، والدليل المساعد لا يؤهل العينة.
let measured = fresh();
for (let i = 0; i < MIN_MEASURED_PER_SKILL - 1; i++) measured = logK(measured, "Lesen", true, { evidenceType: "measured" });
assert.equal(kompetenzWerte(measured).Lesen.wert, null);
measured = logMeasuredK(measured, "Lesen", true);
assert.equal(kompetenzWerte(measured).Lesen.wert, 100);
assert.equal(measured.kompetenzLog?.at(-1)?.method, "local_auto_grader");
let assisted = fresh();
for (let i = 0; i < MIN_MEASURED_PER_SKILL * 2; i++) assisted = logK(assisted, "Sprechen", true, { evidenceType: "measured", assisted: true });
assert.equal(kompetenzWerte(assisted).Sprechen.wert, null);

// حتى اكتمال ست عينات داخلية لا يصبح «جاهزية امتحان».
let complete = fresh();
for (const hand of KOMPETENZEN) {
  for (let i = 0; i < MIN_MEASURED_PER_SKILL; i++) complete = logK(complete, hand, true, { evidenceType: "measured" });
}
assert.equal(evidenzUebersicht(complete).completeTrainingPerformance, 100);
assert.equal(evidenzUebersicht(complete).examReadiness, "not_assessed");

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const competenceSource = read("lib/kompetenz.ts");
assert.doesNotMatch(competenceSource, /export function (?:b2Score|pruefungsBereitschaft|bereitBand|band)\b/);
assert.match(competenceSource, /meta\.evidenceType \?\? "activity"/);
assert.match(competenceSource, /entry\.evidenceType \?\? "activity"/);

const storeSource = read("lib/store.ts");
assert.doesNotMatch(storeSource, /KIND_KOMPETENZ/);
assert.match(storeSource, /for \(const descriptor of result\.evidence \?\? \[\]\)/);
assert.match(storeSource, /evidenceType: descriptor\.evidenceType/);
assert.match(storeSource, /responseMode: descriptor\.responseMode/);
const taskEvidenceSource = read("lib/task-evidence.ts");
assert.match(taskEvidenceSource, /pureProductive \? "self_report" : "activity"/);
assert.match(taskEvidenceSource, /method: "plan_submission"/);
const lessonSource = read("components/lektion.tsx");
assert.match(lessonSource, /logMeasuredK\(q0, kat/);
assert.match(lessonSource, /evidenceType: "self_report"/);
assert.match(lessonSource, /لا يدخل أداء الكتابة المقاس/);
for (const objectiveSurface of [
  "components/arena.tsx",
  "components/diktat.tsx",
  "components/hoeren.tsx",
  "components/leseleiter.tsx",
  "components/selbsttest.tsx",
  "components/pruefung.tsx",
  "components/blitz.tsx",
]) {
  assert.match(read(objectiveSurface), /logMeasuredK\(/);
}

const publicSurfaces = [
  "components/katalog.tsx",
  "components/berichte.tsx",
  "components/elternpaket.tsx",
  "lib/aktivitaeten.ts",
].map(read).join("\n");
assert.doesNotMatch(publicSurfaces, /B2-Score|B2 sicher|Ready for the exam|Prüfungsbereitschaft \(40\/25\/20\/15/);
assert.match(publicSurfaces, /جاهزية الامتحان[^\n]{0,80}(?:غير مقاسة|لا يحسب)/);
assert.match(read("components/berichte.tsx"), /exam_readiness,not_assessed/);
assert.doesNotMatch(read("components/berichte.tsx"), /Amtliches Notblatt|WB2-\\d|الورقة الرسمية A4/);

console.log("✅ Evidence provenance: activity/self-report/measured are separated; unknown stays scoreless; exam readiness remains not assessed.");
console.log("ℹ️ This gate guards PA-001, PA-002, and PA-003. It does not validate CEFR level, exam readiness, or external accreditation.");
