# -*- coding: utf-8 -*-
"""R178 (C2): Vertiefungs-Dialoge Teil A (vf-d1..d3)."""

def dial(id_, td, ta, lines, fragen):
    return {"id": id_, "level": "C1", "titelDe": td, "titelAr": ta, "lines": lines, "fragen": fragen}

DIALOGE_A = []

DIALOGE_A.append(dial("vf-d1", "Im Fachgespräch: Projektstand und Risiken", "في نقاش متخصص: وضع المشروع والمخاطر",
[
 {"who": "Frau Lehmann", "de": "Guten Morgen, Herr Yilmaz. Wie ist der aktuelle Stand bei der Datenbankmigration?", "ar": "صباح الخير، سيد إيلماز. ما الوضع الحالي في ترحيل قاعدة البيانات؟"},
 {"who": "Herr Yilmaz", "de": "Wir liegen weitgehend im Zeitplan. Allerdings hat sich bei den Altbeständen ein Problem gezeigt, mit dem wir nicht gerechnet hatten.", "ar": "نحن إلى حد كبير ضمن الجدول الزمني. غير أنه ظهرت مشكلة في البيانات القديمة لم نكن قد حسبنا حسابها."},
 {"who": "Frau Lehmann", "de": "Könnten Sie das bitte konkretisieren?", "ar": "هل يمكنك توضيح ذلك بشكل ملموس من فضلك؟"},
 {"who": "Herr Yilmaz", "de": "Gern. Rund zwanzig Prozent der Datensätze sind unvollständig. Wir müssten sie manuell nacharbeiten, was ungefähr drei Wochen dauern würde.", "ar": "بكل سرور. نحو عشرين بالمئة من السجلات ناقصة. وسيتعين علينا معالجتها يدويًا، ما سيستغرق ثلاثة أسابيع تقريبًا."},
 {"who": "Frau Lehmann", "de": "Das würde unseren Puffer vollständig aufbrauchen. Gibt es eine Alternative?", "ar": "سيستهلك ذلك هامشنا الاحتياطي كاملًا. هل يوجد بديل؟"},
 {"who": "Herr Yilmaz", "de": "Wir könnten die unvollständigen Bestände zunächst ausklammern und erst in einer zweiten Phase migrieren. Der Kernbetrieb bliebe davon unberührt.", "ar": "يمكننا استثناء البيانات الناقصة أولًا وترحيلها في مرحلة ثانية فقط. وسيبقى التشغيل الأساسي غير متأثر بذلك."},
 {"who": "Frau Lehmann", "de": "Das klingt vernünftig. Welche Risiken sehen Sie bei diesem Vorgehen?", "ar": "يبدو ذلك معقولًا. ما المخاطر التي تراها في هذا الإجراء؟"},
 {"who": "Herr Yilmaz", "de": "Die Fachabteilung müsste eine Zeit lang mit zwei Systemen arbeiten. Das ist unbequem, aber beherrschbar – vorausgesetzt, wir schulen die Kollegen rechtzeitig.", "ar": "سيتعين على القسم المتخصص العمل لفترة بنظامين. هذا غير مريح لكنه قابل للسيطرة – بشرط أن ندرّب الزملاء في الوقت المناسب."},
 {"who": "Frau Lehmann", "de": "Einverstanden. Erstellen Sie mir bitte bis Freitag einen überarbeiteten Plan inklusive Schulungskonzept.", "ar": "اتفقنا. أعدّ لي من فضلك حتى الجمعة خطة معدّلة تشمل مفهوم التدريب."},
 {"who": "Herr Yilmaz", "de": "Mache ich. Ich stimme mich vorher noch mit dem Datenschutzbeauftragten ab, damit wir keine böse Überraschung erleben.", "ar": "سأفعل. سأتنسق قبل ذلك مع مسؤول حماية البيانات حتى لا نواجه مفاجأة غير سارة."},
 {"who": "Frau Lehmann", "de": "Sehr gut. Dann sehen wir uns am Freitag zur Entscheidung.", "ar": "جيد جدًا. إذن نلتقي الجمعة للقرار."}],
[
 {"id": "vf-d1-q1", "promptDe": "Welches Problem ist bei der Migration aufgetreten?", "promptAr": "ما المشكلة التي ظهرت في الترحيل؟",
  "options": ["Der Server ist abgestürzt", "Rund 20 Prozent der Altbestände sind unvollständig", "Die Kollegen sind im Urlaub", "Das Budget fehlt"], "answer": "Rund 20 Prozent der Altbestände sind unvollständig",
  "explanationAr": "يقول: «Rund zwanzig Prozent der Datensätze sind unvollständig»."},
 {"id": "vf-d1-q2", "promptDe": "Welche Alternative schlägt Herr Yilmaz vor?", "promptAr": "ما البديل الذي يقترحه السيد إيلماز؟",
  "options": ["Alles manuell nacharbeiten", "Unvollständige Bestände erst in einer zweiten Phase migrieren", "Das Projekt stoppen", "Eine neue Datenbank kaufen"], "answer": "Unvollständige Bestände erst in einer zweiten Phase migrieren",
  "explanationAr": "يقول: «erst in einer zweiten Phase migrieren. Der Kernbetrieb bliebe davon unberührt»."},
 {"id": "vf-d1-q3", "promptDe": "Was ist die Bedingung dafür, dass der Plan funktioniert?", "promptAr": "ما شرط نجاح الخطة؟",
  "options": ["Mehr Geld", "Die Kollegen rechtzeitig zu schulen", "Zwei neue Server", "Weniger Daten"], "answer": "Die Kollegen rechtzeitig zu schulen",
  "explanationAr": "يقول: «vorausgesetzt, wir schulen die Kollegen rechtzeitig»."}]))

