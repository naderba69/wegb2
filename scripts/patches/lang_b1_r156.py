# -*- coding: utf-8 -*-
"""R156: نسخ طويلة (lang) لآخر خمسة نصوص B1 لاحقة (t-b1-31..35) — اكتمال B1. توسعة أمينة
لوقائعها، ضمن نطاق العرض 169–260 كلمة، نمط B1: 5 أسئلة (3 mc + صواب/خطأ + إكمال).
يُنشئ content/lang/b1-31-35.json (idempotent)."""
import json, os, collections, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "content", "lang", "b1-31-35.json")
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

E["t-b1-31"] = collections.OrderedDict([
  ("de", "Vor drei Monaten bin ich von Hamburg nach Leipzig gezogen. Der Grund war ein neues Jobangebot als Softwareentwicklerin, das ich nicht ablehnen wollte. Am Anfang fiel es mir schwer, weil ich meine Freunde und meine Familie sehr vermisste. Außerdem kannte ich die Stadt überhaupt nicht und musste mich erst orientieren.\n\nIch nahm mir vor, jede Woche einen neuen Ort zu besuchen: ein Café, einen Park oder ein Museum. So lernte ich die Stadt Schritt für Schritt kennen. Inzwischen habe ich zwei Kolleginnen kennengelernt, mit denen ich mich gut verstehe. Wir gehen manchmal zusammen essen oder ins Kino. Was ich an Leipzig besonders mag, sind die vielen Grünflächen und die günstigen Mieten im Vergleich zu Hamburg.\n\nNatürlich gibt es auch Dinge, die ich vermisse, zum Beispiel die Hafenatmosphäre und das Meer. Aber ich bereue den Umzug nicht: Er hat mir geholfen, selbstständiger zu werden und neue Perspektiven zu gewinnen. Auch bei der Arbeit fühle ich mich inzwischen sicherer. Mein Team hilft mir, wenn ich Fragen habe, und ich lerne jeden Tag etwas Neues. Am Wochenende gehe ich mit meinen Kolleginnen in einen Park oder koche ein Gericht aus Hamburg. So entdecke ich die neue Stadt, ohne meine alte Heimat zu vergessen."),
  ("ar", "انتقلت قبل ثلاثة أشهر من هامبورغ إلى لايبزيغ لعرض عمل كمطوّرة برمجيات لم تستطع رفضه. البداية كانت صعبة: اشتياق للأصدقاء والعائلة ومدينة لا تعرف فيها شيئاً، فقررت زيارة مكان جديد كل أسبوع (مقهى أو حديقة أو متحف) حتى عرفت لايبزيغ خطوة خطوة وكوّنت صداقة مع زميلتين، وصارت تحب مساحاتها الخضراء وإيجاراتها الرخيصة قياساً بهامبورغ. تفتقد أجواء الميناء والبحر لكنها لا تندم: الانتقال جعلها أكثر استقلالية وفتح لها آفاقاً جديدة، وفي العمل تشعر بأمان أكبر وفريقها يساعدها، ونهاية الأسبوع بين حديقة مع الزميلتين وطبق من هامبورغ — مدينة جديدة تُكتشف دون نسيان الوطن القديم."),
  ("questions", [
    Q("t-b1-31", 1, "mc", "Warum ist sie nach Leipzig gezogen?",
      "Wegen eines neuen Jobangebots", "الدليل في النص: «Der Grund war ein neues Jobangebot als Softwareentwicklerin».",
      ["Wegen eines neuen Jobangebots", "Wegen des Meeres", "Weil ihre Familie dort wohnt"]),
    Q("t-b1-31", 2, "mc", "Was nahm sie sich am Anfang vor?",
      "jede Woche einen neuen Ort zu besuchen", "الدليل في النص: «Ich nahm mir vor, jede Woche einen neuen Ort zu besuchen».",
      ["jede Woche einen neuen Ort zu besuchen", "sofort zurückzuziehen", "jeden Tag Hamburg anzurufen"]),
    Q("t-b1-31", 3, "mc", "Was mag sie an Leipzig besonders?",
      "die vielen Grünflächen und die günstigen Mieten", "الدليل في النص: «die vielen Grünflächen und die günstigen Mieten im Vergleich zu Hamburg».",
      ["die vielen Grünflächen und die günstigen Mieten", "die Hafenatmosphäre", "das Meer"]),
    Q("t-b1-31", 4, "truefalse", "Sie bereut den Umzug nach Leipzig.",
      "falsch", "الدليل في النص: «Aber ich bereue den Umzug nicht».",
      ["richtig", "falsch"]),
    Q("t-b1-31", 5, "fill", "Ich nahm mir vor, jede Woche einen neuen ___ zu besuchen: ein Café, einen Park oder ein Museum.",
      "Ort", "الدليل في النص: «einen neuen Ort zu besuchen».",
      None),
  ]),
])

