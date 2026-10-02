/**
 * تدريبات التدخّل الصوتي الخاص بالناطقين بالعربية (Arabic Interference Drills).
 * K-ArabInterferenz: أزواج صوتية يُخطئ فيها العرب كثيراً:
 *   • ع (ʕ) مقابل همزة (ʔ) مقابل الحرف الصوتي الطويل
 *   • ح (ħ) مقابل h العادية
 *   • ب / پ (p/b)
 *   • الحركات القصيرة مقابل الطويلة (e/ä, i/ü, o/u)
 * هذه البطاقات تُحقن في محطة النطق والظل (Aussprache/Shadowing) من مرحلة A0 وحتى منتصف B1.
 */
export type InterferenzPaar = {
  id: string;
  level: "A0"|"A1"|"A2"|"B1";
  fokus: "ayn"|"ha"|"pb"|"vokal"|"umlaut"|"ich-ch"|"r";
  de1: string;         // الكلمة 1
  de2: string;         // الكلمة 2 (الخلط)
  ar1: string;
  ar2: string;
  hinweisAr: string;
};

export const INTERFERENZ: InterferenzPaar[] = [
  // A0 — أخطاء من اليوم الأول
  { id: "a0-p-b-1", level: "A0", fokus: "pb",
    de1: "Bahn", de2: "Penn", ar1: "سكة قطار", ar2: "بنسيون/سرير",
    hinweisAr: "B = ب مسموعة بانفجار الشفتين، P = پ مع هواء. ضَعْ يداك أمام فمك لِتَحُسَّ بالهواء مع پ." },
  { id: "a0-h-ha-1", level: "A0", fokus: "ha",
    de1: "Haus", de2: "haus" /* placeholder */, ar1: "بيت", ar2: "بيت",
    hinweisAr: "h الألمانية خفيفة كالهواء لا كالحاء العربية. لا تُشدِّقها ولا تُحلْقنها." },
  { id: "a0-eh-ae", level: "A0", fokus: "umlaut",
    de1: "denn", de2: "dann", ar1: "لأن", ar2: "ثم/إذاً",
    hinweisAr: "e فم مغلق قليلاً، a فم مفتوح واسع. الفرق يُغيِّر المعنى!" },
  { id: "a0-u-ou", level: "A0", fokus: "vokal",
    de1: "und", de2: "Mond", ar1: "و", ar2: "قمر",
    hinweisAr: "u قصيرة ومُغْلَقة، o طويلة ومُستديرة." },

  // A1
  { id: "a1-p-b-2", level: "A1", fokus: "pb",
    de1: "Pack", de2: "Back", ar1: "حقيبة", ar2: "خلف",
    hinweisAr: "پ يُخرج هواءً، ب لا هواء. «Backen» خَبَز / «Packen» حزَم." },
  { id: "a1-ch-ch", level: "A1", fokus: "ich-ch",
    de1: "ich", de2: "ach", ar1: "أنا", ar2: "آه",
    hinweisAr: "ch بعد حروف أمامية (i,e,ä,ö,ü,ei) = ش-خفيفة من منتصف اللسان. ch بعد a/o/u = خ حلقية." },
  { id: "a1-r", level: "A1", fokus: "r",
    de1: "rot", de2: "Lot", ar1: "أحمر", ar2: "قدر/حظ",
    hinweisAr: "r الألمانية في بداية الكلمة ليست راء مُدغدة كالعربية — اهتزاز لمرة واحدة خلف الأسنان أو حَنْجَرة." },
  { id: "a1-o-u", level: "A1", fokus: "vokal",
    de1: "Ofen", de2: "offen", ar1: "فرن", ar2: "مفتوح",
    hinweisAr: "o طويلة فم مستدير؛ o قصيرة (مكتوبة مزدوجة أو متبوعة بحرفين) فم مفتوح أكثر." },

  // A2
  { id: "a2-ayn-hamza", level: "A2", fokus: "ayn",
    de1: "Anfrage", de2: "Abfrage", ar1: "استفسار/طلب", ar2: "استعلام/اختبار",
    hinweisAr: "لا فرق ع/ء حقيقي بالألمانية لكنّ البادئات An-/Ab- تُخلط بالهمزة الموصلة. ميّزها بالضغط على n أو b." },
  { id: "a2-ü-u", level: "A2", fokus: "umlaut",
    de1: "müssen", de2: "muss", ar1: "يجب (مصدر)", ar2: "يجب (أنا هو/هي)",
    hinweisAr: "ü شفتان متقدِّمتان كأنك تَقبِّل، u فم مستدير عمودي." },
  { id: "a2-ö-e", level: "A2", fokus: "umlaut",
    de1: "hören", de2: "Heren", ar1: "يسمع", ar2: "(خطأ: لا وجود له)",
    hinweisAr: "ö = شفاه متقدمة + فم مفتوح كـe. «schön» = جميل، بدون ö تختفي المعنى." },
  { id: "a2-ch-sch", level: "A2", fokus: "ich-ch",
    de1: "Kirche", de2: "Kirsche", ar1: "كنيسة", ar2: "كرزة",
    hinweisAr: "ch خلف الحنك، sch شَفَوِيّة مع خروج هواء قوي." },

  // B1
  { id: "b1-s-ss", level: "B1", fokus: "vokal",
    de1: "reisen", de2: "reißen", ar1: "يسافر", ar2: "يمزّق",
    hinweisAr: "s/ss/ß تُغيِّر طول الحركة قبلها والحرف الصائت. ß ممدود أو صوت s حاد." },
  { id: "b1-w-v", level: "B1", fokus: "pb",
    de1: "Wasser", de2: "Vater", ar1: "ماء", ar2: "أب",
    hinweisAr: "W الألمانية تُنطق ڤ (v) لا واو. V الأصلية غالباً f: Vater = فاتر." },
  { id: "b1-v-w", level: "B1", fokus: "pb",
    de1: "Vater", de2: "Water", ar1: "أب", ar2: "ماء (إنكليزي)",
    hinweisAr: "معظم الكلمات الألمانية التي تبدأ بـV تُنطق f Vater/f، أما外来词 فـv." },
];

/** فلترة الأزواج حسب المستوى */
export function paareFuerLevel(level: "A0"|"A1"|"A2"|"B1"|"B2"): InterferenzPaar[] {
  const ord: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 };
  const max = ord[level] ?? 1;
  return INTERFERENZ.filter((p) => ord[p.level] <= max);
}

/** اختيار ثابت لزوج التدخل حسب اليوم */
export function paarDesTages(day: number, level: "A0"|"A1"|"A2"|"B1"|"B2"): InterferenzPaar | null {
  const pool = paareFuerLevel(level);
  if (!pool.length) return null;
  // تمريرة كل ثلاثة أيام، حتمية باليوم
  const idx = Math.abs(day * 2654435761) % pool.length;
  return pool[idx];
}
