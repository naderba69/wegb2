// نماذج البيانات — طريقي إلى B2 (محرّك الخطة اليومية)
export type Level = "A0" | "A1" | "A2" | "B1" | "B2";
export type UiLang = "ar" | "mix" | "de";
export type Phase = "A0" | "A1" | "A2" | "B1" | "B2" | "Abschluss";
export type TaskKind =
  | "wiederholen"
  | "grammatik"
  | "wortschatz"
  | "hoeren"
  | "lesen"
  | "schreiben"
  | "sprechen"
  | "aussprache"
  | "check";
export type DayType = "lerntag" | "festigung" | "wochencheck" | "abschluss";

/** شبكة كفاءات CEFR الموحّدة — خط أنابيب التقويم الثالث */
export type Kompetenz = "Lesen" | "Hoeren" | "Schreiben" | "Sprechen" | "Grammatik" | "Wortschatz";

export interface Exercise {
  id: string;
  type: "mc" | "fill" | "truefalse" | "order" | "dictation" | "translate" | "umformung";
  /** 🔁 umformung: الجملةُ المُدخَلةُ التي يُطلَبُ تحويلُها (promptDe = التعليمة) */
  quelleDe?: string;
  /** 🔁 umformung: بدائلُ مقبولةٌ سوى answer (مثل ترتيبٍ آخرَ للظرف) */
  alternativen?: string[];
  /** 🔁 umformung: الكلماتُ التي يجبُ أن تظهرَ (تشخيصٌ موجَّه: «ينقصك …») */
  mussEnthalten?: string[];
  /** 🔁 umformung: ما يجبُ ألّا يظهرَ (الفخّ نفسه: «ما زلتَ تكتب …») */
  darfNicht?: string[];
  promptDe: string;
  promptAr?: string;
  options?: string[];
  answer: string | string[];
  /** كلمات مفتاحية للترجمة (كلها مطلوبة) */
  keywords?: string[];
  /** لا تدمج ß مع ss إذا كان التمرين يختبر هذا الفرق الإملائي تحديداً. */
  strictEszett?: boolean;
  text?: string;
  hint?: string;
  explanationAr?: string;
  explanationDe?: string;
  points?: number;
}

export interface VocabCard {
  id: string;
  de: string;
  ar: string;
  pos?: string;
  /** تفصيل النوع المحفوظ من الوسم القديم (unregelmäßig، ‏+Dativ …) — يعرض ولا يصفَّى به */
  posInfo?: string;
  /** مرادفات مدققة (R29) */
  syn?: string[];
  /** أضداد مدققة — لكل صفة ضدّها أو استثناء معلَن (R29) */
  ant?: string[];
  article?: string;
  plural?: string;
  exampleDe?: string;
  exampleAr?: string;
  img?: string;
  level: Level;
  tags?: string[];
}

export interface GrammarTable {
  captionAr?: string;
  headers: string[];
  rows: string[][];
}

export interface GrammarTopic {
  id: string;
  titleDe: string;
  titleAr: string;
  level: Level;
  /** 🎯 معيار الدرس الواحد: هدفٌ واحد قابل للملاحظة — ما الذي سيفعله المتعلم بعد الدرس؟ */
  ziel?: string;
  /** 🧱 المتطلب السابق: IDs دروسٍ يُفترَض إتقانُها قبل هذا الدرس (فارغ = درس دخول) */
  voraus?: string[];
  /** 🚀 مهمة الاستخدام المستقل: موقف حقيقي جديد — تُعرَض في الخلاصة وتُحفَظ للتحقق المؤجل */
  anwendung?: { ar: string; de: string; candoIds?: string[] };
  /** 🎯 بنود التحقق المحجوزة: لا تُعرَض في التدريب أبداً — تُسحَب يوم الاستحقاق فقط (مهمة جديدة لا إعادة) */
  verify?: Exercise[];
  summaryAr: string;
  summaryDe?: string;
  rules: { de: string; ar: string }[];
  tables?: GrammarTable[];
  examples: { de: string; ar: string }[];
  pitfalls?: { de: string; ar: string }[];
  exercises: Exercise[];
}