DIALOGE_A.append(dial("vf-d2", "In der Sprechstunde: Ein schwieriges Gespräch", "في ساعة الاستشارة: حديث صعب",
[
 {"who": "Dr. Sommer", "de": "Nehmen Sie bitte Platz, Frau Berger. Die Ergebnisse Ihrer Untersuchung liegen jetzt vor.", "ar": "تفضلي بالجلوس، سيدة بيرغر. نتائج فحصك أصبحت جاهزة الآن."},
 {"who": "Frau Berger", "de": "Ich bin ehrlich gesagt ziemlich nervös. Ist es etwas Ernstes?", "ar": "أنا بصراحة متوترة جدًا. هل الأمر خطير؟"},
 {"who": "Dr. Sommer", "de": "Das kann ich gut nachvollziehen. Zunächst die gute Nachricht: Ein Tumor konnte ausgeschlossen werden.", "ar": "أستطيع تفهّم ذلك جيدًا. أولًا الخبر الجيد: تم استبعاد وجود ورم."},
 {"who": "Frau Berger", "de": "Gott sei Dank. Aber irgendetwas haben Sie doch gefunden?", "ar": "الحمد لله. لكنك وجدت شيئًا ما، أليس كذلك؟"},
 {"who": "Dr. Sommer", "de": "Ja. Ihre Schilddrüse arbeitet zu langsam. Das erklärt Ihre Müdigkeit und die Gewichtszunahme der letzten Monate.", "ar": "نعم. غدتك الدرقية تعمل ببطء شديد. وهذا يفسّر تعبك وزيادة وزنك في الأشهر الأخيرة."},
 {"who": "Frau Berger", "de": "Klingt das bedrohlich? Muss ich operiert werden?", "ar": "هل يبدو ذلك مهدِّدًا؟ هل يجب أن أخضع لعملية؟"},
 {"who": "Dr. Sommer", "de": "Nein, eine Operation ist nicht nötig. In den allermeisten Fällen lässt sich das mit einem Medikament gut einstellen, das Sie morgens einnehmen.", "ar": "لا، العملية ليست ضرورية. في الغالبية العظمى من الحالات يمكن ضبط ذلك جيدًا بدواء تتناولينه صباحًا."},
 {"who": "Frau Berger", "de": "Und wie lange muss ich das nehmen?", "ar": "وكم يجب أن آخذه؟"},
 {"who": "Dr. Sommer", "de": "Voraussichtlich dauerhaft. Wir kontrollieren die Werte zunächst alle sechs Wochen, bis die Dosis exakt auf Sie abgestimmt ist.", "ar": "على الأرجح بشكل دائم. سنراقب القيم أولًا كل ستة أسابيع حتى تُضبط الجرعة بدقة وفقًا لك."},
 {"who": "Frau Berger", "de": "Verstehe. Gibt es etwas, worauf ich im Alltag achten sollte?", "ar": "أفهم. هل يوجد شيء يجب أن أنتبه له في الحياة اليومية؟"},
 {"who": "Dr. Sommer", "de": "Nehmen Sie die Tablette auf nüchternen Magen ein und warten Sie eine halbe Stunde mit dem Frühstück. Alles Weitere habe ich Ihnen hier verständlich zusammengefasst.", "ar": "خذي الحبة على معدة فارغة وانتظري نصف ساعة قبل الفطور. وبقية الأمور لخّصتها لك هنا بشكل مفهوم."},
 {"who": "Frau Berger", "de": "Vielen Dank, Frau Doktor. Ich fühle mich schon deutlich ruhiger.", "ar": "شكرًا جزيلًا، دكتورة. أشعر الآن بهدوء أكبر بكثير."}],
[
 {"id": "vf-d2-q1", "promptDe": "Welche gute Nachricht nennt die Ärztin zuerst?", "promptAr": "ما الخبر الجيد الذي تذكره الطبيبة أولًا؟",
  "options": ["Die Werte sind perfekt", "Ein Tumor konnte ausgeschlossen werden", "Keine Medikamente nötig", "Die Untersuchung war kostenlos"], "answer": "Ein Tumor konnte ausgeschlossen werden",
  "explanationAr": "تقول: «Ein Tumor konnte ausgeschlossen werden»."},
 {"id": "vf-d2-q2", "promptDe": "Was ist die eigentliche Diagnose?", "promptAr": "ما التشخيص الفعلي؟",
  "options": ["Herzprobleme", "Die Schilddrüse arbeitet zu langsam", "Ein Vitaminmangel", "Zu hoher Blutdruck"], "answer": "Die Schilddrüse arbeitet zu langsam",
  "explanationAr": "تقول: «Ihre Schilddrüse arbeitet zu langsam»."},
 {"id": "vf-d2-q3", "promptDe": "Wie wird behandelt?", "promptAr": "كيف يكون العلاج؟",
  "options": ["Operation", "Ein Medikament, voraussichtlich dauerhaft", "Nur sechs Wochen Sport", "Gar nicht"], "answer": "Ein Medikament, voraussichtlich dauerhaft",
  "explanationAr": "تقول: «lässt sich das mit einem Medikament gut einstellen» و«Voraussichtlich dauerhaft»."}]))

