import assert from "node:assert/strict";
import fs from "node:fs";
import { buildDay } from "../lib/plan";
import {
  registriereSkillDosis,
  SKILL_VERIFY_MIN_WEIGHT,
  skillFoerderplan,
  skillVerifikationen,
} from "../lib/skillplan";
import { emptyProgress } from "../lib/types";
import type { Kompetenz, KompetenzEvidenceType, Progress } from "../lib/types";

let passed = 0;
const check = (condition: unknown, message: string) => {
  assert.ok(condition, message);
  passed++;
  console.log(`✓ ${message}`);
};

const now = new Date("2026-10-28T10:00:00Z");
const entries = (
  hand: Kompetenz,
  total: number,
  correct: number,
  options: { evidenceType?: KompetenzEvidenceType; assisted?: boolean; d?: string; weight?: number } = {},
) => Array.from({ length: total }, (_, index) => ({
  h: hand,
  ok: index < correct,
  d: options.d ?? "2026-10-20",
  evidenceType: options.evidenceType ?? "measured" as const,
  assisted: options.assisted ?? false,
  weight: options.weight,
  sourceId: `${hand}-${index}`,
}));
const withLog = (log: Progress["kompetenzLog"]): Progress => ({
  ...emptyProgress,
  plan: { ...emptyProgress.plan, tasks: {}, days: {}, debt: [] },
  settings: { ...emptyProgress.settings },
  kompetenzLog: log,
});

const nonMeasured = withLog([
  ...entries("Hoeren", 30, 0, { evidenceType: "activity" }),
  ...entries("Grammatik", 30, 0, { evidenceType: "self_report" }),
]);
check(skillFoerderplan(nonMeasured, now).dosen.length === 0, "activity and self-report never create a remedial dose");

const assisted = withLog(entries("Hoeren", 20, 0, { assisted: true }));
check(skillFoerderplan(assisted, now).dosen.length === 0, "assisted measured work is excluded from personalization");

const insufficient = withLog(entries("Hoeren", 7, 0));
check(skillFoerderplan(insufficient, now).dosen.length === 0, "missing or sub-threshold measured evidence stays unknown rather than becoming weakness");

const profile = withLog([
  ...entries("Lesen", 10, 9),
  ...entries("Hoeren", 10, 4),
  ...entries("Grammatik", 10, 6),
  ...entries("Wortschatz", 10, 7),
  ...entries("Sprechen", 30, 0, { evidenceType: "self_report" }),
]);
const plan = skillFoerderplan(profile, now);
check(plan.dosen.map((dose) => dose.hand).join(",") === "Hoeren,Grammatik", "at most the two weakest eligible skills receive doses");
check(plan.dosen[0]?.minuten === 20 && plan.dosen[1]?.minuten === 15, "dose minutes rise conservatively with measured weakness");
check(!plan.dosen.some((dose) => dose.hand === "Sprechen") && plan.auswertbareSkills === 4, "self-reported productive skill remains outside the measured profile");

const beforeTasks = buildDay(200, profile).tasks.map((task) => task.id);
const scheduled = registriereSkillDosis(profile, "Hoeren", now);
const afterTasks = buildDay(200, scheduled).tasks.map((task) => task.id);
const cycle = scheduled.skillRemediation?.Hoeren;
check(cycle?.completedDate === "2026-10-28" && cycle.verifyDueDate === "2026-10-31" && cycle.baselineScore === 40,
  "reported dose completion schedules a traceable check three calendar days later");
check(JSON.stringify(beforeTasks) === JSON.stringify(afterTasks), "remediation does not delete, reorder, or replace core-plan goals");

const early: Progress = {
  ...scheduled,
  kompetenzLog: [...(scheduled.kompetenzLog ?? []), ...entries("Hoeren", 6, 6, { d: "2026-10-29" })],
};
check(skillVerifikationen(early, new Date("2026-10-30T10:00:00Z"))[0]?.status === "waiting",
  "immediate post-dose success cannot satisfy delayed independence verification");

const dueAssisted: Progress = {
  ...scheduled,
  kompetenzLog: [...(scheduled.kompetenzLog ?? []), ...entries("Hoeren", 8, 8, { d: "2026-10-31", assisted: true })],
};
const dueCheck = skillVerifikationen(dueAssisted, new Date("2026-10-31T10:00:00Z"))[0];
check(dueCheck?.status === "due" && dueCheck.measuredWeight === 0, "assisted evidence after the due date still cannot verify independence");

const passedProfile: Progress = {
  ...scheduled,
  kompetenzLog: [...(scheduled.kompetenzLog ?? []), ...entries("Hoeren", SKILL_VERIFY_MIN_WEIGHT, SKILL_VERIFY_MIN_WEIGHT, { d: "2026-10-31" })],
};
const passedCheck = skillVerifikationen(passedProfile, new Date("2026-11-01T10:00:00Z"))[0];
check(passedCheck?.status === "passed" && passedCheck.score === 100, "fresh delayed unassisted evidence can pass the internal check");

const repeatProfile: Progress = {
  ...scheduled,
  kompetenzLog: [...(scheduled.kompetenzLog ?? []), ...entries("Hoeren", SKILL_VERIFY_MIN_WEIGHT, 1, { d: "2026-10-31" })],
};
const repeatCheck = skillVerifikationen(repeatProfile, new Date("2026-11-01T10:00:00Z"))[0];
check(repeatCheck?.status === "repeat" && repeatCheck.score === 33, "weak delayed evidence requests another dose without manufacturing mastery");

const source = fs.readFileSync("components/skillplan.tsx", "utf8");
const app = fs.readFileSync("app/page.tsx", "utf8");
const practice = fs.readFileSync("app/ueben/page.tsx", "utf8");
check(source.includes('data-testid="skill-remediation-boundary"')
  && source.includes("لا تُحذف أو تُرتب أهداف")
  && source.includes("لا مستوى CEFR")
  && source.includes("/ueben?station=${dose.station}")
  && practice.includes('params.get("station")')
  && app.includes("registriereSkillDosis"), "UI states the additive, local, non-CEFR boundary and wires dose scheduling and its target station");

console.log(`\nPersonalization audit: ${passed}/${passed} passed (PA-021; limited optional remediation, delayed measured verification).`);
