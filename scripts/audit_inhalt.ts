/* جرد وتدقيق المحتوى — يطبع الأخطاء الفعلية لا التقديرات */
import { readFileSync, existsSync } from "fs";
import { grammarMap, sentences, texts, dialogues, writingTasks, alleVokabeln, fehlerList, pakete, eselsbruecken, muendlich, vortrag, verben, szenarien } from "../lib/content";
import { grader } from "../lib/grader";
import { buildDay } from "../lib/plan";
import { emptyProgress, TOTAL_DAYS } from "../lib/types";
import type { Exercise } from "../lib/types";

const F: Record<string, string[]> = {};
const add = (k: string, m: string) => (F[k] ??= []).push(m);
const AR = /[\u0600-\u06FF]/, DE_ONLY_BAD = /[\u0600-\u06FF]/;

function pruefeExercise(e: Exercise, wo: string) {
  if (!e.id) add("exercise:id", wo);
  if (e.type === "mc") {
    if (!e.options || e.options.length < 2) add("mc:options", `${wo} ${e.id}`);
    const a = Array.isArray(e.answer) ? e.answer[0] : e.answer;
    if (e.options && !e.options.includes(a)) add("mc:answer∉options", `${wo} ${e.id} «${a}»`);
    if (e.options && new Set(e.options).size !== e.options.length) add("mc:dupOptions", `${wo} ${e.id}`);
  }
  if (e.type === "fill" || e.type === "translate" || e.type === "umformung" || e.type === "dictation") {
    const a = Array.isArray(e.answer) ? e.answer[0] : e.answer;
    if (!a || !a.trim()) add("answer:leer", `${wo} ${e.id}`);
    const r = grader.grade(e, a);
    if (!r.correct) add("grader:modelRejected", `${wo} ${e.id} → ${r.feedbackAr}`);
    if (e.type === "fill" && !/_{3,}/.test(e.promptDe)) add("fill:keineLücke", `${wo} ${e.id} «${e.promptDe}»`);
  }
  if (!e.explanationAr || !AR.test(e.explanationAr)) add("explanationAr:fehlt", `${wo} ${e.id}`);
  if (e.promptDe && e.type !== "dictation" && e.type !== "translate" && /[\u0600-\u06FF]/.test(e.promptDe) && e.type !== "fill") add("promptDe:arabisch", `${wo} ${e.id}`);
  for (const s of [e.promptDe, ...(e.options ?? [])]) if (s && /\s{2,}|\s[.!?]|\s,(?! \/)/.test(s)) add("typo:spacing", `${wo} ${e.id} «${s}»`);
}

