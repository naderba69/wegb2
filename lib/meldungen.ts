/**
 * 📣 M17 (R291, Experten-Audit): رسائل الخطأ والفراغ — مرّة واحدة،
 * بفعلٍ واحدٍ واضح: ما حدث + ما تفعله الآن.
 * كل رسالة واجهة فارغة/خطأ تمرّ من هنا بدل صيغ متناثرة.
 */
export type MeldungsKey =
  | "text-fehlt"
  | "dialog-fehlt"
  | "regel-fehlt"
  | "deck-fehlt"
  | "schreiben-fehlt"
  | "allgemein";

export const MELDUNGEN: Record<MeldungsKey, { titel: string; aktion: string }> = {
  "text-fehlt": {
    titel: "نصّ القراءة غير متاح في هذه النسخة.",
    aktion: "أكمل المهمة التالية من خطة اليوم — يومك لا يضيع.",
  },
  "dialog-fehlt": {
    titel: "هذا الحوار غير متاح في هذه النسخة.",
    aktion: "أكمل المهمة التالية من خطة اليوم — يومك لا يضيع.",
  },
  "regel-fehlt": {
    titel: "درس القاعدة هذا غير متاح في هذه النسخة.",
    aktion: "أكمل المهمة التالية من خطة اليوم — يومك لا يضيع.",
  },
  "deck-fehlt": {
    titel: "حزمة البطاقات هذه غير متاحة في هذه النسخة.",
    aktion: "أكمل المهمة التالية من خطة اليوم — يومك لا يضيع.",
  },
  "schreiben-fehlt": {
    titel: "مهمة الكتابة هذه غير متاحة في هذه النسخة.",
    aktion: "أكمل المهمة التالية من خطة اليوم — يومك لا يضيع.",
  },
  "allgemein": {
    titel: "هذا المحتوى غير متاح في هذه النسخة.",
    aktion: "أكمل المهمة التالية — يومك لا يضيع.",
  },
};

export function meldung(key: MeldungsKey): { titel: string; aktion: string } {
  return MELDUNGEN[key];
}
