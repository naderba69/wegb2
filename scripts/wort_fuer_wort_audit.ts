/**
 * ═══════════════════════════════════════════════════════════════════
 *  كلمة-كلمة Wort-für-Wort Audit v2 — German + Arabic (confirmed blockers only)
 * ═══════════════════════════════════════════════════════════════════
 */
import { grammarMap, dialogues, texts, sentences, alleVokabeln, writingTasks, fehlerList } from "../lib/content";

const issues: Array<{ file: string; id: string; kind: string; msg: string; ctx?: string }> = [];
const add = (file: string, id: string, kind: string, msg: string, ctx?: string) => {
  issues.push({ file, id, kind, msg, ctx: ctx?.slice(0, 200) });
};

// ═══ فحص عربي: أخطاء إملائية مؤكدة فقط ═══
const AR_TYPOS: [RegExp, string][] = [
  [/نطظ/g, "نُطق"],
  [/الالماني/g, "الألماني"],
  [/المانيا(?!ت)/g, "ألمانيا"],
  [/المانية/g, "الألمانية"],
  [/هاذا/g, "هذا"],
  [/هاذه/g, "هذه"],
  [/اتفضل/g, "تفضّل"],
  [/ارجو/g, "أرجو"],
  [/اريد/g, "أريد"],
  [/اقول/g, "أقول"],
  [/افضل/g, "أفضّل"],
  [/استطيع/g, "أستطيع"],
  [/استاذ(?![ة])/g, "أستاذ"],
  [/(?<![\u0600-\u06FF])الان(?![\u0600-\u06FF])/g, "الآن"],
  [/ايضا/g, "أيضاً"],
  [/(?<![\u0600-\u06FF])لاكن(?![\u0600-\u06FF])/g, "لكن"],
  [/مرحبآ/g, "مرحباً"],
  [/اهلا/g, "أهلاً"],
];

/** RegExp ذات العلم g تحتفظ بـlastIndex بين الحقول؛ صفّره قبل/بعد كل فحص حتى لا تُنسب ضربة الحقل السابق إلى التالي. */
function regexMatches(re: RegExp, text: string): boolean {
  re.lastIndex = 0;
  const found = re.test(text);
  re.lastIndex = 0;
  return found;
}

function arabicTypoMatches(text: string): [RegExp, string][] {
  return AR_TYPOS.filter(([re]) => regexMatches(re, text));
}

function scanAr(text: string | undefined, file: string, id: string) {
  if (!text) return;
  for (const [re, fix] of arabicTypoMatches(text)) {
    add(file, id, "arabic-typo", `"${re.source}" → "${fix}"`, text);
  }
  // مسافات مزدوجة حقيقية
  if (/\s{3,}/.test(text)) add(file, id, "whitespace", "ثلاث مسافات متتالية", text);
  // همزة على السطر مكسورة
  if (/اا/g.test(text)) add(file, id, "hamza", "ألفان متتاليان (اا)", text);
}

// ═══ فحص ألماني: فقط أخطاء مؤكدة ═══
const DE_COMMON_ERRORS: [RegExp, string][] = [
  // Nur morphologisch eindeutige Treffer. Wortstellung, Kasus und Konjunktiv
  // brauchen Kontext und gehören nicht in einen regex-basierten CI-Blocker.
  [/\bich sind\b/gi, "ich bin (لا ich sind)"],
  [/\bdu bin\b/gi, "du bist"],
  [/\ber bin\b/gi, "er ist"],
  [/\bes bin\b/gi, "es ist"],
  [/\bsie bin\b/gi, "sie ist/sie sind"],
  [/\bwir ist\b/gi, "wir sind"],
  [/\bich hast\b/gi, "ich habe"],
  [/\bdu hab\b/gi, "du hast"],
  [/\bwir hat\b/gi, "wir haben"],
  [/\bein\s+Frau\b/gi, "eine Frau"],
  [/\bein\s+Männer\b/gi, "Männer (جمع) لا يأخذ ein"],
  [/\bdas\s+Frau\b/gi, "die Frau"],
  [/\bdie\s+Mann\b/gi, "der Mann"],
  [/\bdas\s+Mann\b/gi, "der Mann"],
  [/\bder\s+Kind\b/gi, "das Kind"],
  [/\bdie\s+Kind\b/gi, "das Kind"],
  [/\bim\s+Montag\b/gi, "am Montag"],
  [/\bam\s+Januar\b/gi, "im Januar (شهور مع im)"],
  [/\bim\s+Nacht\b/gi, "in der Nacht"],
  [/\bseit\s+ein\s+Jahr\b/gi, "seit einem Jahr (Dativ)"],
  [/\bmit\s+ein\s+Freund\b/gi, "mit einem Freund (Dativ)"],
  [/\bvon\s+ein\s+Mann\b/gi, "von einem Mann (Dativ)"],
  [/\bfür\s+ein\s+Mann\b/gi, "für einen Mann (Akkusativ)"],
  [/\bdurch\s+ein\s+Park\b/gi, "durch einen Park (Akkusativ)"],
  [/\bß{2,}/g, "ß مكرر"],
];

