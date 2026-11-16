import fs from "node:fs";
import path from "node:path";

type DialogueLine = {
  who: string;
  de: string;
  ar: string;
};

type DialogueQuestion = {
  id: string;
  type: string;
  promptDe: string;
  promptAr?: string;
  options?: string[];
  answer: string | string[];
  explanationAr?: string;
};

type Dialogue = {
  id: string;
  level: string;
  titleDe: string;
  titleAr: string;
  lines: DialogueLine[];
  questions: DialogueQuestion[];
  dictation?: string[];
  cultural_theme?: string;
  cultural_note?: string;
  [key: string]: unknown;
};

type ReviewEntry = {
  id: string;
  level: string;
  decision: "corrected" | "confirmed-current";
  rationale: string;
  previous: Dialogue;
  current: Dialogue;
};

type ReviewFixture = {
  schema: string;
  batch: string;
  reviewedAt: string;
  scope: string;
  entries: ReviewEntry[];
};

const readJson = <T>(relativePath: string): T => JSON.parse(
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"),
) as T;
const dialogues = readJson<Dialogue[]>("content/dialogues.json");
const review01 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-01.json");
const review02 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-02.json");
const review03 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-03.json");
const review04 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-04.json");
const review05 = readJson<ReviewFixture>("scripts/fixtures/dialogues-reviewed-05.json");
const byId = new Map(dialogues.map((dialogue) => [dialogue.id, dialogue]));
const errors: string[] = [];
const expectedA0 = new Set([
  "d-a0-01", "d-a0-02", "d-a0-03", "d-a0-04", "d-a0-05",
  "d-a0-06", "d-a0-07", "d-a0-08", "d-a0-09", "d-a0-10",
  "d-a0-11", "d-a0-12", "d-a0-13", "d-a0-ht01", "d-a0-ht02",
  "d-a0-ht03",
]);
const expectedA1 = new Set([
  "d-a1-01", "d-a1-02", "d-a1-03", "d-a1-04", "d-a1-05", "d-a1-06",
  "d-a1-07", "d-a1-08", "d-a1-09", "d-a1-10", "d-a1-11", "d-a1-12",
  "d-a1-13", "d-a1-14", "d-a1-15", "d-a1-16", "d-a1-17", "d-a1-18",
  "d-a1-19", "d-a1-20", "d-a1-21", "d-a1-22", "d-a1-23", "d-a1-24",
  "d-a1-25", "d-a1-26", "d-a1-27", "d-a1-31", "d-a1-32",
  "dlg-a1-fahrkarte", "hoer-a1-01", "hoer-a1-02", "d-a1-ht01",
  "d-a1-ht02", "d-a1-ht03", "dlg-a1-baeckerei",
]);
const expectedA2 = new Set([
  "d-a2-01", "d-a2-02", "d-a2-03", "d-a2-04", "d-a2-05", "d-a2-06",
  "d-a2-07", "d-a2-08", "d-a2-09", "d-a2-10", "d-a2-11", "d-a2-12",
  "d-a2-13", "d-a2-14", "d-a2-15", "d-a2-16", "d-a2-17", "d-a2-18",
  "d-a2-19", "d-a2-20", "d-a2-21", "d-a2-22", "d-a2-23", "d-a2-24",
  "d-a2-25", "d-a2-26", "d-a2-27", "d-a2-31", "d-a2-32",
  "dlg-a1-reklamation-hotel", "dlg-a2-terminabsage", "dlg-a2-krankenversicherung",
  "hoer-a2-01", "hoer-a2-02", "d-a2-ht01", "d-a2-ht02", "d-a2-ht03",
  "dlg-a2-buergeramt",
]);
const expectedB1 = new Set([
  "d-b1-01", "d-b1-02", "d-b1-03", "d-b1-04", "d-b1-05", "d-b1-06",
  "d-b1-07", "d-b1-08", "d-b1-09", "d-b1-10", "d-b1-11", "d-b1-12",
  "d-b1-13", "d-b1-14", "d-b1-15", "d-b1-16", "d-b1-17", "d-b1-18",
  "d-b1-19", "d-b1-20", "d-b1-21", "d-b1-22", "d-b1-23", "d-b1-24",
  "d-b1-25", "d-b1-26", "d-b1-27", "d-b1-31", "d-b1-32",
  "dlg-b1-kontoeroeffnung", "hoer-b1-01", "d-b1-ht01", "d-b1-ht02",
  "d-b1-ht03", "dlg-b1-wohnungssuche", "dlg-b1-berufsberatung",
  "dlg-b1-elterngespraech",
]);
const expectedB2 = new Set([
  "d-b2-01", "d-b2-02", "d-b2-03", "d-b2-04", "d-b2-05", "d-b2-06",
  "d-b2-07", "d-b2-08", "d-b2-09", "d-b2-10", "d-b2-11", "d-b2-12",
  "d-b2-13", "d-b2-14", "d-b2-15", "d-b2-16", "d-b2-17", "d-b2-18",
  "d-b2-19", "d-b2-20", "d-b2-21", "d-b2-22", "d-b2-23", "d-b2-24",
  "d-b2-25", "d-b2-26", "d-b2-27", "d-b2-31", "d-b2-32",
  "dlg-b2-mietvertrag", "hoer-b2-01", "d-b2-ht01", "d-b2-ht02", "d-b2-ht03",
  "dlg-b2-homeoffice", "dlg-b2-klimadebatte", "dlg-b2-ki-arbeit",
  "d-b2-38", "d-b2-39", "d-b2-40", "d-b2-41", "d-b2-42", "d-b2-43",
  "d-b2-44", "d-b2-45", "d-b2-46", "d-b2-47", "d-b2-48", "d-b2-49",
]);

