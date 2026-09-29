import type { UiLang, Progress } from "./types";

/**
 * التدرّج اللغوي حسب الخطة: عربي (A1/A2) ← مختلط (B1) ← ألمانية كاملة (B2).
 * auto = يتبع يومك الحالي، ويمكن التجاوز يدوياً من الإعدادات.
 */
export function effectiveLang(progress: Progress): UiLang {
  const setting = progress.settings.uiLang;
  if (setting !== "auto") return setting;
  const day = progress.plan?.day ?? 1;
  if (day >= 211) return "de"; // B2 — غمر كامل
  if (day >= 141) return "mix"; // B1 — مختلط
  return "ar"; // A1/A2 — سند عربي
}

type Dict = Record<string, { ar: string; de: string; hint?: string }>;

const dict: Dict = {
  appTitle: { ar: "طريقي إلى B2", de: "Mein Weg bis B2" },
  appSub: { ar: "المدرّس الافتراضي الوحيد — من الصفر إلى B2", de: "Dein virtueller Lehrer — von Null bis B2" },
  navDashboard: { ar: "لوحة اليوم", de: "Heute" },
  navCourse: { ar: "المسار", de: "Kurs" },
  navReview: { ar: "المراجعات", de: "Wiederholen" },
  navExam: { ar: "الامتحانات", de: "Prüfungen" },
  navProgress: { ar: "التقدّم", de: "Fortschritt" },
  navSettings: { ar: "الإعدادات", de: "Einstellungen" },
  navPlacement: { ar: "اختبار تحديد المستوى", de: "Einstufungstest" },
  start: { ar: "ابدأ الآن", de: "Jetzt starten" },
  next: { ar: "التالي", de: "Weiter" },
  prev: { ar: "السابق", de: "Zurück" },
  check: { ar: "تحقّق", de: "Prüfen" },
  reveal: { ar: "أظهر الإجابة", de: "Antwort zeigen" },
  done: { ar: "تمّ الدرس", de: "Lektion abschließen" },
  score: { ar: "النتيجة", de: "Ergebnis" },
  of: { ar: "من", de: "von" },
  streak: { ar: "أيام متتالية", de: "Lerntage in Folge" },
  due: { ar: "بطاقات مستحقّة اليوم", de: "Karten heute fällig" },
  todayPlan: { ar: "خطة اليوم", de: "Heutiger Plan" },
  level: { ar: "المستوى", de: "Niveau" },
  lesson: { ar: "درس", de: "Lektion" },
  unit: { ar: "وحدة", de: "Kapitel" },
  min: { ar: "د", de: "Min." },
  canDo: { ar: "أستطيع أن…", de: "Ich kann…" },
  grammar: { ar: "القواعد", de: "Grammatik" },
  vocab: { ar: "المفردات", de: "Wortschatz" },
  listen: { ar: "الاستماع", de: "Hören" },
  read: { ar: "القراءة", de: "Lesen" },
  write: { ar: "الكتابة", de: "Schreiben" },
  speak: { ar: "التحدث", de: "Sprechen" },
  exercises: { ar: "تمارين", de: "Übungen" },
  langBanner: {
    ar: "واجهتك عربية الآن — ستنقلب تدريجياً إلى الألمانية كلّما تقدّمت نحو B2",
    hint: "Die Oberfläche wechselt mit deinem Niveau allmählich ins Deutsche",
    de: "Mit deinem Niveau wird die Oberfläche allmählich deutsch",
  },
  notFound: { ar: "الدرس غير موجود", de: "Lektion nicht gefunden" },
  outlineNote: {
    ar: "مخطط الدرس جاهز — المحتوى التفاعلي يُضاف تدريجياً. تستطيع البدء بالموارد المرتبطة.",
    de: "Die Lektion ist geplant — interaktive Inhalte folgen nach und nach.",
  },
};

/** اختر النص حسب اللغة الفعّالة */
export function t(key: keyof typeof dict, lang: UiLang): string {
  const e = dict[key];
  if (!e) return key;
  if (lang === "de") return e.de;
  if (lang === "mix") return e.hint ? `${e.de} · ${e.ar}` : `${e.de} (${e.ar})`;
  return e.ar;
}

/** عنوان ثنائي: ألماني + عربي حسب اللغة */
export function bilingual(de: string, ar: string, lang: UiLang): { primary: string; secondary?: string } {
  if (lang === "de") return { primary: de };
  if (lang === "mix") return { primary: de, secondary: ar };
  return { primary: ar, secondary: de };
}

export const LANG_LABEL: Record<UiLang, string> = {
  ar: "العربية",
  mix: "مختلط (DE+AR)",
  de: "Deutsch",
};
