#!/usr/bin/env tsx
/** Honest lifecycle gate for the 181–1000 research/tool catalog. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import YAML from "yaml";

type Tool = { id: number; family: string; titleDe: string; titleAr: string; level: string; bloom: string; examRelevant: boolean; fase: string; research?: string; desc?: string; code?: string };
type Override = { decision?: string; researchStatus?: string; productStatus?: string; automatedTestStatus?: string; fieldValidationStatus?: string; evidence?: string[] };
type Governance = { schemaVersion: number; catalog: { firstId: number; lastId: number; expectedEntries: number }; claimAr: string; defaultState: Record<string, string>; allowedDecisions: string[]; productionAcceptance: string[]; overrides: Record<string, Override> };
type Summary = { schemaVersion: number; total: number; firstId: number; lastId: number; citationLabels: number; genericPrototypeModules: number; exactDuplicateTitleGroups: Array<{ title: string; ids: number[] }>; reviewedDecisions: number; adopted: number; productIntegrated: number; fieldValidated: number; claimAr: string };
type ReviewItem = { id: number; titleDe: string; titleAr: string; family: string; level: string; bloom: string; citationLabel: string | null; prototypeKind: string; duplicateTitleIds: number[]; status: Record<string, string> };
type ReviewMatrix = { schemaVersion: number; claimAr: string; items: ReviewItem[] };

const ROOT = process.cwd();
const strict = process.argv.includes("--strict-production");
const tools = YAML.parse(readFileSync(resolve(ROOT, "content/tools.yaml"), "utf8")) as Tool[];
const governance = JSON.parse(readFileSync(resolve(ROOT, "content/tool-catalog-governance.json"), "utf8")) as Governance;
const summary = JSON.parse(readFileSync(resolve(ROOT, "content/tool-catalog-summary.json"), "utf8")) as Summary;
const reviewMatrix = JSON.parse(readFileSync(resolve(ROOT, "content/tool-catalog-review-matrix.json"), "utf8")) as ReviewMatrix;
let passed = 0;
const failures: string[] = [];
const check = (condition: unknown, label: string) => condition ? (passed++, console.log(`✓ ${label}`)) : (failures.push(label), console.error(`✗ ${label}`));

console.log("=== 820 TOOL/IDEA CATALOG AUDIT ===\n");
check(Array.isArray(tools) && governance.schemaVersion === 1 && summary.schemaVersion === 1, "مصادر الكتالوج والحوكمة والملخص ذات مخطط صالح");
check(tools.length === governance.catalog.expectedEntries && tools.length === 820, "الكتالوج يحتوي 820 سجلاً بالضبط");
const ids = tools.map((tool) => tool.id);
check(Math.min(...ids) === governance.catalog.firstId && Math.max(...ids) === governance.catalog.lastId && new Set(ids).size === tools.length, "المعرفات متصلة وفريدة من 181 إلى 1000");
check(ids.every((id, index) => id === governance.catalog.firstId + index), "لا فجوة أو إعادة ترتيب في معرفات الكتالوج");
check(tools.every((tool) => tool.family && tool.titleDe && tool.titleAr && tool.level && tool.bloom && typeof tool.examRelevant === "boolean" && tool.fase), "الحد الأدنى الوصفي موجود لكل سجل");
check(governance.claimAr.includes("ليست 820 ميزة مدمجة") && governance.defaultState.productStatus === "prototype-not-wired", "حد الادعاء يمنع عد النماذج الأولية مزايا مكتملة");
check(governance.productionAcceptance.length >= 8, "معيار الإنتاج يطلب المصدر والسلوك والقياس والاختبار والإتاحة والخصوصية");

const overrideIds = Object.keys(governance.overrides);
check(overrideIds.every((id) => ids.includes(Number(id))), "كل override يعود إلى أداة موجودة");
check(Object.values(governance.overrides).every((entry) => !entry.decision || governance.allowedDecisions.includes(entry.decision)), "قرارات المراجعة محصورة في الحالات المسموحة");
const generic = tools.filter((tool) => new RegExp(`tool${tool.id}Gain`).test(tool.code ?? "") && new RegExp(`tool${tool.id}Check`).test(tool.code ?? "")).length;
const citationLabels = tools.filter((tool) => Boolean(tool.research?.trim())).length;
const titleGroups = new Map<string, number[]>();
for (const tool of tools) {
  const key = tool.titleDe.trim().toLocaleLowerCase("de");
  titleGroups.set(key, [...(titleGroups.get(key) ?? []), tool.id]);
}
const duplicateGroups = [...titleGroups.entries()].filter(([, groupedIds]) => groupedIds.length > 1);
check(summary.total === tools.length && summary.firstId === Math.min(...ids) && summary.lastId === Math.max(...ids), "الملخص المولد يطابق النطاق الفعلي");
check(reviewMatrix.schemaVersion === 1 && reviewMatrix.items.length === tools.length && reviewMatrix.items.every((item, index) => item.id === tools[index].id && item.titleDe === tools[index].titleDe && item.status.productStatus), "مصفوفة المراجعة تفهرس كل فكرة وحالتها بنداً بنداً");
check(reviewMatrix.items.every((item) => item.status.productStatus === "prototype-not-wired" && item.status.researchStatus === "citation-label-unverified" && item.status.decision === "pending-academic-review"), "الحالة الافتراضية الصادقة مطبقة على 820/820 بلا نجاح جماعي مصطنع");
check(summary.genericPrototypeModules === generic && generic === 720, `النماذج العامة غير الموصولة معلنة بدقة (${generic})`);
check(summary.citationLabels === citationLabels && citationLabels === 811, `تسميات المراجع الأولية معدودة دون تسميتها مراجع موثقة (${citationLabels})`);
check(summary.exactDuplicateTitleGroups.length === duplicateGroups.length, `مجموعات العناوين المتطابقة مكشوفة (${duplicateGroups.length})`);
check(summary.productIntegrated === 0 && summary.fieldValidated === 0 && summary.reviewedDecisions === 0, "لا اكتمال أو تحقق ميداني مصطنع قبل المراجعة البندية");

const pending = tools.filter((tool) => {
  const override = governance.overrides[String(tool.id)] ?? {};
  return (override.decision ?? governance.defaultState.decision) === "pending-academic-review" ||
    (override.researchStatus ?? governance.defaultState.researchStatus) !== "verified" ||
    (override.productStatus ?? governance.defaultState.productStatus) !== "wired-and-tested" ||
    (override.fieldValidationStatus ?? governance.defaultState.fieldValidationStatus) !== "verified-or-not-required";
}).length;
console.log(`\nCATALOG STRUCTURE: ${failures.length ? "FAIL" : "PASS"} — ${passed} checks passed, ${failures.length} failed.`);
console.log(`PRODUCTION READINESS: ${tools.length - pending}/${tools.length} entries satisfy the full evidence lifecycle; ${pending} pending.`);
if (failures.length) process.exit(1);
if (strict && pending > 0) process.exit(2);