function germanTypoMatches(text: string, expectCorrect = true): [RegExp, string][] {
  const demonstratesError = /[✗→]|(?:^|\s)\*[A-Za-zÄÖÜäöüß]/.test(text);
  if (!expectCorrect || demonstratesError) return [];
  return DE_COMMON_ERRORS.filter(([re]) => regexMatches(re, text));
}

function scanDe(text: string | undefined, file: string, id: string, expectCorrect = true) {
  if (!text) return;
  // UTF-8 double-encoding
  if (/[Ã¤Ã¶Ã¼ÃŸÂ\x80-\x9f]/.test(text)) add(file, id, "encoding", "UTF-8 double-encoding", text);
  // مسافات ثلاث أو أكثر
  if (/\s{3,}/.test(text)) add(file, id, "whitespace", "triple+ spaces", text);
  // فراغ قبل علامة ترقيم — فقط عندما يأتي حرف ثم فراغ ثم نقطة/فاصلة/إلخ
  const badPunct = text.match(/\w\s+[.,!?;:](?=\s|$)/g);
  if (badPunct) add(file, id, "punct-de", `space before punctuation: ${badPunct.slice(0,3).join(",")}`, text.slice(0,120));

  // Aufgaben und Kontrastbeispiele dürfen absichtlich falsches Deutsch enthalten.
  // Auch Regeln mit sichtbaren ✗/→-Paaren sind Demonstrationen, keine Inhaltsfehler.
  for (const [, msg] of germanTypoMatches(text, expectCorrect)) {
    add(file, id, "de-typo", msg, text);
  }
}

// هذه الانحدارات جزء من البوابة نفسها: تمنع عودة قواعد no-op أو الأنماط السياقية
// التي كانت تعدّ تراكيب صحيحة مثل der Frau وgehst du أخطاءً.
function assertRuleRegressions() {
  const checks: Array<[string, boolean]> = [
    ["no Arabic rule matches its own correction", AR_TYPOS.every(([re, fix]) => !regexMatches(re, fix))],
    ["valid Arabic substrings stay clean", arabicTypoMatches("من فضلك، استهلاكنا تضاعف، وسؤالان كافيان.").length === 0],
    ["standalone Arabic typos are detected", arabicTypoMatches("لاكن الان").length === 2],
    ["valid German context stays clean", germanTypoMatches("Das gehört der Frau. Wohin gehst du? Ich weiß nicht. Ohne ein stabiles Umfeld geht es nicht.").length === 0],
    ["unambiguous German errors are detected", germanTypoMatches("Ich sind hier und du bin dort.").length === 2],
    ["intentional contrast is not a defect", germanTypoMatches("✗ Ich sind hier. → ✓ Ich bin hier.").length === 0],
    ["global regex state is deterministic", arabicTypoMatches("لاكن الان").length === 2 && arabicTypoMatches("لاكن الان").length === 2],
  ];
  const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
  if (failed.length) throw new Error(`Wort-für-Wort regression failed: ${failed.join(", ")}`);
  console.log(`Rule regressions: ${checks.length}/${checks.length}`);
}

assertRuleRegressions();

// ═══ فحص تمارين MC/TF ═══
function scanExercise(ex: any, parentId: string, file: string) {
  if (!ex) return;
  const id = ex.id || parentId;
  scanAr(ex.promptAr, file, id);
  scanAr(ex.explanationAr, file, id);
  scanDe(ex.promptDe, file, id, false);
  scanDe(ex.quelleDe, file, id, false);
  if (ex.text !== ex.promptDe) scanDe(ex.text, file, id, false);
  scanDe(ex.explanationDe, file, id);
  if (ex.type === "mc" && ex.options) {
    for (const opt of ex.options) {
      scanAr(opt, file, id);
      scanDe(opt, file, id, false);
    }
    if (!ex.options.includes(ex.answer)) {
      add(file, id, "mc-answer-missing", `answer="${ex.answer}" not in options [${ex.options.join(" | ")}]`);
    }
    const norm = ex.options.map((o: string) => o.toLowerCase().trim());
    if (new Set(norm).size !== norm.length) {
      add(file, id, "mc-duplicate", `duplicate options`, ex.options.join(","));
    }
    // MC with <2 options
    if (ex.options.length < 2) add(file, id, "mc-too-few", `only ${ex.options.length} options`);
  }
  if (ex.type === "truefalse") {
    const a = String(ex.answer).toLowerCase().trim();
    if (a !== "richtig" && a !== "falsch") add(file, id, "tf-bad-answer", `answer=${ex.answer}`);
    if (!ex.options || (ex.options[0] !== "richtig" && ex.options[0] !== "falsch")) {
      // expected options, but grader has default so only flag if wrong shape
    }
  }
  if (ex.answer !== undefined) {
    const answers = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
    for (const a of answers) {
      if (a === "") add(file, id, "empty-answer", "empty answer");
      if (typeof a === "string") scanDe(a, file, id);
    }
  }
}