export interface Eselsbruecke {
  id: string;
  emoji: string;
  sektion: "genus" | "satzbau" | "praeposition" | "verb" | "adjektiv" | "b2" | "sprichwort";
  level: Level;
  titleAr: string;
  storyAr: string;
  zeilen: { code: string; de: string; ar: string }[];
  gramIds: string[];
  warnung?: string;
}

export interface Satz {
  id: string;
  level: Level;
  de: string;
  ar: string;
  tags?: string[];
}

export interface Lesetext {
  id: string;
  level: Level;
  titleDe: string;
  titleAr: string;
  de: string;
  ar: string;
  questions: Exercise[];
  /** 📜 النسخة الطويلة للقراءة بطول CEFR حقيقي (B2: 220–420 كلمة)؛ `de` القصيرة تبقى نصَّ الاستماع المسجَّل */
  lang?: Langfassung;
  /** 🧭 علامة داخلية: فضّل النسخة القصيرة (لتدرّج نسبة النصوص الأصلية) */
  __weg_useShort?: boolean;
}

export interface Langfassung {
  de: string;
  /** ملخّص عربي (لا ترجمة كاملة — القارئ في B2 يقرأ الألمانية) */
  ar: string;
  questions: Exercise[];
}

export interface DialogLine {
  who: string;
  de: string;
  ar: string;
}

export interface Hoerdialog {
  id: string;
  level: Level;
  titleDe: string;
  titleAr: string;
  lines: DialogLine[];
  questions: Exercise[];
  dictation: string[];
}

export interface Schreibaufgabe {
  id: string;
  level: Level;
  titleDe: string;
  titleAr: string;
  taskDe: string;
  taskAr: string;
  criteria: string[];
  sample: string;
  noteAr?: string[];
}

/** زوج فروق دقيقة (Nuancen) — Modul P */
export interface Nuance {
  a: string;
  b: string;
  aAr: string;
  bAr: string;
  regel: string;
  satzA: string;
  satzB: string;
  hinweis?: string;
}

/** فعل بحرف جرّه الثابت — Modul P */
export interface VerbPraep {
  verb: string;
  luecke: string;
  praep: string;
  kasus: "Akk." | "Dat.";
  ar: string;
  options: string[];
}

/** تركيب Funktionsverbgefüge رسمي — Modul P */
export interface FunktionsVerb {
  gefüge: string;
  luecke: string;
  ar: string;
  satz: string;
  options: string[];
  answer: string;
}

export interface Tiefenlex {
  nuancen: Nuance[];
  verben: VerbPraep[];
  funktion: FunktionsVerb[];
}

/** سيناريو حياة كامل — Modul Q */
export interface Szenario {
  id: string;
  emoji: string;
  nameDe: string;
  nameAr: string;
  kontext: string;
  saetze: { de: string; ar: string }[];
  dialoge: { titel: string; lines: { who: "A" | "B"; role: string; de: string; ar: string }[] }[];
  formular: { titel: string; zeilen: string[] };
  rolle: { sitter: string; partner: string; stichworte: string[]; plan: string[] };
  /** ربط صريح بالدروس المطبَّقة: السيناريو يطبّق ولا يستبدل (R26) */
  lektionen: string[];
}

/** حزمة سياق حيوي — Modul R */
export interface KontextPaket {
  id: string;
  emoji: string;
  nameDe: string;
  nameAr: string;
  nutzung: string;
  saetze: { de: string; ar: string }[];
  dialog: { titel: string; lines: { who: "A" | "B"; role: string; de: string; ar: string }[] };
  modelle: { titel: string; zeilen: string[] }[];
}

