# -*- coding: utf-8 -*-
"""R179 (C5): Neue Hoermaterialien (Nachrichten/Durchsagen/Werbung/Interviews), KI-Stimmen,
ausserhalb der 378 Tage. Audio wird per Arena-TTS erzeugt und maschinell geprueft (R169-QC).
Stimmen-Platzhalter STIMME_A/STIMME_B werden nach der Erzeugung finalisiert."""
import json

def frage(id_, pd, pa, opts, ans, expl):
    return {"id": id_, "promptDe": pd, "promptAr": pa, "options": opts, "answer": ans, "explanationAr": expl}

ITEMS = []

ITEMS.append({
 "id": "hn-01", "format": "nachrichten", "level": "B2",
 "titelDe": "Kurznachrichten am Mittag", "titelAr": "موجز أخبار الظهيرة",
 "zeilen": [
   {"who": "Sprecherin", "de": "Willkommen zu den Kurznachrichten am Mittag. Die Stadtverwaltung hat heute angekündigt, dass das Freibad am Stadtpark ab dem kommenden Wochenende wieder täglich geöffnet ist. Nach den Reparaturen am Becken steht den Besuchern auch das neue Kinderbecken zur Verfügung. Der Eintritt bleibt in diesem Sommer unverändert. Außerdem teilt die Verkehrsgesellschaft mit, dass die Buslinie zwölf wegen einer Baustelle bis Ende August umgeleitet wird. Fahrgäste werden gebeten, die Ersatzhaltestelle in der Gartenstraße zu nutzen. Und das Wetter: Nach einem regnerischen Vormittag klart es am Nachmittag auf, die Temperaturen steigen auf bis zu 22 Grad.", "ar": "مرحبًا بكم في موجز أخبار الظهيرة. أعلنت إدارة المدينة اليوم أنّ المسبح الخارجي في حديقة المدينة سيفتح مجددًا يوميًا اعتبارًا من عطلة نهاية الأسبوع القادمة. وبعد أعمال الإصلاح في الحوض، يتوفر للزوار أيضًا حوض الأطفال الجديد. ويبقى الدخول هذا الصيف دون تغيير. كما تفيد شركة النقل بأنّ خط الحافلات اثني عشر سيُحوَّل بسبب موقع بناء حتى نهاية أغسطس. ويُطلب من الركاب استخدام المحطة البديلة في شارع الحديقة. والطقس: بعد صباح ماطر، تصفو السماء بعد الظهر وترتفع درجات الحرارة حتى 22 درجة."}],
 "clips": [{"zeilen": [0], "stimme": "A"}],
 "fragen": [
   frage("hn-01-q1", "Was ist ab dem Wochenende wieder geöffnet?", "ما الذي يُفتح مجددًا اعتبارًا من عطلة الأسبوع؟",
     ["Die Stadtbibliothek", "Das Freibad am Stadtpark", "Das Rathaus", "Die Gartenstraße"], "Das Freibad am Stadtpark",
     "تقول الأخبار: «dass das Freibad am Stadtpark ab dem kommenden Wochenende wieder täglich geöffnet ist»."),
   frage("hn-01-q2", "Warum wird die Buslinie zwölf umgeleitet?", "لماذا يُحوَّل خط الحافلات اثني عشر؟",
     ["Wegen eines Unfalls", "Wegen einer Baustelle", "Wegen des Wetters", "Wegen eines Festes"], "Wegen einer Baustelle",
     "النص: «wegen einer Baustelle bis Ende August umgeleitet»."),
   frage("hn-01-q3", "Wie wird das Wetter am Nachmittag?", "كيف يصبح الطقس بعد الظهر؟",
     ["Es regnet weiter", "Es klart auf und wird bis zu 22 Grad warm", "Es gibt ein Gewitter", "Es wird kälter"], "Es klart auf und wird bis zu 22 Grad warm",
     "النص: «klart es am Nachmittag auf, die Temperaturen steigen auf bis zu 22 Grad».")]})

