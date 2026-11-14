import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HIGH_RISK_GOVERNANCE, highRiskGovernanceFor, type HighRiskSurfaceId } from "../lib/high-risk-governance";

type JsonRecord = Record<string, unknown>;

let passed = 0;
const check = (condition: unknown, label: string) => {
  assert.ok(condition, label);
  passed++;
  console.log(`✓ ${label}`);
};

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as unknown;

function resolveSelector(root: unknown, selector: string): unknown {
  if (selector === "$") return root;
  return selector.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    return (value as JsonRecord)[key];
  }, root);
}

check(HIGH_RISK_GOVERNANCE.schema === "wegb2-high-risk-content-governance-v1"
  && HIGH_RISK_GOVERNANCE.surfaces.length === 4
  && new Set(HIGH_RISK_GOVERNANCE.surfaces.map((surface) => surface.id)).size === 4,
"the governance registry has one unique record for each high-risk surface");

check(["pflege", "orientierung", "lebenswelt", "szenarien"].every((id) =>
  highRiskGovernanceFor(id as HighRiskSurfaceId).id === id),
"all four runtime surface lookups resolve deterministically");

let governedItems = 0;
for (const surface of HIGH_RISK_GOVERNANCE.surfaces) {
  const bank = json(surface.bank);
  for (const group of surface.groups) {
    const value = resolveSelector(bank, group.selector);
    assert.ok(Array.isArray(value), `${surface.id}/${group.selector} must resolve to an array`);
    assert.equal(value.length, group.count, `${surface.id}/${group.selector} count drift`);
    governedItems += value.length;
  }
}
check(governedItems === 301,
"all 301 registered items/groups resolve to current bank arrays with exact guarded counts");

check(HIGH_RISK_GOVERNANCE.surfaces.every((surface) =>
  surface.jurisdiction.trim().length > 10
  && surface.noticeAr.length > 80
  && surface.officialActionAr.length > 40
  && surface.professionalReview === "pending"
  && surface.fieldValidation === "pending"),
"every surface discloses jurisdiction, learner warning, official-action boundary, and pending expert/field review");

const factualGroups = HIGH_RISK_GOVERNANCE.surfaces.flatMap((surface) =>
  surface.groups.filter((group) => group.source.status === "pending-external-verification"));
const fictionalGroups = HIGH_RISK_GOVERNANCE.surfaces.flatMap((surface) =>
  surface.groups.filter((group) => group.source.status === "not-applicable-fictional"));
check(factualGroups.length === 7 && fictionalGroups.length === 7
  && factualGroups.every((group) => group.source.url === null && group.source.asOf === null)
  && fictionalGroups.every((group) => group.source.url === null && group.source.asOf === null),
"unverified factual groups expose missing source/date as null while fictional groups never invent a citation");

check(!JSON.stringify(HIGH_RISK_GOVERNANCE).includes('"verified"')
  && HIGH_RISK_GOVERNANCE.claimBoundaryAr.includes("لا يثبت صحة طبية أو قانونية أو مدنية"),
"the registry contains no simulated verification and explicitly denies medical/legal/civic validity");

const notice = read("components/high-risk-notice.tsx");
check(notice.includes('role="note"')
  && notice.includes("مراجعة تصنيف المخاطر:")
  && notice.includes("ليست مراجعة للوقائع")
  && notice.includes("المصدر الرسمي وتاريخ الصلاحية")
  && notice.includes("مراجعة مختص: معلّقة")
  && notice.includes("تحقق ميداني: معلّق"),
"the shared notice visibly exposes source/date, specialist-review, and field-validation status");

const uiSources = {
  pflege: read("components/pflege.tsx"),
  orientierung: read("app/orientierung/page.tsx"),
  lebenswelt: read("components/lebenswelt.tsx"),
  szenarien: read("components/szenarien.tsx"),
};
check(Object.entries(uiSources).every(([id, source]) =>
  source.includes(`surfaceId="${id}"`)),
"all four learner-facing surfaces render the shared high-risk notice before reliance");

check(!uiSources.orientierung.includes("Orientierungskurs — BAMF 100UE")
  && uiSources.orientierung.includes("ليست دورة BAMF")
  && uiSources.orientierung.includes("وصف تأليفي داخلي غير متحقق")
  && !uiSources.pflege.includes("حوارات عمل حقيقية")
  && uiSources.pflege.includes("بنك معرفة تدريبي غير موثّق مهنياً")
  && uiSources.pflege.includes("ليست كفاءة مهنية"),
"official-course and professionally validated wording is removed from civic and nursing surfaces");

const lebenswelt = read("lib/lebenswelt.ts");
const scenarios = read("content/szenarien.json");
check(lebenswelt.includes("استخدم البطاقات لصياغة الأسئلة فقط")
  && lebenswelt.includes("قائمة الوثائق الملزمة تُؤخذ من جهة الاعتراف الحالية")
  && !lebenswelt.includes("Anmeldung خلال 14 يومًا")
  && !scenarios.includes("اللغة التي تنقذ يومك")
  && scenarios.includes("موقف خيالي لتدريب طلب المساعدة"),
"career and emergency copy is reframed as language practice rather than procedural or safety advice");

const whitelist = json("content/fakten-whitelist.json") as { _zweck?: string };
check(typeof whitelist._zweck === "string" && whitelist._zweck.includes("سببها")
  && !whitelist._zweck.includes("مصدر رسمي")
  && read("docs/PEDAGOGICAL_EXPERT_AUDIT_2026-11-04.md").includes("ليست مراجع رسمية"),
"the numeric-fact whitelist remains an internal rationale list, never a source or specialist sign-off");

console.log(`\nHigh-risk content audit: ${passed}/${passed} passed (PA-033 programmatic safeguards; external specialist review remains pending).`);
