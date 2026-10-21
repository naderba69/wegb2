/**
 * 049 Case Study — دراسة حالة
 * تحليل موقف واقعي (نزاع شرفة، شكوى سكن) ثم اقتراح حل لغوياً.
 */
export interface FallStudie { id: string; titelDe: string; titelAr: string; level: string; kontextDe: string; frageDe: string; frageAr: string; }
export const FALL_STUDIEN: FallStudie[] = [
  { id: "fall-01", titelDe: "Streit am Balkon", titelAr: "نزاع الشرفة", level: "B1", kontextDe: "Nachbar beschwert sich über Lärm vom Balkon.", frageDe: "Was würdest du sagen?", frageAr: "ماذا تقول للجار؟" },
  { id: "fall-02", titelDe: "Mietvertrag prüfen", titelAr: "مراجعة عقد الإيجار", level: "B2", kontextDe: "Im Vertrag steht eine unverständliche Klausel.", frageDe: "Wie klärst du das?", frageAr: "كيف تستوضح البند؟" },
];
export function fallFuerLevel(level: string): FallStudie | undefined { return FALL_STUDIEN.find(f=>f.level===level); }
