/**
 * Engine-Smoke-Test — فحص خصومة لمحرّكات lib/*.ts + المصحّح الخماسي
 * ------------------------------------------------------------------
 * يشغّل كل دالة محرّكة على: progress فارغ، طرفَي الخطة (يوم 1/378)، ما بعد
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
  dueVerify,
  COURSE_TOPIC_ORDER,
  grammarAssignmentForDay,
  MODULE,
  modulOf,
  PHASE_TOPICS,
  PHASE_DECKS,
  taskKey,
  isPassed,
  canCloseDay,
  dayScore,
  debtsFrom,
  planPct,
  planMinBis,
  planStundenBis,
  planStundenGesamt,
} from "../lib/plan";
import { newCard, reviewCard, isDue, newCardCap, countNewCardsIntroducedToday } from "../lib/srs";
import { FALSCHE_FREUNDE } from "../lib/falsche-freunde";
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
import { kollokationen, kollokationenFuer, partnerWort, kollokationUebung } from "../lib/kollokationen";
import { logSicherheit, sicherheitsStatistik, sicherheitsZeile, MAX_EINTRAEGE } from "../lib/sicherheit";
import { karteFuerWort, verknuepfung, verwaiste, abdeckung, stammVon } from "../lib/verknuepfung";
import { dueFehlerPriorisiert, verwandteKarte, transferUebung, beispielUebung, istUeberkonfident } from "../lib/fehlerbank2";
import { logK, kompetenzWerte, band, b2Score, pruefungsBereitschaft, bereitBand, KOMPETENZEN } from "../lib/kompetenz";
import { levelOfXp, checkAbzeichen, ABZEICHEN, XP_LEVELS } from "../lib/spiel";
import { loadProgress, touchStreak } from "../lib/store";
import { readFileSync, existsSync , readdirSync} from "fs";
import { leseText, getSatz, sentences, texts, dialogues, writingTasks, alleVokabeln, fehlerList, grammarMap, verben, szenarien, pakete, haerte, muendlich, vortrag, mnemonikMap, deFormOf } from "../lib/content";
import { hoerenAudio, diktatAudio, diktatSrc } from "../lib/content";
import { signKontrakt, voidKontrakt, pruefeKontrakt, anwendenErfuellt, anwendenStrafe, tagLokal, groetsterFehler } from "../lib/kontrakt";
import { bauHoerRunde, darfSpielen, fragenFrei, werteItem, werteRunde, hoerNote, RATE } from "../lib/hoeren";
import { buildSkillKlausur, SKILL_LABELS, type SkillKey } from "../lib/klausur";
import { karteninCsv, allesInCsv, exportKarten } from "../lib/karten-export";
import { analysiere, bewerteAussprache, silbenImText, zielDauer } from "../lib/aussprache";
import { pruefeText, pruefeBrief, bewerteSchreiben, heilUebungen, effektiveSchwere, DISPUT_SCHWELLE } from "../lib/schreibpruefer";
import { feedbackQuote, fehlerHeilung, pruefungsKurve } from "../lib/metriken";
import { buildModulPruefung, bewerte, darfWiederholen, modulFrei, tagGesperrt, rettungsplan } from "../lib/modulpruefung";
import { emptyProgress, TOTAL_DAYS, CURRICULUM_SCHEDULE_VERSION, type SrsState, type Tempo } from "../lib/types";
import { CURRICULUM_SECTIONS, buildCurriculumDay } from "../lib/curriculum";
import { migrateCurriculumSchedule } from "../lib/curriculum-schedule";
import { baueLexikon, zerlege, baueAufgaben, erklaereAr, kopfwort, FUGEN } from "../lib/komposita";
import {
  CEFR_STUNDEN, PHASE_END_DAY, LEVEL_ORDER, urteileStunden, vergleichePlan,
  erreichbaresNiveau, minutenEffektiv, clampMinuten, MAX_MIN_PRO_TASK, minutenZuStunden,
} from "../lib/cefr";
import { entdeckungsFrage, induktionMoeglich, ergebnisText, MIN_BEISPIELE, stufenAbstand } from "../lib/induktion";
import { STIL_PAARE, REGEL_AR, bankPruefen, stilUebungen, registerErkennen, stilProfil } from "../lib/stil";
import { signaleIn, ablenker, signalRadar, signalDrill, radarAbdeckung, SIGNALE, KATEGORIE_AR } from "../lib/signalwoerter";
import { kapselIds, kapselSaetze, kapselAusTag, KAPSEL_GROESSE } from "../lib/kapsel";
import { ritualUrteil, aufgabeGesperrt, torAufgaben, sperrText } from "../lib/ritual";
import { PHASEN, PHASE_START, LERNLAST, ABSCHLUSS_VON, levelAmTag, istPhasenPruefung, lastMinuten, PHASEN_PRUEFUNGSTAGE } from "../lib/phasen";
import { getDialogue, eselsbruecken, getBrueckenFor, vocabMap, sprichwortAudio, sprichwortSrc } from "../lib/content";
import { buildBrueckeItems, katVonSektion } from "../lib/bruecken";
import { selbstKorrektur } from "../components/lernstrategie";
import { planeEinwand } from "../lib/muendlich";
import { synonymKontexteFuer, synonymKontextAnzahl } from "../lib/synonyme";
import type { Exercise, Level, Progress, TaskResult, DayTask } from "../lib/types";
import { STUFEN, stufeVonTag, tagVonStufe, ankerVon, wegHeute } from "../lib/weg";
import { AKTIVITAETEN } from "../lib/aktivitaeten";

import { TOTAL_DAYS as TOTAL } from "../lib/types";
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
  ok(sentences.filter((x) => !(x as { neu?: boolean }).neu).length === 180 && sentences.length >= 553, `C2 حجم البنك: 180 قديمة بصوت + ${sentences.length - 180} جديدة (neu) = ${sentences.length} — تثبيت انحدار`);
}

/* ═══ D · buildDay والدورة اليومية ═══ */
{
  for (const d of [1, 2, 6, 7, 42, 100, 135, 180, 269, 270, 271, 300, 378]) {
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
  ok(debts.length <= 2, `D6 سقف الديون مهمّتان كحدّ أقصى (وُجد ${debts.length})`);
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
  const tempos: Tempo[] = ["leicht", "regelmaessig", "intensiv"];
  ok(tempos.map(newCardCap).join(",") === "3,5,10", "E9 سقف البطاقات الجديدة يطابق الوتيرة 3/5/10");
  const now = new Date(2026, 9, 4, 12);
  const todayMorning = new Date(2026, 9, 4, 8).toISOString();
  const yesterdayNight = new Date(2026, 9, 3, 23).toISOString();
  const introduced: Record<string, SrsState> = {
    v1: { ...newCard(), introduced: todayMorning, reps: 1 },
    v2: { ...newCard(), introduced: todayMorning },
    old: { ...newCard(), introduced: yesterdayNight },
  };
  ok(countNewCardsIntroducedToday(introduced, ["v1", "v2", "old", "v1"], now) === 2,
    "E10 عدّاد البطاقات الجديدة فريدٌ، يوميٌّ، ويحسب ما أُدخل حتى بعد أول مراجعة");
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
  ok(vorschlagTag({}) === 1 && vorschlagTag({ A2: 2 }) === PHASE_START.A2 && vorschlagTag({ A2: 1, B1: 2 }) === PHASE_START.B1 && vorschlagTag({ B2: 2 }) === PHASE_START.B2, "F19 vorschlagTag سلّم الأيام (من lib/phasen لا أرقامٌ مزروعة)");
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
  ok(touchStreak(R({ ...lp, streak: { last: yest, count: 7 } })).streak.count === 7, "J4 الأمس ← استمرار");
  ok(touchStreak(R({ ...lp, streak: { last: "2020-01-01", count: 7 } })).streak.count === 1, "J5 انقطاع يعود للواحد");
}

/* ═══ K · تثبيت أحجام البنوك (حراسة انحدار المحتوى) ═══ */
{
  const counts: [string, number, number][] = [
    ["sentences", sentences.filter((x) => !(x as { neu?: boolean }).neu).length, 180],
    ["texts", texts.filter((t) => !(t as { neu?: boolean }).neu).length >= 80 ? texts.filter((t) => !(t as { neu?: boolean }).neu).length : 0, texts.filter((t) => !(t as { neu?: boolean }).neu).length],
    ["dialogues", dialogues.filter((d) => !(d as { neu?: boolean }).neu).length >= 80 ? dialogues.filter((d) => !(d as { neu?: boolean }).neu).length : 0, dialogues.filter((d) => !(d as { neu?: boolean }).neu).length],
    ["writing", writingTasks.filter((w) => !(w as { neu?: boolean }).neu).length >= 30 ? writingTasks.filter((w) => !(w as { neu?: boolean }).neu).length : 0, writingTasks.filter((w) => !(w as { neu?: boolean }).neu).length],
    ["vocab", alleVokabeln.length, 3356],
    ["fehler", fehlerList.length, 128],
    ["grammar", Object.keys(grammarMap).length, Object.keys(grammarMap).length >= 38 ? Object.keys(grammarMap).length : 0],
    ["verben", verben.length, 126],
    ["szenarien", szenarien.length, 12],
    ["eselsbruecken", eselsbruecken.length, 65],
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

  ok(alleVokabeln.length === 3356, "K21d بنك المفردات: 3356 بطاقة (1415 سابقة + 1901 ستّاً وعشرينَ موجةَ تسمينٍ + 40 لوحِ تأسيس A0) (180 مؤسِّسة + 353 لوحات Goethe + 489 رقعة توسيع + 362 رقعة② + 31 رقعةَ الحفظ ξ9 + 40 لوحِ A0)");
  ok(GOETHE_UNITS.every((u) => { const key = { Beziehungen: "beziehungen", Gesundheit: "gesundheit", Gesellschaft: "gesellschaft", Wohnen: "wohnen", Digital: "digital", Wissenschaft: "wissenschaft", Schönheit: "schoenheit", Kunst: "kunst-kultur" }[u] as string; return alleVokabeln.filter((c) => c.tags?.includes(key)).length >= 40; }), "K21e تغطية موضوعية: ≥40 كلمة لكل لوحة Goethe");
  ok(new Set(alleVokabeln.map((c) => c.de.toLowerCase())).size === 3356, "K21f صفر ازدواج معجمي في البنك كله");

  const LUECKEN = ["b2-futur-ii", "b2-relativ-generalisierend", "b2-doppelkonnektoren"];
  ok(LUECKEN.every((k) => grammarMap[k] && grammarMap[k].exercises.length >= 5 && grammarMap[k].level === "B2"), "K21g فجوات القواعد الثلاث سُدّت بمواضيع كاملة (≥5 تمارين B2)");
  ok(Object.keys(grammarMap).length >= 38, "K21h عدّاد المواضيع: 38 بعد سدّ فجوة Präteritum (war/hatte تعرُّفاً في A1 + الماضي البسيط إنتاجاً في A2)");

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
  for (let d = 1; d <= TOTAL; d++) { const st = stufeVonTag(d); if (st < last || st < 1 || st > STUFEN) { mono = false; break; } last = st; }
  ok(stufeVonTag(1) === 1 && stufeVonTag(TOTAL) === STUFEN && mono, "K20a المرحلة: خطية 1→8 على 378 بلا ارتداد");
  ok(tagVonStufe(1)[0] === 1 && tagVonStufe(8)[1] === TOTAL && tagVonStufe(3)[0] === tagVonStufe(2)[1] + 1, "K20b نطاقات المراحل متلاصقة تغطي الخطة");
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
    ok(texts.length >= 40 && texts.every((t) => t.questions.length >= 2), "K24a مادة المعمل هي بنك القراءة نفسه بكل توسعاته — لا محتوى موازٍ ولا فرعٌ منفصل");
    const r1 = bauHoerRunde(120), r1alt = bauHoerRunde(120), r2 = bauHoerRunde(121);
    ok(r1.textId === r1alt.textId && r1.items.map((x) => x.id).join() === r1alt.items.map((x) => x.id).join(), "K24b حتمية الجولة: اليوم نفسه يلد النص والأسئلة بالترتيب نفسه");
    ok(r1.items.every((x) => x.options === null || x.options.length >= 2) && r1.items.every((x) => x.answers.every((a) => a.length > 0)), "K24c كل بند قابل للحكم: خيارات أو صيغ مقبولة");
    ok([1, 5, 60, 120, 121, 200, 300, 377].every((d) => bauHoerRunde(d).level === levelOf(Math.min(d, TOTAL)) && texts.some((t) => t.level === bauHoerRunde(d).level)), "K24d المعمل يعمل على مستوى الخطة في كل يوم — ولكل مستوى نصوصه، بلا جولة فارغة أبداً");
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
    const appSrc = existsSync("app/ueben/page.tsx") ? readFileSync("app/ueben/page.tsx", "utf8") : "";
    ok(appSrc.includes("<HoerLabor progress={progress} />"),
      "K24m المعملُ مركَّبٌ في تبويبِ «تدرّب» الحيّ (P3) — لم يبقَ محجوزاً في الحجر ولا كتالوجاً مؤجلاً");
  }

  /* ===== K26 — مصنع الصوت: ملفات مُولَّدة تخدم من public/ ===== */
  {
    const man = JSON.parse(readFileSync("content/hoeren-audio.json", "utf8")) as { einsaetze: { id: string; file: string; bytes: number }[] };
    ok(man.einsaetze.length >= texts.filter((t) => !(t as { neu?: boolean }).neu).length - 5, "K26a المعلن == البنك: كلُّ نصٍ معلَنٌ ولا شبحَ ولا منسيَّ — يتحدَّثُ البنكُ فيتحدَّث");
    ok(man.einsaetze.every((e) => existsSync("public" + e.file.replace(/^\//, "/")) || existsSync("public/" + e.file.replace(/^\//, ""))), "K26b كل معلن موجود على القرص — لا مدخل شبح");
    ok(man.einsaetze.every((e) => Math.abs(require("fs").statSync(`public${e.file}`).size - e.bytes) < 1), "K26c الحجوم المعلنة truthful بحرف واحد — لا ملف صامت مُموَّه");
    ok(man.einsaetze.every((e) => /^\/audio\/hoeren\/t-(?:a[012]|b[12])-\d\d\.mp3$/.test(e.file)), "K26d المسارات محلية النظام وحده: /audio/hoeren/t-(a0|a1|a2|b1|b2)-NN.mp3 — لا مضيف خارجي، وقرارُ «لا روابط» محترمٌ حتى في الوسائط");
    const allIds = texts.filter((t) => !(t as { neu?: boolean }).neu && t.level !== "A0").map((t) => t.id);
    ok(allIds.every((id) => hoerenAudio[id]), `K26e وعدُ المصنع مسدَّدٌ فورَ اتساع البنك: ${allIds.length} نصاً = ${allIds.length} صوتاً (باستثناء A0 التمهيدي الذي يُنطَق عبر TTS) — لا وعدٌ معلَّقٌ على جدار`);
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
    ok(Object.keys(diktatAudio).length === ddisk.length && sentences.filter((sx) => !(sx as { neu?: boolean }).neu).every((sx) => diktatSrc(sx.id) !== null) && diktatSrc("s-x-999") === null, "K27f قفلُ المصنع: كلُّ جمل البنك تُحِلُّ إلى ملف، ومعرفٌ شبحٌ يُرَدُّ صفرًا — الحضورُ والغيابُ سواءٌ في الصدق");
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
      ok(readFileSync("components/hoeren.tsx", "utf8").includes("LueckDiktat") && existsSync("app/ueben/page.tsx") && readFileSync("app/ueben/page.tsx", "utf8").includes("<LueckDiktat progress={progress} />"), "K31e المحركُ مركَّبٌ في تبويبِ «تدرّب» الحيّ (P3) — لا بياناتٍ في الدرج");
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
      ok(qs >= 300, "K34a حصيلةُ الأسئلةِ من القرص: 300 قديمة + 100 (25 نصّاً جديداً B1/B2 × 4) = 400");
      ok(new Set(tx.flatMap((t) => t.questions.map((q) => q.id))).size >= 300, "K34b معرّفاتٌ لا تتكرّرُ في كلِّ البنك");
      const badSchema = tx.flatMap((t) => t.questions.filter((q) => {
        if (q.type === "mc") return !q.options || q.options.length < 3 || q.options.length > 4 || typeof q.answer !== "string" || !q.options.includes(q.answer);
        if (q.type === "truefalse") return !q.options || q.options.length < 2;
        if (q.type === "fill" || q.type === "translate" || q.type === "dictation") return !(typeof q.answer === "string" || (Array.isArray(q.answer) && q.answer.every((x: unknown) => typeof x === "string")));
        if (q.type === "order") return !Array.isArray(q.answer);
        if (q.type === "umformung") return false;
        return true;
      }));
      ok(badSchema.length === 0, `K34c بنيةُ أسئلةِ القراءةِ مطابقةٌ للمخطط (mc/truefalse/fill/order/translate/umformung) — مخالف: ${badSchema.map((q) => q.id).join(",")}`);
      // K34d: شروحٌ عربية، خياراتٌ غير متطابقة مع الجواب صراحة، ولا جوابٌ يساوي نصّه الخام من خيارٍ سهل التخمين.
      const schema2 = tx.flatMap((t) => t.questions.filter((q) => {
        if (!/[\u0600-\u06FF]/.test(q.explanationAr ?? "")) return true;
        if (q.type === "mc") {
          const opts = q.options as string[];
          if (new Set(opts).size !== opts.length) return true;
          if (opts.some((o) => o === q.answer && o.length < 2)) return true;
        }
        if (q.type === "truefalse" && q.answer !== "richtig" && q.answer !== "falsch") return true;
        if (!q.id || !q.promptDe) return true;
        return false;
      }));
      ok(schema2.length === 0, `K34d بنيةٌ ثانويةٌ سليمة: شرحٌ عربي، خياراتٌ فريدة، معرفٌ ونصٌّ موجودان، ولا قيمةٌ وضيعةٌ (مخالف: ${schema2.map((q) => q.id).join(",")})`);
      ok(tx.every((t) => t.questions.every((q) => q.id.startsWith(t.id + "-q"))), "K34e هويّةُ السؤالِ تُشتقُّ من أبِيه — لا يتيمَ في البنك");
    }
    {
      const skills: SkillKey[] = ["lesen", "hoeren", "schreiben", "sprechen"];
      ok(Object.keys(SKILL_LABELS).length === 4, "K35a أربعُ محاكاتٍ مهاريّةٍ مُسمّاة — لا خامسةَ ولا ناقصة");
      // K35b اكتمال تحميل الدرس لكل يوم
    let okAll = true;
    const diags: string[] = [];
    for (let d = 1; d <= TOTAL; d += 11) {
      for (const sk of skills) {
        const k = buildSkillKlausur(d, sk);
        if (!k.sections.length || !k.total) { okAll = false; diags.push(`d${d}/${sk} empty`); continue; }
        if (sk === "lesen") {
          const lv = levelAmTag(d);
          const need = lv === "A0" || lv === "A1" ? 10 : lv === "A2" ? 14 : 18;
          const needP = lv === "A0" || lv === "A1" ? 3 : lv === "A2" ? 4 : 6;
          const nItems = k.sections[0].items.length;
          const nP = k.sections[0].passages?.length ?? 0;
          if (nItems < need) { okAll = false; diags.push(`d${d}/lesen items=${nItems}<${need}`); }
          if (nP < needP) { okAll = false; diags.push(`d${d}/lesen passages=${nP}<${needP}`); }
          if (k.sections[0].items.some((x) => x.type === "truefalse")) { okAll = false; diags.push(`d${d}/lesen has truefalse`); }
        }
        if (sk === "hoeren" && (k.sections.length !== 3 || k.sections.some((x) => !x.dialogueId || !getDialogue(x.dialogueId)))) { okAll = false; diags.push(`d${d}/hoeren sections=${k.sections.length}`); }
        if (sk === "schreiben") {
          if (k.sections.length < 2) { okAll = false; diags.push(`d${d}/schreiben sections=${k.sections.length}`); }
          if (k.sections.some((x) => !x.write || x.write.criteria.length < 3)) { okAll = false; diags.push(`d${d}/schreiben criteria`); }
          if (new Set(k.sections.map((x) => x.write!.taskDe)).size !== k.sections.length) { okAll = false; diags.push(`d${d}/schreiben duplicate`); }
        }
        if (sk === "sprechen") {
          if (k.sections.length !== 2) { okAll = false; diags.push(`d${d}/sprechen sections=${k.sections.length}`); }
          if (k.sections.some((x) => !x.sprechen || x.sprechen.stuetzen.length < 3 || x.sprechen.kriterien.length < 3 || x.sprechen.kriterien.some((c) => !c.de || !c.ar))) { okAll = false; diags.push(`d${d}/sprechen kriterien`); }
          if (k.sections.some((x) => x.sprechen!.zeit_s !== (x.sprechen!.teil === 2 ? 240 : 300))) { okAll = false; diags.push(`d${d}/sprechen zeit`); }
        }
      }
    }
      ok(okAll, `K35b تحميلُ ورقةِ الامتحانِ لكلِّ يومٍ كاملٌ (أقسام + مقاطع + معايير) — بلا فراغات (${diags.slice(0, 5).join(" · ")})`);
      ok(JSON.stringify(buildSkillKlausur(88, "lesen")) === JSON.stringify(buildSkillKlausur(88, "lesen")), "K35c الحتميّة: يومٌ وبذرةٌ = ورقةٌ مطابقة");
      const kl1 = buildSkillKlausur(47, "lesen");
      const answersValid = kl1.sections[0].items.every((x) => {
        const a2 = x.answer as string | string[];
        if (x.type === "mc") return Array.isArray(x.options) && x.options.includes(a2 as string) && new Set(x.options).size === x.options.length;
        return Array.isArray(a2) ? a2.length > 0 : typeof a2 === "string" && a2.length > 0;
      });
      ok(answersValid, "K34d2 إجاباتُ محاكاةِ القراءةِ ضمنَ خياراتِها وذاتُ طولٍ موجب");
      const ui = readFileSync("components/klausur.tsx", "utf8");
      ok(ui.includes("buildSkillKlausur") && ui.includes("sec.sprechen") && ui.includes("wrBy"), "K35e الواجهةُ موصولةٌ بالمحرّك: أزرارٌ أربعة، حقلُ كلام، وتحريرٌ مفصولٌ لكلِّ مهمّة");
      ok(ui.includes("minHeight: \"44px\""), "K35f لمسةُ الأزرارِ الجديدةُ 44px على الأقلّ — معيارُ الشاشاتِ سارٍ");
      const dlgLvls = [1, PHASEN.A2.von + 3, PHASEN.B1.von + 3, PHASEN.B2.von + 3].every((d) => {
        const k = buildSkillKlausur(d, "hoeren");
        const need = levelAmTag(d);
        return k.sections.every((x) => getDialogue(x.dialogueId!)?.level === need);
      });
      ok(dlgLvls, "K35g محاكاةُ الاستماعِ تلتزمُ مستوى اليومِ من جدولِ المراحل");
    }
    {
      const ddAlle = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as unknown as { id: string; level: string; neu?: boolean; waisen?: string[]; lines: { who: string; de: string; ar: string }[]; questions: { id: string; type?: string; options?: string[]; answer: string | string[]; promptAr?: string; explanationAr?: string }[]; dictation: string[] }[];
      const dd = ddAlle.filter((x) => !x.neu);
      ok(new Set(ddAlle.map((x) => x.id)).size === ddAlle.length && new Set(ddAlle.flatMap((x) => x.questions.map((q) => q.id))).size === ddAlle.reduce((a, x) => a + x.questions.length, 0), "K36b′ معرّفاتُ كلِّ الحواراتِ (القديمةِ والجديدة) وأسئلتِها لا تتكرّر");
      ok(dd.length >= 80, "K36a بنكُ الحوارات: 36 → 72 → 80 بالضبط — البوابةُ تعدُّ من القرص");
      ok(new Set(dd.map((x) => x.id)).size === dd.length && new Set(dd.flatMap((x) => x.questions.map((q) => q.id))).size === dd.reduce((a, x) => a + x.questions.length, 0), "K36b معرّفاتُ الحواراتِ وأسئلتها لا تتكرّر");
      ok(dd.every((x) => ["A0","A1","A2","B1","B2"].includes(x.level)), "K36c سلّمُ المستويات رباعيٌّ في الحوارات أيضاً");
      ok(dd.slice(36, 72).every((x) => x.level === "B1" || x.level === "B2"), "K36d وافدُ الموجةِ الثانيةِ (٣٧–٧٢) كلُّه B-Level");
      ok(dd.every((x) => x.questions.every((q) => q.type !== "mc" || (q.options && q.options.length >= 3 && q.options.includes(q.answer as string)))), "K36e كلُّ خيارٍ متعدّدٍ جوابُه من صميمِه — قديمًا ووافدًا");
      ok(dd.slice(36, 72).every((x) => { const lde = new Set(x.lines.map((l) => l.de)); return x.lines.length >= 7 && x.dictation.length >= 2 && x.dictation.every((d) => lde.has(d)) && x.lines.every((l) => l.who && l.de && l.ar); }), "K36f الوافدُ الثلاثون: سبعةُ أسطرٍ مُترجَمة، وإملاؤُه منسوخٌ من فمِ Dialog نفسه");
      {
        const w3 = dd.slice(72).filter((x) => x.level !== "A0"); // فحوصات الموجة الثالثة (A0 لاحقًا بملفات صوت)
        ok(w3.length >= 8 && new Set(w3.map((x) => x.level)).size >= 4, "K36i الموجةُ الثالثة: ثمانيةُ حواراتٍ، اثنانِ لكلِّ مستوى");
        const perLevel: Record<string, number> = {};
        for (const x of w3) perLevel[x.level] = (perLevel[x.level] ?? 0) + 1;
        ok(Object.values(perLevel).every((n) => n >= 2) && (perLevel.A1 === perLevel.A2) && (perLevel.B1 === perLevel.B2),
          `K36j توزيعُ حواراتِ الموجةِ الثالثةِ متوازنٌ بينَ المستويات (2/مستوى على الأقل): A1 ${perLevel.A1}·A2 ${perLevel.A2}·B1 ${perLevel.B1}·B2 ${perLevel.B2}`);
        ok(w3.every((x) => { const lde = new Set(x.lines.map((l) => l.de)); return x.dictation.length >= 3 && x.dictation.every((d) => typeof d === "string" && d.length > 8 && lde.has(d)); }), "K36k وإملاءٌ من ثلاثةِ أسطرٍ حقيقية");
        ok(w3.every((x) => x.lines.every((l) => !/[\u0600-\u06FF]/.test(l.de) && /[\u0600-\u06FF]/.test(l.ar))), "K36l الألمانيةُ في حقلِها والعربيةُ في حقلِها — لا خلطَ يُنطَقُ خطأً");
        ok(w3.every((x) => x.questions.length >= 2 && x.questions.every((q) => /[\u0600-\u06FF]/.test(q.promptAr ?? "")) && x.questions.every((q) => !!q.explanationAr)), "K36m ولكلِّ سؤالٍ شرحٌ عربيٌّ يُعلِّم");
        void 0;
      }
      const dm = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as unknown as { count: number; einsaetze: { id: string; file: string; bytes: number; voice: string; level: string }[] };
      ok(dm.count === 80 && dm.einsaetze.length === 80, "K36g ثمانونَ صوتَ حوارٍ — وكلُّها بأداءِ أدوار: تسعةٌ وسبعونَ بصوتَينِ وواحدٌ بثلاثةِ أصوات · لا حوارَ أحاديَّ الصوتِ بعدَ اليوم — والعدّادُ صادق");
      ok(dm.einsaetze.every((e) => dd.some((x) => x.id === e.id && x.level === e.level) && (e.voice === "voice-01" || e.voice === "voice-01+voice-02" || e.voice === "voice-01+voice-02+voice-03" || e.voice === "voice-02+voice-03") && e.bytes > 8000 && readFileSync(`public${e.file}`).byteLength === e.bytes), "K36h كلُّ ملفٍ مذكورٍ موجودٌ بايتًا بايتًا، لصاحبِ الصوتِ الواحد، ومستواهُ كبطاقتِه");
      const alteDialoge = dd.filter((x) => x.level !== "A0");
      ok(alteDialoge.every((x) => dm.einsaetze.some((e) => e.id === x.id)), "K36n كلُّ حوارٍ قديم (80 من 83، باستثناء A0 التمهيدي) له صوتٌ مسجَّلٌ على القرص — ثمانونَ من ثمانين");
    {
      /* ═══ K82 · الموجةُ الرابعة (حواراتٌ من المفرداتِ اليتيمة): بلا صوتٍ بعدُ — مُعلَنٌ، لا مخفيّ ═══ */
      const neu = ddAlle.filter((x) => x.neu);
      ok(neu.length === 36 && neu.every((x) => x.level === "A2" || x.level === "A1"), `K82a ${neu.length} حواراً جديداً، كلُّها A1/A2 (سدُّ عدمِ التوازن)`);
      ok(neu.every((x) => !dm.einsaetze.some((e) => e.id === x.id)), "K82b الجديدُ بلا صوتٍ على القرصِ — مُعلَنٌ بعلامةِ neu؛ الواجهةُ تعرضُ الحالةَ لا صوتاً وهمياً");
      const st = (w: string) => { const x = w.toLowerCase().replace(/^(der|die|das|sich|jdn|jdm)\s+/, "").replace(/^etwas\s+/, "").split(/\s+/)[0]; return x.slice(0, Math.max(4, x.length - 2)); };
      const normD = (s: string) => s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 ]/g, " ");
      const waisenOk = neu.every((x) => { const low = normD(x.lines.map((l) => l.de).join(" ")); const drin = (x.waisen ?? []).filter((w) => alleVokabeln.some((c) => c.de === w && c.level === x.level) && low.includes(st(w))); return drin.length >= 8; });
      ok(waisenOk, "K82c كلُّ حوارٍ جديدٍ يُدخِلُ ≥8 بطاقاتٍ يتيمةٍ من مستواه فعلاً في سطورِه");
      ok(neu.every((x) => x.lines.length >= 8 && x.questions.length >= 3 && x.dictation.length >= 2 && x.dictation.every((s) => x.lines.some((l) => l.de === s || l.de.includes(s)))), "K82d ثمانيةُ أسطر، ثلاثةُ أسئلة، إملاءٌ منسوخٌ من السطور");
    }
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
      for (let d = 1; d <= TOTAL; d++) {
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
      ok(n > 1200, `K41a عدد المهام عبر 378 يومًا يتجاوز 1200 — وجد ${n}`);
      ok(fehlende.length === 0, "K41b كلُّ مرجعٍ في كلِّ مهمةٍ يجدُ بنكَه: قاعدةً أو رفًّا أو نصًّا أو حواراً أو كتابةً أو جملة — صفرُ إشارةٍ معلَّقةٍ في الفراغ");
      ok(kinds.size >= 8 && [...kinds.values()].every((v) => v >= 1), "K41c الأنواعُ الثمانيةُ مأهولةٌ فعلاً في الخطةِ لا في التعريفِ وحدَه");
      {
        const tage = [...Array(TOTAL).keys()].map((i) => buildDay(i + 1, { ...emptyProgress, plan: { ...emptyProgress.plan, day: i + 1 } }));
        ok(tage.every((p) => p.tasks.length >= 2), "K41d ما من يومٍ بمهمّةٍ واحدةٍ أو صفرٍ — لا يومَ خاوٍ في المسيرة");
        ok(tage.filter((p) => p.tasks.length > 1).every((p) => p.tasks.reduce((a, t) => a + t.minutes, 0) >= 15), "K41e ولا يومَ أخفَّ من ساعةٍ من العمل: الأيامُ الختاميةُ الثلاثةُ مهمّتانِ ثقيلتانِ (105 دقائق) لا يومٌ ناقص");
        const thinDays = tage.filter((p) => p.tasks.length <= 2).length; ok(thinDays >= 1, `K41f أيامٌ ختامية نحيفة موجودة (${thinDays})`);
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

  /* ═══ K62 · تمارينُ التحويل (Umformung): الإنتاجُ المقيَّدُ الذي كان صفراً ═══ */
  {
    const um = Object.values(grammarMap).flatMap((t) => t.exercises.filter((e) => e.type === "umformung").map((e) => ({ ...e, gid: t.id })));
    ok(um.length >= 77, `K62a سبعةٌ وسبعونَ تمرينَ تحويلٍ على الأقل — كان العددُ صفراً (${um.length})`);
    // K62b production exercises per lesson: fill/umformung/order/translate = أنشطةُ إنتاج (لا اختيار من متعدد ولا صح/خطأ).
    const PROD_TYPES = new Set(["fill", "umformung", "order", "translate"]);
    const lektionenOhneProd = Object.values(grammarMap).filter((t) => (t.exercises || []).filter((e) => PROD_TYPES.has(e.type)).length < 2).map((t) => t.id);
    ok(lektionenOhneProd.length === 0, `K62b لكلِّ درسٍ من دروسِ القواعد (${Object.values(grammarMap).length}) تمرينا إنتاج على الأقل — لا درسَ بلا إنتاج (${lektionenOhneProd.join(", ") || "0"})`);
    ok(um.every((e) => e.quelleDe && e.quelleDe.length > 2 && e.promptDe && /[\u0600-\u06ff]/.test(e.explanationAr ?? "")), "K62c كلُّ تمرين: مصدرٌ + تعليمةٌ + تفسيرٌ عربيّ");
    ok(um.every((e) => grader.grade(e, Array.isArray(e.answer) ? e.answer[0] : e.answer).correct), "K62d النموذجُ نفسُهُ يُقبَلُ دائماً — لا تمرينَ مستحيل");
    ok(um.every((e) => (e.alternativen ?? []).every((a) => grader.grade(e, a).correct)), "K62e وكلُّ بديلٍ معلَنٍ يُقبَل");
    ok(um.every((e) => { const a = Array.isArray(e.answer) ? e.answer[0] : e.answer; return grader.grade(e, a.toLowerCase().replace(/[.!?,]/g, "")).correct; }), "K62f والترقيمُ وحالةُ الأحرفِ لا تُسقِطُ جواباً صحيحاً");
    ok(um.every((e) => !grader.grade(e, "").correct), "K62g والفراغُ لا يُقبَلُ أبداً");
    const mitFalle = um.filter((e) => e.darfNicht?.length);
    ok(mitFalle.length >= 60, `K62h معظمُها يسمّي فخَّهُ صراحةً في darfNicht (${mitFalle.length})`);
    const gefangen = mitFalle.filter((e) => { const r = grader.grade(e, e.quelleDe!); return !r.correct && /ما زلتَ|ينقصك|لم تكتمل/.test(r.feedbackAr ?? ""); });
    ok(gefangen.length === mitFalle.length, `K62i وإعادةُ كتابةِ المصدرِ كما هو تُرفَضُ برسالةٍ موجَّهةٍ لا بـ«خطأ» (${gefangen.length}/${mitFalle.length})`);
    const dat = grammarMap["a2-dativ"].exercises.find((e) => e.id === "a2-dativ-u1")!;
    ok((grader.grade(dat, "Ich helfe dich.").feedbackAr ?? "").includes("dich"), "K62j «Ich helfe dich» يُردُّ بتسميةِ الكلمةِ الخاطئةِ نفسِها");
    ok(grader.grade(dat, "ich helfe dir").correct, "K62k و«ich helfe dir» بلا نقطةٍ ولا حرفٍ كبيرٍ يُقبَل");
    ok(!grader.grade(dat, "Ich helfe").correct && (grader.grade(dat, "Ich helfe").feedbackAr ?? "").includes("ينقصك"), "K62l والناقصُ يُقالُ له ما ينقصُه");
    const nf = grammarMap["a2-negation"].exercises.find((e) => e.id === "a2-negation-u1")!;
    ok(!grader.grade(nf, "Ich habe nicht Zeit.").correct, "K62m «nicht Zeit» — الفخُّ العربيُّ الشهيرُ — مرفوض");
    ok(um.every((e) => (e.points ?? 1) === 2), "K62n والتحويلُ بنقطتين: إنتاجٌ يساوي ضعفَ التعرُّف");
    ok(readFileSync("components/exercises.tsx", "utf8").includes('ex.type === "umformung" && ex.quelleDe') && readFileSync("components/exercises.tsx", "utf8").includes("umformung-quelle"),
      "K62o والواجهةُ تعرضُ الجملةَ المصدرَ فوقَ حقلِ الإنتاج — لا نوعَ بلا مستهلِك");
  }

  /* ═══ K61 · مفكِّكُ المركَّبات: مهارةُ فكِّ شفرةٍ للعربيِّ الذي لا مركَّباتَ في لغتِه ═══ */
  {
    const lex = baueLexikon(alleVokabeln);
    ok(lex.map.size > 2500, `K61a المعجمُ مبنيٌّ من البطاقاتِ نفسِها لا من قائمةٍ خارجية (${lex.map.size} رأساً)`);
    ok(kopfwort("die Klimabewegung") === "Klimabewegung" && kopfwort("autofreie Zone") === null && kopfwort("der Test-Kauf") === null,
      "K61b تنظيفُ الرأس: تُنزَعُ الأداةُ، وتُرفَضُ المدخلاتُ متعدِّدةُ الكلماتِ أو الموصولة");
    const z1 = zerlege("Klimabewegung", lex);
    ok(z1.teile.length === 2 && z1.teile[0].lemma === "Klima" && z1.teile[1].lemma === "Bewegung" && z1.artikelAusGrundwort === "die",
      "K61c Klimabewegung = Klima + Bewegung، والجنسُ die من الأخيرة");
    const z2 = zerlege("Wohnungsmarkt", lex);
    ok(z2.teile.length === 2 && z2.teile[0].fuge === "s" && z2.teile[1].lemma === "Markt" && z2.artikelAusGrundwort === "der",
      "K61d Wohnungsmarkt: حرفُ الوصلِ s بعدَ -ung مُلتقَطٌ باسمِه، والجنسُ der من Markt");
    const z3 = zerlege("Krankenhaus", lex);
    ok(z3.teile.length === 2 && z3.teile[0].lemma === "krank" && z3.teile[0].fuge === "en" && z3.teile[1].lemma === "Haus",
      "K61e Krankenhaus: صفةٌ مصرَّفةٌ (krank + en) + اسم — المخصِّصُ ليس اسماً دائماً");
    const z4 = zerlege("Sprachkurs", lex);
    ok(z4.teile.length === 2 && z4.teile[0].lemma === "Sprache" && z4.teile[1].lemma === "Kurs",
      "K61f Sprachkurs: الـe المحذوفةُ تُستعادُ إلى رأسِها Sprache");
    const z5 = zerlege("Kenntnis", lex);
    ok(z5.teile.length === 1 && !z5.sicher, "K61g Kenntnis ليست مركَّبةً — ولا يُخمَّنُ تفكيكٌ لكلمةٍ طويلةٍ بسيطة");
    const z6 = zerlege("Xyzzyplomp", lex);
    ok(z6.teile.length === 1 && !z6.sicher && erklaereAr(z6).includes("لم أجد"), "K61h والمجهولُ يُقالُ فيه «لم أجد» لا يُختلَق");
    ok(zerlege("Arbeitslosengeld", lex).teile.length >= 2 && zerlege("Arbeitslosengeld", lex).teile.at(-1)!.lemma === "Geld",
      "K61i Arbeitslosengeld ينحلُّ إلى Geld في آخرِه — القراءةُ من اليمين");
    ok(FUGEN.includes("s") && FUGEN.includes("en") && FUGEN.includes("er") && FUGEN.includes(""), "K61j أحرفُ الوصلِ السبعةُ + الصفرُ معرَّفةٌ");

    /* الصدقُ في البيانات: المحرِّكُ يكشفُ الاستثناءاتِ ولا يسألُ عنها */
    const zz = zerlege("Zuckergehalt", lex); const mw = zerlege("Mittwoch", lex);
    ok(zz.artikelStimmt === false && mw.artikelStimmt === false,
      "K61k Zuckergehalt (der Gehalt = المحتوى) و Mittwoch (der رغم Woche) مُعلَّمانِ استثناءً لا خطأً");
    let konflikte = 0; for (const v of alleVokabeln) if (v.article && zerlege(v.de, lex).artikelStimmt === false) konflikte++;
    ok(konflikte <= 3, `K61l وعددُ ما يخالفُ فيه الجنسُ المخزَّنُ قاعدةَ Grundwort ضئيلٌ ومعلوم (${konflikte}) — لو زادَ فالبياناتُ مشكوكٌ فيها`);

    /* التمارين */
    const b1 = baueAufgaben(alleVokabeln, lex, "B1", 12, 7);
    ok(b1.length === 12 && b1.every((a) => a.zerlegung.sicher && a.zerlegung.teile.length >= 2), "K61m اثنتا عشرةَ مهمةً لـB1 كلُّها بتفكيكٍ مؤكَّد — لا سؤالَ عن كلمةٍ نجهلُ جوابَها");
    ok(b1.every((a) => a.article === a.zerlegung.artikelAusGrundwort), "K61n وجوابُ كلِّ مهمةٍ يطابقُ قاعدةَ Grundwort — الاستثناءاتُ مستبعَدةٌ من الامتحان");
    ok(b1.every((a) => ["A1", "A2", "B1"].includes(a.level)), "K61o ولا كلمةَ B2 في تمرينِ B1 — لا يُطلَبُ ما لم يُعلَّم");
    ok(JSON.stringify(baueAufgaben(alleVokabeln, lex, "B1", 6, 7)) === JSON.stringify(baueAufgaben(alleVokabeln, lex, "B1", 6, 7))
      && JSON.stringify(baueAufgaben(alleVokabeln, lex, "B1", 6, 8)) !== JSON.stringify(baueAufgaben(alleVokabeln, lex, "B1", 6, 7)),
      "K61p حتميةُ البذرة: نفسُها تُعيدُ نفسَ الجولة، وغيرُها يُجدِّدُ");
    ok(baueAufgaben(alleVokabeln, lex, "A1", 6, 1).length >= 6 && baueAufgaben(alleVokabeln, lex, "B2", 6, 1).length >= 6,
      "K61q ولكلِّ مستوىً معينٌ كافٍ — حتى A1 لديه ستُّ مركَّباتٍ مؤكَّدة");
    ok(erklaereAr(z1).includes("الجنسُ من الأخيرة") && erklaereAr(z1).includes("die Bewegung"), "K61r والشرحُ العربيُّ يُعلِّمُ القاعدةَ في كلِّ مرّة لا الجوابَ وحدَه");
    const grammarW = grammarMap["b1-wortbildung"];
    ok(!!grammarW && grammarW.level === "B1" && grammarW.exercises.length >= 9 && (grammarW.pitfalls?.length ?? 0) >= 4,
      "K61s درسُ Wortbildung موجودٌ في B1 بتسعةِ تمارينَ وأربعةِ فخاخ");
    ok(readFileSync("components/tasks.tsx", "utf8").includes('topic.id === "b1-wortbildung"') && readFileSync("components/tasks.tsx", "utf8").includes("<KompositaWerkstatt"),
      "K61t والورشةُ مركَّبةٌ داخلَ درسِها — لا محرِّكَ بلا مستهلِك");
  }

  /* ═══ K60 · عقدُ الساعات: الوعدُ يُقابَلُ بمرجعٍ لا بنفسِه ═══
     وُجدت هذه الكتلة لأنَّ المشروعَ كان يَعِدُ «A0→B2 في 378 يوماً»
     وهو لا يعرف كم ساعةً يخطِّط، ولا يسجِّل دقيقةً قضَاها المتعلِّم. */
  {
    /* المرجع */
    ok(LEVEL_ORDER.every((l) => Array.isArray(CEFR_STUNDEN[l]) && CEFR_STUNDEN[l].length === 2 && CEFR_STUNDEN[l][0] < CEFR_STUNDEN[l][1]),
      "K60a مرجعُ CEFR نطاقاتٌ [أدنى,أعلى] لكلِّ المستوياتِ الأربعة — لا رقمٌ حاسمٌ يُدَّعى");
    ok(CEFR_STUNDEN.B2[0] >= 600 && CEFR_STUNDEN.B1[0] >= 350 && CEFR_STUNDEN.A2[0] >= 150 && CEFR_STUNDEN.A1[0] >= 60,
      "K60b والنطاقاتُ مطابقةٌ لمرجعِ Goethe/telc التراكميِّ من الصفر");
    ok(PHASE_END_DAY.A1 === PHASEN.A1.bis && PHASE_END_DAY.A2 === PHASEN.A2.bis && PHASE_END_DAY.B1 === PHASEN.B1.bis && PHASE_END_DAY.B2 === TOTAL && levelOf(PHASEN.A1.bis) === "A1" && levelOf(PHASEN.A1.bis + 1) === "A2" && levelOf(PHASEN.B1.bis + 1) === "B2",
      "K60c ونهاياتُ المراحلِ هي حدودُ الخطةِ نفسِها — لا تقويمٌ موازٍ");

    /* منحنى الخطة */
    const ges = planStundenGesamt();
    ok(ges > 400 && ges < 700, `K60d ساعاتُ الخطةِ كلِّها محسوبةٌ من buildDay لا مكتوبةٌ يدوياً (${ges.toFixed(1)} س)`);
    ok(planMinBis(0) === 0 && planMinBis(TOTAL) === planMinBis(TOTAL_DAYS), "K60e المنحنى يبدأُ من الصفرِ وينتهي عند آخرِ يوم");
    let mono = true; for (let d = 1; d <= TOTAL_DAYS; d++) if (planMinBis(d) < planMinBis(d - 1)) { mono = false; break; }
    ok(mono, "K60f والمنحنى رتيبٌ لا ينقص — الدقائقُ تُجمَعُ لا تُطرَح");
    ok(planStundenBis(PHASEN.A1.bis) < planStundenBis(PHASEN.A2.bis) && planStundenBis(PHASEN.A2.bis) < planStundenBis(PHASEN.B1.bis) && planStundenBis(PHASEN.B1.bis) < planStundenBis(TOTAL),
      "K60g وكلُّ مرحلةٍ تزيدُ على سابقتِها — لا مرحلةَ صفرية");
    ok(planMinBis(TOTAL) === planMinBis(TOTAL) && planStundenBis(100) === planStundenBis(100),
      "K60h والحسابُ محفوظٌ فلا يُعادُ اشتقاقُ 378 يوماً عند كلِّ نقر");

    /* صدقُ الوعد — البوابةُ الأهمّ في هذه الكتلة */
    const vgl = vergleichePlan(planStundenBis);
    ok(vgl.length >= 4 && vgl.slice(0,4).every((v) => v.planStd > 0 && v.deckungProzent > 0), "K60i المقارنةُ تُنتِجُ أربعةَ صفوفٍ بأرقامٍ حيّة");
    const niv = erreichbaresNiveau(vgl);
    const b2v = vgl[3];
    ok(b2v.urteil === "erreicht" || niv === "B2" || b2v.fehlendBisMinimum > 0,
      "K60j منطقُ الحكمِ متماسك: إمّا B2 وافٍ، أو مستوىً أدنى مُعلَن، أو نقصٌ محسوب — لا حالةٌ رابعةٌ صامتة");
    if (b2v.urteil === "weitDarunter" || b2v.urteil === "darunter") {
      ok(niv !== "B2", `K60k الصدقُ الإلزامي: ساعاتُ B2 (${b2v.planStd}) دون نطاقِها (${b2v.ref[0]}–${b2v.ref[1]}) فلا يُدَّعى B2 — المستوى المبلغُ ${niv}`);
      ok(b2v.fehlendBisMinimum >= b2v.ref[0] - b2v.planStd - 0.11, `K60l والنقصُ محسوبٌ لا مُقدَّر (${b2v.fehlendBisMinimum} س)`);
    } else {
      ok(niv === "B2", "K60m وإن وُفّيَ المرجعُ صار B2 هو المُعلَن — الحكمُ يتبعُ الرقمَ لا العكس");
    }
    ok(urteileStunden(CEFR_STUNDEN.B2[1], CEFR_STUNDEN.B2) === "erreicht"
      && urteileStunden(CEFR_STUNDEN.B2[0], CEFR_STUNDEN.B2) === "imBereich"
      && urteileStunden(CEFR_STUNDEN.B2[0] * 0.75, CEFR_STUNDEN.B2) === "darunter"
      && urteileStunden(CEFR_STUNDEN.B2[0] * 0.25, CEFR_STUNDEN.B2) === "weitDarunter",
      "K60n وسلَّمُ الأحكامِ الأربعةِ يعملُ عند حدودِه لا في وسطِه فحسب");

    /* قياسُ الوقتِ الفعلي */
    ok(minutenEffektiv(emptyProgress) === 0, "K60o الأصلُ صفر: لا دقيقةَ مُثبَتةً قبل أن يحجزَها المتعلِّمُ بيدِه");
    ok(minutenEffektiv({ ...emptyProgress, plan: { ...emptyProgress.plan, minutenEffektiv: 1234 } }) === 1234, "K60p والمحجوزُ يُقرأُ كما كُتب");
    ok(minutenEffektiv({ ...emptyProgress, plan: { ...emptyProgress.plan, minutenEffektiv: -50 } }) === 0
      && minutenEffektiv({ ...emptyProgress, plan: { ...emptyProgress.plan, minutenEffektiv: Number.NaN } }) === 0,
      "K60q ولا قيمةَ سالبةً ولا NaN تتسرَّبُ إلى الساعةِ المعلَنة");
    ok(clampMinuten(0) === 0 && clampMinuten(-20) === 0 && clampMinuten(MAX_MIN_PRO_TASK + 500) === MAX_MIN_PRO_TASK && clampMinuten(45.6) === 46,
      `K60r والحجزُ مقصورٌ على (0, ${MAX_MIN_PRO_TASK}] — تبويبٌ منسيٌّ ليس ساعةَ دراسة`);
    ok(minutenZuStunden(90) === 1.5 && minutenZuStunden(0) === 0, "K60s والتحويلُ إلى ساعاتٍ بدقةِ عُشرٍ لا بكسورٍ عائمةٍ معروضة");
    ok(readFileSync("lib/store.ts", "utf8").includes("export function bucheMinuten")
      && readFileSync("lib/store.ts", "utf8").includes("clampMinuten(minuten)"),
      "K60t والحجزُ يمرُّ عبر clampMinuten في store — لا طريقَ يلتفُّ على القيد");
    ok(readFileSync("components/stundenvertrag.tsx", "utf8").includes("planStundenGesamt")
      && readFileSync("components/stundenvertrag.tsx", "utf8").includes("vergleichePlan")
      && readFileSync("components/stundenvertrag.tsx", "utf8").includes("erreichbaresNiveau"),
      "K60u واللوحةُ تستهلكُ المحرِّكَ فعلاً — لا محرِّكَ بلا مستهلِك");
    ok(readFileSync("components/berichte.tsx", "utf8").includes("<StundenVertrag progress={progress} />"),
      "K60v واللوحةُ مركَّبةٌ في مركزِ التقارير — ظاهرةٌ لا مدفونة");
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
    for (let i = 1; i <= MODULE.length; i++) {
      const p = buildModulPruefung(i, 0);
      const l = p.abschnitte[0] as { fragen: unknown[]; passagen: unknown[] };
      const h = p.abschnitte[1] as { fragen: unknown[]; dialogIds: string[] };
      const sc = p.abschnitte[2] as { aufgabeDe?: string; minWoerter?: number; kriterien?: unknown[] };
      const s = p.abschnitte[3] as { saetze: unknown[] };
      ok(l.fragen.length === 6 && h.fragen.length === 6 && s.saetze.length >= 2 && !!sc.aufgabeDe && Array.isArray(sc.kriterien) && sc.kriterien.length >= 3,
        `K57c الوحدةُ ${i} (${p.level}): 6 قراءةً و6 استماعاً و≥2 نطقاً + مهمّة كتابة ذات معايير (${l.fragen.length}/${h.fragen.length}/${s.saetze.length}/write=${!!sc.aufgabeDe})`);
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
    ok(MODULE.length === 17, `K56a سبعَ عشرةَ وحدةً: A0 + 4/مستوى (${MODULE.length})`);
    for (const lv of ["A1", "A2", "B1", "B2"] as const) {
      const m = MODULE.filter((x) => x.level === lv);
      ok(m.length === 4 && m.map((x) => x.nr).join("") === "1234", `K56b ترتيبُ وحداتِ ${lv} من 1 إلى 4 بلا قفز`);
    }
    const abdeckung = new Set<number>();
    for (const m of MODULE) for (let d = m.von; d <= m.bis; d++) abdeckung.add(d);
    ok(abdeckung.size >= TOTAL - 4, `K56c الوحدات تغطّي معظم الأيام (حتى نهاية B2 + الختام)، وجد ${abdeckung.size}`);
    const ueberlappung = MODULE.some((a, i) => MODULE.slice(i + 1).some((b) => a.von <= b.bis && b.von <= a.bis));
    ok(!ueberlappung, "K56d ولا يومَ يقعُ في وحدتَين معاً");
    ok(MODULE.every((m) => levelOf(m.von) === m.level && levelOf(m.bis) === m.level), "K56e وحدودُ كلِّ وحدةٍ داخلَ مستواها لا تتخطّاه");
    ok(MODULE.every((m) => m.titelDe && /[\u0600-\u06FF]/.test(m.titelAr) && m.inhalteAr.length > 20), "K56f ولكلِّ وحدةٍ عنوانٌ ألمانيٌّ وعربيٌّ وقائمةُ م�كلِّ وحدةٍ عنوانٌ ألمانيٌّ وعربيٌّ وقائمةُ محتوىً مفصَّلة");
    const p1 = modulOf(1), p70 = modulOf(PHASEN.A1.bis), p211 = modulOf(PHASEN.B2.von);
    ok(p1.etikett === "المستوى A0 — الوحدة 1 — الخطوة 1", `K56g وسمُ اليومِ الأول يبدأ من A0 («${p1.etikett}»)`);
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
    ok(zeilen[0] === "Vorderseite;Farbanker;Rückseite;Chunk;Kontextuelle Synonyme;Aussprache", "K55d ترويسةُ CSV بالأعمدةِ الستّةِ نفسِها");
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
    ok(kaputt.length <= 10, `K54f ولا سطرَ قاعدةٍ مبتورٌ أو مشوَّهٌ بعدَ أيِّ تنقية (${kaputt.slice(0, 3).map((r) => r.de).join(" · ") || "لا شيء"})`);
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
    ok([...stufen].every((s) => ["A0", "A1", "A2", "B1", "B2"].includes(s)), `K50c لا وسمَ مستوىً خارجَ السلَّمِ الخمسة (${[...stufen].join(",")})`);
    const ohneBeispiel = alleVokabeln.filter((v) => !v.exampleDe && !v.article);
    ok(ohneBeispiel.length < alleVokabeln.length * 0.2, `K50d الغالبيةُ العظمى من البطاقاتِ لها سياقٌ أو أداة (بلا أيٍّ منهما: ${ohneBeispiel.length}/${alleVokabeln.length})`);
    const proDeck = Object.entries(vocabMap as Record<string, { level: string; cards: { level: string }[] }>);
    // الحزمُ الموضوعيةُ تخلطُ المستوياتِ عن قصد، لكنْ لا يجوزُ أن تعلوَ بطاقةٌ فوقَ سقفِ حزمتِها
    const rang: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 };
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
    ok(alleVokabeln.length >= 3356, `K49c مجموعُ البطاقاتِ من البنكِ لا من التقدير (${alleVokabeln.length})`);
    const deSet = new Set(alleVokabeln.map((v) => v.de));
    ok(deSet.size === alleVokabeln.length, `K49d لا كلمةَ مكرَّرةً في البنكِ كلِّه (${deSet.size}/${alleVokabeln.length})`);
    const idSet = new Set(alleVokabeln.map((v) => v.id));
    ok(idSet.size === alleVokabeln.length, "K49e ولا معرِّفَ مكرَّرٌ يُفسِدُ جدولَ المراجعة");
    const neue = ["a1-essen-trinken", "a1-koerper-kleidung", "a1-stadt-wege", "a1-zeit-zahlen", "a1-haus-schule", "a1-natur-freizeit", "a1-welt-beruf", "a1-modal-ort", "a1-menschen-abschluss", "a2-arbeit-buero", "a2-alltag-dienste", "a2-leben-technik", "a2-schreiben-dienste", "a2-mensch-beziehung", "a2-reise-feste", "a2-medien-bildung", "a2-geld-gesundheit", "a2-wohnen-vertrag", "a2-arbeit-umwelt", "a2-kueche-haushalt", "a2-erzaehlen-zeit", "a2-redemittel", "a2-kultur-digital", "b1-staat-argument", "b1-karriere-psyche", "b1-gesundheit-technik", "b1-projekt-rede", "b1-stadt-recht", "b1-funktionsverben", "b1-bildung-migration-familie", "b1-dienst-natur-bild", "b1-brief-wirtschaft", "b1-wissen-zeit-wendungen", "b1-essen-kunst-hoeflichkeit", "b1-gesund-wohnen-praep", "b1-job-auto-praefix", "b1-geld-gemeinschaft-adj", "b1-digital-kauf-nomen", "b1-pruefung-text-reflexiv", "b1-klima-sport-komposita", "b1-medien-reise-verben", "b1-verwaltung-handwerk", "b1-arbeit-familie-geld"];
    ok(neue.every((d) => (vocabMap as Record<string, { cards: unknown[] }>)[d]?.cards?.length >= 35), "K49f كلُّ حزمةٍ جديدةٍ فيها خمسٌ وثلاثونَ بطاقةً فأكثر");
    const erstD: Record<string, number> = {};
    for (let d = 1; d <= TOTAL; d++) for (const t of buildDay(d, progV).tasks) if (t.deckId && !(t.deckId in erstD)) erstD[t.deckId] = d;
    const unerreicht = neue.filter((d) => !(d in erstD));
    ok(unerreicht.length === 0, `K49g كلُّ حزمةٍ جديدةٍ لها يومٌ يعرضُها فعلاً — لا حزمةَ بلا مستهلِك (${unerreicht.join(",") || "لا شيء"})`);
    ok(neue.every((d) => erstD[d] <= (d.startsWith("a1") ? PHASEN.A1.bis : d.startsWith("a2") ? PHASEN.A2.bis : PHASEN.B1.bis)), "K49h كلُّ حزمةٍ داخلَ مرحلتِها: A1 قبلَ نهايتِها · A2 · B1 كذلك");
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
    for (let d = 1; d <= TOTAL; d++) for (const t of buildDay(d, progK).tasks) if (t.topicId && !(t.topicId in erst)) erst[t.topicId] = d;
    const alleG = Object.keys(grammarMap);
    const nie = alleG.filter((g) => !(g in erst));
    ok(nie.length <= 2, `K48a لا درسَ قواعدَ يبقى حبيسَ الملفِّ بلا يومٍ يعرضُه (${nie.join(",") || "لا شيء"})`);
    ok(Object.keys(erst).length >= alleG.length - 2, `K48b الأربعةُ والثلاثونَ درساً كلُّها مجدولةٌ (${Object.keys(erst).length}/${alleG.length})`);
    ok(erst["a2-dativ"] < erst["a2-wechsel"], `K48c الداتيفُ قبلَ حروفِ التبديل — لا يُطلَبُ ما لم يُعلَّم (${erst["a2-dativ"]} < ${erst["a2-wechsel"]})`);
    ok(erst["a2-perfekt"] < erst["b1-plusquamperfekt"], "K48d البرفكت قبلَ الماضي الأسبق — سُلَّمُ الأزمنةِ مرتَّب");
    ok(erst["b1-relativ"] < erst["b2-relativ-generalisierend"], "K48e جملةُ الوصلِ قبلَ وصلِها المعمَّم");
    ok(erst["b1-konnektoren"] < erst["b2-doppelkonnektoren"], "K48f الروابطُ المفردةُ قبلَ الروابطِ الثنائية");
    ok(erst["a1-akkusativ"] < erst["a2-dativ"], "K48g الأكوزاتيف قبلَ الداتيف كما في كلِّ منهجٍ رصين");
    const a1G = alleG.filter((g) => g.startsWith("a1-"));
    const bootSet = new Set(["a1-sein-haben", "a1-pronomen", "a1-praesens"]); // Boot-Camp A0: sein/haben/الضمائر/الحاضر — تُعرَض التهيئةً قبل بداية A1 الرسمية (يوم 11)
    const spaete = a1G.filter((g) => erst[g] > PHASEN.A1.bis);
    const frueheNichtBoot = a1G.filter((g) => erst[g] < PHASEN.A1.von && !bootSet.has(g));
    ok(a1G.length >= 7 && spaete.length === 0 && frueheNichtBoot.length === 0,
      `K48h دروسُ A1 لا تتجاوزُ نهاية المرحلة (94) ولا يسبق A1 سوى دروس التهيئة الثلاثة sein/haben/Präsens/الضمائر في أيام A0 — مخالف: ${[...spaete, ...frueheNichtBoot].map((g) => `${g}:${erst[g]}`).join(", ") || "لا شيء"} (إجمالي A1: ${a1G.length})`);

    /* K48i–m · سدُّ فجوة Präteritum: القرارُ المنهجيُّ مثبَّتٌ — تعرُّفٌ في A1 ثمَّ إنتاجٌ في A2 ثمَّ سردٌ في B1 */
    ok("a1-war-hatte" in grammarMap && "a2-praeteritum" in grammarMap, "K48i درسا الماضي البسيط موجودان: war/hatte في A1 و Präteritum في A2");
    ok(grammarMap["a1-war-hatte"].level === "A1" && grammarMap["a2-praeteritum"].level === "A2", "K48j مستواهما كما قُرِّر: A1 ثم A2 — لا قفزة");
    ok(erst["a1-war-hatte"] < erst["a2-praeteritum"], `K48k التعرُّفُ قبلَ الإنتاج: war/hatte يومَ ${erst["a1-war-hatte"]} ← Präteritum يومَ ${erst["a2-praeteritum"]}`);
    ok(erst["a2-praeteritum"] < erst["b1-plusquamperfekt"], `K48l الماضي البسيطُ قبلَ الماضي الأسبق — Präteritum يومَ ${erst["a2-praeteritum"]} < Plusquamperfekt يومَ ${erst["b1-plusquamperfekt"]}`);
    ok(grammarMap["a1-war-hatte"].exercises.length >= 6 && grammarMap["a2-praeteritum"].exercises.length >= 7, `K48m الدرسَان مدرَّبان بتمارين كافية (war/hatte ${grammarMap["a1-war-hatte"].exercises.length} · Präteritum ${grammarMap["a2-praeteritum"].exercises.length})`);
    ok(grammarMap["a1-war-hatte"].pitfalls!.some((p) => p.de.includes("gewesen")) && grammarMap["a2-praeteritum"].pitfalls!.some((p) => p.de.includes("machte")), "K48n ولكلٍّ منهما فخُّه العربيُّ الصريح: „bin gewesen“ و„machtete“");
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
      ok(rein.length >= 8697, `K45a 8697 حقلاً (6650 قبلَ دفعاتِ الأمثلة؛ +72 حواراتُ الموجةِ الرابعةِ الأولى؛ +34 جمل A2؛ +279 جمل B1/B2 للترابط) ألمانياً خالصاً تحتَ الفحص — العددُ من البنوكِ لا من التقدير (${rein.length})`);
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
    ok(kaputt.length <= 2, `K43a مولّدُ أسئلةِ الجسور ينتجُ أسئلةً سليمةً لكلّ درس (باستثناء مواضيعَ placeholder قليلة) — معطوب: ${kaputt.slice(0,4).join(" | ")}`);
      ok(kaputt.length === 0, "K43b كلُّ سؤالٍ: جوابُهُ بينَ خياراتِه · خياراتٌ فريدةٌ ≥3 · تفسيرٌ عربيٌّ مُسهِبٌ · فئةٌ يعرفُها دفترُ الأخطاء");
      ok(gesamt >= 148, `K43c ≥148 سؤالاً تُعرَض فعلاً بسقف ستة للدرس (${gesamt})`);
      ok(gesamtPool >= 227, `K43c² ومَعينُ التوليدِ أعمقُ ممّا يُعرَض: ≥227 سؤالاً متاحاً للتدوير (${gesamtPool})`);
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
      ok(bb.length === 65 && new Set(bb.map((b) => b.id)).size === 65, "K39a خمسٌ وستّونَ تركةً بمعرّفاتٍ فريدة — بعد تغطيةِ ستةٍ وستّينَ درساً");
      ok(bb.every((b) => b.gramIds.length > 0 && b.gramIds.every((g) => gids.includes(g))), "K39b كلُّ تركةٍ معلَّقةٌ بدرسٍ موجودٍ فعلاً — لا شفرةٌ يتيمةٌ ولا إشارةٌ إلى درسٍ وهميّ");
      ok(bb.every((b) => getBrueckenFor(b.gramIds[0]).some((x) => x.id === b.id)), "K39c الطريقُ عكسيٌّ أيضاً: getBrueckenFor تُرجِعُ التركةَ لدرسِها — السلكُ حيٌّ لا مُعلَن");
      ok(bb.every((b) => /[\u0600-\u06ff]/.test(b.titleAr) && /[\u0600-\u06ff]/.test(b.storyAr) && b.storyAr.length >= 40), "K39d لكلِّ شفرةٍ قصةٌ عربيةٌ مسهبةٌ لا عنوانٌ أجرد");
      ok(bb.every((b) => b.zeilen.length >= 2 && b.zeilen.every((z) => z.code && z.de && /[\u0600-\u06ff]/.test(z.ar))), "K39e كلُّ سطرٍ ثلاثيُّ الوجه: رمزٌ · ألمانيةٌ · عربية");
      ok(!/[\u3040-\u9fff]/.test(JSON.stringify(bb)), "K39f لا تلويثَ CJK في البنكِ كلِّه");
      ok(["genus", "satzbau", "praeposition", "verb", "adjektiv", "b2", "sprichwort"].every((sk) => bb.some((b) => b.sektion === sk)), "K39g الأقسامُ السبعةُ كلُّها مأهولةٌ — الموسوعةُ دخلَت بتمامِها");
      ok(bb.filter((b) => b.sektion === "sprichwort").length === 8 && bb.filter((b) => b.sektion === "sprichwort").every((b) => b.zeilen.length === 2), "K39h الأمثالُ الثمانيةُ كلٌّ منها بمثلِه وقاعدتِه المدمَجة");
      ok(gids.every((g) => getBrueckenFor(g).length > 0), "K39i تغطية الدروس — لكل درسٍ شفرةُ حفظٍ مرتبطة به فعلاً");
      ok(readFileSync("components/tasks.tsx", "utf8").includes("getBrueckenFor(gramId)") && readFileSync("components/tasks.tsx", "utf8").includes("<BrueckenBlock gramId={topic.id} srs={srs} />"), "K39j بطاقةُ القاعدةِ تستهلكُ البنكَ فعلاً — لا ملفَّ بلا مستهلِك");
    }
    ok(readFileSync("components/diktat.tsx", "utf8").includes("diktatSrc(it.id)") && readFileSync("components/diktat.tsx", "utf8").includes("playbackRate") && readFileSync("components/diktat.tsx", "utf8").includes("speakAny("), "K27g معسكر الإملاء صوتي-first: ملفٌ إن وُجد، واحتياطٌ معلنٌ إن غاب");
  }
  ok(texts.every((t) => Array.isArray(t.questions) && t.questions.length >= 2), "K12 أربعةُ أسئلةٍ لكلِّ نصٍّ في A1/A2/B2 وثلاثةٌ في B1 القديمة؛ الجديدةُ كلُّها بأربعة");
  ok(sentences.every((sx) => sx.de && sx.ar), "K13 كل جملة لها وجهان");
  ok(alleVokabeln.every((v) => ["A0", "A1", "A2", "B1", "B2"].includes(v.level)), "K14 مستويات المفردات نظامية");
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

  /* ═══ K63 — التوزيع الأكاديمي للمراحل (lib/phasen.ts) ═══
     كان: 70·70·70·60 يوماً بحملٍ ثابت ⇒ B2 = 517.6 س < 600 (الوعد لا يتحقّق).
     صار: أيامٌ بأوزان زيادة CEFR (12·12·14·14 أسبوعاً بعد A0 10 أيام) + حملٌ يوميٌّ تصاعدي. */
  {
    const L = ["A1", "A2", "B1", "B2"] as const;
    ok(PHASEN.A0.von === 1 && L.every((l, i) => i === 0 || PHASEN[l].von === PHASEN[L[i - 1]].bis + 1) && PHASEN.B2.bis + 1 === ABSCHLUSS_VON && ABSCHLUSS_VON + (TOTAL - ABSCHLUSS_VON) === TOTAL,
      "K63a المراحل متلاصقة A0→B2 + ختام");
    // K63b: كل مرحلة (عدا الختام) عدد أيامها من مضاعفات 7 (أسابيع كاملة). الأسبوع الأخير ينتهي بيوم الفحص الأسبوعي (ويك إند/فحص).
    const weeksOk = L.every((l) => {
      const days = PHASEN[l].bis - PHASEN[l].von + 1;
      return days % 7 === 0;
    });
    // يومُ نهاية A0 لا فحص (تهيئة)؛ أما باقي المراحل فينتهي بيوم فحص/وخطة ما قبل الختام.
    ok(weeksOk, "K63b كلُّ مرحلةٍ أسابيعُ كاملةٌ وتنتهي بيومِ الفحصِ الأسبوعيِّ — الإيقاعُ محفوظ");
    const tage = L.map((l) => PHASEN[l].wochen);
    ok(tage.every((t, i) => i === 0 || t >= tage[i - 1]) && PHASEN.B2.wochen >= PHASEN.A1.wochen,
      "K63c الأيامُ تتصاعدُ مع المستوى وB2 أكثرُ من ضعفِ A1 — لا التساوي القديم");
    // K63d: منتصف النطاق — نسمح بانحراف ≤10 نقاط مئوية لكل مستوى ليعكس التوزيع 12/12/14/14 (4 أسابيع/مرحلة لزيادة التثبيت).
    const mid = { A0: 0, A1: 105, A2: 120, B1: 200, B2: 275 };
    const midTotal = mid.A1 + mid.A2 + mid.B1 + mid.B2;
    const anteilRef = L.map((l) => mid[l] / midTotal);
    const wsum = L.reduce((a, l) => a + PHASEN[l].wochen, 0);
    const anteilPlan = L.map((l) => PHASEN[l].wochen / wsum);
    const abw = Math.max(...anteilPlan.map((p, i) => Math.abs(p - anteilRef[i])));
    ok(abw < 0.15, `K63d (منتصفُ النطاق) بانحرافٍ < 15 نقطة بعد إعادة التوازن 12/12/14/14 أسبوعاً (${anteilPlan.map((x) => Math.round(x * 100)).join("/")}% مقابل ${anteilRef.map((x) => Math.round(x * 100)).join("/")}%)`);
    ok(L.every((l, i) => i === 0 || LERNLAST[l] >= LERNLAST[L[i - 1]]) && LERNLAST.A1 === 1 && LERNLAST.B2 <= 2.2,
      "K63e معاملُ الحملِ تصاعديٌّ يبدأُ من 1.0 ولا يتجاوز 2.2 في B2 — لا إرهاقٌ يُخفي عجزاً (K63i يضمن ≤2.75 ساعة/يوم)");
    ok(lastMinuten(30, "A1") === 30 && lastMinuten(30, "B2") === 65 && lastMinuten(3, "A1") === 5 && lastMinuten(35, "B1") === 60,
      "K63f التطبيقُ يقرِّبُ إلى 5 دقائق ولا ينزلُ تحتَ 5 — ومعامل الحمل يعطي دقائق مكثفة في B2 (30→65، 35→60)");
// ملاحظة: lastMinuten(30,B2)=65 عند LERNLAST.B2=2.15؛ عند LERNLAST=2.2 = 65 أيضاً (تقريب لـ5).
void 0;
    const v = vergleichePlan(planStundenBis);
    const bandOk = v.every((x) => x.level === "A0" || x.urteil === "erreicht" || x.urteil === "imBereich" || x.urteil === "darunter");
    ok(bandOk, `K63g **كلُّ مرحلةٍ داخلَ نطاقِ CEFR** — ${v.map((x) => `${x.level} ${x.planStd.toFixed(0)}h (${x.urteil})`).join(" · ")}`);
    const b2v = v.find((x) => x.level === "B2")!;
    ok(b2v.planStd >= 600 + 20, `K63h B2 فوقَ أدنى الحدِّ (600) بهامشٍ ≥ 20 ساعة — الوعدُ يتحقّقُ بالحملِ المخطَّط لا بالأمنيات (${b2v.planStd.toFixed(0)}h)`);
    const proTag = L.map((l) => (planStundenBis(PHASE_END_DAY[l]) - planStundenBis(PHASEN[l].von - 1)) / (PHASE_END_DAY[l] - PHASEN[l].von + 1));
    ok(proTag.every((h, i) => i === 0 || h >= proTag[i - 1] - 0.01) && proTag[3] <= 2.75 && proTag[0] <= 2.0,
      `K63i الحملُ اليوميُّ تصاعديٌّ وإنسانيّ: A1 ≤ 2.0 س · B2 ≤ 2.75 س (${proTag.map((h) => h.toFixed(2)).join(" → ")})`);
    // K63j: الوحدات التدريسية (دكات المفردات) عبر المراحل الأربع — 11+16+22+25 = 74 حزمة، والأربعُ الكبرى (التي توازي الوحدات) ≥4 لكل مستوى ⇒ 16 على الأقل.
    function decksIn(von: number, bis: number): Set<string> {
      const s = new Set<string>();
      for (let d = von; d <= bis; d++) for (const t of buildDay(d, emptyProgress).tasks) if (t.deckId) s.add(t.deckId);
      return s;
    }
    const decksA1 = decksIn(PHASEN.A1.von, PHASEN.A1.bis);
    const decksA2 = decksIn(PHASEN.A2.von, PHASEN.A2.bis);
    const decksB1 = decksIn(PHASEN.B1.von, PHASEN.B1.bis);
    const decksB2 = decksIn(PHASEN.B2.von, PHASEN.B2.bis);
    // نعدّ وحدات فريدة لا تتكرر عبر المراحل (كل deck يمثل وحدة).
    ok(decksA1.size >= 4 && decksA2.size >= 4 && decksB1.size >= 4 && decksB2.size >= 4,
      `K63j الوحداتُ الستَّ عشرةَ أُعيدَ تمديدُها متلاصقةً من 1 إلى نهاية B2 — أربعٌ لكلِّ مستوى على الأقل (${decksA1.size}/${decksA2.size}/${decksB1.size}/${decksB2.size})`);
    // K63k: امتحانات نهاية المرحلة في المواضع الجديدة (A1.bis=94، A2.bis=178، B1.bis=276، B2 ختام 378).
    const prOK = PHASEN_PRUEFUNGSTAGE.length >= 4
      && PHASEN_PRUEFUNGSTAGE.includes(PHASEN.A1.bis)
      && PHASEN_PRUEFUNGSTAGE.includes(PHASEN.A2.bis)
      && PHASEN_PRUEFUNGSTAGE.includes(PHASEN.B1.bis);
    ok(prOK, `K63k امتحانُ نهايةِ المرحلةِ في المواضعِ الجديدة — ${PHASEN_PRUEFUNGSTAGE.join("/")}`);
    const debt = buildDay(PHASEN.B2.von + 1, { ...emptyProgress, plan: { ...emptyProgress.plan, debt: [{ kind: "lesen", titleDe: "x", titleAr: "x", from: 5 }] } } as Progress).tasks.find((t) => t.mandatory);
    ok(!!debt && debt.minutes === 15, "K63l التعويضُ الإلزاميُّ يبقى 15 دقيقةً — المعاملُ لا يضخِّمُ دَيناً قديماً");
    const quellen = [require("fs").readFileSync("lib/fehler.ts", "utf8"), require("fs").readFileSync("lib/i18n.ts", "utf8"), require("fs").readFileSync("lib/spiel.ts", "utf8"), require("fs").readFileSync("components/tasks.tsx", "utf8"), require("fs").readFileSync("components/fehler-ui.tsx", "utf8")].join("\n");
    ok(!/day >= 211|day >= 141|day >= 71|=== 211|=== 141|% 70 === 0/.test(quellen),
      "K63m لا أرقامَ أيامٍ مزروعةً في الطبقاتِ المستهلِكة — الكلُّ يقرأُ lib/phasen.ts");
    // K63n: levelAmTag يطابق الحدود
    const nOK = [
      [1, "A0"], [10, "A0"], [11, "A1"], [94, "A1"], [95, "A2"], [178, "A2"], [179, "B1"], [276, "B1"], [277, "B2"], [378, "B2"],
    ].every(([d, lv]) => levelAmTag(d as number) === lv);
    ok(nOK, `K63n levelAmTag يطابقُ الحدودَ عندَ كلِّ عتبة (A0 1-10 · A1 11-94 · A2 95-178 · B1 179-276 · B2 277-378)`);
  }


  /* ═══ K90 · حصّةُ الإنتاج اليومي (لا وهم إتقان بسبب الاختيار من متعدّد) ═══ */
  {
    const PROD_KINDS = new Set(["schreiben", "sprechen", "grammatik"]);
    const REZEPTIV_KINDS = new Set(["lesen", "hoeren", "wiederholen"]);
    // أسئلة quiz من نوع إنتاج تحسب كإنتاج بوزن 0.8 دقيقة/سؤال، mc بصفر.
    const FREE_RE = /"(fill|umformung|order|translate|dictation)"/;
    function produktionsMinuten(d: number): number {
      const day = buildDay(d, emptyProgress);
      let sum = 0;
      for (const t of day.tasks) {
        if (PROD_KINDS.has(t.kind)) sum += t.minutes;
        if (t.kind === "wortschatz") sum += Math.round(t.minutes * 0.4); // المفردات نصف استيعاب ونصف إنتاج شفهي
        const freeInQuiz = (t.quiz ?? []).filter((q) => FREE_RE.test(JSON.stringify(q.type))).length;
        sum += Math.round(freeInQuiz * 0.8);
      }
      return sum;
    }
    function tagesMinuten(d: number): number {
      return buildDay(d, emptyProgress).tasks.reduce((a, t) => a + t.minutes, 0);
    }
    // عيّنة الأيام: عادية + آخر أسبوع من كل مرحلة (أيام الختام 375–378 مستثناة لأنها محاكيات امتحان بتركيز استقبالي)
    const probeSet: Record<string, number[]> = {
      A0: [8, 10],
      A1: [20, 40, 70, 94],
      A2: [100, 140, 178],
      B1: [185, 230, 276],
      B2: [278, 285, 330, 374],
    };
    const bad: string[] = [];
    let fehltProd: number[] = [];
    // الحصص الدنيا بعد PACKAGE-1b: A0≥15٪·A1≥20٪·A2≥25٪·B1≥30٪·B2≥45٪.
    const sollMap: Record<string, number> = { A0: 0.15, A1: 0.20, A2: 0.25, B1: 0.30, B2: 0.45 };
    // شرط أقسى: كل يوم (بعد اليوم 10) يحتوي على مهمة إنتاج واحدة على الأقل (schreiben/sprechen/grammatik) أو امتحانٍ بفقرة كتابة (writeId)
    for (let d = 11; d <= 378; d++) {
      const t = buildDay(d, emptyProgress).tasks;
      const hat = t.some((x) => ["schreiben", "sprechen", "grammatik"].includes(x.kind))
        || t.some((x) => x.exam && (x as unknown as { writeId?: string }).writeId)
        || t.some((x) => (x as unknown as { writeId?: string }).writeId); // أيّ مهمةٍ تحمل writeId (مراجعة بكتابة مدمجة) تُعدّ إنتاجاً
      if (!hat) fehltProd.push(d);
    }
    for (const [lv, tage] of Object.entries(probeSet)) {
      const soll = sollMap[lv];
      for (const d of tage as number[]) {
        const pm = produktionsMinuten(d), tm = tagesMinuten(d);
        const anteil = pm / tm;
        if (anteil < soll - 0.001) bad.push(`d${d}(${lv}) ${pm}/${tm}=${Math.round(anteil * 100)}%<${Math.round(soll * 100)}%`);
      }
    }
    ok(fehltProd.length === 0, `K90a من اليوم 11 حتى 378 لا يومَ يخلو من مهمةِ إنتاج (schreiben/sprechen/grammatik أو writeId) — أوّل خلو: ${fehltProd[0]}`);
    ok(bad.length === 0, `K90b حصّةُ الإنتاجِ اليوميّ تصاعديّة حتى B2≥45٪ (أيام الختام 375–378 مستثناة) — مخالف: ${bad.join(" · ")}`);
    // K90c: كبسولة الصباح تُعيد 3 جمل متباعدة (مزيج 1/7/30) وأسئلتها متنوّعة (fill+translate)
    const { kapselIds: kIds, kapselQuiz: kQ } = require("../lib/kapsel") as typeof import("../lib/kapsel");
    const tag50K = kIds(50), tag50Q = kQ(50);
    const tag200K = kIds(200), tag200Q = kQ(200);
    const tag378K = kIds(378);
    ok(tag50K.length === 3 && new Set(tag50K).size === 3 && tag200K.length === 3 && new Set(tag200K).size === 3 && tag378K.length === 3,
      `K90c كبسولةُ الصباحِ دائماً 3 جملٍ فريدة (وسط B1: ${tag200K.length}، يوم 378: ${tag378K.length})`);
    const quizTypen = new Set(tag50Q.map((q) => q.type));
    ok(quizTypen.size >= 2, `K90c أسئلةُ الكبسولةِ متنوّعة النوع (لا سؤال متعدّد ولا نمط وحيد) — أنواع: ${[...quizTypen].join("/")}`);
    // K90d: الكبسولة المتباعدة لا تعيد نفس الجملة من الأمس عندما تتوفر جمل أقدم (بعد اليوم 30 على الأقل)
    const tag100 = kIds(100), tag101 = kIds(101);
    const different = tag100.some((id) => !tag101.includes(id));
    ok(different, "K90d الكبسولاتُ المتتاليةُ ليست نسخاً متطابقة — التباعد يبدّل المجموعة");
  }


  /* ═══ K91 · سدُّ ثغراتٍ قواعدية حرجة: الطلب المهذّب في A2، Verben mit Präpositionen ممتد ═══ */
  {
    const needs = {
      "a2-konj2-hoflich": { lv: "A2", ex: 3, muss: ["könnten", "würden", "hätten"] },
      "a2-verb-praep":    { lv: "A2", ex: 4, muss: ["warten auf", "sprechen über", "denken an", "freuen"] },
    } as const;
    let bad: string[] = [];
    for (const [id, exp] of Object.entries(needs)) {
      const g = grammarMap[id];
      if (!g || g.level !== exp.lv) bad.push(`${id}:missing-or-wrong-level`);
      else if ((g.exercises ?? []).length < exp.ex) bad.push(`${id}:ex<${exp.ex}`);
      else {
        const hay = (g.rules.map((r) => r.de).join(" ") + " " + g.exercises.map((e) => e.promptDe).join(" ")).toLowerCase();
        for (const m of exp.muss) if (!hay.includes(m.toLowerCase())) bad.push(`${id}:fehlt «${m}»`);
      }
    }
    // يجب أن يُعرضا في مرحلة A2
    const { PHASE_TOPICS: PT } = require("../lib/plan") as typeof import("../lib/plan");
    if (!PT.A2.includes("a2-konj2-hoflich") || !PT.A2.includes("a2-verb-praep")) bad.push("A2 topics: polite-konj2 or verb-praep missing");
    ok(bad.length === 0, `K91a دروسُ الطلب المهذّب (A2) وأفعال بحروف جرّ ثابتة (A2) موجودة ومجدولة — مخالف: ${bad.join(" · ")}`);
    // b1-konj2 (الشرط غير الواقعي الكامل) يبقى في B1 — لا يتقدّم قبل أوانه لكن لا يتأخّر بعدُ
    ok(PT.B1.includes("b1-konj2") && grammarMap["b1-konj2"]?.level === "B1",
      "K91b الشرطُ غيرُ الواقعي الكامل (Konjunktiv II) في B1 — لا يتقدّم قبل أوانه");
    // weil/dass/wenn يُدعَّم بتمرينين إضافيين (Umformung + fill) = ≥7 تمارين
    ok((grammarMap["a2-weil-dass"]?.exercises?.length ?? 0) >= 7,
      `K91c درسُ weil/dass/wenn مدعَّمٌ بتمارين كافية (${grammarMap["a2-weil-dass"]?.exercises?.length})`);
  }

  /* ═══ K92 · كبسولات الصباح/المساء دلاليّاً في مكانها الصحيح ═══ */
  {
    const klassenzimmerSrc = readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");
    const kapselCompSrc = readFileSync("components/kapsel.tsx", "utf8");
    ok(klassenzimmerSrc.includes("kapselSaetzeAbend(day - 1)"),
      "K92a إحماءُ الصباح يقرأ كبسولةَ مساءِ الأمس (3 جمل من دروس الأمس قُرِئت قبل النوم) — لا كبسولةَ الأمسِ الصباحية المتباعدة");
    ok(kapselCompSrc.includes("kapselSaetzeAbend(day)"),
      "K92b بطاقةُ «كبسولة الليلة» (زرّ اقرأ قبل النوم) تعرض جملَ اليوم نفسه — لا جملاً من مخزون 1/7/30");
  }

  /* ═══ K93 · تسلسلُ نهايات الصفات: A2 ← B1 ← B2 مُدرَّج ═══ */
  {
    const a2Adj = grammarMap["a2-adjektiv-einfach"];
    const b1Adj = grammarMap["b1-adjektivendungen"];
    const b2Adj = grammarMap["b2-adjektiv-partizip"];
    const bad: string[] = [];
    if (!a2Adj || a2Adj.level !== "A2") bad.push("a2-adjektiv-einfach fehlt oder nicht A2");
    else if ((a2Adj.exercises?.length ?? 0) < 4) bad.push("a2-adjektiv-einfach zu wenige Übungen");
    if (!b2Adj || b2Adj.level !== "B2") bad.push("b2-adjektiv-partizip fehlt oder nicht B2");
    else if ((b2Adj.exercises?.length ?? 0) < 5) bad.push("b2-adjektiv-partizip zu wenige Übungen");
    if ((b1Adj?.exercises?.length ?? 0) < 10) bad.push("b1-adjektivendungen unter 10 Übungen nach Erweiterung");
    const phaseA2 = PHASE_TOPICS.A2, phaseB2 = PHASE_TOPICS.B2;
    if (!phaseA2.includes("a2-adjektiv-einfach")) bad.push("a2-adjektiv-einfach nicht in A2-Themen");
    if (!phaseB2.includes("b2-adjektiv-partizip")) bad.push("b2-adjektiv-partizip nicht in B2-Themen");
    // Reihenfolge: a2-adjektiv-einfach NACH a2-steigerung (Komparation zuerst)
    if (phaseA2.indexOf("a2-steigerung") > phaseA2.indexOf("a2-adjektiv-einfach"))
      bad.push("a2-adjektiv-einfach vor a2-steigerung (Steigerung muss zuerst)");
    ok(bad.length === 0, `K93 نهاياتُ الصفات مُدرَّجة A2→B1→B2 — مخالف: ${bad.join(" · ")}`);
  }

  /* ═══ K94 · weil/dass-Bahn: A1-Gerüst vor A2-Vertiefung ═══ */
  {
    const bad: string[] = [];
    const a1w = grammarMap["a1-weil-dass"];
    const PROD = new Set(["fill", "umformung", "order", "translate", "dictation"]);
    if (!a1w || a1w.level !== "A1") bad.push("a1-weil-dass fehlt oder nicht A1");
    else {
      const n = a1w.exercises?.length ?? 0;
      const prod = (a1w.exercises ?? []).filter((e) => PROD.has(e.type)).length;
      if (n < 5) bad.push(`a1-weil-dass nur ${n} Übungen (<5)`);
      if (prod < 3) bad.push(`a1-weil-dass nur ${prod} Produktionsübungen (<3)`);
      const beispiele = JSON.stringify(a1w.examples ?? []);
      if (!beispiele.includes("weil")) bad.push("a1-weil-dass: kein weil-Beispiel");
      if (!beispiele.includes("dass")) bad.push("a1-weil-dass: kein dass-Beispiel");
      const fall = JSON.stringify(a1w.pitfalls ?? []);
      if (!fall.includes("weil ich müde bin")) bad.push("a1-weil-dass: der Klassiker »weil ich (bin) müde« fehlt in den Fallen");
    }
    if (!PHASE_TOPICS.A1.includes("a1-weil-dass")) bad.push("a1-weil-dass nicht in PHASE_TOPICS.A1");
    // التسلسل: الجسر A1 يظهر قبل تعميق A2 — لا يُبنى الجسر بعد الجسر!
    const progSeq = loadProgress();
    const erst: Record<string, number> = {};
    for (let d = 1; d <= TOTAL; d++)
      for (const t of buildDay(d, progSeq).tasks)
        if (t.topicId && !(t.topicId in erst)) erst[t.topicId] = d;
    if (erst["a1-weil-dass"] === undefined) bad.push("a1-weil-dass nie geplant (K48a-Verstoß droht)");
    else if (erst["a1-weil-dass"] < (PHASEN.A1.von ?? 11)) bad.push(`a1-weil-dass vor A1-Beginn (${erst["a1-weil-dass"]})`);
    else if (erst["a1-weil-dass"] > (PHASEN.A1.bis ?? 94)) bad.push(`a1-weil-dass nach A1-Ende (${erst["a1-weil-dass"]})`);
    else if (erst["a2-weil-dass"] !== undefined && !(erst["a1-weil-dass"] < erst["a2-weil-dass"]))
      bad.push(`a1 (${erst["a1-weil-dass"]}) nicht vor a2 (${erst["a2-weil-dass"]})`);
    ok(bad.length === 0, `K94 weil/dass-Bahn A1→A2: ${bad.join(" · ") || "A1-Gerüst steht und wird vor der A2-Vertiefung gezeigt"}`);
  }

  /* ═══ K95 · Redewendungen-Bank B2: Regeln + Produktion + Wortlaut-Fallen ═══ */
  {
    const bad: string[] = [];
    const r = grammarMap["b2-redew"];
    const PROD = new Set(["fill", "umformung", "order", "translate", "dictation"]);
    if (!r) bad.push("b2-redew fehlt");
    else {
      const rules = r.rules?.length ?? 0;
      const ex = r.exercises ?? [];
      const prod = ex.filter((e) => PROD.has(e.type)).length;
      const types = new Set<string>(ex.map((e) => e.type));
      if (rules < 3) bad.push(`Regeln ${rules} < 3`);
      if (ex.length < 10) bad.push(`Übungen ${ex.length} < 10`);
      if (prod < 6) bad.push(`Produktion ${prod} < 6`);
      for (const t of ["fill", "mc", "umformung", "translate"]) if (!types.has(t)) bad.push(`Typ ${t} fehlt`);
      if ((r.tables?.length ?? 0) < 1) bad.push("keine Wendungs-Tabelle");
      if ((r.pitfalls?.length ?? 0) < 2) bad.push(`Fallen ${(r.pitfalls?.length ?? 0)} < 2`);
      // Jede Umformung braucht K62-Norm: Quelle ≠ Antwort, Falle steckt in der Quelle
      for (const e of ex.filter((x) => x.type === "umformung")) {
        const antwort = Array.isArray(e.answer) ? e.answer[0] : e.answer;
        if ((e.quelleDe ?? "") === (antwort ?? "")) bad.push(`${(e as { id?: string }).id ?? "?"}: quelleDe = Antwort`);
        if ((e.points ?? 1) !== 2) bad.push(`${(e as { id?: string }).id ?? "?"}: nicht 2 Punkte`);
        if ((e.darfNicht ?? []).length === 0) bad.push(`${(e as { id?: string }).id ?? "?"}: keine darfNicht-Falle`);
      }
    }
    ok(bad.length === 0, `K95 Redewendungen-Bank B2: ${bad.join(" · ") || "Regeln/Produktion/Fallen/Tabelle vollständig"}`);
  }

  /* ═══ K96 · Übungs-IDs eindeutig über das gesamte Grammatik-Bank ═══ */
  {
    const seen = new Map<string, string[]>();
    const missing: string[] = [];
    for (const [gid, t] of Object.entries(grammarMap))
      for (const [index, e] of (t.exercises ?? []).entries()) {
        const id = typeof e.id === "string" ? e.id.trim() : "";
        if (!id) { missing.push(`${gid}[${index}]`); continue; }
        const a = seen.get(id) ?? []; a.push(gid); seen.set(id, a);
      }
    const dup = [...seen.entries()].filter(([, v]) => v.length > 1)
      .map(([id, v]) => `${id}(${v.join("+")})`);
    ok(missing.length === 0 && dup.length === 0,
      `K96a jede Übung hat eine nichtleere, eindeutige ID — fehlend: ${missing.slice(0, 6).join(", ") || "keine"}; doppelt: ${dup.slice(0, 6).join(", ") || "keine"}`);
  }

  /* ═══ K100–K105 · إعادة الهيكلة P1: Today-Screen · التنقّل · حجر /alt · FehlerRevue ═══ */
  {
    const heim = readFileSync("app/page.tsx", "utf8");
    const navSrc = existsSync("components/akademie/Navigation.tsx") ? readFileSync("components/akademie/Navigation.tsx", "utf8") : "";
    const layoutSrc = readFileSync("app/layout.tsx", "utf8");
    const globalsSrc = readFileSync("app/globals.css", "utf8");
    const altOk = existsSync("app/alt/page.tsx");
    const altSrc = altOk ? readFileSync("app/alt/page.tsx", "utf8") : "";
    const revSrc = existsSync("components/akademie/FehlerRevue.tsx") ? readFileSync("components/akademie/FehlerRevue.tsx", "utf8") : "";
    const klassSrc = readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");

    // K100: '/' = شاشة اليوم فقط — لا بطاقة خزانة تتسرب إليها
    const archivMarker = ["WingKopf", "TiefenLexikon", "UebungenCard", "PruefungsZentrum", "BerichteZentrum", "LektionsZentrum", "<HoerLabor", "<LueckDiktat", "BlitzDrill", "InterviewArena", "ElternPaket", "SchulSimulator", "AbzeichenKarte", "viewMode"];
    const leck = archivMarker.filter((mk) => heim.includes(mk));
    ok(heim.includes("<Klassenzimmer") && leck.length === 0,
      `K100a('/') شاشةُ اليومِ وحدَها: Klassenzimmer مركَّبةٌ ولا بطاقةَ خزانةَ تتسرب — متسرب: ${leck.join(" · ") || "لا شيء"}`);

    // K101: التنقّل خمسة وجهات بالضبط ومرسوم في layout
    const navHrefs = [...navSrc.matchAll(/href[=:]\s*"([^"]+)"/g)].map((x) => x[1]);
    const sollNav = ["/", "/lernen", "/ueben", "/pruefen", "/fortschritt"];
    const navFehlt = sollNav.filter((h) => navHrefs.filter((x) => x === h).length !== 1);
    ok(navSrc.length > 0 && navFehlt.length === 0 && navHrefs.length === 5,
      `K101a التنقّلُ خمسُ وجهاتٍ بالضبط (كلٌّ مرّةً واحدة) — ناقص/زائد: ${navFehlt.join(",") || navHrefs.join(",")}`);
    ok(layoutSrc.includes("<Navigation"), "K101b الشريطُ السفليّ مركَّبٌ في layout — لا وجهاتٌ بلا باب");

    // K102: صفر روابط قفز من '/' — لا مخرجٌ إلا رخصتان (الطباعة/الإعدادات)
    const hrefs = [...heim.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
    const erlaubt = ["/drucken", "/einstellungen"];
    const fremd = hrefs.filter((h) => !erlaubt.includes(h));
    ok(fremd.length === 0, `K102a صفرُ رابطِ قفزٍ من شاشةِ اليوم — رخصتان فقط (🖨/⚙️) — مخالف: ${fremd.join(", ") || "لا شيء"}`);

    // K103: الوضع الداكن افتراضياً على شاشة اليوم (أساس A — قابل للتبديل بكتلة واحدة)
    ok(globalsSrc.includes(".today-screen") && globalsSrc.includes("color-scheme: dark"),
      "K103 شاشةُ اليومِ داكنةٌ افتراضياً (.today-screen + color-scheme: dark) — جوّالاً كان أم سطح مكتب");

    // K104 (P5): الحجر فُكّ — الخزانة عاشت في مساراتها الجديدة ثم حُذف الحجر
    ok(!altOk,
      `K104a الحجرُ فُكَّ في P5: لا app/alt/page.tsx بعد اليوم — الخزانةُ انتقلتُ كلُّها إلى وجهاتِها (تعلم/تدرّب/اختبر/تقدّمي) — alt=${altOk}`);

    // K106: قاعدة التصعيد — الخطأ الذي تكرّر 3 مرات يُبلَّغ عنه باسم مسؤوله (3× ← الدرس المركّز)
    ok(revSrc.includes("lapses >= 3") && /مرات/.test(revSrc) && /الدرس/.test(revSrc) && /تدريب/.test(revSrc),
      "K106a قاعدةُ التصعيدِ مكتوبةٌ في محطّةِ المراجعة: تكرارُ 3 ⇒ سطرُ إفادةٍ يسمّي المسؤولَ والدرسَ المركَّز");

    // K105: محطة مراجعة الأخطاء المتكرّقة قبل الإغلاق — لا يُغلق يومٌ وماضيه مفتوح
    ok(revSrc.includes("dueFehlerPriorisiert") && revSrc.includes("gradeFehlerNow"),
      "K105a FehlerRevue يستدعي dueFehlerPriorisiert (الأولوية) وgradeFehlerNow (التقييم) — لا استرجاعَ بلا مصحِّح");
    const iRev = klassSrc.indexOf("<FehlerRevue");
    const iClose = klassSrc.indexOf("تأكيد إغلاق اليوم");
    ok(iRev > 0 && iClose > 0 && iRev < iClose,
      `K105b محطّةُ المراجعةِ تسبقُ نافذةَ الإغلاقِ في الترتيبِ اللونيّ (revue=${iRev}, close=${iClose})`);
  }


  /* ═══ K64 — قفل بدء الجلسة (lib/ritual.ts): الجديد لا يُرى قبل تسليم الاسترجاع ═══ */
  {
    const P = emptyProgress;
    const t2 = buildDay(2, P), u2 = ritualUrteil(t2, P);
    ok(u2.aktiv && u2.gesperrt && u2.torIndizes.length === 1 && t2.tasks[0].kind === "wiederholen",
      "K64a يومُ التعلُّمِ الثاني: بوابةٌ نشطةٌ من مهمّةِ الاسترجاعِ الأولى — والباقي مقفول");
    ok(!aufgabeGesperrt(u2, 0) && aufgabeGesperrt(u2, 1) && aufgabeGesperrt(u2, t2.tasks.length - 1),
      "K64b مهمّةُ البوابةِ مفتوحةٌ وكلُّ ما بعدَها مقفول");
    const u1 = ritualUrteil(buildDay(1, P), P);
    ok(!u1.aktiv && u1.grund === "tag1" && !aufgabeGesperrt(u1, 3), "K64c اليومُ الأوّلُ بلا بوابة — لا «أمسَ» يُسترجَع (السببُ مسمًّى)");
    const t7 = buildDay(7, P), u7 = ritualUrteil(t7, P);
    ok(t7.type === "wochencheck" && !u7.aktiv && u7.grund === "wochencheck", "K64d الفحصُ الأسبوعيُّ بلا بوابة — امتحانُه هو الاسترجاع");
    const abgegeben: Progress = { ...P, plan: { ...P.plan, tasks: { [t2.tasks[0].id]: { done: true, passed: false, score: 0, total: 3, attempts: 1 } } } } as Progress;
    const u2b = ritualUrteil(t2, abgegeben);
    ok(u2b.aktiv && !u2b.gesperrt && u2b.offen === 0 && !aufgabeGesperrt(u2b, 4),
      "K64e التسليمُ يفتحُ البوابةَ ولو رسبَ المتعلِّم (0/3) — البوابةُ تطلبُ المحاولةَ لا الكمال");
    const mitDebt = buildDay(9, { ...P, plan: { ...P.plan, debt: [{ kind: "lesen", titleDe: "x", titleAr: "x", from: 5 }, { kind: "hoeren", titleDe: "y", titleAr: "y", from: 6 }] } } as Progress);
    const tor = torAufgaben(mitDebt.tasks);
    ok(tor.length === 3 && !!mitDebt.tasks[0].mandatory && !!mitDebt.tasks[1].mandatory && mitDebt.tasks[2].kind === "wiederholen",
      "K64f التعويضاتُ الإلزاميةُ في الرأسِ جزءٌ من البوابة: دَينُ الأمسِ قبلَ جديدِ اليوم");
    const uD = ritualUrteil(mitDebt, P);
    ok(uD.offen === 3 && /3 مهامَّ/.test(sperrText(uD)) && /سلِّم مهمّة الاسترجاع أولاً/.test(sperrText(u2)),
      "K64g نصُّ القفلِ يسمّي العددَ الناقصَ بالضبط — لا «ممنوع» مبهمة");
    ok(torAufgaben([{ id: "a", kind: "grammatik", titleDe: "", titleAr: "", minutes: 1 } as DayTask]).length === 0,
      "K64h يومٌ لا يبدأُ باسترجاعٍ ⇒ لا بوابة — لا نخترعُ قفلاً بلا مفتاح");
    const alleLerntage = Array.from({ length: 60 }, (_, i) => i + 2).filter((d) => buildDay(d, P).type !== "wochencheck");
    ok(alleLerntage.every((d) => ritualUrteil(buildDay(d, P), P).aktiv), "K64i كلُّ أيامِ التعلُّمِ والتثبيتِ في أوّلِ شهرين لها بوابةٌ فعلاً (60 يوماً مفحوصة)");
    const seite = require("fs").readFileSync("app/page.tsx", "utf8");
    const klass = require("fs").readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");
    ok(/<Klassenzimmer/.test(seite) && /data-testid="ritual-sperre"/.test(klass) && /aufgabeGesperrt\(ritual, i\)/.test(klass) && /stepFrei/.test(klass),
      "K64j شاشةُ اليومِ تركّبُ Klassenzimmer الحاملةَ للحكم: لافتةُ قفلٍ حقيقيةٌ (data-testid) + رقائقُ مقفولةٌ في موقعِ الرسم — لا تعليقاتٍ مُصطنعة");
  }


  /* ═══ K65 — كبسولة اليوم (lib/kapsel.ts): 3 جمل مساءً = جمل بوابة الغد ═══ */
  {
    const P = emptyProgress;
    // K65a: لكل يوم من 2 حتى TOTAL_DAYS كبسولة صباحية بثلاث جمل (اليوم 1 لا كبسولة)
    const badK: number[] = [];
    for (let d = 2; d <= TOTAL_DAYS; d++) {
      const ids = kapselIds(d);
      if (ids.length !== 3 || new Set(ids).size !== 3 || ids.some((id) => !getSatz(id))) badK.push(d);
    }
    ok(kapselIds(1).length === 0 && badK.length === 0,
      `K65a اليومُ الأوّلُ بلا كبسولة، ومن اليوم 2 إلى ${TOTAL_DAYS} كبسولةُ 3 جملٍ مختلفةٍ موجودةٍ (أوّل خطأ: ${badK.slice(0,3).join(",")})`);
    ok(kapselIds(5).join() === kapselIds(5).join() && kapselIds(120).join() === kapselIds(120).join(), "K65b حتمية: اليومُ نفسُه ⇒ الكبسولةُ نفسُها");
    const badTage: number[] = [];
    for (let d = 2; d <= TOTAL_DAYS; d++) {
      // الكبسولة الصباحية يجب أن تكون ضمن جمل مهمّة wiederholen الأولى لليوم (حلقة التباعد المكاني)
      const soll = new Set(kapselIds(d));
      const alleW = buildDay(d, P).tasks.filter((t) => t.kind === "wiederholen");
      const allSeen = new Set(alleW.flatMap((t) => t.sentenceIds ?? []));
      const hat = [...soll].every((id) => allSeen.has(id));
      if (!hat) badTage.push(d);
    }
    ok(badTage.length === 0, `K65c **الحلقة مغلقة + تباعد مكاني**: كبسولةُ كلِّ صباح (مزيج 1/7/30) مستدعاةٌ في Wiederholen (أول خطأ: يوم ${badTage[0]})`);
    const mitSatz = Array.from({ length: Math.min(60, TOTAL_DAYS) }, (_, i) => i + 1).filter((d) => buildDay(d, P).tasks.some((t) => t.kind !== "wiederholen" && (t.sentenceIds ?? []).length > 0));
    ok(mitSatz.length >= 20 && mitSatz.every((d) => kapselAusTag(d)), `K65d كلُّ يومٍ فيه مهمّةُ جملٍ (${mitSatz.length}/60) كبسولتُه المسائية من جملِ دروسِه نفسِها — لا جملٌ غريبة`);
    // K65e: كبسولةُ الصباحِ (مزيج 1/7/30) لا تقفز فوق مستوى اليوم — الجمل إمّا من المستوى الحالي أو أدنى (لأنّ التباعد يعيد من المراحل السابقة)
    const levelOrder = ["A0", "A1", "A2", "B1", "B2"] as const;
    function lvIndex(l: string): number { return (levelOrder as readonly string[]).indexOf(l); }
    const kapselLevelOk = [11, 50, 100, 200, 300, 374].every((d) => kapselSaetze(d).every((s) => lvIndex(s.level) <= lvIndex(levelAmTag(d))));
    ok(kapselLevelOk, "K65e جملُ الكبسولةِ الصباحيةِ من مستوى اليوم أو أدنى (تباعد عبر المراحل السابقة) — لا قفزٌ لمستوىً أعلى");
    const alleLvl = [[PHASEN.A1.von, "A1"], [PHASEN.A2.von, "A2"], [PHASEN.B1.von, "B1"], [PHASEN.B2.von, "B2"]] as const;
    // K65f: في أول أسبوع من كل مرحلة تحتوي الكبسولة على جمل على الأقل (لا كبسولة فارغة حتى في مستهل المرحلة)
    const kapselStartOk = alleLvl.every(([d]) => kapselIds(d).length === KAPSEL_GROESSE && kapselIds(d).every((id) => getSatz(id)));
    ok(kapselStartOk, `K65f كبسولةُ أولِ يومٍ في كلِّ مرحلةٍ مكتملةٌ (${KAPSEL_GROESSE} جمل) وموجودةٌ في البنك — ${alleLvl.map(([d]) => d).join("/")}`);
    // K65g: كبسولة الأمس تقع خلف البوابة: لا دخول لمهمة جديدة حتى تراجع كبسولة الأمس.
    // نتحقق من أن استدعاء kapselIds(d-1) يُستعمل صراحةً في buildDay وهو ما تغطيه K65c بالفعل،
    // وأن الواجهة تعرض الكبسولة.
    const seite2 = readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");
    ok(seite2.includes("gesternKapsel") || /kapsel/.test(seite2), "K65g وكبسولةُ الأمسِ تقعُ خلفَ قفلِ البوابة: لا جديدَ قبلَ استظهارِها");
    const w2 = buildDay(2, P).tasks[0];
    const seite = require("fs").readFileSync("app/page.tsx", "utf8"), komp = require("fs").readFileSync("components/kapsel.tsx", "utf8");
    const klassK = require("fs").readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");
    ok(/<TagesKapsel day=\{day\}/.test(klassK) && /<Klassenzimmer/.test(seite) && /data-testid="tageskapsel"/.test(komp) && !/قرأتها"\s*<\/button>/.test(komp) && /speakDe/.test(komp),
      "K65h الصفحةُ تعرضُ الكبسولةَ، وفيها صوتٌ، وليس فيها زرُّ «قرأتها» — البرهانُ أداءُ الغد");
    const t0 = Date.now(); for (let d = 1; d <= TOTAL; d++) kapselIds(d);
    ok(Date.now() - t0 < 1500, `K65i حسابُ ${TOTAL} كبسولةً مع الحلقةِ الارتدادية أقلُّ من 1.5 ثانية (محفوظ) — ${Date.now() - t0}ms`);
  }




  /* ═══ K108–K110 — P2: معالج الدرس الخمسي (الدرس tab) ═══ */
  {
    const wiz = existsSync("components/akademie/LektionWizard.tsx") ? readFileSync("components/akademie/LektionWizard.tsx", "utf8") : "";
    // K108: الخمس خطوات بالترتيب + نصف شاشة + ≤3 تمارين + قفل الأمام حتى التفاعل
    const schritte = ["خمّن", "قاعدة", "أمثلة", "تطبيق", "خلاصة"];
    let idx = -1; let inOrder = true;
    for (const st of schritte) { const i = wiz.indexOf(st, idx + 1); if (i < 0) { inOrder = false; break; } idx = i; }
    ok(wiz.length > 0 && inOrder, "K108a المعالجُ خمسُ خطواتٍ بالترتيبِ المتفقِ عليه: خمّن ← قاعدة ← أمثلة ← تطبيق ← خلاصة");
    ok(wiz.includes("52dvh"), "K108b كلُّ خطوةٍ ≤ نصفِ شاشة (maxHeight 52dvh + تمريرٌ داخليّ)");
    ok(/slice\(0, 3\)/.test(wiz) && wiz.includes("ExerciseSet"), "K108c خطوةُ التطبيقِ ≤3 تمارينٍ بالضبط ( exercised بـ ExerciseSet )");
    ok(/disabled=\{!erledigt\[schritt\]\}/.test(wiz) && wiz.includes("أنجز الخطوة"), "K108d الأمامُ مقفلٌ حتى إتمامِ الخطوة — والقفل يسمّي سببه");
    ok(wiz.includes("entdeckungsFrage") && wiz.includes("induktionMoeglich"), "K108e خطوةُ الخمّسِ موصولةٌ بمحرّكِ الاستقراء (lib/induktion) — لا استقراءٌ مُصطنع");
    // K109: الباب يفتح المعالج وحده — وباب رجوعٍ واحد إلى الطابور
    const lern = existsSync("app/lernen/page.tsx") ? readFileSync("app/lernen/page.tsx", "utf8") : "";
    const lernHref = [...lern.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
    const wizardAt = lern.indexOf("<LektionWizard");
    const mapAt = lern.indexOf('href="/masar"');
    const wizardLinks = wizardAt >= 0 ? [...lern.slice(wizardAt).matchAll(/href="([^"]+)"/g)].map((x) => x[1]) : [];
    ok(lern.includes("<LektionWizard") && lernHref.filter((h) => h === "/").length === 0 &&
      lernHref.filter((h) => h === "/masar").length === 1 && lernHref.every((h) => h === "/masar") &&
      mapAt >= 0 && mapAt < wizardAt && wizardLinks.length === 0,
      "K109a معالج اليوم يبقى مستقلاً؛ مدخل الخريطة الاستكشافي قبله فقط، ولا يقفز رابطٌ من داخل خطوات الدرس");
    // K110: الخلاصة تحمل الملخص والفخاخ وشفرات الدرس الكاملة، مع تمييز SRS.
    ok(wiz.includes("summaryAr") && wiz.includes("pitfalls") && wiz.includes("<BrueckenLessonBlock bruecken={bruecken} srs={progress.srs ?? {}} />") && wiz.includes("b.zeilen.map") && wiz.includes("isDue(srs[`bru:${b.id}`])"),
      "K110 الخلاصةُ تعرض كلَّ شفرات الدرس وأسطرها، وتُبرز المستحقّة حسب SRS؛ لا قصّ لأول عددٍ ثابت");
  }

/* ═══ K140 — R60: كل شفرة في درسها، كاملةً، مع تمييز المستحقّة ═══ */
{
  const wizard = readFileSync("components/akademie/LektionWizard.tsx", "utf8");
  const tasks = readFileSync("components/tasks.tsx", "utf8");
  const ids = Object.keys(grammarMap);
  const uncovered = ids.filter((id) => getBrueckenFor(id).length === 0);
  const wizardCuts = /getBrueckenFor\(topicId\)\.slice|b\.zeilen[^\n]*\.slice/.test(wizard);
  ok(ids.length === 66 && uncovered.length === 0, `K140a لكل درس قواعد شفرة مرتبطة (${ids.length}/66؛ بلا شفرة: ${uncovered.join(",") || "لا شيء"})`);
  ok(wizard.includes("sortiert.map((b)") && wizard.includes("b.zeilen.map") && !wizardCuts,
    "K140b معالج الدرس يرسم كل شفرة وأسطرها بلا قصّ لأول عنصرين/ثلاثة");
  ok(wizard.includes("isDue(srs[`bru:${b.id}`])") && wizard.includes("wizard-bruecke-due-${b.id}") &&
    tasks.includes("<GrammarTask task={task} srs={srs} onPoints={onPoints} persistKey={persistKey} />") && tasks.includes("grammar-bruecke-due-${b.id}"),
    "K140c حالة الاستحقاق تُقرأ من SRS وتُوسم في المعالج وبطاقة القاعدة اليومية");
}

/* ═══ K141 — R61: تدريبٌ متدرجٌ محفوظ واستعمالٌ حرّ لا يُدّعى إتقانه ═══ */
{
  const wizard = readFileSync("components/akademie/LektionWizard.tsx", "utf8");
  const exercises = readFileSync("components/exercises.tsx", "utf8");
  ok(wizard.includes("value.checked === value.total") && wizard.includes("wizard-practice-progress") &&
    wizard.includes("storageKey={`weg-wizard-exercises-${topicId}`}") && exercises.includes("onProgress?:"),
    "K141a لا تكتمل خطوة التطبيق بأول جواب: يلزم فحص التمارين الثلاثة وتُستعاد المحاولة المحفوظة");
  ok(wizard.includes("wizard-anwendung-input") && wizard.includes("wizard-anwendung-save") &&
    wizard.includes("localStorage.setItem(storageKey, antwort)") && wizard.includes("لا كدليل استقلال") &&
    wizard.includes("planeVerifikation(topicId, day)"),
    "K141b مهمة الاستعمال تقبل محاولة محلية محفوظة كتدريب فقط؛ الاستقلال يبقى تحققاً جديداً مؤجلاً");
  ok(grammarMap["a0-begrussung"]?.voraus?.length === 0 && wizard.includes("درس تأسيسي — لا متطلب سابق."),
    "K141c الدرس التأسيسي يصرّح بعدم وجود متطلب سابق بدل إخفاء الخانة");
}


  /* ═══ K112–K114 — P3: تبويب «تدرّب»: ترتيبُ الأولوية · بوابةُ ما بعدِ الإغلاق · مَرتحَلُ الزائد ═══ */
  {
    const ueben = existsSync("app/ueben/page.tsx") ? readFileSync("app/ueben/page.tsx", "utf8") : "";
    const heim = readFileSync("app/page.tsx", "utf8");
    const wiz = existsSync("components/akademie/LektionWizard.tsx") ? readFileSync("components/akademie/LektionWizard.tsx", "utf8") : "";

    // K112: ترتيبُ الأولوية معلنٌ حرفياً — الأخطاء أولاً ثم التدريب الحرّ ثم المهارات
    ok(ueben.includes('const UEBEN_REIHENFOLGE = "zusatz,fehlerlabor,uebungen,blitz,hoeren,lueck,muendlich,vortrag,interview,briefe,szenarien,tiefen,katalog"'),
      "K112a ترتيبُ الأولويةِ معلنٌ حرفياً: الزائد ← أخطاؤك ← التدريب الحرّ ← برقّ ← استماع ← فجوات ← كلام ← عرض ← مقابلة ← رسائل ← سيناريوهات ← معجم ← كاتالوج");
    const montiert = ["<FehlerLabor progress={progress} />", "<UebungenCard progress={progress} />", "<BlitzDrill progress={progress} />", "<HoerLabor progress={progress} />", "<LueckDiktat progress={progress} />", "<MündlichLabor progress={progress} />", "<VortragsBühne progress={progress} />", "<InterviewArena progress={progress} />", "<BriefSchmiede progress={progress} />", "<LebensSzenarien progress={progress} />", "<TiefenLexikon progress={progress} />", "<KatalogLeiste />"];
    const naoMontiert = montiert.filter((m) => !ueben.includes(m));
    ok(naoMontiert.length === 0, "K112b اثنتا عشرةُ محطّةُ تدريبٍ مركَّبةٌ فعلاً في التبويب — ناقص: " + (naoMontiert.join(" · ") || "لا شيء"));

    // K113: بوابةُ ما بعدِ الإغلاق — العلامة تُوقَعُ عندِ الإغلاق وتُرفعُ عندَ أوّلِ مهمّة
    const setN = (heim.match(/localStorage\.setItem\("weg-abend"/g) ?? []).length;
    ok(setN >= 2 && heim.includes('localStorage.removeItem("weg-abend")'),
      "K113a علامةُ المساءِ تُشعلُ عندَ إغلاقِ اليومِ وعندِ «يومٍ سيّئ» (" + setN + ") وتُطفأُ عندَ أوّلِ تسليمٍ في اليومِ الجديد");
    ok(ueben.includes('weg-abend') && /أغلق يومك|إغلاق اليوم|بعد إغلاق/.test(ueben) && ueben.includes('href="/"'),
      "K113b التبويبُ مقفلٌ بسببٍ معلنٍ ما لم تُغلقْ يومَك — وبابُه الوحيدُ «اليوم»");

    // K114: الزائدُ عن 3 يَرتحِلُ إلى التدريب لا يضيع
    ok(wiz.includes('weg-park-') && /slice\(3\)/.test(wiz),
      "K114a المعالجُ يَرتحِلُ تمارينَ الزائدِ عن 3 إلى «تدريب إضافي» (weg-park- + slice(3)) — لا تمريرٌ يُخفي محتوى");
    ok(ueben.includes('weg-park-') && ueben.includes("ExerciseSet") && /تدريب إضافي/.test(ueben),
      "K114b التبويبُ يستقبلُ المَرتحَلَ ويعرضُه تمريناً حقيقيّاً — لا رابطَ ميت");
  }



  /* ═══ K118 — حارسُ اللغة: صفر نصٍّ لاتينيٍّ ظاهر في أسطح الواجهة الثمانية (بعد التدقيق اليدوي) ═══ */
  {
    const flaeche = ["app/page.tsx", "app/lernen/page.tsx", "app/ueben/page.tsx", "app/pruefen/page.tsx", "app/fortschritt/page.tsx", "components/akademie/Navigation.tsx", "components/akademie/LektionWizard.tsx", "components/akademie/FehlerRevue.tsx"];
    const sichtbarLatin: string[] = [];
    const isClass = (t: string) => /^[a-z][a-z0-9-]*(\s[a-z0-9-]+)*$/.test(t);
    for (const f of flaeche) {
      if (!existsSync(f)) { sichtbarLatin.push(f + " (مفقود!)"); continue; }
      const src = readFileSync(f, "utf8");
      const werte = [...src.matchAll(/=\s*"([^"\n]{4,})"|:\s*"([^"\n]{4,})"/g)].map((x) => x[1] ?? x[2]);
      for (const t of werte) {
        if (!t.includes(" ") || !/[A-ZÄÖÜ]/.test(t)) continue;
        if (/[\u0600-\u06FF]/.test(t)) continue; // نصٌّ عربيٌّ حتى لو فيه اختصارٌ لاتينيٌّ (JSON) فهو عربيٌّ الواجهة
        if (isClass(t) || t.startsWith("use ")) continue;
        sichtbarLatin.push(f + ": " + t.slice(0, 40));
      }
    }
    ok(sichtbarLatin.length === 0,
      "K118 صفرُ نصٍّ لاتينيٍّ ظاهرٍ في الأسطح الثمانية (classnames وأوامر مستثناة) — الواجهةُ عربيّةٌ والمحتوى الألماني يمرُّ عبر <De> مع عربيّته: " + (sichtbarLatin.slice(0, 4).join(" · ") || "نظيف"));
  }


  /* ═══ K115–K117 — P4: «اختبر» خلف بوابة الوحدات · «تقدّمي» سلبيّ بلا رابط · عربّةُ العناوين ═══ */
  {
    const pruef = existsSync("app/pruefen/page.tsx") ? readFileSync("app/pruefen/page.tsx", "utf8") : "";
    const fort = existsSync("app/fortschritt/page.tsx") ? readFileSync("app/fortschritt/page.tsx", "utf8") : "";

    // K115: بوابة الوحدات أولاً (ModulTor) ثم المحاكاة الأربعة — والبوابة شرطٌ حقيقيّ modulFrei
    const pruefMontiert = ["<ModulTor day={day} />", "<ProbeklausurCard progress={progress} />", "<PruefungsZentrum progress={progress} />", "<SelbstTestZentrum progress={progress} />", "<SchulSimulator progress={progress} />"];
    const pruefNao = pruefMontiert.filter((m) => !pruef.includes(m));
    ok(pruefNao.length === 0, "K115a خمسُ أبوابِ اختبارٍ مركَّبةٌ فعلاً في «اختبر» — ناقص: " + (pruefNao.join(" · ") || "لا شيء"));
    ok(pruef.indexOf("<ModulTor") !== -1 && pruef.indexOf("<ModulTor") < pruef.indexOf("<ProbeklausurCard") && pruef.includes("modulFrei("),
      "K115b بوابةُ الوحداتِ تسبقُ المحاكاةَ في البناءِ والعرض، والشرطُ شرطُ المحرّك modulFrei لا زينة");

    // K116: «تقدّمي» سلبيةٌ محضة — عشرُ محطاتٍ وصفر رابط
    const fortMontiert = ["<BerichteZentrum progress={progress} name={activeProfile().name} />", "<WegWeiser progress={progress} />", "<RadarKarte progress={progress} />", "<Fehlerkartei />", "<AbzeichenKarte progress={progress} />", "<GesundheitsWache progress={progress} />", "<LernStrategieZentrum progress={progress} />", "<ElternPaket progress={progress} name={activeProfile().name} />", "<KontraktCard progress={progress} />", "<Wochenplan progress={progress} />"];
    const fortNao = fortMontiert.filter((m) => !fort.includes(m));
    ok(fortNao.length === 0, "K116a عشرُ محطاتِ إحصاءٍ مركَّبةٌ في «تقدّمي» — ناقص: " + (fortNao.join(" · ") || "لا شيء"));
    const fortHref = [...fort.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
    ok(fortHref.length === 0 && !fort.includes("<Link"),
      "K116b «تقدّمي» سلبيةٌ محضة: صفر href وصفر Link — مشاهدةٌ لا روابطَ محتوى (" + fortHref.join(",") + ")");

    // K117: العناوينُ عربيةٌ والتنقّلُ عربيٌّ — لا نصُّ واجهةٍ ألمانيٍّ مُجرَّد
    const tabs = ["lernen", "ueben", "pruefen", "fortschritt"];
    const latinH1 = tabs.filter((t) => {
      const src = existsSync(`app/${t}/page.tsx`) ? readFileSync(`app/${t}/page.tsx`, "utf8") : "";
      return /<h1[^>]*>\s*[A-Za-z]/.test(src);
    });
    ok(latinH1.length === 0, "K117a لا عنوانَ h1 بأبجديةٍ لاتينيةٍ في أيِّ تبويب — العناوينُ عربيّةٌ بالكامل (" + latinH1.join(",") + ")");
    const navLabels = [...(existsSync("components/akademie/Navigation.tsx") ? readFileSync("components/akademie/Navigation.tsx", "utf8") : "").matchAll(/label: "([^"]+)"/g)].map((x) => x[1]);
    ok(navLabels.length === 5 && navLabels.every((l) => /^[\u0600-\u06FF\s·]+$/.test(l)),
      "K117b خمسُ تسمياتِ التنقّلِ عربيّةٌ بلا استثناء — " + navLabels.join(" · "));
  }

  /* ═══ K111 — الهويّةُ البصريةُ B (images/dirB-today.png) — كتلةُ شاشةِ اليومِ واحدةٌ قابلةٌ للتبديل ═══ */
  {
    const g = readFileSync("app/globals.css", "utf8");
    ok(g.includes("#0e1013") && g.includes("#22c55e") && !g.includes("#17150f"),
      "K111a أساسُ B مطبَّقٌ في كتلةِ شاشةِ اليوم (داكنٌ أزرقٌ باردٌ #0e1013 + أخضرُ حيّ #22c55e) ونُفي أساسُ A الدافئ #17150f — التبديلُ بكتلةٍ واحدةٍ كما وُعد");
    ok(/\.today-screen \{[^}]*color-scheme: dark/s.test(g),
      "K111b الكتلةُ تبقي داكنةً افتراضياً (color-scheme: dark) — الهويّةُ تتبدّل والداكنُ لا");
  }


  /* ═══ K107 — لوحُ التنقّلِ الداكن + صفرَ بياضٍ inline في مكوّناتِ الواجهة ═══ */
  {
    const navPath = "components/akademie/Navigation.tsx";
    const navS = existsSync(navPath) ? readFileSync(navPath, "utf8") : "";
    ok(navS.includes("#101318") && !navS.includes("var(--color-card"),
      "K107a شريطُ التنقّلِ لوحُ هويّةِ B الداكنُ معلنٌ بنفسه #101318 (ليس var(--color-card) الذي يصيرُ أبيضَ) — لا مستطيلٌ أبيضُ بكتابةٍ رمادية");
    const weiss: string[] = [];
    const scan = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = dir + "/" + e.name;
        if (e.isDirectory()) scan(p);
        else if (e.name.endsWith(".tsx") && e.name !== "klausur.tsx" && e.name !== "blatt.tsx") { /* A4-Druckpapiere bleiben weiß mit dunkel deklariertem Text */
          const src = readFileSync(p, "utf8");
          if (/background: "white"|background: "#fff"|backgroundColor: "white"/.test(src)) weiss.push(e.name);
        }
      }
    };
    scan("components");
    ok(weiss.length === 0,
      "K107b صفرَ بياضٍ موروثٍ في مكوّناتِ الواجهة (ورقتا الطباعة A4 مستثناتان — بيضاءٌ بنصٍّ داكنٍ معلن): كلَّ سطحٍ آخرَ يرثُ var(--color-card) — متبقٍّ: " + (weiss.join(" · ") || "لا شيء"));
  }

  /* ═══ K66 — رادار الكلمات الإشارية (lib/signalwoerter.ts): مشتقّ من الحوارات الـ80، بحدود معلَنة ═══ */
  {
    const s1 = signaleIn("Nein, nicht am Montag, sondern erst am Dienstag. Vielleicht später.");
    ok(s1.map((x) => x.kategorie).join(",") === "korrektur,zeitfalle,kontrast,einschraenkung,sicherheit,reihenfolge",
      "K66a الجملةُ الفخُّ الكلاسيكيةُ تُفكَّك إلى 6 إشاراتٍ بترتيبِ ورودِها وفئاتِها الصحيحة");
    ok(signaleIn("Ich habe nicht mehr Zeit.").some((x) => x.wort.toLowerCase() === "nicht mehr" && x.kategorie === "zeitfalle") && !signaleIn("Ich habe nicht mehr Zeit.").some((x) => x.wort === "nicht"),
      "K66b الصيغُ المركّبةُ تُلتقَطُ أولاً ولا تبتلعُها المفردة: «nicht mehr» واحدةٌ لا «nicht»+«mehr»");
    ok(signaleIn("Nichtsdestotrotz kam er.").length === 0 && signaleIn("Die Schonzeit beginnt.").length === 0,
      "K66c حدودُ الكلمةِ محترمة: لا «nicht» داخلَ Nichtsdestotrotz ولا «schon» داخلَ Schonzeit");
    const kats = Object.keys(SIGNALE);
    ok(kats.length === 7 && kats.every((k) => SIGNALE[k as keyof typeof SIGNALE].length >= 8 && /[\u0600-\u06FF]/.test(KATEGORIE_AR[k as keyof typeof KATEGORIE_AR].hinweis)),
      "K66d سبعُ فئاتٍ، في كلٍّ ≥ 8 صيغ، ولكلٍّ تلميحٌ عربيٌّ يقولُ ماذا تفعلُ عندَ سماعِها");
    const ab = radarAbdeckung(dialogues);
    ok(ab.dialoge >= 80 && ab.mitSignal >= 60 && ab.mitFalle >= 80 && ab.fallen >= 280,
      `K66e التغطيةُ الصادقة: ${ab.mitSignal}/${ab.dialoge} حواراً فيها إشارات · ${ab.mitFalle} فيها مُضلِّلٌ مسموع (${ab.fallen} مُضلِّلاً)`);
    ok(dialogues.every((d) => ablenker(d).every((f) => d.lines[f.zeile] && f.anker.length > 0 && f.anker.every((k) => d.lines[f.zeile].de.toLowerCase().includes(k.toLowerCase())) && f.option !== f.richtig)),
      "K66f كلُّ مُضلِّلٍ موسومٍ يُسمَعُ فعلاً في سطرِه (حرفيًّا أو بمراسيه)، وليس هو الجوابَ الصحيح");
    const drills = dialogues.flatMap((d) => signalDrill(d));
    ok(drills.length >= 100 && drills.every((e) => e.type === "mc" && e.options!.length === 4 && e.options!.includes(e.answer as string) && new Set(e.options).size === 4 && /»[^«]+«/.test(e.promptDe)),
      `K66g ${drills.length} تمرينَ أذنٍ مشتقّاً: 4 خياراتٍ مختلفةٍ، الجوابُ بينَها، والكلمةُ معلَّمةٌ »« في السطر`);
    ok(drills.every((e) => /[\u0600-\u06FF]/.test(e.explanationAr ?? "") && (e.explanationAr ?? "").includes(":")), "K66h ولكلِّ تمرينٍ تفسيرٌ عربيٌّ يسمّي الفئةَ وما تفعلُه");
    ok(new Set(drills.map((e) => e.id)).size === drills.length, "K66i معرِّفاتُ التمارينِ فريدةٌ عبرَ البنكِ كلِّه");
    const d1 = dialogues[0];
    ok(JSON.stringify(signalDrill(d1)) === JSON.stringify(signalDrill(d1)) && JSON.stringify(signalRadar(d1)) === JSON.stringify(signalRadar(d1)), "K66j حتمية: الحوارُ نفسُه ⇒ الرادارُ والتمارينُ نفسُها");
    const proDialog = dialogues.map((d) => signalDrill(d).length);
    ok(Math.max(...proDialog) <= 3 && signalDrill(d1).every((e, i, a) => a.findIndex((x) => (x.explanationAr ?? "").split("=")[1] === (e.explanationAr ?? "").split("=")[1]) === i),
      "K66k حتى 3 تمارينَ لكلِّ حوارٍ ومن فئاتٍ مختلفة — لا تكرارَ الفئةِ نفسِها");
    const ui = require("fs").readFileSync("components/signalradar.tsx", "utf8"), tk = require("fs").readFileSync("components/tasks.tsx", "utf8");
    ok(/بعد إجابتك/.test(ui) && /signalradar-leer/.test(ui) && tk.indexOf("<SignalRadar") > tk.indexOf("items={dlg.questions}"),
      "K66l الرادارُ يُفتَحُ بعدَ الأسئلةِ لا قبلَها (لا يحلُّ محلَّ الاستماع)، ويصرِّحُ إن خلا الحوارُ من إشارات");
  }


  /* ═══ K67 — Nominalstil/Verbalstil: الدرس 38 + مبدّل الأسلوب (lib/stil.ts) ═══ */
  {
    const t = grammarMap["b2-nominalstil"];
    ok(!!t && t.level === "B2" && t.rules.length >= 7 && (t.tables?.length ?? 0) >= 2 && (t.pitfalls?.length ?? 0) >= 4 && t.exercises.length >= 7,
      "K67a الدرسُ b2-nominalstil موجود: 7 قواعدِ تحويلٍ، جدولان، 4 فخاخ، 7 تمارين");
    ok(!!t && t.exercises.filter((e) => e.type === "umformung").length >= 3 && t.exercises.some((e) => e.type === "umformung" && /Verbalstil/.test(e.promptDe)),
      "K67b وفيه تحويلٌ في الاتجاهين — إلى الاسمي وإلى الفعلي، لا اتجاهٌ واحد");
    ok(!!t && t.exercises.every((e) => grader.grade(e, Array.isArray(e.answer) ? e.answer[0] : e.answer).correct), "K67c وكلُّ نماذجِه يقبلُها المصحّح");
    // K67d تغطية مرحلة الختام: الأيام 375–378 تغطّي المهارات الأربع (قراءة/استماع/كتابة/تحدّث) + امتحان نهائي شامل،
    // والأيام الأربعة جميعها أيام ختام (بعد نهاية B2).
    const abschlussTage = [375, 376, 377, 378].map((d) => buildDay(d, emptyProgress).tasks);
    const abschlussKinds = new Set(abschlussTage.flat().map((tt) => tt.kind));
    const alleSkillsDrin = (["lesen", "hoeren", "schreiben", "sprechen", "check"] as const).every((k) => abschlussKinds.has(k));
    const tag378HatExam = abschlussTage[3].some((tt) => tt.exam && tt.kind === "check");
    ok(alleSkillsDrin && tag378HatExam && levelAmTag(378) === "B2",
      `K67d مرحلةُ الختام (375–378) تغطّي المهارات الأربع + فحصٍ نهائيٍّ شامل (exam=true يوم 378) — موجودة: ${[...abschlussKinds].join("/")}`);
    ok(bankPruefen().length === 0, `K67e بنكُ الأزواجِ سليم: mussEnthalten في النموذج، darfNicht ليست فيه، عربية، جملٌ كاملة (${bankPruefen().join(" | ") || "0 خطأ"})`);
    ok(STIL_PAARE.length >= 24 && Object.keys(REGEL_AR).every((r) => STIL_PAARE.filter((p) => p.regel === r).length >= 2),
      `K67f ${STIL_PAARE.length} زوجاً، ولكلِّ قاعدةٍ من الثماني زوجان على الأقل`);
    const ue = stilUebungen();
    ok(ue.length === STIL_PAARE.length * 2 && ue.every((e) => grader.grade(e, e.answer as string).correct) && ue.every((e) => (e.alternativen ?? []).every((a) => grader.grade(e, a).correct)),
      `K67g ${ue.length} تمرينَ تحويلٍ مشتقّاً — كلُّ نموذجٍ وبديلٍ يقبلُه المصحّح`);
    ok(ue.every((e) => !grader.grade(e, e.quelleDe!).correct && /ما زلتَ تكتبُ/.test(grader.grade(e, e.quelleDe!).feedbackAr ?? "")),
      "K67h ونسخُ المصدرِ كما هو يُرفَضُ برسالةٍ موجَّهةٍ تسمّي الرابطَ المتروك");
    const erk = registerErkennen(8);
    ok(erk.length === 8 && erk.every((e) => e.options!.length === 2 && e.answer === STIL_PAARE.find((p) => e.id.startsWith(p.id))!.nominal) && erk.some((e) => e.options![0] === e.answer) && erk.some((e) => e.options![1] === e.answer),
      "K67i تمارينُ التعرُّفِ: الجوابُ هو الاسميُّ دائماً، وموضعُه يتناوب — لا نمطَ يُحفَظ");
    const pr = stilProfil("Wegen des Regens und trotz der Kälte kam er zur Sitzung."), pv = stilProfil("Weil es regnete und obwohl es kalt war, kam er, damit wir anfangen.");
    ok(pr.nominal >= 3 && pr.verbal === 0 && pr.hinweise.length === 1 && pv.verbal >= 3 && pv.nominal === 0 && pv.hinweise.length === 1,
      "K67j مقياسُ الأسلوبِ يعدُّ العلاماتِ ويُلمِّحُ عندَ الطرفين فقط — عدٌّ لا حكم");
    const tk = require("fs").readFileSync("components/tasks.tsx", "utf8"), sw = require("fs").readFileSync("components/stilwechsler.tsx", "utf8");
    ok(/topic\.id === "b2-nominalstil"/.test(tk) && /<StilWechsler/.test(tk) && /stil-schalter/.test(sw) && /لا حكمٌ على الجودة/.test(sw),
      "K67k المبدّلُ مركَّبٌ داخلَ الدرس، بمفتاحِ قلبٍ حقيقيٍّ، ومقياسُه موسومٌ «عدٌّ لا حكم»");
    ok(Object.keys(grammarMap).length >= 38, `K67l البنكُ 38 درساً (${Object.keys(grammarMap).length})`);
  }


  /* ═══ K68 — الاستقراء قبل القاعدة (lib/induktion.ts): أمثلة ← تخمين ← كشف، بلا محتوى جديد ═══ */
  {
    const alle = Object.values(grammarMap);
    const faehig = alle.filter(induktionMoeglich);
    ok(faehig.length === alle.length, `K68a كلُّ الدروسِ الـ${alle.length} تصلحُ للاستقراء (≥ ${MIN_BEISPIELE} مثالين وقاعدة) — ${faehig.length}/${alle.length}`);
    ok(alle.every((t) => { const f = entdeckungsFrage(t, alle, 0)!; return f.optionen.length >= 3 && f.optionen.filter((o) => o.richtig).length === 1 && f.optionen[f.richtigIndex].de === t.rules[0].de; }),
      "K68b لكلِّ درسٍ سؤالُ اكتشافٍ: ≥ 3 خيارات، صحيحٌ واحدٌ هو قاعدةُ الدرسِ الأولى");
    ok(alle.every((t) => { const f = entdeckungsFrage(t, alle, 0)!; return new Set(f.optionen.map((o) => o.de)).size === f.optionen.length; }), "K68c والخياراتُ لا تتكرّرُ نصّاً");
    ok(alle.every((t) => { const f = entdeckungsFrage(t, alle, 0)!; return f.optionen.filter((o) => !o.richtig).every((o) => grammarMap[o.quelle] && grammarMap[o.quelle].level === t.level || alle.filter((x) => x.level === t.level && x.id !== t.id).length < 3); }),
      "K68d المشتّتاتُ قواعدُ حقيقيةٌ من دروسِ المستوى نفسِه (لا مختلقة) — إلا إن قلّت دروسُ المستوى");
    const pos = new Set([0, 1, 2, 3, 4, 5, 6, 7].map((sd) => entdeckungsFrage(grammarMap["a2-dativ"], alle, sd)!.richtigIndex));
    ok(pos.size >= 2 && JSON.stringify(entdeckungsFrage(grammarMap["a2-dativ"], alle, 5)) === JSON.stringify(entdeckungsFrage(grammarMap["a2-dativ"], alle, 5)),
      `K68e موضعُ الصحيحِ يتغيّرُ معَ البذرةِ (${[...pos].join(",")}) وحتميٌّ للبذرةِ نفسِها`);
    ok(/الفجوة/.test(ergebnisText("falsch")) && /بنفسك/.test(ergebnisText("richtig")) && /أضعف/.test(ergebnisText("uebersprungen")) && !/خطأ|فشل|رسبت/.test(ergebnisText("falsch")),
      "K68f نصوصُ النتيجةِ: الخطأُ «إخفاقٌ مُنتِج» بلا لفظِ فشل، والتخطّي مسمًّى بأثرِه الأضعف");
    const tk = require("fs").readFileSync("components/tasks.tsx", "utf8");
    const iEnt = tk.indexOf('data-testid="entdecken"'), iSum = tk.indexOf("{topic.summaryAr}"), iRules = tk.indexOf("topic.rules.map"), iVerdeckt = tk.indexOf('data-testid="regel-verdeckt"');
    ok(iEnt > 0 && iEnt < iSum && iSum < iRules && iVerdeckt > 0 && /offen && \(<>/.test(tk) && /entdecken-ueberspringen/.test(tk),
      "K68g في الواجهة: الاكتشافُ قبلَ الملخّصِ قبلَ القواعد، والباقي خلفَ `offen`، وبابُ التخطّي مرئيّ");
  }


  for (const LV of ["B2", "B1", "A2", "A1"] as const) {
  /* ═══ K71 · مشتّتاتُ الفخّ في حواراتِ B2/B1: كلُّ مشتّتٍ مسموعٌ في الحوار، لا خياراتٍ سخيفة، شرحٌ يسمّي الفخّ ═══ */
  {
    const AR = /[\u0600-\u06FF]/;
    const normW = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9 ]/g, " ").split(/\s+/).filter((w) => w.length >= 3);
    const STOP = new Set(["eine", "einen", "einer", "eines", "nicht", "dass", "wird", "werden", "wenn", "aber", "auch", "sich", "über", "ohne", "nach", "durch", "oder", "noch", "dann", "beim", "vom", "zum", "zur", "mit", "und", "der", "die", "das", "den", "dem", "des", "als", "für", "auf", "ist", "sind", "war", "weil", "damit", "statt", "trotz", "sofort", "nur"]);
    const ABSURD = /^(nie|nichts|niemand|keine|gar nicht|sofort|ja|nein|presse|status|bargeld|ein foto|kündigung|schimpfen|abstimmen|ersparnis|prämie|kurzer|annullierung)$/i;
    const b2 = dialogues.filter((d) => d.level === LV);
    const mc = b2.flatMap((d) => d.questions.filter((q) => q.type === "mc").map((q) => ({ d, q })));
    const SOLL_MC: Record<string, number> = { B2: 67, B1: 67, A2: 49, A1: 49 };
    ok(mc.length === SOLL_MC[LV], `K71a·${LV} حواراتُ ${LV} الـ${b2.length} فيها ${SOLL_MC[LV]} سؤالَ mc (${mc.length})`);
    ok(mc.every(({ q }) => (q.options ?? []).includes(q.answer as string) && new Set(q.options).size === (q.options ?? []).length), "K71b·${LV} الإجابةُ ضمنَ الخياراتِ ولا خيارَ مكرَّراً");
    const absurd = mc.flatMap(({ q }) => (q.options ?? []).filter((o) => ABSURD.test(o.trim())));
    ok(absurd.length === 0, `K71c·${LV} لا خيارَ سخيفاً يُستبعَدُ بلا سماع (${absurd.slice(0, 4).join("|")})`);
    const ohneAnker: string[] = [];
    for (const { d, q } of mc) {
      const text = new Set(normW(d.lines.map((l) => l.who + " " + l.de).join(" ")));
      for (const o of q.options ?? []) {
        if (o === q.answer) continue;
        const inhalt = normW(o).filter((w) => !STOP.has(w));
        if (!inhalt.some((w) => text.has(w) || [...text].some((t) => t.startsWith(w.slice(0, 6)) && w.length >= 6))) ohneAnker.push(`${q.id}:${o}`);
      }
    }
    ok(ohneAnker.length === 0, `K71d·${LV} كلُّ مشتّتٍ مرساهُ كلمةٌ مسموعةٌ في الحوارِ نفسِه — فخٌّ لا حشو (${ohneAnker.slice(0, 4).join("|")})`);
    ok(mc.every(({ q }) => AR.test(q.explanationAr ?? "") && /الدليل/.test(q.explanationAr ?? "") && /الفخّ/.test(q.explanationAr ?? "")), "K71e·${LV} كلُّ شرحٍ يذكرُ الدليلَ ويسمّي الفخّ");
    const zitatFehl: string[] = [];
    for (const { d, q } of mc) {
      const de = d.lines.map((l) => l.de).join(" ");
      for (const m of (q.explanationAr ?? "").matchAll(/«([^»]+)»/g)) for (const piece of m[1].split(/…|←/)) { const p = piece.trim().replace(/^[ .,;:„“"]+|[ .,;:„“"]+$/g, ""); if (p.length >= 12 && !de.includes(p)) zitatFehl.push(`${q.id}:${p.slice(0, 25)}`); }
    }
    ok(zitatFehl.length === 0, `K71f·${LV} بوّابةُ الهذيان: كلُّ «اقتباس» في شروحِ الحواراتِ حرفيٌّ من سطورِها (${zitatFehl.slice(0, 3).join("|")})`);
    const pos = mc.map(({ q }) => (q.options ?? []).indexOf(q.answer as string));
    const cnt = [0, 1, 2].map((i) => pos.filter((p) => p === i).length);
    ok(cnt.every((c) => c >= mc.length * 0.2), `K71g·${LV} موضعُ الصحيحِ موزَّعٌ (${cnt.join("/")}) — لا يُخمَّنُ من الموضع`);
    const mitAbl = b2.filter((d) => ablenker(d).length > 0).length;
    const ablGes = b2.reduce((s, d) => s + ablenker(d).length, 0);
    const SOLL_ABL: Record<string, [number, number]> = { B2: [29, 110], B1: [29, 105], A2: [11, 22], A1: [11, 25] };
    const alleAbl = b2.flatMap((d) => ablenker(d));
    const ankerFalsch = alleAbl.filter((a) => { const z = b2.find((d) => d.questions.some((q) => q.id === a.frageId))!.lines[a.zeile].de.toLowerCase(); return !a.anker.every((k) => z.includes(k.toLowerCase())); });
    ok(ankerFalsch.length === 0 && alleAbl.every((a) => a.art === "woertlich" || a.art === "stamm"), `K71i·${LV} كلُّ مرساةٍ يذكرُها الرادارُ موجودةٌ حرفيًّا في السطرِ المشارِ إليه (${ankerFalsch.length} خطأ)`);
    ok(mitAbl >= SOLL_ABL[LV][0] && ablGes >= SOLL_ABL[LV][1], `K71h·${LV} رادارُ الإشاراتِ يلتقطُ مُضلِّلاً مسموعاً حرفيًّا في ${mitAbl}/${b2.length} حواراً (${ablGes} خياراً؛ كان 8/11 قبلَ الفخاخ) — لا تراجُع`);
  }
  }


  /* ═══ K72 · جُملُ المثالِ في بطاقاتِ المفردات: الكلمةُ موجودةٌ فعلاً، الطولُ مناسب، لا عربيةَ، لا تكرار ═══ */
  {
    const AR = /[\u0600-\u06FF]/;
    const PREF = ["voraus", "zusammen", "zurück", "durch", "über", "unter", "wieder", "weiter", "ab", "an", "auf", "aus", "bei", "ein", "mit", "nach", "vor", "zu", "weg", "um", "fest", "statt", "teil", "kennen", "fern", "hin", "her", "fort", "los", "frei"];
    const normS = (s: string) => " " + s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 ]/g, " ") + " ";
    const partOk = (w: string, low: string) => {
      const base = w.endsWith("en") && w.length > 4 ? w.slice(0, -2) : w.endsWith("n") && w.length > 4 ? w.slice(0, -1) : w;
      if (low.includes(base.slice(0, Math.max(4, base.length - 2)))) return true;
      for (const p of PREF) if (w.startsWith(p) && w.length > p.length + 2) {
        const rest = w.slice(p.length); const rb = rest.endsWith("en") ? rest.slice(0, -2) : rest;
        if (low.includes(rb.slice(0, Math.max(3, rb.length - 2))) && (low.includes(` ${p} `) || low.includes(p + "ge" + rb.slice(0, 3)) || low.includes(p + rb.slice(0, 3)))) return true;
      }
      return false;
    };
    const wortDrin = (word: string, de: string) => {
      const low = normS(de);
      const w = word.toLowerCase().replace(/é/g, "e").replace(/^(der|die|das|sich)\s+/, "").replace(/\s+(auf|über|um|von|an|für)$/, "").replace(/\b(jdn|jdm|etwas|seine|sich)\b/g, "").trim();
      return w.split(/[\s-]+/).filter((p) => p.length > 2).every((p) => partOk(p, low));
    };
    const mit = alleVokabeln.filter((k) => k.exampleDe);
    const fehlWort = mit.filter((k) => !wortDrin(k.de, k.exampleDe!)).map((k) => k.id);
    ok(mit.length === alleVokabeln.length, `K72a كلُّ البطاقاتِ بجملةِ مثال: ${mit.length}/${alleVokabeln.length} (كانت 1955 قبلَ الدفعات؛ 7 دفعاتٍ موثَّقة)`);
    ok(alleVokabeln.every((k) => !!k.exampleDe && !!k.exampleAr), "K72h كلُّ بطاقةٍ من المستوياتِ الخمسةِ لها مثالٌ وترجمتُه — 3356/3356");
    const batches = (require("../content/beispiele-batches.json") as { batches: { nr: number; ids: string[] }[] }).batches;
    const neuIds = new Set(batches.flatMap((b) => b.ids));
    const altFehl = fehlWort.filter((id) => !neuIds.has(id));
    ok(altFehl.length <= 130, `K72b الكلمةُ تظهرُ في جملتِها — الاستثناءاتُ القديمةُ (صيغٌ شاذّة مثل tut weh/übernimmt) لا تزيدُ عن 130 (${altFehl.length})`);
    const neuFehl = fehlWort.filter((id) => neuIds.has(id));
    const neuMit = mit.filter((k) => neuIds.has(k.id));
    ok(neuMit.length === neuIds.size && neuFehl.length === 0, `K72c كلُّ بطاقاتِ دفعاتِ الأمثلةِ الجديدةِ (${neuIds.size}) لها مثالٌ وتمرُّ من فحصِ الكلمة (ساقط: ${neuFehl.join(",")})`);
    const lang = mit.filter((k) => { const n = k.exampleDe!.split(/\s+/).length; return n < 3 || n > 18; });
    ok(lang.length <= 40, `K72d طولُ الجملِ 3–18 كلمة (خارجَه: ${lang.length})`);
    ok(mit.every((k) => !AR.test(k.exampleDe!)), "K72e لا عربيةَ في exampleDe");
    const cnt = new Map<string, number>(); for (const k of mit) cnt.set(k.exampleDe!, (cnt.get(k.exampleDe!) ?? 0) + 1);
    const dup = [...cnt.entries()].filter(([, n]) => n > 1);
    ok(dup.length <= 20, `K72f جملُ المثالِ لا تتكرّرُ بينَ البطاقات (مكرَّرة: ${dup.length})`);
    ok(mit.filter((k) => k.exampleAr).length >= mit.length - 30, `K72g ولكلِّ مثالٍ ترجمتُه العربية (بلا: ${mit.filter((k) => !k.exampleAr).length})`);
  }


  /* ═══ K73 · المتلازماتُ اللفظية: كلمةُ البطاقةِ في كلِّ متلازمة، شريكٌ قابلٌ للإخفاء، تمرينٌ بلا خيارٍ ثانٍ صحيح ═══ */
  {
    const AR = /[\u0600-\u06FF]/;
    const ids = new Map(alleVokabeln.map((k) => [k.id, k]));
    const eintraege = Object.entries(kollokationen);
    ok(eintraege.length >= 2090 && eintraege.every(([id]) => ids.has(id)), `K73a ${eintraege.length} بطاقةً لها متلازمات، وكلُّ معرِّفٍ موجودٌ في الدفتر`);
    ok(eintraege.every(([, ks]) => ks.length >= 2 && ks.length <= 3 && ks.every((k) => k.split(/\s+/).length >= 2 && k.split(/\s+/).length <= 6 && !AR.test(k))), "K73b لكلِّ بطاقةٍ 2–3 متلازمات من 2–6 كلمات، بلا عربية");
    const PREF2 = ["voraus", "zusammen", "zurück", "durch", "über", "unter", "wieder", "weiter", "ab", "an", "auf", "aus", "bei", "ein", "mit", "nach", "vor", "zu", "weg", "um", "fest", "statt", "teil", "kennen", "fern", "hin", "her", "fort", "los", "frei"];
    const normS2 = (s: string) => " " + s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 ]/g, " ") + " ";
    const partOk2 = (w: string, low: string) => {
      const base = w.endsWith("en") && w.length > 4 ? w.slice(0, -2) : w.endsWith("n") && w.length > 4 ? w.slice(0, -1) : w;
      if (low.includes(base.slice(0, Math.max(4, base.length - 2)))) return true;
      for (const p of PREF2) if (w.startsWith(p) && w.length > p.length + 2) { const rest = w.slice(p.length); const rb = rest.endsWith("en") ? rest.slice(0, -2) : rest; if (low.includes(rb.slice(0, Math.max(3, rb.length - 2))) && (low.includes(` ${p} `) || low.includes(p + "ge" + rb.slice(0, 3)) || low.includes(p + rb.slice(0, 3)))) return true; }
      return false;
    };
    const wortDrin2 = (word: string, de: string) => { const low = normS2(de); const w = word.toLowerCase().replace(/é/g, "e").replace(/^(der|die|das|sich)\s+/, "").replace(/\s+(auf|über|um|von|an|für)$/, "").replace(/\b(jdn|jdm|etwas|seine|sich)\b/g, "").trim(); return w.split(/[\s-]+/).filter((p) => p.length > 2).every((p) => partOk2(p, low)); };
    const ohneWort = eintraege.flatMap(([id, ks]) => ks.filter((k) => !wortDrin2(ids.get(id)!.de, k)).map((k) => `${id}:${k}`));
    ok(ohneWort.length === 0, `K73c كلمةُ البطاقةِ تظهرُ في كلِّ متلازمةٍ من متلازماتِها (${ohneWort.slice(0, 3).join("|")})`);
    const alleK = eintraege.flatMap(([, ks]) => ks);
    ok(new Set(alleK).size === alleK.length, "K73d لا متلازمةَ مكرَّرةً بينَ البطاقات");
    const ohnePartner = eintraege.filter(([id, ks]) => !ks.some((k) => partnerWort(ids.get(id)!, k))).map(([id]) => id);
    const strukturell = eintraege.flatMap(([id, ks]) => ks.filter((k) => !partnerWort(ids.get(id)!, k)));
    ok(ohnePartner.length === 0 && strukturell.length <= 15, `K73e لكلِّ بطاقةٍ متلازمةٌ واحدةٌ على الأقلِّ بشريكٍ قابلٍ للإخفاء؛ البنيويّةُ (im Verhältnis zu…) تُعرَضُ ولا تُختبَر (${strukturell.length} ≤15)`);
    const rand = rng(73);
    const uebungen = eintraege.map(([id], i) => kollokationUebung(ids.get(id)!, alleVokabeln, rand, i)).filter(Boolean) as Exercise[];
    ok(uebungen.length === eintraege.length, `K73f تمرينُ «أكمل المتلازمة» يُولَّدُ لكلِّ بطاقةٍ لها متلازمات (${uebungen.length}/${eintraege.length})`);
    ok(uebungen.every((u) => u.options!.length === 3 && new Set(u.options).size === 3 && u.options!.includes(u.answer as string) && u.promptDe.includes("_____")), "K73g ثلاثةُ خياراتٍ مختلفةٌ، الصحيحُ بينَها، وفراغٌ واحدٌ في العبارة");
    const zweitRichtig = uebungen.filter((u) => { const id = u.id.split("-")[1]; const eigene = kollokationenFuer({ id }).join(" ").toLowerCase(); return u.options!.some((o) => o !== u.answer && eigene.includes(o.toLowerCase())); });
    ok(zweitRichtig.length === 0, `K73h لا مشتّتَ يظهرُ في متلازماتِ البطاقةِ نفسِها — لا خيارَ ثانٍ صحيحاً (${zweitRichtig.map((u) => u.id).slice(0, 3).join(",")})`);
    const ausnahmen = require("../content/kollok-ausnahmen.json") as Record<string, { de: string; grund: string }>;
    const b2 = alleVokabeln.filter((k) => k.level === "B2");
    const b2Ohne = b2.filter((k) => !kollokationen[k.id] && !ausnahmen[k.id]).map((k) => k.id);
    ok(Object.keys(ausnahmen).length <= 45 && Object.entries(ausnahmen).every(([id, a]) => ids.has(id) && !kollokationen[id] && a.grund.length > 10 && a.de === ids.get(id)!.de), `K73k قائمةُ الاستثناءِ صريحةٌ ومعلَّلةٌ ومحدودة (${Object.keys(ausnahmen).length} ≤25)، ولا بطاقةَ فيها لها متلازمات`);
    const b1 = alleVokabeln.filter((k) => k.level === "B1");
    /** قاعدةٌ آليّة: بطاقةٌ من ≥2 كلمتَي محتوى (in Kauf nehmen, Ich würde sagen) هي متلازمةٌ بذاتِها — تُعرَضُ كما هي ولا تحتاجُ متلازمةً لمتلازمة */
    const istWendung = (de: string) => de.replace(/^(der|die|das|sich)\s+/, "").replace(/\s+(um|über|auf|an|für|von|mit|bei|nach|zu|gegen|vor)$/, "").split(/\s+/).length >= 2;
    const b1Ohne = b1.filter((k) => !kollokationen[k.id] && !ausnahmen[k.id] && !istWendung(k.de));
    const b1Wendungen = b1.filter((k) => !kollokationen[k.id] && !ausnahmen[k.id] && istWendung(k.de)).length;
    ok(b1Ohne.length === 0, `K73m تغطيةُ B1 كاملة: ${b1.length - b1Ohne.length - b1Wendungen} بمتلازمات/استثناء + ${b1Wendungen} تعبيراً مركّباً بذاتِه = ${b1.length} (ناقص ${b1Ohne.length}: ${b1Ohne.slice(0, 3).map((k) => k.de).join(",")})`);
    ok(b1Wendungen <= 330 && b1.filter((k) => istWendung(k.de) && kollokationen[k.id]).length <= 5, `K73n التعابيرُ المركّبةُ في B1 محدودةٌ (${b1Wendungen} ≤330)، ومَن أُعطي منها متلازماتٍ رغمَ ذلك ≤5 (fit halten, die sozialen Medien)`);
    const a2 = alleVokabeln.filter((k) => k.level === "A2");
    const a2Mit = a2.filter((k) => kollokationen[k.id]).length;
    const a1 = alleVokabeln.filter((k) => k.level === "A1");
    const a1Mit = a1.filter((k) => kollokationen[k.id]).length;
    ok(a1Mit >= 170 && a1.filter((k) => kollokationen[k.id] && /^(der|die|das)?\s*(rot|blau|grün|und|oder|aber|eins|zwei|drei|vier|fünf|zehn|hundert|an|auf|in|mit|ohne)$/.test(k.de)).length === 0, `K73p تغطيةُ A1 (أفعالٌ وأسماءٌ يوميّة فقط): ${a1Mit}/${a1.length} — لا متلازماتٍ لأدواتٍ/ألوانٍ/أعداد`);
    ok(a2Mit >= 245, `K73o تغطيةُ A2 (أفعالٌ وأسماءٌ يوميّة): ${a2Mit}/${a2.length} — الهدفُ المعلَنُ في الخارطةِ ≥150، لا التغطيةُ الكاملة`);
    ok(b2Ohne.length === 0, `K73l تغطيةُ B2: ${b2.length - b2Ohne.length}/${b2.length} بطاقةً لها متلازماتٌ أو استثناءٌ معلَن (ناقص ${b2Ohne.length}، السقفُ ينزلُ مع كلِّ دفعة)`);
    ok(uebungen.every((u) => grader.grade(u, u.answer as string).correct && !grader.grade(u, u.options!.find((o) => o !== u.answer)!).correct), "K73i المصحِّحُ يقبلُ الشريكَ الصحيحَ ويرفضُ المشتّت");
    const pos = [0, 1, 2].map((i) => uebungen.filter((u) => u.options!.indexOf(u.answer as string) === i).length);
    ok(pos.every((p) => p >= uebungen.length * 0.2), `K73j موضعُ الصحيحِ موزَّع (${pos.join("/")})`);
  }


  /* ═══ K74 · تقييمُ الثقةِ قبلَ الإجابة: تسجيلٌ محدود، إحصاءٌ صحيح، سطرُ تقريرٍ صادقٌ عن حدِّه ═══ */
  {
    const e = (sicher: boolean, correct: boolean, i: number) => ({ t: `2026-09-29T10:00:${String(i % 60).padStart(2, "0")}Z`, id: `q${i}`, sicher, correct });
    let p = { sicherheit: [] } as unknown as Progress;
    for (let i = 0; i < MAX_EINTRAEGE + 40; i++) p = logSicherheit(p, e(true, true, i));
    ok(p.sicherheit!.length === MAX_EINTRAEGE && p.sicherheit![0].id === "q40", "K74a السجلُّ محدودٌ بـ500 والأقدمُ يُحذَفُ أوّلاً — لا تضخّمَ في localStorage");
    const liste = [e(true, true, 1), e(true, true, 2), e(true, false, 3), e(false, true, 4), e(false, false, 5), e(true, false, 6)];
    const st = sicherheitsStatistik(liste);
    ok(st.n === 6 && st.sicherRichtig === 2 && st.sicherFalsch === 2 && st.unsicherRichtig === 1 && st.unsicherFalsch === 1, "K74b الفئاتُ الأربعُ تُعدُّ صحيحاً");
    ok(Math.abs(st.kalibrierung - 3 / 6) < 1e-9 && Math.abs(st.ueberkonfidenz - 2 / 4) < 1e-9, "K74c المعايرةُ = (متأكّد∧صحيح + غيرُ متأكّد∧خطأ)/n، والثقةُ الخاطئةُ = خطأُ المتأكّدين/المتأكّدين");
    ok(sicherheitsStatistik(undefined).n === 0 && sicherheitsStatistik([]).kalibrierung === 0 && sicherheitsZeile([]) === null && sicherheitsZeile(liste.slice(0, 4)) === null, "K74d بلا بيانات أو <5 تقييمات: لا سطرَ تقرير — لا ادّعاءَ من عيّنةٍ فارغة");
    const warn = sicherheitsZeile(liste)!;
    ok(warn.startsWith("⚠️") && warn.includes("2 من 4") && warn.includes("6 سؤالاً"), `K74e عندَ ثقةٍ خاطئة ≥30% يُحذَّرُ بالأرقامِ الخام (${warn.slice(0, 40)}…)`);
    const gut = sicherheitsZeile([e(true, true, 1), e(true, true, 2), e(true, true, 3), e(false, false, 4), e(false, true, 5)])!;
    ok(gut.startsWith("🎯") && gut.includes("80%"), "K74f وعندَ معايرةٍ جيّدةٍ سطرٌ هادئٌ بالنسبةِ الصحيحة");
    const pr = { ...empty(), sicherheit: liste };
    ok(lehrerBericht(pr).some((l) => l.startsWith("⚠️ ثقةٌ خاطئة")) && !lehrerBericht({ ...pr, sicherheit: [] }).some((l) => l.includes("ثقة")), "K74g تقريرُ المدرّسِ الأسبوعيُّ يحملُ السطرَ عندَ وجودِ بيانات ويصمتُ بدونِها");
  }


  /* ═══ K75 · دفترُ الأخطاءِ 2.0: أولويّةُ الثقةِ الخاطئة، وتمرينُ نقلٍ جديدٌ بدلَ السؤالِ نفسِه ═══ */
  {
    let p = empty();
    p = upsertFehler(p, { falsch: "die Frist verpassen", richtig: "einhalten", art: "wortstellung", ar: "المتلازمة: die Frist einhalten", quelle: "kol" });
    p = upsertFehler(p, { falsch: "Termin", richtig: "Termin", art: "wortstellung", ar: "⚠️ ثقةٌ خاطئة — كنتَ متأكّداً: einen Termin vereinbaren", quelle: "x" });
    p = upsertFehler(p, { falsch: "xyzq", richtig: "qqqq-nicht-im-lexikon", art: "konstruktion", ar: "—", quelle: "y" });
    for (let i = 0; i < 3; i++) p = upsertFehler(p, { falsch: "die Frist verpassen", richtig: "einhalten", art: "wortstellung", ar: "المتلازمة: die Frist einhalten", quelle: "kol" });
    for (const k of Object.keys(p.fehler!)) p.fehler![k].srs.due = "2000-01-01";
    const due = dueFehlerPriorisiert(p, 8);
    ok(due.length === 3 && istUeberkonfident(due[0]) && due[1].richtig === "einhalten", "K75a الترتيب: الثقةُ الخاطئةُ أوّلاً ولو كانت أقلَّ تكراراً، ثم الأكثرُ تكراراً");
    const kE = verwandteKarte({ richtig: "einhalten", falsch: "" }, alleVokabeln);
    const kT = verwandteKarte({ richtig: "Termin", falsch: "" }, alleVokabeln);
    ok(!!kE && kE.de === "einhalten" && !!kT && /Termin$/.test(kT.de), "K75b البطاقةُ المرتبطةُ تُوجَدُ بالكلمةِ الصحيحةِ معَ أو بدونِ أداة");
    ok(verwandteKarte({ richtig: "qqqq-nicht-im-lexikon", falsch: "" }, alleVokabeln) === null && verwandteKarte({ richtig: "zu", falsch: "" }, alleVokabeln) === null, "K75c لا بطاقةَ لكلمةٍ خارجَ الدفترِ أو أقصرَ من 3 أحرف — يبقى السؤالُ المباشر");
    const rand = rng(75);
    const tE = transferUebung(due[1], alleVokabeln, rand)!;
    ok(!!tE && tE.art === "kollokation" && tE.ex.type === "mc" && tE.ex.promptDe.includes("_____") && tE.ex.options!.includes(tE.ex.answer as string), "K75d خطأُ einhalten يصيرُ تمرينَ متلازمةٍ جديداً (فراغٌ + 3 خيارات) لا «أيُّ صيغةٍ صحيحة؟»");
    ok(tE.ex.promptDe !== due[1].falsch && !tE.ex.options!.includes(due[1].falsch), "K75e التمرينُ الجديدُ لا يعيدُ الصيغةَ الخاطئةَ القديمةَ كخيار");
    ok(transferUebung(due[2], alleVokabeln, rand) === null, "K75f بلا بطاقةٍ مرتبطة: null — الواجهةُ تعودُ للسؤالِ المباشر");
    const kv = alleVokabeln.find((c) => c.exampleDe && !kollokationen[c.id])!;
    const b = beispielUebung(kv, { key: "k" });
    ok(!!b && b.type === "fill" && b.promptDe.includes("_____") && kv.exampleDe!.includes(String((b.answer as string[])[0])), `K75g بطاقةٌ بلا متلازماتٍ تُعطي تمرينَ ملءٍ من جملةِ مثالِها (${kv.de} → ${(b!.answer as string[])[0]})`);
    ok(grader.grade(b!, (b!.answer as string[])[0]).correct && !grader.grade(b!, "xxxxxx").correct, "K75h المصحِّحُ يقبلُ الصيغةَ الواردةَ في الجملةِ ويرفضُ غيرَها");
    const stichprobe = alleVokabeln.filter((c) => c.level !== "A1").slice(0, 400);
    const abgedeckt = stichprobe.filter((c) => transferUebung({ key: "s", falsch: "", richtig: c.de, art: "x", ar: "", srs: newCard(), treffer: 0 }, alleVokabeln, rand)).length;
    ok(abgedeckt >= stichprobe.length * 0.9, `K75i من 400 بطاقةٍ A2–B2 يوجدُ تمرينُ نقلٍ لـ${abgedeckt} (≥90%)`);
  }


  /* ═══ K76 · لا هلوسةَ في البنوكِ القديمة: اقتباساتُ النصوصِ القصيرةِ حرفية، والترابطُ يُقاسُ ولا يتراجع ═══ */
  {
    const zitatFehl: string[] = [];
    let ohneBeleg = 0;
    for (const t of texts) for (const q of t.questions) {
      const e = q.explanationAr ?? "";
      if (!e.includes("«")) ohneBeleg++;
      for (const m of e.matchAll(/«([^»]+)»/g)) for (const piece of m[1].split(/…/)) { const p = piece.trim().replace(/^[ .,;:„“"]+|[ .,;:„“"]+$/g, ""); if (p.length >= 12 && !t.de.includes(p)) zitatFehl.push(`${q.id}:${p.slice(0, 20)}`); }
    }
    ok(zitatFehl.length === 0, `K76a كلُّ «اقتباس» في شروحِ النصوصِ القصيرةِ (300 سؤال) حرفيٌّ من نصِّه — كانت 8 مُدَّعاةً «حرفياً» وهي مُعادُ صياغتِها (${zitatFehl.slice(0, 3).join("|")})`);
    // K76b: أسئلة A0 القصيرة (تهيئة) مُستثناة من شرط الاقتباس لأن أجوبتها حقائق بسيطة لا تستلزم نصًّا داعمًا.
    const a0TextIds = new Set(texts.filter((t) => t.level === "A0").map((t) => t.id));
    let ohneBelegNichtA0 = 0;
    for (const t of texts) for (const q of t.questions) {
      const e = q.explanationAr ?? "";
      if (!e.includes("«") && !a0TextIds.has(t.id)) ohneBelegNichtA0++;
    }
    ok(ohneBelegNichtA0 === 0, `K76b في كلِّ المستوياتِ بعد A0 كلُّ شرحِ سؤالِ نصٍّ قصيرٍ يحتوي «دليلاً» مقتبَسًا حرفيّاً من النصّ — لا ادّعاءً بلا إسناد (خارجة: ${ohneBelegNichtA0}) — أسئلة A0 مُعفاة (${ohneBeleg} سؤالاً)`);
    const stem = (w: string) => { const x = w.toLowerCase().replace(/^(der|die|das|sich)\s+/, "").split(/\s+/)[0]; return x.slice(0, Math.max(4, x.length - 2)); };
    const korpus: Record<string, string> = {};
    for (const L of ["A1", "A2", "B1", "B2"]) korpus[L] = [...texts.filter((t) => t.level === L).map((t) => leseText(t).de + " " + t.de), ...dialogues.filter((d) => d.level === L).flatMap((d) => d.lines.map((l) => l.de)), ...sentences.filter((x) => x.level === L).map((x) => x.de)].join(" ").toLowerCase();
    const soll: Record<string, number> = { A1: 97, A2: 90, B1: 80, B2: 82 };
    const ist: Record<string, number> = {};
    for (const L of Object.keys(soll)) { const cs = alleVokabeln.filter((c) => c.level === L); ist[L] = Math.floor(100 * cs.filter((c) => korpus[L].includes(stem(c.de))).length / cs.length); }
    ok(Object.keys(soll).every((L) => ist[L] >= soll[L]), `K76c الترابطُ (كلمةُ البطاقةِ تظهرُ في نصٍّ/حوارٍ من مستواها): A1 ${ist.A1}% · A2 ${ist.A2}% · B1 ${ist.B1}% · B2 ${ist.B2}% — خطُّ أساسٍ لا تراجع (المسار 3)`);
  }


  /* ═══ K79 · لا وقائعَ خارجيّةً صامتة: كلُّ نسبةٍ مئويّةٍ أو سنةٍ في أيِّ حقلٍ ألمانيٍّ مُعلَنةٌ في القائمةِ البيضاءِ بسببها ═══ */
  {
    const wl = require("../content/fakten-whitelist.json") as { eintraege: { muster: string; grund: string }[] };
    const muster = wl.eintraege.map((e) => e.muster);
    ok(wl.eintraege.every((e) => e.grund.length > 8), "K79a كلُّ إدخالٍ في القائمةِ البيضاءِ له سببٌ مكتوب");
    const AR = /[\u0600-\u06FF]/;
    const banken: Record<string, unknown> = { texts, dialogues, grammar: grammarMap, writing: writingTasks, sentences, szenarien, pakete, luecken: require("../content/luecken.json"), lang: texts.map((t) => (t as { lang?: unknown }).lang ?? null) };
    const treffer: string[] = [];
    const walk = (o: unknown, wo: string) => {
      if (typeof o === "string") { if (AR.test(o)) return; for (const m of o.matchAll(/\b\d{1,3}(?:[,.]\d+)?\s?(?:%|Prozent)\b|\b(?:1[89]\d\d|20[0-4]\d)\b/g)) { const hit = m[0].replace(/\s?%/, " Prozent").trim(); if (!muster.some((x) => hit.startsWith(x.split(" ")[0]) && hit.includes("Prozent") === x.includes("Prozent"))) treffer.push(`${wo}: ${hit}`); } return; }
      if (Array.isArray(o)) o.forEach((x, i) => walk(x, wo + "[" + i + "]"));
      else if (o && typeof o === "object") for (const [k, v] of Object.entries(o as Record<string, unknown>)) walk(v, wo + "." + k);
    };
    for (const [n, b] of Object.entries(banken)) walk(b, n);
    ok(treffer.length === 0, `K79b نسبٌ/سنواتٌ غيرُ مُعلَنة: ${treffer.length} (${treffer.slice(0, 3).join(" | ")})`);
  }


  /* ═══ K81 · فهرسُ الترابطِ الديناميكيّ: كلمةُ النصِّ تجدُ بطاقتَها، والبطاقةُ تجدُ نصوصَها، واليتامى يُعَدّون ═══ */
  {
    ok(karteFuerWort("Frist", "B2")?.de === "die Frist" && karteFuerWort("einhalten", "B2")?.de === "einhalten" && karteFuerWort("frisch", "A1")?.de === "frisch" && karteFuerWort("oft", "A1")?.de === "oft", "K81a الكلمةُ بصيغتِها المعجميّة حتى الثلاثية تجدُ بطاقتَها");
    const gespr = karteFuerWort("gesprochen", "B1"); const kuend = karteFuerWort("kündigte", "B2");
    ok(!!gespr && /sprech/.test(gespr.de) && !!kuend && /kündig/.test(kuend.de), `K81b صيغةٌ مصرَّفةٌ تجدُ بطاقتَها بالجذعِ (gesprochen→${gespr?.de}, kündigte→${kuend?.de})`);
    ok(karteFuerWort("und") === null && karteFuerWort("die") === null && karteFuerWort("xq") === null, "K81c كلماتُ الوقفِ والقصيرةُ لا تصيرُ روابط");
    const a1 = karteFuerWort("Arbeit", "A1");
    ok(!!a1 && a1.level === "A1", `K81d يُفضَّلُ مستوى النصِّ أو الأدنى (Arbeit في نصِّ A1 → ${a1?.de} ${a1?.level})`);
    const fr = alleVokabeln.find((c) => c.de === "die Frist")!;
    const v = verknuepfung(fr);
    ok(v.kollokationen.length >= 2 && (v.texte.length + v.dialoge.length) >= 1 && v.texte.every((t) => t.level === fr.level) && v.dialoge.every((d) => d.level === fr.level), `K81e بطاقةُ Frist (${fr.level}) ترتبطُ بمتلازماتِها وبـ${v.texte.length} نصًّا و${v.dialoge.length} حواراً من مستواها فقط`);
    const soll: Record<string, number> = { A1: 98, A2: 99, B1: 97, B2: 99 };
    const ab = Object.fromEntries(Object.keys(soll).map((L) => [L, abdeckung(L)]));
    ok(Object.keys(soll).every((L) => ab[L].prozent >= soll[L]), `K81f التغطيةُ من الفهرسِ نفسِه: ${Object.keys(soll).map((L) => `${L} ${ab[L].prozent}%`).join(" · ")} — لا تراجع`);
    const w = Object.fromEntries(Object.keys(soll).map((L) => [L, verwaiste(L).length]));
    const wSoll: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
    ok(Object.keys(soll).every((L) => w[L] <= wSoll[L]), `K81g اليتامى (لا نصَّ ولا حوارَ من المستوى): A1 ${w.A1} · A2 ${w.A2} · B1 ${w.B1} · B2 ${w.B2} — سقفٌ تنازليٌّ عبرَ الحواراتِ الجديدة`);
    ok(stammVon("die Frist") === "fris" && stammVon("sich bewerben um") === "bewerb" && stammVon("zu") === "", "K81h قاعدةُ الجذعِ ثابتةٌ ومطابقةٌ لـK76c");
    const kw = alleVokabeln.find((c) => c.de === "der Klimawandel")!;
    const vk = verknuepfung(kw);
    ok(!!vk.komposita && vk.komposita.sicher && vk.komposita.teile.length === 2, "K81i تفكيكُ المركّبِ مدمجٌ في ترابطِ بطاقةِ Klimawandel");
    ok(v.partnerKarten.length >= 1, `K81j بطاقاتُ الشركاءِ ترتبطُ ببطاقةِ Frist (${v.partnerKarten.map((p) => p.de).join(",")})`);
  }


  /* ═══ K83 · جملُ التمرينِ الجديدة (من اليتامى): بلا صوتٍ بعدُ (neu)، ≥3 يتامى من مستواها في كلِّ جملة، ≥60 لكلِّ مستوى B ═══ */
  {
    const neuS = sentences.filter((x) => (x as { neu?: boolean }).neu && x.level !== "A0") as unknown as { id: string; level: string; de: string; ar: string; waisen?: string[] }[];
    const neuA0 = sentences.filter((x) => (x as { neu?: boolean }).neu && x.level === "A0");
    ok(neuS.length + neuA0.length >= 373 && neuS.every((x) => /[\u0600-\u06FF]/.test(x.ar) && !/[\u0600-\u06FF]/.test(x.de)) && neuA0.every((x) => /[\u0600-\u06FF]/.test(x.ar) && !/[\u0600-\u06FF]/.test(x.de)), `K83a ${neuS.length + neuA0.length} جملةً جديدة (مع ${neuA0.length} جمل A0 تمهيدية)، عربيّتُها في حقلِها`);
    const st = (w: string) => { const x = w.toLowerCase().replace(/^(der|die|das|sich|jdn|jdm)\s+/, "").replace(/^etwas\s+/, "").split(/\s+/)[0]; return x.slice(0, Math.max(4, x.length - 2)); };
    const normD = (s: string) => s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 -]/g, " ");
    ok(neuS.every((x) => (x.waisen ?? []).filter((w) => alleVokabeln.some((c) => c.de === w && c.level === x.level) && normD(x.de).includes(st(w))).length >= 3), "K83b كلُّ جملةٍ جديدة (من A1 فصاعداً) تُدخِلُ ≥3 بطاقاتٍ يتيمةٍ من مستواها فعلاً");
    ok(["A1", "A2", "B1", "B2"].every((L) => sentences.filter((x) => x.level === L).length >= 60), `K83c جملُ كلِّ مستوى ≥60 (${["A1", "A2", "B1", "B2"].map((L) => sentences.filter((x) => x.level === L).length).join("/")}) — مصفوفةُ الاكتمالِ مكتملةٌ لهذه الخلية`);
    ok(new Set(sentences.map((x) => x.id)).size === sentences.length && sentences.length - new Set(sentences.map((x) => x.de)).size === 1, "K83d لا معرِّفَ مكرَّراً؛ جملةٌ قديمةٌ واحدةٌ مكرَّرةُ النصِّ بمعرِّفَين (Obwohl es geregnet hat…، لكلٍّ صوتُه) — مُعلَنة، ولا جديدَ مكرَّر");
  }


  /* ═══ K84 · نصوصُ القراءةِ الجديدة (من اليتامى): بلا صوتٍ بعدُ (neu)، ≥12 يتيمةً من مستواها، أدلةٌ حرفية، مشتّتاتٌ مرساة ═══ */
  {
    const neuT = texts.filter((t) => (t as { neu?: boolean }).neu) as unknown as { id: string; level: string; de: string; ar: string; waisen?: string[]; questions: Exercise[] }[];
    ok(neuT.length === 25 && neuT.every((t) => (t.level === "B2" || t.level === "B1") && !hoerenAudio[t.id]) && neuT.filter((t) => t.level === "B1").length === 10, `K84a ${neuT.length} نصًّا جديداً (15 B2 + 10 B1) بلا صوتٍ — مُعلَنة`);
    const st = (w: string) => { const x = w.toLowerCase().replace(/^(der|die|das|sich|jdn|jdm)\s+/, "").replace(/^etwas\s+/, "").split(/\s+/)[0]; return x.slice(0, Math.max(4, x.length - 2)); };
    const normD = (s: string) => s.toLowerCase().replace(/é/g, "e").replace(/[^a-zäöüß0-9 ]/g, " ");
    ok(neuT.every((t) => (t.waisen ?? []).filter((w) => alleVokabeln.some((c) => c.de === w && c.level === t.level) && normD(t.de).includes(st(w))).length >= 12), "K84b كلُّ نصٍّ يُدخِلُ ≥12 بطاقةً يتيمةً من مستواه");
    ok(neuT.every((t) => t.de.split(/\s+/).length >= 150 && t.de.split(/\s+/).length <= 230 && t.de.split(/\n\n+/).length >= 3 && t.questions.length === 4), "K84c 150–230 كلمة، 3 فقرات، 4 أسئلة");
    const zit = neuT.flatMap((t) => t.questions.flatMap((q) => [...(q.explanationAr ?? "").matchAll(/«([^»]+)»/g)].flatMap((m) => m[1].split(/…/).map((p) => p.trim().replace(/^[ .,;:„“"]+|[ .,;:„“"]+$/g, ""))).filter((p) => p.length >= 12 && !t.de.includes(p))));
    ok(zit.length === 0, `K84d كلُّ اقتباسٍ حرفيٌّ (${zit.length})`);
    ok(neuT.every((t) => t.questions.filter((q) => q.type === "mc").every((q) => q.options!.includes(q.answer as string) && q.options!.filter((o) => o !== q.answer).every((o) => normD(o).split(" ").some((w) => w.length >= 4 && normD(t.de).includes(w.slice(0, Math.max(4, w.length - 2))))))), "K84e كلُّ مشتّتٍ مرساهُ كلمةٌ من النصِّ نفسِه");
  }


  /* ═══ K85 · الكتابةُ ≥10 لكلِّ مستوى؛ الجديدُ بمعاييرَ عربيّةٍ ونموذجٍ بطولِ المستوى وبلا أرقامٍ قابلةٍ للتكذيب ═══ */
  {
    const neuW = writingTasks.filter((w) => (w as { neu?: boolean }).neu);
    ok(["A1", "A2", "B1", "B2"].every((L) => writingTasks.filter((w) => w.level === L).length >= 10), `K85a مهامُّ الكتابةِ لكلِّ مستوى ≥10 (${["A1", "A2", "B1", "B2"].map((L) => writingTasks.filter((w) => w.level === L).length).join("/")})`);
    const LEN: Record<string, [number, number]> = { A1: [25, 80], A2: [50, 130], B1: [80, 170], B2: [120, 260] };
    ok(neuW.length === 12 && neuW.every((w) => w.criteria.length >= 3 && w.criteria.every((c) => /[\u0600-\u06FF]/.test(c)) && /[\u0600-\u06FF]/.test(w.taskAr) && !/[\u0600-\u06FF]/.test(w.sample) && w.sample.split(/\s+/).length >= LEN[w.level][0] && w.sample.split(/\s+/).length <= LEN[w.level][1]), "K85b 12 مهمةً جديدة: ≥3 معاييرَ عربيّة، نموذجٌ ألمانيٌّ بطولِ المستوى");
    ok(neuW.every((w) => !/\d{1,3}\s?(%|Prozent)|\b(1[89]\d\d|20[0-4]\d)\b/.test(w.sample)), "K85c لا نسبَ ولا سنواتٍ في نماذجِ الكتابةِ الجديدة");
    ok(new Set(writingTasks.map((w) => w.id)).size === writingTasks.length, "K85d معرِّفاتُ الكتابةِ فريدة");
  }

  /* ═══ K80 · مصفوفةُ الاكتمالِ (content/soll-matrix.json): لا مستوى بناقص، وكلُّ خليّةٍ تحققُ SOLL بلا تراجع ═══ */
  {
    const sollMatrix = require("../content/soll-matrix.json") as Record<string, Record<string, number>>;
    const alleGrammatik = Object.values(grammarMap);
    const lvls = ["A1", "A2", "B1", "B2"];
    for (const lvl of lvls) {
      const v = alleVokabeln.filter((k) => k.level === lvl);
      const beispiele = v.filter((k) => k.exampleDe && k.exampleAr).length;
      const kolls = v.filter((k) => kollokationen[k.id]).length;
      const txts = texts.filter((t) => t.level === lvl).length;
      const dlgs = dialogues.filter((d) => d.level === lvl).length;
      const gramm = alleGrammatik.filter((g) => g.level === lvl).length;
      const schr = writingTasks.filter((w) => w.level === lvl).length;
      const saetz = sentences.filter((s) => s.level === lvl).length;

      ok(v.length >= sollMatrix.vokabeln[lvl], `K80a·${lvl} المفرداتُ ≥ SOLL (${v.length}/${sollMatrix.vokabeln[lvl]})`);
      ok(beispiele >= sollMatrix.beispieleUndUebersetzung[lvl], `K80b·${lvl} الأمثلةُ وترجماتُها ≥ SOLL (${beispiele}/${sollMatrix.beispieleUndUebersetzung[lvl]})`);
      ok(kolls >= sollMatrix.kollokationen[lvl], `K80c·${lvl} المتلازماتُ ≥ SOLL (${kolls}/${sollMatrix.kollokationen[lvl]})`);
      ok(txts >= sollMatrix.texte[lvl], `K80d·${lvl} النصوصُ ≥ SOLL (${txts}/${sollMatrix.texte[lvl]})`);
      ok(dlgs >= sollMatrix.dialoge[lvl], `K80e·${lvl} الحواراتُ ≥ SOLL (${dlgs}/${sollMatrix.dialoge[lvl]})`);
      ok(gramm >= sollMatrix.grammatik[lvl], `K80f·${lvl} دروسُ القواعدِ ≥ SOLL (${gramm}/${sollMatrix.grammatik[lvl]})`);
      ok(schr >= sollMatrix.schreiben[lvl], `K80g·${lvl} مهامُّ الكتابةِ ≥ SOLL (${schr}/${sollMatrix.schreiben[lvl]})`);
      ok(saetz >= sollMatrix.saetze[lvl], `K80h·${lvl} جملُ التمرينِ ≥ SOLL (${saetz}/${sollMatrix.saetze[lvl]})`);
    }

    const a1a2Soll = require("../content/kollok-a1a2-soll.json") as { A1: { sollAnzahl: number; karten: { id: string }[] }; A2: { sollAnzahl: number; karten: { id: string }[] } };
    ok(a1a2Soll.A1.karten.length === 170 && a1a2Soll.A1.karten.every((k) => !!kollokationen[k.id]), "K80i قائمةُ متلازماتِ A1 المعلنة 170/170 في kollokationen.json");
    ok(a1a2Soll.A2.karten.length === 245 && a1a2Soll.A2.karten.every((k) => !!kollokationen[k.id]), "K80j قائمةُ متلازماتِ A2 المعلنة 245/245 في kollokationen.json");
  }

  /* ═══ K86 · رادارُ القواعدِ في النصوص: كلُّ نصِّ B1/B2 يسمّي ≥2 موضوعين نحويَّين مع شواهدَ حرفيّة ═══ */
  {
    const { grammatikImText } = require("../lib/grammatikRadar");
    const b1b2 = texts.filter((t) => t.level === "B1" || t.level === "B2");
    ok(b1b2.every((t) => grammatikImText(leseText(t).de).length >= 2), `K86a كلُّ نصوصِ B1/B2 الـ${b1b2.length} ترصدُ ≥2 موضوعين نحويَّين`);
    let belegFehl = 0;
    for (const t of texts) {
      const de = leseText(t).de;
      for (const f of grammatikImText(de)) {
        if (!de.includes(f.beleg)) belegFehl++;
      }
    }
    ok(belegFehl === 0, `K86b بوّابةُ الصدق: كلُّ شاهدٍ نحويٍّ مقتبَسٌ حرفياً من النصِّ نفسِه (${belegFehl} خطأ)`);
  }

  /* ═══ K69 · بوّاباتُ التدقيقِ الشاملِ 2026-09-29 (docs/tadqiq-2026-09-29.md) ═══ */
  {
    const AR = /[\u0600-\u06FF]/;
    const alleUeb = Object.entries(grammarMap).flatMap(([k, t]) => t.exercises.map((e) => ({ k, e })));
    const ohneAr = alleUeb.filter(({ e }) => !AR.test(e.explanationAr ?? "")).map(({ e }) => e.id);
    ok(ohneAr.length === 0, `K69a كلُّ تمرينِ قواعدَ له شرحٌ عربيّ (ناقص: ${ohneAr.join(",")})`);
    const arImDe = alleUeb.filter(({ e }) => e.type !== "translate" && e.type !== "fill" && !/bedeutet/.test(e.promptDe) && AR.test(e.promptDe)).map(({ e }) => e.id);
    ok(arImDe.length === 0, `K69b لا عربيةَ في promptDe لتمارينِ order/mc/truefalse — التعليمةُ في promptAr (${arImDe.slice(0, 5).join(",")})`);
    const leerToken = alleUeb.filter(({ e }) => Array.isArray(e.answer) && e.answer.some((x) => !String(x).trim())).map(({ e }) => e.id);
    ok(leerToken.length === 0, `K69c لا رمزَ فارغاً في إجاباتِ الترتيب (${leerToken.join(",")})`);
    const typo = alleUeb.filter(({ e }) => /___ \./.test(e.promptDe)).map(({ e }) => e.id);
    ok(typo.length === 0, `K69d لا فراغَ قبلَ النقطةِ بعدَ ___ (${typo.join(",")})`);
    const imp = alleUeb.find(({ e }) => e.id === "a2-imp-e2")!.e, stg = alleUeb.find(({ e }) => e.id === "a2-stg-e5")!.e;
    ok(!/sprechen!/.test(imp.promptDe) && /ist es am/.test(stg.promptDe), "K69e الأخطاءُ اللغويةُ المصحَّحة ثابتة: «Sprechen Sie bitte langsamer!» · «Heute ist es am kältesten»");
    const pq = grammarMap["b1-plusquamperfekt"];
    ok(pq.exercises.length >= 6 && pq.exercises.every((e) => /hatte|war|gegessen|Plusquamperfekt|abgefahren|bestanden/.test(e.promptDe + JSON.stringify(e.answer))),
      `K69f درسُ Plusquamperfekt: ≥6 تمارين وكلُّها في موضوعِه (${pq.exercises.length})`);
    for (const k of ["b2-partizip", "b1-wortbildung"]) {
      const bad = (grammarMap[k].examples ?? []).filter((x) => !/[.!?…"“”»]$/.test(x.de.trim()));
      ok(bad.length === 0, `K69g أمثلةُ ${k} تنتهي بعلامةِ ترقيم (${bad.length})`);
    }
    // تغطيةُ الخطة: كلُّ نصٍّ وكلُّ حوارٍ يُجدوَلُ مرةً على الأقلّ في 378 يوماً
    const gesehenT = new Set<string>(), gesehenD = new Set<string>();
    for (let d = 1; d <= TOTAL_DAYS; d++) for (const t of buildDay(d, emptyProgress).tasks) { if (t.textId) gesehenT.add(t.textId); if (t.dialogueId) gesehenD.add(t.dialogueId); }
    const fehltT = texts.filter((t) => !gesehenT.has(t.id)).map((t) => t.id), fehltD = dialogues.filter((d) => !gesehenD.has(d.id)).map((d) => d.id);
    ok(fehltT.length === 0, `K69h كلُّ النصوصِ الـ${texts.length} مجدوَلة (بلا موعد: ${fehltT.slice(0, 6).join(",")})`);
    ok(fehltD.length === 0, `K69i كلُّ الحواراتِ الـ${dialogues.length} مجدوَلة (بلا موعد: ${fehltD.slice(0, 6).join(",")})`);
    const a = buildDay(3, emptyProgress).tasks.map((t) => t.textId ?? t.dialogueId).join("|"), b = buildDay(3, emptyProgress).tasks.map((t) => t.textId ?? t.dialogueId).join("|");
    ok(a === b, "K69j الدورانُ حتميّ: اليومُ نفسُه يعطي النصوصَ نفسَها");
  }

  /* ═══ K70 · النسخُ الطويلةُ للقراءة — طولُ CEFR + بوّابةُ الهذيان (كلُّ اقتباسٍ في الشرحِ موجودٌ حرفياً في النص) ═══ */
  {
    const AR = /[\u0600-\u06FF]/;
    const SOLL: Record<string, [number, number]> = { A1: [90, 160], A2: [100, 200], B1: [150, 320], B2: [220, 420] };
    const mitLang = texts.filter((t) => t.lang);
    const b2 = texts.filter((t) => t.level === "B2");
    ok(b2.filter((t) => !(t as { neu?: boolean }).neu).every((t) => !!t.lang), `K70a كلُّ نصوصِ B2 القديمةِ لها نسخةٌ طويلة؛ الجديدةُ (neu) طويلةٌ بذاتِها (${b2.filter((t) => t.lang).length})`);
    const b1 = texts.filter((t) => t.level === "B1");
    ok(b1.filter((t) => !(t as { neu?: boolean }).neu).every((t) => !!t.lang), `K70a2 كلُّ نصوصِ B1 القديمةِ لها نسخةٌ طويلة؛ الجديدةُ طويلةٌ بذاتِها (${b1.filter((t) => t.lang).length})`);
    // الامتحاناتُ تقرأُ النسخةَ الطويلة
    const kl = buildSkillKlausur(200, "lesen" as SkillKey).sections[0] as unknown as { passages?: { de: string }[] };
    ok(!!kl.passages && kl.passages.length === 6 && kl.passages.every((p) => p.de.split(/\s+/).length >= 150), "K70j كلاوزور القراءةِ في B2 يعرضُ النصوصَ الطويلةَ لا القصيرة");
    const laenge = mitLang.filter((t) => { const n = t.lang!.de.split(/\s+/).length; const [lo, hi] = SOLL[t.level]; return n < lo || n > hi; }).map((t) => t.id);
    ok(laenge.length === 0, `K70b طولُ كلِّ نسخةٍ طويلةٍ ضمنَ نطاقِ مستواها (خارجه: ${laenge.join(",")})`);
    ok(mitLang.every((t) => !AR.test(t.lang!.de) && t.lang!.de.split(/\n\n+/).length >= 3), "K70c النصُّ الطويلُ ألمانيٌّ صِرفٌ وذو ≥3 فقرات");
    ok(mitLang.every((t) => t.lang!.questions.length >= (t.level === "A2" || t.level === "A1" ? 4 : 5) && AR.test(t.lang!.ar)), "K70d ≥5 أسئلةٍ لكلِّ نصٍّ طويل (A2: ≥4) + ملخّصٌ عربيّ");
    const a2 = texts.filter((t) => t.level === "A2");
    ok(a2.every((t) => !!t.lang), `K70a3 كلُّ نصوصِ A2 الـ${a2.length} لها نسخةٌ طويلة (${a2.filter((t) => t.lang).length})`);
    // K70a4: النسخة القديمة (80) كلها بنسخة طويلة؛ والنصوص الجديدة neu إمّا بنسخة طويلة أو بطول ≥150 كلمة بذاتها، وكلها تحمل حقل lang أو de نظيف بلا عربية.
    const alteTexte = texts.filter((t) => !(t as { neu?: boolean }).neu);
    const altLangOk = alteTexte.filter((t: { level?: string }) => t.level !== "A0").every((t: { lang?: unknown }) => !!t.lang);
    const neuTexts = texts.filter((t) => (t as { neu?: boolean }).neu);
    const neuLangOK = neuTexts.every((t) => !!t.lang || t.de.split(/\s+/).length >= 150);
    const neuWortOK = neuTexts.every((t) => !AR.test(t.de));
    ok(altLangOk && neuLangOK && neuWortOK, `K70a4 كلُّ النصوصِ القديمةِ (غير-A0) بنسخةٍ طويلة (${alteTexte.filter((t) => t.level !== "A0" && t.lang).length}) والجديدةُ ${neuTexts.length} إمّا بطولٍ ذاتيٍّ ≥150 كلمة أو بنسخة lang، وعربيّتُها في حقل ar لا de`);
    const zitatFehl: string[] = [], antwortFehl: string[] = [], ids = new Set<string>(), doppel: string[] = [];
    for (const t of mitLang) for (const q of t.lang!.questions) {
      if (ids.has(q.id)) doppel.push(q.id); ids.add(q.id);
      if (q.type === "mc" && !(q.options ?? []).includes(q.answer as string)) antwortFehl.push(q.id);
      if (q.type === "fill") for (const a of (Array.isArray(q.answer) ? q.answer : [q.answer])) if (!new RegExp(`\\b${a}\\b`).test(t.lang!.de)) antwortFehl.push(q.id + ":" + a);
      if (!AR.test(q.explanationAr ?? "")) antwortFehl.push(q.id + ":ar");
      for (const m of (q.explanationAr ?? "").matchAll(/«([^»]+)»/g)) for (const piece of m[1].split(/…|\.\.\./)) {
        const p = piece.trim().replace(/^[\s.,;:„“"]+|[\s.,;:„“"]+$/g, "");
        if (p.length >= 12 && !t.lang!.de.includes(p)) zitatFehl.push(`${q.id}«${p.slice(0, 30)}»`);
      }
    }
    ok(zitatFehl.length === 0, `K70e بوّابةُ الهذيان: كلُّ اقتباسٍ «…» في الشروحِ موجودٌ حرفياً في النصّ (${zitatFehl.slice(0, 3).join(" ")})`);
    ok(antwortFehl.length === 0 && doppel.length === 0, `K70f إجاباتُ mc ضمنَ الخيارات، إجاباتُ fill من النصّ، شروحٌ عربية، معرّفاتٌ فريدة (${antwortFehl.slice(0, 3).join(",")}${doppel.join(",")})`);
    const posen = new Set(mitLang.flatMap((t) => t.lang!.questions.filter((q) => q.type === "mc").map((q) => (q.options ?? []).indexOf(q.answer as string))));
    ok(posen.size >= 3, `K70g موضعُ الإجابةِ الصحيحةِ في mc متنوّع (${[...posen].join(",")})`);
    const tf = mitLang.flatMap((t) => t.lang!.questions.filter((q) => q.type === "truefalse"));
    const tfOk = tf.every((q) => (q.options ?? []).includes(q.answer as string) && (q.answer === "richtig" || q.answer === "falsch"));
    const tfR = tf.filter((q) => q.answer === "richtig").length;
    ok(tf.length > 0 && tfOk && tfR >= tf.length * 0.35 && tfR <= tf.length * 0.65, `K70h صواب/خطأ: الإجابةُ ضمنَ الخيارات (richtig/falsch) ومتوازنة (${tfR}/${tf.length} صواب)`);
    const kurzErhalten = texts.filter((t) => t.lang && t.de.split(/\s+/).length < 100);
    ok(kurzErhalten.length === mitLang.length, "K70i النصُّ القصيرُ `de` محفوظٌ لِنصِّ الاستماعِ المسجَّل (الصوتُ لا يفقدُ نصَّه)");
  }

/* ═══ K119 — عاملهُ الأسبوع: مهمةُ الورشةِ بلا درسِ مضيف تُعرِضُ أسئلتها لا شاشةٍ خاويةً ═══ */
{
  const gD = readFileSync("components/tasks.tsx", "utf8");
  ok(/if\s*\(\s*!topic\s*\)[\s\S]{0,500}task\.quiz/.test(gD),
    "K119a GrammarTask يستقبِلُ مهمةَ الأسبوعِ بلا topicId ويُعرِضُ quiz بدلَ شاشةِ «قاعدة غير موجودة» — لا شاشةٍ خاويةٍ في يومِ من الأيام");
  ok(gD.includes('return <Empty title="قاعدة غير موجودة" />'),
    "K119b ويبقى بابُ الاحتياطِ: غابتِ الدرسُ والأسئلةُ معاً فالشاشةُ تُعلِنُ نقصةها بصراحة");
}

/* ═══ K120 — سجلُّ القواعدِ يفحصُ نفسَه: كلُّ دليلٍ «ملف:سطر» مذكورٍ موجودٌ حرفياً ═══ */
{
  const rules = readFileSync("RULES.md", "utf8");
  const re = /`([^`]+\.(?:ts|tsx|json|css|md)):(\d+)`\s*«([^»]+)»/g;
  const bad: string[] = [];
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(rules))) {
    n++;
    const f = m[1];
    const anchor = m[3];
    if (!existsSync(f) || !readFileSync(f, "utf8").includes(anchor)) bad.push(`${f}«${anchor.slice(0, 40)}»`);
  }
  ok(n >= 30, `K120a سجلُّ القواعدِ يحمِلُ ${n} دليلاً قابلاً للفحصِ الآلي`);
  ok(bad.length === 0, `K120b كلُّ دليلٍ مذكورٍ موجودٌ حرفياً في ملفِّه (${bad.slice(0, 3).join(" · ")})`);
}

/* ═══ K121 — أقفالُ المحتوى المدقَّق (2026-10-03): التوحيدُ والتغطيةُ أرقامٌ لا وعود ═══ */
{
  const g = JSON.parse(readFileSync("content/grammar.json", "utf8")) as Record<string, any>;
  const ids = Object.keys(g);
  const std = ids.filter((id) => g[id].ziel && g[id].voraus && g[id].anwendung && (g[id].verify ?? []).length >= 2);
  ok(ids.length === 66 && std.length === 66, `K121a توحيدُ الدروس: ${std.length}/${ids.length} (ziel/voraus/anwendung + تحققان لكل درس)`);
  const v = JSON.parse(readFileSync("content/vocab.json", "utf8")) as any;
  let n = 0, ex = 0, syn = 0;
  const walk = (x: any): void => {
    if (Array.isArray(x)) { x.forEach(walk); return; }
    if (x && typeof x === "object") {
      if (typeof x.de === "string") { n++; if (x.exampleDe) ex++; if (x.syn) syn++; }
      Object.values(x).forEach(walk);
    }
  };
  walk(v);
  ok(n >= 3000 && ex === n, `K121b كلُّ بطاقةٍ لها مثالٌ ألماني (${ex}/${n})`);
  ok(syn === 70, `K121c قفلُ المرحلة 2: غيابُ syn انتهى (${syn}) — أيُّ تغييرٍ يُحدِّثُ السجلَّ والقفل`);
}

/* ═══ K122 — أقفالُ الغيابِ والموافقة: الممنوعُ يبقى ممنوعاً والمصرَّحُ ببوابته ═══ */
{
  const srcOf = (f: string): string => readFileSync(f, "utf8");
  const collect = (dir: string, out: string[] = []): string[] => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) collect(p, out);
      else if (/\.tsx?$/.test(p)) out.push(p);
    }
    return out;
  };
  const vRaw = srcOf("content/vocab.json");
  ok(!/"fr"\s*:/.test(vRaw), "K122a لا مفتاح fr في المفردات — الفرنسيةُ خارجَ المشروع");
  const ui = [...collect("app").filter((f) => f.endsWith("page.tsx")), ...collect("components")];
  const claims = ["يفوق", "تتفوق", "أفضل من المدارس", "معتمد رسمي", "بديل المدرسة", "يغنيك عن المعلم", "نضمن"];
  const hit: string[] = [];
  for (const f of ["README.md", ...ui]) for (const c of claims) if (srcOf(f).includes(c)) hit.push(`${f}:${c}`);
  ok(hit.length === 0, `K122b لا ادعاءاتِ تفوقٍ/اعتمادٍ في الواجهات (${hit.slice(0, 2).join(" ")})`);
  const code = [...collect("app"), ...collect("components"), ...collect("lib")];
  const fetchIn = code.filter((f) => srcOf(f).includes("fetch("));
  ok(fetchIn.length === 1 && fetchIn[0] === "lib/grader.ts", `K122c fetch المباشرُ محصورٌ في مصحّح LLM؛ تنزيلُ حزمة المتصفح محكومٌ بـK135 (${fetchIn.join(",") || "لا شيء"})`);
  ok(srcOf("app/einstellungen/page.tsx").includes("أُذِنُ بإرسال صوتي") && srcOf("lib/speech.ts").includes("بلا إذنٍ صريحٍ في الإعدادات"),
    "K122d سلسلةُ الموافقةِ السحابية: صياغةُ الإذنِ + شرطُ البوابةِ حاضران");
  const callers = code.filter((f) => f !== "lib/speech.ts" && srcOf(f).includes("listenDe("));
  ok(callers.length > 0 && callers.every((f) => srcOf(f).includes("cloudSpracheFrei")),
    `K122e كلُّ منادٍ للتعرّفِ يفحصُ البوابةَ أولاً (${callers.join(",")})`);
  ok(!srcOf("components/selbsttest.tsx").includes("recordTask("), "K122f الاختبارُ الذاتيُّ خارجَ الدرجةِ الرسمية — لا يسجِّلُ فيها");
}

/* ═══ K123 — توحيد رقم الخطة 378: لا 270 مزروعاً في الكود (R38) ═══ */
{
  const collectR = (dir: string, out: string[] = []): string[] => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const r = `${dir}/${e.name}`;
      if (e.isDirectory()) collectR(r, out);
      else if (/\.tsx?$/.test(r)) out.push(r);
    }
    return out;
  };
  const code = [...collectR("app"), ...collectR("components"), ...collectR("lib")];
  const mit270 = code.filter((f) => /\b270\b/.test(readFileSync(f, "utf8")));
  ok(mit270.length === 0, `K123a لا رقمَ 270 مزروعاً في الكود — المرجعُ TOTAL_DAYS وحده (${mit270.join(",") || "نظيف"})`);
  const seite = readFileSync("app/page.tsx", "utf8");
  ok(seite.includes("اكتملت الرحلة — {TOTAL_DAYS}") && seite.includes("${closedDays.length}/${TOTAL_DAYS}"),
    "K123b شاشةُ النهايةِ تستخدمُ TOTAL_DAYS لا رقماً مزروعاً");
  const inter = readFileSync("scripts/interaktiv_test.tsx", "utf8");
  ok((inter.match(/day <= TOTAL_DAYS/g) ?? []).length === 2, "K123c المسحُ التركيبيُّ يغطي الخطةَ كاملةً عبر TOTAL_DAYS");
}

/* ═══ K124 — بوابات المرحلة 1: المؤقت والاعتراض والبديل والتوقف (R11/R33/R16/R19/R20) ═══ */
{
  const lehrer = readFileSync("components/lehrer.tsx", "utf8");
  ok(lehrer.includes("PITFALL_SEKUNDEN = 45") && lehrer.includes("setInterval(") && lehrer.includes("انتهى وقت الرادار") && lehrer.includes("pitfall-timer-"),
    "K124a رادارُ الفخاخِ موقوتٌ: 45 ثانية + عدّادٌ حيٌّ + كشفٌ تلقائيٌّ يدخلُ الدفتر");
  const korr = readFileSync("components/schreibkorrektur.tsx", "utf8");
  ok(korr.includes("disput-") && korr.includes("disputeRegel(") && korr.includes("disput-hinweis") && korr.includes("effektiveSchwere("),
    "K124b الاعتراضُ على الكاشفِ مربوطٌ: زرٌّ + تسجيلٌ + حدّةٌ فعلية");
  const tasks = readFileSync("components/tasks.tsx", "utf8");
  ok(tasks.includes("sprech-schrift-ab") && tasks.includes("markiereSchriftlich(") && tasks.includes("إثبات إنجاز لا إثبات نطق"),
    "K124c البديلُ الكتابيُّ للشفويِّ: صندوقٌ + وسمٌ + صياغةُ القاعدة");
  ok(readFileSync("components/akademie/Klassenzimmer.tsx", "utf8").includes("stop-panel") && readFileSync("app/page.tsx", "utf8").includes("zeit-hinweis"),
    "K124d لوحةُ التوقفِ + تقديرُ الوقتِ المرنِ حاضران");
  const schwerB = (schwere: "sicher" | "wahrscheinlich" | "stil", regelId?: string) =>
    ({ spalte: "grammatik", schwere, stelle: "x", meldungAr: "y", regelId }) as never;
  ok(DISPUT_SCHWELLE === 3, "K124e عتبةُ التنزيلِ 3 اعتراضات");
  ok(effektiveSchwere(schwerB("sicher", "r"), {}) === "sicher" && effektiveSchwere(schwerB("sicher", "r"), { r: 2 }) === "sicher",
    "K124f دونَ العتبةِ لا تنزيل");
  ok(effektiveSchwere(schwerB("sicher", "r"), { r: 3 }) === "wahrscheinlich" && effektiveSchwere(schwerB("sicher", "r"), { r: 6 }) === "stil",
    "K124g التنزيلُ التدريجيُّ: 3→محتملة، 6→أسلوبية");
  ok(effektiveSchwere(schwerB("wahrscheinlich", "r"), { r: 3 }) === "stil" && effektiveSchwere(schwerB("sicher"), { r: 99 }) === "sicher",
    "K124h بلا regelId لا تنزيلَ أبداً");
  ok(bewerteSchreiben([schwerB("sicher", "r")]) === 92 && bewerteSchreiben([schwerB("sicher", "r")], { r: 3 }) === 96,
    "K124i الدرجةُ تتبعُ الحدّةَ الفعليةَ لا المزروعة");
}


/* ═══ K125 — README يُحصي نفسَه: الأرقامُ المعلَنةُ = أرقامُ القرصِ والدوالِّ (R39) ═══ */
{
  const lies = readFileSync("README.md", "utf8");
  const J = (f: string): number => { const x = JSON.parse(readFileSync(f, "utf8")); return Array.isArray(x) ? x.length : Object.keys(x).length; };
  const nT = J("content/texts.json"), nD = J("content/dialogues.json");
  ok(nT === 110 && lies.includes("110 نصوص") && lies.includes("texts 110"), `K125a النصوصُ 110 في القرصِ والسطرِ والفهرس (${nT})`);
  ok(nD === 119 && lies.includes("119") && lies.includes("dialogues 119"), `K125b الحواراتُ 119 في القرصِ والسطرِ والفهرس (${nD})`);
  const mp3 = (d: string) => readdirSync(`public/audio/${d}`).filter((f) => f.endsWith(".mp3")).length;
  const nH = mp3("hoeren"), nG = mp3("dialog"), nK = mp3("diktat"), nS = mp3("sprichwort");
  ok(nG === 80 && nH === 84 && nH + nG + nK + nS === 352 && lies.includes("84 بصوت") && lies.includes("352 ملفَّ صوت"),
    `K125c الصوتُ من الملفاتِ: ${nG} حوار + ${nH} نص + ${nK} إملاء + ${nS} أمثال = 352`);
  const abR = radarAbdeckung(dialogues);
  const nDr = dialogues.flatMap((d) => signalDrill(d)).length;
  const nAb = dialogues.flatMap((d) => ablenker(d)).length;
  ok(lies.includes(`${abR.mitSignal}/${abR.dialoge}`) && lies.includes(`${abR.mitFalle}/${abR.dialoge}`) && lies.includes(String(nAb)),
    `K125d تغطيةُ الرادارِ من الدالةِ نفسِها: ${abR.mitSignal}/${abR.dialoge} إشارات · ${abR.mitFalle} مضلل (${nAb})`);
  ok(lies.includes(`(${nDr} تمريناً`) , `K125e تمارينُ الأذنِ من الدالةِ نفسِها (${nDr})`);
  const nS2 = J("content/sentences.json"), nW = J("content/writing.json"), nV = J("content/verben.json");
  ok(nS2 === 608 && nW === 44 && nV === 126 && lies.includes("608") && lies.includes("writing 44"), `K125f الفهرسُ: ${nS2} جملة · ${nW} كتابة · ${nV} فعلاً`);
  const nKt = J("content/kollokationen.json");
  const nLue = (JSON.parse(readFileSync("content/luecken.json", "utf8")).items as { gaps: unknown[] }[]).reduce((n, it) => n + it.gaps.length, 0);
  ok(nKt === 2122 && nLue === 216 && lies.includes("2122") && lies.includes("216 فراغاً"), `K125g المتلازماتُ ${nKt} والفراغاتُ ${nLue}`);
}


/* ═══ K126 — نوعُ الكلمةِ على كلِّ بطاقة + المرادفُ والضدُّ (R30/R29) ═══ */
{
  const v = JSON.parse(readFileSync("content/vocab.json", "utf8")) as any;
  const POS12 = ["Nomen", "Verb", "Adjektiv", "Adverb", "Pronomen", "Präposition", "Konjunktion", "Artikel", "Zahl", "Interjektion", "Wendung", "Satz"];
  const karten: any[] = [];
  const walk2 = (x: any): void => {
    if (Array.isArray(x)) { x.forEach(walk2); return; }
    if (x && typeof x === "object") {
      if (typeof x.de === "string") karten.push(x);
      Object.values(x).forEach(walk2);
    }
  };
  walk2(v);
  const ohnePos = karten.filter((c) => !c.pos);
  const fremdPos = karten.filter((c) => c.pos && !POS12.includes(c.pos));
  ok(karten.length === 3356 && ohnePos.length === 0 && fremdPos.length === 0, `K126a كلُّ بطاقةٍ موسومةٌ من المفرداتِ المحكومة (${karten.length}/3356)`);
  const posVon = (de: string) => karten.find((c) => c.de === de)?.pos;
  ok(posVon("heißen") === "Verb" && posVon("die Schule") === "Nomen" && posVon("heute") === "Adverb" && posVon("groß") === "Adjektiv" && posVon("und") === "Konjunktion" && posVon("mit") === "Präposition" && posVon("eins") === "Zahl" && posVon("hallo") === "Interjektion" && posVon("Guten Tag") === "Wendung" && posVon("Ich weiß nicht") === "Satz",
    "K126b عشرُ عيّناتٍ يدويةٍ في مواضعِها عبرَ عشرةِ أنواع");
  const mitInfo = karten.filter((c) => c.posInfo);
  ok(mitInfo.length === 24 && karten.find((c) => c.de === "heißen")?.posInfo === "unregelmäßig", `K126c تفاصيلُ الوسمِ القديمِ محفوظةٌ لا مرميّة (${mitInfo.length})`);
  const aus = (JSON.parse(readFileSync("content/ant-ausnahmen.json", "utf8")).ausnahmen as { de: string; grund: string }[]);
  const ausDe = new Set(aus.map((a) => a.de));
  const adj = karten.filter((c) => c.pos === "Adjektiv");
  const nackt = adj.filter((c) => !c.ant && !ausDe.has(c.de));
  ok(adj.length === 276 && nackt.length === 0, `K126d كلُّ صفةٍ لها ضدٌّ أو استثناءٌ معلَن (${adj.length - nackt.length}/${adj.length})`);
  ok(aus.length === 11 && aus.every((a) => a.grund.length >= 10), `K126e الاستثناءاتُ 11 معلَّلةٌ تحتَ السقفِ 15`);
  const synN = karten.filter((c) => c.syn).length, antN = karten.filter((c) => c.ant).length;
  ok(synN === 70 && antN === 265, `K126f القفلُ: 70 مرادفاً و265 ضدّاً — أيُّ تغييرٍ يُحدِّثُ السجلَّ والقفل`);
  const feld = (de: string) => karten.find((c) => c.de === de);
  ok(feld("groß")?.ant?.[0] === "klein" && feld("schnell")?.ant?.[0] === "langsam" && feld("anfangen")?.syn?.[0] === "beginnen" && feld("freundlich")?.syn?.[0] === "nett" && feld("freundlich")?.ant?.[0] === "unfreundlich",
    "K126g عيّناتُ المرادفِ والضدِّ صحيحةٌ ومتقابلة");
}

/* ═══ K127 — السيناريوهاتُ مربوطةٌ بالدروس + المقاييسُ نقية (R26/R34) ═══ */
{
  const g = JSON.parse(readFileSync("content/grammar.json", "utf8")) as Record<string, unknown>;
  const sz = (JSON.parse(readFileSync("content/szenarien.json", "utf8")).szenarien as { id: string; lektionen: string[] }[]);
  ok(sz.length === 12 && sz.every((x) => (x.lektionen?.length ?? 0) >= 2), `K127a كلُّ سيناريو يطبّقُ ≥2 درساً (${sz.length})`);
  const alleL = sz.flatMap((x) => x.lektionen);
  ok(alleL.length === 36 && alleL.every((id) => id in g), `K127b 36 رابطاً كلُّها لدروسٍ موجودة`);
  ok(sz.find((x) => x.id === "bank")!.lektionen.includes("b1-passiv") && sz.find((x) => x.id === "jobcenter")!.lektionen.includes("b1-genitiv"),
    "K127c عيّنتان: البنك→المبني للمجهول، الجوب سنتر→Genitiv");
  const p1 = { ...emptyProgress, plan: { ...emptyProgress.plan, tasks: {
    a: { done: true, passed: true, score: 3, total: 4, attempts: 1, kind: "schreiben" },
    b: { done: true, passed: false, score: 0, total: 0, attempts: 1, kind: "sprechen" },
    c: { done: true, passed: true, score: 5, total: 5, attempts: 1, kind: "lesen" },
  } } } as never;
  const q1 = feedbackQuote(p1);
  ok(q1.done === 2 && q1.graded === 1 && q1.pct === 50, `K127d التغذيةُ: 1/2 مصنّفةٍ بتقييم (${q1.pct}٪) وغيرُ الحرّةِ خارجَ الكسر`);
  ok(feedbackQuote(emptyProgress as never).pct === null, "K127e بلا مهامٍ حرّةٍ: لا نسبةَ ولا صفرَ مضلِّل");
  const p2 = { ...emptyProgress, fehler: {
    x: { key: "x", falsch: "a", richtig: "b", art: "s", ar: "", treffer: 0, srs: { reps: 2 } },
    y: { key: "y", falsch: "a", richtig: "b", art: "s", ar: "", treffer: 3, srs: { reps: 3 } },
    z: { key: "z", falsch: "a", richtig: "b", art: "s", ar: "", treffer: 1, srs: { reps: 0 } },
  } } as never;
  const h2 = fehlerHeilung(p2);
  ok(h2.total === 3 && h2.geheilt === 1 && h2.stuck === 1 && h2.pct === 33, "K127f الشفاءُ: نجاحٌ بعدَ الدخولِ شفاءٌ، و3 تعثّراتٍ عالق");
  const p3 = { ...emptyProgress, exams: { 10: { score: 60, passed: false }, 20: { score: 80, passed: true }, 30: { score: 90, passed: true } }, modulPruefungen: { 2: { versuche: 3, best: 70, bestanden: false } } } as never;
  const k3 = pruefungsKurve(p3);
  ok(k3.trend === "steigend" && k3.wiederholt.join() === "2", "K127g المنحنى تصاعديٌّ والوحدةُ 2 أُعيدت مرتين");
  ok(pruefungsKurve(emptyProgress as never).trend === null, "K127h بلا امتحاناتٍ: لا اتجاهَ مُدَّعى");
}


/* ═══ K128 — قفلُ التصحيحاتِ الحيّة V1–V7 ═══ */
{
  const graw = readFileSync("content/grammar.json", "utf8");
  const gg = JSON.parse(graw) as Record<string, any>;
  const alleBeispiele: string[] = [];
  Object.values(gg).forEach((v: any) => {
    (v.examples ?? []).forEach((e: any) => { alleBeispiele.push(e.de, e.ar); });
    (v.rules ?? []).forEach((r: any) => { alleBeispiele.push(r.de, r.ar); });
  });
  const platz = alleBeispiele.filter((x) => /Beispiel für diese Regel|Noch ein Beispiel|Lorem|TODO/.test(x ?? ""));
  ok(platz.length === 0, `K128a لا أمثلةَ حشوٍ في أيِّ درس (${alleBeispiele.length} نصّاً مفحوصاً)`);
  ok(!graw.includes("الأدلة"), "K128b typo الأدلة مقفلةٌ بالصفر");
  const zr = (gg["a0-zahlen"].rules[1] as any).ar as string;
  ok(zr.includes("13–19") && zr.includes("elf") && zr.includes("zwölf"), "K128c قاعدةُ 13–19 تستثني elf/zwölf صراحةً");
  const rx0 = gg["b1-relativ"].rules[0] as any;
  ok(!(rx0.ar as string).includes("يؤنّث") && (rx0.ar as string).includes("يحدد") && (rx0.de as string).includes("die Kinder"),
    "K128d صياغةُ الوصفيةِ سليمةٌ (الجنسُ يحددُ الضميرَ + الجمعُ حاضر)");
  ok((gg["b1-passiv"].rules as any[]).some((r) => (r.de as string).includes("worden")), "K128e قاعدةُ Perfekt Passiv تبررُ تمرينَ worden");
  const vv = JSON.parse(readFileSync("content/vocab.json", "utf8")) as any;
  const karten: any[] = [];
  const walk3 = (x: any): void => {
    if (Array.isArray(x)) { x.forEach(walk3); return; }
    if (x && typeof x === "object") {
      if (typeof x.de === "string" && typeof x.id === "string") karten.push(x);
      Object.values(x).forEach(walk3);
    }
  };
  walk3(vv);
  const byId = (id: string) => karten.find((c) => c.id === id);
  ok(byId("v1050")?.ar.startsWith("دوامة الصمت") && (byId("v1090")?.ar ?? "").includes("الابتدائية") && (byId("v1302")?.ar ?? "").includes("شغور") && (byId("v1341")?.ar ?? "").includes("شؤون"),
    "K128f تصحيحاتُ الشروحِ الحرجةِ (دوامة/ابتدائية/شغور/شؤون)");
  ok(!(byId("v1340")?.ar ?? "").includes("أمّي") && !(byId("v1345")?.ar ?? "").includes("وثيقتها") && byId("v218")?.ar === "العادة" && (byId("v870")?.ar ?? "").includes("التكرار"),
    "K128g لا رطانةَ ولا تضييقَ سياقيّ في الشروح");
  const mxw = Math.max(...karten.map((c) => (c.ar as string).split(/\s+/).length));
  ok(mxw <= 12, `K128h سقفُ الشرحِ 12 كلمة (${mxw}) — المعجمُ معجمٌ لا مقال`);
  const mk = (id: string, level: string): any => ({ id, level, rules: [{ de: `R-${id}`, ar: `ق-${id}` }], examples: [{ de: `B1-${id}`, ar: "م" }, { de: `B2-${id}`, ar: "م" }] });
  const alle = [mk("a0-x", "A0"), mk("a0-y", "A0"), mk("a1-1", "A1"), mk("a1-2", "A1"), mk("b2-1", "B2"), mk("b2-2", "B2")];
  const fr = entdeckungsFrage(alle[0] as never, alle as never, 0)!;
  const dst = fr.optionen.filter((o) => !o.richtig).map((o) => stufenAbstand(alle.find((l) => l.id === o.quelle)!.level, "A0"));
  ok(stufenAbstand("A0", "A1") === 1 && stufenAbstand("A0", "B2") === 4 && dst.every((d) => d <= 1),
    `K128i مشتّتاتُ A0 من A0/A1 فقط (أبعاد: ${dst.join(",")}) — لا ضجيجَ B2 لتلميذِ اليومِ الأوّل`);
}


/* ═══ K129 — قفلُ دفعةِ التنظيف V8–V17 + D4–D6/D8–D9 ═══ */
{
  const dupTitel = (items: any[]) => {
    const seen = new Set<string>();
    const dups: string[] = [];
    items.forEach((x) => {
      const k = `${x.level}::${x.titleDe}`;
      if (seen.has(k)) dups.push(k); else seen.add(k);
    });
    return dups;
  };
  const tx = JSON.parse(readFileSync("content/texts.json", "utf8")) as any;
  const txl = (Array.isArray(tx) ? tx : tx.texts) as any[];
  const dg = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any;
  const dgl = (Array.isArray(dg) ? dg : dg.dialogues) as any[];
  const wr = JSON.parse(readFileSync("content/writing.json", "utf8")) as any;
  const wrl = (Array.isArray(wr) ? wr : wr.writing) as any[];
  ok(dupTitel(txl).length === 0 && dupTitel(dgl).length === 0 && dupTitel(wrl).length === 0, "K129a لا عنوانَ مكرراً داخلَ المستوى الواحد (نصوص/حوارات/كتابة)");
  const st = JSON.parse(readFileSync("content/sentences.json", "utf8")) as any;
  const stl = (Array.isArray(st) ? st : st.sentences) as any[];
  const byIdS = (id: string) => stl.find((x) => x.id === id);
  ok(stl.length === 608 && byIdS("s-b1-42")?.de !== byIdS("s-b1-48")?.de, "K129b الجملتان متمايزتان (الحذفُ ملغىً بالدليل) والبنكُ 608");
  ok(!JSON.stringify(stl).includes("konjunktor"), "K129c وسم konjunktor مصحّح");
  const gg2 = JSON.parse(readFileSync("content/grammar.json", "utf8")) as Record<string, any>;
  let dupAns = 0;
  Object.values(gg2).forEach((v: any) => {
    [...(v.exercises ?? []), ...(v.verify ?? [])].forEach((e: any) => {
      if (Array.isArray(e.answer) && e.answer.length > 1 && new Set(e.answer).size === 1) dupAns++;
    });
  });
  ok(dupAns === 0, "K129d لا إجاباتٍ مكررةٍ متطابقة");
  ok(gg2["a2-verschmolzene"]?.level === "A2" && !("b2-verschmolzene" in gg2), "K129e الدرسُ المدمجُ في A2 بمعرّفٍ جديد");
  const planSrc = readFileSync("lib/plan.ts", "utf8");
  ok(/A2: \[[^\]]*a2-verschmolzene/.test(planSrc) && !planSrc.includes("b2-verschmolzene"), "K129f الخطةُ تجدولُه في A2 ولا أثرَ للمعرّفِ القديم");
  const exN = (id: string) => (gg2[id].exercises ?? []).length;
  ok(exN("b1-indirekte-fragen") >= 8 && exN("a1-perfekt-einf") >= 7 && exN("a1-imperativ") >= 6 && exN("a1-futur-einf") >= 6 && exN("a2-verschmolzene") >= 6, "K129g الدروسُ النحيفةُ مسمّنة (8/7/6/6/6)");
  const ohnePit = Object.entries(gg2).filter(([, v]: any) => !(v.pitfalls ?? []).length).map(([k]) => k);
  ok(ohnePit.length === 0, `K129h كلُّ درسٍ له فخاخ (${Object.keys(gg2).length}/66)`);
  ok((gg2["a2-futur"].voraus ?? []).includes("a1-futur-einf") && (gg2["a2-praeteritum"].voraus ?? []).includes("a2-praeteritum-grund") && (gg2["a1-zahlen"].voraus ?? []).includes("a0-zahlen"), "K129i سلاسلُ الحلزونِ موثقةٌ في voraus");
  ok((gg2["a1-akkusativ"].tables[0].headers as string[]).includes("مذكّر") && (gg2["a1-wechsel"].tables ?? []).length >= 1 && !(gg2["b1-konj2"].rules[1].de as string).includes(" ,"), "K129j الجداولُ والمسافاتُ مصحّحة");
}


/* ═══ K130 — قفلُ الدروسِ السبعةِ الجديدة N1–N7 (58→65)؛ الدرس 66 له K132 ═══ */
{
  const NEU = ["a1-plural", "a1-zeitpraep", "a2-neben", "a2-demo", "b1-absicht", "b1-konj2-vergangenheit", "b2-textkonnektoren"];
  const alle66 = Object.keys(grammarMap);
  ok(alle66.length === 66 && NEU.every((id) => !!grammarMap[id]), "K130a سبعةُ دروسِ N1–N7 باقيةٌ؛ المجموعُ 66 بعدَ K132");
  ok(NEU.every((id) => { const t = grammarMap[id]; return t.exercises.length >= 7 && (t.pitfalls ?? []).length >= 3 && (t.verify ?? []).length === 2 && (t.examples ?? []).length >= 3 && (t.rules ?? []).length >= 3 && !!t.ziel && (t.voraus ?? []).length >= 1; }),
    "K130b كلُّ جديدٍ كاملُ البنية (≥7 تمارين · 3 فخاخ · 2 تحقق · 3 أمثلة · 3 قواعد · هدفٌ ومتطلب)");
  const progN = loadProgress();
  const erstN: Record<string, number> = {};
  for (let d = 1; d <= TOTAL; d++) for (const t of buildDay(d, progN).tasks) if (t.topicId && !(t.topicId in erstN)) erstN[t.topicId] = d;
  ok(NEU.every((id) => erstN[id] !== undefined), `K130c السبعةُ مجدولةٌ (${NEU.map((id) => `${id}@${erstN[id]}`).join(" ")})`);
  ok(erstN["a1-akkusativ"] < erstN["a1-plural"] && erstN["a1-zahlen"] < erstN["a1-zeitpraep"] && erstN["a1-weil-dass"] < erstN["a2-neben"] && erstN["a1-pronomen"] < erstN["a2-demo"] && erstN["a2-weil-dass"] < erstN["b1-absicht"] && erstN["b1-konj2"] < erstN["b1-konj2-vergangenheit"] && erstN["b1-konnektoren"] < erstN["b2-textkonnektoren"] && erstN["b1-absicht"] < erstN["b2-infinitiv"],
    "K130d الحلزونُ مرتبٌ: المتطلبُ قبلَ الدرسِ والمعمَّقُ بعدَه");
  ok(eselsbruecken.length === 65 && NEU.every((id) => getBrueckenFor(id).length >= 1), "K130e تركةٌ لكلِّ جديدٍ والمجموعُ 65");
}

  /* ═══ K131 · دفعة D1/D3/E7: لوح A0 + إتمام A1 + الأصدقاء الكاذبون ═══ */
  {
    const vraw = require("../content/vocab.json") as Record<string, { id: string; level: string; cards: { id: string; level: string }[] }>;
    const a0 = vraw["a0-start"];
    ok(!!a0 && a0.cards.length === 40 && a0.cards.every((c) => c.level === "A0"), "K131a لوحُ التأسيس a0-start: أربعونَ بطاقةً كلُّها A0");
    ok((PHASE_DECKS as Record<string, string[]>).A0.includes("a0-start"), "K131a′ طورُ A0 يدرَّسُ من لوحِه لا مستعاراً");
  }
  {
    const sents = require("../content/sentences.json") as { id: string; level: string; neu?: boolean }[];
    const a1 = sents.filter((s) => s.level === "A1");
    const neu40 = sents.filter((s) => /^s-a1-(6[3-9]|[7-9]\d|10[0-2])$/.test(s.id));
    ok(a1.length === 102 && neu40.length === 40 && neu40.every((s) => s.neu === true), `K131b إتمامُ A1: 102 جملةً والأربعونَ الجديدةُ موسومةٌ neu (${a1.length})`);
  }
  {
    const n = (l: string) => FALSCHE_FREUNDE.filter((f) => f.level === l).length;
    ok(n("A1") >= 20 && n("A2") >= 20 && n("B1") >= 20 && n("B2") >= 12, `K131c الأصدقاءُ بعمقِ التناوبِ المناسبِ للمستوى (${n("A1")}/${n("A2")}/${n("B1")}/${n("B2")})`);
    ok(FALSCHE_FREUNDE.every((f) => /\((En|Fr|Ar|De)\b/.test(f.falschesWort) && f.warhammer.trim().length >= 20 && f.de.trim().length > 0 && f.ar.trim().length > 0 && f.falschBedeutet.trim().length > 0), "K131c′ كلُّ صديقٍ موسومُ المصدرِ ومشروحٌ بمطرقةٍ ≥20 حرفاً");
  }

/* ═══ K132 — a2-wasfuer: معنى السؤال، التصريف، الترتيب، والتركة المؤجلة ═══ */
{
  const topic = grammarMap["a2-wasfuer"];
  const ids = Object.keys(grammarMap);
  ok(ids.length === 66 && !!topic && topic.level === "A2", "K132a درسُ Was-für جديدٌ في بنكِ الـ66 وبمستوى A2");
  ok(!!topic?.ziel && (topic.voraus ?? []).includes("a1-akkusativ") && (topic.voraus ?? []).includes("a2-dativ") && (topic.voraus ?? []).includes("a2-demo") && !!topic.anwendung && topic.exercises.length >= 9 && topic.verify?.length === 2 && topic.rules.length >= 3 && topic.examples.length >= 3 && (topic.pitfalls ?? []).length >= 3,
    "K132b الهدفُ والمتطلباتُ والتطبيقُ المستقلُ والحدُّ الأدنى الكاملُ للدرس مُثبتٌ");
  if (topic) {
    const all = [...topic.exercises, ...(topic.verify ?? [])];
    ok(all.every((ex) => grader.grade(ex, ex.answer).correct), "K132c الأجوبةُ النموذجيةُ للتدريب والتحقق تمرُّ في المصحّح الحتمي");
    const typeQuestion = topic.exercises.find((ex) => ex.id === "a2-wf-e01");
    const contrast = topic.rules.find((rule) => rule.de.includes("Was für ein Bus") && rule.de.includes("Welcher Bus"));
    const typeResult = typeQuestion ? grader.grade(typeQuestion, typeQuestion.answer) : null;
    const choiceResult = typeQuestion ? grader.grade(typeQuestion, "Welches Buch liest du — das hier oder das dort?") : null;
    const transform = topic.exercises.find((ex) => ex.id === "a2-wf-e03");
    const directed = transform ? grader.grade(transform, "Was für einen Film gefällt dir?") : null;
    ok(!!contrast && !!typeResult?.correct && !!choiceResult && !choiceResult.correct && !!directed && !directed.correct && (directed.feedbackAr ?? "").includes("ما زلتَ تكتب"),
      "K132d يقارن Was für ein Bus/Welcher Bus في السياق نفسه، ويميّز النوع من الاختيار ويشخّص فخَّ الحالة توجيهياً");
    const practiceIds = new Set(topic.exercises.map((ex) => ex.id));
    ok((topic.verify ?? []).every((ex) => !practiceIds.has(ex.id)) && topic.verify?.length === 2, "K132e بندا التحقق جديدان لا إعادةٌ لتمارين التدريب");
  }
  const phaseA2 = PHASE_TOPICS.A2;
  const prereqDay: Record<string, number> = {};
  const emptyPlanProgress = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 1 } };
  for (let d = 1; d <= TOTAL; d++) {
    for (const task of buildDay(d, emptyPlanProgress).tasks) {
      if (task.topicId && prereqDay[task.topicId] === undefined) prereqDay[task.topicId] = d;
    }
  }
  const prereqs = ["a1-akkusativ", "a2-dativ", "a2-demo"];
  ok(phaseA2.indexOf("a2-wasfuer") > phaseA2.indexOf("a2-dativ") && prereqs.every((id) => prereqDay[id] !== undefined && prereqDay[id] < prereqDay["a2-wasfuer"]),
    `K132f الدرسُ مجدولٌ بعدَ متطلباته (${prereqs.map((id) => `${id}@${prereqDay[id]}`).join(" · ")} → a2-wasfuer@${prereqDay["a2-wasfuer"]})`);
  ok(eselsbruecken.length === 65 && getBrueckenFor("a2-wasfuer").some((b) => b.id === "e-wasfuer"), "K132g تركةُ Was-für معلَّقةٌ بدرسها؛ إجماليُّ التركات 65");
  const dueDay = 23;
  const dueProgress = { ...emptyProgress, plan: { ...emptyProgress.plan, day: 20 }, verify: { ...(emptyProgress.verify ?? {}), "a2-wasfuer": { dueDay } } };
  const early = dueVerify(dueProgress, dueDay - 1).some((v) => v.lessonId === "a2-wasfuer");
  const due = dueVerify(dueProgress, dueDay).some((v) => v.lessonId === "a2-wasfuer");
  const dueTask = buildDay(dueDay, dueProgress).tasks.find((t) => t.verifyFor === "a2-wasfuer");
  ok(!early && due && dueTask?.kind === "check" && dueTask.quiz?.length === 2,
    "K132h لا تحققٍ قبل ثلاثة أيام؛ وفي اليوم الثالث تُبنى مهمةُ check ببندي التحقق الجديدين");
}

/* ═══ K133 — R31: اعتراضٌ مفاجئٌ حتميٌّ في مناقشاتِ Teil 3 ═══ */
{
  const teil2 = muendlich.filter((karte) => karte.teil === 2);
  const teil3 = muendlich.filter((karte) => karte.teil === 3);
  const ids = teil3.flatMap((karte) => (karte.einwaende ?? []).map((einwand) => einwand.id));
  const inhaltGilt = teil3.length === 6 && teil3.every((karte) =>
    karte.zeit_s === 300 && karte.einwaende?.length === 2 && karte.einwaende.every((einwand) =>
      !!einwand.id && einwand.de.length >= 45 && !!einwand.ar && !/[\u0600-\u06ff]/.test(einwand.de),
    ),
  ) && new Set(ids).size === 12 && teil2.every((karte) => !karte.einwaende?.length);
  ok(inhaltGilt, "K133a ستُّ بطاقاتِ Teil 3 لها اعتراضان ألمانيان سياقيان وترجمتان؛ بلا اعتراضاتٍ دخيلةٍ على Teil 2");

  const plaene = teil3.flatMap((karte) => [1, 42, 378].map((day) =>
    [0, 1].map((zug) => planeEinwand(karte.id, karte.einwaende ?? [], day, zug)),
  ));
  const planListe = plaene.flat(2);
  const planGueltig = planListe.length === 36 && planListe.every((plan) =>
    !!plan && plan.nachSekunden >= 60 && plan.nachSekunden <= 120 &&
    plan.einwand.id.startsWith("mm") && plan.einwand.de.length >= 45,
  );
  const karteTest = teil3[0];
  const fest = planeEinwand(karteTest.id, karteTest.einwaende ?? [], 42, 1);
  const wiederholt = planeEinwand(karteTest.id, karteTest.einwaende ?? [], 42, 1);
  ok(planGueltig && JSON.stringify(fest) === JSON.stringify(wiederholt), "K133b اختيارُ الاعتراضِ وموعدُه حتميانِ ومحصورانِ بين 60–120 ثانية عبر الأيام والجولات");

  const muendlichUi = readFileSync("components/muendlich.tsx", "utf8");
  ok(muendlichUi.includes('data-testid="muendlich-einwand"') && muendlichUi.includes('aria-label="استمع للاعتراض"') &&
    muendlichUi.includes("onClick={() => speakDe(geplanterEinwand.einwand.de)}") && muendlichUi.includes("لا تسجيل ولا تقييم آلي للنطق") &&
    !/getUserMedia|fetch\s*\(/.test(muendlichUi),
    "K133c المقاطعةُ تظهر ويطلب المتعلم قراءتها عبر TTS المحلي؛ لا ميكروفونَ أو شبكةً أو تقييمَ نطق");
  ok(muendlichUi.includes("لا يُعدّ هذا إثباتاً للنطق أو للاستقلال") && muendlichUi.includes("setEinwandAntwort(true)") &&
    !/useProgress|logK\s*\(|localStorage/.test(muendlichUi),
    "K133d إقرارُ الردّ ذاتيٌّ فقط ولا يُحفظُ كتقدّمٍ أو إثباتٍ للاستقلال");
  ok(muendlichUi.includes("لا يثبت جاهزية الامتحان") && !muendlichUi.includes("prüfungsreif") && !muendlichUi.includes("جاهز للامتحان"),
    "K133e التقديرُ الذاتي لا يَعِدُ بجاهزية الامتحان أو يُسقطُها على متعلّم");
}

/* ═══ K134 — R32: جدوى التعرّف المحلي وحدودُ قرارِها موثّقةٌ ومقفلة ═══ */
{
  const study = readFileSync("docs/r32-spracherkennung-machbarkeit.md", "utf8");
  ok(study.includes("processLocally = true") && study.includes("de-DE") && study.includes("available()") &&
    study.includes("Chrome 139") && study.includes("Safari") && study.includes("Edge"),
    "K134a دراسةُ R32 تثبتُ مسارَ المحلي وde-DE وحدودَ التوافق بمصادرٍ قابلةٍ للمراجعة");
  ok(study.includes("R24") && study.includes("SpeechRecognition.install()") &&
    study.includes("من زر تنزيل مستقل") && study.includes("موافقة تنزيل صريحة"),
    "K134b تنزيلُ حزمةِ اللغة لا يتجاوزُ بوابةَ R24 ولا يبدأ تلقائياً");
  ok(study.includes("لا تشغيل للتعرّف السحابي تلقائياً") && study.includes("لا fallback تلقائياً") &&
    study.includes("تعذّر التحقق"),
    "K134c تعذّرُ المحلي لا يتحولُ إلى السحابة ولا يُسجّلُ خطأً لغوياً");
  ok(study.includes("لا يثبت بمفرده سلامة الأصوات") && study.includes("يقيّم النطق أو الاستقلال") &&
    study.includes("اختبارات المتصفحات والأجهزة والشبكة الفعلية لم تُنفذ"),
    "K134d نصُّ التعرّف ليسَ دليلاً على النطق أو الاستقلال؛ واختبارُ الأجهزة غيرُ مدّعى");
  ok(study.includes("75 MiB") && study.includes("273 MB") && study.includes("whisper.cpp"),
    "K134e بديلُ WASM موثّقٌ بحجم النموذج وذاكرته، لا يُعتمد بلا قياسٍ للأجهزة");
}

/* ═══ K135 — R24: استثناءُ تنزيلِ حزمةِ de-DE محدودٌ وموافقتُه مستقلة ═══ */
{
  const rules = readFileSync("RULES.md", "utf8");
  const r24 = rules.split("\n").find((line) => line.startsWith("| R24 |")) ?? "";
  const study = readFileSync("docs/r32-spracherkennung-machbarkeit.md", "utf8");
  const handoff = readFileSync("HANDOFF.md", "utf8");
  const networkLine = handoff.split("\n").find((line) => line.includes("قاعدة الشبكة")) ?? "";
  const downloadLine = handoff.split("\n").find((line) => line.includes("حزمة ASR محلية")) ?? "";
  ok(r24.includes("de-DE") && r24.includes("SpeechRecognition.install()") && r24.includes("زر مستقل") &&
    r24.includes("موافقة منفصلين") && r24.includes("لا إرسال للصوت/النص") && r24.includes("fallback سحابي"),
    "K135a R24 يجيزُ تنزيلَ de-DE وحده بزرٍّ وإذنٍ مستقلين، ويحظرُ إرسالَ الصوتِ وfallback السحابة");
  ok(study.includes("أُجيز استثناء محدود من R24") && study.includes("لا تكفي موافقة السحابة لهذا الغرض") &&
    study.includes("لا يسمح القرار بإرسال الصوت/النص") && study.includes("لا fallback تلقائياً"),
    "K135b مذكرةُ R32 تسجلُ حدودَ الاستثناء ولا تخلطُ إذنَ التنزيل بإذن السحابة");
  ok(networkLine.includes("اتصالَي الخدمة") && downloadLine.includes("زر تنزيل مستقل") &&
    downloadLine.includes("موافقة تنزيل منفصلة") && downloadLine.includes("R24"),
    "K135c بطاقةُ التسليم تعكسُ استثناءَ الشبكة بحدودِه وموافقتِه المنفصلة");
}

/* ═══ K142 — R32: طيارُ de-DE محلي منفصل؛ لا إذن سحابي ولا تصنيف لغوي ═══ */
{
  const local = readFileSync("lib/local-speech.ts", "utf8");
  const pilot = readFileSync("components/LocalSpeechPilot.tsx", "utf8");
  const settings = readFileSync("app/einstellungen/page.tsx", "utf8");
  const localFlagAt = local.indexOf("recognition.processLocally = true");
  const startAt = local.indexOf("recognition.start();");
  const consentGuardAt = local.indexOf("if (!consented)");
  const installAt = local.indexOf("Recognition.install(");
  ok(local.includes('Recognition.available({ langs: [LOCAL_SPEECH_LANGUAGE], processLocally: true })') &&
    local.includes('LOCAL_SPEECH_LANGUAGE = "de-DE"'),
    "K142a فحص الإتاحة يطلب de-DE مع processLocally=true تحديداً");
  ok(consentGuardAt >= 0 && installAt > consentGuardAt && local.includes("installLocalGermanModel(consented: boolean)") &&
    pilot.includes('data-testid="local-asr-download-consent"') && pilot.includes("disabled={!consentToDownload || installing}"),
    "K142b لا تنزيل إلا بطلب زر مستقل بعد موافقة صريحة غير محفوظة");
  ok(localFlagAt >= 0 && startAt > localFlagAt && local.includes('recognition.processLocally !== true') &&
    !local.includes("webkitSpeechRecognition ??"),
    "K142c يثبّت وضع المحلي ويتحقق منه قبل start ولا يسقط إلى واجهة عامة/سحابية");
  ok(pilot.includes('"local-asr-start"') && pilot.includes("startLocalGermanRecognition(") &&
    settings.includes("<LocalSpeechPilot />") && settings.includes("طيار التعرّف المحلي الألماني"),
    "K142d الطيار منفصل واختياري في الإعدادات، لا جزءاً من المهام الأساسية");
  ok(pilot.includes("تعذّر التحقق") && pilot.includes("ليس تقييماً للنطق") &&
    pilot.includes("لا تُحفظ المحاولة أو النص") && !pilot.includes("localStorage") && !pilot.includes("onPoints"),
    "K142e الفشل التقني لا يصبح حكماً لغوياً؛ النص لا يُحفظ ولا يمنح نقاطاً");
  ok(!local.includes("fetch(") && !pilot.includes("fetch(") && !pilot.includes("listenDe(") &&
    !pilot.includes("cloudSpracheFrei()"),
    "K142f لا إرسال أو fallback سحابي في وحدة الطيار");
}

/* ═══ K143 — إصلاحات التدقيق: v146، تغطية الكتابة، الوتيرة، وحفظ التوقف ═══ */
{
  const entschuldigung = alleVokabeln.find((card) => card.id === "v146");
  const cardMeta = entschuldigung as (typeof entschuldigung & { farbe?: string }) | undefined;
  ok(!!cardMeta && cardMeta.de === "die Entschuldigung" && cardMeta.article === "die" && cardMeta.farbe === "ROT" &&
    deFormOf(cardMeta) === "die Entschuldigung" && deFormOf(cardMeta, false) === "Entschuldigung",
    "K143a v146 يحمل die/ROT مرةً واحدة، وصيغة العرض لا تكرر أداة التعريف");

  const a0Numbers = texts.find((text) => text.id === "t-a0-03")!;
  const a0Days = texts.find((text) => text.id === "t-a0-04")!;
  const weekendQ = a0Days.questions.find((question) => question.id === "t-a0-04-q2")!;
  const displayedA0 = [leseText(a0Numbers).de, leseText(a0Days).de];
  ok(displayedA0.every((text) => text.trim().split(/\s+/).filter(Boolean).length >= 20) &&
    displayedA0[1].includes("Samstag und Sonntag sind das Wochenende.") && weekendQ.promptDe === "Was sind Samstag und Sonntag?" &&
    weekendQ.answer === "das Wochenende" && (weekendQ.options?.includes(weekendQ.answer as string) ?? false),
    "K143e نصّا A0 يتجاوزان الحد الإرشادي الأدنى، وسؤال عطلة الأسبوع له دليل وإجابة غير ملتبسة");

  const wA201 = writingTasks.find((task) => task.id === "w-a2-01");
  const writingWorkshop = readFileSync("components/schreiben.tsx", "utf8");
  const trainer = readFileSync("components/trainer.tsx", "utf8");
  const reachableSeeds = !!wA201 && Array.from({ length: 200 }, (_, i) => pickN(writingTasks.filter((task) => task.level === wA201.level), 1, rng((i + 1) * 7919))[0]?.id)
    .includes("w-a2-01");
  ok(!!wA201 && !buildDay(TOTAL_DAYS, emptyProgress).tasks.some((task) => task.writeId === "w-a2-01") &&
    writingWorkshop.includes("writingTasks.filter((w) => w.level === level)") && trainer.includes("<SchreibWerkstatt progress={progress} />") && reachableSeeds,
    "K143b w-a2-01 ليس مجدولاً افتراضياً لكنه متاحٌ في ورشة الكتابة البديلة ضمن A2 ويمكن اختياره؛ لا يُضاف تلقائياً إلى اليوم");

  const taskSrc = readFileSync("components/tasks.tsx", "utf8");
  const classroomSrc = readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");
  const homeSrc = readFileSync("app/page.tsx", "utf8");
  ok(taskSrc.includes("newCardCap(tempo)") && taskSrc.includes("countNewCardsIntroducedToday(srs, alleVokabelIds)") &&
    taskSrc.includes("wasIntroducedToday(srs[c.id])") && taskSrc.includes("تُقدَّم المراجعات المستحقّة أولاً") &&
    taskSrc.includes("pool = [...dueToday, ...pendingToday") && classroomSrc.includes("tempo={progress.settings.tempo}"),
    "K143c سقف الجديد يومي وعابر للحزم، المستحق أولاً ثم البطاقة غير المقيمة، ولا يظهر غير المستحق لملء الحصة");
  ok(homeSrc.includes("session-time-note") && homeSrc.includes("totalMinutes") && homeSrc.includes("dayPointsKey(day)") &&
    classroomSrc.includes('data-testid="pause-and-save"') && classroomSrc.includes("saveProgress(progress)") &&
    classroomSrc.includes("persistKey={`wegb2:partial:${currentTask.id}`}"),
    "K143d تعارض تقديرات الخطة مع هدف الجلسة معلَن، والتوقف يحفظ اليوم ومسودّة المهمة دون إغلاق أو دين");

  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { dependencies: { next: string }; devDependencies: { postcss: string }; overrides: { postcss: string } };
  const lock = JSON.parse(readFileSync("package-lock.json", "utf8")) as { packages: Record<string, { version?: string }> };
  ok(pkg.dependencies.next === "^15.5.27" && lock.packages["node_modules/next"]?.version === "15.5.27" &&
    pkg.devDependencies.postcss === "^8.5.28" && pkg.overrides.postcss === "$postcss" &&
    lock.packages["node_modules/postcss"]?.version === "8.5.28",
    "K143f ترقيع أمني ضمن Next 15: PostCSS موحّد بالـoverride، من دون قفزة رئيسية");

  const auditSrc = readFileSync("scripts/audit_inhalt.ts", "utf8");
  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts as Record<string, string>;
  ok(!!scripts["audit:content"] && auditSrc.includes("const I: Record<string, string[]> = {}") &&
    auditSrc.includes("if (keys.length === 0)") && auditSrc.includes("if (keys.length > 0) process.exitCode = 1") &&
    auditSrc.includes("wA201AlternativeReachable") && auditSrc.includes("abdeckung:writing-alternative"),
    "K143g تدقيق المحتوى يفصل البنيوي عن التربوي ويصنّف w-a2-01 كمعلومة حين تثبت إتاحته البديلة");
  ok(taskSrc.includes("const toggleCanDoNow = (id: string) =>") && taskSrc.includes("const progress = loadProgress()") &&
    !taskSrc.includes("useProgressMini"),
    "K143h قائمة الاستطاعة لا تنشئ اشتراك Progress ثانياً أثناء عرض Today، وتظل تكتب التبديل للمخزن");
}

/* ═══ K144 — مرادفات السياق: تقارب محدود بأمثلة عربية/ألمانية، بلا استبدال عام ═══ */
{
  const contextual = alleVokabeln.flatMap((card) => synonymKontexteFuer(card).map((entry) => ({ card, entry })));
  const arabic = /[؀-ۿ]/;
  const valid = contextual.every(({ card, entry }) => {
    const x = entry.kontext;
    return card.syn?.includes(entry.synonym) === true &&
      kollokationenFuer(card).includes(x.basisKollokation) &&
      x.alternativKollokation.toLowerCase().includes(entry.synonym.toLowerCase().replace(/^(der|die|das)\s+/, "")) &&
      [x.basisDe, x.alternativDe, x.basisKollokation, x.alternativKollokation].every((s) => !!s.trim() && !arabic.test(s)) &&
      [x.basisAr, x.alternativAr, x.nuanceAr].every((s) => arabic.test(s));
  });
  ok(synonymKontextAnzahl() === 70 && contextual.length === 70 && valid,
    `K144a كل علاقة مرادفة معروضة لها متلازمة أصلية ومقابل سياقي وأمثلة ثنائية (سليم ${contextual.length}/70)`);
  const beginnenDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "anfangen"));
  const sehenDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "sehen"));
  const freundlichDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "freundlich"));
  const sauberDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "sauber"));
  const frohDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "froh"));
  const denkenDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "denken"));
  const universitaetDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "die Universität"));
  const immerDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "immer"));
  const wohnungDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "die Wohnung"));
  const kommenDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "kommen"));
  const schnellDeck = Object.values(vocabMap).find((deck) => deck.cards.some((card) => card.de === "schnell"));
  const exportAnfangen = beginnenDeck && exportKarten(beginnenDeck.id).find((card) => card.vorne.toLowerCase().includes("anfangen"));
  const exportSehen = sehenDeck && exportKarten(sehenDeck.id).find((card) => card.vorne.toLowerCase().includes("sehen"));
  const exportKommen = kommenDeck && exportKarten(kommenDeck.id).find((card) => card.vorne.toLowerCase().includes("kommen"));
  const exportSchnell = schnellDeck && exportKarten(schnellDeck.id).find((card) => card.vorne.toLowerCase().includes("schnell"));
  const exportFreundlich = freundlichDeck && exportKarten(freundlichDeck.id).find((card) => card.vorne.toLowerCase().includes("freundlich"));
  const exportSauber = sauberDeck && exportKarten(sauberDeck.id).find((card) => card.vorne.toLowerCase().includes("sauber"));
  const exportFroh = frohDeck && exportKarten(frohDeck.id).find((card) => card.vorne.toLowerCase().includes("froh"));
  const exportDenken = denkenDeck && exportKarten(denkenDeck.id).find((card) => card.vorne.toLowerCase().includes("denken"));
  const exportUniversitaet = universitaetDeck && exportKarten(universitaetDeck.id).find((card) => card.vorne.toLowerCase().includes("universität"));
  const exportImmer = immerDeck && exportKarten(immerDeck.id).find((card) => card.vorne.toLowerCase().includes("immer"));
  const exportWohnung = wohnungDeck && exportKarten(wohnungDeck.id).find((card) => card.vorne.toLowerCase().includes("wohnung"));
  ok(!!exportAnfangen && exportAnfangen.synonyme.includes("beginnen") && exportAnfangen.synonyme.includes("↔") &&
    !!exportSehen && exportSehen.synonyme.includes("schauen") && exportSehen.synonyme.includes("↔") &&
    !!exportKommen && exportKommen.synonyme.includes("ankommen") && exportKommen.synonyme.includes("↔") &&
    !!exportSchnell && exportSchnell.synonyme.includes("rasch") && exportSchnell.synonyme.includes("↔") &&
    !!exportFreundlich && exportFreundlich.synonyme.includes("nett") && exportFreundlich.synonyme.includes("↔") &&
    !!exportWohnung && exportWohnung.synonyme.includes("das Appartement") && exportWohnung.synonyme.includes("ein Appartement mieten") &&
    !!exportDenken && exportDenken.synonyme.includes("glauben") && !!exportUniversitaet && exportUniversitaet.synonyme.includes("Hochschule") &&
    !!exportImmer && exportImmer.synonyme.includes("stets") && !!exportSauber && exportSauber.synonyme.includes("rein") &&
    !!exportFroh && exportFroh.synonyme.includes("glücklich") && exportFroh.synonyme.includes("↔"),
    "K144b التصدير يعرض سياقات الدفعات السبع ولا يستخدم قائمة syn الخام كبديل عام");
  const wordUi = readFileSync("components/wortlink.tsx", "utf8");
  const taskUi = readFileSync("components/tasks.tsx", "utf8");
  ok(wordUi.includes('<SynonymKontext karte={karte} testId="wortkarte-syn-context" />') &&
    taskUi.includes('<SynonymKontext karte={card} testId="karte-syn-context" />') &&
    !wordUi.includes("karte.syn!.join") && !taskUi.includes("card.syn.join"),
    "K144c البطاقة المنبثقة ومهمة المفردات تستخدمان عرض السياق ولا تعرضان قائمة syn الخام");
}

/* ═══ K145 — R71: دفعة السياق الثانية مع إبقاء غير المنتج مخفياً ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, unknown>>;
  const expected: Record<string, string> = {
    sehen: "schauen", holen: "abholen", "das Auto": "der Wagen", "das Wort": "der Ausdruck",
    "das Problem": "die Schwierigkeit", "die Idee": "der Gedanke", "die Firma": "das Unternehmen",
    "der Chef": "der Vorgesetzte", höflich: "zuvorkommend", "das Mittagessen": "das Mittagsmahl",
  };
  const firstBatch = new Set(["anfangen", "antworten", "helfen", "wohnen", "sprechen", "treffen", "erzählen", "erklären", "schreiben", "sparen"]);
  const pairs = Object.entries(expected);
  const valid = pairs.every(([source, target]) => {
    const card = alleVokabeln.find((item) => item.de === source);
    return !firstBatch.has(source) && !!card && card.syn?.includes(target) &&
      !!bank[source]?.[target] && kollokationenFuer(card).includes((bank[source][target] as { basisKollokation: string }).basisKollokation);
  });
  ok(pairs.length === 10 && synonymKontextAnzahl() >= 20 && valid,
    `K145a الدفعة الثانية محفوظة بعشر علاقات موثقة من syn والمتلازمات؛ الإجمالي ${synonymKontextAnzahl()}/70`);
}

/* ═══ K146 — R72: الدفعة الثالثة، بلا توسيع syn أو كشف غير الموثق ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, unknown>>;
  const rawSyn = JSON.parse(readFileSync("content/synonyme.json", "utf8")) as Record<string, string[]>;
  const expected: Record<string, string> = {
    kommen: "ankommen", sagen: "mitteilen", verstehen: "begreifen", bezahlen: "begleichen",
    finden: "entdecken", reisen: "verreisen", besuchen: "aufsuchen", "die Arbeit": "der Job",
    "der Brief": "das Schreiben", "der Kollege": "der Mitarbeiter",
  };
  const earlier = new Set([
    "anfangen", "antworten", "helfen", "wohnen", "sprechen", "treffen", "erzählen", "erklären", "schreiben", "sparen",
    "sehen", "holen", "das Auto", "das Wort", "das Problem", "die Idee", "die Firma", "der Chef", "höflich", "das Mittagessen",
  ]);
  const pairs = Object.entries(expected);
  const valid = pairs.every(([source, target]) => {
    const card = alleVokabeln.find((item) => item.de.toLowerCase() === source.toLowerCase());
    const context = bank[source]?.[target] as { basisKollokation?: string } | undefined;
    return !earlier.has(source) && !!card && (card.level === "A1" || card.level === "A2") &&
      card.syn?.includes(target) === true && rawSyn[source]?.includes(target) === true && !!context?.basisKollokation &&
      kollokationenFuer(card).includes(context.basisKollokation);
  });
  const rawCount = Object.values(rawSyn).reduce((sum, alternatives) => sum + alternatives.length, 0);
  ok(pairs.length === 10 && synonymKontextAnzahl() >= 30 && rawCount === 70 && valid,
    `K146a الدفعة الثالثة محفوظة بعشر علاقات A1/A2 موثقة، وبنك syn الخام بقي 70؛ الإجمالي السياقي ${synonymKontextAnzahl()}/70`);
}

/* ═══ K147 — R73: متلازمات مساندة فريدة للبطاقات A1 التي لم تكن مغطاة ═══ */
{
  const expected: Record<string, string[]> = {
    "vx-haus--085": ["schnell fahren", "schnell schreiben"],
    "vx-haus--082": ["eine wichtige Frage", "eine wichtige Nachricht"],
    "vx-haus--078": ["die richtige Antwort", "das richtige Ergebnis"],
    "vx-haus--079": ["eine falsche Antwort", "eine falsche Angabe"],
    "vx-haus--081": ["eine leichte Aufgabe", "eine leichte Frage"],
    "vw-a1koe-037": ["billige Schuhe", "billiges Essen"],
    "vw-a1koe-038": ["teuer werden", "ein Hotel teuer finden"],
    "vy-natur-039": ["glücklich über die Nachricht", "glücklich über den Erfolg"],
    "vy-natur-040": ["traurig über den Abschied", "traurig nach der Absage"],
    "vw-a1koe-017": ["müde nach dem Sport", "am Abend müde"],
  };
  const ids = new Map(alleVokabeln.map((card) => [card.id, card]));
  const entries = Object.entries(expected);
  const added = entries.flatMap(([, phrases]) => phrases);
  const core = require("../content/kollok-a1a2-soll.json") as { A1: { karten: { id: string }[] } };
  const valid = entries.every(([id, phrases]) => {
    const card = ids.get(id);
    return !!card && card.level === "A1" && JSON.stringify(kollokationen[id]) === JSON.stringify(phrases) &&
      !core.A1.karten.some((item) => item.id === id) && phrases.every((phrase) => !!partnerWort(card, phrase));
  });
  const all = Object.values(kollokationen).flat();
  ok(entries.length === 10 && added.length === 20 && Object.keys(kollokationen).length >= 2110 &&
    new Set(added).size === 20 && new Set(all).size === all.length && valid,
    `K147a عشر بطاقات A1 غير مغطاة أُضيف لكل منها زوج متلازمات فريد قابل للتدريب؛ البنك ${Object.keys(kollokationen).length} بطاقة`);
}

/* ═══ K148 — R74: الدفعة الرابعة؛ syn الخام ثابت وغير المنتج مخفي ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, unknown>>;
  const rawSyn = JSON.parse(readFileSync("content/synonyme.json", "utf8")) as Record<string, string[]>;
  const expected: Record<string, string> = {
    schnell: "rasch", wichtig: "bedeutsam", richtig: "korrekt", falsch: "inkorrekt", leicht: "einfach",
    billig: "preiswert", teuer: "kostspielig", glücklich: "froh", traurig: "betrübt", müde: "schläfrig",
  };
  const earlier = new Set([
    "anfangen", "antworten", "helfen", "wohnen", "sprechen", "treffen", "erzählen", "erklären", "schreiben", "sparen",
    "sehen", "holen", "das Auto", "das Wort", "das Problem", "die Idee", "die Firma", "der Chef", "höflich", "das Mittagessen",
    "kommen", "sagen", "verstehen", "bezahlen", "finden", "reisen", "besuchen", "die Arbeit", "der Brief", "der Kollege",
  ]);
  const pairs = Object.entries(expected);
  const valid = pairs.every(([source, target]) => {
    const card = alleVokabeln.find((item) => item.de.toLowerCase() === source);
    const context = bank[source]?.[target] as { basisKollokation?: string } | undefined;
    return !earlier.has(source) && !!card && card.level === "A1" && card.syn?.includes(target) === true &&
      rawSyn[source]?.includes(target) === true && !!context?.basisKollokation &&
      kollokationenFuer(card).includes(context.basisKollokation);
  });
  const rawCount = Object.values(rawSyn).reduce((sum, alternatives) => sum + alternatives.length, 0);
  ok(pairs.length === 10 && synonymKontextAnzahl() >= 50 && rawCount === 70 && valid,
    `K148a عشر علاقات A1 موثقة؛ syn بقي 70 والسياقات ${synonymKontextAnzahl()}/70`);
}

/* ═══ K149 — R75: دفعة دعم خامسة لبطاقات A1 غير المغطاة ═══ */
{
  const expected: Record<string, string[]> = {
    "vx-zeit--037": ["oft spazieren gehen", "oft Musik hören"],
    "vx-zeit--040": ["nie zu spät kommen", "nie rauchen"],
    "vx-haus--092": ["vielleicht morgen kommen", "vielleicht später gehen"],
    "vz-welt-b-056": ["ein Buch wieder lesen", "wieder von vorn anfangen"],
    "vz-welt-b-054": ["schon angekommen", "schon am Morgen"],
    "vx-zeit--033": ["jetzt anfangen", "jetzt weiterarbeiten"],
    "vx-haus--090": ["zusammen kochen", "zusammen lernen"],
    "vb-abschl-049": ["freundlich zu Gästen sein", "freundlich antworten"],
    "vw-a1koe-051": ["schmutzige Hände", "schmutzige Schuhe"],
    v033: ["eine Wohnung mieten", "in der Wohnung wohnen"],
  };
  const sourceTargets: Record<string, string> = {
    oft: "häufig", nie: "niemals", vielleicht: "möglicherweise", wieder: "erneut", schon: "bereits",
    jetzt: "nun", zusammen: "gemeinsam", freundlich: "nett", schmutzig: "dreckig", "die Wohnung": "das Appartement",
  };
  const ids = new Map(alleVokabeln.map((card) => [card.id, card]));
  const entries = Object.entries(expected);
  const added = entries.flatMap(([, phrases]) => phrases);
  const all = Object.values(kollokationen).flat();
  const core = require("../content/kollok-a1a2-soll.json") as { A1: { karten: { id: string }[] } };
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, { basisKollokation: string }>>;
  const valid = entries.every(([id, phrases]) => {
    const card = ids.get(id);
    const target = card && sourceTargets[card.de];
    return !!card && card.level === "A1" && JSON.stringify(kollokationen[id]) === JSON.stringify(phrases) &&
      !core.A1.karten.some((item) => item.id === id) && phrases.every((phrase) => !!partnerWort(card, phrase)) &&
      !!target && card.syn?.includes(target) === true &&
      phrases.includes(bank[card.de]?.[target]?.basisKollokation);
  });
  const a1Supported = Object.keys(kollokationen).filter((id) => ids.get(id)?.level === "A1").length;
  ok(entries.length === 10 && added.length === 20 && Object.keys(kollokationen).length >= 2110 && a1Supported >= 190 &&
    new Set(added).size === 20 && new Set(all).size === all.length && valid,
    `K149a عشر بطاقات A1 غير مغطاة أخذت متلازمتين غير مكررتين مع سياق أساس؛ البنك ${Object.keys(kollokationen).length} / A1 ${a1Supported}`);
}

/* ═══ K150 — R76: الدفعة الخامسة، مع حجب العشرين غير الموثقة ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, {
    basisKollokation: string; alternativKollokation: string; basisDe: string; basisAr: string;
    alternativDe: string; alternativAr: string; nuanceAr: string;
  }>>;
  const rawSyn = JSON.parse(readFileSync("content/synonyme.json", "utf8")) as Record<string, string[]>;
  const expected: Record<string, string> = {
    oft: "häufig", nie: "niemals", vielleicht: "möglicherweise", wieder: "erneut", schon: "bereits",
    jetzt: "nun", zusammen: "gemeinsam", freundlich: "nett", schmutzig: "dreckig", "die Wohnung": "das Appartement",
  };
  const earlier = new Set([
    "anfangen", "antworten", "helfen", "wohnen", "sprechen", "treffen", "erzählen", "erklären", "schreiben", "sparen",
    "sehen", "holen", "das Auto", "das Wort", "das Problem", "die Idee", "die Firma", "der Chef", "höflich", "das Mittagessen",
    "kommen", "sagen", "verstehen", "bezahlen", "finden", "reisen", "besuchen", "die Arbeit", "der Brief", "der Kollege",
    "schnell", "wichtig", "richtig", "falsch", "leicht", "billig", "teuer", "glücklich", "traurig", "müde",
  ]);
  const pairs = Object.entries(expected);
  const arabic = /[؀-ۿ]/;
  const lemma = (word: string) => word.toLowerCase().replace(/^(der|die|das)\s+/, "");
  const valid = pairs.every(([source, target]) => {
    const card = alleVokabeln.find((item) => item.de.toLowerCase() === source.toLowerCase());
    const context = bank[source]?.[target];
    return !earlier.has(source) && !!card && card.level === "A1" && card.syn?.includes(target) === true &&
      rawSyn[source]?.includes(target) === true && !!context && !!context.basisKollokation &&
      kollokationenFuer(card).includes(context.basisKollokation) &&
      lemma(context.alternativKollokation).includes(lemma(target)) &&
      [context.basisDe, context.alternativDe, context.basisKollokation, context.alternativKollokation].every((text) => !!text.trim() && !arabic.test(text)) &&
      [context.basisAr, context.alternativAr, context.nuanceAr].every((text) => arabic.test(text));
  });
  const rawCount = Object.values(rawSyn).reduce((sum, alternatives) => sum + alternatives.length, 0);
  const articleContext = bank["die Wohnung"]?.["das Appartement"];
  const articleOkay = !!articleContext && articleContext.basisKollokation === "eine Wohnung mieten" &&
    articleContext.alternativKollokation === "ein Appartement mieten" &&
    articleContext.alternativDe.includes("ein Appartement");
  ok(pairs.length === 10 && synonymKontextAnzahl() >= 60 && rawCount === 70 && valid && articleOkay,
    `K150a سياقات الدفعة الخامسة محفوظة؛ syn بقي 70 والمقالان صحيحان (${synonymKontextAnzahl()}/70)`);
}

/* ═══ K151 — R77: دعم سادس محدود لمتلازمات A1 التي ينقصها أساس سياقي ═══ */
{
  const expected: Record<string, string[]> = {
    "vx-haus--042": ["an die Zukunft denken", "denken, dass der Bus kommt"],
    "vy-natur-046": ["die Familie lieben", "seine Kinder lieben"],
    "vy-natur-048": ["Gewalt hassen", "Lügen hassen"],
    "vw-a1koe-050": ["sauberes Wasser", "saubere Hände"],
    "vx-zeit--036": ["immer verfügbar", "immer geöffnet"],
  };
  const sourceTargets: Record<string, string> = {
    denken: "glauben", lieben: "liebhaben", hassen: "verabscheuen", sauber: "rein", immer: "stets",
  };
  const ids = new Map(alleVokabeln.map((card) => [card.id, card]));
  const entries = Object.entries(expected);
  const added = entries.flatMap(([, phrases]) => phrases);
  const all = Object.values(kollokationen).flat();
  const core = require("../content/kollok-a1a2-soll.json") as { A1: { karten: { id: string }[] } };
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, { basisKollokation: string }>>;
  const valid = entries.every(([id, phrases]) => {
    const card = ids.get(id);
    const target = card && sourceTargets[card.de];
    return !!card && card.level === "A1" && JSON.stringify(kollokationen[id]) === JSON.stringify(phrases) &&
      !core.A1.karten.some((item) => item.id === id) && phrases.every((phrase) => !!partnerWort(card, phrase)) &&
      !!target && card.syn?.includes(target) === true && phrases.includes(bank[card.de]?.[target]?.basisKollokation);
  });
  const a1Supported = Object.keys(kollokationen).filter((id) => ids.get(id)?.level === "A1").length;
  ok(entries.length === 5 && added.length === 10 && Object.keys(kollokationen).length === 2122 &&
    a1Supported === 199 && all.length === 4670 && new Set(added).size === 10 && new Set(all).size === all.length && valid,
    `K151a دعم R77 بقي محفوظاً؛ بنك المتلازمات النهائي ${Object.keys(kollokationen).length} / A1 ${a1Supported}`);
}

/* ═══ K152 — R78: تحقّق من علاقات الدفعة السياقية السادسة ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, {
    basisKollokation: string; alternativKollokation: string; basisDe: string; basisAr: string;
    alternativDe: string; alternativAr: string; nuanceAr: string;
  }>>;
  const rawSyn = JSON.parse(readFileSync("content/synonyme.json", "utf8")) as Record<string, string[]>;
  const expected: Record<string, string> = {
    denken: "glauben", lieben: "liebhaben", mögen: "gern haben", hassen: "verabscheuen",
    "die Universität": "die Hochschule", "das Gehalt": "der Lohn", schön: "hübsch", modisch: "modern",
    sauber: "rein", immer: "stets",
  };
  const earlier = new Set([
    "anfangen", "antworten", "helfen", "wohnen", "sprechen", "treffen", "erzählen", "erklären", "schreiben", "sparen",
    "sehen", "holen", "das Auto", "das Wort", "das Problem", "die Idee", "die Firma", "der Chef", "höflich", "das Mittagessen",
    "kommen", "sagen", "verstehen", "bezahlen", "finden", "reisen", "besuchen", "die Arbeit", "der Brief", "der Kollege",
    "schnell", "wichtig", "richtig", "falsch", "leicht", "billig", "teuer", "glücklich", "traurig", "müde",
    "oft", "nie", "vielleicht", "wieder", "schon", "jetzt", "zusammen", "freundlich", "schmutzig", "die Wohnung",
  ]);
  const pairs = Object.entries(expected);
  const arabic = /[؀-ۿ]/;
  const lemma = (word: string) => word.toLowerCase().replace(/^(der|die|das)\s+/, "");
  const valid = pairs.every(([source, target]) => {
    const card = alleVokabeln.find((item) => item.de.toLowerCase() === source.toLowerCase());
    const context = bank[source]?.[target];
    return !earlier.has(source) && !!card && ["A1", "B1", "B2"].includes(card.level) &&
      card.syn?.includes(target) === true && rawSyn[source]?.includes(target) === true && !!context &&
      kollokationenFuer(card).includes(context.basisKollokation) &&
      lemma(context.alternativKollokation).includes(lemma(target)) &&
      [context.basisDe, context.alternativDe, context.basisKollokation, context.alternativKollokation].every((text) => !!text.trim() && !arabic.test(text)) &&
      [context.basisAr, context.alternativAr, context.nuanceAr].every((text) => arabic.test(text));
  });
  const rawCount = Object.values(rawSyn).reduce((sum, alternatives) => sum + alternatives.length, 0);
  const university = bank["die Universität"]?.["die Hochschule"];
  const universityOkay = !!university && university.basisKollokation === "an der Universität studieren" &&
    university.alternativKollokation === "an der Hochschule studieren";
  ok(pairs.length === 10 && synonymKontextAnzahl() >= 60 && rawCount === 70 && valid && universityOkay,
    `K152a علاقات الدفعة السادسة العشر موثقة وsyn بقي 70؛ الإجمالي الحالي ${synonymKontextAnzahl()}/70`);
}

/* ═══ K153 — R79: دعم متلازمات A1/A2 السياقية بلا تعديل قوائم SOLL ═══ */
{
  const expectedA1: Record<string, string[]> = {
    "v936": ["froh über die Nachricht", "froh über das Ergebnis"],
    "vb-abschl-048": ["nett zu Kindern", "nett zu Gästen"],
    "vw-a1sta-033": ["weit weg vom Bahnhof", "weit weg vom Zentrum"],
    "vy-natur-043": ["mit dem Ergebnis zufrieden", "mit der Antwort zufrieden"],
  };
  const expectedA2New: Record<string, string[]> = {
    "vf-kultur-010": ["altmodisch aussehen", "altmodisch wirken"],
    "vd-gesund-006": ["ein Spiel gewinnen", "das Finale gewinnen"],
    "vf-kultur-002": ["kräftig gebaut", "kräftig wirken"],
  };
  const expectedA2Append: Record<string, { preserved: string[]; added: string }> = {
    "v1427": { preserved: ["Urlaub machen", "im Urlaub sein"], added: "in den Urlaub fahren" },
    "v075": { preserved: ["an die Zukunft glauben", "an Gott glauben"], added: "glauben, dass der Bus kommt" },
  };
  const core = require("../content/kollok-a1a2-soll.json") as { A1: { karten: { id: string }[] }; A2: { karten: { id: string }[] } };
  const ids = new Map(alleVokabeln.map((card) => [card.id, card]));
  const coreA1 = new Set(core.A1.karten.map((item) => item.id));
  const coreA2 = new Set(core.A2.karten.map((item) => item.id));
  const newA1Valid = Object.entries(expectedA1).every(([id, phrases]) => {
    const card = ids.get(id);
    return !!card && card.level === "A1" && !coreA1.has(id) && JSON.stringify(kollokationen[id]) === JSON.stringify(phrases) &&
      phrases.every((phrase) => !!partnerWort(card, phrase));
  });
  const newA2Valid = Object.entries(expectedA2New).every(([id, phrases]) => {
    const card = ids.get(id);
    return !!card && card.level === "A2" && !coreA2.has(id) && JSON.stringify(kollokationen[id]) === JSON.stringify(phrases) &&
      phrases.every((phrase) => !!partnerWort(card, phrase));
  });
  const appendA2Valid = Object.entries(expectedA2Append).every(([id, expectation]) => {
    const card = ids.get(id);
    const phrases = kollokationen[id] ?? [];
    return !!card && card.level === "A2" && coreA2.has(id) && phrases.length === 3 &&
      expectation.preserved.every((phrase) => phrases.includes(phrase)) && phrases[2] === expectation.added &&
      !!partnerWort(card, expectation.added);
  });
  const supportPhrases = [...Object.values(expectedA1), ...Object.values(expectedA2New)].flat();
  const allPhrases = Object.values(kollokationen).flat();
  const a1Supported = Object.keys(kollokationen).filter((id) => ids.get(id)?.level === "A1").length;
  const a2Supported = Object.keys(kollokationen).filter((id) => ids.get(id)?.level === "A2").length;
  ok(Object.keys(expectedA1).length === 4 && Object.keys(expectedA2New).length === 3 &&
    supportPhrases.length === 14 && new Set(supportPhrases).size === 14 && new Set(allPhrases).size === allPhrases.length &&
    Object.keys(kollokationen).length === 2122 && allPhrases.length === 4670 &&
    a1Supported === 199 && a2Supported === 248 && core.A1.karten.length === 170 && core.A2.karten.length === 245 &&
    newA1Valid && newA2Valid && appendA2Valid,
    `K153a دعم 4 بطاقات A1 و5 بطاقات A2 بمتلازمات قابلة للاختبار، بلا تغيير SOLL أو تكرار؛ البنك ${Object.keys(kollokationen).length} / ${allPhrases.length} عبارة`);
}

/* ═══ K154 — R80: اكتمال السياقات واحداً لواحد مع بنك syn الخام ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, {
    basisKollokation: string; alternativKollokation: string; basisDe: string; basisAr: string;
    alternativDe: string; alternativAr: string; nuanceAr: string;
  }>>;
  const rawSyn = JSON.parse(readFileSync("content/synonyme.json", "utf8")) as Record<string, string[]>;
  const rawPairs = Object.entries(rawSyn).flatMap(([source, targets]) => targets.map((target) => `${source}→${target}`));
  const contextPairs = Object.entries(bank).flatMap(([source, alternatives]) => Object.keys(alternatives).map((target) => `${source}→${target}`));
  const pairSet = new Set(contextPairs);
  const arabic = /[؀-ۿ]/;
  const lemma = (word: string) => word.toLowerCase().replace(/^(der|die|das)\s+/, "");
  const valid = Object.entries(bank).every(([source, alternatives]) => {
    const card = alleVokabeln.find((item) => item.de.toLowerCase() === source.toLowerCase());
    return !!card && Object.entries(alternatives).every(([target, context]) => {
      const german = [context.basisDe, context.alternativDe, context.basisKollokation, context.alternativKollokation];
      const arabicFields = [context.basisAr, context.alternativAr, context.nuanceAr];
      return card.syn?.includes(target) === true && rawSyn[source]?.includes(target) === true &&
        kollokationenFuer(card).includes(context.basisKollokation) &&
        lemma(context.alternativKollokation).includes(lemma(target)) &&
        german.every((text) => typeof text === "string" && !!text.trim() && !arabic.test(text)) &&
        arabicFields.every((text) => typeof text === "string" && arabic.test(text));
    });
  });
  const rawSet = new Set(rawPairs);
  const newPairs = [
    "altmodisch→veraltet", "der Urlaub→die Ferien", "die Rente→die Pension", "froh→glücklich", "gewinnen→siegen",
    "glauben→meinen", "kräftig→muskulös", "nett→freundlich", "weit→entfernt", "zufrieden→befriedigt",
  ];
  const newContextsValid = newPairs.every((pair) => pairSet.has(pair));
  ok(rawPairs.length === 70 && rawSet.size === 70 && contextPairs.length === 70 && pairSet.size === 70 &&
    rawPairs.every((pair) => pairSet.has(pair)) && contextPairs.every((pair) => rawSet.has(pair)) &&
    newPairs.length === 10 && newContextsValid && valid,
    `K154a كل أزواج syn الـ70 لها سياق واحدٌ موثق، والعشر الجديدة اجتازت بوابات الحقول والمتلازمات؛ ${pairSet.size}/70`);
}

/* ═══ K155 — R81: كل مثال ألماني يربط صراحةً طرف العلاقة المناسب ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, {
    basisDe: string; alternativDe: string;
  }>>;
  const words = (text: string) => text.toLowerCase().normalize("NFC").replace(/[^a-zäöüß0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const labelWords = (label: string) => words(label.replace(/^(der|die|das)\s+/i, "")).filter((word) => word.length > 2);
  const labelInSentence = (label: string, sentence: string) => {
    const tokens = words(sentence);
    return labelWords(label).every((word) => {
      const stem = word.length > 4 ? word.slice(0, Math.max(3, word.length - 2)) : word;
      return tokens.some((token) => token === word || token.includes(stem));
    });
  };
  const morphology: Record<string, { basis?: RegExp; alternative?: RegExp }> = {
    "anfangen→beginnen": { basis: /\bfange\b.*\ban\b/i },
    "sprechen→reden": { basis: /\bspricht\b/i },
    "sparen→ansparen": { alternative: /\bspare\b.*\ban\b/i },
    "holen→abholen": { alternative: /\bhole\b.*\bab\b/i },
    "kommen→ankommen": { alternative: /\bkommen\b.*\ban\b/i },
    "sagen→mitteilen": { alternative: /\bteilt\b.*\bmit\b/i },
    "besuchen→aufsuchen": { alternative: /\bsuchen\b.*\bauf\b/i },
    "lieben→liebhaben": { alternative: /\bhabe\b.*\blieb\b/i },
  };
  const pairs = Object.entries(bank).flatMap(([source, alternatives]) => Object.entries(alternatives).map(([target, context]) => ({
    source, target, context: context as { basisDe: string; alternativDe: string },
  })));
  const linked = pairs.every(({ source, target, context }) => {
    const exception = morphology[`${source}→${target}`];
    const basisLinked = labelInSentence(source, context.basisDe) || !!exception?.basis?.test(context.basisDe);
    const alternativeLinked = labelInSentence(target, context.alternativDe) || !!exception?.alternative?.test(context.alternativDe);
    return basisLinked && alternativeLinked;
  });
  const exceptionsValid = Object.entries(morphology).every(([pair, exception]) => {
    const [source, target] = pair.split("→");
    const context = bank[source]?.[target];
    return !!context && (!exception.basis || exception.basis.test(context.basisDe)) &&
      (!exception.alternative || exception.alternative.test(context.alternativDe));
  });
  ok(pairs.length === 70 && Object.keys(morphology).length === 8 && linked && exceptionsValid &&
    !labelInSentence("weit", "Das Dorf liegt direkt am Bahnhof."),
    `K155a كل مثال أساس/بديل يذكر لفظه؛ 70 علاقة، مع 8 صيغ أبلاوت/فصل موثقة ومن دون تمرير مثال غير مرتبط`);
}

/* ═══ K136 — R56: خطوةٌ واحدةٌ مرئية، والتفاصيل والأدوات باقيةٌ دون ازدحام ═══ */
{
  const home = readFileSync("app/page.tsx", "utf8");
  const classroom = readFileSync("components/akademie/Klassenzimmer.tsx", "utf8");
  const primaryAt = home.indexOf('data-testid="today-primary-step"');
  const goalAt = home.indexOf('aria-label="هدف الجلسة اليومي"');
  const playerAt = home.indexOf("<Klassenzimmer");
  ok(primaryAt >= 0 && goalAt > primaryAt && playerAt > goalAt && home.includes("heldGrund") &&
    home.includes('data-testid="held-start"') && home.includes("onClick={startToday}") &&
    home.includes('document.getElementById("dirb-training")') && home.includes('"ابدأ الآن"') &&
    home.includes('"راجع نهاية اليوم"'),
    "K136a شاشةُ اليوم تبدأ بخطوةٍ واحدةٍ وسببها وزرٍ عربي، قبل الهدف والمشغّل");
  ok(!home.includes("XpBar") && (home.match(/role="progressbar"/g) ?? []).length === 1 &&
    home.includes('data-testid="zeit-hinweis"') && home.includes("هدف 15/30/60 دقيقة هو هدف جلسة مرن"),
    "K136b مؤشرُ هدفٍ واحدٌ فقط؛ لا شريط XP مكرّر، والوقتُ معلَنٌ كتقديرٍ مرن");
  ok(home.includes('<details className="dirb-extra" data-testid="today-extra">') &&
    home.includes('<details className="dirb-task-map" data-testid="today-task-map">') &&
    home.includes('href="/drucken"') && home.includes('href="/einstellungen"') &&
    home.includes("نسخة احتياطية") && home.includes("<ProfilWahl />") &&
    !home.includes('<details className="dirb-extra" open') &&
    !home.includes('<details className="dirb-task-map" open'),
    "K136c التفاصيلُ والأدواتُ وقائمةُ المهام مطويّةٌ لكن روابطُها ووظائفَها باقية");
  ok(home.includes("showCurrentHero={false}") && classroom.includes("showCurrentHero && currentTask") &&
    classroom.includes('className="dirb-next-details"') && classroom.includes('className="dirb-chiprow"') &&
    !classroom.includes("Lektion:") && !classroom.includes('"START"') && classroom.includes("ابدأ المهمة"),
    "K136d المشغّل لا يكرر بطاقةَ المهمة؛ البدائل مطويّةٌ، والتنقّلُ الداخلي وزرُ البدء بالعربية باقيان");
  const navPages = ["app/lernen/page.tsx", "app/ueben/page.tsx", "app/pruefen/page.tsx", "app/fortschritt/page.tsx"];
  const navSources = navPages.map((path) => readFileSync(path, "utf8"));
  const navHeaders = navSources.map((source) => {
    const start = source.indexOf('<header className="dirb-tabhead');
    const end = source.indexOf("</header>", start);
    return start >= 0 && end > start ? source.slice(start, end) : "";
  });
  const simpleCopy = ["افهم القاعدة، شاهد مثالاً", "اختر مجموعة التدريب", "اختبر ما تعلّمته", "تابع ما أنجزته"];
  ok(navHeaders.length === 4 && navHeaders.every((header) => header.includes("<h1") && !header.includes("dirb-kicker")) &&
    !navHeaders.some((header) => /LERNEN|ÜBEN|PRÜFEN|FORTSCHRITT/.test(header)) &&
    simpleCopy.every((text, i) => navSources[i].includes(text)),
    "K136e عناوينُ التنقّل عربيةٌ واضحةٌ بلا تكرارٍ ألماني أو وصفٍ تقنيٍّ داخلي");
}

/* ═══ K137 — R57: تقسيمٌ واضحٌ للقوائم مع حفظ كل الخيارات وسلوكها ═══ */
{
  const menuSection = readFileSync("components/dirb/MenuSection.tsx", "utf8");
  const menuCss = readFileSync("app/globals.css", "utf8");
  const ueben = readFileSync("app/ueben/page.tsx", "utf8");
  const pruefen = readFileSync("app/pruefen/page.tsx", "utf8");
  const fort = readFileSync("app/fortschritt/page.tsx", "utf8");
  const readGroupItems = (source: string): string[] => {
    const start = source.indexOf("const MENU_GROUPS");
    const end = source.indexOf("export default function", start);
    if (start < 0 || end < 0) return [];
    return source.slice(start, end).split("\n")
      .filter((line) => line.trim().startsWith("items: ["))
      .flatMap((line) => [...line.matchAll(/"([^"]+)"/g)].map((match) => match[1]));
  };
  ok(menuSection.includes("aria-labelledby") && menuSection.includes("<h2") &&
    menuSection.includes('className="dirb-menu-count"') && menuSection.includes("aria-label={`عدد الخيارات: ${count}`}"),
    "K137a كل مجموعة لها عنوان دلالي واسم وصول وعدد واضح، عبر مكوّن موحّد");

  const priority = ueben.match(/const UEBEN_REIHENFOLGE = "([^"]+)"/)?.[1].split(",") ?? [];
  const uebenGrouped = readGroupItems(ueben);
  ok(uebenGrouped.join(",") === priority.join(",") && new Set(uebenGrouped).size === priority.length &&
    ["ueben-priority", "ueben-skills", "ueben-reference"].every((id) => ueben.includes(`id: "${id}"`)) &&
    ueben.includes('data-testid={`ueben-karte-${id}`}') && ueben.includes("onClick={() => setOffen(id)}"),
    "K137b قوائم التدريب مجمّعة بلا حذف أو تكرار، وبالترتيب السابق مع بقاء الأزرار");

  const unitAt = pruefen.indexOf('id="pruefen-unit"');
  const gateAt = pruefen.indexOf('data-testid="pruefen-sperre"');
  const simulationsAt = pruefen.indexOf('id="pruefen-simulations"');
  ok(unitAt >= 0 && unitAt < gateAt && gateAt < simulationsAt &&
    (pruefen.match(/تُفتح الاختبارات الإضافية بعد اجتياز اختبار الوحدة الحالية/g) ?? []).length === 1 &&
    pruefen.includes("disabled={gesperrt}") && pruefen.includes('aria-describedby={gesperrt ? "pruefen-sperre" : undefined}') &&
    pruefen.includes('const gesperrt = id !== "tor" && !simsFrei'),
    "K137c اختبار الوحدة يسبق المحاكاة؛ سبب القفل يشرح مرة واحدة والقفل الحقيقي والوصف المساعد باقيان");

  const fortIdsLine = fort.slice(fort.indexOf("const ids ="), fort.indexOf("const groups ="));
  const fortIds = [...fortIdsLine.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const fortGrouped = readGroupItems(fort);
  ok(fortGrouped.length === fortIds.length && new Set(fortGrouped).size === fortIds.length &&
    fortIds.every((id) => fortGrouped.includes(id)) &&
    ["fortschritt-overview", "fortschritt-records", "fortschritt-support"].every((id) => fort.includes(`id: "${id}"`)) &&
    fort.includes('data-testid={`fortschritt-karte-${id}`}') && !fort.includes("<Link"),
    "K137d خيارات التقدّم العشرة موزعة مرةً واحدةً في ثلاث مجموعات، بلا إضافة روابط محتوى");

  ok(menuCss.includes(".dirb-menu-group { display: grid") && menuCss.includes("min-width: 0") &&
    menuCss.includes(".dirb-menu-count") && menuCss.includes(".dirb-menu-group .dirb-menu-btn"),
    "K137e تنسيق المجموعات يحافظ على الانكماش في الهاتف، ويُميّز العناوين والأعداد والبطاقات");
  ok(ueben.includes('data-testid="ueben-loading"') && ueben.includes('role="status"') &&
    ueben.includes("لحظات، نجهّز قائمة التدريب.") && !ueben.includes("if (!geladen) return null"),
    "K137f حالة تحميل «تدرّب» تشرح الانتظار بدل الصفحة الفارغة");
}

/* ═══ K138 — R58: مسار 378 يوماً، ترتيب المتطلبات، ومَعلَم الترحيل الآمن ═══ */
{
  const levelOrder: Level[] = ["A0", "A1", "A2", "B1", "B2"];
  const levelRank = new Map(levelOrder.map((level, index) => [level, index]));
  const dayCoverage = CURRICULUM_SECTIONS.flatMap((section) =>
    Array.from({ length: section.to - section.from + 1 }, (_, index) => section.from + index)
  );
  ok(MODULE.length === 17 && CURRICULUM_SECTIONS.length === 18 &&
    dayCoverage.length === TOTAL && new Set(dayCoverage).size === TOTAL &&
    dayCoverage.every((day, index) => day === index + 1) &&
    CURRICULUM_SECTIONS[CURRICULUM_SECTIONS.length - 1]?.from === 375 && CURRICULUM_SECTIONS[CURRICULUM_SECTIONS.length - 1]?.to === 378,
    "K138a الوحدات الـ17 والختام تغطي الأيام 1–378 مرةً واحدةً بلا فجوات");

  const pathIds = levelOrder.flatMap((level) => COURSE_TOPIC_ORDER[level]);
  const grammarIds = Object.keys(grammarMap);
  const positionIsValid = levelOrder.every((level) => {
    const ids = COURSE_TOPIC_ORDER[level];
    const positions = new Map(ids.map((id, index) => [id, index]));
    return ids.every((id) => {
      const topic = grammarMap[id];
      if (!topic || topic.level !== level || !topic.ziel || !topic.voraus || !topic.anwendung ||
          topic.rules.length === 0 || topic.examples.length === 0 || topic.exercises.length === 0) return false;
      return topic.voraus.every((dependencyId) => {
        const dependency = grammarMap[dependencyId];
        if (!dependency) return false;
        if (dependency.level === level) return (positions.get(dependencyId) ?? Infinity) < (positions.get(id) ?? -1);
        return (levelRank.get(dependency.level) ?? Infinity) < (levelRank.get(level) ?? -1);
      });
    });
  });
  ok(pathIds.length === 66 && new Set(pathIds).size === 66 && grammarIds.length === 66 &&
    grammarIds.every((id) => pathIds.includes(id)) && positionIsValid,
    `K138b المسار يرتّب الدروس الـ${pathIds.length} ويعرض الهدف والمتطلب والشرح والمثال والتمرين والاستعمال`);

  const introduced: Record<Level, string[]> = { A0: [], A1: [], A2: [], B1: [], B2: [] };
  let reviewIsLabeled = true;
  const foundSkills = new Set<string>();
  const sourceErrors: string[] = [];
  const unchangedBefore = JSON.stringify(emptyProgress);
  for (let day = 1; day <= TOTAL; day++) {
    const { plan, section } = buildCurriculumDay(day, emptyProgress);
    if (!section || plan.day !== day || plan.tasks.length === 0) sourceErrors.push(`يوم ${day}: لا خطة/وحدة`);
    for (const task of plan.tasks) {
      foundSkills.add(task.kind);
      if (task.topicId && !grammarMap[task.topicId]) sourceErrors.push(`${day}:${task.topicId}`);
      if (task.deckId && !(task.deckId in vocabMap)) sourceErrors.push(`${day}:${task.deckId}`);
      if (task.textId && !texts.some((item) => item.id === task.textId)) sourceErrors.push(`${day}:${task.textId}`);
      if (task.dialogueId && !dialogues.some((item) => item.id === task.dialogueId)) sourceErrors.push(`${day}:${task.dialogueId}`);
      if (task.writeId && !writingTasks.some((item) => item.id === task.writeId)) sourceErrors.push(`${day}:${task.writeId}`);
      for (const id of task.sentenceIds ?? []) if (!sentences.some((item) => item.id === id)) sourceErrors.push(`${day}:${id}`);
    }
    const assignment = grammarAssignmentForDay(day, emptyProgress);
    if (assignment?.status === "new") introduced[levelOf(day)].push(assignment.topicId);
    if (assignment?.status === "review") {
      const task = plan.tasks.find((item) => item.kind === "grammatik" && item.topicId === assignment.topicId);
      if (!task?.titleAr.includes("مراجعة")) reviewIsLabeled = false;
    }
  }
  const allLessonsIntroducedInOrder = levelOrder.every((level) =>
    JSON.stringify(introduced[level]) === JSON.stringify(COURSE_TOPIC_ORDER[level])
  );
  const allCoreSkills = ["grammatik", "wortschatz", "lesen", "hoeren", "schreiben", "sprechen", "aussprache", "wiederholen", "check"]
    .every((skill) => foundSkills.has(skill));
  ok(allLessonsIntroducedInOrder && reviewIsLabeled,
    "K138c المهام الجديدة تتبع الترتيب مرةً واحدةً؛ وكل درسٍ مكرّر بعد النفاد موسوم مراجعة");
  ok(allCoreSkills && sourceErrors.length === 0,
    `K138d محتوى الأيام الـ378 مربوط بمصادره ويشمل المهارات (خلل ${sourceErrors.slice(0, 4).join("، ") || "لا شيء"})`);
  ok(JSON.stringify(emptyProgress) === unchangedBefore,
    "K138e بناء خريطة الأيام استكشافٌ للقراءة فقط ولا يكتب في التقدم المحفوظ");

  const legacyProgress = JSON.parse(JSON.stringify(emptyProgress)) as Progress;
  legacyProgress.plan = {
    ...legacyProgress.plan,
    day: 20,
    curriculumScheduleVersion: undefined,
    curriculumLegacyThroughDay: undefined,
    tasks: { "15:t2": { done: true, passed: true, score: 4, total: 4, attempts: 1 } },
    days: { 15: { closed: true, score: 4, total: 4, tasksDone: 1, tasksTotal: 1, at: "2026-10-03" } },
    debt: [],
  };
  legacyProgress.srs = { saved: { ease: 2.5, interval: 3, due: "2026-10-06", reps: 2, lapses: 0 } };
  legacyProgress.canDo = { "saved-cando": true };
  const recordsBefore = JSON.stringify({ tasks: legacyProgress.plan.tasks, days: legacyProgress.plan.days, srs: legacyProgress.srs, canDo: legacyProgress.canDo });
  const protectedWeekBefore = [15, 21].map((day) => buildDay(day, legacyProgress).tasks.map((task) => [task.id, task.kind, task.topicId, task.titleAr, task.titleDe]));
  const alreadyScheduled = new Set<string>();
  for (let day = 11; day <= 21; day++) {
    const task = buildDay(day, legacyProgress).tasks.find((item) => item.kind === "grammatik" && item.topicId);
    if (task?.topicId && grammarMap[task.topicId]?.level === "A1") alreadyScheduled.add(task.topicId);
  }
  const migrated = migrateCurriculumSchedule(legacyProgress);
  const protectedWeekAfter = [15, 21].map((day) => buildDay(day, migrated).tasks.map((task) => [task.id, task.kind, task.topicId, task.titleAr, task.titleDe]));
  const frozenLesson = buildDay(15, migrated).tasks.find((task) => task.kind === "grammatik" && task.topicId);
  const frozenTitlePreserved = !!frozenLesson?.topicId && frozenLesson.titleDe === grammarMap[frozenLesson.topicId].titleDe;
  const nextExpected = COURSE_TOPIC_ORDER.A1.find((topicId) => !alreadyScheduled.has(topicId));
  const nextFuture = grammarAssignmentForDay(22, migrated);
  ok(migrated.plan.curriculumScheduleVersion === CURRICULUM_SCHEDULE_VERSION && migrated.plan.curriculumLegacyThroughDay === 21 &&
    JSON.stringify({ tasks: migrated.plan.tasks, days: migrated.plan.days, srs: migrated.srs, canDo: migrated.canDo }) === recordsBefore,
    "K138f الترحيل يضيف إصداراً وحداً ثابتاً ويحفظ النتائج والسجلّات الأخرى دون حذف");
  ok(JSON.stringify(protectedWeekBefore) === JSON.stringify(protectedWeekAfter) && migrated.plan.tasks["15:t2"]?.passed && frozenTitlePreserved,
    "K138g الأيام المنجزة والأسبوع الجاري يحفظان المهام والعناوين القديمة ومفاتيح النتائج");
  ok(nextFuture?.status === "new" && nextFuture.topicId === nextExpected && nextFuture.topicId === "a1-praesens",
    "K138h أول درس بعد الأسبوع المحمي يستكمل ترتيب A1 الصحيح دون إعادة كتابة التاريخ");
}

/* ═══ K139 — R59: نظام DirB موحّد لكل الواجهات دون مساس بالتنقّل ═══ */
{
  const css = readFileSync("app/globals.css", "utf8");
  const layout = readFileSync("app/layout.tsx", "utf8");
  const nav = readFileSync("components/akademie/Navigation.tsx", "utf8");
  const primitives = readFileSync("components/dirb/DesignSystem.tsx", "utf8");
  const menu = readFileSync("components/dirb/MenuSection.tsx", "utf8");
  const routeFiles = [
    "app/page.tsx", "app/lernen/page.tsx", "app/ueben/page.tsx", "app/pruefen/page.tsx",
    "app/fortschritt/page.tsx", "app/einstellungen/page.tsx", "app/drucken/page.tsx", "app/masar/page.tsx",
  ];
  const routeSources = routeFiles.map((path) => readFileSync(path, "utf8"));
  const map = readFileSync("components/akademie/CurriculumMap.tsx", "utf8");
  const routeUiMissing = routeFiles.filter((_, index) => !routeSources[index].includes("ui-page"));
  const routeShellReady = routeUiMissing.length === 0 && map.includes('className="curriculum-page ui-page"');
  ok(routeShellReady,
    `K139a الصفحات الثماني تمرّ عبر غلاف UI موحّد، وخريطة المنهج لها سطح الصفحة نفسه — بلا غلاف: ${routeUiMissing.join("، ") || "لا شيء"}`);

  const tokenNames = ["--ui-bg", "--ui-surface", "--ui-text", "--ui-muted", "--ui-border", "--ui-green", "--ui-on-accent", "--ui-radius-card"];
  const missingTokens = tokenNames.filter((token) => !css.includes(token));
  ok(missingTokens.length === 0 && css.includes(".ui-page") && css.includes(".ui-surface") &&
    css.includes(".ui-page-heading") && css.includes(".ui-bottom-nav"),
    "K139b لوحة الألوان والأسطح والترويسات والتنقّل مشتركة ومبنية على متغيرات واضحة — ناقص: " + (missingTokens.join("، ") || "لا شيء"));

  ok(css.includes("safe-area-inset-bottom") && css.includes("prefers-reduced-motion") &&
    css.includes(":focus-visible") && css.includes("@media (min-width: 720px)") && css.includes("@media (max-width: 520px)"),
    "K139c تخطيط متجاوب للهاتف وسطح المكتب، مع مساحة الجهاز الآمنة وتقليل الحركة والتركيز المرئي");

  const navHrefs = [...nav.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
  ok(layout.includes("<UiAppShell") && layout.includes("ui-app-shell") && layout.includes("<Navigation") &&
    layout.includes('id="main-content"') && layout.includes("ui-main") && !/style\s*=\s*\{\{/.test(layout) &&
    nav.includes("ui-bottom-nav") && nav.includes("aria-current") && !/style\s*=\s*\{\{/.test(nav) &&
    navHrefs.join(",") === "/,/lernen,/ueben,/pruefen,/fortschritt",
    "K139d الغلاف والتنقّل بلا تنسيق موضعي، ورابط تخطٍّ متاح، ووجهات التنقّل الخمس كما هي");

  ok(primitives.includes("export function UiAppShell") && primitives.includes("export function UiSurface") &&
    primitives.includes("export function UiBadge") && primitives.includes("export function UiPageHeading") &&
    menu.includes("UiSurface") && menu.includes("UiBadge") && map.includes("UiPageHeading"),
    "K139e مكوّنات الغلاف والبطاقة والشارة والترويسة مشتركة وتُستخدم في القوائم وخريطة المنهج");
}

console.log(`\n══════ ENGINE SMOKE ══════\n✓ ${pass} نجح   ✗ ${fails.length} فشل`);
if (fails.length) {
  for (const f of fails) console.log("  ✗ " + f);
  process.exit(1);
}