E["t-b1-32"] = collections.OrderedDict([
  ("de", "Seit einem Jahr esse ich kein Fleisch mehr. Anfangs war es schwierig, weil meine Familie traditionell viel Fleisch kocht und ich in Restaurants oft nur wenige Optionen hatte. Inzwischen habe ich viele neue Rezepte ausprobiert, vor allem aus der orientalischen und indischen Küche, in der es viele vegetarische Gerichte gibt.\n\nWas mich überrascht hat: Ich fühle mich nicht schwächer, im Gegenteil, ich habe mehr Energie, und mein Cholesterinwert ist gesunken. Natürlich muss ich darauf achten, genügend Eisen und Eiweiß zu essen, zum Beispiel durch Hülsenfrüchte, Nüsse und Spinat. Inzwischen bereite ich mein Mittagessen oft am Abend vorher zu, damit ich in der Pause nicht lange suchen muss. Wenn ich mit Freunden essen gehe, frage ich freundlich nach den Zutaten.\n\nMeine Freunde reagieren unterschiedlich: Einige finden es gut, andere machen Witze darüber. Ich versuche, niemanden zu missionieren, sondern einfach mit gutem Beispiel voranzugehen. Auch meine Familie probiert jetzt neue Rezepte aus. Für mich ist wichtig, dass die Entscheidung zu meinem Alltag passt und ich genügend Auswahl habe. So fühlt sich der Verzicht nicht wie ein Zwang an, sondern wie eine Gewohnheit."),
  ("ar", "عام بلا لحم: البداية صعبة في عائلة تطبخ اللحم تقليدياً ومطاعم بخيارات قليلة، ثم اكتشفت وصفات شرقية وهندية غنية بالأطباق النباتية. المفاجأة أنها لا تشعر بضعف بل بطاقة أكبر وانخفاض في الكولسترول، مع انتباه للحديد والبروتين من البقوليات والمكسرات والسبانخ، وتحضير غدائها مساءً وسؤال ودود عن المكوّنات عند الأكل مع الأصدقاء. ردود الأصدقاء بين مؤيد وساخر، وهي لا تبشّر بل تقدّم مثالاً هادئاً حتى صارت عائلتها تجرب الوصفات الجديدة؛ المهم أن يناسب القرار يومها وأن تبقى الخيارات كافية فلا يشبه الحرمان قسراً."),
  ("questions", [
    Q("t-b1-32", 1, "mc", "Warum war der Anfang für sie schwierig?",
      "Ihre Familie kocht viel Fleisch und Restaurants hatten wenig Auswahl", "الدليل في النص: «weil meine Familie traditionell viel Fleisch kocht und ich in Restaurants oft nur wenige Optionen hatte».",
      ["Ihre Familie kocht viel Fleisch und Restaurants hatten wenig Auswahl", "Sie konnte nicht kochen", "Gemüse war zu teuer"]),
    Q("t-b1-32", 2, "mc", "Was hat sie an sich selbst überrascht?",
      "Sie hat mehr Energie und ihr Cholesterinwert ist gesunken", "الدليل في النص: «ich habe mehr Energie, und mein Cholesterinwert ist gesunken».",
      ["Sie hat mehr Energie und ihr Cholesterinwert ist gesunken", "Sie ist schwächer geworden", "Sie hat zugenommen"]),
    Q("t-b1-32", 3, "mc", "Worauf muss sie bei ihrer Ernährung achten?",
      "auf genügend Eisen und Eiweiß", "الدليل في النص: «genügend Eisen und Eiweiß zu essen, zum Beispiel durch Hülsenfrüchte, Nüsse und Spinat».",
      ["auf genügend Eisen und Eiweiß", "auf mehr Zucker", "auf weniger Gemüse"]),
    Q("t-b1-32", 4, "truefalse", "Sie versucht, ihre Freunde von ihrer Ernährung zu überzeugen.",
      "falsch", "الدليل في النص: «Ich versuche, niemanden zu missionieren».",
      ["richtig", "falsch"]),
    Q("t-b1-32", 5, "fill", "Ich fühle mich nicht schwächer, im ___ habe ich mehr Energie.",
      "Gegenteil", "الدليل في النص: «im Gegenteil, ich habe mehr Energie».",
      None),
  ]),
])

