// lib/kriterien.ts — تقييم الكتابة بمعايير Goethe الأربعة (E4/R173)
// الإنجاز (Erfüllung) · المفردات (Wortschatz) · التراكيب (Strukturen) · التماسك (Kohärenz)
// العقد: إشارات آلية حتمية من النص نفسه، تُعرض كمؤشراتٍ لا كدرجة مصحّح بشري،
// وقاعدة نصف الطول الرسمية: دون نصف عدد الكلمات المطلوب = المهمة غير مُنجزة (الإنجاز 0).

export const KRITERIEN = [
  { key: "erfuellung", de: "Erfüllung", ar: "إنجاز المهمة" },
  { key: "wortschatz", de: "Wortschatz", ar: "المفردات" },
  { key: "strukturen", de: "Strukturen", ar: "التراكيب" },
  { key: "kohaerenz", de: "Kohärenz", ar: "التماسك والربط" },
] as const;

export type KriteriumKey = (typeof KRITERIEN)[number]["key"];

export interface KriteriumWert {
  /** 0..100 */
  punkte: number;
  /** ملاحظات مبنية على ما وُجد فعلًا في النص */
  hinweiseAr: string[];
}

export interface KriterienErgebnis {
  woerter: number;
  ziel: number;
  /** دون نصف الهدف: المهمة غير مُنجزة بصيغة الامتحان */
  zuKurz: boolean;
  kriterien: Record<KriteriumKey, KriteriumWert>;
  /** متوسط المعايير (مع سقف 59 عند قاعدة نصف الطول) */
  gesamt: number;
}

const clamp100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const WORT = /[A-Za-zÄÖÜäöüß]+/g;
const tokens = (text: string): string[] => (text.toLowerCase().match(WORT) ?? []);
const saetze = (text: string): string[] => text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

/** روابط/عبارات تماسك حجاجية وزمنية (Kohärenz) */
const KOH_KONNEKTOREN = [
  "zuerst", "zunächst", "dann", "danach", "anschließend", "schließlich", "zum schluss", "abschließend",
  "außerdem", "zudem", "darüber hinaus", "jedoch", "allerdings", "trotzdem", "dennoch",
  "deshalb", "daher", "folglich", "aus diesem grund", "einerseits", "andererseits",
  "zum beispiel", "beispielsweise", "meiner meinung nach", "ich bin der meinung", "zusammenfassend",
  "insgesamt", "im gegensatz", "im vergleich", "heutzutage", "in der heutigen zeit", "fazit",
];

/** علامات جمل فرعية وبنى مركّبة (Strukturen) */
const NEBENSATZ = [
  "weil", "dass", "wenn", "als", "obwohl", "damit", "bevor", "nachdem", "während", "falls",
  "sobald", "indem", "sodass", "ob", "statt", "ohne", "welche", "welcher", "welches",
];

const hat = (text: string, phrase: string): boolean =>
  new RegExp(`\\b${phrase.replace(/\s+/g, "\\s+")}\\b`, "i").test(text);

const gefunden = (text: string, liste: string[]): string[] => liste.filter((p) => hat(text, p));

/**
 * نقد آلي بالمعايير الأربعة. zielWorte = طول الهدف الرسمي للمهمة.
 * art: رسالة/بريد (تحية+ختام جزء من الإنجاز) أو نص رأي/منتدى.
 */
