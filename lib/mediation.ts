export type MediationLevel = "A2" | "B1" | "B2";
export type MediationCriterionId = "information" | "audience" | "strategy" | "clarity";
export type MediationPhase = "draft" | "review" | "saved";

export const MEDIATION_CRITERIA: Record<MediationCriterionId, { labelDe: string; labelAr: string; promptAr: string }> = {
  information: {
    labelDe: "Informationsauswahl",
    labelAr: "اختيار المعلومات",
    promptAr: "هل نقلت النقاط اللازمة للغرض من دون إضافة وقائع غير موجودة؟",
  },
  audience: {
    labelDe: "Adressatenbezug",
    labelAr: "مراعاة المتلقي",
    promptAr: "هل تناسب النبرة والشرح الشخص الذي سيقرأ أو يسمع المخرج؟",
  },
  strategy: {
    labelDe: "Vermittlungsstrategie",
    labelAr: "استراتيجية الوساطة",
    promptAr: "هل لخّصت أو بسّطت أو جمعت الآراء بدلاً من نسخ المدخل؟",
  },
  clarity: {
    labelDe: "Verständlichkeit und Aufbau",
    labelAr: "الوضوح والبناء",
    promptAr: "هل يستطيع المتلقي فهم الرسالة والخطوة التالية بوضوح؟",
  },
};

export interface MediationTask {
  id: string;
  level: MediationLevel;
  mode: string;
  titleDe: string;
  titleAr: string;
  inputLabelDe: string;
  inputLabelAr: string;
  inputDe: string;
  inputAr?: string;
  taskDe: string;
  taskAr: string;
  audienceAr: string;
  outputAr: string;
  wordGuide: readonly [number, number];
  scaffoldsDe: string[];
  keyPointsAr: string[];
  criteria: MediationCriterionId[];
  sampleDe: string;
  sampleAr?: string;
  sourceNoteAr: string;
  disclaimerAr?: string;
}

export interface MediationEntry {
  draft: string;
  revision: string;
  checkedCriteria: MediationCriterionId[];
  phase: MediationPhase;
  showModel: boolean;
  updatedAt?: string;
}

export type MediationProgress = Record<string, MediationEntry>;

const LEVELS: MediationLevel[] = ["A2", "B1", "B2"];
const CRITERIA = Object.keys(MEDIATION_CRITERIA) as MediationCriterionId[];
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
const isCriterionArray = (value: unknown): value is MediationCriterionId[] =>
  isStringArray(value) && value.every((item) => CRITERIA.includes(item as MediationCriterionId));

function parseTask(value: unknown): MediationTask | null {
  if (!isRecord(value)) return null;
  const requiredStrings = [
    "id", "mode", "titleDe", "titleAr", "inputLabelDe", "inputLabelAr", "inputDe",
    "taskDe", "taskAr", "audienceAr", "outputAr", "sampleDe", "sourceNoteAr",
  ] as const;
  if (!requiredStrings.every((key) => typeof value[key] === "string" && (value[key] as string).trim().length > 0)) return null;
  if (typeof value.level !== "string" || !LEVELS.includes(value.level as MediationLevel)) return null;
  if (!Array.isArray(value.wordGuide) || value.wordGuide.length !== 2 ||
      !value.wordGuide.every((n) => typeof n === "number" && Number.isInteger(n) && n > 0) ||
      (value.wordGuide[0] as number) >= (value.wordGuide[1] as number)) return null;
  if (!isStringArray(value.scaffoldsDe) || !isStringArray(value.keyPointsAr) || !isCriterionArray(value.criteria)) return null;
  if (value.inputAr !== undefined && typeof value.inputAr !== "string") return null;
  if (value.sampleAr !== undefined && typeof value.sampleAr !== "string") return null;
  if (value.disclaimerAr !== undefined && typeof value.disclaimerAr !== "string") return null;
  return value as unknown as MediationTask;
}

/** Reject malformed bank rows instead of rendering fields with the wrong language or direction. */
export function parseMediationBank(value: unknown): MediationTask[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseTask).filter((task): task is MediationTask => task !== null);
}

export const emptyMediationEntry = (): MediationEntry => ({
  draft: "",
  revision: "",
  checkedCriteria: [],
  phase: "draft",
  showModel: false,
});

function parseEntry(value: unknown): MediationEntry | null {
  if (!isRecord(value) || typeof value.draft !== "string" || typeof value.revision !== "string" ||
      !isCriterionArray(value.checkedCriteria) || !["draft", "review", "saved"].includes(String(value.phase)) ||
      typeof value.showModel !== "boolean") return null;
  return {
    draft: value.draft,
    revision: value.revision,
    checkedCriteria: [...new Set(value.checkedCriteria)],
    phase: value.phase as MediationPhase,
    showModel: value.showModel,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
  };
}

export function parseMediationProgress(value: unknown, taskIds: ReadonlySet<string>): MediationProgress {
  if (!isRecord(value)) return {};
  const progress: MediationProgress = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!taskIds.has(id)) continue;
    const entry = parseEntry(raw);
    if (entry) progress[id] = entry;
  }
  return progress;
}

export function mediationStorageKey(profileProgressKey: string): string {
  return `${profileProgressKey}:mediation-v2`;
}

export function zaehleMediationWoerter(text: string): number {
  return text.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

/** Structural revision prompts only; never labels language performance as correct or CEFR-rated. */
export function mediationFeedback(task: MediationTask, draft: string, checked: readonly MediationCriterionId[]): string[] {
  const words = zaehleMediationWoerter(draft);
  const [min, max] = task.wordGuide;
  const hints: string[] = [];
  if (words < min) hints.push(`المسودة ${words} كلمة؛ النطاق التدريبي المقترح ${min}–${max}. راجع إن كانت نقاط المدخل اللازمة ناقصة.`);
  else if (words > max) hints.push(`المسودة ${words} كلمة؛ النطاق التدريبي المقترح ${min}–${max}. احذف التكرار والتفاصيل غير اللازمة للمتلقي.`);
  else hints.push(`طول المسودة ${words} كلمة، داخل النطاق التدريبي المقترح. الطول وحده لا يعني جودة الأداء.`);
  for (const criterion of task.criteria) {
    if (!checked.includes(criterion)) hints.push(`راجع «${MEDIATION_CRITERIA[criterion].labelAr}»: ${MEDIATION_CRITERIA[criterion].promptAr}`);
  }
  if (task.criteria.every((criterion) => checked.includes(criterion))) {
    hints.push("علّمتَ محاور المراجعة الأربعة. قارن الآن بالنقاط الأساسية ثم اكتب نسخة ثانية؛ هذه مراجعة ذاتية وليست تصحيحاً آلياً.");
  }
  return hints;
}

export function mediationKannSpeichern(task: MediationTask, entry: MediationEntry): boolean {
  return entry.phase === "review" &&
    task.criteria.every((criterion) => entry.checkedCriteria.includes(criterion)) &&
    zaehleMediationWoerter(entry.revision) >= 5;
}