export interface DayTask {
  id: string;
  kind: TaskKind;
  titleDe: string;
  titleAr: string;
  minutes: number;
  topicId?: string;
  deckId?: string;
  textId?: string;
  dialogueId?: string;
  writeId?: string;
  sentenceIds?: string[];
  quiz?: Exercise[];
  /** امتحان شامل متعدد الأقسام (نهاية المرحلة/الختام) */
  exam?: boolean;
  /** من التعويضات المُرحَّلة من أيام سابقة */
  mandatory?: boolean;
  from?: number;
  /** دفتر الأخطاء: مفاتيح أخطاء للمراجعة المتباعدة */
  fehlerKeys?: string[];
  /** فخاخ الموسوعة: عناصر تدريب استباقي (أخطاء شائعة) */
  fehlerItems?: { falsch: string; richtig: string; ar: string; art?: string }[];
  /** وسم تدريب النقطة الضعيفة */
  schwach?: string;
  /** 🎯 تحقق استقلال: ID الدرس الذي تتحقق منه هذه المهمة (مهمة جديدة لا إعادة) */
  verifyFor?: string;
}

export interface DayPlan {
  day: number;
  week: number;
  weekday: number;
  phase: Phase;
  type: DayType;
  tasks: DayTask[];
  tempo: Tempo;
  zielMin: number;
  /** المحطات الست للدرس (إحماء، نطق/ظل، مفردات، قواعد استقرائية، استماع/قراءة، إنتاج) */
  stationen?: Array<{ id: string; titelAr: string; titelDe: string; min: number }>;
}

export interface TaskResult {
  done: boolean;
  passed: boolean;
  score: number;
  total: number;
  attempts: number;
  kind?: TaskKind;
  at?: string;
  /** ⏱️ الدقائق المخطَّطة لهذه المهمة لحظةَ تسليمها — بها يُحسَب «مخطط مُنجَز»
   *  (الخطة حتمية، فهي قابلة لإعادة الاشتقاق، لكن تثبيتها يجعل الحساب رخيصاً وصادقاً) */
  geplantMin?: number;
  /** ⏱️ الدقائق الفعلية المقضية — تُقاس عند التسليم، لا تُفتَرَض */
  minutenEffektiv?: number;
}

export interface DayResult {
  closed: boolean;
  score: number;
  total: number;
  tasksDone: number;
  tasksTotal: number;
  at: string;
  /** ⏱️ مجموع الدقائق الفعلية في هذا اليوم */
  minutenEffektiv?: number;
}

export interface DebtItem {
  kind: TaskKind;
  titleDe: string;
  titleAr: string;
  topicId?: string;
  deckId?: string;
  textId?: string;
  dialogueId?: string;
  writeId?: string;
  sentenceIds?: string[];
  exam?: boolean;
  from: number;
}

export interface SrsState {
  ease: number;
  interval: number;
  due: string;
  reps: number;
  lapses: number;
  learning?: boolean;
  /** تاريخ إدخال البطاقة (لمراجعة أولى بعد 24 ساعة) */
  introduced?: string;
}

/** خطأ مسجَّل في دفتر الأخطاء */
export interface FehlerEintrag {
  key?: string;
  falsch: string;
  richtig: string;
  art: string;
  ar: string;
  level?: Level;
  quelle?: string;
}

/** حالة الخطأ = المعلومة + جدول التكرار المتباعد + عدّاد التكرار */
export interface FehlerState extends FehlerEintrag {
  key: string;
  srs: SrsState;
  treffer: number;
  /** تاريخ أول ظهور (شبكة الحرارة — Modul N) */
  first?: string;
}

export interface Kontrakt {
  /** ساعة الإغلاق "HH:MM" */
  uhrzeit: string;
  strafe: "xp30" | "flecken1";
  /** يوم التوقيع YYYY-MM-DD — العقد يومٌ قابل للتجديد لا قيد مؤبد */
  seit: string;
  streak: number;
  /** آخر يوم سُجّل فيه الوفاء (يمنع العدّ المزدوج) */
  streakTag?: string;
  /** تاريخ آخر غرامة مطبَّقة (يمنع العقاب المزدوج في اليوم نفسه) */
  lastPenalty?: string;
  /** تاريخ أول كسر — للرواية لا للمحاسبة */
  bruchTag?: string;
  /** آخر نص عارٍ وُلد من سجلّ المتعلم */
  lastShame?: string | null;
}

