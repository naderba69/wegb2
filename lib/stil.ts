/**
 * ═══════════════════════════════════════════════════════════════════
 *  🎚️ مبدّل الأسلوب — Verbalstil ⇄ Nominalstil
 * ═══════════════════════════════════════════════════════════════════
 *  B2 الكتابي (Goethe Schreiben Teil 1، telc Schriftlicher Ausdruck) يُقيَّم
 *  جزئياً على «Register»: هل تستطيع أن تقول الشيء نفسه بجملةٍ فرعيةٍ عاديةٍ
 *  وبعبارةٍ اسميةٍ رسمية؟ الآلية واحدة في الاتجاهين:
 *      weil + Nebensatz   ⇄  wegen + Genitiv
 *      wenn/als           ⇄  bei + Dativ
 *      nachdem / bevor    ⇄  nach / vor + Dativ
 *      obwohl             ⇄  trotz + Genitiv
 *      damit / um…zu      ⇄  zu / zur / zum + Nominalisierung
 *      indem              ⇄  durch + Akkusativ
 *      Verb               ⇄  -ung / substantivierter Infinitiv (das Lesen)
 *
 *  هذا الملف بنكُ أزواجٍ موسومٍ بالقاعدة، لا مُولِّدٌ آليٌّ: تحويلُ الجمل
 *  الحرّة آلياً يُنتج ألمانيةً خاطئةً (الجنس، الحالة، الفاعل المحذوف)، والمشروع
 *  لا يعرض على المتعلّم إلا ما يستطيع أن يضمنه. الأزواج مشتقّةٌ عمداً من
 *  حقول المستوى B1/B2 في الخطة (عمل · بيئة · دراسة · صحة · مجتمع).
 * ═══════════════════════════════════════════════════════════════════
 */

import type { Exercise } from "./types";

export type StilRegel = "weil-wegen" | "wenn-bei" | "nachdem-nach" | "bevor-vor" | "obwohl-trotz" | "damit-zu" | "indem-durch" | "verb-nomen";

export const REGEL_AR: Record<StilRegel, { titel: string; verbal: string; nominal: string; hinweis: string }> = {
  "weil-wegen":   { titel: "سبب",       verbal: "weil + Nebensatz",       nominal: "wegen + Genitiv",            hinweis: "الفاعل يصبح مضافاً إليه (Genitiv): weil die Kosten steigen → wegen der steigenden Kosten" },
  "wenn-bei":     { titel: "شرط/زمن",   verbal: "wenn/als + Nebensatz",   nominal: "bei + Dativ",                hinweis: "bei + Dativ يجمع الشرط والزمن معاً: wenn man raucht → beim Rauchen" },
  "nachdem-nach": { titel: "بعد",       verbal: "nachdem + Nebensatz",    nominal: "nach + Dativ",               hinweis: "الفعل يتحوّل إلى اسم مؤنّث بـ-ung أو مصدر مُسمّى: nachdem er angekommen war → nach seiner Ankunft" },
  "bevor-vor":    { titel: "قبل",       verbal: "bevor + Nebensatz",      nominal: "vor + Dativ",                hinweis: "vor + Dativ: bevor die Prüfung beginnt → vor Beginn der Prüfung" },
  "obwohl-trotz": { titel: "تناقض",     verbal: "obwohl + Nebensatz",     nominal: "trotz + Genitiv",            hinweis: "trotz + Genitiv (في الكلام يشيع Dativ، وفي الامتحان اكتب Genitiv)" },
  "damit-zu":     { titel: "غاية",      verbal: "damit / um … zu",        nominal: "zu / zur / zum + Nomen",      hinweis: "zur + مؤنث، zum + مذكر/محايد: um Energie zu sparen → zur Energieeinsparung" },
  "indem-durch":  { titel: "وسيلة",     verbal: "indem + Nebensatz",      nominal: "durch + Akkusativ",          hinweis: "durch + Akkusativ: indem man recycelt → durch Recycling" },
  "verb-nomen":   { titel: "فعل ⇄ اسم", verbal: "Verb im Satz",           nominal: "-ung / das + Infinitiv",      hinweis: "الأسماء بـ-ung مؤنّثة دائماً؛ المصدر المُسمّى محايد دائماً (das Lernen)" },
};

