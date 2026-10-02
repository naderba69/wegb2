/**
 * بنك Funktionsverbgefüge (FVG) — تراكيب الأفعال الوظيفية الرسمية في B2
 * تُحقَن كتدريب أسبوعي قصير في أسابيع B2.
 * قائمة مرجعية من تكرارات Goethe-B2 وTestDaF الشائعة.
 */
export type FVG = {
  ausdruck: string;         // الصيغة كاملة
  verb: string;             // الفعل الوظيفي
  nomen: string;            // الاسم
  bedeutungAr: string;      // المعنى بالعربية
  beispiel: string;         // مثال في جملة
  hinweisAr: string;        // تنبيه: أي خطأ شائع؟
};

export const FVG_LIST: FVG[] = [
  { ausdruck: "eine Entscheidung treffen", verb: "treffen", nomen: "Entscheidung",
    bedeutungAr: "يتخذ قراراً", beispiel: "Die Regierung hat eine wichtige Entscheidung getroffen.",
    hinweisAr: "لا تقول *eine Entscheidung machen، الفعل الصحيح treffen." },
  { ausdruck: "einen Antrag stellen", verb: "stellen", nomen: "Antrag",
    bedeutungAr: "يقدّم طلباً", beispiel: "Er hat einen Antrag auf Arbeitslosengeld gestellt.",
    hinweisAr: "تقديم طلب Antrag = stellen وليس machen." },
  { ausdruck: "zur Verfügung stehen", verb: "stehen", nomen: "Verfügung",
    bedeutungAr: "يكون متاحاً / تحت التصرّف", beispiel: "Ich stehe Ihnen jederzeit zur Verfügung.",
    hinweisAr: "جملة ثابتة مهنية: تحت تصرفك." },
  { ausdruck: "zur Verfügung stellen", verb: "stellen", nomen: "Verfügung",
    bedeutungAr: "يُتيح / يوفّر", beispiel: "Die Bibliothek stellt neue Bücher zur Verfügung.",
    hinweisAr: "فرّق بين stehen (متاح ذاتياً) و stellen (يُوفّره طرف آخر)." },
  { ausdruck: "in Frage kommen", verb: "kommen", nomen: "Frage",
    bedeutungAr: "يكون ممكناً / يندرج في الاحتمال", beispiel: "Eine Kündigung kommt für mich nicht in Frage.",
    hinweisAr: "في النفي = مستبعد تماماً." },
  { ausdruck: "in Kauf nehmen", verb: "nehmen", nomen: "Kauf",
    bedeutungAr: "يتحمّل (عاقبة سلبية) على مضض", beispiel: "Wir nehmen lange Arbeitszeiten in Kauf.",
    hinweisAr: "لا علاقة لها بـ Kauf (شراء) هنا، تعبّر عن التسليم بسلبيات." },
  { ausdruck: "Abschied nehmen", verb: "nehmen", nomen: "Abschied",
    bedeutungAr: "يودّع", beispiel: "Am Bahnhof haben wir Abschied genommen.",
    hinweisAr: "sich verabschieden = مرادف أبسط، لكن FVG رسمي أكثر." },
  { ausdruck: "Kritik üben an + D", verb: "üben", nomen: "Kritik",
    bedeutungAr: "يوجّه نقداً لـ", beispiel: "Der Artikel übt scharfe Kritik an der neuen Politik.",
    hinweisAr: "النقد يُمارس üben ولا يُصنع machen." },
  { ausdruck: "Maßnahmen ergreifen", verb: "ergreifen", nomen: "Maßnahmen",
    bedeutungAr: "يتّخذ تدابير", beispiel: "Die Stadt hat strenge Maßnahmen ergriffen.",
    hinweisAr: "تدابير = ergreifen، عادةً جمعاً." },
  { ausdruck: "eine Rolle spielen", verb: "spielen", nomen: "Rolle",
    bedeutungAr: "يلعب دوراً", beispiel: "Bildung spielt eine zentrale Rolle.",
    hinweisAr: "من أكثر التراكيب تكراراً في الامتحان." },
  { ausdruck: "Eindruck machen auf + A", verb: "machen", nomen: "Eindruck",
    bedeutungAr: "يترك انطباعاً لدى", beispiel: "Ihre Präsentation hat einen tiefen Eindruck auf mich gemacht.",
    hinweisAr: "انطباع machen لا treffen." },
  { ausdruck: "in Verbindung bringen mit", verb: "bringen", nomen: "Verbindung",
    bedeutungAr: "يربط بـ / يتواصل مع", beispiel: "Bitte bringen Sie mich mit der Personalabteilung in Verbindung.",
    hinweisAr: "صيغة مهنية لطلب الاتصال." },
  { ausdruck: "eine Frage stellen", verb: "stellen", nomen: "Frage",
    bedeutungAr: "يطرح سؤالاً", beispiel: "Darf ich Ihnen eine Frage stellen?",
    hinweisAr: "السؤال stellen وليس fragen هنا." },
  { ausdruck: "Achtung geben auf + A", verb: "geben", nomen: "Achtung",
    bedeutungAr: "ينتبه إلى / يحترس من", beispiel: "Gib auf den Verkehr achtung!",
    hinweisAr: "أكثر رسمية من aufpassen." },
  { ausdruck: "Bericht erstatten", verb: "erstatten", nomen: "Bericht",
    bedeutungAr: "يقدّم تقريراً", beispiel: "Der Abteilungsleiter erstattet monatlich Bericht.",
    hinweisAr: "تقديم تقرير رسمي = erstatten." },
  { ausdruck: "unter Druck stehen", verb: "stehen", nomen: "Druck",
    bedeutungAr: "يكون تحت الضغط", beispiel: "Das Gesundheitssystem steht unter starkem Druck.",
    hinweisAr: "حرف جر unter مع ضغط." },
];

export function fvgOf(day: number): FVG {
  return FVG_LIST[Math.abs(day * 2654435761) % FVG_LIST.length];
}