/** تقييمُ الثقةِ قبلَ الإجابة (Modul: Metakognition): سجلٌّ خامٌّ يُشتقُّ منه مؤشّرُ «الثقةِ الخاطئة» */
export interface SicherheitsEintrag { t: string; id: string; sicher: boolean; correct: boolean }

/** سرعة التعلّم التي يختارها المستخدم (3 وتائر) */
export type Tempo = "leicht" | "regelmaessig" | "intensiv";
export const TEMPO_ZIELMIN: Record<Tempo, number> = { leicht: 15, regelmaessig: 30, intensiv: 60 };
export const TEMPO_LABEL: Record<Tempo, { de: string; ar: string; min: number }> = {
  leicht:       { de: "Leicht (15 Min/Tag)",     ar: "خفيف (15 دقيقة/يوم)",    min: 15 },
  regelmaessig: { de: "Regelmäßig (30 Min/Tag)", ar: "منتظم (30 دقيقة/يوم)",   min: 30 },
  intensiv:     { de: "Intensiv (60 Min/Tag)",   ar: "مكثّف (60 دقيقة/يوم)",   min: 60 },
};
export const NEW_CARDS_PER_DAY: Record<Tempo, number> = { leicht: 3, regelmaessig: 5, intensiv: 10 };

export interface Progress {
  /** آخرُ 500 تقييمِ ثقةٍ قبلَ الإجابة — اختياريّ، يُملأ من ExerciseSet */
  sicherheit?: SicherheitsEintrag[];
  v: number;
  plan: {
    day: number;
    tasks: Record<string, TaskResult>;
    days: Record<number, DayResult>;
    debt: DebtItem[];
    /** إصدار ترتيب الدروس، مستقلّ عن إصدار بنية Progress. */
    curriculumScheduleVersion?: number;
    /** آخر يوم يبقى على الجدول القديم عند ترحيل المستخدم القائم. */
    curriculumLegacyThroughDay?: number;
    /** ⏱️ إجمالي الدقائق الفعلية المقضية في الخطة كلها — المصدر الوحيد لساعات CEFR المزعومة.
     *  بلا هذا الحقل لا يستطيع المشروع إثبات أي عدد ساعات، والوعد يبقى ادّعاءً. */
    minutenEffektiv?: number;
  };
  srs: Record<string, SrsState>;
  canDo: Record<string, boolean>;
  streak: { last: string | null; count: number };
  /** يوم سيّئ: بصمة المستخدم أنّ اليوم كان صعباً → تُجمَّد السلسلة بدون عقاب ولا ديون */
  badDay?: string;
  settings: {
    uiLang: "auto" | UiLang;
    rate: number;
    tempo: Tempo;
    voiceName?: string;
    /** مدرّس LLM اختياري (OpenAI-compatible) — يبقى محلياً في متصفحك */
    llm?: { baseUrl: string; apiKey: string; model: string };
    /** 🎙️ التعرّف السحابي على الكلام (Web Speech API) — يُرسِل الصوتَ إلى خدمة المتصفّح الخارجية.
     *  اختياريٌّ صريح: إن عُطِّل فُتح المسارُ المحلّيُّ البديل ولا يُحسبُ شيءٌ في الشبكة. */
    cloudSpeech?: boolean;
    /** أُكِّد اختبار تحديد المستوى */
    placed?: boolean;
    /** موعد الامتحان الخارجي (YYYY-MM-DD) + اسمه */
    examDate?: string;
    examName?: string;
  };
  /** نتائج امتحانات المراحل: اليوم ← الدرجة المئوية ونجاح */
  exams?: Record<number, { score: number; passed: boolean }>;
  /** 🎯 طابور تحقق الاستقلال: الدرس ← يوم الاستحقاق (التدريب+3) ونتيجة التحقق.
   *  إعادة المحاولة الفورية تدريبٌ فقط — الدليل مهمة جديدة مؤجلة. */
  verify?: Record<string, { dueDay: number; doneDay?: number; passed?: boolean }>;
  /** 🤔 اعتراضات المتعلم على قواعد الكاشف: القاعدة ← عدد الاعتراضات (R33: 3 = تنزيل). */
  disputiert?: Record<string, number>;
  /** ⌨️ مهام شفوية سُلّمت كتابياً: إثبات إنجاز لا إثبات نطق (R16). */
  schriftlich?: Record<string, true>;
  /** 🔒 بوّابة الوحدة: رقم الوحدة ← محاولاتها وأفضل نتيجة وحالة العبور */
  modulPruefungen?: Record<number, {
    versuche: number; best: number; bestanden: boolean; zuletzt?: string;
    teile?: { lesen: number; hoeren: number; schreiben: number; sprechen: number };
  }>;
  /** دفتر الأخطاء: المفتاح ← خطأ + جدول تكرار متباعد */
  fehler?: Record<string, FehlerState>;
  /** خريطة الضعف: مهارة/موضوع ← وزن متراكم (يتلاشى مع الإتقان) */
  weak?: Record<string, number>;
  /** نقاط XP (محرّك التحفيز) */
  xp?: number;
  /** 🔒 عقد الانضباط اليومي (Modul O) — وقّع، إغلاق، غرامة رمزية من سجلّ المتعلم نفسه */
  kontrakt?: Kontrakt;
  /** الأوسمة المكسوبة: id ← تاريخ المنح */
  abzeichen?: Record<string, string>;
  /** سجلّ الكفاءات الموحّد: محاولات موزّعة على شبكة CEFR (logK) */
  kompetenzLog?: { h: Kompetenz; ok: boolean }[];
  /** صحّة التعلّم (Modul U): حارس 20-20-20 ووضع المريض */
  gesundheit?: {
    augenPause?: boolean;
    krank?: boolean;
    pausen?: { tag: string; n: number };
  };
  /** الوحدة O — مركز تعلّم التعلّم: من قُرئت استراتيجياته اليوم وكم بومودورو أُنجز (اختياري — بلا ترحيل) */
  lernen?: {
    tag: string;
    teile?: string[];
    pomoHeute?: number;
  };
  /** الوحدة X — BlitzDrill: أفضل نتيجة إصابات لكل رقعة (اختياري — بلا ترحيل) */
  blitz?: Record<string, number>;
}

