/**
 * 038 CLIL — تعلم المحتوى واللغة معاً
 * درس لغة حول موضوع علمي/مهني.
 */
export interface ClilEinheit { id: string; fach: string; themaDe: string; themaAr: string; level: string; }
export const CLIL: ClilEinheit[] = [
  { id: "clil-01", fach: "Umwelt", themaDe: "Klimawandel verstehen", themaAr: "فهم تغير المناخ", level: "B1" },
  { id: "clil-02", fach: "Gesundheit", themaDe: "Immunsystem erklären", themaAr: "شرح المناعة", level: "B2" },
];
export function clilFuer(level: string): ClilEinheit | undefined { return CLIL.find(c=>c.level===level); }
