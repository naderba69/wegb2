# -*- coding: utf-8 -*-
"""R149: نسخ طويلة (lang) لخمسة نصوص A1 لاحقة (t-a1-021..025) — توسيع أمين لقصصها القصيرة
بنفس الوقائع، 3 فقرات، ضمن نطاق K70b (A1: ‏90–160 كلمة)، 4 أسئلة لكل نصّ (mc/mc/truefalse/mc)
واقتباسات الشروح حرفية من النصّ الطويل. يُنشئ content/lang/a1-21-25.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "a1-21-25.json")
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

E["t-a1-021"] = collections.OrderedDict([
  ("de", "Ich heiße Karim und bin achtundzwanzig Jahre alt. Ich wohne mit meiner Frau Amina in Köln. Unsere Tochter Sara ist drei Jahre alt und sehr fröhlich. Am Morgen bringt Amina Sara in den Kindergarten. Dann geht Amina zur Arbeit in eine Schule. Ich arbeite in einem Büro in der Stadtmitte.\n\nMein Vater wohnt in Tunesien. Er ist schon alt, aber er besucht uns jedes Jahr im Sommer. Dann ist unser Haus voll und laut, und wir erzählen viele Geschichten. Am Freitag macht Amina Couscous mit Gemüse und Fleisch. Dazu trinken wir Minztee. Das ist eine Tradition in unserer Familie.\n\nAm Nachmittag spielen wir mit Sara zu Hause oder gehen in den Park. Sara liebt den Spielplatz und lacht viel. Am Sonntag rufe ich meine Mutter in Tunesien an. Wir sprechen lange über die Familie und über das Leben. Ich liebe meine Familie sehr und freue mich auf jeden Besuch."),
  ("ar", "كريم (28) يعيش في كولونيا مع زوجته أمينة وابنتهما سارة (3 سنوات): صباحاً روضة وعمل، وأبوه يزورهم من تونس كل صيف فيمتلئ البيت بالحكايات. الجمعة كسكس وشاي نعناع تقليدياً، والعصر لعب مع سارة في البيت أو الحديقة، والأحد مكالمة طويلة مع أمه في تونس."),
  ("questions", [
    Q("t-a1-021", 1, "mc", "Wohin bringt Amina Sara am Morgen?",
      "in den Kindergarten", "الدليل في النص: «Am Morgen bringt Amina Sara in den Kindergarten». الفخّ: المدرسة مكان عمل أمينة.",
      ["in die Schule", "in den Kindergarten", "in den Park"]),
    Q("t-a1-021", 2, "mc", "Wann besucht der Vater die Familie?",
      "jedes Jahr im Sommer", "الدليل في النص: «er besucht uns jedes Jahr im Sommer».",
      ["jedes Jahr im Sommer", "jeden Freitag", "jeden Sonntag"]),
    Q("t-a1-021", 3, "truefalse", "Am Freitag trinkt die Familie Kaffee zum Couscous.",
      "falsch", "الدليل في النص: «Dazu trinken wir Minztee» — شاي نعناع لا قهوة.",
      ["richtig", "falsch"]),
    Q("t-a1-021", 4, "mc", "Wen ruft Karim am Sonntag an?",
      "seine Mutter", "الدليل في النص: «Am Sonntag rufe ich meine Mutter in Tunesien an».",
      ["seinen Vater", "seine Mutter", "seine Frau"]),
  ]),
])

E["t-a1-022"] = collections.OrderedDict([
  ("de", "Ich stehe jeden Tag um halb sieben auf. Zuerst trinke ich einen Kaffee, dann dusche ich und ziehe mich an. Um acht Uhr frühstücke ich mit meiner Frau. Wir essen Brot mit Käse und ein Ei. Danach räume ich den Tisch ab und packe meine Tasche.\n\nUm halb neun fahre ich mit dem Bus zur Arbeit. Die Haltestelle ist direkt vor unserem Haus, das ist sehr praktisch. Im Büro begrüße ich meine Kollegen und beginne meine Arbeit. Um zwölf Uhr essen wir alle zusammen zu Mittag. Die Pause ist kurz, aber wir lachen viel.\n\nNach der Arbeit gehe ich manchmal noch einkaufen. Um sechs Uhr komme ich nach Hause. Am Abend erzählen meine Frau und ich uns von unserem Tag. Dann lese ich ein Buch oder sehe ein bisschen fern. So ist mein Tag: voll, aber gut."),
  ("ar", "روتين يومي كامل: قيام في السادسة والنصف وقهوة واستحمام، فطور مع الزوجة في الثامنة (خبز وجبن وبيض)، ثم حافلة الثامنة والنصف إلى المكتب وغداء جماعي في الثانية عشرة. بعد العمل تسوّق أحياناً وعودة في السادسة، ومساءً حديث مع الزوجة عن اليوم ثم كتاب أو تلفاز."),
  ("questions", [
    Q("t-a1-022", 1, "mc", "Was macht er zuerst nach dem Aufstehen?",
      "Er trinkt einen Kaffee", "الدليل في النص: «Zuerst trinke ich einen Kaffee». الفخّ: الاستحمام بعد القهوة.",
      ["Er duscht", "Er trinkt einen Kaffee", "Er frühstückt"]),
    Q("t-a1-022", 2, "mc", "Warum ist die Haltestelle praktisch?",
      "Sie ist direkt vor dem Haus", "الدليل في النص: «Die Haltestelle ist direkt vor unserem Haus, das ist sehr praktisch».",
      ["Sie ist direkt vor dem Haus", "Der Bus ist immer leer", "Die Arbeit ist nah"]),
    Q("t-a1-022", 3, "truefalse", "Er fährt um sechs Uhr mit dem Bus zur Arbeit.",
      "falsch", "الدليل في النص: «Um halb neun fahre ich mit dem Bus zur Arbeit» — في السادسة مساءً يعود إلى البيت.",
      ["richtig", "falsch"]),
    Q("t-a1-022", 4, "mc", "Was macht er am Abend mit seiner Frau?",
      "Sie erzählen sich von ihrem Tag", "الدليل في النص: «erzählen meine Frau und ich uns von unserem Tag».",
      ["Sie erzählen sich von ihrem Tag", "Sie gehen einkaufen", "Sie packen die Tasche"]),
  ]),
])

E["t-a1-023"] = collections.OrderedDict([
  ("de", "Meine Wohnung ist nicht groß, aber sehr hell. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon. Im Wohnzimmer stehen ein Sofa, ein Tisch und ein Fernseher. In einem Zimmer schlafen meine Frau und ich. Das zweite Zimmer ist unser Arbeitszimmer mit Büchern und einem Schreibtisch.\n\nAm Morgen kommt viel Licht durch die Fenster. In der Küche koche ich jeden Abend für uns. Dort stehen auch ein kleiner Tisch und vier Stühle. Auf dem Balkon stehen zwei Stühle und viele Blumen. Im Sommer frühstücke ich dort gern in der Sonne.\n\nDie Warmmiete beträgt sechshundert Euro im Monat. Die Wohnung liegt nahe an einer Bushaltestelle, das ist praktisch für die Arbeit. Am Wochenende besuchen uns Freunde, und wir trinken Kaffee im Wohnzimmer. Ich bin sehr zufrieden mit meiner Wohnung."),
  ("ar", "شقة صغيرة مشرقة: غرفتان (نوم وعمل) ومطبخ وحمّام وشرفة بالزهور يفطر عليها صيفاً. يطبخ كل مساء في المطبخ، والأجرة الشاملة ستمئة يورو وقربها من محطة الحافلات عملي. في نهاية الأسبوع يزورهم الأصدقاء لقهوة في غرفة المعيشة، وهو راضٍ جداً عن شقته."),
  ("questions", [
    Q("t-a1-023", 1, "mc", "Was ist das zweite Zimmer?",
      "ein Arbeitszimmer", "الدليل في النص: «Das zweite Zimmer ist unser Arbeitszimmer».",
      ["ein Kinderzimmer", "ein Arbeitszimmer", "ein zweites Bad"]),
    Q("t-a1-023", 2, "mc", "Wo frühstückt er im Sommer gern?",
      "auf dem Balkon", "الدليل في النص: «Im Sommer frühstücke ich dort gern» — dort تعود على الشرفة.",
      ["in der Küche", "im Wohnzimmer", "auf dem Balkon"]),
    Q("t-a1-023", 3, "truefalse", "Die Warmmiete beträgt sechshundert Euro.",
      "richtig", "الدليل في النص: «Die Warmmiete beträgt sechshundert Euro im Monat».",
      ["richtig", "falsch"]),
    Q("t-a1-023", 4, "mc", "Was macht er jeden Abend in der Küche?",
      "Er kocht", "الدليل في النص: «In der Küche koche ich jeden Abend für uns».",
      ["Er kocht", "Er schläft", "Er liest Bücher"]),
  ]),
])

E["t-a1-024"] = collections.OrderedDict([
  ("de", "Ich wohne in Leipzig, einer Stadt im Osten von Deutschland. In der Stadt gibt es viele Parks, Cafés und Geschäfte. Die Straßenbahn fährt direkt vor meiner Haustür, das ist sehr praktisch. In meiner Straße gibt es auch eine Bäckerei und einen kleinen Supermarkt.\n\nAm Morgen kaufe ich in der Bäckerei manchmal frisches Brot. Der Park ist nur zehn Minuten zu Fuß entfernt. Im Sommer sitzen viele Menschen auf den Bänken und Kinder spielen auf dem Gras. Am Wochenende gehe ich gern in die Innenstadt und trinke einen Kaffee mit Freunden.\n\nAm Samstag fahre ich mit Freunden in die Stadtmitte. Wir essen in einem Café und gehen danach in ein Geschäft. Am Abend fahre ich mit der Straßenbahn nach Hause. Die Haltestelle ist gleich neben meinem Haus. Leipzig gefällt mir sehr, ich lebe gern hier."),
  ("ar", "لايبزيغ في شرق ألمانيا: ترام أمام الباب ومخبز وسوبرماركت صغير في الشارع نفسه، وحديقة على عشر دقائق مشياً تمتلئ صيفاً بالناس والأطفال. نهاية الأسبوع قهوة مع الأصدقاء في الوسط، والسبت أكل في مقهى وتسوّق ثم عودة بالترام إلى محطة بجانب بيته — يحب مدينته كثيراً."),
  ("questions", [
    Q("t-a1-024", 1, "mc", "Wo liegt Leipzig?",
      "im Osten von Deutschland", "الدليل في النص: «einer Stadt im Osten von Deutschland».",
      ["im Osten von Deutschland", "im Süden von Deutschland", "im Norden von Deutschland"]),
    Q("t-a1-024", 2, "mc", "Wie weit ist der Park entfernt?",
      "zehn Minuten zu Fuß", "الدليل في النص: «Der Park ist nur zehn Minuten zu Fuß entfernt».",
      ["zehn Minuten zu Fuß", "zehn Minuten mit der Straßenbahn", "eine Stunde zu Fuß"]),
    Q("t-a1-024", 3, "truefalse", "Am Samstag bleibt er den ganzen Tag zu Hause.",
      "falsch", "الدليل في النص: «Am Samstag fahre ich mit Freunden in die Stadtmitte».",
      ["richtig", "falsch"]),
    Q("t-a1-024", 4, "mc", "Was kauft er am Morgen manchmal in der Bäckerei?",
      "frisches Brot", "الدليل في النص: «kaufe ich in der Bäckerei manchmal frisches Brot».",
      ["frisches Brot", "einen Kaffee", "Blumen"]),
  ]),
])

E["t-a1-025"] = collections.OrderedDict([
  ("de", "Heute gehe ich zum Supermarkt. Ich brauche Milch, Brot, Eier, Äpfel und Käse. Der Supermarkt ist groß und hat viele Produkte. Zuerst suche ich die Milch, dann hole ich Brot und Eier. Ich kaufe auch Tomaten und eine Flasche Wasser.\n\nDie Äpfel sind heute im Angebot, sie sind billig. Ich vergleiche die Preise und nehme eine kleine Tüte mit. Im Laden treffe ich meine Nachbarin. Wir sprechen kurz über das Wetter und lachen. Dann gehe ich langsam zur Kasse.\n\nVor mir stehen zwei Personen. Die Verkäuferin sagt freundlich: „Guten Tag.“ Ich bezahle mit Karte und bekomme den Kassenbon. Alles kostet zusammen zwölf Euro. Zu Hause stelle ich die Milch und das Wasser in den Kühlschrank. Das Brot kommt in den Schrank."),
  ("ar", "تسوّق كامل بقائمة (حليب وخبز وبيض وتفاح وجبن) في سوبرماركت كبير: يبدأ بالحليب، ويقارن الأسعار، والتفاح في عرض اليوم. يلتقي جارته ويتحدثان عن الطقس، ثم عند الصندوق يدفع بالبطاقة ويأخذ الإيصال — المجموع اثنا عشر يورو. في البيت: الحليب والماء في الثلاجة والخبز في الخزانة."),
  ("questions", [
    Q("t-a1-025", 1, "mc", "Was sucht er zuerst im Supermarkt?",
      "die Milch", "الدليل في النص: «Zuerst suche ich die Milch». الفخّ: الخبز والبيض بعد الحليب.",
      ["das Brot", "die Milch", "die Äpfel"]),
    Q("t-a1-025", 2, "mc", "Warum sind die Äpfel heute billig?",
      "Sie sind im Angebot", "الدليل في النص: «Die Äpfel sind heute im Angebot, sie sind billig».",
      ["Sie sind im Angebot", "Sie sind alt", "Er vergleicht die Preise"]),
    Q("t-a1-025", 3, "truefalse", "Er bezahlt an der Kasse mit Karte.",
      "richtig", "الدليل في النص: «Ich bezahle mit Karte und bekomme den Kassenbon».",
      ["richtig", "falsch"]),
    Q("t-a1-025", 4, "mc", "Wohin stellt er die Milch zu Hause?",
      "in den Kühlschrank", "الدليل في النص: «stelle ich die Milch und das Wasser in den Kühlschrank». الفخّ: الخبز في الخزانة لا الثلاجة.",
      ["in den Schrank", "in den Kühlschrank", "auf den Tisch"]),
  ]),
])

# فحوص ذاتية على طريقة K70b-f قبل الكتابة
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
print(f"R149 lang A1 written: +{neu} (file now {len(vorhanden)} entries)")