export interface StilPaar {
  id: string;
  regel: StilRegel;
  /** الأسلوب الفعلي (جملة فرعية) */
  verbal: string;
  /** الأسلوب الاسمي (رسمي) */
  nominal: string;
  ar: string;
  /** ما يجب أن يظهر في التحويل إلى الاسمي / إلى الفعلي (حروف صغيرة) */
  nominalMuss: string[];
  verbalMuss: string[];
  /** ما يدلّ على أن التحويل لم يحدث */
  nominalDarfNicht: string[];
  verbalDarfNicht: string[];
  /** بدائل مقبولة كاملة */
  nominalAlt?: string[];
  verbalAlt?: string[];
}

export const STIL_PAARE: StilPaar[] = [
  // ── weil ⇄ wegen ──
  { id: "st-01", regel: "weil-wegen", verbal: "Weil die Mieten steigen, ziehen viele Familien aufs Land.", nominal: "Wegen der steigenden Mieten ziehen viele Familien aufs Land.", ar: "بسبب ارتفاع الإيجارات تنتقل أسر كثيرة إلى الريف.", nominalMuss: ["wegen", "mieten"], verbalMuss: ["weil", "steigen"], nominalDarfNicht: ["weil"], verbalDarfNicht: ["wegen"] },
  { id: "st-02", regel: "weil-wegen", verbal: "Der Zug fiel aus, weil das Wetter schlecht war.", nominal: "Der Zug fiel wegen des schlechten Wetters aus.", ar: "أُلغي القطار بسبب سوء الطقس.", nominalMuss: ["wegen", "wetters"], verbalMuss: ["weil", "wetter"], nominalDarfNicht: ["weil"], verbalDarfNicht: ["wegen"], nominalAlt: ["Wegen des schlechten Wetters fiel der Zug aus."] },
  { id: "st-03", regel: "weil-wegen", verbal: "Viele Betriebe schließen, weil Fachkräfte fehlen.", nominal: "Viele Betriebe schließen wegen des Fachkräftemangels.", ar: "تُغلق شركات كثيرة بسبب نقص الكفاءات.", nominalMuss: ["wegen", "fachkräftemangel"], verbalMuss: ["weil", "fehlen"], nominalDarfNicht: ["weil"], verbalDarfNicht: ["wegen", "mangel"], nominalAlt: ["Wegen des Fachkräftemangels schließen viele Betriebe."] },
  // ── wenn ⇄ bei ──
  { id: "st-04", regel: "wenn-bei", verbal: "Wenn es regnet, findet das Fest in der Halle statt.", nominal: "Bei Regen findet das Fest in der Halle statt.", ar: "عند المطر يُقام المهرجان في القاعة.", nominalMuss: ["bei regen"], verbalMuss: ["wenn", "regnet"], nominalDarfNicht: ["wenn"], verbalDarfNicht: ["bei regen"] },
  { id: "st-05", regel: "wenn-bei", verbal: "Wenn Sie Fragen haben, wenden Sie sich an die Rezeption.", nominal: "Bei Fragen wenden Sie sich an die Rezeption.", ar: "عند وجود أسئلة توجّهوا إلى الاستقبال.", nominalMuss: ["bei fragen"], verbalMuss: ["wenn", "haben"], nominalDarfNicht: ["wenn"], verbalDarfNicht: ["bei fragen"] },
  { id: "st-06", regel: "wenn-bei", verbal: "Als ich ankam, war das Büro schon geschlossen.", nominal: "Bei meiner Ankunft war das Büro schon geschlossen.", ar: "عند وصولي كان المكتب مغلقاً بالفعل.", nominalMuss: ["bei meiner ankunft"], verbalMuss: ["als", "ankam"], nominalDarfNicht: ["als"], verbalDarfNicht: ["ankunft"] },
  // ── nachdem ⇄ nach ──
  { id: "st-07", regel: "nachdem-nach", verbal: "Nachdem er das Studium abgeschlossen hatte, fand er sofort eine Stelle.", nominal: "Nach dem Abschluss des Studiums fand er sofort eine Stelle.", ar: "بعد إنهاء الدراسة وجد وظيفة فوراً.", nominalMuss: ["nach dem abschluss"], verbalMuss: ["nachdem", "abgeschlossen"], nominalDarfNicht: ["nachdem"], verbalDarfNicht: ["nach dem abschluss"], nominalAlt: ["Nach seinem Studienabschluss fand er sofort eine Stelle."] },
  { id: "st-08", regel: "nachdem-nach", verbal: "Nachdem die Gäste angekommen waren, begann die Feier.", nominal: "Nach der Ankunft der Gäste begann die Feier.", ar: "بعد وصول الضيوف بدأ الاحتفال.", nominalMuss: ["nach der ankunft"], verbalMuss: ["nachdem", "angekommen"], nominalDarfNicht: ["nachdem"], verbalDarfNicht: ["ankunft"] },
  // ── bevor ⇄ vor ──
  { id: "st-09", regel: "bevor-vor", verbal: "Bevor die Prüfung beginnt, müssen alle Handys ausgeschaltet werden.", nominal: "Vor Beginn der Prüfung müssen alle Handys ausgeschaltet werden.", ar: "قبل بدء الامتحان يجب إطفاء كل الهواتف.", nominalMuss: ["vor beginn"], verbalMuss: ["bevor", "beginnt"], nominalDarfNicht: ["bevor"], verbalDarfNicht: ["vor beginn"], nominalAlt: ["Vor dem Beginn der Prüfung müssen alle Handys ausgeschaltet werden."] },
  { id: "st-10", regel: "bevor-vor", verbal: "Bevor Sie den Vertrag unterschreiben, lesen Sie ihn genau.", nominal: "Vor der Unterschrift lesen Sie den Vertrag genau.", ar: "قبل التوقيع اقرأ العقد بدقّة.", nominalMuss: ["vor der unterschrift"], verbalMuss: ["bevor", "unterschreiben"], nominalDarfNicht: ["bevor"], verbalDarfNicht: ["unterschrift"], nominalAlt: ["Vor der Unterzeichnung lesen Sie den Vertrag genau."] },
  // ── obwohl ⇄ trotz ──
  { id: "st-11", regel: "obwohl-trotz", verbal: "Obwohl es stark regnete, fand das Konzert statt.", nominal: "Trotz des starken Regens fand das Konzert statt.", ar: "رغم المطر الغزير أُقيم الحفل.", nominalMuss: ["trotz", "regens"], verbalMuss: ["obwohl", "regnete"], nominalDarfNicht: ["obwohl"], verbalDarfNicht: ["trotz"] },
  { id: "st-12", regel: "obwohl-trotz", verbal: "Obwohl sie krank war, ging sie zur Arbeit.", nominal: "Trotz ihrer Krankheit ging sie zur Arbeit.", ar: "رغم مرضها ذهبت إلى العمل.", nominalMuss: ["trotz ihrer krankheit"], verbalMuss: ["obwohl", "krank"], nominalDarfNicht: ["obwohl"], verbalDarfNicht: ["trotz", "krankheit"] },
  { id: "st-13", regel: "obwohl-trotz", verbal: "Obwohl die Preise hoch sind, kaufen viele Menschen Bio-Produkte.", nominal: "Trotz der hohen Preise kaufen viele Menschen Bio-Produkte.", ar: "رغم الأسعار المرتفعة يشتري كثيرون منتجات عضوية.", nominalMuss: ["trotz der hohen preise"], verbalMuss: ["obwohl", "hoch"], nominalDarfNicht: ["obwohl"], verbalDarfNicht: ["trotz"] },
  // ── damit / um…zu ⇄ zu/zur/zum ──
  { id: "st-14", regel: "damit-zu", verbal: "Um Energie zu sparen, schaltet die Firma nachts die Heizung ab.", nominal: "Zur Energieeinsparung schaltet die Firma nachts die Heizung ab.", ar: "لتوفير الطاقة تُطفئ الشركة التدفئة ليلاً.", nominalMuss: ["zur energieeinsparung"], verbalMuss: ["um", "zu sparen"], nominalDarfNicht: ["um", "sparen"], verbalDarfNicht: ["energieeinsparung"] },
  { id: "st-15", regel: "damit-zu", verbal: "Die Stadt baut Radwege, damit die Luft besser wird.", nominal: "Die Stadt baut Radwege zur Verbesserung der Luft.", ar: "تبني المدينة مسارات دراجات لتحسين الهواء.", nominalMuss: ["zur verbesserung"], verbalMuss: ["damit", "besser"], nominalDarfNicht: ["damit"], verbalDarfNicht: ["verbesserung"], nominalAlt: ["Zur Verbesserung der Luft baut die Stadt Radwege."] },
  { id: "st-16", regel: "damit-zu", verbal: "Um die Wartezeit zu verkürzen, wurde ein zweiter Schalter geöffnet.", nominal: "Zur Verkürzung der Wartezeit wurde ein zweiter Schalter geöffnet.", ar: "لتقصير وقت الانتظار فُتح شبّاك ثانٍ.", nominalMuss: ["zur verkürzung"], verbalMuss: ["um", "zu verkürzen"], nominalDarfNicht: ["um"], verbalDarfNicht: ["verkürzung"] },
  // ── indem ⇄ durch ──
  { id: "st-17", regel: "indem-durch", verbal: "Man schützt das Klima, indem man weniger fliegt.", nominal: "Man schützt das Klima durch weniger Flüge.", ar: "يُحمى المناخ بتقليل الرحلات الجوية.", nominalMuss: ["durch", "flüge"], verbalMuss: ["indem", "fliegt"], nominalDarfNicht: ["indem"], verbalDarfNicht: ["durch"], nominalAlt: ["Man schützt das Klima durch den Verzicht auf Flüge."] },
  { id: "st-18", regel: "indem-durch", verbal: "Sie verbesserte ihr Deutsch, indem sie täglich las.", nominal: "Sie verbesserte ihr Deutsch durch tägliches Lesen.", ar: "حسّنت ألمانيتها بالقراءة اليومية.", nominalMuss: ["durch tägliches lesen"], verbalMuss: ["indem", "las"], nominalDarfNicht: ["indem"], verbalDarfNicht: ["durch"] },
  { id: "st-19", regel: "indem-durch", verbal: "Die Firma senkt die Kosten, indem sie Prozesse automatisiert.", nominal: "Die Firma senkt die Kosten durch die Automatisierung von Prozessen.", ar: "تخفّض الشركة التكاليف بأتمتة العمليات.", nominalMuss: ["durch die automatisierung"], verbalMuss: ["indem", "automatisiert"], nominalDarfNicht: ["indem"], verbalDarfNicht: ["automatisierung"] },
  // ── Verb ⇄ Nomen ──
  { id: "st-20", regel: "verb-nomen", verbal: "Die Regierung plant, die Steuern zu erhöhen.", nominal: "Die Regierung plant eine Erhöhung der Steuern.", ar: "تخطّط الحكومة لرفع الضرائب.", nominalMuss: ["erhöhung"], verbalMuss: ["zu erhöhen"], nominalDarfNicht: ["zu erhöhen"], verbalDarfNicht: ["erhöhung"], nominalAlt: ["Die Regierung plant eine Steuererhöhung."] },
  { id: "st-21", regel: "verb-nomen", verbal: "Es ist wichtig, regelmäßig zu wiederholen.", nominal: "Regelmäßiges Wiederholen ist wichtig.", ar: "التكرار المنتظم مهم.", nominalMuss: ["wiederholen ist wichtig"], verbalMuss: ["zu wiederholen"], nominalDarfNicht: ["es ist wichtig,"], verbalDarfNicht: ["regelmäßiges wiederholen"], nominalAlt: ["Die regelmäßige Wiederholung ist wichtig."] },
  { id: "st-22", regel: "verb-nomen", verbal: "Die Stadt hat beschlossen, die Bibliothek zu sanieren.", nominal: "Die Stadt hat die Sanierung der Bibliothek beschlossen.", ar: "قرّرت المدينة ترميم المكتبة.", nominalMuss: ["sanierung"], verbalMuss: ["zu sanieren"], nominalDarfNicht: ["zu sanieren"], verbalDarfNicht: ["sanierung"] },
  { id: "st-23", regel: "verb-nomen", verbal: "Rauchen schadet der Gesundheit, das weiß jeder.", nominal: "Die Schädlichkeit des Rauchens ist allgemein bekannt.", ar: "ضرر التدخين معروف للجميع.", nominalMuss: ["schädlichkeit", "bekannt"], verbalMuss: ["schadet"], nominalDarfNicht: ["schadet"], verbalDarfNicht: ["schädlichkeit"] },
  { id: "st-24", regel: "verb-nomen", verbal: "Die Teilnehmer diskutierten lange darüber, wie man Müll vermeiden kann.", nominal: "Die Teilnehmer diskutierten lange über die Vermeidung von Müll.", ar: "ناقش المشاركون طويلاً تجنّب النفايات.", nominalMuss: ["vermeidung"], verbalMuss: ["vermeiden"], nominalDarfNicht: ["wie man"], verbalDarfNicht: ["vermeidung"] },
];