if (dialogues.length !== 176 || byId.size !== 176) {
  errors.push(`dialogue bank count or identity drifted: ${dialogues.length}/${byId.size} instead of 176/176`);
}
const a0Dialogues = dialogues.filter((dialogue) => dialogue.level === "A0");
if (a0Dialogues.length !== 16
  || a0Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 68
  || a0Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 35) {
  errors.push("A0 dialogue scope drifted from 16 complete dialogues, 68 lines, and 35 questions");
}
const a1Dialogues = dialogues.filter((dialogue) => dialogue.level === "A1");
if (a1Dialogues.length !== 36
  || a1Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 238
  || a1Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 89) {
  errors.push("A1 dialogue scope drifted from 36 complete dialogues, 238 lines, and 89 questions");
}
const a2Dialogues = dialogues.filter((dialogue) => dialogue.level === "A2");
if (a2Dialogues.length !== 38
  || a2Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 248
  || a2Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 93) {
  errors.push("A2 dialogue scope drifted from 38 complete dialogues, 248 lines, and 93 questions");
}
const b1Dialogues = dialogues.filter((dialogue) => dialogue.level === "B1");
if (b1Dialogues.length !== 37
  || b1Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 252
  || b1Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 91) {
  errors.push("B1 dialogue scope drifted from 37 complete dialogues, 252 lines, and 91 questions");
}
const b2Dialogues = dialogues.filter((dialogue) => dialogue.level === "B2");
if (b2Dialogues.length !== 49
  || b2Dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0) !== 332
  || b2Dialogues.reduce((sum, dialogue) => sum + dialogue.questions.length, 0) !== 116) {
  errors.push("B2 dialogue scope drifted from 49 complete dialogues, 332 lines, and 116 questions");
}

