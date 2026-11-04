// Deep student/auditor QA — iterate all 378 days, check content references and structure.
import { buildDay } from "../lib/plan";
import { TOTAL_DAYS, emptyProgress } from "../lib/types";
import { dialogues, texts, grammarMap, sentences, writingTasks, vocabMap } from "../lib/content";
import { levelOf } from "../lib/plan";

console.log("=== DEEP STUDENT+AUDITOR QA — ALL 378 DAYS ===\n");
const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);

function findGrammar(id: string, o: any): any {
  if (!o) return null;
  if (typeof o === "object") {
    if (o.id === id) return o;
    for (const v of Object.values(o)) { const r = findGrammar(id, v); if (r) return r; }
  }
  if (Array.isArray(o)) for (const v of o) { const r = findGrammar(id, v); if (r) return r; }
  return null;
}

const usedDialogs = new Set<string>();
const usedTexts = new Set<string>();
const usedGrammar = new Set<string>();
const usedSentences = new Set<string>();
const dayTypeCount: Record<string, number> = {};
const dayLevelCount: Record<string, number> = {};
const taskKindCount: Record<string, number> = {};
let totalTasks = 0;
const dayTasks: {day:number;count:number;mins:number}[]=[];
let prevLevel: string | null = null;
const transitions: {day:number;from:string;to:string}[]=[];
const zeroTaskDays: number[]=[];
const quizIssues: {day:number;msg:string}[]=[];

const base: any = JSON.parse(JSON.stringify(emptyProgress));
const allDIds = new Set(dialogues.map((d:any)=>d.id));
const allTIds = new Set(texts.map((t:any)=>t.id));
const allSIds = new Set(sentences.map((s:any)=>s.id));
const allWIds = new Set(writingTasks.map((w:any)=>w.id));
const allDeckIds = new Set(Object.keys(vocabMap));

// Architekturvertrag: `de` ist die kompakte/audio-nahe Fassung, `lang` die Lesefassung.
// Eine angeblich kurze Fassung darf nicht deutlich länger als die Langfassung sein.
for (const text of texts) {
  const lang = text.lang?.de;
  if (!lang) continue;
  const kurzWoerter = text.de.trim().split(/\s+/).length;
  const langWoerter = lang.trim().split(/\s+/).length;
  if (kurzWoerter > langWoerter * 1.2) {
    err(`${text.id}: Kurzfassung ${kurzWoerter} Wörter > Langfassung ${langWoerter} Wörter`);
  }
}

for (let day = 1; day <= TOTAL_DAYS; day++) {
  try {
    const plan: any = buildDay(day, base);
    if (!plan) { err(`Tag ${day}: buildDay returned null`); continue; }
    const tasks = plan.tasks || [];
    if (tasks.length === 0) zeroTaskDays.push(day);
    const curLevel = levelOf(day);
    dayLevelCount[curLevel]=(dayLevelCount[curLevel]||0)+1;
    const dt = plan.type;
    dayTypeCount[dt]=(dayTypeCount[dt]||0)+1;
    if (prevLevel && prevLevel !== curLevel)
      transitions.push({day,from:prevLevel,to:curLevel});
    prevLevel = curLevel;
    let mins = plan.zielMin || 0;
    for (const task of tasks) {
      totalTasks++;
      const k = task.kind || "?";
      taskKindCount[k]=(taskKindCount[k]||0)+1;
      if (!task.titleDe && !task.titleAr) err(`Tag ${day}: Aufgabe ohne Titel (kind=${k})`);

      // Ein Titel allein ist keine Aufgabe: jede lernwirksame Art braucht ihren ausführbaren Inhalt.
      const quizN = Array.isArray(task.quiz) ? task.quiz.length : 0;
      const satzN = Array.isArray(task.sentenceIds) ? task.sentenceIds.length : 0;
      if (k === "grammatik" && !task.topicId && quizN === 0) err(`Tag ${day}: Grammatik ohne topicId/quiz (${task.titleDe})`);
      if (k === "wortschatz" && (!task.deckId || !allDeckIds.has(task.deckId))) err(`Tag ${day}: Wortschatz ohne gültiges deckId (${task.deckId ?? "leer"})`);
      if (k === "hoeren" && !task.dialogueId) err(`Tag ${day}: Hören ohne dialogueId (${task.titleDe})`);
      if (k === "lesen" && !task.textId) err(`Tag ${day}: Lesen ohne textId (${task.titleDe})`);
      if (k === "schreiben" && (!task.writeId || !allWIds.has(task.writeId))) err(`Tag ${day}: Schreiben ohne gültiges writeId (${task.writeId ?? "leer"})`);
      if ((k === "sprechen" || k === "aussprache") && satzN === 0) err(`Tag ${day}: ${k} ohne Sätze (${task.titleDe})`);
      if (k === "check" && !task.exam && quizN === 0) err(`Tag ${day}: Check ohne quiz/exam (${task.titleDe})`);

      if (task.dialogueId) {
        usedDialogs.add(task.dialogueId);
        if (!allDIds.has(task.dialogueId)) err(`Tag ${day}: nicht-existierender Dialog: ${task.dialogueId}`);
      }
      if (task.textId) {
        usedTexts.add(task.textId);
        if (!allTIds.has(task.textId)) err(`Tag ${day}: nicht-existierender Text: ${task.textId}`);
      }
      if (task.topicId) {
        usedGrammar.add(task.topicId);
        if (!findGrammar(task.topicId, grammarMap)) err(`Tag ${day}: topicId ${task.topicId} nicht in grammarMap`);
      }
      if (Array.isArray(task.sentenceIds)) {
        for (const sid of task.sentenceIds) {
          usedSentences.add(String(sid));
          if (!allSIds.has(String(sid))) err(`Tag ${day}: satzId ${sid} existiert nicht`);
        }
      }
      if (Array.isArray(task.quiz)) {
        for (const q of task.quiz) {
          if (q.type === "mc" || q.type === "truefalse") {
            const opts = q.options || (q.type==='truefalse'?["richtig","falsch"]:[]);
            if (!opts.includes(q.answer))
              quizIssues.push({day,msg:`quiz ${q.id} answer=${JSON.stringify(q.answer)} not in options=${JSON.stringify(opts)}`});
          }
        }
      }
    }
    dayTasks.push({day, count:tasks.length, mins});
  } catch(e:any) {
    err(`Tag ${day}: EXCEPTION: ${e.message || e}`);
  }
}

