#!/usr/bin/env tsx
/** Gate for physical-device, human-accessibility, audio and field-pilot evidence. */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type TestCase = { id: string; category: string; environment: string; acceptance: string[]; status: string; evidenceArtifacts: string[]; executedBy: string | null; executedAt: string | null };
type Program = { schemaVersion: number; claimAr: string; automatedPreflight: Array<{ id: string; status: string; evidence: string; limitation: string }>; testCases: TestCase[] };
const ROOT = process.cwd();
const strict = process.argv.includes("--strict-field");
const program = JSON.parse(readFileSync(resolve(ROOT, "content/real-world-validation.json"), "utf8")) as Program;
let passed = 0;
const failures: string[] = [];
const check = (condition: unknown, label: string) => condition ? (passed++, console.log(`✓ ${label}`)) : (failures.push(label), console.error(`✗ ${label}`));
const evidenceExists = (path: string) => existsSync(resolve(ROOT, path));

console.log("=== REAL-WORLD VALIDATION PROGRAM AUDIT ===\n");
check(program.schemaVersion === 1 && program.claimAr.includes("ليست بديلاً"), "البرنامج يفصل المختبر الآلي عن الجهاز والإنسان الحقيقيين");
check(program.automatedPreflight.length >= 3 && program.automatedPreflight.every((item) => item.status === "passed-automated" && evidenceExists(item.evidence) && item.limitation.length > 20), "كل دليل تمهيدي آلي موجود ومرفق بحدوده");
check(program.testCases.length >= 20 && new Set(program.testCases.map((item) => item.id)).size === program.testCases.length, `مصفوفة الاختبار واسعة ومعرفاتها فريدة (${program.testCases.length})`);
const categories = new Set(program.testCases.map((item) => item.category));
for (const category of ["device", "accessibility", "pwa-resilience", "audio-speech", "field-pilot"]) check(categories.has(category), `فئة ${category} ممثلة`);
for (const item of program.testCases) {
  check(item.environment.length > 8 && item.acceptance.length >= 2 && item.acceptance.every((criterion) => criterion.length > 6), `${item.id}: البيئة ومعايير القبول محددة`);
  if (item.status === "passed" || item.status === "failed" || item.status === "blocked") {
    check(Boolean(item.executedBy && item.executedAt && item.evidenceArtifacts.length && item.evidenceArtifacts.every(evidenceExists)), `${item.id}: النتيجة المنفذة لها شخص وتاريخ وأثر`);
  } else {
    check(item.status === "planned" && !item.executedBy && !item.executedAt && item.evidenceArtifacts.length === 0, `${item.id}: الحالة المخططة لا تنتحل جلسة واقعية`);
  }
}
const completed = program.testCases.filter((item) => item.status === "passed" || item.status === "failed" || item.status === "blocked").length;
console.log(`\nPROGRAM STRUCTURE: ${failures.length ? "FAIL" : "PASS"} — ${passed} checks passed, ${failures.length} failed.`);
console.log(`REAL EXECUTION: ${completed}/${program.testCases.length} sessions documented; ${program.testCases.length - completed} planned.`);
if (failures.length) process.exit(1);
if (strict && completed !== program.testCases.length) process.exit(2);
