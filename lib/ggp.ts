/**
 * German Grammar Profile (GGP) — 150 بنية نحوية موزعة CEFR A1→B2
 * المرجع: GGP (ÖSD-based, Profile Deutsch) + ملخص docs/تدقيق_التكامل_الشامل_CEFR_2026-10-21.md §4.1
 * التنفيذ: طبقة عرض فقط — لا بيانات جديدة (3C — GGP Filter). كل topicId موجود يربط بـ GGP features.
 * العدد: 30 (A1) + 35 (A2) + 40 (B1) + 45 (B2) = 150
 */
export type GGPLevel = "A1" | "A2" | "B1" | "B2";
export type GGPFeature = {
  code: string; // GGP-001 … GGP-150
  level: GGPLevel;
  titelDe: string;
  titelAr: string;
  familie: string; // Verben, Nomen, Satzbau, etc.
};

// 150 ميزة — أسماء موجزة قابلة للعرض كـ chip
export const GGP_FEATURES: readonly GGPFeature[] = [
  // ── A1 ~30 ─────────────────────────────────────────────
  { code: "GGP-001", level: "A1", titelDe: "Präsens sein/haben", titelAr: "المضارع sein/haben", familie: "Verben" },
  { code: "GGP-002", level: "A1", titelDe: "Präsens regelmäßige Verben", titelAr: "المضارع المنتظم", familie: "Verben" },
  { code: "GGP-003", level: "A1", titelDe: "Personalpronomen Nominativ", titelAr: "الضمائر الشخصية فاعل", familie: "Pronomen" },
  { code: "GGP-004", level: "A1", titelDe: "Artikel + Plural", titelAr: "الأداة والجمع", familie: "Nomen" },
  { code: "GGP-005", level: "A1", titelDe: "Akkusativ (haben/sehen)", titelAr: "المفعول المباشر Akkusativ", familie: "Kasus" },
  { code: "GGP-006", level: "A1", titelDe: "trennbare Verben", titelAr: "الأفعال المنفصلة", familie: "Verben" },
  { code: "GGP-007", level: "A1", titelDe: "Modalverben können/wollen", titelAr: "الأفعال الناقصة (الأساسية)", familie: "Verben" },
  { code: "GGP-008", level: "A1", titelDe: "Imperativ du/Sie", titelAr: "صيغة الأمر", familie: "Verben" },
  { code: "GGP-009", level: "A1", titelDe: "Zahlen / Uhrzeit", titelAr: "الأعداد والوقت", familie: "Wortschatz-Grammatik" },
  { code: "GGP-010", level: "A1", titelDe: "Ja/Nein-Frage (Verb 1)", titelAr: "سؤال نعم/لا (الفعل أولاً)", familie: "Satzbau" },
  { code: "GGP-011", level: "A1", titelDe: "W-Frage (wer/was/wo)", titelAr: "سؤال Wh", familie: "Satzbau" },
  { code: "GGP-012", level: "A1", titelDe: "Negation nicht/kein", titelAr: "النفي nicht/kein", familie: "Satzbau" },
  { code: "GGP-013", level: "A1", titelDe: "Possessiv mein/dein", titelAr: "الملكية mein/dein", familie: "Pronomen" },
  { code: "GGP-014", level: "A1", titelDe: "Präpositionen mit Akk/Dat (in/im)", titelAr: "حروف جر مكانية", familie: "Kasus" },
  { code: "GGP-015", level: "A1", titelDe: "Satzklammer (Präsens)", titelAr: "إطار الجملة", familie: "Satzbau" },
  { code: "GGP-016", level: "A1", titelDe: "Modalverben dürfen/müssen/sollen", titelAr: "باقي النواقص", familie: "Verben" },
  { code: "GGP-017", level: "A1", titelDe: "Perfekt mit haben (regelm.)", titelAr: "الماضي المنفصل (haben)", familie: "Verben" },
  { code: "GGP-018", level: "A1", titelDe: "Zeitangaben (am/um)", titelAr: "تعبيرات الوقت", familie: "Kasus" },
  { code: "GGP-019", level: "A1", titelDe: "Adjektiv prädikativ", titelAr: "الصفة خبرية", familie: "Adjektiv" },
  { code: "GGP-020", level: "A1", titelDe: "Konjunktion und/oder/aber", titelAr: "روابط و/أو/لكن", familie: "Konnektoren" },
  { code: "GGP-021", level: "A1", titelDe: "Aussprache Umlaut ä/ö/ü", titelAr: "نطق الإمالة", familie: "Phonetik" },
  { code: "GGP-022", level: "A1", titelDe: "Aussprache ch / r", titelAr: "نطق ch/r", familie: "Phonetik" },
  { code: "GGP-023", level: "A1", titelDe: "Buchstaben / Alphabet", titelAr: "الأبجدية", familie: "Phonetik" },
  { code: "GGP-024", level: "A1", titelDe: "Begrüßung / Vorstellung", titelAr: "تحية وتعارف", familie: "Satzbau" },
  { code: "GGP-025", level: "A1", titelDe: "Satzbau Hauptsatz (Subj-Verb)", titelAr: "ترتيب الجملة الرئيسة", familie: "Satzbau" },
  { code: "GGP-026", level: "A1", titelDe: "Pluralbildung", titelAr: "صيغ الجمع", familie: "Nomen" },
  { code: "GGP-027", level: "A1", titelDe: "Komposita (Grund)", titelAr: "التركيب الاسمي أساس", familie: "Wortbildung" },
  { code: "GGP-028", level: "A1", titelDe: "Präposition zu/von", titelAr: "zu/von", familie: "Kasus" },
  { code: "GGP-029", level: "A1", titelDe: "Zahlen bis 1000", titelAr: "أعداد حتى 1000", familie: "Wortschatz-Grammatik" },
  { code: "GGP-030", level: "A1", titelDe: "Prüfungsstrategie A1", titelAr: "استراتيجية امتحان A1", familie: "Strategie" },
  // ── A2 ~35 ─────────────────────────────────────────────
  { code: "GGP-031", level: "A2", titelDe: "Perfekt mit haben/sein", titelAr: "Perfekt كامل", familie: "Verben" },
  { code: "GGP-032", level: "A2", titelDe: "Präteritum war/hatte", titelAr: "الماضي war/hatte", familie: "Verben" },
  { code: "GGP-033", level: "A2", titelDe: "Präteritum Modalverben", titelAr: "ماضي النواقص", familie: "Verben" },
  { code: "GGP-034", level: "A2", titelDe: "Dativ (geben/helfen)", titelAr: "Dativ", familie: "Kasus" },
  { code: "GGP-035", level: "A2", titelDe: "Wechselpräpositionen Akk/Dat", titelAr: "حروف التبادل", familie: "Kasus" },
  { code: "GGP-036", level: "A2", titelDe: "Weil/dass-Nebensatz", titelAr: "جملة ثانوية weil/dass", familie: "Satzbau" },
  { code: "GGP-037", level: "A2", titelDe: "Wenn-Nebensatz", titelAr: "جملة wenn الشرطية", familie: "Satzbau" },
  { code: "GGP-038", level: "A2", titelDe: "Reflexive Verben", titelAr: "الأفعال الانعكاسية", familie: "Verben" },
  { code: "GGP-039", level: "A2", titelDe: "Steigerung Komparativ/Superlativ", titelAr: "المقارنة والتفضيل", familie: "Adjektiv" },
  { code: "GGP-040", level: "A2", titelDe: "Adjektivdeklination einfach", titelAr: "تصريف الصفة البسيط", familie: "Adjektiv" },
  { code: "GGP-041", level: "A2", titelDe: "Futur I (werden + Inf)", titelAr: "المستقبل werden", familie: "Verben" },
  { code: "GGP-042", level: "A2", titelDe: "Negation mit niemand/nichts", titelAr: "نفي متقدم", familie: "Satzbau" },
  { code: "GGP-043", level: "A2", titelDe: "Konjunktiv II höflich (hätte/könnte)", titelAr: "الالتماس المهذب", familie: "Verben" },
  { code: "GGP-044", level: "A2", titelDe: "Verb + Präposition (denken an)", titelAr: "فعل + حرف جر", familie: "Verben" },
  { code: "GGP-045", level: "A2", titelDe: "Konjunktoren denn/weil/obwohl (A2)", titelAr: "روابط سببية أولية", familie: "Konnektoren" },
  { code: "GGP-046", level: "A2", titelDe: "Nebensatz Verb-End", titelAr: "الفعل آخر الجملة الثانوية", familie: "Satzbau" },
  { code: "GGP-047", level: "A2", titelDe: "Demonstrativ dieser/jener", titelAr: "الإشارة dieser", familie: "Pronomen" },
  { code: "GGP-048", level: "A2", titelDe: "Indefinitpronomen man/es", titelAr: "man/es", familie: "Pronomen" },
  { code: "GGP-049", level: "A2", titelDe: "Präpositionen mit Dativ (mit/bei)", titelAr: "حروف بـ Dativ", familie: "Kasus" },
  { code: "GGP-050", level: "A2", titelDe: "Verschmolzene Formen (am/im)", titelAr: "الدمج am/im", familie: "Kasus" },
  { code: "GGP-051", level: "A2", titelDe: "was für ein / welcher", titelAr: "was für ein", familie: "Pronomen" },
  { code: "GGP-052", level: "A2", titelDe: "Modalpartikel doch/mal (A2)", titelAr: "أدوات نبرية أولية", familie: "Partikel" },
  { code: "GGP-053", level: "A2", titelDe: "Infinitiv mit zu", titelAr: "مصدر مع zu", familie: "Verben" },
  { code: "GGP-054", level: "A2", titelDe: "Adverbien (sehr/oft/gern)", titelAr: "الظروف", familie: "Wortschatz-Grammatik" },
  { code: "GGP-055", level: "A2", titelDe: "Phrasen mit Dativ/Akkusativ", titelAr: "عبارات حالة", familie: "Kasus" },
  { code: "GGP-056", level: "A2", titelDe: "Zustandspassiv kennen (ist geöffnet)", titelAr: "مبني للمجهول الحال", familie: "Verben" },
  { code: "GGP-057", level: "A2", titelDe: "Konjunktiv II sollte (Empfehlung)", titelAr: "sollte للنصح", familie: "Verben" },
  { code: "GGP-058", level: "A2", titelDe: "Relativsatz Nominativ (A2 Vorgriff)", titelAr: "جملة موصولة A2", familie: "Satzbau" },
  { code: "GGP-059", level: "A2", titelDe: "Präposition trotz/wegen (A2 Vorgriff)", titelAr: "trotz/wegen أولي", familie: "Kasus" },
  { code: "GGP-060", level: "A2", titelDe: "Perfekt unregelmäßig (fahren→gefahren)", titelAr: "Perfekt شاذ", familie: "Verben" },
  { code: "GGP-061", level: "A2", titelDe: "Imperativ mit -e (A2 Varianz)", titelAr: "أمر متنوع", familie: "Verben" },
  { code: "GGP-062", level: "A2", titelDe: "Adjektiv Komparation (gut/besser)", titelAr: "مقارنة شاذة", familie: "Adjektiv" },
  { code: "GGP-063", level: "A2", titelDe: "Präposition über/unter (Wechsel)", titelAr: "فوق/تحت تبادلي", familie: "Kasus" },
  { code: "GGP-064", level: "A2", titelDe: "Nebensatz mit als/wenn (Vergangenheit)", titelAr: "als/wenn ماضي", familie: "Satzbau" },
  { code: "GGP-065", level: "A2", titelDe: "Prüfungsstrategie A2", titelAr: "استراتيجية A2", familie: "Strategie" },
  // ── B1 ~40 ─────────────────────────────────────────────
  { code: "GGP-066", level: "B1", titelDe: "Konjunktiv II Gegenwart (wäre/hätte)", titelAr: "Konjunktiv II حاضر", familie: "Verben" },
  { code: "GGP-067", level: "B1", titelDe: "Konjunktiv II Vergangenheit", titelAr: "Konjunktiv II ماضي", familie: "Verben" },
  { code: "GGP-068", level: "B1", titelDe: "Passiv Präsens/Präteritum", titelAr: "المبني للمجهول حاضر/ماض", familie: "Verben" },
  { code: "GGP-069", level: "B1", titelDe: "Genitiv (des Tages)", titelAr: "Genitiv الملكية/السبب", familie: "Kasus" },
  { code: "GGP-070", level: "B1", titelDe: "Relativsätze (der/die/das)", titelAr: "الموصولة der", familie: "Satzbau" },
  { code: "GGP-071", level: "B1", titelDe: "Plusquamperfekt", titelAr: "الماضي الأبعد", familie: "Verben" },
  { code: "GGP-072", level: "B1", titelDe: "Indirekte Fragen (ob/was)", titelAr: "السؤال غير المباشر", familie: "Satzbau" },
  { code: "GGP-073", level: "B1", titelDe: "Konnektoren obwohl/trotzdem/deshalb", titelAr: "روابط تناقض/نتيجة", familie: "Konnektoren" },
  { code: "GGP-074", level: "B1", titelDe: "Funktionsverbgefüge (zur Verfügung stellen)", titelAr: "Funktionsverben B1", familie: "Verben" },
  { code: "GGP-075", level: "B1", titelDe: "Adjektivendungen komplett", titelAr: "نهايات الصفة كاملة", familie: "Adjektiv" },
  { code: "GGP-076", level: "B1", titelDe: "N-Deklination Vorbereitung", titelAr: "تمهيد N-Deklination", familie: "Nomen" },
  { code: "GGP-077", level: "B1", titelDe: "Infinitivsätze um…zu / ohne…zu", titelAr: "um…zu", familie: "Satzbau" },
  { code: "GGP-078", level: "B1", titelDe: "Wortbildung Komposita/Bildung", titelAr: "تكوين الكلمات", familie: "Wortbildung" },
  { code: "GGP-079", level: "B1", titelDe: "Verb + Präposition B1 (sich freuen auf)", titelAr: "فعل+حرف B1", familie: "Verben" },
  { code: "GGP-080", level: "B1", titelDe: "Unbestimmte Artikel/Pronomen (jeder/einige)", titelAr: "النكرة المعممة", familie: "Pronomen" },
  { code: "GGP-081", level: "B1", titelDe: "Konjunktiv II würde + Infinitiv", titelAr: "würde + مصدر", familie: "Verben" },
  { code: "GGP-082", level: "B1", titelDe: "Absichtssätze damit/um…zu", titelAr: "جمل القصد damit", familie: "Satzbau" },
  { code: "GGP-083", level: "B1", titelDe: "Passiv mit Modalverb (muss gemacht werden)", titelAr: "مجهول مع ناقص", familie: "Verben" },
  { code: "GGP-084", level: "B1", titelDe: "Indirekte Rede Gegenwart (B1 Vorgriff)", titelAr: "غير مباشر حاضر", familie: "Satzbau" },
  { code: "GGP-085", level: "B1", titelDe: "Adjektiv als Nomen (der Alte)", titelAr: "الصفة كاسم", familie: "Adjektiv" },
  { code: "GGP-086", level: "B1", titelDe: "Partizip I als Adjektiv (B1 Vorgriff)", titelAr: "اسم الفاعل صفة", familie: "Verben" },
  { code: "GGP-087", level: "B1", titelDe: "Doppelinfinitiv (hat machen lassen)", titelAr: "مصدران معاً", familie: "Verben" },
  { code: "GGP-088", level: "B1", titelDe: "Konzessiv auch wenn", titelAr: "حتى لو auch wenn", familie: "Konnektoren" },
  { code: "GGP-089", level: "B1", titelDe: "Relativ Pronomen was/wo", titelAr: "موصول was/wo", familie: "Satzbau" },
  { code: "GGP-090", level: "B1", titelDe: "Genitiv-Präpositionen wegen/trotz", titelAr: "حروف Genitiv", familie: "Kasus" },
  { code: "GGP-091", level: "B1", titelDe: "Zeitformen Überblick Präsens/Perfekt/Präteritum", titelAr: "نظرة زمنية", familie: "Verben" },
  { code: "GGP-092", level: "B1", titelDe: "Adverbialer Nebensatz als/wenn/während", titelAr: "ظرفي als/wenn", familie: "Satzbau" },
  { code: "GGP-093", level: "B1", titelDe: "Nominalisierung Verb→Nomen (Einladung)", titelAr: "اسمية الفعل", familie: "Wortbildung" },
  { code: "GGP-094", level: "B1", titelDe: "Konjunktionen je…desto", titelAr: "je…desto", familie: "Konnektoren" },
  { code: "GGP-095", level: "B1", titelDe: "Passiv Zustand (ist geöffnet) B1+", titelAr: "حالة المجهول", familie: "Verben" },
  { code: "GGP-096", level: "B1", titelDe: "Indirekte Fragesätze W- (B1+)", titelAr: "سؤال W غير مباشر", familie: "Satzbau" },
  { code: "GGP-097", level: "B1", titelDe: "Vergleichssätze als/wie", titelAr: "تشبيه als/wie", familie: "Satzbau" },
  { code: "GGP-098", level: "B1", titelDe: "Adjektiv Komparation irregulär B1", titelAr: "مقارنة شاذة B1", familie: "Adjektiv" },
  { code: "GGP-099", level: "B1", titelDe: "Modalpartikel denn/mal (B1)", titelAr: "أدوات نبرية B1", familie: "Partikel" },
  { code: "GGP-100", level: "B1", titelDe: "Konditional wenn/falls", titelAr: "شرط wenn/falls", familie: "Konnektoren" },
  { code: "GGP-101", level: "B1", titelDe: "Relativsätze Genitiv (dessen)", titelAr: "موصول Genitiv", familie: "Satzbau" },
  { code: "GGP-102", level: "B1", titelDe: "Temporal seit/seitdem", titelAr: "منذ seit", familie: "Konnektoren" },
  { code: "GGP-103", level: "B1", titelDe: "Adjektiv dekliniert nach Nullartikel", titelAr: "صفة بلا أداة", familie: "Adjektiv" },
  { code: "GGP-104", level: "B1", titelDe: "Verbalisierung Nominal→Verbal B1", titelAr: "تفعيل الاسمية", familie: "Satzbau" },
  { code: "GGP-105", level: "B1", titelDe: "Prüfungsstrategie B1", titelAr: "استراتيجية B1", familie: "Strategie" },
  // ── B2 ~45 ─────────────────────────────────────────────
  { code: "GGP-106", level: "B2", titelDe: "Indirekte Rede Konjunktiv I", titelAr: "غير مباشر Konjunktiv I", familie: "Satzbau" },
  { code: "GGP-107", level: "B2", titelDe: "Partizipialattribute vorangestellt", titelAr: "النعت الاشتقاقي", familie: "Verben" },
  { code: "GGP-108", level: "B2", titelDe: "Nominalstil (Verbal→Nominal)", titelAr: "الأسلوب الاسمي", familie: "Satzbau" },
  { code: "GGP-109", level: "B2", titelDe: "Doppelkonnektoren einerseits…andererseits", titelAr: "روابط مزدوجة", familie: "Konnektoren" },
  { code: "GGP-110", level: "B2", titelDe: "Konzessivsätze obwohl/obgleich", titelAr: "جمل تنازل obwohl", familie: "Konnektoren" },
  { code: "GGP-111", level: "B2", titelDe: "Modalpartikeln eben/halt/doch", titelAr: "أدوات نبرية B2", familie: "Partikel" },
  { code: "GGP-112", level: "B2", titelDe: "Futur II (wird gemacht haben)", titelAr: "مستقبل تام", familie: "Verben" },
  { code: "GGP-113", level: "B2", titelDe: "Nominalisierung komplex", titelAr: "اسمية مركبة", familie: "Wortbildung" },
  { code: "GGP-114", level: "B2", titelDe: "N-Deklination voll (der Student)", titelAr: "N-Deklination كاملة", familie: "Nomen" },
  { code: "GGP-115", level: "B2", titelDe: "Passiv alle Tempora (ist…worden)", titelAr: "مجهول كل الأزمنة", familie: "Verben" },
  { code: "GGP-116", level: "B2", titelDe: "Passiv mit Modalverb B2+ (sei zu…)", titelAr: "مجهول مع sein zu", familie: "Verben" },
  { code: "GGP-117", level: "B2", titelDe: "Infinitiv Passiv (zu erledigen)", titelAr: "مصدر مجهول", familie: "Verben" },
  { code: "GGP-118", level: "B2", titelDe: "Relativsätze generalisierend (wer/was)", titelAr: "موصول عام wer", familie: "Satzbau" },
  { code: "GGP-119", level: "B2", titelDe: "Relativsatz Genitiv B2 (dessen/deren)", titelAr: "موصول Genitiv B2", familie: "Satzbau" },
  { code: "GGP-120", level: "B2", titelDe: "Adjektiv-Partizip (selbstgemacht)", titelAr: "تركيب صفة-اشتقاق", familie: "Adjektiv" },
  { code: "GGP-121", level: "B2", titelDe: "Partizip I attributiv (der ankommende Zug)", titelAr: "اسم فاعل نعتي", familie: "Verben" },
  { code: "GGP-122", level: "B2", titelDe: "Textkonnektoren (einerseits/zudem/dennoch)", titelAr: "روابط نصية", familie: "Konnektoren" },
  { code: "GGP-123", level: "B2", titelDe: "Konditional II Vergangenheit (hätte…gehabt)", titelAr: "شرط ماضي تام", familie: "Verben" },
  { code: "GGP-124", level: "B2", titelDe: "Konjunktiv I in Fragen (ob…)", titelAr: "Konjunktiv I سؤال", familie: "Satzbau" },
  { code: "GGP-125", level: "B2", titelDe: "Funktionsverbgefüge B2 (zum Ausdruck bringen)", titelAr: "Funktionsverben B2", familie: "Verben" },
  { code: "GGP-126", level: "B2", titelDe: "Genitiv-Präpositionen B2 (angesichts, laut)", titelAr: "حروف Genitiv B2", familie: "Kasus" },
  { code: "GGP-127", level: "B2", titelDe: "Adjektivendungen nach Genitiv", titelAr: "نهاية صفة بعد Genitiv", familie: "Adjektiv" },
  { code: "GGP-128", level: "B2", titelDe: "Nominalstil vs Verbalstil Wahl", titelAr: "اختيار الاسمي/الفعلي", familie: "Satzbau" },
  { code: "GGP-129", level: "B2", titelDe: "Bedingungssätze falls/sofern", titelAr: "شرط falls/sofern", familie: "Konnektoren" },
  { code: "GGP-130", level: "B2", titelDe: "Doppelkonnektoren nicht nur…sondern", titelAr: "ليس فقط بل", familie: "Konnektoren" },
  { code: "GGP-131", level: "B2", titelDe: "Modalpartikel wohl/ja (B2 pragmatisch)", titelAr: "wohl/ja براغماتي", familie: "Partikel" },
  { code: "GGP-132", level: "B2", titelDe: "Indirekte Rede mit dass-Wegfall", titelAr: "حذف dass غير مباشر", familie: "Satzbau" },
  { code: "GGP-133", level: "B2", titelDe: "Partizip II als Adjektiv (verheiratet)", titelAr: "اسم مفعول صفة", familie: "Verben" },
  { code: "GGP-134", level: "B2", titelDe: "Attributsätze mit wobei/wodurch", titelAr: "جمل wobei", familie: "Satzbau" },
  { code: "GGP-135", level: "B2", titelDe: "Vorgangspassiv mit sein-Passiv Unterschied", titelAr: "فرق Vorgang/Zustand", familie: "Verben" },
  { code: "GGP-136", level: "B2", titelDe: "Konsekutivsätze sodass (B2)", titelAr: "نتيجة sodass", familie: "Konnektoren" },
  { code: "GGP-137", level: "B2", titelDe: "Finalsätze damit/um…zu B2+ (Abgrenzung)", titelAr: "الغاية B2+", familie: "Satzbau" },
  { code: "GGP-138", level: "B2", titelDe: "Adverbiale Nebensätze indem/während", titelAr: "ظرفية indem", familie: "Satzbau" },
  { code: "GGP-139", level: "B2", titelDe: "Korrelate es/das in Nebensätzen", titelAr: "الضمير المرتبط es", familie: "Pronomen" },
  { code: "GGP-140", level: "B2", titelDe: "Nominalisierung Adjektiv→Nomen (das Gute)", titelAr: "اسمية الصفة", familie: "Wortbildung" },
  { code: "GGP-141", level: "B2", titelDe: "Kohäsion Wiederaufnahme (dieser/jener)", titelAr: "التماسك الإحالي", familie: "Satzbau" },
  { code: "GGP-142", level: "B2", titelDe: "Stil-Ebene Schriftlich vs Mündlich", titelAr: "سجل كتابي/شفهي", familie: "Strategie" },
  { code: "GGP-143", level: "B2", titelDe: "Debatte (These–Antithese–Synthese) B2 mündlich", titelAr: "مناظرة B2", familie: "Strategie" },
  { code: "GGP-144", level: "B2", titelDe: "Redemittel B2 Diskussion", titelAr: "عبارات مناظرة B2", familie: "Strategie" },
  { code: "GGP-145", level: "B2", titelDe: "Wissenschaftssprache Passiv/Nominalstil", titelAr: "لغة أكاديمية", familie: "Satzbau" },
  { code: "GGP-146", level: "B2", titelDe: "Genitivattribut vs von-Phrase", titelAr: "Genitiv مقابل von", familie: "Kasus" },
  { code: "GGP-147", level: "B2", titelDe: "Ellipsen in Schlagzeilen", titelAr: "حذف عناوين", familie: "Satzbau" },
  { code: "GGP-148", level: "B2", titelDe: "Kausalsätze da/zumal", titelAr: "سببية da/zumal", familie: "Konnektoren" },
  { code: "GGP-149", level: "B2", titelDe: "Konzessiv ungeachtet / trotz Genitiv", titelAr: "تنازل trotz Genitiv", familie: "Kasus" },
  { code: "GGP-150", level: "B2", titelDe: "Prüfungsstrategie B2 (Zeit/Nominalstil)", titelAr: "استراتيجية B2", familie: "Strategie" },
] as const;

