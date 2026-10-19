# -*- coding: utf-8 -*-
"""R150: نسخ طويلة (lang) لخمسة نصوص A1 لاحقة أُخرى (t-a1-026..030) — توسعة أمينة لقصصها
القصيرة بنفس الوقائع، 3 فقرات، ضمن نطاق K70b (A1: ‏90–160 كلمة)، 4 أسئلة لكل نصّ
(mc/mc/truefalse/mc) واقتباسات الشروح حرفية من النصّ الطويل. يُنشئ content/lang/a1-26-30.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "a1-26-30.json")
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

E["t-a1-026"] = collections.OrderedDict([
  ("de", "Heute ist ein sonniger Tag und das Wetter ist sehr schön. Die Sonne scheint und der Himmel ist blau. Es ist nicht zu kalt und nicht zu heiß. Es sind etwa zwanzig Grad. Ich ziehe ein T-Shirt und eine leichte Jacke an und bleibe lange draußen.\n\nAm Nachmittag gehe ich spazieren und höre Musik. Ich rufe meine Freundin an, und wir treffen uns im Park. Dort sitzen wir auf einer Bank, sprechen und lachen viel. Wir sehen viele Kinder und einen kleinen Hund. Der Hund spielt mit einem Ball. Später kaufen wir ein Eis und essen es langsam.\n\nAm Abend koche ich zu Hause Nudeln und esse auf dem Sofa. Danach sehe ich aus dem Fenster: Der Himmel ist noch blau. Ich öffne das Fenster und höre die Vögel. Sie singen laut und fröhlich. So ein Tag gefällt mir sehr. Ich gehe glücklich ins Bett."),
  ("ar", "يوم مشمس لطيف (نحو عشرين درجة): قميص وجاكيت خفيف ونزهة بعد الظهر. يتصل بصديقته فيلتقيان في الحديقة على مقعد، يضحكان ويشاهدان الأطفال وكلباً صغيراً ثم يشتريان مثلجات. مساءً يطبخ معكرونة في البيت ويفتح النافذة على سماء ما زالت زرقاء وعصافير تغرّد — يوم يسعده جداً."),
  ("questions", [
    Q("t-a1-026", 1, "mc", "Wie ist das Wetter heute?",
      "sonnig und etwa zwanzig Grad", "الدليل في النص: «Es sind etwa zwanzig Grad» والشمس مشرقة.",
      ["sonnig und etwa zwanzig Grad", "kalt und regnerisch", "sehr heiß"]),
    Q("t-a1-026", 2, "mc", "Was machen er und seine Freundin im Park?",
      "Sie sitzen auf einer Bank und sprechen", "الدليل في النص: «Dort sitzen wir auf einer Bank, sprechen und lachen viel».",
      ["Sie spielen Fußball", "Sie sitzen auf einer Bank und sprechen", "Sie kaufen Brot"]),
    Q("t-a1-026", 3, "truefalse", "Am Abend kocht er zu Hause Nudeln.",
      "richtig", "الدليل في النص: «Am Abend koche ich zu Hause Nudeln».",
      ["richtig", "falsch"]),
    Q("t-a1-026", 4, "mc", "Was hört er am Abend am Fenster?",
      "die Vögel", "الدليل في النص: «Ich öffne das Fenster und höre die Vögel».",
      ["die Vögel", "die Kinder", "den Hund"]),
  ]),
])

E["t-a1-027"] = collections.OrderedDict([
  ("de", "Mein Hobby ist Fußball. Jeden Freitagabend spiele ich mit meinen Kollegen. Wir spielen in einer Halle in der Nähe meiner Wohnung. Die Halle ist groß und hat zwei Tore. Wir treffen uns um sieben Uhr und freuen uns auf das Spiel.\n\nVor dem Spiel ziehen wir unsere Sportsachen an und trinken Wasser. Dann spielen wir eine Stunde. Ich bin nicht sehr gut, aber ich spiele gern und laufe viel. Mein Freund Paul ist der Torwart und hält viele Bälle. Manchmal lache ich über meine Fehler.\n\nNach dem Spiel trinken wir zusammen ein Bier und sprechen über die Arbeit. Manchmal sitzen wir noch eine Weile zusammen. Am Samstag bin ich oft müde, aber glücklich. Ich freue mich schon auf das nächste Spiel am Freitag."),
  ("ar", "هوايته كرة القدم: كل جمعة مساءً يلعب مع زملائه ساعة في قاعة كبيرة قرب بيته ذات مرميين، بعد تبديل الملابس الرياضية وشرب الماء. صديقه باول حارس يصدّ كرات كثيرة. بعد اللعب شراب وحديث عن العمل، والسبت تعب سعيد وترقّب للمباراة القادمة."),
  ("questions", [
    Q("t-a1-027", 1, "mc", "Wann spielt er Fußball?",
      "jeden Freitagabend", "الدليل في النص: «Jeden Freitagabend spiele ich mit meinen Kollegen».",
      ["jeden Freitagabend", "jeden Samstagmorgen", "jeden Sonntagabend"]),
    Q("t-a1-027", 2, "mc", "Was ist Pauls Rolle im Spiel?",
      "Er ist der Torwart", "الدليل في النص: «Mein Freund Paul ist der Torwart und hält viele Bälle».",
      ["Er ist der Torwart", "Er ist der Trainer", "Er zählt die Tore"]),
    Q("t-a1-027", 3, "truefalse", "Sie spielen zwei Stunden in der Halle.",
      "falsch", "الدليل في النص: «Dann spielen wir eine Stunde» — ساعة واحدة لا اثنتين.",
      ["richtig", "falsch"]),
    Q("t-a1-027", 4, "mc", "Wie fühlt er sich am Samstag?",
      "oft müde, aber glücklich", "الدليل في النص: «Am Samstag bin ich oft müde, aber glücklich».",
      ["oft müde, aber glücklich", "krank", "traurig"]),
  ]),
])

E["t-a1-028"] = collections.OrderedDict([
  ("de", "Ich arbeite als Ingenieur in einer kleinen Firma in der Stadt. Die Firma macht Maschinen für Autos. Jeden Tag stehe ich um halb sieben auf und fahre mit dem Bus zur Arbeit. Meine Kollegen sind sehr nett, und wir helfen uns oft.\n\nIch beginne um acht Uhr. Zuerst lese ich meine E-Mails. Dann spreche ich mit meinem Chef über den Tag. In der Werkstatt prüfen wir die Maschinen zusammen. Um zwölf Uhr mache ich eine Pause und esse Brot mit Käse. Am Nachmittag arbeite ich mit einem Kollegen an einer Maschine.\n\nManchmal haben wir viel Arbeit, aber mein Beruf gefällt mir sehr. Um fünf Uhr fahre ich nach Hause. Am Wochenende mache ich Sport oder besuche meine Eltern. So sind meine Tage: ruhig und gut."),
  ("ar", "مهندس في شركة صغيرة تصنع آلات للسيارات: يقوم في السادسة والنصف ويبدأ في الثامنة بالبريد ثم اجتماع مع المدير وفحص الآلات في الورشة مع الزملاء. استراحة الظهيرة خبز وجبن، والعودة في الخامسة. أحياناً عمل كثير لكنه يحب مهنته؛ نهاية الأسبوع رياضة أو زيارة الوالدين."),
  ("questions", [
    Q("t-a1-028", 1, "mc", "Was macht die Firma?",
      "Maschinen für Autos", "الدليل في النص: «Die Firma macht Maschinen für Autos».",
      ["Maschinen für Autos", "Autos", "Computer"]),
    Q("t-a1-028", 2, "mc", "Was macht er zuerst bei der Arbeit?",
      "Er liest seine E-Mails", "الدليل في النص: «Zuerst lese ich meine E-Mails». الفخّ: الحديث مع المدير بعد البريد.",
      ["Er spricht mit dem Chef", "Er liest seine E-Mails", "Er prüft die Maschinen"]),
    Q("t-a1-028", 3, "truefalse", "Er beginnt um acht Uhr mit der Arbeit.",
      "richtig", "الدليل في النص: «Ich beginne um acht Uhr».",
      ["richtig", "falsch"]),
    Q("t-a1-028", 4, "mc", "Was isst er in der Pause?",
      "Brot mit Käse", "الدليل في النص: «esse Brot mit Käse».",
      ["Brot mit Käse", "Nudeln", "ein Eis"]),
  ]),
])

E["t-a1-029"] = collections.OrderedDict([
  ("de", "Heute trage ich eine blaue Jeans, ein weißes T-Shirt und schwarze Schuhe. Im Winter ziehe ich eine warme Jacke an, manchmal auch einen Schal und Handschuhe. Im Sommer trage ich kurze Hosen und leichte T-Shirts. Zu Hause trage ich gern eine bequeme Hose und ein altes T-Shirt.\n\nFür die Arbeit brauche ich keine besondere Kleidung. Am Samstag gehe ich mit meiner Freundin in ein Geschäft. Sie sucht ein Kleid für eine Party, und ich brauche neue Socken. Im Geschäft probiere ich eine grüne Jacke an. Sie passt gut und steht mir.\n\nAber die Jacke ist ein bisschen teuer. Ich kaufe sie nicht und lege sie zurück. Meine Freundin kauft ihr Kleid. Am Ende fahren wir mit dem Bus nach Hause und sind zufrieden mit dem Tag."),
  ("ar", "ملابسه بحسب الفصل: اليوم جينز أزرق وقميص أبيض وحذاء أسود؛ شتاءً جاكيت دافئة ووشاح وقفازات، وصيفاً سراويل قصيرة، وفي البيت ملابس مريحة قديمة. السبت تسوّق مع صديقته: هي تبحث عن فستان وهو يحتاج جوارب؛ يجرّب جاكيت خضراء تناسبه لكنها غالية فلا يشتريها، ويعودان بالحافلة راضيين."),
  ("questions", [
    Q("t-a1-029", 1, "mc", "Was trägt er heute?",
      "eine blaue Jeans und ein weißes T-Shirt", "الدليل في النص: «Heute trage ich eine blaue Jeans, ein weißes T-Shirt».",
      ["eine blaue Jeans und ein weißes T-Shirt", "eine grüne Jacke", "kurze Hosen"]),
    Q("t-a1-029", 2, "mc", "Was sucht seine Freundin im Geschäft?",
      "ein Kleid", "الدليل في النص: «Sie sucht ein Kleid für eine Party».",
      ["ein Kleid", "neue Socken", "eine Jacke"]),
    Q("t-a1-029", 3, "truefalse", "Er kauft die grüne Jacke im Geschäft.",
      "falsch", "الدليل في النص: «Ich kaufe sie nicht und lege sie zurück» — أعادها لأنها غالية.",
      ["richtig", "falsch"]),
    Q("t-a1-029", 4, "mc", "Warum kauft er die Jacke nicht?",
      "Sie ist ein bisschen teuer", "الدليل في النص: «die Jacke ist ein bisschen teuer» مع أنها تناسبه: «Sie passt gut».",
      ["Sie passt nicht", "Sie ist ein bisschen teuer", "Sie ist grün"]),
  ]),
])

E["t-a1-030"] = collections.OrderedDict([
  ("de", "Heute bin ich bei der Ärztin. Ich habe seit zwei Tagen Kopfschmerzen und ein bisschen Fieber. Zuerst sitze ich im Wartezimmer und lese eine Zeitschrift. Dort warten noch drei Personen. Nach zwanzig Minuten ruft mich die Ärztin in ihr Zimmer.\n\nDie Ärztin fragt: „Was tut weh?“ Ich antworte: „Mein Kopf tut weh.“ Sie fragt auch: „Haben Sie Husten?“ Ich sage: „Ein wenig, aber mein Hals tut nicht weh.“ Sie untersucht mich und misst meine Temperatur. Dann sagt sie: „Vielleicht ist es eine Erkältung. Trinken Sie viel Wasser und ruhen Sie sich aus.“\n\nSie schreibt ein Rezept für mich. In der Apotheke kaufe ich die Tabletten. Zu Hause trinke ich viel Wasser und gehe früh schlafen. Am nächsten Morgen geht es mir schon besser."),
  ("ar", "عند الطبيبة بعد يومين من الصداع وحمى خفيفة: انتظار عشرين دقيقة في غرفة الانتظار مع ثلاثة أشخاص وقراءة مجلة، ثم أسئلة وفحص وقياس حرارة — التشخيص المرجح نزلة برد. الوصفة: ماء كثير وراحة وأقراص من الصيدلية؛ وفي البيت نوم مبكر فتحسّن في الصباح التالي."),
  ("questions", [
    Q("t-a1-030", 1, "mc", "Seit wann hat er Kopfschmerzen?",
      "seit zwei Tagen", "الدليل في النص: «Ich habe seit zwei Tagen Kopfschmerzen».",
      ["seit zwei Tagen", "seit einer Woche", "seit heute Morgen"]),
    Q("t-a1-030", 2, "mc", "Was macht er im Wartezimmer?",
      "Er liest eine Zeitschrift", "الدليل في النص: «sitze ich im Wartezimmer und lese eine Zeitschrift».",
      ["Er liest eine Zeitschrift", "Er schläft", "Er trinkt Wasser"]),
    Q("t-a1-030", 3, "truefalse", "Die Ärztin schreibt ein Rezept für Tabletten.",
      "richtig", "الدليل في النص: «Sie schreibt ein Rezept für mich» ثم اشترى الأقراص من الصيدلية.",
      ["richtig", "falsch"]),
    Q("t-a1-030", 4, "mc", "Was sagt die Ärztin am Ende?",
      "Er soll viel Wasser trinken und sich ausruhen", "الدليل في النص: «Trinken Sie viel Wasser und ruhen Sie sich aus».",
      ["Er soll viel Wasser trinken und sich ausruhen", "Er soll Sport machen", "Er soll mehr arbeiten"]),
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
print(f"R150 lang A1 written: +{neu} (file now {len(vorhanden)} entries)")