/** فحص سلامة البنك — يُستدعى في بوابة الدخان */
export function bankPruefen(): string[] {
  const fehler: string[] = [];
  const ids = new Set<string>();
  for (const p of STIL_PAARE) {
    if (ids.has(p.id)) fehler.push(`${p.id}: معرّف مكرّر`); ids.add(p.id);
    const n = p.nominal.toLowerCase(), v = p.verbal.toLowerCase();
    for (const m of p.nominalMuss) if (!n.includes(m)) fehler.push(`${p.id}: nominalMuss «${m}» غير موجود في النموذج الاسمي`);
    for (const m of p.verbalMuss) if (!v.includes(m)) fehler.push(`${p.id}: verbalMuss «${m}» غير موجود في النموذج الفعلي`);
    for (const d of p.nominalDarfNicht) if (n.includes(d)) fehler.push(`${p.id}: nominalDarfNicht «${d}» موجود في النموذج الاسمي نفسه`);
    for (const d of p.verbalDarfNicht) if (v.includes(d)) fehler.push(`${p.id}: verbalDarfNicht «${d}» موجود في النموذج الفعلي نفسه`);
    if (!/[\u0600-\u06FF]/.test(p.ar)) fehler.push(`${p.id}: بلا ترجمة عربية`);
    if (!/^[A-ZÄÖÜ]/.test(p.nominal) || !/[.!?]$/.test(p.nominal)) fehler.push(`${p.id}: النموذج الاسمي ليس جملة كاملة`);
  }
  return fehler;
}