// ── ربط موضوع → GGP ─────────────────────────────────────────────
// كل topicId يرتبط 1..4 بنى GGP (لا بيانات جديدة — ربط تصنيفي فقط)
export const TOPIC_GGP: Record<string, readonly string[]> = {
  // A0
  "a0-buchstaben": ["GGP-023"], "a0-begrussung": ["GGP-024"], "a0-du-sie": ["GGP-003"], "a0-artikel": ["GGP-004"],
  "a0-satzbau": ["GGP-025"], "a0-aussprache-vowels": ["GGP-021"], "a0-zahlen": ["GGP-029"], "a0-aussprache-umlaut": ["GGP-021"],
  // A1 19
  "a1-sein-haben": ["GGP-001"], "a1-pronomen": ["GGP-003"], "a1-praesens": ["GGP-002"], "a1-trennbar": ["GGP-006"],
  "a1-zahlen": ["GGP-009","GGP-029"], "a1-akkusativ": ["GGP-005"], "a1-plural": ["GGP-026"], "a1-modalverben": ["GGP-007","GGP-016"],
  "a1-weil-dass": ["GGP-036"], "a1-futur-einf": ["GGP-041"],
  "a1-dativ": ["GGP-034"], "a1-wechsel": ["GGP-014"], "a1-imperativ": ["GGP-008"], "a1-perfekt-einf": ["GGP-017"],
  "a1-war-hatte": ["GGP-032"], "a1-zeitpraep": ["GGP-018"], "a1-pruefungsstrategie": ["GGP-030"],
  "a1-aussprache-ch": ["GGP-022"], "a1-aussprache-r": ["GGP-022"], "a1-aussprache-sp-st": ["GGP-021"], "a1-aussprache-auslaut": ["GGP-021"],
  // A2 22
  "a2-perfekt": ["GGP-031","GGP-060"], "a2-praeteritum-grund": ["GGP-032"], "a2-praeteritum": ["GGP-032","GGP-033"],
  "a2-weil-dass": ["GGP-036"], "a2-weil-dass-2": ["GGP-036","GGP-045"], "a2-dativ": ["GGP-034","GGP-049"],
  "a2-wasfuer": ["GGP-051"], "a2-wechsel": ["GGP-035","GGP-063"], "a2-konj2-hoflich": ["GGP-043","GGP-057"],
  "a2-verb-praep": ["GGP-044"], "a2-reflexiv": ["GGP-038"], "a2-negation": ["GGP-042"], "a2-steigerung": ["GGP-039","GGP-062"],
  "a2-adjektiv-einfach": ["GGP-040"], "a2-modal": ["GGP-007"], "a2-imperativ": ["GGP-008"], "a2-futur-einf": ["GGP-041"],
  "a2-futur": ["GGP-041"], "a2-verschmolzene": ["GGP-050"], "a2-neben": ["GGP-046"], "a2-demo": ["GGP-047"], "a2-pruefungsstrategie": ["GGP-065"],
  // B1 15
  "b1-konj2": ["GGP-066","GGP-081"], "b1-passiv": ["GGP-068","GGP-083"], "b1-genitiv": ["GGP-069"], "b1-relativ": ["GGP-070"],
  "b1-konj2-vergangenheit": ["GGP-067"], "b1-konnektoren": ["GGP-073","GGP-088"], "b1-plusquamperfekt": ["GGP-071"],
  "b1-wortbildung": ["GGP-078","GGP-094"], "b1-verb-praeposition": ["GGP-079"], "b1-indirekte-fragen": ["GGP-072","GGP-096"],
  "b1-partizip1": ["GGP-086"], "b1-unbestimmte": ["GGP-080"], "b1-funktionsverben": ["GGP-074"], "b1-absicht": ["GGP-082"], "b1-adjektivendungen": ["GGP-075","GGP-103"], "b1-pruefungsstrategie": ["GGP-105"],
  // B2 18 + ergänzungen
  "b2-passiv": ["GGP-115"], "b2-konjunktiv2-vht": ["GGP-067"], "b2-partizipial": ["GGP-107"],
  "b2-indirekte-rede": ["GGP-106","GGP-124","GGP-132"], "b2-bedingung": ["GGP-123","GGP-129"], "b2-funktionsverben": ["GGP-125"],
  "b2-genitiv-praep": ["GGP-126","GGP-146"], "b2-konzessiv": ["GGP-110"], "b2-partizip": ["GGP-107","GGP-113"],
  "b2-adjektiv-partizip": ["GGP-120","GGP-133"], "b2-partizip1": ["GGP-121"], "b2-infinitiv": ["GGP-117","GGP-137"],
  "b2-doppelkonnektoren": ["GGP-109","GGP-130"], "b2-modalpartikel": ["GGP-111","GGP-131"], "b2-futur-ii": ["GGP-112"],
  "b2-relativ-generalisierend": ["GGP-118"], "b2-relativ-genitiv": ["GGP-119"], "b2-nominalstil": ["GGP-108","GGP-114","GGP-128"],
  "b2-redew": ["GGP-132"], "b2-textkonnektoren": ["GGP-122","GGP-141"], "b2-pruefungsstrategie": ["GGP-150","GGP-142"],
  // Ergänzungen (aus vorhandenen B2 topics — N-Deklination etc.)
  "b2-n-deklination": ["GGP-114"], "b2-k2vht": ["GGP-107"], "b2-nominalisierung": ["GGP-113"],
};

export function ggpForTopic(topicId: string): GGPFeature[] {
  const codes = TOPIC_GGP[topicId] ?? [];
  return codes.map((c) => GGP_FEATURES.find((f) => f.code === c)!).filter(Boolean);
}
export function topicsForGGP(code: string): string[] {
  return Object.entries(TOPIC_GGP).filter(([, v]) => v.includes(code)).map(([k]) => k);
}
export function ggpByLevel(level: GGPLevel): GGPFeature[] {
  return (GGP_FEATURES as readonly GGPFeature[]).filter((f) => f.level === level) as GGPFeature[];
}
export const GGP_FAMILIEN = ["Verben","Kasus","Satzbau","Konnektoren","Nomen","Adjektiv","Pronomen","Wortbildung","Partikel","Strategie","Phonetik"] as const;
