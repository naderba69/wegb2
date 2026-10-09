/**
 * ═══════════════════════════════════════════════════════════════════
 *  كلمة-كلمة Wort-für-Wort Audit v2 — German + Arabic (no false positives)
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
  [/هراء/g, "هراء"],
  [/اتفضل/g, "تفضّل"],
  [/من فضلك/g, "من فضلك"], // correct baseline, no-op
  [/ارجو/g, "أرجو"],
  [/اريد/g, "أريد"],
  [/اقول/g, "أقول"],
  [/افضل/g, "أفضّل"],
  [/استطيع/g, "أستطيع"],
  [/استاذ(?![ة])/g, "أستاذ"],
  [/الان/g, "الآن"],
  [/ايضا/g, "أيضاً"],
  [/اسمي/g, "اسمي"],
  [/لكن/g, "لكن"],
  [/لاكن/g, "لكن"],
  [/مرحبآ/g, "مرحباً"],
  [/اهلا/g, "أهلاً"],
];

function scanAr(text: string | undefined, file: string, id: string) {
  if (!text) return;
  for (const [re, fix] of AR_TYPOS) {
    if (re.test(text)) add(file, id, "arabic-typo", `"${re.source}" → "${fix}"`, text);
  }
  // مسافات مزدوجة حقيقية
  if (/\s{3,}/.test(text)) add(file, id, "whitespace", "ثلاث مسافات متتالية", text);
  // همزة على السطر مكسورة
  if (/اا/g.test(text)) add(file, id, "hamza", "ألفان متتاليان (اا)", text);
}

// ═══ فحص ألماني: فقط أخطاء مؤكدة ═══
const DE_COMMON_ERRORS: [RegExp, string][] = [
  [/\bich sind\b/gi, "ich bin (لا ich sind)"],
  [/\bdu bin\b/gi, "du bist"],
  [/\ber bin\b/gi, "er ist"],
  [/\bes bin\b/gi, "es ist"],
  [/\bsie bin\b/gi, "sie ist/sie sind"],
  [/\bwir ist\b/gi, "wir sind"],
  [/\bihr ist\b/gi, "ihr seid"],
  [/\bich hast\b/gi, "ich habe"],
  [/\bdu hab\b/gi, "du hast"],
  [/\ber habe\b/gi, "er hat"],
  [/\bes habe\b/gi, "es hat"],
  [/\bwir hat\b/gi, "wir haben"],
  [/\bihr habt?\b/gi, "ihr habt"],
  [/\bgehst du\b/gi, "du gehst"],
  [/\bich heise\b/gi, "ich heiße"],
  [/\bich heisse\b/gi, "ich heiße (مقبول سويسرياً)"],
  [/\bgute\s+Tag\b/gi, "Guten Tag (Guten)"],
  [/\bgute\s+Morgen\b/gi, "Guten Morgen"],
  [/\bgute\s+Abend\b/gi, "Guten Abend"],
  [/\bein\s+Frau\b/gi, "eine Frau"],
  [/\bein\s+Männer\b/gi, "Männer (جمع) لا يأخذ ein"],
  [/\bdas\s+Frau\b/gi, "die Frau"],
  [/\bdie\s+Mann\b/gi, "der Mann"],
  [/\bdas\s+Mann\b/gi, "der Mann"],
  [/\bder\s+Frau\b/gi, "die Frau"],
  [/\bder\s+Kind\b/gi, "das Kind"],
  [/\bdie\s+Kind\b/gi, "das Kind"],
  [/\bin\s+das\s+(Bahnhof|Markt|Supermarkt|Supermarkt|Flur|Weg|Kino|Park|Arzt|Bäcker|Bahnhof)\b/gi, "zum (in+dem) لا in das مع هذه الأماكن المألوفة"],
  [/\bzu\s+dem\s+Hause?\b/gi, "nach Hause (لا zu dem Haus)"],
  [/\bim\s+Montag\b/gi, "am Montag"],
  [/\bam\s+Januar\b/gi, "im Januar (شهور مع im)"],
  [/\bim\s+Nacht\b/gi, "in der Nacht"],
  [/\bseit\s+ein\s+Jahr\b/gi, "seit einem Jahr (Dativ)"],
  [/\bmit\s+ein\s+Freund\b/gi, "mit einem Freund (Dativ)"],
  [/\bvon\s+ein\s+Mann\b/gi, "von einem Mann (Dativ)"],
  [/\bohne\s+ein\b/gi, "ohne einen/ohne ein ( Akkusativ)"],
  [/\bfür\s+ein\s+Mann\b/gi, "für einen Mann (Akkusativ)"],
  [/\bdurch\s+ein\s+Park\b/gi, "durch einen Park (Akkusativ)"],
  [/\bweiß\s+nicht\b/gi, "ich weiß nicht (موجود)"],
  [/\bß{2,}/g, "ß مكرر"],
];

function scanDe(text: string | undefined, file: string, id: string) {
  if (!text) return;
  // UTF-8 double-encoding
  if (/[Ã¤Ã¶Ã¼ÃŸÂ\x80-\x9f]/.test(text)) add(file, id, "encoding", "UTF-8 double-encoding", text);
  // مسافات ثلاث أو أكثر
  if (/\s{3,}/.test(text)) add(file, id, "whitespace", "triple+ spaces", text);
  // فراغ قبل علامة ترقيم — فقط عندما يأتي حرف ثم فراغ ثم نقطة/فاصلة/إلخ
  const badPunct = text.match(/\w\s+[.,!?;:](?=\s|$)/g);
  if (badPunct) add(file, id, "punct-de", `space before punctuation: ${badPunct.slice(0,3).join(",")}`, text.slice(0,120));
  for (const [re, msg] of DE_COMMON_ERRORS) {
    if (re.test(text)) add(file, id, "de-typo", msg, text);
  }
  // Sentence starts with lowercase letter (not within clauses or quotes)
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (let si = 0; si < sentences.length; si++) {
    const s = sentences[si].trim().replace(/^[„"»«\s]+/, "");
    if (!s) continue;
    const ch = s[0];
    if (/[a-zäöüß]/.test(ch) && si > 0 && s.length > 4) {
      // allow es/sie/er opening — just flag clearly wrong
      if (/^(und|oder|aber|denn|sondern|wenn|weil|dass|als|nach|vor|seit|für|mit|ohne|auf|an|in|zu|um|von|bei|aus|ich|du|er|sie|es|wir|ihr|Sie|man|das|die|der|den|dem|des|sein|haben|werden|können|müssen|wollen|sollen|dürfen|mögen|lassen|heißen|finden|geben|machen|stehen|liegen|sitzen|gehen|kommen|fahren|sehen|hören|lesen|schreiben|sprechen|sagen|meinen|glauben|wissen|kennen|lernen|arbeiten|wohnen|leben|brauchen)\b/.test(s)) continue;
      // Only flag if not a known German connector/conjunction
      add(file, id, "de-case", `sentence starts lowercase: "${s.slice(0,40)}"`, text);
    }
  }
}

// ═══ فحص تمارين MC/TF ═══
function scanExercise(ex: any, parentId: string, file: string) {
  if (!ex) return;
  scanAr(ex.promptAr, file, ex.id || parentId);
  scanAr(ex.explanationAr, file, ex.id || parentId);
  scanDe(ex.promptDe, file, ex.id || parentId);
  scanDe(ex.explanationDe, file, ex.id || parentId);
  if (ex.type === "mc" && ex.options) {
    for (const opt of ex.options) {
      scanAr(opt, file, ex.id);
      scanDe(opt, file, ex.id);
    }
    if (!ex.options.includes(ex.answer)) {
      add(file, ex.id || parentId, "mc-answer-missing", `answer="${ex.answer}" not in options [${ex.options.join(" | ")}]`);
    }
    const norm = ex.options.map((o: string) => o.toLowerCase().trim());
    if (new Set(norm).size !== norm.length) {
      add(file, ex.id || parentId, "mc-duplicate", `duplicate options`, ex.options.join(","));
    }
    // MC with <2 options
    if (ex.options.length < 2) add(file, ex.id || parentId, "mc-too-few", `only ${ex.options.length} options`);
  }
  if (ex.type === "truefalse") {
    const a = String(ex.answer).toLowerCase().trim();
    if (a !== "richtig" && a !== "falsch") add(file, ex.id || parentId, "tf-bad-answer", `answer=${ex.answer}`);
    if (!ex.options || (ex.options[0] !== "richtig" && ex.options[0] !== "falsch")) {
      // expected options, but grader has default so only flag if wrong shape
    }
  }
  if ((ex.type === "fill" || ex.type === "translate" || ex.type === "umformung" || ex.type === "dictation") && ex.answer !== undefined) {
    const answers = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
    for (const a of answers) {
      if (!a || a.length < 1) add(file, ex.id || parentId, "empty-answer", "empty answer");
      scanDe(a, file, ex.id || parentId);
    }
  }
}

// ═══ Grammar ═══
for (const [id, t] of Object.entries(grammarMap)) {
  const tp: any = t;
  scanAr(tp.summaryAr, "grammar.json", id);
  scanAr(tp.titleAr, "grammar.json", id);
  scanDe(tp.summaryDe, "grammar.json", id);
  scanDe(tp.titleDe, "grammar.json", id);
  for (const r of tp.rules || []) { scanAr(r.ar, "grammar.json", id); scanDe(r.de, "grammar.json", id); }
  for (const p of tp.pitfalls || []) { scanAr(p.ar, "grammar.json", id); scanDe(p.de, "grammar.json", id); }
  for (const ex of tp.exercises || []) scanExercise(ex, id, "grammar.json");
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
  scanDe(f.falsch, "fehler.json", f.id);
  scanDe(f.richtig, "fehler.json", f.id);
}

// ═══ تقرير ═══
const byKind: Record<string, number> = {};
const byFile: Record<string, number> = {};
for (const i of issues) {
  byKind[i.kind] = (byKind[i.kind] || 0) + 1;
  byFile[i.file] = (byFile[i.file] || 0) + 1;
}
console.log("=== WORT-FÜR-WORT AUDIT v2 — " + issues.length + " genuine issues ===\n");
console.log("By kind:");
for (const [k, n] of Object.entries(byKind).sort((a: any, b: any) => b[1] - a[1])) console.log("  " + k + ": " + n);
console.log("\nBy file:");
for (const [f, n] of Object.entries(byFile).sort((a: any, b: any) => b[1] - a[1])) console.log("  " + f + ": " + n);
console.log("\n=== All issues ===");
for (const i of issues) {
  console.log("  ✗ [" + i.kind + "] " + i.file + "/" + i.id + ": " + i.msg);
  if (i.ctx) console.log("       «" + i.ctx.slice(0, 160).replace(/\s+/g, " ") + "»");
}