ITEMS.append({
 "id": "hn-02", "format": "nachrichten", "level": "B1",
 "titelDe": "Neues aus der Region", "titelAr": "جديد المنطقة",
 "zeilen": [
   {"who": "Sprecherin", "de": "Hier sind die Nachrichten aus der Region. Die Grundschule in Lindenberg sucht ab sofort freiwillige Helfer für die Nachmittagsbetreuung. Interessierte können sich im Schulbüro melden, eine Ausbildung ist nicht nötig. Außerdem hat der Wochenmarkt ab Juni neue Öffnungszeiten: Er findet jetzt jeden Mittwoch und Samstag von acht bis vierzehn Uhr statt. Zum Schluss eine Meldung der Polizei: In der Nacht zum Sonntag wurde in der Bahnhofstraße ein Fahrrad gestohlen. Zeugen werden gebeten, sich zu melden.", "ar": "إليكم أخبار المنطقة. تبحث المدرسة الابتدائية في ليندنبرغ اعتبارًا من الآن عن متطوعين لرعاية ما بعد الظهر. ويمكن للمهتمين التسجيل في مكتب المدرسة، ولا يلزم تدريب. كما أنّ لسوق الأسبوع اعتبارًا من يونيو مواعيد جديدة: إذ يُقام الآن كل أربعاء وسبت من الثامنة حتى الثانية ظهرًا. وأخيرًا خبر من الشرطة: في ليلة الأحد سُرق دراجة في شارع المحطة. ويُطلب من الشهود الإبلاغ."}],
 "clips": [{"zeilen": [0], "stimme": "A"}],
 "fragen": [
   frage("hn-02-q1", "Wen sucht die Grundschule?", "عمّن تبحث المدرسة الابتدائية؟",
     ["Neue Lehrer", "Freiwillige Helfer für die Nachmittagsbetreuung", "Einen Hausmeister", "Kinder für die erste Klasse"], "Freiwillige Helfer für die Nachmittagsbetreuung",
     "النص: «sucht ab sofort freiwillige Helfer für die Nachmittagsbetreuung»."),
   frage("hn-02-q2", "Wann findet der Wochenmarkt ab Juni statt?", "متى يُقام السوق الأسبوعي اعتبارًا من يونيو؟",
     ["Jeden Tag von 8 bis 14 Uhr", "Mittwochs und samstags von 8 bis 14 Uhr", "Nur samstags", "Freitags und sonntags"], "Mittwochs und samstags von 8 bis 14 Uhr",
     "النص: «jeden Mittwoch und Samstag von acht bis vierzehn Uhr»."),
   frage("hn-02-q3", "Was wurde gestohlen?", "ما الذي سُرق؟",
     ["Ein Auto", "Ein Fahrrad", "Ein Handy", "Eine Tasche"], "Ein Fahrrad",
     "النص: «wurde in der Bahnhofstraße ein Fahrrad gestohlen».")]})

