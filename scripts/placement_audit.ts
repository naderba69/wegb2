#!/usr/bin/env tsx
/** PA-014 gate: conservative, source-balanced receptive/form placement without CEFR overclaim. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  EINSTUFUNG_BESTANDEN_AB,
  EINSTUFUNG_ITEMS_PRO_STUFE,
  EINSTUFUNG_SCOPE,
  EINSTUFUNG_SKILLS,
  EINSTUFUNG_STUFEN,
  einstufungAntwort,
  einstufungStart,
  einstufungsBandErgebnisse,
  einstufungsFragen,
  type EinstufungsSkill,
} from "../lib/einstufung";

const checks: Array<[string, () => void]> = [];
const check = (name: string, run: () => void) => checks.push([name, run]);
const runPattern = (skill: EinstufungsSkill, pattern: boolean[]) => {
  let run = einstufungStart(skill);
  for (const answer of pattern) {
    if (run.fertig) break;
    run = einstufungAntwort(run, answer);
  }
  return run;
};

check("each domain has four items from four sources at every A1-B2 band", () => {
  assert.equal(EINSTUFUNG_ITEMS_PRO_STUFE, 4);
  for (const skill of EINSTUFUNG_SKILLS) {
    const questions = einstufungsFragen(skill);
    assert.equal(questions.length, 16, skill);
    for (const [index, level] of EINSTUFUNG_STUFEN.entries()) {
      const band = questions.slice(index * 4, index * 4 + 4);
      assert.ok(band.every((question) => question.stufe === level), `${skill}/${level}: level drift`);
      assert.equal(new Set(band.map((question) => question.sourceId)).size, 4, `${skill}/${level}: repeated source`);
    }
  }
});

check("all selected items are answerable MC items with at least three options", () => {
  for (const question of EINSTUFUNG_SKILLS.flatMap(einstufungsFragen)) {
    assert.equal(question.ex.type, "mc");
    assert.ok((question.ex.options?.length ?? 0) >= 3, question.ex.id);
    assert.ok(question.ex.options?.includes(String(question.ex.answer)), question.ex.id);
    if (question.skill === "hoeren") assert.ok(question.audioSrc || question.ex.text, `${question.ex.id}: no listening input`);
  }
});

check("selection is deterministic", () => {
  for (const skill of EINSTUFUNG_SKILLS) {
    const first = einstufungsFragen(skill).map((question) => `${question.stufe}:${question.sourceId}:${question.ex.id}`);
    const second = einstufungsFragen(skill).map((question) => `${question.stufe}:${question.sourceId}:${question.ex.id}`);
    assert.deepEqual(first, second);
  }
});

check("one or two correct answers never pass a four-item band", () => {
  assert.equal(EINSTUFUNG_BESTANDEN_AB, 3);
  for (const skill of EINSTUFUNG_SKILLS) {
    for (const pattern of [[true, false, false, false], [true, true, false, false]]) {
      const run = runPattern(skill, pattern);
      assert.equal(run.fertig, true);
      assert.equal(run.schaetzung, "A0");
      assert.equal(einstufungsBandErgebnisse(run)[0]?.bestanden, false);
    }
  }
});

check("three of four passes only that band and records raw evidence", () => {
  const pass = [true, true, true, false];
  const run = runPattern("lesen", [...pass, true, true, false, false]);
  assert.equal(run.fertig, true);
  assert.equal(run.schaetzung, "A1");
  assert.deepEqual(einstufungsBandErgebnisse(run), [
    { stufe: "A1", richtig: 3, gesamt: 4, bestanden: true },
    { stufe: "A2", richtig: 2, gesamt: 4, bestanden: false },
  ]);
  assert.ok(run.antworten.every((answer) => answer.itemId && answer.sourceId));
  assert.equal(new Set(run.antworten.slice(0, 4).map((answer) => answer.sourceId)).size, 4);
  const allBands = runPattern("lesen", [...pass, ...pass, ...pass, ...pass]);
  assert.equal(allBands.schaetzung, "B2");
  assert.ok(einstufungsBandErgebnisse(allBands).every((band) => band.bestanden && band.richtig === 3));
});

check("UI states receptive/form scope and never claims productive or CEFR measurement", () => {
  const ui = readFileSync("components/einstufung.tsx", "utf8");
  for (const marker of [
    "لا توجد هنا عينة كتابة أو تحدث",
    "لا تصدر النتيجة مستوى CEFR",
    "3 من 4",
    "4–16 بندًا",
    "أسماء حزم محتوى",
    "scope: EINSTUFUNG_SCOPE",
  ]) assert.ok(ui.includes(marker), `missing UI boundary: ${marker}`);
  assert.equal(EINSTUFUNG_SCOPE, "receptive-form-only-v1");
  assert.ok(!ui.includes("حين تخفق في سؤالَي مستوى") && !ui.includes("4–8 أسئلة للمهارة"));
});

check("stored schema preserves scope and item-level band evidence", () => {
  const types = readFileSync("lib/types.ts", "utf8");
  assert.ok(types.includes('scope?: "receptive-form-only-v1"'));
  assert.ok(types.includes("totalItems: number"));
  assert.ok(types.includes("richtig: number"));
  assert.ok(types.includes("bestanden: boolean"));
  assert.ok(types.includes("itemId: string"));
  assert.ok(types.includes("sourceId: string"));
});

let passed = 0;
for (const [name, run] of checks) {
  run();
  passed += 1;
  console.log(`✓ ${name}`);
}
console.log(`\nPlacement audit: ${passed}/${checks.length} passed (PA-014; receptive/form scope only).`);
