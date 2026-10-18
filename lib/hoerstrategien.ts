/**
 * 🎧 A8 (R292, Experten-Audit): Hörstrategien, ausdrücklich gelehrt —
 * قبل / أثناء / بعد. Keine Theorie-Wand: drei Phasen mit je drei
 * ausführbaren Schritten, die aktive Phase folgt dem Rundenzustand.
 */
export interface StrategiePhase {
  id: "vor" | "waehrend" | "nach";
  titelAr: string;
  schritte: string[];
}

export const HOERSTRATEGIEN: StrategiePhase[] = [
  {
    id: "vor",
    titelAr: "قبل الاستماع — هيّئ أذنك",
    schritte: [
      "اقرأ الأسئلة والخيارات أولًا — عقلك يبحث عمّا يعرف أنه سيأتي.",
      "توقّع نوع المعلومة: رقم؟ اسم؟ سبب؟ ثمّ استمع بحثًا عنه تحديدًا.",
      "نشّط مفردات الموضوع: تذكّر خمس كلمات تتوقع سماعها.",
    ],
  },
  {
    id: "waehrend",
    titelAr: "أثناء الاستماع — التقط ولا تتوقّف",
    schritte: [
      "التقط الكلمات المفتاحية والأرقام والأسماء — لا تترجم كل كلمة.",
      "كلمة فاتتك؟ اتركها وامضِ — التوقف عندها يسرق الجملة التالية.",
      "انتبه للروابط (zuerst, dann, aber, deshalb) — هي خريطة الكلام.",
    ],
  },
  {
    id: "nach",
    titelAr: "بعد الاستماع — ثبّت الدرس",
    schritte: [
      "افتح النص واقرأ فقط الجمل التي فاتتك — قارن ما سمعته بما هو مكتوب.",
      "ما سقط منك يذهب إلى دفتر الأخطاء تلقائيًا في المعمل — راجعه هناك.",
      "أعد سماع الجملة الصعبة وحدها بصوت عالٍ مرة واحدة (تظليل قصير).",
    ],
  },
];

export function strategiePhase(started: boolean, geprueft: boolean): StrategiePhase["id"] {
  if (geprueft) return "nach";
  if (started) return "waehrend";
  return "vor";
}