ITEMS.append({
 "id": "hn-03", "format": "nachrichten", "level": "B2",
 "titelDe": "Wirtschaft und Umwelt in Kürze", "titelAr": "الاقتصاد والبيئة باختصار",
 "zeilen": [
   {"who": "Sprecher", "de": "Wirtschaft und Umwelt in Kürze. Die Zahl der neu zugelassenen Elektroautos ist im vergangenen Quartal erneut deutlich gestiegen. Fachleute führen das vor allem auf gesunkene Preise und ein dichteres Netz an Ladestationen zurück. Gleichzeitig warnen Umweltorganisationen davor, den Ausbau der Bahn zu vernachlässigen. Nur wenn auch der öffentliche Verkehr attraktiver werde, könne der Verkehrssektor seine Klimaziele erreichen. Die Bundesregierung kündigte unterdessen an, die Förderung für den Schienenverkehr im kommenden Haushalt zu erhöhen. Konkrete Zahlen wurden noch nicht genannt.", "ar": "الاقتصاد والبيئة باختصار. ارتفع عدد السيارات الكهربائية المسجلة حديثًا في الربع الماضي بشكل واضح مجددًا. ويرجع الخبراء ذلك قبل كل شيء إلى أسعار منخفضة وشبكة أكثف من محطات الشحن. وفي الوقت نفسه تحذر منظمات بيئية من إهمال توسيع السكك الحديدية. فلا يمكن لقطاع النقل أن يحقق أهدافه المناخية إلا إذا أصبح النقل العام أكثر جاذبية أيضًا. وفي هذه الأثناء أعلنت الحكومة الاتحادية زيادة دعم النقل بالسكك في الميزانية القادمة. ولم تُذكر أرقام ملموسة بعد."}],
 "clips": [{"zeilen": [0], "stimme": "B"}],
 "fragen": [
   frage("hn-03-q1", "Warum steigen die Elektroauto-Zulassungen?", "لماذا ترتفع تسجيلات السيارات الكهربائية؟",
     ["Wegen neuer Gesetze", "Wegen gesunkener Preise und mehr Ladestationen", "Wegen billigem Benzin", "Wegen Werbung"], "Wegen gesunkener Preise und mehr Ladestationen",
     "النص: «vor allem auf gesunkene Preise und ein dichteres Netz an Ladestationen»."),
   frage("hn-03-q2", "Wovor warnen Umweltorganisationen?", "ممّا تحذر المنظمات البيئية؟",
     ["Vor zu vielen Autos", "Davor, den Ausbau der Bahn zu vernachlässigen", "Vor hohen Preisen", "Vor Ladestationen"], "Davor, den Ausbau der Bahn zu vernachlässigen",
     "النص: «warnen Umweltorganisationen davor, den Ausbau der Bahn zu vernachlässigen»."),
   frage("hn-03-q3", "Was kündigte die Bundesregierung an?", "ما الذي أعلنته الحكومة الاتحادية؟",
     ["Ein Autoverbot", "Die Förderung für den Schienenverkehr zu erhöhen", "Neue Straßen", "Niedrigere Steuern"], "Die Förderung für den Schienenverkehr zu erhöhen",
     "النص: «die Förderung für den Schienenverkehr im kommenden Haushalt zu erhöhen».")]})

ITEMS.append({
 "id": "hn-04", "format": "durchsage", "level": "B1",
 "titelDe": "Durchsage am Bahnhof", "titelAr": "إعلان في محطة القطار",
 "zeilen": [
   {"who": "Bahnhofsansage", "de": "Achtung, bitte! Eine Durchsage für die Reisenden des Regionalexpress nach Hamburg. Der Zug hat heute wegen einer technischen Störung etwa zwanzig Minuten Verspätung. Er fährt voraussichtlich um fünfzehn Uhr vierzig von Gleis sieben ab. Bitte achten Sie auf die Anzeige. Wir danken für Ihr Verständnis.", "ar": "انتباه من فضلكم! إعلان لمسافري القطار الإقليمي السريع إلى هامبورغ. يتأخر القطار اليوم نحو عشرين دقيقة بسبب عطل تقني. وسيغادر على الأرجح في الثالثة وأربعين دقيقة من الرصيف سبعة. انتبهوا إلى لوحة العرض. شكرًا لتفهمكم."}],
 "clips": [{"zeilen": [0], "stimme": "B"}],
 "fragen": [
   frage("hn-04-q1", "Wie viel Verspätung hat der Zug?", "كم تأخير القطار؟",
     ["Zehn Minuten", "Etwa zwanzig Minuten", "Eine Stunde", "Er fällt aus"], "Etwa zwanzig Minuten",
     "النص: «etwa zwanzig Minuten Verspätung»."),
   frage("hn-04-q2", "Von welchem Gleis fährt der Zug ab?", "من أي رصيف يغادر القطار؟",
     ["Gleis drei", "Gleis zwölf", "Gleis sieben", "Gleis eins"], "Gleis sieben",
     "النص: «von Gleis sieben ab»."),
   frage("hn-04-q3", "Was ist der Grund für die Verspätung?", "ما سبب التأخير؟",
     ["Das Wetter", "Eine technische Störung", "Ein Streik", "Zu viele Fahrgäste"], "Eine technische Störung",
     "النص: «wegen einer technischen Störung».")]})

