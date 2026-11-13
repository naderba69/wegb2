import { isDue } from "./srs";
import { kompetenzWerte, KOMPETENZEN, KOMPETENZ_AR } from "./kompetenz";
import { LERNZIEL_LABEL, TEMPO_LABEL } from "./types";
import type { Kompetenz, Lernziel, Progress, Tempo } from "./types";

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
  | "selbsttest"
  | "hoeren"
  | "lesestoff"
  | "briefe"
  | "muendlich"
  | "uebungen"
  | "vollpruefung"
  | "pflege"
  | "leben"
  | "interview"
  | "blitz";

export type UebungsSignal =
  | "placement"
  | "lesson-extra"
  | "due-errors"
  | "due-cards"
  | "weak-skill"
  | "learning-profile"
  | "retrieval-practice"
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

const STATION_FUER_LERNZIEL: Partial<Record<Lernziel, UebungsStationId>> = {
  bamf: "leben",
  pflege: "pflege",
  studium: "lesestoff",
  arbeit: "interview",
};

/** فرق أيام تقويمي محلي؛ التاريخ الفاسد لا يتحول إلى استعجال وهمي. */
function tageBisPruefung(raw: string | undefined, now: Date): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw ?? "");
  if (!match) return null;
  const jahr = Number(match[1]);
  const monat = Number(match[2]);
  const tag = Number(match[3]);
  const ziel = Date.UTC(jahr, monat - 1, tag);
  const kontrollDatum = new Date(ziel);
  if (kontrollDatum.getUTCFullYear() !== jahr || kontrollDatum.getUTCMonth() !== monat - 1 || kontrollDatum.getUTCDate() !== tag) return null;
  const heute = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((ziel - heute) / 86_400_000);
}

function terminMesswert(tage: number | null, name: string | undefined): string {
  if (tage === null) return "بلا موعد امتحان صالح";
  const titel = name?.trim() ? `موعد ${name.trim()}` : "موعد الامتحان";
  if (tage === 0) return `${titel}: اليوم`;
  if (tage > 0) return `${titel}: بعد ${tage} يوماً`;
  return `${titel}: مضى منذ ${Math.abs(tage)} يوماً`;
}

/**
 * يحوّل اختيارات المتعلم المعلنة إلى إشارة واحدة قابلة للتفسير. الموعد
 * القريب يرفع تدريب الامتحان الداخلي الاختياري فقط؛ لا يضغط الخطة ولا
 * يحذف تغطية، وإيقاع البطاقات ظاهر في السبب لكنه لا يُعاد تفسيره كوقت دراسة.
 */
function lernprofilEmpfehlung(p: Progress, now: Date): UebungsEmpfehlung | null {
  const ziel = p.settings.lernziel;
  const tage = tageBisPruefung(p.settings.examDate, now);
  const hatKommendenTermin = tage !== null && tage >= 0;
  const station = hatKommendenTermin
    ? "vollpruefung"
    : ziel ? STATION_FUER_LERNZIEL[ziel] : undefined;
  if (!station) return null;

  const effektivesZiel = ziel ?? "allgemein";
  const tempo: Tempo = p.settings.tempo in TEMPO_LABEL ? p.settings.tempo : "regelmaessig";
  let prioritaet = hatKommendenTermin ? 52 : 46;
  if (tage !== null && tage >= 0 && tage <= 30) prioritaet = 60;
  else if (tage !== null && tage >= 0 && tage <= 90) prioritaet = 56;

  return {
    station,
    signal: "learning-profile",
    prioritaet,
    grundAr: hatKommendenTermin
      ? "الموعد يرفع تدريباً امتحانياً داخلياً اختيارياً فقط؛ لا يضغط الخطة ولا يحذف تغطيتها، ونتيجته ليست رسمية."
      : "هذه مطابقة محلية لاختيارك مع محطة موجودة؛ ليست حكماً على مستواك ولا دليلاً على تحسن التعلم.",
    messwertAr: `الهدف المعلن: ${LERNZIEL_LABEL[effektivesZiel].ar} · إيقاع البطاقات: ${TEMPO_LABEL[tempo].ar} · ${terminMesswert(tage, p.settings.examName)}`,
  };
}

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
    // لا يدخل النشاط أو التقييم الذاتي: يلزم ثمانية أدلة measured مؤهلة.
    .filter((entry): entry is typeof entry & { wert: number } => entry.wert !== null)
    .sort((a, b) => a.wert - b.wert || a.hand.localeCompare(b.hand));
  const first = beobachtet[0];
  return first ? { hand: first.hand, wert: first.wert, versuche: first.measured } : null;
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
      grundAr: "ابدأ بفرز دخول محافظ للقراءة والسماع والقواعد والمفردات قبل تدريب عشوائي؛ لا يقيس الإنتاج أو CEFR.",
      messwertAr: "لا يوجد فرز دخول استقبالي مطبّق بعد",
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

  const lernprofil = lernprofilEmpfehlung(p, now);
  if (lernprofil) kandidaten.push(lernprofil);

  kandidaten.push({
    station: "selbsttest",
    signal: "retrieval-practice",
    prioritaet: 50,
    grundAr: "استرجع من الذاكرة بلا خيارات قبل إعادة القراءة، ثم قارن بعد التسليم.",
    messwertAr: "3 أنماط: استرجاع حر، فجوات، وتداخل",
  });

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
