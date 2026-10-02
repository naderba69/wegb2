import type { Exercise } from "./types";

/**
 * طبقة التصحيح — AI-ready:
 * واجهة Grader مصمّمة لاستبدال المحرك لاحقاً (LLMGrader) دون تغيير الواجهة التعليمية.
 * المحرك الحالي deterministic: مطابقة/تطبيع نصي/تحقّق ترتيب/كلمات مفتاحية.
 */
export interface GradeResult {
  correct: boolean;
  points: number;
  maxPoints: number;
  feedbackAr?: string;
  feedbackDe?: string;
}

export interface Grader {
  grade(ex: Exercise, response: string | string[]): GradeResult;
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:„“"''()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .replace(/ß/g, "ss")
    .trim();
}

export type DiffToken = { w: string; s: "ok" | "falsch" | "fehlt" | "extra" };

/** مقارنة كلمةً كلمة بين الإجابة والنموذج — Diff view (Modul S) */
export function diffWoerter(given: string, ref: string): DiffToken[] {
  const g = given.trim().split(/\s+/).filter(Boolean);
  const r = ref.trim().split(/\s+/).filter(Boolean);
  const used = g.map(() => false);
  const out: DiffToken[] = [];
  r.forEach((rw, i) => {
    const nr = normalize(rw);
    if (g[i] !== undefined && normalize(g[i]) === nr) {
      used[i] = true;
      out.push({ w: rw, s: "ok" });
    } else {
      const j = g.findIndex((x, k) => !used[k] && normalize(x) === nr);
      if (j >= 0) {
        used[j] = true;
        out.push({ w: rw, s: "ok" });
      } else {
        out.push({ w: rw, s: "fehlt" });
      }
    }
  });
  g.forEach((gw, i) => {
    if (!used[i]) out.push({ w: gw, s: i < r.length ? "falsch" : "extra" });
  });
  return out;
}

/** مؤشر الثقة 0..1 — نسبة الكلمات المطابقة مقابل الكلّ (تغذية آنية) */
export function konfidenz(given: string, ref: string): number {
  const g = given.trim().split(/\s+/).filter(Boolean);
  const r = ref.trim().split(/\s+/).filter(Boolean);
  if (!r.length || !given.trim()) return 0;
  const ok = diffWoerter(given, ref).filter((t) => t.s === "ok").length;
  return Math.max(0, Math.min(1, ok / Math.max(r.length, g.length)));
}

/** نسبةُ الكلماتِ المشتركةِ على أساسِ diffWoerter — 0..1 */
export function wortAehnlichkeit(given: string, ref: string): number {
  const g = given.trim().split(/\s+/).filter(Boolean);
  const r = ref.trim().split(/\s+/).filter(Boolean);
  if (!r.length || !g.length) return 0;
  const ok = diffWoerter(given, ref).filter((t) => t.s === "ok").length;
  return Math.max(0, Math.min(1, ok / Math.max(r.length, g.length)));
}

export class DeterministicGrader implements Grader {