const unusedD = [...allDIds].filter(id=>!usedDialogs.has(id));
const unusedT = [...allTIds].filter(id=>!usedTexts.has(id));
const unusedS = [...allSIds].filter(id=>!usedSentences.has(id));

console.log(`\n=== FEHLER (${errors.length + quizIssues.length}) ===`);
[...errors,...quizIssues.map(q=>`Tag ${q.day}: ${q.msg}`)].slice(0,80).forEach(e=>console.log("  ✗",e));
console.log(`\n=== WARNUNGEN (${warnings.length}) ===`);
warnings.forEach(w=>console.log("  ⚠",w));
console.log("\n=== TAGES- & LEVELVERTEILUNG ===");
for (const [k,v] of Object.entries(dayTypeCount).sort()) console.log(`  ${k}: ${v} Tage`);
for (const [k,v] of Object.entries(dayLevelCount).sort()) console.log(`  ${k}: ${v} Tage`);
console.log("LEVELÜBERGÄNGE:", transitions.map(t=>`T${t.day}:${t.from}→${t.to}`).join(", "));

console.log("\n=== TASK-KINDS ===");
Object.entries(taskKindCount).sort((a:any,b:any)=>b[1]-a[1]).forEach(([k,v]:any)=>console.log(`  ${k}: ${v}`));
console.log(`\nTotal Aufgaben: ${totalTasks}`);
console.log(`Tage mit 0 Aufgaben: ${zeroTaskDays.length}`, zeroTaskDays);
console.log(`\n=== INHALTSABDECKUNG ===`);
console.log(`  Dialoge genutzt:   ${usedDialogs.size}/${allDIds.size}${unusedD.length?' UNUSED:'+unusedD.length:''}`);
console.log(`  Texte genutzt:     ${usedTexts.size}/${allTIds.size}${unusedT.length?' UNUSED:'+unusedT.length:''}`);
console.log(`  Grammar topics:    ${usedGrammar.size}`);
console.log(`  Sätze referenziert: ${usedSentences.size}/${allSIds.size}`);
if(unusedS.length){
  const byLv:Record<string,number>={};
  for(const s of sentences){ if(unusedS.includes(s.id)) byLv[s.level]=(byLv[s.level]||0)+1;}
  console.log(`  Unused sentences by level:`, byLv);
}

const allIssues = errors.length+quizIssues.length;
console.log(`\n${'='.repeat(50)}\nVERDICT: ${allIssues===0?'✓ KEINE FEHLER':`✗ ${allIssues} FEHLER`}`);
process.exit(allIssues>0?1:0);
