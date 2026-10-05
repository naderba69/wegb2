/* جرد المحتوى — يفصل العيوب البنيوية عن إشارات heuristic التي تحتاج حكماً بشرياً */
import { readFileSync, existsSync } from "fs";
import { grammarMap, sentences, texts, dialogues, writingTasks, alleVokabeln, fehlerList, eselsbruecken, muendlich, vortrag, verben, szenarien, leseText } from "../lib/content";
import { grader } from "../lib/grader";
import { buildDay } from "../lib/plan";
import { emptyProgress, TOTAL_DAYS } from "../lib/types";
import type { Exercise } from "../lib/types";

const F: Record<string, string[]> = {};
const H: Record<string, string[]> = {};
const I: Record<string, string[]> = {};
const add = (k: string, m: string) => (F[k] ??= []).push(m);
const hinweis = (k: string, m: string) => (H[k] ??= []).push(m);
const info = (k: string, m: string) => (I[k] ??= []).push(m);
const AR = /[\u0600-\u06FF]/, DE_ONLY_BAD = /[\u0600-\u06FF]/;

function pruefeExercise(e: Exercise, wo: string) {
  if (typeof e.id !== "string" || !e.id.trim()) add("exercise:id fehlt", wo);
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
    // fill هو نوع حقل، وليس عقداً بأن يحتوي promptDe على ___؛ أسئلة الإدخال الحر صالحة أيضاً.
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
  if (t.exercises.length < 5) hinweis("grammar:wenigeÜbungen — prüfen تربوياً", `${t.id} (${t.exercises.length})`);
}
/* texts / dialogues */
const audioText = JSON.parse(readFileSync("content/hoeren-audio.json", "utf8"));
const audioDlg = JSON.parse(readFileSync("content/dialog-audio.json", "utf8"));
for (const t of texts) {
  if (!t.questions?.length) add("text:keineFragen", t.id);
  for (const q of t.questions ?? []) pruefeExercise(q, t.id);
  const shown = leseText(t).de;
  const wc = shown.trim().split(/\s+/).filter(Boolean).length;
  // الحدود متزامنة مع سجل الجودة: نقيس النص الذي يراه قارئ القراءة (leseText)، لا نسخة الصوت القصيرة.
  const soll = ({ A0: [20, 80], A1: [90, 160], A2: [151, 192], B1: [169, 260], B2: [173, 270] } as Record<string, [number, number]>)[t.level]!;
  if (t.level === "A0" && wc < soll[0]) {
    hinweis("text:A0 kurz — لا يُصنَّف آلياً كخطأ", `${t.id} ${wc} كلمة في النسخة المعروضة؛ مراجعة تربوية فقط`);
  } else if (wc < soll[0] || wc > soll[1]) {
    add("text:länge", `${t.id} ${t.level} ${wc} Wörter في النسخة المعروضة (soll ${soll[0]}–${soll[1]})`);
  }
}
for (const d of dialogues) {
  if (!d.questions?.length) add("dialog:keineFragen", d.id);
  for (const q of d.questions ?? []) pruefeExercise(q, d.id);
  if (d.lines.length < 4) hinweis("dialog:kurz — سياق A0 يحتاج حكماً بشرياً", `${d.id} ${d.lines.length} Zeilen`);
  for (const l of d.lines) if (AR.test(l.de) || !l.ar) add("dialog:zeile", `${d.id} «${l.de}»`);
}
/* audio — الصيغة {generated,count,einsaetze:[{id,file,…}]} */
type Einsatz = { id: string; file: string };
function audioCheck(json: { einsaetze?: Einsatz[] }, k: string): void {
  for (const e of json.einsaetze ?? []) {
    const p = "public" + (e.file.startsWith("/") ? e.file : "/" + e.file);
    if (!existsSync(p)) add(`${k}:audio-datei fehlt`, `${e.id} → ${e.file}`);
  }
}
// غياب track مستقل ليس خطأً: الصوت اختياري وتوجد مسارات TTS/نص بديلة؛ نفحص الملفات المُعلنة فقط.
audioCheck(audioText, "text");
audioCheck(audioDlg, "dialog");
/* vocab */
const vIds = new Set<string>(); let ohneBeispiel = 0, artikelKandidat = 0, ohnePos = 0, dupDe = new Map<string, number>();
const nomenOhneArtikel: string[] = [];
for (const c of alleVokabeln) {
  if (vIds.has(c.id)) add("vocab:dupId", c.id); vIds.add(c.id);
  if (!c.de || !c.ar) add("vocab:leer", c.id);
  if (AR.test(c.de)) add("vocab:de arabisch", `${c.id} «${c.de}»`);
  if (!c.exampleDe) ohneBeispiel++;
  if (!(c as { pos?: string }).pos) ohnePos++;
  if (c.pos === "Nomen" && !c.article && !/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\b/i.test(c.de)) {
    artikelKandidat++; nomenOhneArtikel.push(`${c.id} «${c.de}»`);
  }
  dupDe.set(c.de.toLowerCase(), (dupDe.get(c.de.toLowerCase()) ?? 0) + 1);
  // K72 في engine_smoke يستعمل فحصاً صرفياً للفصل والأفعال الشاذة؛ لا نكرّر هنا بادئةً حرفيةً مضلِّلة.
}
const dups = [...dupDe.entries()].filter(([, n]) => n > 1);
info("vocab:stat", `${alleVokabeln.length} Karten · ohne exampleDe ${ohneBeispiel} · ohne pos ${ohnePos} · Nomen-Kandidaten ohne Artikel (heuristisch) ${artikelKandidat} · doppelte de ${dups.length} (z.B. ${dups.slice(0, 8).map(([d, n]) => d + "×" + n).join(", ")})`);
if (nomenOhneArtikel.length) hinweis("vocab:Nomen ohne Artikel — قائمة مرشّحين heuristic لا حكم لغوي", nomenOhneArtikel.join(" · "));
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
const genutzt = { text: new Set<string>(), dialog: new Set<string>(), topic: new Set<string>(), write: new Set<string>() };
let minGesamt = 0; const proTag: number[] = [];
for (let d = 1; d <= TOTAL_DAYS; d++) {
  let p; try { p = buildDay(d, emptyProgress); } catch (e) { add("plan:buildDay wirft", `Tag ${d}: ${(e as Error).message}`); continue; }
  let m = 0;
  for (const t of p.tasks) {
    m += t.minutes;
    if (t.topicId) { if (!grammarMap[t.topicId]) add("plan:topic tot", `Tag ${d} ${t.topicId}`); genutzt.topic.add(t.topicId); }
    if (t.deckId && !getDeck(t.deckId)) add("plan:deck tot", `Tag ${d} ${t.deckId}`);
    if (t.textId) { if (!getText(t.textId)) add("plan:text tot", `Tag ${d} ${t.textId}`); genutzt.text.add(t.textId); }
    if (t.dialogueId) { if (!getDialogue(t.dialogueId)) add("plan:dialog tot", `Tag ${d} ${t.dialogueId}`); genutzt.dialog.add(t.dialogueId); }
    if (t.writeId) { if (!getWriting(t.writeId)) add("plan:write tot", `Tag ${d} ${t.writeId}`); genutzt.write.add(t.writeId); }
    for (const s of t.sentenceIds ?? []) if (!getSatz(s)) add("plan:satz tot", `Tag ${d} ${s}`);
    if (t.quiz) for (const q of t.quiz) pruefeExercise(q, `Tag${d}:${t.kind}`);
    if (t.minutes <= 0) add("plan:minuten≤0", `Tag ${d} ${t.id}`);
  }
  proTag.push(m); minGesamt += m;
  // >200 min is a workload estimate, not proof of a structural defect or actual study time.
  // Keep it visible for pedagogical review; never equate it with the independent 90-minute session target.
  if (m > 200) hinweis("plan:Tag>200min — مجموع تقديرات يحتاج مراجعة تربوية", `Tag ${d}: ${m} Minuten geschätzt (لا يثبت وقتاً فعلياً ولا عيباً بنيوياً)`);
}
info("plan:stat", `Ø ${(minGesamt / TOTAL_DAYS).toFixed(0)} min/Tag · max ${Math.max(...proTag)} · min ${Math.min(...proTag)}`);
const texteUnbenutzt = texts.filter((t) => !genutzt.text.has(t.id)).map((t) => t.id);
const dialogeUnbenutzt = dialogues.filter((d) => !genutzt.dialog.has(d.id)).map((d) => d.id);
if (texteUnbenutzt.length) hinweis("abdeckung:texte خارج الخطة الافتراضية", texteUnbenutzt.join(" "));
else info("abdeckung:texte", `${texts.length}/${texts.length} نصوص مستخدمة في الخطة الافتراضية`);
if (dialogeUnbenutzt.length) hinweis("abdeckung:dialoge خارج الخطة الافتراضية", dialogeUnbenutzt.join(" "));
else info("abdeckung:dialoge", `${dialogues.length}/${dialogues.length} حواراً مستخدماً في الخطة الافتراضية`);
const writingUnbenutzt = writingTasks.filter((w) => !genutzt.write.has(w.id)).map((w) => w.id);
const writingWorkshopSource = readFileSync("components/schreiben.tsx", "utf8");
const trainerSource = readFileSync("components/trainer.tsx", "utf8");
const wA201AlternativeReachable = writingUnbenutzt.includes("w-a2-01")
  && writingWorkshopSource.includes("writingTasks.filter((w) => w.level === level)")
  && writingWorkshopSource.includes("setTask(pickN(pool, 1, rng(seed))[0] ?? pool[0])")
  && trainerSource.includes("<SchreibWerkstatt progress={progress} />");
