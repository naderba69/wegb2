# -*- coding: utf-8 -*-
"""R152: نسخ طويلة (lang) لستة نصوص A2 لاحقة (t-a2-21..26) — توسعة أمينة لوقائع قصصها
القصيرة (الحواران 23/25 يُرويان نثراً حفاظاً على الوقائع)، 3 فقرات، ضمن نطاق K70b
(A2: ‏100–200 كلمة)، 4 أسئلة (mc/mc/truefalse/mc)، اقتباسات الشروح حرفية من النصّ الطويل.
يُنشئ content/lang/a2-21-26.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "a2-21-26.json")
AR = re.compile(r"[\u0600-\u06FF]")

def Q(tid, n, typ, promptDe, answer, expl, options=None):
    q = collections.OrderedDict()
    q["id"] = f"{tid}-l{n}"
    q["type"] = typ
    q["promptDe"] = promptDe
    if options is not None:
        q["options"] = options
    q["answer"] = answer
    q["explanationAr"] = expl
    return q

E = {}

E["t-a2-21"] = collections.OrderedDict([
  ("de", "Mein Name ist Lina, und heute habe ich einen Termin bei Dr. Müller. Ich fühle mich seit drei Tagen nicht gut. Ich habe Husten und Schnupfen, und mein Kopf tut weh. Trotzdem bin ich um neun Uhr pünktlich in der Praxis.\n\nAm Empfang muss ich zuerst meine Versichertenkarte zeigen. Dann warte ich im Wartezimmer und lese eine Zeitschrift. Nach fünfzehn Minuten ruft mich die Arzthelferin. Der Arzt misst meine Temperatur und hört meine Lunge ab. Er vermutet eine Grippe. Er schreibt mir ein Rezept und sagt, ich soll viel Tee trinken und zwei Tage im Bett bleiben.\n\nDie Arzthelferin erklärt mir freundlich, in welcher Apotheke ich das Rezept abgeben kann. Dort hole ich später die Tabletten. Dann rufe ich meinen Chef an und sage ihm am Telefon, dass ich krank bin. Danach fahre ich direkt nach Hause, ruhe mich aus und trinke eine Tasse Tee. Wenn es mir morgen nicht besser geht, rufe ich die Praxis noch einmal an."),
  ("ar", "لينا مريضة منذ ثلاثة أيام (سعال وزكام وصداع) عند د. مولر: بطاقة تأمين عند الاستقبال، انتظار 15 دقيقة، ثم قياس حرارة وسماع للرئة — الاشتباه إنفلونزا. الوصفة: شاي كثير ويومان في الفراش. السكرتيرة تدلّها على الصيدلية، وتتصل بمديرها لتعتذر، وفي البيت راحة وشاي، وإن لم تتحسن غداً تعاود الاتصال بالعيادة."),
  ("questions", [
    Q("t-a2-21", 1, "mc", "Seit wann fühlt sich Lina nicht gut?",
      "seit drei Tagen", "الدليل في النص: «Ich fühle mich seit drei Tagen nicht gut».",
      ["seit drei Tagen", "seit einer Woche", "seit heute Morgen"]),
    Q("t-a2-21", 2, "mc", "Was macht der Arzt bei der Untersuchung?",
      "Er misst die Temperatur und hört die Lunge ab", "الدليل في النص: «Der Arzt misst meine Temperatur und hört meine Lunge ab».",
      ["Er misst die Temperatur und hört die Lunge ab", "Er schreibt sofort ein Rezept", "Er ruft den Chef an"]),
    Q("t-a2-21", 3, "truefalse", "Der Arzt vermutet eine Grippe.",
      "richtig", "الدليل في النص: «Er vermutet eine Grippe».",
      ["richtig", "falsch"]),
    Q("t-a2-21", 4, "mc", "Was soll Lina zu Hause machen?",
      "viel Tee trinken und im Bett bleiben", "الدليل في النص: «ich soll viel Tee trinken und zwei Tage im Bett bleiben».",
      ["viel Tee trinken und im Bett bleiben", "sofort wieder arbeiten", "Sport machen"]),
  ]),
])

E["t-a2-22"] = collections.OrderedDict([
  ("de", "Liebe Frau Becker,\n\nich kann heute leider nicht zum Unterricht kommen, weil meine Tochter krank ist. Sie hat Fieber und muss zu Hause bleiben. Der Kinderarzt hat gesagt, dass sie sich ausruhen soll. Deshalb bleibe ich heute bei ihr. Ich mache ihr einen warmen Tee und bleibe an ihrem Bett. Zwischendurch schaue ich auf die Uhr, bald muss sie ihre Medizin nehmen. Sie schläft viel und trinkt Wasser, wenn sie wach ist. Mein Mann ist auf Geschäftsreise und kann leider nicht helfen.\n\nKönnten Sie mir bitte mitteilen, welche Seiten wir heute im Buch lesen und welche Wörter ich lernen soll? Kann ich die Hausaufgaben von einer Mitschülerin bekommen? Meine Freundin Sara kann mir am Abend ein Foto von ihren Notizen schicken. So kann ich den Stoff zu Hause nachholen.\n\nWenn es meiner Tochter morgen besser geht, komme ich wieder in den Kurs. Falls nicht, informiere ich Sie rechtzeitig. Ich erledige die Aufgaben zu Hause, damit ich nicht zu viel verpasse. Vielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nFatima"),
  ("ar", "رسالة فاطمة إلى معلمتها: تغيب اليوم لأن ابنتها محمومة ويجب أن ترتاح بأمر طبيب الأطفال، وزوجها في رحلة عمل فلا مساعد. تطلب معرفة صفحات اليوم وكلماته وأن تصلها الواجبات عبر صديقتها سارة التي سترسل صورة ملاحظاتها مساءً، لتذاكر في البيت ولا يفوتها الكثير؛ وتعد بالحضور غداً إن تحسنت ابنتها أو إخبار المعلمة مسبقاً."),
  ("questions", [
    Q("t-a2-22", 1, "mc", "Warum kann Fatima heute nicht zum Unterricht kommen?",
      "Ihre Tochter ist krank", "الدليل في النص: «weil meine Tochter krank ist».",
      ["Ihre Tochter ist krank", "Sie ist selbst krank", "Ihr Mann ist verreist"]),
    Q("t-a2-22", 2, "mc", "Was soll Sara am Abend machen?",
      "ein Foto von ihren Notizen schicken", "الدليل في النص: «kann mir am Abend ein Foto von ihren Notizen schicken».",
      ["ein Foto von ihren Notizen schicken", "die Tochter besuchen", "den Kinderarzt anrufen"]),
    Q("t-a2-22", 3, "truefalse", "Fatimas Mann bleibt heute bei der Tochter zu Hause.",
      "falsch", "الدليل في النص: «Mein Mann ist auf Geschäftsreise» — مسافر، ولذلك تبقى هي.",
      ["richtig", "falsch"]),
    Q("t-a2-22", 4, "mc", "Was möchte Fatima von der Lehrerin wissen?",
      "welche Seiten und Wörter heute dran sind", "الدليل في النص: «welche Seiten wir heute im Buch lesen und welche Wörter ich lernen soll».",
      ["welche Seiten und Wörter heute dran sind", "wann die Prüfung ist", "ob der Kurs ausfällt"]),
  ]),
])

E["t-a2-23"] = collections.OrderedDict([
  ("de", "Ein Besucher ist neu in der Stadt und sucht den Hauptbahnhof. Er fragt eine Frau: „Entschuldigung, wie komme ich am besten zum Hauptbahnhof?“ Die Frau erklärt ihm den Weg freundlich und genau.\n\nEr geht zuerst geradeaus bis zur Ampel und biegt dort links in die Goethestraße ab. Auf dem Gehweg folgt er der Straße etwa dreihundert Meter. Rechts sieht er zuerst ein kleines Hotel und später eine Bäckerei. Unterwegs schaut er auf die Straßenschilder, genau wie die Frau es ihm gesagt hat. Dann überquert er die nächste große Straße an der Ampel und geht durch die helle Unterführung. Dort zeigen Wegweiser den Weg zum Bahnhof.\n\nAm Ende der Unterführung sieht er den Haupteingang. Davor stehen ein Fahrkartenautomat und ein großer Stadtplan. Der ganze Weg dauert zu Fuß nur ungefähr acht Minuten. Wenn er ein Gleis sucht, kann er die Anzeige in der Halle lesen oder am Informationsschalter fragen. Er ist froh, weil der Weg so einfach war und er noch Zeit für einen Kaffee hat."),
  ("ar", "زائر جديد يسأل عن المحطة الرئيسية فتشرح له امرأة الطريق: مستقيماً حتى الإشارة ثم يساراً في شارع غوته نحو ثلاثمئة متر ماراً بفندق صغير ثم مخبز على اليمين، ثم عبور الشارع الكبير والدخول في نفق مضيء بلوحات إرشاد. عند المخرج المدخل الرئيسي وأمامه آلة تذاكر وخريطة مدينة — ثماني دقائق مشياً، ومن يبحث عن رصيف يقرأ لوحة القاعة أو يسأل مكتب المعلومات."),
  ("questions", [
    Q("t-a2-23", 1, "mc", "In welche Straße biegt er an der Ampel ab?",
      "in die Goethestraße", "الدليل في النص: «biegt dort links in die Goethestraße ab».",
      ["in die Goethestraße", "in die Schillerstraße", "in die Bahnhofstraße"]),
    Q("t-a2-23", 2, "mc", "Was sieht er auf der rechten Seite?",
      "ein Hotel und eine Bäckerei", "الدليل في النص: «Rechts sieht er zuerst ein kleines Hotel und später eine Bäckerei».",
      ["ein Hotel und eine Bäckerei", "eine Apotheke und ein Café", "einen Park und eine Schule"]),
    Q("t-a2-23", 3, "truefalse", "Der Weg zum Bahnhof dauert zu Fuß etwa acht Minuten.",
      "richtig", "الدليل في النص: «Der ganze Weg dauert zu Fuß nur ungefähr acht Minuten».",
      ["richtig", "falsch"]),
    Q("t-a2-23", 4, "mc", "Wo kann er nach seinem Gleis fragen?",
      "am Informationsschalter", "الدليل في النص: «oder am Informationsschalter fragen».",
      ["am Informationsschalter", "an der Kasse", "im Hotel"]),
  ]),
])

E["t-a2-24"] = collections.OrderedDict([
  ("de", "Am Samstag bin ich um neun Uhr aufgestanden. Zuerst habe ich Kaffee getrunken und Zeitung gelesen. Dann habe ich die Wohnung geputzt und bin einkaufen gegangen. Das Wetter war angenehm, deshalb bin ich zu Fuß zum Supermarkt gegangen. Dort habe ich Brot, Obst und Milch gekauft.\n\nNachmittags ist meine Freundin zu mir gekommen. Sie wohnt in derselben Straße, ganz in meiner Nähe. Um drei Uhr sind wir zusammen in ein Café gegangen und haben viel geredet. Wir haben über die Arbeit und unsere Pläne für den Sommer gesprochen und schon ein bisschen geträumt. Wir lachen viel und erzählen uns Geschichten aus der letzten Woche.\n\nAbends habe ich mit meiner Familie zu Hause gegessen. Am Sonntag habe ich lange geschlafen und bin im Park spazieren gegangen. Dort habe ich Musik gehört und eine Runde um den See gemacht. Die Sonne schien, und viele Familien waren draußen im Park. Abends habe ich Deutsch gelernt, weil ich am Montag einen Test hatte. Insgesamt war es ein ruhiges und schönes Wochenende."),
  ("ar", "عطلة هادئة جميلة: السبت قيام في التاسعة وقهوة وصحيفة ثم تنظيف وتسوّق مشياً في جو لطيف (خبز وفاكهة وحليب). بعد الظهر صديقتها من الشارع نفسه، وفي الثالثة مقهى وحديث عن العمل وخطط الصيف. مساءً عشاء عائلي، والأحد نوم طويل ونزهة حول بحيرة الحديقة مع موسيقى، ثم مذاكرة ألمانية استعداداً لاختبار الاثنين وتجهيز الحقيبة."),
  ("questions", [
    Q("t-a2-24", 1, "mc", "Was hat sie am Samstag zuerst gemacht?",
      "Kaffee getrunken und Zeitung gelesen", "الدليل في النص: «Zuerst habe ich Kaffee getrunken und Zeitung gelesen».",
      ["Kaffee getrunken und Zeitung gelesen", "die Wohnung geputzt", "Deutsch gelernt"]),
    Q("t-a2-24", 2, "mc", "Warum ist sie zu Fuß zum Supermarkt gegangen?",
      "Das Wetter war angenehm", "الدليل في النص: «Das Wetter war angenehm, deshalb bin ich zu Fuß zum Supermarkt gegangen».",
      ["Das Wetter war angenehm", "Der Bus war kaputt", "Der Supermarkt ist im Haus"]),
    Q("t-a2-24", 3, "truefalse", "Am Sonntag hat sie mit ihrer Freundin Karten gespielt.",
      "falsch", "الدليل في النص: الأحد «bin im Park spazieren gegangen» ومذاكرة؛ لقاء الصديقة كان السبت.",
      ["richtig", "falsch"]),
    Q("t-a2-24", 4, "mc", "Warum hat sie am Sonntagabend Deutsch gelernt?",
      "Sie hatte am Montag einen Test", "الدليل في النص: «weil ich am Montag einen Test hatte».",
      ["Sie hatte am Montag einen Test", "Sie beginnt einen neuen Kurs", "Sie schreibt eine E-Mail"]),
  ]),
])

E["t-a2-25"] = collections.OrderedDict([
  ("de", "Heute Morgen geht Frau Yilmaz in den Supermarkt. Sie möchte einen Salat für ihre Familie machen und braucht frisches Gemüse für das Abendessen. Im Laden fragt sie eine Verkäuferin: „Wo finde ich bitte die Milch?“ Die Verkäuferin antwortet: „Die Milch ist im Kühlregal ganz hinten links. Der Käse liegt direkt daneben.“ Frau Yilmaz nimmt einen Einkaufskorb und geht langsam durch den Laden.\n\nSie fragt weiter nach dem Brot und den Tomaten. Das Brot ist am Eingang bei der Bäckereiabteilung. Die Tomaten sind heute im Angebot und liegen beim Gemüse. Sie kosten nur ein Euro neunundvierzig pro Kilo. Die Lieferung kam heute Morgen, deshalb sind sie ganz frisch. Frau Yilmaz nimmt ein Kilo und wählt die Tomaten einzeln aus. Gurken und Paprika liegen gleich daneben.\n\nAm Ende geht sie zur Kasse vorne rechts. Dort kann sie bar oder mit Karte bezahlen. Die Verkäuferin wünscht ihr einen schönen Tag, und Frau Yilmaz bedankt sich für die nette Hilfe. Zu Hause wäscht sie das Gemüse und beginnt gleich mit dem Salat."),
  ("ar", "السيدة يلماز في السوبرماركت لتحضير سلطة العشاء العائلية: الحليب (والجبن بجانبه) في ثلاجة آخر اليسار، والخبز عند قسم المخبز عند المدخل. الطماطم في عرض اليوم (يورو و49 سنتاً للكيلو) وصلت صباحاً طازجة فتنتقيها حبة حبة، والخيار والفلفل بجوارها. تدفع عند صندوق آخر اليمين نقداً أو بالبطاقة وتشكر البائعة على مساعدتها."),
  ("questions", [
    Q("t-a2-25", 1, "mc", "Was möchte Frau Yilmaz heute machen?",
      "einen Salat für ihre Familie", "الدليل في النص: «Sie möchte einen Salat für ihre Familie machen».",
      ["einen Salat für ihre Familie", "einen Kuchen backen", "ein Frühstück für Gäste"]),
    Q("t-a2-25", 2, "mc", "Wo ist die Milch im Laden?",
      "im Kühlregal ganz hinten links", "الدليل في النص: «Die Milch ist im Kühlregal ganz hinten links».",
      ["im Kühlregal ganz hinten links", "am Eingang rechts", "neben der Kasse"]),
    Q("t-a2-25", 3, "truefalse", "Die Tomaten sind heute im Angebot.",
      "richtig", "الدليل في النص: «Die Tomaten sind heute im Angebot».",
      ["richtig", "falsch"]),
    Q("t-a2-25", 4, "mc", "Warum sind die Tomaten ganz frisch?",
      "Die Lieferung kam heute Morgen", "الدليل في النص: «Die Lieferung kam heute Morgen, deshalb sind sie ganz frisch».",
      ["Die Lieferung kam heute Morgen", "Sie sind im Angebot", "Sie liegen beim Gemüse"]),
  ]),
])

E["t-a2-26"] = collections.OrderedDict([
  ("de", "Hallo Ahmed,\n\nich feiere am Samstag um neunzehn Uhr meinen Geburtstag bei mir zu Hause. Ich wohne in der Schillerstraße 14 im dritten Stock. Du kannst mit der U-Bahn-Linie drei bis zur Haltestelle Markt fahren. Von dort sind es nur fünf Minuten zu Fuß zu meiner Wohnung. Das Haus ist alt, aber meine Wohnung ist hell und gemütlich.\n\nIch mache Pizza und einen Salat für uns. Es gibt auch Kuchen und Saft. Meine Schwester hilft mir bei der Vorbereitung, und ich stelle genug Stühle ins Wohnzimmer, damit alle bequem sitzen können. Wir möchten zusammen essen, Musik hören und Karten spielen. Bitte komm pünktlich, damit das Essen nicht kalt wird. Du musst nichts mitbringen.\n\nBitte sag mir bis Donnerstag Bescheid, ob du kommen kannst. Wenn du etwas nicht essen kannst, sag mir bitte vorher Bescheid. Die Haustür ist ab halb sieben offen. Ich dekoriere noch das Wohnzimmer mit Ballons und stelle die Musik bereit. Ich freue mich sehr auf dich!\n\nViele Grüße\nLena"),
  ("ar", "دعوة لينا لأحمد إلى عيد ميلادها السبت 19:00 في بيتها (شارع شيلر 14، الطابق الثالث؛ مترو 3 حتى «السوق» ثم خمس دقائق مشياً). تحضّر بيتزا وسلطة وكعكاً وعصيراً وتساعدها أختها وترتّب كراسي كافية؛ البرنامج أكل وموسيقى ولعب ورق. لا حاجة لإحضار شيء، لكن الرد مطلوب حتى الخميس وإعلامها بأي طعام لا يأكله؛ الباب مفتوح من السادسة والنصف."),
  ("questions", [
    Q("t-a2-26", 1, "mc", "Wann feiert Lena ihren Geburtstag?",
      "am Samstag um neunzehn Uhr", "الدليل في النص: «ich feiere am Samstag um neunzehn Uhr meinen Geburtstag».",
      ["am Samstag um neunzehn Uhr", "am Freitag um achtzehn Uhr", "am Sonntag um zwanzig Uhr"]),
    Q("t-a2-26", 2, "mc", "Wie kommt Ahmed zu Lena?",
      "mit der U-Bahn-Linie drei bis Markt", "الدليل في النص: «Du kannst mit der U-Bahn-Linie drei bis zur Haltestelle Markt fahren».",
      ["mit der U-Bahn-Linie drei bis Markt", "mit dem Bus bis Schillerstraße", "zu Fuß vom Hauptbahnhof"]),
    Q("t-a2-26", 3, "truefalse", "Ahmed soll einen Kuchen mitbringen.",
      "falsch", "الدليل في النص: «Du musst nichts mitbringen» والكعك عند لينا أصلاً.",
      ["richtig", "falsch"]),
    Q("t-a2-26", 4, "mc", "Bis wann soll Ahmed Bescheid sagen?",
      "bis Donnerstag", "الدليل في النص: «Bitte sag mir bis Donnerstag Bescheid».",
      ["bis Donnerstag", "bis Samstag", "bis Freitag"]),
  ]),
])

tf_r = tf_g = 0
for tid, e in E.items():
    de, ar, qs = e["de"], e["ar"], e["questions"]
    n = len(de.split())
    assert 151 <= n <= 192, (tid, n)  # نطاق عرض audit_inhalt الأضيق داخل K70b
    assert len(de.split("\n\n")) >= 3 and not AR.search(de) and AR.search(ar), tid
    assert len(qs) == 4, tid
    for q in qs:
        assert AR.search(q["explanationAr"]), q["id"]
        if q["type"] == "mc":
            assert q["answer"] in q["options"] and len(set(q["options"])) == len(q["options"]), q["id"]
        if q["type"] == "truefalse":
            if q["answer"] == "richtig": tf_r += 1
            else: tf_g += 1
        for m in re.finditer(r"«([^»]+)»", q["explanationAr"]):
            for piece in re.split(r"…|\.\.\.", m.group(1)):
                p = piece.strip(" .,;:„“\"")
                assert len(p) < 12 or p in de, (q["id"], p)
print(f"self-checks OK · truefalse richtig/falsch = {tf_r}/{tf_g}")

vorhanden = {}
if os.path.exists(OUT):
    vorhanden = json.load(open(OUT, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
neu = 0
for tid, e in E.items():
    if tid not in vorhanden:
        vorhanden[tid] = e
        neu += 1
json.dump(vorhanden, open(OUT, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"R152 lang A2 written: +{neu} (file now {len(vorhanden)} entries)")
