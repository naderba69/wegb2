// نماذج البيانات — طريقي إلى B2 (محرّك الخطة اليومية)
export type Level = "A1" | "A2" | "B1" | "B2";
export type UiLang = "ar" | "mix" | "de";
export type Phase = "A1" | "A2" | "B1" | "B2" | "Abschluss";
export type TaskKind =
  | "wiederholen"
  | "grammatik"
  | "wortschatz"
  | "hoeren"
  | "lesen"
  | "schreiben"
  | "sprechen"
  | "check";
export type DayType = "lerntag" | "festigung" | "wochencheck" | "abschluss";

/** شبكة كفاءات CEFR الموحّدة — خط أنابيب التقويم الثالث */
export type Kompetenz = "Lesen" | "Hoeren" | "Schreiben" | "Sprechen" | "Grammatik" | "Wortschatz";

export interface Exercise {
  id: string;
  type: "mc" | "fill" | "truefalse" | "order" | "dictation" | "translate";
  promptDe: string;
  promptAr?: string;
  options?: string[];
  answer: string | string[];
  /** كلمات مفتاحية للترجمة (كلها مطلوبة) */
  keywords?: string[];
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
}

export interface DayPlan {
  day: number;
  week: number;
  weekday: number;
  phase: Phase;
  type: DayType;
  tasks: DayTask[];
}

export interface TaskResult {
  done: boolean;
  passed: boolean;
  score: number;
  total: number;
  attempts: number;
  kind?: TaskKind;
  at?: string;
}

export interface DayResult {
  closed: boolean;
  score: number;
  total: number;
  tasksDone: number;
  tasksTotal: number;
  at: string;
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

export interface Progress {
  v: number;
  plan: {
    day: number;
    tasks: Record<string, TaskResult>;
    days: Record<number, DayResult>;
    debt: DebtItem[];
  };
  srs: Record<string, SrsState>;
  canDo: Record<string, boolean>;
  streak: { last: string | null; count: number };
  settings: {
    uiLang: "auto" | UiLang;
    rate: number;
    voiceName?: string;
    /** مدرّس LLM اختياري (OpenAI-compatible) — يبقى محلياً في متصفحك */
    llm?: { baseUrl: string; apiKey: string; model: string };
    /** أُكِّد اختبار تحديد المستوى */
    placed?: boolean;
    /** موعد الامتحان الخارجي (YYYY-MM-DD) + اسمه */
    examDate?: string;
    examName?: string;
  };
  /** نتائج امتحانات المراحل: اليوم ← الدرجة المئوية ونجاح */
  exams?: Record<number, { score: number; passed: boolean }>;
  /** 🔒 بوّابة الوحدة: رقم الوحدة 1..16 ← محاولاتها وأفضل نتيجة وحالة العبور */
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

export const emptyProgress: Progress = {
  v: 2,
  plan: { day: 1, tasks: {}, days: {}, debt: [] },
  srs: {},
  canDo: {},
  streak: { last: null, count: 0 },
  settings: { uiLang: "auto", rate: 0.9 },
  xp: 0,
  abzeichen: {},
  kompetenzLog: [],
};

export const TOTAL_DAYS = 270;
export const LEVEL_COLORS: Record<Phase, string> = {
  A1: "var(--color-a1)",
  A2: "var(--color-a2)",
  B1: "var(--color-b1)",
  B2: "var(--color-b2)",
  Abschluss: "var(--color-gold)",
};