const ids = new Set(review01.entries.map((entry) => entry.id));
const corrected = review01.entries.filter((entry) => entry.decision === "corrected");
const confirmed = review01.entries.filter((entry) => entry.decision === "confirmed-current");
if (review01.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review01.batch !== "PA-038-01"
  || review01.reviewedAt !== "2026-11-04"
  || review01.entries.length !== 16
  || ids.size !== 16
  || [...expectedA0].some((id) => !ids.has(id))
  || corrected.length !== 16
  || confirmed.length !== 0
  || review01.entries.some((entry) => entry.level !== "A0" || !entry.rationale.trim())) {
  errors.push("PA-038-01: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review01.scope.includes("triage only")
  || !review01.scope.includes("not correction generators")
  || !review01.scope.includes("not independent")
  || !review01.scope.includes("CEFR")
  || !review01.scope.includes("exam sign-off")) {
  errors.push("PA-038-01: fixture must preserve triage and external-sign-off claim boundaries");
}

for (const entry of review01.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-01: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A0"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A0"
    || entry.current.level !== "A0"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed title, speaker, or bilingual line is empty`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim())) {
    errors.push(`${entry.id}: reviewed question identity, prompt, or explanation drifted`);
  }
  for (const question of entry.current.questions) {
    if ((question.type === "mc" || question.type === "truefalse")
      && (!Array.isArray(question.options) || !question.options.includes(String(question.answer)))) {
      errors.push(`${question.id}: answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: dictation segment is absent from the reviewed German lines`);
  }
}

const ids02 = new Set(review02.entries.map((entry) => entry.id));
const corrected02 = review02.entries.filter((entry) => entry.decision === "corrected");
const confirmed02 = review02.entries.filter((entry) => entry.decision === "confirmed-current");
if (review02.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review02.batch !== "PA-038-02"
  || review02.reviewedAt !== "2026-11-04"
  || review02.entries.length !== 36
  || ids02.size !== 36
  || [...expectedA1].some((id) => !ids02.has(id))
  || corrected02.length !== 36
  || confirmed02.length !== 0
  || review02.entries.some((entry) => entry.level !== "A1" || !entry.rationale.trim())) {
  errors.push("PA-038-02: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review02.scope.includes("all 238 line alignments")
  || !review02.scope.includes("all 89 questions")
  || !review02.scope.includes("triage only")
  || !review02.scope.includes("not correction generators")
  || !review02.scope.includes("not independent")
  || !review02.scope.includes("CEFR")
  || !review02.scope.includes("exam sign-off")) {
  errors.push("PA-038-02: fixture must preserve full-scope and external-sign-off claim boundaries");
}

for (const entry of review02.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-02: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A1"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A1"
    || entry.current.level !== "A1"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: A1 identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: A1 decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || !entry.current.cultural_theme?.trim()
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed A1 title, topic, speaker, or bilingual line is empty`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim())) {
    errors.push(`${entry.id}: reviewed A1 question identity, prompt, or explanation drifted`);
  }
  for (const questionItem of entry.current.questions) {
    if ((questionItem.type === "mc" || questionItem.type === "truefalse")
      && (!Array.isArray(questionItem.options) || !questionItem.options.includes(String(questionItem.answer)))) {
      errors.push(`${questionItem.id}: A1 answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: A1 dictation segment is absent from the reviewed German lines`);
  }
}

const ids03 = new Set(review03.entries.map((entry) => entry.id));
const corrected03 = review03.entries.filter((entry) => entry.decision === "corrected");
const confirmed03 = review03.entries.filter((entry) => entry.decision === "confirmed-current");
if (review03.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review03.batch !== "PA-038-03"
  || review03.reviewedAt !== "2026-11-04"
  || review03.entries.length !== 38
  || ids03.size !== 38
  || [...expectedA2].some((id) => !ids03.has(id))
  || corrected03.length !== 38
  || confirmed03.length !== 0
  || review03.entries.some((entry) => entry.level !== "A2" || !entry.rationale.trim())) {
  errors.push("PA-038-03: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review03.scope.includes("all 248 line alignments")
  || !review03.scope.includes("all 93 questions")
  || !review03.scope.includes("triage only")
  || !review03.scope.includes("not linguistic correction generators")
  || !review03.scope.includes("not independent")
  || !review03.scope.includes("CEFR")
  || !review03.scope.includes("Goethe")
  || !review03.scope.includes("telc")
  || !review03.scope.includes("exam sign-off")) {
  errors.push("PA-038-03: fixture must preserve full-scope, triage, and external-sign-off claim boundaries");
}

for (const entry of review03.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-03: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "A2"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "A2"
    || entry.current.level !== "A2"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: A2 identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: A2 decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || !entry.current.cultural_theme?.trim()
    || entry.current.cultural_note !== undefined
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed A2 title, topic, note cleanup, speaker, or bilingual line drifted`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim()
      || /اختر|أكمل|املأ/.test(question.promptAr ?? ""))) {
    errors.push(`${entry.id}: reviewed A2 question identity, semantic prompt, or explanation drifted`);
  }
  for (const questionItem of entry.current.questions) {
    if ((questionItem.type === "mc" || questionItem.type === "truefalse")
      && (!Array.isArray(questionItem.options) || !questionItem.options.includes(String(questionItem.answer)))) {
      errors.push(`${questionItem.id}: A2 answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: A2 dictation segment is absent from the reviewed German lines`);
  }
}

const ids04 = new Set(review04.entries.map((entry) => entry.id));
const corrected04 = review04.entries.filter((entry) => entry.decision === "corrected");
const confirmed04 = review04.entries.filter((entry) => entry.decision === "confirmed-current");
if (review04.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review04.batch !== "PA-038-04"
  || review04.reviewedAt !== "2026-11-04"
  || review04.entries.length !== 37
  || ids04.size !== 37
  || [...expectedB1].some((id) => !ids04.has(id))
  || corrected04.length !== 37
  || confirmed04.length !== 0
  || review04.entries.some((entry) => entry.level !== "B1" || !entry.rationale.trim())) {
  errors.push("PA-038-04: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review04.scope.includes("all 252 line alignments")
  || !review04.scope.includes("all 91 questions")
  || !review04.scope.includes("triage only")
  || !review04.scope.includes("not linguistic correction generators")
  || !review04.scope.includes("not independent")
  || !review04.scope.includes("legal")
  || !review04.scope.includes("medical")
  || !review04.scope.includes("audio")
  || !review04.scope.includes("CEFR")
  || !review04.scope.includes("Goethe")
  || !review04.scope.includes("telc")
  || !review04.scope.includes("exam sign-off")) {
  errors.push("PA-038-04: fixture must preserve full-scope, triage, and external-sign-off claim boundaries");
}

for (const entry of review04.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-04: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "B1"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "B1"
    || entry.current.level !== "B1"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: B1 identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: B1 decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || !entry.current.cultural_theme?.trim()
    || entry.current.cultural_note !== undefined
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed B1 title, topic, note cleanup, speaker, or bilingual line drifted`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim()
      || /اختر|أكمل|املأ/.test(question.promptAr ?? ""))) {
    errors.push(`${entry.id}: reviewed B1 question identity, semantic prompt, or explanation drifted`);
  }
  for (const questionItem of entry.current.questions) {
    if ((questionItem.type === "mc" || questionItem.type === "truefalse")
      && (!Array.isArray(questionItem.options) || !questionItem.options.includes(String(questionItem.answer)))) {
      errors.push(`${questionItem.id}: B1 answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: B1 dictation segment is absent from the reviewed German lines`);
  }
}