E["t-b1-33"] = collections.OrderedDict([
  ("de", "Letzte Woche hatte ich ein Bewerbungsgespräch bei einer Marketingfirma in Köln. Schon Tage vorher war ich ziemlich nervös. Ich las meinen Lebenslauf mehrmals durch, informierte mich gründlich über die Firma und übte typische Fragen: nach meinen Stärken und Schwächen, meiner Berufserfahrung und meinen Gehaltsvorstellungen.\n\nPünktlich um zehn Uhr war ich da. Die Gesprächspartnerin war freundlich und stellte mir zuerst das Unternehmen vor. Sie fragte nach meinem Studium und meinen Praktika. Außerdem wollte sie wissen, warum ich gerade in dieser Firma arbeiten möchte. Am Ende hatte ich auch selbst die Gelegenheit, Fragen zu stellen. Ich fragte nach dem Team, den Arbeitszeiten und der Möglichkeit, teilweise im Homeoffice zu arbeiten. Besonders wichtig war mir, wie ein normaler Arbeitstag aussieht und welche Aufgaben am Anfang auf mich warten.\n\nDie Gesprächspartnerin beantwortete alle Fragen geduldig. Danach fühlte ich mich viel ruhiger. Obwohl ich noch keine Zusage hatte, war ich mit dem Gespräch zufrieden. Drei Tage später bekam ich eine E-Mail: Ich wurde zu einem zweiten Gespräch eingeladen. Diese Einladung machte mich sehr froh, und ich begann sofort, mich darauf vorzubereiten."),
  ("ar", "مقابلة عمل في شركة تسويق بكولونيا بعد أيام من التوتر والاستعداد: قراءة السيرة مراراً ودراسة الشركة والتدرب على الأسئلة المعتادة (نقاط القوة والضعف والخبرة وتوقعات الراتب). حضرت في العاشرة تماماً فاستقبلتها المحاوِرة بلطف وقدّمت الشركة وسألت عن دراستها وتدريبها وسبب اختيارها هذه الشركة بالذات، ثم أتيح لها أن تسأل عن الفريق وساعات العمل وإمكانية العمل الجزئي من البيت وشكل يوم العمل العادي ومهام البداية. أجابت المحاوِرة عن كل شيء فهدأت رغم غياب أي وعد، وبعد ثلاثة أيام وصلتها دعوة لمقابلة ثانية أسعدتها وبدأت تستعد لها فوراً."),
  ("questions", [
    Q("t-b1-33", 1, "mc", "Wie bereitete sie sich auf das Gespräch vor?",
      "Sie las ihren Lebenslauf und übte typische Fragen", "الدليل في النص: «Ich las meinen Lebenslauf mehrmals durch» و«übte typische Fragen».",
      ["Sie las ihren Lebenslauf und übte typische Fragen", "Sie kaufte neue Kleidung", "Sie rief die Firma mehrmals an"]),
    Q("t-b1-33", 2, "mc", "Was fragte sie am Ende selbst?",
      "nach Team, Arbeitszeiten und Homeoffice", "الدليل في النص: «Ich fragte nach dem Team, den Arbeitszeiten und der Möglichkeit, teilweise im Homeoffice zu arbeiten».",
      ["nach Team, Arbeitszeiten und Homeoffice", "nur nach dem Gehalt", "nach dem Urlaub der Chefin"]),
    Q("t-b1-33", 3, "mc", "Was passierte drei Tage nach dem Gespräch?",
      "Sie wurde zu einem zweiten Gespräch eingeladen", "الدليل في النص: «Ich wurde zu einem zweiten Gespräch eingeladen».",
      ["Sie wurde zu einem zweiten Gespräch eingeladen", "Sie bekam sofort den Job", "Sie erhielt eine Absage"]),
    Q("t-b1-33", 4, "truefalse", "Sie konnte am Ende auch selbst Fragen stellen.",
      "richtig", "الدليل في النص: «Am Ende hatte ich auch selbst die Gelegenheit, Fragen zu stellen».",
      ["richtig", "falsch"]),
    Q("t-b1-33", 5, "fill", "Ich wurde zu einem zweiten ___ eingeladen.",
      "Gespräch", "الدليل في النص: «zu einem zweiten Gespräch eingeladen».",
      None),
  ]),
])

