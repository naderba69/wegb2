# -*- coding: utf-8 -*-
"""R154: نسخ طويلة (lang) لخمسة نصوص B1 لاحقة (t-b1-21..25) — توسعة أمينة لوقائعها، ضمن
نطاق العرض الأضيق 169–260 كلمة (تقاطع K70b مع audit_inhalt)، نمط B1 الراسخ: 5 أسئلة
(3 mc + صواب/خطأ + إكمال إجابته مرساة في النص). يُنشئ content/lang/b1-21-25.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b1-21-25.json")
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

E["t-b1-21"] = collections.OrderedDict([
  ("de", "Als Hanan die Teilzeitstelle bekam, war sie erleichtert und nervös zugleich. Die Branche war neu für sie, und im Vorstellungsgespräch hatte sie ehrlich gesagt, dass ihre Qualifikation aus einem anderen Bereich kommt. Die Chefin hatte geantwortet, ein ungewöhnlicher Werdegang sei kein Nachteil, wenn man lernen will. Trotzdem blieb ein mulmiges Gefühl: Die Probezeit dauert sechs Monate, und in dieser Zeit kann man auch scheitern.\n\nDie Einarbeitung war gut organisiert. Ein Kollege zeigte ihr den Arbeitsplatz, die Programme und die Regeln, die nirgends geschrieben stehen: Wer die Kaffeemaschine leer macht, füllt sie wieder auf. Kleine Dinge, aber genau sie entscheiden, ob man dazugehört. Nach vier Wochen gab es ein erstes Gespräch, auf das sie sich tagelang vorbereitet hatte. Statt Kritik bekam sie eine Zielvereinbarung: drei kleine, erreichbare Ziele bis zum Ende der Probezeit. Über ihre Arbeitszeit konnte sie sogar verhandeln, weil ihre Tochter nachmittags aus der Schule kommt.\n\nAn Karriere oder Beförderung denkt Hanan noch nicht. Wichtiger ist ihr, dass sie sich als Arbeitnehmerin ernst genommen fühlt. Ihr altes Arbeitszeugnis liegt im Schrank; das neue, sagt sie lachend, soll besser werden. Und das Netzwerk, das sie hier langsam aufbaut, ist vielleicht wertvoller als jeder Titel. Nach einem Monat sagt sie: Der Anfang war schwer, aber er war ehrlich."),
  ("ar", "حنان بين الارتياح والتوتر في وظيفة جزئية بقطاع جديد: صرّحت في المقابلة أن مؤهلها من مجال آخر فطمأنتها المديرة أن المسار غير المعتاد ليس عيباً لمن يريد التعلم، لكن فترة التجربة ستة أشهر ويمكن الفشل فيها. الإدماج كان منظماً: زميل أراها مكان العمل والبرامج والقواعد غير المكتوبة (من يفرّغ آلة القهوة يملؤها)، وبعد أربعة أسابيع اتفاق أهداف بثلاث غايات صغيرة بدل النقد، وساعات عمل تفاوضية مراعاة لابنتها. لا تفكر بالترقية بعد؛ الأهم أن تُؤخذ بجدية، وشبكة علاقاتها الجديدة قد تفوق أي لقب."),
  ("questions", [
    Q("t-b1-21", 1, "mc", "Was hatte Hanan im Vorstellungsgespräch ehrlich gesagt?",
      "dass ihre Qualifikation aus einem anderen Bereich kommt", "الدليل في النص: «dass ihre Qualifikation aus einem anderen Bereich kommt». الفخّ: لم تُخفِ ذلك بل صرّحت به.",
      ["dass ihre Qualifikation aus einem anderen Bereich kommt", "dass sie schon Erfahrung in der Branche hat", "dass sie nur wenige Monate bleiben will"]),
    Q("t-b1-21", 2, "mc", "Was bekam Hanan nach vier Wochen statt Kritik?",
      "eine Zielvereinbarung mit drei kleinen Zielen", "الدليل في النص: «Statt Kritik bekam sie eine Zielvereinbarung».",
      ["eine Zielvereinbarung mit drei kleinen Zielen", "eine Abmahnung", "eine Beförderung"]),
    Q("t-b1-21", 3, "mc", "Warum konnte sie über ihre Arbeitszeit verhandeln?",
      "Weil ihre Tochter nachmittags aus der Schule kommt", "الدليل في النص: «weil ihre Tochter nachmittags aus der Schule kommt».",
      ["Weil ihre Tochter nachmittags aus der Schule kommt", "Weil sie die Beste im Team war", "Weil die Stelle nur nachts ist"]),
    Q("t-b1-21", 4, "truefalse", "Die Probezeit dauert sechs Monate.",
      "richtig", "الدليل في النص: «Die Probezeit dauert sechs Monate».",
      ["richtig", "falsch"]),
    Q("t-b1-21", 5, "fill", "Wer die Kaffeemaschine leer macht, ___ sie wieder auf.",
      "füllt", "الدليل في النص: «füllt sie wieder auf» — قاعدة غير مكتوبة في المكتب.",
      None),
  ]),
])

E["t-b1-22"] = collections.OrderedDict([
  ("de", "Als Familie Kaya im Frühjahr einzog, freute sie sich vor allem auf den Balkon. Im Sommer wurde dort jeden Abend gegrillt, mit Freunden, Musik und gutem Essen. Der Nachbar unter ihnen, Herr Brandt, wohnt seit zwanzig Jahren im Haus und hatte noch nie einen Grill über seinem Schlafzimmerfenster. Nach drei Wochen kam der erste Zettel im Hausflur, nach fünf Wochen die erste laute Auseinandersetzung im Treppenhaus.\n\nHerr Brandt warf der Familie vor, keine Rücksicht zu nehmen. Frau Kaya warf ihm vor, er habe nie freundlich gefragt, sondern gleich Zettel geschrieben. Beide hatten recht, und beide wollten nicht einlenken. Die Hausgemeinschaft war gespalten: Die einen sagten, wer Ruhe will, soll aufs Dorf ziehen; die anderen fanden, neue Mieter müssten sich erst einmal anpassen. Es roch nach einem langen Streit.\n\nAm Ende vermittelte die älteste Bewohnerin des Hauses. Sie lud beide in den Gemeinschaftsraum ein und schlug eine einfache Vereinbarung vor: Grillen ja, aber nur freitags und samstags bis zehn Uhr, und die Reinigungspflicht für den Hof übernimmt in diesem Monat Familie Kaya. Herr Brandt akzeptierte, und Frau Kaya musste zugeben, dass die Regel fair war. Ob man so etwas Versöhnung nennen kann, ist offen. Beim Nachbarschaftsfest im September saßen sie jedenfalls am selben Tisch, und niemand sprach mehr davon. Ausziehen will jetzt keiner."),
  ("ar", "نزاع شرفة صيفي: عائلة كايا تشوي كل مساء فوق نافذة غرفة نوم جارها براندت (20 سنة في البناية)، فبدأت الملاحظات الملصقة ثم صارت مواجهة صاخبة بعد خمسة أسابيع. تبادل الطرفان الاتهام (لا مراعاة مقابل لا سؤال ودي أصلاً) وانقسم سكان البيت بين «من يريد الهدوء فليسكن الريف» و«على الجدد التأقلم». وسّطت أكبر السكان سناً فاتفقوا: شواء جمعة وسبت حتى العاشرة وتنظيف الفناء هذا الشهر على العائلة. قُبل الحل واعتُرف بعدالته، وفي عيد الجيران في سبتمبر جلسا على طاولة واحدة وانتهى الموضوع."),
  ("questions", [
    Q("t-b1-22", 1, "mc", "Warum störte der Grill Herrn Brandt besonders?",
      "Der Balkon liegt über seinem Schlafzimmerfenster", "الدليل في النص: «einen Grill über seinem Schlafzimmerfenster».",
      ["Der Balkon liegt über seinem Schlafzimmerfenster", "Er isst kein Fleisch", "Er arbeitet nachts"]),
    Q("t-b1-22", 2, "mc", "Was schlug die älteste Bewohnerin vor?",
      "eine einfache Vereinbarung mit festen Grilltagen", "الدليل في النص: «schlug eine einfache Vereinbarung vor».",
      ["eine einfache Vereinbarung mit festen Grilltagen", "ein Grillverbot für das ganze Haus", "den Auszug der Familie"]),
    Q("t-b1-22", 3, "mc", "Was übernimmt Familie Kaya in diesem Monat?",
      "die Reinigungspflicht für den Hof", "الدليل في النص: «die Reinigungspflicht für den Hof übernimmt in diesem Monat Familie Kaya».",
      ["die Reinigungspflicht für den Hof", "die Kosten für das Fest", "die Reparatur des Treppenhauses"]),
    Q("t-b1-22", 4, "truefalse", "Am Ende zog eine der beiden Familien aus dem Haus aus.",
      "falsch", "الدليل في النص: «Ausziehen will jetzt keiner».",
      ["richtig", "falsch"]),
    Q("t-b1-22", 5, "fill", "Gegrillt werden darf nur freitags und ___, bis zehn Uhr.",
      "samstags", "الدليل في النص: «nur freitags und samstags bis zehn Uhr».",
      None),
  ]),
])

E["t-b1-23"] = collections.OrderedDict([
  ("de", "Am Montagmorgen verbreitete sich in der Stadt eine Nachricht: Das Schwimmbad im Norden solle geschlossen werden. Die Meldung stand in einer Messenger-Gruppe, ohne Namen, ohne Datum, ohne Quelle. Bis zum Mittag hatten Hunderte Menschen die Nachricht weitergeleitet, und am Nachmittag standen die ersten Eltern mit Plakaten vor dem Rathaus. Niemand hatte gefragt, ob die Meldung überhaupt stimmt.\n\nEine junge Journalistin der Lokalzeitung wollte die Meldung nicht einfach übernehmen. Ihre Recherche dauerte zwei Stunden: ein Anruf bei der Stadt, ein Blick in die Sitzungsunterlagen, ein Gespräch mit dem Bademeister. Die Tatsache war viel kleiner als das Gerücht: Das Bad wird im Winter drei Wochen renoviert, mehr nicht. Die Stadt gab am Abend eine Stellungnahme ab, aber da war die Falschmeldung schon schneller gewesen als die Wahrheit.\n\nWer die Nachricht zuerst geschrieben hatte, blieb anonym. Vielleicht war es keine Manipulation, sondern nur ein Missverständnis, das jemand zugespitzt hatte. Die Journalistin schrieb einen Artikel, der beide Seiten zeigte: die Sorge der Eltern und die Antwort der Stadt. Ausgewogene Berichterstattung heißt nicht, dass beide Seiten recht haben. Sie heißt, dass man die Gegenposition ernst nimmt und jede Behauptung prüft, bevor man sie druckt. Seriös ist, wer die Quelle angibt, auch wenn das langsamer ist."),
  ("ar", "إشاعة إغلاق مسبح تنتشر صباح اثنين في مجموعة مراسلة بلا اسم ولا مصدر، فيعيد المئات إرسالها ويتظاهر أهالٍ أمام البلدية قبل التحقق. صحفية شابة ترفض النقل الأعمى وتبحث ساعتين (اتصال بالمدينة ومحاضر جلسات وحديث مع مسؤول المسبح) فتجد الحقيقة أصغر بكثير من الشائعة: ترميم شتوي لثلاثة أسابيع فقط. بقي مصدر الإشاعة مجهولاً — ربما سوء فهم ضخّمه أحدهم لا تلاعب مقصود. درس النص: التوازن ليس أن الطرفين محقّان، بل أخذ الموقف المقابل بجدية وفحص كل ادعاء قبل طبعه، والجدّية في ذكر المصدر ولو أبطأ النشر."),
  ("questions", [
    Q("t-b1-23", 1, "mc", "Was fehlte der ursprünglichen Meldung?",
      "Name, Datum und Quelle", "الدليل في النص: «ohne Namen, ohne Datum, ohne Quelle».",
      ["Name, Datum und Quelle", "Fotos vom Schwimmbad", "die Telefonnummer der Stadt"]),
    Q("t-b1-23", 2, "mc", "Was kam bei der Recherche der Journalistin heraus?",
      "Das Bad wird nur drei Wochen renoviert", "الدليل في النص: «Das Bad wird im Winter drei Wochen renoviert, mehr nicht».",
      ["Das Bad wird nur drei Wochen renoviert", "Das Bad wird wirklich geschlossen", "Das Bad wird verkauft"]),
    Q("t-b1-23", 3, "mc", "Was bedeutet ausgewogene Berichterstattung laut Text?",
      "die Gegenposition ernst nehmen und Behauptungen prüfen", "الدليل في النص: «dass man die Gegenposition ernst nimmt und jede Behauptung prüft». لا أن الطرفين محقّان.",
      ["die Gegenposition ernst nehmen und Behauptungen prüfen", "dass beide Seiten immer recht haben", "möglichst schnell zu veröffentlichen"]),
    Q("t-b1-23", 4, "truefalse", "Die Falschmeldung war schneller als die Wahrheit.",
      "richtig", "الدليل في النص: «da war die Falschmeldung schon schneller gewesen als die Wahrheit» — بيان المدينة جاء مساءً بعد انتشار الكذبة.",
      ["richtig", "falsch"]),
    Q("t-b1-23", 5, "fill", "Das Bad wird im Winter drei Wochen ___, mehr nicht.",
      "renoviert", "الدليل في النص: «drei Wochen renoviert» — ترميم لا إغلاق.",
      None),
  ]),
])

E["t-b1-24"] = collections.OrderedDict([
  ("de", "Karim arbeitet seit vier Jahren im Schichtdienst in einer Bäckerei. Zwei Wochen arbeitet er ab drei Uhr in der Frühschicht, dann zwei Wochen in der Spätschicht und danach wieder früh. Sein Schlafrhythmus war irgendwann so durcheinander, dass er auch an freien Tagen um drei Uhr wach lag. Bei der Vorsorgeuntersuchung sagte der Arzt einen Satz, den Karim nicht vergessen hat: „Ihre Belastbarkeit ist nicht das Problem. Ihre Regeneration ist es.“\n\nKarim wollte zunächst keine Therapie mit Tabletten beginnen, weil er mögliche Nebenwirkungen befürchtete. Eine chronische Erkrankung hatte der Arzt nicht festgestellt; also wollte Karim zuerst seine Lebensweise ändern. Er änderte drei Dinge: Er ging zur Ernährungsberatung, weil er nachts immer süß gegessen hatte. Er begann mit Ausdauer statt Kraft: dreimal pro Woche zwanzig Minuten laufen, langsam und ohne Muskelkater am nächsten Tag. Und er lernte eine Entspannungstechnik, die er im Bett anwendet, wenn der Kopf nicht aufhören will zu arbeiten.\n\nNach drei Monaten ist das Gleichgewicht nicht perfekt, aber besser. Die dritte Erkältung des Winters ist ausgeblieben, und er fühlt sich gesünder. Ob sein Immunsystem dadurch stärker geworden ist, kann er nicht sagen. Das Wichtigste, sagt er, ist Achtsamkeit für kleine Signale: müde Augen, kurze Geduld, Hunger auf Zucker. Wer sie früh bemerkt, kann vorbeugen, statt später zu reparieren."),
  ("ar", "كريم في مناوبات مخبز منذ أربع سنوات حتى اختلّ إيقاع نومه فصار يستيقظ في الثالثة حتى في أيام العطل. في الفحص قال الطبيب جملة لا ينساها: «مشكلتك ليست قدرتك على التحمّل بل على الاستشفاء». رفض البدء بأدوية خوفاً من آثارها الجانبية ولم يجد الطبيب مرضاً مزمناً، فغيّر نمط حياته: استشارة تغذية (كان يأكل الحلو ليلاً)، وجرى عشرين دقيقة ثلاث مرات أسبوعياً ببطء بدل تمارين القوة، وتقنية استرخاء في السرير. بعد ثلاثة أشهر توازن أفضل: غابت نزلة برد الشتاء الثالثة ويشعر بصحة أحسن، والأهم عنده الانتباه الباكر لإشارات صغيرة (عيون متعبة، صبر قصير، اشتهاء السكر) فالوقاية خير من الإصلاح."),
  ("questions", [
    Q("t-b1-24", 1, "mc", "Was sagte der Arzt zu Karim?",
      "Sein Problem sei die Regeneration, nicht die Belastbarkeit", "الدليل في النص: «Ihre Belastbarkeit ist nicht das Problem. Ihre Regeneration ist es».",
      ["Sein Problem sei die Regeneration, nicht die Belastbarkeit", "Er müsse sofort Tabletten nehmen", "Er solle den Job wechseln"]),
    Q("t-b1-24", 2, "mc", "Warum wollte Karim keine Therapie mit Tabletten beginnen?",
      "Er befürchtete mögliche Nebenwirkungen", "الدليل في النص: «weil er mögliche Nebenwirkungen befürchtete».",
      ["Er befürchtete mögliche Nebenwirkungen", "Tabletten waren zu teuer", "Der Arzt hatte es verboten"]),
    Q("t-b1-24", 3, "mc", "Welche drei Dinge änderte Karim?",
      "Ernährung, Ausdauersport und eine Entspannungstechnik", "الدليل في النص: Ernährungsberatung و«mit Ausdauer statt Kraft» و«eine Entspannungstechnik».",
      ["Ernährung, Ausdauersport und eine Entspannungstechnik", "Job, Wohnung und Auto", "Schlafmittel, Kaffee und Sport"]),
    Q("t-b1-24", 4, "truefalse", "Der Arzt hatte bei Karim eine chronische Erkrankung festgestellt.",
      "falsch", "الدليل في النص: «Eine chronische Erkrankung hatte der Arzt nicht festgestellt».",
      ["richtig", "falsch"]),
    Q("t-b1-24", 5, "fill", "Er begann mit ___ statt Kraft: dreimal pro Woche zwanzig Minuten laufen.",
      "Ausdauer", "الدليل في النص: «Er begann mit Ausdauer statt Kraft».",
      None),
  ]),
])

E["t-b1-25"] = collections.OrderedDict([
  ("de", "Die Bürgerinitiative „Mehr Grün“ entstand an einem Küchentisch. Fünf Nachbarn hatten genug vom Verkehrslärm auf der Hauptstraße. Sie sorgten sich auch um die Feinstaubbelastung; auf den Fensterbänken lag oft grauer Staub. Ihr Vorschlag klang einfach: Ein Teil der Straße wird Fußgängerzone, und der alte Parkplatz wird eine Grünfläche mit Bäumen und Bänken.\n\nDer Weg dorthin war länger als gedacht. Zuerst war die Zuständigkeit unklar: Straße oder Grünflächen, zwei verschiedene Ämter. In der Bürgersprechstunde riet der Bürgermeister, eine Beschlussvorlage für den Gemeinderat zu schreiben, mit Zahlen zur Anbindung: Wie kommen die Leute dann zum Supermarkt, und wo parken die Lieferwagen? Die Initiative besuchte drei Sitzungen, sammelte Unterschriften und rechnete die Sanierung des Parkplatzes mit einem Architekten durch. Außerdem fragte sie beim Amt, ob für die Bänke eine Baugenehmigung nötig sei.\n\nIm Herbst stimmte der Gemeinderat über die Vorlage ab: angenommen, aber mit zwei Auflagen. Die Lieferwagen dürfen morgens bis zehn Uhr in die Zone fahren, und eine Genehmigung für die Bänke gibt es nur, wenn ein Weg für Rollstühle frei bleibt. Ob die Lebensqualität wirklich steigt, wird man erst im nächsten Sommer wissen. Dass fünf Leute die Infrastruktur einer ganzen Straße verändern können, wissen die Nachbarn jetzt schon."),
  ("ar", "مبادرة «خضرة أكثر» وُلدت على طاولة مطبخ: خمسة جيران ضاقوا بضجيج الشارع الرئيسي وغبار العوادم على عتبات نوافذهم، فاقترحوا تحويل جزء من الشارع للمشاة والساحة القديمة إلى مساحة خضراء بأشجار ومقاعد. الطريق كان أطول من المتوقع: اختصاص متنازع بين إدارتين، ونصيحة العمدة بكتابة مشروع قرار للمجلس البلدي مدعوماً بأرقام (كيف يصل الناس للسوبرماركت وأين تقف شاحنات التوصيل؟)، وثلاث جلسات وجمع تواقيع وحساب كلفة مع مهندس. في الخريف أقرّ المجلس المشروع بشرطين: دخول الشاحنات حتى العاشرة صباحاً، ولا رخصة للمقاعد إلا ببقاء ممر للكراسي المتحركة. النتيجة تُعرف صيفاً، لكن الدرس حاضر: خمسة أشخاص غيّروا بنية شارع."),
  ("questions", [
    Q("t-b1-25", 1, "mc", "Warum entstand die Bürgerinitiative?",
      "Wegen des Verkehrslärms und der Feinstaubbelastung", "الدليل في النص: «genug vom Verkehrslärm» و«sorgten sich auch um die Feinstaubbelastung».",
      ["Wegen des Verkehrslärms und der Feinstaubbelastung", "Weil der Park zu klein war", "Weil ein Supermarkt fehlte"]),
    Q("t-b1-25", 2, "mc", "Was riet der Bürgermeister der Initiative?",
      "eine Beschlussvorlage mit Zahlen für den Gemeinderat zu schreiben", "الدليل في النص: «eine Beschlussvorlage für den Gemeinderat zu schreiben, mit Zahlen zur Anbindung».",
      ["eine Beschlussvorlage mit Zahlen für den Gemeinderat zu schreiben", "sofort mit dem Bau zu beginnen", "eine Demo zu organisieren"]),
    Q("t-b1-25", 3, "mc", "Welche Auflage gilt für die Bänke?",
      "Ein Weg für Rollstühle muss frei bleiben", "الدليل في النص: «wenn ein Weg für Rollstühle frei bleibt».",
      ["Ein Weg für Rollstühle muss frei bleiben", "Sie dürfen nur aus Holz sein", "Sie müssen nachts entfernt werden"]),
    Q("t-b1-25", 4, "truefalse", "Der Gemeinderat lehnte die Vorlage im Herbst ab.",
      "falsch", "الدليل في النص: «angenommen, aber mit zwei Auflagen» — أُقرّت بشرطين.",
      ["richtig", "falsch"]),
    Q("t-b1-25", 5, "fill", "Die Lieferwagen dürfen morgens bis ___ Uhr in die Zone fahren.",
      "zehn", "الدليل في النص: «morgens bis zehn Uhr».",
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
print(f"R154 lang B1 written: +{neu} (file now {len(vorhanden)} entries)")
