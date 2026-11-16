import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { grader } from "../lib/grader";
import type { Exercise } from "../lib/types";

const translate: Exercise = {
  id: "audit-translation-order",
  type: "translate",
  promptDe: "Übersetze.",
  answer: "Wärst du nur gekommen",
  alternativen: ["Wärest du nur gekommen"],
  keywords: ["wärst", "du", "nur", "gekommen"],
};
assert.equal(grader.grade(translate, "Wärst du nur gekommen!").correct, true);
assert.equal(grader.grade(translate, "Wärest du nur gekommen.").correct, true);
const reordered = grader.grade(translate, "gekommen nur du wärst");
assert.equal(reordered.correct, false);
assert.equal(reordered.points, 0.5);
assert.match(reordered.feedbackAr ?? "", /جزئية|لا صحة كاملة/);
assert.equal(grader.grade(translate, "nur gekommen").points, 0);
assert.match(
  fs.readFileSync(path.join(process.cwd(), "components/exercises.tsx"), "utf8"),
  /Math\.min\(res\.maxPoints, res\.points\)/,
);

const dictation: Exercise = {
  id: "audit-dictation-order",
  type: "dictation",
  promptDe: "Höre und schreibe.",
  answer: "Ich habe das Haus heute gesehen",
};
assert.equal(grader.grade(dictation, "Ich habe das Haus heute gesehen.").correct, true);
assert.equal(grader.grade(dictation, "gesehen heute Haus das habe ich").correct, false);

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const dailyThresholdSources = [
  "components/akademie/Klassenzimmer.tsx",
  "app/einstellungen/page.tsx",
  "lib/plan.ts",
  "lib/fehler.ts",
].map(read).join("\n");
assert.doesNotMatch(dailyThresholdSources, /60% Goethe|≥60% Goethe|60% نجاح رسمي|نجاح رسمي.*Goethe/);
assert.match(dailyThresholdSources, /عتبة الإتقان اليومية الداخلية|إتقان يومي داخلي/);

const graderSource = read("lib/grader.ts");
assert.doesNotMatch(graderSource, /مصحّح معتمد|المعايير الأربعة الرسمية/);
assert.match(graderSource, /مساعد تدريب غير رسمي/);

const srsUi = [
  "app/einstellungen/page.tsx",
  "components/tasks.tsx",
  "components/fehler-ui.tsx",
  "components/lernstrategie.tsx",
].map(read).join("\n");
assert.doesNotMatch(srsUi, /SM-2|1\s*[←→]\s*3\s*[←→]\s*7/);
assert.match(srsUi, /FSRS-6/);

assert.doesNotMatch(read("content/grammar.json"), /اساعدوا صديقكم/);
assert.doesNotMatch(read("components/tasks.tsx"), /بحذف اللامام/);
assert.match(read("components/onboarding-wizard.tsx"), /label: "regelmäßig"/);
assert.doesNotMatch(read("package.json") + read("lib/i18n.ts"), /المدرّس الافتراضي الوحيد/);
assert.doesNotMatch(read("components/WortReviewErweitert.tsx"), /كل حرف مدقق — لا عينات/);

const settingsSource = read("app/einstellungen/page.tsx");
assert.doesNotMatch(settingsSource, /D1_B[12]_DECKEL_MIN|ALTERNATIVE_PFADE|lib\/phasen\.ts|180\s*(?:\/|–|—|إلى)\s*600|(?:180|600)\s*(?:يوماً|يوم|Tage?)/);
assert.match(settingsSource, /مساران واضحان/);
assert.match(settingsSource, /مسار أساسي داخلي يستهدف 45–90 دقيقة/);
assert.match(settingsSource, /التعميق الاختياري/);

console.log("✅ Assessment integrity: ordered grading, mastery/SRS/AI honesty, confirmed copy fixes, and learner-facing methodology without internal decision codes are intact.");
console.log("ℹ️ This gate guards PA-004, PA-005, PA-012, PA-019, PA-024, PA-028, and PA-030; it does not certify exam validity or external accreditation.");
