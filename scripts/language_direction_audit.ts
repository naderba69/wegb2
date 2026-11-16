#!/usr/bin/env tsx
/** PA-025/PA-026 gate: language-labelled fields and rendered RTL/LTR boundaries. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const ARABIC = /[\u0600-\u06ff]/u;
const failures: string[] = [];
let checks = 0;
const check = (condition: unknown, message: string) => {
  checks += 1;
  if (!condition) failures.push(message);
};

function visitJson(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitJson(entry, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (key === "promptDe" && typeof entry === "string" && ARABIC.test(entry)) {
      failures.push(`${path}.${key}: Arabic text in a German-labelled field`);
    }
    visitJson(entry, `${path}.${key}`);
  }
}

for (const name of readdirSync("content").filter((entry) => entry.endsWith(".json"))) {
  const path = join("content", name);
  visitJson(JSON.parse(readFileSync(path, "utf8")), path);
}
check(failures.length === 0, "runtime JSON banks contain no Arabic in promptDe");

function sourceFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mjs)$/u.test(name) ? [path] : [];
  });
}

for (const path of ["app", "components", "lib"].flatMap(sourceFiles)) {
  const source = readFileSync(path, "utf8");
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true,
    path.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node: ts.Node): void => {
    if (ts.isPropertyAssignment(node) &&
        ((ts.isIdentifier(node.name) && node.name.text === "promptDe") ||
          (ts.isStringLiteral(node.name) && node.name.text === "promptDe"))) {
      const value = node.initializer;
      if ((ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) && ARABIC.test(value.text)) {
        const pos = file.getLineAndCharacterOfPosition(node.getStart(file));
        failures.push(`${path}:${pos.line + 1}: Arabic literal in promptDe`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
}
check(failures.length === 0, "application source contains no Arabic promptDe literals");

const grammar = JSON.parse(readFileSync("content/grammar.json", "utf8")) as Record<string, {
  exercises?: Array<{ id?: string; promptDe?: string; promptAr?: string }>;
  verify?: Array<{ id?: string; promptDe?: string; promptAr?: string }>;
}>;
const texts = JSON.parse(readFileSync("content/texts.json", "utf8")) as Array<{
  questions?: Array<{ id?: string; promptDe?: string; promptAr?: string }>;
}>;
const migratedIds = new Set([
  "a1-zahlen-v2", "a2-praeteritum-v2", "a2-praeteritum-e6", "a2-wechsel-v2", "b1-konj2-v2",
  "g13e3", "b1-plusquamperfekt-v2", "g16e3", "a2-dativ-v2", "a2-dativ-e4", "a2-neg-e4",
  "a2-imp-e4", "a2-ref-e1", "a2-ref-e4", "a2-steigerung-v2", "a2-stg-e4", "a2-fut-e4",
  "b1-genitiv-v2", "b1-gen-e4", "b1-gen-e5", "b1-adj-e5", "b1-wortbildung-v2", "b1-wortbildung-e8",
  "b1-unbestimmte-v2", "b1-unb-e5", "b1-verb-praeposition-v2", "b1-vp-e4", "b1-vp-e5", "b1-pas-e2",
  "b1-pas-e4", "b2-mp-e3", "b2-mp-e4", "b2-mp-e5", "a0-begrussung-v2", "a0-begrussung-t1",
  "a1-dativ-v2", "a1-perfekt-einf-v2", "a1-perf-n3", "a1-fut-n3", "a2-praeteritum-grund-v2",
  "b1-indir-n6", "b2-redew-t1", "a1-war-hatte-v2", "a1-war-hatte-e6", "b1-fvg-e5", "a0-buchstaben-q4",
  "a0-zahlen-v2", "a0-zahlen-q4", "a2-konj2-hoflich-q3", "a2-verb-praep-v2", "a2-verb-praep-q4",
  "b2-adjektiv-partizip-v2", "b2-adj-p6", "a1-weil-e5", "a2-versch-n3", "a1-plural-n5", "a1-zeitpraep-n6",
  "a2-neben-n5", "a2-demo-n6", "a2-wf-e10", "b1-absicht-n5", "b1-konj2-vergangenheit-n6",
  "b2-textkonnektoren-n5", "a0-satzbau-v2", "b2-k2vht-e6", "t-b2-05-q3", "t-b2-07-q1",
]);
const exercises = [
  ...Object.values(grammar).flatMap((topic) => [...(topic.exercises ?? []), ...(topic.verify ?? [])]),
  ...texts.flatMap((text) => text.questions ?? []),
];
const migrated = exercises.filter((exercise) => exercise.id && migratedIds.has(exercise.id));
check(migratedIds.size === 67 && migrated.length === 67,
  `the complete 67-field PA-025 migration remains present (${migrated.length}/67)`);
check(migrated.every((exercise) => !!exercise.promptDe && !ARABIC.test(exercise.promptDe) &&
  !!exercise.promptAr && ARABIC.test(exercise.promptAr)),
  "all migrated exercises preserve Arabic content in promptAr and German-only promptDe");

const de = readFileSync("components/De.tsx", "utf8");
const exerciseUi = readFileSync("components/exercises.tsx", "utf8");
const mediationUi = readFileSync("app/mediation/page.tsx", "utf8");
check((de.match(/lang="de" dir="ltr"/gu) ?? []).length >= 2,
  "inline and block German wrappers explicitly declare de/ltr");
check(exerciseUi.includes('<div lang="ar" dir="rtl"') &&
  exerciseUi.includes('lang="de"\n                  dir="ltr"') &&
  exerciseUi.includes('lang={/[\\u0600-\\u06ff]/u.test(opt) ? "ar" : "de"}'),
  "exercise prompts, inputs, and script-dependent options expose language and direction");
check(mediationUi.includes('lang="de" dir="ltr"') && mediationUi.includes('lang="ar" dir="rtl"'),
  "mediation inputs, instructions, scaffolds, and models expose de/ltr and ar/rtl");

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  console.error(`\nLanguage/direction audit: ${checks - failures.length}/${checks} checks passed.`);
  process.exit(1);
}
console.log(`Language/direction audit: ${checks}/${checks} checks passed (PA-025/PA-026; 67 fields migrated).`);
