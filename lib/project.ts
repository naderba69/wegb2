/**
 * 050 Project — مشروع قصير
 * مشروع أسبوعي: ملصق، عرض، بحث صغير. يُحفظ في Portfolio.
 */
export interface Projekt { id: string; titelDe: string; titelAr: string; level: string; dauerTage: number; schritte: string[]; }
export const PROJEKTE: Projekt[] = [
  { id: "proj-01", titelDe: "Mein Stadtteil vorstellen", titelAr: "اعرض حيّك", level: "A2", dauerTage: 7, schritte: ["صور", "نص 80 كلمة", "عرض شفهي"] },
  { id: "proj-02", titelDe: "Umfrage Umwelt", titelAr: "استطلاع بيئة", level: "B1", dauerTage: 7, schritte: ["أسئلة", "مقابلات 3", "نتائج"] },
  { id: "proj-03", titelDe: "Mini-Firma gründen", titelAr: "أسس شركة مصغرة", level: "B2", dauerTage: 14, schritte: ["فكرة", "خطة", "عرض"] },
];
export function projektFuerLevel(level: string): Projekt | undefined { return PROJEKTE.find(p=>p.level===level); }
