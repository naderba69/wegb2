# -*- coding: utf-8 -*-
"""R151: نسخ طويلة (lang) لآخر خمسة نصوص A1 لاحقة (t-a1-031..035) — توسعة أمينة لقصصها
القصيرة بنفس الوقائع (t-a1-034 حوارٌ سؤال-طريق في القصيرة، يُروى نثراً في الطويلة)،
3 فقرات، ضمن نطاق K70b (A1: ‏90–160 كلمة)، 4 أسئلة (mc/mc/truefalse/mc)، اقتباسات الشروح
حرفية من النصّ الطويل. يُنشئ content/lang/a1-31-35.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "a1-31-35.json")
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

E["t-a1-031"] = collections.OrderedDict([
  ("de", "Ich habe eine kleine Katze. Sie heißt Mimi und ist zwei Jahre alt. Sie ist schwarz-weiß und sehr süß. Jeden Morgen gebe ich ihr Futter und frisches Wasser. Dann geht sie durch die Wohnung und sucht einen warmen Platz.\n\nWenn ich nach Hause komme, wartet Mimi schon vor der Tür. Am Morgen sitzt sie oft am Fenster und sieht die Vögel im Garten. Nach der Arbeit spiele ich zehn Minuten mit ihr. Am Abend spielt sie gern mit einem roten Ball. Dann schläft sie auf dem Sofa neben mir.\n\nAm Wochenende putze ich ihr Körbchen und fülle ihren Napf mit Wasser. Meine Familie mag Mimi auch sehr. Wir lachen oft, wenn sie schnell durch die Wohnung läuft und springt. Für uns ist sie ein liebes Tier und ein echtes Familienmitglied."),
  ("ar", "قطته ميمي (سنتان، سوداء-بيضاء): طعام وماء عذب كل صباح، وتنتظره عند الباب عند عودته. تراقب العصافير من النافذة، يلعب معها عشر دقائق بعد العمل، وتلعب مساءً بكرة حمراء ثم تنام على الأريكة. نهاية الأسبوع ينظّف سلّتها ويملأ وعاءها؛ العائلة كلها تحبها وتضحك وهي تركض وتقفز في الشقة."),
  ("questions", [
    Q("t-a1-031", 1, "mc", "Wie alt ist Mimi?",
      "zwei Jahre", "الدليل في النص: «Sie heißt Mimi und ist zwei Jahre alt».",
      ["zwei Jahre", "drei Jahre", "ein Jahr"]),
    Q("t-a1-031", 2, "mc", "Was macht Mimi am Fenster?",
      "Sie sieht die Vögel im Garten", "الدليل في النص: «sitzt sie oft am Fenster und sieht die Vögel im Garten».",
      ["Sie sieht die Vögel im Garten", "Sie schläft", "Sie wartet vor der Tür"]),
    Q("t-a1-031", 3, "truefalse", "Mimi spielt am Abend gern mit einem roten Ball.",
      "richtig", "الدليل في النص: «Am Abend spielt sie gern mit einem roten Ball».",
      ["richtig", "falsch"]),
    Q("t-a1-031", 4, "mc", "Was macht er am Wochenende für Mimi?",
      "Er putzt ihr Körbchen", "الدليل في النص: «Am Wochenende putze ich ihr Körbchen».",
      ["Er putzt ihr Körbchen", "Er kauft einen Ball", "Er geht mit ihr spazieren"]),
  ]),
])

E["t-a1-032"] = collections.OrderedDict([
  ("de", "Am Wochenende schlafe ich länger als in der Woche. Am Samstag stehe ich um neun Uhr auf. Zuerst frühstücke ich in Ruhe und höre Musik. Dann putze ich die Wohnung und gehe einkaufen. Im Supermarkt kaufe ich Brot, Milch und frisches Obst.\n\nAm Nachmittag treffe ich meine Freunde bei mir zu Hause. Wir spielen Karten, sprechen viel und lachen zusammen. Am Sonntag besuche ich meine Familie. Wir essen zusammen zu Mittag und erzählen von der Woche. Manchmal schaue ich am Abend einen Film auf dem Sofa.\n\nAm Sonntagabend koche ich etwas Leckeres für mich. Danach bereite ich meine Sachen für Montag vor. Ich packe meine Tasche und stelle den Wecker. So beginnt die neue Woche ruhig und ohne Stress."),
  ("ar", "عطلة هادئة منظمة: نوم أطول وقيام السبت في التاسعة، فطور مع موسيقى ثم تنظيف وتسوّق (خبز وحليب وفاكهة). بعد الظهر أصدقاء ولعب ورق وحديث في بيته، والأحد غداء عائلي وربما فيلم مساءً. الأحد ليلاً يطبخ ويجهّز حقيبة الاثنين ويضبط المنبّه فتبدأ الأسبوع بلا توتر."),
  ("questions", [
    Q("t-a1-032", 1, "mc", "Wann steht er am Samstag auf?",
      "um neun Uhr", "الدليل في النص: «Am Samstag stehe ich um neun Uhr auf».",
      ["um neun Uhr", "um sieben Uhr", "um elf Uhr"]),
    Q("t-a1-032", 2, "mc", "Was macht er am Samstag mit seinen Freunden?",
      "Sie spielen Karten bei ihm zu Hause", "الدليل في النص: «Wir spielen Karten» في بيته: «bei mir zu Hause».",
      ["Sie spielen Karten bei ihm zu Hause", "Sie gehen ins Kino", "Sie machen Sport"]),
    Q("t-a1-032", 3, "truefalse", "Am Sonntagabend stellt er den Wecker für Montag.",
      "richtig", "الدليل في النص: «Ich packe meine Tasche und stelle den Wecker».",
      ["richtig", "falsch"]),
    Q("t-a1-032", 4, "mc", "Wen besucht er am Sonntag?",
      "seine Familie", "الدليل في النص: «Am Sonntag besuche ich meine Familie».",
      ["seine Familie", "seine Freunde", "seine Kollegen"]),
  ]),
])

E["t-a1-033"] = collections.OrderedDict([
  ("de", "Zum Frühstück esse ich gern Brot mit Marmelade und trinke Kaffee. Am Morgen habe ich genug Zeit und sitze ruhig am Tisch. Manchmal esse ich auch ein Ei dazu. So beginnt mein Tag gut und ohne Eile.\n\nZum Mittagessen gehe ich in die Kantine an meinem Arbeitsplatz. Dort gibt es oft Fleisch mit Kartoffeln und Gemüse. An einem Tisch am Fenster esse ich mit meinen Kollegen. Wir sprechen über die Arbeit und über das Wochenende. Nach dem Essen gehe ich kurz nach draußen an die frische Luft.\n\nZum Abendessen koche ich zu Hause Nudeln mit Tomatensauce oder Reis mit Gemüse. Am Samstag lade ich manchmal Freunde ein. Dann kochen wir zusammen und essen lange. Ich trinke viel Wasser und manchmal Apfelsaft. Nach dem Abendessen mache ich gern einen Tee."),
  ("ar", "ثلاث وجبات في يومه: فطور هادئ (خبز ومربّى وقهوة وأحياناً بيضة)، وغداء في كافتيريا العمل (لحم وبطاطا وخضار) مع زملاء عند طاولة النافذة ثم مشي قصير في الهواء. العشاء في البيت معكرونة بصلصة الطماطم أو أرز بالخضار؛ والسبت قد يدعو أصدقاء فيطبخون معاً. يشرب ماء كثيراً وأحياناً عصير تفاح، وبعد العشاء شاي."),
  ("questions", [
    Q("t-a1-033", 1, "mc", "Was isst er zum Frühstück?",
      "Brot mit Marmelade", "الدليل في النص: «Zum Frühstück esse ich gern Brot mit Marmelade».",
      ["Brot mit Marmelade", "Brot mit Käse", "Nudeln"]),
    Q("t-a1-033", 2, "mc", "Wo isst er zu Mittag?",
      "in der Kantine", "الدليل في النص: «Zum Mittagessen gehe ich in die Kantine».",
      ["in der Kantine", "zu Hause", "in einem Café"]),
    Q("t-a1-033", 3, "truefalse", "Nach dem Mittagessen bleibt er den ganzen Nachmittag im Büro sitzen.",
      "falsch", "الدليل في النص: «Nach dem Essen gehe ich kurz nach draußen» — يخرج قليلاً للهواء.",
      ["richtig", "falsch"]),
    Q("t-a1-033", 4, "mc", "Was trinkt er nach dem Abendessen gern?",
      "einen Tee", "الدليل في النص: «Nach dem Abendessen mache ich gern einen Tee».",
      ["einen Tee", "einen Kaffee", "Apfelsaft"]),
  ]),
])

E["t-a1-034"] = collections.OrderedDict([
  ("de", "Ein junger Mann ist neu in der Stadt. Er sucht den Bahnhof und fragt eine Frau auf der Straße: „Entschuldigung, wo ist der Bahnhof?“ Die Frau ist freundlich und erklärt ihm den Weg genau. Sie sagt: „Gehen Sie geradeaus bis zur Ampel, dann biegen Sie links ab.“\n\nSie erklärt weiter: Er geht am Park und an einer Bäckerei vorbei. Nach etwa zweihundert Metern sieht er den Bahnhof auf der rechten Seite. Vor dem Bahnhof ist ein kleiner Platz mit mehreren Bänken. Zu Fuß braucht er nur etwa fünf Minuten.\n\nDer Mann fragt noch: „Fährt der Bus auch zum Bahnhof?“ Die Frau antwortet: „Ja, die Buslinie drei fährt direkt dorthin. Die Haltestelle ist neben der Apotheke.“ Der Mann sagt: „Vielen Dank!“ und geht glücklich weiter."),
  ("ar", "شاب جديد في المدينة يسأل امرأة عن المحطة فتشرح له الطريق: مستقيماً حتى الإشارة ثم يساراً، مروراً بالحديقة والمخبز، وبعد مئتي متر المحطة على اليمين أمامها ساحة صغيرة بالمقاعد — خمس دقائق مشياً. وبديلاً: خط الحافلات ثلاثة يذهب مباشرة، ومحطّته بجانب الصيدلية. يشكرها ويمضي سعيداً."),
  ("questions", [
    Q("t-a1-034", 1, "mc", "Was sucht der junge Mann?",
      "den Bahnhof", "الدليل في النص: «Er sucht den Bahnhof».",
      ["den Bahnhof", "den Park", "die Apotheke"]),
    Q("t-a1-034", 2, "mc", "Was macht er an der Ampel?",
      "Er biegt links ab", "الدليل في النص: «dann biegen Sie links ab» في شرح المرأة للطريق.",
      ["Er biegt links ab", "Er biegt rechts ab", "Er wartet auf den Bus"]),
    Q("t-a1-034", 3, "truefalse", "Der Bahnhof ist nach dem Park auf der linken Seite.",
      "falsch", "الدليل في النص: «sieht er den Bahnhof auf der rechten Seite» — على اليمين لا اليسار.",
      ["richtig", "falsch"]),
    Q("t-a1-034", 4, "mc", "Welche Buslinie fährt zum Bahnhof?",
      "die Linie drei", "الدليل في النص: «die Buslinie drei fährt direkt dorthin».",
      ["die Linie drei", "die Linie zwei", "die Linie fünf"]),
  ]),
])

E["t-a1-035"] = collections.OrderedDict([
  ("de", "Heute habe ich Geburtstag und werde dreißig Jahre alt. Ich habe sechs Freunde zu mir eingeladen. Sie kommen am Nachmittag um vier Uhr und bringen Geschenke mit: ein Buch, eine Flasche Wein und eine schöne Karte. Meine Frau hat einen großen Kuchen gebacken.\n\nAuf dem Tisch stehen Teller, Tassen und Saft für alle. Wir essen zusammen Kuchen und trinken Kaffee. Meine Mutter ruft an und gratuliert mir zum Geburtstag. Danach spielen wir ein Spiel und hören Musik. Ein Freund bringt auch Blumen mit. Im Garten machen wir ein Foto zusammen.\n\nAm Abend gehen meine Freunde nach Hause. Ich räume die Tassen weg und bringe die Küche in Ordnung. Ich bin müde, aber sehr zufrieden. Es war ein schöner Tag mit meiner Familie und meinen Freunden."),
  ("ar", "عيد ميلاده الثلاثون: ستة أصدقاء في الرابعة عصراً بهدايا (كتاب وزجاجة نبيذ وبطاقة) وكعكة كبيرة من زوجته. على الطاولة أطباق وأكواب وعصير؛ يأكلون الكعك ويشربون القهوة، وتتصل أمه للتهنئة. ثم لعبة وموسيقى وزهور من صديق وصورة جماعية في الحديقة؛ ومساءً يرتب الأكواب والمطبخ متعباً راضياً."),
  ("questions", [
    Q("t-a1-035", 1, "mc", "Wie alt wird er heute?",
      "dreißig Jahre", "الدليل في النص: «werde dreißig Jahre alt».",
      ["dreißig Jahre", "zwanzig Jahre", "vierzig Jahre"]),
    Q("t-a1-035", 2, "mc", "Was hat seine Frau gemacht?",
      "Sie hat einen Kuchen gebacken", "الدليل في النص: «Meine Frau hat einen großen Kuchen gebacken».",
      ["Sie hat einen Kuchen gebacken", "Sie hat Blumen gekauft", "Sie hat ein Foto gemacht"]),
    Q("t-a1-035", 3, "truefalse", "Seine Mutter kommt am Nachmittag zu Besuch.",
      "falsch", "الدليل في النص: «Meine Mutter ruft an» — اتصلت هاتفياً ولم تأتِ.",
      ["richtig", "falsch"]),
    Q("t-a1-035", 4, "mc", "Was machen sie im Garten?",
      "Sie machen ein Foto", "الدليل في النص: «Im Garten machen wir ein Foto zusammen».",
      ["Sie machen ein Foto", "Sie spielen ein Spiel", "Sie essen Kuchen"]),
  ]),
])

tf_r = tf_g = 0
for tid, e in E.items():
    de, ar, qs = e["de"], e["ar"], e["questions"]
    n = len(de.split())
    assert 90 <= n <= 160, (tid, n)
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
print(f"R151 lang A1 written: +{neu} (file now {len(vorhanden)} entries)")