DIALOGE_A.append(dial("vf-d3", "Seminardiskussion: Soll Geschichte Pflichtfach bleiben?", "نقاش في ندوة: هل تبقى مادة التاريخ إلزامية؟",
[
 {"who": "Dozentin", "de": "Wir diskutieren heute die Frage, ob Geschichte bis zum Abitur Pflichtfach bleiben soll. Wer möchte beginnen?", "ar": "نناقش اليوم سؤال ما إذا كان يجب أن تبقى مادة التاريخ إلزامية حتى الشهادة الثانوية. من يريد أن يبدأ؟"},
 {"who": "Jonas", "de": "Ich vertrete die Position, dass Geschichte unverzichtbar ist. Wer die Vergangenheit nicht kennt, versteht die Gegenwart nicht.", "ar": "أمثّل الموقف القائل إن التاريخ لا غنى عنه. فمن لا يعرف الماضي لا يفهم الحاضر."},
 {"who": "Mia", "de": "Dem würde ich teilweise widersprechen. Nicht der Stoff selbst ist das Problem, sondern die Art, wie er vermittelt wird: Jahreszahlen auswendig zu lernen hat wenig mit Verstehen zu tun.", "ar": "سأعارض ذلك جزئيًا. فالمشكلة ليست المادة نفسها، بل الطريقة التي تُدرَّس بها: فحفظ السنوات غيبًا لا علاقة له بالفهم."},
 {"who": "Dozentin", "de": "Ein berechtigter Einwand. Jonas, wie reagieren Sie darauf?", "ar": "اعتراض وجيه. يونس، كيف تردّ على ذلك؟"},
 {"who": "Jonas", "de": "Da ist etwas Wahres dran. Dennoch braucht man ein Grundgerüst an Fakten, um überhaupt Zusammenhänge erkennen zu können.", "ar": "في ذلك شيء من الحقيقة. ومع ذلك يحتاج المرء إلى هيكل أساسي من الحقائق حتى يستطيع أصلًا إدراك الروابط."},
 {"who": "Karim", "de": "Darf ich einen Vorschlag zur Güte machen? Man könnte die Stundenzahl reduzieren und dafür stärker projektorientiert arbeiten, etwa mit Zeitzeugeninterviews.", "ar": "هل لي أن أقدّم اقتراحًا للتسوية؟ يمكن تخفيض عدد الحصص والعمل بشكل أقوى عبر المشاريع، مثلًا بمقابلات مع شهود العصر."},
 {"who": "Mia", "de": "Damit könnte ich gut leben. Entscheidend ist doch, dass Geschichte zum Nachdenken anregt statt zum bloßen Nachbeten.", "ar": "يمكنني القبول بذلك جيدًا. فالحاسم أن يحفّز التاريخ على التفكير بدل الترديد المجرّد."},
 {"who": "Dozentin", "de": "Fassen wir zusammen: Über das Ziel – historisches Urteilsvermögen – besteht Einigkeit, über den Weg dorthin wird weiter zu streiten sein.", "ar": "لنلخّص: حول الهدف – القدرة على الحكم التاريخي – يوجد اتفاق، وحول الطريق إليه سيستمر الجدل."},
 {"who": "Jonas", "de": "Wobei ich festhalten möchte: Ohne verbindlichen Rahmen geht es nicht. Freiwillige Kurse erreichen nur die ohnehin Interessierten.", "ar": "مع ملاحظة أني أريد تثبيت أن الأمر لا يستقيم دون إطار ملزم. فالدورات الاختيارية لا تصل إلا إلى المهتمين أصلًا."},
 {"who": "Karim", "de": "Das ist ein starkes Argument. Vielleicht wäre ein Pflichtkern mit Wahlmodulen der tragfähigste Kompromiss.", "ar": "هذه حجة قوية. ربما تكون نواة إلزامية مع وحدات اختيارية هي التسوية الأكثر قابلية للحمل."},
 {"who": "Dozentin", "de": "Ein tragfähiger Vorschlag zum Abschluss. Bitte bereiten Sie für nächste Woche je eine Seite mit Ihrer begründeten Position vor.", "ar": "اقتراح قابل للحمل في الختام. حضّروا من فضلكم للأسبوع القادم صفحة واحدة لكل منكم بموقفكم المعلَّل."}],
[
 {"id": "vf-d3-q1", "promptDe": "Was kritisiert Mia?", "promptAr": "ما الذي تنتقده ميا؟",
  "options": ["Den Stoff Geschichte an sich", "Die Art der Vermittlung, etwa Auswendiglernen von Jahreszahlen", "Die Dozentin", "Die Stundenzahl allein"], "answer": "Die Art der Vermittlung, etwa Auswendiglernen von Jahreszahlen",
  "explanationAr": "تقول: «Nicht der Stoff selbst ist das Problem, sondern die Art, wie er vermittelt wird»."},
 {"id": "vf-d3-q2", "promptDe": "Welchen Kompromiss schlägt Karim vor?", "promptAr": "ما التسوية التي يقترحها كريم؟",
  "options": ["Geschichte abschaffen", "Weniger Stunden, dafür projektorientiert mit Zeitzeugeninterviews", "Nur noch Filme zeigen", "Mehr Prüfungen"], "answer": "Weniger Stunden, dafür projektorientiert mit Zeitzeugeninterviews",
  "explanationAr": "يقول: «die Stundenzahl reduzieren und dafür stärker projektorientiert arbeiten, etwa mit Zeitzeugeninterviews»."},
 {"id": "vf-d3-q3", "promptDe": "Worüber besteht am Ende Einigkeit?", "promptAr": "حول ماذا يوجد اتفاق في النهاية؟",
  "options": ["Über die Abschaffung", "Über das Ziel: historisches Urteilsvermögen", "Über die Stundenzahl", "Über die Lehrbücher"], "answer": "Über das Ziel: historisches Urteilsvermögen",
  "explanationAr": "تقول المحاضِرة: «Über das Ziel – historisches Urteilsvermögen – besteht Einigkeit»."}]))
