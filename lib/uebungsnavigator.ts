import { isDue } from "./srs";
import { kompetenzWerte, KOMPETENZEN, KOMPETENZ_AR, pruefungsBereitschaft } from "./kompetenz";
import type { Kompetenz, Progress } from "./types";

/**
 * محرك محلي شفاف لترتيب محطات التدريب الاختيارية بعد إغلاق اليوم.
 * لا يغيّر خطة 378 يوماً، ولا يفتح محطة مقفلة، ولا يدّعي تكيفاً تعليمياً
 * مثبتاً؛ هو يجمع إشارات المحركات الحية ويعرض السبب نفسه للمتعلم.
 */
export type UebungsStationId =
  | "einstufung"
  | "zusatz"
  | "fehlerlabor"
  | "wortreview"
  | "hoeren"
  | "lesestoff"
  | "briefe"
  | "muendlich"
  | "uebungen"
  | "vollpruefung"
  | "blitz";

export type UebungsSignal =
  | "placement"
  | "lesson-extra"
  | "due-errors"
  | "due-cards"
  | "weak-skill"
  | "exam-practice"
  | "quick-fallback";

export interface UebungsEmpfehlung {
  station: UebungsStationId;
  signal: UebungsSignal;
  prioritaet: number;
  grundAr: string;
  messwertAr: string;
}

export interface UebungsNavigatorOptionen {
  hatZusatz?: boolean;
  now?: Date;
  limit?: number;
}

const STATION_FUER_KOMPETENZ: Record<Kompetenz, UebungsStationId> = {
  Lesen: "lesestoff",
  Hoeren: "hoeren",
  Schreiben: "briefe",
  Sprechen: "muendlich",
  Grammatik: "uebungen",
  Wortschatz: "wortreview",
};

function faelligeSrsAnzahl(p: Progress, now: Date): number {
  return Object.values(p.srs ?? {}).filter((state) => state.reps > 0 && isDue(state, now)).length;
}

function faelligeFehlerAnzahl(p: Progress, now: Date): number {
  return Object.values(p.fehler ?? {}).filter((entry) => isDue(entry.srs, now)).length;
}

function schwaechsteBeobachteteKompetenz(p: Progress): { hand: Kompetenz; wert: number; versuche: number } | null {
  const werte = kompetenzWerte(p);
  const beobachtet = KOMPETENZEN
    .map((hand) => ({ hand, ...werte[hand] }))
    // ثماني محاولات هي الحد الذي يبدأ عنده kompetenzWerte حساب النواة الحديثة.
    .filter((entry) => entry.versuche >= 8)
    .sort((a, b) => a.wert - b.wert || a.hand.localeCompare(b.hand));
  return beobachtet[0] ?? null;
}

/**
 * يعيد ثلاث توصيات على الأكثر. الترتيب حتمي ومعلن، وتزال المحطة المكررة
 * مع إبقاء الإشارة الأعلى أولوية. لا تُحفظ التوصيات ولا تُرسل إلى شبكة.
 */
export function baueUebungsEmpfehlungen(
  p: Progress,
  optionen: UebungsNavigatorOptionen = {},
): UebungsEmpfehlung[] {
  const now = optionen.now ?? new Date();
  const limit = Math.max(1, Math.min(3, Math.floor(optionen.limit ?? 3)));
  const kandidaten: UebungsEmpfehlung[] = [];

  if (optionen.hatZusatz) {
    kandidaten.push({
      station: "zusatz",
      signal: "lesson-extra",
      prioritaet: 100,
      grundAr: "أكمل التمارين المرحّلة من درس اليوم قبل فتح موضوع بعيد.",
      messwertAr: "بقي تدريب إضافي من درس اليوم",
    });
  }

  if (p.settings.placed !== true) {
    kandidaten.push({
      station: "einstufung",
      signal: "placement",
      prioritaet: 96,
      grundAr: "ابدأ بتقدير نقطة دخول محافظة قبل أن تختار تدريباً عشوائياً.",
      messwertAr: "لا يوجد تشخيص مستوى مطبّق بعد",
    });
  }

  const fehler = faelligeFehlerAnzahl(p, now);
  if (fehler > 0) {
    kandidaten.push({
      station: "fehlerlabor",
      signal: "due-errors",
      prioritaet: 90 + Math.min(5, fehler),
      grundAr: "الأخطاء المستحقة مرتبطة بمحاولاتك الفعلية؛ عالجها قبل تدريب عام جديد.",
      messwertAr: `${fehler} ${fehler === 1 ? "خطأ مستحق" : "أخطاء مستحقة"}`,
    });
  }

  const karten = faelligeSrsAnzahl(p, now);
  if (karten > 0) {
    kandidaten.push({
      station: "wortreview",
      signal: "due-cards",
      prioritaet: 80 + Math.min(5, karten),
      grundAr: "بطاقات موعدها اليوم؛ راجعها من الذاكرة قبل إضافة بطاقات أخرى.",
      messwertAr: `${karten} ${karten === 1 ? "بطاقة مستحقة" : "بطاقات مستحقة"}`,
    });
  }

  const schwach = schwaechsteBeobachteteKompetenz(p);
  if (schwach) {
    kandidaten.push({
      station: STATION_FUER_KOMPETENZ[schwach.hand],
      signal: "weak-skill",
      prioritaet: 70 + Math.min(9, Math.floor((100 - schwach.wert) / 10)),
      grundAr: "هذه أضعف مهارة ملاحظة في محاولاتك الأخيرة؛ التوصية تدريب اختياري لا حكم مستوى.",
      messwertAr: `${KOMPETENZ_AR[schwach.hand]}: ${schwach.wert}/100 من ${schwach.versuche} محاولات`,
    });
  }

  const bereit = pruefungsBereitschaft(p).gesamt;
  if (p.settings.placed === true && bereit >= 65) {
    kandidaten.push({
      station: "vollpruefung",
      signal: "exam-practice",
      prioritaet: 60,
      grundAr: "لديك أساس يسمح بجولة تدريب داخلية تجمع المهارات؛ النتيجة ليست رسمية.",
      messwertAr: `مؤشر الجاهزية الداخلي: ${bereit}/100`,
    });
  }

  kandidaten.push({
    station: "blitz",
    signal: "quick-fallback",
    prioritaet: 10,
    grundAr: "لا توجد إشارة أقوى الآن؛ ابدأ بجولة قصيرة ثم اختر محطة أخرى إن شئت.",
    messwertAr: "جولة قصيرة بلا تعديل للخطة",
  });

  const nachStation = new Map<UebungsStationId, UebungsEmpfehlung>();
  for (const kandidat of kandidaten) {
    const alt = nachStation.get(kandidat.station);
    if (!alt || kandidat.prioritaet > alt.prioritaet) nachStation.set(kandidat.station, kandidat);
  }

  return [...nachStation.values()]
    .sort((a, b) => b.prioritaet - a.prioritaet || a.station.localeCompare(b.station))
    .slice(0, limit);
}
