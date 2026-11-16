import { bankRoh, beiBankenBereit } from "./bankload";

/**
 * 🌍 Lebenswelt & Anerkennung (R200) — الحياة في ألمانيا والاعتراف المهني:
 * بطاقات عملية (Ämter, تأمين, عقد, سكن, طوارئ) بعبارات جاهزة، ومسار Anerkennung
 * التمريض (Kenntnisprüfung/Anpassungslehrgang) قلبُ هدف المالك، + لغة شارع موسومة
 * بسياقها. توجيه عملي عام لا استشارة قانونية — الأرقام المتغيّرة (أسعار/مهل)
 * مُصاغة بتحفّظ صريح داخل النصوص نفسها.
 */
export interface LebensweltThema {
  id: string; titel: string; ar: string; textAr: string;
  saetze: { de: string; ar: string }[];
}
export interface UmgangsEintrag {
  de: string; ar: string; situationAr: string; bsp: string; bspAr: string;
}

export const lebensweltThemen: LebensweltThema[] = [];
export const umgangBank: UmgangsEintrag[] = [];

function fuelleLebenswelt(): void {
  const roh = bankRoh("lebenswelt.json") as { themen?: LebensweltThema[]; umgang?: UmgangsEintrag[] } | undefined;
  if (!roh) return;
  if (roh.themen?.length && lebensweltThemen.length === 0) lebensweltThemen.splice(0, 0, ...roh.themen);
  if (roh.umgang?.length && umgangBank.length === 0) umgangBank.splice(0, 0, ...roh.umgang);
}
fuelleLebenswelt();
beiBankenBereit(fuelleLebenswelt);

/**
 * 🚀 خطة البدء المهني (R203) — قائمة خطوات عملية من «أين أنا» إلى أول عقد عمل،
 * تُعلَّم محليًا بيد المتعلم نفسه (localStorage فقط، لا تدخل في تقدّم الخطة):
 * لغة B2 ← لغة مهنية ← اعتراف ← طلبات ← عقد. الترتيب إرشادي؛ المهل والتفاصيل
 * تختلف بحسب الولاية ونوع الإقامة، لذا تشير كل خطوة إلى بطاقتها المفصّلة.
 */
export interface BerufsstartSchritt {
  id: string; titelAr: string; detailAr: string; kartenId?: string;
}
export const BERUFSSTART_SCHRITTE: BerufsstartSchritt[] = [
  { id: "bs-sprache", titelAr: "تدرّب على وصف مستواك وهدفك اللغوي", detailAr: "استخدم الخطة لبناء الألمانية، ثم اسأل الجهة المختصة عن الشهادة والمستوى المطلوبين لحالتك؛ اختبارات التطبيق داخلية.", kartenId: undefined },
  { id: "bs-fach", titelAr: "ابنِ مفردات اللغة المهنية في محطة التمريض", detailAr: "تدرّب على الكلمات والحوارات والمحاكاة الخيالية، ولا تستعمل بنك المعرفة بديلاً عن تدريب مهني أو بروتوكول جهة عمل.", kartenId: undefined },
  { id: "bs-unterlagen", titelAr: "تدرّب على السؤال عن أوراق الاعتراف", detailAr: "حضّر أسئلة ألمانية عن الشهادة وكشف الدرجات والترجمة والتصديق؛ قائمة الوثائق الملزمة تُؤخذ من جهة الاعتراف الحالية.", kartenId: "lw-03" },
  { id: "bs-antrag", titelAr: "تدرّب على طلب معلومات عن Anerkennung", detailAr: "تعلّم كيف تسأل عن الجهة المسؤولة والطلب والقرار؛ لا تحدد البطاقة الجهة أو الإجراء القانوني لحالتك.", kartenId: "lw-03" },
  { id: "bs-ausgleich", titelAr: "تعلّم مفردات خيارات المعادلة", detailAr: "تعرّف لغوياً إلى Kenntnisprüfung وAnpassungslehrgang، ثم تحقق من الخيارات المتاحة فعلاً في قرار الجهة المختصة.", kartenId: "lw-03" },
  { id: "bs-bewerbung", titelAr: "تدرّب على لغة التقديم إلى جهة عمل", detailAr: "اكتب سيرة ورسالة تدريبية واسأل صاحب العمل عما يطلبه؛ الأمثلة لا تعد بتوظيف أو دعم للاعتراف.", kartenId: "lw-05" },
  { id: "bs-vertrag", titelAr: "تدرّب على أسئلة عقد العمل", detailAr: "تعلّم السؤال عن الراتب الإجمالي وProbezeit والعطل والورديات، واطلب شرحاً مختصاً قبل أي توقيع حقيقي.", kartenId: "lw-05" },
  { id: "bs-ankunft", titelAr: "تدرّب على أسئلة السكن والتأمين والتسجيل", detailAr: "استخدم البطاقات لصياغة الأسئلة فقط، وتحقق من المهل والوثائق الحالية لدى البلدية والتأمين والجهات المختصة.", kartenId: "lw-01" },
];
