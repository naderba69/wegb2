#!/usr/bin/env tsx
/**
 * Dual-alignment evidence gate for Goethe B2 + telc B2.
 *
 * Default mode proves repository traceability and implemented behaviour. It does
 * NOT convert pending external review into a pass. `--strict-official` exits 2
 * until every source/reviewer/device/legal/authority gate is externally signed.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { baueSimulation, bewerteSimulation } from "../lib/simulation";
import { dialogues, grammarMap, muendlich, texts, writingTasks } from "../lib/content";

interface SourceEntry {
  id: string;
  title: string;
  url: string;
  snapshot: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

interface RequirementEntry {
  id: string;
  category: string;
  workingRequirement: string;
  workingRequirementAr: string;
  implementationStatus: "implemented" | "partial" | "missing";
  sourceReviewStatus: "verified" | "pending";
  automatedCheck: string;
  evidence: string[];
}

interface TargetEntry {
  id: "goethe-b2" | "telc-b2";
  authority: string;
  sourceReviewStatus: "verified" | "official-snapshot-pending";
  sources: SourceEntry[];
  requirements: RequirementEntry[];
}

interface ExternalGate {
  id: string;
  titleAr: string;
  ownerRole: string;
  status: "passed" | "pending-external";
  evidenceRequired: string;
}

interface AlignmentRegistry {
  schemaVersion: number;
  updated: string;
  scope: string;
  productClaim: { de: string; ar: string; allowed: string[]; forbidden: string[] };
  targets: TargetEntry[];
  externalGates: ExternalGate[];
}

interface GoetheSchema {
  gesamtAnzeige: number;
  bestehenJeModul: boolean;
  bestehenProzentJeModul: number;
  sourceReviewStatus: string;
  module: Array<{
    id: string;
    punkte: number;
    bestehen: number;
    teile: number;
    dauerMin: number;
    items: number;
    vorbereitungMin?: number;
  }>;
}

const ROOT = process.cwd();
const strictOfficial = process.argv.includes("--strict-official");
const registry = JSON.parse(readFileSync(resolve(ROOT, "content/accreditation-alignment.json"), "utf8")) as AlignmentRegistry;
const goetheSchema = JSON.parse(readFileSync(resolve(ROOT, "content/pruefung-b2.json"), "utf8")) as GoetheSchema;
const simulationSource = readFileSync(resolve(ROOT, "lib/simulation.ts"), "utf8");
const simulationUiSource = readFileSync(resolve(ROOT, "components/simulation.tsx"), "utf8");
const fullExamSource = readFileSync(resolve(ROOT, "lib/vollpruefung.ts"), "utf8");

let passed = 0;
const failures: string[] = [];
const pending: string[] = [];

function check(condition: unknown, label: string): void {
  if (condition) {
    passed++;
    console.log(`✓ ${label}`);
  } else {
    failures.push(label);
    console.error(`✗ ${label}`);
  }
}

function officialHost(target: TargetEntry["id"], value: string): boolean {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return target === "goethe-b2"
      ? host === "goethe.de" || host.endsWith(".goethe.de")
      : host === "telc.net" || host.endsWith(".telc.net");
  } catch {
    return false;
  }
}

console.log("=== GOETHE B2 + TELC B2 ALIGNMENT AUDIT ===\n");
check(registry.schemaVersion === 1 && registry.scope === "dual-aligned-exam-preparation", "سجل المطابقة ذو مخطط ونطاق صريحين");
check(registry.productClaim.ar.includes("ليس امتحاناً رسمياً") && registry.productClaim.forbidden.length >= 4, "سياسة الادعاءات تمنع الشهادة أو الاعتماد الرسمي غير الممنوح");

const ids = registry.targets.map((target) => target.id);
check(ids.length === 2 && new Set(ids).size === 2 && ids.includes("goethe-b2") && ids.includes("telc-b2"), "الهدفان Goethe B2 وtelc B2 مسجلان مرة واحدة");

const requirementIds = new Set<string>();
for (const target of registry.targets) {
  check(target.sources.length > 0 && target.sources.every((source) => officialHost(target.id, source.url)), `${target.id}: كل روابط المصدر على النطاق الرسمي الصحيح`);
  for (const source of target.sources) {
    if (!source.snapshot || !source.reviewedBy || !source.reviewedAt) pending.push(`${target.id}/${source.id}: official snapshot + reviewer sign-off`);
  }
  for (const requirement of target.requirements) {
    check(!requirementIds.has(requirement.id), `${requirement.id}: معرّف مطلب فريد`);
    requirementIds.add(requirement.id);
    check(requirement.implementationStatus === "implemented" && requirement.workingRequirementAr.trim().length > 20, `${requirement.id}: التنفيذ البرمجي مكتمل ووصفه العام بالعربية موجود`);
    check(requirement.evidence.length > 0 && requirement.evidence.every((entry) => existsSync(resolve(ROOT, entry.split("#")[0]))), `${requirement.id}: كل ملفات الدليل موجودة`);
    if (requirement.sourceReviewStatus !== "verified") pending.push(`${requirement.id}: official source review`);
  }
}

check(simulationUiSource.includes("ليست امتحانًا رسميًا") && simulationUiSource.includes("تقييم ذاتي") && fullExamSource.includes("لا نتيجة Goethe/telc رسمية"), "واجهات النتائج تصرّح بأنها تدريب وتقييم ذاتي غير رسمي");
check(!simulationUiSource.includes("محاكاة كاملة بصيغة رسمية") && simulationSource.includes("صيغ مواءمة تدريبية مؤقتة") && !simulationSource.includes("صيغ رسمية موثّقة المصدر"), "الواجهة والمحرك لا يسميان المحاكاة منتجاً رسمياً");

const moduleById = new Map(goetheSchema.module.map((module) => [module.id, module]));
check(goetheSchema.gesamtAnzeige === 400 && goetheSchema.bestehenJeModul === true && goetheSchema.bestehenProzentJeModul === 60, "Goethe: 400 للعرض فقط، والنجاح 60/100 في كل وحدة بلا تعويض");
check(goetheSchema.module.length === 4 && ["lesen", "hoeren", "schreiben", "sprechen"].every((id) => moduleById.has(id)), "Goethe: الوحدات الأربع منفصلة وموجودة");
check(goetheSchema.module.every((module) => module.punkte === 100 && module.bestehen === 60), "Goethe: كل وحدة 100 نقطة وعتبتها 60");
check(moduleById.get("lesen")?.dauerMin === 65 && moduleById.get("hoeren")?.dauerMin === 40 && moduleById.get("schreiben")?.dauerMin === 75 && moduleById.get("sprechen")?.dauerMin === 15 && moduleById.get("sprechen")?.vorbereitungMin === 15, "Goethe: الأزمنة المؤقتة متسقة بين سجل الأدلة والمخطط");

const goethePlan = baueSimulation(20261104, "goethe-b2");
check(goethePlan.zeiten.lesen === 65 && goethePlan.zeiten.hoeren === 40 && goethePlan.zeiten.schreiben === 75 && goethePlan.zeiten.vorbereitung === 15 && goethePlan.zeiten.sprechen === 15, "Goethe: مولد المحاكاة يطبق الأزمنة المسجلة");
const goethePass = bewerteSimulation("goethe-b2", { lesenAnteil: 0.6, sprachAnteil: 0, hoerenAnteil: 0.6, schreibenRubrik: 60, schreibenZuKurz: false, sprechenRubrik: 60 });
const goetheNoCompensation = bewerteSimulation("goethe-b2", { lesenAnteil: 1, sprachAnteil: 0, hoerenAnteil: 1, schreibenRubrik: 100, schreibenZuKurz: false, sprechenRubrik: 59 });
check(goethePass.bestanden && !goetheNoCompensation.bestanden, "Goethe: حد 60 ينجح ولا تعويض لو بقيت وحدة عند 59");
check(Boolean(goethePlan.schreiben.teil1 && goethePlan.schreiben.teil2) && simulationUiSource.includes("≈150 + ‏≈100 كلمة"), "Goethe: مهمتا الكتابة وهدفا 150/100 موصولان بالواجهة");

const telcPlan = baueSimulation(20261104, "telc-b2");
check(telcPlan.zeiten.lesen === 60 && telcPlan.zeiten.sprachbausteine === 30 && telcPlan.zeiten.hoeren === 20 && telcPlan.zeiten.schreiben === 30 && telcPlan.zeiten.vorbereitung === 20 && telcPlan.zeiten.sprechen === 15, "telc: مولد المحاكاة يطبق الأزمنة المؤقتة المسجلة");
check(telcPlan.sprachbausteine.length === 2 && telcPlan.sprachbausteine.every((block) => block.gaps.length > 0) && telcPlan.hoeren.length > 0 && telcPlan.hoeren.every((item) => item.einmal) && Boolean(telcPlan.schreiben.teil1) && !telcPlan.schreiben.teil2, "telc: Sprachbausteine والاستماع مرة واحدة ومهمة الكتابة الواحدة موصولة");
const telcPass = bewerteSimulation("telc-b2", { lesenAnteil: 0.6, sprachAnteil: 0.6, hoerenAnteil: 0.6, schreibenRubrik: 60, schreibenZuKurz: false, sprechenRubrik: 60 });
const telcWrittenFail = bewerteSimulation("telc-b2", { lesenAnteil: 0.59, sprachAnteil: 0.6, hoerenAnteil: 0.6, schreibenRubrik: 60, schreibenZuKurz: false, sprechenRubrik: 100 });
const telcOralFail = bewerteSimulation("telc-b2", { lesenAnteil: 1, sprachAnteil: 1, hoerenAnteil: 1, schreibenRubrik: 100, schreibenZuKurz: false, sprechenRubrik: 59 });
check(telcPass.bestanden && !telcWrittenFail.bestanden && !telcOralFail.bestanden, "telc: الكتلتان 135/225 و45/75 مطلوبتان بلا تعويض بينهما");

const b2Texts = texts.filter((item) => item.level === "B2").length;
const b2Dialogues = dialogues.filter((item) => item.level === "B2").length;
const b2Writing = writingTasks.filter((item) => item.level === "B2").length;
const b2Speaking2 = muendlich.filter((item) => item.level === "B2" && item.teil === 2).length;
const b2Speaking3 = muendlich.filter((item) => item.level === "B2" && item.teil === 3).length;
check(b2Texts > 0 && b2Dialogues > 0 && b2Writing > 0 && b2Speaking2 > 0 && b2Speaking3 > 0 && Object.keys(grammarMap).length >= 87, `المادة B2 تغطي المهارات الأربع والقواعد (نصوص ${b2Texts}، حوارات ${b2Dialogues}، كتابة ${b2Writing}، شفهي ${b2Speaking2 + b2Speaking3}، قواعد ${Object.keys(grammarMap).length})`);
check(goetheSchema.sourceReviewStatus === "official-snapshot-pending" && registry.targets.every((target) => target.sourceReviewStatus === "official-snapshot-pending"), "حالة المصدر الخارجية صريحة وغير محولة إلى اعتماد آلي كاذب");

for (const gate of registry.externalGates) {
  if (gate.status !== "passed") pending.push(`${gate.id}: ${gate.titleAr}`);
}

console.log(`\nTECHNICAL VERDICT: ${failures.length ? "FAIL" : "PASS"} — ${passed} checks passed, ${failures.length} failed.`);
console.log(`OFFICIAL READINESS: ${pending.length ? "PENDING" : "SIGNED"} — ${pending.length} external/source sign-offs pending.`);
for (const item of pending) console.log(`  ◌ ${item}`);

if (failures.length) process.exit(1);
if (strictOfficial && pending.length) process.exit(2);
