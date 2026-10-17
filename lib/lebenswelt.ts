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
  { id: "bs-sprache", titelAr: "أنهِ الألمانية العامة حتى B2", detailAr: "اتبع خطة الـ378 يومًا هنا واجتز اختبارات المراحل؛ شهادة Goethe/telc B2 هي قاعدة كل ما بعدها.", kartenId: undefined },
  { id: "bs-fach", titelAr: "ابنِ اللغة المهنية في محطة التمريض", detailAr: "115 كلمة مهنية و8 حوارات ومحاكاة طبية وبنك معرفة في هذه الأكاديمية (تدرّب ← ألمانية التمريض).", kartenId: undefined },
  { id: "bs-unterlagen", titelAr: "جهّز أوراق الاعتراف مترجمة ومصدّقة", detailAr: "شهادة التمريض وكشف الدرجات والسيرة — ترجمة محلفة (beglaubigt) قبل أيّ تقديم.", kartenId: "lw-03" },
  { id: "bs-antrag", titelAr: "قدّم طلب الاعتراف (Anerkennung)", detailAr: "لدى جهة ولايتك؛ القرار (Bescheid) يخبرك إن كنت جاهزًا أو تحتاج معادلة.", kartenId: "lw-03" },
  { id: "bs-ausgleich", titelAr: "اختر طريق المعادلة إن لزم", detailAr: "Kenntnisprüfung (اختبار معرفة) أو Anpassungslehrgang (تدريب تكييف بمستشفى) — وأحيانًا عمل كمساعد أثناء ذلك.", kartenId: "lw-03" },
  { id: "bs-bewerbung", titelAr: "قدّم على مستشفيات ودور رعاية", detailAr: "سيرة ذاتية ألمانية ورسالة قصيرة؛ كثير من جهات العمل تدعم الاعتراف نفسه وتوظّف أثناءه.", kartenId: "lw-05" },
  { id: "bs-vertrag", titelAr: "وقّع العقد وافهمه قبل التوقيع", detailAr: "راتب إجمالي، Probezeit، عطل، إضافات ورديات — لا توقيع متسرّع (بطاقة العقد).", kartenId: "lw-05" },
  { id: "bs-ankunft", titelAr: "نظّم الوصول: سكن وتأمين وتسجيل", detailAr: "Anmeldung خلال 14 يومًا، Krankenkasse، وحساب بنكي — البطاقات lw-01 وlw-04 وlw-08 ترشدك.", kartenId: "lw-01" },
];