const ids05 = new Set(review05.entries.map((entry) => entry.id));
const corrected05 = review05.entries.filter((entry) => entry.decision === "corrected");
const confirmed05 = review05.entries.filter((entry) => entry.decision === "confirmed-current");
if (review05.schema !== "wegb2-reviewed-dialogue-decision-batch-v1"
  || review05.batch !== "PA-038-05"
  || review05.reviewedAt !== "2026-11-04"
  || review05.entries.length !== 49
  || ids05.size !== 49
  || [...expectedB2].some((id) => !ids05.has(id))
  || corrected05.length !== 49
  || confirmed05.length !== 0
  || review05.entries.some((entry) => entry.level !== "B2" || !entry.rationale.trim())) {
  errors.push("PA-038-05: unexpected fixture scope, counts, levels, or decision metadata");
}
if (!review05.scope.includes("all 332 German/Arabic line alignments")
  || !review05.scope.includes("all 116 questions")
  || !review05.scope.includes("triage only")
  || !review05.scope.includes("not linguistic correction generators")
  || !review05.scope.includes("not independent")
  || !review05.scope.includes("legal")
  || !review05.scope.includes("medical")
  || !review05.scope.includes("audio")
  || !review05.scope.includes("CEFR")
  || !review05.scope.includes("Goethe")
  || !review05.scope.includes("telc")
  || !review05.scope.includes("exam sign-off")) {
  errors.push("PA-038-05: fixture must preserve full-scope, triage, and external-sign-off claim boundaries");
}

for (const entry of review05.entries) {
  const actual = byId.get(entry.id);
  if (!actual) {
    errors.push(`PA-038-05: missing dialogue ${entry.id}`);
    continue;
  }
  if (actual.id !== entry.id
    || actual.level !== "B2"
    || entry.previous.id !== entry.id
    || entry.current.id !== entry.id
    || entry.previous.level !== "B2"
    || entry.current.level !== "B2"
    || JSON.stringify(actual) !== JSON.stringify(entry.current)) {
    errors.push(`${entry.id}: B2 identity, level, or reviewed full-dialogue content drifted`);
  }
  const changed = JSON.stringify(entry.previous) !== JSON.stringify(entry.current);
  if ((entry.decision === "corrected" && !changed)
    || (entry.decision === "confirmed-current" && changed)) {
    errors.push(`${entry.id}: B2 decision does not match its bounded transition`);
  }
  if (!entry.current.titleDe.trim() || !entry.current.titleAr.trim()
    || !entry.current.cultural_theme?.trim()
    || entry.current.cultural_note !== undefined
    || entry.current.lines.some((line) => !line.who.trim() || !line.de.trim() || !line.ar.trim())) {
    errors.push(`${entry.id}: reviewed B2 title, topic, note cleanup, speaker, or bilingual line drifted`);
  }
  const questionIds = entry.current.questions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length
    || entry.current.questions.some((question) => !question.promptDe.trim()
      || !String(question.promptAr ?? "").trim()
      || !String(question.explanationAr ?? "").trim()
      || /اختر|أكمل|املأ/.test(question.promptAr ?? ""))) {
    errors.push(`${entry.id}: reviewed B2 question identity, semantic prompt, or explanation drifted`);
  }
  for (const questionItem of entry.current.questions) {
    if ((questionItem.type === "mc" || questionItem.type === "truefalse")
      && (!Array.isArray(questionItem.options) || !questionItem.options.includes(String(questionItem.answer)))) {
      errors.push(`${questionItem.id}: B2 answer is absent from its options`);
    }
  }
  if ((entry.current.dictation ?? []).some((sentence) =>
    !entry.current.lines.some((line) => line.de.includes(sentence)))) {
    errors.push(`${entry.id}: B2 dictation segment is absent from the reviewed German lines`);
  }
}

