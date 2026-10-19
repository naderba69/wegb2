/**
 * 🔊 A5 (R282, Experten-Audit ← N10): graduierter Phonetik-Pfad A0→A2.
 * Reine Daten (kein Bank-Eintrag): 8 Einheiten mit Minimalpaaren + Beispielsaetzen.
 * Wiedergabe ueber die Geraete-TTS (speakDe) — ehrlich als solche gekennzeichnet,
 * keine Hausaufnahmen, kein Aussprache-Urteil (nur Hoer-Unterscheidung).
 */
export interface PhonetikPaar { a: string; b: string; aAr: string; bAr: string }
export interface PhonetikEinheit {
  id: string;
  stufe: "A0" | "A1" | "A2";
  titelDe: string;
  titelAr: string;
  regelAr: string;
  paare: PhonetikPaar[];
  saetze: { de: string; ar: string }[];
}

export const PHONETIK_EINHEITEN: PhonetikEinheit[] = [
  {
    id: "ph-a0-laenge", stufe: "A0", titelDe: "Vokallänge: kurz ↔ lang", titelAr: "طول الحركة: قصيرة ↔ طويلة",
    regelAr: "الألمانية تميّز بين حركة قصيرة وطويلة فيتغيّر المعنى: Stadt (مدينة) قصيرة، وStaat (دولة) طويلة. الطويلة تُكتب غالبًا مضاعفة (aa/ee) أو بعدها h أو ie أو ساكن واحد؛ والقصيرة يتبعها ساكنان غالبًا. مدّ الطويلة زمنيًا بوضوح.",
    paare: [
      { a: "Stadt", b: "Staat", aAr: "مدينة", bAr: "دولة" },
      { a: "Bett", b: "Beet", aAr: "سرير", bAr: "حوض زهور" },
      { a: "offen", b: "Ofen", aAr: "مفتوح", bAr: "فرن" },
      { a: "Mitte", b: "Miete", aAr: "وسط", bAr: "إيجار" },
    ],
    saetze: [
      { de: "Die Stadt ist alt und klein.", ar: "المدينة قديمة وصغيرة." },
      { de: "Der Staat hilft den Familien.", ar: "الدولة تساعد العائلات." },
    ],
  },
  {
    id: "ph-a0-auslaut", stufe: "A0", titelDe: "Auslautverhärtung", titelAr: "النهايات المجهورة تُنطق مهموسة",
    regelAr: "في آخر الكلمة تتحوّل الأصوات المجهورة إلى مهموسة: b→p وd→t وg→k. كلمة Tag تُنطق [ta:k]، وRad وRat تُسمعان متماثلتين [ʁa:t] — المعنى من السياق والكتابة.",
    paare: [
      { a: "Rad", b: "Rat", aAr: "عجلة/دراجة", bAr: "نصيحة/مجلس" },
      { a: "Tod", b: "tot", aAr: "الموت", bAr: "ميّت" },
      { a: "seit", b: "seid", aAr: "منذ", bAr: "كونوا (أنتم)" },
      { a: "Weg", b: "weg", aAr: "طريق", bAr: "بعيدًا/ذهب" },
    ],
    saetze: [
      { de: "Das Rad ist neu.", ar: "الدراجة جديدة." },
      { de: "Er gibt mir einen guten Rat.", ar: "يعطيني نصيحة جيدة." },
    ],
  },
  {
    id: "ph-a0-diphthonge", stufe: "A0", titelDe: "ei · au · eu · ie", titelAr: "الحركات المزدوجة",
    regelAr: "أربعة أصوات مزدوجة أساسية: ei تُنطق «آي» (mein)، وau «آو» (Haus)، وeu/äu «أوي» (heute)، وie «إي» طويلة (Liebe). لا تقرأها حرفين منفصلين أبدًا.",
    paare: [
      { a: "mein", b: "neun", aAr: "لي/خاصتي", bAr: "تسعة" },
      { a: "Haus", b: "heute", aAr: "بيت", bAr: "اليوم" },
      { a: "Liebe", b: "Leben", aAr: "حبّ", bAr: "حياة" },
      { a: "laut", b: "Leute", aAr: "بصوت عالٍ", bAr: "ناس" },
    ],
    saetze: [
      { de: "Mein Haus ist klein.", ar: "بيتي صغير." },
      { de: "Heute kommen viele Leute.", ar: "اليوم يأتي ناس كثيرون." },
    ],
  },
  {
    id: "ph-a1-umlaut", stufe: "A1", titelDe: "Umlaute: ä · ö · ü", titelAr: "الأوملاوت",
    regelAr: "الأوملاوت يغيّر المعنى: schon (سابقًا/فعلًا) غير schön (جميل). نطقها: ä كـ e مفتوحة، وö بتدوير الشفتين مع صوت e، وü بتدوير الشفتين مع صوت i — سرّها في الشفتين لا في اللسان.",
    paare: [
      { a: "schon", b: "schön", aAr: "فعلًا/سابقًا", bAr: "جميل" },
      { a: "Höhle", b: "Hölle", aAr: "كهف", bAr: "جحيم" },
      { a: "Mutter", b: "Mütter", aAr: "أمّ", bAr: "أمّهات" },
      { a: "losen", b: "lösen", aAr: "رخو/سائب", bAr: "يحلّ/يفكّ" },
    ],
    saetze: [
      { de: "Das Wetter ist heute schön.", ar: "الطقس اليوم جميل." },
      { de: "Er ist schon zu Hause.", ar: "هو في البيت فعلًا." },
    ],
  },
  {
    id: "ph-a1-ch", stufe: "A1", titelDe: "ich-Laut ↔ ach-Laut", titelAr: "صوتا ch",
    regelAr: "لـ ch صوتان: بعد e/i/ä/ö/ü وei/eu يأتي صوت ناعم أمامي [ç] كما في ich وLicht، وبعد a/o/u/au يأتي صوت حلقي [x] كما في Bach وDach. لاحظ الموضع لا الحرف وحده.",
    paare: [
      { a: "Licht", b: "Fach", aAr: "ضوء", bAr: "تخصص/درج" },
      { a: "ich", b: "Bach", aAr: "أنا", bAr: "جدول ماء" },
      { a: "Bücher", b: "Tochter", aAr: "كتب", bAr: "ابنة" },
      { a: "möchte", b: "Macht", aAr: "أودّ", bAr: "قوة/سلطة" },
    ],
    saetze: [
      { de: "Ich mache das Licht an.", ar: "أشعل الضوء." },
      { de: "Die Tochter liest Bücher.", ar: "الابنة تقرأ كتبًا." },
    ],
  },
  {
    id: "ph-a1-r", stufe: "A1", titelDe: "Das deutsche R", titelAr: "حرف R الألماني",
    regelAr: "R في أول الكلمة تُنطق من الحلق [ʁ] (rot)، لكن بعد حركة في آخر المقطع تتحوّل إلى صوت خفيف قريب من «a» [ɐ]: كلمة Vater تُسمع «فاتَر» بنهاية مفتوحة، ونهايات -er كلها هكذا (Mutter, Wasser).",
    paare: [
      { a: "Vater", b: "Mutter", aAr: "أب", bAr: "أمّ" },
      { a: "wir", b: "Tür", aAr: "نحن", bAr: "باب" },
      { a: "rot", b: "Rat", aAr: "أحمر", bAr: "نصيحة" },
      { a: "Bruder", b: "Wasser", aAr: "أخ", bAr: "ماء" },
    ],
    saetze: [
      { de: "Mein Vater trinkt Wasser.", ar: "أبي يشرب ماءً." },
      { de: "Wir machen die Tür zu.", ar: "نغلق الباب." },
    ],
  },
  {
    id: "ph-a2-slaute", stufe: "A2", titelDe: "st · sp · sch am Wortanfang", titelAr: "أصوات s في أول الكلمة",
    regelAr: "في أول الكلمة تُنطق st «شت» (Stadt [ʃtat]) وsp «شب» (Sport [ʃpɔrt])، وsch «ش» كاملة (Schule). هذا من أكثر ما يفضح النطق الأجنبي — درّبه باكرًا.",
    paare: [
      { a: "Stadt", b: "Sport", aAr: "مدينة", bAr: "رياضة" },
      { a: "Schule", b: "Schaden", aAr: "مدرسة", bAr: "ضرر" },
      { a: "sprechen", b: "stehen", aAr: "يتحدث", bAr: "يقف" },
      { a: "Straße", b: "Stuhl", aAr: "شارع", bAr: "كرسي" },
    ],
    saetze: [
      { de: "Die Schule steht in der Stadt.", ar: "المدرسة في المدينة." },
      { de: "Sport macht Spaß.", ar: "الرياضة ممتعة." },
    ],
  },
  {
    id: "ph-a2-akzent", stufe: "A2", titelDe: "Wortakzent: trennbare Verben", titelAr: "نبرة الكلمة والبادئات",
    regelAr: "النبرة غالبًا على المقطع الأول. البادئات المنفصلة تحمل النبرة بقوة: AUFstehen، EINkaufen، MITkommen — وغير المنفصلة لا تحملها: verSTEhen، beKOMmen، verKAUfen. النبرة الخاطئة قد تغيّر المعنى أو تصعّب الفهم.",
    paare: [
      { a: "aufstehen", b: "verstehen", aAr: "يستيقظ/ينهض", bAr: "يفهم" },
      { a: "einkaufen", b: "verkaufen", aAr: "يتسوّق", bAr: "يبيع" },
      { a: "mitkommen", b: "bekommen", aAr: "يأتي مع", bAr: "يحصل على" },
      { a: "Bahnhof", b: "Wochenende", aAr: "محطة قطار", bAr: "عطلة الأسبوع" },
    ],
    saetze: [
      { de: "Ich stehe um sechs Uhr auf.", ar: "أستيقظ في السادسة." },
      { de: "Verstehst du den Satz?", ar: "هل تفهم الجملة؟" },
    ],
  },
];