export const TOTAL_DAYS = 378;
export const CURRICULUM_SCHEDULE_VERSION = 3;

export const emptyProgress: Progress = {
  v: 2,
  plan: {
    day: 1,
    tasks: {},
    days: {},
    debt: [],
    curriculumScheduleVersion: CURRICULUM_SCHEDULE_VERSION,
    curriculumLegacyThroughDay: 0,
  },
  srs: {},
  canDo: {},
  streak: { last: null, count: 0 },
  settings: { uiLang: "auto", rate: 0.85, tempo: "regelmaessig" as Tempo },
  xp: 0,
  abzeichen: {},
  kompetenzLog: [],
};

/** المقابل العربي لأنواع الكلمات المحكومة (R30) */
export const POS_AR: Record<string, string> = {
  Nomen: "اسم", Verb: "فعل", Adjektiv: "صفة", Adverb: "حال/ظرف", Pronomen: "ضمير",
  Präposition: "حرف جرّ", Konjunktion: "أداة ربط", Artikel: "أداة", Zahl: "عدد",
  Interjektion: "تعجّب/تحية", Wendung: "عبارة", Satz: "جملة",
};
export const LEVEL_COLORS: Record<Phase, string> = {
  A0: "var(--color-gold)",
  A1: "var(--color-a1)",
  A2: "var(--color-a2)",
  B1: "var(--color-b1)",
  B2: "var(--color-b2)",
  Abschluss: "var(--color-gold)",
};