const dialogue = (id: string): Dialogue => {
  const value = byId.get(id);
  if (!value) throw new Error(`missing dialogue ${id}`);
  return value;
};
const question = (dialogueId: string, questionId: string): DialogueQuestion | undefined =>
  dialogue(dialogueId).questions.find((item) => item.id === questionId);

if (!question("d-a0-01", "d-a0-01-q1")?.explanationAr?.includes("Ich heiße Ali")
  || dialogue("d-a0-02").lines[0].ar !== "كم يساوي واحد زائد اثنين؟"
  || dialogue("d-a0-03").titleDe !== "Einen Namen buchstabieren"
  || question("d-a0-04", "d-a0-04-q1")?.promptAr !== "من أين تأتي ليلى؟") {
  errors.push("A0 first set: evidence, Arabic arithmetic/origin wording, or spelling-title decisions regressed");
}
if (dialogue("d-a0-05").lines[2].de !== "Buchstabieren Sie den Namen bitte."
  || question("d-a0-06", "d-a0-06-q2")?.answer !== "Ein Glas Wasser"
  || dialogue("d-a0-08").cultural_theme !== "Farewells"
  || dialogue("d-a0-09").lines[1].ar !== "ثمنه 2.50 يورو.") {
  errors.push("A0 daily-life set: spelling request, extra-order ambiguity, farewell metadata, or price translation regressed");
}
if (dialogue("d-a0-11").lines[4].de !== "Gut, ich untersuche Sie jetzt."
  || dialogue("d-a0-12").cultural_theme !== "Family"
  || dialogue("d-a0-13").cultural_theme !== "Asking for directions"
  || question("d-a0-ht01", "d-a0-ht01-q2")?.promptAr !== "ما رقم المسار؟"
  || dialogue("d-a0-ht02").cultural_theme !== "Shopping and prices"
  || dialogue("d-a0-ht03").lines[0].ar !== "مرحباً! ماذا ترغب؟") {
  errors.push("A0 final set: medical boundary, family/directions metadata, railway terminology, shopping topic, or café address regressed");
}

if (dialogue("d-a1-06").lines[1].de !== "Hier, bitte. Fährt dieser Bus zum Zentrum?"
  || dialogue("d-a1-10").lines[7].de !== "Nein danke, dann bin ich bestimmt satt."
  || question("d-a1-11", "d-a1-11-q2")?.answer !== "Sie untersucht Frau Nasri."
  || dialogue("d-a1-13").lines[4].de !== "Soll ich einen Sitzplatz reservieren?"
  || question("d-a1-14", "d-a1-14-q2")?.answer !== "von Größe und Gewicht") {
  errors.push("A1 first half: bus deixis, idiomatic sequence, medical boundary, reservation wording, or stable postage decision regressed");
}
if (dialogue("d-a1-18").lines[1].de !== "Ich bin Tunesier. Meine Heimat ist Tunesien; ich komme aus Sfax."
  || dialogue("d-a1-20").lines[5].de !== "Gestern, am Montag. Das war kurz, nur eine Stunde."
  || !dialogue("d-a1-23").lines[3].de.includes("voraussichtlich")
  || !dialogue("d-a1-25").lines[5].de.includes("an diesem Automaten")
  || !dialogue("d-a1-26").lines[3].de.startsWith("Hier ist")) {
  errors.push("A1 second half: personal-information alignment, chronology, emergency estimate, ATM scope, or local weather boundary regressed");
}
if (!dialogue("d-a1-ht01").lines[1].de.includes("116 117")
  || !dialogue("d-a1-ht01").lines[1].de.includes("112")
  || dialogue("d-a1-ht03").lines[0].ar !== "انتباه، المسار 5! قطار ICE 621 إلى فرانكفورت سينطلق بعد 5 دقائق. العربات 15–21 في الجزء الخلفي. انتبهوا عند دخول القطار."
  || dialogue("hoer-a1-02").lines[0].de.startsWith("Liebe Kunden!")
  || a1Dialogues.some((item) => item.cultural_note !== undefined)
  || a1Dialogues.some((item) => item.questions.some((itemQuestion) => /اختر|أكمل|املأ/.test(itemQuestion.promptAr ?? "")))) {
  errors.push("A1 final set: emergency numbers, Arabic rail terminology, inclusive address, topic cleanup, or semantic Arabic prompts regressed");
}

