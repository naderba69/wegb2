/**
 * بنك الأصدقاء الكاذبين عربي-ألماني (False-Friends-Bank).
 * K-Interferenz: كلمات متشابهة لفظياً أو شكلياً بين العربية/الإنجليزية/الفرنسية/الألمانية
 * لكن معناها مختلف — تُستخدم في تدريبات «فخاخ» أسبوعية.
 *
 * كل مدخل: الكلمة الألمانية، معناها الحقيقي عربياً، الصديق الكاذب (أي لغة) + ترجمته الخاطئة الشائعة،
 * وشرح مختلط يساعد على تفادي الخلط.
 */
export type FalscherFreund = {
  de: string;
  ar: string;
  falschesWort: string;
  falschBedeutet: string;
  warhammer: string;
  level: "A1" | "A2" | "B1" | "B2";
};

export const FALSCHE_FREUNDE: FalscherFreund[] = [
  {
    de: "aktuell", ar: "حاليّ / جارٍ الآن", falschesWort: "actual (En)", falschBedeutet: "فعلي/حقيقي",
    warhammer: "في الإنجليزية actual = فعلي، بينما الألمانية aktuell = حالاً/جارٍ الآن. استعمل tatsächlich أو wirklich بمعنى «فعلي».",
    level: "A2",
  },
  {
    de: "Kind", ar: "طفل", falschesWort: "kind (En)", falschBedeutet: "نوع/لطيف",
    warhammer: "Kind دائماً طفل، أما «نوع» فـArt أو Typ، و«لطيف» nett أو freundlich.",
    level: "A1",
  },
  {
    de: "Gift", ar: "سُمّ", falschesWort: "gift (En)", falschBedeutet: "هدية",
    warhammer: "هدية في الألمانية das Geschenk — Gift بمعنى سامٍّ. عبارة شهيرة: Gift ist Gift!",
    level: "A2",
  },
  {
    de: "Komplett", ar: "كامل", falschesWort: "complet (Fr)", falschBedeutet: "(كامل صحيح)",
    warhammer: "هذا صديق حقيقي! لكن احذر: komplett تُستخدَم في العامية كثيراً، أما رسمياً فاستعمل vollständig.",
    level: "B1",
  },
  {
    de: "bekommen", ar: "يحصل على/ينال", falschesWort: "become (En)", falschBedeutet: "يُصبح",
    warhammer: "أشهر صديق كاذب للمبتدئين! become = werden؛ بمعنى «يحصل على» تُرجَم إلى bekommen أو erhalten.",
    level: "A1",
  },
  {
    de: "werden", ar: "يُصبح / سيصبح", falschesWort: " werden خطأ شائع", falschBedeutet: "يحصل على",
    warhammer: "إذا قلت ich werde ein Buch سمعها الألماني «سأصبح كتاباً» وليس «سأحصل على كتاب». استعمل ich bekomme ein Buch.",
    level: "A1",
  },
  {
    de: "Eventuell", ar: "ربما / من المُمكن", falschesWort: "eventually (En)", falschBedeutet: "أخيراً/في النهاية",
    warhammer: "eventually = schließlich / endlich؛ eventuellement في الألمانية أقوى إلى vielleicht أو möglicherweise.",
    level: "B1",
  },
  {
    de: "Fabrik", ar: "مصنع", falschesWort: "fabric (En)", falschBedeutet: "قماش/نسيج",
    warhammer: "قماش = der Stoff؛ مصنع = Fabrik. (الكلمة مشتركة مع الإنجليزية factory لكنها تبدو كـfabric).",
    level: "A2",
  },
  {
    de: "kostbar", ar: "ثمين/نفيس", falschesWort: "costly (En) شبيه", falschBedeutet: "(مكلِف)",
    warhammer: "«مكلِف» = teuer. kostbar يُستعمَل للأشياء النفيسة لا الباهظة الثمن.",
    level: "B1",
  },
  {
    de: "Rente", ar: "معاش تقاعدي", falschesWort: "rent (En)", falschBedeutet: "إيجار",
    warhammer: "إيجار = die Miete. معاش تقاعدي = die Rente. كلمة Rentner = متقاعد لا مُستأجِر.",
    level: "A2",
  },
  {
    de: "See (m)", ar: "بحيرة", falschesWort: "sea (En)", falschBedeutet: "بحر",
    warhammer: "بحر = das Meer، بحيرة = der See، بحر (مؤنّث شاذّ أيضاً) = die See. انتبه للمادة!",
    level: "A2",
  },
  {
    de: "bald", ar: "قريباً", falschesWort: "bald (En)", falschBedeutet: "أصلع",
    warhammer: "أصلع = glatzköpfig/kahl. كلمة bald الألمانية لا علاقة لها بالشعر!",
    level: "A2",
  },
  {
    de: "Sekt", ar: "نبيذ فوار (شمبانيا)", falschesWort: "sect (En)", falschBedeutet: "طائفة",
    warhammer: "طائفة = die Sekte؛ نبيذ فوار = der Sekt.",
    level: "B1",
  },
  {
    de: "spenden", ar: "يتبرّع", falschesWort: "spend (En)", falschBedeutet: "ينفق/يصرف",
    warhammer: "spend بمعنى ينفق وقتاً = verbringen؛ تتبرع بالمال = spenden.",
    level: "B1",
  },
  {
    de: "sensibel", ar: "حسّاس (عاطفياً)", falschesWort: "sensible (En)", falschBedeutet: "معقول/منطقي",
    warhammer: "معقول = sinnvoll، حسّاس = sensibel، حَساس للألم = empfindlich.",
    level: "B1",
  },
  {
    de: "Das ist ein Mist", ar: "هذا هراء / سيّئ جداً", falschesWort: "mist (En)", falschBedeutet: "ضباب",
    warhammer: "ضباب = der Nebel. كلمة Mist في الألمانية تعني روثاً ثم استُعملت شتماً خفيفاً.",
    level: "B2",
  },
  {
    de: "Kompromiss", ar: "حلّ وسط / تسوية", falschesWort: "compromise (En)", falschBedeutet: "(حلّ وسط — صحيح)",
    warhammer: "انتبه للكتابة: pp ثم m واحدة وليس compromiss.",
    level: "B2",
  },
  {
    de: "Handy", ar: "هاتف محمول", falschesWort: "handy (En)", falschBedeutet: "مفيد",
    warhammer: "ألمانية Handy = جوال، لا علاقة بصفة «handy» الإنجليزية بمعنى مفيد.",
    level: "A1",
  },
  {
    de: "Kopf", ar: "رأس", falschesWort: "كوف (عامية عربية)", falschBedeutet: "كوب/كأس",
    warhammer: "كوب = Tasse/Becher. كلمة Kopf دائماً رأس، ولا تُستعمَل للأواني.",
    level: "A1",
  },
  {
    de: "Tablette", ar: "قرص دواء/حبة", falschesWort: "tablet (En)", falschBedeutet: "تابلت/لوحي رقمي",
    warhammer: "تابلت رقمي = das Tablet. قرص دواء = die Tablette.",
    level: "A2",
  },
];

/** البحث السريع عن الصديق الكاذب */
export function findFalschenFreund(wort: string): FalscherFreund | undefined {
  const w = wort.trim().toLowerCase();
  return FALSCHE_FREUNDE.find((f) => f.de.toLowerCase() === w);
}

/** اختيار عدد من الأصدقاء الكاذبين عشوائياً حسب المستوى */
export function freundeByLevel(level: "A1"|"A2"|"B1"|"B2", max = 5): FalscherFreund[] {
  const pool = FALSCHE_FREUNDE.filter((f) => f.level === level || earlierLevel(f.level, level));
  // خلط بسيط ثابت
  return pool.slice(0, max);
}

function earlierLevel(a: string, b: string): boolean {
  const ord: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 };
  return (ord[a] ?? 0) <= (ord[b] ?? 4);
}
