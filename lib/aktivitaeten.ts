// lib/aktivitaeten.ts — سجلّ الأنشطة الموحّد (Aktivitäten-Registry)
// العقد المعماري: كل محرّك/نشاط يسجّل نفسه هنا معلناً: أي جناح؟ أي كفاءة CEFR؟
// أي مستوى؟ أي فئات خطأ يغذّيها؟ — دليل الأجنحة (Modulhandbuch) يُولَّد من هنا،
// والوحدات المُخطَّطة (M-Z) تظهر بحالة «قيد الإعداد» حتى تُبنى داخل مكانها الصحيح.

import type { Kompetenz } from "./types";

export type Fluegel = "kurs" | "pruefen" | "ueben" | "foerdern";

export type Aktivitaet = {
  id: string;
  emoji: string;
  titel: string; // Deutsch
  unter: string; // العربية
  fluegel: Fluegel;
  handlung: Kompetenz[]; // كفاءات CEFR المستهدفة
  stufe: [number, number]; // نطاق مستوى الخطة (1..8)
  merkmal: string;
  fehlerarten: string[] | "—"; // فئات FEHLER_KAT التي يغذّيها
  status: "live" | "geplant";
  nurKatalog?: boolean; // يظهر في الدليل لكنه مستضاف داخل بطاقة أخرى
};

export const FLUEGEL_META: { id: Fluegel; emoji: string; titel: string; unter: string }[] = [
  { id: "kurs", emoji: "🎓", titel: "الجناح التعليمي — Lernplan-Kurs", unter: "خطة يومية محكمة من اليوم 1 إلى 378 تعوّض حصص المدرسة" },
  { id: "pruefen", emoji: "📝", titel: "جناح الامتحان — Prüfungszentrum", unter: "محاكاة رسمية بتوقيت Goethe + تحديد مستوى + Sprint" },
  { id: "ueben", emoji: "💪", titel: "جناح التدريب — Kompetenz-Training", unter: "مدرّبات مصنّفة بالكفاءة اللغوية لا باسم الأداة" },
  { id: "foerdern", emoji: "🩺", titel: "جناح التقوية — Förderzentrum", unter: "دفتر الأخطاء والتكرار المتباعد والتقارير والتحفيز" },
];