if (!dialogue("d-a2-03").lines[4].de.startsWith("Ich untersuche Sie jetzt.")
  || !dialogue("d-a2-03").lines[6].de.includes("medizinische Hilfe")
  || !dialogue("d-a2-08").lines[4].de.includes("Allergien")
  || !dialogue("d-a2-08").lines[4].de.includes("andere Medikamente")
  || !dialogue("d-a2-10").lines[5].de.includes("Mieterberatung")
  || dialogue("d-a2-14").lines[7].de !== "Trinkgeld ist freiwillig. Die Höhe entscheiden die Gäste selbst."
  || !dialogue("d-a2-16").lines[2].de.includes("Sicherheitsschuhe")
  || !dialogue("d-a2-16").lines[6].de.includes("Notfallplan")
  || !dialogue("d-a2-21").lines[4].de.includes("ärztlich untersuchen lassen")) {
  errors.push("A2 safety set: examination-first, pharmacy screening, housing referral, voluntary tipping, workplace safety, or injury-assessment boundary regressed");
}
if (!dialogue("d-a2-18").lines[4].de.includes("voraussichtlich")
  || !dialogue("d-a2-19").lines[6].de.includes("aktuellen Abholregel")
  || !dialogue("d-a2-22").lines[0].de.includes("Jahresabrechnung für Strom")
  || dialogue("d-a2-22").lines[7].who !== "Omar"
  || !dialogue("d-a2-25").lines[6].de.includes("aktuellen Bedingungen")
  || !dialogue("d-a2-26").lines[6].de.startsWith("Bei uns gilt für diese Hose")
  || !dialogue("dlg-a2-krankenversicherung").lines[5].de.includes("aktuell geltenden Regeln")
  || !dialogue("dlg-a2-buergeramt").lines[8].de.includes("aktuelle Liste")) {
  errors.push("A2 variable-rule set: deposit, identity collection, electricity bill, ticket review, returns, insurance, or civic-document scope regressed");
}
if (!dialogue("hoer-a2-01").lines[0].de.includes("116 117")
  || !dialogue("hoer-a2-01").lines[0].de.includes("112")
  || !dialogue("hoer-a2-01").lines[0].de.includes("nicht lebensbedrohlichen")
  || dialogue("d-a2-ht03").situationDe !== "Fiktive Radiomeldung für eine Hörübung"
  || !dialogue("d-a2-ht03").lines[0].de.startsWith("Beispielmeldung für diese Hörübung")
  || /0221-4711/.test(dialogue("d-a2-ht02").lines[0].de)
  || question("d-a2-14", "d-a2-14-q2")?.answer !== "drei Übernachtungen"
  || JSON.stringify(question("d-a2-31", "d-a2-31-q2")?.answer) !== JSON.stringify(["innerhalb"])
  || a2Dialogues.some((item) => item.cultural_note !== undefined)
  || a2Dialogues.some((item) => item.questions.some((itemQuestion) => /اختر|أكمل|املأ/.test(itemQuestion.promptAr ?? "")))) {
  errors.push("A2 final set: emergency distinction, fictional bulletin, phone privacy, stay length, gap casing, metadata cleanup, or semantic Arabic prompts regressed");
}

