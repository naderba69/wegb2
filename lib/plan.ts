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
import { TOTAL_DAYS } from "./types";
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
import { dueFehler, weakTopics } from "./fehler";

/**
 * محرّك الخطة اليومية — قلب المشروع المنهجي
 * ------------------------------------------------
 * 270 يوماً مقسومة: A1 (1-70) · A2 (71-140) · B1 (141-210) · B2 (211-266) · ختام (267-270)
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
  { phase: "A1", from: 1, to: 70, level: "A1" },
  { phase: "A2", from: 71, to: 140, level: "A2" },
  { phase: "B1", from: 141, to: 210, level: "B1" },
  { phase: "B2", from: 211, to: 266, level: "B2" },
  { phase: "Abschluss", from: 267, to: 270, level: "B2" },
];

const PHASE_TOPICS: Record<Phase, string[]> = {
  A1: ["a1-sein-haben", "a1-pronomen", "a1-praesens", "a1-trennbar", "a1-zahlen", "a1-akkusativ"],
  A2: ["a2-perfekt", "a2-negation", "a2-imperativ", "a2-weil-dass", "a2-dativ", "a2-modal", "a2-wechsel", "a2-reflexiv", "a2-steigerung", "a2-futur"],
  B1: ["b1-konj2", "b1-relativ", "b1-konnektoren", "b1-plusquamperfekt", "b1-genitiv", "b1-adjektivendungen", "b1-unbestimmte", "b1-verb-praeposition", "b1-passiv"],
  B2: ["b2-indirekte-rede", "b2-funktionsverben", "b2-partizip", "b2-infinitiv", "b2-bedingung", "b2-doppelkonnektoren", "b2-relativ-generalisierend", "b2-modalpartikel", "b2-futur-ii"],
  Abschluss: [],
};

const PHASE_DECKS: Record<Phase, string[]> = {
  A1: ["a1-start", "a1-familie-alltag", "a1-essen-trinken", "a1-koerper-kleidung", "a1-stadt-wege", "a1-zeit-zahlen", "a1-haus-schule", "a1-natur-freizeit", "a1-welt-beruf", "a1-modal-ort", "a1-menschen-abschluss"],
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
  { nr: 1, level: "A1", von: 1,   bis: 18,  titelDe: "Persönliche Informationen", titelAr: "المعلومات الشخصية", inhalteAr: "التحية · الأبجدية · الأرقام · بلد المنشأ · المهن · ملء الاستمارات" },
  { nr: 2, level: "A1", von: 19,  bis: 36,  titelDe: "Alltag",                    titelAr: "الحياة اليومية",     inhalteAr: "الوقت · الأيام والشهور · الطعام والتسوّق · الأسعار · الإعجاب والنفور" },
  { nr: 3, level: "A1", von: 37,  bis: 53,  titelDe: "Wohnen & Umgebung",         titelAr: "السكن والمحيط",      inhalteAr: "الشقّة والأثاث · الغرف · الألوان · وصف المدينة والموقع" },
  { nr: 4, level: "A1", von: 54,  bis: 70,  titelDe: "Freizeit & Gesundheit",     titelAr: "الفراغ والصحّة",     inhalteAr: "الهوايات · الرياضة · الطقس · أعضاء الجسد · موعد الطبيب" },
  { nr: 1, level: "A2", von: 71,  bis: 88,  titelDe: "Soziales & Reisen",         titelAr: "الاجتماع والسفر",    inhalteAr: "الأسرة · السِّيَر · تنسيق المواعيد · حجز الفنادق والقطارات · الاتجاهات" },
  { nr: 2, level: "A2", von: 89,  bis: 106, titelDe: "Arbeit & Bildung",          titelAr: "العمل والتعليم",     inhalteAr: "المواد الدراسية · المسار المهني · تواصل العمل · المكالمات" },
  { nr: 3, level: "A2", von: 107, bis: 123, titelDe: "Medien & Konsum",           titelAr: "الإعلام والاستهلاك", inhalteAr: "التلفاز · الإنترنت · الملابس · إرجاع السلع · المتاجر الكبرى" },
  { nr: 4, level: "A2", von: 124, bis: 140, titelDe: "Gesellschaft & Natur",      titelAr: "المجتمع والطبيعة",   inhalteAr: "الأعياد · التقاليد · الحيوان · البيئة والطقس" },
  { nr: 1, level: "B1", von: 141, bis: 158, titelDe: "Identität & Beziehungen",   titelAr: "الهوية والعلاقات",   inhalteAr: "سمات الشخصية · النزاعات · النصيحة · فجوة الأجيال · الصداقة" },
  { nr: 2, level: "B1", von: 159, bis: 176, titelDe: "Wohnen & Mobilität",        titelAr: "السكن والتنقّل",     inhalteAr: "أشكال السكن البديلة · الانتقال · المرور · النقل العام · تاريخ الهجرة" },
  { nr: 3, level: "B1", von: 177, bis: 193, titelDe: "Beruf & Zukunft",           titelAr: "المهنة والمستقبل",   inhalteAr: "طلبات التوظيف · المقابلات · مهنة الحلم · شكاوى العمل · توازن الحياة" },
  { nr: 4, level: "B1", von: 194, bis: 210, titelDe: "Kultur & Politik",          titelAr: "الثقافة والسياسة",   inhalteAr: "الفن · الموسيقى · تاريخ ألمانيا · النظام السياسي · حماية البيئة" },
  { nr: 1, level: "B2", von: 211, bis: 224, titelDe: "Professionelle Meisterschaft", titelAr: "الإتقان المهني", inhalteAr: "المراسلة الرسمية · التفاوض · العروض · نماذج العمل العالمية" },
  { nr: 2, level: "B2", von: 225, bis: 238, titelDe: "Wissenschaft & Technik",    titelAr: "العلم والتقنية",     inhalteAr: "الذكاء الاصطناعي · الابتكار · علم النفس · مناهج الدراسة · الجامعة" },
  { nr: 3, level: "B2", von: 239, bis: 252, titelDe: "Politik & Globalisierung",  titelAr: "السياسة والعولمة",   inhalteAr: "مجتمع الاستهلاك · الوعي المالي · التجارة · الأنظمة الاجتماعية · الإعلام" },
  { nr: 4, level: "B2", von: 253, bis: 270, titelDe: "Gesellschaft & Debatten",   titelAr: "المجتمع وقضاياه",    inhalteAr: "اتجاهات التغذية · البيئة والصناعة · الهجرة · العمل التطوّعي" },
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
  if (day >= 267) return "abschluss";
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

function translateFromSatz(s: Satz, idx: number): Exercise {
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

/** بناء فحص ختامي/أسبوعي من مخزون المرحلة حتى اليوم */
function buildQuiz(day: number, phase: Phase, count: number): Exercise[] {
  const rand = rng(day * 977 + 13);
  const level = levelOf(day);
  const pool: Exercise[] = [];

  // قواعد المرحلة (كل ما سبق تدريسه)
  for (const tid of PHASE_TOPICS[phase]) {
    const topic = grammarMap[tid];
    if (topic) pool.push(...topic.exercises);
  }
  const satzPool = sentences.filter((s) => s.level === level || s.level < level);
  const clozes = satzPool.map((s, i) => clozeFromSatz(s, i, rand));
  const picked = pickN([...pool, ...clozes], count, rand);

  // تكميل ببطاقات المفردات إن قلّ العدد
  if (picked.length < count) {
    const deckIds = PHASE_DECKS[phase];
    const cards = deckIds.flatMap((d) => getDeck(d)?.cards ?? []);
    const extra = pickN(cards, count - picked.length, rand).map((c, i) =>
      mcFromCards([c, ...cards.filter((x) => x.id !== c.id)], i, rand)
    );
    picked.push(...extra);
  }
  return picked.map((ex, i) => ({ ...ex, id: `q${day}-${i}-${ex.id}` }));
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
  const writesOfLevel = writingTasks.filter((w) => w.level === level);
  const satzOfLevel = sentences.filter((s) => s.level === level);

  if (type === "lerntag") {
    // استرجاع يومي ثابت
    tasks.push({
      id: tid(1),
      kind: "wiederholen",
      titleDe: "Wiederholung & Abruf",
      titleAr: "استرجاع واستذكار (ما سبق)",
      minutes: 15,
      // حزمةُ اليومِ في الاسترجاع: دورانٌ يوميٌّ يضمنُ أن تصلَ كلُّ حزمةٍ عينَ المتعلِّمِ
      // ولو زادَ عددُ الحزمِ على خاناتِ درسِ المفرداتِ الأسبوعية
      deckId: phaseDecks[(day - 1) % Math.max(phaseDecks.length, 1)],
      sentenceIds: pickN(satzOfLevel, 3, rand).map((s) => s.id),
      quiz: buildQuiz(day - 1, phase, 3),
    });

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
          minutes: 35,
          textId: pickN(textsOfLevel, 1, rand)[0]?.id,
        });
      } else {
        tasks.push({
          id: tid(4),
          kind: "hoeren",
          titleDe: "Hörtraining (TTS)",
          titleAr: "تسميع واستماع (نطق المتصفح)",
          minutes: 35,
          dialogueId: pickN(dialogsOfLevel, 1, rand)[0]?.id,
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
          dialogueId: pickN(dialogsOfLevel, 1, rand)[0]?.id,
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
          textId: pickN(textsOfLevel, 1, rand)[0]?.id,
        });
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
        minutes: 35,
        deckId: phaseDeckA,
        sentenceIds: pickN(satzOfLevel, 5, rand).map((s) => s.id),
      });
      tasks.push({
        id: tid(3),
        kind: "schreiben",
        titleDe: "Schreibtraining",
        titleAr: "تدريب كتابة",
        minutes: 35,
        writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
      });
      tasks.push({
        id: tid(4),
        kind: "hoeren",
        titleDe: "Hörtraining (TTS)",
        titleAr: "تسميع واستماع",
        minutes: 25,
        dialogueId: pickN(dialogsOfLevel, 1, rand)[0]?.id,
      });
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
      titleAr: "مراجعة الأسبوع كاملاً",
      minutes: 30,
      quiz: buildQuiz(day - 1, phase, 8),
    });
    tasks.push({
      id: tid(2),
      kind: "schreiben",
      titleDe: "Langer Text",
      titleAr: "كتابة نصّ كامل (المعيار: معايير التقييم)",
      minutes: 40,
      writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
    });
    tasks.push({
      id: tid(3),
      kind: "sprechen",
      titleDe: "Freies Sprechen",
      titleAr: "تحدّث حرّ (سجّل نفسك)",
      minutes: 20,
      sentenceIds: pickN(satzOfLevel, 4, rand).map((s) => s.id),
    });
    tasks.push({
      id: tid(4),
      kind: "check",
      titleDe: "Festigungs-Check",
      titleAr: "فحص التثبيت",
      minutes: 20,
      quiz: buildQuiz(day, phase, 10),
    });
  } else if (type === "wochencheck") {
    const isPhaseExam = day % 70 === 0 && day <= 210; // امتحان نهاية المرحلة 70/140/210
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
            textId: pickN(textsOfLevel, 1, rand)[0]?.id,
            dialogueId: pickN(dialogsOfLevel, 1, rand)[0]?.id,
            writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
          }
        : {
            id: tid(1),
            kind: "check",
            titleDe: "Wochenprüfung",
            titleAr: "الفحص الأسبوعي (12 سؤالاً من محتوى الأسبوع)",
            minutes: 40,
            quiz: buildQuiz(day, phase, 12),
          }
    );
    tasks.push({
      id: tid(2),
      kind: "lesen",
      titleDe: "Leküre zur Entspannung",
      titleAr: "قراءة خفيفة للتثبيت",
      minutes: 25,
      textId: pickN(textsOfLevel, 1, rand)[0]?.id,
    });
    tasks.push({
      id: tid(3),
      kind: "wiederholen",
      titleDe: "Ich-kann & Ausblick",
      titleAr: "أستطيع أن… + استعداد للأسبوع القادم",
      minutes: 15,
      quiz: buildQuiz(day - 2, phase, 4),
    });
  } else {
    // أيام الختام 267-270
    const finals: Record<number, DayTask[]> = {
      267: [
        {
          id: tid(1),
          kind: "wiederholen",
          titleDe: "Gesamtwiederholung",
          titleAr: "مراجعة شاملة نهائية",
          minutes: 60,
          quiz: buildQuiz(266, "B2", 15),
        },
        {
          id: tid(2),
          kind: "check",
          titleDe: "Struktur-Test",
          titleAr: "اختبار هيكلي شامل (القواعد كلها)",
          minutes: 45,
          quiz: buildQuiz(267, "Abschluss", 15),
        },
      ],
      268: [
        {
          id: tid(1),
          kind: "hoeren",
          titleDe: "Abschluss-Hören",
          titleAr: "محاكاة استماع نهائية",
          minutes: 35,
          dialogueId: pickN(dialogsOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(2),
          kind: "lesen",
          titleDe: "Abschluss-Lesen",
          titleAr: "محاكاة قراءة نهائية",
          minutes: 35,
          textId: pickN(textsOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(3),
          kind: "check",
          titleDe: "Prüfungs-Check",
          titleAr: "فحص محاكاة",
          minutes: 30,
          quiz: buildQuiz(268, "Abschluss", 12),
        },
      ],
      269: [
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
      ],
      270: [
        {
          id: tid(1),
          kind: "check",
          titleDe: "Abschlussprüfung",
          titleAr: "الامتحان الختامي الشامل — محاكاة Goethe B2",
          minutes: 60,
          quiz: buildQuiz(269, "Abschluss", 12),
          exam: true,
          textId: pickN(textsOfLevel, 1, rand)[0]?.id,
          dialogueId: pickN(dialogsOfLevel, 1, rand)[0]?.id,
          writeId: pickN(writesOfLevel, 1, rand)[0]?.id,
        },
        {
          id: tid(2),
          kind: "wiederholen",
          titleDe: "Bilanz & Ausblick",
          titleAr: "الحصيلة وخطة ما بعد B2",
          minutes: 20,
          quiz: buildQuiz(270, "Abschluss", 5),
        },
      ],
    };
    tasks.push(...(finals[day] ?? finals[270]));
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
  const due = dueFehler(progress, 8);
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

  return { day, week, weekday, phase, type, tasks };
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

/** المهام غير المُتقَنة تتحول إلى ديون تعويضية للغد */
export function debtsFrom(plan: DayPlan, taskState: Record<string, TaskResult>): DebtItem[] {
  const debts: DebtItem[] = [];
  for (const t of plan.tasks) {
    const r = taskState[t.id];
    if (!isPassed(r)) {
      // التعويضات القديمة غير المنقذة تبقى تعويضات
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
  return debts.slice(0, 6); // سقف التعويض حتى لا ينهار الغد
}

/** تقدّم الخطة الكلي */
export function planPct(progress: Progress): number {
  return Math.min(100, Math.round(((progress.plan.day - 1) / TOTAL_DAYS) * 100));
}
