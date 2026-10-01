# -*- coding: utf-8 -*-
"""Batch 11: 20 B1 + 13 B2 = 33 Saetze (102 Waisen aufgeloest -> 100% Verknuepfung ueber alle 4 CEFR-Stufen!)."""

S = [
    # === B1 (20 Saetze) ===
    ("B1",
     "Wer sich ein hohes Ziel vornehmen will, schöpft neue Zuversicht und spürt nach getaner Arbeit große Erleichterung.",
     "من يريد أن يعقد العزم على هدف عالٍ، يستمد ثقة جديدة ويشعر بارتياح كبير بعد إنجاز العمل.",
     ["sich etwas vornehmen", "die Zuversicht", "die Erleichterung"],
     ["psyche", "alltag"]),

    ("B1",
     "Wachsende Verunsicherung und ständige Überforderung im Beruf entstehen oft durch die Rücksichtslosigkeit ungeduldiger Vorgesetzter.",
     "ينشأ التردد المتزايد والشعور الدائم بالإرهاق في العمل غالباً بسبب قلة مراعاة الرؤساء غير الصبورين.",
     ["die Verunsicherung", "die Überforderung", "die Rücksichtslosigkeit"],
     ["arbeit", "psyche"]),

    ("B1",
     "Niemand sollte alten Groll hegen, sondern mit Genugtuung feststellen, dass Richter falsche Behauptungen bezweifeln oder entschieden bestreiten.",
     "لا ينبغي لأحد أن يحمل ضغينة قديمة، بل أن يلاحظ بارتياح أن القضاة يشككون في الادعاءات الكاذبة أو ينفونها بحزم.",
     ["der Groll", "die Genugtuung", "bezweifeln", "bestreiten"],
     ["recht", "charakter"]),

    ("B1",
     "Experten wollen Reformen nahelegen, strittige Punkte vorerst offenlassen und motivierten Arbeitsuchenden eine praktische Teilqualifikation ermöglichen.",
     "يريد الخبراء اقتراح إصلاحات، وترك النقاط الخلافية مفتوحة في الوقت الحالي، وإتاحة تأهيل جزئي عملي للباحثين عن عمل المتحمسين.",
     ["nahelegen", "offenlassen", "die Teilqualifikation"],
     ["arbeit", "bildung"]),

    ("B1",
     "Mit einem bewilligten Bildungsgutschein fand die Bewerberin einen guten Praktikumsplatz und gestaltete eine ansprechende Bewerbungsmappe.",
     "بواسطة قسيمة تعليمية معتمدة وجدت المتقدمة فرصة تدريب عملي جيدة وصممت ملف ترشح جذاباً.",
     ["der Bildungsgutschein", "der Praktikumsplatz", "die Bewerbungsmappe"],
     ["beruf", "bewerbung"]),

    ("B1",
     "Im Beratungsgespräch erklärte der Berufsberater die Angebote der Arbeitsagentur und vereinbarte eine verbindliche Eingliederungsvereinbarung.",
     "في جلسة المشورة أوضح المستشار المهني عروض وكالة العمل واتفق على اتفاقية اندماج ملزمة.",
     ["der Berufsberater", "die Arbeitsagentur", "die Eingliederungsvereinbarung"],
     ["beruf", "behoerde"]),

    ("B1",
     "Beschäftigte müssen ihre gesetzliche Meldepflicht beachten, jede Nebentätigkeit rechtzeitig angeben und ihre persönliche Lohnsteuerklasse prüfen.",
     "يجب على الموظفين مراعاة واجب الإبلاغ القانوني، والإفصاح عن كل عمل جانبي في الوقت المناسب وفحص فئة ضريبة الدخل الشخصية.",
     ["die Meldepflicht", "die Nebentätigkeit", "die Lohnsteuerklasse"],
     ["arbeit", "steuern"]),

    ("B1",
     "Auf der monatlichen Lohnabrechnung sieht der Arbeitnehmer den ausgezahlten Nettolohn nach Abzug aller gesetzlichen Sozialabgaben.",
     "في بيان الراتب الشهري يرى الموظف صافي الراتب المدفوع بعد خصم جميع الاستقطاعات الاجتماعية القانونية.",
     ["die Lohnabrechnung", "der Nettolohn", "die Sozialabgaben"],
     ["finanzen", "arbeit"]),

    ("B1",
     "Beiträge zur Rentenversicherung und Pflegeversicherung sichern den Ruhestand ab, während junge Eltern staatliches Elterngeld beantragen.",
     "تؤمن الاشتراكات في تأمين التقاعد وتأمين الرعاية فترة التقاعد، بينما يتقدم الآباء الجدد بطلب للحصول على مخصصات الوالدين الحكومية.",
     ["die Rentenversicherung", "die Pflegeversicherung", "das Elterngeld"],
     ["soziales", "familie"]),

    ("B1",
     "Familien suchen händeringend einen Betreuungsplatz, wünschen sich einen sicheren Schulweg und schätzen das Ganztagsangebot der Schule.",
     "تبحث العائلات بإلحاح عن مكان للرعاية، وتتمنى طريقاً آمناً للمدرسة وتقدر عرض اليوم الدراسي الكامل للمدرسة.",
     ["der Betreuungsplatz", "der Schulweg", "das Ganztagsangebot"],
     ["familie", "schule"]),

    ("B1",
     "Vor der gemeinsamen Klassenfahrt organisierte die Schule gezielten Förderunterricht, während Schüler fleißig jede Mitschrift verglichen.",
     "قبل الرحلة المدرسية المشتركة نظمت المدرسة دروس تقوية موجهة، بينما قارن الطلاب بجدية كل ملخص وملاحظات مدونة.",
     ["die Klassenfahrt", "der Förderunterricht", "die Mitschrift"],
     ["schule", "lernen"]),

    ("B1",
     "Mit einem gültigen Wohnberechtigungsschein kann man eine günstige Wohnung mieten, eine Hausratversicherung abschließen und die Rundfunkgebühr anmelden.",
     "بشهادة استحقاق سكن سارية المفعول يمكن للمرء استئجار شقة مناسبة السعر، وإبرام تأمين على محتويات المنزل وتسجيل رسوم البث الإذاعي.",
     ["der Wohnberechtigungsschein", "die Hausratversicherung abschließen", "die Rundfunkgebühr"],
     ["wohnen", "finanzen"]),

    ("B1",
     "Die Verbraucherzentrale hilft Kunden, die Kündigungsbestätigung durchzusetzen und bei Engpässen eine faire Ratenzahlung zu vereinbaren.",
     "يساعد مركز حماية المستهلك العملاء على تأكيد إنهاء العقود والاتفاق على سداد عادل بالأقساط عند وجود ضائقة مالية.",
     ["die Verbraucherzentrale", "die Kündigungsbestätigung", "die Ratenzahlung vereinbaren"],
     ["verbraucher", "finanzen"]),

    ("B1",
     "Bei drohendem Zahlungsverzug berät eine kompetente Schuldnerberatung Betroffene, wie sie ein geordnetes Haushaltsbuch führen.",
     "عند خطر التأخر في السداد، تقدم استشارات الديون المتخصصة النصح للمتضررين حول كيفية إدارة دفتر ميزانية منزلية منظم.",
     ["der Zahlungsverzug", "die Schuldnerberatung", "das Haushaltsbuch führen"],
     ["finanzen", "beratung"]),

    ("B1",
     "Um hohe Fixkosten zu senken, lohnt sich ein rascher Tarifwechsel beim Stromanbieter, der eine geringere monatliche Abschlagszahlung ermöglicht.",
     "لخفض التكاليف الثابتة المرتفعة، يجدي إجراء تغيير سريع للتعريفة لدى شركة الكهرباء، مما يتيح دفعة شهرية مسبقة أقل.",
     ["die Fixkosten", "der Tarifwechsel", "die Abschlagszahlung"],
     ["energie", "finanzen"]),

    ("B1",
     "Vor Unterzeichnung eines Aufhebungsvertrags müssen Arbeitnehmer eine mögliche Sperrzeit beim Arbeitslosengeld und den Anspruch auf Erstausstattung bedenken.",
     "قبل توقيع اتفاقية إنهاء العمل بالتراضي، يجب على الموظفين مراعاة فترة حظر محتملة لمخصصات البطالة والحق في تجهيزات المعيشة الأساسية.",
     ["der Aufhebungsvertrag", "die Sperrzeit", "die Erstausstattung"],
     ["arbeit", "soziales"]),

    ("B1",
     "Wer wegen Krankheit einen Mehrbedarf nachweist, muss die Widerspruchsfrist einhalten, damit die zustehende Auszahlung pünktlich erfolgt.",
     "من يثبت احتياجاً إضافياً بسبب المرض، يجب عليه الالتزام بمهلة الاعتراض حتى يتم صرف الدفعة المستحقة في الموعد المحدد.",
     ["der Mehrbedarf", "die Widerspruchsfrist", "die Auszahlung"],
     ["soziales", "behoerde"]),

    ("B1",
     "Nach sorgfältiger Prüfung kam der Bewilligungsbescheid mit einer erfreulichen Nachzahlung, die der Sachbearbeiter termingerecht überwies.",
     "بعد فحص دقيق صدر قرار الموافقة متضمناً مستحقات متأخرة سارة حولها الموظف المختص في الموعد المحدد تماماً.",
     ["der Bewilligungsbescheid", "die Nachzahlung", "termingerecht"],
     ["behoerde", "finanzen"]),

    ("B1",
     "Vor der offiziellen Abnahme ließ der Bauherr jede Arbeitsstunde berechnen, prüfte die Materialkosten und verlangte eine lange Gewährleistungsfrist.",
     "قبل التسليم الرسمي جعل صاحب المشروع كل ساعة عمل تحسب، وفحص تكاليف المواد وطالب بفترة ضمان طويلة.",
     ["die Abnahme", "die Arbeitsstunde berechnen", "die Materialkosten", "die Gewährleistungsfrist"],
     ["bau", "wirtschaft"]),

    ("B1",
     "Auf der Baustelle müssen Arbeiter das Gelände sichern, stets eine Schutzbrille tragen und für fachgerechte Entsorgung von Bauschutt sorgen.",
     "في ورشة البناء يجب على العمال تأمين الموقع، وارتداء نظارة واقية دائماً والحرص على التخلص المهني السليم من مخلفات البناء.",
     ["die Baustelle sichern", "die Schutzbrille", "die Entsorgung"],
     ["bau", "sicherheit"]),

    # === B2 (13 Saetze) ===
    ("B2",
     "Niemand darf Kollegen vor anderen bloßstellen, während private Vorsorge wie die Riester-Rente vor Altersarmut schützt und willkürliche Kündigungen ausgeschlossen sind.",
     "لا يجوز لأحد إحراج زملائه أمام الآخرين، بينما يحمي التأمين الخاص مثل تقاعد ريستر من فقر الشيخوخة وتعتبر الإقالات التعسفية مستبعدة.",
     ["jdn bloßstellen", "ausgeschlossen", "die Riester-Rente"],
     ["arbeit", "ethik"]),

    ("B2",
     "Im Discounter deckte ein verdeckter Testkauf auf, ob nährstoffreiche Lebensmittel tatsächlich frei von gentechnisch veränderten Stoffen waren.",
     "في متجر التخفيضات كشفت عملية شراء تجريبية سرية عما إذا كانت الأغذية الغنية بالعناصر الغذائية خالية حقاً من المواد المعدلة وراثياً.",
     ["der Testkauf", "nährstoffreich", "gentechnisch verändert"],
     ["verbraucher", "ernaehrung"]),

    ("B2",
     "Im städtischen Migrationsbeirat schilderten Zuwanderer ihr fernes Herkunftsland und brachten ihre vielfältige Migrationsgeschichte aktiv ein.",
     "في المجلس البلدي للهجرة وصف المهاجرون بلدهم الأصلي البعيد وقدموا تاريخ هجرتهم المتنوع بفاعلية.",
     ["der Migrationsbeirat", "das Herkunftsland", "die Migrationsgeschichte"],
     ["migration", "politik"]),

    ("B2",
     "Nach erfolgreicher Vorrangprüfung feierten Neubürger eine feierliche Einbürgerungsfeier, die gesellschaftliche Teilhabe statt erzwungener Assimilation betonte.",
     "عقب فحص أولوية ناجح احتفل المواطنون الجدد بحفل تجنيس مهيب أكد على المشاركة المجتمعية بدلاً من الاستيعاب القسري.",
     ["die Vorrangprüfung", "die Einbürgerungsfeier", "die Assimilation"],
     ["buerger", "migration"]),

    ("B2",
     "Die amtliche Zuwanderungsstatistik belegt, dass heimatlose Menschen durch gezielte Förderung eine erfolgreiche Bildungskarriere absolvieren können.",
     "تثبت الإحصاءات الرسمية للهجرة أن الأشخاص المشردين والفاقدين لوطنهم يمكنهم إتمام مسار تعليمي ناجح من خلال الدعم الموجه.",
     ["die Zuwanderungsstatistik", "heimatlos", "die Bildungskarriere"],
     ["statistik", "bildung"]),

    ("B2",
     "Gelebte Zweitsprachigkeit bereichert das Zusammenleben, während eine begrünte Begegnungszone zum Verweilen einlädt und am Volkstrauertag Frieden mahnt.",
     "تثري ثنائية اللغة المعاشة التعايش المشترك، بينما تدعو منطقة اللقاءات الخضراء للبقاء وتحث على السلام في يوم الحداد الشعبي.",
     ["die Zweitsprachigkeit", "die Begegnungszone", "der Volkstrauertag"],
     ["kultur", "gesellschaft"]),

    ("B2",
     "Historiker debattieren über moralische Wiedergutmachung, völkerrechtliche Reparationen und die gesellschaftliche Entnazifizierung nach Kriegsende.",
     "يناقش المؤرخون مسألة التعويض المعنوي وإصلاح الضرر، والتعويضات بموجب القانون الدولي، واجتثاث النازية من المجتمع بعد نهاية الحرب.",
     ["die Wiedergutmachung", "die Reparationen", "die Entnazifizierung"],
     ["geschichte", "politik"]),

    ("B2",
     "Ein ergreifendes Zeitzeugeninterview verdeutlichte individuelle Täterschaft und warnte davor, pauschale Kollektivschuld unkritisch zu übernehmen.",
     "أوضح لقاء مؤثر مع شاهد عيان المسؤولية الفردية لمرتكبي الجرائم وحذر من تبني ذنب جماعي عام دون نقد.",
     ["das Zeitzeugeninterview", "die Täterschaft", "die Kollektivschuld"],
     ["geschichte", "erinnerung"]),

    ("B2",
     "Gegen jede geschichtliche Relativierung hilft ein würdevolles Gedenkritual, das an die mutige Montagsdemonstration für Bürgerrechte erinnert.",
     "ضد أي تهوين تاريخي يفيد طقس تذكاري مهيب يذكر بمظاهرات يوم الاثنين الشجاعة من أجل الحقوق المدنية.",
     ["die Relativierung", "das Gedenkritual", "die Montagsdemonstration"],
     ["geschichte", "politik"]),

    ("B2",
     "Die Öffnung der Stasi-Unterlagen prägte die moderne Geschichtspolitik und beschleunigte die gerechte Restitution enteigneter Kunstgüter.",
     "شكل فتح وثائق مخابرات ألمانيا الشرقية السياسة التاريخية المعاصرة وسرّع استعادة الممتلكات الفنية المصادرة بشكل عادل.",
     ["die Stasi-Unterlagen", "die Geschichtspolitik", "die Restitution"],
     ["geschichte", "recht"]),

    ("B2",
     "In Museen erforscht akribische Provenienzforschung geraubte Raubkunst, bevor die offizielle Umbenennung betroffener Säle beschlossen wird.",
     "في المتاحف يبحث تقصٍّ دقيق لأصول المقتنيات في الفن المنهوب، قبل اتخاذ قرار رسمي بإعادة تسمية القاعات المعنية.",
     ["die Raubkunst", "die Provenienzforschung", "die Umbenennung"],
     ["kunst", "museum"]),

    ("B2",
     "Die lebhafte Namensdebatte beleuchtet koloniale Kolonialgeschichte kritisch und rückt die oft vergessene Opferperspektive in den Mittelpunkt.",
     "تسلط المناقشة الحية للأسماء الضوء النقدي على تاريخ الاستعمار وتضع منظور الضحايا المنسي غالباً في بؤرة الاهتمام.",
     ["die Namensdebatte", "die Kolonialgeschichte", "die Opferperspektive"],
     ["kultur", "debatte"]),

    ("B2",
     "Erinnerungspolitisch vertieft moderne Täterforschung das Schicksal der Vertriebenen und bereichert die gesellschaftliche Nachwirkungsdebatte nachhaltig.",
     "من منظور سياسات التذكر، يعمق بحث الجناة المعاصر فهم مصير المهجرين ويثري نقاش التداعيات والآثار اللاحقة في المجتمع بشكل مستدام.",
     ["erinnerungspolitisch", "die Täterforschung", "der Vertriebene", "die Nachwirkungsdebatte"],
     ["geschichte", "gesellschaft"])
]