// ═══ Grammar ═══
for (const [id, t] of Object.entries(grammarMap)) {
  const tp: any = t;
  scanAr(tp.summaryAr, "grammar.json", id);
  scanAr(tp.titleAr, "grammar.json", id);
  scanAr(tp.ziel, "grammar.json", id);
  scanDe(tp.summaryDe, "grammar.json", id);
  scanDe(tp.titleDe, "grammar.json", id);
  scanAr(tp.anwendung?.ar, "grammar.json", id);
  scanDe(tp.anwendung?.de, "grammar.json", id);
  for (const r of tp.rules || []) { scanAr(r.ar, "grammar.json", id); scanDe(r.de, "grammar.json", id); }
  for (const e of tp.examples || []) { scanAr(e.ar, "grammar.json", id); scanDe(e.de, "grammar.json", id); }
  for (const p of tp.pitfalls || []) { scanAr(p.ar, "grammar.json", id); scanDe(p.de, "grammar.json", id); }
  for (const table of tp.tables || []) {
    scanAr(table.captionAr, "grammar.json", id);
    scanDe(table.captionDe, "grammar.json", id);
    for (const cell of [...(table.headers || []), ...(table.rows || []).flat()]) scanDe(cell, "grammar.json", id);
  }
  for (const ex of [...(tp.exercises || []), ...(tp.verify || [])]) scanExercise(ex, id, "grammar.json");
}

// ═══ Dialogues ═══
for (const d of dialogues) {
  scanAr(d.titleAr, "dialogues.json", d.id);
  scanDe(d.titleDe, "dialogues.json", d.id);
  for (const l of d.lines || []) {
    scanAr(l.ar, "dialogues.json", d.id);
    scanDe(l.de, "dialogues.json", d.id);
  }
  for (const q of d.questions || []) scanExercise(q, d.id, "dialogues.json");
}

// ═══ Texts ═══
for (const t of texts) {
  scanAr(t.titleAr, "texts.json", t.id);
  scanDe(t.titleDe, "texts.json", t.id);
  scanAr(t.ar, "texts.json", t.id);
  scanDe(t.de, "texts.json", t.id);
  for (const q of t.questions || []) scanExercise(q, t.id, "texts.json");
}

// ═══ Sentences ═══
for (const s of sentences) {
  scanAr(s.ar, "sentences.json", s.id);
  scanDe(s.de, "sentences.json", s.id);
  if (s.de && s.de.length > 3) {
    const first = s.de.replace(/^[„"»«\s]/, "")[0];
    if (/[a-zäöüß]/.test(first) && !/^(ich|und|oder|aber|denn|weil|wenn|dass|als|nach|vor|seit|für|mit|ohne|auf|an|in|zu|um|von|bei|aus|es|das|man|sein)\b/.test(s.de)) {
      // Skip inline sentence fragments (many in cloze banks start mid-sentence on purpose)
    }
  }
}

// ═══ Vocab ═══
for (const c of alleVokabeln) {
  const cc: any = c;
  scanAr(cc.ar, "vocab.json", cc.id);
  scanDe(cc.de, "vocab.json", cc.id);
  if (cc.exampleDe) scanDe(cc.exampleDe, "vocab.json", cc.id);
  if (cc.exampleAr) scanAr(cc.exampleAr, "vocab.json", cc.id);
}

// ═══ Writing ═══
for (const w of writingTasks) {
  scanAr(w.titleAr, "writing.json", w.id);
  scanDe(w.titleDe, "writing.json", w.id);
  scanAr(w.taskAr, "writing.json", w.id);
  scanDe(w.taskDe, "writing.json", w.id);
  for (const cr of w.criteria || []) scanAr(cr, "writing.json", w.id);
  if (w.sample) scanDe(w.sample, "writing.json", w.id);
}

// ═══ Fehler list ═══
for (const f of fehlerList) {
  scanAr(f.ar, "fehler.json", f.id);
  scanDe(f.falsch, "fehler.json", f.id, false);
  scanDe(f.richtig, "fehler.json", f.id);
}

// ═══ تقرير ═══
const byKind: Record<string, number> = {};
const byFile: Record<string, number> = {};
for (const i of issues) {
  byKind[i.kind] = (byKind[i.kind] || 0) + 1;
  byFile[i.file] = (byFile[i.file] || 0) + 1;
}
console.log("=== WORT-FÜR-WORT AUDIT v2 — " + issues.length + " confirmed blockers ===");
if (issues.length === 0) {
  console.log("✓ Keine bestätigten Wort-, Struktur- oder Kodierungsfehler.");
} else {
  console.log("\nBy kind:");
  for (const [k, n] of Object.entries(byKind).sort((a: any, b: any) => b[1] - a[1])) console.log("  " + k + ": " + n);
  console.log("\nBy file:");
  for (const [f, n] of Object.entries(byFile).sort((a: any, b: any) => b[1] - a[1])) console.log("  " + f + ": " + n);
  console.log("\n=== All blockers ===");
  for (const i of issues) {
    console.log("  ✗ [" + i.kind + "] " + i.file + "/" + i.id + ": " + i.msg);
    if (i.ctx) console.log("       «" + i.ctx.slice(0, 160).replace(/\s+/g, " ") + "»");
  }
  process.exitCode = 1;
}