  grade(ex: Exercise, response: string | string[]): GradeResult {
    const maxPoints = ex.points ?? 1;

    if (ex.type === "order") {
      const answerList = Array.isArray(ex.answer) ? ex.answer : [ex.answer];
      const given = Array.isArray(response) ? response : [response];
      const ok =
        given.length === answerList.length &&
        given.every((w, i) => normalize(w) === normalize(answerList[i]));
      return this.result(ok, maxPoints, ex, ok ? "ترتيب صحيح — الموضع الثاني للفعل!" : "انتبه لموضع الفعل (الموضع الثاني في الجملة الاسمية).");
    }

    if (ex.type === "dictation") {
      const answers = (Array.isArray(ex.answer) ? ex.answer : [ex.answer]).map(normalize);
      const given = normalize(Array.isArray(response) ? response.join(" ") : response);
      // التسميع: مطابقة كاملة بعد التطبيع، أو نسبة كلمات ≥ 85%
      const okExact = answers.includes(given) && given.length > 0;
      if (okExact) return this.result(true, maxPoints, ex, "سماع ممتاز — الكتابة مطابقة!");
      const target = answers[0].split(" ");
      const got = given.split(" ");
      const matched = target.filter((w) => got.includes(w)).length;
      const ratio = target.length ? matched / target.length : 0;
      const ok = ratio >= 0.85 && given.length > 0;
      return this.result(ok, maxPoints, ex, ok ? "قريب جداً — الكلمات الأساسية صحيحة." : `النص الصحيح: ${ex.answer}`);
    }

    if (ex.type === "umformung") {
      /* 🔁 التحويل: إنتاجٌ حرٌّ مقيَّدٌ — ثلاثُ درجاتٍ من الحكم:
         ١ مطابقةٌ تامّةٌ لِلنموذجِ أو لِبديلٍ مقبول ← صحيح
         ٢ الكلماتُ الواجبةُ كلُّها حاضرةٌ والمحظورةُ غائبةٌ، والتشابهُ ≥ 0.85 ← صحيح (اختلافُ ترقيمٍ أو ظرفٍ)
         ٣ وإلّا: تشخيصٌ موجَّهٌ — «ما زلتَ تكتبُ X» أعلى من «ينقصك Y» أعلى من الفرقِ الكلّي */
      const given = normalize(Array.isArray(response) ? response.join(" ") : response);
      if (!given) return this.result(false, maxPoints, ex, "اكتب التحويلَ أوّلاً.");
      const modelle = [ ...(Array.isArray(ex.answer) ? ex.answer : [ex.answer]), ...(ex.alternativen ?? []) ].map(normalize);
      if (modelle.includes(given)) return this.result(true, maxPoints, ex, "تحويلٌ سليم — البنيةُ الجديدةُ في مكانِها.");
      const nochDa = (ex.darfNicht ?? []).filter((w) => new RegExp(`(^|\\s)${normalize(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(given));
      if (nochDa.length) return this.result(false, maxPoints, ex, `ما زلتَ تكتبُ «${nochDa.join(" · ")}» — وهذا هو الفخُّ الذي يُدرِّبُك التحويلُ على تركِه.`);
      const fehlt = (ex.mussEnthalten ?? []).filter((w) => !given.includes(normalize(w)));
      if (fehlt.length) return this.result(false, maxPoints, ex, `ينقصك: ${fehlt.join(" · ")} — بلا هذه لا تقومُ البنيةُ المطلوبة.`);
      const best = Math.max(...modelle.map((m) => wortAehnlichkeit(given, m)));
      if (best >= 0.85) return this.result(true, maxPoints, ex, "مقبول — البنيةُ صحيحةٌ واختلافُك في التفاصيلِ فقط.");
      return this.result(false, maxPoints, ex, `البنيةُ لم تكتمل. النموذج: ${Array.isArray(ex.answer) ? ex.answer[0] : ex.answer}`);
    }

    if (ex.type === "translate") {
      const given = normalize(Array.isArray(response) ? response.join(" ") : response);
      const keys = ex.keywords ?? [];
      const missing = keys.filter((k) => !given.includes(normalize(k)));
      const ok = given.length > 0 && missing.length === 0;
      return this.result(
        ok,
        maxPoints,
        ex,
        ok
          ? "ترجمة سليمة — كل الكلمات المفتاحية في مكانها."
          : missing.length
          ? `ينقصك: ${missing.join(" · ")}`
          : "حاول مرة أخرى."
      );
    }

    const answers = (Array.isArray(ex.answer) ? ex.answer : [ex.answer]).map(normalize);
    const given = normalize(Array.isArray(response) ? response.join(" ") : response);
    const ok = answers.includes(given) && given.length > 0;
    return this.result(ok, maxPoints, ex);
  }

  private result(ok: boolean, maxPoints: number, ex: Exercise, feedbackAr?: string): GradeResult {
    const correctAnswer = Array.isArray(ex.answer) ? ex.answer.join(" / ") : ex.answer;
    return {
      correct: ok,
      points: ok ? maxPoints : 0,
      maxPoints,
      feedbackAr: ok
        ? feedbackAr ?? "أحسنت! إجابة صحيحة."
        : feedbackAr ?? `الإجابة الصحيحة: ${correctAnswer}`,
      feedbackDe: ok ? "Richtig!" : "Leider falsch.",
    };
  }
}

/** المُنشئ — يُستبدل لاحقاً بـ LLMGrader بنفس الواجهة */
export const grader: Grader = new DeterministicGrader();

// ═══════════════════════════════════════════════════════════════════
// مدرّس التصحيح — تحليل عميق للأخطاء (كلمة بكلمة) مع شرح عربي
// ═══════════════════════════════════════════════════════════════════

export type FehlerArt =
  | "artikel"
  | "schreibweise"
  | "umlaut"
  | "verb"
  | "ort"
  | "wortwahl"
  | "gross"
  | "sonst";

export interface WortFehler {
  wrong: string;
  right: string;
  art: FehlerArt;
  erklaerungAr: string;
}

export interface TiefesUrteil {
  fehler: WortFehler[];
  ratio: number;
  lehrerAr: string;
}

const ART_ERKLAERUNG: Record<FehlerArt, string> = {
  artikel:
    "خطأ في أداة التعريف/النكرة (der/die/das …) — تعلّم الكلمة مع أداتها دائماً: die Schule, der Tisch.",
  schreibweise:
    "خطأ إملائي — دوّن الكلمة كما هي مكتوبة لا كما تُسمع؛ الهمزات ß/ä/ö/ü ليست زينة!",
  umlaut:
    "همزة/حرف Umlaut ناقص (ä/ö/ü) — حذفها يغيّر الكلمة أو معناها. مثال: schön ≠ schon!",
  verb:
    "خطأ في تصريف الفعل أو شكله — راجع جدول التصريف، وانتبه: الصفات في ألمانيا تأتي مع sein لا haben.",
  ort: "خطأ في ترتيب الكلمات — تذكّر القاعدة الذهبية: الفعل المصرَّف في الموضع الثاني، والفعل الثاني (إن وُجد) في آخر الجملة.",
  wortwahl: "اختيار كلمة غير مناسبة هنا — راجع معاني الكلمة أمثلة الاستعمال في بطاقات المفردات.",
  gross: "الأسماء في الألمانيا تُكتب دائماً بحرف كبير (Großschreibung) — حتى في وسط الجملة.",
  sonst: "قارن جملتك بالنموذج ولاحظ الفرق البنيوي.",
};

const ARTIKEL_SET = new Set(
  ("der die das den dem des ein eine einen einem eines einer kein keine keinen keinem keiner " +
    "dieser diese dieses diesen diesem dieser jener jene jenes meinen meine meiner dein deine " +
    "sein seine seiner ihr ihre ihrer unser unsere unserer euer eure")
    .split(" ")
);

const VERB_STEMS = [
  "sein", "bin", "bist", "ist", "sind", "seid",
  "haben", "habe", "hast", "hat", "habt",
  "werden", "wird", "wirst", "werde",
  "können", "kann", "kannst", "müssen", "muss", "musst",
  "sollen", "soll", "dürfen", "darf", "wollen", "will",
  "heißen", "wohnen", "lernen", "arbeiten", "kommen", "gehen", "machen",
];

function stripPunct(w: string): string {
  return w.replace(/[.,!?;:„“"'()]/g, "");
}

function foldUml(w: string): string {
  return w
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss");
}

function lev(a: string, b: string): number {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[b.length];
}

function classify(wrong: string, right: string): { art: FehlerArt; erklaerungAr: string } {
  const w = stripPunct(wrong);
  const r = stripPunct(right);
  if (w.toLowerCase() === r.toLowerCase() && w !== r)
    return { art: "gross", erklaerungAr: ART_ERKLAERUNG.gross };
  if (foldUml(w) === foldUml(r) && w.toLowerCase() !== r.toLowerCase())
    return { art: "umlaut", erklaerungAr: ART_ERKLAERUNG.umlaut };
  if (ARTIKEL_SET.has(w.toLowerCase()) || ARTIKEL_SET.has(r.toLowerCase()))
    return { art: "artikel", erklaerungAr: ART_ERKLAERUNG.artikel };
  const wl = w.toLowerCase();
  const rl = r.toLowerCase();
  if (VERB_STEMS.some((s) => wl.startsWith(s.slice(0, 4)) && rl.startsWith(s.slice(0, 4))) && wl !== rl)
    return { art: "verb", erklaerungAr: ART_ERKLAERUNG.verb };
  if (lev(foldUml(w), foldUml(r)) <= 2)
    return { art: "schreibweise", erklaerungAr: ART_ERKLAERUNG.schreibweise };
  return { art: "wortwahl", erklaerungAr: ART_ERKLAERUNG.wortwahl };
}

/** مقارنة كلمة-بكلمة بين إجابة المتعلّم والنموذج: أخطاء مصنّفة + حكم المدرّس */
export function deepReview(given: string, ref: string): TiefesUrteil {
  const gw = given.trim().split(/\s+/).filter(Boolean);
  const rw = ref.trim().split(/\s+/).filter(Boolean);
  const fehler: WortFehler[] = [];

  // محاذاة بسيطة: نقارن بالترتيب مع السماح بإدراج/حذف
  let gi = 0;
  for (let ri = 0; ri < rw.length; ri++) {
    const g = gw[gi];
    const r = rw[ri];
    if (g && normalize(stripPunct(g)) === normalize(stripPunct(r))) {
      gi++;
      continue;
    }
    // هل الكلمة الصحيحة موجودة لاحقاً في الإجابة؟ (خطأ ترتيب)
    const later = gw.findIndex((x, k) => k >= gi && normalize(stripPunct(x)) === normalize(stripPunct(r)));
    if (later > gi && later >= 0 && later - gi <= 2) {
      fehler.push({
        wrong: gw.slice(gi, later + 1).join(" … "),
        right: r,
        art: "ort",
        erklaerungAr: ART_ERKLAERUNG.ort,
      });
      gi = later + 1;
      continue;
    }
    if (!g) {
      fehler.push({ wrong: "— (ناقصة)", right: r, art: rw.length - ri <= 1 ? "ort" : "sonst", erklaerungAr: ART_ERKLAERUNG.ort });
      continue;
    }
    const c = classify(g, r);
    fehler.push({ wrong: g, right: r, art: c.art, erklaerungAr: c.erklaerungAr });
    gi++;
  }
  if (gi < gw.length) {
    fehler.push({
      wrong: gw.slice(gi).join(" "),
      right: "— (زائدة)",
      art: "sonst",
      erklaerungAr: "كلمات زائدة عن النموذج — الجملة الألمانية تحبّ الإيجاز والدقة.",
    });
  }

  const denom = Math.max(rw.length, gw.length, 1);
  const ratio = Math.max(0, 1 - fehler.length / denom);
  const arts = [...new Set(fehler.map((f) => f.art))];
  const lehrerAr =
    fehler.length === 0
      ? "ممتاز! جملتك مطابقة للنموذج."
      : `وجد المدرّس ${fehler.length} خطأ(أخطاء): ${arts
          .map((a) => ART_ERKLAERUNG[a].split("—")[0].trim())
          .join(" · ")}. صحّح الأحمر وكرّر الجملة صوتياً ثلاث مرات.`;
  return { fehler, ratio, lehrerAr };
}

/** تقدير مدرسي ألماني (1 الأفضل … 6) من نسبة مئوية */
export function noteFromPct(pct: number): string {
  if (pct >= 92) return "1 — ausgezeichnet (ممتاز)";
  if (pct >= 81) return "2 — gut (جيد جداً)";
  if (pct >= 67) return "3 — befriedigend (جيد)";
  if (pct >= 50) return "4 — ausreichend (مقبول)";
  if (pct >= 30) return "5 — mangelhaft (ضعيف)";
  return "6 — ungenügend (غير كافٍ)";
}

// ═══════════════════════════════════════════════════════════════════
// مدرّس LLM اختياري — أي واجهة OpenAI-compatible (المفتاح في متصفحك فقط)
// ═══════════════════════════════════════════════════════════════════

export interface LlmCfg {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface LlmKorrektur {
  korrigiert: string;
  notizen: string[];
  bewertung: string;
}

export async function llmKorrigieren(
  cfg: LlmCfg,
  aufgabeDe: string,
  text: string
): Promise<LlmKorrektur | null> {
  if (!cfg?.apiKey) return null;
  try {
    const base = (cfg.baseUrl || "https://api.openai.com/v1").replace(/\/+$/, "");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              'أنت أستاذ ألمانية للناطقين بالعربية. صحّح نص المتعلم وفق المهمة واشرح أخطاءه بالعربية بلطف. أعد JSON فقط بهذا الشكل: {"korrigiert":"النص المصحح بالألمانية","notizen":["ملاحظة 1"],"bewertung":"تقدير قصير بالعربية"}',
          },
          {
            role: "user",
            content: `المهمة: ${aufgabeDe}\n\nنص المتعلم:\n${text}`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const p = JSON.parse(m[0]);
    return {
      korrigiert: String(p.korrigiert ?? ""),
      notizen: Array.isArray(p.notizen) ? p.notizen.map(String) : [],
      bewertung: String(p.bewertung ?? ""),
    };
  } catch {
    return null;
  }
}