ITEMS.append({
 "id": "hn-05", "format": "durchsage", "level": "A2",
 "titelDe": "Am Flughafen: Gate-Wechsel", "titelAr": "في المطار: تغيير بوابة",
 "zeilen": [
   {"who": "Flughafenansage", "de": "Liebe Passagiere, hier eine wichtige Information zum Flug LH 204 nach Wien. Das Gate hat sich geändert. Der Abflug erfolgt heute von Gate B zwölf statt von Gate B fünf. Der Einstieg beginnt in zwanzig Minuten. Bitte begeben Sie sich nun zum neuen Gate und halten Sie Ihre Bordkarte bereit. Vielen Dank.", "ar": "أعزاءنا المسافرون، إليكم معلومة مهمة عن الرحلة LH 204 إلى فيينا. لقد تغيرت البوابة. تتم المغادرة اليوم من البوابة B اثني عشر بدلًا من البوابة B خمسة. يبدأ الصعود بعد عشرين دقيقة. توجهوا الآن إلى البوابة الجديدة وجهّزوا بطاقات الصعود. شكرًا جزيلًا."}],
 "clips": [{"zeilen": [0], "stimme": "A"}],
 "fragen": [
   frage("hn-05-q1", "Wohin fliegt LH 204?", "إلى أين تطير الرحلة LH 204؟",
     ["Nach Berlin", "Nach Wien", "Nach Hamburg", "Nach Prag"], "Nach Wien",
     "النص: «zum Flug LH 204 nach Wien»."),
   frage("hn-05-q2", "Von welchem Gate erfolgt der Abflug jetzt?", "من أي بوابة تتم المغادرة الآن؟",
     ["Gate B fünf", "Gate A zwölf", "Gate B zwölf", "Gate C fünf"], "Gate B zwölf",
     "النص: «Der Abflug erfolgt heute von Gate B zwölf»."),
   frage("hn-05-q3", "Wann beginnt der Einstieg?", "متى يبدأ الصعود؟",
     ["Sofort", "In zwanzig Minuten", "In einer Stunde", "Nach dem Mittag"], "In zwanzig Minuten",
     "النص: «Der Einstieg beginnt in zwanzig Minuten».")]})

ITEMS.append({
 "id": "hn-06", "format": "werbung", "level": "B1",
 "titelDe": "Radiowerbung: Möbelhaus Sonnenschein", "titelAr": "إعلان إذاعي: متجر الأثاث",
 "zeilen": [
   {"who": "Werbestimme", "de": "Ihr Zuhause verdient mehr! Beim Möbelhaus Sonnenschein erhalten Sie ab sofort bis zu vierzig Prozent Rabatt auf alle Sofas und Schränke. Und das Beste: Wir liefern kostenlos zu Ihnen nach Hause und nehmen Ihre alten Möbel gleich mit. Besuchen Sie uns in der Ringstraße vierzehn oder online. Möbelhaus Sonnenschein – wohnen Sie schöner! Das Angebot gilt nur bis Sonntag.", "ar": "بيتك يستحق المزيد! في متجر أثاث سوننشاين تحصل اعتبارًا من الآن على خصم حتى أربعين بالمئة على جميع الأرائك والخزائن. والأفضل: نوصل مجانًا إلى بيتك ونأخذ أثاثك القديم معنا مباشرة. زرنا في شارع الرينغ أربعة عشر أو عبر الإنترنت. متجر أثاث سوننشاين – عِش أجمل! العرض سارٍ حتى الأحد فقط."}],
 "clips": [{"zeilen": [0], "stimme": "A"}],
 "fragen": [
   frage("hn-06-q1", "Wie hoch ist der Rabatt?", "كم يبلغ الخصم؟",
     ["Zehn Prozent", "Bis zu vierzig Prozent", "Fünfzig Prozent auf alles", "Kein Rabatt"], "Bis zu vierzig Prozent",
     "النص: «bis zu vierzig Prozent Rabatt auf alle Sofas und Schränke»."),
   frage("hn-06-q2", "Was ist kostenlos?", "ما الذي هو مجاني؟",
     ["Die Möbel", "Die Lieferung nach Hause", "Die Beratung am Telefon", "Der Kaffee im Geschäft"], "Die Lieferung nach Hause",
     "النص: «Wir liefern kostenlos zu Ihnen nach Hause»."),
   frage("hn-06-q3", "Bis wann gilt das Angebot?", "حتى متى يسري العرض؟",
     ["Bis Ende des Monats", "Nur bis Sonntag", "Bis Weihnachten", "Immer"], "Nur bis Sonntag",
     "النص: «Das Angebot gilt nur bis Sonntag».")]})

