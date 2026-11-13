import assert from "node:assert/strict";
import fs from "node:fs";
import type { CanDoDescriptor, Level } from "../lib/types";

let passed = 0;
const check = (condition: unknown, message: string) => {
  assert.ok(condition, message);
  passed++;
  console.log(`✓ ${message}`);
};

const bank = JSON.parse(fs.readFileSync("content/cando.json", "utf8")) as Record<Level, CanDoDescriptor[]>;
const all = Object.entries(bank).flatMap(([level, descriptors]) => descriptors.map((descriptor) => ({ level: level as Level, descriptor })));
const counts = Object.fromEntries(Object.entries(bank).map(([level, descriptors]) => [level, descriptors.length]));
const expectedCounts: Record<Level, number> = { A0: 11, A1: 8, A2: 9, B1: 8, B2: 8 };

check(all.length === 44 && new Set(all.map(({ descriptor }) => descriptor.id)).size === 44, "all 44 Can-Do IDs remain unique");
check(Object.keys(counts).length === Object.keys(expectedCounts).length
  && Object.entries(expectedCounts).every(([level, count]) => counts[level] === count), "level inventory remains 11/8/9/8/8");
check(all.every(({ descriptor }) => descriptor.kind === "communicative_self_report" && descriptor.source === "internal"), "every descriptor is explicitly an internal communicative self-report");

const allowedSkills = new Set(["Lesen", "Hoeren", "Schreiben", "Sprechen"]);
check(all.every(({ descriptor }) => descriptor.skills.length > 0 && descriptor.skills.every((skill) => allowedSkills.has(skill))), "descriptors carry explicit communicative skills only");
check(all.every(({ level, descriptor }) => level === "A0"
  ? descriptor.levelLabel === "Pre-A1 (interne Bezeichnung A0)"
  : descriptor.levelLabel === level), "A0 is explicitly an internal Pre-A1 label and all other labels match their bank");

const combined = all.map(({ descriptor }) => `${descriptor.de} ${descriptor.ar}`).join("\n");
check(!/(\bGoethe\b|\btelc\b|\bZertifikat\b|\bPrüfung\b|\bbestehen\b|\bteilnehmen\b|امتحان|شهادة|اجتياز)/i.test(combined), "self-report descriptors make no exam participation or pass claim");
check(!/(Konjunktiv|Plusquamperfekt|Präteritum|Relativsätz|Funktionsverbgefüge|Nominalstil|\bPerfekt\b|„weil“|„dass“)/i.test(combined), "grammar-form objectives are no longer presented as communicative Can-Do descriptors");

const b1ExamFormer = bank.B1.find((item) => item.id === "B1-C8");
const b2ExamFormer = bank.B2.find((item) => item.id === "B2-C8");
check(!!b1ExamFormer?.de.includes("auf Nachfragen reagieren") && !!b1ExamFormer.ar.includes("الرد على الأسئلة"), "former B1 pass claim is an observable interaction in both languages");
check(!!b2ExamFormer?.de.includes("unter Zeitvorgabe") && !!b2ExamFormer.ar.includes("ضمن وقت محدد")
  && !!b2ExamFormer.de.includes("Gegenargumente") && !!b2ExamFormer.ar.includes("الحجج المضادة"), "former B2 pass claim is an observable timed interaction with aligned Arabic");

const taskSource = fs.readFileSync("components/tasks.tsx", "utf8");
check(taskSource.includes("checked={selected[c.id] === true}")
  && taskSource.includes("PROGRESS_EVENT")
  && taskSource.includes("setSelected({ ...loadProgress().canDo })"), "checkboxes are controlled by saved state and react to progress/profile events");
check(taskSource.includes('data-testid="cando-boundary"')
  && taskSource.includes("غير منسوبة إلى CEFR")
  && taskSource.includes("لا تدخل الأداء المقاس")
  && taskSource.includes("Pre-A1"), "UI states internal self-report, measurement, and A0/Pre-A1 boundaries");
check(taskSource.includes("c.skills.map") && taskSource.includes("c.levelLabel") && taskSource.includes("مصدر داخلي"), "UI exposes skill, level label, and internal provenance for every descriptor");

const competenceSource = fs.readFileSync("lib/kompetenz.ts", "utf8");
check(!competenceSource.includes("p.canDo") && !competenceSource.includes("progress.canDo"), "Can-Do self-reports cannot enter measured skill performance");

console.log(`\nCan-Do integrity audit: ${passed}/${passed} passed (PA-031/PA-032; reactive self-report with explicit internal provenance).`);
