import type {
  DayPlan,
  DayTask,
  DayType,
  DebtItem,
  Exercise,
  Level,
  Phase,
  Progress,
  Satz,
  TaskResult,
  VocabCard,
} from "./types";
import { TOTAL_DAYS, emptyProgress, TEMPO_ZIELMIN } from "./types";
import type { Tempo } from "./types";
import {
  grammarMap,
  vocabMap,
  sentences,
  texts,
  dialogues,
  writingTasks,
  getSatz,
  getDeck,
  fehlerList,
} from "./content";
import { weakTopics } from "./fehler";
import { dueFehlerPriorisiert } from "./fehlerbank2";
import { PHASEN, ABSCHLUSS_VON, istPhasenPruefung, lastMinuten } from "./phasen";
import { kapselIds, kapselIdsAbend, kapselQuiz } from "./kapsel";
import { baueFalschFreundAufgabe } from "./falsche-freunde-aufgabe";
import { baueFvgAufgabe } from "./fvg-aufgabe";
import { baueKompositaWoche } from "./komposita-aufgabe";

/**
 * محرّك الخطة اليومية — قلب المشروع المنهجي
 * ------------------------------------------------
 * 378 يوماً بتوزيعٍ أكاديمي (lib/phasen.ts): A0 (1-10) · A1 (11-94) · A2 (95-178) · B1 (179-276) · B2 (277-374) · ختام (375-378)
 * الحمل اليومي تصاعدي بمعامل LERNLAST — المبتدئ أخفّ، وB2 أثقل وأطول.
 * الإيقاع الأسبوعي الثابت: 5 أيام تعلّم · يوم تثبيت · يوم فحص أسبوعي
 * كل شيء حتمي (seeded) — «اليوم 47» يظهر بنفس المهام دائماً (لا توهان).
 * التعويض: مهام غير مُنجَزة تُرحَّل إلزامية إلى أول الغد.
 */