export const AKTIVITAETEN: Aktivitaet[] = [
  // ————— 🎓 الجناح التعليمي —————
  { id: "tagesplan", emoji: "🗺️", titel: "خطة اليوم — Tagesplan", unter: "مهام اليوم بإغلاق إلزامي وتعويضات", fluegel: "kurs", handlung: ["Grammatik", "Wortschatz", "Schreiben", "Hoeren", "Lesen", "Sprechen"], stufe: [1, 8], merkmal: "378 يوماً × خطة مولّدة حتمياً: تعلّم/تثبيت/فحص أسبوعي/امتحان مرحلة — ما لم يُتقَن يُرحَّل تعويضاً", fehlerarten: "—", status: "live" },
  { id: "wegweiser", emoji: "🧭", titel: "البوصلة اليومية — WegWeiser", unter: "ثلاث وجهات من السجلّ حسب مرحلتك · المقفل مؤجَّل لا محذوف", fluegel: "kurs", handlung: ["Lesen", "Hoeren", "Schreiben", "Sprechen"], stufe: [1, 8], merkmal: "lib/weg.ts يشتق المرحلة من اليوم ويرشّح الأنشطة بشبكة الكفاءات — K20 تحكُم حتميتها", fehlerarten: "—", status: "live" },
  { id: "wochenplan", emoji: "📆", titel: "المادة الأسبوعية — Wochenplan", unter: "مفردات وأفعال ومواصفات الأسبوع", fluegel: "kurs", handlung: ["Wortschatz", "Grammatik"], stufe: [1, 8], merkmal: "قوائم مادة الأسبوع مربوطة بأيامها", fehlerarten: "—", status: "live" },
  { id: "arbeitsblatt", emoji: "📄", titel: "الواجب المطبوع — Arbeitsblatt", unter: "ورقة أسبوعية بالعربية", fluegel: "kurs", handlung: ["Schreiben", "Wortschatz"], stufe: [1, 8], merkmal: "تصطفّ مع خطة الأسبوع وتُطبع للأسرة", fehlerarten: "—", status: "live", nurKatalog: true, },
  { id: "elternbrief", emoji: "🏠", titel: "إشراف الأسرة — Elternbrief", unter: "كتيّب أسبوعي لأولياء الأمور", fluegel: "kurs", handlung: ["Sprechen"], stufe: [1, 8], merkmal: "15 دقيقة مطلوبة من الأسرة + قوائم تسميع بالعربية", fehlerarten: "—", status: "live" },
  { id: "lehrerbericht", emoji: "🧑‍🏫", titel: "تقرير المدرّس الأسبوعي", unter: "تشخيص عربي كل فحص أسبوعي", fluegel: "kurs", handlung: ["Grammatik", "Wortschatz"], stufe: [1, 8], merkmal: "أيام الفحص الأسبوعي فقط — تحليل دفتر الأخطاء وخطة الأسبوع القادم", fehlerarten: "—", status: "live", nurKatalog: true },
  { id: "lektionsgenerator", emoji: "🧭", titel: "مركز الحصص الذاتية — LektionsZentrum (R)", unter: "حصة 25د مركّبة + حزم السياق", fluegel: "kurs", handlung: ["Grammatik", "Schreiben", "Hoeren", "Wortschatz"], stufe: [2, 8], merkmal: "حصة حتمية 25د = 15 بناء (قواعد·مفردات·استماع) + 10 إنتاج يوجّهه دفتر أخطائك + مؤقّت — وبطاقتا مركز حزم السياق", fehlerarten: ["wortschatz", "schreibung", "sonst"], status: "live" },
  { id: "pakete", emoji: "🧳", titel: "حزم السياق الحيوي", unter: "✈️ سفر · 💼 مقابلة · 🏠 بحث عن سكن", fluegel: "kurs", handlung: ["Sprechen", "Schreiben", "Wortschatz"], stufe: [2, 8], merkmal: "3 حزم × (12 جملة ببطاقات تسميع + حوار بأدوار + نموذجان كتابيان) — مستضافة داخل LektionsZentrum", fehlerarten: ["wortschatz"], status: "live", nurKatalog: true },
  { id: "szenarien", emoji: "🏥", titel: "سيناريوهات الحياة — LebensSzenarien (Q)", unter: "طوارئ · بلدية · بنك · سكن · عمل · جامعة", fluegel: "kurs", handlung: ["Sprechen", "Schreiben", "Wortschatz"], stufe: [2, 8], merkmal: "لكل سيناريو: 6 جُمل مسموعة + حواران بأدوار + نموذج طلب رسمي + دور مُصاغ بخطة ثلاثية", fehlerarten: ["wortschatz", "konstruktion"], status: "live" },
  { id: "schulsim", emoji: "🎒", titel: "محاكاة المدرسة", unter: "إجازة · رحلة متحف · شهادة تخرّج", fluegel: "kurs", handlung: ["Schreiben", "Wortschatz"], stufe: [2, 8], merkmal: "نماذج رسمية بمفردات المدرسة — الوحدة Y", fehlerarten: "—", status: "live" },
  { id: "eltern2", emoji: "👪", titel: "حزمة العائلة المتقدمة — ElternPaket (V)", unter: "تقرير EN · دليل Diktat · اجتماع الأحد", fluegel: "kurs", handlung: ["Sprechen"], stufe: [1, 8], merkmal: "Family Report بالإنجليزية للغير ناطقين + ورقة تسميع منزلية بمفتاح طيّ + طقس اجتماع الأحد بخمس خطوات", fehlerarten: "—", status: "live" },

  // ————— 📝 جناح الامتحان —————
  { id: "einstufung", emoji: "🪪", titel: "اختبار تحديد المستوى", unter: "Einstufungstest — يظهر تلقائياً قبل البدء", fluegel: "pruefen", handlung: ["Grammatik", "Wortschatz", "Lesen"], stufe: [1, 8], merkmal: "يحدّد نقطة الانطلاق في الخطة ثم يختفي", fehlerarten: "—", status: "live" },
  { id: "probeklausur", emoji: "🧪", titel: "الامتحان التجريبي — Probeklausur", unter: "محاكاةٌ كاملةٌ بأربعةِ أقسام + أربعُ محاكاتٍ مهاريّةٍ مستقلّة (قراءة/استماع/كتابة/كلام) + Sprint", fluegel: "pruefen", handlung: ["Lesen", "Hoeren", "Grammatik", "Schreiben"], stufe: [3, 8], merkmal: "قراءة/استماع/تركيب/كتابة + خطة آخر 30 يوماً قبل امتحانك الخارجي", fehlerarten: ["artikel", "wortstellung", "zeitform", "konstruktion", "schreibung"], status: "live" },
  { id: "teil3ueb", emoji: "🧩", titel: "بنك الأسئلة التراكمي — PrüfungsZentrum (M)", unter: "صح/خطأ مولَّد · ترتيب حوار · أسبوعي · Mock ببذرة", fluegel: "pruefen", handlung: ["Grammatik", "Wortschatz", "Lesen", "Hoeren"], stufe: [1, 8], merkmal: "أربعة أنماط في محرّك واحد: عبارات مزوَّرة بالتشويه + ترتيب حوار + اختبار أسبوعي تراكمي + محاكاة ببذرة رقمية حتمية", fehlerarten: ["wortstellung", "wortschatz", "artikel", "schreibung"], status: "live" },
  { id: "interview2", emoji: "🎭", titel: "مقابلات موسّعة", unter: "بحث · صحة · أرقام · مقابلة عمل", fluegel: "pruefen", handlung: ["Sprechen"], stufe: [4, 8], merkmal: "Teil 1 بسيناريوهات جديدة + CriticRadar — الوحدة M", fehlerarten: ["falsche-freunde"], status: "live" },
  { id: "briefe", emoji: "✉️", titel: "إدارة النصوص الرسمية", unter: "شكوى · اعتذار · طلب · تظلم", fluegel: "pruefen", handlung: ["Schreiben"], stufe: [4, 8], merkmal: "تمرين الـ90 كلمة بتقدير رسمي — ضمن الوحدة Q/S", fehlerarten: ["konstruktion", "schreibung"], status: "live" },

  // ————— 💪 جناح التدريب —————
  { id: "konj", emoji: "🔄", titel: "مدرّب التصريف — KonjTrainer", unter: "تصريف كامل بستّة أزمنة", fluegel: "ueben", handlung: ["Grammatik"], stufe: [1, 8], merkmal: "أقمِط/أوزن/أسبك/أصوغ — عقوبة تكرار للفعل الصعب", fehlerarten: ["zeitform"], status: "live", nurKatalog: true },
  { id: "diktat", emoji: "🎧", titel: "معسكر الإملاء — Diktat-Bootcamp", unter: "إملاء متدرّج من القصير للطويل", fluegel: "ueben", handlung: ["Schreiben", "Hoeren"], stufe: [1, 8], merkmal: "8 جُمل بتصحيح فوري + ميزة إعادة التسميع — الفائت يذهب للدفتر", fehlerarten: ["schreibung"], status: "live", nurKatalog: true },
  { id: "arena", emoji: "🥊", titel: "ميادين القواعد — Grammatik-Arena", unter: "الأدوات والحالات · الروابط · المجهول", fluegel: "ueben", handlung: ["Grammatik"], stufe: [2, 8], merkmal: "30 سؤالاً حتمياً بمحرّك توليد — der/dem/den/des + weil/obwohl + Passiv", fehlerarten: ["artikel", "praeposition", "konstruktion", "zeitform"], status: "live", nurKatalog: true },
  { id: "schreibwerkstatt", emoji: "✍️", titel: "ورشة الكتابة بالتوقيت — SchreibWerkstatt", unter: "Teil 1: 15د · Teil 2: 28د", fluegel: "ueben", handlung: ["Schreiben"], stufe: [3, 8], merkmal: "مؤقّت امتحاني + عدّاد كلمات + معايير Goethe الذاتية + مستشار كتابة", fehlerarten: ["konstruktion", "schreibung"], status: "live", nurKatalog: true },
  { id: "sprechen", emoji: "🎤", titel: "تدريب النطق — SprechTrainer", unter: "تسميع بالتعرف على الصوت", fluegel: "ueben", handlung: ["Sprechen"], stufe: [1, 8], merkmal: "Micro-Drill تدريجي + محاكاة Teil 1 بنقاط مفصلة", fehlerarten: ["falsche-freunde"], status: "live", nurKatalog: true },
  { id: "blitz", emoji: "⚡", titel: "حقيبة الدقيقة — BlitzDrill", unter: "جولة 60 ثانية · خمس رقعات incl. العينة الأصعب", fluegel: "ueben", handlung: ["Grammatik", "Wortschatz"], stufe: [1, 8], merkmal: "شاذّ الجمع · مقارنة · Imperativ · أخطاؤك أنت · فخاخ B2/C1 (16 ركيزة) — الوحدة X", fehlerarten: ["zeitform", "wortstellung", "artikel"], status: "live" },
  { id: "muendlich", emoji: "🗣️", titel: "مختبر الشفهي — MündlichLabor (AA)", unter: "Teil 2 وصف صورة · Teil 3 مناقشة باعتراض مفاجئ — مؤقّت وتقدير ذاتي", fluegel: "ueben", handlung: ["Sprechen"], stufe: [4, 8], merkmal: "12 بطاقة (6+6) · 12 اعتراضاً حتمياً (60–120ث) · 240/300 ثانية · لا تسجيل للصوت أو درجة لغوية", fehlerarten: "—", status: "live" },
  { id: "hoeren", emoji: "🎧", titel: "معمل الاستماع — HörLabor (AF)", unter: "نصوص بنكك تُنطَق: تدريب مفتوح · امتحان باستماعة واحدة", fluegel: "ueben", handlung: ["Hoeren"], stufe: [2, 8], merkmal: "معدّلان نظاميان 0.7×/0.95× · الأسئلة تُقفل حتى استماعة · القانون في lib/hoeren نقي تُحاكمه K24 · أخطاؤك إلى الدفتر بفئة hoeren", fehlerarten: ["hoeren"], status: "live" },
  { id: "kontrakt", emoji: "🔒", titel: "عقد الانضباط — Tagesvertrag (O)", unter: "موعد إغلاق ليلي + غرامة رمزية من سجلّك أنت", fluegel: "foerdern", handlung: ["Grammatik", "Wortschatz", "Schreiben", "Hoeren", "Lesen", "Sprechen"], stufe: [1, 8], merkmal: "حكم نقي حتمي: برهانُ إتمامٍ واحد يبرّئ · غرامة واحدة لكل يوم · عارٌ مولَّد من دفتر صاحبه · مزّق = إلغاء بلا أثر", fehlerarten: "—", status: "live" },
  { id: "vortrag", emoji: "🎤", titel: "منصة العرض — VortragsBühne (AC)", unter: "قالب Goethe: تحضير 15د ← عرض 4د ← سؤال شريك", fluegel: "ueben", handlung: ["Sprechen"], stufe: [4, 8], merkmal: "16 موضوعاً = 8 لوحات Goethe × 2 · خمسة أركان تُقدَّر ذاتياً من 10 · بروتوكول مطبوع · خارج SRS عمداً", fehlerarten: "—", status: "live" },
  { id: "tiefenlex", emoji: "🔍", titel: "العمق المعجمي — TiefenLexikon (P)", unter: "سياق · Nuancen · Verb+Präp · Funktionsverben", fluegel: "ueben", handlung: ["Wortschatz"], stufe: [2, 8], merkmal: "12 زوج فروق دقيقة + 20 فعل بجرّه الثابت وحالتها + 12 تركيباً رسمياً خفيفاً + المعنى بالسياق من الموسوعة", fehlerarten: ["wortschatz", "praeposition", "falsche-freunde", "konstruktion"], status: "live" },
  { id: "testarten", emoji: "🧠", titel: "الاختبارات الذاتية", unter: "استرجاع حر · Cloze بلا خيارات · تداخل", fluegel: "ueben", handlung: ["Wortschatz", "Grammatik"], stufe: [2, 8], merkmal: "تقوية الذاكرة بعيداً عن التعرف السطحي — الوحدة W", fehlerarten: ["wortschatz"], status: "live" },
  { id: "lernstrategie", emoji: "🎓", titel: "مدرّس تعلّم التعلّم الموسّع", unter: "استراتيجيات كل Teil + Pomodoro + Feynman", fluegel: "foerdern", handlung: ["Lesen", "Hoeren", "Schreiben", "Sprechen"], stufe: [3, 8], merkmal: "كيف تذاكر وتوزّع الوقت وتشرح لنفسك — الوحدة O", fehlerarten: "—", status: "live" },

  // ————— 🩺 جناح التقوية —————
  { id: "fehlerkartei", emoji: "🐞", titel: "دفتر الأخطاء — Fehlerkartei", unter: "10 فئات + تكرار متباعد لكل خطأ", fluegel: "foerdern", handlung: ["Grammatik", "Wortschatz", "Schreiben"], stufe: [1, 8], merkmal: "كل محرّك يصبّ أخطاءه هنا — مركز العلاج الوحيد (Fehlerheft/Fallstricke مدمجان في مهام اليوم)", fehlerarten: ["falsche-freunde", "wortstellung", "artikel", "praeposition", "zeitform", "zahlen-zeit", "konstruktion", "schreibung", "wortschatz", "sonst"], status: "live" },
  { id: "fehlerlabor", emoji: "🔬", titel: "معمل تحليل الخطأ العميق — Fehlerlabor (N)", unter: "ستّة أسباب · عائلات · حرارة · مقاومة", fluegel: "foerdern", handlung: ["Grammatik", "Wortschatz"], stufe: [1, 8], merkmal: "تصنيف الأسباب النفس-لغوية + شجرة العائلات بتدريب فوري + شبكة حرارة 6 أسابيع + بروتوكول الخطأ المقاوم وخطأ الشهر", fehlerarten: ["falsche-freunde", "wortstellung", "artikel", "praeposition", "zeitform", "zahlen-zeit", "konstruktion", "schreibung", "wortschatz", "sonst"], status: "live" },
  { id: "berichte", emoji: "📊", titel: "مركز التقارير — BerichteZentrum (T)", unter: "جاهزية · فجوات · PDF شهري · ورقة رسمية · CSV", fluegel: "foerdern", handlung: ["Lesen", "Hoeren", "Schreiben", "Sprechen"], stufe: [1, 8], merkmal: "مؤشر Prüfungsbereitschaft (40/25/20/15 من شبكة الكفاءات) + العوائق الثلاث بخططها + تقرير PDF مطبوع + ورقة رسمية A4 بختم تحقّق حتمي + تصدير CSV", fehlerarten: "—", status: "live" },
  { id: "gesundheit", emoji: "🌿", titel: "وحة الصحّة — GesundheitsWache (U)", unter: "20-20-20 + وضع المريض", fluegel: "foerdern", handlung: ["Lesen", "Hoeren"], stufe: [1, 8], merkmal: "حارس عين كل 20 دقيقة (استراحة قسرية 20ث) + حدّ أدنى مُرحّم من 3 خطوات ليوم المرض يحفظ السلسلة", fehlerarten: "—", status: "live" },
  { id: "abzeichen", emoji: "🏅", titel: "الأوسمة والتحفيز — Abzeichen", unter: "شارات الإنجاز ومستويات XP", fluegel: "foerdern", handlung: ["Wortschatz"], stufe: [1, 8], merkmal: "محفّزات الإنجاز بعد مواقف الانقطاع — لا تُنهي الخطة", fehlerarten: "—", status: "live" },
];
