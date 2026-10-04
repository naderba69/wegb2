import type { DayPlan, Level, Progress } from "./types";
import { TOTAL_DAYS, emptyProgress } from "./types";
import { buildDay, COURSE_TOPIC_ORDER, MODULE, type Modul } from "./plan";
import { ABSCHLUSS_VON, PHASEN } from "./phasen";

export interface CurriculumLevel {
  level: Level;
  from: number;
  to: number;
  titleAr: string;
  summaryAr: string;
}

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  { level: "A0", from: PHASEN.A0.von, to: PHASEN.A0.bis, titleAr: "التهيئة", summaryAr: "الأبجدية والأصوات والتحيات والبدايات الأولى." },
  { level: "A1", from: PHASEN.A1.von, to: PHASEN.A1.bis, titleAr: "الأساسيات", summaryAr: "الجمل اليومية، الضمائر، الأزمنة والحالات الأساسية." },
  { level: "A2", from: PHASEN.A2.von, to: PHASEN.A2.bis, titleAr: "التوسّع", summaryAr: "السرد والوصف والروابط والمواقف اليومية الأكثر تنوعاً." },
  { level: "B1", from: PHASEN.B1.von, to: PHASEN.B1.bis, titleAr: "الاستقلال", summaryAr: "التعبير عن الرأي والعمل والقراءة والكتابة باستقلال أكبر." },
  { level: "B2", from: PHASEN.B2.von, to: PHASEN.B2.bis, titleAr: "الإتقان المتقدم", summaryAr: "النقاش والنصوص المركبة والأسلوب الرسمي والدقة." },
];

export interface CurriculumSection {
  id: string;
  level: Level;
  from: number;
  to: number;
  titleAr: string;
  titleDe: string;
  descriptionAr: string;
  kind: "unit" | "final";
  unit?: Modul;
}

export const CURRICULUM_SECTIONS: CurriculumSection[] = [
  ...MODULE.map((unit) => ({
    id: `unit-${unit.level}-${unit.nr}`,
    level: unit.level,
    from: unit.von,
    to: unit.bis,
    titleAr: unit.titelAr,
    titleDe: unit.titelDe,
    descriptionAr: unit.inhalteAr,
    kind: "unit" as const,
    unit,
  })),
  {
    id: "finale-375-378",
    level: "B2",
    from: ABSCHLUSS_VON,
    to: TOTAL_DAYS,
    titleAr: "الختام الشامل",
    titleDe: "Abschluss",
    descriptionAr: "375 مراجعة الرحلة · 376 استماع وقراءة وكتابة وتحدّث · 377 إنتاج ختامي · 378 فحص وحصيلة وخطوة تالية.",
    kind: "final",
  },
];

export function curriculumSectionForDay(day: number): CurriculumSection | undefined {
  return CURRICULUM_SECTIONS.find((section) => day >= section.from && day <= section.to);
}

/**
 * يبني يوماً للاستكشاف فقط: يعيد الخطة ومجموعته من المصدر نفسه المستخدم في «اليوم»؛
 * لا يكتب إلى Progress ولا يقدّم رقم اليوم.
 */
export function buildCurriculumDay(day: number, progress: Progress = emptyProgress): {
  plan: DayPlan;
  section: CurriculumSection | undefined;
} {
  return { plan: buildDay(day, progress), section: curriculumSectionForDay(day) };
}

export { COURSE_TOPIC_ORDER };
