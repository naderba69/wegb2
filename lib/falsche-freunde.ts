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
    de: "werden", ar: "يُصبح / سيصبح", falschesWort: "bekommen (De)", falschBedeutet: "يحصل على",
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
    de: "Kopf", ar: "رأس", falschesWort: "كوف (Ar)", falschBedeutet: "كوب/كأس (عامية عربية)",
    warhammer: "كوب = Tasse/Becher. كلمة Kopf دائماً رأس، ولا تُستعمَل للأواني.",
    level: "A1",
  },
  {
    de: "Tablette", ar: "قرص دواء/حبة", falschesWort: "tablet (En)", falschBedeutet: "تابلت/لوحي رقمي",
    warhammer: "تابلت رقمي = das Tablet. قرص دواء = die Tablette.",
    level: "A2",
  },
  {
    de: "Glas", ar: "كأس (زجاج)", falschesWort: "glace (Fr)", falschBedeutet: "مثلجات (آيس كريم)",
    warhammer: "das Glas كأس تشرب منه، وla glace الفرنسية مثلجات (بالألمانية das Eis). في المطعم اطلب ein Glas Wasser لا *une glace!",
    level: "A1",
  },
  {
    de: "Art", ar: "نوع/صنف", falschesWort: "art (Fr/En)", falschBedeutet: "فن",
    warhammer: "die Art هي النوع (Welche Art Tee?)، والفن هو die Kunst. *Art moderne لا تعني الفن الحديث!",
    level: "A1",
  },
  {
    de: "brav", ar: "مهذب/مطيع (للأطفال)", falschesWort: "brave (Fr)", falschBedeutet: "شجاع",
    warhammer: "brav تُقال للطفل المطيع (Sei brav!)، والشجاع هو mutig. *ein braver Soldat تعني جندياً مطيعاً لا شجاعاً!",
    level: "A1",
  },
  {
    de: "Rat", ar: "نصيحة/مجلس", falschesWort: "rat (Fr: le rat)", falschBedeutet: "جرذ",
    warhammer: "der Rat نصيحة (ein guter Rat) أو مجلس، والجرذ هو die Ratte. التشابه لفظي فقط!",
    level: "A1",
  },
  {
    de: "Keks", ar: "بسكويت", falschesWort: "cake (Fr: le cake)", falschBedeutet: "قالب كعك",
    warhammer: "der Keks بسكويتة، وle cake الفرنسية قالب كعك (بالألمانية der Rührkuchen). في المخبز اطلب Kekse لا *cakes!",
    level: "A1",
  },
  {
    de: "Menü", ar: "قائمة طعام ثابتة", falschesWort: "menu (Fr)", falschBedeutet: "ورقة المطعم",
    warhammer: "das Menü وجبة ثابتة بسعر واحد، وورقة المطعم هي die Speisekarte. *das Menü, bitte تُفهم طلب وجبة لا ورقة!",
    level: "A1",
  },
  {
    de: "Bad", ar: "حمّام (غرفة)", falschesWort: "bad (En)", falschBedeutet: "سيئ",
    warhammer: "das Bad غرفة الحمام، وسيئ هو schlecht. *ein bad Zimmer لا تعني غرفة سيئة بل لا معنى لها!",
    level: "A1",
  },
  {
    de: "Herd", ar: "موقد (مطبخ)", falschesWort: "herd (En)", falschBedeutet: "قطيع",
    warhammer: "der Herd موقد الطبخ، والقطيع هو die Herde. حرف واحد يفرّق (Herd ≠ Herde)!",
    level: "A1",
  },
  {
    de: "Tafel", ar: "سبورة (لوح)", falschesWort: "table (En/Fr)", falschBedeutet: "طاولة",
    warhammer: "die Tafel سبورة المدرسة (أو لوح شوكولاتة!)، والطاولة هي der Tisch. *an der Tafel essen تعني الأكل على السبورة!",
    level: "A1",
  },
  {
    de: "Fach", ar: "مادة دراسية", falschesWort: "fac (Fr: la fac)", falschBedeutet: "جامعة",
    warhammer: "das Fach هو المادة الدراسية (Mein Lieblingsfach)، والجامعة هي die Uni. *Ich gehe in die Fach لا تعني أذهب للجامعة!",
    level: "A1",
  },
  {
    de: "Stundenplan", ar: "جدول الحصص", falschesWort: "planning (Fr: le planning)", falschBedeutet: "جدول مواعيد عام",
    warhammer: "der Stundenplan جدول المدرسة فقط، وجدول العمل هو der Zeitplan. لا تقل *mein Planning في المدرسة!",
    level: "A1",
  },
  {
    de: "Mappe", ar: "ملف أوراق", falschesWort: "map (En)", falschBedeutet: "خريطة",
    warhammer: "die Mappe ملف أوراق، والخريطة هي die Karte. *eine Mappe von Tunis تعني ملفاً لا خريطة!",
    level: "A1",
  },
  {
    de: "reden", ar: "تكلم (تحدث)", falschesWort: "read (En)", falschBedeutet: "قرأ",
    warhammer: "reden تعني يتكلم، و«يقرأ» هي lesen. *Ich rede ein Buch تعني أكلّم كتاباً?!",
    level: "A1",
  },
  {
    de: "rechnen", ar: "حسب (عملية حسابية)", falschesWort: "reckon (En)", falschBedeutet: "اعتقد/ظن",
    warhammer: "rechnen تعني يحسب (2+2)، و«يظن» هي denken/glauben. *Ich rechne, dass… تعني أحسب أن?!",
    level: "A1",
  },
  {
    de: "bitten", ar: "طلب بأدب (رجاء)", falschesWort: "bite (En)", falschBedeutet: "عضّ",
    warhammer: "bitten تعني يرجو (Ich bitte dich)، و«يعض» هي beißen. *Der Hund bittet تعني الكلب يرجو?!",
    level: "A1",
  },
  {
    de: "Beamer", ar: "جهاز عرض (داتاشو)", falschesWort: "beamer (En)", falschBedeutet: "(لا تعني آلة عرض!)",
    warhammer: "der Beamer آلة العرض في القاعة، وبالإنجليزية قل projector. كلمة *beamer لا تُفهم في قاعة إنجليزية!",
    level: "A2",
  },
  {
    de: "Oldtimer", ar: "سيارة عتيقة", falschesWort: "old-timer (En)", falschBedeutet: "رجل مسنّ",
    warhammer: "der Oldtimer سيارة كلاسيكية، والرجل المسن هو der Senior. *ein schöner Oldtimer عن جدّك إهانة!",
    level: "A2",
  },
  {
    de: "Smoking", ar: "بدلة سهرة", falschesWort: "smoking (En)", falschBedeutet: "تدخين",
    warhammer: "der Smoking بدلة رسمية، والتدخين هو das Rauchen. لافتة *Smoking verboten تُقرأ منع البدل!",
    level: "A2",
  },
  {
    de: "Studium", ar: "دراسة جامعية", falschesWort: "studio (Fr: le studio)", falschBedeutet: "شقة صغيرة",
    warhammer: "das Studium سنوات الجامعة، والشقة الصغيرة هي die Einzimmerwohnung. *mein Studium kostet 500€ تعني دراستي لا شقتي!",
    level: "A2",
  },
  {
    de: "Termin", ar: "موعد", falschesWort: "terme (Fr: le terme)", falschBedeutet: "مصطلح/نهاية",
    warhammer: "der Termin موعد محدد (beim Arzt)، والمصطلح اللغوي هو der Begriff. لا تخلط الموعد بالمصطلح!",
    level: "A2",
  },
  {
    de: "checken", ar: "فهم (عامية)", falschesWort: "check (En)", falschBedeutet: "فحص/تحقق",
    warhammer: "checken العامية تعني فهمت (Hast du gecheckt?)، و«فحص» هي prüfen. *Check bitte die Tür تعني افهم الباب?!",
    level: "A2",
  },
  {
    de: "Public Viewing", ar: "ساحة مشجعين (شاشة عملاقة)", falschesWort: "public viewing (En)", falschBedeutet: "إلقاء نظرة الوداع على ميت!",
    warhammer: "Public Viewing ساحة الفرح بالكرة، والمعنى الإنجليزي جنائزي! لا تترجمها حرفياً لأمريكي أبداً.",
    level: "A2",
  },
  {
    de: "Doktor", ar: "دكتور (لقب علمي)", falschesWort: "docteur (Fr: médecin)", falschBedeutet: "طبيب",
    warhammer: "der Doktor لقب جامعي، والطبيب هو der Arzt. *Ich gehe zum Doktor تُفهم أذهب لأستاذ لا لطبيب!",
    level: "A2",
  },
  {
    de: "Föhn", ar: "مجفف شعر", falschesWort: "brushing (Fr: le brushing)", falschBedeutet: "تسريحة بالفرشاة",
    warhammer: "der Föhn هو الجهاز، والتسريحة هي die Frisur. *ein Brushing, bitte عند الكوافير الألماني لا تُفهم!",
    level: "A2",
  },
  {
    de: "Pension", ar: "نُزُل (فندق صغير)", falschesWort: "pension (En)", falschBedeutet: "معاش تقاعد",
    warhammer: "die Pension فندق عائلي صغير، والمعاش هو die Rente. *eine billige Pension للتقاعد تعني فندقاً رخيصاً!",
    level: "A2",
  },
  {
    de: "Jogging", ar: "رياضة الهرولة", falschesWort: "jogging (Fr: le jogging)", falschBedeutet: "بدلة رياضية",
    warhammer: "das Jogging رياضة الجري، والبدلة هي der Jogginganzug. *ein neues Jogging kaufen تعني شراء رياضة?!",
    level: "A2",
  },
  {
    de: "Dressman", ar: "عارض أزياء (رجل)", falschesWort: "dressman (En)", falschBedeutet: "(لا وجود لها!)",
    warhammer: "Dressman كلمة ألمانية بثوب إنجليزي — بالإنجليزية male model. لا تستعملها مع إنجليزي أبداً!",
    level: "A2",
  },
  {
    de: "mieten", ar: "استأجر", falschesWort: "meet (En)", falschBedeutet: "قابل/التقى",
    warhammer: "mieten تعني يستأجر (eine Wohnung mieten)، و«يقابل» هي treffen. *Ich miete meine Freunde تعني أستأجر أصدقائي?!",
    level: "A2",
  },
  {
    de: "Artist", ar: "فنان سيرك (بهلوان)", falschesWort: "artist (En)", falschBedeutet: "فنان تشكيلي",
    warhammer: "der Artist بهلوان السيرك، والفنان هو der Künstler. *ein berühmter Artist تعني بهلواناً مشهوراً!",
    level: "B1",
  },
  {
    de: "Praxis", ar: "عيادة طبيب", falschesWort: "practice (En)", falschBedeutet: "ممارسة/تدريب",
    warhammer: "die Praxis عيادة الدكتور، والممارسة هي die Übung. *eine Praxis eröffnen تعني فتح عيادة لا ممارسة!",
    level: "B1",
  },
  {
    de: "Lokal", ar: "مطعم صغير (محل)", falschesWort: "local (En)", falschBedeutet: "محلي",
    warhammer: "das Lokal مطعم الحي، و«محلي» صفة هي lokal أو einheimisch. *ein Lokal für Touristen تعني مطعماً لا مكاناً محلياً!",
    level: "B1",
  },
  {
    de: "Kondition", ar: "لياقة بدنية (وشرط تجاري)", falschesWort: "condition (En)", falschBedeutet: "شرط/حالة",
    warhammer: "die Kondition هي لياقتك (gute Kondition) أو شروط العقد، والحالة/الظرف هي der Zustand. لا تخلطهما!",
    level: "B1",
  },
  {
    de: "Konzern", ar: "مجمّع شركات", falschesWort: "concern (En)", falschBedeutet: "قلق/اهتمام",
    warhammer: "der Konzern مجموعة شركات، والقلق هو die Sorge. *ein großer Concern تعني قلقاً كبيراً?!",
    level: "B1",
  },
  {
    de: "Wahl", ar: "انتخاب/اختيار", falschesWort: "wall (En)", falschBedeutet: "جدار",
    warhammer: "die Wahl هي الانتخابات (die Bundestagswahl) أو الاختيار، والجدار هو die Wand. *the Wahl of Berlin تعني جدار برلين?!",
    level: "B1",
  },
  {
    de: "überholen", ar: "تجاوز (سيارة)", falschesWort: "overhaul (En)", falschBedeutet: "إصلاح شامل",
    warhammer: "überholen تعني يتجاوز على الطريق، والصيانة الشاملة هي die Generalüberholung. *to overhaul a car لا تعني تجاوز سيارة!",
    level: "B1",
  },
  {
    de: "sich blamieren", ar: "أحرج نفسه", falschesWort: "blame (En)", falschBedeutet: "لام (وجّه اللوم)",
    warhammer: "sich blamieren تعني يحرج نفسه، و«يلوم غيره» هي beschuldigen. *Er blamiert mich لا تعني يلومني!",
    level: "B1",
  },
  {
    de: "Folge", ar: "نتيجة/عاقبة (وحلقة)", falschesWort: "follow (En)", falschBedeutet: "تابع/اتبع",
    warhammer: "die Folge هي النتيجة (die Folgen tragen) أو الحلقة، و«يتابع» فعل هو folgen مع Dativ. الاسم ليس الفعل الإنجليزي!",
    level: "B1",
  },
  {
    de: "fördern", ar: "دعم/شجّع", falschesWort: "forward (En)", falschBedeutet: "حوّل (رسالة)",
    warhammer: "fördern تعني يدعم (Talente fördern)، و«يحوّل رسالة» هي weiterleiten. *eine E-Mail fördern تعني دعم رسالة?!",
    level: "B1",
  },
  {
    de: "Messe", ar: "معرض تجاري (وقدّاس)", falschesWort: "mess (En)", falschBedeutet: "فوضى",
    warhammer: "die Messe معرض (die Buchmesse) أو قدّاس، والفوضى هي das Durcheinander. *eine große Messe لا تعني فوضى كبيرة!",
    level: "B1",
  },
  {
    de: "Prospekt", ar: "كتيّب دعائي", falschesWort: "prospect (En)", falschBedeutet: "احتمال/مرشح",
    warhammer: "der Prospekt نشرة الشركة، والاحتمال المستقبلي هو die Aussicht. *gute Prospekte تعني نشرات جيدة لا آفاقاً!",
    level: "B1",
  },
  {
    de: "lustig", ar: "مضحك/مرح", falschesWort: "lusty (En)", falschBedeutet: "شهواني!",
    warhammer: "lustig تعني مضحك ومرح (ein lustiger Abend)، و«شهواني» هي lüstern — كلمة خطرة! لا تخلطهما أبداً.",
    level: "B1",
  },
  {
    de: "Krimi", ar: "رواية/فيلم بوليسي", falschesWort: "crime (En)", falschBedeutet: "جريمة",
    warhammer: "der Krimi قصة بوليسية (Krimi lesen)، والجريمة هي das Verbrechen. *einen Krimi begehen تعني ارتكاب رواية?!",
    level: "B1",
  },
  {
    de: "Aktualität", ar: "راهنية (مواكبة العصر)", falschesWort: "actuality (En)", falschBedeutet: "الواقع الفعلي",
    warhammer: "die Aktualität هي مواكبة العصر (von großer Aktualität)، والواقع هو die Wirklichkeit. الراهنية ليست الواقعية!",
    level: "B2",
  },
  {
    de: "Novelle", ar: "رواية قصيرة (نوفيلا)", falschesWort: "novel (En)", falschBedeutet: "رواية (طويلة)",
    warhammer: "die Novelle جنس قصير، والرواية هي der Roman. *a long Novelle تناقض في المصطلح!",
    level: "B2",
  },
  {
    de: "heimatlos", ar: "بلا وطن", falschesWort: "homeless (En)", falschBedeutet: "بلا مأوى",
    warhammer: "heimatlos تعني فقد وطنه، وبلا سكن هي obdachlos. فرق كبير بين المنفى والتشرد!",
    level: "B2",
  },
  {
    de: "Gang", ar: "طبق/شوط (der erste Gang)", falschesWort: "gang (En)", falschBedeutet: "عصابة",
    warhammer: "der Gang له عشرة معانٍ (الممر، المشية، الطبق، الشوط)، والعصابة هي die Bande. *der zweite Gang لا تعني العصابة الثانية!",
    level: "B2",
  },
  {
    de: "Hut", ar: "قبعة", falschesWort: "hut (En)", falschBedeutet: "كوخ",
    warhammer: "der Hut قبعة تلبسها، والكوخ هو die Hütte. حرف واحد يفرّق (Hut ≠ Hütte)!",
    level: "B2",
  },
  {
    de: "Acker", ar: "حقل محروث", falschesWort: "acre (En)", falschBedeutet: "فدان (وحدة مساحة)",
    warhammer: "der Acker قطعة الحقل نفسها، وacre الإنجليزية وحدة قياس (0.4 هكتار). تشابه لفظي خادع!",
    level: "B2",
  },
  {
    de: "Lack", ar: "طلاء/ورنيش", falschesWort: "lack (En)", falschBedeutet: "نقص/افتقار",
    warhammer: "der Lack طبقة الطلاء اللامعة، والنقص هو der Mangel. *a lack of Lack تعني نقصاً في الطلاء?!",
    level: "B2",
  },
  {
    de: "Rolle", ar: "دور/بكرة (لفافة)", falschesWort: "role (En)", falschBedeutet: "دور (فقط)",
    warhammer: "die Rolle هي الدور (eine Rolle spielen) وأيضاً البكرة (eine Rolle Papier)، والمعنى الثاني لا يعرفه الإنجليزي أبداً!",
    level: "B2",
  },
  {
    de: "Klavier", ar: "بيانو", falschesWort: "clavier (Fr)", falschBedeutet: "لوحة مفاتيح (حاسوب)",
    warhammer: "das Klavier آلة البيانو، ولوحة الحاسوب هي die Tastatur. *jouer du clavier لا تعني العزف على الكيبورد!",
    level: "B2",
  },
  {
    de: "Taste", ar: "زر (لوحة المفاتيح)", falschesWort: "taste (En)", falschBedeutet: "ذوق/طعم",
    warhammer: "die Taste زر تضغطه، والذوق هو der Geschmack. *eine leckere Taste تعني زراً لذيذاً?!",
    level: "B2",
  },
];