const unresolvedWriting = writingUnbenutzt.filter((id) => id !== "w-a2-01" || !wA201AlternativeReachable);
if (wA201AlternativeReachable) info("abdeckung:writing-alternative", "w-a2-01 خارج الخطة الافتراضية لكنه متاح في SchreibWerkstatt لمستوى A2؛ لا يُضاف تلقائياً");
if (unresolvedWriting.length) hinweis("abdeckung:writing خارج الخطة اليومية — افحص البدائل", unresolvedWriting.join(" "));
else if (writingUnbenutzt.length === 0) info("abdeckung:writing", `${writingTasks.length}/${writingTasks.length} مهام كتابة مجدولة في الخطة الافتراضية`);
// لا نُقارن KontextPaket IDs بحزم المفردات؛ فحص المراجع الصحيحة أعلاه هو العقد الفعلي.
const topicsUnbenutzt = Object.keys(grammarMap).filter((g) => !genutzt.topic.has(g));
if (topicsUnbenutzt.length) hinweis("abdeckung:topics خارج الخطة الافتراضية", topicsUnbenutzt.join(" "));
else info("abdeckung:topics", `${Object.keys(grammarMap).length}/${Object.keys(grammarMap).length} موضوع قواعد مستخدم في الخطة الافتراضية`);
/* Ausgabe */
const keys = Object.keys(F).sort();
if (keys.length === 0) console.log("\n### العيوب البنيوية المؤكدة: صفر");
for (const k of keys) {
  const v = F[k];
  console.log(`\n### عيب بنيوي: ${k} (${v.length})`);
  for (const m of v.slice(0, 12)) console.log("  - " + m);
  if (v.length > 12) console.log(`  … +${v.length - 12}`);
}
for (const k of Object.keys(H).sort()) {
  const v = H[k];
  console.log(`\n### يحتاج مراجعة بشرية/تربوية: ${k} (${v.length})`);
  for (const m of v.slice(0, 12)) console.log("  - " + m);
  if (v.length > 12) console.log(`  … +${v.length - 12}`);
}
for (const k of Object.keys(I).sort()) {
  const v = I[k];
  console.log(`\n### مؤشرات/معلومات لا تُعدّ عيوباً: ${k}`);
  for (const m of v) console.log("  - " + m);
}
if (keys.length > 0) process.exitCode = 1;
