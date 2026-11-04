import type { Level } from "./types";

export type LessonSceneKind =
  | "sound"
  | "time"
  | "route"
  | "question"
  | "people"
  | "transform"
  | "link"
  | "speech"
  | "pattern";

export interface LessonSceneModel {
  kind: LessonSceneKind;
  labelAr: string;
  altAr: string;
  seed: number;
  variant: number;
  signature: string;
  markers: Array<{ x: number; y: number; size: number }>;
}

const KIND_LABELS: Record<LessonSceneKind, string> = {
  sound: "اسمع الصوت واربطه بالرمز",
  time: "ضع الحدث على خطّ الزمن",
  route: "تتبّع المسار والعلاقة المكانية",
  question: "ابدأ من المعلومة التي تريدها",
  people: "اربط الشخص بالشكل النحوي المناسب",
  transform: "راقب تحوّل البناء مع بقاء المعنى",
  link: "صِل كتل الجملة واحفظ موقع الفعل",
  speech: "اختر الصيغة المناسبة للمقام والمتكلّم",
  pattern: "ابحث عن النمط بين وحدات الجملة",
};

const KIND_PATTERNS: Array<[LessonSceneKind, RegExp]> = [
  ["sound", /aussprache|alphabet|buchstab|vokal|umlaut|laut|phonetik/],
  ["time", /zeit|uhr|zahl|präsens|perfekt|präteritum|plusquam|futur|tempus|partizip ii/],
  ["route", /präposition|wechsel|lokal|richtung|weg|beweg|wohin|wo\b|verschmolz/],
  ["question", /frage|interrog|wasfür|was-für|was für|welch|indirekte-fragen/],
  ["transform", /passiv|nominal|partizipial|wortbildung|funktionsverb|fvg|umform/],
  ["link", /satz|konnektor|weil|dass|obwohl|relativ|infinitiv|bedingung|nebensatz|zweiteilig/],
  ["speech", /rede|imperativ|modal|höflich|konjunktiv|begrü|du-sie|du & sie|aufforder/],
  ["people", /pronomen|artikel|sein|haben|plural|deklination|adjektiv|kasus|akkusativ|dativ|genitiv|possessiv/],
];

function hashTopic(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function sceneKind(topicId: string, titleDe: string): LessonSceneKind {
  const haystack = `${topicId} ${titleDe}`.toLocaleLowerCase("de-DE");
  return KIND_PATTERNS.find(([, pattern]) => pattern.test(haystack))?.[0] ?? "pattern";
}

/**
 * يبني وصفاً بصرياً حتمياً من هوية الدرس نفسها. لا صور خارجية ولا شبكة؛
 * الإحداثيات المختلفة تجعل لكل موضوع توقيعاً مستقلاً مع بقاء الرسم هادئاً.
 */
export function lessonSceneFor(topicId: string, titleDe: string, level: Level): LessonSceneModel {
  const seed = hashTopic(topicId);
  const kind = sceneKind(topicId, titleDe);
  const markerCount = 3 + (seed % 3);
  const markers = Array.from({ length: markerCount }, (_, index) => {
    const shift = (index * 5) % 24;
    return {
      x: 22 + ((seed >>> shift) % 274),
      y: 12 + ((seed >>> ((shift + 9) % 24)) % 84),
      size: 2 + ((seed >>> ((shift + 15) % 24)) % 4),
    };
  });
  return {
    kind,
    labelAr: KIND_LABELS[kind],
    altAr: `مشهد بصري رمزي لدرس ${titleDe} في المستوى ${level}: ${KIND_LABELS[kind]}.`,
    seed,
    variant: seed % 5,
    signature: `${topicId}:${kind}:${seed.toString(36)}`,
    markers,
  };
}