/** تمارين تحويل حتمية من البنك — في الاتجاهين، تُصحَّح بمصحّح umformung الموجود */
export function stilUebungen(richtung: "zuNominal" | "zuVerbal" | "beide" = "beide", max = Infinity): Exercise[] {
  const out: Exercise[] = [];
  for (const p of STIL_PAARE) {
    const r = REGEL_AR[p.regel];
    if (richtung !== "zuVerbal") out.push({
      id: `${p.id}-n`, type: "umformung", quelleDe: p.verbal,
      promptDe: `Schreibe im Nominalstil (${r.nominal}):`,
      answer: p.nominal, alternativen: p.nominalAlt, mussEnthalten: p.nominalMuss, darfNicht: p.nominalDarfNicht,
      explanationAr: `${r.titel}: ${r.verbal} ⇄ ${r.nominal}. ${r.hinweis}. — ${p.ar}`, points: 2,
    });
    if (richtung !== "zuNominal") out.push({
      id: `${p.id}-v`, type: "umformung", quelleDe: p.nominal,
      promptDe: `Schreibe im Verbalstil (${r.verbal}):`,
      answer: p.verbal, alternativen: p.verbalAlt, mussEnthalten: p.verbalMuss, darfNicht: p.verbalDarfNicht,
      explanationAr: `${r.titel}: ${r.nominal} ⇄ ${r.verbal}. ${r.hinweis}. — ${p.ar}`, points: 2,
    });
    if (out.length >= max) break;
  }
  return out.slice(0, max === Infinity ? undefined : max);
}