if (!dialogue("d-b1-06").lines[1].de.includes("aktuelle Unterlagenliste")
  || !dialogue("d-b1-07").lines[4].de.includes("medizinische Hilfe")
  || !dialogue("d-b1-12").lines[3].de.startsWith("Die Symptome könnten")
  || !dialogue("d-b1-12").lines[7].de.includes("ohne ärztliche Anweisung")
  || !dialogue("d-b1-12").lines[8].de.includes("Atemnot")
  || !dialogue("d-b1-15").lines[5].de.includes("aktuellen Preisverzeichnis")
  || !dialogue("d-b1-16").lines[1].de.includes("aktuell geltenden Fahrgastrechten")) {
  errors.push("B1 safety set: current civic documents, medical uncertainty and escalation, antibiotic boundary, banking review, or passenger-rights scope regressed");
}
if (!dialogue("d-b1-19").lines[7].de.includes("aktuellen Verfahrensregeln")
  || !dialogue("d-b1-20").lines[3].de.includes("Allergien")
  || !dialogue("d-b1-20").lines[7].de.includes("112")
  || !dialogue("d-b1-20").lines[7].de.includes("116 117")
  || !dialogue("d-b1-21").lines[1].de.includes("Für Ihren Vertrag")
  || !dialogue("d-b1-23").lines[5].de.includes("dieses Studiengangs")
  || !dialogue("d-b1-25").lines[3].de.includes("Wohnungsgeber")
  || !dialogue("d-b1-26").lines[7].de.includes("aktuellen Angebotsbedingungen")
  || !dialogue("d-b1-27").lines[3].de.includes("in der Regel nicht ab")) {
  errors.push("B1 variable-rule set: immigration, pharmacy emergency screening, contract, study, registration, energy, or driving-document boundaries regressed");
}
if (dialogue("d-b1-17").titleDe !== "Einen Lesetag in der Schule planen"
  || dialogue("d-b1-24").titleDe !== "Eine Fundsache auf dem Polizeirevier"
  || dialogue("d-b1-ht01").situationDe !== "Fiktive Radiomeldung für eine Hörübung"
  || dialogue("d-b1-ht02").situationDe !== "Fiktive Zugansage für eine Hörübung"
  || !dialogue("d-b1-ht01").lines[0].de.startsWith("Beispielmeldung für diese Hörübung")
  || !dialogue("d-b1-ht02").lines[0].de.startsWith("Beispielansage für diese Hörübung")
  || question("d-b1-32", "d-b1-32-q1")?.answer !== "dass er regelmäßig etwa fünfzehn Minuten laut liest"
  || b1Dialogues.some((item) => item.cultural_note !== undefined)
  || b1Dialogues.some((item) => item.questions.some((itemQuestion) => /اختر|أكمل|املأ/.test(itemQuestion.promptAr ?? "")))) {
  errors.push("B1 final set: title-content alignment, fictional bulletins, regular-practice inference, metadata cleanup, or semantic Arabic prompts regressed");
}

if (!dialogue("d-b2-11").lines[3].de.includes("Mieterberatung")
  || !dialogue("d-b2-11").lines[7].de.includes("keine Rechtsberatung")
  || !dialogue("d-b2-12").lines[1].de.includes("offiziellen Anerkennungsportal")
  || !dialogue("d-b2-12").lines[5].de.includes("Antrag allein ist keine Erlaubnis")
  || !dialogue("d-b2-13").lines[1].de.includes("keine Frist ableiten")
  || !dialogue("d-b2-14").lines[5].de.includes("Rechtsbehelfsbelehrung")
  || !dialogue("d-b2-15").lines[3].de.includes("Vertrag und Prüfung")) {
  errors.push("B2 public-service set: housing, recognition, family-benefit, tax, or insurance claim boundaries regressed");
}
if (!dialogue("d-b2-17").lines[3].de.includes("Wirksamkeit")
  || !dialogue("d-b2-18").lines[5].de.includes("Aufnahmebestätigung")
  || !dialogue("d-b2-20").lines[1].de.startsWith("Nein.")
  || !dialogue("d-b2-20").lines[7].de.includes("Rechtsbehelfsbelehrung")
  || !dialogue("d-b2-21").lines[3].de.includes("nicht automatisch erlassen")
  || !dialogue("d-b2-22").lines[1].de.includes("112")
  || !dialogue("d-b2-22").lines[3].de.includes("nur aus, wenn die Voraussetzungen erfüllt sind")) {
  errors.push("B2 employment, insurance, care, finance, or medical safety boundary regressed");
}
if (!dialogue("d-b2-23").lines[1].de.includes("Tarifvertrag")
  || !dialogue("d-b2-24").lines[7].de.includes("nicht erfunden")
  || !dialogue("d-b2-25").lines[1].de.includes("nicht, bevor ihre Sicherheit fachlich geklärt ist")
  || !dialogue("d-b2-26").lines[1].de.includes("aktuelle Promotionsordnung")
  || !dialogue("d-b2-27").lines[1].de.includes("Bundesland und Streitgegenstand")
  || !dialogue("dlg-b2-mietvertrag").lines[4].de.includes("im Einzelfall geprüft")
  || !dialogue("hoer-b2-01").lines[0].de.includes("konkreten Beruf")) {
  errors.push("B2 variable-rule set: labour, exam, product-safety, doctoral, conciliation, tenancy, or employment scope regressed");
}
if (dialogue("d-b2-ht01").situationDe !== "Fiktive Radiomeldung für eine Hörübung"
  || dialogue("d-b2-ht02").situationDe !== "Fiktive Anrufbeantworteransage für eine Hörübung"
  || !dialogue("d-b2-ht01").lines[0].de.startsWith("Beispielmeldung für diese Hörübung")
  || !dialogue("d-b2-ht02").lines[0].de.startsWith("Beispielansage für diese Hörübung")
  || dialogue("d-b2-40").lines.length !== 7
  || dialogue("d-b2-49").lines.length !== 7
  || b2Dialogues.some((item) => item.cultural_note !== undefined)
  || b2Dialogues.some((item) => item.questions.some((itemQuestion) => /اختر|أكمل|املأ/.test(itemQuestion.promptAr ?? "")))) {
  errors.push("B2 final set: fictional bulletins, completed closing turns, metadata cleanup, or semantic Arabic prompts regressed");
}