ITEMS.append({
 "id": "hn-07", "format": "interview", "level": "B2",
 "titelDe": "Interview: Eine Ärztin über Vorsorge", "titelAr": "مقابلة: طبيبة عن الوقاية الصحية",
 "zeilen": [
   {"who": "Moderatorin", "de": "Guten Morgen, Frau Doktor Yilmaz. Viele Menschen gehen erst zum Arzt, wenn es weh tut. Warum ist Vorsorge so wichtig?", "ar": "صباح الخير، دكتورة إيلماز. كثير من الناس لا يذهب إلى الطبيب إلا حين يؤلم. لماذا الوقاية مهمة جدًا؟"},
   {"who": "Dr. Yilmaz", "de": "Weil viele Krankheiten lange keine Beschwerden machen. Wer regelmäßig zur Vorsorge geht, erkennt Risiken früh – und kann oft mit kleinen Veränderungen im Alltag viel erreichen, statt später Medikamente zu brauchen. Entscheidend ist, dass die Angebote einfach und ohne lange Wartezeiten erreichbar sind.", "ar": "لأن أمراضًا كثيرة لا تسبب آلامًا لفترة طويلة. ومن يذهب بانتظام إلى الوقاية يكتشف المخاطر مبكرًا – وغالبًا ما يحقق الكثير بتغييرات صغيرة في الحياة اليومية، بدل أن يحتاج أدوية لاحقًا. والحاسم أن تكون العروض بسيطة ومتاحة دون أوقات انتظار طويلة."}],
 "clips": [{"zeilen": [0], "stimme": "A"}, {"zeilen": [1], "stimme": "B"}],
 "fragen": [
   frage("hn-07-q1", "Warum ist Vorsorge laut der Ärztin wichtig?", "لماذا الوقاية مهمة بحسب الطبيبة؟",
     ["Weil Ärzte sonst wenig zu tun haben", "Weil viele Krankheiten lange keine Beschwerden machen", "Weil sie kostenlos ist", "Weil alle es machen"], "Weil viele Krankheiten lange keine Beschwerden machen",
     "تقول: «Weil viele Krankheiten lange keine Beschwerden machen»."),
   frage("hn-07-q2", "Was kann man mit kleinen Veränderungen erreichen?", "ما الذي يمكن تحقيقه بتغييرات صغيرة؟",
     ["Risiken früh erkennen und oft Medikamente vermeiden", "Nie wieder krank werden", "Geld sparen beim Einkaufen", "Länger schlafen"], "Risiken früh erkennen und oft Medikamente vermeiden",
     "تقول: «kann oft mit kleinen Veränderungen im Alltag viel erreichen, statt später Medikamente zu brauchen»."),
   frage("hn-07-q3", "Was ist für die Angebote entscheidend?", "ما الحاسم في عروض الوقاية؟",
     ["Dass sie teuer sind", "Dass sie einfach und ohne lange Wartezeiten erreichbar sind", "Dass sie nur für Ältere sind", "Dass sie beworben werden"], "Dass sie einfach und ohne lange Wartezeiten erreichbar sind",
     "تقول: «dass die Angebote einfach und ohne lange Wartezeiten erreichbar sind».")]})

