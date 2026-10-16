# -*- coding: utf-8 -*-
"""C3 authoring: baut content/redemittel.json (funktionale Redemittel nach Prüfungsteilen)."""
import json
from collections import Counter

# (de, ar, beispielDe, beispielAr, funktion, teile, level)
R = [
    # ── einleitung: افتتاح وتقديم ──
    ("Ich spreche heute über das Thema …", "أتحدث اليوم عن موضوع…", "Ich spreche heute über das Thema Homeoffice.", "أتحدث اليوم عن موضوع العمل من المنزل.", "einleitung", ["sprechen2", "forum"], "A2"),
    ("Zuerst möchte ich sagen, dass …", "أولًا أودّ أن أقول إنّ…", "Zuerst möchte ich sagen, dass Sport sehr wichtig ist.", "أولًا أود أن أقول إن الرياضة مهمة جدًا.", "einleitung", ["sprechen2", "sprechen3", "forum"], "A2"),
    ("Es geht um die Frage, ob …", "الأمر يتعلق بسؤال ما إذا…", "Es geht um die Frage, ob Kinder Handys brauchen.", "الأمر يتعلق بسؤال ما إذا كان الأطفال يحتاجون هواتف.", "einleitung", ["sprechen2", "forum"], "B1"),
    ("Ich habe das Thema … gewählt, weil …", "اخترت موضوع… لأنّ…", "Ich habe das Thema Reisen gewählt, weil ich gern reise.", "اخترت موضوع السفر لأنني أحب السفر.", "einleitung", ["sprechen2"], "B1"),
    ("In meinem Vortrag geht es um …", "في عرضي يدور الحديث عن…", "In meinem Vortrag geht es um gesunde Ernährung.", "في عرضي يدور الحديث عن الغذاء الصحي.", "einleitung", ["sprechen2"], "B1"),
    ("Ich möchte kurz erklären, warum …", "أودّ أن أشرح باختصار لماذا…", "Ich möchte kurz erklären, warum ich Deutsch lerne.", "أود أن أشرح باختصار لماذا أتعلم الألمانية.", "einleitung", ["sprechen2", "forum"], "B1"),
    ("Sehr geehrte Damen und Herren,", "حضرات السيدات والسادة، (افتتاح رسالة رسمية)", "Sehr geehrte Damen und Herren, ich schreibe Ihnen, weil …", "حضرات السيدات والسادة، أكتب إليكم لأنّ…", "einleitung", ["brief"], "A2"),
    ("Ich wende mich an Sie, weil …", "أتوجّه إليكم لأنّ…", "Ich wende mich an Sie, weil mein Paket nicht angekommen ist.", "أتوجه إليكم لأن طردي لم يصل.", "einleitung", ["brief"], "B1"),
    # ── meinung: إبداء الرأي ──
    ("Meiner Meinung nach …", "في رأيي…", "Meiner Meinung nach ist Radfahren gesund.", "في رأيي ركوب الدراجة صحي.", "meinung", ["sprechen3", "forum"], "A2"),
    ("Ich denke, dass …", "أعتقد أنّ…", "Ich denke, dass Kinder mehr spielen sollen.", "أعتقد أن الأطفال يجب أن يلعبوا أكثر.", "meinung", ["sprechen3", "forum"], "A2"),
    ("Ich glaube, dass …", "أظنّ أنّ…", "Ich glaube, dass die Stadt zu laut ist.", "أظن أن المدينة صاخبة جدًا.", "meinung", ["sprechen3", "forum"], "A2"),
    ("Ich bin der Meinung, dass …", "أنا على رأي أنّ…", "Ich bin der Meinung, dass man Geld sparen muss.", "أنا على رأي أنه يجب ادخار المال.", "meinung", ["sprechen3", "forum"], "B1"),
    ("Ich bin davon überzeugt, dass …", "أنا مقتنع بأنّ…", "Ich bin davon überzeugt, dass Sport glücklich macht.", "أنا مقتنع بأن الرياضة تجعل الإنسان سعيدًا.", "meinung", ["sprechen3", "forum"], "B1"),
    ("Aus meiner Erfahrung weiß ich, dass …", "من تجربتي أعرف أنّ…", "Aus meiner Erfahrung weiß ich, dass Übung hilft.", "من تجربتي أعرف أن التدريب يساعد.", "meinung", ["sprechen2", "sprechen3", "forum"], "B1"),
    ("Für mich ist es wichtig, dass …", "بالنسبة لي مهمّ أنّ…", "Für mich ist es wichtig, dass die Arbeit Spaß macht.", "بالنسبة لي مهم أن يكون العمل ممتعًا.", "meinung", ["sprechen1", "sprechen3"], "A2"),
    ("Ich finde es gut/schlecht, dass …", "أجد من الجيد/السيئ أنّ…", "Ich finde es gut, dass der Kurs online ist.", "أجد من الجيد أن الدورة عبر الإنترنت.", "meinung", ["sprechen3", "forum"], "A2"),
    ("Meiner Ansicht nach überwiegen die Vorteile.", "في رأيي الغلبة للمزايا.", "Meiner Ansicht nach überwiegen die Vorteile des Homeoffice.", "في رأيي الغلبة لمزايا العمل من المنزل.", "meinung", ["forum"], "B2"),
    ("Es lässt sich nicht leugnen, dass …", "لا يمكن إنكار أنّ…", "Es lässt sich nicht leugnen, dass Handys unser Leben verändern.", "لا يمكن إنكار أن الهواتف تغيّر حياتنا.", "meinung", ["forum"], "B2"),
    ("Ich vertrete den Standpunkt, dass …", "أتبنّى الموقف القائل إنّ…", "Ich vertrete den Standpunkt, dass Schuluniformen sinnvoll sind.", "أتبنى الموقف القائل إن الزي المدرسي معقول.", "meinung", ["forum", "sprechen3"], "B2"),
    ("Persönlich halte ich … für sinnvoll.", "شخصيًا أعتبر… معقولًا.", "Persönlich halte ich ein Jahr im Ausland für sinnvoll.", "شخصيًا أعتبر سنة في الخارج معقولة.", "meinung", ["forum", "sprechen3"], "B2"),
    # ── begruendung: تعليل وسبب ──
    ("…, weil …", "… لأنّ… (الفعل في آخر الجملة الفرعية)", "Ich lerne Deutsch, weil ich in Deutschland arbeiten will.", "أتعلم الألمانية لأنني أريد العمل في ألمانيا.", "begruendung", ["sprechen3", "forum", "brief"], "A2"),
    ("…, denn …", "… إذ إنّ… (جملة رئيسية بعدها)", "Ich bleibe zu Hause, denn ich bin krank.", "أبقى في البيت إذ إنني مريض.", "begruendung", ["forum", "sprechen3"], "B1"),
    ("Deshalb / Daher …", "لذلك…", "Es regnet. Deshalb bleibe ich zu Hause.", "إنها تمطر. لذلك أبقى في البيت.", "begruendung", ["sprechen3", "forum"], "A2"),
    ("Aus diesem Grund …", "لهذا السبب…", "Aus diesem Grund spare ich jeden Monat Geld.", "لهذا السبب أدخر المال كل شهر.", "begruendung", ["forum", "sprechen3"], "B1"),
    ("Der Grund dafür ist, dass …", "السبب في ذلك أنّ…", "Der Grund dafür ist, dass die Stadt sehr teuer ist.", "السبب في ذلك أن المدينة غالية جدًا.", "begruendung", ["sprechen3", "forum"], "B1"),
    ("Ein Grund ist zum Beispiel, dass …", "أحد الأسباب مثلًا أنّ…", "Ein Grund ist zum Beispiel, dass man Zeit spart.", "أحد الأسباب مثلًا أن المرء يوفّر الوقت.", "begruendung", ["sprechen2", "sprechen3"], "B1"),
    ("Das hat den Vorteil, dass …", "لهذا ميزة أنّ…", "Das hat den Vorteil, dass man flexibel arbeitet.", "لهذا ميزة أن المرء يعمل بمرونة.", "begruendung", ["sprechen3", "forum"], "B1"),
    ("Das führt dazu, dass …", "هذا يؤدّي إلى أنّ…", "Das führt dazu, dass viele Menschen gestresst sind.", "هذا يؤدي إلى أن كثيرًا من الناس متوترون.", "begruendung", ["forum"], "B2"),
    ("Nicht zuletzt, weil …", "وليس آخرًا لأنّ…", "Nicht zuletzt, weil es unserer Gesundheit schadet.", "وليس آخرًا لأنه يضرّ بصحتنا.", "begruendung", ["forum"], "B2"),
    ("Je …, desto …", "كلّما… ازداد…", "Je mehr man übt, desto besser spricht man.", "كلما تدرب المرء أكثر تحدث بشكل أفضل.", "begruendung", ["forum", "sprechen3"], "B2"),
    # ── zustimmung: موافقة وتأييد ──
    ("Da hast du recht.", "معك حقّ. (للمخاطب المفرد)", "Da hast du recht, der Preis ist zu hoch.", "معك حق، السعر مرتفع جدًا.", "zustimmung", ["sprechen3"], "A2"),
    ("Das sehe ich genauso.", "أرى الأمر بالطريقة نفسها.", "Das sehe ich genauso, wir brauchen mehr Grün in der Stadt.", "أرى الأمر بالطريقة نفسها، نحتاج مزيدًا من الخضرة في المدينة.", "zustimmung", ["sprechen3"], "B1"),
    ("Ich stimme dir/Ihnen zu.", "أوافقك الرأي.", "Ich stimme dir zu, das ist eine gute Idee.", "أوافقك الرأي، هذه فكرة جيدة.", "zustimmung", ["sprechen3"], "B1"),
    ("Genau, und außerdem …", "تمامًا، وعلاوة على ذلك…", "Genau, und außerdem spart man Zeit.", "تمامًا، وعلاوة على ذلك يوفّر المرء الوقت.", "zustimmung", ["sprechen3"], "B1"),
    ("Das ist ein gutes Argument.", "هذه حجة جيدة.", "Das ist ein gutes Argument, daran habe ich nicht gedacht.", "هذه حجة جيدة، لم أفكر في ذلك.", "zustimmung", ["sprechen3"], "B1"),
    ("Einverstanden!", "اتفقنا! / موافق!", "Einverstanden! Wir treffen uns um acht Uhr.", "اتفقنا! نلتقي في الثامنة.", "zustimmung", ["sprechen1", "sprechen3"], "A2"),
    ("Da bin ich ganz deiner/Ihrer Meinung.", "أنا تمامًا على رأيك.", "Da bin ich ganz deiner Meinung, wir sollten früher anfangen.", "أنا تمامًا على رأيك، يجب أن نبدأ أبكر.", "zustimmung", ["sprechen3"], "B2"),
    ("Dem kann ich nur zustimmen.", "لا يسعني إلا الموافقة على ذلك.", "Dem kann ich nur zustimmen, Bildung ist der Schlüssel.", "لا يسعني إلا الموافقة، التعليم هو المفتاح.", "zustimmung", ["sprechen3", "forum"], "B2"),
    # ── widerspruch: اعتراض ومخالفة ──
    ("Da bin ich anderer Meinung.", "أنا على رأي آخر في ذلك.", "Da bin ich anderer Meinung, Autos sind in der Stadt nötig.", "أنا على رأي آخر، السيارات ضرورية في المدينة.", "widerspruch", ["sprechen3", "forum"], "B1"),
    ("Das sehe ich anders.", "أرى الأمر بشكل مختلف.", "Das sehe ich anders, Online-Kurse sind nicht immer besser.", "أرى الأمر بشكل مختلف، الدورات عبر الإنترنت ليست دائمًا أفضل.", "widerspruch", ["sprechen3"], "B1"),
    ("Einerseits …, andererseits …", "من جهة… ومن جهة أخرى…", "Einerseits ist es billig, andererseits ist die Qualität schlecht.", "من جهة هو رخيص، ومن جهة أخرى الجودة سيئة.", "widerspruch", ["sprechen3", "forum"], "B1"),
    ("Trotzdem finde ich, dass …", "مع ذلك أرى أنّ…", "Trotzdem finde ich, dass die Stadt besser ist.", "مع ذلك أرى أن المدينة أفضل.", "widerspruch", ["sprechen3", "forum"], "B1"),
    ("Das stimmt, aber …", "هذا صحيح، لكن…", "Das stimmt, aber der Zug ist oft zu spät.", "هذا صحيح، لكن القطار يتأخر غالبًا.", "widerspruch", ["sprechen3"], "A2"),
    ("Ich bin nicht sicher, ob …", "لست متأكدًا ما إذا…", "Ich bin nicht sicher, ob das für alle gut ist.", "لست متأكدًا ما إذا كان هذا جيدًا للجميع.", "widerspruch", ["sprechen3"], "B1"),
    ("Dem möchte ich widersprechen.", "أودّ أن أعترض على ذلك. (رسمي)", "Dem möchte ich widersprechen, die Zahlen zeigen etwas anderes.", "أود أن أعترض على ذلك، الأرقام تُظهر شيئًا آخر.", "widerspruch", ["sprechen3", "forum"], "B2"),
    ("Das mag sein, jedoch …", "قد يكون ذلك، غير أنّ…", "Das mag sein, jedoch sind die Kosten zu hoch.", "قد يكون ذلك، غير أن التكاليف مرتفعة جدًا.", "widerspruch", ["forum"], "B2"),
    ("Im Gegenteil: …", "على العكس:…", "Im Gegenteil: Die Stadt wird immer grüner.", "على العكس: المدينة تصبح أكثر خضرة باستمرار.", "widerspruch", ["forum", "sprechen3"], "B2"),
    ("Hier muss man unterscheiden zwischen … und …", "هنا يجب التمييز بين… و…", "Hier muss man unterscheiden zwischen Stadt und Land.", "هنا يجب التمييز بين المدينة والريف.", "widerspruch", ["forum"], "B2"),
    # ── vergleich: مقارنة ──
    ("… ist größer/besser als …", "… أكبر/أفضل من…", "Die Stadt ist größer als mein Dorf.", "المدينة أكبر من قريتي.", "vergleich", ["sprechen2", "sprechen3"], "A2"),
    ("Im Vergleich zu …", "بالمقارنة مع…", "Im Vergleich zu früher ist alles teurer.", "بالمقارنة مع السابق كل شيء أغلى.", "vergleich", ["sprechen2", "forum"], "B1"),
    ("Sowohl … als auch …", "كِلا… و… / … أيضًا", "Sowohl Kinder als auch Erwachsene lernen gern.", "الأطفال والبالغون على السواء يحبون التعلم.", "vergleich", ["forum", "sprechen3"], "B1"),
    ("Während …, …", "بينما…، … (للمقابلة)", "Während mein Bruder liest, spiele ich Fußball.", "بينما يقرأ أخي ألعب كرة القدم.", "vergleich", ["forum", "sprechen2"], "B1"),
    ("Der Unterschied ist, dass …", "الفرق هو أنّ…", "Der Unterschied ist, dass man im Homeoffice allein ist.", "الفرق هو أن المرء في العمل المنزلي وحيد.", "vergleich", ["sprechen2", "sprechen3", "forum"], "B1"),
    ("Genau wie …, so auch …", "تمامًا كما…، كذلك…", "Genau wie in meiner Heimat, so feiert man auch hier Feste.", "تمامًا كما في وطني، كذلك يحتفل الناس هنا بالأعياد.", "vergleich", ["forum"], "B2"),
    ("… unterscheidet sich von … dadurch, dass …", "… يختلف عن… في أنّ…", "Das Land unterscheidet sich von der Stadt dadurch, dass es ruhiger ist.", "تختلف القرية عن المدينة في أنها أهدأ.", "vergleich", ["forum"], "B2"),
    ("Nicht nur …, sondern auch …", "ليس فقط… بل أيضًا…", "Nicht nur Kinder, sondern auch Erwachsene nutzen das Angebot.", "ليس الأطفال فقط بل البالغون أيضًا يستخدمون العرض.", "vergleich", ["forum", "sprechen3"], "B2"),
    ("Auf dem Bild sehe ich links/rechts …", "في الصورة أرى يسارًا/يمينًا…", "Auf dem Bild sehe ich links eine Familie und rechts Kinder.", "في الصورة أرى يسارًا عائلة ويمينًا أطفالًا.", "vergleich", ["sprechen2"], "A2"),
    ("Im Vordergrund / Im Hintergrund …", "في المقدّمة / في الخلفية…", "Im Vordergrund spielt ein Kind, im Hintergrund sieht man Berge.", "في المقدمة يلعب طفل، وفي الخلفية تُرى جبال.", "vergleich", ["sprechen2"], "B1"),
    # ── vorschlag: اقتراح وتخطيط مشترك ──
    ("Ich schlage vor, dass wir …", "أقترح أن… (نحن)", "Ich schlage vor, dass wir am Samstag kochen.", "أقترح أن نطبخ يوم السبت.", "vorschlag", ["sprechen3"], "B1"),
    ("Was hältst du von …?", "ما رأيك في…؟", "Was hältst du von einem Picknick im Park?", "ما رأيك في نزهة في الحديقة؟", "vorschlag", ["sprechen1", "sprechen3"], "A2"),
    ("Wie wäre es mit …?", "ما رأيك لو…؟ / ماذا عن…؟", "Wie wäre es mit einem Film am Abend?", "ماذا عن فيلم في المساء؟", "vorschlag", ["sprechen1", "sprechen3"], "A2"),
    ("Wir könnten …", "يمكننا أن…", "Wir könnten zusammen lernen.", "يمكننا أن نتعلم معًا.", "vorschlag", ["sprechen3"], "B1"),
    ("Lass uns …!", "هيّا بنا…!", "Lass uns morgen früh anfangen!", "هيا بنا نبدأ غدًا صباحًا!", "vorschlag", ["sprechen1", "sprechen3"], "A2"),
    ("Ich würde vorschlagen, … zu …", "كنت سأقترح أن… (أدب)", "Ich würde vorschlagen, früher zu kommen.", "كنت سأقترح أن نأتي أبكر.", "vorschlag", ["sprechen3"], "B2"),
    ("Könnten wir uns darauf einigen, dass …?", "هل يمكن أن نتفق على أنّ…؟", "Könnten wir uns darauf einigen, dass wir um neun beginnen?", "هل يمكن أن نتفق على أن نبدأ في التاسعة؟", "vorschlag", ["sprechen3"], "B2"),
    ("Als Kompromiss könnten wir …", "كحلّ وسط يمكننا…", "Als Kompromiss könnten wir zwei Tage zu Hause arbeiten.", "كحل وسط يمكننا العمل يومين من المنزل.", "vorschlag", ["sprechen3"], "B2"),
    ("Zuerst …, dann …, am Ende …", "أولًا… ثم… وفي النهاية… (خطة)", "Zuerst kaufen wir ein, dann kochen wir, am Ende essen wir zusammen.", "أولًا نتسوق، ثم نطبخ، وفي النهاية نأكل معًا.", "vorschlag", ["sprechen3", "sprechen1"], "A2"),
    ("Ich kümmere mich um …, und du …?", "سأتولّى…، وأنت…؟", "Ich kümmere mich um das Essen, und du um die Getränke?", "سأتولى الطعام، وأنت المشروبات؟", "vorschlag", ["sprechen3"], "B1"),
    # ── zusammenfassung: تلخيص وخاتمة ──
    ("Zusammenfassend kann man sagen, dass …", "وخلاصة القول يمكن أن نقول إنّ…", "Zusammenfassend kann man sagen, dass Sport für alle wichtig ist.", "وخلاصة القول يمكن أن نقول إن الرياضة مهمة للجميع.", "zusammenfassung", ["sprechen2", "sprechen3", "forum"], "B1"),
    ("Zum Schluss möchte ich sagen, dass …", "في الختام أودّ أن أقول إنّ…", "Zum Schluss möchte ich sagen, dass ich viel gelernt habe.", "في الختام أود أن أقول إنني تعلمت الكثير.", "zusammenfassung", ["sprechen2", "forum"], "B1"),
    ("Alles in allem …", "بالمحصّلة… / إجمالًا…", "Alles in allem war die Reise ein Erfolg.", "بالمحصلة كانت الرحلة ناجحة.", "zusammenfassung", ["forum", "sprechen3"], "B1"),
    ("Abschließend lässt sich sagen, dass …", "ختامًا يمكن القول إنّ…", "Abschließend lässt sich sagen, dass beide Seiten wichtig sind.", "ختامًا يمكن القول إن كلا الجانبين مهم.", "zusammenfassung", ["forum"], "B2"),
    ("Die wichtigsten Punkte sind: erstens …, zweitens …", "أهمّ النقاط: أولًا…، ثانيًا…", "Die wichtigsten Punkte sind: erstens die Zeit, zweitens das Geld.", "أهم النقاط: أولًا الوقت، ثانيًا المال.", "zusammenfassung", ["sprechen2", "forum"], "B1"),
    ("Damit bin ich am Ende meines Vortrags.", "وبهذا أصل إلى نهاية عرضي.", "Damit bin ich am Ende meines Vortrags. Vielen Dank.", "وبهذا أصل إلى نهاية عرضي. شكرًا جزيلًا.", "zusammenfassung", ["sprechen2"], "B1"),
    ("Ich danke Ihnen für Ihre Aufmerksamkeit.", "أشكركم على انتباهكم.", "Ich danke Ihnen für Ihre Aufmerksamkeit und Ihre Fragen.", "أشكركم على انتباهكم وأسئلتكم.", "zusammenfassung", ["sprechen2"], "B1"),
    ("Mit freundlichen Grüßen", "مع خالص التحيات (ختام رسالة)", "Mit freundlichen Grüßen, Sara Amri.", "مع خالص التحيات، سارة عمري.", "zusammenfassung", ["brief"], "A2"),
    ("Ich würde mich über eine Antwort freuen.", "يسعدني تلقّي ردّكم.", "Ich würde mich über eine Antwort freuen.", "يسعدني تلقي ردكم.", "zusammenfassung", ["brief"], "B1"),
    ("Für Rückfragen stehe ich Ihnen gern zur Verfügung.", "لأيّ استفسارات إضافية أنا رهن تصرّفكم.", "Für Rückfragen stehe ich Ihnen gern zur Verfügung.", "لأي استفسارات إضافية أنا رهن تصرفكم.", "zusammenfassung", ["brief"], "B2"),
    # ── beschwerde: شكوى ومطالبة (كتابة غالبًا) ──
    ("Ich möchte mich über … beschweren.", "أودّ أن أشكو من…", "Ich möchte mich über den Lärm beschweren.", "أود أن أشكو من الضجيج.", "beschwerde", ["brief"], "B1"),
    ("Leider musste ich feststellen, dass …", "للأسف اضطررت أن ألاحظ أنّ…", "Leider musste ich feststellen, dass das Zimmer nicht sauber war.", "للأسف اضطررت أن ألاحظ أن الغرفة لم تكن نظيفة.", "beschwerde", ["brief"], "B1"),
    ("Am … habe ich bei Ihnen … bestellt/gebucht.", "في يوم… طلبت/حجزت لديكم…", "Am 3. Mai habe ich bei Ihnen ein Zimmer gebucht.", "في 3 مايو حجزت لديكم غرفة.", "beschwerde", ["brief"], "B1"),
    ("Das Produkt funktioniert leider nicht.", "المنتج لا يعمل للأسف.", "Das Produkt funktioniert leider nicht und macht Geräusche.", "المنتج لا يعمل للأسف ويصدر أصواتًا.", "beschwerde", ["brief"], "A2"),
    ("Ich bitte Sie, … zu …", "أرجو منكم أن…", "Ich bitte Sie, den Schaden zu reparieren.", "أرجو منكم إصلاح الضرر.", "beschwerde", ["brief"], "B1"),
    ("Ich bitte um Rückerstattung des Betrags.", "أطلب استرداد المبلغ.", "Ich bitte um Rückerstattung des Betrags von 89 Euro.", "أطلب استرداد مبلغ 89 يورو.", "beschwerde", ["brief"], "B2"),
    ("Andernfalls sehe ich mich gezwungen, …", "وإلا أجد نفسي مضطرًا إلى… (تصعيد مهذّب)", "Andernfalls sehe ich mich gezwungen, den Vertrag zu kündigen.", "وإلا أجد نفسي مضطرًا إلى إنهاء العقد.", "beschwerde", ["brief"], "B2"),
    ("Ich erwarte Ihre Antwort bis zum …", "أتوقّع ردّكم حتى يوم…", "Ich erwarte Ihre Antwort bis zum 20. Juni.", "أتوقع ردكم حتى 20 يونيو.", "beschwerde", ["brief"], "B2"),
    ("Die Heizung ist seit … defekt.", "التدفئة معطّلة منذ…", "Die Heizung ist seit Montag defekt und die Wohnung ist kalt.", "التدفئة معطلة منذ الاثنين والشقة باردة.", "beschwerde", ["brief"], "A2"),
    ("Ich wäre Ihnen dankbar, wenn Sie …", "سأكون شاكرًا لكم لو…", "Ich wäre Ihnen dankbar, wenn Sie mir bald antworten.", "سأكون شاكرًا لكم لو أجبتموني قريبًا.", "beschwerde", ["brief"], "B2"),
    # ── nachfrage: استفسار وطلب توضيح ──
    ("Ich hätte eine Frage: …", "عندي سؤال:…", "Ich hätte eine Frage: Wann beginnt der Kurs?", "عندي سؤال: متى تبدأ الدورة؟", "nachfrage", ["sprechen1", "sprechen3"], "A2"),
    ("Kannst du das bitte wiederholen?", "هل يمكنك تكرار ذلك من فضلك؟", "Kannst du das bitte wiederholen? Ich habe es nicht verstanden.", "هل يمكنك تكرار ذلك من فضلك؟ لم أفهمه.", "nachfrage", ["sprechen1", "sprechen3"], "A2"),
    ("Was bedeutet …?", "ما معنى…؟", "Was bedeutet das Wort „Gebühr“?", "ما معنى كلمة «Gebühr» (رسوم)؟", "nachfrage", ["sprechen1"], "A2"),
    ("Wie bitte? Das habe ich nicht verstanden.", "عفوًا؟ لم أفهم ذلك.", "Wie bitte? Das habe ich nicht verstanden.", "عفوًا؟ لم أفهم ذلك.", "nachfrage", ["sprechen1", "sprechen3"], "A2"),
    ("Könnten Sie das bitte langsamer sagen?", "هل يمكنكم قول ذلك ببطء أكثر؟ (رسمي)", "Könnten Sie das bitte langsamer sagen?", "هل يمكنكم قول ذلك ببطء أكثر؟", "nachfrage", ["sprechen1"], "B1"),
    ("Ich hätte gern gewusst, ob …", "كنت أودّ أن أعرف ما إذا… (أدب)", "Ich hätte gern gewusst, ob noch Plätze frei sind.", "كنت أود أن أعرف ما إذا كانت هناك أماكن شاغرة.", "nachfrage", ["brief"], "B2"),
    ("Könnten Sie mir bitte mitteilen, …?", "هل يمكنكم إعلامي من فضلكم…؟", "Könnten Sie mir bitte mitteilen, wann der Termin ist?", "هل يمكنكم إعلامي متى الموعد؟", "nachfrage", ["brief"], "B2"),
    ("Darf ich fragen, …?", "هل لي أن أسأل…؟", "Darf ich fragen, wie viel das kostet?", "هل لي أن أسأل كم يكلف ذلك؟", "nachfrage", ["sprechen1", "sprechen3"], "B1"),
    ("Entschuldigung, ich habe eine Frage zum Thema …", "عذرًا، عندي سؤال حول موضوع…", "Entschuldigung, ich habe eine Frage zum Thema Arbeitszeiten.", "عذرًا، عندي سؤال حول موضوع أوقات العمل.", "nachfrage", ["sprechen1"], "B1"),
    ("Meinst du damit, dass …?", "هل تعني بذلك أنّ…؟ (تحقّق من الفهم)", "Meinst du damit, dass wir früher kommen sollen?", "هل تعني بذلك أن علينا الحضور أبكر؟", "nachfrage", ["sprechen3"], "B1"),
    # ── beschreibung: وصف وترتيب عرض ──
    ("Das Bild zeigt …", "الصورة تُظهر…", "Das Bild zeigt eine Familie im Park.", "الصورة تُظهر عائلة في حديقة.", "beschreibung", ["sprechen2"], "A2"),
    ("Auf dem Bild sehe ich …", "في الصورة أرى…", "Auf dem Bild sehe ich viele Menschen am Strand.", "في الصورة أرى أناسًا كثيرين على الشاطئ.", "beschreibung", ["sprechen2"], "A2"),
    ("Oben / Unten / In der Mitte …", "في الأعلى / في الأسفل / في الوسط…", "Oben sieht man die Sonne, in der Mitte ein Boot.", "في الأعلى تُرى الشمس، وفي الوسط قارب.", "beschreibung", ["sprechen2"], "A2"),
    ("Die Person auf der linken Seite …", "الشخص على الجانب الأيسر…", "Die Person auf der linken Seite trägt eine Jacke.", "الشخص على الجانب الأيسر يرتدي سترة.", "beschreibung", ["sprechen2"], "B1"),
    ("Es sieht so aus, als ob …", "يبدو وكأنّ…", "Es sieht so aus, als ob die Kinder Spaß haben.", "يبدو وكأن الأطفال مستمتعون.", "beschreibung", ["sprechen2"], "B1"),
    ("Vermutlich handelt es sich um …", "يُرجّح أنّ الأمر يتعلق بـ… (تخمين)", "Vermutlich handelt es sich um eine Schulklasse.", "يُرجّح أن الأمر يتعلق بفصل مدرسي.", "beschreibung", ["sprechen2"], "B1"),
    ("Das erinnert mich an …", "هذا يُذكّرني بـ…", "Das erinnert mich an meine Kindheit auf dem Land.", "هذا يذكّرني بطفولتي في الريف.", "beschreibung", ["sprechen2", "sprechen3"], "B1"),
    ("Besonders auffällig ist, dass …", "اللافت بشكل خاص أنّ…", "Besonders auffällig ist, dass alle lachen.", "اللافت بشكل خاص أن الجميع يضحكون.", "beschreibung", ["sprechen2"], "B2"),
    ("Man kann erkennen, dass …", "يمكن ملاحظة أنّ…", "Man kann erkennen, dass die Stimmung gut ist.", "يمكن ملاحظة أن الأجواء جيدة.", "beschreibung", ["sprechen2"], "B1"),
    ("Im Vergleich zum ersten Bild …", "بالمقارنة مع الصورة الأولى…", "Im Vergleich zum ersten Bild ist hier alles moderner.", "بالمقارنة مع الصورة الأولى كل شيء هنا أحدث.", "beschreibung", ["sprechen2"], "B2"),
    ("Betreff: Beschwerde über …", "الموضوع: شكوى بخصوص… (سطر موضوع الرسالة)", "Betreff: Beschwerde über die defekte Heizung", "الموضوع: شكوى بخصوص التدفئة المعطّلة", "beschwerde", ["brief"], "B1"),
    ("Ich beziehe mich auf Ihre Anzeige vom …", "أشير إلى إعلانكم المؤرّخ في…", "Ich beziehe mich auf Ihre Anzeige vom 2. Mai.", "أشير إلى إعلانكم المؤرخ في 2 مايو.", "einleitung", ["brief"], "B2"),
    ("Bitte teilen Sie mir mit, ob …", "يرجى إعلامي ما إذا…", "Bitte teilen Sie mir mit, ob der Termin noch frei ist.", "يرجى إعلامي ما إذا كان الموعد ما زال شاغرًا.", "nachfrage", ["brief"], "B1"),
    ("Gern sende ich Ihnen … zu.", "يسعدني أن أرسل إليكم…", "Gern sende ich Ihnen meine Unterlagen zu.", "يسعدني أن أرسل إليكم مستنداتي.", "beschwerde", ["brief"], "B1"),
    ("Vielen Dank für Ihr Verständnis.", "شكرًا جزيلًا على تفهّمكم.", "Vielen Dank für Ihr Verständnis und Ihre Hilfe.", "شكرًا جزيلًا على تفهمكم ومساعدتكم.", "zusammenfassung", ["brief"], "B1"),
    ("Darf ich mich vorstellen? Ich heiße …", "هل لي أن أقدّم نفسي؟ اسمي…", "Darf ich mich vorstellen? Ich heiße Benali und komme aus Tunesien.", "هل لي أن أقدم نفسي؟ اسمي بن علي وأنا من تونس.", "einleitung", ["sprechen1"], "A2"),
    ("Ich komme aus …, wohne aber jetzt in …", "أنا من…، لكنّي أسكن الآن في…", "Ich komme aus Syrien, wohne aber jetzt in Berlin.", "أنا من سوريا، لكنني أسكن الآن في برلين.", "einleitung", ["sprechen1"], "A2"),
]