const reviewedCurrent = JSON.stringify([
  ...review01.entries, ...review02.entries, ...review03.entries, ...review04.entries,
  ...review05.entries,
].map((entry) => entry.current));
for (const stale of [
  "German greetings typically include handshakes",
  "Weihnachten - Christmas traditions",
  "Umwelt - Environmental awareness",
  "Bierbrauerei - German beer culture",
  "Oktoberfest - German beer festival",
  "الإجابة الصحيحة محدَّدة بالأزرار",
  "Gut, trinken Sie viel Wasser und ruhen Sie sich aus.",
  "Nehmen Sie die Medizin dreimal am Tag.",
  "ein bis zwei Euro sind üblich",
  "Rückfragen unter 0221-4711",
  "Es gibt zurzeit einen Stau von acht Kilometern",
  "Bei sechzig Minuten stehen Ihnen fünfundzwanzig Prozent des Preises zu.",
  "Die neue Karte kommt in vierzehn Tagen.",
  "Bei zweitem Versäumnis: Ablehnung, neue Gebühr.",
  "Sechs Monate Aufbewahrung nach Anzeige, dann Versteigerung",
  "Nie — die Grundversorgung springt ohne eine Sekunde Pause ein.",
  "Vierzehn Tage Sperre bis zum nächsten Versuch",
  "Ansonsten kostet es 4,90 Euro im Monat.",
  "Sie bekommen die Karte und die PIN in etwa einer Woche per Post.",
  "Kappungsgrenze von fünfzehn Prozent in drei Jahren",
  "höchstens 16 Monate Praxis",
  "Vier Monate gleichzeitig plus Bonus",
  "Mit Beratung verlängert sich die Frist automatisch bis April nächsten Jahres.",
  "Hausrat zahlt Trocknung und Hotel bis zur Wiederbewohnbarkeit",
  "Rückzahlungsklausel bei Wechsel unter 24 Monaten",
  "die Medikamente laufen nahtlos über die elektronische Verordnung",
  "Dann rechne ich mit Grad zwei bis drei",
  "Dringlichkeitscode C auf dem Schein",
  "Das Arbeitszeitkonto muss monatlich ausgeglichen werden",
  "Wiederholungen nur bei Nichtbestehen, maximal zweimal",
  "Rückerstattung plus 10-Euro-Gutschein",
  "Wir brauchen eine neue Erstprüferin mit gleicher Qualifikation, binnen sechs Wochen.",
  "bei Verstoß droht ein Zwangsgeld bis 250.000 Euro",
  "Einige Arbeitgeber fordern mindestens B2, in bestimmten Bereichen sogar C1.",
]) {
  if (reviewedCurrent.includes(stale)) {
    errors.push(`PA-038 stale, generic, unrelated, or unbounded content returned: ${stale}`);
  }
}

if (errors.length) {
  console.error("❌ Dialogue content review audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "✅ Dialogue content review: all 176 bounded A0–B2 full-dialogue decisions match (176 corrected, 0 confirmed-current; 1138 lines and 424 questions).",
);
console.log(
  "ℹ️ This gate protects reviewed A0–B2 titles, situations, speakers, German and Arabic lines, questions, options, answers, explanations, dictation, metadata, ambiguity, register, and claim boundaries; independent linguistic/translation, cultural, legal, medical, pharmacy, emergency-services, audio, CEFR, Goethe/telc, and exam sign-off remain outside these batches.",
);