// ── حتمية العشوائية (LCG ببذرة ثابتة لكل يوم) ─────────────────────────
export function rng(seed: number) {
  let s = Math.abs(Math.floor(seed)) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
/** خلط في المكان يُعيد المصفوفة (للاستخدام في buildQuiz بعد الالتقاط) */
function shuffleArr<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

// ── خرائط المناهج حسب المرحلة ─────────────────────────────────────────
const PHASE_RANGES: { phase: Phase; from: number; to: number; level: Level }[] = [
  { phase: "A0", from: PHASEN.A0.von, to: PHASEN.A0.bis, level: "A0" },
  { phase: "A1", from: PHASEN.A1.von, to: PHASEN.A1.bis, level: "A1" },
  { phase: "A2", from: PHASEN.A2.von, to: PHASEN.A2.bis, level: "A2" },
  { phase: "B1", from: PHASEN.B1.von, to: PHASEN.B1.bis, level: "B1" },
  { phase: "B2", from: PHASEN.B2.von, to: PHASEN.B2.bis, level: "B2" },
  { phase: "Abschluss", from: ABSCHLUSS_VON, to: TOTAL_DAYS, level: "B2" },
];

export const PHASE_TOPICS: Record<Phase, string[]> = {
  A0: ["a0-begrussung", "a0-buchstaben", "a0-zahlen", "a1-pronomen", "a1-sein-haben", "a1-praesens", "a1-zahlen"],
  A1: ["a1-praesens", "a1-pronomen", "a1-sein-haben", "a1-trennbar", "a1-weil-dass", "a1-war-hatte", "a1-zahlen", "a1-akkusativ", "a1-modalverben", "a1-dativ", "a1-wechsel", "a1-imperativ", "a1-perfekt-einf", "a1-futur-einf", "a1-plural", "a1-zeitpraep"],
  A2: ["a2-praeteritum-grund", "a2-praeteritum", "a2-perfekt", "a2-dativ", "a2-wechsel", "a2-konj2-hoflich", "a2-verb-praep", "a2-weil-dass", "a2-reflexiv", "a2-negation", "a2-steigerung", "a2-adjektiv-einfach", "a2-modal", "a2-imperativ", "a2-futur", "a2-verschmolzene", "a2-neben", "a2-demo"],
  B1: ["b1-konj2", "b1-passiv", "b1-genitiv", "b1-relativ", "b1-konj2-vergangenheit", "b1-konnektoren", "b1-plusquamperfekt", "b1-wortbildung", "b1-verb-praeposition", "b1-partizip1", "b1-indirekte-fragen", "b1-unbestimmte", "b1-funktionsverben", "b1-absicht", "b1-adjektivendungen"],
  B2: ["b2-indirekte-rede", "b2-bedingung", "b2-funktionsverben", "b2-partizip", "b2-adjektiv-partizip", "b2-infinitiv", "b2-doppelkonnektoren", "b2-modalpartikel", "b2-futur-ii", "b2-relativ-generalisierend", "b2-nominalstil", "b2-redew", "b2-textkonnektoren"],
  Abschluss: [],
};

const PHASE_DECKS: Record<Phase, string[]> = {
  A0: ["a1-start"],
  A1: ["a1-start", "a1-familie-alltag", "a1-zeit-zahlen", "a1-essen-trinken", "a1-koerper-kleidung", "a1-stadt-wege", "a1-haus-schule", "a1-natur-freizeit", "a1-welt-beruf", "a1-modal-ort", "a1-menschen-abschluss"],
  A2: ["a2-komplett", "a2-arbeit-buero", "a2-alltag-dienste", "a2-leben-technik", "a2-schreiben-dienste", "a2-mensch-beziehung", "a2-reise-feste", "a2-medien-bildung", "a2-geld-gesundheit", "a2-wohnen-vertrag", "a2-arbeit-umwelt", "a2-kueche-haushalt", "a2-erzaehlen-zeit", "a2-redemittel", "a2-kultur-digital", "a2-b1-bruecke"],
  B1: ["b1-gesellschaft", "b1-staat-argument", "b1-karriere-psyche", "b1-gesundheit-technik", "b1-projekt-rede", "b1-stadt-recht", "b1-funktionsverben", "b1-bildung-migration-familie", "b1-dienst-natur-bild", "b1-brief-wirtschaft", "b1-wissen-zeit-wendungen", "b1-essen-kunst-hoeflichkeit", "b1-gesund-wohnen-praep", "b1-job-auto-praefix", "b1-geld-gemeinschaft-adj", "b1-digital-kauf-nomen", "b1-pruefung-text-reflexiv", "b1-klima-sport-komposita", "b1-medien-reise-verben", "b1-verwaltung-handwerk", "b1-arbeit-familie-geld", "a2-b1-bruecke"],
  B2: ["b2-medien-schule", "g01-beziehungen", "g02-gesundheit", "g03-gesellschaft", "g04-wohnen", "g05-digital", "g06-wissenschaft", "g07-schoenheit", "g08-kunst-kultur", "h01-arbeit-beruf", "h02-umwelt-klima", "h03-konsum-geld", "h04-mobilitaet-verkehr", "h05-staat-recht", "h06-studium-lernen", "h07-gefuehle-psyche", "h08-sport-freizeit", "i01-medien-meinung", "i02-bildung-politik", "i03-sozialstaat-ehrenamt", "i04-energie-wende", "i05-ernaehrung-verbraucherschutz", "i06-stadtentwicklung", "i07-migration-integration", "i08-erinnerungskultur"],
  Abschluss: [],
};


/* ═══ الوحداتُ الستَّ عشرة: أربعٌ لكلِّ مستوى، بأسمائِها ومداها اليوميِّ ═══
   مأخوذةٌ حرفياً من مخطَّطِ المنهجِ الذي اشترطَهُ المالك؛ كلُّ يومٍ يقعُ في وحدةٍ واحدةٍ لا غير. */
export type Modul = {
  nr: 1 | 2 | 3 | 4; level: Level; von: number; bis: number;
  titelDe: string; titelAr: string; inhalteAr: string;
};
export const MODULE: Modul[] = [
  // ── A0: 10 Tage ──
  { nr: 1, level: "A0", von: 1,  bis: 10,  titelDe: "Einstieg & Alphabet",       titelAr: "الأبجدية والأصوات",    inhalteAr: "الأبجدية · ä/ö/ü/ß · الأصوات · التحيات · الضمائر · sein · الأرقام حتى 100 · أدوات التعريف" },
  // ── A1: 12 Wochen / 84 Tage ──
  { nr: 1, level: "A1", von: 11, bis: 31,  titelDe: "Lektion 1–2: Begrüßung & Zahlen",  titelAr: "التعارف والأرقام",      inhalteAr: "التحيات · sein/haben · تصريف منتظم · ضمائر · أرقام 0-100 · Ja/nein/W-Fragen" },
  { nr: 2, level: "A1", von: 32, bis: 52,  titelDe: "Lektion 3–4: Familie & Gegenstände", titelAr: "العائلة والأشياء",      inhalteAr: "العائلة · أدوات الملكية · أفعال شاذة · der/die/das/kein · ألوان · صفات" },
  { nr: 3, level: "A1", von: 53, bis: 73,  titelDe: "Lektion 5–6: Zeit & Essen",        titelAr: "الوقت والطعام",        inhalteAr: "الساعة · أفعال منفصلة · جر الوقت · المأكولات · Akkusativ · möchten" },
  { nr: 4, level: "A1", von: 74, bis: 94,  titelDe: "Lektion 7–8: Hobbys & Wohnen",     titelAr: "الهوايات والسكن",      inhalteAr: "الهوايات · können · الطقس · الشقة · Dativ أساسي · Wechselpräpositionen · Modalverben · مقدمة Perfekt/Futur · Imperativ" },
  // ── A2: 12 Wochen / 84 Tage ──
  { nr: 1, level: "A2", von: 95,  bis: 115, titelDe: "Lektion 9–10: Vergangenheit & Orientierung", titelAr: "الماضي والتوجّه",  inhalteAr: "Perfekt كامل · Präteritum للناقصة · Dativ كامل · وصف الطريق · المواصلات" },
  { nr: 2, level: "A2", von: 116, bis: 136, titelDe: "Lektion 11–12: Gesundheit & Kleidung", titelAr: "الصحة والملابس",       inhalteAr: "الطبيب · أفعال انعكاسية · تبديل الجر · صيغة الأمر (تثبيت) · المقارنة · الملابس والألوان" },
  { nr: 3, level: "A2", von: 137, bis: 157, titelDe: "Lektion 13–14: Reisen & Briefe", titelAr: "السفر والمراسلات",         inhalteAr: "السفر والفنادق · Präteritum · الجمل التابعة weil/dass/wenn/als · الرسائل والدعوات · الروابط البسيطة" },
  { nr: 4, level: "A2", von: 158, bis: 178, titelDe: "Lektion 15–16: Gefühle & Beruf", titelAr: "المشاعر والعمل",         inhalteAr: "الأفعال الانعكاسية · deshalb/trotzdem · العمل المكتبي · الهوايات · مقدمة Passiv · مقدمة Genitiv · مراجعة" },
  // ── B1: 14 Wochen / 98 Tage ──
  { nr: 1, level: "B1", von: 179, bis: 203, titelDe: "Lektion 17–18: Beziehungen & Ausbildung", titelAr: "العلاقات والتعليم",  inhalteAr: "الصداقات والنزاعات · Relativsätze · obwohl/trotzdem · السيرة الذاتية · Präteritum كامل · تصريف الصفات" },
  { nr: 2, level: "B1", von: 204, bis: 228, titelDe: "Lektion 19–20: Bewerbung & Umwelt", titelAr: "البحث عن عمل والبيئة",   inhalteAr: "Konjunktiv II حاضر · um…zu/damit · Passiv بكل الأزمنة · أفعال بحروف جر · البيئة والطبيعة" },
  { nr: 3, level: "B1", von: 229, bis: 252, titelDe: "Lektion 21–22: Konsum & Gesundheit", titelAr: "الاستهلاك والصحة",      inhalteAr: "Genitiv كامل · Futur I · Infinitiv mit zu · الصحة النفسية واللياقة · Nominalisierung أساسي" },
  { nr: 4, level: "B1", von: 253, bis: 276, titelDe: "Lektion 23–24: Politik & Zukunft", titelAr: "السياسة والمستقبل",      inhalteAr: "الروابط الزمنية · صفات كأسماء · Konjunktiv II ماضي (مقدمة) · الأسئلة غير المباشرة · Partizip I · أحلام ومستقبل · مراجعة B1" },
  // ── B2: 14 Wochen / 98 Tage ──
  { nr: 1, level: "B2", von: 277, bis: 301, titelDe: "Lektion 25–26: Globalisierung & Arbeitswelt", titelAr: "العولمة وسوق العمل", inhalteAr: "الروابط المزدوجة · Funktionsverbgefüge · بدائل Passiv · الشركات الناشئة · الذكاء الاصطناعي · اندماج حروف جر" },
  { nr: 2, level: "B2", von: 302, bis: 326, titelDe: "Lektion 27–28: Hochschule & Medien", titelAr: "الجامعة والإعلام",       inhalteAr: "الجامعة والبحث · Konjunktiv I (كلام غير مباشر) · Partizipattribute مطوّلة · الصحافة ووسائل التواصل · حرية الصحافة" },
  { nr: 3, level: "B2", von: 327, bis: 350, titelDe: "Lektion 29–30: Medizin & Recht", titelAr: "الطب والقانون",            inhalteAr: "الطب الحديث · Modalverben ذاتية متقدمة · القانون · الجريمة · Konjunktiv II ماضي كامل · شرط ohne wenn" },
  { nr: 4, level: "B2", von: 351, bis: 374, titelDe: "Lektion 31–32: Kunst & Nachhaltigkeit", titelAr: "الفنون والاستدامة",  inhalteAr: "الفن والأدب والعمارة · سوابق/لواحق · الاستدامة والطاقة · Nominalstil ↔ Verbalstil · Redewendungen/Kollokationen · مراجعة B2" },
];


/** الوحدةُ التي يقعُ فيها اليوم، ورقمُ خطوتِه داخلَها. */
export function modulOf(day: number): { modul: Modul; schritt: number; schritte: number; etikett: string } {
  const d = Math.min(Math.max(day, 1), TOTAL_DAYS);
  const modul = MODULE.find((m) => d >= m.von && d <= m.bis) ?? MODULE[MODULE.length - 1];
  const schritt = d - modul.von + 1;
  const schritte = modul.bis - modul.von + 1;
  return { modul, schritt, schritte, etikett: `المستوى ${modul.level} — الوحدة ${modul.nr} — الخطوة ${schritt}` };
}

export function phaseOf(day: number): Phase {
  for (const p of PHASE_RANGES) if (day >= p.from && day <= p.to) return p.phase;
  return "Abschluss";
}
export function levelOf(day: number): Level {
  for (const p of PHASE_RANGES) if (day >= p.from && day <= p.to) return p.level;
  return "B2";
}
export function dayType(day: number): DayType {
  if (day >= ABSCHLUSS_VON) return "abschluss";
  const wd = ((day - 1) % 7) + 1; // 1..7
  if (wd <= 5) return "lerntag";
  if (wd === 6) return "festigung";
  return "wochencheck";
}

// ── بناء تمارين تلقائية من المخزون اللغوي ────────────────────────────
export function clozeFromSatz(s: Satz, idx: number, rand: () => number): Exercise {
  const words = s.de.split(/\s+/);
  const candidates = words
    .map((w, i) => ({ w, i }))
    .filter(({ w }) => w.replace(/[.,!?;:]/g, "").length > 3);
  const chosen = candidates.length
    ? candidates[Math.floor(rand() * candidates.length)]
    : { w: words[Math.min(1, words.length - 1)], i: Math.min(1, words.length - 1) };
  const answer = chosen.w.replace(/[.,!?;:]/g, "");
  const masked = words.map((w, i) => (i === chosen.i ? "_____" : w)).join(" ");
  return {
    id: `${s.id}-cz${idx}`,
    type: "fill",
    promptDe: masked,
    promptAr: s.ar,
    answer: [answer, answer.toLowerCase()],
    explanationAr: `الجملة كاملة: ${s.ar}`,
    explanationDe: s.de,
  };
}

function dictationFromSatz(s: Satz, idx: number): Exercise {
  return {
    id: `${s.id}-di${idx}`,
    type: "dictation",
    promptDe: "اسمع واكتب ما سمعته",
    promptAr: s.ar,
    answer: [s.de],
    explanationDe: s.de,
  };
}

export function translateFromSatz(s: Satz, idx: number): Exercise {
  const keyWords = s.de
    .split(/\s+/)
    .map((w) => w.replace(/[.,!?;:„“"']/g, "").toLowerCase())
    .filter((w) => w.length > 3);
  return {
    id: `${s.id}-tr${idx}`,
    type: "translate",
    promptDe: "Übersetze ins Deutsche:",
    promptAr: s.ar,
    answer: [s.de],
    keywords: pickN(keyWords, Math.min(4, keyWords.length), rng(idx * 31 + 7)),
    explanationDe: s.de,
    explanationAr: "الترجمة المرجعية بالأعلى — قارن كلماتك المفتاحية.",
  };
}

function mcFromCards(cards: VocabCard[], idx: number, rand: () => number): Exercise {
  const correct = cards[0];
  const distractors = pickN(cards.slice(1), 3, rand);
  const options = pickN(
    [correct.ar, ...distractors.map((d) => d.ar)],
    4,
    rand
  );
  return {
    id: `${correct.id}-mc${idx}`,
    type: "mc",
    promptDe: `Was bedeutet: „${correct.de}“?`,
    options,
    answer: correct.ar,
    explanationAr: correct.exampleDe
      ? `${correct.ar} — مثال: ${correct.exampleDe}`
      : correct.ar,
  };
}

/**
 * بناء فحص من المخزون الذي تمت دراسته حتى اليوم فقط (لا مستقبل، لا مفاجآت).
 * في اليوم 0 / الأسبوع 0 لا يوجد «ماضٍ» يُسترجَع ⇐ مصفوفة فارغة (يُعالَج المتعلِّمُ بلافتة ترحيب).
 */
function buildQuiz(day: number, phase: Phase, count: number): Exercise[] {
  // لا شيء يُسبق اليوم الأول ⇐ فحص الاسترجاع الأول فارغ (مرحباً وتهيئة لا اختبار)
  if (day < 1) return [];
  const rand = rng(day * 977 + 13);
  const level = levelOf(day);
  const week = Math.ceil(day / 7);
  const phaseTopics = PHASE_TOPICS[phase];
  const phaseDecks = PHASE_DECKS[phase];
  const pool: Exercise[] = [];

  // قواعد المرحلة حتى الأسبوع الحالي فقط (لا قواعد لم تُعرض بعد)
  const gelehrteThemen = new Set<string>();
  for (let w = 1; w <= week; w++) {
    gelehrteThemen.add(phaseTopics[((w - 1) * 2) % Math.max(phaseTopics.length, 1)]);
    gelehrteThemen.add(phaseTopics[((w - 1) * 2 + 1) % Math.max(phaseTopics.length, 1)]);
  }
  for (const tid of phaseTopics) {
    if (!gelehrteThemen.has(tid)) continue;
    const topic = grammarMap[tid];
    if (topic) pool.push(...topic.exercises);
  }

  // جمل المستويات الأدنى مضمونة التدريس (كلها مَرت على الطالب سابقاً).
  // في نفس المستوى لا نسحب الجمل قبل أسبوعين من انطلاق المرحلة: في الأسبوع 1 لا نزال في
  // التهيئة، فكل جملةٍ من المستوى الحالي هي «درس مستقبلي» لم يُشرح بعد.
  const phaseStart = PHASE_RANGES.find((p) => p.phase === phase)?.from ?? 1;
  const wocheInPhase = Math.max(0, Math.ceil((day - phaseStart + 1) / 7));
  const satzPool = sentences.filter((s) => {
    if (s.level < level) return true; // مستوى أدنى = أُنجز كاملاً
    if (s.level !== level) return false; // مستوى أعلى = ممنوع
    // في أول أسبوعين من المرحلة: لا جمل من نفس المستوى في الاسترجاع
    if (wocheInPhase < 2) return false;
    return true;
  });
  // K-40free: نسبة أسئلة الاستدعاء الحر (fill/translate/dictation/order) تتصاعد حسب المستوى لمنع وَهْم الإتقان.
  // A0/A1: 40% free · A2: 50% · B1: 55% · B2: 60%
  const freeRatioByLv: Record<string, number> = { A0: 0.4, A1: 0.4, A2: 0.5, B1: 0.55, B2: 0.6 };
  const freeTarget = freeRatioByLv[level] ?? 0.5;
  const clozes = satzPool.map((s, i) => clozeFromSatz(s, i, rand));
  const translates = satzPool.map((s, i) => translateFromSatz(s, i));
  const freePool = shuffleArr([...clozes, ...translates], rand);
  const mcPool = shuffleArr([...pool], rand);

  const nFree = Math.max(1, Math.round(count * freeTarget));
  const nMc = Math.max(0, count - nFree);
  const picked: Exercise[] = [];
  for (let i = 0; i < nFree && freePool.length > 0; i++) {
    const idx = Math.floor(rand() * freePool.length);
    picked.push(freePool.splice(idx, 1)[0]);
  }
  for (let i = 0; i < nMc && mcPool.length > 0; i++) {
    const idx = Math.floor(rand() * mcPool.length);
    picked.push(mcPool.splice(idx, 1)[0]);
  }
  shuffleArr(picked, rand);

  // تكميل ببطاقات المفردات من الدِّكك المُدرَّسة فقط — نخلط بين MC وfill لحفظ النسبة
  if (picked.length < count) {
    const cards: VocabCard[] = [];
    const deckSet = new Set<string>();
    for (let w = 1; w <= week; w++) {
      deckSet.add(phaseDecks[((w - 1) * 2) % Math.max(phaseDecks.length, 1)]);
      deckSet.add(phaseDecks[((w - 1) * 2 + 1) % Math.max(phaseDecks.length, 1)]);
    }
    for (const dk of Array.from(deckSet)) {
      cards.push(...(getDeck(dk)?.cards ?? []));
    }
    let need = count - picked.length;
    const shuffled = pickN(cards, cards.length, rand);
    for (let i = 0; i < shuffled.length && need > 0; i++) {
      const c = shuffled[i];
      const asFree = picked.filter((x) => x.type !== "mc").length;
      const targetFree = Math.round(count * freeTarget);
      const useFree = asFree < targetFree;
      if (useFree) {
        picked.push({
          id: `${c.id}-fr${i}`,
          type: "translate",
          promptDe: "Schreibe das deutsche Wort:",
          promptAr: `${c.ar}`,
          answer: [c.article ? `${c.article} ${c.de}` : c.de, c.de],
          explanationAr: c.exampleDe ? `${c.ar} — مثال: ${c.exampleDe}` : c.ar,
        });
      } else {
        picked.push(mcFromCards([c, ...shuffled.filter((x) => x.id !== c.id)], i, rand));
      }
      need--;
    }
  }
  return picked.slice(0, count).map((ex, i) => ({ ...ex, id: `q${day}-${i}-${ex.id}` }));
}

/** 🎯 تحققات الاستقلال المستحقة: دروسٌ أُنجِز تدريبُها وحلَّ يومُها (الأقدم أولاً) */
export function dueVerify(progress: Progress, day: number): { lessonId: string; dueDay: number }[] {
  return Object.entries(progress.verify ?? {})
    .filter(([, v]) => v.dueDay <= day && v.doneDay === undefined)
    .map(([lessonId, v]) => ({ lessonId, dueDay: v.dueDay }))
    .filter((v) => (grammarMap[v.lessonId]?.verify ?? []).length > 0)
    .sort((a, b) => a.dueDay - b.dueDay);
}

// ── مولّد اليوم ─────────────────────────────────────────────────────────
export function buildDay(day: number, progress: Progress): DayPlan {
  const week = Math.ceil(day / 7);
  const weekday = ((day - 1) % 7) + 1;
  const phase = phaseOf(day);
  const type = dayType(day);
  const rand = rng(day * 7919);
  const tasks: DayTask[] = [];

  // (1) التعويضات الإلزامية أولاً — «ما لم يُنجز أمس يُنجز اليوم»
  progress.plan.debt.forEach((d, i) => {
    tasks.push({
      id: `${day}:debt:${i}`,
      kind: d.kind,
      titleDe: `Nachholen: ${d.titleDe}`,
      titleAr: `تعويض من اليوم ${d.from}: ${d.titleAr}`,
      minutes: 15,
      topicId: d.topicId,
      deckId: d.deckId,
      textId: d.textId,
      dialogueId: d.dialogueId,
      writeId: d.writeId,
      sentenceIds: d.sentenceIds,
      exam: d.exam,
      mandatory: true,
      from: d.from,
    });
  });

  // (1b) تحققات الاستقلال المستحقة — مهام جديدة لا إعادة (≤2 في اليوم، والباقي يبقى في الطابور)
  dueVerify(progress, day)
    .slice(0, 2)
    .forEach((v) => {
      const t = grammarMap[v.lessonId];
      tasks.push({
        id: `${day}:vrfy:${v.lessonId}`,
        kind: "check",
        titleDe: `Unabhängigkeits-Check: ${t?.titleDe ?? v.lessonId}`,
        titleAr: `تحقق الاستقلال: ${t?.titleAr ?? v.lessonId} — مهمة جديدة لا إعادة`,
        minutes: 10,
        quiz: (t?.verify ?? []).slice(0, 3),
        mandatory: true,
        from: v.dueDay,
        verifyFor: v.lessonId,
      });
    });

  const tid = (n: number) => `${day}:t${n}`;
  const phaseTopics = PHASE_TOPICS[phase];
  const weekTopicA = phaseTopics[((week - 1) * 2) % Math.max(phaseTopics.length, 1)];
  const weekTopicB = phaseTopics[((week - 1) * 2 + 1) % Math.max(phaseTopics.length, 1)];
  const phaseDecks = PHASE_DECKS[phase];
  const phaseDeckA = phaseDecks[((week - 1) * 2) % Math.max(phaseDecks.length, 1)];
  const phaseDeckB = phaseDecks[((week - 1) * 2 + 1) % Math.max(phaseDecks.length, 1)];
  const level = levelOf(day);

  const textsOfLevel = texts.filter((t) => t.level === level);
  const dialogsOfLevel = dialogues.filter((d) => d.level === level);
  // 📚 نسبة النسخة الطويلة/الأصلية (Langfassung): 30% عند بداية B1 → 80% عند نهاية B2.
  // في المستويات قبل B1 نظلُّ على النسخة الطويلة (حيث وُجدت) لأن المتعلم يحتاج الدعم الكامل.
  // النسبة تُطبَّق بعد اختيار النص (round-robin على كل النصوص لضمان تغطية كاملة)،
  // والعلم يُمرَّر عبر `__weg_useShort` لاحقاً في leseText/العرض.
  const b1Start = PHASE_RANGES.find((p) => p.level === "B1")?.from ?? 189;
  const b2End = PHASE_RANGES.find((p) => p.level === "B2")?.to ?? 378;
  const langAnteil = day < b1Start
    ? 1.0
    : Math.min(0.8, 0.3 + ((day - b1Start) / Math.max(b2End - b1Start, 1)) * 0.5);
  // 🔁 دورانٌ حتميٌّ بدلَ القرعة: كلُّ نصٍّ وكلُّ حوارٍ من المستوى يصلُ المتعلِّمَ
  // (القرعةُ القديمةُ تركت 20 نصاً و20 حواراً بلا موعدٍ في 378 يوماً)
  // خاناتُ النصِّ/الحوارِ لكلِّ يومِ أسبوع (حدٌّ أعلى) → رتبةُ اليومِ داخلَ مستواه = مجموعُ خاناتِ الأيامِ السابقة
  const TEXT_SLOTS = [1, 0, 0, 1, 0, 0, 2], DIALOG_SLOTS = level === "A1" ? [1, 1, 1, 1, 1, 0, 0] : level === "A2" ? [0, 1, 1, 1, 1, 0, 0] : [0, 1, 1, 0, 1, 0, 0];
  const levelStart = PHASE_RANGES.find((p) => p.level === level)?.from ?? 1;
  const rangVor = (slots: number[]) => { let n = 0; for (let d = levelStart; d < day; d++) n += slots[(d - 1) % 7]; return n; };
  const textRang = rangVor(TEXT_SLOTS), dialogRang = rangVor(DIALOG_SLOTS);
  let textSlot = 0, dialogSlot = 0;
  const nextText = () => {
    if (!textsOfLevel.length) return undefined;
    const cand = textsOfLevel[(textRang + textSlot) % textsOfLevel.length];
    const slot = textRang + textSlot;
    const bias = (((day * 2654435761 + slot * 1013904223) >>> 0) % 1000) / 1000;
    // إن كان للنص نسختان، نختار أيهما نخدمها بنسبة langAnteil.
    // قبل B1 langAnteil=1.0 فيُستخدم دائماً النسخة الطويلة (الداعمة).
    const useShort = !!cand.lang && bias >= langAnteil;
    textSlot++;
    return useShort ? { ...cand, __weg_useShort: true } as typeof cand : cand;
  };
  const nextDialog = () => dialogsOfLevel.length ? dialogsOfLevel[(dialogRang + dialogSlot++) % dialogsOfLevel.length] : undefined;
  const writesOfLevel = writingTasks.filter((w) => w.level === level);
  const satzOfLevel = sentences.filter((s) => s.level === level);

  if (type === "lerntag") {
    if (day === 1) {
      // 🚪 اليوم الأول: لا «أمس» يُسترجَع — بطاقة ترحيب وتهيئة صوتية/هجائية بلا اختبار
      tasks.push({
        id: tid(1),
        kind: "wiederholen",
        titleDe: "Willkommen & Buchstabieren",
        titleAr: "ترحيب وتهيئة وتعلُّم الأبجدية الألمانية",
        minutes: 10,
        deckId: phaseDeckA,
        // لا جملَ قبل الدرس — لا كبسولة، لا اختبار، لا ترجمة قبل التعليم.
        sentenceIds: [],
        quiz: [],
      });
    } else {
      // استرجاع يومي ثابت
      tasks.push({
        id: tid(1),
        kind: "wiederholen",
        titleDe: "Wiederholung & Abruf",
        titleAr: "استرجاع واستذكار (مزيج 1/7/30 يومًا)",
        minutes: 15,
        // حزمةُ اليومِ في الاسترجاع: دورانٌ يوميٌّ يضمنُ أن تصلَ كلُّ حزمةٍ عينَ المتعلِّمِ
        // ولو زادَ عددُ الحزمِ على خاناتِ درسِ المفرداتِ الأسبوعية
        deckId: phaseDecks[(day - 1) % Math.max(phaseDecks.length, 1)],
        // 🌙 حلقة الكبسولة: مزيج التباعد المكاني 1/7/30 يومًا (lib/kapsel.ts)
        sentenceIds: kapselIds(day),
        quiz: kapselQuiz(day),
      });
    }

    if (weekday === 1 || weekday === 3) {
      // يوم القواعد الجديد
      const topicId = weekday === 1 ? weekTopicA : weekTopicB;
      tasks.push({
        id: tid(2),
        kind: "grammatik",
        titleDe: grammarMap[topicId]?.titleDe ?? "Grammatik",
        titleAr: `قاعدة جديدة: ${grammarMap[topicId]?.titleAr ?? ""}`,
        minutes: 30,
        topicId,
      });
      tasks.push({
        id: tid(3),
        kind: "wortschatz",
        titleDe: "Neue Wörter",
        titleAr: "مفردات جديدة + تثبيت",
        minutes: 25,
        deckId: weekday === 1 ? phaseDeckA : phaseDeckB,
        sentenceIds: pickN(satzOfLevel, 3, rand).map((s) => s.id),
      });
      if (weekday === 1) {
        tasks.push({
          id: tid(4),
          kind: "lesen",
          titleDe: "Lesetraining",
          titleAr: "قراءة موجّهة",
          minutes: level === "B2" ? 25 : level === "B1" ? 32 : 35,
          textId: nextText()?.id,
        });
        // A1: مرحلةٌ من ستّةِ أسابيعَ لـ29 حواراً — خانةُ استماعٍ قصيرةٌ ثانيةٌ يومَ الاثنين (K69i: كلُّ حوارٍ يُجدوَل)
        if (level === "A1") {
          tasks.push({
            id: tid(7),
            kind: "hoeren",
            titleDe: "Kurzes Hörtraining",
            titleAr: "استماع قصير (حوار من مفردات الأسبوع)",
            minutes: 10,
            dialogueId: nextDialog()?.id,
          });
        }
      } else {
        tasks.push({
          id: tid(4),
          kind: "hoeren",
          titleDe: "Hörtraining (TTS)",
          titleAr: "تسميع واستماع (نطق المتصفح)",
          minutes: level === "B2" ? 25 : level === "B1" ? 32 : 35,
          dialogueId: nextDialog()?.id,
        });
      }
      if (level === "B2" || level === "B1") {
        tasks.push({
          id: tid(12),
          kind: "sprechen",
          titleDe: "Mikro-Produktion",
          titleAr: "جملةٌ شفوية: طبّق القاعدة الجديدة شفوياً قبل الفحص",
          minutes: level === "B2" ? 15 : 10,
          sentenceIds: pickN(satzOfLevel, 2, rand).map((s) => s.id),
        });
      }
      // فخ «صديق كاذب» أسبوعي (K-FalscheFreunde): تدريب قصير على التداخل اللغوي
      if (level !== "A0") {
        const ff = baueFalschFreundAufgabe(day, level);
        if (ff) {
          tasks.push({
            id: tid(8),
            kind: "check",
            titleDe: "Falsche-Freunde-Falle",
            titleAr: "فخّ: صديق كاذب",
            minutes: 5,
            quiz: [{
              id: ff.id,
              type: ff.type,
              promptDe: ff.promptDe,
              promptAr: ff.promptAr,
              options: ff.options,
              answer: ff.options[ff.answer],
              explanationAr: ff.explanationAr,
            } as unknown as Exercise],
          });
        }
      }
      tasks.push({
        id: tid(5),
        kind: "check",
        titleDe: "Tagescheck",
        titleAr: "فحص اليوم (عتبة النجاح 80%)",
        minutes: 15,
        quiz: buildQuiz(day, phase, 8),
      });
    } else if (weekday === 2 || weekday === 4) {
      // تعميق قواعد الأسبوع
      const topicId = weekday === 2 ? weekTopicA : weekTopicB;
      tasks.push({
        id: tid(2),
        kind: "grammatik",
        titleDe: `Vertiefung: ${grammarMap[topicId]?.titleDe ?? ""}`,
        titleAr: `تعميق القاعدة: ${grammarMap[topicId]?.titleAr ?? ""}`,
        minutes: 30,
        topicId,
      });
      if (weekday === 2) {
        tasks.push({
          id: tid(3),
          kind: "hoeren",
          titleDe: "Hörtraining (TTS)",
          titleAr: "تسميع واستماع",
          minutes: 35,
          dialogueId: nextDialog()?.id,
        });
        tasks.push({
          id: tid(4),
          kind: "schreiben",
          titleDe: "Kurz schreiben",
          titleAr: "كتابة قصيرة (10 دقائق)",
          minutes: 25,
          writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
        });
      } else {
        tasks.push({
          id: tid(3),
          kind: "lesen",
          titleDe: "Lesetraining",
          titleAr: "قراءة موجّهة",
          minutes: 35,
          textId: nextText()?.id,
        });
        // A1/A2: حواراتُ الموجةِ الرابعةِ رفعت البنكَ إلى 29 لكلِّ مستوى — خانةُ استماعٍ إضافيّةٌ قصيرةٌ كي يُجدوَلَ كلُّ حوارٍ مرةً على الأقلّ (K69i)
        if (level === "A1" || level === "A2") {
          tasks.push({
            id: tid(6),
            kind: "hoeren",
            titleDe: "Kurzes Hörtraining",
            titleAr: "استماع قصير (حوار من مفردات الأسبوع)",
            minutes: 20,
            dialogueId: nextDialog()?.id,
          });
        }
        tasks.push({
          id: tid(4),
          kind: "sprechen",
          titleDe: "Sprechtraining",
          titleAr: "تحدّث وتكرار (Shadowing)",
          minutes: 25,
          sentenceIds: pickN(satzOfLevel, 4, rand).map((s) => s.id),
        });
      }
      tasks.push({
        id: tid(5),
        kind: "check",
        titleDe: "Tagescheck",
        titleAr: "فحص اليوم (عتبة النجاح 80%)",
        minutes: 15,
        quiz: buildQuiz(day, phase, 8),
      });
    } else {
      // يوم 5 — دمج وبناء الجملة
      tasks.push({
        id: tid(2),
        kind: "wortschatz",
        titleDe: "Satzbau & Wortschatz",
        titleAr: "بناء الجملة والمفردات (دمج)",
        minutes: level === "B2" ? 35 : 35,
        deckId: phaseDeckA,
        sentenceIds: pickN(satzOfLevel, 5, rand).map((s) => s.id),
      });
      tasks.push({
        id: tid(3),
        kind: "schreiben",
        titleDe: "Schreibtraining",
        titleAr: "تدريب كتابة",
        minutes: level === "B2" ? 40 : 35,
        writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
      });
      tasks.push({
        id: tid(4),
        kind: "hoeren",
        titleDe: "Hörtraining (TTS)",
        titleAr: "تسميع واستماع",
        minutes: level === "B2" ? 20 : 25,
        dialogueId: nextDialog()?.id,
      });
      if (level === "B2" || level === "B1") {
        tasks.push({
          id: tid(12),
          kind: "sprechen",
          titleDe: "Mikro-Produktion",
          titleAr: "جملتان شفويتان (10 دقائق): لخّص فقرةً من تدريب الكتابة",
          minutes: 10,
          sentenceIds: pickN(satzOfLevel, 3, rand).map((s) => s.id),
        });
      }
      tasks.push({
        id: tid(5),
        kind: "check",
        titleDe: "Tagescheck",
        titleAr: "فحص اليوم (عتبة النجاح 80%)",
        minutes: 15,
        quiz: buildQuiz(day, phase, 10),
      });
    }
  } else if (type === "festigung") {
    tasks.push({
      id: tid(1),
      kind: "wiederholen",
      titleDe: "Wochen-Wiederholung",
      titleAr: "مراجعة الأسبوع كاملاً (كبسولة متباعدة)",
      minutes: 30,
      sentenceIds: kapselIds(day), // 🌙 كبسولة متباعدة 1/7/30
      quiz: [...kapselQuiz(day), ...buildQuiz(day - 2, phase, 5)],
    });
    tasks.push({
      id: tid(2),
      kind: "schreiben",
      titleDe: "Langer Text",
      titleAr: level === "A0" || level === "A1"
        ? "كتابة جمل بسيطة (تعبير موجّه)"
        : "كتابة نصّ كامل (المعيار: معايير التقييم)",
      minutes: level === "A0" ? 15 : 40,
      writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
    });
    // K-SilentPeriod: لا تحدّث حر قبل أواخر A2
    if (level === "B1" || level === "B2" || day >= PHASEN.A2.bis - 7) {
      tasks.push({
        id: tid(3),
        kind: "sprechen",
        titleDe: "Freies Sprechen",
        titleAr: "تحدّث حرّ (سجّل نفسك)",
        minutes: 20,
        sentenceIds: pickN(satzOfLevel, 4, rand).map((s) => s.id),
      });
    } else {
      tasks.push({
        id: tid(3),
        kind: "aussprache",
        titleDe: "Aussprache & Shadowing",
        titleAr: "نطظ وترديد (فترة الصمت)",
        minutes: 15,
        sentenceIds: pickN(satzOfLevel, 4, rand).map((s) => s.id),
      });
    }
    tasks.push({
      id: tid(4),
      kind: "check",
      titleDe: "Festigungs-Check",
      titleAr: "فحص التثبيت",
      minutes: 20,
      quiz: buildQuiz(day, phase, 10),
    });
  } else if (type === "wochencheck") {
    const isPhaseExam = istPhasenPruefung(day); // امتحان نهاية المرحلة — أيامها من lib/phasen.ts
    tasks.push(
      isPhaseExam
        ? {
            id: tid(1),
            kind: "check",
            titleDe: `Prüfung ${phase}`,
            titleAr: `امتحان نهاية مرحلة ${phase} — قراءة/استماع/قواعد/كتابة`,
            minutes: 50,
            quiz: buildQuiz(day, phase, 12),
            exam: true,
            textId: nextText()?.id,
            dialogueId: nextDialog()?.id,
            writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
          }
        : {
            id: tid(1),
            kind: "check",
            titleDe: "Wochenprüfung",
            titleAr: "الفحص الأسبوعي (12 سؤالاً من محتوى الأسبوع)",
            minutes: 40,
            quiz: buildQuiz(day, phase, 12),
            textId: nextText()?.id,
          }
    );
    // K-FVG: حصة Funktionsverbgefüge أسبوعية في B2
    const fvg = baueFvgAufgabe(day, level, true);
    if (fvg) {
      tasks.push({
        id: tid(9),
        kind: "grammatik",
        titleDe: "Funktionsverbgefüge der Woche",
        titleAr: "تركيب فعلي وظيفي للأسبوع (B2)",
        minutes: 8,
        quiz: [fvg],
      });
    }
    // K-Komposita: حصة فكّ المركَّبات أسبوعية من B1 فصاعداً (3 أسئلة اختيار من متعدد)
    const kompW = baueKompositaWoche(day, level, true);
    if (kompW.length > 0) {
      tasks.push({
        id: tid(10),
        kind: "grammatik",
        titleDe: "Komposita der Woche",
        titleAr: "🔧 ورشة المركَّبات للأسبوع (B1/B2)",
        minutes: 7,
        quiz: kompW,
      });
    }
    tasks.push({
      id: tid(2),
      kind: "lesen",
      titleDe: "Lektüre zur Entspannung",
      titleAr: "قراءة خفيفة للتثبيت",
      minutes: level === "B2" ? 12 : 15,
      textId: nextText()?.id,
    });
    tasks.push({
      id: tid(11),
      kind: "schreiben",
      titleDe: "Wochen-Satz",
      titleAr: level === "A0" || level === "A1"
        ? "جملة الأسبوع (3 جمل عن أسبوعك)"
        : "جملة/فقرة الأسبوع (5 جمل تلخّص ما تعلّمته)",
      minutes: level === "B2" ? 15 : level === "A0" ? 8 : level === "A1" ? 10 : 12,
      writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
    });
    if (level === "B2") {
      tasks.push({
        id: tid(13),
        kind: "sprechen",
        titleDe: "Wochen-Monolog",
        titleAr: "مونولوج قصير (5 دقائق): لخّص أهمّ ما تعلّمته هذا الأسبوع شفوياً",
        minutes: 5,
        sentenceIds: pickN(satzOfLevel, 3, rand).map((s) => s.id),
      });
    }
    tasks.push({
      id: tid(3),
      kind: "wiederholen",
      titleDe: "Ich-kann & Ausblick",
      titleAr: "أستطيع أن… + كبسولة متباعدة للأسبوع القادم",
      minutes: 15,
      sentenceIds: kapselIds(day), // 🌙 كبسولة متباعدة
      quiz: [...kapselQuiz(day), ...buildQuiz(day - 2, phase, 4).slice(0, 4)],
    });
  } else {
    // أيام الختام 375-378 — تستخدم الكبسولة المتباعدة لآخر البنك
    const gesternKapsel = kapselIds(day);
    // أيام الختام 375-378
    const finals: Record<number, DayTask[]> = {
      375: [
        {
          id: tid(1),
          kind: "wiederholen",
          titleDe: "Gesamtwiederholung + Kurz-Zusammenfassung",
          titleAr: "مراجعة شاملة + تلخيص الرحلة في 5 جمل",
          minutes: 50,
          sentenceIds: gesternKapsel,
          quiz: buildQuiz(374, "B2", 15),
          writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(2),
          kind: "check",
          titleDe: "Struktur-Test",
          titleAr: "اختبار هيكلي شامل (القواعد كلها)",
          minutes: 30,
          quiz: buildQuiz(375, "Abschluss", 15),
        },
      ],
      376: [
        {
          id: tid(1),
          kind: "hoeren",
          titleDe: "Abschluss-Hören",
          titleAr: "محاكاة استماع نهائية",
          minutes: 25,
          dialogueId: nextDialog()?.id,
        },
        {
          id: tid(2),
          kind: "lesen",
          titleDe: "Abschluss-Lesen",
          titleAr: "محاكاة قراءة نهائية",
          minutes: 25,
          textId: nextText()?.id,
        },
        {
          id: tid(6),
          kind: "schreiben",
          titleDe: "Abschluss-Schreiben (Kurzform)",
          titleAr: "تدريب كتابة ختامي قصير",
          minutes: 15,
          writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(5),
          kind: "sprechen",
          titleDe: "Abschluss-Monolog",
          titleAr: "مونولوج دقيقة واحدة — ملخّص ما سمعت وقرأت",
          minutes: 15,
          sentenceIds: pickN(satzOfLevel, 4, rand).map((s) => s.id),
        },
        {
          id: tid(3),
          kind: "check",
          titleDe: "Prüfungs-Check",
          titleAr: "فحص محاكاة",
          minutes: 15,
          quiz: buildQuiz(376, "Abschluss", 12),
        },
        {
          id: tid(4),
          kind: "wiederholen",
          titleDe: "Kapsel von gestern",
          titleAr: "كبسولة الأمس (استدعاء خاطف)",
          minutes: 5,
          sentenceIds: gesternKapsel,
          quiz: [],
        },
      ],
      377: [
        {
          id: tid(1),
          kind: "schreiben",
          titleDe: "Abschluss-Schreiben",
          titleAr: "محاكاة كتابة نهائية (B2)",
          minutes: 45,
          writeId: writesOfLevel[writesOfLevel.length - 1]?.id,
        },
        {
          id: tid(2),
          kind: "sprechen",
          titleDe: "Abschluss-Sprechen",
          titleAr: "محاكاة تحدّث نهائية",
          minutes: 30,
          sentenceIds: pickN(satzOfLevel, 6, rand).map((s) => s.id),
        },
        {
          id: tid(3),
          kind: "wiederholen",
          titleDe: "Kapsel von gestern",
          titleAr: "كبسولة الأمس (استدعاء خاطف)",
          minutes: 5,
          sentenceIds: gesternKapsel,
          quiz: [],
        },
      ],
      378: [
        {
          id: tid(1),
          kind: "check",
          titleDe: "Abschlussprüfung",
          titleAr: "الامتحان الختامي الشامل — محاكاة Goethe B2",
          minutes: 55,
          quiz: buildQuiz(377, "Abschluss", 12),
          exam: true,
          textId: nextText()?.id,
          dialogueId: nextDialog()?.id,
          writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(6),
          kind: "schreiben",
          titleDe: "Abschluss-Schreiben (letzter Teil)",
          titleAr: "قسم الكتابة الختامي",
          minutes: 15,
          writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(2),
          kind: "wiederholen",
          titleDe: "Bilanz & Ausblick",
          titleAr: "الحصيلة وخطة ما بعد B2",
          minutes: 10,
          sentenceIds: kapselIds(day),
          quiz: [...kapselQuiz(day), ...buildQuiz(378, "Abschluss", 5).slice(0, 5)],
        },
      ],
    };
    tasks.push(...(finals[day] ?? finals[378]));
  }

  // ── محرّكات التعلّم الذكي ──────────────────────────────────────────
  // (1) التكيّف: تمييز النقاط الضعيفة داخل فحوصات اليوم
  const wt = weakTopics(progress, 2);
  if (wt.length) {
    for (const t of tasks) {
      if (t.quiz && t.quiz.length >= 4) {
        const extra: Exercise[] = [];
        for (const [k] of wt.slice(0, 3)) {
          const topic = grammarMap[k];
          if (topic?.exercises?.length) extra.push(...topic.exercises.slice(0, 2));
        }
        if (extra.length) {
          const r2 = rng(day * 31 + 7);
          const added = pickN(extra, Math.min(2, extra.length), r2).map((e, i) => ({
            ...e,
            id: `w${day}-${i}-${e.id}`,
          }));
          t.quiz = [...added, ...t.quiz];
        }
      }
    }
  }
  // (2) فخاخ الموسوعة: تدريب استباقي في أيام التثبيت على أخطاء العرب الشائعة
  if (type === "festigung") {
    const fp = fehlerList.filter((f) => f.level && f.level <= level);
    if (fp.length) {
      const chosen = pickN(fp, 5, rng(day * 131 + 17));
      tasks.push({
        id: tid(87),
        kind: "wiederholen",
        titleDe: "Fehlerfallen",
        titleAr: "🪤 فخاخ الأخطاء الشائعة — تدريب استباقي من موسوعة أخطاء العرب",
        minutes: 12,
        fehlerItems: chosen.map((f) => ({ falsch: f.falsch, richtig: f.richtig, ar: f.ar, art: f.art })),
      });
    }
  }

  // (3) دفتر الأخطاء: مهمة مراجعة متباعدة لكل أخطاء مستحقّة
  const due = dueFehlerPriorisiert(progress, 8);
  if (due.length >= 2 && tasks.length) {
    tasks.push({
      id: tid(88),
      kind: "wiederholen",
      titleDe: "Fehlerheft",
      titleAr: "📓 دفتر الأخطاء — مراجعة متباعدة (تثبيت الحفظ)",
      minutes: 12,
      fehlerKeys: due.map((f) => f.key),
    });
  }
  // (3) تدريب النقطة الأضعف إن كانت من مقرّر المرحلة
  const topWeak = weakTopics(progress, 3)[0];
  if (topWeak && phaseTopics.includes(topWeak[0]) && !tasks.some((t) => t.topicId === topWeak[0])) {
    tasks.push({
      id: tid(89),
      kind: "grammatik",
      titleDe: "Schwachpunkt-Training",
      titleAr: `🎯 تدريب مكثّف على نقطة ضعفك (${topWeak[1]} أخطاء متراكمة)`,
      minutes: 20,
      topicId: topWeak[0],
      schwach: topWeak[0],
    });
  }

  // ⚖️ الحمل الأكاديمي: معامل المستوى يُطبَّق على كل مهمة مولَّدة (لا على التعويضات: دقائقها عقدٌ سابق)
  for (const t of tasks) if (!t.mandatory) t.minutes = lastMinuten(t.minutes, level);
  // ⏱️ إيقاع المستخدم الثلاثي (خفيف/منتظم/مكثّف): ضبط الدقائق نحو الهدف اليومي
  const tempo = progress.settings.tempo ?? "regelmaessig";
  const targetMin = TEMPO_ZIELMIN[tempo];
  const aktuell = tasks.reduce((s, t) => s + t.minutes, 0);
  if (aktuell > 0) {
    const faktor = Math.max(0.5, Math.min(1.6, targetMin / aktuell));
    for (const t of tasks) if (!t.mandatory) t.minutes = Math.max(5, Math.round((t.minutes * faktor) / 5) * 5);
  }
  return { day, week, weekday, phase, type, tasks, tempo, zielMin: targetMin };
}

// ── منطق القفل والتعويض ────────────────────────────────────────────────
export function taskKey(day: number, task: DayTask): string {
  return task.id;
}

export function isPassed(r?: TaskResult): boolean {
  return !!r && r.passed;
}

export function canCloseDay(plan: DayPlan, taskState: Record<string, TaskResult>): boolean {
  // يمكن إنهاء اليوم دائماً، لكن الواجب يُرحَّل — القفل هو: لا غد قبل الإغلاق
  return true;
}

export function dayScore(plan: DayPlan, taskState: Record<string, TaskResult>) {
  let score = 0;
  let total = 0;
  let done = 0;
  for (const t of plan.tasks) {
    const r = taskState[t.id];
    if (r) {
      score += r.score;
      total += r.total;
      if (r.passed) done += 1;
    }
  }
  return { score, total, done, tasksTotal: plan.tasks.length };
}

/** المهام غير المُتقَنة تتحول إلى ديون تعويضية للغد
 *  K-DebtCap: سقف الديون = مهمّتان كحد أقصى، وما زاد يُدمَج في مراجعة نهاية الأسبوع.
 *  K-A0noDebt: في مرحلة A0 لا تُولَّد ديون على الإطلاق (لا عقاب، بلا إخفاق). */
export function debtsFrom(plan: DayPlan, taskState: Record<string, TaskResult>): DebtItem[] {
  if (plan.phase === "A0") return []; // A0 تهيئة صرفة: لا ديون ولا تقييم
  const debts: DebtItem[] = [];
  for (const t of plan.tasks) {
    if (t.mandatory) continue; // الديون القديمة نفسها تُعالَج في الختام لا تضاف مرة أخرى
    const r = taskState[t.id];
    if (!isPassed(r)) {
      debts.push({
        kind: t.kind,
        titleDe: t.titleDe.replace(/^Nachholen: /, ""),
        titleAr: t.titleAr,
        topicId: t.topicId,
        deckId: t.deckId,
        textId: t.textId,
        dialogueId: t.dialogueId,
        writeId: t.writeId,
        sentenceIds: t.sentenceIds,
        exam: t.exam,
        from: t.from ?? plan.day,
      });
    }
  }
  // كحد أقصى مهمّتا دين تُرحَّلان للغد؛ الباقي ينتظر مراجعة نهاية الأسبوع
  return debts.slice(0, 2);
}

/** تقدّم الخطة الكلي */
export function planPct(progress: Progress): number {
  return Math.min(100, Math.round(((progress.plan.day - 1) / TOTAL_DAYS) * 100));
}

/* ═══ ⏱️ منحنى الساعات المخطَّطة — أساسُ عقد CEFR ═══
   الخطةُ حتميةٌ (بذرةُ كلِّ يومٍ رقمُه)، فمنحنى الدقائقِ المخطَّطةِ ثابتٌ
   ولا يتأثَّر بما أنجزَه المتعلِّم. لذلك يُحسَبُ مرّةً واحدةً ويُحفَظ.
   بدونه كان قولُ «378 يوماً تكفي لـB2» رأياً بلا رقم. */
let PLAN_MIN_KUM: number[] | null = null;

/** الدقائق المخطَّطة من اليوم 1 حتى اليوم `day` ضمناً */
export function planMinBis(day: number): number {
  if (!PLAN_MIN_KUM) {
    const basis: Progress = emptyProgress;
    const arr: number[] = [0];
    let sum = 0;
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      sum += buildDay(d, basis).tasks.reduce((a, t) => a + (t.minutes || 0), 0);
      arr[d] = sum;
    }
    PLAN_MIN_KUM = arr;
  }
  const d = Math.min(Math.max(day | 0, 0), TOTAL_DAYS);
  return PLAN_MIN_KUM[d] ?? 0;
}

/** ساعاتُ الخطةِ حتى يومٍ معيَّن — تُستعمل مرجعاً لمقارنة CEFR */
export function planStundenBis(day: number): number {
  return planMinBis(day) / 60;
}

/** إجمالي ساعات الخطة كاملةً (378 يوماً) */
export function planStundenGesamt(): number {
  return planStundenBis(TOTAL_DAYS);
}
