# -*- coding: utf-8 -*-
"""R155: نسخ طويلة (lang) لخمسة نصوص B1 لاحقة ثانية (t-b1-26..30) — توسعة أمينة لوقائعها،
ضمن نطاق العرض 169–260 كلمة، نمط B1: 5 أسئلة (3 mc + صواب/خطأ + إكمال). يُنشئ
content/lang/b1-26-30.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b1-26-30.json")
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

E["t-b1-26"] = collections.OrderedDict([
  ("de", "In Deutschland ging Salma zum ersten Mal ins Theater. Ihre Kollegin hatte zwei Karten für ein kleines Festival, bei dem junge Gruppen alte Texte ganz neu zeigen. Salma zog sich elegant an, obwohl die Kollegin gesagt hatte, das sei nicht nötig. Sie war es aus Tunis gewohnt, sich für das Theater schön anzuziehen, und sie wollte diesen Abend besonders genießen.\n\nDas Stück basierte auf einem Roman, den Salma im Kurs gelesen hatte, aber nur bis zum dritten Kapitel. Ein großes Orchester gab es nicht; auf der Bühne stand ein kleines Ensemble: drei Musiker, jeder mit einem anderen Instrument. Zwischen den Szenen las eine Schauspielerin ein Gedicht, und im Hintergrund malte ein Künstler live ein Bild, das am Ende des Abends fertig war. Salma verstand nicht jedes Wort, aber der Eindruck war stark: Literatur, Musik und Kunst in einem einzigen Raum.\n\nAuf dem Heimweg diskutierten die beiden lange. Die Kollegin kritisierte das Ende, das sie zu schnell fand. Salma hatte gerade dieses Ende beeindruckt, weil niemand erklärt hatte, wie die Geschichte weitergeht. „Wie im Film“, sagte die Kollegin. „Nein“, sagte Salma, „im Film sieht man alles. Hier muss man selbst denken.“ Nächste Woche will sie den Roman endlich zu Ende lesen."),
  ("ar", "أول مسرح في ألمانيا: زميلة سلمى دعتها بمقعدين لمهرجان صغير تقدّم فيه فرق شابة نصوصاً قديمة بروح جديدة، فتأنّقت كما اعتادت في تونس رغم أن الأناقة غير لازمة. المسرحية من رواية قرأتها في الدورة حتى الفصل الثالث فقط؛ وبدل أوركسترا كبيرة فرقة صغيرة من ثلاثة موسيقيين، وممثلة تقرأ قصائد بين المشاهد ورسّام يرسم لوحة تكتمل في نهاية الأمسية — أدب وموسيقى وفن في قاعة واحدة وإن لم تفهم كل كلمة. في طريق العودة تناقشتا حول النهاية: الزميلة رأتها سريعة، وسلمى أعجبت بانفتاحها؛ فالسينما تُريك كل شيء أما هنا فعليك أن تفكّر بنفسك. وستكمل الرواية الأسبوع القادم."),
  ("questions", [
    Q("t-b1-26", 1, "mc", "Warum zog sich Salma elegant an?",
      "Sie war es aus Tunis so gewohnt", "الدليل في النص: «Sie war es aus Tunis gewohnt, sich für das Theater schön anzuziehen».",
      ["Sie war es aus Tunis so gewohnt", "Die Kollegin hatte es verlangt", "Es gab eine Kleiderordnung"]),
    Q("t-b1-26", 2, "mc", "Was gab es auf der Bühne statt eines großen Orchesters?",
      "ein kleines Ensemble mit drei Musikern", "الدليل في النص: «auf der Bühne stand ein kleines Ensemble: drei Musiker».",
      ["ein kleines Ensemble mit drei Musikern", "nur eine Schauspielerin", "eine große Band"]),
    Q("t-b1-26", 3, "mc", "Warum beeindruckte Salma das Ende des Stücks?",
      "Weil offen blieb, wie die Geschichte weitergeht", "الدليل في النص: «weil niemand erklärt hatte, wie die Geschichte weitergeht». الزميلة على العكس رأته سريعاً.",
      ["Weil offen blieb, wie die Geschichte weitergeht", "Weil es sehr schnell war", "Weil es wie ein Film war"]),
    Q("t-b1-26", 4, "truefalse", "Salma hatte den Roman vorher schon zu Ende gelesen.",
      "falsch", "الدليل في النص: «den Salma im Kurs gelesen hatte, aber nur bis zum dritten Kapitel».",
      ["richtig", "falsch"]),
    Q("t-b1-26", 5, "fill", "Zwischen den Szenen las eine Schauspielerin ein ___.",
      "Gedicht", "الدليل في النص: «las eine Schauspielerin ein Gedicht».",
      None),
  ]),
])

E["t-b1-27"] = collections.OrderedDict([
  ("de", "Als bei einem Starkregen zum zweiten Mal in drei Jahren der Keller eines Hauses in unserer Straße unter Wasser stand, änderte sich etwas. Die Überschwemmung war klein, aber sie machte aus einer Diskussion eine ernste Frage: Was können wir selbst tun? Ein Nachbar, der früher gegen jede neue Regel protestiert hatte, schlug vor, den Verbrauch der ganzen Straße zu messen.\n\nDas Ergebnis überraschte uns alle. Viele Häuser sind schlecht gedämmt und brauchen im Winter viel Heizenergie. Wir konsumieren auch mehr, als wir brauchen; jede Woche füllte Verpackungsmüll drei große Mülltonnen. Auch beim Wasserverbrauch gab es große Unterschiede zwischen den Häusern. Niemand wollte jemandem etwas vorwerfen. Ein Nachbar fragte: „Kommt die Heizenergie aus Kohle oder Erdgas? Ist das schädlich?“ Dazu hatte die Gruppe keine Daten; sie hatte nur den Verbrauch gemessen.\n\nSeitdem heizen wir sparsamer, kaufen weniger Produkte in Plastikverpackungen und werfen weniger weg. Auf die weltweite Erdölförderung haben wir wenig Einfluss, aber die Landschaft vor dem Dorf können wir schützen: Am Fluss haben wir Bäume gepflanzt. Wir hoffen, dass die Pflanzen den Boden schützen und mehr Regenwasser dort versickert. Ob das die nächste Überschwemmung verhindert, weiß niemand. Aber die Nachbarn, die vorher nur über Politik geredet haben, reden jetzt über Bäume."),
  ("ar", "فيضان صغير ثانٍ خلال ثلاث سنوات لقبو في الشارع حوّل النقاش إلى سؤال جدي: ما الذي بوسعنا فعله؟ فاقترح جار كان يعترض على كل قاعدة جديدة قياس استهلاك الشارع كاملاً. فاجأت النتائج الجميع: بيوت سيئة العزل تلتهم طاقة التدفئة، وثلاثة براميل نفايات تغليف أسبوعياً، وفروق كبيرة في استهلاك الماء — بلا لوم متبادل. سؤال من أين تأتي الطاقة (فحم أم غاز) بقي بلا جواب إذ لم يملكوا إلا بيانات الاستهلاك. منذئذ تدفئة مقتصدة وبلاستيك أقل ورمي أقل؛ وعلى استخراج النفط العالمي لا سلطان لهم، لكنهم زرعوا أشجاراً على النهر تحمي التربة وتمتص المطر، والجيران الذين لم يتحدثوا إلا في السياسة صاروا يتحدثون عن الأشجار."),
  ("questions", [
    Q("t-b1-27", 1, "mc", "Was schlug der Nachbar nach der Überschwemmung vor?",
      "den Verbrauch der ganzen Straße zu messen", "الدليل في النص: «schlug vor, den Verbrauch der ganzen Straße zu messen».",
      ["den Verbrauch der ganzen Straße zu messen", "neue Regeln zu verbieten", "die Straße zu sperren"]),
    Q("t-b1-27", 2, "mc", "Was überraschte die Gruppe beim Ergebnis?",
      "Viele Häuser sind schlecht gedämmt und verbrauchen viel", "الدليل في النص: «Viele Häuser sind schlecht gedämmt und brauchen im Winter viel Heizenergie».",
      ["Viele Häuser sind schlecht gedämmt und verbrauchen viel", "Niemand heizt im Winter", "Alle Häuser verbrauchen gleich viel"]),
    Q("t-b1-27", 3, "mc", "Worauf hat die Gruppe laut Text wenig Einfluss?",
      "auf die weltweite Erdölförderung", "الدليل في النص: «Auf die weltweite Erdölförderung haben wir wenig Einfluss».",
      ["auf die weltweite Erdölförderung", "auf das Wetter im Dorf", "auf die Bäume am Fluss"]),
    Q("t-b1-27", 4, "truefalse", "Die Gruppe hatte genaue Daten darüber, ob die Heizenergie aus Kohle oder Erdgas kommt.",
      "falsch", "الدليل في النص: «Dazu hatte die Gruppe keine Daten; sie hatte nur den Verbrauch gemessen».",
      ["richtig", "falsch"]),
    Q("t-b1-27", 5, "fill", "Am Fluss haben wir ___ gepflanzt, damit der Boden geschützt wird.",
      "Bäume", "الدليل في النص: «Am Fluss haben wir Bäume gepflanzt».",
      None),
  ]),
])

E["t-b1-28"] = collections.OrderedDict([
  ("de", "Herr Nasri hatte online eine Pauschalreise gebucht. Zwei Tage später stornierte er, weil seine Mutter krank wurde. Der Veranstalter verlangte den Gesamtpreis und nannte die Stornierung kostenpflichtig. In der E-Mail stand, bei Pauschalreisen gelte kein Widerrufsrecht. Nasri ärgerte sich: „Ich bin kein Verbrecher; warum soll ich alles zahlen?“ Eine Gebührenordnung oder Berechnung fehlte in der E-Mail; der Veranstalter hatte aber seine Kartendaten.\n\nEin Anwalt mit Schwerpunkt Verbraucherschutz erklärte ihm die Regelung und gab eine unverbindliche Einschätzung. Für die Prüfung wollte er zuerst den Vertrag lesen. Bei einer Pauschalreise gibt es tatsächlich kein Widerrufsrecht, auch nicht bei Online-Buchung. Nasri kann aber vor Reisebeginn stornieren; dann darf der Veranstalter eine angemessene Entschädigung verlangen. Der Vertrag kann dafür eine Pauschale vorsehen. Ihre Höhe hängt davon ab, wie früh man storniert und welche Kosten der Veranstalter spart. Auf Nachfrage muss er die Höhe begründen. Der Anwalt hielt die Forderung von hundert Prozent hier für angreifbar.\n\nVor Gericht kam es nicht. Auf den Brief des Anwalts hin räumte der Veranstalter ein, dass die Klausel unklar war, und zahlte zwei Drittel des Preises zurück. Die Polizei hatte mit dem Vertragsstreit nichts zu tun. Seitdem liest Nasri vor dem Klick auf „verbindlich buchen“ genau den Absatz zur Stornierung. Auch ein Klick kann verbindlich sein."),
  ("ar", "السيد نصري حجز رحلة شاملة إلكترونياً ثم ألغى بعد يومين لمرض والدته فطالبه المنظّم بالثمن كاملاً مستنداً إلى غياب حق العدول في الرحلات الشاملة، بلا جدول رسوم ولا حساب — ومعه بيانات بطاقته. محامي حماية مستهلك شرح له القاعدة: لا حق عدول فعلاً حتى إلكترونياً، لكن الإلغاء قبل السفر ممكن مقابل تعويض معقول قد يُنصّ عليه كمبلغ مقطوع تتحدد قيمته ببكور الإلغاء وما وفّره المنظّم، وعليه تبريره عند الطلب؛ ورأى أن مطالبة المئة بالمئة قابلة للطعن. لم تصل القضية للمحكمة: برسالة المحامي أقرّ المنظّم بغموض الشرط وردّ ثلثي المبلغ. صار نصري يقرأ فقرة الإلغاء قبل نقرة «حجز ملزم» — فالنقرة أيضاً قد تُلزم."),
  ("questions", [
    Q("t-b1-28", 1, "mc", "Warum stornierte Herr Nasri die Reise?",
      "Weil seine Mutter krank wurde", "الدليل في النص: «stornierte er, weil seine Mutter krank wurde».",
      ["Weil seine Mutter krank wurde", "Weil die Reise zu teuer war", "Weil er keine Zeit hatte"]),
    Q("t-b1-28", 2, "mc", "Was hielt der Anwalt für angreifbar?",
      "die Forderung von hundert Prozent des Preises", "الدليل في النص: «hielt die Forderung von hundert Prozent hier für angreifbar».",
      ["die Forderung von hundert Prozent des Preises", "die Online-Buchung selbst", "die Erkrankung der Mutter"]),
    Q("t-b1-28", 3, "mc", "Wie endete der Streit?",
      "Der Veranstalter zahlte nach dem Anwaltsbrief zwei Drittel zurück", "الدليل في النص: «zahlte zwei Drittel des Preises zurück» دون محكمة.",
      ["Der Veranstalter zahlte nach dem Anwaltsbrief zwei Drittel zurück", "Ein Gericht entschied für Nasri", "Nasri zahlte alles"]),
    Q("t-b1-28", 4, "truefalse", "Bei Pauschalreisen gibt es kein Widerrufsrecht, auch nicht bei Online-Buchung.",
      "richtig", "الدليل في النص: «gibt es tatsächlich kein Widerrufsrecht, auch nicht bei Online-Buchung».",
      ["richtig", "falsch"]),
    Q("t-b1-28", 5, "fill", "Der Veranstalter zahlte ___ Drittel des Preises zurück.",
      "zwei", "الدليل في النص: «zahlte zwei Drittel des Preises zurück».",
      None),
  ]),
])

E["t-b1-29"] = collections.OrderedDict([
  ("de", "Mit dreizehn hat meine Tochter angefangen, ihre Zimmertür zu schließen. Nicht laut, nur konsequent. Für mich war das der Beginn der Pubertät, und ich war nicht vorbereitet. In meiner eigenen Erziehung gab es keine geschlossenen Türen; Distanz galt damals als Kälte. Heute weiß ich: Sie ist ein Teil der Beziehung, nicht ihr Ende.\n\nDie ersten Monate waren voller Unsicherheit. Ich warf ihr vor, sie habe Geheimnisse vor mir; sie warf mir vor, ich würde mich viel zu viel um sie kümmern. Beides stimmte ein bisschen. Eine Freundin, die als Beraterin arbeitet, sagte mir einen Satz, den ich mir aufgeschrieben habe: Die Psyche eines Jugendlichen braucht eine Tür, die zu ist, und ein Haus, das offen bleibt.\n\nWir haben dann drei Dinge geändert. Das Taschengeld ist jetzt fest, und meine Tochter entscheidet allein, wofür sie es ausgibt. Die Aufgabenteilung im Haushalt steht auf einem Zettel am Kühlschrank; ich muss mich nicht mehr jeden Abend durchsetzen. Und einmal pro Woche unterhalten wir uns beim Kochen über alles, worüber sie reden will, und über nichts, was sie nicht will. Seitdem ist das Familienleben ruhiger geworden. Die Grenze ist klar, und die Hoffnung, dass die Tür eines Tages von selbst aufgeht, hat sich schon zweimal erfüllt."),
  ("ar", "في الثالثة عشرة بدأت ابنتها تغلق باب غرفتها بهدوء وإصرار — بداية مراهقة لم تكن الأم مستعدة لها، إذ تربّت على أن لا أبواب مغلقة وأن البعد بُرود؛ واليوم تفهم أن المسافة جزء من العلاقة لا نهايتها. أشهر أولى من الشك وتبادل لوم صادق من الطرفين، حتى قالت لها صديقة مستشارة جملة دوّنتها: نفس المراهق تحتاج باباً يغلق وبيتاً يبقى مفتوحاً. غيّروا ثلاثة أشياء: مصروف ثابت تقرر الابنة وحدها إنفاقه، وتقسيم مهام البيت على ورقة على الثلاجة بدل فرض يومي، وحديث أسبوعي أثناء الطبخ عمّا تريد هي فقط. هدأ بيت العائلة، والباب الذي تتمنى أن يفتح من تلقائه فتح مرتين فعلاً."),
  ("questions", [
    Q("t-b1-29", 1, "mc", "Was war für die Mutter der Beginn der Pubertät?",
      "dass ihre Tochter anfing, die Zimmertür zu schließen", "الدليل في النص: «hat meine Tochter angefangen, ihre Zimmertür zu schließen» و«Für mich war das der Beginn der Pubertät».",
      ["dass ihre Tochter anfing, die Zimmertür zu schließen", "dass ihre Tochter schlechte Noten bekam", "dass ihre Tochter einen Freund hatte"]),
    Q("t-b1-29", 2, "mc", "Was sagte die Freundin, die als Beraterin arbeitet?",
      "Ein Jugendlicher braucht eine geschlossene Tür und ein offenes Haus", "الدليل في النص: «braucht eine Tür, die zu ist, und ein Haus, das offen bleibt».",
      ["Ein Jugendlicher braucht eine geschlossene Tür und ein offenes Haus", "Man muss Jugendliche streng kontrollieren", "Türen müssen immer offen bleiben"]),
    Q("t-b1-29", 3, "mc", "Worüber sprechen Mutter und Tochter beim wöchentlichen Kochen?",
      "nur über das, worüber die Tochter reden will", "الدليل في النص: «über alles, worüber sie reden will, und über nichts, was sie nicht will».",
      ["nur über das, worüber die Tochter reden will", "über die Hausaufgaben", "über das Taschengeld"]),
    Q("t-b1-29", 4, "truefalse", "Die Mutter verbietet ihrer Tochter jetzt, die Tür zu schließen.",
      "falsch", "الدليل في النص: الباب المغلق مقبول كحدّ واضح: «Die Grenze ist klar».",
      ["richtig", "falsch"]),
    Q("t-b1-29", 5, "fill", "Die Aufgabenteilung im Haushalt steht auf einem Zettel am ___.",
      "Kühlschrank", "الدليل في النص: «auf einem Zettel am Kühlschrank».",
      None),
  ]),
])

E["t-b1-30"] = collections.OrderedDict([
  ("de", "Meine erste Dienstreise begann mit einem Zettel von der Chefin: Zeitplan, Hotel, Name des Kunden und der Satz „Spesen bitte mit Quittung“. Meine Abwesenheit im Büro dauerte drei Tage; die Vertretung übernahm eine Kollegin, die mich am Abend vorher noch fragte, wo die aktuellen Unterlagen für den Kundendienst liegen.\n\nAm Flughafen konnte ich online einchecken. Das Hotel wollte aber eine Kreditkarte, die ich nicht hatte. Deshalb wollte ich vor der Reise Bargeld abheben. Am Flughafen hob ich etwas Geld ab und bezahlte damit die erste Taxifahrt. Das Hotel rechnete später direkt mit der Firma ab. Nach der Rückkehr konnte ich den übrigen Betrag auf mein Konto einzahlen. Der Kunde selbst war freundlich: Meine Präsentation dauerte zwanzig Minuten, die Diskussion über die Umsetzung dauerte zwei Stunden. Am Ende wollte er einen Rabatt, den ich nicht versprechen durfte. Ich habe gesagt, ich melde mich, und das war genau richtig.\n\nZurück im Büro lernte ich den unangenehmsten Teil kennen: die Bearbeitung der Spesen. Ich musste jede Quittung einzeln abgeben und für jede Taxifahrt den Grund angeben. Die Dienstleistung, die wir verkaufen, ist kompliziert; kompliziert sind auch die Regeln für ein Mittagessen auf Reisen. Meine Chefin lachte und sagte, das gehöre dazu. Beim zweiten Mal, versicherte sie, brauche ich für die Spesen nur noch eine halbe Stunde."),
  ("ar", "أول رحلة عمل بدأت بورقة من المديرة (جدول وفندق واسم العميل و«النفقات بالإيصال حصراً») وغياب ثلاثة أيام تتولى فيه زميلة التغطية. تسجيل وصول إلكتروني في المطار، لكن الفندق طلب بطاقة ائتمان لا تملكها فسحبت نقداً ودفعت أول سيارة أجرة (حاسب الفندق الشركة لاحقاً مباشرة وأودعت الباقي عند عودتها). العميل ودود: عرضها عشرون دقيقة ونقاش التنفيذ ساعتان، وطلب خصماً لا تملك وعدَه فقالت سأعاود الاتصال — وكان صواباً. عند العودة الجزء الأبغض: تسوية النفقات، كل إيصال على حدة مع سبب لكل سيارة وقواعد معقدة لغداء السفر؛ ضحكت المديرة: في المرة الثانية لن تحتاجي إلا نصف ساعة."),
  ("questions", [
    Q("t-b1-30", 1, "mc", "Was stand auf dem Zettel von der Chefin?",
      "Zeitplan, Hotel, Kundenname und der Satz zu den Spesen", "الدليل في النص: «Zeitplan, Hotel, Name des Kunden und der Satz „Spesen bitte mit Quittung“».",
      ["Zeitplan, Hotel, Kundenname und der Satz zu den Spesen", "nur die Adresse des Hotels", "eine Liste mit Geschenken"]),
    Q("t-b1-30", 2, "mc", "Warum hob sie am Flughafen Bargeld ab?",
      "Das Hotel wollte eine Kreditkarte, die sie nicht hatte", "الدليل في النص: «Das Hotel wollte aber eine Kreditkarte, die ich nicht hatte».",
      ["Das Hotel wollte eine Kreditkarte, die sie nicht hatte", "Das Taxi war zu teuer", "Sie wollte einkaufen gehen"]),
    Q("t-b1-30", 3, "mc", "Was musste sie bei der Spesenbearbeitung tun?",
      "jede Quittung einzeln abgeben und Gründe angeben", "الدليل في النص: «Ich musste jede Quittung einzeln abgeben und für jede Taxifahrt den Grund angeben».",
      ["jede Quittung einzeln abgeben und Gründe angeben", "alle Belege wegwerfen", "die Chefin alles machen lassen"]),
    Q("t-b1-30", 4, "truefalse", "Die Präsentation dauerte zwanzig Minuten, die Diskussion zwei Stunden.",
      "richtig", "الدليل في النص: «Meine Präsentation dauerte zwanzig Minuten, die Diskussion über die Umsetzung dauerte zwei Stunden».",
      ["richtig", "falsch"]),
    Q("t-b1-30", 5, "fill", "Am Ende wollte der Kunde einen ___, den sie nicht versprechen durfte.",
      "Rabatt", "الدليل في النص: «wollte er einen Rabatt, den ich nicht versprechen durfte».",
      None),
  ]),
])

tf_r = tf_g = 0
for tid, e in E.items():
    de, ar, qs = e["de"], e["ar"], e["questions"]
    n = len(de.split())
    assert 169 <= n <= 260, (tid, n)  # نطاق عرض audit_inhalt لـB1 داخل K70b ‏[150,320]
    assert len(de.split("\n\n")) >= 3 and not AR.search(de) and AR.search(ar), tid
    assert len(qs) == 5, tid
    typen = [q["type"] for q in qs]
    assert typen.count("mc") == 3 and typen.count("truefalse") == 1 and typen.count("fill") == 1, (tid, typen)
    for q in qs:
        assert AR.search(q["explanationAr"]), q["id"]
        if q["type"] == "mc":
            assert q["answer"] in q["options"] and len(set(q["options"])) == len(q["options"]), q["id"]
        if q["type"] == "truefalse":
            if q["answer"] == "richtig": tf_r += 1
            else: tf_g += 1
        if q["type"] == "fill":
            assert re.search(r"\b" + re.escape(q["answer"]) + r"\b", de), (q["id"], q["answer"])
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
print(f"R155 lang B1 written: +{neu} (file now {len(vorhanden)} entries)")