/** تمارين تعرّف: أيّ الجملتين اسمية؟ — للتمهيد قبل الإنتاج */
export function registerErkennen(max = 8): Exercise[] {
  return STIL_PAARE.slice(0, max).map((p, i) => {
    const nominalZuerst = i % 2 === 0;
    const options = nominalZuerst ? [p.nominal, p.verbal] : [p.verbal, p.nominal];
    return {
      id: `${p.id}-reg`, type: "mc" as const,
      promptDe: "Welcher Satz ist im Nominalstil (formell, schriftlich)?",
      promptAr: "أيّ الجملتين بالأسلوب الاسمي الرسمي؟",
      options, answer: p.nominal,
      explanationAr: `${REGEL_AR[p.regel].titel}: ${REGEL_AR[p.regel].nominal} هو العلامة — ${p.ar}`,
    };
  });
}

/** عدّاد أسلوب لنصّ حرّ: كم علامةً اسمية وكم فعلية — قياس لا حكم */
export function stilProfil(text: string): { nominal: number; verbal: number; hinweise: string[] } {
  const t = ` ${text.toLowerCase()} `;
  const nomMarker = [" wegen ", " trotz ", " bei ", " nach ", " vor ", " zur ", " zum ", " durch ", "ung ", "ung,", "ung.", "keit ", "heit "];
  const verbMarker = [" weil ", " obwohl ", " wenn ", " als ", " nachdem ", " bevor ", " damit ", " indem ", " um ", " zu "];
  const nominal = nomMarker.reduce((a, m) => a + (t.split(m).length - 1), 0);
  const verbal = verbMarker.reduce((a, m) => a + (t.split(m).length - 1), 0);
  const hinweise: string[] = [];
  if (nominal === 0 && verbal > 0) hinweise.push("نصّك فعليٌّ بالكامل — في رسالة رسمية حوّل جملةً أو اثنتين إلى الاسمي (wegen/trotz/zur …).");
  if (verbal === 0 && nominal >= 3) hinweise.push("نصّك اسميٌّ كثيف — في رسالة شخصية أو تعليق تفكّه بجمل weil/obwohl حتى لا يبدو بيروقراطياً.");
  return { nominal, verbal, hinweise };
}
