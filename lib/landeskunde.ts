/**
 * 🏛️ A23+A26 (R285, Experten-Audit ← N34/N37): funktionale Landeskunde-Einheiten
 * (Amt/Krankenkasse/Mietvertrag/Bankkonto/Behördenpost) + Tunesien-Pfad
 * (Botschaft/Urkunden/Anerkennung/Sprache). Allgemeine praktische Orientierung,
 * keine Rechtsberatung — Gebühren/Termine/Verfahren ändern sich, ehrlich markiert.
 */
export interface LandesEinheit {
  id: string;
  gruppe: "amt" | "tunesien";
  icon: string;
  titelAr: string;
  titelDe: string;
  introAr: string;
  schritte: string[];
  saetze: { de: string; ar: string }[];
  woerter: { de: string; ar: string }[];
}

export const LANDES_EINHEITEN: LandesEinheit[] = [
  {
    id: "lk-buergeramt", gruppe: "amt", icon: "🏛️", titelAr: "التسجيل في مكتب المواطنين", titelDe: "Anmeldung beim Bürgeramt",
    introAr: "أول ورقة في ألمانيا: تسجيل عنوان سكنك خلال 14 يومًا من الانتقال — بلا تسجيل لا حساب بنكي ولا عقد عمل غالبًا.",
    schritte: [
      "احجز موعدًا (Termin) عبر موقع بلديتك أو اذهب باكرًا وخذ رقم انتظار (Wartenummer).",
      "الأوراق: جواز السفر + عقد الإيجار أو تأكيد المُسكِن (Wohnungsgeberbestätigung) من المؤجّر.",
      "ستحصل على شهادة التسجيل (Meldebescheinigung) — احتفظ بنسخ منها، ستُطلب في كل مكان.",
      "عند كل انتقال جديد: إعادة تسجيل (Ummeldung) بنفس الطريقة.",
    ],
    saetze: [
      { de: "Ich möchte mich anmelden.", ar: "أريد تسجيل سكني." },
      { de: "Ich habe einen Termin um zehn Uhr.", ar: "لديّ موعد في العاشرة." },
      { de: "Hier ist meine Wohnungsgeberbestätigung.", ar: "هذا تأكيد المُسكِن." },
      { de: "Bekomme ich eine Meldebescheinigung?", ar: "هل أحصل على شهادة تسجيل؟" },
    ],
    woerter: [
      { de: "die Anmeldung", ar: "التسجيل" },
      { de: "der Termin", ar: "الموعد" },
      { de: "die Bestätigung", ar: "التأكيد/الشهادة" },
      { de: "der Wohnungsgeber", ar: "المُسكِن (المؤجّر)" },
    ],
  },
  {
    id: "lk-krankenkasse", gruppe: "amt", icon: "🩺", titelAr: "التأمين الصحي وبطاقة الطبيب", titelDe: "Krankenkasse & Arztbesuch",
    introAr: "التأمين الصحي إلزامي: تختار شركة تأمين (Krankenkasse) عند أول عمل، وتدفع أنت وصاحب العمل الاشتراك مناصفة تقريبًا.",
    schritte: [
      "قارن بين شركات التأمين القانونية واختر واحدة وقدّم طلب عضوية (Mitgliedschaft) عند بدء العمل.",
      "ستصلك بطاقة التأمين (Gesundheitskarte) بالبريد — قدّمها في كل زيارة طبيب.",
      "اختر طبيب أسرة (Hausarzt) قريبًا وسجّل عنده؛ هو بوابتك لأي تحويل (Überweisung) لاختصاصي.",
      "موعد اختصاصي طويل الانتظار؟ خدمة حجز المواعيد الهاتفية (116 117) تساعد رسميًا.",
    ],
    saetze: [
      { de: "Ich möchte Mitglied werden.", ar: "أريد أن أصبح عضوًا." },
      { de: "Hier ist meine Gesundheitskarte.", ar: "هذه بطاقة التأمين." },
      { de: "Ich brauche einen Termin beim Hausarzt.", ar: "أحتاج موعدًا عند طبيب الأسرة." },
      { de: "Können Sie mir eine Überweisung geben?", ar: "هل يمكن إعطائي تحويلًا؟" },
    ],
    woerter: [
      { de: "die Krankenkasse", ar: "شركة التأمين الصحي" },
      { de: "der Beitrag", ar: "الاشتراك" },
      { de: "die Überweisung", ar: "التحويل الطبي" },
      { de: "der Hausarzt", ar: "طبيب الأسرة" },
    ],
  },
  {
    id: "lk-mietvertrag", gruppe: "amt", icon: "🔑", titelAr: "عقد الإيجار بلا مفاجآت", titelDe: "Mietvertrag verstehen",
    introAr: "العقد يلزمك سنوات غالبًا: اقرأ الإيجار البارد/الدافئ، التأمين (Kaution)، ومهلة الإلغاء قبل التوقيع لا بعده.",
    schritte: [
      "Kaltmiete إيجار أساسي، وWarmmiete = الأساسي + تكاليف إضافية (Nebenkosten: تدفئة/ماء/خدمات) — قارن بالدافئ دائمًا.",
      "التأمين (Kaution) غالبًا 3 أشهر باردة، يُدفع على 3 دفعات ويُسترد بعد الخروج إن سلمت الشقة كما استلمتها.",
      "وثّق حالة الشقة عند الاستلام بمحضر وصور (Übergabeprotokoll) — يحمي تأمينك لاحقًا.",
      "إلغاء العقد (Kündigung) كتابةً وبمهلة 3 أشهر عادةً، بالتوقيع والتسليم الموثّق.",
    ],
    saetze: [
      { de: "Wie hoch ist die Warmmiete?", ar: "كم الإيجار الدافئ؟" },
      { de: "Kann ich die Kaution in drei Raten zahlen?", ar: "هل أدفع التأمين على ثلاث دفعات؟" },
      { de: "Machen wir ein Übergabeprotokoll?", ar: "هل نحرّر محضر استلام؟" },
      { de: "Ich kündige den Vertrag fristgerecht.", ar: "ألغي العقد ضمن المهلة." },
    ],
    woerter: [
      { de: "die Kaution", ar: "التأمين/العربون" },
      { de: "die Nebenkosten", ar: "التكاليف الإضافية" },
      { de: "die Kündigungsfrist", ar: "مهلة الإلغاء" },
      { de: "der Mieter", ar: "المستأجر" },
    ],
  },
  {
    id: "lk-bankkonto", gruppe: "amt", icon: "🏦", titelAr: "فتح حساب بنكي واستعماله", titelDe: "Girokonto & Zahlungen",
    introAr: "الحساب الجاري (Girokonto) شرط للراتب والإيجار: تحتاج التسجيل (Anmeldung) والجواز ورقمك الضريبي لاحقًا.",
    schritte: [
      "افتح الحساب بجوازك وشهادة التسجيل؛ ستصلك بطاقة (Girocard) ورقم IBAN بالبريد منفصلين عن الرقم السري.",
      "IBAN عنوان حسابك الدولي — أعطه لصاحب العمل والمؤجّر فقط، واحذر مشاركته علنًا.",
      "Überweisung تحويل لمرة، وDauerauftrag أمر دائم شهري (للإيجار)، وLastschrift سحب بتفويض (للاشتراكات).",
      "راقب كشف الحساب (Kontoauszug) شهريًا؛ كثير من العقود تُجدَّد صامتًا إن لم تُلغَ في مهلتها.",
    ],
    saetze: [
      { de: "Ich möchte ein Girokonto eröffnen.", ar: "أريد فتح حساب جارٍ." },
      { de: "Wie ist meine IBAN?", ar: "ما رقم IBAN الخاص بي؟" },
      { de: "Ich richte einen Dauerauftrag für die Miete ein.", ar: "أُنشئ أمرًا دائمًا للإيجار." },
      { de: "Es gibt eine falsche Abbuchung.", ar: "يوجد سحب خاطئ." },
    ],
    woerter: [
      { de: "das Girokonto", ar: "الحساب الجاري" },
      { de: "die Überweisung", ar: "التحويل" },
      { de: "der Dauerauftrag", ar: "الأمر الدائم" },
      { de: "die Abbuchung", ar: "السحب/الخصم" },
    ],
  },
  {
    id: "lk-behoerdenpost", gruppe: "amt", icon: "✉️", titelAr: "قراءة بريد الدوائر الرسمية", titelDe: "Behördenpost lesen",
    introAr: "الرسالة الرسمية ليست تهديدًا بل ساعة رملية: فيها قرار (Bescheid) ومهلة (Frist) وحقّ اعتراض (Widerspruch) — اقرأ المهلة أولًا.",
    schritte: [
      "حدّد: من المُرسل؟ ما القرار؟ ما المهلة بالضبط (bis zum …)؟ — ثلاثتها في أول صفحة غالبًا.",
      "الاعتراض (Widerspruch) كتابةً قبل انتهاء المهلة (شهر عادةً) — احتفظ بإثبات الإرسال.",
      "لا تفهم فقرة؟ مكاتب استشارة المهاجرين (Migrationsberatung) مجانية ورسمية في مدينتك.",
      "رتّب رسائلك بملف واحد بتاريخ الوصول؛ أكثر المشاكل من مهلة فائتة لا من قرار ظالم.",
    ],
    saetze: [
      { de: "Ich habe Ihren Bescheid erhalten.", ar: "استلمت قراركم." },
      { de: "Hiermit lege ich Widerspruch ein.", ar: "بموجب هذا أعترض." },
      { de: "Bis wann muss ich antworten?", ar: "حتى متى يجب أن أردّ؟" },
      { de: "Können Sie mir den Brief erklären?", ar: "هل تشرحون لي الرسالة؟" },
    ],
    woerter: [
      { de: "der Bescheid", ar: "القرار الرسمي" },
      { de: "die Frist", ar: "المهلة" },
      { de: "der Widerspruch", ar: "الاعتراض" },
      { de: "die Beratung", ar: "الاستشارة" },
    ],
  },
  {
    id: "lk-tn-botschaft", gruppe: "tunesien", icon: "🇹🇳", titelAr: "من تونس: السفارة والتأشيرة", titelDe: "Botschaft Tunis & Visum",
    introAr: "مسار تونسي يبدأ قبل السفر: نوع التأشيرة الصحيح (عمل/اعتراف/لغة) يوفّر أشهرًا — تحقّق دائمًا من موقع السفارة الألمانية في تونس فالإجراءات تتغيّر.",
    schritte: [
      "حدّد هدفك بدقة: عمل مباشر، اعتراف بمؤهّل (Anerkennung)، أم دورة لغة — لكلٍّ ملفّ مختلف.",
      "احجز موعد التأشيرة عبر نظام السفارة في تونس باكرًا؛ قوائم الانتظار طويلة في مواسم الذروة.",
      "جهّز الملف كاملًا بلا نقص: جواز، صور بيومترية، عقود/إثباتات، شهادات مترجمة (انظر وحدة المستندات).",
      "أي ناقص يعني غالبًا رفضًا أو إعادة حجز — راجع قائمة السفارة الرسمية بندًا بندًا قبل الموعد.",
    ],
    saetze: [
      { de: "Ich beantrage ein Visum zur Anerkennung.", ar: "أطلب تأشيرة بهدف الاعتراف." },
      { de: "Ich arbeite als Krankenpfleger.", ar: "أعمل ممرّضًا." },
      { de: "Hier sind meine vollständigen Unterlagen.", ar: "هذه أوراقي كاملة." },
      { de: "Wann bekomme ich eine Antwort?", ar: "متى أحصل على ردّ؟" },
    ],
    woerter: [
      { de: "das Visum", ar: "التأشيرة" },
      { de: "die Botschaft", ar: "السفارة" },
      { de: "die Unterlagen", ar: "الأوراق/المستندات" },
      { de: "vollständig", ar: "كامل" },
    ],
  },
  {
    id: "lk-tn-urkunden", gruppe: "tunesien", icon: "📜", titelAr: "المستندات: ترجمة وتصديق", titelDe: "Urkunden: Übersetzung & Legalisation",
    introAr: "الشهادة التونسية لا تتكلم وحدها في ألمانيا: تحتاج ترجمة محلفة، وأحيانًا سلسلة تصديق — الترتيب يوفّر المال والوقت.",
    schritte: [
      "الترجمة المحلّفة (beglaubigte Übersetzung) عند مترجم معتمد — في ألمانيا غالبًا من مترجم محلف لدى محاكمها.",
      "بعض الجهات تطلب تصديقًا (Legalisation) لسلسلة الجهات التونسية ثم السفارة — اسأل الجهة الألمانية المستقبِلة أولًا عمّا تطلبه بالضبط قبل أن تدفع.",
      "احتفظ بالأصل دائمًا؛ قدّم نسخًا مصدّقة (beglaubigte Kopien) واترك الأصل في ملفّك.",
      "رقمن كل شيء (مسح واضح) — سترفع الملفات نفسها في بوابات متعددة.",
    ],
    saetze: [
      { de: "Ich brauche eine beglaubigte Übersetzung.", ar: "أحتاج ترجمة محلّفة/مصدّقة." },
      { de: "Ist diese Urkunde anerkannt?", ar: "هل هذه الشهادة معترف بها؟" },
      { de: "Das ist eine beglaubigte Kopie.", ar: "هذه نسخة مصدّقة." },
      { de: "Wo kann ich das legalisieren lassen?", ar: "أين أصدّق هذا؟" },
    ],
    woerter: [
      { de: "die Urkunde", ar: "الشهادة/الوثيقة" },
      { de: "beglaubigt", ar: "مصدّق/محلّف" },
      { de: "die Übersetzung", ar: "الترجمة" },
      { de: "das Original", ar: "الأصل" },
    ],
  },
  {
    id: "lk-tn-anerkennung", gruppe: "tunesien", icon: "🎓", titelAr: "الاعتراف بالمؤهّلات (خصوصًا التمريض)", titelDe: "Anerkennung & Pflege",
    introAr: "الاعتراف قرار جهة ألمانية مختصة بولايتك: قارِن شهادتك بقاعدة anabin، وجهّز للتمريض لغة مهنية B2 وامتحانًا/تكييفًا.",
    schritte: [
      "تحقّق من تقييم شهادتك الجامعية في قاعدة anabin الرسمية، وللشهادات: بيان تقييم (Zeugnisbewertung) من ZAB عند الحاجة.",
      "بوابة anerkennung-in-deutschland.de الرسمية تحدد الجهة المختصة بمهنتك وولايتك — ابدأ منها لا من وسطاء.",
      "للممرّضين من خارج الاتحاد: اعتراف يتطلب غالبًا امتحان معرفة (Kenntnisprüfung) أو دورة تكييف (Anpassungslehrgang) + لغة مهنية B2 (Fachsprachenprüfung).",
      "مسار التمريض داخل التطبيق (Pflege) يدرّبك على مفرداته ومواقفه — اربطه بخطتك الزمنية مبكرًا.",
    ],
    saetze: [
      { de: "Ich möchte meinen Abschluss anerkennen lassen.", ar: "أريد الاعتراف بشهادتي." },
      { de: "Welche Behörde ist zuständig?", ar: "أي جهة مختصة؟" },
      { de: "Ich bereite mich auf die Kenntnisprüfung vor.", ar: "أستعدّ لامتحان المعرفة." },
      { de: "Ich habe die Fachsprachenprüfung B2 bestanden.", ar: "نجحت في امتحان اللغة المهنية B2." },
    ],
    woerter: [
      { de: "die Anerkennung", ar: "الاعتراف" },
      { de: "zuständig", ar: "مختصّ" },
      { de: "der Abschluss", ar: "الشهادة/المؤهّل" },
      { de: "die Kenntnisprüfung", ar: "امتحان المعرفة" },
    ],
  },
  {
    id: "lk-tn-sprache", gruppe: "tunesien", icon: "🗣️", titelAr: "اللغة قبل السفر ومن تونس", titelDe: "Sprache: von Tunesien aus",
    introAr: "كل مستوى تنجزه من تونس يختصر أشهرًا في ألمانيا: استهدف شهادة معترفًا بها، وتحقّق من قبولها لدى جهة ملفّك (سفارة/اعتراف/جامعة).",
    schritte: [
      "معهد غوته في تونس (Goethe-Institut Tunis) وامتحانات telc مسارات معروفة — تأكّد من الجهات والتواريخ الحالية من مواقعها الرسمية.",
      "للاعتراف المهني للتمريض يُطلب غالبًا B2 عام + لغة مهنية لاحقًا داخل ألمانيا؛ خطّط للعام أولًا.",
      "ادرس بمصادر معلنة المصدر ووثّق تقدمك (هذا التطبيق يحفظ سجلّك محليًا ويمكن تصديره).",
      "لا تدفع لوسطاء يعدون بشهادة بلا امتحان — الشهادات تُتحقق منها رسميًا وتُكشف المزوّرة.",
    ],
    saetze: [
      { de: "Ich habe das B1-Zertifikat.", ar: "لديّ شهادة B1." },
      { de: "Ich lerne Deutsch für die Anerkennung.", ar: "أتعلم الألمانية للاعتراف." },
      { de: "Wann ist die nächste Prüfung?", ar: "متى الامتحان القادم؟" },
      { de: "Mein Ziel ist B2 in einem Jahr.", ar: "هدفي B2 خلال سنة." },
    ],
    woerter: [
      { de: "das Zertifikat", ar: "الشهادة" },
      { de: "das Ziel", ar: "الهدف" },
      { de: "die Prüfung", ar: "الامتحان" },
      { de: "anerkannt", ar: "معترف به" },
    ],
  },
];