/* grammar */
const ids = new Set<string>();
for (const t of Object.values(grammarMap)) {
  if (!t.titleDe || !t.titleAr || !t.summaryAr) add("grammar:kopf", t.id);
  if (!t.examples?.length) add("grammar:keineBeispiele", t.id);
  if (!t.pitfalls?.length) add("grammar:keineFallen", t.id);
  for (const r of t.rules) { if (DE_ONLY_BAD.test(r.de)) add("grammar:rule.de arabisch", `${t.id} «${r.de}»`); if (!AR.test(r.ar)) add("grammar:rule.ar", `${t.id} «${r.de}»`); }
  for (const ex of t.examples) { if (AR.test(ex.de)) add("grammar:example.de arabisch", `${t.id} «${ex.de}»`); if (!/[.!?…"“”»]$/.test(ex.de.trim())) add("grammar:example ohne Satzzeichen", `${t.id} «${ex.de}»`); }
  for (const e of t.exercises) { if (ids.has(e.id)) add("exercise:dupId", e.id); ids.add(e.id); pruefeExercise(e, t.id); }
  if (t.exercises.length < 5) add("grammar:wenigeÜbungen(<5)", `${t.id} (${t.exercises.length})`);
}
/* texts / dialogues */
const audioText = JSON.parse(readFileSync("content/hoeren-audio.json", "utf8"));
const audioDlg = JSON.parse(readFileSync("content/dialog-audio.json", "utf8"));
for (const t of texts) {
  if (!t.questions?.length) add("text:keineFragen", t.id);
  for (const q of t.questions ?? []) pruefeExercise(q, t.id);
  const wc = t.de.split(/\s+/).length;
  const soll = { A1: [40, 140], A2: [70, 200], B1: [120, 320], B2: [160, 450] }[t.level]!;
  if (wc < soll[0] || wc > soll[1]) add("text:länge", `${t.id} ${t.level} ${wc} Wörter (soll ${soll[0]}–${soll[1]})`);
}
for (const d of dialogues) {
  if (!d.questions?.length) add("dialog:keineFragen", d.id);
  for (const q of d.questions ?? []) pruefeExercise(q, d.id);
  if (d.lines.length < 4) add("dialog:kurz", `${d.id} ${d.lines.length} Zeilen`);
  for (const l of d.lines) if (AR.test(l.de) || !l.ar) add("dialog:zeile", `${d.id} «${l.de}»`);
}
/* audio — الصيغة {generated,count,einsaetze:[{id,file,…}]} */
type Einsatz = { id: string; file: string };
function audioCheck(json: { einsaetze?: Einsatz[] }, k: string): Set<string> {
  const ids = new Set<string>();
  for (const e of json.einsaetze ?? []) {
    ids.add(e.id); ids.add(e.id.replace(/-\d+$/, ""));
    const p = "public" + (e.file.startsWith("/") ? e.file : "/" + e.file);
    if (!existsSync(p)) add(`${k}:audio-datei fehlt`, `${e.id} → ${e.file}`);
  }
  return ids;
}
const idsT = audioCheck(audioText, "text"), idsD = audioCheck(audioDlg, "dialog");
const textsOhneAudio = texts.filter((t) => !idsT.has(t.id) && ![...idsT].some((x) => x.startsWith(t.id))).map((t) => t.id);
const dlgOhneAudio = dialogues.filter((d) => !idsD.has(d.id) && ![...idsD].some((x) => x.startsWith(d.id))).map((d) => d.id);
if (textsOhneAudio.length) add("text:ohneAudio", textsOhneAudio.join(" "));
if (dlgOhneAudio.length) add("dialog:ohneAudio", dlgOhneAudio.join(" "));
/* vocab */
const vIds = new Set<string>(); let ohneBeispiel = 0, ohneArt = 0, ohnePos = 0, dupDe = new Map<string, number>();
for (const c of alleVokabeln) {
  if (vIds.has(c.id)) add("vocab:dupId", c.id); vIds.add(c.id);
  if (!c.de || !c.ar) add("vocab:leer", c.id);
  if (AR.test(c.de)) add("vocab:de arabisch", `${c.id} «${c.de}»`);
  if (!c.exampleDe) ohneBeispiel++;
  if (!(c as { pos?: string }).pos) ohnePos++;
  const m = /^(der|die|das) /.exec(c.de); if (!m && /^[A-ZÄÖÜ][a-zäöüß]+$/.test(c.de)) ohneArt++;
  dupDe.set(c.de.toLowerCase(), (dupDe.get(c.de.toLowerCase()) ?? 0) + 1);
  if (c.exampleDe && !c.exampleDe.toLowerCase().includes(c.de.replace(/^(der|die|das) /, "").toLowerCase().slice(0, 4))) add("vocab:beispiel ohne Stichwort", `${c.id} «${c.de}» / «${c.exampleDe}»`);
}
const dups = [...dupDe.entries()].filter(([, n]) => n > 1);
add("vocab:stat", `${alleVokabeln.length} Karten · ohne exampleDe ${ohneBeispiel} · ohne pos ${ohnePos} · Nomen ohne Artikel ${ohneArt} · doppelte de ${dups.length} (z.B. ${dups.slice(0, 8).map(([d, n]) => d + "×" + n).join(", ")})`);
/* sentences */
for (const s of sentences) { if (AR.test(s.de) || !AR.test(s.ar)) add("satz:sprache", s.id); if (!/[.!?]$/.test(s.de.trim())) add("satz:ohneSatzzeichen", `${s.id} «${s.de}»`); }
/* eselsbruecken */
for (const b of eselsbruecken) {
  for (const g of b.gramIds) if (!grammarMap[g]) add("brücke:gramId tot", `${b.id} → ${g}`);
  for (const z of b.zeilen) if (AR.test(z.de) || z.de.includes("|")) add("brücke:de", `${b.id} «${z.de}»`);
}
/* writing */
for (const w of writingTasks) { const x = w as unknown as Record<string, unknown>; if (!x.promptDe && !x.aufgabeDe && !x.titleDe) add("writing:kopf", w.id); }
/* plan: alle Tage bauen, Referenzen prüfen */
const { getDeck, getText, getDialogue, getWriting, getSatz } = require("../lib/content") as typeof import("../lib/content");
const genutzt = { text: new Set<string>(), dialog: new Set<string>(), deck: new Set<string>(), topic: new Set<string>(), write: new Set<string>() };
let minGesamt = 0; const proTag: number[] = [];
for (let d = 1; d <= TOTAL_DAYS; d++) {
  let p; try { p = buildDay(d, emptyProgress); } catch (e) { add("plan:buildDay wirft", `Tag ${d}: ${(e as Error).message}`); continue; }
  let m = 0;
  for (const t of p.tasks) {
    m += t.minutes;
    if (t.topicId) { if (!grammarMap[t.topicId]) add("plan:topic tot", `Tag ${d} ${t.topicId}`); genutzt.topic.add(t.topicId); }
    if (t.deckId) { if (!getDeck(t.deckId)) add("plan:deck tot", `Tag ${d} ${t.deckId}`); genutzt.deck.add(t.deckId); }
    if (t.textId) { if (!getText(t.textId)) add("plan:text tot", `Tag ${d} ${t.textId}`); genutzt.text.add(t.textId); }
    if (t.dialogueId) { if (!getDialogue(t.dialogueId)) add("plan:dialog tot", `Tag ${d} ${t.dialogueId}`); genutzt.dialog.add(t.dialogueId); }
    if (t.writeId) { if (!getWriting(t.writeId)) add("plan:write tot", `Tag ${d} ${t.writeId}`); genutzt.write.add(t.writeId); }
    for (const s of t.sentenceIds ?? []) if (!getSatz(s)) add("plan:satz tot", `Tag ${d} ${s}`);
    if (t.quiz) for (const q of t.quiz) pruefeExercise(q, `Tag${d}:${t.kind}`);
    if (t.minutes <= 0) add("plan:minuten≤0", `Tag ${d} ${t.id}`);
  }
  proTag.push(m); minGesamt += m;
  if (m > 200) add("plan:Tag>200min", `Tag ${d}: ${m}`);
}
add("plan:stat", `Ø ${(minGesamt / TOTAL_DAYS).toFixed(0)} min/Tag · max ${Math.max(...proTag)} · min ${Math.min(...proTag)}`);
add("abdeckung:texte ungenutzt", texts.filter((t) => !genutzt.text.has(t.id)).map((t) => t.id).join(" ") || "—");
add("abdeckung:dialoge ungenutzt", dialogues.filter((d) => !genutzt.dialog.has(d.id)).map((d) => d.id).join(" ") || "—");
add("abdeckung:writing ungenutzt", writingTasks.filter((w) => !genutzt.write.has(w.id)).map((w) => w.id).join(" ") || "—");
add("abdeckung:decks ungenutzt", pakete.filter((p) => !genutzt.deck.has(p.id)).map((p) => p.id).join(" ") || "—");
add("abdeckung:topics ungenutzt", Object.keys(grammarMap).filter((g) => !genutzt.topic.has(g)).join(" ") || "—");
/* Ausgabe */
const keys = Object.keys(F).sort();
for (const k of keys) {
  const v = F[k];
  console.log(`\n### ${k} (${v.length})`);
  for (const m of v.slice(0, 12)) console.log("  - " + m);
  if (v.length > 12) console.log(`  … +${v.length - 12}`);
}
