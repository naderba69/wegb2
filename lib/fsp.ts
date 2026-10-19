/**
 * 🩺 A24 (R294, Experten-Audit): Ausrichtung an der Fachsprachenprüfung
 * Pflege/Medizin — ehrliche Landkarte: welcher echte Prüfungsteil
 * wird hier womit geübt, was fehlt bewusst. Die echten Formate ändern
 * sich; maßgeblich ist immer der aktuelle telc-/Kammer-Rahmen.
 */
export interface FspZeile {
  teilDe: string;
  teilAr: string;
  hierAr: string;
  status: "abgedeckt" | "teilweise" | "fehlt";
}

export const FSP_STATUS_AR: Record<FspZeile["status"], string> = {
  abgedeckt: "✅ مغطّى هنا",
  teilweise: "🟡 جزئيًا",
  fehlt: "⛔ غير متاح هنا",
};

export const FSP_AUSRICHTUNG: FspZeile[] = [
  { teilDe: "Lesen", teilAr: "قراءة مهنية (نصوص عمل وتقارير)", hierAr: "محاكاة Medizin بقراءات طبية وأسئلتها + مفردات المسار", status: "abgedeckt" },
  { teilDe: "Hören", teilAr: "استماع مهني (محادثات عمل وإعلانات)", hierAr: "بنود استماع المحاكاة بنصوصها المنطوقة آليًا — ليست تسجيلات امتحان حقيقية", status: "teilweise" },
  { teilDe: "Schreiben", teilAr: "كتابة مهنية (توثيق وتقارير ورسائل)", hierAr: "نماذج التوثيق (Pflegedokumentation) ومهام كتابة المحاكاة مع تصحيح محلي/اختياري", status: "teilweise" },
  { teilDe: "Sprechen — Patientengespräch", teilAr: "محادثة مريض (استقبال وشرح وتهدئة)", hierAr: "حوارات العمل وعبارات جانب السرير للحفظ والترديد — لا محاور بشري ولا تقييم نطق", status: "teilweise" },
  { teilDe: "Sprechen — Kollegengespräch / Übergabe", teilAr: "تسليم وردية ونقاش زملاء", hierAr: "سيناريوهات التفاوض والاجتماع (A7) بسياق عام + عبارات التسليم في المسار", status: "teilweise" },
  { teilDe: "Sprachbausteine", teilAr: "مفردات وقوالب لغوية دقيقة", hierAr: "قواعد الخطة العامة B2 ومفردات طبية متخصصة في المسار", status: "teilweise" },
  { teilDe: "Echte Prüfungssimulation unter Kammerbedingungen", teilAr: "محاكاة كاملة بشروط الجهة المنظّمة وتصحيح بشري", hierAr: "لا توجد هنا — محاكاتنا داخلية زمنية بلا مصحح بشري ولا شهادة", status: "fehlt" },
];
