# -*- coding: utf-8 -*-
"""R153: نسخ طويلة (lang) لآخر ستة نصوص A2 لاحقة (t-a2-27..t-a2-032) — توسعة أمينة لوقائع
قصصها القصيرة (حوار 28 يُروى نثراً)، ضمن نطاق العرض الأضيق 151–192 كلمة (تقاطع K70b مع
audit_inhalt، درس R152)، 4 أسئلة (mc/mc/truefalse/mc)، اقتباسات الشروح حرفية من النصّ
الطويل. يُنشئ content/lang/a2-27-32.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "a2-27-32.json")
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

E["t-a2-27"] = collections.OrderedDict([
  ("de", "Ich suche seit zwei Monaten eine kleine Wohnung in der Stadt. Sie muss nicht groß sein, aber hell und ruhig. Ein Balkon wäre schön, und die Kaltmiete sollte nicht über sechshundert Euro liegen. Ich habe schon viele Anzeigen gelesen und mehrere Wohnungen besichtigt. Viele waren zu teuer oder zu dunkel, und manche hatten kein Fenster im Bad.\n\nGestern habe ich eine schöne Zwei-Zimmer-Wohnung gesehen. Sie liegt in einem Altbau, hat fünfzig Quadratmeter, einen Balkon und eine Einbauküche. Die Kaltmiete beträgt fünfhundertachtzig Euro. Bei der Besichtigung hat mir besonders das helle Wohnzimmer gefallen. Im Bad gibt es ein Fenster, und vom Balkon sieht man auf einen ruhigen Innenhof.\n\nDie Vermieterin war freundlich und hat mir die Nebenkosten erklärt. Ich habe meine Unterlagen vorbereitet und ihr eine Nachricht geschickt. Sie möchte mir nächste Woche Bescheid geben. Bis dahin suche ich weiter, denn ich möchte sicher sein. Wenn ich eine Zusage bekomme, kann ich nächsten Monat umziehen. Dann beginnt ein neues Kapitel für mich in dieser Stadt."),
  ("ar", "بحث عن شقة منذ شهرين (صغيرة مشرقة هادئة، إيجار بارد ≤600 يورو)، وبعد إعلانات ومعاينات كثيرة وجد أمس شقة غرفتين في مبنى قديم: 50م² وشرفة ومطبخ مدمج بـ580 يورو، وغرفة معيشة مشرقة وحمّام بنافذة وشرفة على فناء داخلي هادئ. المالكة ودودة وشرحت التكاليف الإضافية؛ أرسل أوراقه وينتظر ردها الأسبوع القادم ويواصل البحث احتياطاً، فإن قُبل انتقل الشهر القادم."),
  ("questions", [
    Q("t-a2-27", 1, "mc", "Seit wann sucht er eine Wohnung?",
      "seit zwei Monaten", "الدليل في النص: «Ich suche seit zwei Monaten eine kleine Wohnung».",
      ["seit zwei Monaten", "seit zwei Wochen", "seit einem Jahr"]),
    Q("t-a2-27", 2, "mc", "Wie hoch ist die Kaltmiete der Wohnung?",
      "fünfhundertachtzig Euro", "الدليل في النص: «Die Kaltmiete beträgt fünfhundertachtzig Euro».",
      ["fünfhundertachtzig Euro", "sechshundert Euro", "fünfhundert Euro"]),
    Q("t-a2-27", 3, "truefalse", "Die Wohnung hat einen Balkon mit Blick auf einen Innenhof.",
      "richtig", "الدليل في النص: «vom Balkon sieht man auf einen ruhigen Innenhof».",
      ["richtig", "falsch"]),
    Q("t-a2-27", 4, "mc", "Wann möchte die Vermieterin Bescheid geben?",
      "nächste Woche", "الدليل في النص: «Sie möchte mir nächste Woche Bescheid geben».",
      ["nächste Woche", "morgen", "nächsten Monat"]),
  ]),
])

E["t-a2-28"] = collections.OrderedDict([
  ("de", "Nadia Saleh hat sich gestern bei einer Krankenkasse angemeldet. Heute ruft sie dort an, weil sie ihre Versicherungsnummer noch nicht bekommen hat. Eine freundliche Mitarbeiterin erklärt ihr alles am Telefon. Sie wartet nur kurz in der Leitung und hört leise Musik.\n\nDie Nummer wird per Post geschickt, sobald die Anmeldung bearbeitet ist. Das kann einige Tage dauern. Nadia fragt, ob sie in der Zwischenzeit trotzdem zum Arzt gehen kann. Die Mitarbeiterin sagt: Wenn die Versicherung schon aktiv ist, rechnet die Praxis direkt mit der Krankenkasse ab. Sie kann eine Mitgliedsbescheinigung anfordern und beim Arzt vorzeigen. Das ist eine gute Nachricht für Nadia. Sie bedankt sich für die klare Erklärung und fragt noch nach der Versichertenkarte.\n\nAuch die Versichertenkarte kommt später per Post. Die Mitarbeiterin bittet sie, ihre Adresse zu prüfen. Nadia schreibt alle Informationen in ihr Notizbuch, damit sie nichts vergisst. Jetzt kennt sie alle Schritte und fühlt sich gut informiert. Am Ende bedankt sie sich und legt auf. Sie ist jetzt beruhigt."),
  ("ar", "نادية صالح سجّلت أمس في شركة تأمين صحي وتتصل اليوم لأن رقم تأمينها لم يصل: الموظفة تشرح أن الرقم (والبطاقة لاحقاً) يأتيان بالبريد بعد معالجة التسجيل وقد يستغرق ذلك أياماً. في هذه الأثناء يمكنها زيارة الطبيب إن كان تأمينها فعّالاً — العيادة تحاسب الشركة مباشرة — وتطلب شهادة عضوية لتقديمها. تدوّن كل شيء في دفترها وتطمئن بعد التحقق من عنوانها."),
  ("questions", [
    Q("t-a2-28", 1, "mc", "Warum ruft Nadia bei der Krankenkasse an?",
      "Sie hat ihre Versicherungsnummer noch nicht", "الدليل في النص: «weil sie ihre Versicherungsnummer noch nicht bekommen hat».",
      ["Sie hat ihre Versicherungsnummer noch nicht", "Sie ist krank", "Sie sucht einen Arzt"]),
    Q("t-a2-28", 2, "mc", "Wie erhält sie die Nummer?",
      "per Post nach der Bearbeitung", "الدليل في النص: «Die Nummer wird per Post geschickt, sobald die Anmeldung bearbeitet ist».",
      ["per Post nach der Bearbeitung", "sofort per E-Mail", "am Telefon"]),
    Q("t-a2-28", 3, "truefalse", "Nadia muss die Arztrechnung auf jeden Fall selbst bezahlen.",
      "falsch", "الدليل في النص: «rechnet die Praxis direkt mit der Krankenkasse ab» إن كان التأمين فعّالاً.",
      ["richtig", "falsch"]),
    Q("t-a2-28", 4, "mc", "Was schreibt Nadia in ihr Notizbuch?",
      "alle Informationen", "الدليل في النص: «Nadia schreibt alle Informationen in ihr Notizbuch».",
      ["alle Informationen", "die Telefonnummer", "ihre Adresse"]),
  ]),
])

E["t-a2-29"] = collections.OrderedDict([
  ("de", "Nächste Woche beginnt ein neuer Deutschkurs an der Volkshochschule. Der Kurs ist dreimal pro Woche: montags, mittwochs und freitags von achtzehn bis zwanzig Uhr. Viele von uns lernen nach der Arbeit, deshalb ist der Abendkurs sehr praktisch. Der Kursraum ist hell und hat große Fenster mit Blick auf einen kleinen Garten.\n\nDer Lehrer heißt Herr Neumann. Er ist freundlich und erklärt die Grammatik mit einfachen Beispielen. Im Kurs sprechen wir viel miteinander. Wir üben kurze Gespräche, hören Dialoge und schreiben kleine Texte. Am Ende der Woche wiederholen wir gemeinsam den Wortschatz. In der Pause trinke ich Tee mit zwei anderen Teilnehmenden, und wir helfen einander bei den Hausaufgaben. Manchmal arbeiten wir in kleinen Gruppen und stellen uns gegenseitig Fragen.\n\nIch freue mich auf den Kurs, weil ich für die A2-Prüfung üben möchte. Das Zertifikat brauche ich für meinen Job. Heute habe ich das Lehrbuch gekauft und mein Heft vorbereitet. So kann ich gut mitarbeiten. Am ersten Tag möchte ich pünktlich sein und möglichst viel verstehen. Nach dem Kurs fahre ich mit dem Bus nach Hause."),
  ("ar", "دورة ألمانية جديدة في الجامعة الشعبية ثلاث مرات أسبوعياً (اثنين وأربعاء وجمعة 18–20) — مسائية عملية لمن يعملون. المعلم السيد نويمان ودود ويشرح القواعد بأمثلة بسيطة؛ في الدرس حديث كثير وحوارات مسموعة ونصوص قصيرة ومراجعة مفردات جماعية آخر الأسبوع، واستراحة شاي ومساعدة متبادلة في الواجب. تستعد صاحبة النص لامتحان A2 لأنها تحتاج الشهادة لعملها، اشترت الكتاب وجهزت الدفتر."),
  ("questions", [
    Q("t-a2-29", 1, "mc", "Wann ist der Deutschkurs?",
      "montags, mittwochs und freitags abends", "الدليل في النص: «montags, mittwochs und freitags von achtzehn bis zwanzig Uhr».",
      ["montags, mittwochs und freitags abends", "jeden Tag am Morgen", "nur am Wochenende"]),
    Q("t-a2-29", 2, "mc", "Wie erklärt Herr Neumann die Grammatik?",
      "mit einfachen Beispielen", "الدليل في النص: «erklärt die Grammatik mit einfachen Beispielen».",
      ["mit einfachen Beispielen", "mit langen Texten", "nur auf Deutsch ohne Beispiele"]),
    Q("t-a2-29", 3, "truefalse", "Der Kurs findet dreimal pro Woche statt.",
      "richtig", "الدليل في النص: «Der Kurs ist dreimal pro Woche».",
      ["richtig", "falsch"]),
    Q("t-a2-29", 4, "mc", "Warum braucht sie das A2-Zertifikat?",
      "für ihren Job", "الدليل في النص: «Das Zertifikat brauche ich für meinen Job».",
      ["für ihren Job", "für eine Reise", "für die Wohnungssuche"]),
  ]),
])

E["t-a2-30"] = collections.OrderedDict([
  ("de", "Mein Lieblingsgericht ist Couscous mit Gemüse und Lamm. Meine Mutter kocht es jeden Freitag in Tunesien für die ganze Familie. Für das Gericht braucht man Couscous, Karotten, Zucchini, Kichererbsen, Tomaten, Zwiebeln, Knoblauch und Gewürze wie Kreuzkümmel und Paprika. Der Duft aus der Küche füllt am Freitag das ganze Haus.\n\nMeine Mutter bereitet zuerst das Gemüse vor. Sie schält die Karotten und schneidet die Zucchini in Stücke. Die Zwiebeln werden klein geschnitten und mit etwas Öl angebraten. Danach kommen das Lamm, Wasser und die Gewürze in den Topf. Alles kocht langsam, bis das Fleisch weich ist. Der Couscous wird in einem Siebeinsatz über dem Dampf gegart, und die Kichererbsen kochen mit.\n\nAm Schluss legt man den Couscous auf einen großen Teller und gibt Fleisch und Gemüse darüber. Dazu steht scharfe Harissa extra auf dem Tisch, damit jeder selbst entscheiden kann, wie scharf sein Essen sein soll. Am Freitag isst die ganze Familie gemeinsam und genießt das Essen. Niemand isst allein, und alle bleiben lange am Tisch sitzen und erzählen."),
  ("ar", "طبقه المفضل كسكس بالخضار ولحم الضأن تطبخه أمه كل جمعة في تونس للعائلة: مكوّنات (جزر وكوسا وحمص وطماطم وبصل وثوم وكمون وفلفل). تحضّر الخضار وتقلي البصل بالزيت ثم اللحم والماء والتوابل على نار هادئة حتى يطرى، ويُبخَّر الكسكس فوق القدر مع الحمص. أخيراً يُقدَّم على طبق كبير باللحم والخضار فوقه، والهريسة الحارة على الطاولة جانباً ليقرر كلٌّ حدّته — والجمعة مائدة عائلية جامعة."),
  ("questions", [
    Q("t-a2-30", 1, "mc", "Wann kocht die Mutter das Gericht?",
      "jeden Freitag", "الدليل في النص: «Meine Mutter kocht es jeden Freitag».",
      ["jeden Freitag", "jeden Sonntag", "jeden Tag"]),
    Q("t-a2-30", 2, "mc", "Wie wird der Couscous gegart?",
      "in einem Siebeinsatz über dem Dampf", "الدليل في النص: «wird in einem Siebeinsatz über dem Dampf gegart».",
      ["in einem Siebeinsatz über dem Dampf", "in viel Wasser", "im Ofen"]),
    Q("t-a2-30", 3, "truefalse", "Die Harissa wird direkt in den Topf gegeben.",
      "falsch", "الدليل في النص: «steht scharfe Harissa extra auf dem Tisch» — على الطاولة جانباً لا في القدر.",
      ["richtig", "falsch"]),
    Q("t-a2-30", 4, "mc", "Welche Gewürze nennt der Text?",
      "Kreuzkümmel und Paprika", "الدليل في النص: «Gewürze wie Kreuzkümmel und Paprika».",
      ["Kreuzkümmel und Paprika", "Salz und Zucker", "Zimt und Honig"]),
  ]),
])

E["t-a2-031"] = collections.OrderedDict([
  ("de", "Letzten Monat ist Sara von München nach Leipzig gezogen. Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch, deshalb suchte sie eine Wohnung im Osten. In Leipzig fand sie eine schöne Altbauwohnung mit drei Zimmern und Balkon für sechshundertfünfzig Euro warm.\n\nIhre neue Wohnung liegt in einem ruhigen Viertel, und vom Balkon sieht sie einen kleinen Park. Am ersten Tag hat sie die Kartons ausgepackt und die Küche eingerichtet. Eine freundliche Nachbarin hat ihr geholfen, die Möbel ins Haus zu tragen. Bei der Arbeit hat Sara neue Aufgaben bekommen und nette Kollegen kennengelernt. Die Kollegen helfen ihr gern, wenn sie Fragen zu den neuen Aufgaben hat.\n\nAm Anfang vermisste sie ihre Freunde in München. Jetzt gefällt ihr Leipzig gut: Die Stadt ist grün, die Menschen sind freundlich und die Mieten sind bezahlbar. Sie vermisst ihre Familie noch, telefoniert aber am Wochenende oft mit ihrer Schwester. Am Samstag erkundet sie die Stadt mit dem Fahrrad, probiert neue Cafés aus und fotografiert die schönen alten Häuser."),
  ("ar", "انتقال Sara الشهر الماضي من ميونخ (إيجاراتها الغالية) إلى لايبزيغ لوظيفة مصممة غرافيك، فسكنت شقة قديمة بثلاث غرف وشرفة بـ650 يورو شاملاً في حي هادئ تطل على حديقة صغيرة. فرّغت الصناديق ورتبت المطبخ وساعدتها جارة في الأثاث، وفي العمل مهام جديدة وزملاء لطفاء. اشتاقت أولاً لأصدقائها ثم أحبت مدينتها الخضراء الودودة الرخيصة، وتتصل بأختها نهاية الأسبوع وتستكشف المدينة بالدراجة السبت."),
  ("questions", [
    Q("t-a2-031", 1, "mc", "Warum ist Sara nach Leipzig gezogen?",
      "Sie hat dort eine neue Stelle gefunden", "الدليل في النص: «Sie hatte eine neue Stelle als Grafikdesignerin gefunden».",
      ["Sie hat dort eine neue Stelle gefunden", "Ihre Familie wohnt dort", "Sie studiert dort"]),
    Q("t-a2-031", 2, "mc", "Wie viel kostet ihre Wohnung warm?",
      "sechshundertfünfzig Euro", "الدليل في النص: «für sechshundertfünfzig Euro warm».",
      ["sechshundertfünfzig Euro", "fünfhundertachtzig Euro", "siebenhundert Euro"]),
    Q("t-a2-031", 3, "truefalse", "Eine Nachbarin hat Sara beim Umzug geholfen.",
      "richtig", "الدليل في النص: «Eine freundliche Nachbarin hat ihr geholfen, die Möbel ins Haus zu tragen».",
      ["richtig", "falsch"]),
    Q("t-a2-031", 4, "mc", "Was macht Sara am Samstag in Leipzig?",
      "Sie erkundet die Stadt mit dem Fahrrad", "الدليل في النص: «Am Samstag erkundet sie die Stadt mit dem Fahrrad».",
      ["Sie erkundet die Stadt mit dem Fahrrad", "Sie fährt nach München", "Sie packt Kartons aus"]),
  ]),
])

E["t-a2-032"] = collections.OrderedDict([
  ("de", "Lukas hat seinen Tagesablauf in den letzten Monaten stark verändert. Früher stand er spät auf, trank drei Tassen Kaffee zum Frühstück und aß mittags oft Fast Food. Abends saß er stundenlang vor dem Fernseher und ging viel zu spät ins Bett. Er wollte gesünder leben, aber er wusste lange nicht, wie er anfangen soll.\n\nJetzt steht er um sieben Uhr auf, macht zwanzig Minuten Yoga und frühstückt Müsli mit Obst. Mittags kocht er selbst Gemüse mit Reis und geht dreimal pro Woche laufen. Er schläft vor Mitternacht und fühlt sich viel fitter. Bei der Arbeit ist er konzentrierter als früher.\n\nDie größte Schwierigkeit war, abends keine Schokolade zu essen. Am Anfang fiel es ihm schwer, früher ins Bett zu gehen. Deshalb legt er sein Handy in einen anderen Raum und liest ein Buch. Er plant seine Mahlzeiten und kauft am Samstag frisches Gemüse. Auch seine Kollegen haben die Veränderung bemerkt und gehen in der Mittagspause manchmal mit ihm spazieren. Lukas sagt, kleine Schritte passen besser zu seinem Alltag als ein strenger Plan. Er möchte die neue Routine auch im Winter beibehalten."),
  ("ar", "غيّر لوكاس روتينه جذرياً في أشهر: كان يقوم متأخراً ويشرب ثلاث قهوات صباحاً ويأكل وجبات سريعة ظهراً ويسهر أمام التلفاز؛ فصار يقوم في السابعة ويمارس يوغا 20 دقيقة ويفطر موسلي بالفاكهة ويطبخ ظهراً خضاراً وأرزاً ويجري ثلاث مرات أسبوعياً وينام قبل منتصف الليل — فزاد نشاطه وتركيزه. أصعب شيء ترك شوكولاتة المساء؛ يبعد هاتفه ويقرأ قبل النوم، ويخطط وجباته ويشتري خضاراً طازجة السبت، مقتنعاً أن الخطوات الصغيرة أنسب من خطة صارمة."),
  ("questions", [
    Q("t-a2-032", 1, "mc", "Was macht Lukas jetzt am Morgen?",
      "Er macht Yoga und frühstückt Müsli", "الدليل في النص: «macht zwanzig Minuten Yoga und frühstückt Müsli mit Obst».",
      ["Er macht Yoga und frühstückt Müsli", "Er trinkt drei Tassen Kaffee", "Er sieht fern"]),
    Q("t-a2-032", 2, "mc", "Was war für Lukas am schwierigsten?",
      "abends keine Schokolade zu essen", "الدليل في النص: «Die größte Schwierigkeit war, abends keine Schokolade zu essen».",
      ["abends keine Schokolade zu essen", "früh aufzustehen", "selbst zu kochen"]),
    Q("t-a2-032", 3, "truefalse", "Lukas trinkt zum Frühstück drei Tassen Kaffee.",
      "falsch", "الدليل في النص: «Früher stand er spät auf, trank drei Tassen Kaffee» — كان ذلك قديماً؛ الآن «frühstückt Müsli mit Obst».",
      ["richtig", "falsch"]),
    Q("t-a2-032", 4, "mc", "Warum legt er sein Handy in einen anderen Raum?",
      "Damit er früher ins Bett geht", "الدليل في النص: «Deshalb legt er sein Handy in einen anderen Raum und liest ein Buch» بعد صعوبة النوم المبكر.",
      ["Damit er früher ins Bett geht", "Weil es kaputt ist", "Weil er es nicht braucht"]),
  ]),
])

tf_r = tf_g = 0
for tid, e in E.items():
    de, ar, qs = e["de"], e["ar"], e["questions"]
    n = len(de.split())
    assert 151 <= n <= 192, (tid, n)  # نطاق عرض audit_inhalt الأضيق داخل K70b (درس R152)
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
print(f"R153 lang A2 written: +{neu} (file now {len(vorhanden)} entries)")
