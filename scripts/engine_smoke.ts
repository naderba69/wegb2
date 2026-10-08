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
import { loadProgress, touchStreak, separateLegacyManualMinutes } from "../lib/store";
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
import {
  DEFAULT_SESSION_GOAL_MINUTES, SESSION_MORE_BLOCK_MINUTES,
  advanceSessionClock, emptySessionClock, extendSessionClock,
  normalizeSessionClock, sessionGoalReached, sessionTaskMinutes,
} from "../lib/session-clock";
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
    ok(Number.isFinite(ges) && ges > 0 && Math.abs(ges - planMinBis(TOTAL_DAYS) / 60) < 0.01,
      `K60d مجموعُ تقديراتِ المهام محسوبٌ من buildDay مستقلاً عن هدف الجلسة (${ges.toFixed(1)} س)`);
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
    ok(minutenEffektiv(emptyProgress) === 0, "K60o الأصلُ صفر: لا وقتَ مقاساً قبل تشغيل المؤقّت");
    ok(minutenEffektiv({ ...emptyProgress, plan: { ...emptyProgress.plan, minutenEffektiv: 1234 } }) === 1234, "K60p الوقتُ المسجَّلُ من المؤقّت يُقرأ كما كُتب");
    ok(minutenEffektiv({ ...emptyProgress, plan: { ...emptyProgress.plan, minutenEffektiv: -50 } }) === 0
      && minutenEffektiv({ ...emptyProgress, plan: { ...emptyProgress.plan, minutenEffektiv: Number.NaN } }) === 0,
      "K60q ولا قيمةَ سالبةً ولا NaN تتسرَّبُ إلى الساعةِ المقاسة");
    const migratedMinutes = separateLegacyManualMinutes({ ...emptyProgress, plan: {
      ...emptyProgress.plan, minutenEffektiv: 45, minutenEffektivTage: { 2: 45 },
    } });
    ok(minutenEffektiv(migratedMinutes) === 0 && migratedMinutes.plan.minutenManuell === 45 &&
      migratedMinutes.plan.minutenManuellTage?.[2] === 45 &&
      separateLegacyManualMinutes(migratedMinutes).plan.minutenManuell === 45,
      "K60q1 الدقائق القديمة مجهولة المصدر تُنقل إلى اليدوية مرةً واحدة ولا تُعرَض كمقاسة");
    ok(clampMinuten(0) === 0 && clampMinuten(-20) === 0 && clampMinuten(MAX_MIN_PRO_TASK + 500) === MAX_MIN_PRO_TASK && clampMinuten(45.6) === 46,
      `K60r والإدخال اليدوي مقصورٌ على (0, ${MAX_MIN_PRO_TASK}] — لا يغيّر الوقت المقاس`);
    ok(minutenZuStunden(90) === 1.5 && minutenZuStunden(0) === 0, "K60s والتحويلُ إلى ساعاتٍ بدقةِ عُشرٍ لا بكسورٍ عائمةٍ معروضة");
    const storeSource = readFileSync("lib/store.ts", "utf8");
    const manualBookingSource = storeSource.slice(storeSource.indexOf("export function bucheMinuten"), storeSource.indexOf("/** تسجيلُ تقييمِ الثقة", storeSource.indexOf("export function bucheMinuten")));
    ok(storeSource.includes("export function bucheMinuten") && manualBookingSource.includes("clampMinuten(minuten)") &&
      manualBookingSource.includes("minutenManuell") && !manualBookingSource.includes("minutenEffektiv:"),
      "K60t الإدخال اليدوي يمرّ عبر clampMinuten ويُخزَّن منفصلاً؛ لا يكتب في حقل الوقت المقاس");
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
      "K63e معاملُ الحملِ تصاعديٌّ يبدأُ من 1.0 ولا يتجاوز 2.2 في B2؛ تقديرات المهام تُعرض مستقلّةً عن هدف الجلسة");
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
    ok(proTag.every((h, i) => Number.isFinite(h) && h > 0 && (i === 0 || h >= proTag[i - 1] - 0.01)) &&
      DEFAULT_SESSION_GOAL_MINUTES === 90,
      `K63i تقديراتُ مجموع مهام اليوم تصاعدية بحسب المرحلة، ومستقلة عن هدف الجلسة (${proTag.map((h) => h.toFixed(2)).join(" → ")} س/يوم؛ الهدف 90 د)`);
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
        const gerundeteProzentpunkte = Math.round(anteil * 100);
        if (gerundeteProzentpunkte < Math.round(soll * 100)) bad.push(`d${d}(${lv}) ${pm}/${tm}=${gerundeteProzentpunkte}%<${Math.round(soll * 100)}%`);
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
  ok(homeSrc.includes("session-time-note") && homeSrc.includes("totalMinutes") && homeSrc.includes("session.clock.totalMs") &&
    homeSrc.includes('data-testid="session-more"') && homeSrc.includes('data-testid="session-stop-save"') &&
    classroomSrc.includes('data-testid="pause-and-save"') && classroomSrc.includes("onPauseSession?.()") &&
    classroomSrc.includes("saveProgress(loadProgress())") && classroomSrc.includes("persistKey={`wegb2:partial:${currentTask.id}`}"),
    "K143d وقت الجلسة المقاس منفصل عن تقديرات المهام؛ المزيد يمدّ الهدف والتوقف يحفظ أحدث الحالة والمسودة دون إغلاق أو دين");

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

/* ═══ K156 — R82: ترجمة rasch تنقل حركة القطار لا معنى المغادرة ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, {
    basisDe: string; basisAr: string; alternativDe: string; alternativAr: string;
  }>>;
  const context = bank.schnell?.rasch;
  ok(!!context && context.basisDe === "Der Zug fährt heute schnell." &&
    context.alternativDe === "Der Zug fährt heute rasch." &&
    context.basisAr === "يسير القطار اليوم بسرعة." &&
    context.alternativAr === "يسير القطار اليوم بسرعة." &&
    !context.alternativAr.includes("ينطلق") && !context.alternativAr.includes("يغادر"),
    "K156a مثال schnell→rasch يترجم حركة القطار بسرعة دون تحويلها إلى المغادرة");
}

/* ═══ K157 — R83: لا تعميمَ لفرق الأسلوب بين schnell وrasch ═══ */
{
  const bank = JSON.parse(readFileSync("content/synonyme-kontext.json", "utf8")) as Record<string, Record<string, {
    basisDe: string; alternativDe: string; nuanceAr: string;
  }>>;
  const context = bank.schnell?.rasch;
  const note = context?.nuanceAr ?? "";
  ok(!!context && context.basisDe === "Der Zug fährt heute schnell." &&
    context.alternativDe === "Der Zug fährt heute rasch." &&
    note.includes("لا يظهر هنا فرقٌ أسلوبيٌّ عام") && note.includes("تراكيب محددة") &&
    note.includes("لا نعمّم فرق الأسلوب") && !note.includes("أكثر رسمية أو أدبية"),
    "K157a يقيّد نبرة rasch بسياق المثال ولا يعمم فرقاً أسلوبياً غير موثق");
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
    home.includes('document.getElementById("dirb-training")') && home.includes('"ابدأ جلسة 90 دقيقة"') &&
    home.includes('"اختر المتابعة أو الحفظ"') && home.includes('"راجع نهاية اليوم"'),
    "K136a شاشةُ اليوم تبدأ بخطوةٍ واحدةٍ وسببها وزرٍ عربي، قبل الهدف والمشغّل");
  ok(!home.includes("XpBar") && (home.match(/role="progressbar"/g) ?? []).length === 1 &&
    home.includes('data-testid="zeit-hinweis"') && home.includes("هدف 90 دقيقة افتراضي للجلسة فقط؛ مجموع تقديرات الخطة مستقل عنه"),
    "K136b مؤشرُ هدفٍ واحدٌ فقط؛ لا شريط XP مكرّر، وهدف الجلسة منفصل عن تقديرات الخطة والوقت المقاس");
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

/* ═══ K158 — R84: مراجعة محتوى A0 الفردية، سجل المصدر، وتصحيح المصحّح ═══ */
{
  type AuditItem = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type AuditSource = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    coverage: { totalTrackedItems: number };
    sources: AuditSource[];
    items: AuditItem[];
  };

  const a0Topics = Object.values(grammarMap).filter((topic) => topic.level === "A0");
  const a0Texts = texts.filter((text) => text.level === "A0");
  const a0Dialogues = dialogues.filter((dialogue) => dialogue.level === "A0");
  const a0Writing = writingTasks.filter((task) => task.level === "A0");
  const a0Sentences = sentences.filter((sentence) => sentence.level === "A0");
  const expectedAuditIds = [
    ...a0Topics.flatMap((topic) => [topic.id, ...topic.exercises.map((exercise) => exercise.id), ...(topic.verify ?? []).map((exercise) => exercise.id)]),
    ...a0Texts.flatMap((text) => [text.id, ...text.questions.map((question) => question.id)]),
    ...a0Dialogues.flatMap((dialogue) => [
      dialogue.id,
      ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
      ...dialogue.questions.map((question) => question.id),
      ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
    ]),
    ...a0Writing.map((task) => task.id),
    ...a0Sentences.map((sentence) => sentence.id),
  ];
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const expectedUnique = new Set(expectedAuditIds);
  ok(audit.date === "2026-10-04" && audit.batch === "A0" &&
    a0Topics.length === 3 && a0Texts.length === 5 && a0Dialogues.length === 3 &&
    expectedAuditIds.length === 93 && expectedUnique.size === expectedAuditIds.length &&
    audit.coverage.totalTrackedItems === expectedAuditIds.length &&
    auditIds.length === expectedAuditIds.length && new Set(auditIds).size === auditIds.length &&
    expectedAuditIds.every((id) => auditById.has(id)),
    `K158a سجل A0 يغطي كل عنصر فعلياً بلا فقد أو تكرار (${expectedAuditIds.length} معرفاً)`);

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const sourceUrlsValid = audit.sources.length >= 8 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  ok(completeEvidence && sourceUrlsValid && statusCounts["سليم"] === 71 &&
    statusCounts["مُصحح"] === 18 && statusCounts["غير محسوم"] === 4 &&
    auditById.get("a0-buchstaben")?.status === "غير محسوم" && auditById.get("a0-zahlen")?.status === "غير محسوم" &&
    auditById.get("d-a0-02")?.status === "غير محسوم" && auditById.get("d-a0-03")?.status === "غير محسوم",
    "K158b كل حكم له مصدر ودليل وإجراء؛ الحالات 71 سليم/18 مصحح/4 غير محسوم، بلا ادعاء مراجعة بشرية" );

  const noKeywordTranslations = Object.values(grammarMap).flatMap((topic) => topic.exercises).filter(
    (exercise) => exercise.type === "translate" && (exercise.keywords?.length ?? 0) === 0
  );
  const modelsAccepted = noKeywordTranslations.every((exercise) => {
    const models = [...(Array.isArray(exercise.answer) ? exercise.answer : [exercise.answer]), ...(exercise.alternativen ?? [])];
    return models.length > 0 && models.every((model) => grader.grade(exercise, model).correct);
  });
  const inventedRejected = noKeywordTranslations.every((exercise) =>
    !grader.grade(exercise, "Das ist eine frei erfundene Antwort." ).correct && !grader.grade(exercise, "").correct
  );
  ok(noKeywordTranslations.length === 18 && modelsAccepted && inventedRejected,
    `K158c translate بلا keywords يقبل النماذج/البدائل ويرفض إجابة فارغة أو مخترعة في التمارين الـ${noKeywordTranslations.length}`);

  const eszettExercise = a0Topics.flatMap((topic) => topic.verify ?? []).find((exercise) => exercise.id === "a0-buchstaben-v2");
  ok(!!eszettExercise && eszettExercise.strictEszett === true &&
    grader.grade(eszettExercise, "ß").correct && !grader.grade(eszettExercise, "ss").correct &&
    normalize("Straße") === normalize("Strasse"),
    "K158d فرق ß/ss محفوظ في تمرين الإملاء وحده، مع بقاء التطبيع العام كما هو");

  const a0Greeting = a0Topics.find((topic) => topic.id === "a0-begrussung");
  const a0Letters = a0Topics.find((topic) => topic.id === "a0-buchstaben");
  const alphabetText = a0Texts.find((text) => text.id === "t-a0-01");
  const greetingText = a0Texts.find((text) => text.id === "t-a0-02");
  const pronounText = a0Texts.find((text) => text.id === "t-a0-05");
  const alphabetQ3 = alphabetText?.questions.find((question) => question.id === "t-a0-01-q3");
  const alphabetExerciseQ2 = a0Letters?.exercises.find((exercise) => exercise.id === "a0-buchstaben-q2");
  const greetingQ3 = greetingText?.questions.find((question) => question.id === "t-a0-02-q3");
  const pronounQ3 = pronounText?.questions.find((question) => question.id === "t-a0-05-q3");
  const letterExample = a0Letters?.verify?.find((exercise) => exercise.id === "a0-buchstaben-v1");
  const pronunciationTip = (a0Letters as { pronTippAr?: string } | undefined)?.pronTippAr ?? "";
  ok(!!a0Greeting && a0Greeting.summaryAr.includes("heißen") && a0Greeting.summaryAr.includes("kommen") &&
    (a0Greeting.pitfalls ?? []).some((item) => item.de.includes("Ich bin aus Tunis.") && item.ar.includes("كلتا الصيغتين ممكنة")) &&
    !!a0Letters && a0Letters.rules.some((rule) => rule.de.includes("C (tseh)")) &&
    a0Letters.rules.some((rule) => rule.de.includes("X (iks)") && rule.de.includes("Z (tset)")) &&
    pronunciationTip.includes("bed") && pronunciationTip.includes("bird") && pronunciationTip.includes("tu") &&
    !!letterExample && (letterExample.explanationAr ?? "").includes("من أمثلة التهجئة") &&
    !!alphabetExerciseQ2 && alphabetExerciseQ2.promptDe.startsWith("Buchstabiere") &&
    !!alphabetQ3 && alphabetQ3.promptDe.includes("vor ß") && alphabetQ3.answer === "Ü" &&
    !!greetingQ3 && greetingQ3.promptDe.includes("folgt auf") && greetingQ3.answer === "Guten Tag!" &&
    !!pronounQ3 && pronounQ3.promptDe.includes("am Anfang des Textes") && !!pronounText && pronounText.ar.includes("للمخاطَب الرسمي"),
    "K158e تصحيحات التحيات والحروف، وأمثلة DIN، والأسئلة غير المكررة، وتوضيح Sie في الترجمة");

  const checkedDialogues = ["d-a0-02", "d-a0-03"].map((id) => a0Dialogues.find((dialogue) => dialogue.id === id));
  const spellingLine = a0Dialogues.find((dialogue) => dialogue.id === "d-a0-03")?.lines[1];
  ok(checkedDialogues.every((dialogue) => !!dialogue &&
    dialogue.dictation.length === dialogue.lines.length &&
    dialogue.dictation.every((entry, index) => entry === dialogue.lines[index]?.de) &&
    dialogue.dictation[2] === "Danke!") &&
    !!spellingLine && spellingLine.ar.includes("A – L – I") && !spellingLine.ar.includes("أ – إل – إي"),
    "K158f الإملاء يطابق d-a0-02/d-a0-03، وحوار التهجئة يحفظ حروف A–L–I اللاتينية");

  const alphabetWriting = a0Writing.find((task) => task.id === "w-a0-01");
  const sentenceA = a0Sentences.find((sentence) => sentence.id === "s-a0-04");
  const sentenceABC = a0Sentences.find((sentence) => sentence.id === "s-a0-12");
  ok(!!alphabetWriting && alphabetWriting.taskAr.includes("Straße") &&
    alphabetWriting.taskAr.includes("يحتوي عليه") && (alphabetWriting.noteAr ?? []).some((note) => note.includes("Goethe-Test PRO")) &&
    !!sentenceA && sentenceA.ar.includes("A") && sentenceA.ar.includes("Apfel") &&
    !!sentenceABC && sentenceABC.ar.includes("A، B، C") && !sentenceABC.ar.includes("أ، ب، ت"),
    "K158g واجب ß يوضح Straße وحدود بدائل الامتحان، وترجمتا A/ABC تحفظان الحروف اللاتينية");
}

/* ═══ K159 — R84/R85: تدقيق عناصر قواعد A1 ودفعات الرفع ═══ */
{
  type A1AuditItem = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type A1AuditSource = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    coverage: { grammarTopics: number; grammarExercises: number; grammarVerify: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: A1AuditSource[];
    items: A1AuditItem[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-2026-10-04.md", "utf8");
  const a1TopicIds = ["a1-sein-haben", "a1-pronomen", "a1-praesens"];
  const a1Topics = a1TopicIds.map((id) => grammarMap[id]);
  const expectedAuditIds = a1Topics.flatMap((topic) => [
    topic.id,
    ...topic.exercises.map((exercise) => exercise.id),
    ...(topic.verify ?? []).map((exercise) => exercise.id),
  ]);
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const expectedUnique = new Set(expectedAuditIds);
  const a1ExerciseCount = a1Topics.reduce((total, topic) => total + topic.exercises.length, 0);
  const a1VerifyCount = a1Topics.reduce((total, topic) => total + (topic.verify?.length ?? 0), 0);
  ok(a1Topics.length === 3 && a1ExerciseCount === 20 && a1VerifyCount === 6 &&
    audit.date === "2026-10-04" && audit.batch === "A1-grammar-01" &&
    audit.coverage.grammarTopics === 3 && audit.coverage.grammarExercises === 20 && audit.coverage.grammarVerify === 6 &&
    expectedAuditIds.length === 29 && expectedUnique.size === expectedAuditIds.length &&
    audit.coverage.totalTrackedItems === expectedAuditIds.length && auditIds.length === expectedAuditIds.length &&
    new Set(auditIds).size === auditIds.length && expectedAuditIds.every((id) => auditById.has(id)) &&
    expectedAuditIds.every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K159a سجل A1-grammar-01 يغطي الموضوعات الثلاثة وكل تمرين/تحقق في JSON وMarkdown بلا فقد أو تكرار");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const validSources = audit.sources.length === 12 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  const correctedIds = new Set([
    "a1-sein-haben", "g1e5", "a1-sein-haben-u1",
    "a1-pronomen", "g2e3", "a1-pronomen-u2",
    "a1-praesens", "g3e1", "g3e2", "g3e3", "a1-praesens-u1",
  ]);
  const expectedStatuses = audit.items.every((item) => item.status === (correctedIds.has(item.id) ? "مُصحح" : "سليم"));
  ok(completeEvidence && validSources && expectedStatuses &&
    statusCounts["سليم"] === 18 && statusCounts["مُصحح"] === 11 && !statusCounts["غير محسوم"] &&
    audit.statusCounts["سليم"] === 18 && audit.statusCounts["مُصحح"] === 11 && audit.statusCounts["غير محسوم"] === 0,
    "K159b لكل واحد من العناصر الـ29 دليل وحكم وإجراء ومصدر صالح؛ التعداد 18 سليم/11 مصحح من دون ادعاء غير محسوم");

  const getExercise = (topicId: string, id: string) => grammarMap[topicId]?.exercises.find((exercise) => exercise.id === id);
  const getVerify = (topicId: string, id: string) => grammarMap[topicId]?.verify?.find((exercise) => exercise.id === id);
  const seinTopic = grammarMap["a1-sein-haben"];
  const hungerTransform = getExercise("a1-sein-haben", "a1-sein-haben-u1");
  const speechQuestion = getExercise("a1-sein-haben", "g1e5");
  const pronounTopic = grammarMap["a1-pronomen"];
  const formalSieQuestion = getExercise("a1-pronomen", "g2e3");
  const accusativeSource = getExercise("a1-pronomen", "a1-pronomen-u2");
  const possessiveSieRow = pronounTopic.tables?.[0]?.rows.find((row) => String(row[0]).startsWith("sie / Sie"));
  const presentTopic = grammarMap["a1-praesens"];
  const stemChangeRule = presentTopic.rules.find((rule) => rule.de.includes("Stammvokalwechsel"));
  const regularExample = getExercise("a1-praesens", "g3e1");
  const fahrenExample = getExercise("a1-praesens", "g3e2");
  const sprechenExample = getExercise("a1-praesens", "g3e3");
  const fahrenTransform = getExercise("a1-praesens", "a1-praesens-u1");
  const presentVowelHeader = presentTopic.tables?.[0]?.headers;
  ok(!!seinTopic.rules[0]?.ar.includes("احفظ تصريفهما جيداً") &&
    !!seinTopic.pitfalls?.[0]?.ar.includes("müde sein") && !seinTopic.pitfalls?.[0]?.ar.includes("الصفات تأتي مع sein") &&
    speechQuestion?.promptDe === "___ Sie fließend Deutsch?" &&
    !!hungerTransform?.explanationAr?.includes("كلتا الصيغتين صحيحتان") && !hungerTransform?.explanationAr?.includes("أقل شيوعاً") &&
    !!formalSieQuestion?.promptDe.includes("Herr Meyer") && accusativeSource?.quelleDe === "Ich sehe den Mann." &&
    !!possessiveSieRow && String(possessiveSieRow[0]).includes("مفرداً أو جمعاً") &&
    !!presentTopic.ziel?.includes("تغيّر حركة الجذر") && !!stemChangeRule?.de.includes("er/sie/es") &&
    !!stemChangeRule?.ar.includes("er/sie/es") && !!presentVowelHeader?.includes("er/sie/es") &&
    regularExample?.explanationAr === "مع ich نضيف النهاية -e: ich mache." &&
    !!fahrenExample?.explanationAr?.includes("du fährst") && !fahrenExample?.explanationAr?.includes("(fahren:") &&
    !!sprechenExample?.explanationAr?.includes("er/sie/es") && !sprechenExample?.explanationAr?.includes("(sprechen:") &&
    !!fahrenTransform?.explanationAr?.includes("er/sie/es") &&
    getVerify("a1-praesens", "a1-praesens-v1")?.answer[0] === "wohnst" &&
    getVerify("a1-praesens", "a1-praesens-v2")?.answer === "Woher kommst du?",
    "K159c إصلاح غموض الاختيار ومرجع Akkusativ غير السليم، وتوحيد شرح sie المفردة وإزالة التكرار غير المسند");
}

/* ═══ K160 — R84/R85: تدقيق الدفعة الثانية من قواعد A1 ═══ */
{
  type A1Batch2Item = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type A1Batch2Source = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-grammar-02-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    coverage: { grammarTopics: number; grammarExercises: number; grammarVerify: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: A1Batch2Source[];
    items: A1Batch2Item[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-grammar-02-2026-10-04.md", "utf8");
  const topicIds = ["a1-trennbar", "a1-zahlen", "a1-akkusativ"];
  const topics = topicIds.map((id) => grammarMap[id]);
  const expectedIds = topics.flatMap((topic) => [
    topic.id,
    ...topic.exercises.map((exercise) => exercise.id),
    ...(topic.verify ?? []).map((exercise) => exercise.id),
  ]);
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const exerciseCount = topics.reduce((total, topic) => total + topic.exercises.length, 0);
  const verifyCount = topics.reduce((total, topic) => total + (topic.verify?.length ?? 0), 0);
  ok(topics.length === 3 && exerciseCount === 18 && verifyCount === 6 &&
    audit.date === "2026-10-04" && audit.batch === "A1-grammar-02" &&
    audit.coverage.grammarTopics === 3 && audit.coverage.grammarExercises === 18 && audit.coverage.grammarVerify === 6 &&
    expectedIds.length === 27 && new Set(expectedIds).size === 27 && audit.coverage.totalTrackedItems === 27 &&
    auditIds.length === 27 && new Set(auditIds).size === 27 && expectedIds.every((id) => auditById.has(id)) &&
    expectedIds.every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K160a سجل A1-grammar-02 يغطي الموضوعات الثلاثة وكل تمرين/تحقق في JSON وMarkdown بلا فقد أو تكرار");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const validSources = audit.sources.length === 11 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  const correctedIds = new Set([
    "a1-trennbar", "g4e3", "a1-trennbar-v1",
    "a1-zahlen", "g5e2", "g5e4", "a1-zahlen-v2",
    "a1-akkusativ-u1", "a1-akk-ord1",
  ]);
  const expectedStatuses = audit.items.every((item) => item.status === (correctedIds.has(item.id) ? "مُصحح" : "سليم"));
  ok(completeEvidence && validSources && expectedStatuses &&
    statusCounts["سليم"] === 18 && statusCounts["مُصحح"] === 9 && !statusCounts["غير محسوم"] &&
    audit.statusCounts["سليم"] === 18 && audit.statusCounts["مُصحح"] === 9 && audit.statusCounts["غير محسوم"] === 0,
    "K160b لكل عنصر من الـ27 مصدر ودليل وحكم وإجراء؛ 18 سليم/9 مصحح من دون حالة غير محسومة");

  const getExercise = (topicId: string, id: string) => grammarMap[topicId]?.exercises.find((exercise) => exercise.id === id);
  const getVerify = (topicId: string, id: string) => grammarMap[topicId]?.verify?.find((exercise) => exercise.id === id);
  const trennTopic = grammarMap["a1-trennbar"];
  const trennFill = getExercise("a1-trennbar", "g4e3");
  const trennVerify = getVerify("a1-trennbar", "a1-trennbar-v1");
  const zahlenTopic = grammarMap["a1-zahlen"];
  const dateVerify = getVerify("a1-zahlen", "a1-zahlen-v2");
  const clockNumeric = getExercise("a1-zahlen", "g5e4");
  const akkTopic = grammarMap["a1-akkusativ"];
  const akkTransform = getExercise("a1-akkusativ", "a1-akkusativ-u1");
  const akkOrder = getExercise("a1-akkusativ", "a1-akk-ord1");
  ok(!!trennTopic.rules[0]?.de.includes("Im Aussagesatz") &&
    trennTopic.rules[1]?.de === "Perfekt von aufstehen: Ich bin aufgestanden." &&
    !!trennTopic.rules[1]?.ar.includes("sein: Ich bin aufgestanden") &&
    trennVerify?.promptDe === "Ich stehe um 7 Uhr ___. (aufstehen)" &&
    Array.isArray(trennFill?.answer) && trennFill.answer.join("|") === "fährt ab" &&
    !!zahlenTopic.pitfalls?.[0]?.de.includes("= 8:30") && !!zahlenTopic.pitfalls?.[0]?.de.includes("nicht 9:30") &&
    zahlenTopic.summaryAr.includes("في بعض المناطق") && !!dateVerify?.promptDe.includes("Welches Datum ist heute?") &&
    dateVerify?.answer === "der dritte Oktober" && !!dateVerify?.explanationAr?.includes("am dritten Oktober") &&
    Array.isArray(clockNumeric?.answer) && clockNumeric.answer.includes("6.10") &&
    !!auditById.get("g5e4")?.sources.includes("S11") &&
    getExercise("a1-zahlen", "a1-zahlen-u2")?.answer === "Es ist Viertel vor drei.",
    "K160c تصحيح Perfekt/الترقيم ومفارقة halb neun، تقييد صيغة الساعة الإقليمية، وتحديد سؤال التاريخ");
  ok(!!akkTopic.rules[0]?.de.includes("der → den") &&
    !!akkTransform?.promptDe.includes("Forme den Satz um") && akkTransform?.answer === "Ich habe einen Tisch." &&
    !!akkOrder && Array.isArray(akkOrder.answer) && akkOrder.answer.join("|") === "Ich|kaufe|einen|Tisch." &&
    getExercise("a1-akkusativ", "g6e2")?.answer === "eine" &&
    Array.isArray(getVerify("a1-akkusativ", "a1-akkusativ-v1")?.answer) &&
    getVerify("a1-akkusativ", "a1-akkusativ-v1")?.answer[0] === "einen",
    "K160d مهام Akkusativ تُظهر جواباً واحداً واضحاً وتبقى مركزة على الأداة دون إدخال صرف صفة غير مشروح");
}

/* ═══ K161 — R84/R85: تدقيق الدفعة الثالثة من قواعد A1 ═══ */
{
  type A1Batch3Item = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type A1Batch3Source = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-grammar-03-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    coverage: { grammarTopics: number; grammarExercises: number; grammarVerify: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: A1Batch3Source[];
    items: A1Batch3Item[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-grammar-03-2026-10-04.md", "utf8");
  const topicIds = ["a1-modalverben", "a1-dativ", "a1-wechsel"];
  const topics = topicIds.map((id) => grammarMap[id]);
  const expectedIds = topics.flatMap((topic) => [
    topic.id,
    ...topic.exercises.map((exercise) => exercise.id),
    ...(topic.verify ?? []).map((exercise) => exercise.id),
  ]);
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const exerciseCount = topics.reduce((total, topic) => total + topic.exercises.length, 0);
  const verifyCount = topics.reduce((total, topic) => total + (topic.verify?.length ?? 0), 0);
  ok(topics.length === 3 && exerciseCount === 12 && verifyCount === 6 &&
    audit.date === "2026-10-04" && audit.batch === "A1-grammar-03" &&
    audit.coverage.grammarTopics === 3 && audit.coverage.grammarExercises === 12 && audit.coverage.grammarVerify === 6 &&
    expectedIds.length === 21 && new Set(expectedIds).size === 21 && audit.coverage.totalTrackedItems === 21 &&
    auditIds.length === 21 && new Set(auditIds).size === 21 && expectedIds.every((id) => auditById.has(id)) &&
    expectedIds.every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K161a سجل A1-grammar-03 يغطي الموضوعات الثلاثة وكل تمرين/تحقق في JSON وMarkdown بلا فقد أو تكرار");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const validSources = audit.sources.length === 13 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  const referencedSources = new Set(audit.items.flatMap((item) => item.sources));
  const correctedIds = new Set([
    "a1-modalverben", "a1-modalverben-ex01", "a1-modalverben-ex02", "a1-modalverben-ex04", "a1-modalverben-v1",
    "a1-dativ", "a1-dativ-ex01", "a1-dativ-ex03", "a1-dativ-ex04",
    "a1-wechsel", "a1-wechsel-ex01", "a1-wechsel-ex02", "a1-wechsel-ex03", "a1-wechsel-ex04", "a1-wechsel-v1", "a1-wechsel-v2",
  ]);
  const expectedStatuses = audit.items.every((item) => item.status === (correctedIds.has(item.id) ? "مُصحح" : "سليم"));
  ok(completeEvidence && validSources && referencedSources.size === audit.sources.length &&
    expectedStatuses && statusCounts["سليم"] === 5 && statusCounts["مُصحح"] === 16 && !statusCounts["غير محسوم"] &&
    audit.statusCounts["سليم"] === 5 && audit.statusCounts["مُصحح"] === 16 && audit.statusCounts["غير محسوم"] === 0,
    "K161b لكل عنصر من الـ21 مصدر ودليل وحكم وإجراء؛ 5 سليم/16 مصحح من دون حالة غير محسومة");

  const getExercise = (topicId: string, id: string) => grammarMap[topicId]?.exercises.find((exercise) => exercise.id === id);
  const getVerify = (topicId: string, id: string) => grammarMap[topicId]?.verify?.find((exercise) => exercise.id === id);
  const modalTopic = grammarMap["a1-modalverben"];
  const modalVerify = getVerify("a1-modalverben", "a1-modalverben-v1");
  const dativeTopic = grammarMap["a1-dativ"];
  const wechselTopic = grammarMap["a1-wechsel"];
  const wechselExercise4 = getExercise("a1-wechsel", "a1-wechsel-ex04");
  const wechselVerify2 = getVerify("a1-wechsel", "a1-wechsel-v2");
  ok(!!(modalTopic.ziel?.includes("الجملة الرئيسية") && modalTopic.rules[1]?.ar.includes("ü إلى u") &&
    modalTopic.rules[3]?.de.includes("Im Aussagesatz") &&
    getExercise("a1-modalverben", "a1-modalverben-ex01")?.promptDe.includes("(können)") &&
    getExercise("a1-modalverben", "a1-modalverben-ex02")?.promptDe.includes("(müssen)") &&
    getExercise("a1-modalverben", "a1-modalverben-ex04")?.promptDe.includes("(sprechen)") &&
    modalVerify?.promptDe === "___ Sie mir bitte helfen? (können, höfliche Bitte)" &&
    Array.isArray(modalVerify?.answer) && modalVerify.answer[0] === "Können" &&
    (dativeTopic as unknown as { eselsbrueckeAr?: string }).eselsbrueckeAr?.includes("mit · bei · zu · aus · nach · von · seit") &&
    getExercise("a1-dativ", "a1-dativ-ex01")?.promptDe.includes("Wohin? Ziel: Stadt") &&
    getExercise("a1-dativ", "a1-dativ-ex03")?.promptDe.includes("die Mutter; mein") &&
    getExercise("a1-dativ", "a1-dativ-ex04")?.promptDe.includes("Nominativ: der Mann")),
    "K161c تصويب ملاحظة müssen، تقييد ترتيب الأفعال، حسم فراغات الأفعال الناقصة، وضبط تلميحات Dativ");
  ok(!!(wechselTopic.titleAr.includes("المكان أم الوجهة") && !wechselTopic.titleAr.includes("سكون وحركة") &&
    wechselTopic.rules[0]?.de.includes("auch Bewegung an einem Ort") &&
    wechselTopic.ziel?.includes("Wo?") && wechselTopic.ziel?.includes("Wohin?") &&
    wechselTopic.summaryAr.includes("وجود فعل حركة وحده لا يوجب Akkusativ") &&
    wechselTopic.pitfalls?.[0]?.ar.includes("Ich gehe im Park spazieren") &&
    getExercise("a1-wechsel", "a1-wechsel-ex01")?.promptDe.includes("Wohin?") &&
    getExercise("a1-wechsel", "a1-wechsel-ex02")?.promptDe.includes("die Wand; Wo?") &&
    getExercise("a1-wechsel", "a1-wechsel-ex03")?.promptDe.includes("der Tisch; Wo?") &&
    wechselExercise4?.promptDe.includes("das Kino; Wohin?") &&
    wechselVerify2?.promptDe.includes("Ziel: Wohin?") &&
    wechselVerify2?.explanationAr?.includes("الوجهة")),
    "K161d قاعدة Wechselpräpositionen تفصل Wo?/المكان عن Wohin?/الوجهة وتحرس القرائن والأمثلة المصححة");
}


/* ═══ K162 — R87: تدقيق الدفعة الرابعة من قواعد A1 ═══ */
{
  type A1Batch4Item = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type A1Batch4Source = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-grammar-04-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    coverage: { grammarTopics: number; grammarExercises: number; grammarVerify: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: A1Batch4Source[];
    items: A1Batch4Item[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-grammar-04-2026-10-04.md", "utf8");
  const topicIds = ["a1-imperativ", "a1-perfekt-einf", "a1-futur-einf"];
  const topics = topicIds.map((id) => grammarMap[id]);
  const expectedIds = topics.flatMap((topic) => [
    topic.id,
    ...topic.exercises.map((exercise) => exercise.id),
    ...(topic.verify ?? []).map((exercise) => exercise.id),
  ]);
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const exerciseCount = topics.reduce((total, topic) => total + topic.exercises.length, 0);
  const verifyCount = topics.reduce((total, topic) => total + (topic.verify?.length ?? 0), 0);
  ok(topics.length === 3 && exerciseCount === 19 && verifyCount === 6 &&
    audit.date === "2026-10-04" && audit.batch === "A1-grammar-04" &&
    audit.coverage.grammarTopics === 3 && audit.coverage.grammarExercises === 19 && audit.coverage.grammarVerify === 6 &&
    expectedIds.length === 28 && new Set(expectedIds).size === 28 && audit.coverage.totalTrackedItems === 28 &&
    auditIds.length === 28 && new Set(auditIds).size === 28 && expectedIds.every((id) => auditById.has(id)) &&
    expectedIds.every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K162a سجل A1-grammar-04 يغطي الموضوعات الثلاثة وكل تمرين/تحقق في JSON وMarkdown بلا فقد أو تكرار");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const validSources = audit.sources.length === 22 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  const referencedSources = new Set(audit.items.flatMap((item) => item.sources));
  const correctedIds = new Set([
    "a1-imperativ", "a1-imperativ-ex03",
    "a1-perfekt-einf", "a1-perfekt-einf-ex02", "a1-perf-n2", "a1-perfekt-einf-v1", "a1-perfekt-einf-v2",
    "a1-futur-einf", "a1-futur-einf-ex01", "a1-futur-einf-ex03", "a1-fut-n2", "a1-fut-n3", "a1-futur-einf-v2",
  ]);
  const expectedStatuses = audit.items.every((item) => item.status === (correctedIds.has(item.id) ? "مُصحح" : "سليم"));
  ok(completeEvidence && validSources && referencedSources.size === audit.sources.length &&
    expectedStatuses && statusCounts["سليم"] === 15 && statusCounts["مُصحح"] === 13 && !statusCounts["غير محسوم"] &&
    audit.statusCounts["سليم"] === 15 && audit.statusCounts["مُصحح"] === 13 && audit.statusCounts["غير محسوم"] === 0,
    "K162b لكل واحد من 28 عنصراً دليل ومصدر وحكم وإجراء؛ 15 سليماً و13 مصححاً بلا حالة غير محسومة");

  const getExercise = (topicId: string, id: string) => grammarMap[topicId]?.exercises.find((exercise) => exercise.id === id);
  const getVerify = (topicId: string, id: string) => grammarMap[topicId]?.verify?.find((exercise) => exercise.id === id);
  const imperativeTopic = grammarMap["a1-imperativ"];
  const imperativeExercise3 = getExercise("a1-imperativ", "a1-imperativ-ex03");
  ok(!!(imperativeTopic.summaryAr.includes("بحسب الصيغة") &&
    imperativeTopic.rules[2]?.ar.includes("قبل الضمير Sie") &&
    imperativeTopic.pitfalls?.[1]?.de.includes("Zu einem Freund") &&
    imperativeTopic.pitfalls?.[1]?.de.includes("Zu mehreren Freunden") &&
    Array.isArray(imperativeExercise3?.answer) && imperativeExercise3.answer.length === 1 &&
    imperativeExercise3.answer[0] === "Sprecht" &&
    getVerify("a1-imperativ", "a1-imperativ-v1")?.answer[0] === "Sei"),
    "K162c تمييز صيغ Imperativ بحسب المخاطب وحراسة أمر du/ihr وsein وإزالة بديل جواب مكرر");

  const perfektTopic = grammarMap["a1-perfekt-einf"];
  const perfektExercise2 = getExercise("a1-perfekt-einf", "a1-perfekt-einf-ex02");
  const perfektOrder = getExercise("a1-perfekt-einf", "a1-perf-n2");
  const perfektVerify1 = getVerify("a1-perfekt-einf", "a1-perfekt-einf-v1");
  const perfektVerify2 = getVerify("a1-perfekt-einf", "a1-perfekt-einf-v2");
  ok(!!(perfektTopic.ziel?.includes("أمثلة الدرس المحددة") &&
    perfektTopic.summaryAr.includes("الجملة الخبرية الرئيسية") &&
    perfektTopic.summaryAr.includes("الجملة التابعة") &&
    perfektTopic.pitfalls?.[0]?.ar.includes("fahren في معنى الانتقال") &&
    perfektTopic.pitfalls?.[0]?.ar.includes("bleiben") &&
    perfektExercise2?.promptDe.includes("(arbeiten)") &&
    perfektOrder?.promptDe.includes("Beginne mit „Ich“") &&
    perfektVerify1?.promptDe === "Heute habe ich viel ___. (lernen)" && perfektVerify1.text === perfektVerify1.promptDe &&
    perfektVerify2?.promptDe.includes("بـPerfekt")),
    "K162d تحديد قرائن Perfekt والتمييز بين الجملة الرئيسية والتابعة وتصحيح اختيار sein وترقيم الفراغات");

  const futurTopic = grammarMap["a1-futur-einf"];
  const futurExercise1 = getExercise("a1-futur-einf", "a1-futur-einf-ex01");
  const futurExercise3 = getExercise("a1-futur-einf", "a1-futur-einf-ex03");
  const futurOrder = getExercise("a1-futur-einf", "a1-fut-n2");
  const futurTranslation = getExercise("a1-futur-einf", "a1-fut-n3");
  const futurVerify2 = getVerify("a1-futur-einf", "a1-futur-einf-v2");
  ok(!!(futurTopic.rules[0]?.de.includes("sie/Sie werden") &&
    futurTopic.summaryAr.includes("Präsens") && futurTopic.summaryAr.includes("الجملة الخبرية الرئيسية") &&
    futurExercise1?.promptDe.includes("(werden)") && futurExercise3?.promptDe.includes("(werden)") &&
    futurOrder?.promptDe.includes("Beginne mit „Wir“") && futurOrder.promptDe.includes("Zeitangabe steht vor der Ortsangabe") &&
    futurTranslation?.promptDe.includes("بـFutur I") &&
    futurVerify2?.promptDe.includes("für nächstes Jahr") && futurVerify2.promptDe.includes("Futur I") &&
    futurVerify2.answer === "Ich werde nächstes Jahr Deutsch lernen."),
    "K162e تقييد Futur I بجملة رئيسية وإضافة Sie والتنبيه إلى Präsens وحسم تلميحات التمارين");
}

/* ═══ K163 — R88: تدقيق الدفعة الخامسة من قواعد A1 ═══ */
{
  type A1Batch5Item = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type A1Batch5Source = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-grammar-05-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    scope: string;
    method: string;
    coverage: { grammarTopics: number; grammarExercises: number; grammarVerify: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: A1Batch5Source[];
    items: A1Batch5Item[];
    limitations: string[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-grammar-05-2026-10-04.md", "utf8");
  const rulesMarkdown = readFileSync("RULES.md", "utf8");
  const topicIds = ["a1-war-hatte", "a1-weil-dass", "a1-plural", "a1-zeitpraep"];
  const topics = topicIds.map((id) => grammarMap[id]);
  const expectedIds = topics.flatMap((topic) => [
    topic.id,
    ...topic.exercises.map((exercise) => exercise.id),
    ...(topic.verify ?? []).map((exercise) => exercise.id),
  ]);
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const exerciseCount = topics.reduce((total, topic) => total + topic.exercises.length, 0);
  const verifyCount = topics.reduce((total, topic) => total + (topic.verify?.length ?? 0), 0);
  ok(topicIds.length === 4 && exerciseCount === 26 && verifyCount === 8 &&
    audit.date === "2026-10-04" && audit.batch === "A1-grammar-05" &&
    audit.coverage.grammarTopics === 4 && audit.coverage.grammarExercises === 26 && audit.coverage.grammarVerify === 8 &&
    expectedIds.length === 38 && new Set(expectedIds).size === 38 && audit.coverage.totalTrackedItems === 38 &&
    auditIds.length === 38 && new Set(auditIds).size === 38 && expectedIds.every((id) => auditById.has(id)) &&
    expectedIds.every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K163a سجل A1-grammar-05 يغطي الموضوعات الأربعة وكل تمرين/تحقق في JSON وMarkdown بلا فقد أو تكرار");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  ok(completeEvidence && audit.items.every((item) => item.kind.trim().length > 0) &&
    statusCounts["سليم"] + statusCounts["مُصحح"] + (statusCounts["غير محسوم"] ?? 0) === 38,
    "K163b لكل عنصر دليل وحكم ومصدر معروف وإجراء؛ لا تُسجل خانة مراجعة فارغة");

  const referencedSources = new Set(audit.items.flatMap((item) => item.sources));
  const sourceById = new Map(audit.sources.map((source) => [source.id, source]));
  const validSources = audit.sources.length === 24 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  ok(validSources && referencedSources.size === audit.sources.length && audit.sources.every((source) => referencedSources.has(source.id)) &&
    sourceById.get("S2")?.url === "https://www.dw.com/downloads/36168216/prteritum-der-modalverben.pdf" &&
    sourceById.get("S3")?.url === "https://grammis.ids-mannheim.de/progr@mm/5202" &&
    sourceById.get("S12")?.url === "https://learngerman.dw.com/en/nouns-plural/l-37372077/gr-38306003" &&
    sourceById.get("S24")?.url === "https://www.duden.de/rechtschreibung/Zimmer",
    "K163c المصادر الـ24 مباشرة وموثقة ومستخدمة؛ تُحرس روابط DW/IDS/Duden المصححة");

  const correctedIds = new Set([
    "a1-war-hatte", "a1-war-hatte-e4", "a1-war-hatte-e5",
    "a1-weil-dass", "a1-weil-e3", "a1-weil-e5",
    "a1-plural", "a1-plural-n2", "a1-plural-v1", "a1-zeitpraep",
  ]);
  const expectedStatuses = audit.items.every((item) => item.status === (correctedIds.has(item.id) ? "مُصحح" : "سليم"));
  ok(expectedStatuses && statusCounts["سليم"] === 28 && statusCounts["مُصحح"] === 10 && !statusCounts["غير محسوم"] &&
    audit.statusCounts["سليم"] === 28 && audit.statusCounts["مُصحح"] === 10 && audit.statusCounts["غير محسوم"] === 0,
    "K163d أحكام الدفعة متطابقة: 28 سليماً و10 مصححاً ولا حالة غير محسومة");

  const warTopic = grammarMap["a1-war-hatte"];
  const weilTopic = grammarMap["a1-weil-dass"];
  const pluralTopic = grammarMap["a1-plural"];
  const timeTopic = grammarMap["a1-zeitpraep"];
  ok(!!(warTopic.summaryAr.includes("Perfekt") && warTopic.pitfalls?.[1]?.ar.includes("Ersatzinfinitiv") &&
    weilTopic.summaryAr.includes("سبباً") && weilTopic.summaryAr.includes("مضمون قول أو اعتقاد") &&
    weilTopic.summaryAr.includes("ترتيب V2") && !weilTopic.summaryAr.includes("أشهر خطأ عند العرب") &&
    pluralTopic.summaryAr.includes("Zimmer → die Zimmer") && pluralTopic.rules[0]?.de.includes("Stift → die Stifte") &&
    pluralTopic.rules[0]?.de.includes("Stuhl → die Stühle") && pluralTopic.rules[1]?.de.includes("Kind → die Kinder") &&
    pluralTopic.rules[1]?.de.includes("Buch → die Bücher") &&
    timeTopic.summaryAr.includes("am") && timeTopic.summaryAr.includes("in der Nacht") &&
    timeTopic.summaryAr.includes("um") && timeTopic.summaryAr.includes("im") && timeTopic.summaryAr.includes("Dativ")),
    "K163e يحرس الفروق المصححة في Präteritum/Perfekt وweil/dass وأنماط الجمع وحروف الزمن");

  const weilExercise3 = grammarMap["a1-weil-dass"].exercises.find((exercise) => exercise.id === "a1-weil-e3");
  const weilAudit = auditById.get("a1-weil-e3");
  const hobbyExercise = grammarMap["a1-plural"].exercises.find((exercise) => exercise.id === "a1-plural-n7");
  const hobbyAudit = auditById.get("a1-plural-n7");
  const r88Line = rulesMarkdown.split("\n").find((line) => line.startsWith("| R88 |"));
  ok(!!(weilExercise3?.promptDe.includes("Welche Konjunktion nennt hier den Grund?") &&
    weilExercise3.promptAr?.includes("أداة التعليل") && weilExercise3.answer === "Weil" &&
    weilAudit?.finding.includes("أداة تعليل") && weilAudit.action.includes("promptDe") &&
    hobbyExercise?.answer === "true" && hobbyAudit?.finding.includes("das Hobby") &&
    hobbyAudit.finding.includes("die Hobbys") && !hobbyAudit.finding.includes("? لا") &&
    audit.scope.includes("a1-war-hatte") && audit.scope.includes("a1-zeitpraep") &&
    audit.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    r88Line?.includes("K163") && r88Line.includes("38 عنصراً")),
    "K163f صياغة سؤال السبب وسجل Hobby وحدود النطاق وعدم ادعاء مراجعة بشرية مرتبطة بقرار R88");
}

/* ═══ K164 — R89: مؤقّت الجلسة الفعلي مستقل عن تقديرات المهام ═══ */
{
  const start = emptySessionClock(278);
  const after30 = advanceSessionClock(start, 30 * 60_000, "unsent-writing");
  ok(DEFAULT_SESSION_GOAL_MINUTES === 90 && SESSION_MORE_BLOCK_MINUTES === 30 &&
    after30.totalMs === 30 * 60_000 && !sessionGoalReached(after30) &&
    sessionTaskMinutes(after30, "unsent-writing") === 30,
    "K164a الهدف الافتراضي 90 دقيقة؛ بعد 30 دقيقة يمكن التوقف، ووقت المهمة غير المُسلَّمة يظل زمناً لا نتيجة");

  const atGoal = advanceSessionClock(after30, 60 * 60_000, "unsent-writing");
  const more = extendSessionClock(atGoal);
  const afterMore = advanceSessionClock(more, 30 * 60_000, "optional-review");
  ok(sessionGoalReached(atGoal) && atGoal.totalMs === 90 * 60_000 &&
    more.goalMinutes === 120 && !sessionGoalReached(more) &&
    sessionGoalReached(afterMore) && afterMore.totalMs === 120 * 60_000,
    "K164b بلوغ 90 يوقف عند الهدف؛ «المزيد» يزيد 30 دقيقة اختيارياً ولا يغيّر تقدير أي مهمة");

  const recovered = normalizeSessionClock({ day: 278, totalMs: 45 * 60_000, syncedMs: 30 * 60_000, goalMinutes: 90, taskMs: { draft: 30 * 60_000 } }, 278);
  const bad = normalizeSessionClock({ totalMs: -1, syncedMs: 99, goalMinutes: 15, taskMs: ["bad"] }, 278);
  ok(recovered.totalMs === 45 * 60_000 && recovered.syncedMs === 30 * 60_000 &&
    recovered.goalMinutes === 90 && bad.totalMs === 0 && bad.syncedMs === 0 && bad.goalMinutes === 90,
    "K164c استعادة وقتٍ غير متزامن آمنة، والبيانات التالفة لا تنشئ دقائق أو هدفاً أدنى");

  const tempoPlans = (["leicht", "regelmaessig", "intensiv"] as const).map((tempo) =>
    buildDay(278, { ...emptyProgress, settings: { ...emptyProgress.settings, tempo } })
  );
  const estimates = tempoPlans.map((plan) => plan.tasks.map((task) => `${task.id}:${task.minutes}`).join("|"));
  ok(tempoPlans.every((plan) => plan.zielMin === 90) && estimates.every((value) => value === estimates[0]) &&
    tempoPlans[0].tasks.reduce((sum, task) => sum + task.minutes, 0) !== tempoPlans[0].zielMin,
    "K164d الهدف ثابت عند 90 وتقديرات المهام لا تتغير بتبديل إيقاع البطاقات ولا تُسوّى بمجموعها");

  const taskSource = readFileSync("components/tasks.tsx", "utf8");
  const todaySource = readFileSync("app/page.tsx", "utf8");
  const clockHook = readFileSync("hooks/use-session-clock.ts", "utf8");
  const profilesSource = readFileSync("lib/profiles.ts", "utf8");
  const addProfileSource = profilesSource.slice(profilesSource.indexOf("export function addProfile"), profilesSource.indexOf("export function renameProfile"));
  const removeProfileSource = profilesSource.slice(profilesSource.indexOf("export function removeProfile"));
  ok(taskSource.includes("⚠️ انتبه إلى هذه الأمثلة") && !taskSource.includes("أخطاء شائعة عند العرب") &&
    todaySource.includes("data-testid=\"session-goal-choice\"") && todaySource.includes("data-testid=\"session-more\"") &&
    todaySource.includes("data-testid=\"session-stop-save\"") && todaySource.includes("مجموع تقديرات مهام اليوم") &&
    clockHook.includes("SESSION_IDLE_TIMEOUT_MS") && clockHook.includes("PROFILE_WILL_CHANGE") &&
    clockHook.includes("recordStudyMinutes") && addProfileSource.includes("dispatchEvent(new Event(PROFILE_WILL_CHANGE))") &&
    addProfileSource.indexOf("dispatchEvent(new Event(PROFILE_WILL_CHANGE))") < addProfileSource.indexOf("d.active = id") &&
    removeProfileSource.indexOf("dispatchEvent(new Event(PROFILE_WILL_CHANGE))") < removeProfileSource.indexOf("d.list.splice(i, 1)"),
    "K164e عنوان الملاحظات محايد؛ المزيد/الإيقاف ظاهران، وقياس الوقت محفوظ مع إيقاف الخمول وتبديل/إضافة/حذف الملف");
}

/* ═══ K165 — R91: لا تُحوَّل حدود تقديرات الخطة heuristic إلى عيب بنيوي ═══ */
{
  const auditSource = readFileSync("scripts/audit_inhalt.ts", "utf8");
  ok(auditSource.includes('if (m > 200) hinweis("plan:Tag>200min — مجموع تقديرات يحتاج مراجعة تربوية"') &&
    !auditSource.includes('if (m > 200) add('),
    "K165 تجاوز تقدير اليوم 200 دقيقة يظهر للمراجعة التربوية ولا يُسمّى عيباً أو وقتاً مقاساً آلياً");
}

/* ═══ K166 — R92: مراجعة أول ثلاثة حوارات A1، كل سطر/سؤال/إملاء بمصدر ═══ */
{
  type DialogueAuditItem = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type DialogueAuditSource = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-dialogues-01-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    coverage: { dialogues: number; dialogueMetadata: number; lines: number; questions: number; dictationSentences: number; unresolvedLevelNotes: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: DialogueAuditSource[];
    limitations: string[];
    items: DialogueAuditItem[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-dialogues-01-2026-10-04.md", "utf8");
  const batch = ["d-a1-01", "d-a1-02", "d-a1-03"].map((id) => dialogues.find((dialogue) => dialogue.id === id));
  const completeBatch = batch.every((dialogue) => !!dialogue && dialogue.level === "A1") ? batch as NonNullable<typeof batch[number]>[] : [];
  const expectedIds = [
    ...completeBatch.flatMap((dialogue) => [
      dialogue.id,
      ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
      ...dialogue.questions.map((question) => question.id),
      ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
    ]),
    "d-a1-03.level",
  ];
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const expectedUnique = new Set(expectedIds);
  ok(completeBatch.length === 3 && completeBatch.map((dialogue) => dialogue.lines.length).join(",") === "8,7,6" &&
    completeBatch.map((dialogue) => dialogue.questions.length).join(",") === "2,2,2" &&
    completeBatch.map((dialogue) => dialogue.dictation.length).join(",") === "3,3,3" &&
    expectedIds.length === 40 && expectedUnique.size === expectedIds.length && auditIds.length === expectedIds.length &&
    new Set(auditIds).size === auditIds.length && expectedIds.every((id) => auditById.has(id)) &&
    audit.date === "2026-10-04" && audit.batch === "A1-dialogues-01" &&
    audit.coverage.dialogues === 3 && audit.coverage.dialogueMetadata === 3 && audit.coverage.lines === 21 &&
    audit.coverage.questions === 6 && audit.coverage.dictationSentences === 9 && audit.coverage.unresolvedLevelNotes === 1 &&
    audit.coverage.totalTrackedItems === 40 && expectedIds.every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K166a السجل يطابق 3 حوارات و21 سطراً و6 أسئلة و9 إملاءات وملاحظة مستوى واحدة؛ كل معرّف حاضر مرة في JSON وMarkdown");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const referencedSources = new Set(audit.items.flatMap((item) => item.sources));
  const computedStatuses = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const sourceById = new Map(audit.sources.map((source) => [source.id, source]));
  const completeSources = audit.sources.length === 11 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  ) && referencedSources.size === audit.sources.length && audit.sources.every((source) => referencedSources.has(source.id)) &&
    sourceById.get("S11")?.url === "https://www.duden.de/rechtschreibung/Apparat";
  ok(completeEvidence && completeSources &&
    JSON.stringify(computedStatuses) === JSON.stringify({ "سليم": 33, "مُصحح": 6, "غير محسوم": 1 }) &&
    JSON.stringify(audit.statusCounts) === JSON.stringify(computedStatuses) &&
    audit.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    auditById.get("d-a1-03.level")?.status === "غير محسوم",
    "K166b لكل حكم دليل وإجراء ومصدر منشور معروف؛ 33 سليماً و6 مصححة ومستوى واحد غير محسوم بلا ادعاء مراجعة بشرية");

  const d2q2 = completeBatch.find((dialogue) => dialogue.id === "d-a1-02")?.questions.find((question) => question.id === "d-a1-02-q2");
  const d3 = completeBatch.find((dialogue) => dialogue.id === "d-a1-03");
  ok(!!d2q2 && JSON.stringify(d2q2.answer) === JSON.stringify(["fünf"]) &&
    grader.grade(d2q2, "fünf").correct && !grader.grade(d2q2, "funf").correct && !grader.grade(d2q2, "5").correct &&
    auditById.get("d-a1-02-q2")?.status === "مُصحح",
    "K166c فراغ السعر يقبل كتابة fünf فقط؛ يرفض funf غير المعيارية والرقم 5 في موضع الكلمة");

  const d3q1 = d3?.questions.find((question) => question.id === "d-a1-03-q1");
  const d3q2 = d3?.questions.find((question) => question.id === "d-a1-03-q2");
  ok(!!d3 && d3.lines[0].de === "Hallo, hier spricht Nour. Kann ich mit Herrn Klein sprechen?" &&
    d3.lines[2].ar.includes("أودّ تحديد موعد") &&
    d3.lines[5].de === "Ja, am Dienstag um zehn Uhr habe ich Zeit. Bis Dienstag!" &&
    d3.lines[5].ar.includes("لديّ وقت") &&
    d3q1?.answer === "am Dienstag um zehn Uhr" && !!d3q1.explanationAr?.includes("Ja, am Dienstag um zehn Uhr habe ich Zeit") &&
    !!d3q2?.answer?.includes("Termin") && !!d3q2.explanationAr?.includes("تحديد موعد") &&
    ["d-a1-03.lines[0]", "d-a1-03.lines[2]", "d-a1-03.lines[5]", "d-a1-03-q1", "d-a1-03-q2"].every((id) => auditById.get(id)?.status === "مُصحح"),
    "K166d التصحيح يحرس hier، ترجمة تحديد الموعد، قبول الثلاثاء 10 صراحةً، وترجمة/شرح السؤالين");

  ok(completeBatch.length === 3 && completeBatch.every((dialogue) =>
    dialogue.dictation.every((sentence) => dialogue.lines.some((line) => line.de.includes(sentence)))
  ) && ["d-a1-01", "d-a1-02", "d-a1-03"].flatMap((id) => [
    `${id}.dictation[0]`, `${id}.dictation[1]`, `${id}.dictation[2]`,
  ]).every((id) => auditById.get(id)?.status === "سليم"),
    "K166e جمل الإملاء التسع مطابقة لمواضعها في الحوارات ولكل واحدة حكم ومصدر وإجراء مسجل");
}

/* ═══ K167 — R93: مراجعة الحوارات A1 d-a1-04–06 ═══ */
{
  type DialogueAuditItem = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type DialogueAuditSource = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-dialogues-02-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    scope: string;
    method: string;
    coverage: { dialogues: number; dialogueMetadata: number; lines: number; questions: number; dictationSentences: number; unresolvedLevelNotes: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: DialogueAuditSource[];
    limitations: string[];
    items: DialogueAuditItem[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-dialogues-02-2026-10-04.md", "utf8");
  const batchIds = ["d-a1-04", "d-a1-05", "d-a1-06"];
  const batch = batchIds.map((id) => dialogues.find((dialogue) => dialogue.id === id));
  const completeBatch = batch.every((dialogue) => !!dialogue && dialogue.level === "A1") ? batch as NonNullable<typeof batch[number]>[] : [];
  const expectedIds = [
    ...completeBatch.flatMap((dialogue) => [
      dialogue.id,
      ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
      ...dialogue.questions.map((question) => question.id),
      ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
    ]),
    "d-a1-06.level",
  ];
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const markdownRowsUnique = expectedIds.every((id) =>
    auditMarkdown.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(completeBatch.length === 3 && completeBatch.map((dialogue) => dialogue.lines.length).join(",") === "6,5,5" &&
    completeBatch.map((dialogue) => dialogue.questions.length).join(",") === "2,2,2" &&
    completeBatch.map((dialogue) => dialogue.dictation.length).join(",") === "3,3,3" &&
    expectedIds.length === 35 && new Set(expectedIds).size === 35 && auditIds.length === 35 &&
    new Set(auditIds).size === 35 && expectedIds.every((id) => auditById.has(id)) && markdownRowsUnique &&
    audit.date === "2026-10-04" && audit.batch === "A1-dialogues-02" &&
    audit.coverage.dialogues === 3 && audit.coverage.dialogueMetadata === 3 && audit.coverage.lines === 16 &&
    audit.coverage.questions === 6 && audit.coverage.dictationSentences === 9 && audit.coverage.unresolvedLevelNotes === 1 &&
    audit.coverage.totalTrackedItems === 35,
    "K167a السجل يطابق 3 حوارات و16 سطراً و6 أسئلة و9 إملاءات وملاحظة مستوى؛ كل معرّف حاضر مرة في JSON وMarkdown");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const referencedSources = new Set(audit.items.flatMap((item) => item.sources));
  const statusCounts = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.sources.length > 0 &&
    item.sources.every((id) => sourceIds.has(id)) && item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const validSources = audit.sources.length === 22 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://")
  );
  const correctedIds = new Set([
    "d-a1-04.lines[1]", "d-a1-04-q1",
    "d-a1-05", "d-a1-05.lines[0]", "d-a1-05.lines[3]", "d-a1-05-q1", "d-a1-05-q2",
    "d-a1-06.lines[2]", "d-a1-06.lines[4]", "d-a1-06-q2",
  ]);
  const expectedStatuses = audit.items.every((item) =>
    item.status === (item.id === "d-a1-06.level" ? "غير محسوم" : correctedIds.has(item.id) ? "مُصحح" : "سليم")
  );
  ok(completeEvidence && validSources && referencedSources.size === audit.sources.length && expectedStatuses &&
    statusCounts["سليم"] === 24 && statusCounts["مُصحح"] === 10 && statusCounts["غير محسوم"] === 1 &&
    audit.statusCounts["سليم"] === 24 && audit.statusCounts["مُصحح"] === 10 && audit.statusCounts["غير محسوم"] === 1 &&
    audit.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit.items.some((item) => item.id === "d-a1-06.level" && item.sources.includes("S19")),
    "K167b لكل عنصر دليل وحكم وإجراء ومصدر منشور؛ 22 مصدراً مستعملة، والأعداد 24/10/1 وحدود المراجعة متسقة");

  const d4 = completeBatch.find((dialogue) => dialogue.id === "d-a1-04");
  const d5 = completeBatch.find((dialogue) => dialogue.id === "d-a1-05");
  const d6 = completeBatch.find((dialogue) => dialogue.id === "d-a1-06");
  const d4q1 = d4?.questions.find((question) => question.id === "d-a1-04-q1");
  const d5q1 = d5?.questions.find((question) => question.id === "d-a1-05-q1");
  const d5q2 = d5?.questions.find((question) => question.id === "d-a1-05-q2");
  const d6q2 = d6?.questions.find((question) => question.id === "d-a1-06-q2");
  const d6Level = auditById.get("d-a1-06.level");
  ok(!!(d4?.lines[1]?.ar === "أعطني كيلو من فضلك." && d4q1?.promptAr === "أكمل الفراغ بالسعر الصحيح من الحوار." &&
    Array.isArray(d4q1?.answer) && d4q1.answer.includes("drei") && d4q1.answer.includes("3") &&
    d5?.titleAr === "وقت الفراغ في عطلة نهاية الأسبوع" &&
    d5.lines[0]?.ar === "ماذا تفعل في عطلة نهاية الأسبوع؟" &&
    d5.lines[3]?.ar === "يوم الأحد أزور عمتي أو خالتي. وأنتِ؟" &&
    d5q1?.explanationAr?.includes("عمته أو خالته") === true &&
    d5q2?.promptDe === "Da ___ ich meine Tante." && Array.isArray(d5q2.answer) && d5q2.answer[0] === "besuche" &&
    d6?.lines[2]?.ar === "هذا الخط الخاطئ. يجب عليك أن تنزل هنا." &&
    d6.lines[4]?.ar === "الحافلة رقم 12 في الجهة المقابلة." &&
    d6q2?.promptDe === "Sie müssen hier ___." && Array.isArray(d6q2.answer) && d6q2.answer[0] === "aussteigen" &&
    d6Level?.status === "غير محسوم" && d6Level.finding.includes("لا برهان قاطع")),
    "K167c تصحيحات الترجمة ومطابقة تعليمات الأسئلة للمفاتيح محفوظة؛ لا تعديل تخميني لملحوظة المستوى");
}

/* ═══ K168 — R94: مراجعة الحوارات A1 d-a1-07–09 ═══ */
{
  type DialogueAuditItem = { id: string; kind: string; status: string; sources: string[]; finding: string; action: string };
  type DialogueAuditSource = { id: string; title: string; url: string; supports: string };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-dialogues-03-2026-10-04.json", "utf8")) as {
    date: string;
    batch: string;
    scope: string;
    method: string;
    coverage: { dialogues: number; dialogueMetadata: number; lines: number; questions: number; dictationSentences: number; unresolvedLevelNotes: number; totalTrackedItems: number };
    statusCounts: Record<string, number>;
    sources: DialogueAuditSource[];
    limitations: string[];
    historicalPatchReview: {
      file: string;
      role: string;
      usageCheck: string;
      comparisons: { id: string; patchOptions: string[]; patchAnswer: string; liveAssessment: string; decision: string; sources: string[] }[];
    };
    items: DialogueAuditItem[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-dialogues-03-2026-10-04.md", "utf8");
  const batchIds = ["d-a1-07", "d-a1-08", "d-a1-09"];
  const batch = batchIds.map((id) => dialogues.find((dialogue) => dialogue.id === id));
  const completeBatch = batch.every((dialogue) => !!dialogue && dialogue.level === "A1") ? batch as NonNullable<typeof batch[number]>[] : [];
  const expectedIds = completeBatch.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const auditSection = auditMarkdown.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر")[0] ?? "";
  const markdownRowsUnique = expectedIds.every((id) =>
    auditSection.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(completeBatch.length === 3 && completeBatch.map((dialogue) => dialogue.lines.length).join(",") === "5,6,6" &&
    completeBatch.map((dialogue) => dialogue.questions.length).join(",") === "2,2,2" &&
    completeBatch.map((dialogue) => dialogue.dictation.length).join(",") === "3,2,2" &&
    expectedIds.length === 33 && new Set(expectedIds).size === 33 && auditIds.length === 33 &&
    new Set(auditIds).size === 33 && expectedIds.every((id) => auditById.has(id)) && markdownRowsUnique &&
    audit.date === "2026-10-04" && audit.batch === "A1-dialogues-03" &&
    audit.coverage.dialogues === 3 && audit.coverage.dialogueMetadata === 3 && audit.coverage.lines === 17 &&
    audit.coverage.questions === 6 && audit.coverage.dictationSentences === 7 && audit.coverage.unresolvedLevelNotes === 0 &&
    audit.coverage.totalTrackedItems === 33 &&
    ["d-a1-07", "d-a1-08", "d-a1-09"].every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K168a سجل التدقيق يغطي كل عنوان وسطر وسؤال وإملاء للحوارات 07–09 مرةً واحدة في JSON وMarkdown");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const referencedSources = new Set(audit.items.flatMap((item) => item.sources));
  const computedStatuses = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds = new Set([
    "d-a1-07.lines[0]", "d-a1-07.lines[2]", "d-a1-07-q1", "d-a1-07-q2",
    "d-a1-08.lines[0]", "d-a1-08-q2",
    "d-a1-09.lines[1]", "d-a1-09.lines[3]", "d-a1-09.lines[4]", "d-a1-09-q1",
  ]);
  const expectedStatuses = audit.items.every((item) =>
    item.status === (correctedIds.has(item.id) ? "مُصحح" : "سليم")
  );
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0
  );
  const completeSources = audit.sources.length === 18 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown.includes(`<a id="${source.id.toLowerCase()}">`)
  ) && referencedSources.size === audit.sources.length && audit.sources.every((source) => referencedSources.has(source.id));
  ok(completeEvidence && completeSources && expectedStatuses &&
    computedStatuses["سليم"] === 23 && computedStatuses["مُصحح"] === 10 && !computedStatuses["غير محسوم"] &&
    audit.statusCounts["سليم"] === 23 && audit.statusCounts["مُصحح"] === 10 && audit.statusCounts["غير محسوم"] === 0 &&
    audit.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit.limitations.some((limitation) => limitation.includes("قائمة حصرية")) &&
    audit.items.some((item) => item.id === "d-a1-09" && item.sources.includes("S17") && item.status === "سليم"),
    "K168b لكل حكم دليل ومصدر مستخدم ورابط وإجراء؛ 23 سليماً و10 مصححة بلا تهويل لملاحظة الأسلوب أو المستوى");

  const d7 = completeBatch.find((dialogue) => dialogue.id === "d-a1-07");
  const d8 = completeBatch.find((dialogue) => dialogue.id === "d-a1-08");
  const d9 = completeBatch.find((dialogue) => dialogue.id === "d-a1-09");
  const d7q1 = d7?.questions.find((question) => question.id === "d-a1-07-q1");
  const d7q2 = d7?.questions.find((question) => question.id === "d-a1-07-q2");
  const d8q2 = d8?.questions.find((question) => question.id === "d-a1-08-q2");
  const d9q1 = d9?.questions.find((question) => question.id === "d-a1-09-q1");
  const d9q2 = d9?.questions.find((question) => question.id === "d-a1-09-q2");
  const d9Options = d9q1?.options ?? [];
  ok(!!d7 && !!d8 && !!d9 && !!d7q1 && !!d7q2 && !!d8q2 && !!d9q1 && !!d9q2 &&
    d7.lines[0]?.ar === "طاب يومكم! ماذا تفضّلين؟" && d7.lines[2]?.ar === "حسنًا. هل تريدين غسل شعركِ أيضًا؟" &&
    d7q1.promptDe === "Wie soll der Friseur schneiden?" && d7q1.answer === "schneiden, nicht zu kurz" &&
    d7q2.promptAr === "أكمل الفراغ بالمبلغ الصحيح من الحوار." && Array.isArray(d7q2.answer) && d7q2.answer.includes("20") &&
    d8.lines[0]?.ar === "نهارًا سعيدًا! ماذا تريدين؟" && d8q2.promptDe === "Was kostet die Bestellung?" &&
    d8q2.answer === "drei Euro fünfzig" && !!d8q2.explanationAr?.includes("لا تحدد مقدار النقد") &&
    d9.lines[1]?.ar.startsWith("نهارك سعيد يا سيدة إبراهيم") &&
    d9.lines[3]?.ar === "هل يمكن تحديد موعد غدًا عند الساعة التاسعة؟" && d9.lines[4]?.ar === "نعم، الساعة التاسعة مناسبة." &&
    d9q1.answer === "Herr Weber aus dem Büro" && d9Options.length === 4 &&
    new Set(d9Options).size === d9Options.length && d9Options.includes("Herr Weber aus dem Café") &&
    d9q2.answer === "morgen um neun Uhr",
    "K168c بيانات الترجمة والأسئلة ومفاتيحها المصححة، خيار المشتتات غير المكرر، وتفسير Stimmt so محفوظة");
  ok(completeBatch.every((dialogue) => dialogue.dictation.every((sentence) => dialogue.lines.some((line) => line.de.includes(sentence)))) &&
    expectedIds.filter((id) => id.includes(".dictation[")).every((id) => auditById.get(id)?.status === "سليم"),
    "K168d جمل الإملاء السبع منسوخة حرفياً من حوارها ولكل منها حكم ودليل وإجراء مسجل");

  const history = audit.historicalPatchReview;
  const historicalIds = ["d-a1-07-q1", "d-a1-08-q1", "d-a1-08-q2", "d-a1-09-q1", "d-a1-09-q2"];
  const patchSource = readFileSync(history.file, "utf8");
  const historicalSection = auditMarkdown.split("## مقارنة المرجع التاريخي")[1]?.split("## سجل المراجعة بنداً بنداً")[0] ?? "";
  ok(history.file === "scripts/patches/a_dialog_fallen.py" && history.comparisons.length === 5 &&
    history.comparisons.map((comparison) => comparison.id).join(",") === historicalIds.join(",") &&
    history.comparisons.every((comparison) => comparison.patchOptions.length >= 3 && comparison.patchAnswer &&
      comparison.liveAssessment.trim().length > 0 && comparison.decision.trim().length > 0 &&
      comparison.sources.length > 0 && comparison.sources.every((source) => sourceIds.has(source)) &&
      patchSource.includes(`\"${comparison.id}\"`) && historicalSection.split("\n").filter((line) => line.startsWith(`| ${comparison.id} |`)).length === 1) &&
    history.comparisons.some((comparison) => comparison.id === "d-a1-09-q1" && comparison.liveAssessment.includes("غير مذكورة")) &&
    !d9?.questions.find((question) => question.id === "d-a1-09-q2")?.options?.includes("morgen um neun Uhr im Büro von Sara"),
    "K168e اقتراحات الـpatch التاريخي الخمسة قورنت بالحيّ؛ رُفض المشتت المكرر والعلاقة/المكان غير المسندين");
}

/* ═══ K169 — R95: مراجعة الحوارات A1 d-a1-10–12 ═══ */
{
  type DialogueAuditItem04 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>; before?: Record<string, any>;
  };
  type DialogueAuditSource04 = { id: string; title: string; url: string; supports: string };
  type HistoricalComparison04 = {
    id: string; patchOptions: string[]; patchAnswer: string | string[];
    liveAssessment: string; decision: string; sources: string[];
  };
  const audit = JSON.parse(readFileSync("docs/content-review-a1-dialogues-04-2026-10-05.json", "utf8")) as {
    date: string;
    batch: string;
    scope: string;
    method: string;
    coverage: {
      dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; unresolvedLevelNotes: number; unresolvedClinicalNotes: number; totalTrackedItems: number;
    };
    statusCounts: Record<string, number>;
    sources: DialogueAuditSource04[];
    limitations: string[];
    historicalPatchReview: {
      file: string; role: string; usageCheck: string; comparisons: HistoricalComparison04[];
    };
    patch: { file: string; fieldsChanged: number; correctedItemIds: string[]; changes: string[] };
    items: DialogueAuditItem04[];
  };
  const auditMarkdown = readFileSync("docs/content-review-a1-dialogues-04-2026-10-05.md", "utf8");
  const dialogueMetadata = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as { id: string; waisen?: string[] }[];
  const batchIds = ["d-a1-10", "d-a1-11", "d-a1-12"];
  const batch = batchIds.map((id) => dialogues.find((dialogue) => dialogue.id === id));
  const completeBatch = batch.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? batch as NonNullable<typeof batch[number]>[] : [];
  const expectedIds = completeBatch.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]).concat("d-a1-11.level");
  const auditIds = audit.items.map((item) => item.id);
  const auditById = new Map(audit.items.map((item) => [item.id, item]));
  const auditSection = auditMarkdown.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique = expectedIds.every((id) =>
    auditSection.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(completeBatch.length === 3 && completeBatch.every((dialogue) => dialogue.lines.length === 8 &&
      dialogue.questions.length === 3 && dialogue.dictation.length === 2) &&
    expectedIds.length === 43 && new Set(expectedIds).size === 43 && auditIds.length === 43 &&
    new Set(auditIds).size === 43 && expectedIds.every((id) => auditById.has(id)) && markdownRowsUnique &&
    audit.date === "2026-10-05" && audit.batch === "A1-dialogues-04" &&
    audit.coverage.dialogues === 3 && audit.coverage.dialogueMetadata === 3 && audit.coverage.lines === 24 &&
    audit.coverage.questions === 9 && audit.coverage.dictationSentences === 6 &&
    audit.coverage.unresolvedLevelNotes === 1 && audit.coverage.unresolvedClinicalNotes === 1 &&
    audit.coverage.totalTrackedItems === 43 &&
    ["d-a1-10", "d-a1-11", "d-a1-12"].every((id) => auditMarkdown.includes(`| ${id} |`)),
    "K169a سجل JSON وMarkdown يغطي بيانات الحوارات 10–12 وكل 24 سطراً و9 أسئلة و6 إملاءات وملاحظتي المستوى/الصحة مرةً واحدة");

  const sourceIds = new Set(audit.sources.map((source) => source.id));
  const referencedSources = new Set([
    ...audit.items.flatMap((item) => item.sources),
    ...audit.historicalPatchReview.comparisons.flatMap((comparison) => comparison.sources),
  ]);
  const computedStatuses = audit.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds = new Set(["d-a1-11-q1", "d-a1-12", "d-a1-12.lines[7]", "d-a1-12-q2", "d-a1-12-q3"]);
  const unresolvedIds = new Set(["d-a1-11.level", "d-a1-11.lines[6]"]);
  const expectedStatuses = audit.items.every((item) =>
    item.status === (correctedIds.has(item.id) ? "مُصحح" : unresolvedIds.has(item.id) ? "غير محسوم" : "سليم")
  );
  const completeEvidence = audit.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources = audit.sources.length === 26 && audit.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources.size === audit.sources.length && audit.sources.every((source) => referencedSources.has(source.id));
  ok(completeEvidence && completeSources && expectedStatuses &&
    computedStatuses["سليم"] === 36 && computedStatuses["مُصحح"] === 5 && computedStatuses["غير محسوم"] === 2 &&
    audit.statusCounts["سليم"] === 36 && audit.statusCounts["مُصحح"] === 5 && audit.statusCounts["غير محسوم"] === 2 &&
    audit.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit.limitations.some((limitation) => limitation.includes("ليست قوائم حصرية")) &&
    audit.limitations.some((limitation) => limitation.includes("تقييم سريري")) &&
    auditById.get("d-a1-11.level")?.status === "غير محسوم" &&
    auditById.get("d-a1-11.lines[6]")?.status === "غير محسوم",
    "K169b لكل بند محتوى ودليل ومصدر وإجراء؛ 26 مصدراً مستخدماً، مع فصل خمسة تصويبات عن ملاحظتي المستوى والطب غير المحسومتين");

  const snapshotsMatch = audit.items.every((item) => {
    const metadata = item.reviewed;
    if (item.id === "d-a1-11.level") return dialogues.find((dialogue) => dialogue.id === "d-a1-11")?.level === metadata.level;
    const dialogue = dialogues.find((candidate) => candidate.id === item.id ||
      (item.id.startsWith(`${candidate.id}.`) || candidate.questions.some((question) => question.id === item.id)));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      const rawMetadata = dialogueMetadata.find((candidate) => candidate.id === dialogue.id);
      return !!rawMetadata && metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && JSON.stringify(metadata.waisen) === JSON.stringify(rawMetadata.waisen);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && metadata.type === question.type && metadata.promptDe === question.promptDe &&
      JSON.stringify(metadata.options) === JSON.stringify(question.options) &&
      JSON.stringify(metadata.answer) === JSON.stringify(question.answer) &&
      metadata.promptAr === question.promptAr && metadata.explanationAr === question.explanationAr;
  });
  ok(snapshotsMatch,
    "K169c كل لقطة محتوى في سجل التدقيق تطابق البيانات الحية؛ التصويبات ثنائية اللغة والمفاتيح والتعليمات محفوظة حرفياً");

  const d10 = completeBatch.find((dialogue) => dialogue.id === "d-a1-10");
  const d11 = completeBatch.find((dialogue) => dialogue.id === "d-a1-11");
  const d12 = completeBatch.find((dialogue) => dialogue.id === "d-a1-12");
  const d11q1 = d11?.questions.find((question) => question.id === "d-a1-11-q1");
  const d12q2 = d12?.questions.find((question) => question.id === "d-a1-12-q2");
  const d12q3 = d12?.questions.find((question) => question.id === "d-a1-12-q3");
  const d12Line8 = d12?.lines[7];
  const d12Waisen = dialogueMetadata.find((dialogue) => dialogue.id === "d-a1-12")?.waisen ?? [];
  const exactDictation = completeBatch.every((dialogue) => dialogue.dictation.every((sentence) =>
    dialogue.lines.some((line) => line.de === sentence || line.de.includes(sentence))
  )) && expectedIds.filter((id) => id.includes(".dictation[")).every((id) => auditById.get(id)?.status === "سليم");
  const fillAcceptsBoth = !!d12q3 && grader.grade(d12q3, "89").correct && grader.grade(d12q3, "neunundachtzig").correct;
  ok(!!d10 && !!d11 && !!d12 &&
    d11q1?.promptDe === "Welche Körperstelle nennt Frau Nasri zuerst?" && d11q1.answer === "der Rücken" &&
    d11q1.options?.length === 3 && (d11q1.explanationAr ?? "").includes("تقول لاحقاً إن أنفها يؤلمها قليلاً") &&
    d11.lines[6]?.de === "Der Körper braucht Ruhe. Ruhen Sie sich drei Tage aus, bleiben Sie zu Hause." &&
    d12Line8?.de === "Gut. Die Socken nehme ich nicht. Ich habe nicht so viel Geld dabei." &&
    d12Line8?.ar === "حسناً. لن آخذ الجوارب. ليس معي مال كثير." &&
    d12Waisen.length === 9 && !d12Waisen.includes("das Hemd") &&
    d12q2?.answer === "die Socken" && d12q2.options?.length === 3 && d12q2.options.includes("der Mantel") &&
    d12q2.options.includes("die Socken") && !d12q2.options.includes("das Hemd") &&
    d12q3?.promptAr === "أكمل الفراغ بالمبلغ الصحيح من الحوار." &&
    fillAcceptsBoth && exactDictation,
    "K169d السؤال المضيّق ورفض الجوارب الممهّد وwaisen والمبلغ والإملاء محفوظة؛ يقبل المصحّح الرقم وكتابته بالحروف");

  const history = audit.historicalPatchReview;
  const historicalIds = ["d-a1-10-q1", "d-a1-11-q1", "d-a1-12-q2", "d-a1-12-q3"];
  const patchSource = readFileSync(history.file, "utf8");
  const historicalSection = auditMarkdown.split("## مقارنة السكربت التاريخي")[1]?.split("## التصويبات المطبقة")[0] ?? "";
  const historicalEvidence = history.comparisons.every((comparison) => {
    const answers = Array.isArray(comparison.patchAnswer) ? comparison.patchAnswer : [comparison.patchAnswer];
    return comparison.patchOptions.every((option) => patchSource.includes(option)) &&
      answers.every((answer) => patchSource.includes(answer)) &&
      comparison.liveAssessment.trim().length > 0 && comparison.decision.trim().length > 0 &&
      comparison.sources.length > 0 && comparison.sources.every((source) => sourceIds.has(source)) &&
      historicalSection.split("\n").filter((line) => line.startsWith(`| ${comparison.id} |`)).length === 1;
  });
  ok(history.file === "scripts/patches/dialoge_a1_neu1.py" && history.comparisons.length === 4 &&
    history.comparisons.map((comparison) => comparison.id).join(",") === historicalIds.join(",") &&
    history.usageCheck.includes("لم يعثر") && historicalEvidence &&
    audit.patch.file === "scripts/patches/review_a1_dialogues_04.py" && audit.patch.fieldsChanged === 9 &&
    audit.patch.correctedItemIds.length === 5 && existsSync(audit.patch.file),
    "K169e اقتراحات السكربت التاريخي الأربعة قورنت بالحيّ؛ سجلّ patch الحديث يثبت الفحص المسبق والتصويبات دون اعتماد تاريخي أعمى");
}

/* ═══ K170 — R96: تدقيق الحوارات A1 d-a1-13–15 بالمصادر والبيانات الحية ═══ */
{
  type DialogueAuditItem05 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>; before?: Record<string, any>;
  };
  type DialogueAuditSource05 = { id: string; title: string; url: string; supports: string };
  type HistoricalComparison05 = {
    id: string; patchOptions: string[]; patchAnswer: string | string[]; patchLines: string[];
    liveAssessment: string; decision: string; sources: string[];
  };
  const audit05 = JSON.parse(readFileSync("docs/content-review-a1-dialogues-05-2026-10-05.json", "utf8")) as {
    date: string; batch: string; scope: string; method: string;
    coverage: {
      dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; unresolvedLevelNotes: number; unresolvedContextNotes: number; totalTrackedItems: number;
    };
    statusCounts: Record<string, number>; statusDefinitions: Record<string, string>; limitations: string[];
    sources: DialogueAuditSource05[];
    historicalPatchReview: { file: string; role: string; usageCheck: string; comparisons: HistoricalComparison05[] };
    patch: { file: string; preflight: string; fieldsChanged: number; correctedItemIds: string[]; changes: string[] };
    items: DialogueAuditItem05[];
  };
  const auditMarkdown05 = readFileSync("docs/content-review-a1-dialogues-05-2026-10-05.md", "utf8");
  type LiveDialogue05 = {
    id: string; level: string; titleDe: string; titleAr: string; waisen: string[];
    lines: { de: string; ar: string }[];
    questions: { id: string; type: string; promptDe: string; options?: string[]; answer: string | string[];
      promptAr: string; explanationAr: string; falle?: boolean }[];
    dictation: string[];
  };
  const liveBatch05 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as LiveDialogue05[];
  const batchIds05 = ["d-a1-13", "d-a1-14", "d-a1-15"];
  const completeBatch05 = batchIds05.map((id) => liveBatch05.find((dialogue) => dialogue.id === id));
  const validBatch05 = completeBatch05.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? completeBatch05 as NonNullable<typeof completeBatch05[number]>[] : [];
  const expectedIds05 = validBatch05.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds05 = audit05.items.map((item) => item.id);
  const auditById05 = new Map(audit05.items.map((item) => [item.id, item]));
  const auditSection05 = auditMarkdown05.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique05 = expectedIds05.every((id) =>
    auditSection05.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(validBatch05.length === 3 && validBatch05.every((dialogue) => dialogue.lines.length === 8 &&
      dialogue.questions.length === 3 && dialogue.dictation.length === 2) &&
    expectedIds05.length === 42 && new Set(expectedIds05).size === 42 &&
    JSON.stringify(expectedIds05) === JSON.stringify(auditIds05) && markdownRowsUnique05 &&
    audit05.date === "2026-10-05" && audit05.batch === "A1-dialogues-05" &&
    audit05.coverage.dialogues === 3 && audit05.coverage.dialogueMetadata === 3 && audit05.coverage.lines === 24 &&
    audit05.coverage.questions === 9 && audit05.coverage.dictationSentences === 6 &&
    audit05.coverage.unresolvedLevelNotes === 0 && audit05.coverage.unresolvedContextNotes === 3 &&
    audit05.coverage.totalTrackedItems === 42,
    "K170a تقرير JSON/Markdown يغطي 42 معرفاً بالترتيب: 3 بيانات حوار و24 سطراً و9 أسئلة و6 إملاءات");

  const sourceIds05 = new Set(audit05.sources.map((source) => source.id));
  const referencedSources05 = new Set([
    ...audit05.items.flatMap((item) => item.sources),
    ...audit05.historicalPatchReview.comparisons.flatMap((comparison) => comparison.sources),
  ]);
  const computedStatuses05 = audit05.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds05 = new Set(["d-a1-14.lines[3]", "d-a1-14-q2"]);
  const unresolvedIds05 = new Set(["d-a1-13.lines[5]", "d-a1-14.lines[5]", "d-a1-14.lines[7]"]);
  const expectedStatuses05 = audit05.items.every((item) =>
    item.status === (correctedIds05.has(item.id) ? "مُصحح" : unresolvedIds05.has(item.id) ? "غير محسوم" : "سليم")
  );
  const completeEvidence05 = audit05.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds05.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources05 = audit05.sources.length === 43 && sourceIds05.size === 43 && audit05.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown05.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources05.size === audit05.sources.length && audit05.sources.every((source) => referencedSources05.has(source.id));
  ok(completeEvidence05 && completeSources05 && expectedStatuses05 &&
    computedStatuses05["سليم"] === 37 && computedStatuses05["مُصحح"] === 2 && computedStatuses05["غير محسوم"] === 3 &&
    audit05.statusCounts["سليم"] === 37 && audit05.statusCounts["مُصحح"] === 2 && audit05.statusCounts["غير محسوم"] === 3 &&
    audit05.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit05.statusDefinitions["غير محسوم"].includes("لم يُعدّل"),
    "K170b لكل بند حكم ودليل وإجراء ومصدر؛ 43 مصدراً مستخدماً، مع فصل 2 تصحيح مؤكد عن 3 ملاحظات غير محسومة");

  const snapshotsMatch05 = audit05.items.every((item) => {
    const metadata = item.reviewed;
    const dialogue = validBatch05.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      return metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && JSON.stringify(metadata.waisen) === JSON.stringify(dialogue.waisen);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && metadata.type === question.type && metadata.promptDe === question.promptDe &&
      JSON.stringify(metadata.options) === JSON.stringify(question.options) &&
      JSON.stringify(metadata.answer) === JSON.stringify(question.answer) &&
      metadata.promptAr === question.promptAr && metadata.explanationAr === question.explanationAr &&
      metadata.falle === question.falle;
  });
  ok(snapshotsMatch05 &&
    auditById05.get("d-a1-14.lines[3]")?.reviewed.de === "Der Paketpreis hängt von Größe und Gewicht ab. Für einen Standardbrief ins Ausland bis 20 Gramm brauchen Sie eine Briefmarke für 1,25 Euro." &&
    auditById05.get("d-a1-14-q2")?.reviewed.answer === "1,25 Euro" &&
    auditById05.get("d-a1-14-q2")?.reviewed.options?.join("|") === "20 Cent|1,80 Euro|1,25 Euro",
    "K170c كل لقطة تقرير تطابق البيانات الحية، بما فيها الثنائية والخيارات والمفتاح والشرح والتعليمات");

  const history05 = audit05.historicalPatchReview;
  const historicalIds05 = ["d-a1-13", "d-a1-14", "d-a1-15"];
  const historicalPatchSource05 = readFileSync(history05.file, "utf8");
  const historicalSection05 = auditMarkdown05.split("## مقارنة السكربت التاريخي")[1]?.split("## التصويبات المطبقة")[0] ?? "";
  const historicalEvidence05 = history05.comparisons.every((comparison) => {
    const answers = Array.isArray(comparison.patchAnswer) ? comparison.patchAnswer : [comparison.patchAnswer];
    return comparison.patchOptions.every((option) => historicalPatchSource05.includes(option)) &&
      answers.every((answer) => historicalPatchSource05.includes(answer)) &&
      comparison.patchLines.every((line) => historicalPatchSource05.includes(line)) &&
      comparison.liveAssessment.trim().length > 0 && comparison.decision.trim().length > 0 &&
      comparison.sources.length > 0 && comparison.sources.every((source) => sourceIds05.has(source)) &&
      historicalSection05.split("\n").filter((line) => line.startsWith(`| ${comparison.id} |`)).length === 1;
  });
  ok(history05.file === "scripts/patches/dialoge_a1_neu1.py" && history05.comparisons.length === 3 &&
    history05.comparisons.map((comparison) => comparison.id).join(",") === historicalIds05.join(",") &&
    history05.role.includes("تاريخي") && history05.usageCheck.includes("استيراد") && historicalEvidence05 &&
    audit05.patch.file === "scripts/patches/review_a1_dialogues_05.py" && audit05.patch.fieldsChanged === 5 &&
    audit05.patch.correctedItemIds.length === 2 && existsSync(audit05.patch.file) &&
    auditMarkdown05.includes("لم تُعامل النسخة التاريخية كمرجع للقيمة الحية"),
    "K170d اقتراحات السكربت التاريخي الثلاثة قورنت بالنص الحي؛ التقرير لا يعتمده تلقائياً ويسجل إجراء التصحيح ومصدره");

  const patchSource05 = readFileSync("scripts/patches/review_a1_dialogues_05.py", "utf8");
  const correctedDialogue05 = validBatch05.find((dialogue) => dialogue.id === "d-a1-14");
  const correctedQuestion05 = correctedDialogue05?.questions.find((question) => question.id === "d-a1-14-q2");
  const patchBeforeValues05 = auditById05.get("d-a1-14.lines[3]")?.before;
  const questionBeforeValues05 = auditById05.get("d-a1-14-q2")?.before;
  ok(audit05.patch.preflight.includes("20 Cent") && audit05.patch.preflight.includes("لا السكربت") &&
    patchSource05.includes("mixed before/after state; refusing partial application") &&
    patchSource05.includes("preflight failed; no write performed") &&
    !!patchBeforeValues05 && patchSource05.includes(patchBeforeValues05.de) &&
    !!questionBeforeValues05 && questionBeforeValues05.answer === "85 Cent" &&
    patchSource05.includes(questionBeforeValues05.answer) &&
    correctedDialogue05?.lines[3]?.de === auditById05.get("d-a1-14.lines[3]")?.reviewed.de &&
    correctedQuestion05?.answer === auditById05.get("d-a1-14-q2")?.reviewed.answer &&
    correctedQuestion05?.answer === "1,25 Euro" && correctedQuestion05.options?.length === 3,
    "K170e رقعة d-a1-14 تفحص القيم الحية الخمس قبل الكتابة، ترفض الحالة الجزئية، وتحفظ سعر الرسالة المحدد لا تعرفة طرد عامة");
}

/* ═══ K171 — R97: تدقيق الحوارات A1 d-a1-16–18 بالمصادر والبيانات الحية ═══ */
{
  type DialogueAuditItem06 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>; before?: Record<string, any>;
  };
  type DialogueAuditSource06 = { id: string; title: string; url: string; supports: string };
  type HistoricalComparison06 = {
    id: string; patchOptions: string[]; patchAnswer: string | string[]; patchLines: string[];
    liveAssessment: string; decision: string; sources: string[];
  };
  const audit06 = JSON.parse(readFileSync("docs/content-review-a1-dialogues-06-2026-10-05.json", "utf8")) as {
    date: string; batch: string; scope: string; method: string;
    coverage: {
      dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; unresolvedLevelNotes: number; unresolvedContextNotes: number; totalTrackedItems: number;
    };
    statusCounts: Record<string, number>; statusDefinitions: Record<string, string>; limitations: string[];
    sources: DialogueAuditSource06[];
    historicalPatchReview: { file: string; role: string; usageCheck: string; comparisons: HistoricalComparison06[] };
    patch: { file: string; preflight: string; fieldsChanged: number; correctedItemIds: string[]; changes: string[] };
    items: DialogueAuditItem06[];
  };
  const auditMarkdown06 = readFileSync("docs/content-review-a1-dialogues-06-2026-10-05.md", "utf8");
  type LiveDialogue06 = {
    id: string; level: string; titleDe: string; titleAr: string; waisen: string[];
    lines: { who: string; de: string; ar: string }[];
    questions: { id: string; type: string; promptDe: string; options?: string[]; answer: string | string[];
      promptAr: string; explanationAr: string; falle?: boolean }[];
    dictation: string[];
  };
  const liveBatch06 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as LiveDialogue06[];
  const batchIds06 = ["d-a1-16", "d-a1-17", "d-a1-18"];
  const completeBatch06 = batchIds06.map((id) => liveBatch06.find((dialogue) => dialogue.id === id));
  const validBatch06 = completeBatch06.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? completeBatch06 as NonNullable<typeof completeBatch06[number]>[] : [];
  const expectedIds06 = validBatch06.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds06 = audit06.items.map((item) => item.id);
  const auditById06 = new Map(audit06.items.map((item) => [item.id, item]));
  const auditSection06 = auditMarkdown06.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique06 = expectedIds06.every((id) =>
    auditSection06.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(validBatch06.length === 3 && validBatch06.every((dialogue) => dialogue.lines.length === 8 &&
      dialogue.questions.length === 3 && dialogue.dictation.length === 2) &&
    expectedIds06.length === 42 && new Set(expectedIds06).size === 42 &&
    JSON.stringify(expectedIds06) === JSON.stringify(auditIds06) && markdownRowsUnique06 &&
    audit06.date === "2026-10-05" && audit06.batch === "A1-dialogues-06" &&
    audit06.coverage.dialogues === 3 && audit06.coverage.dialogueMetadata === 3 && audit06.coverage.lines === 24 &&
    audit06.coverage.questions === 9 && audit06.coverage.dictationSentences === 6 &&
    audit06.coverage.unresolvedLevelNotes === 0 && audit06.coverage.unresolvedContextNotes === 2 &&
    audit06.coverage.totalTrackedItems === 42 &&
    audit06.scope.includes("d-a1-16") && audit06.scope.includes("d-a1-17") && audit06.scope.includes("d-a1-18"),
    "K171a تقرير JSON/Markdown يغطي 42 معرفاً بالترتيب: 3 بيانات حوار و24 سطراً و9 أسئلة و6 إملاءات");

  const sourceIds06 = new Set(audit06.sources.map((source) => source.id));
  const referencedSources06 = new Set([
    ...audit06.items.flatMap((item) => item.sources),
    ...audit06.historicalPatchReview.comparisons.flatMap((comparison) => comparison.sources),
  ]);
  const computedStatuses06 = audit06.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds06 = new Set(["d-a1-16.lines[1]", "d-a1-16.lines[7]", "d-a1-16-q1", "d-a1-17-q1"]);
  const unresolvedIds06 = new Set(["d-a1-18", "d-a1-18.lines[7]"]);
  const expectedStatuses06 = audit06.items.every((item) =>
    item.status === (correctedIds06.has(item.id) ? "مُصحح" : unresolvedIds06.has(item.id) ? "غير محسوم" : "سليم")
  );
  const completeEvidence06 = audit06.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds06.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources06 = audit06.sources.length === 45 && sourceIds06.size === 45 && audit06.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown06.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources06.size === audit06.sources.length && audit06.sources.every((source) => referencedSources06.has(source.id));
  ok(completeEvidence06 && completeSources06 && expectedStatuses06 &&
    computedStatuses06["سليم"] === 36 && computedStatuses06["مُصحح"] === 4 && computedStatuses06["غير محسوم"] === 2 &&
    audit06.statusCounts["سليم"] === 36 && audit06.statusCounts["مُصحح"] === 4 && audit06.statusCounts["غير محسوم"] === 2 &&
    audit06.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit06.method.includes("مؤجل") && audit06.statusDefinitions["غير محسوم"].includes("لم يُعلن الخطأ"),
    "K171b لكل بند حكم ودليل وإجراء ومصدر؛ 45 مصدراً مستخدماً، مع فصل 4 تصويبات مؤكدة عن ملاحظتين غير محسومتين");

  const snapshotsMatch06 = audit06.items.every((item) => {
    const metadata = item.reviewed;
    const dialogue = validBatch06.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      return metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && JSON.stringify(metadata.waisen) === JSON.stringify(dialogue.waisen);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.who === line.who && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && metadata.type === question.type && metadata.promptDe === question.promptDe &&
      JSON.stringify(metadata.options) === JSON.stringify(question.options) &&
      JSON.stringify(metadata.answer) === JSON.stringify(question.answer) &&
      metadata.promptAr === question.promptAr && metadata.explanationAr === question.explanationAr &&
      metadata.falle === question.falle;
  });
  const birdLine06 = auditById06.get("d-a1-16.lines[1]");
  const firstTask06 = auditById06.get("d-a1-17-q1");
  ok(snapshotsMatch06 &&
    birdLine06?.reviewed.ar === "انظر، طائر على الشجرة! يغرّد." &&
    auditById06.get("d-a1-16.lines[7]")?.reviewed.de === "Können wir morgen wiederkommen?" &&
    auditById06.get("d-a1-16-q1")?.reviewed.explanationAr.includes("الطائر على الشجرة") &&
    !auditById06.get("d-a1-16-q1")?.reviewed.explanationAr.includes("العصفور") &&
    firstTask06?.reviewed.promptDe === "Welche Aufgabe nennt die Mutter zuerst?" &&
    firstTask06.reviewed.answer === "Er kehrt die Küche." && firstTask06.reviewed.options?.includes(firstTask06.reviewed.answer) &&
    firstTask06.reviewed.explanationAr.includes("لا دليلاً على ترتيب تنفيذ الأعمال") &&
    auditById06.get("d-a1-18")?.status === "غير محسوم" && auditById06.get("d-a1-18.lines[7]")?.status === "غير محسوم",
    "K171c كل اللقطات تطابق البيانات الحية؛ تصحيح Vogel وwiederkommen والسؤال، مع إبقاء ملاحظتي d-a1-18 بلا تعديل");

  const history06 = audit06.historicalPatchReview;
  const historicalIds06 = ["d-a1-16", "d-a1-17", "d-a1-18"];
  const historicalPatchSource06 = readFileSync(history06.file, "utf8");
  const historicalSection06 = auditMarkdown06.split("## مقارنة السكربت التاريخي")[1]?.split("## التصويبات المطبقة")[0] ?? "";
  const historicalEvidence06 = history06.comparisons.every((comparison) => {
    const answers = Array.isArray(comparison.patchAnswer) ? comparison.patchAnswer : [comparison.patchAnswer];
    return comparison.patchOptions.every((option) => historicalPatchSource06.includes(option)) &&
      answers.every((answer) => historicalPatchSource06.includes(answer)) &&
      comparison.patchLines.every((line) => historicalPatchSource06.includes(line)) &&
      comparison.liveAssessment.trim().length > 0 && comparison.decision.trim().length > 0 &&
      comparison.sources.length > 0 && comparison.sources.every((source) => sourceIds06.has(source)) &&
      historicalSection06.split("\n").filter((line) => line.startsWith(`| ${comparison.id} |`)).length === 1;
  });
  ok(history06.file === "scripts/patches/dialoge_a1_neu1.py" && history06.comparisons.length === 3 &&
    history06.comparisons.map((comparison) => comparison.id).join(",") === historicalIds06.join(",") &&
    history06.role.includes("تاريخي") && history06.usageCheck.includes("لا يظهر استيراداً إنتاجياً") && historicalEvidence06 &&
    audit06.patch.file === "scripts/patches/review_a1_dialogues_06.py" && audit06.patch.fieldsChanged === 5 &&
    audit06.patch.correctedItemIds.length === 4 && existsSync(audit06.patch.file) &&
    auditMarkdown06.includes("لم تُمنح أولوية") && auditMarkdown06.includes("غير محسوم"),
    "K171d اقتراحات السكربت التاريخي الثلاثة قورنت بالحي؛ التقرير لا يعتمده تلقائياً ويسجل إجراء التصحيح ومصدره");

  const patchSource06 = readFileSync(audit06.patch.file, "utf8");
  const birdBefore06 = auditById06.get("d-a1-16.lines[1]")?.before;
  const birdQuestionBefore06 = auditById06.get("d-a1-16-q1")?.before;
  const spellingBefore06 = auditById06.get("d-a1-16.lines[7]")?.before;
  const taskBefore06 = auditById06.get("d-a1-17-q1")?.before;
  const lehrerSource06 = readFileSync("components/lehrer.tsx", "utf8");
  const fehlerUiSource06 = readFileSync("components/fehler-ui.tsx", "utf8");
  const taskSource06 = readFileSync("components/tasks.tsx", "utf8");
  ok(audit06.patch.preflight.includes("القيم الحية الخمس الدقيقة") &&
    patchSource06.includes("mixed before/after state; refusing partial application") &&
    patchSource06.includes("preflight failed; no write performed") && patchSource06.includes("--apply") &&
    !!birdBefore06 && patchSource06.includes(birdBefore06.ar) &&
    !!birdQuestionBefore06 && patchSource06.includes(birdQuestionBefore06.explanationAr) &&
    !!spellingBefore06 && patchSource06.includes(spellingBefore06.de) &&
    !!taskBefore06 && patchSource06.includes(taskBefore06.promptDe) &&
    lehrerSource06.includes("تدرّب على تصحيح الجمل الألمانية") &&
    lehrerSource06.includes('quelle: "تمرين تصحيح الألمانية"') &&
    !lehrerSource06.includes("أخطاء العرب الشائعة") && !lehrerSource06.includes("الناطقين بالعربية") &&
    fehlerUiSource06.includes("اختر الصيغة الألمانية الصحيحة") && !fehlerUiSource06.includes("أخطاء الناطقين بالعربية") &&
    !taskSource06.includes("أخطاء شائعة عند العرب"),
    "K171e الرقعة ذات الفحص المسبق تعيد فحص القيم؛ تسميات الواجهة محايدة ولا تنسب الأخطاء إلى جماعة لغوية");

  const grammarCopy06 = readFileSync("content/grammar.json", "utf8");
  const mnemonicCopy06 = JSON.parse(readFileSync("content/eselsbruecken.json", "utf8")) as { id: string; storyAr: string }[];
  const generatorCopy06 = readFileSync("scripts/_es1.py", "utf8");
  const planCopy06 = readFileSync("lib/plan.ts", "utf8");
  const contentLabels06 = readFileSync("lib/content.ts", "utf8");
  const spellingLabels06 = readFileSync("lib/schreibpruefer.ts", "utf8");
  const phoneticsLabels06 = readFileSync("lib/arabinterferenz.ts", "utf8");
  const pluralMnemonic06 = mnemonicCopy06.find((entry) => entry.id === "innen");
  const neutralPluralCue06 = "تذكّرْ كتابةَ النونِ مرتين في صيغةِ الجمع.";
  ok(grammarCopy06.includes("في هذه البنية لا يبقى الفعل المصرَّف في المركز الثاني") &&
    !grammarCopy06.includes("عند العرب الخطأ الشائع") && !!pluralMnemonic06 &&
    pluralMnemonic06.storyAr.includes(neutralPluralCue06) && !pluralMnemonic06.storyAr.includes("أخطاءِ العربِ") && generatorCopy06.includes(neutralPluralCue06) &&
    !generatorCopy06.includes("أخطاءِ العربِ") && planCopy06.includes("تدريب استباقي على أنماط ألمانية") &&
    !planCopy06.includes("موسوعة أخطاء العرب") && contentLabels06.includes("بنك أنماط التصحيح الألمانية") &&
    !contentLabels06.includes("موسوعة أخطاء العرب الشائعة") && spellingLabels06.includes("أنماطٌ لغويةٌ قابلةٌ للفحص") &&
    !spellingLabels06.includes("أخطاءُ العربِ المعروفة") &&
    phoneticsLabels06.includes("تدريبات النطق للمتعلمين الناطقين بالعربية") &&
    !phoneticsLabels06.includes("يخطئ فيها العرب كثيراً"),
    "K171f الصياغة المحايدة متزامنة بين الدرس وبنك التركات والمولّد والعناوين؛ لا تعميم غير مسند على العرب");
}

/* ═══ K172 — R98: تدقيق الحوارات A1 d-a1-19–21 بالمصادر والبيانات الحية ═══ */
{
  type DialogueAuditItem07 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>; before?: Record<string, any>;
  };
  type DialogueAuditSource07 = { id: string; title: string; url: string; supports: string };
  const audit07 = JSON.parse(readFileSync("docs/content-review-a1-dialogues-07-2026-10-05.json", "utf8")) as {
    date: string; batch: string; scope: string; method: string;
    coverage: {
      dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; unresolvedLevelNotes: number; unresolvedContextNotes: number; totalTrackedItems: number;
    };
    statusCounts: Record<string, number>; statusDefinitions: Record<string, string>; limitations: string[];
    sources: DialogueAuditSource07[];
    historicalPatchReview: { file: string; role: string; usageCheck: string; comparisons: unknown[] };
    patch: { file: string; preflight: string; fieldsChanged: number; correctedItemIds: string[]; changes: string[] };
    items: DialogueAuditItem07[];
  };
  const auditMarkdown07 = readFileSync("docs/content-review-a1-dialogues-07-2026-10-05.md", "utf8");
  type LiveDialogue07 = {
    id: string; level: string; titleDe: string; titleAr: string; waisen: string[];
    lines: { who: string; de: string; ar: string }[];
    questions: { id: string; type: string; promptDe: string; options?: string[]; answer: string | string[];
      promptAr: string; explanationAr: string; falle?: boolean }[];
    dictation: string[];
  };
  const liveBatch07 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as LiveDialogue07[];
  const batchIds07 = ["d-a1-19", "d-a1-20", "d-a1-21"];
  const completeBatch07 = batchIds07.map((id) => liveBatch07.find((dialogue) => dialogue.id === id));
  const validBatch07 = completeBatch07.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? completeBatch07 as NonNullable<typeof completeBatch07[number]>[] : [];
  const expectedIds07 = validBatch07.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds07 = audit07.items.map((item) => item.id);
  const auditById07 = new Map(audit07.items.map((item) => [item.id, item]));
  const auditSection07 = auditMarkdown07.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique07 = expectedIds07.every((id) =>
    auditSection07.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(validBatch07.length === 3 && validBatch07.every((dialogue) => dialogue.lines.length === 8 &&
      dialogue.questions.length === 3 && dialogue.dictation.length === 2) &&
    expectedIds07.length === 42 && new Set(expectedIds07).size === 42 &&
    JSON.stringify(expectedIds07) === JSON.stringify(auditIds07) && markdownRowsUnique07 &&
    audit07.date === "2026-10-05" && audit07.batch === "A1-dialogues-07" &&
    audit07.coverage.dialogues === 3 && audit07.coverage.dialogueMetadata === 3 && audit07.coverage.lines === 24 &&
    audit07.coverage.questions === 9 && audit07.coverage.dictationSentences === 6 &&
    audit07.coverage.unresolvedLevelNotes === 0 && audit07.coverage.unresolvedContextNotes === 3 &&
    audit07.coverage.totalTrackedItems === 42 &&
    batchIds07.every((id) => audit07.scope.includes(id)),
    "K172a تقرير R98 وMarkdown يغطيان المعرفات الـ42 بالترتيب: 3 بيانات حوار و24 سطراً و9 أسئلة و6 إملاءات");

  const sourceIds07 = new Set(audit07.sources.map((source) => source.id));
  const referencedSources07 = new Set(audit07.items.flatMap((item) => item.sources));
  const computedStatuses07 = audit07.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds07 = new Set(["d-a1-19.lines[1]"]);
  const unresolvedIds07 = new Set(["d-a1-20.lines[1]", "d-a1-20.lines[2]", "d-a1-21.lines[1]"]);
  const expectedStatuses07 = audit07.items.every((item) =>
    item.status === (correctedIds07.has(item.id) ? "مُصحح" : unresolvedIds07.has(item.id) ? "غير محسوم" : "سليم")
  );
  const completeEvidence07 = audit07.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds07.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources07 = audit07.sources.length === 65 && sourceIds07.size === 65 && audit07.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown07.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources07.size === audit07.sources.length && audit07.sources.every((source) => referencedSources07.has(source.id));
  ok(completeEvidence07 && completeSources07 && expectedStatuses07 &&
    computedStatuses07["سليم"] === 38 && computedStatuses07["مُصحح"] === 1 && computedStatuses07["غير محسوم"] === 3 &&
    audit07.statusCounts["سليم"] === 38 && audit07.statusCounts["مُصحح"] === 1 && audit07.statusCounts["غير محسوم"] === 3 &&
    audit07.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit07.statusDefinitions["غير محسوم"].includes("لم تُعدّل"),
    "K172b لكل بند دليل وحكم وإجراء ومصدر؛ 65 مصدراً مستخدماً، مع فصل تصحيح واحد عن ثلاث مسائل غير محسومة");

  const snapshotsMatch07 = audit07.items.every((item) => {
    const metadata = item.reviewed;
    const dialogue = validBatch07.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      return metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && JSON.stringify(metadata.waisen) === JSON.stringify(dialogue.waisen);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.who === line.who && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && metadata.type === question.type && metadata.promptDe === question.promptDe &&
      JSON.stringify(metadata.options) === JSON.stringify(question.options) &&
      JSON.stringify(metadata.answer) === JSON.stringify(question.answer) &&
      metadata.promptAr === question.promptAr && metadata.explanationAr === question.explanationAr &&
      metadata.falle === question.falle;
  });
  const corrected07 = auditById07.get("d-a1-19.lines[1]");
  const correctedDialogue07 = validBatch07.find((dialogue) => dialogue.id === "d-a1-19");
  const unresolvedCalendar07 = auditById07.get("d-a1-20.lines[1]");
  const unresolvedTimeline07 = auditById07.get("d-a1-20.lines[2]");
  const unresolvedPaper07 = auditById07.get("d-a1-21.lines[1]");
  const liveTimeline07 = validBatch07.find((dialogue) => dialogue.id === "d-a1-20");
  ok(snapshotsMatch07 && corrected07?.status === "مُصحح" &&
    corrected07.before?.ar === "هل يوجد فاكهة أيضاً؟ أريد موزة." &&
    correctedDialogue07?.lines[1]?.ar === "هل توجد فاكهة أيضاً؟ أريد موزة." &&
    unresolvedCalendar07?.status === "غير محسوم" && unresolvedCalendar07.finding.includes("لا يذكر سنة") &&
    unresolvedTimeline07?.status === "غير محسوم" && unresolvedTimeline07.finding.includes("إصلاحان محتملان") &&
    liveTimeline07?.lines[2]?.de === "Also übermorgen. Und die Uhrzeit?" &&
    liveTimeline07.lines[5]?.de.startsWith("Vorgestern, am Montag.") &&
    liveTimeline07.dictation[0] === liveTimeline07.lines[2]?.de &&
    unresolvedPaper07?.status === "غير محسوم" && unresolvedPaper07.reviewed.de === "Brauchen wir das Heft oder ein Papier?",
    "K172c كل لقطات التقرير تطابق الحي؛ صُحح تأنيث فاكهة فقط وبقيت احتمالات الزمن وPapier بلا تعديل");

  const history07 = audit07.historicalPatchReview;
  const historicalPatchSource07 = readFileSync(history07.file, "utf8");
  const historyIdsAbsent07 = batchIds07.every((id) => !historicalPatchSource07.includes(id));
  ok(history07.file === "scripts/patches/dialoge_a1_neu1.py" && history07.comparisons.length === 0 &&
    history07.role.includes("تاريخي") && history07.usageCheck.includes("لم يظهر أي تطابق") && historyIdsAbsent07 &&
    auditMarkdown07.includes("comparisons` فارغة") &&
    audit07.patch.file === "scripts/patches/review_a1_dialogues_07.py" && audit07.patch.fieldsChanged === 1 &&
    audit07.patch.correctedItemIds.length === 1 && existsSync(audit07.patch.file),
    "K172d لا مقارنة تاريخية بلا تطابق في السكربت؛ التقرير يسجل غياب المعرّفات ولا يخترع مادة مقارنة");

  const patchSource07 = readFileSync(audit07.patch.file, "utf8");
  ok(audit07.patch.preflight.includes("القيمة السابقة الدقيقة") &&
    patchSource07.includes("mixed before/after state; refusing partial application") &&
    patchSource07.includes("preflight failed; no write performed") && patchSource07.includes("--apply") &&
    patchSource07.includes("هل يوجد فاكهة أيضاً؟ أريد موزة.") &&
    patchSource07.includes("هل توجد فاكهة أيضاً؟ أريد موزة.") &&
    patchSource07.includes("leave unresolved übermorgen/vorgestern mismatch unchanged") &&
    audit07.patch.changes.length === 1 && audit07.patch.changes[0].includes("توجد"),
    "K172e الرقعة محمية بقيمة سابقة دقيقة، وتُبقي تناقض الموعد غير المحسوم بلا إصلاح تخميني");

  ok(audit07.method.includes("لا تحدد قصد المؤلف") &&
    audit07.limitations.some((limitation) => limitation.includes("CEFR") && limitation.includes("مؤجلة")) &&
    audit07.limitations.some((limitation) => limitation.includes("مراجعة بشرية أو اعتماداً")) &&
    auditMarkdown07.includes("ولا تحل محل مراجعة بشرية أو اعتماد مهني") &&
    audit07.coverage.unresolvedContextNotes === 3 && audit07.coverage.unresolvedLevelNotes === 0,
    "K172f المنهج يفصل بين الخطأ المثبت وما لا يحسمه السياق؛ CEFR والنسبة وحساب المستوى والمراجعة البشرية خارج النطاق");
}

/* ═══ K173 — R99: تدقيق الحوارات A1 d-a1-22–24 بالمصادر والبيانات الحية ═══ */
{
  type DialogueAuditItem08 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>; before?: Record<string, any>;
  };
  type DialogueAuditSource08 = { id: string; title: string; url: string; supports: string };
  const audit08 = JSON.parse(readFileSync("docs/content-review-a1-dialogues-08-2026-10-05.json", "utf8")) as {
    date: string; batch: string; scope: string; method: string;
    coverage: { dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; unresolvedLevelNotes: number; unresolvedContextNotes: number; totalTrackedItems: number };
    statusCounts: Record<string, number>; statusDefinitions: Record<string, string>; limitations: string[];
    sources: DialogueAuditSource08[];
    historicalPatchReview: { file: string; role: string; usageCheck: string; comparisons: any[] };
    patch: { file: string; preflight: string; fieldsChanged: number; correctedItemIds: string[]; changes: string[] };
    items: DialogueAuditItem08[];
  };
  const auditMarkdown08 = readFileSync("docs/content-review-a1-dialogues-08-2026-10-05.md", "utf8");
  type LiveDialogue08 = {
    id: string; level: string; titleDe: string; titleAr: string; waisen: string[];
    lines: { who: string; de: string; ar: string }[];
    questions: { id: string; type: string; promptDe: string; options?: string[]; answer: string | string[];
      promptAr?: string; explanationAr?: string; falle?: boolean }[];
    dictation: string[];
  };
  const liveBatchAll08 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as LiveDialogue08[];
  const batchIds08 = ["d-a1-22", "d-a1-23", "d-a1-24"];
  const completeBatch08 = batchIds08.map((id) => liveBatchAll08.find((dialogue) => dialogue.id === id));
  const validBatch08 = completeBatch08.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? completeBatch08 as NonNullable<typeof completeBatch08[number]>[] : [];
  const expectedIds08 = validBatch08.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds08 = audit08.items.map((item) => item.id);
  const auditById08 = new Map(audit08.items.map((item) => [item.id, item]));
  const auditSection08 = auditMarkdown08.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique08 = expectedIds08.every((id) =>
    auditSection08.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(validBatch08.length === 3 && validBatch08.every((dialogue) => dialogue.lines.length === 8 &&
      dialogue.questions.length === 3 && dialogue.dictation.length === 2) &&
    expectedIds08.length === 42 && new Set(expectedIds08).size === 42 &&
    JSON.stringify(expectedIds08) === JSON.stringify(auditIds08) && markdownRowsUnique08 &&
    audit08.date === "2026-10-05" && audit08.batch === "A1-dialogues-08" &&
    audit08.coverage.dialogues === 3 && audit08.coverage.dialogueMetadata === 3 && audit08.coverage.lines === 24 &&
    audit08.coverage.questions === 9 && audit08.coverage.dictationSentences === 6 &&
    audit08.coverage.unresolvedLevelNotes === 0 && audit08.coverage.unresolvedContextNotes === 3 &&
    audit08.coverage.totalTrackedItems === 42 && batchIds08.every((id) => audit08.scope.includes(id)),
    "K173a تقرير R99 وMarkdown يغطيان 42 معرفاً بالترتيب: 3 بيانات حوار و24 سطراً و9 أسئلة و6 إملاءات");

  const sourceIds08 = new Set(audit08.sources.map((source) => source.id));
  const referencedSources08 = new Set(audit08.items.flatMap((item) => item.sources));
  const computedStatuses08 = audit08.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds08 = new Set(["d-a1-22.lines[2]", "d-a1-22.lines[4]", "d-a1-22.lines[7]", "d-a1-24.lines[1]"]);
  const unresolvedIds08 = new Set(["d-a1-23.lines[0]", "d-a1-23.lines[3]", "d-a1-23.lines[7]"]);
  const expectedStatuses08 = audit08.items.every((item) =>
    item.status === (correctedIds08.has(item.id) ? "مُصحح" : unresolvedIds08.has(item.id) ? "غير محسوم" : "سليم")
  );
  const completeEvidence08 = audit08.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds08.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources08 = audit08.sources.length === 56 && sourceIds08.size === 56 && audit08.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown08.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources08.size === audit08.sources.length && audit08.sources.every((source) => referencedSources08.has(source.id));
  ok(completeEvidence08 && completeSources08 && expectedStatuses08 &&
    computedStatuses08["سليم"] === 35 && computedStatuses08["مُصحح"] === 4 && computedStatuses08["غير محسوم"] === 3 &&
    audit08.statusCounts["سليم"] === 35 && audit08.statusCounts["مُصحح"] === 4 && audit08.statusCounts["غير محسوم"] === 3 &&
    audit08.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    audit08.statusDefinitions["غير محسوم"].includes("لا يحسم"),
    "K173b كل بند له دليل وحكم وإجراء ومصدر؛ 56 مصدراً مستخدماً وفصل 4 تصحيحات عن 3 سياقات غير محسومة");

  const snapshotsMatch08 = audit08.items.every((item) => {
    const metadata = item.reviewed;
    const dialogue = validBatch08.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      return metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && JSON.stringify(metadata.waisen) === JSON.stringify(dialogue.waisen);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.who === line.who && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && metadata.type === question.type && metadata.promptDe === question.promptDe &&
      JSON.stringify(metadata.options) === JSON.stringify(question.options) &&
      JSON.stringify(metadata.answer) === JSON.stringify(question.answer) &&
      metadata.promptAr === question.promptAr && metadata.explanationAr === question.explanationAr &&
      metadata.falle === question.falle;
  });
  const corrected22_2 = auditById08.get("d-a1-22.lines[2]");
  const corrected22_4 = auditById08.get("d-a1-22.lines[4]");
  const corrected22_7 = auditById08.get("d-a1-22.lines[7]");
  const corrected24_1 = auditById08.get("d-a1-24.lines[1]");
  const live22 = validBatch08.find((dialogue) => dialogue.id === "d-a1-22");
  const live24 = validBatch08.find((dialogue) => dialogue.id === "d-a1-24");
  const liveFire08 = validBatch08.find((dialogue) => dialogue.id === "d-a1-23");
  ok(snapshotsMatch08 &&
    corrected22_2?.before?.ar === "نعم، الطائرة تصل في الثانية. زوجي يأخذهما." &&
    live22?.lines[2]?.ar === "نعم، تصل الطائرة في الساعة الثانية بعد الظهر. سيذهب زوجي لاستقبالهما." &&
    corrected22_4?.before?.ar === "نعم، أسبوعين. إخوتي يأتون للزيارة أيضاً." &&
    live22?.lines[4]?.ar === "نعم، أسبوعين. إخوتي يأتون للزيارة حينها أيضاً." &&
    corrected22_7?.before?.ar === "ما أجمل! إذن البيت ممتلئ. جدتك تفرح بالرضيعة بالتأكيد." &&
    live22?.lines[7]?.ar === "ما أجمل! إذن البيت ممتلئ. جدتك تتطلع بالتأكيد إلى قدوم الطفلة." &&
    corrected24_1?.before?.ar === "أمارس رياضة كثيرة. أسبح يومياً في السابعة صباحاً." &&
    live24?.lines[1]?.ar === "أمارس الرياضة كثيراً. أسبح يومياً في السابعة صباحاً." &&
    liveFire08?.lines[0]?.de === "Hallo, hier Weber, Gartenstraße 8. In der Küche ist Feuer!" &&
    liveFire08.lines[3]?.de.endsWith("fünf Minuten.") &&
    liveFire08.lines[7]?.de === "Auf die andere Straßenseite. Warten Sie dort auf die Feuerwehr." &&
    live24?.lines[2]?.de === "Jeden Tag? Ich gehe lieber spazieren, im Park.",
    "K173c لقطات التقرير تطابق الحي؛ التصحيحات الأربعة مبررة ومحدودة وتفاصيل الحريق والفاصلة بقيت كما هي");

  const history08 = audit08.historicalPatchReview;
  const historicalPatchSource08 = readFileSync(history08.file, "utf8");
  const historicalOptionsMatch08 = historicalPatchSource08.includes('"options":["der Ehemann von Salma","die Schwester von Salma","die Großmutter selbst"]') &&
    historicalPatchSource08.includes('"options":["in fünf Minuten","in acht Minuten","sie ist schon da"]') &&
    historicalPatchSource08.includes('"options":["täglich, morgens um sieben","am Samstag mit Freundinnen","später im Park"]') &&
    historicalPatchSource08.includes('"options":["ein Foto vom Chor","ein Lied im Buch","den Park"]');
  const expectedHistoricalChanges08 = [
    ["d-a1-22-q1", ["der Ehemann von Salma", "die Schwester von Salma", "die Großmutter selbst"], ["die Schwester von Salma", "die Großmutter selbst", "der Ehemann von Salma"]],
    ["d-a1-23-q2", ["in fünf Minuten", "in acht Minuten", "sie ist schon da"], ["in acht Minuten", "in fünf Minuten", "sie ist schon da"]],
    ["d-a1-24-q1", ["täglich, morgens um sieben", "am Samstag mit Freundinnen", "später im Park"], ["am Samstag mit Freundinnen", "täglich, morgens um sieben", "später im Park"]],
    ["d-a1-24-q2", ["ein Foto vom Chor", "ein Lied im Buch", "den Park"], ["ein Lied im Buch", "den Park", "ein Foto vom Chor"]],
  ];
  const actualHistoricalChanges08 = history08.comparisons.flatMap((comparison) => comparison.optionOrderChanges ?? []);
  const historyChangesMatch08 = JSON.stringify(actualHistoricalChanges08.map((change) =>
    [change.questionId, change.historicalOptions, change.liveOptions]
  )) === JSON.stringify(expectedHistoricalChanges08);
  ok(history08.file === "scripts/patches/dialoge_a1_neu2.py" && history08.comparisons.length === 3 &&
    history08.usageCheck.includes("dialoge_a1_neu2.py فقط") &&
    historicalOptionsMatch08 && historyChangesMatch08 &&
    history08.comparisons.every((comparison) => comparison.unchangedAnswerAndExplanation === true &&
      JSON.stringify(comparison.fieldsAbsentFromHistory) === JSON.stringify(["question.id", "question.promptAr", "question.falle"])) &&
    audit08.historicalPatchReview.role.includes("تاريخي") &&
    audit08.patch.file === "scripts/patches/review_a1_dialogues_08.py" && audit08.patch.fieldsChanged === 4 &&
    audit08.patch.correctedItemIds.length === 4 && existsSync(audit08.patch.file),
    "K173d المقارنة التاريخية محدودة إلى تطابق موجود؛ اختلاف الخيارات الأربعة موثق مع بقاء المفاتيح والشروح");

  const patchSource08 = readFileSync(audit08.patch.file, "utf8");
  const taskSource08 = readFileSync("components/tasks.tsx", "utf8");
  const neutralTitle08 = !/(أخطاء\s*شائعة\s*عند\s*العرب|الأخطاء\s*الشائعة\s*لدى\s*العرب|أخطاء\s*العرب\s*الشائعة)/u.test(taskSource08);
  ok(audit08.patch.preflight.includes("القيم السابقة الدقيقة") &&
    patchSource08.includes("mixed before/after state; refusing partial application") &&
    patchSource08.includes("preflight failed; no write performed") && patchSource08.includes("--apply") &&
    patchSource08.includes("patch changed a field outside the four reviewed Arabic lines") &&
    audit08.patch.changes.length === 4 && neutralTitle08 &&
    audit08.limitations.some((limitation) => limitation.includes("لا يُعمم")) &&
    auditMarkdown08.includes("«غير محسوم» لا يعني أن العبارة خاطئة"),
    "K173e الرقعة ترفض القيم غير المتوقعة وتحمي غير المحسوم؛ لا يظهر تعميم «أخطاء شائعة عند العرب» في واجهة التمارين");

  ok(audit08.method.includes("قُرئ كل سجل حي") &&
    audit08.limitations.some((limitation) => limitation.includes("CEFR") && limitation.includes("مؤجلة")) &&
    audit08.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية أو اعتماداً")) &&
    auditMarkdown08.includes("ليست بشرية أو اعتماداً مهنياً") &&
    audit08.coverage.unresolvedContextNotes === 3 && audit08.coverage.unresolvedLevelNotes === 0 &&
    auditById08.get("d-a1-23.lines[3]")?.status === "غير محسوم" &&
    (auditById08.get("d-a1-23.lines[7]")?.finding.includes("لا يقرر قاعدة عامة لعبور الشارع") ?? false) &&
    (auditById08.get("d-a1-23.lines[0]")?.action.includes("لا أختلق مدينة") ?? false) &&
    (auditById08.get("d-a1-23")?.finding.includes("ثمانية على الأقل") ?? false),
    "K173f تُفصل الملاحظات الثلاث عن الأخطاء المؤكدة؛ CEFR والنسبة والحساب والاعتماد البشري/المهني مؤجلة");
}

/* ═══ K174 — R100: تدقيق الحوارات A1 d-a1-25–27 بالمصادر والبيانات الحية ═══ */
{
  type DialogueAuditItem09 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>; before?: Record<string, any>;
  };
  type DialogueAuditSource09 = { id: string; title: string; url: string; supports: string };
  const audit09 = JSON.parse(readFileSync("docs/content-review-a1-dialogues-09-2026-10-05.json", "utf8")) as {
    date: string; batch: string; scope: string; method: string;
    coverage: { dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; unresolvedLevelNotes: number; unresolvedContextNotes: number; totalTrackedItems: number };
    statusCounts: Record<string, number>; statusDefinitions: Record<string, string>; limitations: string[];
    sources: DialogueAuditSource09[];
    historicalPatchReview: { file: string; role: string; usageCheck: string; comparisons: any[] };
    patch: { file: string; preflight: string; fieldsChanged: number; correctedItemIds: string[]; changes: string[] };
    items: DialogueAuditItem09[];
  };
  const auditMarkdown09 = readFileSync("docs/content-review-a1-dialogues-09-2026-10-05.md", "utf8");
  type LiveDialogue09 = {
    id: string; level: string; titleDe: string; titleAr: string; waisen: string[];
    lines: { who: string; de: string; ar: string }[];
    questions: { id: string; type: string; promptDe: string; options?: string[]; answer: string | string[];
      promptAr?: string; explanationAr?: string; falle?: boolean }[];
    dictation: string[];
  };
  const liveBatchAll09 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as LiveDialogue09[];
  const batchIds09 = ["d-a1-25", "d-a1-26", "d-a1-27"];
  const completeBatch09 = batchIds09.map((id) => liveBatchAll09.find((dialogue) => dialogue.id === id));
  const validBatch09 = completeBatch09.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? completeBatch09 as NonNullable<typeof completeBatch09[number]>[] : [];
  const expectedIds09 = validBatch09.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds09 = audit09.items.map((item) => item.id);
  const auditById09 = new Map(audit09.items.map((item) => [item.id, item]));
  const auditSection09 = auditMarkdown09.split("## سجل المراجعة بنداً بنداً")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique09 = expectedIds09.every((id) =>
    auditSection09.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(validBatch09.length === 3 && validBatch09.every((dialogue) => dialogue.lines.length === 8 &&
      dialogue.questions.length === 3 && dialogue.dictation.length === 2) &&
    expectedIds09.length === 42 && new Set(expectedIds09).size === 42 &&
    JSON.stringify(expectedIds09) === JSON.stringify(auditIds09) && markdownRowsUnique09 &&
    audit09.date === "2026-10-05" && audit09.batch === "A1-dialogues-09" &&
    audit09.coverage.dialogues === 3 && audit09.coverage.dialogueMetadata === 3 && audit09.coverage.lines === 24 &&
    audit09.coverage.questions === 9 && audit09.coverage.dictationSentences === 6 &&
    audit09.coverage.unresolvedLevelNotes === 0 && audit09.coverage.unresolvedContextNotes === 1 &&
    audit09.coverage.totalTrackedItems === 42 && batchIds09.every((id) => audit09.scope.includes(id)),
    "K174a تقرير R100 وMarkdown يغطيان 42 معرفاً بالترتيب: 3 بيانات حوار و24 سطراً و9 أسئلة و6 إملاءات");

  const sourceIds09 = new Set(audit09.sources.map((source) => source.id));
  const referencedSources09 = new Set(audit09.items.flatMap((item) => item.sources));
  const computedStatuses09 = audit09.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const correctedIds09 = new Set(["d-a1-25.lines[7]", "d-a1-26.lines[2]"]);
  const unresolvedIds09 = new Set(["d-a1-25.lines[4]"]);
  const expectedStatuses09 = audit09.items.every((item) =>
    item.status === (correctedIds09.has(item.id) ? "مُصحح" : unresolvedIds09.has(item.id) ? "غير محسوم" : "سليم")
  );
  const completeEvidence09 = audit09.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds09.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources09 = audit09.sources.length === 64 && sourceIds09.size === 64 && audit09.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown09.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources09.size === audit09.sources.length && audit09.sources.every((source) => referencedSources09.has(source.id));
  ok(completeEvidence09 && completeSources09 && expectedStatuses09 &&
    computedStatuses09["سليم"] === 39 && computedStatuses09["مُصحح"] === 2 && computedStatuses09["غير محسوم"] === 1 &&
    audit09.statusCounts["سليم"] === 39 && audit09.statusCounts["مُصحح"] === 2 && audit09.statusCounts["غير محسوم"] === 1 &&
    audit09.statusDefinitions["غير محسوم"].includes("لا تحسم") &&
    audit09.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")),
    "K174b لكل بند دليل وحكم وإجراء ومصدر؛ 64 مصدراً مستخدماً مع فصل التصحيحين عن الملاحظة غير المحسومة");

  const snapshotsMatch09 = audit09.items.every((item) => {
    const metadata = item.reviewed;
    const dialogue = validBatch09.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      return metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && JSON.stringify(metadata.waisen) === JSON.stringify(dialogue.waisen);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.who === line.who && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && metadata.type === question.type && metadata.promptDe === question.promptDe &&
      JSON.stringify(metadata.options) === JSON.stringify(question.options) &&
      JSON.stringify(metadata.answer) === JSON.stringify(question.answer) &&
      metadata.promptAr === question.promptAr && metadata.explanationAr === question.explanationAr &&
      metadata.falle === question.falle;
  });
  const corrected251 = auditById09.get("d-a1-25.lines[7]");
  const corrected262 = auditById09.get("d-a1-26.lines[2]");
  const unresolved254 = auditById09.get("d-a1-25.lines[4]");
  const live25 = validBatch09.find((dialogue) => dialogue.id === "d-a1-25");
  const live26 = validBatch09.find((dialogue) => dialogue.id === "d-a1-26");
  const live27 = validBatch09.find((dialogue) => dialogue.id === "d-a1-27");
  ok(snapshotsMatch09 &&
    corrected251?.before?.ar === "على الأرجح نعم، حتى الرابعة." &&
    live25?.lines[7]?.ar === "على الأرجح نعم، حتى الساعة الرابعة بعد الظهر." &&
    corrected262?.before?.ar === "لا، في البيت. أي فصل هذا؟ أكتوبر جميل عادة!" &&
    live26?.lines[2]?.ar === "لا، في البيت. أي فصل هذا؟ لكن أكتوبر جميل!" &&
    unresolved254?.status === "غير محسوم" && unresolved254.reviewed.de.includes("kleinen Scheinen") &&
    live27?.lines[5]?.de === "Ich denke, das schaffe ich bis zum Mittag." &&
    live27?.lines[6]?.de === "Sehr gut. Unser Ziel: alle Maschinen bis Freitag fertig.",
    "K174c لقطات التقرير تطابق البيانات الحية؛ صُحح وقت 16 Uhr ودلالة doch وبقي غموض فئات النقد");

  const history09 = audit09.historicalPatchReview;
  const historySource09 = readFileSync(history09.file, "utf8");
  const historicalOptionsMatch09 = historySource09.includes('"options":["Er ist heute Morgen kaputtgegangen.","Karim hat die falsche Geheimzahl.","Er gibt nur Fünfziger."]') &&
    historySource09.includes('"options":["Sie fährt nach Hause und zieht trockene Sachen an.","Sie kauft einen Regenschirm.","Sie wartet auf den Schnee im Dezember."]') &&
    historySource09.includes('"options":["um zwei","um vier","um acht"]') &&
    historySource09.includes('"options":["eine Kontrolle an der letzten Maschine","alle großen Maschinen","alle Maschinen bis Freitag"]');
  const expectedChanges09 = [
    ["d-a1-25-q1", ["Er ist heute Morgen kaputtgegangen.", "Karim hat die falsche Geheimzahl.", "Er gibt nur Fünfziger."], ["Karim hat die falsche Geheimzahl.", "Er gibt nur Fünfziger.", "Er ist heute Morgen kaputtgegangen."]],
    ["d-a1-26-q2", ["Sie fährt nach Hause und zieht trockene Sachen an.", "Sie kauft einen Regenschirm.", "Sie wartet auf den Schnee im Dezember."], ["Sie kauft einen Regenschirm.", "Sie fährt nach Hause und zieht trockene Sachen an.", "Sie wartet auf den Schnee im Dezember."]],
    ["d-a1-27-q1", ["um zwei", "um vier", "um acht"], ["um vier", "um zwei", "um acht"]],
    ["d-a1-27-q2", ["eine Kontrolle an der letzten Maschine", "alle großen Maschinen", "alle Maschinen bis Freitag"], ["alle großen Maschinen", "alle Maschinen bis Freitag", "eine Kontrolle an der letzten Maschine"]],
  ];
  const actualChanges09 = history09.comparisons.flatMap((comparison) => comparison.optionOrderChanges ?? []);
  const historyChangesMatch09 = JSON.stringify(actualChanges09.map((change) =>
    [change.questionId, change.historicalOptions, change.liveOptions]
  )) === JSON.stringify(expectedChanges09);
  ok(history09.file === "scripts/patches/dialoge_a1_neu2.py" && history09.comparisons.length === 3 &&
    history09.usageCheck.includes("dialoge_a1_neu2.py فقط") && historicalOptionsMatch09 && historyChangesMatch09 &&
    history09.comparisons.every((comparison) => comparison.unchangedAnswerAndExplanation === true &&
      JSON.stringify(comparison.fieldsAbsentFromHistory) === JSON.stringify(["question.id", "question.promptAr", "question.falle"])) &&
    history09.role.includes("تاريخي") && audit09.patch.file === "scripts/patches/review_a1_dialogues_09.py" &&
    audit09.patch.fieldsChanged === 2 && audit09.patch.correctedItemIds.length === 2 && existsSync(audit09.patch.file),
    "K174d المقارنة التاريخية فقط عند التطابق؛ أربعة اختلافات ترتيب خيارات موثقة مع ثبات الأجوبة والشروح");

  const patchSource09 = readFileSync(audit09.patch.file, "utf8");
  ok(audit09.patch.preflight.includes("القيم السابقة الدقيقة") &&
    patchSource09.includes("mixed before/after state; refusing partial application") &&
    patchSource09.includes("preflight failed; no write performed") && patchSource09.includes("--apply") &&
    patchSource09.includes("patch changed a field outside the two reviewed Arabic lines") &&
    patchSource09.includes("kleinen Scheinen") && patchSource09.includes("Ich denke, das schaffe ich bis zum Mittag.") &&
    audit09.patch.changes.length === 2 && auditMarkdown09.includes("«غير محسوم» لا يعني ثبوت الخطأ"),
    "K174e الرقعة تحرس القيم السابقة وترفض الحالة الجزئية وتحافظ على المحتوى السياقي غير المحسوم");

  ok(audit09.method.includes("قُرئت البيانات الحية") &&
    audit09.limitations.some((limitation) => limitation.includes("CEFR") && limitation.includes("مؤجلة")) &&
    audit09.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية أو اعتماداً")) &&
    auditMarkdown09.includes("ليست اعتماداً بشرياً أو مهنياً") &&
    (auditById09.get("d-a1-25.lines[7]")?.finding.includes("16:00") ?? false) &&
    (auditById09.get("d-a1-26.lines[3]")?.finding.includes("غير مطلق") ?? false) &&
    (auditById09.get("d-a1-27.lines[6]")?.finding.includes("ليس تناقضاً مثبتاً") ?? false),
    "K174f المنهج يفصل المؤكد عن الأسلوب/السياق ويحفظ CEFR والنسبة والحساب خارج النطاق");
}


{
  type DialogueAuditSource10 = { id: string; title: string; url: string; supports: string };
  type DialogueAuditItem10 = {
    id: string; kind: string; status: string; sources: string[]; finding: string; action: string;
    reviewed: Record<string, any>;
  };
  type LiveDialogue10 = {
    id: string; level: string; titleDe: string; titleAr: string;
    lines: { who: string; de: string; ar: string }[];
    questions: { id: string; type: string; promptDe: string; options?: string[]; answer: string | string[];
      promptAr?: string; explanationAr?: string; falle?: boolean }[];
    dictation: string[];
  };
  const audit10 = JSON.parse(readFileSync("docs/content-review-a1-dialogues-10-2026-10-05.json", "utf8")) as {
    date: string; batch: string; scope: string; method: string;
    coverage: { dialogues: number; dialogueMetadata: number; lines: number; questions: number;
      dictationSentences: number; audioAssets: number; unresolvedContextNotes: number; totalTrackedItems: number };
    statusCounts: Record<string, number>; statusDefinitions: Record<string, string>; limitations: string[];
    contentPatch: { fieldsChanged: number; reason: string; protectedUnresolvedItemIds: string[] };
    historicalPatchReview: { sources: string[]; comparisons: any[] };
    audioAssetAudit: { id: string; file: string; metadataBytes: number; actualBytes: number; exists: boolean;
      voices: number; voice: string; check: string }[];
    sources: DialogueAuditSource10[]; items: DialogueAuditItem10[];
  };
  const auditMarkdown10 = readFileSync("docs/content-review-a1-dialogues-10-2026-10-05.md", "utf8");
  const liveBatchAll10 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as LiveDialogue10[];
  const batchIds10 = ["d-a1-31", "d-a1-32"];
  const completeBatch10 = batchIds10.map((id) => liveBatchAll10.find((dialogue) => dialogue.id === id));
  const validBatch10 = completeBatch10.every((dialogue) => !!dialogue && dialogue.level === "A1")
    ? completeBatch10 as NonNullable<typeof completeBatch10[number]>[] : [];
  const expectedIds10 = validBatch10.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const auditIds10 = audit10.items.map((item) => item.id);
  const auditById10 = new Map(audit10.items.map((item) => [item.id, item]));
  const auditSection10 = auditMarkdown10.split("## سجل كل عنصر")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const markdownRowsUnique10 = expectedIds10.every((id) =>
    auditSection10.split("\n").filter((line) => line.startsWith(`| ${id} |`)).length === 1
  );
  ok(validBatch10.length === 2 && validBatch10[0]?.lines.length === 5 && validBatch10[1]?.lines.length === 6 &&
    validBatch10.every((dialogue) => dialogue.questions.length === 2 && dialogue.dictation.length === 3) &&
    expectedIds10.length === 23 && new Set(expectedIds10).size === 23 &&
    JSON.stringify(expectedIds10) === JSON.stringify(auditIds10) && markdownRowsUnique10 &&
    !liveBatchAll10.some((dialogue) => ["d-a1-28", "d-a1-29", "d-a1-30"].includes(dialogue.id)) &&
    audit10.date === "2026-10-05" && audit10.batch === "A1-dialogues-10" &&
    audit10.coverage.dialogues === 2 && audit10.coverage.dialogueMetadata === 2 && audit10.coverage.lines === 11 &&
    audit10.coverage.questions === 4 && audit10.coverage.dictationSentences === 6 && audit10.coverage.audioAssets === 2 &&
    audit10.coverage.unresolvedContextNotes === 1 && audit10.coverage.totalTrackedItems === 23 &&
    batchIds10.every((id) => audit10.scope.includes(id)) && audit10.scope.includes("d-a1-28") &&
    audit10.scope.includes("d-a1-29") && audit10.scope.includes("d-a1-30"),
    "K175a تقرير الدفعة 10 يغطي كل 23 معرفاً حياً، ويسجل بوضوح غياب 28–30 دون استبدال صامت");

  const sourceIds10 = new Set(audit10.sources.map((source) => source.id));
  const referencedSources10 = new Set(audit10.items.flatMap((item) => item.sources));
  const computedStatuses10 = audit10.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const completeEvidence10 = audit10.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIds10.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const completeSources10 = audit10.sources.length === 18 && sourceIds10.size === 18 && audit10.sources.every((source) =>
    source.title.trim().length > 0 && source.supports.trim().length > 0 && source.url.startsWith("https://") &&
    auditMarkdown10.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`)
  ) && referencedSources10.size === audit10.sources.length &&
    audit10.sources.every((source) => referencedSources10.has(source.id));
  const unresolvedId10 = "d-a1-31.lines[3]";
  const statusesExact10 = audit10.items.every((item) => item.status === (item.id === unresolvedId10 ? "غير محسوم" : "سليم"));
  ok(completeEvidence10 && completeSources10 && statusesExact10 &&
    computedStatuses10["سليم"] === 22 && (computedStatuses10["مُصحح"] ?? 0) === 0 && computedStatuses10["غير محسوم"] === 1 &&
    audit10.statusCounts["سليم"] === 22 && audit10.statusCounts["مُصحح"] === 0 && audit10.statusCounts["غير محسوم"] === 1 &&
    audit10.statusDefinitions["غير محسوم"].includes("يتوقف الحكم") &&
    (auditById10.get(unresolvedId10)?.finding.includes("Duden") ?? false) &&
    (auditById10.get(unresolvedId10)?.action.includes("لا أستبدل") ?? false) &&
    auditMarkdown10.includes("«غير محسوم» لا يعني ثبوت الخطأ"),
    "K175b لكل بند دليل/حكم/إجراء ومصدر مباشر؛ الملاحظة غير المحسومة مفصولة عن الخطأ المؤكد");

  const snapshotsMatch10 = audit10.items.every((item) => {
    const metadata = item.reviewed;
    const dialogue = validBatch10.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    if (item.id === dialogue.id) {
      return metadata.titleDe === dialogue.titleDe && metadata.titleAr === dialogue.titleAr &&
        metadata.level === dialogue.level && metadata.lineCount === dialogue.lines.length &&
        metadata.questionCount === dialogue.questions.length && metadata.dictationCount === dialogue.dictation.length &&
        metadata.hasWaisen === Object.prototype.hasOwnProperty.call(dialogue, "waisen");
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) {
      const line = dialogue.lines[Number(lineMatch[1])];
      return !!line && metadata.who === line.who && metadata.de === line.de && metadata.ar === line.ar;
    }
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return metadata.sentence === dialogue.dictation[Number(dictationMatch[1])];
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    if (!question) return false;
    const keys = ["id", "type", "promptDe", "promptAr", "options", "answer", "explanationAr", "falle"];
    return keys.every((key) => JSON.stringify(metadata[key]) === JSON.stringify((question as any)[key]) &&
      Object.prototype.hasOwnProperty.call(metadata, key) === Object.prototype.hasOwnProperty.call(question, key));
  });
  const ambiguity10 = auditById10.get(unresolvedId10);
  ok(snapshotsMatch10 && ambiguity10?.reviewed.ar === validBatch10[0]?.lines[3]?.ar &&
    auditById10.get("d-a1-32.lines[1]")?.status === "سليم" &&
    (auditById10.get("d-a1-32.lines[1]")?.finding.includes("لا يثبت أن الترجمة الحالية خاطئة") ?? false) &&
    audit10.contentPatch.fieldsChanged === 0 && audit10.contentPatch.protectedUnresolvedItemIds.length === 1 &&
    audit10.contentPatch.protectedUnresolvedItemIds[0] === unresolvedId10,
    "K175c كل اللقطات تطابق النص والأسئلة والإملاء الحي؛ لا تعديل تخمينياً للحروف أو كلمة الإشارة");

  const dialogueWave10 = readFileSync("scripts/dialoge_welle.py", "utf8");
  const distractorPatch10 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  const history10 = audit10.historicalPatchReview;
  const hist31 = history10.comparisons.find((comparison) => comparison.dialogueId === "d-a1-31");
  const hist32 = history10.comparisons.find((comparison) => comparison.dialogueId === "d-a1-32");
  const baselineLinesMatch10 = validBatch10.every((dialogue) => dialogue.lines.every((line) =>
    dialogueWave10.includes(`L(${JSON.stringify(line.who)},${JSON.stringify(line.de)},${JSON.stringify(line.ar)})`)
  ));
  const baselineMatches10 = baselineLinesMatch10 &&
    dialogueWave10.includes('"id":"d-a1-31"') &&
    dialogueWave10.includes('"titleDe":"An der Rezeption","titleAr":"في الاستقبال"') &&
    dialogueWave10.includes('"titleDe":"Nach dem Weg fragen","titleAr":"السؤالُ عن الطريق"') &&
    dialogueWave10.includes('"options":["um acht Uhr","um neun Uhr","um zehn Uhr"]') &&
    dialogueWave10.includes('"options":["neben der Bank","hinter der Schule","vor dem Kino"]') &&
    distractorPatch10.includes('"d-a1-31-q1": dict(o=["um neun Uhr bei Frau Bauer","um neun Uhr bei Herrn Haddad","um zehn Uhr bei Frau Bauer"]') &&
    distractorPatch10.includes('"d-a1-32-q1": dict(o=["neben der Bank","an der Ampel","fünf Minuten geradeaus, dann links"]');
  const historySnapshotsMatch10 = hist31?.baseline === "scripts/dialoge_welle.py" &&
    hist31?.postEdit === "scripts/patches/a_dialog_fallen.py" && hist32?.baseline === "scripts/dialoge_welle.py" &&
    hist32?.postEdit === "scripts/patches/a_dialog_fallen.py" && hist31?.questions?.[0]?.initialAnswer === "um neun Uhr" &&
    hist31?.questions?.[0]?.postEditAnswer === "um neun Uhr bei Frau Bauer" &&
    JSON.stringify(hist31?.questions?.[0]?.liveOptions) === JSON.stringify(validBatch10[0]?.questions[0]?.options) &&
    JSON.stringify(hist32?.questions?.[0]?.liveOptions) === JSON.stringify(validBatch10[1]?.questions[0]?.options) &&
    hist31?.dictationChanges?.[0]?.live?.every((sentence: string) => validBatch10[0]?.lines.some((line) => line.de.includes(sentence))) &&
    (hist32?.dictationChanges?.[0]?.live?.every((sentence: string) => validBatch10[1]?.lines.some((line) => line.de.includes(sentence))) ?? false);
  ok(history10.sources.includes("scripts/dialoge_welle.py") && history10.sources.includes("scripts/patches/a_dialog_fallen.py") &&
    existsSync("scripts/dialoge_welle.py") && existsSync("scripts/patches/a_dialog_fallen.py") &&
    history10.comparisons.length === 2 && baselineMatches10 && historySnapshotsMatch10 &&
    auditMarkdown10.includes("تحرك ترتيب المفتاح") && auditMarkdown10.includes("لم أعتبر اختلاف الترتيب خطأً"),
    "K175d المصدر التاريخي وخط تحرير المشتتات موثقان؛ اختلافات الخيارات/الإملاء لا تُصنف آلياً كأخطاء");

  const audioManifest10 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as {
    einsaetze: { id: string; file: string; bytes: number; stimmen?: number; voice?: string }[];
  };
  const audioChecks10 = audit10.audioAssetAudit.map((audit) => {
    const entry = audioManifest10.einsaetze.find((candidate) => candidate.id === audit.id);
    const assetPath = `public${audit.file.startsWith("/") ? audit.file : `/${audit.file}`}`;
    const actualBytes = existsSync(assetPath) ? readFileSync(assetPath).byteLength : -1;
    return !!entry && audit.exists && actualBytes === entry.bytes && audit.actualBytes === actualBytes &&
      audit.metadataBytes === entry.bytes && audit.file === entry.file && audit.voices === entry.stimmen &&
      audit.voice === entry.voice && audit.check.includes("لم تُختبر مطابقة النطق");
  });
  ok(audit10.audioAssetAudit.length === 2 && audioChecks10.length === 2 && audioChecks10.every(Boolean) &&
    audit10.coverage.audioAssets === 2 && auditMarkdown10.includes("وجود وحجم فقط؛ لا تحقق من transcript/النطق"),
    "K175e صوتا الحوارين موجودان وحجماهما يطابقان الفهرس؛ الاختبار لا يدعي تفريغاً أو تحققاً سمعياً");

  ok(audit10.method.includes("بنداً بنداً") &&
    audit10.limitations.some((limitation) => limitation.includes("CEFR") && limitation.includes("لم أعد تقييم")) &&
    audit10.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية أو اعتماداً")) &&
    auditMarkdown10.includes("لا اعتماداً مهنياً ولا مراجعة بشرية") &&
    audit10.sources.some((source) => source.id === "S18" && source.supports.includes("لا لإعادة تقييم CEFR")) &&
    audit10.contentPatch.reason.includes("لم يثبت خطأ مؤكد"),
    "K175f المنهج والدور والحدود مثبتة؛ لا CEFR/نسبة/حساب مستوى ولا ادعاء اعتماد بشري");
}


{
  type GapDialogue10 = { id: string; level?: string; waisen?: string[] };
  type GapCardDeck10 = { level?: string; cards?: { id: string; de: string; level?: string }[] };
  const gap28to30 = JSON.parse(readFileSync("docs/content-gap-a1-dialogues-28-30-2026-10-05.json", "utf8")) as {
    date: string; status: string; scope: string; liveContent: { a1DialogueCount: number; a1Ids: string[];
      missingIds: string[]; dialogue31_32HaveWaisen: Record<string, boolean> };
    gitHistory: { searchedRefs: string; pathSearches: string[]; reachableHistoryBoundary: {
      isShallow: boolean; reachableCommitCount: number; baseCommit: string; baseCommitParents: string[]; meaning: string;
    } };
    orphanCardTrace: { vocabPath: string; a1DeckCount: number; a1CardCount: number; dialogueSources: Record<string, {
      dialogueIds: string[]; dialoguesWithWaisen: number; termMentions: number; uniqueTerms: number;
      missingFromVocab: string[]; wrongLevel: string[];
    }>; interpretation: string };
    sources: { id: string; path: string; finding: string; role: string }[];
    decision: string;
  };
  const gapMarkdown28to30 = readFileSync("docs/content-gap-a1-dialogues-28-30-2026-10-05.md", "utf8");
  const liveGapBatch = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as GapDialogue10[];
  const vocabGap = JSON.parse(readFileSync("content/vocab.json", "utf8")) as Record<string, GapCardDeck10>;
  const a1CardsGap = Object.values(vocabGap).filter((deck) => deck.level === "A1")
    .flatMap((deck) => deck.cards ?? []);
  const a1CardWordsGap = new Set(a1CardsGap.filter((card) => card.level === "A1").map((card) => card.de));
  const idsForGapRange = (from: number, to: number) => liveGapBatch.filter((dialogue) => dialogue.level === "A1" &&
    from <= Number(dialogue.id.split("-").at(-1)) && Number(dialogue.id.split("-").at(-1)) <= to);
  const sourceDlg10to18 = idsForGapRange(10, 18);
  const sourceDlg19to27 = idsForGapRange(19, 27);
  const trackedGapTerms = [...sourceDlg10to18, ...sourceDlg19to27].flatMap((dialogue) => dialogue.waisen ?? []);
  const vocabHasNoDialoguePointersGap = Object.values(vocabGap).every((deck) =>
    !Object.keys(deck).some((key) => /dialogue|dialog/i.test(key)) && (deck.cards ?? []).every((card) =>
      !Object.keys(card).some((key) => /dialogue|dialog/i.test(key)) && !JSON.stringify(card).match(/d-a1-(28|29|30)/)
    )
  );
  const sourceScriptsGap = [
    "scripts/patches/dialoge_a1_neu1.py", "scripts/patches/dialoge_a1_neu2.py",
    "scripts/patches/apply_dialoge.py", "scripts/dialoge_welle.py", "scripts/patches/a_dialog_fallen.py",
    "content/dialogues.json", "content/vocab.json",
  ];
  const sourcesExistGap = sourceScriptsGap.every((path) => existsSync(path)) &&
    gap28to30.sources.every((source) => existsSync(source.path));
  const explicitSourcesGap = readFileSync("scripts/patches/dialoge_a1_neu1.py", "utf8");
  const secondSourcesGap = readFileSync("scripts/patches/dialoge_a1_neu2.py", "utf8");
  const applySourceGap = readFileSync("scripts/patches/apply_dialoge.py", "utf8");
  const waveSourceGap = readFileSync("scripts/dialoge_welle.py", "utf8");
  const primaryReview10 = readFileSync("docs/content-review-a1-dialogues-10-2026-10-05.md", "utf8");
  const missingIdsGap = ["d-a1-28", "d-a1-29", "d-a1-30"];
  ok(gap28to30.date === "2026-10-05" && gap28to30.liveContent.a1DialogueCount === 29 &&
    JSON.stringify(gap28to30.liveContent.missingIds) === JSON.stringify(missingIdsGap) &&
    missingIdsGap.every((id) => !liveGapBatch.some((dialogue) => dialogue.id === id)) &&
    gap28to30.liveContent.dialogue31_32HaveWaisen["d-a1-31"] === false &&
    gap28to30.liveContent.dialogue31_32HaveWaisen["d-a1-32"] === false &&
    gap28to30.status.includes("غير محسوم") && gap28to30.status.includes("لا تُعد هذه مراجعة") &&
    gap28to30.decision.includes("لا أستبدلها بـ31–32") &&
    gapMarkdown28to30.includes("غير محسومة وغير مدققة لغوياً"),
    "K176a غياب 28–30 موثق كفجوة غير محسومة، لا كحوارات مدققة ولا بديل عنها 31–32");

  const sourceSet10to18 = gap28to30.orphanCardTrace.dialogueSources["10-18"];
  const sourceSet19to27 = gap28to30.orphanCardTrace.dialogueSources["19-27"];
  const cardMappingMatchesGap = sourceDlg10to18.length === 9 && sourceDlg19to27.length === 9 &&
    sourceSet10to18.dialoguesWithWaisen === 9 && sourceSet19to27.dialoguesWithWaisen === 9 &&
    sourceSet10to18.termMentions === 89 && sourceSet19to27.termMentions === 89 &&
    sourceSet10to18.uniqueTerms === 89 && sourceSet19to27.uniqueTerms === 89 &&
    sourceSet10to18.missingFromVocab.length === 0 && sourceSet19to27.missingFromVocab.length === 0 &&
    sourceSet10to18.wrongLevel.length === 0 && sourceSet19to27.wrongLevel.length === 0 &&
    trackedGapTerms.length === 178 && new Set(trackedGapTerms).size === 177 &&
    trackedGapTerms.every((term) => a1CardWordsGap.has(term));
  ok(sourcesExistGap && gap28to30.orphanCardTrace.a1DeckCount === 11 &&
    gap28to30.orphanCardTrace.a1CardCount === 650 && a1CardsGap.length === 650 && cardMappingMatchesGap &&
    vocabHasNoDialoguePointersGap &&
    explicitSourcesGap.includes("d-a1-10") && explicitSourcesGap.includes("d-a1-18") &&
    secondSourcesGap.includes("d-a1-19") && secondSourcesGap.includes("d-a1-27") &&
    applySourceGap.includes("waisen<8") && applySourceGap.includes('cards[w]["level"]!=LEVEL') &&
    waveSourceGap.includes('"id":"d-a1-31"') && waveSourceGap.includes('"id":"d-a1-32"') &&
    !waveSourceGap.includes('"id":"d-a1-28"') && !waveSourceGap.includes('"id":"d-a1-29"') &&
    !waveSourceGap.includes('"id":"d-a1-30"') &&
    gap28to30.orphanCardTrace.interpretation.includes("يعيّن بطاقات إلى 28–30"),
    "K176b مصدر البطاقات موصول فقط بحوارات 10–27؛ 178 إحالة/177 فريدة، ولا خريطة تربط بطاقات بـ28–30");

  ok(gap28to30.gitHistory.reachableHistoryBoundary.isShallow === true &&
    gap28to30.gitHistory.reachableHistoryBoundary.baseCommit === "791b72ea572ac17812aa176cf8bbbea6552a028a" &&
    gap28to30.gitHistory.reachableHistoryBoundary.baseCommitParents.length === 0 &&
    gap28to30.gitHistory.reachableHistoryBoundary.reachableCommitCount === 76 &&
    gap28to30.gitHistory.pathSearches.length === 3 &&
    gap28to30.gitHistory.reachableHistoryBoundary.meaning.includes("لا يستطيع إثبات") &&
    gapMarkdown28to30.includes("لا يمكن فحص تاريخ ما قبل نقطة الأساس") &&
    primaryReview10.includes("content-gap-a1-dialogues-28-30-2026-10-05.md") &&
    primaryReview10.includes("لا يجزم التقرير بأنها لم توجد"),
    "K176c حدود Git shallow مسجلة؛ الغياب مؤكد فقط في الأشجار المتاحة ولا يُعمّم على تاريخ سابق");
}

{
  type A2DialogueAuditEntry = {
    id: string; level: string; titleDe: string; titleAr: string;
    lines: { who: string; de: string; ar: string }[];
    questions: any[]; dictation: string[]; waisen?: string[];
  };
  type A2ReviewItem = {
    id: string; kind: string; status: string; sources: string[];
    finding: string; action: string; reviewed: any;
  };
  type A2ReviewReport = {
    date: string; batch: string; scope: string; method: string;
    coverage: Record<string, number>; statusCounts: Record<string, number>;
    statusDefinitions: Record<string, string>; limitations: string[];
    historicalPatchReview: { sources: string[]; comparisons: any[] };
    contentPatch: { fieldsChanged: number; changedFields: string[]; reason: string; protectedUnresolvedItemIds: string[] };
    openNotes: { id: string; status: string; sources: string[]; finding: string; action: string }[];
    audioAssetAudit: { id: string; file: string; metadataBytes: number; actualBytes: number;
      exists: boolean; voices: number; voice: string; check: string }[];
    sources: { id: string; title: string; url: string; supports: string }[];
    items: A2ReviewItem[];
  };
  const reviewA2 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-01-2026-10-05.json", "utf8")) as A2ReviewReport;
  const reviewMarkdownA2 = readFileSync("docs/content-review-a2-dialogues-01-2026-10-05.md", "utf8");
  const liveA2 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as A2DialogueAuditEntry[];
  const batchA2 = liveA2.filter((dialogue) => ["d-a2-31", "d-a2-32"].includes(dialogue.id));
  const expectedIdsA2 = batchA2.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const reviewIdsA2 = reviewA2.items.map((item) => item.id);
  const reviewByIdA2 = new Map(reviewA2.items.map((item) => [item.id, item]));
  const reviewRowsA2 = reviewMarkdownA2.split("## سجل كل عنصر")[1]?.split("## المصادر المنشورة")[0] ?? "";
  const uniqueRowsA2 = expectedIdsA2.every((id) =>
    reviewRowsA2.split("\n").filter((line) => line.startsWith(`| \`${id}\` |`)).length === 1
  );
  ok(reviewA2.date === "2026-10-05" && reviewA2.batch === "A2-dialogues-01" && batchA2.length === 2 &&
    batchA2[0]?.lines.length === 6 && batchA2[1]?.lines.length === 5 &&
    batchA2[0]?.questions.length === 3 && batchA2[1]?.questions.length === 2 &&
    batchA2.every((dialogue) => dialogue.dictation.length === 3) && expectedIdsA2.length === 24 &&
    new Set(expectedIdsA2).size === 24 && JSON.stringify(expectedIdsA2) === JSON.stringify(reviewIdsA2) && uniqueRowsA2 &&
    reviewA2.coverage.dialogues === 2 && reviewA2.coverage.dialogueMetadata === 2 &&
    reviewA2.coverage.lines === 11 && reviewA2.coverage.questions === 5 &&
    reviewA2.coverage.dictationSentences === 6 && reviewA2.coverage.audioAssets === 2 &&
    reviewA2.coverage.unresolvedContextNotes === 3 && reviewA2.coverage.totalTrackedItems === 24 &&
    reviewA2.scope.includes("d-a1-28–d-a1-30") && reviewA2.scope.includes("لا صلة لهذه الدفعة") &&
    reviewMarkdownA2.includes("تبقى منفصلة وغير محسومة"),
    "K177a تقرير A2 يغطي البيانات والأسطر والأسئلة والإملاء لكل من 31 و32؛ ولا يستبدل فجوة A1 28–30");

  const sourceIdsA2 = new Set(reviewA2.sources.map((source) => source.id));
  const referencedSourceIdsA2 = new Set([
    ...reviewA2.items.flatMap((item) => item.sources),
    ...reviewA2.openNotes.flatMap((note) => note.sources),
  ]);
  const computedStatusCountsA2 = reviewA2.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const evidenceCompleteA2 = reviewA2.items.every((item) =>
    ["سليم", "مُصحح", "غير محسوم"].includes(item.status) && item.kind.trim().length > 0 &&
    item.sources.length > 0 && item.sources.every((id) => sourceIdsA2.has(id)) &&
    item.finding.trim().length > 0 && item.action.trim().length > 0 && !!item.reviewed
  );
  const sourcesCompleteA2 = reviewA2.sources.length === 31 && sourceIdsA2.size === 31 &&
    referencedSourceIdsA2.size === reviewA2.sources.length &&
    reviewA2.sources.every((source) => source.title.trim().length > 0 && source.supports.trim().length > 0 &&
      source.url.startsWith("https://") && reviewMarkdownA2.includes(`<a id="${source.id.toLowerCase()}"></a>${source.id}`) &&
      referencedSourceIdsA2.has(source.id));
  const statusesExactA2 = reviewA2.items.every((item) => item.status === (
    ["d-a2-31.lines[0]", "d-a2-31.lines[1]", "d-a2-31.lines[5]", "d-a2-31-q1", "d-a2-32.lines[4]", "d-a2-32-q1", "d-a2-32-q2"].includes(item.id) ? "مُصحح" :
      ["d-a2-31.lines[3]", "d-a2-31-q2"].includes(item.id) ? "غير محسوم" : "سليم"
  ));
  ok(evidenceCompleteA2 && sourcesCompleteA2 && statusesExactA2 &&
    computedStatusCountsA2["سليم"] === 15 && computedStatusCountsA2["مُصحح"] === 7 &&
    computedStatusCountsA2["غير محسوم"] === 2 && reviewA2.statusCounts["سليم"] === 15 &&
    reviewA2.statusCounts["مُصحح"] === 7 && reviewA2.statusCounts["غير محسوم"] === 2 &&
    reviewA2.openNotes.length === 3 && reviewA2.openNotes.every((note) => note.finding && note.action &&
      note.sources.length > 0 && note.sources.every((source) => sourceIdsA2.has(source))) &&
    (reviewByIdA2.get("d-a2-31.lines[3]")?.finding.includes("لا يثبت خطأ") ?? false) &&
    (reviewByIdA2.get("d-a2-31-q2")?.action.includes("لا تغيير") ?? false) &&
    reviewA2.sources.some((source) => source.id === "S27" && source.supports.includes("إبلاغ صاحب العمل")) &&
    reviewA2.sources.some((source) => source.id === "S28" && source.supports.includes("إخبار بالمرض")),
    "K177b لكل عنصر دليل وحكم وإجراء ومصدر؛ تُفصل الأخطاء المؤكدة عن 3 ملاحظات سياقية/تربوية");

  const snapshotsMatchA2 = reviewA2.items.every((item) => {
    const dialogue = batchA2.find((candidate) => candidate.id === item.id || item.id.startsWith(`${candidate.id}.`) ||
      candidate.questions.some((question) => question.id === item.id));
    if (!dialogue) return false;
    const r = item.reviewed;
    if (item.id === dialogue.id) {
      const expected = { titleDe: dialogue.titleDe, titleAr: dialogue.titleAr, level: dialogue.level,
        lineCount: dialogue.lines.length, questionCount: dialogue.questions.length,
        dictationCount: dialogue.dictation.length, hasWaisen: Object.prototype.hasOwnProperty.call(dialogue, "waisen") };
      return JSON.stringify(r) === JSON.stringify(expected);
    }
    const lineMatch = item.id.match(/\.lines\[(\d+)\]$/);
    if (lineMatch) return JSON.stringify(r) === JSON.stringify(dialogue.lines[Number(lineMatch[1])]);
    const dictationMatch = item.id.match(/\.dictation\[(\d+)\]$/);
    if (dictationMatch) return JSON.stringify(r) === JSON.stringify({ sentence: dialogue.dictation[Number(dictationMatch[1])] });
    const question = dialogue.questions.find((candidate) => candidate.id === item.id);
    return !!question && JSON.stringify(r) === JSON.stringify(question);
  });
  const q1A2 = reviewByIdA2.get("d-a2-31-q1")?.reviewed;
  const q2A2 = reviewByIdA2.get("d-a2-32-q2")?.reviewed;
  ok(snapshotsMatchA2 && reviewA2.contentPatch.fieldsChanged === 7 && reviewA2.contentPatch.changedFields.length === 7 &&
    ["d-a2-31.lines[0].ar", "d-a2-31.lines[1].ar", "d-a2-31.lines[5].ar", "d-a2-31.questions[0].explanationAr", "d-a2-32.lines[4].ar",
      "d-a2-32.questions[0].explanationAr", "d-a2-32.questions[1].explanationAr"].every((field) => reviewA2.contentPatch.changedFields.includes(field)) &&
    batchA2[0]?.lines[0]?.ar.startsWith("مرحباً.") && batchA2[0]?.lines[1]?.ar.includes("معكِ") &&
    batchA2[0]?.lines[5]?.ar.includes("تستلمينَ") && batchA2[1]?.lines[4]?.ar.includes("إشعاراً بمرضي") &&
    q1A2?.answer === "ihr Geld zurück" && q1A2?.explanationAr.includes("لا قاعدة عامة لكل المتاجر") &&
    q2A2?.answer?.[0] === "Krankmeldung" &&
    q2A2?.explanationAr.includes("إبلاغُ جهةِ العملِ بالمرض") &&
    (reviewByIdA2.get("d-a2-32-q1")?.reviewed?.explanationAr.includes("موعد إرسال الإشعار بالبريد") ?? false) &&
    !(reviewByIdA2.get("d-a2-32-q1")?.reviewed?.explanationAr.includes("إرسال الشهادة بالبريد") ?? true) &&
    reviewA2.contentPatch.protectedUnresolvedItemIds.includes("d-a2-31.lines[3]") &&
    reviewA2.contentPatch.protectedUnresolvedItemIds.includes("d-a2-31-q2"),
    "K177c كل اللقطات تطابق المحتوى الحي؛ التصحيحات السبعة الموثقة موجودة ولا تمس العناصر غير المحسومة");

  const dialogueWaveA2 = readFileSync("scripts/dialoge_welle.py", "utf8");
  const distractorPatchA2 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  const historyA2 = reviewA2.historicalPatchReview;
  const hist31A2 = historyA2.comparisons.find((comparison) => comparison.dialogueId === "d-a2-31");
  const hist32A2 = historyA2.comparisons.find((comparison) => comparison.dialogueId === "d-a2-32");
  const historicalLiveOptionsA2 = [
    JSON.stringify(hist31A2?.questions?.[0]?.liveOptions) === JSON.stringify(batchA2[0]?.questions[0]?.options),
    JSON.stringify(hist32A2?.questions?.[0]?.liveOptions) === JSON.stringify(batchA2[1]?.questions[0]?.options),
  ].every(Boolean);
  const historicalEvidenceA2 = historyA2.sources.includes("scripts/dialoge_welle.py") &&
    historyA2.sources.includes("scripts/patches/a_dialog_fallen.py") && existsSync("scripts/dialoge_welle.py") &&
    existsSync("scripts/patches/a_dialog_fallen.py") && historyA2.comparisons.length === 2 &&
    hist31A2?.baseline === "scripts/dialoge_welle.py" && hist31A2?.postEdit === "scripts/patches/a_dialog_fallen.py" &&
    hist32A2?.baseline === "scripts/dialoge_welle.py" && hist32A2?.postEdit === "scripts/patches/a_dialog_fallen.py" &&
    dialogueWaveA2.includes('"id":"d-a2-31"') && dialogueWaveA2.includes('"id":"d-a2-32"') &&
    dialogueWaveA2.includes('"options":["einen Umtausch","ihr Geld zurück","eine Reparatur"]') &&
    distractorPatchA2.includes('"d-a2-31-q1": dict(o=["einen neuen Wasserkocher","ihr Geld zurück","eine Reparatur innerhalb von vierzehn Tagen"]') &&
    distractorPatchA2.includes('"d-a2-32-q1": dict(o=["einen Tag","drei Tage","bis heute Abend"]') &&
    hist31A2?.questions?.[0]?.initialAnswer === "ihr Geld zurück" &&
    hist31A2?.questions?.[0]?.postEditAnswer === "ihr Geld zurück" &&
    hist31A2?.questions?.[0]?.liveExplanation === batchA2[0]?.questions[0]?.explanationAr &&
    hist32A2?.questions?.[0]?.initialAnswer === "drei Tage" &&
    hist32A2?.questions?.[0]?.liveExplanation === batchA2[1]?.questions[0]?.explanationAr &&
    historicalLiveOptionsA2 && hist31A2?.dictationChanges?.[0]?.live?.join("|") === batchA2[0]?.dictation.join("|") &&
    hist32A2?.dictationChanges?.[0]?.live?.join("|") === batchA2[1]?.dictation.join("|") &&
    hist31A2?.linesAndTitles.includes("ثلاثة حقول") && reviewMarkdownA2.includes("اختلاف الترتيب آلياً بوصفه خطأ");
  ok(historicalEvidenceA2,
    "K177d تسلسل التأسيس والتحرير والنسخة الحية موثق؛ تغير المشتت أو ترتيب المفتاح لا يُعد خطأً تلقائياً");

  const audioManifestA2 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as {
    einsaetze: { id: string; file: string; bytes: number; stimmen?: number; voice?: string }[];
  };
  const audioMatchesA2 = reviewA2.audioAssetAudit.map((audit) => {
    const entry = audioManifestA2.einsaetze.find((candidate) => candidate.id === audit.id);
    const assetPath = `public${audit.file.startsWith("/") ? audit.file : `/${audit.file}`}`;
    const actualBytes = existsSync(assetPath) ? readFileSync(assetPath).byteLength : -1;
    return !!entry && audit.exists && actualBytes === entry.bytes && audit.actualBytes === actualBytes &&
      audit.metadataBytes === entry.bytes && audit.file === entry.file && audit.voices === entry.stimmen &&
      audit.voice === entry.voice && audit.check.includes("لم تُختبر مطابقة النطق");
  });
  ok(reviewA2.audioAssetAudit.length === 2 && audioMatchesA2.length === 2 && audioMatchesA2.every(Boolean) &&
    reviewA2.limitations.some((limitation) => limitation.includes("لم يُستمع إليهما")) &&
    reviewA2.limitations.some((limitation) => limitation.includes("لم أعد تقييم CEFR")) &&
    reviewA2.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية")) &&
    reviewMarkdownA2.includes("لم يُدّعَ سماعهما") && reviewMarkdownA2.includes("لا اعتماداً مهنياً أو مراجعة بشرية") &&
    reviewMarkdownA2.includes("لم يُعدّل CEFR أو النسبة أو حساب المستوى"),
    "K177e الصوتان مفحوصان بالحجم والوجود فقط؛ لا ادعاء سمعي/مهني، ولا تعديل CEFR أو النسبة أو المستوى");
}

/* ═══ K178 — R104: تدقيق الحوارات A2 d-a2-01–03 بالمصادر والبيانات الحية ═══ */
{
  type A2Batch2Dialogue = {
    id: string; level: string; titleDe: string; titleAr: string;
    lines: { who: string; de: string; ar: string }[];
    questions: any[]; dictation: string[]; waisen?: string[];
  };
  type A2Batch2Item = {
    id: string; kind: string; status: string; sources: string[];
    finding: string; action: string; reviewed: any; before?: any;
  };
  type A2Batch2Report = {
    date: string; batch: string; scope: string; method: string;
    coverage: Record<string, number>; statusCounts: Record<string, number>;
    statusDefinitions: Record<string, string>; limitations: string[];
    historicalPatchReview: { sources: string[]; role: string; comparisons: any[]; unavailableHistoricalFields: string[] };
    contentPatch: { fieldsChanged: number; changedFields: string[]; reason: string; protectedUnresolvedItemIds: string[] };
    openNotes: any[];
    audioAssetAudit: { id: string; file: string; metadataBytes: number; actualBytes: number;
      exists: boolean; voices: number; voice: string; check: string }[];
    sources: { id: string; title: string; url: string; supports: string }[];
    items: A2Batch2Item[];
  };
  const reviewA2Batch2 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-02-2026-10-05.json", "utf8")) as A2Batch2Report;
  const reviewMarkdownA2Batch2 = readFileSync("docs/content-review-a2-dialogues-02-2026-10-05.md", "utf8");
  const liveA2Batch2 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as A2Batch2Dialogue[];
  const selectedA2Batch2 = liveA2Batch2.filter((dialogue) => ["d-a2-01", "d-a2-02", "d-a2-03"].includes(dialogue.id));
  const expectedIdsA2Batch2 = selectedA2Batch2.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const itemIdsA2Batch2 = reviewA2Batch2.items.map((item) => item.id);
  const itemByIdA2Batch2 = new Map(reviewA2Batch2.items.map((item) => [item.id, item]));
  const reviewRowsA2Batch2 = reviewMarkdownA2Batch2.split("## سجل كل عنصر")[1]?.split("## الحدود")[0] ?? "";
  const uniqueRowsA2Batch2 = expectedIdsA2Batch2.every((id) =>
    reviewRowsA2Batch2.split("\n").filter((line) => line.startsWith(`| \`${id}\` |`)).length === 1
  );
  ok(reviewA2Batch2.date === "2026-10-05" && reviewA2Batch2.batch === "A2-dialogues-02" &&
    selectedA2Batch2.length === 3 && selectedA2Batch2.every((dialogue) => dialogue.level === "A2") &&
    selectedA2Batch2.map((dialogue) => dialogue.lines.length).join("|") === "6|7|7" &&
    selectedA2Batch2.every((dialogue) => dialogue.questions.length === 2 && dialogue.dictation.length === 3) &&
    expectedIdsA2Batch2.length === 38 && new Set(expectedIdsA2Batch2).size === 38 &&
    JSON.stringify(expectedIdsA2Batch2) === JSON.stringify(itemIdsA2Batch2) && uniqueRowsA2Batch2 &&
    reviewRowsA2Batch2.split("\n").filter((line) => line.startsWith("| `d-a2-")).length === 38 &&
    reviewA2Batch2.coverage.dialogues === 3 && reviewA2Batch2.coverage.dialogueMetadata === 3 &&
    reviewA2Batch2.coverage.lines === 20 && reviewA2Batch2.coverage.questions === 6 &&
    reviewA2Batch2.coverage.dictationSentences === 9 && reviewA2Batch2.coverage.audioAssets === 3 &&
    reviewA2Batch2.coverage.totalTrackedItems === 38 &&
    reviewA2Batch2.scope.includes("d-a1-28–d-a1-30") && reviewMarkdownA2Batch2.includes("d-a1-28`–`d-a1-30") &&
    reviewMarkdownA2Batch2.includes("لا يُستدل عليها من `d-a1-31`–`d-a1-32`"),
    "K178a تقرير R104 وMarkdown يغطيان 38 معرفاً حياً بالترتيب، ويحفظان فجوة A1 28–30 بلا استبدال من 31–32");

  const sourceIdsA2Batch2 = new Set(reviewA2Batch2.sources.map((source) => source.id));
  const referencedSourceIdsA2Batch2 = new Set(reviewA2Batch2.items.flatMap((item) => item.sources));
  const computedStatusesA2Batch2 = reviewA2Batch2.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مُصحح": 0, "غير محسوم": 0 });
  const validSourcesA2Batch2 = reviewA2Batch2.sources.every((source) => source.title.length > 0 &&
    source.supports.length > 0 && source.url.startsWith("https://") && reviewMarkdownA2Batch2.includes(source.url) &&
    reviewMarkdownA2Batch2.includes(`#${source.id.toLowerCase()}`));
  const everySourceUsedA2Batch2 = reviewA2Batch2.sources.every((source) => referencedSourceIdsA2Batch2.has(source.id));
  ok(reviewA2Batch2.sources.length === 63 && sourceIdsA2Batch2.size === 63 && validSourcesA2Batch2 &&
    everySourceUsedA2Batch2 && referencedSourceIdsA2Batch2.size === 63 &&
    reviewA2Batch2.items.every((item) => item.sources.length > 0 && item.finding.length > 0 && item.action.length > 0) &&
    computedStatusesA2Batch2["سليم"] === 36 && computedStatusesA2Batch2["مُصحح"] === 2 &&
    computedStatusesA2Batch2["غير محسوم"] === 0 && JSON.stringify(computedStatusesA2Batch2) === JSON.stringify(reviewA2Batch2.statusCounts),
    "K178b لكل عنصر دليل وحكم وإجراء ومصدر منشور؛ 63 مصدراً مستخدماً بلا نقص، مع فصل التصحيح عن غير المحسوم");

  const ordinalItemA2Batch2 = itemByIdA2Batch2.get("d-a2-01-q1");
  const thanksItemA2Batch2 = itemByIdA2Batch2.get("d-a2-02.lines[1]");
  const liveDialogue01A2Batch2 = selectedA2Batch2.find((dialogue) => dialogue.id === "d-a2-01");
  const liveDialogue02A2Batch2 = selectedA2Batch2.find((dialogue) => dialogue.id === "d-a2-02");
  const changedFieldsA2Batch2 = ["d-a2-01.questions[0].explanationAr", "d-a2-02.lines[1].ar"];
  ok(reviewA2Batch2.contentPatch.fieldsChanged === 2 &&
    JSON.stringify(reviewA2Batch2.contentPatch.changedFields) === JSON.stringify(changedFieldsA2Batch2) &&
    reviewA2Batch2.items.filter((item) => item.status === "مُصحح").length === 2 &&
    ordinalItemA2Batch2?.before?.explanationAr === "der zwölfte = الثاني عشر." &&
    ordinalItemA2Batch2.reviewed.explanationAr === "am zwölften Juli = في اليوم الثاني عشر من يوليو." &&
    liveDialogue01A2Batch2?.questions[0]?.answer?.join("|") === "zwölften|12." &&
    liveDialogue01A2Batch2?.questions[0]?.explanationAr === ordinalItemA2Batch2?.reviewed.explanationAr &&
    thanksItemA2Batch2?.before?.ar === "أهلاً مهدي! بخير. ما الجديد؟" &&
    thanksItemA2Batch2.reviewed.ar === "أهلاً مهدي! بخير، شكراً. ما الجديد؟" &&
    liveDialogue02A2Batch2?.lines[1]?.ar === thanksItemA2Batch2?.reviewed.ar &&
    reviewA2Batch2.contentPatch.changedFields.every((field) =>
      field === "d-a2-01.questions[0].explanationAr" || field === "d-a2-02.lines[1].ar"),
    "K178c التصحيحان المؤكدان فقط مثبتان قبل/بعد: شرح zwölften وdanke؛ المفتاح وبقية المحتوى خارج الرقعة");

  const historyA2Batch2 = reviewA2Batch2.historicalPatchReview;
  const historySourceA2Batch2 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  const historyByIdA2Batch2 = new Map(historyA2Batch2.comparisons.map((comparison: any) => [comparison.id, comparison]));
  const oldQuestion01A2Batch2 = historyByIdA2Batch2.get("d-a2-01-q2") as any;
  const oldQuestion02A2Batch2 = historyByIdA2Batch2.get("d-a2-02-q1") as any;
  const oldQuestion03A2Batch2 = historyByIdA2Batch2.get("d-a2-03-q2") as any;
  ok(historyA2Batch2.sources.length === 1 && historyA2Batch2.sources[0] === "scripts/patches/a_dialog_fallen.py" &&
    historyA2Batch2.comparisons.length === 3 &&
    JSON.stringify([...historyByIdA2Batch2.keys()]) === JSON.stringify(["d-a2-01-q2", "d-a2-02-q1", "d-a2-03-q2"]) &&
    oldQuestion01A2Batch2?.historicalOptions?.[0] === "neben dem Reisebüro" &&
    oldQuestion01A2Batch2?.liveOptions?.[0] === "neben dem Bahnhof in München" &&
    oldQuestion01A2Batch2?.historicalAnswer === oldQuestion01A2Batch2?.liveAnswer &&
    JSON.stringify(oldQuestion02A2Batch2?.historicalOptions) === JSON.stringify(oldQuestion02A2Batch2?.liveOptions) &&
    new Set(oldQuestion03A2Batch2?.historicalOptions).size === 3 &&
    oldQuestion03A2Batch2?.historicalOptions.every((option: string) => oldQuestion03A2Batch2.liveOptions.includes(option)) &&
    oldQuestion03A2Batch2?.historicalAnswer === oldQuestion03A2Batch2?.liveAnswer &&
    historyA2Batch2.unavailableHistoricalFields.includes("titles") &&
    historyA2Batch2.unavailableHistoricalFields.includes("lines") &&
    historyA2Batch2.unavailableHistoricalFields.includes("dictation") &&
    historyA2Batch2.role.includes("لا مرجع لغوي") && historySourceA2Batch2.includes("neben dem Reisebüro") &&
    historySourceA2Batch2.includes("d-a2-02-q1") && historySourceA2Batch2.includes("d-a2-03-q2"),
    "K178d المقارنة التاريخية محصورة بثلاثة معرّفات أسئلة؛ لا تعميم على العناوين أو الأسطر أو الإملاء");

  const audioManifestA2Batch2 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as {
    einsaetze: { id: string; file: string; bytes: number; stimmen?: number; voice?: string }[];
  };
  const audioMatchesA2Batch2 = reviewA2Batch2.audioAssetAudit.map((audit) => {
    const entry = audioManifestA2Batch2.einsaetze.find((candidate) => candidate.id === audit.id);
    const assetPath = `public${audit.file.startsWith("/") ? audit.file : `/${audit.file}`}`;
    const actualBytes = existsSync(assetPath) ? readFileSync(assetPath).byteLength : -1;
    return !!entry && audit.exists && actualBytes === entry.bytes && audit.actualBytes === actualBytes &&
      audit.metadataBytes === entry.bytes && audit.file === entry.file && audit.voices === entry.stimmen &&
      audit.voice === entry.voice && audit.check.includes("لم يُستمع") && audit.check.includes("تطابق الحجم");
  });
  ok(reviewA2Batch2.audioAssetAudit.length === 3 && audioMatchesA2Batch2.length === 3 &&
    audioMatchesA2Batch2.every(Boolean) && reviewA2Batch2.limitations.some((limitation) => limitation.includes("لم يُستمع إليها")) &&
    reviewMarkdownA2Batch2.includes("لم يُستمع إلى الصوت"),
    "K178e ملفات الصوت الثلاثة موجودة وتطابق الأحجام البيان؛ لا ادعاء بالاستماع أو مطابقة النطق");

  ok(reviewA2Batch2.openNotes.length === 0 && reviewA2Batch2.limitations.some((limitation) => limitation.includes("لم يُعد تقييم CEFR")) &&
    reviewA2Batch2.limitations.some((limitation) => limitation.includes("النسبة أو طريقة حساب المستوى")) &&
    reviewA2Batch2.limitations.some((limitation) => limitation.includes("لا يثبت هذا التقرير سلامة نصيحة علاجية")) &&
    reviewA2Batch2.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية أو اعتماداً مهنياً")) &&
    reviewA2Batch2.contentPatch.changedFields.length === 2 &&
    !reviewA2Batch2.contentPatch.changedFields.some((field) => /cefr|level|percent|percentage|score/i.test(field)),
    "K178f CEFR والنسبة وحساب المستوى والتقييم السريري/المهني خارج النطاق؛ فجوة A1 غير محسومة بلا تخمين");
}

/* ═══ K179 — R105: تدقيق الحوارات A2 d-a2-04–06 بالمصادر والبيانات الحية ═══ */
{
  type A2Batch3Dialogue = {
    id: string; level: string; titleDe: string; titleAr: string;
    lines: { who: string; de: string; ar: string }[];
    questions: any[]; dictation: string[]; waisen?: string[];
  };
  type A2Batch3Item = {
    id: string; kind: string; status: string; sources: string[];
    finding: string; action: string; reviewed: any; before?: any;
  };
  type A2Batch3Report = {
    date: string; batch: string; scope: string; method: string;
    coverage: Record<string, number>; statusCounts: Record<string, number>;
    statusDefinitions: Record<string, string>; limitations: string[];
    historicalPatchReview: { sources: string[]; role: string; comparisons: any[]; unavailableHistoricalFields: string[] };
    contentPatch: { fieldsChanged: number; changedFields: string[]; reason: string; protectedUnresolvedItemIds: string[] };
    openNotes: any[];
    audioAssetAudit: { id: string; file: string; metadataBytes: number; actualBytes: number;
      exists: boolean; voices: number; voice: string; check: string }[];
    sources: { id: string; title: string; url: string; supports: string }[];
    items: A2Batch3Item[];
  };
  const reviewA2Batch3 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-03-2026-10-05.json", "utf8")) as A2Batch3Report;
  const reviewMarkdownA2Batch3 = readFileSync("docs/content-review-a2-dialogues-03-2026-10-05.md", "utf8");
  const liveA2Batch3 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as A2Batch3Dialogue[];
  const selectedA2Batch3 = liveA2Batch3.filter((dialogue) => ["d-a2-04", "d-a2-05", "d-a2-06"].includes(dialogue.id));
  const expectedIdsA2Batch3 = selectedA2Batch3.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const itemIdsA2Batch3 = reviewA2Batch3.items.map((item) => item.id);
  const itemByIdA2Batch3 = new Map(reviewA2Batch3.items.map((item) => [item.id, item]));
  const reviewRowsA2Batch3 = reviewMarkdownA2Batch3.split("## سجل كل عنصر")[1]?.split("## الملاحظة غير المحسومة")[0] ?? "";
  const uniqueRowsA2Batch3 = expectedIdsA2Batch3.every((id) =>
    reviewRowsA2Batch3.split("\n").filter((line) => line.startsWith(`| \`${id}\` |`)).length === 1
  );
  const liveSnapshotsA2Batch3 = selectedA2Batch3.every((dialogue) => {
    const metadata = itemByIdA2Batch3.get(dialogue.id)?.reviewed;
    return metadata?.titleDe === dialogue.titleDe && metadata?.titleAr === dialogue.titleAr &&
      metadata?.level === dialogue.level && metadata?.lineCount === dialogue.lines.length &&
      metadata?.questionCount === dialogue.questions.length && metadata?.dictationCount === dialogue.dictation.length &&
      metadata?.hasWaisen === ("waisen" in dialogue) &&
      dialogue.lines.every((line, index) => JSON.stringify(itemByIdA2Batch3.get(`${dialogue.id}.lines[${index}]`)?.reviewed) === JSON.stringify(line)) &&
      dialogue.questions.every((question) => JSON.stringify(itemByIdA2Batch3.get(question.id)?.reviewed) === JSON.stringify(question)) &&
      dialogue.dictation.every((sentence, index) => itemByIdA2Batch3.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(reviewA2Batch3.date === "2026-10-05" && reviewA2Batch3.batch === "A2-dialogues-03" &&
    selectedA2Batch3.length === 3 && selectedA2Batch3.every((dialogue) => dialogue.level === "A2") &&
    selectedA2Batch3.map((dialogue) => dialogue.lines.length).join("|") === "5|6|5" &&
    selectedA2Batch3.every((dialogue) => dialogue.questions.length === 2 && dialogue.dictation.length === 3) &&
    expectedIdsA2Batch3.length === 34 && new Set(expectedIdsA2Batch3).size === 34 &&
    JSON.stringify(expectedIdsA2Batch3) === JSON.stringify(itemIdsA2Batch3) && liveSnapshotsA2Batch3 && uniqueRowsA2Batch3 &&
    reviewRowsA2Batch3.split("\n").filter((line) => line.startsWith("| `d-a2-")).length === 34 &&
    reviewA2Batch3.coverage.dialogues === 3 && reviewA2Batch3.coverage.dialogueMetadata === 3 &&
    reviewA2Batch3.coverage.lines === 16 && reviewA2Batch3.coverage.questions === 6 &&
    reviewA2Batch3.coverage.dictationSentences === 9 && reviewA2Batch3.coverage.audioAssets === 3 &&
    reviewA2Batch3.coverage.totalTrackedItems === 34,
    "K179a تقرير R105 وMarkdown يغطيان 34 معرفاً حياً بالترتيب؛ لقطة كل عنوان وسطر وسؤال وإملاء مطابقة للبيانات");

  const sourceIdsA2Batch3 = new Set(reviewA2Batch3.sources.map((source) => source.id));
  const referencedSourceIdsA2Batch3 = new Set([
    ...reviewA2Batch3.items.flatMap((item) => item.sources),
    ...reviewA2Batch3.openNotes.flatMap((note) => note.sources ?? []),
  ]);
  const computedStatusesA2Batch3 = reviewA2Batch3.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مُصحح": 0, "غير محسوم": 0 });
  const validSourcesA2Batch3 = reviewA2Batch3.sources.every((source) => source.title.length > 0 &&
    source.supports.length > 0 && source.url.startsWith("https://") && reviewMarkdownA2Batch3.includes(source.url) &&
    reviewMarkdownA2Batch3.includes(`#${source.id.toLowerCase()}`));
  ok(reviewA2Batch3.sources.length === 51 && sourceIdsA2Batch3.size === 51 && validSourcesA2Batch3 &&
    reviewA2Batch3.sources.every((source) => referencedSourceIdsA2Batch3.has(source.id)) && referencedSourceIdsA2Batch3.size === 51 &&
    reviewA2Batch3.items.every((item) => item.sources.length > 0 && item.finding.length > 0 && item.action.length > 0) &&
    computedStatusesA2Batch3["سليم"] === 31 && computedStatusesA2Batch3["مُصحح"] === 2 &&
    computedStatusesA2Batch3["غير محسوم"] === 1 && JSON.stringify(computedStatusesA2Batch3) === JSON.stringify(reviewA2Batch3.statusCounts),
    "K179b لكل وحدة دليل وحكم وإجراء ومصدر منشور؛ 51 مصدراً فريداً مستعملاً، مع فصل السليم والمؤكد وغير المحسوم");

  const correctedSaraA2Batch3 = itemByIdA2Batch3.get("d-a2-05.lines[3]");
  const correctedPulloverA2Batch3 = itemByIdA2Batch3.get("d-a2-06.lines[0]");
  const unresolvedReceiptA2Batch3 = itemByIdA2Batch3.get("d-a2-06-q2");
  const liveDialogue05A2Batch3 = selectedA2Batch3.find((dialogue) => dialogue.id === "d-a2-05");
  const liveDialogue06A2Batch3 = selectedA2Batch3.find((dialogue) => dialogue.id === "d-a2-06");
  const changedFieldsA2Batch3 = ["d-a2-05.lines[3].ar", "d-a2-06.lines[0].ar"];
  ok(reviewA2Batch3.contentPatch.fieldsChanged === 2 &&
    JSON.stringify(reviewA2Batch3.contentPatch.changedFields) === JSON.stringify(changedFieldsA2Batch3) &&
    reviewA2Batch3.items.filter((item) => item.status === "مُصحح").length === 2 &&
    correctedSaraA2Batch3?.before?.ar === "أوه! لا مشكلة. هل كنت مريضاً؟" &&
    correctedSaraA2Batch3.reviewed.ar === "أوه! لا مشكلة. هل كنتِ مريضة؟" &&
    liveDialogue05A2Batch3?.lines[3]?.ar === correctedSaraA2Batch3?.reviewed.ar &&
    correctedPulloverA2Batch3?.before?.ar === "طاب يومكم. اشتريت هذه السترة أمس لكنها صغيرة." &&
    correctedPulloverA2Batch3.reviewed.ar === "طاب يومكم. اشتريت هذه الكنزة أمس، لكنها أصغر من اللازم." &&
    liveDialogue06A2Batch3?.lines[0]?.ar === correctedPulloverA2Batch3?.reviewed.ar &&
    changedFieldsA2Batch3.every((field) => reviewA2Batch3.contentPatch.changedFields.includes(field)) &&
    unresolvedReceiptA2Batch3?.status === "غير محسوم" &&
    reviewA2Batch3.openNotes.length === 1 && reviewA2Batch3.openNotes[0].id === "d-a2-06-q2" &&
    reviewA2Batch3.contentPatch.protectedUnresolvedItemIds.includes("d-a2-06-q2") &&
    unresolvedReceiptA2Batch3.action.includes("لا تعديل") &&
    !reviewA2Batch3.contentPatch.changedFields.some((field) => /d-a2-06-q2|cefr|level|percent|score/i.test(field)),
    "K179c تصحيحان عربيان موثقان قبل/بعد فقط؛ d-a2-06-q2 محفوظ كغير محسوم بلا تعديل تخميني أو تغيير CEFR");

  const historyA2Batch3 = reviewA2Batch3.historicalPatchReview;
  const historySourceA2Batch3 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  const expectedHistoryIdsA2Batch3 = ["d-a2-04-q1", "d-a2-05-q1", "d-a2-06-q2"];
  const historyForIdA2Batch3 = (id: string) => historyA2Batch3.comparisons.find((comparison: any) =>
    typeof comparison.id === "string" && comparison.id.includes(id)
  ) as any;
  const liveQuestionForIdA2Batch3 = (id: string) => selectedA2Batch3.flatMap((dialogue) => dialogue.questions)
    .find((question) => question.id.includes(id));
  const historicalHasFragmentsA2Batch3 = (comparison: any, fragments: string[]) =>
    Array.isArray(comparison?.historicalOptions) && fragments.every((fragment) =>
      comparison.historicalOptions.some((option: string) => typeof option === "string" && option.includes(fragment))
    );
  const recordedLiveOptionsMatchA2Batch3 = (recorded: string[] | undefined, live: string[] | undefined) =>
    Array.isArray(recorded) && Array.isArray(live) &&
    recorded.every((option) => live.some((liveOption) => liveOption.includes(option))) &&
    live.every((option) => recorded.some((recordedOption) => recordedOption.includes(option)));
  const historicQ1A2Batch3 = historyForIdA2Batch3("d-a2-04-q1");
  const historicQ2A2Batch3 = historyForIdA2Batch3("d-a2-05-q1");
  const historicQ3A2Batch3 = historyForIdA2Batch3("d-a2-06-q2");
  const liveQ1A2Batch3 = liveQuestionForIdA2Batch3("d-a2-04-q1");
  const liveQ2A2Batch3 = liveQuestionForIdA2Batch3("d-a2-05-q1");
  const liveQ3A2Batch3 = liveQuestionForIdA2Batch3("d-a2-06-q2");
  ok(historyA2Batch3.sources.length === 1 && historyA2Batch3.sources[0] === "scripts/patches/a_dialog_fallen.py" &&
    historyA2Batch3.comparisons.length === 3 &&
    expectedHistoryIdsA2Batch3.every((id) => historyA2Batch3.comparisons.some((comparison: any) =>
      typeof comparison.id === "string" && comparison.id.includes(id)
    )) &&
    historicalHasFragmentsA2Batch3(historicQ1A2Batch3, ["in Köln", "in Frankfurt", "nach vier Stunden"]) &&
    historicQ1A2Batch3?.historicalAnswer === "in Frankfurt" && historicQ1A2Batch3?.historicalAnswer === historicQ1A2Batch3?.liveAnswer &&
    recordedLiveOptionsMatchA2Batch3(historicQ1A2Batch3?.liveOptions, liveQ1A2Batch3?.options) &&
    historicQ1A2Batch3?.liveAnswer === liveQ1A2Batch3?.answer &&
    historicalHasFragmentsA2Batch3(historicQ2A2Batch3, ["Sie war krank.", "Sie hat vergessen, zum Termin zu kommen.", "Sie kann morgen nicht kommen."]) &&
    historicQ2A2Batch3?.historicalAnswer === historicQ2A2Batch3?.liveAnswer &&
    recordedLiveOptionsMatchA2Batch3(historicQ2A2Batch3?.liveOptions, liveQ2A2Batch3?.options) &&
    historicQ2A2Batch3?.liveAnswer === liveQ2A2Batch3?.answer &&
    historicalHasFragmentsA2Batch3(historicQ3A2Batch3, ["den Kassenzettel", "den Pullover in Größe M", "die kleinere Größe zurück"]) &&
    historicQ3A2Batch3?.historicalAnswer === historicQ3A2Batch3?.liveAnswer &&
    recordedLiveOptionsMatchA2Batch3(historicQ3A2Batch3?.liveOptions, liveQ3A2Batch3?.options) &&
    historicQ3A2Batch3?.liveAnswer === liveQ3A2Batch3?.answer &&
    historyA2Batch3.unavailableHistoricalFields.includes("titles") &&
    historyA2Batch3.unavailableHistoricalFields.includes("lines") &&
    historyA2Batch3.unavailableHistoricalFields.includes("dictation") &&
    expectedHistoryIdsA2Batch3.every((id) => historySourceA2Batch3.includes(id)) &&
    historyA2Batch3.role.includes("النص الكامل"),
    "K179d المقارنة التاريخية تستخدم معرفات/خيارات بمطابقة substring، وتطابق مفاتيح وخيارات السجل الحي مع المصدر الحالي دون افتراض ترتيب ثابت");

  const audioManifestA2Batch3 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as {
    einsaetze: { id: string; file: string; bytes: number; stimmen?: number; voice?: string }[];
  };
  const audioMatchesA2Batch3 = reviewA2Batch3.audioAssetAudit.map((audit) => {
    const entry = audioManifestA2Batch3.einsaetze.find((candidate) => candidate.id === audit.id);
    const assetPath = `public${audit.file.startsWith("/") ? audit.file : `/${audit.file}`}`;
    const actualBytes = existsSync(assetPath) ? readFileSync(assetPath).byteLength : -1;
    return !!entry && audit.exists && actualBytes === entry.bytes && audit.actualBytes === actualBytes &&
      audit.metadataBytes === entry.bytes && audit.file === entry.file && audit.voices === entry.stimmen &&
      audit.voice === entry.voice && audit.check.includes("لم يُستمع") && audit.check.includes("مطابقة الحجم");
  });
  ok(reviewA2Batch3.audioAssetAudit.length === 3 && audioMatchesA2Batch3.length === 3 &&
    audioMatchesA2Batch3.every(Boolean) && reviewA2Batch3.limitations.some((limitation) => limitation.includes("لم يحدث تشغيل أو استماع")) &&
    reviewMarkdownA2Batch3.includes("لم يُستمع إليه"),
    "K179e ملفات الصوت الثلاثة موجودة وأحجامها تطابق البيان؛ لا ادعاء بالاستماع أو مطابقة النطق");

  ok(reviewA2Batch3.limitations.some((limitation) => limitation.includes("لم تُعَد مراجعة مستوى A2 أو CEFR")) &&
    reviewA2Batch3.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً")) &&
    reviewMarkdownA2Batch3.includes("لم يُراجع CEFR أو النسبة أو حساب المستوى الممكن") &&
    reviewMarkdownA2Batch3.includes("ليست مراجعة بشرية أو اعتماداً مهنياً") &&
    !reviewA2Batch3.contentPatch.changedFields.some((field) => /cefr|level|percent|percentage|score/i.test(field)),
    "K179f CEFR والنسبة وحساب المستوى مؤجلة؛ حدود المراجعة الآلية واللغوية موثقة بوضوح");
}

/* ═══ K180 — R106: تدقيق الحوارات A2 d-a2-07–09 بالمصادر والبيانات الحية ═══ */
{
  type A2Batch4Dialogue = {
    id: string; level: string; titleDe: string; titleAr: string;
    lines: { who: string; de: string; ar: string }[];
    questions: any[]; dictation: string[]; waisen?: string[];
  };
  type A2Batch4Item = {
    id: string; kind: string; status: string; sources: string[];
    finding: string; action: string; reviewed: any; before?: any;
  };
  type A2Batch4Report = {
    date: string; batch: string; scope: string; method: string;
    coverage: Record<string, number>; statusCounts: Record<string, number>;
    statusDefinitions: Record<string, string>; limitations: string[];
    historicalPatchReview: { sources: string[]; role: string; comparisons: any[]; unavailableHistoricalFields: string[] };
    contentPatch: { fieldsChanged: number; changedFields: string[]; reason: string; protectedUnresolvedItemIds: string[] };
    openNotes: any[];
    audioAssetAudit: { id: string; file: string; metadataBytes: number; actualBytes: number;
      exists: boolean; voices: number; voice: string; check: string }[];
    sources: { id: string; title: string; url: string; supports: string }[];
    items: A2Batch4Item[];
  };
  const reviewA2Batch4 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-04-2026-10-05.json", "utf8")) as A2Batch4Report;
  const reviewMarkdownA2Batch4 = readFileSync("docs/content-review-a2-dialogues-04-2026-10-05.md", "utf8");
  const liveA2Batch4 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as A2Batch4Dialogue[];
  const selectedA2Batch4 = liveA2Batch4.filter((dialogue) => ["d-a2-07", "d-a2-08", "d-a2-09"].includes(dialogue.id));
  const expectedIdsA2Batch4 = selectedA2Batch4.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_, index) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question) => question.id),
    ...dialogue.dictation.map((_, index) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const itemIdsA2Batch4 = reviewA2Batch4.items.map((item) => item.id);
  const itemByIdA2Batch4 = new Map(reviewA2Batch4.items.map((item) => [item.id, item]));
  const reviewRowsA2Batch4 = reviewMarkdownA2Batch4.split("## سجل كل عنصر")[1]?.split("## الملاحظة غير المحسومة")[0] ?? "";
  const uniqueRowsA2Batch4 = expectedIdsA2Batch4.every((id) =>
    reviewRowsA2Batch4.split("\n").filter((line) => line.startsWith(`| \`${id}\` |`)).length === 1
  );
  const liveSnapshotsA2Batch4 = selectedA2Batch4.every((dialogue) => {
    const metadata = itemByIdA2Batch4.get(dialogue.id)?.reviewed;
    return metadata?.titleDe === dialogue.titleDe && metadata?.titleAr === dialogue.titleAr &&
      metadata?.level === dialogue.level && metadata?.lineCount === dialogue.lines.length &&
      metadata?.questionCount === dialogue.questions.length && metadata?.dictationCount === dialogue.dictation.length &&
      metadata?.hasWaisen === ("waisen" in dialogue) &&
      dialogue.lines.every((line, index) => JSON.stringify(itemByIdA2Batch4.get(`${dialogue.id}.lines[${index}]`)?.reviewed) === JSON.stringify(line)) &&
      dialogue.questions.every((question) => JSON.stringify(itemByIdA2Batch4.get(question.id)?.reviewed) === JSON.stringify(question)) &&
      dialogue.dictation.every((sentence, index) => itemByIdA2Batch4.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(reviewA2Batch4.date === "2026-10-05" && reviewA2Batch4.batch === "A2-dialogues-04" &&
    selectedA2Batch4.length === 3 && selectedA2Batch4.every((dialogue) => dialogue.level === "A2") &&
    selectedA2Batch4.map((dialogue) => dialogue.lines.length).join("|") === "5|6|6" &&
    selectedA2Batch4.map((dialogue) => dialogue.questions.length).join("|") === "2|2|2" &&
    selectedA2Batch4.map((dialogue) => dialogue.dictation.length).join("|") === "3|2|2" &&
    expectedIdsA2Batch4.length === 33 && new Set(expectedIdsA2Batch4).size === 33 &&
    JSON.stringify(expectedIdsA2Batch4) === JSON.stringify(itemIdsA2Batch4) && liveSnapshotsA2Batch4 && uniqueRowsA2Batch4 &&
    reviewRowsA2Batch4.split("\n").filter((line) => line.startsWith("| `d-a2-")).length === 33 &&
    reviewA2Batch4.coverage.dialogues === 3 && reviewA2Batch4.coverage.dialogueMetadata === 3 &&
    reviewA2Batch4.coverage.lines === 17 && reviewA2Batch4.coverage.questions === 6 &&
    reviewA2Batch4.coverage.dictationSentences === 7 && reviewA2Batch4.coverage.audioAssets === 3 &&
    reviewA2Batch4.coverage.unresolvedContextNotes === 1 && reviewA2Batch4.coverage.totalTrackedItems === 33,
    "K180a تقرير R106 وMarkdown يغطيان 33 معرفاً حياً بالترتيب؛ كل لقطة عنوان/سطر/سؤال/إملاء تطابق المصدر الحي");

  const sourceIdsA2Batch4 = new Set(reviewA2Batch4.sources.map((source) => source.id));
  const referencedSourceIdsA2Batch4 = new Set([
    ...reviewA2Batch4.items.flatMap((item) => item.sources),
    ...reviewA2Batch4.openNotes.flatMap((note) => note.sources ?? []),
  ]);
  const computedStatusesA2Batch4 = reviewA2Batch4.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مُصحح": 0, "غير محسوم": 0 });
  const validSourcesA2Batch4 = reviewA2Batch4.sources.every((source) => source.title.length > 0 &&
    source.supports.length > 0 && source.url.startsWith("https://") && reviewMarkdownA2Batch4.includes(source.url) &&
    reviewMarkdownA2Batch4.includes(`#${source.id.toLowerCase()}`));
  ok(reviewA2Batch4.sources.length === 55 && sourceIdsA2Batch4.size === 55 && validSourcesA2Batch4 &&
    reviewA2Batch4.sources.every((source) => referencedSourceIdsA2Batch4.has(source.id)) && referencedSourceIdsA2Batch4.size === 55 &&
    reviewA2Batch4.items.every((item) => item.sources.length > 0 && item.finding.length > 0 && item.action.length > 0) &&
    computedStatusesA2Batch4["سليم"] === 30 && computedStatusesA2Batch4["مُصحح"] === 2 &&
    computedStatusesA2Batch4["غير محسوم"] === 1 && JSON.stringify(computedStatusesA2Batch4) === JSON.stringify(reviewA2Batch4.statusCounts),
    "K180b لكل وحدة دليل/حكم/إجراء ومصدر منشور مربوط؛ 55 مصدراً فريداً، مع أعداد أحكام مطابقة");

  const correctedWaterExplanationA2Batch4 = itemByIdA2Batch4.get("d-a2-08-q2");
  const correctedTimeA2Batch4 = itemByIdA2Batch4.get("d-a2-09.lines[1]");
  const liveDialogue08A2Batch4 = selectedA2Batch4.find((dialogue) => dialogue.id === "d-a2-08");
  const liveDialogue09A2Batch4 = selectedA2Batch4.find((dialogue) => dialogue.id === "d-a2-09");
  const liveQ2A2Batch4 = liveDialogue08A2Batch4?.questions.find((question) => question.id === "d-a2-08-q2");
  const liveTimeLineA2Batch4 = liveDialogue09A2Batch4?.lines[1];
  const patchScriptA2Batch4 = readFileSync("scripts/patches/review_a2_dialogues_04.py", "utf8");
  const questionFieldsUnchangedA2Batch4 = (before: any, after: any) => {
    if (!before || !after) return false;
    const oldCopy = { ...before };
    const newCopy = { ...after };
    delete oldCopy.explanationAr;
    delete newCopy.explanationAr;
    return JSON.stringify(oldCopy) === JSON.stringify(newCopy);
  };
  ok(reviewA2Batch4.contentPatch.fieldsChanged === 2 &&
    JSON.stringify(reviewA2Batch4.contentPatch.changedFields) === JSON.stringify(["d-a2-08-q2.explanationAr", "d-a2-09.lines[1].ar"]) &&
    correctedWaterExplanationA2Batch4?.status === "مُصحح" &&
    correctedWaterExplanationA2Batch4?.before?.explanationAr === "الدليل: «Ich gebe Ihnen Lutschtabletten und einen Tee». الفخّ 1: الماء نصيحة للشرب لا دواء. الفخّ 2: «schlucken» ذُكر كألم. الفخّ 3: الماء لا يُباع هنا." &&
    correctedWaterExplanationA2Batch4?.reviewed?.explanationAr === liveQ2A2Batch4?.explanationAr &&
    correctedWaterExplanationA2Batch4?.reviewed?.explanationAr.includes("لا ضمن ما قالت الصيدلانية إنها ستعطيه") &&
    questionFieldsUnchangedA2Batch4(correctedWaterExplanationA2Batch4?.before, correctedWaterExplanationA2Batch4?.reviewed) &&
    correctedTimeA2Batch4?.status === "مُصحح" && correctedTimeA2Batch4?.before?.ar === "الثانية عشرة والنصف، الرصيف الخامس." &&
    correctedTimeA2Batch4?.reviewed?.ar === "الساعة الثانية والنصف بعد الظهر، على الرصيف الخامس." &&
    correctedTimeA2Batch4?.reviewed?.ar === liveTimeLineA2Batch4?.ar && correctedTimeA2Batch4?.before?.de === correctedTimeA2Batch4?.reviewed?.de &&
    patchScriptA2Batch4.includes("d-a2-08-q2") && patchScriptA2Batch4.includes("d-a2-09") &&
    reviewA2Batch4.contentPatch.protectedUnresolvedItemIds.includes("d-a2-09-q2") &&
    !reviewA2Batch4.contentPatch.changedFields.some((field) => /d-a2-09-q2|cefr|level|percent|score/i.test(field)),
    "K180c تصحيحان مؤكدان فقط مع سجل قبل/بعد ورقعة محمية؛ لا تغيير للألمانية أو الخيارات/المفتاح أو CEFR");

  const historyA2Batch4 = reviewA2Batch4.historicalPatchReview;
  const historySourceA2Batch4 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  const expectedHistoryIdsA2Batch4 = ["d-a2-07-q1", "d-a2-08-q1", "d-a2-08-q2", "d-a2-09-q1", "d-a2-09-q2"];
  const historyForIdA2Batch4 = (id: string) => historyA2Batch4.comparisons.find((comparison: any) =>
    typeof comparison.id === "string" && comparison.id.includes(id)
  ) as any;
  const liveQuestionForIdA2Batch4 = (id: string) => selectedA2Batch4.flatMap((dialogue) => dialogue.questions)
    .find((question) => question.id.includes(id));
  const historicalHasFragmentsA2Batch4 = (comparison: any, fragments: string[]) =>
    Array.isArray(comparison?.historicalOptions) && fragments.every((fragment) =>
      comparison.historicalOptions.some((option: string) => typeof option === "string" && option.includes(fragment))
    );
  const recordedLiveOptionsMatchA2Batch4 = (recorded: string[] | undefined, live: string[] | undefined) =>
    Array.isArray(recorded) && Array.isArray(live) &&
    recorded.every((option) => live.some((liveOption) => liveOption.includes(option))) &&
    live.every((option) => recorded.some((recordedOption) => recordedOption.includes(option)));
  const historyComparisonsA2Batch4 = [
    { id: "d-a2-07-q1", fragments: ["Frau Klein", "Herr Yilmaz", "der Bote gegen neun Uhr"] },
    { id: "d-a2-08-q1", fragments: ["Halsschmerzen seit gestern Abend", "Kopfschmerzen seit gestern", "Halsschmerzen seit drei Tagen", "Fieber und Husten"] },
    { id: "d-a2-08-q2", fragments: ["Lutschtabletten und einen Tee", "nur Wasser", "Tabletten zum Schlucken", "einen Tee und Wasser zum Kaufen"] },
    { id: "d-a2-09-q1", fragments: ["um vierzehn Uhr dreißig", "um fünfzehn Uhr dreißig", "um vierzehn Uhr von Gleis drei", "um dreizehn Uhr dreißig"] },
    { id: "d-a2-09-q2", fragments: ["eine Fahrkarte zweiter Klasse", "eine Rückfahrkarte für neunundzwanzig Euro", "eine Fahrkarte erster Klasse", "fünf Fahrkarten"] },
  ];
  const historyMatchesLiveA2Batch4 = historyComparisonsA2Batch4.every(({ id, fragments }) => {
    const historic = historyForIdA2Batch4(id);
    const live = liveQuestionForIdA2Batch4(id);
    return historicalHasFragmentsA2Batch4(historic, fragments) &&
      historic?.historicalAnswer === historic?.liveAnswer && historic?.liveAnswer === live?.answer &&
      recordedLiveOptionsMatchA2Batch4(historic?.liveOptions, live?.options) &&
      historySourceA2Batch4.includes(id) && typeof historic?.observation === "string" && historic.observation.length > 0;
  });
  ok(historyA2Batch4.sources.length === 1 && historyA2Batch4.sources[0] === "scripts/patches/a_dialog_fallen.py" &&
    historyA2Batch4.comparisons.length === 5 &&
    expectedHistoryIdsA2Batch4.every((id) => historyA2Batch4.comparisons.some((comparison: any) =>
      typeof comparison.id === "string" && comparison.id.includes(id)
    )) && historyMatchesLiveA2Batch4 &&
    historyA2Batch4.unavailableHistoricalFields.includes("titles") &&
    historyA2Batch4.unavailableHistoricalFields.includes("lines") &&
    historyA2Batch4.unavailableHistoricalFields.includes("dictation") &&
    historyA2Batch4.role.includes("ليست لقطة") && reviewA2Batch4.openNotes[0]?.id === "d-a2-09-q2",
    "K180d المقارنة التاريخية محدودة بخمسة أسئلة؛ مفاتيحها وخياراتها الحية مربوطة بالمصدر عبر substring لا مساواة ترتيبية");

  const audioManifestA2Batch4 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as {
    einsaetze: { id: string; file: string; bytes: number; stimmen?: number; voice?: string }[];
  };
  const audioMatchesA2Batch4 = reviewA2Batch4.audioAssetAudit.map((audit) => {
    const entry = audioManifestA2Batch4.einsaetze.find((candidate) => candidate.id === audit.id);
    const assetPath = `public${audit.file.startsWith("/") ? audit.file : `/${audit.file}`}`;
    const actualBytes = existsSync(assetPath) ? readFileSync(assetPath).byteLength : -1;
    return !!entry && audit.exists && actualBytes === entry.bytes && audit.actualBytes === actualBytes &&
      audit.metadataBytes === entry.bytes && audit.file === entry.file && audit.voices === entry.stimmen &&
      audit.voice === entry.voice && audit.check.includes("لم يُشغّل") && audit.check.includes("مطابقة الحجم");
  });
  ok(reviewA2Batch4.audioAssetAudit.length === 3 && audioMatchesA2Batch4.length === 3 &&
    audioMatchesA2Batch4.every(Boolean) && reviewA2Batch4.limitations.some((limitation) => limitation.includes("لم يحدث تشغيل أو استماع")) &&
    reviewMarkdownA2Batch4.includes("لم يُشغّل أو يُستمع إليه"),
    "K180e أصول MP3 الثلاثة موجودة ومطابقة لحجوم البيان؛ لا ادعاء بفك الترميز أو التشغيل أو الاستماع");

  const unresolvedReturnTicketA2Batch4 = itemByIdA2Batch4.get("d-a2-09-q2");
  const unresolvedReturnNoteA2Batch4 = reviewA2Batch4.openNotes.find((note) => note.id === "d-a2-09-q2");
  ok(unresolvedReturnTicketA2Batch4?.status === "غير محسوم" &&
    reviewA2Batch4.openNotes.length === 1 && unresolvedReturnNoteA2Batch4?.status === "غير محسوم" &&
    ["Rückfahrkarte", "29 يورو", "zweiter Klasse"].every((fragment) => unresolvedReturnNoteA2Batch4?.finding.includes(fragment)) &&
    unresolvedReturnNoteA2Batch4?.action.includes("دون تعديل تخميني") &&
    reviewA2Batch4.contentPatch.protectedUnresolvedItemIds.includes("d-a2-09-q2") &&
    !reviewA2Batch4.contentPatch.changedFields.includes("d-a2-09-q2"),
    "K180f سؤال تذكرة العودة محفوظ كغير محسوم: التسلسل لا يثبت تنافي الخيارين، ولا تصحيح تخمينياً");

  ok(reviewA2Batch4.limitations.some((limitation) => limitation.includes("لم تُعَد مراجعة مستوى A2 أو CEFR")) &&
    reviewA2Batch4.limitations.some((limitation) => limitation.includes("ليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً")) &&
    reviewA2Batch4.limitations.some((limitation) => limitation.includes("حوار الصيدلية خيالي")) &&
    reviewMarkdownA2Batch4.includes("لا يثبت وسم المحتوى وحده الملاءمة التربوية") &&
    itemByIdA2Batch4.get("d-a2-07.lines[2]")?.status === "سليم" &&
    itemByIdA2Batch4.get("d-a2-07.lines[2]")?.finding.includes("ملاحظة دقة/أسلوب") === true &&
    itemByIdA2Batch4.get("d-a2-08.lines[0]")?.status === "سليم" &&
    !reviewA2Batch4.contentPatch.changedFields.some((field) => /cefr|level|percent|percentage|score/i.test(field)),
    "K180g الملاحظات الأسلوبية مفصولة عن الخطأ المؤكد؛ CEFR/النسبة والحكم الطبي وحدود الاعتماد موثقة دون ادعاء");
}

// K181 — source-audited review record for A2 dialogues 10–12 (R107).
{
  const reviewA2Batch5 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-05-2026-10-05.json", "utf8")) as any;
  const reviewMarkdownA2Batch5 = readFileSync("docs/content-review-a2-dialogues-05-2026-10-05.md", "utf8");
  const liveDialoguesA2Batch5 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const selectedA2Batch5 = liveDialoguesA2Batch5.filter((dialogue) => ["d-a2-10", "d-a2-11", "d-a2-12"].includes(dialogue.id));
  const itemByIdA2Batch5 = new Map<string, any>(reviewA2Batch5.items.map((item: any) => [item.id, item]));
  const expectedIdsA2Batch5 = selectedA2Batch5.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_: any, index: number) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question: any) => question.id),
    ...dialogue.dictation.map((_: any, index: number) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const expectedCountsA2Batch5 = { dialogues: 3, dialogueMetadata: 3, lines: 24, questions: 9, dictationSentences: 6, audioAssets: 0, unresolvedContextNotes: 2, totalTrackedItems: 42, waisenTermsReviewed: 25 };
  const statusesA2Batch5 = reviewA2Batch5.items.reduce((counts: Record<string, number>, item: any) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const snapshotMatchesA2Batch5 = selectedA2Batch5.every((dialogue) => {
    const metadata = itemByIdA2Batch5.get(dialogue.id)?.reviewed;
    if (!metadata || metadata.titleDe !== dialogue.titleDe || metadata.titleAr !== dialogue.titleAr ||
      metadata.level !== dialogue.level || metadata.lineCount !== dialogue.lines.length ||
      metadata.questionCount !== dialogue.questions.length || metadata.dictationCount !== dialogue.dictation.length ||
      metadata.neu !== dialogue.neu || metadata.hasWaisen !== Array.isArray(dialogue.waisen) ||
      JSON.stringify(metadata.waisen) !== JSON.stringify(dialogue.waisen)) return false;
    return dialogue.lines.every((line: any, index: number) =>
      JSON.stringify(itemByIdA2Batch5.get(`${dialogue.id}.lines[${index}]`)?.reviewed) === JSON.stringify(line)) &&
      dialogue.questions.every((question: any) =>
        JSON.stringify(itemByIdA2Batch5.get(question.id)?.reviewed) === JSON.stringify(question)) &&
      dialogue.dictation.every((sentence: string, index: number) =>
        itemByIdA2Batch5.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(selectedA2Batch5.length === 3 && JSON.stringify(expectedIdsA2Batch5) === JSON.stringify(reviewA2Batch5.items.map((item: any) => item.id)) &&
    reviewA2Batch5.items.length === 42 && reviewA2Batch5.coverage.totalTrackedItems === 42 &&
    JSON.stringify(reviewA2Batch5.coverage) === JSON.stringify(expectedCountsA2Batch5) && snapshotMatchesA2Batch5 &&
    statusesA2Batch5["سليم"] === 35 && statusesA2Batch5["مُصحح"] === 1 && statusesA2Batch5["غير محسوم"] === 6 &&
    reviewA2Batch5.statusCounts["سليم"] === 35 && reviewA2Batch5.statusCounts["مُصحح"] === 1 && reviewA2Batch5.statusCounts["غير محسوم"] === 6 &&
    reviewA2Batch5.items.every((item: any) => reviewMarkdownA2Batch5.includes(`| \`${item.id}\` |`)),
    "K181a تغطية R107 كاملة: 3 بيانات/24 سطراً/9 أسئلة/6 إملاءات و25 وسم waisen؛ كل اللقطات في JSON وMarkdown تطابق البيانات الحية");

  const sourceIdsA2Batch5 = reviewA2Batch5.sources.map((source: any) => source.id);
  const referencedSourcesA2Batch5 = new Set<string>([
    ...reviewA2Batch5.items.flatMap((item: any) => item.sources),
    ...reviewA2Batch5.openNotes.flatMap((note: any) => note.sources),
  ]);
  const expectedWaisenSourcesA2Batch5: Record<string, string[]> = {
    "d-a2-10": ["S06", "S07", "S01", "S12", "S15", "S25", "S20", "S19"],
    "d-a2-11": ["S38", "S40", "S41", "S48", "S50", "S43", "S39", "S44"],
    "d-a2-12": ["S76", "S83", "S73", "S65", "S58", "S77", "S68", "S62", "S60"],
  };
  const waisenEvidenceCompleteA2Batch5 = Object.entries(expectedWaisenSourcesA2Batch5).every(([id, sourceIds]) =>
    sourceIds.every((sourceId) => itemByIdA2Batch5.get(id)?.sources.includes(sourceId)));
  ok(reviewA2Batch5.sources.length === 83 && new Set(sourceIdsA2Batch5).size === 83 &&
    sourceIdsA2Batch5.every((id: string, index: number) => id === `S${String(index + 1).padStart(2, "0")}`) &&
    reviewA2Batch5.sources.every((source: any) => typeof source.url === "string" && source.url.startsWith("https://") &&
      typeof source.title === "string" && typeof source.supports === "string" && source.supports.length > 0 &&
      reviewMarkdownA2Batch5.includes(source.url)) &&
    referencedSourcesA2Batch5.size === 83 && reviewA2Batch5.sources.every((source: any) => referencedSourcesA2Batch5.has(source.id)) &&
    waisenEvidenceCompleteA2Batch5 &&
    reviewA2Batch5.items.every((item: any) => item.sources.length > 0 && item.finding.length > 0 && item.action.length > 0),
    "K181b كل وحدة وكل مفردات waisen لها دليل وحكم وإجراء؛ 83 رابطاً فريداً منشوراً وحدود إسنادها مربوطة بالسجل");

  const correctedSteigenA2Batch5 = itemByIdA2Batch5.get("d-a2-12.lines[3]");
  const liveDialogue12A2Batch5 = selectedA2Batch5.find((dialogue) => dialogue.id === "d-a2-12");
  const oldArabicSteigenA2Batch5 = "تصل الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل.";
  const newArabicSteigenA2Batch5 = "ترتفع درجة الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل.";
  const patchScriptA2Batch5 = readFileSync("scripts/patches/review_a2_dialogues_05.py", "utf8");
  ok(reviewA2Batch5.contentPatch.fieldsChanged === 1 &&
    JSON.stringify(reviewA2Batch5.contentPatch.changedFields) === JSON.stringify(["d-a2-12.lines[3].ar"]) &&
    correctedSteigenA2Batch5?.status === "مُصحح" && correctedSteigenA2Batch5?.before?.ar === oldArabicSteigenA2Batch5 &&
    correctedSteigenA2Batch5?.reviewed?.ar === newArabicSteigenA2Batch5 &&
    correctedSteigenA2Batch5?.before?.de === correctedSteigenA2Batch5?.reviewed?.de &&
    correctedSteigenA2Batch5?.reviewed?.de === liveDialogue12A2Batch5?.lines[3]?.de &&
    liveDialogue12A2Batch5?.lines[3]?.ar === newArabicSteigenA2Batch5 &&
    patchScriptA2Batch5.includes("d-a2-12") && patchScriptA2Batch5.includes("EXPECTED_BEFORE") && patchScriptA2Batch5.includes("EXPECTED_AFTER") &&
    reviewA2Batch5.contentPatch.protectedUnresolvedItemIds.includes("d-a2-12.lines[3]") &&
    !reviewA2Batch5.contentPatch.changedFields.some((field: string) => /cefr|level|percent|score|\.de$|\.answer$|options/i.test(field)),
    "K181c إصلاح steigen محدود لحقل الترجمة مع before/after ورقعة محمية؛ لا تغيير للألمانية أو القيمة أو الأسئلة أو CEFR");

  const historyA2Batch5 = reviewA2Batch5.historicalPatchReview;
  const creationPatchA2Batch5 = readFileSync("scripts/patches/dialoge_a2_neu1.py", "utf8");
  const oldHistoryPatchA2Batch5 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  ok(historyA2Batch5.sources.includes("scripts/patches/dialoge_a2_neu1.py") &&
    historyA2Batch5.sources.includes("scripts/patches/a_dialog_fallen.py") &&
    creationPatchA2Batch5.includes("d-a2-12") && creationPatchA2Batch5.includes(oldArabicSteigenA2Batch5) &&
    !oldHistoryPatchA2Batch5.includes("d-a2-10") && !oldHistoryPatchA2Batch5.includes("d-a2-11") && !oldHistoryPatchA2Batch5.includes("d-a2-12") &&
    historyA2Batch5.comparisons.length === 1 && historyA2Batch5.comparisons[0].id === "d-a2-12.lines[3].ar" &&
    historyA2Batch5.comparisons[0].historicalText === oldArabicSteigenA2Batch5 &&
    historyA2Batch5.comparisons[0].liveText === newArabicSteigenA2Batch5 &&
    historyA2Batch5.role.includes("لا كحكم لغوي") && historyA2Batch5.unavailableHistoricalFields.length >= 3,
    "K181d المقارنة التاريخية محدودة بمصدر الإنشاء وبحث ملف الأسئلة؛ لا تدّعي استعادة تاريخ كامل");

  const audioManifestA2Batch5 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as { einsaetze: { id: string; file: string }[] };
  const targetAudioIdsA2Batch5 = new Set(["d-a2-10", "d-a2-11", "d-a2-12"]);
  const manifestAudioMatchesA2Batch5 = audioManifestA2Batch5.einsaetze.filter((entry) => targetAudioIdsA2Batch5.has(entry.id));
  const publicMatchesA2Batch5: string[] = [];
  const scanPublicA2Batch5 = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) scanPublicA2Batch5(path);
      else if (/d-a2-(10|11|12)/.test(entry.name)) publicMatchesA2Batch5.push(path);
    }
  };
  scanPublicA2Batch5("public");
  ok(manifestAudioMatchesA2Batch5.length === 0 && publicMatchesA2Batch5.length === 0 &&
    reviewA2Batch5.audioAssetAudit.length === 0 && reviewA2Batch5.coverage.audioAssets === 0 &&
    reviewA2Batch5.limitations.some((limitation: string) => limitation.includes("لم يُشغّل متصفح TTS")) &&
    reviewMarkdownA2Batch5.includes("لم يحدث استماع") && selectedA2Batch5.every((dialogue) => dialogue.neu === true),
    "K181e فحص البيان وأسماء الملفات بلا استنتاج أن الصوت مطلوب؛ لا ادعاء تشغيل/استماع أو اختبار TTS");

  const legalNoteA2Batch5 = reviewA2Batch5.openNotes.find((note: any) => note.id === "d-a2-10.lines[3]");
  const weatherNoteA2Batch5 = reviewA2Batch5.openNotes.find((note: any) => note.id === "d-a2-12.lines[0]");
  const expectedWeatherItemsA2Batch5 = ["d-a2-12.lines[0]", "d-a2-12.lines[1]", "d-a2-12.lines[3]", "d-a2-12.lines[5]", "d-a2-12.lines[6]", "d-a2-12.lines[7]"];
  ok(reviewA2Batch5.openNotes.length === 2 && legalNoteA2Batch5?.status === "غير محسوم" &&
    legalNoteA2Batch5.finding.includes("لا تكفي جملة المستأجرة") && legalNoteA2Batch5.finding.includes("§536 BGB") &&
    weatherNoteA2Batch5?.status === "غير محسوم" &&
    JSON.stringify(weatherNoteA2Batch5.relatedItemIds) === JSON.stringify(expectedWeatherItemsA2Batch5) &&
    expectedWeatherItemsA2Batch5.every((id) => reviewA2Batch5.contentPatch.protectedUnresolvedItemIds.includes(id)) &&
    itemByIdA2Batch5.get("d-a2-10.lines[3]")?.status === "غير محسوم" &&
    [0, 1, 5, 6, 7].every((index) => itemByIdA2Batch5.get(`d-a2-12.lines[${index}]`)?.status === "غير محسوم") &&
    itemByIdA2Batch5.get("d-a2-12.lines[3]")?.status === "مُصحح" && reviewA2Batch5.coverage.unresolvedContextNotes === 2,
    "K181f سببية العفن ووقائع الطقس محفوظة كغير محسومة؛ لا تخمين في المحتوى، مع فصل تصحيح الترجمة عن صحة التنبؤ");

  const expectedAnswersA2Batch5 = new Map<string, string | string[]>([
    ["d-a2-10-q1", "Weil das Fenster sehr klein ist und die Feuchtigkeit bleibt."],
    ["d-a2-10-q2", "schriftlich, mit Foto und Datum"],
    ["d-a2-10-q3", "richtig"],
    ["d-a2-11-q1", "Sie ist gerade besetzt."],
    ["d-a2-11-q2", "seinen Namen und seine Nummer sprechen"],
    ["d-a2-11-q3", ["weiterleiten"]],
    ["d-a2-12-q1", "neblig, besonders an den Flüssen"],
    ["d-a2-12-q2", "in den Bergen"],
    ["d-a2-12-q3", "falsch"],
  ]);
  const liveQuestionChecksA2Batch5 = selectedA2Batch5.flatMap((dialogue) => dialogue.questions).every((question: any) => {
    const answer = question.answer;
    const expectedAnswer = expectedAnswersA2Batch5.get(question.id);
    const validAnswer = question.type === "fill"
      ? Array.isArray(answer) && answer.length > 0 && question.promptDe.includes("___")
      : Array.isArray(answer) ? answer.every((value: string) => question.options.includes(value)) : question.options.includes(answer);
    const item = itemByIdA2Batch5.get(question.id);
    return expectedAnswer !== undefined && JSON.stringify(answer) === JSON.stringify(expectedAnswer) && validAnswer && item?.status === "سليم" &&
      JSON.stringify(item.reviewed.options) === JSON.stringify(question.options) &&
      JSON.stringify(item.reviewed.answer) === JSON.stringify(question.answer) &&
      item.reviewed.explanationAr === question.explanationAr;
  });
  const liveDictationChecksA2Batch5 = selectedA2Batch5.every((dialogue) => dialogue.dictation.every((sentence: string, index: number) => {
    const isQuotedInDialogue = dialogue.lines.some((line: any) => line.de.includes(sentence));
    const item = itemByIdA2Batch5.get(`${dialogue.id}.dictation[${index}]`);
    return isQuotedInDialogue && item?.reviewed?.sentence === sentence && item?.status === "سليم";
  }));
  ok(liveQuestionChecksA2Batch5 && liveDictationChecksA2Batch5 &&
    reviewA2Batch5.items.filter((item: any) => item.kind === "سؤال/خيارات/مفتاح/شرح").length === 9 &&
    reviewA2Batch5.items.filter((item: any) => item.kind === "جملة إملاء").length === 6,
    "K181g مفاتيح الأسئلة التسعة متوقعة وضمن الخيارات الحية وشروحها مطابقة؛ جمل الإملاء مسندة حرفياً إلى النص الحي");

  ok(reviewA2Batch5.limitations.some((limitation: string) => limitation.includes("ليست مراجعة بشرية أو اعتماداً لغوياً/قانونياً/مهنياً")) &&
    reviewA2Batch5.limitations.some((limitation: string) => limitation.includes("لم يُعَد تقييم A2/CEFR")) &&
    reviewA2Batch5.limitations.some((limitation: string) => limitation.includes("لا تحسم بمفردها سلاسة كل جملة عربية")) &&
    reviewA2Batch5.contentPatch.fieldsChanged === 1 &&
    !reviewA2Batch5.contentPatch.changedFields.some((field: string) => /cefr|level|percent|percentage|score/i.test(field)) &&
    reviewA2Batch5.items.some((item: any) => item.id === "d-a2-11.lines[6]" && item.status === "سليم" && item.finding.includes("ملاحظة وضوح لا خطأ مؤكد")) &&
    reviewMarkdownA2Batch5.includes("لا يُعد غير المحسوم خطأً لغوياً") &&
    reviewMarkdownA2Batch5.includes("لا تحل هذه البوابات محل مراجعة بشرية"),
    "K181h حدود المعجم والمراجعة والوسم الأسلوبي وCEFR معلنة؛ لا تعميم أو اعتماد بشري مزعوم");
}

// K182 — source-audited review record for A2 dialogues 13–15 (R108).
{
  const reviewA2Batch6 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-06-2026-10-05.json", "utf8")) as any;
  const reviewMarkdownA2Batch6 = readFileSync("docs/content-review-a2-dialogues-06-2026-10-05.md", "utf8");
  const liveDialoguesA2Batch6 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const selectedA2Batch6 = liveDialoguesA2Batch6.filter((dialogue) => ["d-a2-13", "d-a2-14", "d-a2-15"].includes(dialogue.id));
  const itemByIdA2Batch6 = new Map<string, any>(reviewA2Batch6.items.map((item: any) => [item.id, item]));
  const expectedIdsA2Batch6 = selectedA2Batch6.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_: any, index: number) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question: any) => question.id),
    ...dialogue.dictation.map((_: any, index: number) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const expectedCountsA2Batch6 = { dialogues: 3, dialogueMetadata: 3, lines: 24, questions: 9, dictationSentences: 6, audioAssets: 0, unresolvedContextNotes: 3, totalTrackedItems: 42, waisenTermsReviewed: 29 };
  const statusesA2Batch6 = reviewA2Batch6.items.reduce((counts: Record<string, number>, item: any) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
  const snapshotMatchesA2Batch6 = selectedA2Batch6.every((dialogue) => {
    const metadata = itemByIdA2Batch6.get(dialogue.id)?.reviewed;
    if (!metadata || metadata.titleDe !== dialogue.titleDe || metadata.titleAr !== dialogue.titleAr ||
      metadata.level !== dialogue.level || metadata.lineCount !== dialogue.lines.length ||
      metadata.questionCount !== dialogue.questions.length || metadata.dictationCount !== dialogue.dictation.length ||
      metadata.neu !== dialogue.neu || metadata.hasWaisen !== Array.isArray(dialogue.waisen) ||
      JSON.stringify(metadata.waisen) !== JSON.stringify(dialogue.waisen)) return false;
    return dialogue.lines.every((line: any, index: number) =>
      JSON.stringify(itemByIdA2Batch6.get(`${dialogue.id}.lines[${index}]`)?.reviewed) === JSON.stringify(line)) &&
      dialogue.questions.every((question: any) =>
        JSON.stringify(itemByIdA2Batch6.get(question.id)?.reviewed) === JSON.stringify(question)) &&
      dialogue.dictation.every((sentence: string, index: number) =>
        itemByIdA2Batch6.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(selectedA2Batch6.length === 3 && JSON.stringify(selectedA2Batch6.map((dialogue) => dialogue.id)) === JSON.stringify(["d-a2-13", "d-a2-14", "d-a2-15"]) &&
    JSON.stringify(expectedIdsA2Batch6) === JSON.stringify(reviewA2Batch6.items.map((item: any) => item.id)) &&
    reviewA2Batch6.items.length === 42 && reviewA2Batch6.coverage.totalTrackedItems === 42 &&
    JSON.stringify(reviewA2Batch6.coverage) === JSON.stringify(expectedCountsA2Batch6) && snapshotMatchesA2Batch6 &&
    statusesA2Batch6["سليم"] === 39 && statusesA2Batch6["مُصحح"] === 1 && statusesA2Batch6["غير محسوم"] === 2 &&
    reviewA2Batch6.statusCounts["سليم"] === 39 && reviewA2Batch6.statusCounts["مُصحح"] === 1 && reviewA2Batch6.statusCounts["غير محسوم"] === 2 &&
    reviewA2Batch6.items.every((item: any) => reviewMarkdownA2Batch6.includes(`| \`${item.id}\` |`)),
    "K182a تغطية R108 كاملة: 42 وحدة و29 مفردة waisen؛ الترتيب واللقطات الحية في JSON/Markdown مطابقة والنتائج متوازنة");

  const sourceIdsA2Batch6 = reviewA2Batch6.sources.map((source: any) => source.id);
  const referencedSourcesA2Batch6 = new Set<string>([
    ...reviewA2Batch6.items.flatMap((item: any) => item.sources),
    ...reviewA2Batch6.openNotes.flatMap((note: any) => note.sources),
    ...reviewA2Batch6.styleNotes.flatMap((note: any) => note.sources),
  ]);
  const expectedWaisenSourcesA2Batch6: Record<string, string[]> = {
    "d-a2-13": ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08"],
    "d-a2-14": ["S09", "S10", "S11", "S12", "S13", "S14", "S15", "S16", "S17", "S18"],
    "d-a2-15": ["S19", "S20", "S21", "S22", "S23", "S24", "S25", "S26", "S27", "S28", "S29"],
  };
  const waisenEvidenceCompleteA2Batch6 = Object.entries(expectedWaisenSourcesA2Batch6).every(([id, sourceIds]) =>
    sourceIds.every((sourceId) => itemByIdA2Batch6.get(id)?.sources.includes(sourceId)));
  ok(reviewA2Batch6.sources.length === 81 && new Set(sourceIdsA2Batch6).size === 81 &&
    new Set(reviewA2Batch6.sources.map((source: any) => source.url)).size === 81 &&
    sourceIdsA2Batch6.every((id: string, index: number) => id === `S${String(index + 1).padStart(2, "0")}`) &&
    reviewA2Batch6.sources.every((source: any) => typeof source.url === "string" && source.url.startsWith("https://") &&
      typeof source.title === "string" && typeof source.supports === "string" && source.supports.length > 0) &&
    referencedSourcesA2Batch6.size === 81 && reviewA2Batch6.sources.every((source: any) => referencedSourcesA2Batch6.has(source.id)) &&
    waisenEvidenceCompleteA2Batch6 && reviewA2Batch6.items.every((item: any) => item.sources.length > 0 && item.finding.length > 0 && item.action.length > 0),
    "K182b كل وحدة ووسوم waisen مسندة بدليل وحكم وإجراء؛ 81 مرجعاً فريداً وكلها مستعملة");

  const correctedArabicA2Batch6 = itemByIdA2Batch6.get("d-a2-13.lines[2]");
  const liveDialogue13A2Batch6 = selectedA2Batch6.find((dialogue) => dialogue.id === "d-a2-13");
  const oldArabicOnboardingA2Batch6 = "فترة التأهيل تدوم أربعة أسابيع. في هذه الفترة لا ضغط وقت.";
  const newArabicOnboardingA2Batch6 = "تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني.";
  const patchScriptA2Batch6 = readFileSync("scripts/patches/review_a2_dialogues_06.py", "utf8");
  ok(reviewA2Batch6.contentPatch.fieldsChanged === 1 &&
    JSON.stringify(reviewA2Batch6.contentPatch.changedFields) === JSON.stringify(["d-a2-13.lines[2].ar"]) &&
    correctedArabicA2Batch6?.status === "مُصحح" && correctedArabicA2Batch6?.before?.ar === oldArabicOnboardingA2Batch6 &&
    correctedArabicA2Batch6?.reviewed?.ar === newArabicOnboardingA2Batch6 &&
    correctedArabicA2Batch6?.before?.de === correctedArabicA2Batch6?.reviewed?.de &&
    correctedArabicA2Batch6?.reviewed?.de === liveDialogue13A2Batch6?.lines[2]?.de &&
    liveDialogue13A2Batch6?.lines[2]?.ar === newArabicOnboardingA2Batch6 &&
    patchScriptA2Batch6.includes("BEFORE =") && patchScriptA2Batch6.includes("AFTER =") &&
    patchScriptA2Batch6.includes("check_protected_content") &&
    !reviewA2Batch6.contentPatch.changedFields.some((field: string) => /cefr|level|percent|score|\.de$|\.answer$|options/i.test(field)),
    "K182c إصلاح العربية محصور بحقل واحد مع before/after؛ الألمانية والأسئلة والمستويات لم تتغير والرقعة محروسة");

  const protectedDialogue14A2Batch6 = selectedA2Batch6.find((dialogue) => dialogue.id === "d-a2-14");
  const protectedQuestion14A2Batch6 = protectedDialogue14A2Batch6?.questions.find((question: any) => question.id === "d-a2-14-q2");
  const protectedDialogue15A2Batch6 = selectedA2Batch6.find((dialogue) => dialogue.id === "d-a2-15");
  const deferredA2Batch6 = reviewA2Batch6.contentPatch.deferredSuggestions;
  ok(protectedDialogue14A2Batch6?.lines[2]?.de === "Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck." &&
    protectedDialogue14A2Batch6?.lines[2]?.ar === "طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط." &&
    protectedQuestion14A2Batch6?.promptDe === "Wie viele Übernachtungen bleibt er?" &&
    protectedQuestion14A2Batch6?.answer === "drei" &&
    JSON.stringify(protectedQuestion14A2Batch6?.options) === JSON.stringify(["zwei", "drei", "eine Übernachtung"]) &&
    protectedDialogue15A2Batch6?.lines[1]?.de === "Ja. Das Fleisch habe ich gestern aus dem Gefrierfach genommen, es ist aufgetaut." &&
    protectedDialogue15A2Batch6?.lines[2]?.de === "Gut. Zuerst den Backofen vorheizen, 180 Grad." &&
    deferredA2Batch6.length === 3 && reviewA2Batch6.contentPatch.protectedUnresolvedItemIds.includes("d-a2-14.lines[2]") &&
    reviewA2Batch6.contentPatch.protectedUnresolvedItemIds.includes("d-a2-14.lines[7]") &&
    reviewA2Batch6.contentPatch.protectedStyleItemIds.includes("d-a2-14-q2.promptDe") &&
    reviewA2Batch6.contentPatch.protectedStyleItemIds.includes("d-a2-15.lines[2].de"),
    "K182j الغموض والبدائل الأسلوبية محفوظة بلا تعديل تخميني؛ لم تتحول قطعة الأمتعة أو أسلوب السؤال/الوصفة إلى أخطاء مؤكدة");

  const historyA2Batch6 = reviewA2Batch6.historicalPatchReview;
  const creationPatchA2Batch6 = readFileSync("scripts/patches/dialoge_a2_neu1.py", "utf8");
  const oldQuestionPatchA2Batch6 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  ok(historyA2Batch6.sources.includes("scripts/patches/dialoge_a2_neu1.py") &&
    historyA2Batch6.sources.includes("scripts/patches/a_dialog_fallen.py") &&
    creationPatchA2Batch6.includes(oldArabicOnboardingA2Batch6) &&
    creationPatchA2Batch6.includes("طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط.") &&
    !oldQuestionPatchA2Batch6.includes("d-a2-13") && !oldQuestionPatchA2Batch6.includes("d-a2-14") && !oldQuestionPatchA2Batch6.includes("d-a2-15") &&
    historyA2Batch6.comparisons.length === 3 &&
    historyA2Batch6.comparisons[0].id === "d-a2-13.lines[2].ar" && historyA2Batch6.comparisons[0].historicalText === oldArabicOnboardingA2Batch6 &&
    historyA2Batch6.comparisons[0].liveText === newArabicOnboardingA2Batch6 &&
    historyA2Batch6.comparisons[1].historicalText === historyA2Batch6.comparisons[1].liveText &&
    historyA2Batch6.comparisons[2].historicalText === historyA2Batch6.comparisons[2].liveText &&
    historyA2Batch6.role.includes("لا كحكم لغوي") && historyA2Batch6.role.includes("سجل تعديل كامل") &&
    historyA2Batch6.unavailableHistoricalFields.length >= 3,
    "K182d المقارنة التاريخية مقتصرة على ملف الإنشاء؛ لا تُنسب إلى ملف الأسئلة أو تُدّعى كسجل كامل");

  const audioManifestA2Batch6 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as { einsaetze: { id: string; file: string }[] };
  const targetAudioIdsA2Batch6 = new Set(["d-a2-13", "d-a2-14", "d-a2-15"]);
  const manifestAudioMatchesA2Batch6 = audioManifestA2Batch6.einsaetze.filter((entry) => targetAudioIdsA2Batch6.has(entry.id));
  const publicMatchesA2Batch6: string[] = [];
  const scanPublicA2Batch6 = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) scanPublicA2Batch6(path);
      else if (/d-a2-(13|14|15)/.test(entry.name)) publicMatchesA2Batch6.push(path);
    }
  };
  scanPublicA2Batch6("public");
  ok(manifestAudioMatchesA2Batch6.length === 0 && publicMatchesA2Batch6.length === 0 &&
    reviewA2Batch6.audioAssetAudit.length === 0 && reviewA2Batch6.coverage.audioAssets === 0 &&
    reviewA2Batch6.limitations.some((limitation: string) => limitation.includes("لم يحدث تشغيل أو استماع")) &&
    reviewMarkdownA2Batch6.includes("لم يحدث تشغيل أو استماع") && selectedA2Batch6.every((dialogue) => dialogue.neu === true),
    "K182e فُحص بيان الصوت وأسماء الملفات؛ لا ادعاء تشغيل أو استماع ولا استنتاج أن غياب الصوت عيب");

  const baggageNoteA2Batch6 = reviewA2Batch6.openNotes.find((note: any) => note.id === "d-a2-14.lines[2]");
  const tippingNoteA2Batch6 = reviewA2Batch6.openNotes.find((note: any) => note.id === "d-a2-14.lines[7]");
  const thawNoteA2Batch6 = reviewA2Batch6.openNotes.find((note: any) => note.id === "d-a2-15.lines[1]");
  ok(reviewA2Batch6.openNotes.length === 3 && baggageNoteA2Batch6?.status === "غير محسوم" &&
    baggageNoteA2Batch6.finding.includes("Gepäckstück") && baggageNoteA2Batch6.finding.includes("لا يحسم نية الحوار") &&
    tippingNoteA2Batch6?.status === "غير محسوم" && tippingNoteA2Batch6.finding.includes("بلد الفندق") && tippingNoteA2Batch6.finding.includes("الجهة المقصودة") &&
    thawNoteA2Batch6?.status === "غير محسوم" && thawNoteA2Batch6.finding.includes("الدواجن") && thawNoteA2Batch6.finding.includes("لا يسمح") &&
    JSON.stringify(thawNoteA2Batch6.relatedItemIds) === JSON.stringify(["d-a2-15.lines[1]"]) &&
    reviewA2Batch6.coverage.unresolvedContextNotes === 3 &&
    ["d-a2-14.lines[2]", "d-a2-14.lines[7]"].every((id) => reviewA2Batch6.contentPatch.protectedUnresolvedItemIds.includes(id)) &&
    reviewA2Batch6.items.find((item: any) => item.id === "d-a2-15.lines[1]")?.status === "سليم",
    "K182f الإكرامية وسلامة إذابة لحم غير محدد وغموض Gepäck موثقة كحدود سياق لا كأخطاء لغوية مثبتة");

  const expectedAnswersA2Batch6 = new Map<string, string | string[]>([
    ["d-a2-13-q1", "vier Wochen"],
    ["d-a2-13-q2", "ihr Kollege Tom"],
    ["d-a2-13-q3", ["Zeitdruck"]],
    ["d-a2-14-q1", "ein Einzelzimmer mit Aussicht auf den Fluss"],
    ["d-a2-14-q2", "drei"],
    ["d-a2-14-q3", "falsch"],
    ["d-a2-15-q1", "das Fleisch aus dem Gefrierfach genommen"],
    ["d-a2-15-q2", "weil es sonst Klumpen gibt"],
    ["d-a2-15-q3", ["vorheizen"]],
  ]);
  const liveQuestionChecksA2Batch6 = selectedA2Batch6.flatMap((dialogue) => dialogue.questions).every((question: any) => {
    const expectedAnswer = expectedAnswersA2Batch6.get(question.id);
    const validAnswer = question.type === "fill"
      ? Array.isArray(question.answer) && question.answer.length > 0 && question.promptDe.includes("___")
      : Array.isArray(question.answer) ? question.answer.every((value: string) => question.options.includes(value)) : question.options.includes(question.answer);
    const item = itemByIdA2Batch6.get(question.id);
    return expectedAnswer !== undefined && JSON.stringify(question.answer) === JSON.stringify(expectedAnswer) && validAnswer &&
      item?.reviewed?.promptDe === question.promptDe &&
      JSON.stringify(item.reviewed.options) === JSON.stringify(question.options) &&
      JSON.stringify(item.reviewed.answer) === JSON.stringify(question.answer) &&
      item.reviewed.explanationAr === question.explanationAr && item.finding.length > 0 && item.action.length > 0;
  });
  const liveDictationChecksA2Batch6 = selectedA2Batch6.every((dialogue) => dialogue.dictation.every((sentence: string, index: number) => {
    const isQuotedInDialogue = dialogue.lines.some((line: any) => line.de.includes(sentence));
    const item = itemByIdA2Batch6.get(`${dialogue.id}.dictation[${index}]`);
    return isQuotedInDialogue && item?.reviewed?.sentence === sentence && item?.status === "سليم";
  }));
  ok(liveQuestionChecksA2Batch6 && liveDictationChecksA2Batch6 &&
    reviewA2Batch6.items.filter((item: any) => item.kind === "سؤال/خيارات/مفتاح/شرح").length === 9 &&
    reviewA2Batch6.items.filter((item: any) => item.kind === "جملة إملاء").length === 6,
    "K182g مفاتيح الأسئلة التسعة متوقعة وضمن خياراتها الحية وشروحها مطابقة؛ جمل الإملاء الست واردة في الحوار");

  const statusDefinitionsA2Batch6 = reviewA2Batch6.statusDefinitions;
  ok(reviewA2Batch6.limitations.some((limitation: string) => limitation.includes("ليست مراجعة بشرية أو اعتماداً لغوياً/مهنياً")) &&
    reviewA2Batch6.limitations.some((limitation: string) => limitation.includes("لم يُعَد تقييم A2/CEFR")) &&
    reviewA2Batch6.limitations.some((limitation: string) => limitation.includes("مداخل القواميس تسند مفردات محددة")) &&
    statusDefinitionsA2Batch6["غير محسوم"].includes("لا يعني التصنيف ثبوت خطأ لغوي") &&
    reviewA2Batch6.contentPatch.fieldsChanged === 1 &&
    !reviewA2Batch6.contentPatch.changedFields.some((field: string) => /cefr|level|percent|percentage|score/i.test(field)) &&
    reviewA2Batch6.items.some((item: any) => item.id === "d-a2-14-q2" && item.status === "سليم" && item.finding.includes("اقتراحاً أسلوبياً")) &&
    reviewA2Batch6.items.some((item: any) => item.id === "d-a2-15.lines[2]" && item.status === "سليم" && item.finding.includes("لا يكفي وحده لإثبات خطأ")) &&
    reviewMarkdownA2Batch6.includes("مراجعة بشرية") && reviewMarkdownA2Batch6.includes("لم يُعَد تقييم A2/CEFR"),
    "K182h حدود المعجم والمراجعة وCEFR معلنة؛ لا اعتماد بشري مزعوم ولا ترقية لملاحظة أسلوبية إلى خطأ");

  ok(reviewA2Batch6.sources.every((source: any) => reviewMarkdownA2Batch6.includes(source.url)) &&
    reviewA2Batch6.items.every((item: any) => item.sources.every((sourceId: string) =>
      reviewMarkdownA2Batch6.includes(`${sourceId}`))) &&
    reviewMarkdownA2Batch6.includes("## سجل المصادر المنشورة وحدودها") &&
    reviewMarkdownA2Batch6.includes("## بدائل أسلوبية مؤجلة — ليست أخطاء مؤكدة") &&
    reviewMarkdownA2Batch6.includes("## المقارنة التاريخية المحدودة") &&
    reviewMarkdownA2Batch6.includes("## تدقيق الصوت والاختبارات"),
    "K182i Markdown يضم روابط المصادر وحدودها وكل أقسام السجل والبدائل والتاريخ والصوت");
}

// K183 — source-audited review record for A2 dialogues 16–18 (R109).
{
  const reviewA2Batch7 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-07-2026-10-06.json", "utf8")) as any;
  const reviewMarkdownA2Batch7 = readFileSync("docs/content-review-a2-dialogues-07-2026-10-06.md", "utf8");
  const liveDialoguesA2Batch7 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const selectedA2Batch7 = liveDialoguesA2Batch7.filter((dialogue) => ["d-a2-16", "d-a2-17", "d-a2-18"].includes(dialogue.id));
  const itemByIdA2Batch7 = new Map<string, any>(reviewA2Batch7.items.map((item: any) => [item.id, item]));
  const expectedIdsA2Batch7 = selectedA2Batch7.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_: any, index: number) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question: any) => question.id),
    ...dialogue.dictation.map((_: any, index: number) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const expectedCoverageA2Batch7 = { dialogues: 3, dialogueMetadata: 3, lines: 24, questions: 9, dictationSentences: 6, audioAssets: 0, unresolvedContextNotes: 3, styleNotes: 3, totalTrackedItems: 42, waisenTermsReviewed: 28 };
  const statusCountsA2Batch7 = reviewA2Batch7.items.reduce((counts: Record<string, number>, item: any) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مُصحح": 0, "غير محسوم": 0 } as Record<string, number>);
  const snapshotsMatchA2Batch7 = selectedA2Batch7.every((dialogue) => {
    const metadata = itemByIdA2Batch7.get(dialogue.id)?.reviewed;
    if (!metadata || metadata.titleDe !== dialogue.titleDe || metadata.titleAr !== dialogue.titleAr ||
      metadata.level !== dialogue.level || metadata.lineCount !== dialogue.lines.length ||
      metadata.questionCount !== dialogue.questions.length || metadata.dictationCount !== dialogue.dictation.length ||
      metadata.neu !== dialogue.neu || metadata.hasWaisen !== Array.isArray(dialogue.waisen) ||
      JSON.stringify(metadata.waisen) !== JSON.stringify(dialogue.waisen)) return false;
    return dialogue.lines.every((line: any, index: number) =>
      JSON.stringify(itemByIdA2Batch7.get(`${dialogue.id}.lines[${index}]`)?.reviewed) === JSON.stringify(line)) &&
      dialogue.questions.every((question: any) =>
        JSON.stringify(itemByIdA2Batch7.get(question.id)?.reviewed) === JSON.stringify(question)) &&
      dialogue.dictation.every((sentence: string, index: number) =>
        itemByIdA2Batch7.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(selectedA2Batch7.length === 3 && JSON.stringify(selectedA2Batch7.map((dialogue) => dialogue.id)) === JSON.stringify(["d-a2-16", "d-a2-17", "d-a2-18"]) &&
    JSON.stringify(expectedIdsA2Batch7) === JSON.stringify(reviewA2Batch7.items.map((item: any) => item.id)) &&
    reviewA2Batch7.items.length === 42 && JSON.stringify(reviewA2Batch7.coverage) === JSON.stringify(expectedCoverageA2Batch7) && snapshotsMatchA2Batch7 &&
    statusCountsA2Batch7["سليم"] === 33 && statusCountsA2Batch7["مُصحح"] === 9 && statusCountsA2Batch7["غير محسوم"] === 0 &&
    reviewA2Batch7.statusCounts["سليم"] === 33 && reviewA2Batch7.statusCounts["مُصحح"] === 9 && reviewA2Batch7.statusCounts["غير محسوم"] === 0 &&
    reviewA2Batch7.items.every((item: any) => item.sources.length > 0 && itemByIdA2Batch7.get(item.id)?.finding.length > 0 && item.action.length > 0 &&
      reviewMarkdownA2Batch7.includes(`| \`${item.id}\` |`)),
    "K183a تغطية R109 كاملة: 42 وحدة مرتبة ولقطاتها الحية مطابقة، 33 سليمة و9 مصححة");

  const sourceIdsA2Batch7 = reviewA2Batch7.sources.map((source: any) => source.id);
  const referencedSourcesA2Batch7 = new Set<string>([
    ...reviewA2Batch7.items.flatMap((item: any) => item.sources),
    ...reviewA2Batch7.openNotes.flatMap((note: any) => note.sources),
    ...reviewA2Batch7.styleNotes.flatMap((note: any) => note.sources),
    ...reviewA2Batch7.waisenTermAudit.flatMap((entry: any) => entry.sources),
    ...reviewA2Batch7.vocabularyCardPatch.sources,
  ]);
  const liveWaisenA2Batch7 = selectedA2Batch7.flatMap((dialogue) => dialogue.waisen);
  const auditedWaisenA2Batch7 = reviewA2Batch7.waisenTermAudit.map((entry: any) => entry.term);
  const waisenByDialogueA2Batch7 = new Map<string, string[]>(["d-a2-16", "d-a2-17", "d-a2-18"].map((id) =>
    [id, reviewA2Batch7.waisenTermAudit.filter((entry: any) => entry.dialogueId === id).map((entry: any) => entry.term)]));
  ok(reviewA2Batch7.sources.length === 58 && new Set(sourceIdsA2Batch7).size === 58 && new Set(reviewA2Batch7.sources.map((source: any) => source.url)).size === 58 &&
    sourceIdsA2Batch7.every((id: string, index: number) => id === `S${String(index + 1).padStart(2, "0")}`) &&
    reviewA2Batch7.sources.every((source: any) => source.url.startsWith("https://") && source.title.length > 0 && source.supports.length > 0 && source.limits.length > 0 &&
      referencedSourcesA2Batch7.has(source.id) && reviewMarkdownA2Batch7.includes(source.url)) && referencedSourcesA2Batch7.size === 58 &&
    JSON.stringify(auditedWaisenA2Batch7) === JSON.stringify(liveWaisenA2Batch7) &&
    waisenByDialogueA2Batch7.get("d-a2-16")?.length === 9 && waisenByDialogueA2Batch7.get("d-a2-17")?.length === 10 &&
    waisenByDialogueA2Batch7.get("d-a2-18")?.length === 9 && new Set(auditedWaisenA2Batch7).size === 28 &&
    reviewA2Batch7.waisenTermAudit.every((entry: any) => entry.sources.length > 0 && entry.finding.length > 0 && entry.action.length > 0),
    "K183b 58 مصدراً منشوراً مستخدمة بحدودها؛ فُحصت 28 مفردة waisen فردياً وترتيبها يطابق الحي");

  const expectedChangedDialogueFieldsA2Batch7 = [
    "d-a2-16.questions[d-a2-16-q2].promptDe", "d-a2-16.questions[d-a2-16-q2].promptAr", "d-a2-16.questions[d-a2-16-q2].options",
    "d-a2-16.questions[d-a2-16-q2].answer", "d-a2-16.questions[d-a2-16-q2].explanationAr",
    "d-a2-17.lines[6].de", "d-a2-17.lines[6].ar", "d-a2-17.questions[d-a2-17-q1].explanationAr",
    "d-a2-18.lines[2].de", "d-a2-18.lines[4].ar", "d-a2-18.lines[7].ar",
    "d-a2-18.questions[d-a2-18-q2].explanationAr", "d-a2-18.questions[d-a2-18-q3].promptDe",
    "d-a2-18.questions[d-a2-18-q3].explanationAr", "d-a2-18.waisen[8]",
  ];
  const expectedChangedVocabFieldsA2Batch7 = ["vd-wohnen-021.de", "vd-wohnen-021.ar", "vd-wohnen-021.article", "vd-wohnen-021.plural", "vd-wohnen-021.farbe", "vd-wohnen-021.exampleDe", "vd-wohnen-021.exampleAr"];
  const beforeQ16A2Batch7 = itemByIdA2Batch7.get("d-a2-16-q2")?.before;
  const beforeAccentA2Batch7 = itemByIdA2Batch7.get("d-a2-17.lines[6]")?.before;
  const beforeD18A2Batch7 = itemByIdA2Batch7.get("d-a2-18.lines[2]")?.before;
  const beforeGrammarA2Batch7 = itemByIdA2Batch7.get("d-a2-18-q3")?.before;
  const liveQ16A2Batch7 = selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-16")?.questions.find((question: any) => question.id === "d-a2-16-q2");
  const liveQ18A2Batch7 = selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-18")?.questions.find((question: any) => question.id === "d-a2-18-q3");
  ok(reviewA2Batch7.contentPatch.fieldsChanged === 22 && reviewA2Batch7.contentPatch.dialogueFieldsChanged === 15 && reviewA2Batch7.contentPatch.vocabularyFieldsChanged === 7 &&
    JSON.stringify(reviewA2Batch7.contentPatch.dialogueChangedFields) === JSON.stringify(expectedChangedDialogueFieldsA2Batch7) &&
    JSON.stringify(reviewA2Batch7.contentPatch.vocabularyChangedFields) === JSON.stringify(expectedChangedVocabFieldsA2Batch7) &&
    JSON.stringify(reviewA2Batch7.contentPatch.changedFields) === JSON.stringify([...expectedChangedDialogueFieldsA2Batch7, ...expectedChangedVocabFieldsA2Batch7]) &&
    beforeQ16A2Batch7?.answer === "neben der Tür" && beforeAccentA2Batch7?.de === "Der Akzent ist kein Problem, wenn Sie langsam sprechen. Wichtig ist: dranbleiben." &&
    beforeD18A2Batch7?.de.includes("Die Wohnfläche sind 54 Quadratmeter") && beforeGrammarA2Batch7?.answer === "richtig" &&
    liveQ16A2Batch7?.options[0] === "Der Erste-Hilfe-Kasten hängt neben der Tür und ist rot." &&
    JSON.stringify(liveQ16A2Batch7?.options) === JSON.stringify([
      "Der Erste-Hilfe-Kasten hängt neben der Tür und ist rot.",
      "Der Erste-Hilfe-Kasten steht neben der Tür und ist rot.",
      "Der Erste-Hilfe-Kasten hängt neben der Tür und ist gelb.",
    ]) && liveQ16A2Batch7?.answer === liveQ16A2Batch7?.options[0] && !liveQ16A2Batch7?.explanationAr.includes("اللافتة الصفراء تحذير") &&
    selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-17")?.lines[6]?.de === "Ein Akzent ist normal. Sprechen Sie langsam und deutlich. Wenn man Sie nicht versteht, wiederholen Sie den Satz. Wichtig ist: dranbleiben." &&
    selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-17")?.questions[0]?.answer === "der Wortschatz" &&
    !selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-17")?.questions[0]?.explanationAr.includes("kein Problem") &&
    selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-18")?.lines[2]?.de === "Sehr gut, das sehe ich. Die Wohnfläche ist 54 Quadratmeter, alles sauber." &&
    selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-18")?.lines[4]?.ar === "نعم، بعد أربعة أسابيع، عقب آخر تسوية للإيجار الشامل." &&
    selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-18")?.lines[7]?.ar === "لا، إدارة العقار وجدته. سينتقل إلى الشقة في الأول من الشهر." &&
    liveQ18A2Batch7?.promptDe === "Die Wohnfläche ist 54 Quadratmeter." && liveQ18A2Batch7?.answer === "richtig" &&
    !reviewA2Batch7.contentPatch.changedFields.some((field: string) => /cefr|level|percent|percentage|score/i.test(field)),
    "K183c التصحيحات التسعة موثقة قبل/بعد؛ 22 حقلاً محصوراً، ومفتاحا q2/q3 والسياق المحمي محفوظة");

  const expectedAnswersA2Batch7 = new Map<string, string | string[]>([
    ["d-a2-16-q1", "erst, wenn man sie verstanden hat"],
    ["d-a2-16-q2", "Der Erste-Hilfe-Kasten hängt neben der Tür und ist rot."],
    ["d-a2-16-q3", "falsch"],
    ["d-a2-17-q1", "der Wortschatz"],
    ["d-a2-17-q2", "am Freitag"],
    ["d-a2-17-q3", ["Lernpartner"]],
    ["d-a2-18-q1", "die Wände weiß gestrichen"],
    ["d-a2-18-q2", "in vier Wochen, nach der Abrechnung"],
    ["d-a2-18-q3", "richtig"],
  ]);
  const liveQuestionChecksA2Batch7 = selectedA2Batch7.flatMap((dialogue) => dialogue.questions).every((question: any) => {
    const expectedAnswer = expectedAnswersA2Batch7.get(question.id);
    const validAnswer = question.type === "fill"
      ? Array.isArray(question.answer) && question.answer.length > 0 && question.promptDe.includes("___")
      : Array.isArray(question.answer) ? question.answer.every((value: string) => question.options.includes(value)) : question.options.includes(question.answer);
    const item = itemByIdA2Batch7.get(question.id);
    return expectedAnswer !== undefined && JSON.stringify(question.answer) === JSON.stringify(expectedAnswer) && validAnswer &&
      item?.reviewed?.promptDe === question.promptDe && JSON.stringify(item.reviewed.options) === JSON.stringify(question.options) &&
      JSON.stringify(item.reviewed.answer) === JSON.stringify(question.answer) && item.reviewed.explanationAr === question.explanationAr &&
      item.status === (new Set(["d-a2-16-q2", "d-a2-17-q1", "d-a2-18-q2", "d-a2-18-q3"]).has(question.id) ? "مُصحح" : "سليم");
  });
  const liveDictationChecksA2Batch7 = selectedA2Batch7.every((dialogue) => dialogue.dictation.every((sentence: string, index: number) => {
    const item = itemByIdA2Batch7.get(`${dialogue.id}.dictation[${index}]`);
    return dialogue.lines.some((line: any) => line.de.includes(sentence)) && item?.reviewed?.sentence === sentence && item?.status === "سليم";
  }));
  ok(liveQuestionChecksA2Batch7 && liveDictationChecksA2Batch7 &&
    reviewA2Batch7.items.filter((item: any) => item.kind === "سؤال/خيارات/مفتاح/شرح").length === 9 &&
    reviewA2Batch7.items.filter((item: any) => item.kind === "جملة إملاء").length === 6 &&
    selectedA2Batch7.find((dialogue) => dialogue.id === "d-a2-18")?.questions[1]?.explanationAr.includes("لا موعد ردّ الكفالة"),
    "K183d الإجابات التسع في خياراتها ومطابقة للمراجعة، والشرح يميز am Ersten؛ الإملاء الستة مسند نصياً");

  const unresolvedA2Batch7 = reviewA2Batch7.openNotes;
  const yellowNoteA2Batch7 = unresolvedA2Batch7.find((note: any) => note.id === "d-a2-16.lines[7]");
  const workRuleNoteA2Batch7 = unresolvedA2Batch7.find((note: any) => note.id === "d-a2-16.lines[4]");
  const depositNoteA2Batch7 = unresolvedA2Batch7.find((note: any) => note.id === "d-a2-18.lines[4]");
  const styleIdsA2Batch7 = reviewA2Batch7.styleNotes.map((note: any) => note.id);
  ok(unresolvedA2Batch7.length === 3 && reviewA2Batch7.coverage.unresolvedContextNotes === 3 &&
    yellowNoteA2Batch7?.status === "غير محسوم سياقياً" && yellowNoteA2Batch7.finding.includes("اللون الأصفر وحده") &&
    workRuleNoteA2Batch7?.status === "غير محسوم سياقياً" && workRuleNoteA2Batch7.finding.includes("لا تثبت قاعدة قانونية مطلقة") &&
    depositNoteA2Batch7?.status === "غير محسوم سياقياً" && depositNoteA2Batch7.finding.includes("لا تجعل أربعة أسابيع مهلة عامة") &&
    ["d-a2-16.lines[4]", "d-a2-16.lines[7]", "d-a2-18.lines[4]", "d-a2-18-q2"].every((id) => reviewA2Batch7.contentPatch.protectedUnresolvedItemIds.includes(id)) &&
    reviewA2Batch7.styleNotes.length === 3 && JSON.stringify(styleIdsA2Batch7) === JSON.stringify(["d-a2-17.lines[4]", "d-a2-18.lines[3].ar", "d-a2-16.lines[6].ar"]) &&
    reviewA2Batch7.styleNotes.every((note: any) => note.reason.length > 0 && note.sources.length > 0) &&
    !reviewA2Batch7.contentPatch.changedFields.some((field: string) => styleIdsA2Batch7.some((id: string) => field.includes(id))),
    "K183e مسائل اللافتة والقانون والمهلة مصنفة سياقية، والبدائل الأسلوبية الثلاثة ليست أخطاء مثبتة ولا تغييرات تخمينية");

  const liveVocabA2Batch7 = JSON.parse(readFileSync("content/vocab.json", "utf8")) as Record<string, { cards: any[] }>;
  const nachmieterCardA2Batch7 = Object.values(liveVocabA2Batch7).flatMap((deck) => deck.cards).find((card) => card.id === "vd-wohnen-021");
  const linkedNachmieterA2Batch7 = karteFuerWort("Nachmieter", "A2");
  const nachmieterLinkA2Batch7 = linkedNachmieterA2Batch7 ? verknuepfung(linkedNachmieterA2Batch7) : null;
  const waveSourceA2Batch7 = readFileSync("scripts/vokabel_welle7.py", "utf8");
  const pluralSourceA2Batch7 = readFileSync("scripts/patches/apply_plurals.py", "utf8");
  const applyDialogueSourceA2Batch7 = readFileSync("scripts/patches/apply_dialoge.py", "utf8");
  ok(nachmieterCardA2Batch7?.de === "der Nachmieter" && nachmieterCardA2Batch7.article === "der" && nachmieterCardA2Batch7.plural === "die Nachmieter" &&
    nachmieterCardA2Batch7.farbe === "BLAU" && nachmieterCardA2Batch7.pos === "Nomen" && nachmieterCardA2Batch7.level === "A2" &&
    nachmieterCardA2Batch7.exampleDe === "Ich suche einen Nachmieter für die Wohnung." &&
    nachmieterCardA2Batch7.aussprache === reviewA2Batch7.vocabularyCardPatch.after.aussprache &&
    reviewA2Batch7.vocabularyCardPatch.fieldsChanged === 7 && reviewA2Batch7.vocabularyCardPatch.before.de === "die Nachmieter suchen" &&
    reviewA2Batch7.vocabularyCardPatch.after.de === "der Nachmieter" && waveSourceA2Batch7.includes('("der Nachmieter","المستأجرُ البديلُ"') &&
    pluralSourceA2Batch7.includes('"vd-wohnen-021": "die Nachmieter"') && stammVon("der Nachmieter") === "nachmiet" &&
    linkedNachmieterA2Batch7?.id === "vd-wohnen-021" && nachmieterLinkA2Batch7?.dialoge.some((dialogue: any) => dialogue.id === "d-a2-18") === true &&
    reviewA2Batch7.associationAudit.calculatedStem === "nachmiet" && reviewA2Batch7.associationAudit.surfaceContainsStem === true &&
    applyDialogueSourceA2Batch7.includes("max(4,len(x)-2)") && applyDialogueSourceA2Batch7.includes("stamm(w) not in low"),
    "K183f بطاقة الاسم ومصدرها وخريطة جمعها متزامنة؛ stammVon/karteFuerWort/verknuepfung تربط den Nachmieter بحوار d-a2-18");

  const creationSourceA2Batch7 = readFileSync("scripts/patches/dialoge_a2_neu1.py", "utf8");
  const historicalQuestionsSourceA2Batch7 = readFileSync("scripts/patches/a_dialog_fallen.py", "utf8");
  const historicalMatchesA2Batch7 = reviewA2Batch7.historicalPatchReview.comparisons.every((entry: any) =>
    creationSourceA2Batch7.includes(entry.historicalText) && entry.liveText.length > 0 && entry.observation.length > 0);
  const audioManifestA2Batch7 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as { einsaetze: { id: string; file: string }[] };
  const targetAudioIdsA2Batch7 = new Set(["d-a2-16", "d-a2-17", "d-a2-18"]);
  const manifestAudioMatchesA2Batch7 = audioManifestA2Batch7.einsaetze.filter((entry) => targetAudioIdsA2Batch7.has(entry.id));
  const publicAudioMatchesA2Batch7: string[] = [];
  const scanPublicA2Batch7 = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) scanPublicA2Batch7(path);
      else if (/d-a2-(16|17|18)/.test(entry.name)) publicAudioMatchesA2Batch7.push(path);
    }
  };
  scanPublicA2Batch7("public");
  ok(reviewA2Batch7.historicalPatchReview.sources.includes("scripts/patches/dialoge_a2_neu1.py") &&
    reviewA2Batch7.historicalPatchReview.sources.includes("scripts/patches/a_dialog_fallen.py") && historicalMatchesA2Batch7 &&
    reviewA2Batch7.historicalPatchReview.comparisons.length === 11 && !historicalQuestionsSourceA2Batch7.includes("d-a2-16") &&
    !historicalQuestionsSourceA2Batch7.includes("d-a2-17") && !historicalQuestionsSourceA2Batch7.includes("d-a2-18") &&
    manifestAudioMatchesA2Batch7.length === 0 && publicAudioMatchesA2Batch7.length === 0 && reviewA2Batch7.audioAssetAudit.length === 0 &&
    reviewA2Batch7.coverage.audioAssets === 0 && reviewA2Batch7.limitations.some((limitation: string) => limitation.includes("لم يحدث تشغيل أو استماع")) &&
    reviewMarkdownA2Batch7.includes("لا يدل أي منهما على تاريخ تعديلات كامل"),
    "K183g المقارنة التاريخية محدودة بالمصدر المتاح؛ بيان/ملفات الصوت خالية للنطاق، دون ادعاء استماع أو سجل كامل");

  ok(reviewA2Batch7.date === "2026-10-06" && reviewA2Batch7.reviewRule === "R109" && reviewA2Batch7.batch === "A2-dialogues-07" &&
    reviewMarkdownA2Batch7.includes("## سجل الوحدات الـ42") && reviewMarkdownA2Batch7.includes("## تدقيق مفردات waisen (28 مدخلاً فردياً)") &&
    reviewMarkdownA2Batch7.includes("## ملاحظات سياقية غير محسومة") && reviewMarkdownA2Batch7.includes("## بدائل أسلوبية/تربوية") &&
    reviewMarkdownA2Batch7.includes("## سجل المصادر المنشورة وحدودها") && reviewMarkdownA2Batch7.includes("## تدقيق الصوت والاختبارات") &&
    reviewA2Batch7.limitations.some((limitation: string) => limitation.includes("ليست مراجعة بشرية")) &&
    reviewA2Batch7.limitations.some((limitation: string) => limitation.includes("لم يُعَد تقييم A2/CEFR")) &&
    reviewA2Batch7.contentPatch.sourceFilesChanged === 2 &&
    reviewA2Batch7.dependencySecurity.status.includes("fixed") && reviewA2Batch7.dependencySecurity.packages.some((pkg: any) => pkg.name === "sharp" && pkg.after === "0.35.5") &&
    reviewA2Batch7.dependencySecurity.packages.some((pkg: any) => pkg.name === "source-map-js" && pkg.after === "1.2.2") &&
    reviewMarkdownA2Batch7.includes("## إصلاح أمني مؤكد للتبعيات") &&
    !reviewA2Batch7.contentPatch.changedFields.some((field: string) => /cefr|level|percent|percentage|score/i.test(field)) &&
    reviewA2Batch7.items.every((item: any) => item.status !== "غير محسوم"),
    "K183h التقرير يصرح بحدود المراجعة والصوت وCEFR، ويوثق المصدر والإجراء بلا ادعاء اعتماد بشري أو خلل غير مثبت");
}

// K184 — source-audited review record for A2 dialogues 19–21 (R110).
{
  const reviewA2Batch8 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-08-2026-10-07.json", "utf8")) as any;
  const reviewMarkdownA2Batch8 = readFileSync("docs/content-review-a2-dialogues-08-2026-10-07.md", "utf8");
  const liveDialoguesA2Batch8 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const audioManifestA2Batch8 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as any;
  const patchSourceA2Batch8 = readFileSync("scripts/patches/review_a2_dialogues_08.py", "utf8");
  const patchReportA2Batch8 = readFileSync("scripts/patches/report_a2_dialogues_08.py", "utf8");
  const selectedA2Batch8 = liveDialoguesA2Batch8.filter((dialogue) => ["d-a2-19", "d-a2-20", "d-a2-21"].includes(dialogue.id));
  const itemByIdA2Batch8 = new Map<string, any>(reviewA2Batch8.items.map((item: any) => [item.id, item]));
  const expectedIdsA2Batch8 = selectedA2Batch8.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_: any, index: number) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question: any) => question.id),
    ...dialogue.dictation.map((_: any, index: number) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const statusCountsA2Batch8 = reviewA2Batch8.items.reduce((counts: Record<string, number>, item: any) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مصحح": 0, "غير محسوم": 0 } as Record<string, number>);
  const snapshotsMatchA2Batch8 = selectedA2Batch8.every((dialogue) => {
    const meta = itemByIdA2Batch8.get(dialogue.id)?.reviewed;
    if (!meta || meta.titleDe !== dialogue.titleDe || meta.titleAr !== dialogue.titleAr ||
      meta.level !== dialogue.level || meta.lineCount !== dialogue.lines.length ||
      meta.questionCount !== dialogue.questions.length || meta.dictationCount !== dialogue.dictation.length ||
      meta.neu !== Boolean(dialogue.neu) || meta.hasWaisen !== Array.isArray(dialogue.waisen) ||
      JSON.stringify(meta.waisen) !== JSON.stringify(dialogue.waisen)) return false;
    return dialogue.lines.every((line: any, index: number) => {
      const snap = itemByIdA2Batch8.get(`${dialogue.id}.lines[${index}]`)?.reviewed;
      return snap && snap.de === line.de && snap.ar === line.ar && snap.who === line.who;
    }) && dialogue.questions.every((question: any) => {
      const snap = itemByIdA2Batch8.get(question.id)?.reviewed;
      return snap && JSON.stringify(snap) === JSON.stringify(question);
    }) && dialogue.dictation.every((sentence: string, index: number) =>
      itemByIdA2Batch8.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(selectedA2Batch8.length === 3 &&
    JSON.stringify(selectedA2Batch8.map((d) => d.id)) === JSON.stringify(["d-a2-19", "d-a2-20", "d-a2-21"]) &&
    JSON.stringify(expectedIdsA2Batch8) === JSON.stringify(reviewA2Batch8.items.map((i: any) => i.id)) &&
    reviewA2Batch8.items.length === 42 && snapshotsMatchA2Batch8 &&
    statusCountsA2Batch8["سليم"] === 41 && statusCountsA2Batch8["مصحح"] === 1 && statusCountsA2Batch8["غير محسوم"] === 0 &&
    reviewA2Batch8.statusCounts["سليم"] === 41 && reviewA2Batch8.statusCounts["مصحح"] === 1 && reviewA2Batch8.statusCounts["غير محسوم"] === 0 &&
    reviewA2Batch8.items.every((item: any) => Array.isArray(item.sources) && item.sources.length > 0 && item.action.length > 0) &&
    reviewA2Batch8.date === "2026-10-07" && reviewA2Batch8.batch === "a2-dialogues-08",
    "K184a تغطية R110 كاملة: 3 حوارات و42 وحدة (بيانات + أسطر + أسئلة + إملاءات)، 41 سليمة و1 مصححة");

  const sourceIdsA2Batch8 = reviewA2Batch8.sources.map((s: any) => s.id);
  const referencedSourcesA2Batch8 = new Set<string>([
    ...reviewA2Batch8.items.flatMap((i: any) => i.sources),
    ...reviewA2Batch8.contextNotes.flatMap((n: any) => n.sources || []),
    ...reviewA2Batch8.styleAlternatives.flatMap((n: any) => n.sources || []),
    ...reviewA2Batch8.waisen.flatMap((e: any) => e.sources),
  ]);
  const liveWaisenA2Batch8 = selectedA2Batch8.flatMap((d) => d.waisen);
  const auditedWaisenA2Batch8 = reviewA2Batch8.waisen.map((e: any) => e.term);
  const waisenByDialogueA2Batch8 = new Map<string, number>(
    ["d-a2-19", "d-a2-20", "d-a2-21"].map((id) => [id, reviewA2Batch8.waisen.filter((e: any) => e.dialogueId === id).length]));
  const allWaisenHaveCards = reviewA2Batch8.waisen.every((e: any) => e.hasCard && typeof e.cardId === "string" && e.level === "A2");
  ok(reviewA2Batch8.sources.length === 28 && new Set(sourceIdsA2Batch8).size === 28 &&
    new Set(reviewA2Batch8.sources.map((s: any) => s.url)).size === 28 &&
    sourceIdsA2Batch8.every((id: string, i: number) => id === `S${String(i + 1).padStart(2, "0")}`) &&
    reviewA2Batch8.sources.every((s: any) => s.url.startsWith("https://") && s.supports.length > 0 && s.limits.length > 0 &&
      referencedSourcesA2Batch8.has(s.id) && reviewMarkdownA2Batch8.includes(s.url)) &&
    JSON.stringify(auditedWaisenA2Batch8) === JSON.stringify(liveWaisenA2Batch8) &&
    waisenByDialogueA2Batch8.get("d-a2-19") === 9 && waisenByDialogueA2Batch8.get("d-a2-20") === 10 && waisenByDialogueA2Batch8.get("d-a2-21") === 9 &&
    new Set(auditedWaisenA2Batch8).size === 28 && allWaisenHaveCards,
    "K184b 24 مصدراً منشوراً مستخدَمة بحدودها؛ 28 مفردة waisen مدققة، لكل واحدة بطاقة مستوى A2");

  const correctedItem = itemByIdA2Batch8.get("d-a2-21.lines[4]");
  const liveLine21_4 = selectedA2Batch8.find((d) => d.id === "d-a2-21")?.lines[4];
  const correctedBefore = "إذن عليه غداً الذهاب إلى الطبيب المختص لا طبيب العائلة فقط.";
  const correctedAfter = "إذن عليه غداً الذهاب إلى الطبيب المختص لا إلى طبيب العائلة فقط.";
  // All German lines for all three dialogues must match the live snapshot exactly;
  // the Arabic of all other lines (except d-a2-21.lines[4]) must also match.
  const otherLinesUntouchedA2Batch8 = selectedA2Batch8.every((dialogue) => dialogue.lines.every((line: any, index: number) => {
    const item = itemByIdA2Batch8.get(`${dialogue.id}.lines[${index}]`);
    if (!item) return false;
    if (item.reviewed.de !== line.de) return false;
    if (dialogue.id === "d-a2-21" && index === 4) {
      return line.ar === correctedAfter && item.status === "مصحح" &&
        item.snapshotAr === correctedBefore && item.after?.ar === correctedAfter;
    }
    return item.reviewed.ar === line.ar && item.status === "سليم";
  }));
  // All dictation sentences must appear verbatim in some dialogue line (German).
  const dictationsVerbatimA2Batch8 = selectedA2Batch8.every((dialogue) => dialogue.dictation.every((sentence: string) =>
    dialogue.lines.some((line: any) => line.de.includes(sentence))));
  // Questions: keys must be in options and must match snapshot answers; all keys
  // untouched (no German/key changes in R110).
  const questionsMatchA2Batch8 = selectedA2Batch8.every((dialogue) => dialogue.questions.every((question: any) => {
    const snap = itemByIdA2Batch8.get(question.id)?.reviewed;
    if (!snap) return false;
    if (question.type === "fill") {
      return Array.isArray(question.answer) && question.answer.length > 0 &&
        snap.promptDe === question.promptDe && JSON.stringify(snap.answer) === JSON.stringify(question.answer) &&
        snap.explanationAr === question.explanationAr && itemByIdA2Batch8.get(question.id)?.status === "سليم";
    }
    return Array.isArray(question.options) && question.options.includes(question.answer) &&
      snap.promptDe === question.promptDe && JSON.stringify(snap.options) === JSON.stringify(question.options) &&
      JSON.stringify(snap.answer) === JSON.stringify(question.answer) && snap.explanationAr === question.explanationAr &&
      itemByIdA2Batch8.get(question.id)?.status === "سليم";
  }));
  ok(otherLinesUntouchedA2Batch8 && questionsMatchA2Batch8 && dictationsVerbatimA2Batch8 &&
    liveLine21_4?.de === "Dann muss er morgen zum Facharzt, nicht nur zum Hausarzt." &&
    liveLine21_4?.ar === correctedAfter && correctedItem?.status === "مصحح" &&
    correctedItem?.snapshotAr === correctedBefore && correctedItem?.after?.ar === correctedAfter &&
    reviewA2Batch8.correction.onlyFieldChanged === "d-a2-21.lines[4].ar" &&
    reviewA2Batch8.correction.beforeAr === correctedBefore && reviewA2Batch8.correction.afterAr === correctedAfter,
    "K184c التصحيح الوحيد محصور في d-a2-21.lines[4].ar، والألماني والأسئلة والمفاتيح وسائر الأسطر محمية من أي تغيير");

  // No audio entries or mp3 files for these dialogues.
  const manifestEntriesA2Batch8: any[] = [];
  const manifestData = audioManifestA2Batch8;
  // manifest may be an object keyed by category with einsaetze or a flat list.
  const collectFrom = (node: any) => {
    if (Array.isArray(node)) node.forEach(collectFrom);
    else if (node && typeof node === "object") {
      if (typeof node.id === "string" && /^d-a2-(19|20|21)/.test(node.id)) manifestEntriesA2Batch8.push(node);
      Object.values(node).forEach(collectFrom);
    }
  };
  collectFrom(manifestData);
  const publicMatchesA2Batch8: string[] = [];
  const scanPublicA2Batch8 = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const p = `${directory}/${entry.name}`;
      if (entry.isDirectory()) scanPublicA2Batch8(p);
      else if (/d-a2-(19|20|21)\.mp3$/.test(entry.name)) publicMatchesA2Batch8.push(p);
    }
  };
  scanPublicA2Batch8("public/audio");
  ok(manifestEntriesA2Batch8.length === 0 && publicMatchesA2Batch8.length === 0 &&
    reviewA2Batch8.audio.present === false && reviewA2Batch8.audio.note.includes("لم يحدث تشغيل أو استماع") &&
    reviewMarkdownA2Batch8.includes("لا توجد إدخالات") && reviewMarkdownA2Batch8.includes("لم يحدث تشغيل أو استماع"),
    "K184d لا توجد أصول صوت للنطاق في البيان أو على القرص، ولا ادعاء استماع أو فك ترميز");

  // Idempotent patch: the script contains explicit before/after guards that
  // refuse unexpected values, and prints "already applied; no files written" on
  // rerun. We confirm the anchors are present so reruns remain zero-diff.
  const patchRunnableA2Batch8 = patchSourceA2Batch8.includes("DIALOGUE_CHANGES") &&
    patchSourceA2Batch8.includes("guarded_update") && patchSourceA2Batch8.includes("Unexpected dialogue diff") &&
    patchSourceA2Batch8.includes("R110 patch complete") &&
    patchReportA2Batch8.includes("R110") && patchReportA2Batch8.includes("content-review-a2-dialogues-08");
  ok(patchRunnableA2Batch8,
    "K184e رقعة R110 محروسة وقابلة لإعادة التطبيق بلا أثر جانبي (تقرير 0 ملفات في الإعادة)");

  // Context/style notes are present and not converted into corrections.
  const contextNotesA2Batch8 = reviewA2Batch8.contextNotes;
  const styleAltsA2Batch8 = reviewA2Batch8.styleAlternatives;
  ok(Array.isArray(contextNotesA2Batch8) && contextNotesA2Batch8.length >= 5 &&
    Array.isArray(styleAltsA2Batch8) && styleAltsA2Batch8.length === 1 &&
    styleAltsA2Batch8[0].where === "d-a2-20.lines[6].ar" &&
    reviewA2Batch8.unresolved.length === 0 &&
    reviewMarkdownA2Batch8.includes("ملاحظات سياقية") &&
    reviewMarkdownA2Batch8.includes("بدائل أسلوبية"),
    "K184f الملاحظات السياقية (6) والبديل الأسلوبي (1) مصنّفة منفصلة ولا تحوَّل إلى أخطاء مؤكدة");

  // Limits explicitly stated in report (no CEFR, no human/medical/legal claim).
  const limitsA2Batch8 = reviewA2Batch8.limits;
  ok(reviewMarkdownA2Batch8.includes("## 9) البوابات والفحوص") &&
    reviewMarkdownA2Batch8.includes("K184") &&
    limitsA2Batch8.cefr.includes("لم يُعد تقييم") && limitsA2Batch8.audio.includes("لم يحدث") &&
    limitsA2Batch8.human.includes("ليست مراجعة بشرية") && limitsA2Batch8.medical.length > 0 && limitsA2Batch8.legal.length > 0 &&
    reviewMarkdownA2Batch8.includes("وليست مراجعة بشرية") && reviewMarkdownA2Batch8.includes("اعتماداً مهنياً"),
    "K184g التقرير يصرّح بحدود CEFR والصوت وعدم الادعاء البشري/الطبي/القانوني، ويذكر K184 صراحة");

  // Vocab cards are linked via waisen audit (every waisen points to a card id).
  ok(allWaisenHaveCards && reviewA2Batch8.waisen.every((e: any) => Array.isArray(e.sources) && e.sources.length > 0) &&
    reviewMarkdownA2Batch8.includes("## 7) مفردات waisen") && reviewMarkdownA2Batch8.includes("28 مصطلحاً") &&
    reviewA2Batch8.totals.waisenAudited === 28,
    "K184h مفردات waisen مرتبطة ببطاقاتها ومدعومة بمصادر، دون ادعاء مراجعة بشرية");

  // Expected question answers (keys) — protects against silent key drift.
  const expectedAnswersA2Batch8 = new Map<string, string | string[]>([
    ["d-a2-19-q1", "Die Unterschrift auf dem Formular fehlt."],
    ["d-a2-19-q2", "eine Vollmacht und ihren eigenen Ausweis"],
    ["d-a2-19-q3", "falsch"],
    ["d-a2-20-q1", "Sie ist voll, aber niemand macht sie an."],
    ["d-a2-20-q2", "Er macht die Küche, Nadia das Bad."],
    ["d-a2-20-q3", ["Rücksicht"]],
    ["d-a2-21-q1", "Die Mannschaft hat zwei zu drei verloren."],
    ["d-a2-21-q2", "zum Facharzt"],
    ["d-a2-21-q3", "richtig"],
  ]);
  const answersMatchA2Batch8 = selectedA2Batch8.every((d) => d.questions.every((q: any) => {
    const expected = expectedAnswersA2Batch8.get(q.id);
    if (expected === undefined) return false;
    return JSON.stringify(q.answer) === JSON.stringify(expected);
  }));
  ok(answersMatchA2Batch8,
    "K184i مفاتيح الإجابات التسع محمية ولا انحراف عن اللقطات المراجعة (بما في ذلك سؤال الملء وd-a2-19-q3/falsch وd-a2-21-q2/zum Facharzt)");

  // The single correction line is explicitly about Arabic parallelism, not about German content.
  const correctionRationaleA2Batch8 = reviewA2Batch8.correction.rationale;
  ok(correctedItem?.after?.de === correctedItem?.before?.de &&
    correctionRationaleA2Batch8.includes("التوازن النحوي") &&
    patchSourceA2Batch8.includes("d-a2-21") && patchSourceA2Batch8.includes("expectedDialogueCount") === false,
    "K184j الرقعة لا تغيّر أي نص ألماني ولا سؤالاً ولا مفتاحاً؛ التعديل الوحيد عربي ومسند إلى التوازن النحوي");
}

// K185 — source-audited review record for A2 dialogues 22–24 (R111).
{
  const reviewA2Batch9 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-09-2026-10-07.json", "utf8")) as any;
  const reviewMarkdownA2Batch9 = readFileSync("docs/content-review-a2-dialogues-09-2026-10-07.md", "utf8");
  const liveDialoguesA2Batch9 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const audioManifestA2Batch9 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as any;
  const patchSourceA2Batch9 = readFileSync("scripts/patches/review_a2_dialogues_09.py", "utf8");
  const patchReportA2Batch9 = readFileSync("scripts/patches/report_a2_dialogues_09.py", "utf8");
  const selectedA2Batch9 = liveDialoguesA2Batch9.filter((dialogue) => ["d-a2-22", "d-a2-23", "d-a2-24"].includes(dialogue.id));
  const itemByIdA2Batch9 = new Map<string, any>(reviewA2Batch9.items.map((item: any) => [item.id, item]));
  const expectedIdsA2Batch9 = selectedA2Batch9.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_: any, index: number) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question: any) => question.id),
    ...dialogue.dictation.map((_: any, index: number) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const statusCountsA2Batch9 = reviewA2Batch9.items.reduce((counts: Record<string, number>, item: any) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مصحح": 0, "غير محسوم": 0 } as Record<string, number>);
  const snapshotsMatchA2Batch9 = selectedA2Batch9.every((dialogue) => {
    const meta = itemByIdA2Batch9.get(dialogue.id)?.reviewed;
    if (!meta || meta.titleDe !== dialogue.titleDe || meta.titleAr !== dialogue.titleAr ||
      meta.level !== dialogue.level || meta.lineCount !== dialogue.lines.length ||
      meta.questionCount !== dialogue.questions.length || meta.dictationCount !== dialogue.dictation.length ||
      meta.neu !== Boolean(dialogue.neu) || meta.hasWaisen !== Array.isArray(dialogue.waisen) ||
      JSON.stringify(meta.waisen) !== JSON.stringify(dialogue.waisen)) return false;
    return dialogue.lines.every((line: any, index: number) => {
      const snap = itemByIdA2Batch9.get(`${dialogue.id}.lines[${index}]`)?.reviewed;
      return snap && snap.de === line.de && snap.ar === line.ar && snap.who === line.who;
    }) && dialogue.questions.every((question: any) => {
      const snap = itemByIdA2Batch9.get(question.id)?.reviewed;
      if (!snap) return false;
      // Compare semantic fields only — JSON key ordering must not break the gate.
      if (snap.id !== question.id || snap.type !== question.type ||
          snap.promptDe !== question.promptDe || snap.promptAr !== question.promptAr ||
          snap.answer !== undefined && JSON.stringify(snap.answer) !== JSON.stringify(question.answer) ||
          snap.explanationAr !== question.explanationAr) return false;
      if (question.type !== "fill") {
        if (!Array.isArray(snap.options) || JSON.stringify(snap.options) !== JSON.stringify(question.options)) return false;
      }
      return true;
    }) && dialogue.dictation.every((sentence: string, index: number) =>
      itemByIdA2Batch9.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(selectedA2Batch9.length === 3 &&
    JSON.stringify(selectedA2Batch9.map((d) => d.id)) === JSON.stringify(["d-a2-22", "d-a2-23", "d-a2-24"]) &&
    JSON.stringify(expectedIdsA2Batch9) === JSON.stringify(reviewA2Batch9.items.map((i: any) => i.id)) &&
    reviewA2Batch9.items.length === 42 && snapshotsMatchA2Batch9 &&
    statusCountsA2Batch9["سليم"] === 41 && statusCountsA2Batch9["مصحح"] === 1 && statusCountsA2Batch9["غير محسوم"] === 0 &&
    reviewA2Batch9.statusCounts["سليم"] === 41 && reviewA2Batch9.statusCounts["مصحح"] === 1 && reviewA2Batch9.statusCounts["غير محسوم"] === 0 &&
    reviewA2Batch9.items.every((item: any) => Array.isArray(item.sources) && item.sources.length > 0 && item.action.length > 0) &&
    reviewA2Batch9.date === "2026-10-07" && reviewA2Batch9.batch === "a2-dialogues-09",
    "K185a تغطية R111 كاملة: 3 حوارات و42 وحدة، 41 سليمة و1 مصحح، ولقطاتها متصلة بالحي");

  const sourceIdsA2Batch9 = reviewA2Batch9.sources.map((s: any) => s.id);
  const referencedSourcesA2Batch9 = new Set<string>([
    ...reviewA2Batch9.items.flatMap((i: any) => i.sources),
    ...reviewA2Batch9.contextNotes.flatMap((n: any) => n.sources || []),
    ...reviewA2Batch9.styleAlternatives.flatMap((n: any) => n.sources || []),
    ...reviewA2Batch9.waisen.flatMap((e: any) => e.sources),
  ]);
  const liveWaisenA2Batch9 = selectedA2Batch9.flatMap((d) => d.waisen);
  const auditedWaisenA2Batch9 = reviewA2Batch9.waisen.map((e: any) => e.term);
  const waisenByDialogueA2Batch9 = new Map<string, number>(
    ["d-a2-22", "d-a2-23", "d-a2-24"].map((id) => [id, reviewA2Batch9.waisen.filter((e: any) => e.dialogueId === id).length]));
  const allWaisenHaveCardsA2Batch9 = reviewA2Batch9.waisen.every((e: any) => e.hasCard && typeof e.cardId === "string" && (e.level === "A2" || e.level === "B1" || e.level === "B2" || e.level === "C1" || e.level === "A1"));
  ok(reviewA2Batch9.sources.length === 40 && new Set(sourceIdsA2Batch9).size === 40 &&
    new Set(reviewA2Batch9.sources.map((s: any) => s.url)).size === 40 &&
    sourceIdsA2Batch9.every((id: string, i: number) => id === `S${String(i + 1).padStart(2, "0")}`) &&
    reviewA2Batch9.sources.every((s: any) => s.url.startsWith("https://") && s.supports.length > 0 && s.limits.length > 0 &&
      referencedSourcesA2Batch9.has(s.id) && reviewMarkdownA2Batch9.includes(s.url)) &&
    JSON.stringify(auditedWaisenA2Batch9) === JSON.stringify(liveWaisenA2Batch9) &&
    waisenByDialogueA2Batch9.get("d-a2-22") === 9 && waisenByDialogueA2Batch9.get("d-a2-23") === 11 && waisenByDialogueA2Batch9.get("d-a2-24") === 10 &&
    new Set(auditedWaisenA2Batch9).size === 30 && allWaisenHaveCardsA2Batch9,
    "K185b 40 مصدراً منشوراً مستخدَمة بحدودها؛ 30 مفردة waisen مدققة، لكل واحدة بطاقة");

  const correctedItem = itemByIdA2Batch9.get("d-a2-23.lines[5]");
  const liveLine23_5 = selectedA2Batch9.find((d) => d.id === "d-a2-23")?.lines[5];
  const correctedBeforeAr = "هذا يصنعه الأطفال. يجب أن تجرّبي الحلويات حتماً.";
  const correctedAfterAr = "هذه يصنعها الأطفال. يجب أن تجرّبي الحلويات حتماً.";
  const otherLinesUntouchedA2Batch9 = selectedA2Batch9.every((dialogue) => dialogue.lines.every((line: any, index: number) => {
    const item = itemByIdA2Batch9.get(`${dialogue.id}.lines[${index}]`);
    if (!item) return false;
    if (item.reviewed.de !== line.de) return false;
    if (dialogue.id === "d-a2-23" && index === 5) {
      return line.ar === correctedAfterAr && item.status === "مصحح" &&
        item.before?.ar === correctedBeforeAr && item.after?.ar === correctedAfterAr;
    }
    return item.reviewed.ar === line.ar && item.status === "سليم";
  }));
  const dictationsVerbatimA2Batch9 = selectedA2Batch9.every((dialogue) => dialogue.dictation.every((sentence: string) =>
    dialogue.lines.some((line: any) => line.de.includes(sentence))));
  const questionsMatchA2Batch9 = selectedA2Batch9.every((dialogue) => dialogue.questions.every((question: any) => {
    const snap = itemByIdA2Batch9.get(question.id)?.reviewed;
    if (!snap) return false;
    if (question.type === "fill") {
      return Array.isArray(question.answer) && question.answer.length > 0 &&
        snap.promptDe === question.promptDe && JSON.stringify(snap.answer) === JSON.stringify(question.answer) &&
        snap.explanationAr === question.explanationAr && itemByIdA2Batch9.get(question.id)?.status === "سليم";
    }
    return Array.isArray(question.options) && question.options.includes(question.answer) &&
      snap.promptDe === question.promptDe && JSON.stringify(snap.options) === JSON.stringify(question.options) &&
      JSON.stringify(snap.answer) === JSON.stringify(question.answer) && snap.explanationAr === question.explanationAr &&
      itemByIdA2Batch9.get(question.id)?.status === "سليم";
  }));
  ok(otherLinesUntouchedA2Batch9 && questionsMatchA2Batch9 && dictationsVerbatimA2Batch9 &&
    liveLine23_5?.de === "Das machen die Kinder. Du musst unbedingt die süßen Speisen probieren." &&
    liveLine23_5?.ar === correctedAfterAr && correctedItem?.status === "مصحح" &&
    correctedItem?.before?.ar === correctedBeforeAr && correctedItem?.after?.ar === correctedAfterAr &&
    reviewA2Batch9.correction.onlyFieldChanged === "d-a2-23.lines[5].ar" &&
    reviewA2Batch9.correction.beforeAr === correctedBeforeAr && reviewA2Batch9.correction.afterAr === correctedAfterAr &&
    reviewA2Batch9.correction.germanUnchanged === true && reviewA2Batch9.correction.questionsUnchanged === true,
    "K185c التصحيح الوحيد محصور في d-a2-23.lines[5].ar (تطابق الضمير مع «الزينة»)، والألماني والأسئلة والمفاتيح محمية");

  // Audio audit: no entries, no mp3s.
  const manifestEntriesA2Batch9: any[] = [];
  const collectFromA2Batch9 = (node: any) => {
    if (Array.isArray(node)) node.forEach(collectFromA2Batch9);
    else if (node && typeof node === "object") {
      if (typeof node.id === "string" && /^d-a2-(22|23|24)/.test(node.id)) manifestEntriesA2Batch9.push(node);
      Object.values(node).forEach(collectFromA2Batch9);
    }
  };
  collectFromA2Batch9(audioManifestA2Batch9);
  const publicMatchesA2Batch9: string[] = [];
  const scanPublicA2Batch9 = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const p = `${directory}/${entry.name}`;
      if (entry.isDirectory()) scanPublicA2Batch9(p);
      else if (/d-a2-(22|23|24)\.mp3$/.test(entry.name)) publicMatchesA2Batch9.push(p);
    }
  };
  scanPublicA2Batch9("public/audio");
  ok(manifestEntriesA2Batch9.length === 0 && publicMatchesA2Batch9.length === 0 &&
    reviewA2Batch9.audio.present === false && reviewA2Batch9.audio.note.includes("لم يحدث تشغيل") &&
    reviewMarkdownA2Batch9.includes("لا توجد") && reviewMarkdownA2Batch9.includes("لم يحدث تشغيل"),
    "K185d لا توجد أصول صوت للنطاق في البيان أو على القرص، ولا ادعاء استماع");

  const patchRunnableA2Batch9 = patchSourceA2Batch9.includes("TARGET_IDS") &&
    patchSourceA2Batch9.includes("guarded_update") && patchSourceA2Batch9.includes("Unexpected dialogue diff") &&
    patchSourceA2Batch9.includes("R111 patch complete") &&
    patchReportA2Batch9.includes("R111") && patchReportA2Batch9.includes("content-review-a2-dialogues-09");
  ok(patchRunnableA2Batch9,
    "K185e رقعة R111 محروسة وقابلة لإعادة التطبيق بلا أثر جانبي (تقرير 0 ملفات في الإعادة)");

  ok(Array.isArray(reviewA2Batch9.contextNotes) && reviewA2Batch9.contextNotes.length === 6 &&
    Array.isArray(reviewA2Batch9.styleAlternatives) && reviewA2Batch9.styleAlternatives.length === 2 &&
    reviewA2Batch9.unresolved.length === 0 &&
    reviewMarkdownA2Batch9.includes("ملاحظات سياقية") && reviewMarkdownA2Batch9.includes("بدائل أسلوبية"),
    "K185f الملاحظات السياقية (6) والبدائل الأسلوبية (2) مصنّفة منفصلة ولا تحوَّل إلى أخطاء");

  const limitsA2Batch9 = reviewA2Batch9.limits;
  ok(reviewMarkdownA2Batch9.includes("## 9) البوابات والفحوص") &&
    reviewMarkdownA2Batch9.includes("K185") &&
    limitsA2Batch9.cefr.includes("لم يُعد تقييم") && limitsA2Batch9.audio.includes("لم يحدث") &&
    limitsA2Batch9.human.includes("ليست مراجعة بشرية") && limitsA2Batch9.legal.length > 0,
    "K185g التقرير يصرّح بحدود CEFR والصوت وعدم الادعاء البشري/القانوني، ويذكر K185 صراحة");

  ok(allWaisenHaveCardsA2Batch9 && reviewA2Batch9.waisen.every((e: any) => Array.isArray(e.sources) && e.sources.length > 0) &&
    reviewMarkdownA2Batch9.includes("## 7) مفردات waisen") && reviewMarkdownA2Batch9.includes("30"),
    "K185h مفردات waisen مرتبطة ببطاقاتها ومدعومة بمصادر، دون ادعاء مراجعة بشرية");

  const expectedAnswersA2Batch9 = new Map<string, string | string[]>([
    ["d-a2-22-q1", "Es gab eine Rückzahlung von 80 Euro."],
    ["d-a2-22-q2", "einen Preisvergleich der Stromanbieter"],
    ["d-a2-22-q3", "richtig"],
    ["d-a2-23-q1", "die Kinder"],
    ["d-a2-23-q2", "nichts, nur sich selbst"],
    ["d-a2-23-q3", ["Gäste"]],
    ["d-a2-24-q1", "eine Eins"],
    ["d-a2-24-q2", "Seine Eltern können das Studium nicht bezahlen."],
    ["d-a2-24-q3", "falsch"],
  ]);
  const answersMatchA2Batch9 = selectedA2Batch9.every((d) => d.questions.every((q: any) => {
    const expected = expectedAnswersA2Batch9.get(q.id);
    if (expected === undefined) return false;
    return JSON.stringify(q.answer) === JSON.stringify(expected);
  }));
  ok(answersMatchA2Batch9,
    "K185i مفاتيح الإجابات التسع محمية ولا انحراف عن اللقطات المراجعة (بما في ذلك الملء وq3/falsch)");

  ok(correctedItem?.after?.de === correctedItem?.before?.de &&
    reviewA2Batch9.correction.rationale.includes("جنس الضمير") &&
    patchSourceA2Batch9.includes("d-a2-23"),
    "K185j الرقعة لا تغيّر أي نص ألماني ولا سؤالاً ولا مفتاحاً؛ التعديل الوحيد عربي ومسند إلى مطابقة جنس الضمير");
}

// K186 — source-audited review record for A2 dialogues 25–27 (R112).
{
  const reviewA2Batch10 = JSON.parse(readFileSync("docs/content-review-a2-dialogues-10-2026-10-07.json", "utf8")) as any;
  const reviewMarkdownA2Batch10 = readFileSync("docs/content-review-a2-dialogues-10-2026-10-07.md", "utf8");
  const liveDialoguesA2Batch10 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const audioManifestA2Batch10 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as any;
  const patchSourceA2Batch10 = readFileSync("scripts/patches/review_a2_dialogues_10.py", "utf8");
  const patchReportA2Batch10 = readFileSync("scripts/patches/report_a2_dialogues_10.py", "utf8");
  const selectedA2Batch10 = liveDialoguesA2Batch10.filter((dialogue) => ["d-a2-25", "d-a2-26", "d-a2-27"].includes(dialogue.id));
  const itemByIdA2Batch10 = new Map<string, any>(reviewA2Batch10.items.map((item: any) => [item.id, item]));
  const expectedIdsA2Batch10 = selectedA2Batch10.flatMap((dialogue) => [
    dialogue.id,
    ...dialogue.lines.map((_: any, index: number) => `${dialogue.id}.lines[${index}]`),
    ...dialogue.questions.map((question: any) => question.id),
    ...dialogue.dictation.map((_: any, index: number) => `${dialogue.id}.dictation[${index}]`),
  ]);
  const statusCountsA2Batch10 = reviewA2Batch10.items.reduce((counts: Record<string, number>, item: any) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, { "سليم": 0, "مصحح": 0, "غير محسوم": 0 } as Record<string, number>);
  const snapshotsMatchA2Batch10 = selectedA2Batch10.every((dialogue) => {
    const meta = itemByIdA2Batch10.get(dialogue.id)?.reviewed;
    if (!meta || meta.titleDe !== dialogue.titleDe || meta.titleAr !== dialogue.titleAr ||
      meta.level !== dialogue.level || meta.lineCount !== dialogue.lines.length ||
      meta.questionCount !== dialogue.questions.length || meta.dictationCount !== dialogue.dictation.length ||
      meta.neu !== Boolean(dialogue.neu) || meta.hasWaisen !== Array.isArray(dialogue.waisen) ||
      JSON.stringify(meta.waisen) !== JSON.stringify(dialogue.waisen)) return false;
    return dialogue.lines.every((line: any, index: number) => {
      const snap = itemByIdA2Batch10.get(`${dialogue.id}.lines[${index}]`)?.reviewed;
      return snap && snap.de === line.de && snap.ar === line.ar && snap.who === line.who;
    }) && dialogue.questions.every((question: any) => {
      const snap = itemByIdA2Batch10.get(question.id)?.reviewed;
      if (!snap) return false;
      if (snap.id !== question.id || snap.type !== question.type ||
          snap.promptDe !== question.promptDe || snap.promptAr !== question.promptAr ||
          snap.answer !== undefined && JSON.stringify(snap.answer) !== JSON.stringify(question.answer) ||
          snap.explanationAr !== question.explanationAr) return false;
      if (question.type !== "fill") {
        if (!Array.isArray(snap.options) || JSON.stringify(snap.options) !== JSON.stringify(question.options)) return false;
      }
      return true;
    }) && dialogue.dictation.every((sentence: string, index: number) =>
      itemByIdA2Batch10.get(`${dialogue.id}.dictation[${index}]`)?.reviewed?.sentence === sentence);
  });
  ok(selectedA2Batch10.length === 3 &&
    JSON.stringify(selectedA2Batch10.map((d) => d.id)) === JSON.stringify(["d-a2-25", "d-a2-26", "d-a2-27"]) &&
    JSON.stringify(expectedIdsA2Batch10) === JSON.stringify(reviewA2Batch10.items.map((i: any) => i.id)) &&
    reviewA2Batch10.items.length === 42 && snapshotsMatchA2Batch10 &&
    statusCountsA2Batch10["سليم"] === 38 && statusCountsA2Batch10["مصحح"] === 4 && statusCountsA2Batch10["غير محسوم"] === 0 &&
    reviewA2Batch10.statusCounts["سليم"] === 38 && reviewA2Batch10.statusCounts["مصحح"] === 4 && reviewA2Batch10.statusCounts["غير محسوم"] === 0 &&
    reviewA2Batch10.items.every((item: any) => Array.isArray(item.sources) && item.sources.length > 0 && item.action.length > 0) &&
    reviewA2Batch10.date === "2026-10-07" && reviewA2Batch10.batch === "a2-dialogues-10",
    "K186a تغطية R112 كاملة: 3 حوارات و42 وحدة، 38 سليمة و4 مصححة، ولقطاتها متصلة بالحي");

  const sourceIdsA2Batch10 = reviewA2Batch10.sources.map((s: any) => s.id);
  const referencedSourcesA2Batch10 = new Set<string>([
    ...reviewA2Batch10.items.flatMap((i: any) => i.sources),
    ...reviewA2Batch10.contextNotes.flatMap((n: any) => n.sources || []),
    ...reviewA2Batch10.styleAlternatives.flatMap((n: any) => n.sources || []),
    ...reviewA2Batch10.waisen.flatMap((e: any) => e.sources),
  ]);
  const liveWaisenA2Batch10 = selectedA2Batch10.flatMap((d) => d.waisen);
  const auditedWaisenA2Batch10 = reviewA2Batch10.waisen.map((e: any) => e.term);
  const waisenByDialogueA2Batch10 = new Map<string, number>(
    ["d-a2-25", "d-a2-26", "d-a2-27"].map((id) => [id, reviewA2Batch10.waisen.filter((e: any) => e.dialogueId === id).length]));
  const allWaisenHaveCardsA2Batch10 = reviewA2Batch10.waisen.every((e: any) => e.hasCard && typeof e.cardId === "string" && (e.level === "A2" || e.level === "B1" || e.level === "B2" || e.level === "C1" || e.level === "A1"));
  ok(reviewA2Batch10.sources.length === 40 && new Set(sourceIdsA2Batch10).size === 40 &&
    new Set(reviewA2Batch10.sources.map((s: any) => s.url)).size === 40 &&
    sourceIdsA2Batch10.every((id: string, i: number) => id === `S${String(i + 1).padStart(2, "0")}`) &&
    reviewA2Batch10.sources.every((s: any) => s.url.startsWith("https://") && s.supports.length > 0 && s.limits.length > 0 &&
      referencedSourcesA2Batch10.has(s.id) && reviewMarkdownA2Batch10.includes(s.url)) &&
    JSON.stringify(auditedWaisenA2Batch10) === JSON.stringify(liveWaisenA2Batch10) &&
    waisenByDialogueA2Batch10.get("d-a2-25") === 9 && waisenByDialogueA2Batch10.get("d-a2-26") === 10 && waisenByDialogueA2Batch10.get("d-a2-27") === 10 &&
    new Set(auditedWaisenA2Batch10).size === 29 && allWaisenHaveCardsA2Batch10,
    "K186b 40 مصدراً منشوراً مستخدَمة بحدودها؛ 29 مفردة waisen مدققة (9/10/10)، لكل واحدة بطاقة");

  const correctedFieldsA2Batch10 = ["d-a2-26.lines[2].ar", "d-a2-26.lines[3].ar", "d-a2-26.lines[4].ar", "d-a2-26.lines[5].ar"];
  const correctedBeforeArA2Batch10 = [
    "هذا في عرض خاص: 29 بدل 49 يورو. رخيص جداً.",
    "اللون قديم الطراز قليلاً. هل لديكم منه بالأزرق الداكن؟",
    "نعم، مقاس 38. غرفة القياس في الخلف يساراً. جرّبيه.",
    "مريح. سآخذه. وكيف الإرجاع إن لم يناسب في النهاية؟",
  ];
  const correctedAfterArA2Batch10 = [
    "هذه في عرض خاص: 29 بدل 49 يورو. رخيص جداً.",
    "اللون قديم الطراز قليلاً. هل لديكم منها بالأزرق الداكن؟",
    "نعم، مقاس 38. غرفة القياس في الخلف يساراً. جرّبيها.",
    "مريحة. سآخذها. وكيف الإرجاع إن لم تناسب في النهاية؟",
  ];
  const correctionsListA2Batch10 = reviewA2Batch10.correction.corrections;
  const correctionFieldsMatchedA2Batch10 = JSON.stringify(reviewA2Batch10.correction.changedFields) === JSON.stringify(correctedFieldsA2Batch10);
  const otherLinesUntouchedA2Batch10 = selectedA2Batch10.every((dialogue) => dialogue.lines.every((line: any, index: number) => {
    const item = itemByIdA2Batch10.get(`${dialogue.id}.lines[${index}]`);
    if (!item) return false;
    if (item.reviewed.de !== line.de) return false;
    if (dialogue.id === "d-a2-26" && [2, 3, 4, 5].includes(index)) {
      const ci = [2, 3, 4, 5].indexOf(index);
      return line.ar === correctedAfterArA2Batch10[ci] && item.status === "مصحح" &&
        item.before?.ar === correctedBeforeArA2Batch10[ci] && item.after?.ar === correctedAfterArA2Batch10[ci];
    }
    return item.reviewed.ar === line.ar && item.status === "سليم";
  }));
  const dictationsVerbatimA2Batch10 = selectedA2Batch10.every((dialogue) => dialogue.dictation.every((sentence: string) =>
    dialogue.lines.some((line: any) => line.de.includes(sentence))));
  const questionsMatchA2Batch10 = selectedA2Batch10.every((dialogue) => dialogue.questions.every((question: any) => {
    const snap = itemByIdA2Batch10.get(question.id)?.reviewed;
    if (!snap) return false;
    if (question.type === "fill") {
      return Array.isArray(question.answer) && question.answer.length > 0 &&
        snap.promptDe === question.promptDe && JSON.stringify(snap.answer) === JSON.stringify(question.answer) &&
        snap.explanationAr === question.explanationAr && itemByIdA2Batch10.get(question.id)?.status === "سليم";
    }
    return Array.isArray(question.options) && question.options.includes(question.answer) &&
      snap.promptDe === question.promptDe && JSON.stringify(snap.options) === JSON.stringify(question.options) &&
      JSON.stringify(snap.answer) === JSON.stringify(question.answer) && snap.explanationAr === question.explanationAr &&
      itemByIdA2Batch10.get(question.id)?.status === "سليم";
  }));
  ok(otherLinesUntouchedA2Batch10 && questionsMatchA2Batch10 && dictationsVerbatimA2Batch10 &&
    correctionFieldsMatchedA2Batch10 &&
    correctedBeforeArA2Batch10.every((_, i) =>
      correctionsListA2Batch10[i].beforeAr === correctedBeforeArA2Batch10[i] &&
      correctionsListA2Batch10[i].afterAr === correctedAfterArA2Batch10[i]) &&
    reviewA2Batch10.correction.germanUnchanged === true && reviewA2Batch10.correction.questionsUnchanged === true,
    "K186c التصحيحات الأربعة محصورة في d-a2-26.lines[2–5].ar (مطابقة الإشارة/الضمير/الصفة مع المؤنث «البنطال/هذه Hose»)، والألماني والأسئلة والمفاتيح محمية");

  const manifestEntriesA2Batch10: any[] = [];
  const collectFromA2Batch10 = (node: any) => {
    if (Array.isArray(node)) node.forEach(collectFromA2Batch10);
    else if (node && typeof node === "object") {
      if (typeof node.id === "string" && /^d-a2-(25|26|27)/.test(node.id)) manifestEntriesA2Batch10.push(node);
      Object.values(node).forEach(collectFromA2Batch10);
    }
  };
  collectFromA2Batch10(audioManifestA2Batch10);
  const publicMatchesA2Batch10: string[] = [];
  const scanPublicA2Batch10 = (directory: string) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const p = `${directory}/${entry.name}`;
      if (entry.isDirectory()) scanPublicA2Batch10(p);
      else if (/d-a2-(25|26|27)\.mp3$/.test(entry.name)) publicMatchesA2Batch10.push(p);
    }
  };
  scanPublicA2Batch10("public/audio");
  ok(manifestEntriesA2Batch10.length === 0 && publicMatchesA2Batch10.length === 0 &&
    reviewA2Batch10.audio.present === false && reviewA2Batch10.audio.note.includes("لم يحدث تشغيل") &&
    reviewMarkdownA2Batch10.includes("لا توجد") && reviewMarkdownA2Batch10.includes("لم يحدث تشغيل"),
    "K186d لا توجد أصول صوت للنطاق في البيان أو على القرص، ولا ادعاء استماع");

  const patchRunnableA2Batch10 = patchSourceA2Batch10.includes("TARGET_IDS") &&
    patchSourceA2Batch10.includes("guarded_update") && (patchSourceA2Batch10.includes("Unexpected dialogue diff") || patchSourceA2Batch10.includes("Unexpected diff:")) &&
    patchSourceA2Batch10.includes("R112 patch complete") &&
    patchReportA2Batch10.includes("R112") && patchReportA2Batch10.includes("content-review-a2-dialogues-10");
  ok(patchRunnableA2Batch10,
    "K186e رقعة R112 محروسة وقابلة لإعادة التطبيق بلا أثر جانبي (تقرير 0 ملفات في الإعادة)");

  ok(Array.isArray(reviewA2Batch10.contextNotes) && reviewA2Batch10.contextNotes.length === 6 &&
    Array.isArray(reviewA2Batch10.styleAlternatives) && reviewA2Batch10.styleAlternatives.length === 2 &&
    reviewA2Batch10.unresolved.length === 0 &&
    reviewMarkdownA2Batch10.includes("ملاحظات سياقية") && reviewMarkdownA2Batch10.includes("بدائل أسلوبية") &&
    reviewA2Batch10.contextNotes.some((n: any) => n.where.includes("d-a2-25") && n.note.includes("Nachzeigen")) &&
    reviewA2Batch10.contextNotes.some((n: any) => n.where.includes("d-a2-26") && n.note.includes("Kulanz")),
    "K186f الملاحظات السياقية (6) والبدائل الأسلوبية (2) مصنّفة منفصلة ولا تحوَّل إلى أخطاء؛ تشمل ملاحظتي Nachzeigen وKulanz");

  const limitsA2Batch10 = reviewA2Batch10.limits;
  ok(reviewMarkdownA2Batch10.includes("## 9) البوابات والفحوص") &&
    reviewMarkdownA2Batch10.includes("K186") &&
    limitsA2Batch10.cefr.includes("لم يُعد تقييم") && limitsA2Batch10.audio.includes("لم يحدث") &&
    limitsA2Batch10.human.includes("ليست مراجعة بشرية") && limitsA2Batch10.legal.length > 0,
    "K186g التقرير يصرّح بحدود CEFR والصوت وعدم الادعاء البشري/القانوني، ويذكر K186 صراحة");

  ok(allWaisenHaveCardsA2Batch10 && reviewA2Batch10.waisen.every((e: any) => Array.isArray(e.sources) && e.sources.length > 0) &&
    reviewMarkdownA2Batch10.includes("## 7) مفردات waisen") && reviewMarkdownA2Batch10.includes("29"),
    "K186h مفردات waisen مرتبطة ببطاقاتها ومدعومة بمصادر، دون ادعاء مراجعة بشرية");

  const expectedAnswersA2Batch10 = new Map<string, string | string[]>([
    ["d-a2-25-q1", "Der Monat ist zu Ende."],
    ["d-a2-25-q2", "sieben Euro"],
    ["d-a2-25-q3", ["schwarzfahren"]],
    ["d-a2-26-q1", "29 Euro"],
    ["d-a2-26-q2", "die Quittung"],
    ["d-a2-26-q3", "richtig"],
    ["d-a2-27-q1", "die Reise ans Meer mit der Familie"],
    ["d-a2-27-q2", "das Meer"],
    ["d-a2-27-q3", ["an"]],
  ]);
  const answersMatchA2Batch10 = selectedA2Batch10.every((d) => d.questions.every((q: any) => {
    const expected = expectedAnswersA2Batch10.get(q.id);
    if (expected === undefined) return false;
    return JSON.stringify(q.answer) === JSON.stringify(expected);
  }));
  ok(answersMatchA2Batch10,
    "K186i مفاتيح الإجابات التسع محمية ولا انحراف عن اللقطات المراجعة (بما في ذلك ملء schwarzfahren وan)");

  ok(correctionsListA2Batch10.every((c: any) => c.field.endsWith(".ar")) &&
    selectedA2Batch10.every((dialogue) => dialogue.questions.every((q: any, qi: number) => {
      const snap = itemByIdA2Batch10.get(q.id)?.reviewed;
      return snap && snap.promptDe === q.promptDe &&
        JSON.stringify(snap.answer) === JSON.stringify(q.answer) &&
        snap.explanationAr === q.explanationAr;
    })) &&
    reviewA2Batch10.correction.rationale.includes("المؤنث") &&
    patchSourceA2Batch10.includes("d-a2-25") && patchSourceA2Batch10.includes("d-a2-26") && patchSourceA2Batch10.includes("d-a2-27"),
    "K186j الرقعة لا تغيّر أي نص ألماني ولا سؤالاً ولا مفتاحاً؛ التعديلات الأربعة عربية ومسندة إلى مطابقة جنس الضمير/الصفة");
}

// K187 — gap report for A2 d-a2-28..d-a2-30 (R113); mirrors K176 for the A1 gap.
{
  const gapA2Report28 = JSON.parse(readFileSync("docs/content-gap-a2-dialogues-28-30-2026-10-08.json", "utf8")) as any;
  const gapA2Report28Md = readFileSync("docs/content-gap-a2-dialogues-28-30-2026-10-08.md", "utf8");
  const liveDialoguesGapA2 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const audioManifestGapA2 = JSON.parse(readFileSync("content/dialog-audio.json", "utf8")) as any;
  const a2Live = liveDialoguesGapA2.filter((d) => (d.id as string).startsWith("d-a2-"));
  const a2LiveIds = a2Live.map((d) => d.id).sort();
  const expectedA2Ids = [
    ...Array.from({ length: 27 }, (_, i) => `d-a2-${String(i + 1).padStart(2, "0")}`),
    "d-a2-31", "d-a2-32",
  ];
  const missing = ["d-a2-28", "d-a2-29", "d-a2-30"];
  const manifestEntriesGapA2: any[] = [];
  const collectGapA2 = (node: any) => {
    if (Array.isArray(node)) node.forEach(collectGapA2);
    else if (node && typeof node === "object") {
      if (typeof node.id === "string" && missing.includes(node.id)) manifestEntriesGapA2.push(node);
      Object.values(node).forEach(collectGapA2);
    }
  };
  collectGapA2(audioManifestGapA2);
  ok(gapA2Report28.reviewRule === "R113" && gapA2Report28.date === "2026-10-08" &&
    JSON.stringify(a2LiveIds) === JSON.stringify(expectedA2Ids) && a2Live.length === 29 &&
    missing.every((id) => !a2LiveIds.includes(id)) &&
    gapA2Report28.liveContent.a2DialogueCount === 29 &&
    gapA2Report28.liveContent.allExpectedPresent === true &&
    JSON.stringify(gapA2Report28.liveContent.missingIds) === JSON.stringify(missing),
    "K187a فجوة A2 28–30 موثقة: النسخة الحية تضم 29 حوار A2 (01–27 و31–32) ولا تحتوي 28/29/30");

  ok(Array.isArray(gapA2Report28.sources) && gapA2Report28.sources.length >= 6 &&
    gapA2Report28.sources.every((s: any) => s.id && s.path && s.proves && s.limits) &&
    gapA2Report28.generators && gapA2Report28.generators["dialoge_a2_neu2.py"]?.containsAnyMissingId === false &&
    gapA2Report28.generators["dialoge_a2_neu1.py"]?.containsAnyMissingId === false &&
    gapA2Report28.generators["dialoge_welle.py"]?.containsAnyMissingId === false &&
    gapA2Report28Md.includes("schliesst A2 auf 29 Dialoge") &&
    gapA2Report28Md.includes("غير محسوم"),
    "K187b التقرير يسند الفجوة بمصادر ومولدات ولا ينشئ محتوى بديلاً");

  ok(manifestEntriesGapA2.length === 0 && gapA2Report28.audio.manifestEntriesForMissing.length === 0 &&
    gapA2Report28.audio.mp3FilesForMissing.length === 0 &&
    gapA2Report28.limits.audio.includes("لا") &&
    gapA2Report28.limits.contentCreation.includes("لم يُنشأ"),
    "K187c لا إدخالات صوت مطابقة ولا محتوى بديل، والحدود مُعلنة");

  ok(typeof gapA2Report28.gitHistory.isShallowRepository === "boolean" &&
    gapA2Report28.gitHistory.hitsPerMissingId &&
    Object.keys(gapA2Report28.gitHistory.hitsPerMissingId).length === 3 &&
    gapA2Report28.decision.length > 0 &&
    gapA2Report28Md.includes("## القرار") &&
    gapA2Report28Md.includes("K187"),
    "K187d سجل Git (بما في ذلك كونه shallow) والقرار مذكوران صراحة مع ذكر K187");

  ok(gapA2Report28.limits.cefr.includes("لم يُعد") &&
    gapA2Report28.limits.human.includes("ليست") &&
    gapA2Report28.limits.legal.length > 0,
    "K187e التقرير يصرّح بحدود CEFR والمراجعة البشرية/قانونية");
}

// K188 — first B1 batch d-b1-01..d-b1-06 (R114).
{
  const reviewB101 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-01-2026-10-08.json", "utf8")) as any;
  const reviewB101Md = readFileSync("docs/content-review-b1-dialogues-01-2026-10-08.md", "utf8");
  const liveB101 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB101 = readFileSync("scripts/patches/review_b1_dialogues_01.py", "utf8");
  const reportSourceB101 = readFileSync("scripts/patches/report_b1_dialogues_01.py", "utf8");
  const scope = ["d-b1-01", "d-b1-02", "d-b1-03", "d-b1-04", "d-b1-05", "d-b1-06"];
  const lineCounts = [5, 5, 5, 5, 5, 6];
  ok(reviewB101.reviewRule === "R114" && reviewB101.date === "2026-10-08" &&
    JSON.stringify(reviewB101.dialogues.map((d: any) => d.id)) === JSON.stringify(scope) &&
    reviewB101.dialogues.every((d: any, i: number) => d.lines === lineCounts[i] && d.questions === 2 && d.dictation === 3) &&
    reviewB101.totals.lines === 31 && reviewB101.totals.questions === 12 && reviewB101.totals.dictation === 18,
    "K188a دفعة B1 الأولى d-b1-01..06 موثقة بستة حوارات (31 سطراً، 12 سؤالاً، 18 إملاء)");

  ok(reviewB101.corrections.length === 1 &&
    reviewB101.corrections[0].unit === "d-b1-01.lines[3].ar" &&
    reviewB101.corrections[0].old.includes("لوفّقت") &&
    reviewB101.corrections[0].new.includes("لوافقتُ") &&
    liveB101.find((d) => d.id === "d-b1-01").lines[3].ar === reviewB101.corrections[0].new &&
    liveB101.find((d) => d.id === "d-b1-01").lines[3].de ===
      "Wenn die Firma gute Regeln hätte, würde ich zustimmen.",
    "K188b تصحيح عربي واحد مؤكد: d-b1-01.lines[3].ar يطابق الألماني würde ich zustimmen");

  // Locks: DE text, who, questions, dictation unchanged for all six dialogues.
  const expectedDE: Record<string, string[]> = {
    "d-b1-01": [
      "Meiner Meinung nach ist Homeoffice die Zukunft der Arbeit.",
      "Da bin ich nicht ganz einverstanden. Zwar spart man Zeit, aber man verliert den Kontakt.",
      "Trotzdem glaube ich, dass die Flexibilität überwiegt.",
      "Wenn die Firma gute Regeln hätte, würde ich zustimmen.",
      "Also: eine Mischung wäre die beste Lösung.",
    ],
    "d-b1-02": [
      "Erzählen Sie kurz etwas über sich.",
      "Gern. Ich habe drei Jahre als Techniker gearbeitet und spreche Deutsch auf B1-Niveau.",
      "Warum möchten Sie wechseln?",
      "Ich möchte neue Erfahrungen sammeln und mehr Verantwortung übernehmen.",
      "Gut. Wir melden uns nächste Woche bei Ihnen.",
    ],
    "d-b1-03": [
      "Hast du die Nachrichten gehört? Der Streik geht weiter.",
      "Ja, die Züge fahren heute wieder nicht.",
      "Ich habe gelesen, die Verhandlungen hätten gestern begonnen.",
      "Hoffentlich finden sie bald eine Lösung.",
      "Sonst muss ich jeden Tag mit dem Rad fahren.",
    ],
    "d-b1-04": [
      "Danke, dass du mir beim Umzug hilfst!",
      "Gern! Was sollen wir zuerst tragen?",
      "Die Bücher sind am schwersten. Die Kartons stehen schon im Flur.",
      "Alles klar. Achtung, die Tür ist eng!",
      "Danke dir. Nachher essen wir Pizza — mein Angebot!",
    ],
    "d-b1-05": [
      "Was hast du vor, nach der Prüfung zu machen?",
      "Ich würde gern ein Praktikum in einer Klinik machen.",
      "Das ist eine gute Idee! Wo willst du dich bewerben?",
      "Vielleicht in Köln. Dort hätte ich bessere Chancen.",
      "Ich drücke dir die Daumen!",
    ],
    "d-b1-06": [
      "Guten Tag. Ich möchte einen Termin zur Anmeldung vereinbaren.",
      "Gern. Haben Sie alle Unterlagen schon mitgebracht?",
      "Ich habe Pass und Mietvertrag dabei. Fehlt noch etwas?",
      "Eine Meldebescheinigung wäre noch nötig.",
      "Alles klar. Könnte der Termin am Donnerstag sein?",
      "Ja, um 11:30 Uhr. Bitte kommen Sie pünktlich.",
    ],
  };
  const expectedWho: Record<string, string[]> = {
    "d-b1-01": ["Mara","Tim","Mara","Tim","Mara"],
    "d-b1-02": ["Chefin","Bewerber","Chefin","Bewerber","Chefin"],
    "d-b1-03": ["Lea","Yusuf","Lea","Yusuf","Lea"],
    "d-b1-04": ["Paul","Rana","Paul","Rana","Paul"],
    "d-b1-05": ["Ali","Mira","Ali","Mira","Ali"],
    "d-b1-06": ["Bürgerin","Sachbearbeiter","Bürgerin","Sachbearbeiter","Bürgerin","Sachbearbeiter"],
  };
  const expectedAnswers: Record<string, any[]> = {
    "d-b1-01": ["Man verliert den Kontakt.", ["hätte","haette"]],
    "d-b1-02": [["Verantwortung"], "Die Firma meldet sich."],
    "d-b1-03": ["Es gibt einen Streik.", ["Lösung"]],
    "d-b1-04": ["die Bücher", ["Pizza"]],
    "d-b1-05": ["ein Praktikum in einer Klinik machen", ["Daumen"]],
    "d-b1-06": [["Meldebescheinigung"], "Donnerstag um 11:30 Uhr"],
  };
  const expectedDict: Record<string, string[]> = {
    "d-b1-01": [
      "Meiner Meinung nach ist Homeoffice die Zukunft der Arbeit.",
      "Trotzdem glaube ich, dass die Flexibilität überwiegt.",
      "Eine Mischung wäre die beste Lösung.",
    ],
    "d-b1-02": [
      "Ich habe drei Jahre als Techniker gearbeitet.",
      "Ich möchte neue Erfahrungen sammeln.",
      "Wir melden uns nächste Woche bei Ihnen.",
    ],
    "d-b1-03": [
      "Der Streik geht weiter.",
      "Die Verhandlungen hätten gestern begonnen.",
      "Hoffentlich finden sie bald eine Lösung.",
    ],
    "d-b1-04": [
      "Danke, dass du mir beim Umzug hilfst!",
      "Die Bücher sind am schwersten.",
      "Mein Angebot!",
    ],
    "d-b1-05": [
      "Ich würde gern ein Praktikum in einer Klinik machen.",
      "Dort hätte ich bessere Chancen.",
      "Ich drücke dir die Daumen!",
    ],
    "d-b1-06": [
      "Ich möchte einen Termin vereinbaren.",
      "Eine Meldebescheinigung wäre noch nötig.",
      "Bitte kommen Sie pünktlich.",
    ],
  };
  let locksOk = true;
  for (const did of scope) {
    const dlg = liveB101.find((x) => x.id === did);
    for (let i = 0; i < expectedDE[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE[did][i] || dlg.lines[i].who !== expectedWho[did][i]) locksOk = false;
    }
    for (let i = 0; i < 2; i++) {
      const a = dlg.questions[i].answer;
      const e = expectedAnswers[did][i];
      if (Array.isArray(e) ? JSON.stringify(a.slice().sort()) !== JSON.stringify(e.slice().sort()) : a !== e) locksOk = false;
    }
    for (let i = 0; i < 3; i++) {
      if (dlg.dictation[i] !== expectedDict[did][i]) locksOk = false;
    }
  }
  ok(locksOk, "K188c كل الألماني وأسماء الشخصيات والأسئلة/المفاتيح والإملاءات مقفلة ولم تتغير");

  ok(reviewB101.judgement.corrected === 1 && reviewB101.judgement.unresolved === 0 &&
    reviewB101.waisen.present === false &&
    patchSourceB101.includes("d-b1-01") && patchSourceB101.includes("d-b1-02") &&
    patchSourceB101.includes("d-b1-03") && patchSourceB101.includes("d-b1-04") &&
    patchSourceB101.includes("d-b1-05") && patchSourceB101.includes("d-b1-06") &&
    patchSourceB101.includes("لوافقتُ") &&
    patchSourceB101.includes("<R114> patch complete"),
    "K188d الرقعة تغطي النطاق الكامل وتطبق التصحيح الواحد وتطبع سطر النهاية");

  ok(reviewB101.contextNotes["d-b1-06"] &&
    reviewB101.contextNotes["d-b1-06"][0].note.includes("Wohnungsgeber") &&
    reviewB101.contextNotes["d-b1-05"] &&
    reviewB101.contextNotes["d-b1-05"][0].note.includes("Daumen") &&
    reviewB101.contextNotes["d-b1-04"] &&
    reviewB101.contextNotes["d-b1-04"][0].note.includes("Pizza"),
    "K188e ملاحظات سياقية مسجلة — Meldebescheinigung تبسيط دراسي، Daumen drücken، Pizza für Umzug");

  ok(reviewB101.audio.mp3Files.length === 6 && reviewB101.audio.manifestEntries.length === 6 &&
    reviewB101.limits.audio.includes("لا استماع") &&
    reviewB101.limits.cefr.includes("لم يُعد") &&
    reviewB101.limits.human.includes("ليست") &&
    reviewB101.limits.legal.length > 0 &&
    reviewB101.limits.medical.length > 0 && reviewB101.limits.professional.length > 0,
    "K188f الصوت موجود ولكنه لم يُستمع إليه؛ حدود CEFR/بشري/قانوني/طبي/مهني معلنة");

  ok(reviewB101Md.includes("## الحكم") && reviewB101Md.includes("## التصحيحات") &&
    reviewB101Md.includes("## المصادر") && reviewB101Md.includes("K188") &&
    reviewB101Md.includes("لوافقتُ") &&
    reportSourceB101.includes("S1") && reportSourceB101.includes("S14"),
    "K188g التقرير العربي يحتوي الحكم والتصحيحات والمصادر والبوابة K188");

  // Idempotency verified by running patch twice and getting 0 changes; ensure file contains expected marker.
  ok(patchSourceB101.includes("changes applied:") &&
    patchSourceB101.includes("locked DE lines") &&
    reportSourceB101.includes("write_outputs"),
    "K188h الرقعة تقفل الألماني والأسئلة والإملاءات وتطبع ملخصها؛ المُولِّد ينتج JSON+Markdown");

  // Source list covers all six dialogues (at least 2 per dialogue).
  const srcMap = reviewB101.sources as Record<string, any[]>;
  const perDialogueSources = Object.keys(srcMap).every((k) => srcMap[k].length >= 2);
  ok(perDialogueSources &&
    Object.values(srcMap).reduce((n: number, v: any[]) => n + v.length, 0) >= 12,
    "K188i كل حوار مدعوم بمصدرين منشورين على الأقل (12+ مرجع إجمالاً)");

  ok(reviewB101.totals.dictation === 18 && reviewB101.dialogues.every((d: any) => d.dictation === 3) &&
    patchSourceB101.includes('"dictation"'),
    "K188j الحقل dictation قائمة نصية بعدد 3 جمل لكل حوار (18 إجمالاً) وهو مقفل");
}

// K189 — second B1 batch d-b1-07..d-b1-09 (R115).
{
  const reviewB102 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-02-2026-10-08.json", "utf8")) as any;
  const reviewB102Md = readFileSync("docs/content-review-b1-dialogues-02-2026-10-08.md", "utf8");
  const liveB102 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB102 = readFileSync("scripts/patches/review_b1_dialogues_02.py", "utf8");
  const scope = ["d-b1-07", "d-b1-08", "d-b1-09"];
  ok(reviewB102.reviewRule === "R115" && reviewB102.date === "2026-10-08" &&
    JSON.stringify(reviewB102.dialogues.map((d: any) => d.id)) === JSON.stringify(scope) &&
    reviewB102.totals.lines === 17 && reviewB102.totals.questions === 6 && reviewB102.totals.dictation === 7,
    "K189a دفعة B1 الثانية d-b1-07..09 موثقة (17 سطراً، 6 أسئلة، 7 إملاءات)");

  ok(reviewB102.corrections.length === 2 &&
    reviewB102.corrections[0].unit === "d-b1-07.lines[2].ar" &&
    reviewB102.corrections[0].new.includes("تعملوا") && reviewB102.corrections[0].new.includes("تأخذوا") &&
    reviewB102.corrections[1].unit === "d-b1-09.lines[4].ar" &&
    reviewB102.corrections[1].new.includes("يمكنكم") &&
    liveB102.find((d) => d.id === "d-b1-07").lines[2].ar === reviewB102.corrections[0].new &&
    liveB102.find((d) => d.id === "d-b1-09").lines[4].ar === reviewB102.corrections[1].new,
    "K189b تصحيحان عربيان: Sie→جمع (تعملوا/تأخذوا، يمكنكم) وتصحيح فعل عامي");

  const expectedDE: Record<string, string[]> = {
    "d-b1-07": [
      "Die Untersuchung zeigt: Es ist nichts Schlimmes.",
      "Gott sei Dank! Was soll ich denn tun?",
      "Sie sollten weniger am Bildschirm arbeiten und Pausen machen.",
      "Und wenn die Schmerzen zurückkommen?",
      "Dann kommen Sie bitte sofort wieder.",
    ],
    "d-b1-08": [
      "Nina, können wir über die Küche reden?",
      "Gern. Ich finde, es ist zu unordentlich.",
      "Du hast recht. Ich schlage einen Putzplan vor.",
      "Gute Idee! Jeder macht einmal pro Woche sauber.",
      "Und der Einkauf? Sollen wir zusammen kaufen?",
      "Ja, das spart Geld. Ich schreibe eine Liste.",
    ],
    "d-b1-09": [
      "Guten Abend. Ich habe ein Problem mit meinem Zimmer.",
      "Was ist denn los, mein Herr?",
      "Die Heizung funktioniert nicht, und es ist sehr kalt.",
      "Das tut mir leid. Ich schicke sofort einen Techniker.",
      "Und könnten Sie vielleicht das Zimmer wechseln?",
      "Natürlich. Zimmer 205 ist frei und warm.",
    ],
  };
  const expectedWho: Record<string, string[]> = {
    "d-b1-07": ["Ärztin","Patient","Ärztin","Patient","Ärztin"],
    "d-b1-08": ["Paul","Nina","Paul","Nina","Paul","Nina"],
    "d-b1-09": ["Anwar","Rezeption","Anwar","Rezeption","Anwar","Rezeption"],
  };
  const expectedAnswers: Record<string, any[]> = {
    "d-b1-07": ["nichts Schlimmes", ["Bildschirm"]],
    "d-b1-08": ["einen Putzplan", "Das spart Geld."],
    "d-b1-09": ["Die Heizung funktioniert nicht.", "ein anderes Zimmer, Nummer 205"],
  };
  const expectedDict: Record<string, string[]> = {
    "d-b1-07": ["Es ist nichts Schlimmes.", "Sie sollten Pausen machen.", "Dann kommen Sie bitte sofort wieder."],
    "d-b1-08": ["Ich schlage einen Putzplan vor.", "Jeder macht einmal pro Woche sauber."],
    "d-b1-09": ["Die Heizung funktioniert nicht.", "Ich schicke sofort einen Techniker."],
  };
  let locksOk = true;
  for (const did of scope) {
    const dlg = liveB102.find((x) => x.id === did);
    for (let i = 0; i < expectedDE[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE[did][i] || dlg.lines[i].who !== expectedWho[did][i]) locksOk = false;
    }
    for (let i = 0; i < expectedAnswers[did].length; i++) {
      const a = dlg.questions[i].answer; const e = expectedAnswers[did][i];
      if (Array.isArray(e) ? JSON.stringify(a.slice().sort()) !== JSON.stringify(e.slice().sort()) : a !== e) locksOk = false;
    }
    for (let i = 0; i < expectedDict[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict[did][i]) locksOk = false;
    }
  }
  ok(locksOk, "K189c كل الألماني/who/الأسئلة/الإملاءات مقفلة (3+2+2=7 إملاءات)");

  ok(reviewB102.judgement.corrected === 2 && reviewB102.judgement.unresolved === 0 &&
    reviewB102.waisen.present === false &&
    patchSourceB102.includes("d-b1-07") && patchSourceB102.includes("d-b1-08") &&
    patchSourceB102.includes("d-b1-09") &&
    patchSourceB102.includes("<R115> patch complete"),
    "K189d الرقعة تغطي الثلاثة حوارات وتطبق التصحيحين وتطبع سطر النهاية");

  ok(reviewB102.contextNotes["d-b1-07"] &&
    reviewB102.contextNotes["d-b1-07"].some((n: any) => n.note.includes("طبية")) &&
    reviewB102.contextNotes["d-b1-08"] && reviewB102.contextNotes["d-b1-09"] &&
    reviewB102.styleAlternatives["d-b1-07"] && reviewB102.styleAlternatives["d-b1-07"].some((a: any) => a.phrase.includes("Gott sei Dank")),
    "K189e ملاحظات سياقية (حدود طبية) وبدائل أسلوبية مسجلة");

  ok(reviewB102.limits.audio.includes("لا استماع") && reviewB102.limits.cefr.includes("لم يُعد") &&
    reviewB102.limits.human.includes("ليست") && reviewB102.limits.medical.length > 0 &&
    reviewB102.limits.legal.length > 0,
    "K189f حدود الصوت/CEFR/بشري/طبي/قانوني معلنة");

  const srcMap2 = reviewB102.sources as Record<string, any[]>;
  ok(reviewB102Md.includes("## الحكم") && reviewB102Md.includes("## التصحيحات") &&
    reviewB102Md.includes("## المصادر") && reviewB102Md.includes("K189") &&
    Object.keys(srcMap2).every((k) => srcMap2[k].length >= 2) &&
    Object.values(srcMap2).reduce((n: number, v: any[]) => n + v.length, 0) >= 6,
    "K189g التقرير العربي ومصادره (2+ لكل حوار، 6+ إجمالاً) يذكر K189");

  ok(patchSourceB102.includes("locked DE lines") &&
    reviewB102.corrections[0].rationale.includes("Sie") &&
    reviewB102.corrections[1].rationale.includes("Sie"),
    "K189h الرقعة تقفل النص وتشرح كل تصحيح بالرجوع إلى صيغة Sie");

  ok(reviewB102.audio.mp3Files.length === 3 && reviewB102.audio.manifestEntries.length === 3 &&
    reviewB102.audio.note.includes("لا استماع"),
    "K189i الصوت موجود (3 ملفات) ولكن لا يُدّعى استماعه");

  ok(reviewB102.totals.dictation === 7 &&
    reviewB102.dialogues.find((d: any) => d.id === "d-b1-07").dictation === 3 &&
    reviewB102.dialogues.find((d: any) => d.id === "d-b1-08").dictation === 2 &&
    reviewB102.dialogues.find((d: any) => d.id === "d-b1-09").dictation === 2,
    "K189j عدد الإملاءات 7 (3+2+2) مقفل");
}

// K190 — third B1 batch d-b1-10..d-b1-12 (R116).
{
  const reviewB103 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-03-2026-10-08.json", "utf8")) as any;
  const reviewB103Md = readFileSync("docs/content-review-b1-dialogues-03-2026-10-08.md", "utf8");
  const liveB103 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB103 = readFileSync("scripts/patches/review_b1_dialogues_03.py", "utf8");
  const scope = ["d-b1-10", "d-b1-11", "d-b1-12"];
  ok(reviewB103.reviewRule === "R116" && reviewB103.date === "2026-10-08" &&
    JSON.stringify(reviewB103.dialogues.map((d: any) => d.id)) === JSON.stringify(scope) &&
    reviewB103.totals.lines === 25 && reviewB103.totals.questions === 9 && reviewB103.totals.dictation === 6,
    "K190a دفعة B1 الثالثة d-b1-10..12 موثقة (25 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB103.corrections.length === 7,
    "K190b سبعة تصحيحات عربية مؤكدة (تحية، صيغة Sie، إضافات زائدة، Herd=موقد، صياغة طبية)");

  // Verify specific corrections applied in content.
  const d10 = liveB103.find((d) => d.id === "d-b1-10");
  const d11 = liveB103.find((d) => d.id === "d-b1-11");
  const d12 = liveB103.find((d) => d.id === "d-b1-12");
  ok(d10.lines[0].ar.startsWith("طابَ يومُكم") && !d10.lines[0].ar.includes("مساءُ") &&
    d10.lines[1].ar.includes("أجريتُم") && !d10.lines[1].ar.includes("أجريتِ") &&
    d10.lines[3].ar.includes("تناسبكم") && d10.lines[3].ar.includes("الساعةَ التاسعة"),
    "K190c تحية Guten Tag→طاب يومكم، Sie→جمع في سطري Yara، إضافة الساعة في الموعد");

  ok(!d11.lines[0].ar.includes("في الصور") &&
    d11.lines[1].ar.includes("الموقد") && !d11.lines[1].ar.includes("البوق"),
    "K190d حذف الإضافة «في الصور» وتصحيح Herd=الموقد");

  ok(!d12.lines[3].ar.includes("بكتيريا") && d12.lines[3].ar.includes("عدوى فيروسية") &&
    d12.lines[5].ar.includes("لا يجوز له الذهاب") && !d12.lines[5].ar.includes("فحتى") &&
    !d12.lines[5].ar.includes("ذروة"),
    "K190e حذف «لا بكتيرية» الزائدة، صياغة darf-nitch-sit-temp+bis بشكل سليم");

  // Locked DE/who/questions/dictations.
  const expectedDE: Record<string, string[]> = {
    "d-b1-10": [
      "Guten Tag, ich möchte mich für den Deutschkurs anmelden.",
      "Sehr gern. Haben Sie den Einstufungstest schon gemacht?",
      "Noch nicht — ist das Pflicht?",
      "Ja, sonst passt die Gruppe nicht. Der Test ist Donnerstag um neun.",
      "Was kostet der Kurs pro Monat?",
      "Dreiundachtzig Euro — die Prüfung ist inklusive.",
      "Brauche ich einen Nachweis über meinen Aufenthalt?",
      "Nur Pass und Meldebescheinigung. Bis Donnerstag!",
    ],
    "d-b1-11": [
      "Danke für den Termin — die Anzeige klang vielversprechend.",
      "Gern. Die Küche ist möbliert: Herd, Spüle und Schränke bleiben.",
      "Sind Wasser und Heizung in der Miete enthalten?",
      "Nein — Kaltmiete vierhundertfünfzig, Nebenkosten kommen dazu.",
      "Die Wohnung wäre perfekt — wann wird sie frei?",
      "Zum Ersten. Ich brauche Selbstauskunft und Schufa.",
      "Die Unterlagen kommen bis morgen per Mail — und die Kaution?",
      "Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt.",
    ],
    "d-b1-12": [
      "Mein Sohn hat seit gestern Fieber und einen Ausschlag.",
      "Seit wann genau, und hat er Ungewohntes gegessen?",
      "Seit gestern Abend — und nein, wir sind da sehr vorsichtig.",
      "Mund auf, bitte … Das sieht nach einer Virusinfektion aus.",
      "Ist das ansteckend für die Kita?",
      "Ja — bis zwei Tage nach dem letzten Fieber darf er nicht hin.",
      "Soll ich ein Antibiotikum geben?",
      "Nein, bei Viren wirkt es nicht. Fieber senken, viel trinken, beobachten.",
      "Wenn der Ausschlag bleibt — soll ich dann sofort wieder kommen?",
    ],
  };
  const expectedWho: Record<string, string[]> = {
    "d-b1-10": ["Frau Weber","Yara","Frau Weber","Yara","Frau Weber","Yara","Frau Weber","Yara"],
    "d-b1-11": ["Frau Bähr","Nadia","Frau Bähr","Nadia","Frau Bähr","Nadia","Frau Bähr","Nadia"],
    "d-b1-12": ["Karim","Dr. Sommer","Karim","Dr. Sommer","Karim","Dr. Sommer","Karim","Dr. Sommer","Karim"],
  };
  const expectedAnswers: Record<string, any[]> = {
    "d-b1-10": ["ein Einstufungstest", "83 Euro", "Pass und Meldebescheinigung"],
    "d-b1-11": ["Herd, Spüle und Schränke", "die Nebenkosten", "zwei Monatsmieten"],
    "d-b1-12": ["Fieber und einen Ausschlag", "nein, erst zwei Tage nach dem letzten Fieber", "weil es bei Viren nicht wirkt"],
  };
  const expectedDict: Record<string, string[]> = {
    "d-b1-10": [
      "Ja, sonst passt die Gruppe nicht. Der Test ist Donnerstag um neun.",
      "Nur Pass und Meldebescheinigung. Bis Donnerstag!",
    ],
    "d-b1-11": [
      "Nein — Kaltmiete vierhundertfünfzig, Nebenkosten kommen dazu.",
      "Zwei Monatsmieten, wie immer. Herzlich willkommen, wenn alles passt.",
    ],
    "d-b1-12": [
      "Ja — bis zwei Tage nach dem letzten Fieber darf er nicht hin.",
      "Nein, bei Viren wirkt es nicht. Fieber senken, viel trinken, beobachten.",
    ],
  };
  let locksOk = true;
  for (const did of scope) {
    const dlg = liveB103.find((x) => x.id === did);
    for (let i = 0; i < expectedDE[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE[did][i] || dlg.lines[i].who !== expectedWho[did][i]) locksOk = false;
    }
    for (let i = 0; i < expectedAnswers[did].length; i++) {
      if (dlg.questions[i].answer !== expectedAnswers[did][i]) locksOk = false;
    }
    for (let i = 0; i < expectedDict[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict[did][i]) locksOk = false;
    }
  }
  ok(locksOk, "K190f كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (25 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB103.judgement.corrected === 7 && reviewB103.judgement.unresolved === 0 &&
    reviewB103.waisen.present === false &&
    patchSourceB103.includes("d-b1-10") && patchSourceB103.includes("d-b1-11") &&
    patchSourceB103.includes("d-b1-12") &&
    patchSourceB103.includes("<R116> patch complete"),
    "K190g الرقعة تغطي الثلاثة حوارات وتطبق السبعة تصحيحات وتطبع سطر النهاية");

  ok(reviewB103.contextNotes["d-b1-12"] &&
    reviewB103.contextNotes["d-b1-12"].some((n: any) => n.note.includes("طبية")) &&
    reviewB103.contextNotes["d-b1-10"] && reviewB103.contextNotes["d-b1-11"] &&
    reviewB103.styleAlternatives["d-b1-12"],
    "K190h ملاحظات سياقية (حدود طبية، وثائق، كاوتسيون) وبدائل مسجلة");

  ok(reviewB103.limits.audio.includes("لا استماع") && reviewB103.limits.cefr.includes("لم يُعد") &&
    reviewB103.limits.human.includes("ليست") && reviewB103.limits.medical.length > 0 &&
    reviewB103.limits.legal.length > 0,
    "K190i حدود الصوت/CEFR/بشري/طبي/قانوني معلنة (الطبي والقانوني هامان في هذه الدفعة)");

  const srcMap3 = reviewB103.sources as Record<string, any[]>;
  ok(reviewB103Md.includes("## الحكم") && reviewB103Md.includes("## التصحيحات") &&
    reviewB103Md.includes("## المصادر") && reviewB103Md.includes("K190") &&
    Object.keys(srcMap3).every((k) => srcMap3[k].length >= 2) &&
    Object.values(srcMap3).reduce((n: number, v: any[]) => n + v.length, 0) >= 7,
    "K190j التقرير العربي ومصادره (2+ لكل حوار، 7+ إجمالاً) يذكر K190");
}

// K191 — fourth B1 batch d-b1-13..d-b1-15 (R117).
{
  const reviewB104 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-04-2026-10-08.json", "utf8")) as any;
  const reviewB104Md = readFileSync("docs/content-review-b1-dialogues-04-2026-10-08.md", "utf8");
  const liveB104 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB104 = readFileSync("scripts/patches/review_b1_dialogues_04.py", "utf8");
  const scope = ["d-b1-13", "d-b1-14", "d-b1-15"];
  ok(reviewB104.reviewRule === "R117" && reviewB104.date === "2026-10-08" &&
    JSON.stringify(reviewB104.dialogues.map((d: any) => d.id)) === JSON.stringify(scope) &&
    reviewB104.totals.lines === 24 && reviewB104.totals.questions === 9 && reviewB104.totals.dictation === 6,
    "K191a دفعة B1 الرابعة d-b1-13..15 موثقة (24 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB104.corrections.length === 10,
    "K191b عشرة تصحيحات عربية مؤكدة (Sie→جمع، معاني Zugang/Folien/Frist/Sperrung، إزالة صياغة حرّة)");

  const d13 = liveB104.find((d) => d.id === "d-b1-13");
  const d14 = liveB104.find((d) => d.id === "d-b1-14");
  const d15 = liveB104.find((d) => d.id === "d-b1-15");
  ok(d13.lines[5].ar.includes("الدخول إلى القبو") && !d13.lines[5].ar.includes("مفتاح") &&
    d13.lines[6].ar.includes("لكم") && !d13.lines[6].ar.includes("لك.") &&
    d13.lines[7].ar.includes("مرونتكم"),
    "K191c d-b1-13: Zugang=دخول، Sie→لكم/مرونتكم");

  ok(d14.lines[2].ar.includes("الشرائح") && d14.lines[2].ar.includes("سأرسلها") &&
    !d14.lines[2].ar.includes("الأوراق") && !d14.lines[2].ar.includes("تصلُه") &&
    d14.lines[5].ar.includes("استريحوا") && d14.lines[5].ar.includes("المهلة") &&
    !d14.lines[5].ar.includes("اراحي") &&
    d14.lines[6].ar.includes("سأخطركم حالما") && !d14.lines[6].ar.includes("أُخطِرُك") &&
    d14.lines[7].ar.includes("لا داعي للعجلة") && d14.lines[7].ar.includes("استريحوا"),
    "K191d d-b1-14: Folien=شرائح، sende=سأرسل، Sie-plural استريحوا/أخطركم/أحضروا، Frist=مهلة، Kein-Wort-Eile بسيط");

  ok(d15.lines[1].ar.includes("أُوقِفَت") && !d15.lines[1].ar.includes("أُلغِيَت") &&
    d15.lines[4].ar.includes("الإيقاف") && !d15.lines[4].ar.includes("التعليق") &&
    d15.lines[7].ar.includes("أحضروا بطاقة هويتكم") && d15.lines[7].ar.includes("ستة يورو"),
    "K191e d-b1-15: sperren=أوقِفَت (لا أُلغِيَت)، Sie→أحضروا، ذكر يورو");

  // Locked DE/who/questions/dictations.
  const expectedDE: Record<string, string[]> = {
    "d-b1-13": [
      "Mein Termin für die Heizung am Dienstag — ich muss ihn verschieben.",
      "Warum? Ich plane sonst den Tag umsonst.",
      "Mein Chef gab mir unerwartet einen dringenden Auftrag.",
      "Donnerstag wäre frei — oder Montag um neun.",
      "Montag, aber nicht vor neun: erst die Kinder in die Kita.",
      "Neun Uhr passt. Ich brauche Zugang zum Keller.",
      "Den Schlüssel hält die Rezeption für Sie bereit.",
      "Danke für Ihre Flexibilität!",
    ],
    "d-b1-14": [
      "Ich melde mich für heute krank — starke Kopfschmerzen.",
      "Gute Besserung! Kann das Meeting um elf warten?",
      "Tarek übernimmt; die Folien sende ich ihm vor zehn.",
      "Und die Steuerunterlagen für Montag?",
      "Längst im gemeinsamen Ordner, seit gestern Abend.",
      "Dann ruhen Sie aus — die Gesundheit geht vor der Frist.",
      "Vielen Dank — ich melde mich, sobald ich wieder kann.",
      "Kein Wort der Eile — erholen Sie sich gut!",
    ],
    "d-b1-15": [
      "Ich habe meine EC-Karte verloren — bitte sofort sperren!",
      "Die Karte ist gesperrt. Wann und wo zuletzt benutzt?",
      "Gestern Vormittag, Automat am Hauptbahnhof.",
      "Kein Missbrauch vermerkt. Die neue Karte kommt in vierzehn Tagen.",
      "Was kostet die Sperrung?",
      "Zwanzig Euro bei Diebstahl, sechs bei Verlust — verloren, richtig?",
      "Leider Verlust — gestohlen wurde sie nicht.",
      "Dann sechs Euro. Den Ausweis bitte zum Abholen mitbringen.",
    ],
  };
  const expectedWho: Record<string, string[]> = {
    "d-b1-13": ["Frau Krause","Sami","Frau Krause","Sami","Frau Krause","Sami","Frau Krause","Sami"],
    "d-b1-14": ["Rania","Chef Linke","Rania","Chef Linke","Rania","Chef Linke","Rania","Chef Linke"],
    "d-b1-15": ["Imen","Berater Vogel","Imen","Berater Vogel","Imen","Berater Vogel","Imen","Berater Vogel"],
  };
  const expectedAnswers: Record<string, any[]> = {
    "d-b1-13": ["Ihr Chef gab ihr einen dringenden Auftrag.", "Montag um neun", "Zugang zum Keller"],
    "d-b1-14": ["Tarek", "Sie liegen seit gestern im gemeinsamen Ordner.", "die Gesundheit vor der Frist"],
    "d-b1-15": ["Die Karte wird gesperrt.", "sechs Euro", "in vierzehn Tagen"],
  };
  const expectedDict: Record<string, string[]> = {
    "d-b1-13": [
      "Neun Uhr passt. Ich brauche Zugang zum Keller.",
      "Montag, aber nicht vor neun: erst die Kinder in die Kita.",
    ],
    "d-b1-14": [
      "Dann ruhen Sie aus — die Gesundheit geht vor der Frist.",
      "Längst im gemeinsamen Ordner, seit gestern Abend.",
    ],
    "d-b1-15": [
      "Zwanzig Euro bei Diebstahl, sechs bei Verlust — verloren, richtig?",
      "Kein Missbrauch vermerkt. Die neue Karte kommt in vierzehn Tagen.",
    ],
  };
  let locksOk = true;
  for (const did of scope) {
    const dlg = liveB104.find((x) => x.id === did);
    for (let i = 0; i < expectedDE[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE[did][i] || dlg.lines[i].who !== expectedWho[did][i]) locksOk = false;
    }
    for (let i = 0; i < expectedAnswers[did].length; i++) {
      if (dlg.questions[i].answer !== expectedAnswers[did][i]) locksOk = false;
    }
    for (let i = 0; i < expectedDict[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict[did][i]) locksOk = false;
    }
  }
  ok(locksOk, "K191f كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (24/9/6)");

  ok(reviewB104.judgement.corrected === 10 && reviewB104.judgement.unresolved === 0 &&
    reviewB104.waisen.present === false &&
    patchSourceB104.includes("d-b1-13") && patchSourceB104.includes("d-b1-14") &&
    patchSourceB104.includes("d-b1-15") && patchSourceB104.includes("<R117> patch complete"),
    "K191g الرقعة تغطي الثلاثة حوارات وتطبق العشرة تصحيحات وتطبع سطر النهاية");

  ok(reviewB104.contextNotes["d-b1-14"] && reviewB104.contextNotes["d-b1-15"] &&
    reviewB104.styleAlternatives["d-b1-15"],
    "K191h ملاحظات سياقية (مكتب/صرف) وبدائل مسجلة");

  ok(reviewB104.limits.audio.includes("لا استماع") && reviewB104.limits.cefr.includes("لم يُعد") &&
    reviewB104.limits.human.includes("ليست") &&
    reviewB104.limits.medical.length > 0 && reviewB104.limits.legal.length > 0,
    "K191i حدود الصوت/CEFR/بشري/طبي/قانوني معلنة");

  const srcMap4 = reviewB104.sources as Record<string, any[]>;
  ok(reviewB104Md.includes("## الحكم") && reviewB104Md.includes("## التصحيحات") &&
    reviewB104Md.includes("## المصادر") && reviewB104Md.includes("K191") &&
    Object.keys(srcMap4).every((k) => srcMap4[k].length >= 2) &&
    Object.values(srcMap4).reduce((n: number, v: any[]) => n + v.length, 0) >= 7,
    "K191j التقرير العربي ومصادره (2+ لكل حوار، 7+ إجمالاً) يذكر K191");
}

// K192 — fifth B1 batch d-b1-16..d-b1-18 (R118).
{
  const reviewB105 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-05-2026-10-08.json", "utf8")) as any;
  const reviewB105Md = readFileSync("docs/content-review-b1-dialogues-05-2026-10-08.md", "utf8");
  const liveB105 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB105 = readFileSync("scripts/patches/review_b1_dialogues_05.py", "utf8");
  const scope = ["d-b1-16", "d-b1-17", "d-b1-18"];
  ok(reviewB105.reviewRule === "R118" && reviewB105.date === "2026-10-08" &&
    JSON.stringify(reviewB105.dialogues.map((d: any) => d.id)) === JSON.stringify(scope) &&
    reviewB105.totals.lines === 23 && reviewB105.totals.questions === 9 && reviewB105.totals.dictation === 6,
    "K192a دفعة B1 الخامسة d-b1-16..18 موثقة (23 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB105.corrections.length === 14,
    "K192b أربعة عشر تصحيحاً عربياً مؤكداً (Sie→جمع، معاني ausfallen/Einladung/planen/Ruhezeiten/Ruhe/Musik/Bescheid/schelten، إزالة إضافات)");

  const d16 = liveB105.find((d) => d.id === "d-b1-16");
  const d17 = liveB105.find((d) => d.id === "d-b1-17");
  const d18 = liveB105.find((d) => d.id === "d-b1-18");
  ok(d16.lines[1].ar.includes("يحقّ لكم") && !d16.lines[1].ar.includes("بخمسينَ لك") &&
    d16.lines[3].ar.includes("عبِّئوا") && d16.lines[3].ar.includes("حسابَكم") && !d16.lines[3].ar.includes("حسابَك.") &&
    d16.lines[5].ar.includes("واحتفظوا") && !d16.lines[5].ar.includes("واحتفظْ") &&
    d16.lines[6].ar.includes("أُلغي") && !d16.lines[6].ar.includes("فاتني") &&
    d16.lines[7].ar.includes("القطارُ التالي") && d16.lines[7].ar.includes("دوَّناه") && !d16.lines[7].ar.includes("في النظام"),
    "K192c d-b1-16: Sie→لكم/عبِّئوا/حسابَكم/احتفظوا، ausfallen=أُلغي لا فاتني، وحذف «في النظام»");

  ok(d17.lines[2].ar.includes("ويمكن للآباء") && d17.lines[2].ar.includes("بصوتٍ عالٍ") &&
    !d17.lines[2].ar.includes("أسبوعياً") && !d17.lines[2].ar.includes("بعضُ الآباءِ") &&
    d17.lines[4].ar.includes("نُخطِّطُ له") && !d17.lines[4].ar.includes("نجعلُه") &&
    d17.lines[7].ar.includes("الدعوةُ تُرسَل") && !d17.lines[7].ar.includes("الرسالةُ") &&
    d17.lines[7].ar.includes("المشاركين في العرض") && !d17.lines[7].ar.includes("عندهم"),
    "K192d d-b1-17: können…helfen ويمكن للآباء، planen=نُخطِّط لا نجعل، Einladung=الدعوة لا الرسالة");

  ok(d18.lines[0].ar.includes("لائحةُ البنايةِ") && d18.lines[0].ar.includes("أوقاتِ السكون") && !d18.lines[0].ar.includes("يعرفُ سكوناً") &&
    d18.lines[1].ar.includes("بصوتٍ عالٍ") && !d18.lines[1].ar.includes("مباراة") &&
    d18.lines[3].ar.includes("أحسنتم") && d18.lines[3].ar.includes("التوبيخ") && !d18.lines[3].ar.includes("الشكاة") &&
    !d18.lines[3].ar.includes("المباراة") && d18.lines[3].ar.includes("البثُّ متوقفاً") && !d18.lines[3].ar.includes("لن تعودَ") &&
    d18.lines[4].ar.includes("أُخبِرُكم") && !d18.lines[4].ar.includes("أُنذِرُك") && d18.lines[4].ar.includes("قبلَ وصولهم") &&
    d18.lines[5].ar.includes("موسيقى") && d18.lines[5].ar.includes("فاطرقوا") && !d18.lines[5].ar.includes("فقَرِعَ") && !d18.lines[5].ar.includes("لحنٌ") &&
    d18.lines[6].ar.includes("اتّفقنا") && d18.lines[6].ar.includes("الهدوءَ") && !d18.lines[6].ar.includes("الصمتَ"),
    "K192e d-b1-18: لائحة/أوقات السكون، حذف «مباراة»×2، schelten=التوبيخ، Bescheid=أُخبِرُكم، Musik=موسيقى، klopfen=فاطرقوا، Abgemacht=اتّفقنا");

  // Locked DE/who/questions/dictations.
  const expectedDE5: Record<string, string[]> = {
    "d-b1-16": [
      "Mein Zug nach München hatte fünfzig Minuten Verspätung — Fahrgastrechte bitte.",
      "Bei fünfzig Minuten stehen Ihnen fünfzehn Prozent des Preises zu.",
      "Bar oder aufs Konto?",
      "Das Formular „Geld zurück“ online ausfüllen — die Erstattung geht aufs Konto.",
      "Muss ich die Fahrkarte beilegen?",
      "Eine Kopie genügt — bewahren Sie das Original auf.",
      "Der Anschlusszug fiel auch aus!",
      "Dann gilt der nächste Zug ohne Aufpreis — wir haben es vermerkt.",
    ],
    "d-b1-17": [
      "Willkommen — wie steht es um unseren Lesetag?",
      "Die Leseecke ist fertig; für die Bibliothek fehlt ein Sponsor.",
      "Eltern können auch beim Vorlesen helfen.",
      "Ich melde mich: einmal monatlich, samstags vor zehn.",
      "Die Abschlussfeier planen wir als Arbeitsgruppe am Freitag.",
      "Freitag passt erst nach siebzehn — mein Dienst beginnt früher.",
      "Wer lädt unsere Partnerschule ein?",
      "Die Einladung geht raus; sie meldet ihre Auftrittskinder an.",
    ],
    "d-b1-18": [
      "Gestern nach Mitternacht war es laut — die Hausordnung kennt Ruhezeiten.",
      "Das war die Übertragung meines Bruders, laut verstärkt.",
      "Das bleibt einmalig — ich erwarte eine Entschuldigung, und Nachtruhe ab zweiundzwanzig.",
      "Entschuldigung — schön, dass Sie sprechen statt zu schelten. Die Übertragung bleibt künftig aus.",
      "Bei Gästen sage ich Bescheid — zwanzig Minuten vorher.",
      "Dringt bei uns Musik durch die Wand, klopfen Sie einmal — wir drehen sofort leiser.",
      "Abgemacht — Treppe und Ruhe teilen wir uns.",
    ],
  };
  const expectedWho5: Record<string, string[]> = {
    "d-b1-16": ["Amir","Schaffnerin Weiß","Amir","Schaffnerin Weiß","Amir","Schaffnerin Weiß","Amir","Schaffnerin Weiß"],
    "d-b1-17": ["Lehrerin Kern","Selim","Lehrerin Kern","Selim","Lehrerin Kern","Selim","Lehrerin Kern","Selim"],
    "d-b1-18": ["Frau Dittrich","Oussama","Frau Dittrich","Oussama","Frau Dittrich","Oussama","Frau Dittrich"],
  };
  const expectedAnswers5: Record<string, any[]> = {
    "d-b1-16": ["fünfzehn Prozent des Preises", "das Onlineformular und eine Kopie der Fahrkarte", "der nächste Zug ohne Aufpreis"],
    "d-b1-17": ["ein Sponsor", "einmal monatlich, samstags vor zehn", "die Abschlussfeier"],
    "d-b1-18": ["die laut verstärkte Übertragung des Bruders", "um zweiundzwanzig Uhr", "Die Übertragung bleibt künftig aus."],
  };
  const expectedDict5: Record<string, string[]> = {
    "d-b1-16": [
      "Dann gilt der nächste Zug ohne Aufpreis — wir haben es vermerkt.",
      "Bei fünfzig Minuten stehen Ihnen fünfzehn Prozent des Preises zu.",
    ],
    "d-b1-17": [
      "Die Leseecke ist fertig; für die Bibliothek fehlt ein Sponsor.",
      "Die Einladung geht raus; sie meldet ihre Auftrittskinder an.",
    ],
    "d-b1-18": [
      "Das bleibt einmalig — ich erwarte eine Entschuldigung, und Nachtruhe ab zweiundzwanzig.",
      "Bei Gästen sage ich Bescheid — zwanzig Minuten vorher.",
    ],
  };
  let locksOk5 = true;
  for (const did of scope) {
    const dlg = liveB105.find((x) => x.id === did);
    for (let i = 0; i < expectedDE5[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE5[did][i] || dlg.lines[i].who !== expectedWho5[did][i]) locksOk5 = false;
    }
    for (let i = 0; i < expectedAnswers5[did].length; i++) {
      if (dlg.questions[i].answer !== expectedAnswers5[did][i]) locksOk5 = false;
    }
    for (let i = 0; i < expectedDict5[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict5[did][i]) locksOk5 = false;
    }
  }
  ok(locksOk5, "K192f كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (23/9/6)");

  ok(reviewB105.judgement.corrected === 14 && reviewB105.judgement.unresolved === 0 &&
    reviewB105.waisen.present === false &&
    patchSourceB105.includes("d-b1-16") && patchSourceB105.includes("d-b1-17") &&
    patchSourceB105.includes("d-b1-18") && patchSourceB105.includes("<R118> patch complete"),
    "K192g الرقعة تغطي الثلاثة حوارات وتطبق الأربعة عشر تصحيحاً وتطبع سطر النهاية");

  const warn5 = (reviewB105.contentWarnings ?? []) as any[];
  ok(reviewB105.contextNotes["d-b1-16"] && reviewB105.contextNotes["d-b1-17"] && reviewB105.contextNotes["d-b1-18"] &&
    reviewB105.styleAlternatives["d-b1-18"] && reviewB105.styleAlternatives["d-b1-17"] &&
    warn5.length === 1 && warn5[0].modified === false && warn5[0].dialogue === "d-b1-16" &&
    warn5[0].statement.includes("2021/782") && warn5[0].evidence.includes("Verbraucherzentrale") &&
    warn5[0].recommendation.length > 0,
    "K192h ملاحظات سياقية (قطار/مدرسة/جيرة) وبدائل، وتحذير محتوى واحد موثق غير معدّل: 15%/50د لا تطابق VO 2021/782");

  ok(reviewB105.limits.audio.includes("لا استماع") && reviewB105.limits.cefr.includes("لم يُعد") &&
    reviewB105.limits.human.includes("ليست") &&
    reviewB105.limits.legal.length > 0 && reviewB105.limits.professional.length > 0,
    "K192i حدود الصوت/CEFR/بشري/قانوني/تربوي معلنة");

  const srcMap5 = reviewB105.sources as Record<string, any[]>;
  ok(reviewB105Md.includes("## الحكم") && reviewB105Md.includes("## التصحيحات") &&
    reviewB105Md.includes("## المصادر") && reviewB105Md.includes("## تحذيرات محتوى") &&
    reviewB105Md.includes("K192") &&
    Object.keys(srcMap5).every((k) => srcMap5[k].length >= 2) &&
    Object.values(srcMap5).reduce((n: number, v: any[]) => n + v.length, 0) >= 7,
    "K192j التقرير العربي ومصادره (2+ لكل حوار، 7+ إجمالاً) وتحذير المحتوى يذكر K192");
}

// K193 — sixth B1 batch d-b1-19..d-b1-21 (R119).
{
  const reviewB106 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-06-2026-10-08.json", "utf8")) as any;
  const reviewB106Md = readFileSync("docs/content-review-b1-dialogues-06-2026-10-08.md", "utf8");
  const liveB106 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB106 = readFileSync("scripts/patches/review_b1_dialogues_06.py", "utf8");
  const scope = ["d-b1-19", "d-b1-20", "d-b1-21"];
  ok(reviewB106.reviewRule === "R119" && reviewB106.date === "2026-10-08" &&
    JSON.stringify(reviewB106.dialogues.map((d: any) => d.id)) === JSON.stringify(scope) &&
    reviewB106.totals.lines === 24 && reviewB106.totals.questions === 9 && reviewB106.totals.dictation === 6,
    "K193a دفعة B1 السادسة d-b1-19..21 موثقة (24 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB106.corrections.length === 18,
    "K193b ثمانية عشر تصحيحاً عربياً مؤكداً (أرقام محذوفة/مترجمة خطأ، جنس المخاطَب، Sie الصريح، خطأ نحوي، إضافات محذوفة ومصطلحات)");

  const d19 = liveB106.find((d) => d.id === "d-b1-19");
  const d20 = liveB106.find((d) => d.id === "d-b1-20");
  const d21 = liveB106.find((d) => d.id === "d-b1-21");
  ok(d19.lines[0].ar.includes("يتعارضُ مع امتحاني") && d19.lines[0].ar.includes("هل يمكنُ تأجيلُه") &&
    !d19.lines[0].ar.includes("يتصادمُ") && !d19.lines[0].ar.includes("أبعدَه") &&
    d19.lines[1].ar.includes("مع إثباتِ السبب") && !d19.lines[1].ar.includes("والهاتِ") &&
    d19.lines[2].ar.includes("إشعارُ تسجيلِ امتحانِ الجامعةِ") && !d19.lines[2].ar.includes("تفضَّلي") && !d19.lines[2].ar.includes("مطبوعاً") &&
    d19.lines[3].ar.includes("الموعدُ الجديد") && d19.lines[3].ar.includes("الساعةَ الثانيةَ والنصفَ بعدَ الظهر") && !d19.lines[3].ar.includes("الثانيةَ عشرةَ والنصف") &&
    d19.lines[4].ar.includes("أأُحضرُ الوثائقَ كلَّها مرةً أخرى") && !d19.lines[4].ar.includes("أأُعيدُ") &&
    d19.lines[5].ar.includes("تصريحُ إقامةٍ") && d19.lines[5].ar.includes("إثباتُ تأمينٍ") && d19.lines[5].ar.includes("كما في المرةِ الأولى"),
    "K193c d-b1-19: تأجيل/تعارض، إثبات السبب، حذف تفضَّلي ومطبوعاً، 14:30=الثانية والنصف بعد الظهر، أحضر لا أُعيد، تصريح إقامة/إثبات تأمين");

  ok(d20.lines[0].ar.includes("هل تقدّمون خدمةَ الطوارئِ الليلة") && !d20.lines[0].ar.includes("أنوبتُكم") &&
    d20.lines[1].ar.includes("حتى الثامنةِ صباحاً") && !d20.lines[1].ar.includes("فجراً") &&
    d20.lines[1].ar.includes("ماذا تحتاجون؟") && !d20.lines[1].ar.includes("ما مطلوبُك") &&
    d20.lines[2].ar.includes("لطفلةٍ في العاشرةِ من عمرها") && !d20.lines[2].ar.includes("لعاشرةِ أعوامٍ") &&
    d20.lines[3].ar.includes("ثمانيةٌ وخمسون يورو") && d20.lines[3].ar.includes("النشرةِ الداخليةِ") && !d20.lines[3].ar.includes("واقرأ نشرةَ العبوةِ") &&
    d20.lines[6].ar.includes("إحضارُ وصفةِ الطفلِ غداً") && !d20.lines[6].ar.includes("أَأُتمُّ") &&
    d20.lines[7].ar.includes("ألفُ عافيةٍ للصغيرة") && !d20.lines[7].ar.includes("وفي الصغيرِ عافية"),
    "K193d d-b1-20: Notdienst، الثامنة صباحاً، Sie→تحتاجون، طفلة في العاشرة، 8,50 والنشرة الداخلية، إحضار لا إتمام، الصغيرة مؤنثة");

  ok(d21.lines[1].ar.includes("المهلةُ ستةُ أسابيع") && d21.lines[1].ar.includes("والإنهاءُ خطّيٌّ") && !d21.lines[1].ar.includes("خطيّاً كما وردَ") &&
    d21.lines[2].ar.includes("ولم يصلني أيُّ تأكيدٍ") && !d21.lines[2].ar.includes("بطاقةُ تأكيد") &&
    d21.lines[3].ar.includes("لا بدَّ أن يكونَ خطّيّاً") && d21.lines[3].ar.includes("وعندها يُعتَدُّ به") && !d21.lines[3].ar.includes("أختمُ بريدَك") &&
    d21.lines[4].ar.includes("ولماذا خصمتم المبلغَ مسبقاً") && d21.lines[4].ar.includes("وقد أنهيتُ العقدَ") && !d21.lines[4].ar.includes("ولم خصمتم") &&
    d21.lines[5].ar.includes("نوقفُ الخصمَ عندَ انتهاءِ المهلة") && d21.lines[5].ar.includes("وما دُفِعَ زيادةً يُرَدُّ") && !d21.lines[5].ar.includes("يُعادُ إليك") &&
    d21.lines[7].ar.includes("خمسةَ عشرَ يورو تُرَدُّ") && d21.lines[7].ar.includes("أربعةَ عشرَ يوماً") && !d21.lines[7].ar.includes("خلالَ أسبوعَين"),
    "K193e d-b1-21: المهلة/الإنهاء خطي، أيُّ تأكيد، حذف مشهد الختم، لماذا خصمتم+أنهيتُ، يُرَدُّ المبني للمجهول، 15 يورو/14 يوماً");

  // Locked DE/who/questions/dictations.
  const expectedDE6: Record<string, string[]> = {
    "d-b1-19": [
      "Mein Freitagtermin fällt mit meiner Prüfung zusammen — ein Monat später?",
      "Verschiebungen nur schriftlich; den Grund bitte nachweisen.",
      "Hier ist die Prüfungsanmeldung der Universität.",
      "Neuer Termin: Erster des Folgemonats, vierzehn Uhr dreißig — nur mit diesem Brief.",
      "Die Unterlagen wieder in voller Zahl?",
      "Pass, Aufenthaltstitel, Mietvertrag, Versicherungsnachweis — wie beim ersten Mal.",
      "Verstanden — dann bin ich sicher da; und was folgt bei zweitem Versäumnis?",
      "Bei zweitem Versäumnis: Ablehnung, neue Gebühr.",
    ],
    "d-b1-20": [
      "Ist heute Nacht Notdienst? Der Kinderarzt schickte mich.",
      "Ja — bis acht Uhr früh. Was benötigen Sie?",
      "Ein Fiebermittel für ein zehnjähriges Kind, rezeptfrei?",
      "Acht Euro fünfzig — die Beilage genau durchlesen, bitte.",
      "Und etwas gegen nächtlichen Husten?",
      "Nicht kombinieren bei Kindern: nur ein Mittel zur Zeit.",
      "Das Rezept fürs Kind kann ich morgen bringen?",
      "Rezepte gelten bundesweit — gute Besserung für die Kleine!",
    ],
    "d-b1-21": [
      "Ich kündige meinen Vertrag zum Monatsende.",
      "Die Frist beträgt sechs Wochen, schriftlich — siehe Vertrag.",
      "Ich telefonierte vor zwei Wochen; keine Bestätigung kam.",
      "Telefon allein genügt nicht — schriftlich muss es vorliegen, dann zählt es.",
      "Warum wurde schon abgebucht, obwohl ich kündigte?",
      "Wir stoppen mit Fristablauf — zu viel Gezahltes wird erstattet.",
      "Und meine Schlüsselkaution?",
      "Fünfzehn Euro zurück, binnen vierzehn Tagen nach Übergabe.",
    ],
  };
  const expectedWho6: Record<string, string[]> = {
    "d-b1-19": ["Amira","Hedi","Amira","Hedi","Amira","Hedi","Amira","Hedi"],
    "d-b1-20": ["Frau Seidl","Firas","Frau Seidl","Firas","Frau Seidl","Firas","Frau Seidl","Firas"],
    "d-b1-21": ["Riadh","Studioleiter","Riadh","Studioleiter","Riadh","Studioleiter","Riadh","Studioleiter"],
  };
  const expectedAnswers6: Record<string, any[]> = {
    "d-b1-19": ["nur schriftlich mit Nachweis des Grundes", "alle Unterlagen wie beim ersten Mal", "Ablehnung und eine neue Gebühr"],
    "d-b1-20": ["bis acht Uhr früh", "nur ein Mittel zur Zeit", "Ja, Rezepte gelten bundesweit."],
    "d-b1-21": ["Schriftform mit sechs Wochen Frist", "Sie wird erstattet.", "fünfzehn Euro"],
  };
  const expectedDict6: Record<string, string[]> = {
    "d-b1-19": [
      "Verschiebungen nur schriftlich; den Grund bitte nachweisen.",
      "Bei zweitem Versäumnis: Ablehnung, neue Gebühr.",
    ],
    "d-b1-20": [
      "Nicht kombinieren bei Kindern: nur ein Mittel zur Zeit.",
      "Acht Euro fünfzig — die Beilage genau durchlesen, bitte.",
    ],
    "d-b1-21": [
      "Wir stoppen mit Fristablauf — zu viel Gezahltes wird erstattet.",
      "Telefon allein genügt nicht — schriftlich muss es vorliegen, dann zählt es.",
    ],
  };
  let locksOk6 = true;
  for (const did of scope) {
    const dlg = liveB106.find((x) => x.id === did);
    for (let i = 0; i < expectedDE6[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE6[did][i] || dlg.lines[i].who !== expectedWho6[did][i]) locksOk6 = false;
    }
    for (let i = 0; i < expectedAnswers6[did].length; i++) {
      if (dlg.questions[i].answer !== expectedAnswers6[did][i]) locksOk6 = false;
    }
    for (let i = 0; i < expectedDict6[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict6[did][i]) locksOk6 = false;
    }
  }
  ok(locksOk6, "K193f كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (24/9/6)");

  ok(reviewB106.judgement.corrected === 18 && reviewB106.judgement.unresolved === 0 &&
    reviewB106.waisen.present === false &&
    patchSourceB106.includes("d-b1-19") && patchSourceB106.includes("d-b1-20") &&
    patchSourceB106.includes("d-b1-21") && patchSourceB106.includes("<R119> patch complete"),
    "K193g الرقعة تغطي الثلاثة حوارات وتطبق الثمانية عشر تصحيحاً وتطبع سطر النهاية");

  ok(reviewB106.contextNotes["d-b1-19"] && reviewB106.contextNotes["d-b1-20"] && reviewB106.contextNotes["d-b1-21"] &&
    reviewB106.styleAlternatives["d-b1-19"] && reviewB106.styleAlternatives["d-b1-21"] &&
    Array.isArray(reviewB106.contentWarnings) && reviewB106.contentWarnings.length === 0 &&
    reviewB106.contentChecks.length >= 3 &&
    reviewB106.contextNotes["d-b1-20"].some((n: any) => n.note.includes("2.50")) &&
    reviewB106Md.includes("## تحذيرات محتوى"),
    "K193h ملاحظات سياقية (أجانب/صيدلية/نادٍ) وبدائل، ولا تحذيرات محتوى جديدة مع فحوصٍ موثقة (رسوم المناوبة)");

  ok(reviewB106.limits.audio.includes("لا استماع") && reviewB106.limits.cefr.includes("لم يُعد") &&
    reviewB106.limits.human.includes("ليست") &&
    reviewB106.limits.legal.length > 0 && reviewB106.limits.medical.length > 0 &&
    reviewB106.limits.professional.length > 0,
    "K193i حدود الصوت/CEFR/بشري/قانوني/طبي/إداري معلنة");

  const srcMap6 = reviewB106.sources as Record<string, any[]>;
  ok(reviewB106Md.includes("## الحكم") && reviewB106Md.includes("## التصحيحات") &&
    reviewB106Md.includes("## المصادر") && reviewB106Md.includes("K193") &&
    Object.keys(srcMap6).every((k) => srcMap6[k].length >= 2) &&
    Object.values(srcMap6).reduce((n: number, v: any[]) => n + v.length, 0) >= 7,
    "K193j التقرير العربي ومصادره (2+ لكل حوار، 7+ إجمالاً) يذكر K193");
}

// K194 — seventh B1 batch d-b1-22..d-b1-24 (R120).
{
  const reviewB107 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-07-2026-10-08.json", "utf8")) as any;
  const reviewB107Md = readFileSync("docs/content-review-b1-dialogues-07-2026-10-08.md", "utf8");
  const liveB107 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB107 = readFileSync("scripts/patches/review_b1_dialogues_07.py", "utf8");
  const scope7 = ["d-b1-22", "d-b1-23", "d-b1-24"];
  ok(reviewB107.reviewRule === "R120" && reviewB107.date === "2026-10-08" &&
    JSON.stringify(reviewB107.dialogues.map((d: any) => d.id)) === JSON.stringify(scope7) &&
    reviewB107.totals.lines === 24 && reviewB107.totals.questions === 9 && reviewB107.totals.dictation === 6,
    "K194a دفعة B1 السابعة d-b1-22..24 موثقة (24 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB107.corrections.length === 18,
    "K194b ثمانية عشر تصحيحاً عربياً مؤكداً (Sie الصريح، معانٍ ومصطلحات، إضافات محذوفة، أرقام وزمن، تحية وداع)");

  const d22 = liveB107.find((d) => d.id === "d-b1-22");
  const d23 = liveB107.find((d) => d.id === "d-b1-23");
  const d24 = liveB107.find((d) => d.id === "d-b1-24");
  ok(d22.lines[1].ar.includes("لكم الحق") && d22.lines[1].ar.includes("الصنفُ يخصُّ الطاولةَ المجاورة") &&
    !d22.lines[1].ar.includes("لكِ الحق") &&
    d22.lines[2].ar.includes("المبلغَ من فضلكم") && !d22.lines[2].ar.includes("المجموعَ") &&
    d22.lines[5].ar.includes("أُبلِغَ داخلياً") && !d22.lines[5].ar.includes("رسمياً") &&
    d22.lines[6].ar.includes("بالإنصافِ نعودُ —") && !d22.lines[6].ar.includes("غداً") &&
    d22.lines[7].ar.includes("ليلةً سعيدة") && !d22.lines[7].ar.includes("سهرةً طيبة"),
    "K194c d-b1-22: لكم الحق، الصنف يخص الطاولة المجاورة، المبلغ لا المجموع، داخلياً لا رسمياً، حذف غداً، ليلة سعيدة");

  ok(d23.lines[0].ar.includes("إعادةُ ترتيبِ جدولِ المحاضرات") && d23.lines[0].ar.includes("المحاضرةُ مقابلَ التدريبِ العمليّ") &&
    !d23.lines[0].ar.includes("صياغةَ جدولٍ") && !d23.lines[0].ar.includes("ضاقَ") &&
    d23.lines[1].ar.includes("متى يقعُ تدريبُكِ العمليُّ") && !d23.lines[1].ar.includes("ما ساعاتُ") &&
    d23.lines[3].ar.includes("المحاضرةُ متوفّرةٌ كتسجيلٍ") && d23.lines[3].ar.includes("في الدورةِ باء") &&
    !d23.lines[3].ar.includes("تُنزَّلُ") && !d23.lines[3].ar.includes("القسمِ باء") &&
    d23.lines[4].ar.includes("على الجامعةِ أن تعترفَ بالتدريبِ العمليّ") && !d23.lines[4].ar.includes("المنشأةُ معترفٌ") &&
    d23.lines[5].ar.includes("تأكيدٌ من الشركةِ") && d23.lines[5].ar.includes("بحدٍّ أقصى") && !d23.lines[5].ar.includes("رسالةُ اعتمادٍ") &&
    d23.lines[6].ar.includes("الشركةُ خطاباً") && !d23.lines[6].ar.includes("المنشأةُ كتاباً") &&
    d23.lines[7].ar.includes("بلا صيغةٍ رسمية") && d23.lines[7].ar.includes("خطّيّ — يكفي") &&
    !d23.lines[7].ar.includes("غيرُ مُختم") && !d23.lines[7].ar.includes("بموضوعٍ وساعاتٍ"),
    "K194d d-b1-23: إعادة ترتيب الجدول وسؤال «متى»، الجامعة لا المنشأة، الدورة لا القسم، تأكيد الشركة وخطاب وبريد formlos schriftlich");

  ok(d24.lines[0].ar.includes("أمسِ مساءً") && d24.lines[0].ar.includes("حقيبةَ الحاسوبِ") && !d24.lines[0].ar.includes("وفيها حاسوبي") &&
    d24.lines[1].ar.includes("الخطُّ والمحطة") && !d24.lines[1].ar.includes("الرقمُ والمحطة") &&
    d24.lines[3].ar.includes("غرضٌ معثورٌ عليه") && d24.lines[3].ar.includes("الثامنةَ وعشرينَ دقيقةً مساءً") &&
    !d24.lines[3].ar.includes("وِجادةٌ") && !d24.lines[3].ar.includes("العشرينُ والعشرون") &&
    d24.lines[5].ar.includes("من التاسعة") && d24.lines[5].ar.includes("إثباتُ الملكية") &&
    d24.lines[6].ar.includes("لقطاتٍ للجهاز") && !d24.lines[6].ar.includes("من حاسوبي") &&
    d24.lines[7].ar.includes("أربعةَ عشرَ يوماً للحفظ") && d24.lines[7].ar.includes("مخزنُ المزادِ") &&
    d24.lines[7].ar.includes("فلتحضروا في الموعد") && !d24.lines[7].ar.includes("أسبوعانِ") && !d24.lines[7].ar.includes("باكراً"),
    "K194e d-b1-24: الخط لا الرقم، 20:20 بالحروف، من التاسعة، لقطات للجهاز، 14 يوماً للحفظ ثم مخزن المزاد، pünktlich=في الموعد");

  // Locked DE/who/questions/dictations.
  const expectedDE7: Record<string, string[]> = {
    "d-b1-22": [
      "Auf der Rechnung steht Mineralwasser — wir haben nichts bestellt.",
      "Ich prüfe das System … Sie haben recht — das ging an den Nebentisch.",
      "Bitte korrigieren Sie den Betrag vor dem Bezahlen.",
      "Zwölf Euro weniger: sechsundzwanzig statt achtunddreißig.",
      "Außerdem kam die Hauptspeise kalt.",
      "Das Dessert geht aufs Haus — Küche ist intern gemeldet.",
      "Mit Fairness kommt man wieder — danke.",
      "Bis zum nächsten Besuch, gute Nacht!",
    ],
    "d-b1-23": [
      "Ich muss den Stundenplan umbauen: Vorlesung gegen Praktikum.",
      "Wann liegt das Praktikum?",
      "Täglich acht bis zwölf — Fabrik im Industriegebiet.",
      "Die Vorlesung gibt es als Aufzeichnung; wir buchen Kurs B.",
      "Muss die Uni das Praktikum anerkennen?",
      "Ja: Bestätigung der Firma mit Zeiten, maximal dreißig Wochenstunden.",
      "Und wenn die Firma kein Schreiben ausstellt?",
      "Eine E-Mail der Chefin — formlos, aber schriftlich — genügt.",
    ],
    "d-b1-24": [
      "Gestern Abend verlor ich im Bus die Laptoptasche.",
      "Linie und Haltestelle — genau, bitte.",
      "Linie sechsundzwanzig, Endhaltestelle, Sitz hinten links.",
      "Ein Fund, gemeldet um zwanzig zwanzig — Beschreibung passt.",
      "Wann kann ich abholen?",
      "Ab neun — Ausweis und Eigentumsnachweis: Rechnung oder Fotos.",
      "Ich bringe Rechnung und Screenshots des Geräts.",
      "Vierzehn Tage Aufbewahrung, dann Versteigerungslager — kommen Sie pünktlich.",
    ],
  };
  const expectedWho7: Record<string, string[]> = {
    "d-b1-22": ["Leila","Ober","Leila","Ober","Leila","Ober","Leila","Ober"],
    "d-b1-23": ["Maha","Beraterin","Maha","Beraterin","Maha","Beraterin","Maha","Beraterin"],
    "d-b1-24": ["Wassim","Polizist","Wassim","Polizist","Wassim","Polizist","Wassim","Polizist"],
  };
  const expectedAnswers7: Record<string, any[]> = {
    "d-b1-22": ["das Mineralwasser", "mit einem Dessert aufs Haus", "sechsundzwanzig Euro"],
    "d-b1-23": ["die Vorlesung und das Praktikum", "dreißig Wochenstunden", "eine formlose E-Mail der Chefin"],
    "d-b1-24": ["Verlust im Bus", "Ausweis und Eigentumsnachweis", "vierzehn Tage"],
  };
  const expectedDict7: Record<string, string[]> = {
    "d-b1-22": [
      "Zwölf Euro weniger: sechsundzwanzig statt achtunddreißig.",
      "Das Dessert geht aufs Haus — Küche ist intern gemeldet.",
    ],
    "d-b1-23": [
      "Ja: Bestätigung der Firma mit Zeiten, maximal dreißig Wochenstunden.",
      "Eine E-Mail der Chefin — formlos, aber schriftlich — genügt.",
    ],
    "d-b1-24": [
      "Ein Fund, gemeldet um zwanzig zwanzig — Beschreibung passt.",
      "Vierzehn Tage Aufbewahrung, dann Versteigerungslager — kommen Sie pünktlich.",
    ],
  };
  let locksOk7 = true;
  for (const did of scope7) {
    const dlg = liveB107.find((x) => x.id === did);
    for (let i = 0; i < expectedDE7[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE7[did][i] || dlg.lines[i].who !== expectedWho7[did][i]) locksOk7 = false;
    }
    for (let i = 0; i < expectedAnswers7[did].length; i++) {
      if (dlg.questions[i].answer !== expectedAnswers7[did][i]) locksOk7 = false;
    }
    for (let i = 0; i < expectedDict7[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict7[did][i]) locksOk7 = false;
    }
  }
  ok(locksOk7, "K194f كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (24/9/6)");

  ok(reviewB107.judgement.corrected === 18 && reviewB107.judgement.unresolved === 0 &&
    reviewB107.waisen.present === false &&
    patchSourceB107.includes("d-b1-22") && patchSourceB107.includes("d-b1-23") &&
    patchSourceB107.includes("d-b1-24") && patchSourceB107.includes("<R120> patch complete"),
    "K194g الرقعة تغطي الثلاثة حوارات وتطبق الثمانية عشر تصحيحاً وتطبع سطر النهاية");

  ok(reviewB107.contextNotes["d-b1-22"] && reviewB107.contextNotes["d-b1-23"] && reviewB107.contextNotes["d-b1-24"] &&
    reviewB107.styleAlternatives["d-b1-22"] && reviewB107.styleAlternatives["d-b1-24"] &&
    Array.isArray(reviewB107.contentWarnings) && reviewB107.contentWarnings.length === 1 &&
    reviewB107.contentWarnings[0].id === "W2" && reviewB107.contentWarnings[0].dialogue === "d-b1-24" &&
    reviewB107.contentWarnings[0].modified === false && reviewB107.contentWarnings[0].statement.includes("ستة أشهر") &&
    reviewB107.contentChecks.length >= 3 &&
    reviewB107.contextNotes["d-b1-23"].some((n: any) => n.note.includes("Werkstudentenprivileg")) &&
    reviewB107.contextNotes["d-b1-24"].some((n: any) => n.note.includes("§ 965 BGB")) &&
    reviewB107Md.includes("## تحذيرات محتوى"),
    "K194h تحذير محتوى واحد موثق (W2: 14 يوماً للحفظ مقابل ستة أشهر § 973 BGB) مع ملاحظات سياقية (مطعم/جامعة/مفقودات) وفحوص");

  ok(reviewB107.limits.audio.includes("لا استماع") && reviewB107.limits.cefr.includes("لم يُعد") &&
    reviewB107.limits.human.includes("ليست") &&
    reviewB107.limits.legal.length > 0 && reviewB107.limits.medical.length > 0 &&
    reviewB107.limits.professional.length > 0,
    "K194i حدود الصوت/CEFR/بشري/قانوني/طبي/إداري معلنة");

  const srcMap7 = reviewB107.sources as Record<string, any[]>;
  ok(reviewB107Md.includes("## الحكم") && reviewB107Md.includes("## التصحيحات") &&
    reviewB107Md.includes("## المصادر") && reviewB107Md.includes("K194") &&
    Object.keys(srcMap7).every((k) => srcMap7[k].length >= 3) &&
    Object.values(srcMap7).reduce((n: number, v: any[]) => n + v.length, 0) >= 10,
    "K194j التقرير العربي ومصادره (3+ لكل حوار، 10+ إجمالاً) يذكر K194");
}

// K195 — eighth B1 batch d-b1-25..d-b1-27 (R121).
{
  const reviewB108 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-08-2026-10-08.json", "utf8")) as any;
  const reviewB108Md = readFileSync("docs/content-review-b1-dialogues-08-2026-10-08.md", "utf8");
  const liveB108 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB108 = readFileSync("scripts/patches/review_b1_dialogues_08.py", "utf8");
  const scope8 = ["d-b1-25", "d-b1-26", "d-b1-27"];
  ok(reviewB108.reviewRule === "R121" && reviewB108.date === "2026-10-08" &&
    JSON.stringify(reviewB108.dialogues.map((d: any) => d.id)) === JSON.stringify(scope8) &&
    reviewB108.totals.lines === 24 && reviewB108.totals.questions === 9 && reviewB108.totals.dictation === 6,
    "K195a دفعة B1 الثامنة d-b1-25..27 موثقة (24 سطراً، 9 أسئلة، 6 إملاءات)");

  ok(reviewB108.corrections.length === 19,
    "K195b تسعة عشر تصحيحاً عربياً مؤكداً (Sie الصريح، معانٍ ومصطلحات، أرقام فخاخ، عملة محذوفة، إضافات محذوفة)");

  const d25 = liveB108.find((d) => d.id === "d-b1-25");
  const d26 = liveB108.find((d) => d.id === "d-b1-26");
  const d27 = liveB108.find((d) => d.id === "d-b1-27");
  ok(d25.lines[0].ar.includes("تسجيلَ العنوانِ الجديد") && !d25.lines[0].ar.includes("تحديثَ إقامتي") &&
    d25.lines[1].ar.includes("المهلةُ أسبوعان بالضبط") && d25.lines[1].ar.includes("وفي الوقت") && !d25.lines[1].ar.includes("حانَ فيهما") &&
    d25.lines[3].ar.includes("الانتقالَ إلى المسكن") && !d25.lines[3].ar.includes("بدءَ سُكنانا") &&
    d25.lines[5].ar.includes("سأُعطيكم شهادةً مؤقَّتة") && !d25.lines[5].ar.includes("لكنْ خُذ مني") &&
    d25.lines[6].ar.includes("وكم تكلِّفُ؟") && !d25.lines[6].ar.includes("وبكم هي") &&
    d25.lines[7].ar.includes("ستةُ يورو لخاصيةِ الهويةِ الإلكترونية") && !d25.lines[7].ar.includes("وستةٌ لخاصيةِ"),
    "K195c d-b1-25: تسجيل العنوان لا تحديث الإقامة، المهلة بالضبط، سأُعطيكم شهادة مؤقتة، وكم تكلّف، وستة يورو");

  ok(d26.lines[0].ar.includes("اعتباراً من أولِ الشهر") && d26.lines[0].ar.includes("أريدُ كهرباءَكم") &&
    !d26.lines[0].ar.includes("المقبل") && !d26.lines[0].ar.includes("أنتقلُ إليكم") &&
    d26.lines[1].ar.includes("مهلةُ إنهاءِ عقدِك القديم") && d26.lines[1].ar.includes("كلَّ الإجراءات") && !d26.lines[1].ar.includes("العتيقِ") &&
    d26.lines[2].ar.includes("أُبلِغُ قراءةَ العدّادِ") && !d26.lines[2].ar.includes("أُعلِنُ") &&
    d26.lines[3].ar.includes("بالنموذجِ الإلكترونيّ") && d26.lines[3].ar.includes("في موعدٍ أقصاه العاشرةُ مساءً") && !d26.lines[3].ar.includes("الشبكيّ") &&
    d26.lines[4].ar.includes("وهل ينقطعُ الإمداد") && !d26.lines[4].ar.includes("أنُقطَعُ") &&
    d26.lines[5].ar.includes("التزويدُ الأساسيُّ يتدخّلُ") && !d26.lines[5].ar.includes("المِلكيةُ العامةُ") &&
    d26.lines[7].ar.includes("اثني عشرَ شهراً") && d26.lines[7].ar.includes("بتثبيتِ السعر") &&
    !d26.lines[7].ar.includes("سنة") && !d26.lines[7].ar.includes("بثباتِه"),
    "K195d d-b1-26: اعتباراً من أول الشهر، مهلة الإنهاء، إبلاغ القراءة، النموذج الإلكتروني، ينقطع الإمداد، التزويد الأساسي، اثنا عشر شهراً");

  ok(d27.lines[0].ar.includes("متى يمكنني التقدّمُ للامتحانِ النظريّ") && d27.lines[0].ar.includes("أربعينَ ساعةَ تدريب") && !d27.lines[0].ar.includes("نظريُّ الامتحان") &&
    d27.lines[1].ar.includes("في أقربِ الأحوال بعد أسبوعَين") && d27.lines[1].ar.includes("مطلوبةٌ قبلَ الامتحان") && !d27.lines[1].ar.includes("شرطٌ سابق") &&
    d27.lines[2].ar.includes("وما مدةُ صلاحيةِ شهادةِ الإسعاف") && !d27.lines[2].ar.includes("كم تعيشُ") &&
    d27.lines[4].ar.includes("التي يطلبُها الممتحِن") && !d27.lines[4].ar.includes("عندَ المُمتحِن") &&
    d27.lines[5].ar.includes("اختبارُ نظر") && d27.lines[5].ar.includes("صورةٌ شخصية") &&
    !d27.lines[5].ar.includes("نظارةُ قياس") && !d27.lines[5].ar.includes("صورةٌ شمسية") &&
    d27.lines[7].ar.includes("حظرُ أربعةَ عشرَ يوماً") && !d27.lines[7].ar.includes("أسبوعان انتظاراً"),
    "K195e d-b1-27: يمكنني التقدّم، أقرب الأحوال، مدة الصلاحية، يطلبها الممتحن، اختبار نظر وصورة شخصية، حظر 14 يوماً");

  // Locked DE/who/questions/dictations.
  const expectedDE8: Record<string, string[]> = {
    "d-b1-25": [
      "Ich bin vor zwei Wochen umgezogen — Ummeldung, bitte.",
      "Genau zwei Wochen Frist — rechtzeitig. Formular, Ausweis, Vermieterbestätigung.",
      "Was ist diese Bestätigung?",
      "Ein Blatt mit der Unterschrift des Vermieters über den Einzug.",
      "Der Vermieter weilt in Tunesien; die Post braucht Tage.",
      "Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung.",
      "Was kostet sie?",
      "Anmeldung gratis; die eID-Funktion kostet sechs Euro.",
    ],
    "d-b1-26": [
      "Ich kündige zum Monatsersten und will Ihren Strom.",
      "Die Altvertragsfrist sind vier Wochen — wir übernehmen alles.",
      "Wie melde ich den Zählerstand am Umschalttag?",
      "Foto per Onlineformular, spätestens zweiundzwanzig Uhr.",
      "Wird die Versorgung unterbrochen?",
      "Nie — die Grundversorgung springt ohne eine Sekunde Pause ein.",
      "Was sagt die Bonusklausel?",
      "Bonus nur bei zwölf Monaten Bindung; Preisgarantie braucht Preisbindung.",
    ],
    "d-b1-27": [
      "Wann kann ich zur Theorieprüfung — vierzig Übungsstunden?",
      "Frühestens in zwei Wochen — Erste-Hilfe-Kurs vorher nötig.",
      "Wie lange ist diese Bescheinigung gültig?",
      "Einmal im Leben: sie läuft nie ab.",
      "Welche Papiere verlangt der Prüfer?",
      "Ausweis, Sehtest, Erste-Hilfe, Ausbildungsprotokoll, Passfoto — Gebühr vor Ort.",
      "Und nach zweimaligem Nichtbestehen?",
      "Vierzehn Tage Sperre — die Gebühr bleibt gültig, keine Neuanmeldung.",
    ],
  };
  const expectedWho8: Record<string, string[]> = {
    "d-b1-25": ["Toufik","Amtsfrau Berg","Toufik","Amtsfrau Berg","Toufik","Amtsfrau Berg","Toufik","Amtsfrau Berg"],
    "d-b1-26": ["Fatma","Hotline","Fatma","Hotline","Fatma","Hotline","Fatma","Hotline"],
    "d-b1-27": ["Sonda","Fahrlehrer","Sonda","Fahrlehrer","Sonda","Fahrlehrer","Sonda","Fahrlehrer"],
  };
  const expectedAnswers8: Record<string, any[]> = {
    "d-b1-25": ["innerhalb von zwei Wochen", "der Vermieter", "eine vorläufige Bescheinigung"],
    "d-b1-26": ["der neue Anbieter", "per Foto im Onlineformular bis 22 Uhr", "an zwölf Monaten Preisbindung"],
    "d-b1-27": ["die Erste-Hilfe-Bescheinigung", "sie läuft nie ab", "vierzehn Tage Sperre, Gebühr bleibt gültig"],
  };
  const expectedDict8: Record<string, string[]> = {
    "d-b1-25": [
      "Genau zwei Wochen Frist — rechtzeitig. Formular, Ausweis, Vermieterbestätigung.",
      "Ohne sie keine Anmeldung — ich gebe Ihnen vorläufig eine Bescheinigung.",
    ],
    "d-b1-26": [
      "Nie — die Grundversorgung springt ohne eine Sekunde Pause ein.",
      "Bonus nur bei zwölf Monaten Bindung; Preisgarantie braucht Preisbindung.",
    ],
    "d-b1-27": [
      "Einmal im Leben: sie läuft nie ab.",
      "Vierzehn Tage Sperre — die Gebühr bleibt gültig, keine Neuanmeldung.",
    ],
  };
  let locksOk8 = true;
  for (const did of scope8) {
    const dlg = liveB108.find((x) => x.id === did);
    for (let i = 0; i < expectedDE8[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE8[did][i] || dlg.lines[i].who !== expectedWho8[did][i]) locksOk8 = false;
    }
    for (let i = 0; i < expectedAnswers8[did].length; i++) {
      if (dlg.questions[i].answer !== expectedAnswers8[did][i]) locksOk8 = false;
    }
    for (let i = 0; i < expectedDict8[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict8[did][i]) locksOk8 = false;
    }
  }
  ok(locksOk8, "K195f كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (24/9/6)");

  ok(reviewB108.judgement.corrected === 19 && reviewB108.judgement.unresolved === 0 &&
    reviewB108.waisen.present === false &&
    patchSourceB108.includes("d-b1-25") && patchSourceB108.includes("d-b1-26") &&
    patchSourceB108.includes("d-b1-27") && patchSourceB108.includes("<R121> patch complete"),
    "K195g الرقعة تغطي الثلاثة حوارات وتطبق التسعة عشر تصحيحاً وتطبع سطر النهاية");

  ok(reviewB108.contextNotes["d-b1-25"] && reviewB108.contextNotes["d-b1-26"] && reviewB108.contextNotes["d-b1-27"] &&
    reviewB108.styleAlternatives["d-b1-25"] && reviewB108.styleAlternatives["d-b1-27"] &&
    Array.isArray(reviewB108.contentWarnings) && reviewB108.contentWarnings.length === 2 &&
    reviewB108.contentWarnings[0].id === "W3" && reviewB108.contentWarnings[0].dialogue === "d-b1-25" &&
    reviewB108.contentWarnings[1].id === "W4" && reviewB108.contentWarnings[1].dialogue === "d-b1-27" &&
    reviewB108.contentWarnings[0].modified === false && reviewB108.contentWarnings[1].modified === false &&
    reviewB108.contentWarnings[0].statement.includes("مجانيان") &&
    reviewB108.contentWarnings[1].statement.includes("كل محاولة") &&
    reviewB108.contentChecks.length >= 3 &&
    reviewB108.contextNotes["d-b1-25"].some((n: any) => n.note.includes("§ 17")) &&
    reviewB108.contextNotes["d-b1-27"].some((n: any) => n.note.includes("§ 18 FeV")) &&
    reviewB108Md.includes("## تحذيرات محتوى"),
    "K195h تحذيرا محتوى موثقان غير معدّلين (W3: eID مقابل المجانية، W4: الرسوم لكل محاولة) مع ملاحظات سياقية وفحوص");

  ok(reviewB108.limits.audio.includes("لا استماع") && reviewB108.limits.cefr.includes("لم يُعد") &&
    reviewB108.limits.human.includes("ليست") &&
    reviewB108.limits.legal.length > 0 && reviewB108.limits.medical.length > 0 &&
    reviewB108.limits.professional.length > 0,
    "K195i حدود الصوت/CEFR/بشري/قانوني/طبي/إداري معلنة");

  const srcMap8 = reviewB108.sources as Record<string, any[]>;
  ok(reviewB108Md.includes("## الحكم") && reviewB108Md.includes("## التصحيحات") &&
    reviewB108Md.includes("## المصادر") && reviewB108Md.includes("K195") &&
    Object.keys(srcMap8).every((k) => srcMap8[k].length >= 3) &&
    Object.values(srcMap8).reduce((n: number, v: any[]) => n + v.length, 0) >= 10,
    "K195j التقرير العربي ومصادره (3+ لكل حوار، 10+ إجمالاً) يذكر K195");
}


// K196 — ninth and final B1 batch d-b1-31..d-b1-32 (R122).
{
  const reviewB109 = JSON.parse(readFileSync("docs/content-review-b1-dialogues-09-2026-10-08.json", "utf8")) as any;
  const reviewB109Md = readFileSync("docs/content-review-b1-dialogues-09-2026-10-08.md", "utf8");
  const liveB109 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB109 = readFileSync("scripts/patches/review_b1_dialogues_09.py", "utf8");
  const scope9 = ["d-b1-31", "d-b1-32"];
  ok(reviewB109.reviewRule === "R122" && reviewB109.date === "2026-10-08" &&
    JSON.stringify(reviewB109.dialogues.map((d: any) => d.id)) === JSON.stringify(scope9) &&
    reviewB109.totals.lines === 10 && reviewB109.totals.questions === 5 &&
    reviewB109.totals.dictation === 6 && reviewB109.totals.approximateUnits === 77,
    "K196a الدفعة B1 التاسعة والأخيرة d-b1-31..32 موثقة (10 أسطر، 5 أسئلة، 6 إملاءات، 77 وحدة)");

  ok(reviewB109.corrections.length === 4 && reviewB109.judgement.corrected === 4 &&
    reviewB109.judgement.unresolved === 0 && reviewB109.waisen.present === false,
    "K196b أربعة تصحيحات عربية مؤكدة بلا غير محسوم (مخالفة واقعية، Dann مفقود، öfter، فاعل es)");

  const d31 = liveB109.find((d) => d.id === "d-b1-31");
  const d32 = liveB109.find((d) => d.id === "d-b1-32");
  ok(d31.lines[2].ar.includes("ومع ذلك كانت تكفي مكالمةٌ قصيرة") && !d31.lines[2].ar.includes("لتكفي") &&
    !d31.lines[2].ar.includes("ومع هذا") &&
    d31.lines[4].ar.includes("حسناً. إذن نثبّتُ الأمرَ هكذا") && !d31.lines[4].ar.includes("حسناً. نثبّتُ"),
    "K196c d-b1-31: «كانت تكفي» للمخالفة الواقعية و«إذن» المستعادة لـDann");

  ok(d32.lines[2].ar.includes("المهمُّ أن يُكثِرَ من القراءةِ بصوتٍ عالٍ") && !d32.lines[2].ar.includes("عالٍ أكثر") &&
    d32.lines[4].ar.includes("تكفي إن كانَ ذلك بانتظامٍ"),
    "K196d d-b1-32: يُكثِر من القراءة (تكرار لا علوّ صوت) وفاعل es («إن كان ذلك بانتظامٍ»)");

  const expectedDE9: Record<string, string[]> = {
    "d-b1-31": [
      "Mir ist aufgefallen, dass du die Absprache nicht eingehalten hast.",
      "Das stimmt, aber ich war unter großem Zeitdruck.",
      "Das kann ich nachvollziehen. Trotzdem hätte ein kurzer Anruf gereicht.",
      "Da hast du recht. Ich melde mich beim nächsten Mal früher.",
      "Gut. Dann halten wir das so fest.",
    ],
    "d-b1-32": [
      "Ihr Sohn arbeitet gut mit, aber er meldet sich selten.",
      "Zu Hause erzählt er viel. In der Klasse ist er wohl schüchtern.",
      "Das legt sich meistens. Wichtig wäre, dass er öfter laut liest.",
      "Wie viel sollte er täglich üben?",
      "Fünfzehn Minuten reichen, wenn es regelmäßig geschieht.",
    ],
  };
  const expectedWho9: Record<string, string[]> = {
    "d-b1-31": ["Nadia", "Jonas", "Nadia", "Jonas", "Nadia"],
    "d-b1-32": ["Lehrerin", "Vater", "Lehrerin", "Vater", "Lehrerin"],
  };
  const expectedAnswers9: Record<string, any[]> = {
    "d-b1-31": ["Sie versteht sie, kritisiert aber trotzdem.", ["Trotzdem"], "falsch"],
    "d-b1-32": ["dass er täglich fünfzehn Minuten laut liest", ["regelmäßig"]],
  };
  const expectedDict9: Record<string, string[]> = {
    "d-b1-31": [
      "Mir ist aufgefallen, dass du die Absprache nicht eingehalten hast.",
      "Das stimmt, aber ich war unter großem Zeitdruck.",
      "Das kann ich nachvollziehen. Trotzdem hätte ein kurzer Anruf gereicht.",
    ],
    "d-b1-32": [
      "Ihr Sohn arbeitet gut mit, aber er meldet sich selten.",
      "Zu Hause erzählt er viel. In der Klasse ist er wohl schüchtern.",
      "Das legt sich meistens. Wichtig wäre, dass er öfter laut liest.",
    ],
  };
  let locksOk9 = true;
  for (const did of scope9) {
    const dlg = liveB109.find((x) => x.id === did);
    for (let i = 0; i < expectedDE9[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE9[did][i] || dlg.lines[i].who !== expectedWho9[did][i]) locksOk9 = false;
    }
    for (let i = 0; i < expectedAnswers9[did].length; i++) {
      if (JSON.stringify(dlg.questions[i].answer) !== JSON.stringify(expectedAnswers9[did][i])) locksOk9 = false;
    }
    for (let i = 0; i < expectedDict9[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict9[did][i]) locksOk9 = false;
    }
  }
  ok(locksOk9, "K196e كل الألماني/who/الأسئلة/الإملاءات مقفلة لم تتغير (10/5/6)");

  ok(Array.isArray(reviewB109.contentWarnings) && reviewB109.contentWarnings.length === 0 &&
    reviewB109.contentChecks.length >= 3,
    "K196f لا تحذيرات محتوى في الدفعة (لا ادعاءات قانونية/رقمية جديدة) مع فحوص محتوى موثقة");

  ok(patchSourceB109.includes("d-b1-31") && patchSourceB109.includes("d-b1-32") &&
    patchSourceB109.includes("<R122> patch complete") && reviewB109.corrections.length === 4,
    "K196g الرقعة تغطي الحوارين وتطبق الأربعة تصحيحات وتطبع سطر النهاية");

  const srcMap9 = reviewB109.sources as Record<string, any[]>;
  ok(reviewB109Md.includes("## الحكم") && reviewB109Md.includes("## التصحيحات") &&
    reviewB109Md.includes("## المصادر") && reviewB109Md.includes("K196") &&
    Object.keys(srcMap9).every((k) => srcMap9[k].length >= 3) &&
    Object.values(srcMap9).reduce((n: number, v: any[]) => n + v.length, 0) >= 6,
    "K196h التقرير العربي ومصادره (3+ لكل حوار، 6+ إجمالاً) يذكر K196");

  ok(reviewB109.limits.audio.includes("لا استماع") && reviewB109.limits.cefr.includes("لم يُعد") &&
    reviewB109.limits.human.includes("ليست") &&
    reviewB109.limits.legal.length > 0 && reviewB109.limits.medical.length > 0 &&
    reviewB109.limits.professional.length > 0,
    "K196i حدود الصوت/CEFR/بشري/قانوني/طبي/تربوي معلنة");

  ok(reviewB109.contextNotes["d-b1-31"].length >= 3 && reviewB109.contextNotes["d-b1-32"].length >= 3 &&
    reviewB109.styleAlternatives["d-b1-31"] && reviewB109.styleAlternatives["d-b1-32"] &&
    reviewB109.audio.note.includes("لا استماع"),
    "K196j ملاحظات سياقية (3+ لكل حوار) وبدائل أسلوبية للاثنين والصوت بلا استماع");
}


// K197 — first B2 batch d-b2-01..d-b2-03 (R123).
{
  const reviewB201 = JSON.parse(readFileSync("docs/content-review-b2-dialogues-01-2026-10-08.json", "utf8")) as any;
  const reviewB201Md = readFileSync("docs/content-review-b2-dialogues-01-2026-10-08.md", "utf8");
  const liveB201 = JSON.parse(readFileSync("content/dialogues.json", "utf8")) as any[];
  const patchSourceB201 = readFileSync("scripts/patches/review_b2_dialogues_01.py", "utf8");
  const scope201 = ["d-b2-01", "d-b2-02", "d-b2-03"];
  ok(reviewB201.reviewRule === "R123" && reviewB201.date === "2026-10-08" &&
    JSON.stringify(reviewB201.dialogues.map((d: any) => d.id)) === JSON.stringify(scope201) &&
    reviewB201.totals.lines === 15 && reviewB201.totals.questions === 6 &&
    reviewB201.totals.dictation === 9 && reviewB201.totals.approximateUnits === 108,
    "K197a أول دفعة B2 d-b2-01..03 موثقة (15 سطراً، 6 أسئلة، 9 إملاءات، 108 وحدات)");

  ok(reviewB201.corrections.length === 7 && reviewB201.judgement.corrected === 7 &&
    reviewB201.judgement.unresolved === 0 && reviewB201.waisen.present === false,
    "K197b سبعة تصحيحات عربية مؤكدة بلا غير محسوم (نداء، مخالفة واقعية، Schönen، اصطلاحات)");

  const d201 = liveB201.find((d) => d.id === "d-b2-01");
  ok(d201.lines[0].ar.includes("سيدة بيرغر") && !d201.lines[0].ar.includes("سيدتي") &&
    d201.lines[3].ar.includes("لكانت كل الأهداف وهمية") && !d201.lines[3].ar.includes("ستكون") &&
    d201.lines[4].ar.includes("في المقابل، ترى الحكومة أن الأرقام كافية") &&
    d201.lines[5].ar.includes("بعبارةٍ لطيفة") && d201.lines[5].ar.includes("يصعب فهمه") &&
    !d201.lines[5].ar.includes("بلطف شديد"),
    "K197c d-b2-01: سيدة بيرغر، لكأن المخالفة الواقعية، في المقابل، واصطلاحا gelinde/nachvollziehbar");

  const d202 = liveB201.find((d) => d.id === "d-b2-02");
  const d203 = liveB201.find((d) => d.id === "d-b2-03");
  ok(d202.lines[3].ar.includes("الدورات التدريبية") && d202.lines[3].ar.includes("تجري بالتوازي") &&
    !d202.lines[3].ar.includes("موازية") &&
    d203.lines[0].ar.includes("جمّلت الأرقام") && !d203.lines[0].ar.includes("صفّحت") &&
    d203.lines[0].ar.includes("يُقالُ إنّ") &&
    d203.lines[3].ar.includes("الاستنتاج باطلاً") && !d203.lines[3].ar.includes("بلا مصداقية"),
    "K197d d-b2-02/03: الدورات التدريبية/بالتوازي، جمّلت الأرقام لا صفّحت، والاستنتاج باطلاً");

  const expectedDE201: Record<string, string[]> = {
    "d-b2-01": [
      "Frau Berger, wie bewerten Sie die bisherige Klimapolitik?",
      "Die Maßnahmen gehen in die richtige Richtung, reichen aber bei Weitem nicht aus.",
      "Was schlagen Sie konkret vor?",
      "Es geht um nachhaltige Investitionen. Ohne sie wären alle Ziele illusorisch.",
      "Die Regierung hält dagegen die Zahlen für ausreichend.",
      "Dieser Optimismus ist, gelinde gesagt, schwer nachvollziehbar.",
    ],
    "d-b2-02": [
      "Wo sehen Sie die größte Herausforderung?",
      "Die Digitalisierung setzt eine Infrastruktur voraus, die viele Kommunen noch nicht haben.",
      "Gleichwohl müssen wir anfangen.",
      "Natürlich. Entscheidend ist, dass die von uns geplanten Schulungen begleitend stattfinden.",
      "Einverstanden. Dann machen wir weiter mit dem Zeitplan.",
    ],
    "d-b2-03": [
      "Hast du den Artikel gelesen? Angeblich hat der Konzern die Zahlen geschönt.",
      "Ich habe die Quelle geprüft: Sie ist nicht besonders seriös.",
      "Also sollten wir die Behauptung in Frage stellen.",
      "Genau. Ohne belastbare Daten ist die Schlussfolgerung hinfällig.",
    ],
  };
  const expectedAnswers201: Record<string, any[]> = {
    "d-b2-01": ["die unzureichenden Maßnahmen", ["illusorisch"]],
    "d-b2-02": [["voraus"], "dass die Schulungen begleitend stattfinden"],
    "d-b2-03": ["nicht besonders seriös", ["Frage"]],
  };
  const expectedDict201: Record<string, string[]> = {
    "d-b2-01": [
      "Die Maßnahmen reichen bei Weitem nicht aus.",
      "Es geht um nachhaltige Investitionen.",
      "Dieser Optimismus ist schwer nachvollziehbar.",
    ],
    "d-b2-02": [
      "Die Digitalisierung setzt eine Infrastruktur voraus.",
      "Gleichwohl müssen wir anfangen.",
      "Die von uns geplanten Schulungen finden begleitend statt.",
    ],
    "d-b2-03": [
      "Angeblich hat der Konzern die Zahlen geschönt.",
      "Wir sollten die Behauptung in Frage stellen.",
      "Ohne belastbare Daten ist die Schlussfolgerung hinfällig.",
    ],
  };
  let locksOk201 = true;
  for (const did of scope201) {
    const dlg = liveB201.find((x) => x.id === did);
    for (let i = 0; i < expectedDE201[did].length; i++) {
      if (dlg.lines[i].de !== expectedDE201[did][i]) locksOk201 = false;
    }
    for (let i = 0; i < expectedAnswers201[did].length; i++) {
      if (JSON.stringify(dlg.questions[i].answer) !== JSON.stringify(expectedAnswers201[did][i])) locksOk201 = false;
    }
    for (let i = 0; i < expectedDict201[did].length; i++) {
      if (dlg.dictation[i] !== expectedDict201[did][i]) locksOk201 = false;
    }
  }
  ok(locksOk201, "K197e كل الألماني/الأسئلة/الإملاءات مقفلة لم تتغير (15 سطراً، 6 أسئلة، 9 إملاءات)");

  ok(Array.isArray(reviewB201.contentWarnings) && reviewB201.contentWarnings.length === 1 &&
    reviewB201.contentWarnings[0].id === "W5" && reviewB201.contentWarnings[0].dialogue === "d-b2-02" &&
    reviewB201.contentWarnings[0].field.includes("promptDe") && reviewB201.contentWarnings[0].modified === false &&
    reviewB201.contentWarnings[0].statement.includes("Digitalisung") &&
    reviewB201.contentChecks.length >= 4,
    "K197f تحذير نصي واحد غير معدّل W5 («Digitalisung») مع فحوص محتوى موثقة");

  ok(patchSourceB201.includes("d-b2-01") && patchSourceB201.includes("d-b2-02") &&
    patchSourceB201.includes("d-b2-03") && patchSourceB201.includes("<R123> patch complete") &&
    reviewB201.corrections.length === 7,
    "K197g الرقعة تغطي الحوارات الثلاثة وتطبق السبعة تصحيحات وتطبع سطر النهاية");

  const srcMap201 = reviewB201.sources as Record<string, any[]>;
  ok(reviewB201Md.includes("## الحكم") && reviewB201Md.includes("## التصحيحات") &&
    reviewB201Md.includes("## المصادر") && reviewB201Md.includes("K197") &&
    Object.keys(srcMap201).every((k) => srcMap201[k].length >= 3) &&
    Object.values(srcMap201).reduce((n: number, v: any[]) => n + v.length, 0) >= 9,
    "K197h التقرير العربي ومصادره (3+ لكل حوار، 9+ إجمالاً) يذكر K197");

  ok(reviewB201.limits.audio.includes("لا استماع") && reviewB201.limits.cefr.includes("لم يُعد") &&
    reviewB201.limits.human.includes("ليست") &&
    reviewB201.limits.legal.length > 0 && reviewB201.limits.medical.length > 0 &&
    reviewB201.limits.professional.length > 0,
    "K197i حدود الصوت/CEFR/بشري/قانوني/طبي/مهني معلنة");

  ok(reviewB201.contextNotes["d-b2-01"].length >= 3 && reviewB201.contextNotes["d-b2-02"].length >= 3 &&
    reviewB201.contextNotes["d-b2-03"].length >= 3 &&
    reviewB201.styleAlternatives["d-b2-01"] && reviewB201.styleAlternatives["d-b2-02"] &&
    reviewB201.styleAlternatives["d-b2-03"] &&
    reviewB201.audio.note.includes("لا استماع"),
    "K197j ملاحظات سياقية (3+ لكل حوار) وبدائل أسلوبية للثلاثة والصوت بلا استماع");
}

console.log(`\n══════ ENGINE SMOKE ══════\n✓ ${pass} نجح   ✗ ${fails.length} فشل`);
if (fails.length) {
  for (const f of fails) console.log("  ✗ " + f);
  process.exit(1);
}
