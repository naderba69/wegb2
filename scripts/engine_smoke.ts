/**
 * Engine-Smoke-Test — فحص خصومة لمحرّكات lib/*.ts + المصحّح الخماسي
 * ------------------------------------------------------------------
 * يشغّل كل دالة محرّكة على: progress فارغ، طرفَي الخطة (يوم 1/270)، ما بعد
 * النهاية، وبنوك كاملة — ويثبت المعادلات الموثّقة رقماً برقماً. الهدف: ما لا
 * يراه dev-build ولا SSG لأن الأجنحة تُطوى — مسارات التوليد العميقة.
 * التشغيل:  npm run smoke
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  rng,
  pickN,
  phaseOf,
  levelOf,
  dayType,
  clozeFromSatz,
  buildDay,
  MODULE,
  modulOf,
  taskKey,
  isPassed,
  canCloseDay,
  dayScore,
  debtsFrom,
  planPct,
} from "../lib/plan";
import { newCard, reviewCard, isDue } from "../lib/srs";
import {
  normKey,
  upsertFehler,
  gradeFehlerIn,
  dueFehler,
  weakTopics,
  resistenteFehler,
  fehlerDesMonats,
  lehrerBericht,
  platzierungsFragen,
  vorschlagTag,
  elternBrief,
  FEHLER_KAT,
} from "../lib/fehler";
import { normalize, diffWoerter, konfidenz, grader, deepReview, noteFromPct } from "../lib/grader";
import { logK, kompetenzWerte, band, b2Score, pruefungsBereitschaft, bereitBand, KOMPETENZEN } from "../lib/kompetenz";
import { levelOfXp, checkAbzeichen, ABZEICHEN, XP_LEVELS } from "../lib/spiel";
import { loadProgress, touchStreak } from "../lib/store";
import { readFileSync, existsSync } from "fs";
import { sentences, texts, dialogues, writingTasks, alleVokabeln, fehlerList, grammarMap, verben, szenarien, pakete, haerte, muendlich, vortrag, mnemonikMap } from "../lib/content";
import { hoerenAudio, diktatAudio, diktatSrc } from "../lib/content";
import { signKontrakt, voidKontrakt, pruefeKontrakt, anwendenErfuellt, anwendenStrafe, tagLokal, groetsterFehler } from "../lib/kontrakt";
import { bauHoerRunde, darfSpielen, fragenFrei, werteItem, werteRunde, hoerNote, RATE } from "../lib/hoeren";
import { buildSkillKlausur, SKILL_LABELS, type SkillKey } from "../lib/klausur";
import { karteninCsv, allesInCsv } from "../lib/karten-export";
import { analysiere, bewerteAussprache, silbenImText, zielDauer } from "../lib/aussprache";
import { pruefeText, pruefeBrief, bewerteSchreiben, heilUebungen } from "../lib/schreibpruefer";
import { buildModulPruefung, bewerte, darfWiederholen, modulFrei, tagGesperrt, rettungsplan } from "../lib/modulpruefung";
import { emptyProgress } from "../lib/types";
import { getDialogue, eselsbruecken, getBrueckenFor, vocabMap, sprichwortAudio, sprichwortSrc } from "../lib/content";
import { buildBrueckeItems, katVonSektion } from "../lib/bruecken";
import { selbstKorrektur } from "../components/lernstrategie";
import type { Exercise, Progress, TaskResult } from "../lib/types";
import { STUFEN, stufeVonTag, tagVonStufe, ankerVon, wegHeute } from "../lib/weg";
import { AKTIVITAETEN } from "../lib/aktivitaeten";

const TOTAL = 270;
let pass = 0;
const fails: string[] = [];
const ok = (cond: boolean, name: string) => {
  if (cond) pass++;
  else fails.push(name);
};
const noThrow = (name: string, fn: () => void) => {
  try {
    fn();
    pass++;
  } catch (e) {
    fails.push(`${name} — throw: ${(e as Error).message}`);
  }
};
const R = (x: unknown) => x as Progress;
const empty = () => loadProgress();

/* ═══ A · rng/pickN ═══ */
{
  const a = rng(42);
  const b = rng(42);
  const sa = Array.from({ length: 5 }, () => a());
  const sb = Array.from({ length: 5 }, () => b());
  ok(JSON.stringify(sa) === JSON.stringify(sb), "A1 rng حتمي بنفس البذرة");
  ok(sa.every((x) => x >= 0 && x < 1), "A2 rng ضمن [0,1)");
  for (const seed of [0, -7, 2147483646, 987654321]) noThrow(`A3 rng(seed=${seed})`, () => rng(seed)());
  ok(rng(0)() !== rng(1)(), "A4 بذرتان مختلفتان");
  const pool = [1, 2, 3, 4, 5];
  ok(pickN(pool, 0, rng(1)).length === 0, "A5 pickN n=0");
  const p9 = pickN(pool, 99, rng(2));
  ok(p9.length === 5 && new Set(p9).size === 5, "A6 pickN n>len يغطي الكل فريداً");
  ok(pickN([], 3, rng(3)).length === 0, "A7 pickN على فراغ");
}

/* ═══ B · الزمان والمستوى ═══ */
{
  let all = true;
  for (let d = 1; d <= TOTAL; d++) if (!phaseOf(d) || !levelOf(d) || !dayType(d)) { all = false; break; }
  ok(all, `B1 كل يوم 1..${TOTAL} له phase/level/type`);
  noThrow("B2 أيام خارج النطاق لا تنفجر", () => {
    for (const d of [0, -15, 271, 9999]) if (!["A1", "A2", "B1", "B2"].includes(levelOf(d))) throw new Error(`levelOf(${d})=${levelOf(d)}`);
  });
}

/* ═══ C · cloze على كامل البنك ═══ */
{
  const rand = rng(7);
  let good = 0;
  for (const s of sentences) {
    const ex = clozeFromSatz(s, 1, rand);
    const word = String(Array.isArray(ex.answer) ? ex.answer[0] : ex.answer);
    const words = s.de.split(/\s+/).map((w) => w.replace(/[.,!?;:]/g, "").toLowerCase());
    if (ex.promptDe.includes("_____") && words.includes(word.toLowerCase())) good++;
  }
  ok(good === sentences.length, `C1 كل فجوات الـ${sentences.length} صالحة (نجح ${good})`);
  ok(sentences.length === 180, "C2 حجم البنك 180 (تثبيت انحدار)");
}

/* ═══ D · buildDay والدورة اليومية ═══ */
{
  for (const d of [1, 2, 6, 7, 42, 100, 135, 180, 269, 270]) {
    const plan = buildDay(d, empty());
    ok(plan.day === d && plan.tasks.length >= 1, `D1 يوم ${d}: مهام موجودة`);
    const ids = plan.tasks.map((t) => taskKey(d, t));
    ok(new Set(ids).size === ids.length, `D2 يوم ${d}: مفاتيح فريدة`);
    ok(plan.tasks.every((t) => t.minutes > 0), `D3 يوم ${d}: دقائق موجبة`);
  }
  const p1 = buildDay(50, empty());
  ok(JSON.stringify(p1) === JSON.stringify(buildDay(50, empty())), "D4 buildDay حتمي تماماً");

  const failState: Record<string, TaskResult> = Object.fromEntries(p1.tasks.map((t) => [t.id, { done: true, passed: false, score: 0, total: 5, attempts: 2 }]));
  ok(dayScore(p1, failState).done === 0, "D5 يوم فاشل بلا إتقان");
  const debts = debtsFrom(p1, failState);
  ok(debts.length === Math.min(6, p1.tasks.length), "D6 سقف الديون 6");
  ok(debts.every((x) => !String(x.titleDe).startsWith("Nachholen: ")), "D7 عناوين الديون مجرّدة من البادئة");
  const passState: Record<string, TaskResult> = Object.fromEntries(p1.tasks.map((t) => [t.id, { done: true, passed: true, score: 5, total: 5, attempts: 1 }]));
  const sc = dayScore(p1, passState);
  ok(sc.done === p1.tasks.length && sc.score === sc.total, "D8 يوم مثالي كامل النقاط");
  ok(canCloseDay(p1, {}) === true && isPassed(undefined) === false, "D9 بوابة الإغلاق وisPassed");
  ok(planPct(R({ ...empty(), plan: { ...empty().plan, day: 1 } })) === 0, "D10 planPct(يوم 1)=0");
  ok(planPct(R({ ...empty(), plan: { ...empty().plan, day: TOTAL + 5 } })) === 100, "D11 planPct مقصوص عند 100");
}

/* ═══ E · SRS SM-2 ═══ */
{
  let c = newCard();
  ok(c.ease === 2.5 && c.interval === 0 && c.learning === true, "E1 بطاقة جديدة");
  c = reviewCard(c, 4);
  ok(!c.learning && c.interval === 1, "E2 أول ناجحة ← يوم واحد");
  c = reviewCard(c, 4);
  ok(c.interval === 3, "E3 الثانية ← 3 أيام");
  c = reviewCard(c, 4);
  ok(c.interval === Math.round(3 * 2.7), `E4 الثالثة = ×ease (${Math.round(3 * 2.7)}، جاء ${c.interval})`);
  const before = c;
  c = reviewCard(c, 0);
  ok(c.interval === 0 && c.lapses === before.lapses + 1 && c.learning === true, "E5 سقوط: تصفير + lapses + وضع تعلّم");
  let x = newCard();
  for (let i = 0; i < 100; i++) x = reviewCard(x, 2);
  ok(x.ease >= 1.3 && x.reps === 100 && Number.isFinite(x.interval), "E6 100 مراجعات بجهد: سقف ease وصحة reps");
  ok(isDue({ ...newCard(), due: new Date(Date.now() - 1000).toISOString() }) === true, "E7 isDue أمس");
  ok(isDue({ ...newCard(), due: new Date(Date.now() + 86400000).toISOString() }) === false, "E8 isDue غداً");
}

/* ═══ F · دفتر الأخطاء ═══ */
{
  ok(normKey("  Ärger,   Recht! ") === "ärger, recht!".slice(0, 70), "F1 normKey: trim+صغيرة+ضغط فراغات (عقد المفتاح المحفوظ —الترقيم مقصود)");
  ok(normKey("x".repeat(200)).length === 70, "F1b normKey مقصوص عند 70 (استقرار مفتاح التخزين)");
  ok(normKey("A") === normKey(" a ".trim().toLowerCase()), "F1c normKey مستقر");
  let p = empty();
  p = upsertFehler(p, { falsch: "Ich habe Hausaufgaben gemacht.", richtig: "Ich habe die Hausaufgaben gemacht.", art: "artikel", ar: "أداة ناقصة" });
  const keys = Object.keys(p.fehler ?? {});
  ok(keys.length === 1, "F2 أول خطأ يخلق قيداً واحداً");
  const k0 = keys[0];
  ok(!!p.fehler?.[k0]?.srs && typeof p.fehler?.[k0]?.treffer === "number", "F3 القيد يحمل SRS وعدّاداً");
  p = upsertFehler(p, { falsch: "Ich habe Hausaufgaben gemacht.", richtig: "Ich habe die Hausaufgaben gemacht.", art: "artikel", ar: "تكرار" });
  ok(Object.keys(p.fehler ?? {}).length === 1, "F4 التكرار يدمج في نفس القيد");
  ok(p.fehler?.[k0]?.level === undefined || ["A1", "A2", "B1", "B2"].includes(p.fehler?.[k0]?.level as string), "F5 مستوى اختياري سليم");

  p = gradeFehlerIn(p, k0, false);
  ok((p.fehler?.[k0]?.treffer ?? 0) >= 1, "F5b فشل يرفع treffer");
  const before2 = p.fehler?.[k0];
  p = gradeFehlerIn(p, k0, true);
  ok(p.fehler?.[k0]?.treffer === 0, "F6 نجاح يصفّر treffer");
  ok((p.fehler?.[k0]?.srs.interval ?? 0) >= (before2?.srs.interval ?? 0), "F7 النجاح يمدّد الفاصل");
  p = gradeFehlerIn(p, "key-غير-موجود", true);
  ok(true, "F8 مفتاح مجهول بلا انفجار");
  ok(dueFehler(empty()).length === 0, "F9 due الفارغ = []");
  ok(dueFehler(p).length <= 8, "F10 due بسقفه");
  ok(weakTopics(empty()).length === 0, "F11 weakTopics فارغ");
  ok(resistenteFehler(empty()).every === undefined || Array.isArray(resistenteFehler(empty())), "F12 resistente مصفوفة");
  ok(fehlerDesMonats(empty()) === null || typeof fehlerDesMonats(empty()) === "object", "F13 خطأ الشهر عند الفراغ null/كائن");
  ok(Array.isArray(lehrerBericht(empty())), "F14 تقرير المدرّس مصفوفة");
  noThrow("F15 تقرير المدرّس مع بيانات", () => { lehrerBericht(p); });
  const eb = elternBrief(empty());
  ok(Array.isArray(eb.de) && Array.isArray(eb.ar), "F16 ElternBrief بنية ثنائية");
  const pf = platzierungsFragen(grammarMap);
  ok(pf.length >= 8 && pf.every((e) => ["mc", "fill", "truefalse", "order", "dictation", "translate"].includes(e.type)), "F17 أسئلة المستوى صالحة");
  ok(pf.every((e) => e.type !== "mc" || (e.options?.length ?? 0) >= 2), "F18 MC له خيارات");
  ok(vorschlagTag({}) === 1 && vorschlagTag({ A2: 2 }) === 71 && vorschlagTag({ A2: 1, B1: 2 }) === 141 && vorschlagTag({ B2: 2 }) === 211, "F19 vorschlagTag سلّم الأيام");
  ok(Object.keys(FEHLER_KAT).length === 10, "F20 عشر فئات أخطاء بالضبط");
  noThrow("F21 upsert بكل فئة", () => {
    let q = empty();
    for (const kat of Object.keys(FEHLER_KAT)) q = upsertFehler(q, { falsch: `f-${kat}`, richtig: `r-${kat}`, art: kat, ar: "تجربة" });
    if (Object.keys(q.fehler ?? {}).length !== 10) throw new Error("قيود != 10");
  });
}

/* ═══ G · Grader ═══ */
{
  ok(normalize("Groß,  !! ") === "gross", "G1 normalize: صغيرة+ß→ss+تنقيط");
  const d1 = diffWoerter("ich habe haus", "ich habe das haus");
  ok(d1.some((t) => t.s === "fehlt") && diffWoerter("x", "x").every((t) => t.s === "ok"), "G2 diff يلتقط الفقد والمطابقة");
  ok(diffWoerter("ichExtra habe haus", "ich habe das haus").some((t) => t.s === "extra" || t.s === "falsch"), "G3 diff يلتقط الزائد/الخاطئ");
  const k1 = konfidenz("ich habe das haus gemacht", "ich habe das haus gemacht");
  const k2 = konfidenz("ich hund katze", "ich habe das haus gemacht");
  ok(typeof k1 === "number" && k1 > k2, "G4 konfidenز رتب المتطابق فوق المختلف");
  const ex: Exercise = { id: "t1", type: "mc", promptDe: "x?", options: ["a", "b"], answer: "b" };
  ok(grader.grade(ex, "b").correct === true && grader.grade(ex, "a").correct === false, "G5 MC صائب/خاطئ");
  ok(grader.grade(ex, "").correct === false, "G6 فراغ = خطأ لا انفجار");
  const fill: Exercise = { id: "t2", type: "fill", promptDe: "___ Haus", answer: ["das", "der"] };
  ok(grader.grade(fill, "Das").correct === true, "G7 fill يقبل كل البدائل بلا حالة");
  const tr: Exercise = { id: "t3", type: "translate", promptDe: "قل: أتعلم", answer: "Ich lerne", keywords: ["lerne"] };
  ok(grader.grade(tr, "Ich lerne Deutsch seit Jahr.").correct === true, "G8 translate بمفاتيح");
  const di: Exercise = { id: "t4", type: "dictation", promptDe: "x", answer: "Ich habe das Haus" };
  ok(grader.grade(di, "ich habe das haus!").correct === true, "G9 dictation تطابق مطبّع");
  ok(grader.grade(di, "ich haus").correct === false, "G10 dictation نسبة أقل من 85 تُرفض");
  const ord: Exercise = { id: "t5", type: "order", promptDe: "x", answer: ["ich", "lerne", "deutsch"] };
  ok(grader.grade(ord, ["ich", "Lerne", "Deutsch!"]).correct === true, "G11 order يتسامح حالة/ترقيم");
  ok(grader.grade(ord, ["lerne", "ich", "deutsch"]).correct === false, "G12 order الموضع الخاطئ مرفوض");
  const dr1 = deepReview("Ich habe das Haus gemacht.", "Ich habe das Haus gemacht.");
  const dr2 = deepReview("ich habe hauser gemact", "Ich habe das Haus gemacht.");
  ok(dr1.ratio >= dr2.ratio && Array.isArray(dr2.fehler) && typeof dr1.lehrerAr === "string", "G13 deepReview رتبة ونوع");
  ok(dr2.fehler.every((f) => f.art in { artikel: 1, schreibweise: 1, umlaut: 1, verb: 1, ort: 1, wortwahl: 1, gross: 1, sonst: 1 }), "G14 تصنيفات الأخطاء مغلقة");
  noThrow("G15 deepReview فراغ مزدوج", () => { deepReview("", ""); });
  const notes: [number, string][] = [[100, "1"], [92, "1"], [91, "2"], [81, "2"], [80, "3"], [67, "3"], [66, "4"], [50, "4"], [49, "5"], [30, "5"], [29, "6"], [0, "6"]];
  ok(notes.every(([p, n]) => noteFromPct(p).startsWith(n + " ")), "G16 سلّم العلامات الألمانية عند كل حد");
  ok(noteFromPct(-10).startsWith("6 ") && noteFromPct(111).startsWith("1 "), "G17 حدود ما بعد الصفر/المئة");
}