FUNKTIONEN = ["einleitung", "meinung", "begruendung", "zustimmung", "widerspruch", "vergleich", "vorschlag", "zusammenfassung", "beschwerde", "nachfrage", "beschreibung"]
TEILE = ["sprechen1", "sprechen2", "sprechen3", "forum", "brief"]

items = []
for i, (de, ar, bde, bar, funk, teile, level) in enumerate(R, 1):
    items.append({
        "id": f"rm-{i:03d}", "de": de, "ar": ar, "beispielDe": bde, "beispielAr": bar,
        "funktion": funk, "teile": teile, "level": level,
    })

fcount = Counter(x["funktion"] for x in items)
tcount = Counter(t for x in items for t in x["teile"])
lcount = Counter(x["level"] for x in items)
print("items:", len(items))
print("funktionen:", dict(fcount))
print("teile:", dict(tcount))
print("levels:", dict(lcount))
norm = [x["de"].strip().lower() for x in items]
assert len(norm) == len(set(norm)), "Duplikate!"
assert all(x["beispielDe"] and x["beispielAr"] and x["ar"] for x in items)
assert all(f in FUNKTIONEN and x["funktion"] in FUNKTIONEN for x in items for f in [x["funktion"]])
assert all(t in TEILE for x in items for t in x["teile"])
json.dump({"items": items}, open("content/redemittel.json", "w"), ensure_ascii=False, indent=2)
print("content/redemittel.json geschrieben")