export function bewerteKriterien(text: string, zielWorte: number, art: "brief" | "forum"): KriterienErgebnis {
  const toks = tokens(text);
  const woerter = toks.length;
  const ziel = Math.max(1, zielWorte);
  const satzListe = saetze(text);
  const zuKurz = woerter < Math.ceil(ziel / 2);
  const verhaeltnis = woerter / ziel;

  /* ── الإنجاز: الطول + عناصر الشكل ── */
  const erfuellungHinweise: string[] = [];
  let erf = clamp100(Math.min(verhaeltnis, 1) * 100);
  if (zuKurz) {
    erf = 0;
    erfuellungHinweise.push(`كتبتَ ${woerter} من ${ziel} كلمة — دون النصف، وبصيغة الامتحان تُحسب المهمة غير مُنجزة (0 في الإنجاز).`);
  } else if (verhaeltnis < 1) {
    erfuellungHinweise.push(`كتبتَ ${woerter} من ${ziel} كلمة — أضف أفكارًا مساندة بأمثلة حتى بلوغ الهدف.`);
  } else {
    erfuellungHinweise.push(`بلغتَ طول الهدف (${woerter}/${ziel} كلمة).`);
  }
  if (art === "brief") {
    if (!/(Sehr geehrte|Liebe[r]?|Hallo|Guten Tag)/i.test(text)) { erf = clamp100(erf - 15); erfuellungHinweise.push("لا تحية في المطلع — الرسالة الامتحانية تبدأ بتحية مناسبة."); }
    if (!/(Mit freundlichen Grüßen|Viele Grüße|Liebe Grüße|Herzliche Grüße|Beste Grüße)/i.test(text)) { erf = clamp100(erf - 15); erfuellungHinweise.push("لا عبارة ختام — اختم بـ«Mit freundlichen Grüßen»."); }
  } else if (satzListe.length < 3) {
    erf = clamp100(erf - 10);
    erfuellungHinweise.push("النص جملة أو جملتان — نص الرأي يحتاج تمهيدًا وتفصيلًا وخاتمة.");
  }
  if (zuKurz) erf = 0;

  /* ── المفردات: تنوّع الصيغ وكلمات مركّبة ── */
  const typen = new Set(toks).size;
  const typenQuote = woerter ? typen / woerter : 0;
  const langAnteil = woerter ? toks.filter((t) => t.length >= 8).length / woerter : 0;
  let wort = clamp100(((typenQuote - 0.3) / 0.4) * 100 + (langAnteil >= 0.08 && langAnteil <= 0.3 ? 10 : 0));
  const wortHinweise: string[] = [
    `تنوّع مفرداتك: ${typen} صيغة مختلفة في ${woerter} كلمة (نسبة ${Math.round(typenQuote * 100)}٪).`,
  ];
  if (typenQuote < 0.45) wortHinweise.push("تكرارٌ لافت لنفس الكلمات — بدّل بمرادفات من دروسك وضمائر وصل.");
  if (langAnteil < 0.08 && woerter >= 60) wortHinweise.push("كلماتك قصيرة غالبًا — الأسماء المركّبة الطويلة (مثل Umweltschutz) من علامات مستوى B2.");
  if (woerter < 40) wortHinweise.push("نصٌّ قصير — مؤشر المفردات تقريبيٌّ ولا يثبت إلا بطولٍ أكبر.");

  /* ── التراكيب: جمل فرعية وبنى غير بسيطة وطول الجملة ── */
  const neben = gefunden(text, NEBENSATZ);
  const passiv = /\b(wird|werden|wurde|wurden)\b/i.test(text);
  const konjunktiv = /\b(hätte|wäre|würde|könnte|müsste|sollte|dürfte)\b/i.test(text);
  const relativ = /,\s*(der|die|das|dem|den|dessen|deren)\b/i.test(text);
  const mittlereSatzlaenge = satzListe.length ? woerter / satzListe.length : 0;
  const laengenPunkte = mittlereSatzlaenge >= 9 && mittlereSatzlaenge <= 24 ? 10 : mittlereSatzlaenge >= 6 ? 5 : 0;
  const struk = clamp100(neben.length * 14 + (passiv ? 12 : 0) + (konjunktiv ? 12 : 0) + (relativ ? 12 : 0) + laengenPunkte);
  const strukHinweise: string[] = [
    `وجدتُ ${satzListe.length} جملة بمتوسط ${Math.round(mittlereSatzlaenge)} كلمة، و${neben.length} من علامات الجمل الفرعية${neben.length ? ` (${neben.slice(0, 5).join("، ")})` : ""}.`,
  ];
  if (!neben.length) strukHinweise.push("كل جملك رئيسية بسيطة — weil/dass/wenn في آخرها الفعل يميّز بنية B1 فأعلى.");
  if (!relativ && woerter >= 80) strukHinweise.push("لا جملة صلة (…, die/der …) — صِل جملة واحدة بضمير صلة لرفع مستوى التراكيب.");
  if (!konjunktiv && woerter >= 100) strukHinweise.push("لا صيغة تمنٍّ/احتمال (würde/könnte) — في نصوص الرأي تُثري الحجاج.");

  /* ── التماسك: روابط مميزة وبنية فقرات ── */
  const konn = gefunden(text, KOH_KONNEKTOREN);
  const absaetze = text.split(/\n\s*\n/).filter((a) => a.trim()).length;
  const koh = clamp100(konn.length * 16 + (absaetze >= 2 ? 14 : 0));
  const kohHinweise: string[] = [
    `روابط تماسك مميزة وجدتها: ${konn.length}${konn.length ? ` (${konn.slice(0, 6).join("، ")})` : ""}، والفقرات: ${absaetze}.`,
  ];
  if (konn.length < 3) kohHinweise.push("الربط ضعيف — رتّب حجاجك: zuerst … außerdem … jedoch … abschließend.");
  if (absaetze < 2 && woerter >= 100) kohHinweise.push("فقرة واحدة طويلة — افصل التمهيد عن التفصيل والخاتمة بسطر فارغ.");

  const kriterien: Record<KriteriumKey, KriteriumWert> = {
    erfuellung: { punkte: erf, hinweiseAr: erfuellungHinweise },
    wortschatz: { punkte: wort, hinweiseAr: wortHinweise },
    strukturen: { punkte: struk, hinweiseAr: strukHinweise },
    kohaerenz: { punkte: koh, hinweiseAr: kohHinweise },
  };
  const mittel = (erf + wort + struk + koh) / 4;
  return { woerter, ziel, zuKurz, kriterien, gesamt: zuKurz ? Math.min(clamp100(mittel), 59) : clamp100(mittel) };
}