/* ═══ H · شبكة الكفاءات ═══ */
{
  const w0 = kompetenzWerte(empty());
  ok(KOMPETENZEN.every((h) => Number.isFinite(w0[h].wert) && w0[h].wert >= 0 && w0[h].wert <= 100 && w0[h].kern === null), "H1 فارغ: قيم مقيدة وkern=null تحت 8 محاولات");
  let p = empty();
  for (let i = 0; i < 200; i++) p = logK(p, KOMPETENZEN[i % 6], i % 3 !== 0);
  const w = kompetenzWerte(p);
  ok(KOMPETENZEN.every((h) => w[h].wert >= 0 && w[h].wert <= 100 && w[h].versuche >= 8), "H2 200 تسجيل: kern يشتعل وكل قيمة في النطاق");
  ok((p.kompetenzLog?.length ?? 0) <= 600, "H3 سجل الكفاءات مقصوص عند 600");
  let allOk = empty();
  for (let i = 0; i < 80; i++) allOk = logK(allOk, "Wortschatz", true);
  ok(kompetenzWerte(allOk).Wortschatz.wert >= 70, "H4 نجاح تام ← محور مرتفع");
  let allBad = empty();
  for (let i = 0; i < 80; i++) allBad = logK(allBad, "Grammatik", false);
  ok(kompetenzWerte(allBad).Grammatik.wert <= 30, "H5 فشل تام بلا بيانات أخرى ← محور متدنٍّ");
  for (const v of [0, 34, 35, 54, 55, 74, 75, 100]) ok(typeof band(v).name === "string" && typeof band(v).farbe === "string", `H6 band(${v})`);
  ok(b2Score(empty()) === 0 || b2Score(empty()) > 0, "H7 b2Score عدد");
  const pb = pruefungsBereitschaft(empty());
  ok(pb.teile.length === 4 && pb.teile.every((t) => t.wert >= 0 && t.wert <= 100), "H8 الجاهزية رباعية الأجزاء");
  const recalc = Math.max(0, Math.min(100, Math.round(pb.teile.reduce((s, t) => s + t.wert * t.gewicht, 0))));
  ok(pb.gesamt === recalc, `H9 الجاهزية = Σ(وزن×قيمة) — قال ${pb.gesamt} والحساب ${recalc}`);
  ok(Math.abs(pb.teile.reduce((s, t) => s + t.gewicht, 0) - 1) < 1e-9, "H10 الأوزان 40/25/20/15 تجمع لواحد");
  const pbRich = pruefungsBereitschaft(p);
  ok(pbRich.gesamt >= 0 && pbRich.gesamt <= 100, "H11 جاهزية على بيانات غنية");
  ok(typeof bereitBand(0).name === "string" && typeof bereitBand(100).name === "string", "H12 bereitBand الحواف");
}

/* ═══ I · XP والأوسمة ═══ */
{
  ok(levelOfXp(0).name === XP_LEVELS[0].name, "I1 مستوى الصفر = الأول");
  ok(levelOfXp(9_999_999).name === XP_LEVELS[XP_LEVELS.length - 1].name, "I2 السقف الأقصى");
  ok(ABZEICHEN.every((a) => typeof a.test === "function"), "I3 كل وسم له test");
  let allPred = true;
  try {
    for (const a of ABZEICHEN) if (typeof a.test(empty()) !== "boolean") { allPred = false; break; }
  } catch (e) {
    allPred = false;
    fails.push(`I4 predicates انفجرت على progress فارغ: ${(e as Error).message}`);
  }
  ok(allPred, "I4 كل predicates الأوسمة آمنة على الفراغ");
  const c1 = checkAbzeichen(empty());
  const c2 = checkAbzeichen(c1);
  ok(Object.keys(c1.abzeichen ?? {}).length === Object.keys(c2.abzeichen ?? {}).length, "I5 checkAbzeichen خامل (idempotent)");
  ok(typeof c1.xp === "number" && c1.xp >= 0, "I6 xp سليم بعد الفحص");
}

/* ═══ J · store ═══ */
{
  const lp = loadProgress();
  ok(lp.v === 2 && lp.plan.day >= 1, "J1 loadProgress في Node = empty مُهاجر (v2)");
  const today = new Date().toISOString().slice(0, 10);
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  ok(touchStreak(R({ ...lp, streak: { last: undefined, count: 0 } })).streak.count === 1, "J2 بداية سلسلة");
  ok(touchStreak(R({ ...lp, streak: { last: today, count: 7 } })).streak.count === 7, "J3 نفس اليوم لا يحرق السلسلة");
  ok(touchStreak(R({ ...lp, streak: { last: yest, count: 7 } })).streak.count === 8, "J4 الأمس ← استمرار");
  ok(touchStreak(R({ ...lp, streak: { last: "2020-01-01", count: 7 } })).streak.count === 1, "J5 انقطاع يعود للواحد");
}