/** البحث السريع عن الصديق الكاذب */
export function findFalschenFreund(wort: string): FalscherFreund | undefined {
  const w = wort.trim().toLowerCase();
  return FALSCHE_FREUNDE.find((f) => f.de.toLowerCase() === w);
}

/** R138/P-14: ترتيب الأصدقاء الكاذبين بحسب «يوم ظهور الكلمة الألمانية» حتى يُعرضوا
 *  في الوقت الذي يتعلّم فيه الطالب الكلمة (لا بترتيب ثابت). غير الظاهر في
 *  دفاتر المفردات يُرتَّب هجائياً في نهاية القائمة. */
export function freundeByLevel(level: "A1"|"A2"|"B1"|"B2", max = 5): FalscherFreund[] {
  const ord: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 };
  const cur = ord[level] ?? 4;
  // استنتاج أول ظهور: نمر على دفاتر المفردات مرتّبة حسب المستوى (A1→B2) ثم تسلسلياً.
  const firstDay = new Map<string, number>();
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { vocabMap } = require("./content") as typeof import("./content");
    const decks = Object.values(vocabMap).sort((a, b) => (ord[a.level] ?? 0) - (ord[b.level] ?? 0));
    let seq = 0;
    for (const deck of decks) {
      if ((ord[deck.level] ?? 0) > cur) continue;
      for (const card of deck.cards) {
        seq++;
        const key = (card.de ?? "").toLowerCase().split(/[,/(/\s]/)[0];
        if (key && !firstDay.has(key)) firstDay.set(key, seq);
      }
    }
  } catch { /* تجاهل: الاستيراد الدائري آمن هنا */ }
  const pool = FALSCHE_FREUNDE.filter((f) => f.level === level || earlierLevel(f.level, level));
  const keyOf = (f: FalscherFreund) => f.de.toLowerCase().split(/[,/(/\s]/)[0];
  pool.sort((a, b) => {
    const oa = ord[a.level] ?? 0, ob = ord[b.level] ?? 0;
    if (oa !== ob) return oa - ob;
    const da = firstDay.get(keyOf(a)) ?? 999999;
    const db = firstDay.get(keyOf(b)) ?? 999999;
    if (da !== db) return da - db;
    return a.de.localeCompare(b.de);
  });
  return pool.slice(0, max);
}

function earlierLevel(a: string, b: string): boolean {
  const ord: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 };
  return (ord[a] ?? 0) <= (ord[b] ?? 4);
}