E["t-b1-34"] = collections.OrderedDict([
  ("de", "Gestern sah ich auf dem Weg zur Arbeit einen kleinen Unfall. An einer Kreuzung wollte ein Autofahrer rechts abbiegen. Dabei übersah er einen Radfahrer, der geradeaus fuhr. Der Radfahrer stürzte und verletzte sich leicht am Knie. Zum Glück trug er einen Helm und blieb bei Bewusstsein.\n\nPassanten halfen sofort: Sie riefen den Krankenwagen und informierten die Polizei. Eine Frau blieb beim Radfahrer und sprach beruhigend mit ihm, während ein anderer Mann den Verkehr warnte. Der Autofahrer war sehr aufgeregt und entschuldigte sich mehrmals. Nach kurzer Zeit konnte der Radfahrer zum Glück wieder stehen. Ein Polizist sprach mit den Beteiligten und nahm ihre Aussagen auf. Niemand wusste am Anfang, ob die Verletzung schwer war. Deshalb warteten alle, bis die Rettungskräfte eintrafen.\n\nIch blieb noch kurz stehen und sprach mit einer Frau, die den Unfall ebenfalls gesehen hatte. Dann ging ich weiter zur Arbeit und dachte über die Situation nach. Der Vorfall hat mir wieder gezeigt, wie wichtig es ist, im Verkehr aufmerksam zu sein, sowohl als Fußgängerin als auch als Fahrerin. Seitdem achte ich an Kreuzungen besonders auf abbiegende Autos."),
  ("ar", "حادث صغير شاهدته في طريقها إلى العمل: سائق ينعطف يميناً عند تقاطع دون أن يرى درّاجاً يمضي مستقيماً، فسقط الدرّاج وأصاب ركبته إصابة خفيفة وكان لحسن الحظ يرتدي خوذة وبقي واعياً. تحرّك المارة فوراً: إسعاف وشرطة، وامرأة بقيت تهدّئ المصاب ورجل حذّر حركة المرور، والسائق مضطرب يعتذر مراراً. وقف الدرّاج بعد قليل وسجّل شرطي أقوال الجميع وانتظروا وصول المسعفين لأن خطورة الإصابة لم تكن معلومة أولاً. الدرس الذي خرجت به: الانتباه في المرور واجب على المشاة والسائقين معاً، ومنذئذ تتفحص عند التقاطعات السيارات المنعطفة خصوصاً."),
  ("questions", [
    Q("t-b1-34", 1, "mc", "Wie kam es zu dem Unfall?",
      "Ein Autofahrer übersah beim Abbiegen einen Radfahrer", "الدليل في النص: «Dabei übersah er einen Radfahrer, der geradeaus fuhr».",
      ["Ein Autofahrer übersah beim Abbiegen einen Radfahrer", "Der Radfahrer fuhr zu schnell", "Die Ampel war kaputt"]),
    Q("t-b1-34", 2, "mc", "Was taten die Passanten?",
      "Sie riefen Krankenwagen und Polizei und halfen dem Radfahrer", "الدليل في النص: «Sie riefen den Krankenwagen und informierten die Polizei».",
      ["Sie riefen Krankenwagen und Polizei und halfen dem Radfahrer", "Sie gingen einfach weiter", "Sie machten nur Fotos"]),
    Q("t-b1-34", 3, "mc", "Was macht die Erzählerin seit dem Unfall?",
      "Sie achtet an Kreuzungen besonders auf abbiegende Autos", "الدليل في النص: «Seitdem achte ich an Kreuzungen besonders auf abbiegende Autos».",
      ["Sie achtet an Kreuzungen besonders auf abbiegende Autos", "Sie fährt nur noch Bus", "Sie meidet die Kreuzung"]),
    Q("t-b1-34", 4, "truefalse", "Der Radfahrer war schwer verletzt und bewusstlos.",
      "falsch", "الدليل في النص: «verletzte sich leicht am Knie» و«blieb bei Bewusstsein».",
      ["richtig", "falsch"]),
    Q("t-b1-34", 5, "fill", "Der Radfahrer stürzte und verletzte sich leicht am ___.",
      "Knie", "الدليل في النص: «verletzte sich leicht am Knie».",
      None),
  ]),
])