ITEMS.append({
 "id": "hn-08", "format": "interview", "level": "B1",
 "titelDe": "Interview: Nach dem Marathon", "titelAr": "مقابلة: بعد الماراثون",
 "zeilen": [
   {"who": "Moderator", "de": "Herzlichen Glückwunsch, Frau Costa! Sie haben heute Ihren ersten Marathon geschafft. Wie fühlen Sie sich jetzt?", "ar": "تهانينا، سيدة كوستا! لقد أنجزتِ اليوم أول ماراثون لك. كيف تشعرين الآن؟"},
   {"who": "Frau Costa", "de": "Ehrlich gesagt: total müde, aber überglücklich. Die letzten fünf Kilometer waren hart. Aber die Zuschauer an der Strecke haben uns Läufer so toll angefeuert, dass Aufgeben keine Option war. Nächstes Jahr bin ich auf jeden Fall wieder dabei!", "ar": "بصراحة: متعبة تمامًا، لكن سعيدة للغاية. الكيلومترات الخمسة الأخيرة كانت صعبة. لكن الجمهور على طول الطريق شجّعنا نحن العدّائين بشكل رائع، حتى إن الاستسلام لم يكن خيارًا. والسنة القادمة سأشارك بالتأكيد مجددًا!"}],
 "clips": [{"zeilen": [0], "stimme": "B"}, {"zeilen": [1], "stimme": "A"}],
 "fragen": [
   frage("hn-08-q1", "Was hat Frau Costa heute geschafft?", "ما الذي أنجزته السيدة كوستا اليوم؟",
     ["Einen Schwimmwettkampf", "Ihren ersten Marathon", "Ein Fußballspiel", "Eine Prüfung"], "Ihren ersten Marathon",
     "يقول المقدم: «Sie haben heute Ihren ersten Marathon geschafft»."),
   frage("hn-08-q2", "Warum war Aufgeben keine Option?", "لماذا لم يكن الاستسلام خيارًا؟",
     ["Wegen des Preisgeldes", "Die Zuschauer feuerten die Läufer so toll an", "Wegen des Wetters", "Wegen ihres Trainers"], "Die Zuschauer feuerten die Läufer so toll an",
     "تقول: «die Zuschauer an der Strecke haben uns Läufer so toll angefeuert, dass Aufgeben keine Option war»."),
   frage("hn-08-q3", "Was plant Frau Costa?", "ما الذي تخطط له السيدة كوستا؟",
     ["Mit dem Sport aufhören", "Nächstes Jahr wieder teilnehmen", "Trainerin werden", "Einen kürzeren Lauf machen"], "Nächstes Jahr wieder teilnehmen",
     "تقول: «Nächstes Jahr bin ich auf jeden Fall wieder dabei!»")]})

ids = [i["id"] for i in ITEMS]
assert len(ids) == len(set(ids)) == 8
for it in ITEMS:
    assert len(it["fragen"]) == 3
    for f in it["fragen"]:
        assert f["answer"] in f["options"] and len(set(f["options"])) == 4
    for z in it["zeilen"]:
        assert z["de"] and z["ar"]
    for c in it["clips"]:
        assert c["stimme"] in ("A", "B") and c["zeilen"]

json.dump({"items": ITEMS}, open("content/hoerneu.json", "w"), ensure_ascii=False, indent=2)
zeichen = sum(len(IT["zeilen"][z]["de"]) for IT in ITEMS for c in IT["clips"] for z in c["zeilen"])
print("OK 8 Items, 10 Clips, Clip-Zeichen:", zeichen)