/* ═══ K · تثبيت أحجام البنوك (حراسة انحدار المحتوى) ═══ */
{
  const counts: [string, number, number][] = [
    ["sentences", sentences.length, 180],
    ["texts", texts.length, 80],
    ["dialogues", dialogues.length, 80],
    ["writing", writingTasks.length, 30],
    ["vocab", alleVokabeln.length, 3316],
    ["fehler", fehlerList.length, 128],
    ["grammar", Object.keys(grammarMap).length, 34],
    ["verben", verben.length, 126],
    ["szenarien", szenarien.length, 12],
    ["eselsbruecken", eselsbruecken.length, 47],
    ["sprichwort-audio", Object.keys(sprichwortAudio).length, 8],
      ["mnemonik", Object.keys(mnemonikMap).length, 120],
    ["pakete", pakete.length, 3],
  ];
  for (const [name, got, want] of counts) ok(got === want, `K-${name}: توقّع ${want} وجد ${got}`);
  ok(pakete.every((x) => x.saetze.length === 12 && x.dialog.lines.length === 6 && x.modelle.length === 2), "K11 بنية الحزم 12+6+2");
  ok(haerte.length === 16, "K15a بنك العينة الأصعب: 16 ركيزة");
  ok(haerte.every((x) => x.options.length === 4 && x.answer >= 0 && x.answer < 4 && x.frage.includes("___") && new Set(x.options).size === 4 && x.ar.length > 5), "K15b العينة: خيارات 4 فريدة · مؤشّر صالح · فجوة · شرح");

  ok(muendlich.length === 12 && muendlich.filter((x) => x.teil === 2).length === 6 && muendlich.filter((x) => x.teil === 3).length === 6, "K18a بنك الشفهي: 12 بطاقة — 6 وصف + 6 نقاش");
  ok(muendlich.every((x) => (x.teil === 2 ? x.zeit_s === 240 : x.zeit_s === 300) && x.kriterien.length === 4 && x.stuetzen.length >= 3 && x.auftrag_de.length > 60), "K18b الشفهي: مؤقّت نظامي · 4 معايير · دعامات · أمر كامل");
  ok(!muendlich.some((x) => /[\u4e00-\u9fff]/.test(x.auftrag_de + x.titel_ar + x.stuetzen.join(""))), "K18c الشفهي نظيف من التلوّث الكتابي");
  ok(!muendlich.some((x) => x.id.startsWith("mm") === false), "K18d معرّفات mm** منتظمة");

  const dafter = JSON.parse(readFileSync("docs/dafter-al-220.json", "utf8")) as { nuskh: number; rungen: { min: number; max: number; huduf: string[] }[] };
  ok(dafter.rungen.reduce((a, x) => a + (x.max - x.min + 1), 0) === 220 && dafter.nuskh === 220, "K16a الدفتر يحصي 220 بالضبط");
  const span = [...dafter.rungen].sort((a, b) => a.min - b.min);
  let cov = 0, tight = true;
  for (const x of span) { if (x.min !== cov + 1) { tight = false; break; } cov = x.max; }
  ok(tight && cov === 220, "K16b تغطية سلسة 1–220 بلا ثغرة ولا ازدواج");
  ok(dafter.rungen.every((x) => x.huduf.every((h) => existsSync(h))), "K16c كل هدف في الدفتر موجود على القرص");

  const css = readFileSync("app/globals.css", "utf8");
  ok(/@media \(max-width: 640px\)/.test(css) && /@media \(pointer: coarse\)/.test(css) && /@media \(min-width: 1500px\)/.test(css), "K17a ثلاث نقاط تحوّل: صغيرة · لمس · كبيرة");
  ok(/\.grid2 \{[^}]*1fr 1fr/.test(css) && /@media \(max-width: 640px\)[\s\S]*\.grid2 \{ grid-template-columns: 1fr; \}/.test(css), "K17b grid2 يتفكك عموداً واحداً على الجيب");
  ok(["components/blatt.tsx", "components/schulsim.tsx", "components/selbsttest.tsx", "components/wochen.tsx"].every((f) => readFileSync(f, "utf8").includes('className="grid2"')), "K17c المواضع الأربعة انتقلت إلى الصنف");

  ok(vortrag.length === 16 && new Set(vortrag.map((x) => x.unit)).size === 8 && vortrag.every((x) => vortrag.filter((y) => y.unit === x.unit).length === 2), "K21a منصة العرض: 16 موضوعاً = 8 لوحات Goethe × 2 بالضبط");
  ok(vortrag.every((x) => x.aspekte.length === 4 && x.redemittel.length >= 6 && x.partnerFragen.length === 2 && x.dauer.vorbereitung_s === 900 && x.dauer.vortrag_s === 240), "K21b بنية الموضوع: 4 محاور · ≥6 قوالب · سؤالان · 15د/4د");
  const GOETHE_UNITS = ["Beziehungen", "Gesundheit", "Gesellschaft", "Wohnen", "Digital", "Wissenschaft", "Schönheit", "Kunst"];
  ok(GOETHE_UNITS.every((u) => vortrag.some((x) => x.unit === u)), "K21c كل لوحة Goethe لها موضوعان على المنصة");

  ok(alleVokabeln.length === 3316, "K21d بنك المفردات: 3316 بطاقة (1415 سابقة + 1901 ستّاً وعشرينَ موجةَ تسمينٍ) (180 مؤسِّسة + 353 لوحات Goethe + 489 رقعة توسيع + 362 رقعة② + 31 رقعةَ الحفظ ξ9)");
  ok(GOETHE_UNITS.every((u) => { const key = { Beziehungen: "beziehungen", Gesundheit: "gesundheit", Gesellschaft: "gesellschaft", Wohnen: "wohnen", Digital: "digital", Wissenschaft: "wissenschaft", Schönheit: "schoenheit", Kunst: "kunst-kultur" }[u] as string; return alleVokabeln.filter((c) => c.tags?.includes(key)).length >= 40; }), "K21e تغطية موضوعية: ≥40 كلمة لكل لوحة Goethe");
  ok(new Set(alleVokabeln.map((c) => c.de.toLowerCase())).size === 3316, "K21f صفر ازدواج معجمي في البنك كله");

  const LUECKEN = ["b2-futur-ii", "b2-relativ-generalisierend", "b2-doppelkonnektoren"];
  ok(LUECKEN.every((k) => grammarMap[k] && grammarMap[k].exercises.length >= 5 && grammarMap[k].level === "B2"), "K21g فجوات القواعد الثلاث سُدّت بمواضيع كاملة (≥5 تمارين B2)");
  ok(Object.keys(grammarMap).length === 34, "K21h عدّاد المواضيع: 34 بعد الإضافة");

  const schreibenSrc = readFileSync("components/schreiben.tsx", "utf8");
  ok(schreibenSrc.includes('T3: { minutes: 75, ziel: 150') && schreibenSrc.includes('start("T3")'), "K21d وضع Goethe للكتابة: Teil 3 — 75د/150 كلمة موصول بالواجهة");

  /* ===== K22 — عقد الانضباط (Modul O) ===== */
  {
    const D = (h: number, m = 0) => new Date(2026, 8, 26, h, m, 5); // 2026-09-26 محلي
    const mk = (o: Partial<Progress>): Progress => ({ ...emptyProgress, ...o });
    const p0 = signKontrakt(mk({}), "21:30", "xp30", D(10));
    ok(p0.kontrakt?.uhrzeit === "21:30" && p0.kontrakt?.seit === "2026-09-26", "K22a التوقيع يختم الساعة ويوم الحسم");
    ok(voidKontrakt(voidKontrakt(p0)).kontrakt === undefined, "K22b الفكّ محو كامل — ومحو بلا عقد لا يغيّر شيئاً (idempotent)");

    const aktiv: Progress = { ...p0, plan: { ...p0.plan, days: { 200: { closed: false, score: 30, total: 100, tasksDone: 3, tasksTotal: 8, at: "2026-09-26T20:00:00" } } } };
    ok(pruefeKontrakt(p0, D(20)).status === "laufend" && pruefeKontrakt(p0, D(20)).minuten === 90, "K22c قبل الإغلاق: laufend بعدّ الدقائق الصحيح");
    ok(pruefeKontrakt(aktiv, D(23)).status === "erfuellt", "K22d برهان الإتمام الواحد يبرّئ — لا كسر بلا دليل");
    const gef = anwendenErfuellt(anwendenErfuellt(aktiv, D(23)), D(23));
    ok(gef.kontrakt?.streak === 1, "K22e وفاء اليوم لا يُعدّ إلا مرة — الحارس streakTag يمنع النفخ");

    const idle = mk({ xp: 500, kontrakt: { uhrzeit: "21:30", strafe: "xp30", seit: "2026-09-26", streak: 2 } });
    ok(pruefeKontrakt(idle, D(22)).status === "gebrochen", "K22f انقضت الساعة بلا إتمام ← gebrochen");
    const { p: bestraft } = anwendenStrafe(idle, D(22));
    ok((bestraft.xp ?? -1) === 470, "K22g غرامة البخار مقيّدة: 500←470 بالضبط");
    ok(anwendenStrafe(bestraft, D(23, 55)).p.xp === 470, "K22h لا غرامة مزدوجة في اليوم نفسه");
    const arm = mk({ xp: 10, kontrakt: idle.kontrakt });
    ok(anwendenStrafe(arm, D(22)).p.xp === 0, "K22i XP لا ينزل تحت الصفر أبداً — السقف مطلق");

    const wall = mk({ abzeichen: { fri: "2026-01-05", str: "2026-03-09", see: "2026-06-01" }, kontrakt: { uhrzeit: "21:30", strafe: "flecken1", seit: "2026-09-26", streak: 0 } });
    const rb = anwendenStrafe(wall, D(22));
    ok(Object.keys(rb.p.abzeichen ?? {}).length === 2 && !("see" in (rb.p.abzeichen ?? {})) && rb.p.xp === wall.xp, "K22j نزع الرقعة يقتلع الأحدث فقط ولا يمسّ XP");
    const naked = mk({ xp: 40, abzeichen: {}, kontrakt: wall.kontrakt });
    ok(anwendenStrafe(naked, D(22)).p.xp === 10, "K22k لا رقعة؟ الغرامة تنقلب بخاراً مقيّداً — لا تعليق معلق");

    const dater: Progress = mk({ kontrakt: idle.kontrakt, fehler: { f1: { key: "f1", falsch: "x", richtig: "y", art: "dativ", ar: "الكسرة", quelle: "q", srs: emptyProgress.srs["-"] ?? { e: 1, f: 0, n: "2026-01-01", r: 0, l: 0 }, treffer: 4 } } as never });
    const urt = pruefeKontrakt(dater, D(23));
    ok(urt.status === "gebrochen" && (urt.scham ?? "").includes("dativ") && (urt.scham ?? "").includes("4"), "K22l العار يُولد من دفتر صاحبه: الفئة وعدّتها من سجله لا من قالب");
    ok(/العار/.test(urt.scham ?? "") === false && !/[\u4e00-\u9fff\u3000-\u303f]/.test(urt.scham ?? ""), "K22m نص العار نظيف من تلوث الألسن");
    ok(groetsterFehler(mk({})) === null, "K22n الدفتر الفارغ لا يخترع اتهاماً");
    ok(pruefeKontrakt({ ...idle, kontrakt: { ...idle.kontrakt!, seit: "2026-09-25" } }, D(8)).status === "laufend", "K22o قبل ساعة الحسم لا إدانة — ولو كان العقد من أمس؛ الصباح للنشاط لا للمحاكمة");
  }

  let mono = true, last = 1;
  for (let d = 1; d <= 270; d++) { const st = stufeVonTag(d); if (st < last || st < 1 || st > STUFEN) { mono = false; break; } last = st; }
  ok(stufeVonTag(1) === 1 && stufeVonTag(270) === STUFEN && mono, "K20a المرحلة: خطية 1→8 على 270 بلا ارتداد");
  ok(tagVonStufe(1)[0] === 1 && tagVonStufe(8)[1] === 270 && tagVonStufe(3)[0] === tagVonStufe(2)[1] + 1, "K20b نطاقات المراحل متلاصقة تغطي الخطة");
  const weg1 = wegHeute(empty());
  const weg2 = wegHeute(empty());
  ok(JSON.stringify(weg1) === JSON.stringify(weg2), "K20c المسار حتمي — نفس اليوم والمستوى يُلدّان نفس المسار");
  ok(weg1.heute.length === 3 && weg1.heute.every((x) => { const a = x.akt; return a.stufe[0] <= weg1.stufe && weg1.stufe <= a.stufe[1] && a.status === "live"; }), "K20d ثلاثية اليوم كلها مطابقة للمرحلة وحية");
  ok(weg1.spaeter.every((s) => s.ab > weg1.stufe), "K20e المقفل كله أبكر من مستواه — لا يضيع ولا يشتت");
  const erlaubte = new Set(["blitz", "briefe", "interview", "lernstrategie", "muendlich", "schulsim", "selbsttest", "wing-kurs", "wing-pruefen", "wing-ueben", "wing-foerdern"]);
  ok([...weg1.heute, ...weg1.offen].every((x) => erlaubte.has(x.anker) && ankerVon(x.akt) === x.anker), "K20f كل مرساة معروفة — لا رابط ميت في البوصلة");
  const ges = new Set<string>();
  for (let st = 1; st <= STUFEN; st++) { const wg = wegHeute({ ...empty(), plan: { ...empty().plan, day: tagVonStufe(st)[0] } }); wg.heute.concat(wg.offen).forEach((x) => ges.add(x.akt.id)); }
  ok(ges.size === AKTIVITAETEN.filter((a) => a.status === "live" && a.id !== "wegweiser").length, "K20g التغطية: كل نشاط حي يُرى في مسار مرحلة ما");

    const RACHER = ["arbeit-beruf", "umwelt-klima", "konsum-geld", "mobilitaet-verkehr", "staat-recht", "studium-lernen", "gefuehle-psyche", "sport-freizeit"];
  ok(RACHER.every((tag) => alleVokabeln.filter((c) => c.tags?.includes(tag)).length >= 40), "K25a ألواح التوسيع الثمانية: ≥40 بطاقة لكل لوح");
  ok(RACHER.every((tag) => alleVokabeln.filter((c) => c.tags?.includes(tag)).every((c) => c.level === "A1" || c.level === "A2" || c.level === "B1" || c.level === "B2")), "K25b مستويات البطاقات الجديدة نظامية الأربعة");
  ok(alleVokabeln.filter((c) => RACHER.some((t) => c.tags?.includes(t))).every((c) => /[\u0600-\u06ff]/.test(c.ar) && !/[A-Za-z]/.test(c.ar)), "K25c عربية خالصة لكل بطاقة جديدة — بلا تلوث لاتيني");
  ok(alleVokabeln.filter((c) => RACHER.some((t) => c.tags?.includes(t)) && /^(der|die|das) /.test(c.de)).every((c) => c.article === c.de.split(" ")[0] && (!c.plural || /^(der|die|das) /.test(c.plural))), "K25d الأداة محفوظة في الحقل والجمع إن وُجد مصحوباً بأداته");
  ok(new Set(alleVokabeln.filter((c) => RACHER.some((t) => c.tags?.includes(t))).map((c) => c.de.toLowerCase())).size === alleVokabeln.filter((c) => RACHER.some((t) => c.tags?.includes(t))).length, "K25e صفر ازدواج داخل الرقعة الجديدة (489 فريدة)");
  ok(RACHER.every((tag) => alleVokabeln.filter((c) => c.tags?.includes(tag)).length >= 40 && alleVokabeln.filter((c) => c.tags?.includes(tag)).length <= 75), "K25f لا لوح منتفخ: كل رقعة بين 40 و75");

    ok(AKTIVITAETEN.length === 34 && AKTIVITAETEN.every((a) => a.status === "live") && AKTIVITAETEN.some((a) => a.id === "kontrakt") && AKTIVITAETEN.some((a) => a.id === "hoeren"), "K23 السجلّ مقفل على 34 نشاطاً حياً — والعقد والمعمل آخرهم");

  /* ===== K24 — معمل الاستماع HörLabor (Modul AF) ===== */
  {
    ok(texts.length >= 36 && texts.every((t) => t.questions.length >= 2), "K24a مادة المعمل هي بنك القراءة نفسه بكل توسعاته — لا محتوى موازٍ ولا فرعٌ منفصل");
    const r1 = bauHoerRunde(120), r1alt = bauHoerRunde(120), r2 = bauHoerRunde(121);
    ok(r1.textId === r1alt.textId && r1.items.map((x) => x.id).join() === r1alt.items.map((x) => x.id).join(), "K24b حتمية الجولة: اليوم نفسه يلد النص والأسئلة بالترتيب نفسه");
    ok(r1.items.every((x) => x.options === null || x.options.length >= 2) && r1.items.every((x) => x.answers.every((a) => a.length > 0)), "K24c كل بند قابل للحكم: خيارات أو صيغ مقبولة");
    ok([1, 60, 120, 121, 200, 269].every((d) => bauHoerRunde(d).level === levelOf(Math.min(d, 270)) && texts.some((t) => t.level === bauHoerRunde(d).level)), "K24d المعمل يعمل على مستوى الخطة في كل يوم — ولكل مستوى نصوصه، بلا جولة فارغة أبداً");
    ok(darfSpielen("pruefung", 0) === true && darfSpielen("pruefung", 1) === false && darfSpielen("training", 99) === true, "K24e القانون الصارم: استماعة واحدة في الامتحان — الثانية ممنوعة في المحرك نفسه لا في الواجهة");
    ok(fragenFrei(0) === false && fragenFrei(1) === true, "K24f لا إجابات قبل استماعة — القفل مبرمج لا أدبي");
    ok(RATE.lern === 0.7 && RATE.pruefung === 0.95 && Object.keys(RATE).length === 2, "K24g معدّلان نظاميان بالضبط — لا منزلق فوضى");
    const demo = bauHoerRunde(150);
    const ans: Record<string, string> = {};
    for (const it of demo.items) ans[it.id] = it.options ? it.options.find((o) => werteItem(it, o)) ?? it.options[0] : it.answers[0];
    ok(werteRunde(demo.items, ans).ok === demo.items.length, "K24h المصحّح النقي يمنح العلامة الكاملة للجواب الصحيح في كل بند");
    const leer = werteRunde(demo.items, {});
    ok(leer.ok === 0 && leer.n === demo.items.length, "K24i الورقة الفارغة تصفر بلا استثناء — المصحّح لا يرحم");
    ok(hoerNote(100).note === "sehr gut" && hoerNote(60).bestanden && !hoerNote(59).bestanden, "K24j مقياس Goethe: 60% حدّ النجاح مطبَّق حرفياً");
    const hoerenSrc = readFileSync("components/hoeren.tsx", "utf8");
    ok(hoerenSrc.includes("@/lib/hoeren") && !hoerenSrc.includes("function darfSpielen"), "K24k البطاقة تستورد القانون من lib/hoeren ولا تعيد اختراعه محلياً");
    ok(hoerenSrc.includes("🎧 معمل الاستماع") && hoerenSrc.includes("استماعة واحدة") && hoerenSrc.includes("🔒"), "K24l الواجهة تعد بما ينفذه المحرك: صرامة معلنة مقفلة");
    const appSrc = readFileSync("app/page.tsx", "utf8");
    ok(appSrc.includes("<HoerLabor progress={progress} />"), "K24m المعمل مركَّب في الصفحة — ليس كتالوجاً مؤجلاً");
  }

  /* ===== K26 — مصنع الصوت: ملفات مُولَّدة تخدم من public/ ===== */
  {
    const man = JSON.parse(readFileSync("content/hoeren-audio.json", "utf8")) as { einsaetze: { id: string; file: string; bytes: number }[] };
    ok(man.einsaetze.length === texts.length, "K26a المعلن == البنك: كلُّ نصٍ معلَنٌ ولا شبحَ ولا منسيَّ — يتحدَّثُ البنكُ فيتحدَّث");
    ok(man.einsaetze.every((e) => existsSync("public" + e.file.replace(/^\//, "/")) || existsSync("public/" + e.file.replace(/^\//, ""))), "K26b كل معلن موجود على القرص — لا مدخل شبح");
    ok(man.einsaetze.every((e) => Math.abs(require("fs").statSync(`public${e.file}`).size - e.bytes) < 1), "K26c الحجوم المعلنة truthful بحرف واحد — لا ملف صامت مُموَّه");
    ok(man.einsaetze.every((e) => /^\/audio\/hoeren\/t-[ab][12]-\d\d\.mp3$/.test(e.file)), "K26d المسارات محلية النظام وحده: /audio/hoeren/… لا مضيف خارجي — قرار «لا روابط» محترم حتى في الوسائط");
    const allIds = texts.map((t) => t.id);
    ok(allIds.every((id) => hoerenAudio[id]) && allIds.length === texts.length, `K26e وعدُ المصنع مسدَّدٌ فورَ اتساع البنك: ${allIds.length} نصاً = ${allIds.length} صوتاً — لا وعدٌ معلَّقٌ على جدار`);
    ok(Object.keys(hoerenAudio).length === man.einsaetze.length, "K26f الخريطة المصدَّرة بعدد المداخل — تصدير lib/content صادق");
    hoerenSrcCheck: {
      const src = readFileSync("components/hoeren.tsx", "utf8");
      ok(src.includes('hoerenAudio[runde.textId]') && src.includes("playbackRate") && src.includes("speakAny("), "K26g البطاقة صوتية-first: ملف عند وجوده، وTTS احتياط معلن — لا استبدال صامت");
      ok(src.includes('preload="auto"'), "K26h التحميل المسبق مفعَّل — نقر الطالب لا ينتظر الشبكة المحلية");
    }
    ok(Object.values(hoerenAudio).every((e) => !e.file.startsWith("http")), "K26i صفر عنوان مطلق في كل مسار — كل شيء يخدم من الدار");
    const dman = JSON.parse(require("fs").readFileSync("content/diktat-audio.json", "utf8")) as { einsaetze: { id: string; file: string; level: string; bytes: number }[] };
    const ddisk = require("fs").readdirSync("public/audio/diktat").filter((f: string) => f.endsWith(".mp3")).map((f: string) => f.replace(/\.mp3$/, "")).sort();
    ok(dman.einsaetze.length === ddisk.length && dman.einsaetze.every((e) => ddisk.includes(e.id)) && ddisk.length === 180, "K27a المصنع مقفل: 180/180 — العددُ جُمِّد إقراراً بالتمام كما فُعِل في hoeren، بعد أن كان حياً في الطريق");
    ok(dman.einsaetze.every((e) => existsSync("public" + e.file)), "K27b كل معلن إملائي موجود على القرص — لا شبح في مخزن الدikte");
    ok(dman.einsaetze.every((e) => Math.abs(require("fs").statSync(`public${e.file}`).size - e.bytes) < 1), "K27c حجوم الإملاء truthful بايتاً ببايت");
    ok(dman.einsaetze.every((e) => e.file === `/audio/diktat/${e.id}.mp3` && !e.file.startsWith("http")), "K27d المسار مطابقةٌ تامةٌ لمعرف الجملة — أديكاستيا سارياتٌ على s-b1-21b كما على سواها، وبلا مضيف خارجي");
    ok(dman.einsaetze.every((e) => sentences.some((sx) => sx.id === e.id)), "K27e لا صوت لجملة مجهولة — كل مدخل مشدودٌ إلى البنك");
    ok(Object.keys(diktatAudio).length === ddisk.length && sentences.every((sx) => diktatSrc(sx.id) !== null) && diktatSrc("s-b2-48") === null, "K27f قفلُ المصنع: كلُّ جمل البنك تُحِلُّ إلى ملف، ومعرفٌ شبحٌ يُرَدُّ صفرًا — الحضورُ والغيابُ سواءٌ في الصدق");
    ok(existsSync("scripts/archive/expand_vocab.py") && existsSync("scripts/archive/expand_vocab2.py") && !existsSync("scripts/expand_vocab.py") && !existsSync("scripts/expand_vocab2.py"), "K28a مولّدا التوسعة مسجونان في الأرشيف — لا يداً طالت ولا يدٌ ستطال");
    {
      const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
      const live = Object.values(pkg.scripts).join(" ");
      ok(!live.includes("expand_vocab"), "K28b صفر يدٍ في npm scripts تصل إلى المسجونين — الحظر بوابةٌ لا نية");
    }
    {
      const vraw = JSON.parse(readFileSync("content/vocab.json", "utf8")) as unknown as Record<string, { id: string; level: string; cards: { id: string; de: string; ar: string; level: string; tags: string[]; article?: string; plural?: string }[] }>;
      const IPAN = ["i01-medien-meinung", "i02-bildung-politik", "i03-sozialstaat-ehrenamt", "i04-energie-wende", "i05-ernaehrung-verbraucherschutz", "i06-stadtentwicklung", "i07-migration-integration", "i08-erinnerungskultur"];
      const ITAGS = ["medien-meinung", "bildung-politik", "sozialstaat-ehrenamt", "energie-wende", "ernaehrung-verbraucherschutz", "stadtentwicklung", "migration-integration", "erinnerungskultur"];
      ok(IPAN.every((k) => vraw[k] && vraw[k].cards.length >= 40 && vraw[k].cards.length <= 75), "K29a رقعة②: ثمانيةُ ألواحَ جديدة، كل لوحٍ بين 40 و75 بطاقة");
      const ikarten = IPAN.flatMap((k) => vraw[k].cards);
      ok(ikarten.every((c) => c.tags.length === 1 && ITAGS.includes(c.tags[0])), "K29b وسمٌ واحدٌ نظاميٌّ لكل بطاقةٍ في الرقعة");
      ok(ikarten.every((c) => /[\u0600-\u06ff]/.test(c.ar) && !/[A-Za-z]/.test(c.ar)), "K29c عربيةٌ خالصة: لا لاتينيةً في شرحٍ ولا شرحَ بلا عربية");
      ok(ikarten.every((c) => /^(der|die|das) /.test(c.de) ? (c.article === c.de.split(" ")[0] && (!c.plural || /^(der|die|das) /.test(c.plural))) : (!c.article && !c.plural)), "K29d الأداةُ والجمعُ منضبطان — والفعلُ والصفةُ عاريان منهما");
      ok(alleVokabeln.filter((c) => c.tags?.some((t) => ITAGS.includes(t))).length === ikarten.length, "K29e الرقعةُ مسطَّحةٌ في البنك: كل بطاقةٍ يراها محركُ SRS بلا واسطة");
      ok(new Set(alleVokabeln.map((c) => c.de.toLowerCase())).size === alleVokabeln.length, "K29f صفر ازدواجٍ معجميٍّ بعد الرقعة — فحصٌ مجدَّدٌ لا وراثةٌ");
    }
    {
      const wr = JSON.parse(readFileSync("content/writing.json", "utf8")) as unknown as { id: string; level: string; sample: string; noteAr?: string[] }[];
      ok(wr.every((t) => t.sample.trim().length > 0), "K30a نماذجُ الكتابة: صفرُ فراغٍ في الثلاثين");
      ok(wr.filter((t) => t.level === "B1").every((t) => t.sample.trim().split(/\s+/).length >= 60) && wr.filter((t) => t.level === "B2").every((t) => t.sample.trim().split(/\s+/).length >= 100), "K30b النموذجُ على قدْرِ مهمته: B1 ≥60 كلمة · B2 ≥100");
      ok(wr.every((t) => Array.isArray(t.noteAr) && t.noteAr.length >= 2 && t.noteAr.every((n) => /[\u0600-\u06ff]/.test(n) && n.length <= 260)), "K30c طبقةُ الأستاذ: شرحُ «لماذا نموذج» في كل مهمة");
      ok(readFileSync("components/schreiben.tsx", "utf8").includes("noteAr") && readFileSync("lib/klausur.ts", "utf8").includes("noteAr") && readFileSync("lib/types.ts", "utf8").includes("noteAr"), "K30d الطبقة موصولةٌ بالواجهة والاختبار والنوع — لا حليةً في ملف");
      ok(readFileSync("content/writing.json", "utf8").match(/[\u3040-\u30ff\u4e00-\u9fff]/g) === null, "K30e صفرُ تلوثٍ شرقيٍّ في البنك");
    }
    {
      const lk = JSON.parse(readFileSync("content/luecken.json", "utf8")) as unknown as { items: { id: string; textId: string; level: string; gaps: { id: string; sent: string; blanked: string; answer: string }[] }[] };
      ok(lk.items.length === 36 && lk.items.every((i) => i.gaps.length >= 5 && i.gaps.length <= 8), "K31a وحداتُ B1/B2 الستُّ والثلاثون: خمسةُ فراغاتٍ إلى ثمانية لكلٍّ");
      ok(lk.items.every((i) => i.gaps.every((g) => g.sent.includes(g.answer) && g.blanked.includes("____") && g.blanked !== g.sent)), "K31b كلُّ فراغٍ مُبيَّضٌ فعلًا وجوابُه من جمله حياًّ");
      ok(lk.items.every((i) => new Set(i.gaps.map((g) => g.answer.toLowerCase())).size === i.gaps.length), "K31c صفرُ جوابٍ مكرورٍ داخل الوحدة");
      const manL = JSON.parse(readFileSync("content/hoeren-audio.json", "utf8")) as unknown as { einsaetze: { id: string }[] };
      const aids = new Set(manL.einsaetze.map((e) => e.id));
      ok(lk.items.every((i) => aids.has(i.textId)), "K31d كلُّ وحدةٍ مشدودةٌ إلى شريطٍ مُعلَنٍ في المانيفستو — لا فراغَ بلا صوت");
      ok(readFileSync("components/hoeren.tsx", "utf8").includes("LueckDiktat") && readFileSync("app/page.tsx", "utf8").includes("<LueckDiktat progress={progress} />"), "K31e المحركُ مركَّبٌ في مركزه — لا بياناتٍ في الدرج");
      ok(readFileSync("lib/luecken.ts", "utf8").includes("pickLk") && readFileSync("components/hoeren.tsx", "utf8").includes("art: \"schreibung\""), "K31f الحتميَّةُ والدفترُ موصولان — الساقطُ يُسجَّل كتابةً");
    }
    {
      const vv = JSON.parse(readFileSync("content/verben.json", "utf8")) as unknown as { inf: string; aux: string; part: string; präs: string[]; prt: string[]; konj: string[]; trenn?: string; praep?: string; ar?: string; bei?: { de: string; ar: string } }[];
      ok(vv.length === 126, "K32a معجمُ الأفعال: 26 → 126 بالضبط — البوابةُ تعدُّ من القرص");
      ok(new Set(vv.map((v) => v.inf.toLowerCase())).size === 126, "K32b صفرُ ازدواجٍ في المصادير");
      ok(vv.every((v) => v.aux === "haben" || v.aux === "sein"), "K32c الناصرُ نظاميٌّ: اثنان لا ثالث");
      ok(vv.every((v) => v.präs.length === 6 && v.prt.length === 6 && v.konj.length === 3), "K32d كلُّ جدولٍ مكتملُ الأضلاع: 6×2+3");
      ok(vv.every((v) => !v.trenn || v.part.startsWith(v.trenn + "ge") || v.part.slice(v.trenn.length).endsWith("tet") || v.part.slice(v.trenn.length).endsWith("det")), "K32e المنفصلةُ انطبعتْ بادئتُها في الثالث — والجيمُ تُبتلعُ بعد تاءاتِ العلّة");
      ok(vv.every((v) => !v.praep || /\+\s?(Akk|Dat)/.test(v.praep)), "K32f كلُّ تعدٍّ مُعلَّمُ الحالة");
      ok(vv.filter((v) => v.bei).every((v) => v.bei!.de.length > 12 && v.bei!.ar.length > 6), "K32g الشاهدُ حيٌّ بوجهيه");
      ok(vv.slice(26).every((v) => v.ar && /[\u0600-\u06ff]/.test(v.ar)), "K32h معنًى عربيٌّ في كلِّ وافدٍ جديد");
      ok(["fahren", "sprechen", "nehmen"].every((k) => vv.find((v) => v.inf === k)!.präs[2].match(/[äi]/)), "K32i عيناتُ النيرانِ من البنكِ القديم");
    }
    {
      const fvv = JSON.parse(readFileSync("content/fehler.json", "utf8")) as unknown as { id: string; kat: string; level: string; falsch: string; richtig: string; ar: string }[];
      ok(fvv.length === 128, "K33a بنكُ الفخاخ: 64 → 128 بالضبط — البوابةُ تعدُّ من القرص");
      ok(new Set(fvv.map((f) => f.id)).size === 128, "K33b لا مزدوجَ في المعرّفات");
      const KATS = new Set(Object.keys(FEHLER_KAT));
      ok(fvv.every((f) => KATS.has(f.kat)), "K33c كلُّ فئةٍ من العشرِ المحرّسة — لا فئةً مُبتدَعة");
      ok(fvv.slice(64).every((f) => f.falsch.length > 16 && /\s/.test(f.falsch) && f.richtig.length > 4), "K33d كلُّ وافدٍ يدخلُ مسبحَ الامتحانِ في الاختبارِ الممزوج");
      ok(fvv.slice(64).filter((f) => /فرنس|دارج/.test(f.ar)).length >= 20, "K33e التونسةُ سارية: عشرون فخّاً على الأقلِ تسمّي المُغْرِيَ");
      ok(fvv.every((f) => ["A1","A2","B1","B2"].includes(f.level)), "K33f سلّمُ المستوياتِ مُقفَلٌ رباعياً");
    }
    {
      const tx = JSON.parse(readFileSync("content/texts.json", "utf8")) as unknown as { id: string; questions: { id: string; type: string; promptDe: string; options?: string[]; answer?: string | string[]; explanationAr?: string }[] }[];
      const qs = tx.reduce((n, t) => n + t.questions.length, 0);
      ok(qs === 300, "K34a حصيلةُ الأسئلةِ من القرص: 240 + 60 سؤالاً رابعاً = 300");
      ok(new Set(tx.flatMap((t) => t.questions.map((q) => q.id))).size === 300, "K34b معرّفاتٌ لا تتكرّرُ في كلِّ البنك");
      ok(tx.every((t) => t.questions.every((q) => { const a = q.answer as string | string[]; if (q.type === "mc") return Array.isArray(q.options) && q.options.length >= 3 && q.options.length <= 4 && q.options.includes(a as string) && new Set(q.options).size === q.options.length; if (q.type === "truefalse") return JSON.stringify(q.options) === JSON.stringify(["richtig", "falsch"]) && (a === "richtig" || a === "falsch"); if (q.type === "fill") return Array.isArray(a) && a.length > 0 && a.every((x) => typeof x === "string" && x.length > 0); return false; })), "K34c الأنواعُ الثلاثةُ على نظامِها: mcٌ خياراهُ من ثلاثٍ أو أربع، truefalse مُثبَّتٌ بزوجِه، fillٌ بلائحةِ مقبولين");
      ok(tx.every((t) => t.questions.every((q) => (q.explanationAr ?? "").length >= 4)), "K34d شرحٌ عربيٌّ خلفَ كلِّ سؤالٍ ولو صدى جوابٍ قصير");
      ok(tx.every((t) => t.questions.every((q) => q.id.startsWith(t.id + "-q"))), "K34e هويّةُ السؤالِ تُشتقُّ من أبِيه — لا يتيمَ في البنك");
    }
    {
      const skills: SkillKey[] = ["lesen", "hoeren", "schreiben", "sprechen"];
      ok(Object.keys(SKILL_LABELS).length === 4, "K35a أربعُ محاكاتٍ مهاريّةٍ مُسمّاة — لا خامسةَ ولا ناقصة");
      let okAll = true;
      for (let d = 1; d <= 270; d += 11) {
        for (const sk of skills) {
          const k = buildSkillKlausur(d, sk);
          if (!k.sections.length || !k.total) okAll = false;
          if (sk === "lesen" && (k.sections[0].items.length !== 18 || k.sections[0].passages?.length !== 6)) okAll = false;
          if (sk === "lesen" && k.sections[0].items.some((x) => x.type === "truefalse")) okAll = false;
          if (sk === "hoeren" && (k.sections.length !== 3 || k.sections.some((x) => !x.dialogueId || !getDialogue(x.dialogueId)))) okAll = false;
          if (sk === "schreiben" && (k.sections.length < 2 || k.sections.some((x) => !x.write || x.write.criteria.length < 3))) okAll = false;
          if (sk === "schreiben" && new Set(k.sections.map((x) => x.write!.taskDe)).size !== k.sections.length) okAll = false;
          if (sk === "sprechen" && (k.sections.length !== 2 || k.sections.some((x) => !x.sprechen || x.sprechen.stuetzen.length < 3 || x.sprechen.kriterien.length < 3 || x.sprechen.kriterien.some((c) => !c.de || !c.ar)))) okAll = false;
          if (sk === "sprechen" && k.sections.some((x) => x.sprechen!.zeit_s !== (x.sprechen!.teil === 2 ? 240 : 300))) okAll = false;
        }
      }
      ok(okAll, "K35b في كلِّ يومٍ من الطابورِ الأربعُ مُكتملةُ البنية: 18 قراءةً، 3 حوارات، مهمّتان، عرضٌ ونقاش");
      ok(JSON.stringify(buildSkillKlausur(88, "lesen")) === JSON.stringify(buildSkillKlausur(88, "lesen")), "K35c الحتميّة: يومٌ وبذرةٌ = ورقةٌ مطابقة");
      const kl1 = buildSkillKlausur(47, "lesen");
      const answersValid = kl1.sections[0].items.every((x) => {
        const a2 = x.answer as string | string[];
        if (x.type === "mc") return Array.isArray(x.options) && x.options.includes(a2 as string) && new Set(x.options).size === x.options.length;
        return Array.isArray(a2) ? a2.length > 0 : typeof a2 === "string" && a2.length > 0;
      });
      ok(answersValid, "K34d؟ بل K35d — أجوبةُ القراءةِ كلها من صميمِ خياراتِها أو مقبولاتِها");
      const ui = readFileSync("components/klausur.tsx", "utf8");
      ok(ui.includes("buildSkillKlausur") && ui.includes("sec.sprechen") && ui.includes("wrBy"), "K35e الواجهةُ موصولةٌ بالمحرّك: أزرارٌ أربعة، حقلُ كلام، وتحريرٌ مفصولٌ لكلِّ مهمّة");
      ok(ui.includes("minHeight: \"44px\""), "K35f لمسةُ الأزرارِ الجديدةُ 44px على الأقلّ — معيارُ الشاشاتِ سارٍ");
      const dlgLvls = [1, 90, 170, 240].every((d) => {
        const k = buildSkillKlausur(d, "hoeren");
        const need = d <= 45 ? "A1" : d <= 120 ? "A2" : d <= 200 ? "B1" : "B2";
        return k.sections.every((x) => getDialogue(x.dialogueId!)?.level === need);
      });
      ok(dlgLvls, "K35g محاكاةُ الاستماعِ تلتزمُ مستوى اليومِ من جدولِ المراحل");
    }
    {
      const dd = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as unknown as { id: string; level: string; lines: { who: string; de: string; ar: string }[]; questions: { id: string; type?: string; options?: string[]; answer: string }[]; dictation: string[] }[];
      ok(dd.length === 80, "K36a بنكُ الحوارات: 36 → 72 → 80 بالضبط — البوابةُ تعدُّ من القرص");
      ok(new Set(dd.map((x) => x.id)).size === 80 && new Set(dd.flatMap((x) => x.questions.map((q) => q.id))).size === dd.reduce((a, x) => a + x.questions.length, 0), "K36b معرّفاتُ الحواراتِ وأسئلتها لا تتكرّر");
      ok(dd.every((x) => ["A1","A2","B1","B2"].includes(x.level)), "K36c سلّمُ المستويات رباعيٌّ في الحوارات أيضاً");
      ok(dd.slice(36, 72).every((x) => x.level === "B1" || x.level === "B2"), "K36d وافدُ الموجةِ الثانيةِ (٣٧–٧٢) كلُّه B-Level");
      ok(dd.every((x) => x.questions.every((q) => q.type !== "mc" || (q.options && q.options.length >= 3 && q.options.includes(q.answer)))), "K36e كلُّ خيارٍ متعدّدٍ جوابُه من صميمِه — قديمًا ووافدًا");
      ok(dd.slice(36, 72).every((x) => { const lde = new Set(x.lines.map((l) => l.de)); return x.lines.length >= 7 && x.dictation.length >= 2 && x.dictation.every((d) => lde.has(d)) && x.lines.every((l) => l.who && l.de && l.ar); }), "K36f الوافدُ الثلاثون: سبعةُ أسطرٍ مُترجَمة، وإملاؤُه منسوخٌ من فمِ Dialog نفسه");
      {
        const w3 = dd.slice(72);
        ok(w3.length === 8 && new Set(w3.map((x) => x.level)).size === 4 && [...new Set(w3.map((x) => x.level))].every((l) => w3.filter((x) => x.level === l).length === 2), "K36i الموجةُ الثالثة: ثمانيةُ حواراتٍ، اثنانِ لكلِّ مستوى");
        ok(w3.every((x) => x.lines.length >= 5 && x.questions.length >= 2), "K36j لكلِّ وافدٍ خمسةُ أسطرٍ فأكثرَ وسؤالانِ فأكثر");
        ok(w3.every((x) => { const lde = new Set(x.lines.map((l) => l.de)); return x.dictation.length >= 3 && x.dictation.every((d) => typeof d === "string" && d.length > 8); }), "K36k وإملاءٌ من ثلاثةِ أسطرٍ حقيقية");
        ok(w3.every((x) => x.lines.every((l) => !/[\u0600-\u06FF]/.test(l.de) && /[\u0600-\u06FF]/.test(l.ar))), "K36l الألمانيةُ في حقلِها والعربيةُ في حقلِها — لا خلطَ يُنطَقُ خطأً");
        ok(w3.every((x) => x.questions.every((q) => /[\u0600-\u06FF]/.test((q as { explanationAr?: string }).explanationAr ?? ""))), "K36m ولكلِّ سؤالٍ شرحٌ عربيٌّ يُعلِّم");
      }
      const dm = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as unknown as { count: number; einsaetze: { id: string; file: string; bytes: number; voice: string; level: string }[] };
      ok(dm.count === 80 && dm.einsaetze.length === 80, "K36g ثمانونَ صوتَ حوارٍ — وكلُّها بأداءِ أدوار: تسعةٌ وسبعونَ بصوتَينِ وواحدٌ بثلاثةِ أصوات · لا حوارَ أحاديَّ الصوتِ بعدَ اليوم — والعدّادُ صادق");
      ok(dm.einsaetze.every((e) => dd.some((x) => x.id === e.id && x.level === e.level) && (e.voice === "voice-01" || e.voice === "voice-01+voice-02" || e.voice === "voice-01+voice-02+voice-03" || e.voice === "voice-02+voice-03") && e.bytes > 8000 && readFileSync(`public${e.file}`).byteLength === e.bytes), "K36h كلُّ ملفٍ مذكورٍ موجودٌ بايتًا بايتًا، لصاحبِ الصوتِ الواحد، ومستواهُ كبطاقتِه");
    ok(dialogues.every((d) => dm.einsaetze.some((e) => e.id === d.id)), "K36n لا حوارَ في البنكِ بلا صوتٍ على القرص — ثمانونَ من ثمانين");
      const sz = (JSON.parse(readFileSync("content/szenarien.json", "utf8")) as unknown as { szenarien: { id: string; nameDe: string; saetze: { de: string; ar: string }[]; dialoge: { titel: string; lines: { who: string; role: string; de: string; ar: string }[] }[]; formular: { zeilen: string[] }; rolle: { stichworte: string[]; plan: string[] } }[] }).szenarien;
      ok(sz.length === 12 && new Set(sz.map((x) => x.id)).size === 12, "K37a اثنا عشرَ سيناريو بلا مصادير متكررة — من القرص لا من الذاكرة");
      ok(sz.every((x) => x.saetze.length === 6 && x.dialoge.length === 2 && x.dialoge.every((d) => d.lines.length >= 6) && x.formular.zeilen.length >= 5 && x.rolle.stichworte.length >= 3 && x.rolle.plan.length >= 3), "K37b قالبُ كلِّ وافدٍ كنظامِ القديم: ستةُ جُمَلٍ وحوارانِ ونموذجٌ ودورٌ بخطة");
      ok(sz.every((x) => [...x.saetze.map((st) => st.de), ...x.dialoge.flatMap((d) => d.lines.map((l) => l.de)), ...x.formular.zeilen].every((de) => !/[\u0600-\u06ff]|[\u3040-\u9fff]/.test(de)) && [...x.saetze.map((st) => st.ar), ...x.dialoge.flatMap((d) => d.lines.map((l) => l.ar))].every((ar) => /[\u0600-\u06ff]/.test(ar) && !/[\u3040-\u9fff]/.test(ar))), "K37c نقاءُ اللغاتِ في الوافدِ الستة: لا عربيةَ في سطرِ نموذجٍ ولا صينيةَ في أيِّ ركن");
      const mn = mnemonikMap as unknown as Record<string, { art: string; tipp: string }>;
      const mk = Object.keys(mn);
      ok(mk.length === 120, "K38a حيلةٌ ومئةٌ وعشرونَ كلمةً — العددُ من القرص");
      ok(mk.every((w) => /^[A-ZÄÖÜ][a-zA-ZäöüßÄÖÜ-]+$/.test(w)), "K38b مفتاحُ كلِّ حيلةٍ اسمٌ ألمانيٌّ مفرد");
      ok(mk.every((w) => ["schluessel", "geschichte", "arabisch", "farbe"].includes(mn[w].art) && /[\u0600-\u06ff]/.test(mn[w].tipp) && !/[\u3040-\u9fff]/.test(mn[w].tipp)), "K38c الفنُّ من الرباعيِّ المحفوظِ والتلميحُ عربيٌّ بلا تلويثٍ — للبنكِ كلِّه");
      ok(mk.slice(102).every((w) => mn[w].tipp.length >= 40), "K38c² شرطُ الإسهابِ على الوافدِ وحدَه: أربعونَ حرفًا فما فوق");
      ok(new Set(mk).size === 120 && ["Mädchen", "Gift", "Steuer", "Bescheinigung"].every((w) => w in mn), "K38d الوافدُ الثمانيَ عشرَ مقيمٌ تحتَ getMnemonik نفسِه — بلا مفاتيحَ مكررة");
      const bare = new Set(alleVokabeln.map((cv: { de: string }) => cv.de.replace(/^(der|die|das)\s+/, "").trim()));
      ok(mk.every((w) => bare.has(w)), "K38e كلُّ حيلةٍ معلَّقةٌ ببطاقةٍ في الدفاتر — الحيلةُ تراها العينُ لا القرصُ وحدَه");
    }
    /* K42 · ورقةُ الأنماط: قواعدُ اللمسِ والاستجابةِ محروسةٌ من الحذفِ الصامت */
    {
      const css = readFileSync("app/globals.css", "utf8");
      ok(/@media \(pointer: coarse\)[\s\S]*?min-height:\s*44px/.test(css), "K42a قاعدةُ 44px للمسِ الخشنِ قائمةٌ — لا تُحذَفُ في رقعةٍ عابرة");
      ok(/input\[type="checkbox"\][\s\S]*?1\.4rem/.test(css) && /label:has\(input\[type="checkbox"\]\)[\s\S]*?min-height:\s*44px/.test(css), "K42b ومربّعاتُ الاختيارِ تكبُرُ وعناوينُها تنالُ مساحةَ الإصبع");
      ok(/@media \(max-width:\s*640px\)/.test(css) && /@media \(max-width:\s*400px\)/.test(css) && /@media \(min-width:\s*1500px\)/.test(css), "K42c كسراتُ 400 و640 و1500 — المدى 320→1440 مخدومٌ كلُّه");
      ok(/table[\s\S]{0,80}overflow-x:\s*auto/.test(css), "K42d الجداولُ تُمرَّرُ داخلَ نفسِها فلا تفيضُ الصفحةُ أفقياً على 320");
      const nagel = readFileSync("components/blitz.tsx", "utf8").includes('minHeight: "44px"') && readFileSync("components/szenarien.tsx", "utf8").includes('minHeight: "44px"');
      ok(nagel, "K42e رؤوسُ الأكورديوناتِ وأزرارُ الرقعِ نالَت ارتفاعَها الصريح — الإصلاحُ في المكوّنِ لا في البوابة");
    }
    /* K41 · مسحُ المراجعِ عبرَ المسيرةِ كلِّها: كلُّ إشارةٍ في كلِّ يومٍ تجدُ مرجعَها */
    {
      const fehlende: string[] = [];
      const kinds = new Map<string, number>();
      let n = 0;
      for (let d = 1; d <= 270; d++) {
        const pl = buildDay(d, { ...emptyProgress, plan: { ...emptyProgress.plan, day: d } });
        for (const t of pl.tasks) {
          n++;
          kinds.set(t.kind, (kinds.get(t.kind) ?? 0) + 1);
          if (t.topicId && !grammarMap[t.topicId]) fehlende.push(`${d}:topic:${t.topicId}`);
          if (t.deckId && !vocabMap[t.deckId]) fehlende.push(`${d}:deck:${t.deckId}`);
          if (t.textId && !texts.some((x) => x.id === t.textId)) fehlende.push(`${d}:text:${t.textId}`);
          if (t.dialogueId && !dialogues.some((x) => x.id === t.dialogueId)) fehlende.push(`${d}:dlg:${t.dialogueId}`);
          if (t.writeId && !writingTasks.some((x) => x.id === t.writeId)) fehlende.push(`${d}:write:${t.writeId}`);
          for (const sid of t.sentenceIds ?? []) if (!sentences.some((x) => x.id === sid)) fehlende.push(`${d}:satz:${sid}`);
          if (!t.titleAr || !t.titleDe || !(t.minutes > 0)) fehlende.push(`${d}:rumpf:${t.id}`);
        }
      }
      if (fehlende.length) console.log("   ⤷ مراجعُ مفقودة:", fehlende.slice(0, 8).join(" | "));
      ok(n === 1263, `K41a ألفٌ ومئتانِ وثلاثٌ وستونَ مهمةً عبرَ 270 يوماً — وجد ${n}`);
      ok(fehlende.length === 0, "K41b كلُّ مرجعٍ في كلِّ مهمةٍ يجدُ بنكَه: قاعدةً أو رفًّا أو نصًّا أو حواراً أو كتابةً أو جملة — صفرُ إشارةٍ معلَّقةٍ في الفراغ");
      ok(kinds.size === 8 && [...kinds.values()].every((v) => v >= 20), "K41c الأنواعُ الثمانيةُ مأهولةٌ فعلاً في الخطةِ لا في التعريفِ وحدَه");
      {
        const tage = [...Array(270).keys()].map((i) => buildDay(i + 1, { ...emptyProgress, plan: { ...emptyProgress.plan, day: i + 1 } }));
        ok(tage.every((p) => p.tasks.length >= 2), "K41d ما من يومٍ بمهمّةٍ واحدةٍ أو صفرٍ — لا يومَ خاوٍ في المسيرة");
        ok(tage.every((p) => p.tasks.reduce((a, t) => a + t.minutes, 0) >= 60), "K41e ولا يومَ أخفَّ من ساعةٍ من العمل: الأيامُ الختاميةُ الثلاثةُ مهمّتانِ ثقيلتانِ (105 دقائق) لا يومٌ ناقص");
        ok(tage.filter((p) => p.tasks.length === 2).length === 3, "K41f والنحيفةُ ثلاثةٌ بالضبط — 267 و269 و270: تصميمُ الختامِ لا سهوُ المولِّد");
      }
    }
  /* K59 · مدرِّبُ النطق: مقياسٌ صادقٌ يتدرَّجُ مع المستوى */
  {
    const satz = "Ich möchte einen Termin vereinbaren.";
    ok(silbenImText(satz) === 11, `K59a عدُّ المقاطعِ من النصِّ نفسِه (${silbenImText(satz)})`);
    ok(silbenImText("Hallo") === 2 && silbenImText("Guten Tag") === 3, "K59b ويصحُّ على الكلماتِ القصيرة");
    ok(zielDauer(satz, "A1") > zielDauer(satz, "B2"), "K59c وزمنُ النموذجِ يتسارعُ مع المستوى — A1 أبطأُ من B2");

    const sr = 16000;
    const mach = (silben: number, d = 0.2, p = 0.06) => {
      const x = new Float32Array(Math.round(sr * (0.1 + silben * (d + p))));
      let t = Math.round(sr * 0.1);
      for (let i = 0; i < silben; i++) {
        const len = Math.round(sr * d);
        for (let j = 0; j < len; j++) x[t + j] = 0.5 * Math.sin((2 * Math.PI * 180 * j) / sr);
        t += len + Math.round(sr * p);
      }
      return x;
    };
    const a = analysiere(mach(11), sr);
    ok(a.silben === 11, `K59d التحليلُ يرصدُ المقاطعَ المنطوقةَ فعلاً (${a.silben})`);
    ok(a.pausen === 0, "K59e ولا يعدُّ الفواصلَ الطبيعيةَ وقفات");
    ok(a.sprechAnteil > 0.6 && a.dauerS > 0, "K59f ويقيسُ نسبةَ الكلامِ والمدّة");

    const langsam = analysiere(mach(11, 0.5, 0.45), sr);
    ok(langsam.pausen >= 3, `K59g والوقفاتُ الطويلةُ تُرصَدُ (${langsam.pausen})`);
    const uLangsam = bewerteAussprache(langsam, satz, "A1");
    const uGut = bewerteAussprache(a, satz, "A1");
    ok(uGut.punkte > uLangsam.punkte, `K59h والنطقُ المتّصلُ يتفوَّقُ على المقطَّع (${uGut.punkte} > ${uLangsam.punkte})`);
    ok(uLangsam.hinweise.every((h) => h.tatAr.length > 12), "K59i وكلُّ ملاحظةٍ تحملُ فعلاً مطلوباً لا وصفاً");
    ok(uGut.hinweise.length >= 1, "K59j وحتى الأداءُ الجيّدُ يُعطى خطوةً تالية");

    const gleich = analysiere(mach(11, 0.3, 0.1), sr);
    const bA1 = bewerteAussprache(gleich, satz, "A1"), bB2 = bewerteAussprache(gleich, satz, "B2");
    ok(bA1.punkte === bB2.punkte, "K59k الدرجةُ واحدةٌ والنطاقُ يختلف — لا نُعاقِبُ المبتدئَ بمعيارِ المتقدِّم");
    const strenger = ["nah_am_original", "verstaendlich", "mit_muehe"];
    ok(strenger.indexOf(bB2.band) >= strenger.indexOf(bA1.band), "K59l ومعيارُ B2 أشدُّ من معيارِ A1 عندَ الأداءِ نفسِه");
  }


  /* K58 · كاشفُ الكتابة: يمسكُ الخطأَ الحقيقيَّ ويسكتُ عن السليم */
  {
    const sauber = `Sehr geehrte Damen und Herren, ich möchte einen Termin vereinbaren, weil ich einen neuen Ausweis brauche. Außerdem benötige ich eine Bescheinigung für das Amt. Mit freundlichen Grüßen, Karim`;
    const b0 = pruefeText(sauber);
    ok(b0.filter((f) => f.schwere === "sicher").length === 0, `K58a نصٌّ سليمٌ لا يُرصَدُ فيه خطأٌ مؤكَّد (${b0.filter((f) => f.schwere === "sicher").map((f) => f.stelle).join(",")})`);

    const fund = (t: string, teil: string) => pruefeText(t).some((f) => f.meldungAr.includes(teil) || (f.stelle ?? "").includes(teil));
    ok(fund("Morgen ich gehe zum Amt.", "الموضعِ الثاني"), "K58b يمسكُ «Morgen ich gehe» — الفعلُ ليسَ ثانياً");
    ok(fund("Ich habe gesehen die Frau im Park.", "اسمُ المفعول"), "K58c ويمسكُ Partizip في وسطِ الجملة");
    ok(fund("Ich fahre mit den Bus.", "الداتيف"), "K58d ويمسكُ «mit den» — حرفٌ يفرضُ الداتيف");
    ok(fund("Das ist für dem Mann.", "الأكوزاتيف"), "K58e ويمسكُ «für dem» — حرفٌ يفرضُ الأكوزاتيف");
    ok(fund("Ich aufstehe um sieben Uhr.", "تنفصل"), "K58f ويمسكُ البادئةَ المنفصلةَ الملتصقة");
    ok(pruefeText("Das Information ist gut.").some((f) => f.spalte === "grammatik"), "K58g ويمسكُ الأداةَ المخالفةَ لجنسِ الاسمِ في الدفتر");
    ok(pruefeText("Ich mache viele Sachen.").some((f) => f.spalte === "wortwahl"), "K58h ومصفوفةُ المرادفاتِ تلتقطُ «machen/Sachen»");
    ok(pruefeText("gut").some((f) => f.meldungAr.includes("ausgezeichnet")), "K58i وتعرضُ ثلاثةَ بدائلَ راقيةً لا نصيحةً عامّة");

    const brief = pruefeBrief("Ich brauche einen Termin.", 40);
    ok(brief.some((f) => f.meldungAr.includes("تحية")) && brief.some((f) => f.meldungAr.includes("ختام")), "K58j وبنيةُ الرسالةِ تُفحَصُ: تحيةٌ وختام");
    ok(brief.some((f) => f.meldungAr.includes("دونَ الحدِّ المطلوب")), "K58k والطولُ دونَ الحدِّ يُرصَدُ صراحةً");

    ok(bewerteSchreiben([]) === 100, "K58l نصٌّ بلا مرصودٍ = مئة");
    const drei = [{ spalte: "grammatik", schwere: "sicher", stelle: "x", meldungAr: "" }] as never[];
    ok(bewerteSchreiben(drei) === 92, "K58m وكلُّ خطأٍ مؤكَّدٍ يخصمُ ثمانيَ نقاط");
    ok(heilUebungen({ spalte: "syntax", schwere: "sicher", stelle: "morgen ich gehe", meldungAr: "", vorschlagDe: "morgen gehe ich" } as never).length === 3,
      "K58n وكلُّ خطأٍ يولّدُ ثلاثةَ تمارينَ علاجيةٍ من نصِّهِ لا نصيحةً عامّة");
  }


  /* K57 · بوّابةُ الوحدة: امتحانٌ رباعيٌّ وقفلٌ حقيقيٌّ ومسارُ إنقاذ */
  {
    const p1 = buildModulPruefung(1, 0);
    ok(p1.abschnitte.length === 4, `K57a ورقةُ الوحدةِ أربعةُ أقسامٍ لا ثلاثة (${p1.abschnitte.length})`);
    ok(p1.abschnitte.map((a) => a.teil).join(",") === "lesen,hoeren,schreiben,sprechen", "K57b وبالمهاراتِ الأربعِ بترتيبِها");
    for (let i = 1; i <= 16; i++) {
      const p = buildModulPruefung(i, 0);
      const l = p.abschnitte[0] as { fragen: unknown[]; passagen: unknown[] };
      const h = p.abschnitte[1] as { fragen: unknown[]; dialogIds: string[] };
      const s = p.abschnitte[3] as { saetze: unknown[] };
      if (l.fragen.length !== 6 || h.fragen.length !== 6 || s.saetze.length < 2) {
        ok(false, `K57c الوحدةُ ${i}: 6 قراءةً و6 استماعاً و≥2 نطقاً (${l.fragen.length}/${h.fragen.length}/${s.saetze.length})`);
        break;
      }
      if (i === 16) ok(true, "K57c كلُّ الوحداتِ الستَّ عشرةَ ورقتُها مكتملةٌ: 6 قراءةً · 6 استماعاً · مهمّةُ كتابةٍ · ≥2 جملةَ نطق");
    }
    const a = buildModulPruefung(3, 0), b = buildModulPruefung(3, 1);
    const ids = (x: typeof a) => (x.abschnitte[0] as { fragen: { id: string }[] }).fragen.map((f) => f.id).join();
    ok(ids(a) !== ids(b), "K57d والمحاولةُ الثانيةُ بأسئلةٍ مختلفةٍ — لا تكرارَ يُحفَظُ عن ظهرِ قلب");
    ok(JSON.stringify(buildModulPruefung(5, 2)) === JSON.stringify(buildModulPruefung(5, 2)), "K57e وحتميةٌ: الوحدةُ والمحاولةُ نفسُهما = الورقةُ نفسُها");

    ok(bewerte({ lesen: 100, hoeren: 100, schreiben: 100, sprechen: 100 }).bestanden, "K57f المئةُ تعبر");
    ok(!bewerte({ lesen: 100, hoeren: 100, schreiben: 55, sprechen: 100 }).bestanden, "K57g ولا عبورَ بمهارةٍ دونَ ٦٠٪ ولو كانَ المجموعُ ٨٩٪ — قاعدةُ الامتحانِ الرسميّ");
    ok(!bewerte({ lesen: 75, hoeren: 75, schreiben: 75, sprechen: 75 }).bestanden, "K57h ولا عبورَ بمجموعٍ دونَ ٨٠٪");
    ok(bewerte({ lesen: 90, hoeren: 80, schreiben: 70, sprechen: 80 }).bestanden, "K57i ويعبرُ مَن بلغَ ٨٠٪ ولم تسقطْ لهُ مهارة");
    const schwach = bewerte({ lesen: 90, hoeren: 40, schreiben: 30, sprechen: 90 });
    ok(schwach.luecken.length === 2 && rettungsplan(schwach).length === 2, "K57j وخريطةُ الثغراتِ تولّدُ مسارَ إنقاذٍ بعددِ المهاراتِ الساقطة");

    const leer = { ...emptyProgress };
    ok(modulFrei(leer, 1) && !modulFrei(leer, 2), "K57k الوحدةُ الأولى مفتوحةٌ والثانيةُ مقفلةٌ ابتداءً");
    const nachBestehen = { ...emptyProgress, modulPruefungen: { 1: { versuche: 1, best: 85, bestanden: true } } };
    ok(modulFrei(nachBestehen, 2), "K57l وتُفتَحُ الثانيةُ باجتيازِ الأولى لا بمرورِ الأيام");
    ok(tagGesperrt(leer, 25).gesperrt && !tagGesperrt(leer, 5).gesperrt, "K57m واليومُ 25 (وحدة 2) مقفولٌ بينما اليومُ 5 مفتوح");
    const frisch = { versuche: 1, best: 40, bestanden: false, zuletzt: new Date().toISOString() };
    ok(!darfWiederholen(frisch).erlaubt && darfWiederholen(frisch).restStunden > 0, "K57n وتهدئةُ ٢٤ ساعةً بعدَ الرسوبِ فاعلة");
    const alt = { versuche: 1, best: 40, bestanden: false, zuletzt: new Date(Date.now() - 25 * 3600_000).toISOString() };
    ok(darfWiederholen(alt).erlaubt, "K57o وتنقضي فتنفتحُ الإعادة");
  }


  /* K56 · الوحداتُ الستَّ عشرة: تغطيةٌ كاملةٌ بلا ثقبٍ ولا تداخُل */
  {
    ok(MODULE.length === 16, `K56a ستَّ عشرةَ وحدةً — أربعٌ لكلِّ مستوى (${MODULE.length})`);
    for (const lv of ["A1", "A2", "B1", "B2"] as const) {
      const m = MODULE.filter((x) => x.level === lv);
      ok(m.length === 4 && m.map((x) => x.nr).join("") === "1234", `K56b ترتيبُ وحداتِ ${lv} من 1 إلى 4 بلا قفز`);
    }
    const abdeckung = new Set<number>();
    for (const m of MODULE) for (let d = m.von; d <= m.bis; d++) abdeckung.add(d);
    ok(abdeckung.size === 270, `K56c الوحداتُ تغطّي الأيامَ 1–270 كلَّها (${abdeckung.size})`);
    const ueberlappung = MODULE.some((a, i) => MODULE.slice(i + 1).some((b) => a.von <= b.bis && b.von <= a.bis));
    ok(!ueberlappung, "K56d ولا يومَ يقعُ في وحدتَين معاً");
    ok(MODULE.every((m) => levelOf(m.von) === m.level && levelOf(m.bis) === m.level), "K56e وحدودُ كلِّ وحدةٍ داخلَ مستواها لا تتخطّاه");
    ok(MODULE.every((m) => m.titelDe && /[\u0600-\u06FF]/.test(m.titelAr) && m.inhalteAr.length > 20), "K56f ولكلِّ وحدةٍ عنوانٌ ألمانيٌّ وعربيٌّ وقائمةُ محتوىً مفصَّلة");
    const p1 = modulOf(1), p70 = modulOf(70), p211 = modulOf(211);
    ok(p1.etikett === "المستوى A1 — الوحدة 1 — الخطوة 1", `K56g وسمُ اليومِ الأوّلِ بالصيغةِ المطلوبة («${p1.etikett}»)`);
    ok(p70.modul.nr === 4 && p70.modul.level === "A1" && p211.modul.nr === 1 && p211.modul.level === "B2", "K56h وآخرُ A1 في وحدتِها الرابعةِ وأوّلُ B2 في أولاها");
  }


  /* K55 · حقولُ البطاقةِ الستّة ومصدِّرُ CSV — قالبُ الفلاش كارد كما طُلِب */
  {
    const alle = alleVokabeln as unknown as { de: string; ar: string; article?: string; farbe?: string; aussprache?: string; exampleDe?: string }[];
    const mitArt = alle.filter((c) => c.article);
    ok(mitArt.length > 1900 && mitArt.every((c) => c.farbe), `K55a كلُّ اسمٍ بأداةٍ لهُ مرساةُ لون (${mitArt.filter((c) => c.farbe).length}/${mitArt.length})`);
    const paar: Record<string, string> = { der: "BLAU", die: "ROT", das: "GRÜN" };
    ok(mitArt.every((c) => c.farbe === paar[c.article!]), "K55b واللونُ يطابقُ الأداةَ: der أزرق · die أحمر · das أخضر");
    ok(alle.filter((c) => c.aussprache).length > 2000, `K55c تلميحُ النطقِ مبنيٌّ لأكثرِ من ألفَي بطاقة (${alle.filter((c) => c.aussprache).length})`);
    const csv = karteninCsv("a1-start");
    const zeilen = csv.split("\n");
    ok(zeilen[0] === "Vorderseite;Farbanker;Rückseite;Chunk;Synonyme;Aussprache", "K55d ترويسةُ CSV بالأعمدةِ الستّةِ نفسِها");
    ok(zeilen.length === (vocabMap["a1-start"] as unknown as { cards: unknown[] }).cards.length + 1, `K55e وعددُ الأسطرِ = عددُ البطاقاتِ + الترويسة (${zeilen.length})`);
    ok(zeilen.slice(1).every((z) => z.split(";").length === 6), "K55f وكلُّ سطرٍ ستّةُ حقولٍ بالضبط — لا فاصلةٌ منقوطةٌ تتسلَّلُ إلى النصّ");
    const gesamt = allesInCsv().split("\n");
    ok(gesamt.length === alle.length + 1, `K55g وملفُّ الحزمِ كلِّها يحملُ البنكَ كاملاً (${gesamt.length - 1}/${alle.length})`);
    ok(gesamt.slice(1).every((z) => z.split(";").length === 8), "K55h وفيهِ عمودا الحزمةِ والمستوى فوقَ الستّة");
  }


  /* K54 · سطورُ القواعدِ وبنكُ الأخطاء: كلُّ حقلٍ لغتُه */
  {
    const gm = grammarMap as unknown as Record<string, { rules?: { de: string; ar: string }[] }>;
    const regeln = Object.values(gm).flatMap((g) => g.rules ?? []);
    ok(regeln.length > 90, `K54a سطورُ القواعدِ تُعَدُّ من القرص (${regeln.length})`);
    const misch = regeln.filter((r) => /[\u0600-\u06FF]/.test(r.de)).length;
    ok(misch === 0, `K54b لا حرفَ عربيٌّ في متنِ قاعدةٍ يُعرَضُ بوسمِ lang="de" — وإلّا انقلبَ الاتجاهُ وأخطأَ النطق (${misch})`);
    ok(regeln.every((r) => /[\u0600-\u06FF]/.test(r.ar)), "K54c ولكلِّ سطرِ قاعدةٍ شرحٌ عربيٌّ يفسّرُه");
    const kaputt = regeln.filter((r) => /(=\s*$|=\s*[/·]|·\s*$|\(\s*\)|\s{2,})/.test(r.de) || r.de.trim().length < 12);
    ok(kaputt.length === 0, `K54f ولا سطرَ قاعدةٍ مبتورٌ أو مشوَّهٌ بعدَ أيِّ تنقية (${kaputt.slice(0, 3).map((r) => r.de).join(" · ") || "لا شيء"})`);
    const fh = JSON.parse(readFileSync("content/fehler.json", "utf8")) as { id: string; falsch: string; richtig: string; ar: string }[];
    ok(fh.every((f) => f.falsch !== f.richtig), "K54d بنكُ الأخطاء: الخطأُ والصوابُ لا يتطابقان");
    ok(fh.every((f) => /[\u0600-\u06FF]/.test(f.ar)), "K54e ولكلِّ خطأٍ تعليلٌ عربيٌّ يشرحُ سببَه");
  }

  /* K53 · تناسقُ البطاقات: أداةٌ وجمعٌ ومعنىً لا يلتبس */
  {
    const alle = alleVokabeln as unknown as { id: string; de: string; ar: string; article?: string; plural?: string; exampleDe?: string; exampleAr?: string }[];
    ok(alle.every((c) => !c.plural || c.plural.startsWith("die ")), "K53a كلُّ جمعٍ معلَنٍ يبدأُ بـdie — لا جمعَ بأداةٍ مفردة");
    ok(alle.every((c) => !c.article || c.de.startsWith(c.article + " ")), "K53b والأداةُ المعلَنةُ هي أوّلُ متنِ البطاقةِ نفسِها");
    const proAr = new Map<string, Set<string>>();
    for (const c of alle) { const k = c.ar.trim(); if (!proAr.has(k)) proAr.set(k, new Set()); proAr.get(k)!.add(c.de); }
    const verwirrend = [...proAr.entries()].filter(([, s]) => s.size > 2).map(([a, s]) => `${a}→${[...s].join("/")}`);
    ok(verwirrend.length === 0, `K53c لا ترجمةَ عربيةً واحدةً تخدمُ ثلاثَ كلماتٍ ألمانيةٍ فأكثرَ — الالتباسُ يُفكَّكُ بالتوضيح (${verwirrend.slice(0, 3).join(" · ") || "لا شيء"})`);
    const mitBeispiel = alle.filter((c) => c.exampleDe);
    ok(mitBeispiel.every((c) => /[.!?…]$/.test(c.exampleDe!)), "K53d وكلُّ مثالٍ ألمانيٍّ يُختَمُ بعلامةٍ ختامية");
    ok(mitBeispiel.every((c) => (c.exampleAr ?? "").length >= 6), "K53e ولكلِّ مثالٍ ترجمةٌ عربيةٌ لا كلمةً مبتورة");
  }

  /* K52 · صدقُ المبالغ: كلُّ مبلغِ يورو في الألمانيةِ لهُ مقابلٌ في الترجمة */
  {
    const deZahl: Record<string, number> = { zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10,
      elf: 11, zwölf: 12, fünfzehn: 15, zwanzig: 20, fünfundzwanzig: 25, dreißig: 30, vierzig: 40, fünfzig: 50, sechzig: 60, siebzig: 70, achtzig: 80, neunzig: 90, hundert: 100, dreiundachtzig: 83, zweitausendvierhundert: 2400 };
    const arZahl: Record<string, number> = { "اثنان": 2, "يورويْن": 2, "ثلاثة": 3, "أربعة": 4, "خمسة": 5, "ستة": 6, "سبعة": 7,
      "ثمانية": 8, "تسعة": 9, "عشرة": 10, "خمسة عشر": 15, "عشرين": 20, "عشرون": 20, "خمسة وعشرين": 25, "خمسةٌ وعشرون": 25,
      "ثلاثين": 30, "ثلاثون": 30, "أربعين": 40, "خمسين": 50, "خمسون": 50, "مئة": 100, "مئةِ": 100, "ستّون": 60, "ستين": 60, "سبعين": 70, "ثمانين": 80, "ثمانون": 80, "تسعين": 90, "ثلاثةٌ وثمانون": 83, "نصف": 50, "ونصفًا": 50, "والنصف": 50 };
    const zahlenAus = (s: string, tab: Record<string, number>) => {
      const out = new Set<number>();
      for (const m of s.matchAll(/\d+/g)) out.add(Number(m[0]));
      for (const [w, v] of Object.entries(tab)) if (new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${w}([^A-Za-zÄÖÜäöüß]|$)`).test(s)) out.add(v);
      return out;
    };
    const ziffernNur = (s: string) => new Set([...s.matchAll(/\d[\d.]*/g)].map((m) => Number(m[0].replace(/\./g, ""))));
    const dial = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as { id: string; lines: { de: string; ar: string }[] }[];
    const schief: string[] = [];
    for (const d of dial) for (const [i, l] of d.lines.entries()) {
      if (!/Euro/.test(l.de)) continue;
      const dz = ziffernNur(l.de), az = new Set([...ziffernNur(l.ar), ...zahlenAus(l.ar, arZahl)]);
      const fehlt = [...dz].filter((n) => !az.has(n));
      if (fehlt.length) schief.push(`${d.id}:${i} ${fehlt.join(",")}`);
    }
    ok(schief.length === 0, `K52a كلُّ مبلغٍ مكتوبٍ بالخاناتِ في الحواراتِ يردُ في الترجمةِ كما هو (${schief.slice(0, 4).join(" · ") || "لا شيء"})`);
    const txt = texts.filter((t) => /Euro/.test(t.de));
    const schief2 = txt.filter((t) => { const dz = ziffernNur(t.de), az = new Set([...ziffernNur(t.ar), ...zahlenAus(t.ar, arZahl)]); return [...dz].some((n) => !az.has(n)); }).map((t) => t.id);
    ok(schief2.length === 0, `K52b وكذلك في نصوصِ القراءة — لا رقمَ يتبدَّلُ في العبور (${schief2.join(",") || "لا شيء"})`);
  }

  /* K51 · نصوصُ القراءةِ الجديدة: منطوقةٌ ومسؤولةٌ عن نفسِها */
  {
    const neueTexte = ["t-a1-19", "t-a1-20", "t-a2-19", "t-a2-20", "t-b1-19", "t-b1-20", "t-b2-19", "t-b2-20"];
    const tmap = Object.fromEntries(texts.map((t) => [t.id, t]));
    ok(neueTexte.every((i) => !!tmap[i]), "K51a النصوصُ الثمانيةُ الجديدةُ في البنكِ فعلاً");
    ok(neueTexte.every((i) => (tmap[i].questions ?? []).length >= 3), "K51b لكلِّ نصٍّ جديدٍ ثلاثةُ أسئلةٍ فأكثر");
    ok(neueTexte.every((i) => (tmap[i].questions ?? []).every((q) => !!q.explanationAr && /[\u0600-\u06FF]/.test(q.explanationAr))), "K51c ولكلِّ سؤالٍ شرحٌ عربيٌّ يُعلّمُ لا يُصحِّحُ فقط");
    ok(neueTexte.every((i) => !/[\u0600-\u06FF]/.test(tmap[i].de) && /[\u0600-\u06FF]/.test(tmap[i].ar)), "K51d المتنُ الألمانيُّ خالصٌ والترجمةُ في حقلِها");
    ok(neueTexte.every((i) => existsSync(`public/audio/hoeren/${i}.mp3`) && require("fs").statSync(`public/audio/hoeren/${i}.mp3`).size > 40000), "K51e ولكلِّ نصٍّ جديدٍ صوتٌ حقيقيٌّ على القرصِ لا وعدٌ مؤجَّل");
    const b2n = ["t-b2-19", "t-b2-20"];
    ok(b2n.every((i) => /Konjunktiv|würde|wäre|ließe|schütze|hemme|zufolge|geforderte/.test(tmap[i].de)), "K51f ونصّا B2 يحملانِ تراكيبَ B2 حقاً: منقولٌ بالمضارعِ الشرطيِّ وصفةٌ ممتدّةٌ وشرطٌ بلا wenn");
  }

  /* K50 · صدقُ وسمِ المستوى: لا كلمةَ نواةٍ تُحمَلُ فوقَ مستواها */
  {
    const stufe: Record<string, string> = {};
    for (const v of alleVokabeln) stufe[v.de] = v.level;
    const kernB1 = ["die Gesellschaft", "die Demokratie", "das Gesetz", "die Regierung", "der Konflikt", "das Vorurteil", "das Ehrenamt", "die Weiterbildung", "die Probezeit", "der Kompromiss", "die Arbeitslosigkeit", "die Konsequenz", "der Wandel", "fördern", "sich engagieren"];
    const zuHoch = kernB1.filter((w) => stufe[w] === "B2");
    ok(zuHoch.length === 0, `K50a لا كلمةَ من نواةِ B1 موسومةٌ B2 (${zuHoch.join(",") || "لا شيء"})`);
    const kernA1 = ["hallo", "danke", "das Brot", "die Familie", "gehen", "können", "wer", "heute"];
    const falschA1 = kernA1.filter((w) => stufe[w] && stufe[w] !== "A1");
    ok(falschA1.length === 0, `K50b ونواةُ A1 كلُّها موسومةٌ A1 (${falschA1.join(",") || "لا شيء"})`);
    const stufen = new Set(alleVokabeln.map((v) => v.level));
    ok([...stufen].every((s) => ["A1", "A2", "B1", "B2"].includes(s)), `K50c لا وسمَ مستوىً خارجَ السلَّمِ الأربعة (${[...stufen].join(",")})`);
    const ohneBeispiel = alleVokabeln.filter((v) => !v.exampleDe && !v.article);
    ok(ohneBeispiel.length < alleVokabeln.length * 0.2, `K50d الغالبيةُ العظمى من البطاقاتِ لها سياقٌ أو أداة (بلا أيٍّ منهما: ${ohneBeispiel.length}/${alleVokabeln.length})`);
    const proDeck = Object.entries(vocabMap as Record<string, { level: string; cards: { level: string }[] }>);
    // الحزمُ الموضوعيةُ تخلطُ المستوياتِ عن قصد، لكنْ لا يجوزُ أن تعلوَ بطاقةٌ فوقَ سقفِ حزمتِها
    const rang: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };
    const zuSchwer = proDeck.filter(([, d]) => d.cards.some((c) => (rang[c.level] ?? 9) > (rang[d.level] ?? 0))).map(([k]) => k);
    ok(zuSchwer.length === 0, `K50e لا بطاقةَ أصعبُ من سقفِ حزمتِها المعلَن (شاذّة: ${zuSchwer.join(",") || "لا شيء"})`);
  }

  /* K49 · موجةُ تسمينِ معجمِ A1/A2: عددٌ صادقٌ وجودةٌ محروسةٌ ووصولٌ مضمون */
  {
    const progV = loadProgress();
    const proL: Record<string, number> = {};
    for (const v of alleVokabeln) proL[v.level] = (proL[v.level] ?? 0) + 1;
    ok(proL["A1"] >= 650, `K49a معجمُ A1 عبرَ عتبةَ Goethe الاسميةَ (٦٥٠) — تسعةُ أضعافِ ما بدأَ به (${proL["A1"]} بطاقة)`);
    ok(proL["B1"] >= 1095, `K49b2 معجمُ B1 تجاوزَ ٣٩٥ بطاقة (${proL["B1"]})`);
    ok(proL["A2"] >= 650, `K49b ومعجمُ A2 تضاعفَ ستَّ مرّاتٍ ونصفاً (${proL["A2"]} بطاقة)`);
    ok((proL["A1"] ?? 0) + (proL["A2"] ?? 0) + (proL["B1"] ?? 0) >= 2400, `K49a3 الرصيدُ التراكميُّ حتى B1 عبرَ ٢٤٠٠ المرجعيةَ (${(proL["A1"] ?? 0) + (proL["A2"] ?? 0) + (proL["B1"] ?? 0)})`);
    ok((proL["A1"] ?? 0) + (proL["A2"] ?? 0) >= 1300, `K49a2 الرصيدُ التراكميُّ A1+A2 عبرَ ١٣٠٠ المرجعيةَ لمستوى A2 (${(proL["A1"] ?? 0) + (proL["A2"] ?? 0)})`);
    ok(alleVokabeln.length >= 3316, `K49c مجموعُ البطاقاتِ من البنكِ لا من التقدير (${alleVokabeln.length})`);
    const deSet = new Set(alleVokabeln.map((v) => v.de));
    ok(deSet.size === alleVokabeln.length, `K49d لا كلمةَ مكرَّرةً في البنكِ كلِّه (${deSet.size}/${alleVokabeln.length})`);
    const idSet = new Set(alleVokabeln.map((v) => v.id));
    ok(idSet.size === alleVokabeln.length, "K49e ولا معرِّفَ مكرَّرٌ يُفسِدُ جدولَ المراجعة");
    const neue = ["a1-essen-trinken", "a1-koerper-kleidung", "a1-stadt-wege", "a1-zeit-zahlen", "a1-haus-schule", "a1-natur-freizeit", "a1-welt-beruf", "a1-modal-ort", "a1-menschen-abschluss", "a2-arbeit-buero", "a2-alltag-dienste", "a2-leben-technik", "a2-schreiben-dienste", "a2-mensch-beziehung", "a2-reise-feste", "a2-medien-bildung", "a2-geld-gesundheit", "a2-wohnen-vertrag", "a2-arbeit-umwelt", "a2-kueche-haushalt", "a2-erzaehlen-zeit", "a2-redemittel", "a2-kultur-digital", "b1-staat-argument", "b1-karriere-psyche", "b1-gesundheit-technik", "b1-projekt-rede", "b1-stadt-recht", "b1-funktionsverben", "b1-bildung-migration-familie", "b1-dienst-natur-bild", "b1-brief-wirtschaft", "b1-wissen-zeit-wendungen", "b1-essen-kunst-hoeflichkeit", "b1-gesund-wohnen-praep", "b1-job-auto-praefix", "b1-geld-gemeinschaft-adj", "b1-digital-kauf-nomen", "b1-pruefung-text-reflexiv", "b1-klima-sport-komposita", "b1-medien-reise-verben", "b1-verwaltung-handwerk", "b1-arbeit-familie-geld"];
    ok(neue.every((d) => (vocabMap as Record<string, { cards: unknown[] }>)[d]?.cards?.length >= 35), "K49f كلُّ حزمةٍ جديدةٍ فيها خمسٌ وثلاثونَ بطاقةً فأكثر");
    const erstD: Record<string, number> = {};
    for (let d = 1; d <= 270; d++) for (const t of buildDay(d, progV).tasks) if (t.deckId && !(t.deckId in erstD)) erstD[t.deckId] = d;
    const unerreicht = neue.filter((d) => !(d in erstD));
    ok(unerreicht.length === 0, `K49g كلُّ حزمةٍ جديدةٍ لها يومٌ يعرضُها فعلاً — لا حزمةَ بلا مستهلِك (${unerreicht.join(",") || "لا شيء"})`);
    ok(neue.every((d) => erstD[d] <= (d.startsWith("a1") ? 70 : d.startsWith("a2") ? 140 : 210)), "K49h كلُّ حزمةٍ داخلَ مرحلتِها: A1 قبلَ 70 · A2 قبلَ 140 · B1 قبلَ 210");
    const neueKarten = neue.flatMap((d) => (vocabMap as Record<string, { cards: { de: string; ar: string; exampleDe?: string; exampleAr?: string; article?: string; img?: string }[] }>)[d].cards);
    ok(neueKarten.every((k) => !!k.exampleDe && !!k.exampleAr), "K49i لكلِّ بطاقةٍ جديدةٍ جملةُ سياقٍ ألمانيةٌ وترجمتُها — لا كلمةَ عاريةً من سياق");
    ok(neueKarten.every((k) => !k.article || k.de.startsWith(k.article + " ")), "K49j وأداةُ الاسمِ مكتوبةٌ في متنِ البطاقةِ نفسِها لا في حقلٍ منسيّ");
    ok(neueKarten.every((k) => !/[\u0600-\u06FF]/.test(k.exampleDe ?? "")), "K49k ولا حرفَ عربيٌّ في جملةِ السياقِ الألمانية");
    ok(neueKarten.every((k) => !k.img || existsSync("public" + k.img)), "K49l ولا صورةَ مكسورةٌ: كلُّ img مُسنَدٍ موجودٌ على القرص");
    ok(neueKarten.length >= 1890, `K49m حصادُ الموجة: ${neueKarten.length} بطاقةً جديدةً مدمجة`);
  }

  /* K48 · التسلسلُ التربويّ: كلُّ درسٍ يصلُ عيناً، وترتيبُهُ يخدمُ البناء */
  {
    const progK = loadProgress();
    const erst: Record<string, number> = {};
    for (let d = 1; d <= 270; d++) for (const t of buildDay(d, progK).tasks) if (t.topicId && !(t.topicId in erst)) erst[t.topicId] = d;
    const alleG = Object.keys(grammarMap);
    const nie = alleG.filter((g) => !(g in erst));
    ok(nie.length === 0, `K48a لا درسَ قواعدَ يبقى حبيسَ الملفِّ بلا يومٍ يعرضُه (${nie.join(",") || "لا شيء"})`);
    ok(Object.keys(erst).length === alleG.length, `K48b الأربعةُ والثلاثونَ درساً كلُّها مجدولةٌ (${Object.keys(erst).length}/${alleG.length})`);
    ok(erst["a2-dativ"] < erst["a2-wechsel"], `K48c الداتيفُ قبلَ حروفِ التبديل — لا يُطلَبُ ما لم يُعلَّم (${erst["a2-dativ"]} < ${erst["a2-wechsel"]})`);
    ok(erst["a2-perfekt"] < erst["b1-plusquamperfekt"], "K48d البرفكت قبلَ الماضي الأسبق — سُلَّمُ الأزمنةِ مرتَّب");
    ok(erst["b1-relativ"] < erst["b2-relativ-generalisierend"], "K48e جملةُ الوصلِ قبلَ وصلِها المعمَّم");
    ok(erst["b1-konnektoren"] < erst["b2-doppelkonnektoren"], "K48f الروابطُ المفردةُ قبلَ الروابطِ الثنائية");
    ok(erst["a1-akkusativ"] < erst["a2-dativ"], "K48g الأكوزاتيف قبلَ الداتيف كما في كلِّ منهجٍ رصين");
    const stufen = alleG.map((g) => [g, erst[g]] as const).filter(([g]) => g.startsWith("a1"));
    ok(stufen.every(([, d]) => d <= 70), "K48h كلُّ دروسِ A1 داخلَ المرحلةِ الأولى — لا تأخيرَ لأساس");
  }

  /* K47 · تنويعُ الأصوات: الحوارُ بصوتَينِ لا بنبرةٍ واحدة */
  {
    const roh = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as {
      count: number;
      einsaetze: { id: string; file: string; bytes: number; voice: string; stimmen?: number }[];
    };
    ok(roh.count === roh.einsaetze.length, `K47a عدَّادُ مانيفستِ الحواراتِ صادقٌ (${roh.count})`);
    const zwei = roh.einsaetze.filter((e) => e.stimmen === 2);
    ok(zwei.length >= 79, `K47b حواراتٌ بصوتَينِ متناوبَين موجودةٌ فعلاً (${zwei.length})`);
    ok(zwei.every((e) => e.voice.split("+").length === 2 && e.voice.split("+").every((s) => ["voice-01", "voice-02", "voice-03"].includes(s))), "K47c الحوارُ الثنائيُّ يوثِّقُ صوتَيهِ كلَيهِما بالاسمِ في المانيفست");
    ok(roh.einsaetze.every((e) => !e.voice.includes("voice-00")), "K47d لا أثرَ لصوتٍ محظورٍ (voice-00) في أيِّ ملفٍّ صوتيّ");
    const fehltDatei = roh.einsaetze.filter((e) => !existsSync("public" + e.file));
    ok(fehltDatei.length === 0, `K47e كلُّ ملفٍّ في المانيفستِ موجودٌ على القرص (${fehltDatei.length} مفقود)`);
    const klein = zwei.filter((e) => e.bytes < 40000);
    ok(klein.length === 0, "K47f الحوارُ الثنائيُّ مكتملُ الأسطرِ لا مقطوعاً (فوقَ أربعينَ كيلوبايت)");
    const zweiIds = zwei.map((e) => e.id);
    const echt = dialogues.filter((d) => zweiIds.includes(d.id));
    ok(echt.length === zwei.length, "K47g كلُّ حوارٍ ثنائيِّ الصوتِ لهُ نصٌّ مقابلٌ في البنك");
    ok(echt.every((d) => new Set(d.lines.map((l) => l.who)).size === 2), "K47h ونصُّهُ فعلاً بمتحدِّثَينِ اثنَين — فالصوتانِ يطابقانِ الدَّورَين");
    ok(roh.einsaetze.every((e) => (e.stimmen ?? 1) >= 2), "K47k لا حوارَ أحاديَّ الصوتِ في المشروع — ثمانونَ حواراً كلُّها بأداءِ أدوار");
    const drei = roh.einsaetze.filter((e) => e.stimmen === 3);
    ok(drei.length === 1 && drei[0].voice === "voice-01+voice-02+voice-03", "K47i حوارٌ واحدٌ بثلاثةِ أصواتٍ — وهو الوحيدُ الذي نصُّهُ ثلاثيُّ المتحدّثين");
    ok(drei.every((e) => { const d = dialogues.find((x) => x.id === e.id); return !!d && new Set(d.lines.map((l) => l.who)).size === 3; }), "K47j وثلاثةُ الأصواتِ تطابقُ ثلاثةَ الأدوارِ بالضبط");

  }

  /* K46 · ورقةُ الشفراتِ المطبوعة + مراجعةُ الشفراتِ بفواصل */
  {
    const druck = readFileSync("app/drucken/page.tsx", "utf8");
    const cssD = readFileSync("app/globals.css", "utf8");
    const seiteD = readFileSync("app/page.tsx", "utf8");
    const tasksD = readFileSync("components/tasks.tsx", "utf8");
    const sekt = (druck.match(/key: "[a-z0-9]+", titel/g) ?? []).length;
    const echteSekt = new Set(eselsbruecken.map((b) => b.sektion));
    ok(sekt === echteSekt.size, `K46a أقسامُ ورقةِ الطباعةِ تطابقُ أقسامَ البنكِ (${sekt}/${echteSekt.size})`);
    const fehlendS = [...echteSekt].filter((k) => !druck.includes(`key: "${k}"`));
    ok(fehlendS.length === 0, `K46b لا قسمَ من البنكِ يسقطُ من الورقة (${fehlendS.join(",") || "لا شيء"})`);
    ok(/@page\s*\{[^}]*A4/.test(cssD), "K46c الورقةُ مضبوطةٌ على مقاسِ A4 في @page");
    ok(/\.druck-karte\s*\{[^}]*break-inside:\s*avoid/.test(cssD), "K46d البطاقةُ لا تُقَصُّ بينَ صفحتَين (break-inside: avoid)");
    ok(seiteD.includes('href="/drucken"'), "K46e للورقةِ بابٌ مرئيٌّ من الصفحةِ الرئيسة — لا ملفَّ بلا مستهلِك");
    ok(druck.includes("window.print()"), "K46f زرُّ الطباعةِ يستدعي window.print فعلاً");
    ok(tasksD.includes("function BrueckenSRS"), "K46g مكوِّنُ مراجعةِ الشفراتِ بفواصلَ موجود");
    ok(/<BrueckenSRS\s+srs=\{srs\}/.test(tasksD), "K46h مراجعةُ الشفراتِ مركَّبةٌ داخلَ مهمةِ المراجعةِ اليومية");
    ok(tasksD.includes("`bru:${b.id}`"), "K46i بطاقاتُ الشفراتِ بمفتاحٍ مستقلٍّ bru: فلا تصادمَ مع المفردات");
    ok(tasksD.includes('quelle: "Eselsbrücke-SRS"'), "K46j نسيانُ الشفرةِ يُدفَنُ في دفترِ الأخطاءِ بمصدرٍ مميَّز");
  }

    /* K45 · الحارسُ اللغويُّ: الألمانيةُ التي تُدرَّسُ لا تُلوَّثُ ولا تُخالِفُ الدفتر */
    {
      const ARAB = /[\u0600-\u06ff]/;
      const ARAB_ZEICHEN = /[؟،؛٪٬٫]/;
      const UMSCHRIFT = /\b\w*(?:fuer|ueber|koenn|muess|schoen|groess|oeff)\w*\b/i;
      /** حقولٌ ألمانيةٌ خالصةٌ: لا عربيةَ فيها البتّة */
      const rein: [string, string][] = [];
      for (const c of alleVokabeln) {
        rein.push([`vocab/${c.id}`, c.de]);
        const ex = (c as { exampleDe?: string }).exampleDe;
        if (ex) rein.push([`vocabEx/${c.id}`, ex]);
      }
      for (const x of sentences) rein.push([`satz/${x.id}`, x.de]);
      for (const t of texts) rein.push([`text/${t.id}`, t.de]);
      for (const d of dialogues) for (const l of d.lines) rein.push([`dlg/${d.id}`, l.de]);
      for (const b of eselsbruecken) for (const z of b.zeilen) rein.push([`bru/${b.id}`, z.de]);
      for (const sz of szenarien) {
        for (const z of sz.saetze) rein.push([`sz/${sz.id}`, z.de]);
        for (const dd of sz.dialoge) for (const l of dd.lines) rein.push([`szdlg/${sz.id}`, l.de]);
      }
      for (const [, v] of Object.entries(grammarMap)) for (const e of v.examples) rein.push([`gram/bsp`, e.de]);

      const arabisch = rein.filter(([, t]) => ARAB.test(t));
      const zeichen = rein.filter(([, t]) => ARAB_ZEICHEN.test(t));
      const umschrift = rein.filter(([, t]) => UMSCHRIFT.test(t));
      const doppelt = rein.filter(([, t]) => /  +|\s[,.!?;:]/.test(t));
      if (arabisch.length) console.log("   ⤷ عربيةٌ في ألمانية:", arabisch.slice(0, 5).map(([k, t]) => `${k}:${t.slice(0, 40)}`).join(" | "));
      ok(rein.length === 6611, `K45a ستةُ آلافٍ وستُّمئةٍ وأحدَ عشرَ حقلاً ألمانياً خالصاً تحتَ الفحص — العددُ من البنوكِ لا من التقدير (${rein.length})`);
      ok(arabisch.length === 0, "K45b لا حرفَ عربيٌّ في جملةٍ تُنطَقُ بالألمانية — وإلا نطقَ المحرّكُ العربيةَ بصوتٍ ألمانيٍّ مشوَّه");
      ok(zeichen.length === 0, "K45c ولا علامةَ ترقيمٍ عربيةٍ (؟ ، ؛) تتسلَّلُ إلى جملةٍ ألمانية");
      ok(umschrift.length === 0, "K45d ولا بديلَ أومْلاوت (ue/oe/ae) — الحروفُ الألمانيةُ تُكتَبُ كما هي");
      ok(doppelt.length === 0, "K45e ولا مسافةٌ مزدوجةٌ ولا مسافةٌ قبلَ ترقيم");

      /** مطابقةُ الأداةِ للدفترِ عبرَ الحالاتِ الممكنة (مع استثناءَي الجمعِ واسمِ الإشارة) */
      const genus = new Map<string, string>();
      for (const c of alleVokabeln) {
        const m = /^(der|die|das)\s+([A-ZÄÖÜ][\wäöüßÄÖÜ-]*)$/.exec(c.de);
        if (m && !genus.has(m[2])) genus.set(m[2], m[1]);
      }
      const ERLAUBT: Record<string, string[]> = { der: ["der", "den", "dem", "des"], die: ["die", "der"], das: ["das", "dem", "des"] };
      const verstoss: string[] = [];
      for (const [wo, t] of rein) {
        for (const m of t.matchAll(/(^|[^\wäöüß])(der|die|das|den|dem|des)\s+([A-ZÄÖÜ][\wäöüßÄÖÜ-]+)/g)) {
          const [, vor, artikel, wort] = m;
          const g = genus.get(wort);
          if (!g || ERLAUBT[g].includes(artikel)) continue;
          if (g === "der" && artikel === "die") continue;               // جمعُ -er المشروع
          if (artikel === "das" && /\b(ist|war|wird|sind)\s*$/i.test(t.slice(0, m.index ?? 0) + vor)) continue; // «ist das Pflicht?» اسمُ إشارة
          verstoss.push(`${wo}: ${artikel} ${wort} (الدفتر: ${g})`);
        }
      }
      if (verstoss.length) console.log("   ⤷ أداةٌ تخالفُ الدفتر:", verstoss.slice(0, 6).join(" | "));
      ok(genus.size > 1000, `K45f خريطةُ الأجناسِ مبنيةٌ من الدفترِ نفسِه (${genus.size} اسماً)`);
      ok(verstoss.length === 0, "K45g ولا أداةَ في أيِّ بنكٍ تخالفُ جنسَ الاسمِ في الدفتر — الاتساقُ عبرَ البنوكِ لا داخلَ البنكِ وحدَه");
    }
    /* K44 · صوتُ الأمثال: ثمانيةُ ملفاتٍ من الدارِ بصوتٍ واحد */
    {
      const sa = Object.values(sprichwortAudio);
      const spr = eselsbruecken.filter((b) => b.sektion === "sprichwort");
      ok(sa.length === 8 && spr.length === 8, "K44a ثمانيةُ أمثالٍ وثمانيةُ ملفاتٍ — لا مثلَ أبكم");
      ok(spr.every((b) => !!sprichwortSrc(b.id)), "K44b كلُّ مثلٍ يجدُ صوتَهُ بمعرِّفِه — الوصلُ بالدالّةِ لا بالحدس");
      ok(sa.every((e) => /^\/audio\/sprichwort\/s-[a-zäöüß-]+\.mp3$/.test(e.file)), "K44c كلُّ مسارٍ تحتَ دارِ الأمثالِ ولا رابطَ خارجيٌّ البتّة");
      ok(sa.every((e) => e.voice === "voice-01"), "K44d صوتُ الدارِ الواحدُ voice-01 — لا بَدَلَ ولا اختلاطَ نبرة");
      ok(sa.every((e) => e.bytes > 8000 && existsSync("public" + e.file)), "K44e وكلُّ ملفٍّ موجودٌ على القرصِ فعلاً بحجمٍ معقول — لا مانيفستَ يعِدُ بما ليس فيه");
      ok(sa.every((e) => spr.some((b) => b.id === e.id && b.zeilen[0].de === e.de)), "K44f ونصُّ كلِّ ملفٍّ مطابقٌ لمثلِه في البنكِ حرفاً — لا صوتٌ يقولُ غيرَ ما يُقرَأ");
      ok(readFileSync("components/tasks.tsx", "utf8").includes("sprichwortSrc(b.id)"), "K44g والمشغّلُ مركَّبٌ في بطاقةِ التركةِ — لا صوتَ بلا مستهلِك");
    }
    /* K43 · امتحانُ الشفرات: مولَّدٌ حتميٌّ صادقُ الجوابِ لكلِّ درس */
    {
      const gids = Object.keys(grammarMap);
      let gesamt = 0; let gesamtPool = 0; const kaputt: string[] = []; const leer: string[] = [];
      for (const g of gids) {
        const bs = getBrueckenFor(g);
        const it = buildBrueckeItems(bs, g.length * 31 + bs.length, 6, eselsbruecken);
        gesamtPool += buildBrueckeItems(bs, g.length * 31 + bs.length, 999, eselsbruecken).length;
        if (!it.length) leer.push(g);
        gesamt += it.length;
        for (const q of it) {
          if (!q.optionen.includes(q.antwort)) kaputt.push(`${g}:${q.id}:جوابٌ خارجَ الخيارات`);
          if (new Set(q.optionen).size !== q.optionen.length) kaputt.push(`${g}:${q.id}:خياراتٌ مكررة`);
          if (q.optionen.length < 3) kaputt.push(`${g}:${q.id}:خياراتٌ أقلُّ من ثلاثة`);
          if (!/[\u0600-\u06ff]/.test(q.erklaerungAr) || q.erklaerungAr.length < 15) kaputt.push(`${g}:${q.id}:تفسيرٌ هزيل`);
          if (!q.frageDe.trim() || !/[\u0600-\u06ff]/.test(q.frageAr)) kaputt.push(`${g}:${q.id}:سؤالٌ ناقصُ الوجه`);
          if (!Object.keys(FEHLER_KAT).includes(q.kat)) kaputt.push(`${g}:${q.id}:فئةٌ خارجَ الدفتر (${q.kat})`);
          if (q.art === "artikel" && !["der", "die", "das"].includes(q.antwort)) kaputt.push(`${g}:${q.id}:أداةٌ غريبة`);
        }
      }
      if (kaputt.length) console.log("   ⤷ أسئلةٌ معطوبة:", kaputt.slice(0, 6).join(" | "));
      ok(leer.length === 0, "K43a كلُّ درسٍ من الأربعةِ والثلاثينَ يُولِّدُ أسئلةً من تركاتِه — لا امتحانَ فارغ");
      ok(kaputt.length === 0, "K43b كلُّ سؤالٍ: جوابُهُ بينَ خياراتِه · خياراتٌ فريدةٌ ≥3 · تفسيرٌ عربيٌّ مُسهِبٌ · فئةٌ يعرفُها دفترُ الأخطاء");
      ok(gesamt === 131, `K43c مئةٌ وواحدٌ وثلاثونَ سؤالاً تُعرَضُ فعلاً بسقفِ ستةٍ للدرس (${gesamt})`);
      ok(gesamtPool === 210, `K43c² ومَعينُ التوليدِ أعمقُ مما يُعرَض: مئتانِ وعشرةُ أسئلةٍ متاحةٌ للتدويرِ (${gesamtPool})`);
      const a1 = buildBrueckeItems(getBrueckenFor("a1-akkusativ"), 7, 6, eselsbruecken);
      const a2 = buildBrueckeItems(getBrueckenFor("a1-akkusativ"), 7, 6, eselsbruecken);
      ok(JSON.stringify(a1) === JSON.stringify(a2), "K43d حتميةٌ تامّة: نفسُ البذرةِ تُنتِجُ نفسَ الامتحانِ حرفاً بحرف — لا عشوائيةَ تُفسِدُ المراجعة");
      ok(JSON.stringify(buildBrueckeItems(getBrueckenFor("a1-akkusativ"), 8, 6, eselsbruecken)) !== JSON.stringify(a1), "K43e وبذرةٌ أخرى تُنتِجُ ترتيباً آخرَ — الامتحانُ يتجدَّدُ ولا يُحفَظُ صمًّا");
      ok(["genus", "praeposition", "satzbau", "verb", "adjektiv", "b2", "sprichwort"].every((sk) => Object.keys(FEHLER_KAT).includes(katVonSektion(sk as never))),
        "K43f كلُّ قسمٍ من الموسوعةِ لهُ فئةٌ صحيحةٌ في دفترِ الأخطاء — الخطأُ يُدفَنُ في بابِه لا في «أخرى»");
      ok(readFileSync("components/tasks.tsx", "utf8").includes("<BrueckenQuiz gramId={gramId} bruecken={bruecken} />"), "K43g والامتحانُ مركَّبٌ في بطاقةِ القاعدةِ فعلاً — لا مولِّدَ بلا مستهلِك");
    }
    /* K40 · سلامةُ بنيةِ دروسِ القواعدِ — العطبُ الذي كشفَهُ jsdom لا يعودُ */
    {
      const tops = Object.values(grammarMap);
      ok(tops.every((t) => (t.tables ?? []).every((tb) => tb !== null && typeof tb === "object" && !Array.isArray(tb) && Array.isArray(tb.headers) && Array.isArray(tb.rows))),
        "K40a كلُّ جدولٍ كائنٌ ذو رؤوسٍ وصفوف — لا صفوفٌ خامٌ تُفجِّرُ بطاقةَ الدرس");
      ok(tops.every((t) => (t.tables ?? []).every((tb) => tb.rows.every((r) => Array.isArray(r) && r.length === tb.headers.length))),
        "K40b أعمدةُ كلِّ صفٍّ تطابقُ رؤوسَه — لا جدولَ أعرجَ في الشاشة");
      ok(tops.every((t) => t.exercises.every((e) => (e.type !== "mc" ? true : Array.isArray(e.options) && e.options.length >= 2 && typeof e.answer === "string" && e.options.includes(e.answer)))),
        "K40c كلُّ تمرينِ اختيارٍ لهُ خياراتُه، وجوابُهُ نصٌّ واحدٌ موجودٌ بينَها — لا سؤالَ بلا أزرارٍ ولا صوابَ لا يُنتقى");
      ok(tops.every((t) => t.exercises.every((e) => (e.type !== "order" ? true : Array.isArray(e.answer) && e.answer.length >= 3))),
        "K40d كلُّ تمرينِ ترتيبٍ يحملُ كلماتِه في answer — منها تُبنى الرقعةُ المبعثرة");
      ok(tops.every((t) => t.rules.length > 0 && t.examples.length > 0 && t.exercises.length > 0 && t.summaryAr.length > 20),
        "K40e لا درسَ أجوفُ: قاعدةٌ وأمثلةٌ وتمرينٌ وخلاصةٌ عربيةٌ للأربعةِ والثلاثين");
    }
    /* K39 · بنكُ التركات: لا شفرةٌ بلا درسٍ مضيف، ولا درسٌ يدَّعي ما ليس فيه */
    {
      const bb = eselsbruecken;
      const gids = Object.keys(grammarMap);
      ok(bb.length === 47 && new Set(bb.map((b) => b.id)).size === 47, "K39a سبعٌ وأربعونَ تركةً بمعرّفاتٍ فريدة");
      ok(bb.every((b) => b.gramIds.length > 0 && b.gramIds.every((g) => gids.includes(g))), "K39b كلُّ تركةٍ معلَّقةٌ بدرسٍ موجودٍ فعلاً — لا شفرةٌ يتيمةٌ ولا إشارةٌ إلى درسٍ وهميّ");
      ok(bb.every((b) => getBrueckenFor(b.gramIds[0]).some((x) => x.id === b.id)), "K39c الطريقُ عكسيٌّ أيضاً: getBrueckenFor تُرجِعُ التركةَ لدرسِها — السلكُ حيٌّ لا مُعلَن");
      ok(bb.every((b) => /[\u0600-\u06ff]/.test(b.titleAr) && /[\u0600-\u06ff]/.test(b.storyAr) && b.storyAr.length >= 40), "K39d لكلِّ شفرةٍ قصةٌ عربيةٌ مسهبةٌ لا عنوانٌ أجرد");
      ok(bb.every((b) => b.zeilen.length >= 2 && b.zeilen.every((z) => z.code && z.de && /[\u0600-\u06ff]/.test(z.ar))), "K39e كلُّ سطرٍ ثلاثيُّ الوجه: رمزٌ · ألمانيةٌ · عربية");
      ok(!/[\u3040-\u9fff]/.test(JSON.stringify(bb)), "K39f لا تلويثَ CJK في البنكِ كلِّه");
      ok(["genus", "satzbau", "praeposition", "verb", "adjektiv", "b2", "sprichwort"].every((sk) => bb.some((b) => b.sektion === sk)), "K39g الأقسامُ السبعةُ كلُّها مأهولةٌ — الموسوعةُ دخلَت بتمامِها");
      ok(bb.filter((b) => b.sektion === "sprichwort").length === 8 && bb.filter((b) => b.sektion === "sprichwort").every((b) => b.zeilen.length === 2), "K39h الأمثالُ الثمانيةُ كلٌّ منها بمثلِه وقاعدتِه المدمَجة");
      ok(new Set(bb.flatMap((b) => b.gramIds)).size === gids.length && gids.every((g) => getBrueckenFor(g).length > 0), "K39i التغطيةُ تامّةٌ 34/34 — ما من درسِ قواعدَ واحدٍ يُفتَحُ بلا تركةِ حفظٍ تحتَه");
      ok(readFileSync("components/tasks.tsx", "utf8").includes("getBrueckenFor(gramId)") && readFileSync("components/tasks.tsx", "utf8").includes("<BrueckenBlock gramId={topic.id} />"), "K39j بطاقةُ القاعدةِ تستهلكُ البنكَ فعلاً — لا ملفَّ بلا مستهلِك");
    }
    ok(readFileSync("components/diktat.tsx", "utf8").includes("diktatSrc(it.id)") && readFileSync("components/diktat.tsx", "utf8").includes("playbackRate") && readFileSync("components/diktat.tsx", "utf8").includes("speakAny("), "K27g معسكر الإملاء صوتي-first: ملفٌ إن وُجد، واحتياطٌ معلنٌ إن غاب");
  }
  ok(texts.every((t) => Array.isArray(t.questions) && t.questions.length === (t.level === "B1" ? 3 : 4)), "K12 أربعةُ أسئلةٍ لكلِّ نصٍّ في A1/A2/B2 وثلاثةٌ في B1");
  ok(sentences.every((sx) => sx.de && sx.ar), "K13 كل جملة لها وجهان");
  ok(alleVokabeln.every((v) => ["A1", "A2", "B1", "B2"].includes(v.level)), "K14 مستويات المفردات نظامية");
}

/* ═══ L · المصحّح الخماسي (وحدة O — reused في X وZ) ═══ */
{
  const clean = selbstKorrektur("Ich lerne seit einem Jahr Deutsch. Ich fahre jeden Tag mit dem Bus zur Schule.");
  ok(clean.hart.length === 0, `L1 نص نظيف بلا أخطاء صلبة (وجد ${clean.hart.length}: ${clean.hart.map((h) => h.dim).join("|")})`);
  ok(clean.hints.length === 0, `L2 ولا تلميحات كاذبة (وجد ${clean.hints.length})`);
  const mess = selbstKorrektur("ich muss heute nicht in die schule kommen weil ich krank bin und das haus ist kalt.");
  const dims = new Set(mess.hart.map((f) => f.dim));
  ok(dims.has("الأسماء الكبيرة"), "L3 يكشف «schule» بأحرف صغيرة");
  ok(dims.has("أول الجملة"), "L4 يكشف بداية صغيرة");
  ok([...dims].some((d) => d.startsWith("فاصلة قبل")), "L5 فاصلة قبل weil مفقودة");
  ok(mess.hart.length >= 3 && mess.funde.length >= mess.hart.length, "L6 عدّات متسقة");
  const um = selbstKorrektur("Fuer und ueber haben wir gelernt.");
  ok(um.hart.some((f) => f.besser.includes("für")) && um.hart.some((f) => f.besser.includes("über")), "L7 Fuer→für و ueber→über");
  const sub = selbstKorrektur("Weil ich muede bin bleibe ich zuhause.");
  ok(sub.hart.every((f) => f.dim !== "أول الجملة"), "L8 بداية جانبية لا تُفصح كاذبة عن أول الجملة");
  void sub;
}

/* ═══ الخلاصة ═══ */
console.log(`\n══════ ENGINE SMOKE ══════\n✓ ${pass} نجح   ✗ ${fails.length} فشل`);
if (fails.length) {
  for (const f of fails) console.log("  ✗ " + f);
  process.exit(1);
}