E["t-b1-35"] = collections.OrderedDict([
  ("de", "Sehr geehrte Redaktion,\n\nich schreibe Ihnen, weil ich mich über den Zustand des Stadtparks in meinem Viertel ärgere. Immer wieder sehe ich dort Müll auf den Wiesen und auf den Spielplätzen: leere Flaschen, Plastiktüten, Zigarettenkippen und Essensverpackungen. Obwohl es genug Mülleimer gibt, werfen viele Leute ihren Abfall einfach auf den Boden. Das ist nicht nur hässlich, sondern auch gefährlich für Kinder und Tiere.\n\nDer Park wird von Familien, älteren Menschen und Sportlern genutzt. Wenn Müll liegen bleibt, können sich Tiere daran verletzen, und der Platz wird für alle weniger angenehm. Ich schlage vor, dass die Stadt mehr Kontrollen durchführt und höhere Geldstrafen verhängt. Außerdem könnte man Schulklassen und Freiwillige zu regelmäßigen Säuberungsaktionen einladen. Weitere Mülleimer an den Eingängen und neben den Bänken könnten ebenfalls helfen.\n\nBesucher können ihren Abfall einfach mitnehmen und andere freundlich darauf aufmerksam machen. Ein gemeinsamer Park ist für das Viertel wichtig, weil die Menschen dort gern ihre Freizeit verbringen. Nur wenn alle Verantwortung übernehmen, bleibt der Park ein schöner Ort für alle.\n\nMit freundlichen Grüßen\nEine Anwohnerin"),
  ("ar", "رسالة إلى الجريدة من ساكنة في الحي تشكو قمامة حديقة المدينة: زجاجات فارغة وأكياساً بلاستيكية وأعقاب سجائر وأغلفة طعام على المروج والملاعب رغم كفاية السلال — قبح وخطر على الأطفال والحيوانات في حديقة ترتادها عائلات ومسنّون ورياضيون. تقترح رقابة أكثر وغرامات أعلى، ودعوة مدارس ومتطوعين لحملات تنظيف منتظمة، وسلالاً إضافية عند المداخل والمقاعد، وأن يحمل الزوّار نفاياتهم وينبّهوا غيرهم بلطف. فالحديقة المشتركة مهمة للحي، ولا تبقى جميلة للجميع إلا إذا تحمّل الجميع المسؤولية."),
  ("questions", [
    Q("t-b1-35", 1, "mc", "Worüber ärgert sich die Anwohnerin?",
      "über den Müll im Stadtpark", "الدليل في النص: «ich mich über den Zustand des Stadtparks» و«Müll auf den Wiesen».",
      ["über den Müll im Stadtpark", "über die hohen Mieten", "über den Lärm der Sportler"]),
    Q("t-b1-35", 2, "mc", "Was schlägt sie der Stadt vor?",
      "mehr Kontrollen und höhere Geldstrafen", "الدليل في النص: «dass die Stadt mehr Kontrollen durchführt und höhere Geldstrafen verhängt».",
      ["mehr Kontrollen und höhere Geldstrafen", "den Park zu schließen", "Eintritt zu verlangen"]),
    Q("t-b1-35", 3, "mc", "Wer könnte bei Säuberungsaktionen helfen?",
      "Schulklassen und Freiwillige", "الدليل في النص: «könnte man Schulklassen und Freiwillige zu regelmäßigen Säuberungsaktionen einladen».",
      ["Schulklassen und Freiwillige", "nur die Polizei", "die Sportler allein"]),
    Q("t-b1-35", 4, "truefalse", "Im Park gibt es genug Mülleimer, aber viele werfen ihren Müll auf den Boden.",
      "richtig", "الدليل في النص: «Obwohl es genug Mülleimer gibt, werfen viele Leute ihren Abfall einfach auf den Boden».",
      ["richtig", "falsch"]),
    Q("t-b1-35", 5, "fill", "Ich schlage vor, dass die Stadt mehr ___ durchführt und höhere Geldstrafen verhängt.",
      "Kontrollen", "الدليل في النص: «dass die Stadt mehr Kontrollen durchführt».",
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
print(f"R156 lang B1 written: +{neu} (file now {len(vorhanden)} entries)")
