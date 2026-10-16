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
