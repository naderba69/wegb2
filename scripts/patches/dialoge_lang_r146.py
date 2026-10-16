# -*- coding: utf-8 -*-
"""R146: دفعة حوارات طويلة B1/B2 (10 أسطر لكل حوار؛ متوسط البنك الحالي 6.5).
تُضاف فقط إن غابت (idempotent). لا صوت مُدّعى: بلا ملفات MP3، فالتشغيل TTS معلن.
كل dictation مقطع حرفي من سطر ألماني، وكل سؤال مفتاحه داخل النص."""
import json, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, "content", "dialogues.json")
D = json.load(open(P, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
have = {d["id"] for d in D}

def L(who, de, ar):
    return collections.OrderedDict([("who", who), ("de", de), ("ar", ar)])

NEW = [
  collections.OrderedDict([
    ("id", "dlg-b1-wohnungssuche"), ("level", "B1"),
    ("titleDe", "Die Wohnungsbesichtigung"), ("titleAr", "معاينة الشقة"),
    ("lines", [
      L("Frau Berger", "Guten Tag, Herr Yilmaz! Kommen Sie bitte herein. Das ist die Wohnung, von der ich Ihnen erzählt habe.", "طاب يومكم، سيد يلماز! تفضّلوا بالدخول. هذه هي الشقة التي حدّثتكم عنها."),
      L("Herr Yilmaz", "Guten Tag! Die Wohnung ist sehr hell. Wie viele Zimmer hat sie genau?", "طاب يومكم! الشقة مضيئة جداً. كم غرفة فيها بالضبط؟"),
      L("Frau Berger", "Sie hat drei Zimmer, eine Küche und ein Bad. Die Küche ist neu, aber das Bad ist etwas klein.", "فيها ثلاث غرف ومطبخ وحمّام. المطبخ جديد، لكن الحمّام صغير بعض الشيء."),
      L("Herr Yilmaz", "Das Bad ist für mich nicht so wichtig. Gibt es einen Balkon?", "الحمّام ليس مهماً جداً بالنسبة إليّ. هل توجد شرفة؟"),
      L("Frau Berger", "Ja, der Balkon ist groß, und man kann dort morgens in der Sonne frühstücken.", "نعم، الشرفة كبيرة، ويمكن تناول الفطور فيها صباحاً تحت الشمس."),
      L("Herr Yilmaz", "Das klingt gut! Wie hoch ist die Miete mit allen Kosten?", "هذا يبدو جيداً! كم تبلغ الأجرة مع كل التكاليف؟"),
      L("Frau Berger", "Warm kostet die Wohnung siebenhundertfünfzig Euro im Monat. Strom und Internet zahlen Sie extra.", "الأجرة شاملة التدفئة سبعمئة وخمسون يورو شهرياً. الكهرباء والإنترنت تدفعونهما إضافياً."),
      L("Herr Yilmaz", "Das ist für diese Gegend in Ordnung. Wann könnte ich einziehen?", "هذا مقبول لهذه المنطقة. متى يمكنني الانتقال؟"),
      L("Frau Berger", "Ab dem ersten Oktober wäre die Wohnung frei. Wenn Sie möchten, können wir den Vertrag nächste Woche unterschreiben.", "اعتباراً من الأول من أكتوبر تصبح الشقة شاغرة. إن رغبتم، يمكننا توقيع العقد الأسبوع المقبل."),
      L("Herr Yilmaz", "Sehr gern! Ich bringe dann meine Unterlagen mit. Vielen Dank für die Besichtigung!", "بكل سرور! سأحضر أوراقي حينها. شكراً جزيلاً على المعاينة!"),
    ]),
    ("questions", [
      collections.OrderedDict([
        ("id", "dlg-b1-wohnungssuche-q1"), ("type", "mc"),
        ("promptDe", "Was ist Herrn Yilmaz nicht so wichtig?"),
        ("options", ["das kleine Bad", "der große Balkon", "die neue Küche"]),
        ("answer", "das kleine Bad"),
        ("explanationAr", "الدليل: »Das Bad ist für mich nicht so wichtig«. الفخّ: الشرفة والمطبخ ذُكرا بإيجاب لا كعيب."),
        ("promptAr", "اختر الإجابة الصحيحة حسب الحوار."),
      ]),
      collections.OrderedDict([
        ("id", "dlg-b1-wohnungssuche-q2"), ("type", "fill"),
        ("promptDe", "Warm kostet die Wohnung ___ Euro im Monat."),
        ("answer", ["siebenhundertfünfzig"]),
        ("explanationAr", "الدليل: »Warm kostet die Wohnung siebenhundertfünfzig Euro im Monat« — الأجرة شاملة التدفئة."),
        ("promptAr", "أكمل الفراغ بالكلمة المناسبة من الحوار."),
      ]),
    ]),
    ("dictation", [
      "Die Wohnung ist sehr hell.",
      "Warm kostet die Wohnung siebenhundertfünfzig Euro im Monat.",
      "Wenn Sie möchten, können wir den Vertrag nächste Woche unterschreiben.",
    ]),
    ("cultural_theme", "Wohnen - Housing"),
    ("cultural_note", "Theme: Wohnen - Housing"),
  ]),
  collections.OrderedDict([
    ("id", "dlg-b1-berufsberatung"), ("level", "B1"),
    ("titleDe", "Bei der Berufsberatung"), ("titleAr", "عند استشارة المهن"),
    ("lines", [
      L("Beraterin", "Guten Tag, Frau Haddad. Sie suchen eine neue Stelle, richtig?", "طاب يومكم، سيدة حداد. تبحثين عن وظيفة جديدة، أليس كذلك؟"),
      L("Frau Haddad", "Ja, genau. Ich habe fünf Jahre in einem Büro gearbeitet, aber jetzt möchte ich etwas Neues lernen.", "نعم، تماماً. منذ خمس سنوات أعمل في مكتب، لكنني الآن أرغب في تعلّم شيء جديد."),
      L("Beraterin", "Haben Sie schon eine Idee, welcher Beruf zu Ihnen passen könnte?", "هل لديك فكرة أصلاً عن المهنة التي قد تناسبك؟"),
      L("Frau Haddad", "Ich arbeite gern mit Menschen. Vielleicht etwas im sozialen Bereich oder in einer Kita.", "أحب العمل مع الناس. ربما شيء في المجال الاجتماعي أو في روضة أطفال."),
      L("Beraterin", "Dafür brauchen Sie eine Weiterbildung. Die dauert meistens ein Jahr.", "لذلك تحتاجين إلى تدريب مهني إضافي. يستغرق عادة سنة."),
      L("Frau Haddad", "Ein Jahr ist lang. Kann ich die Weiterbildung auch in Teilzeit machen?", "سنة مدة طويلة. هل يمكنني إجراء التدريب بدوام جزئي؟"),
      L("Beraterin", "Ja, das ist möglich. Viele Kurse finden abends oder am Wochenende statt.", "نعم، هذا ممكن. كثير من الدورات تُعقد مساءً أو في عطلة نهاية الأسبوع."),
      L("Frau Haddad", "Das wäre perfekt, weil ich morgens meine Kinder zur Schule bringe.", "هذا سيكون مثالياً، لأنني أوصل أطفالي إلى المدرسة صباحاً."),
      L("Beraterin", "Ich schicke Ihnen heute noch Informationen über zwei Kurse. Dann können Sie in Ruhe vergleichen.", "سأرسل إليك اليوم معلومات عن دورتين. عندها يمكنك المقارنة على مهل."),
      L("Frau Haddad", "Vielen Dank! Ich freue mich, dass es einen Weg gibt, der zu meinem Leben passt.", "شكراً جزيلاً! يسعدني أن هناك طريقاً يناسب حياتي."),
    ]),
    ("questions", [
      collections.OrderedDict([
        ("id", "dlg-b1-berufsberatung-q1"), ("type", "mc"),
        ("promptDe", "Warum möchte Frau Haddad die Weiterbildung in Teilzeit machen?"),
        ("options", ["Weil sie morgens ihre Kinder zur Schule bringt.", "Weil die Kurse nur abends stattfinden.", "Weil sie schon einen neuen Beruf hat."]),
        ("answer", "Weil sie morgens ihre Kinder zur Schule bringt."),
        ("explanationAr", "الدليل: »weil ich morgens meine Kinder zur Schule bringe«. الفخّ: الدورات المسائية إمكانية لا سبب طلبها."),
        ("promptAr", "اختر الإجابة الصحيحة حسب الحوار."),
      ]),
      collections.OrderedDict([
        ("id", "dlg-b1-berufsberatung-q2"), ("type", "fill"),
        ("promptDe", "Die Weiterbildung dauert meistens ein ___."),
        ("answer", ["Jahr"]),
        ("explanationAr", "الدليل: »Die dauert meistens ein Jahr« — ضمير Die يعود على Weiterbildung."),
        ("promptAr", "أكمل الفراغ بالكلمة المناسبة من الحوار."),
      ]),
    ]),
    ("dictation", [
      "Ich arbeite gern mit Menschen.",
      "Viele Kurse finden abends oder am Wochenende statt.",
      "Dann können Sie in Ruhe vergleichen.",
    ]),
    ("cultural_theme", "Berufswelt - Working life"),
    ("cultural_note", "Theme: Berufswelt - Working life"),
  ]),
  collections.OrderedDict([
    ("id", "dlg-b2-homeoffice"), ("level", "B2"),
    ("titleDe", "Streitfrage Homeoffice"), ("titleAr", "قضية خلافية: العمل من المنزل"),
    ("lines", [
      L("Jonas", "Seit wir teilweise im Homeoffice arbeiten, bin ich viel entspannter. Der lange Weg ins Büro fällt einfach weg.", "منذ أن صرنا نعمل جزئياً من المنزل، أصبحت أكثر راحة بكثير. فطريق الذهاب الطويل إلى المكتب لم يعد موجوداً ببساطة."),
      L("Clara", "Das stimmt zwar, aber ich habe das Gefühl, dass wir uns als Team immer fremder werden.", "هذا صحيح، لكن لدي شعور بأننا كفريق نصبح أكثر اغتراباً بعضنا عن بعض."),
      L("Jonas", "Fremder? Wir sehen uns doch jeden Morgen in der Videokonferenz.", "أكثر اغتراباً؟ نحن نرى بعضنا كل صباح في مؤتمر الفيديو."),
      L("Clara", "Sehen schon, aber die kurzen Gespräche in der Küche fehlen. Genau dort entstehen oft die besten Ideen.", "نراهم نعم، لكن الأحاديث القصيرة في المطبخ مفقودة. وهناك بالضبط تولد غالباً أفضل الأفكار."),
      L("Jonas", "Da hast du einen Punkt. Trotzdem arbeite ich zu Hause konzentrierter, weil mich niemand ständig unterbricht.", "معك حق في هذه النقطة. ومع ذلك أعمل في المنزل بتركيز أكبر، لأنه لا أحد يقاطعني باستمرار."),
      L("Clara", "Konzentrierter vielleicht, aber auch länger. Viele Kollegen antworten abends noch auf Nachrichten, weil die Grenze zur Freizeit verschwimmt.", "بتركيز أكبر ربما، لكن لمدة أطول أيضاً. كثير من الزملاء يردّون على الرسائل مساءً، لأن الحدود مع وقت الفراغ تتلاشى."),
      L("Jonas", "Das ist eher eine Frage der Disziplin. Ich mache um sechs Uhr den Computer aus, dann ist Feierabend.", "هذه مسألة انضباط أكثر من أي شيء. أطفئ الحاسوب في السادسة، وعندها ينتهي الدوام."),
      L("Clara", "Nicht jeder schafft das. Deshalb fände ich feste Regeln besser: zwei Tage Büro, drei Tage zu Hause, und abends keine Nachrichten mehr.", "ليس الجميع قادراً على ذلك. لذا أفضّل قواعد ثابتة: يومان في المكتب وثلاثة في المنزل، ومساءً لا رسائل بعد ذلك."),
      L("Jonas", "Einverstanden. Ein fester Rahmen würde beiden Seiten helfen: Ruhe zum Arbeiten und echten Kontakt im Team.", "موافق. إطار ثابت سيساعد الطرفين: هدوء للعمل وتواصل حقيقي داخل الفريق."),
      L("Clara", "Genau. Es geht nicht um Entweder-oder, sondern um eine gute Mischung, die für alle funktioniert.", "تماماً. الأمر ليس إما هذا أو ذاك، بل مزيج جيد يعمل لصالح الجميع."),
    ]),
    ("questions", [
      collections.OrderedDict([
        ("id", "dlg-b2-homeoffice-q1"), ("type", "mc"),
        ("promptDe", "Welchen Nachteil des Homeoffice nennt Clara zuerst?"),
        ("options", ["Das Team wird sich immer fremder.", "Man arbeitet zu Hause unkonzentriert.", "Der Computer geht zu oft kaputt."]),
        ("answer", "Das Team wird sich immer fremder."),
        ("explanationAr", "الدليل: »wir uns als Team immer fremder werden«. الفخّ: قلة التركيز رأي معاكس لما قالته كلارا لاحقاً عن عمل جوناس."),
        ("promptAr", "اختر الإجابة الصحيحة حسب الحوار."),
      ]),
      collections.OrderedDict([
        ("id", "dlg-b2-homeoffice-q2"), ("type", "fill"),
        ("promptDe", "Clara schlägt vor: zwei Tage Büro, drei Tage zu Hause, und abends keine ___ mehr."),
        ("answer", ["Nachrichten"]),
        ("explanationAr", "الدليل: »und abends keine Nachrichten mehr« — اقتراح القاعدة الثابتة."),
        ("promptAr", "أكمل الفراغ بالكلمة المناسبة من الحوار."),
      ]),
    ]),
    ("dictation", [
      "Genau dort entstehen oft die besten Ideen.",
      "Nicht jeder schafft das.",
      "Ein fester Rahmen würde beiden Seiten helfen: Ruhe zum Arbeiten und echten Kontakt im Team.",
    ]),
    ("cultural_theme", "Arbeitswelt im Wandel - Changing world of work"),
    ("cultural_note", "Theme: Arbeitswelt im Wandel - Changing world of work"),
  ]),
  collections.OrderedDict([
    ("id", "dlg-b2-klimadebatte"), ("level", "B2"),
    ("titleDe", "Soll Fliegen teurer werden?"), ("titleAr", "هل ينبغي أن يصبح الطيران أغلى؟"),
    ("lines", [
      L("Moderatorin", "Unser Thema heute: Soll Fliegen deutlich teurer werden, um das Klima zu schützen? Herr Wolf, Sie sind dafür.", "موضوعنا اليوم: هل ينبغي أن يصبح الطيران أغلى بكثير لحماية المناخ؟ سيد وولف، أنت مع ذلك."),
      L("Herr Wolf", "Ja, unbedingt. Fliegen ist heute oft billiger als Bahnfahren, obwohl es dem Klima viel mehr schadet.", "نعم، قطعاً. الطيران اليوم غالباً أرخص من ركوب القطار، مع أنه يضر المناخ أكثر بكثير."),
      L("Frau Sommer", "Das ist nur die halbe Wahrheit. Wenn Flüge teurer werden, können sich ärmere Familien keinen Urlaub mehr leisten.", "هذه نصف الحقيقة فقط. إذا أصبحت الرحلات أغلى، لن تستطيع العائلات الأفقر تحمّل كلفة عطلة بعد ذلك."),
      L("Herr Wolf", "Aber irgendjemand muss die Kosten für die Schäden am Klima tragen. Im Moment zahlen alle dafür, auch die, die nie fliegen.", "لكن لا بد أن يتحمّل أحدهم تكاليف الأضرار المناخية. حالياً يدفع الجميع مقابل ذلك، حتى من لا يطيرون أبداً."),
      L("Frau Sommer", "Trotzdem wäre ein Verbot oder eine hohe Steuer ungerecht. Besser wäre es, die Bahn billiger und schneller zu machen.", "ومع ذلك سيكون المنع أو الضريبة المرتفعة غير عادل. الأفضل جعل القطارات أرخص وأسرع."),
      L("Herr Wolf", "Da stimme ich zu: Die Bahn muss besser werden. Aber ohne höhere Preise fürs Fliegen wird sich kaum etwas ändern.", "أوافق على ذلك: يجب أن تتحسن القطارات. لكن من دون أسعار أعلى للطيران لن يتغير شيء تقريباً."),
      L("Frau Sommer", "Vielleicht brauchen wir beides, aber in der richtigen Reihenfolge: zuerst bessere Züge, dann höhere Flugpreise.", "ربما نحتاج الاثنين، لكن بالترتيب الصحيح: أولاً قطارات أفضل، ثم أسعار طيران أعلى."),
      L("Herr Wolf", "Einverstanden, solange das Ziel klar bleibt: weniger Flüge auf kurzen Strecken, wo der Zug eine echte Alternative ist.", "موافق، ما دام الهدف واضحاً: رحلات أقل على الخطوط القصيرة، حيث القطار بديل حقيقي."),
      L("Frau Sommer", "Darauf können wir uns einigen. Klimaschutz funktioniert nur, wenn er für alle bezahlbar bleibt.", "على هذا يمكننا الاتفاق. حماية المناخ لا تنجح إلا إذا بقيت ميسورة التكلفة للجميع."),
      L("Moderatorin", "Ein Kompromiss also: erst die Bahn stärken, dann das Fliegen verteuern. Vielen Dank an beide Gäste!", "تسوية إذن: تقوية القطارات أولاً، ثم رفع أسعار الطيران. شكراً جزيلاً لكلا الضيفين!"),
    ]),
    ("questions", [
      collections.OrderedDict([
        ("id", "dlg-b2-klimadebatte-q1"), ("type", "mc"),
        ("promptDe", "Warum hält Frau Sommer höhere Flugpreise für problematisch?"),
        ("options", ["Weil sich ärmere Familien dann keinen Urlaub mehr leisten können.", "Weil die Bahn dann zu voll wird.", "Weil Fliegen dem Klima nicht schadet."]),
        ("answer", "Weil sich ärmere Familien dann keinen Urlaub mehr leisten können."),
        ("explanationAr", "الدليل: »können sich ärmere Familien keinen Urlaub mehr leisten« — حجة العدالة الاجتماعية. الفخّ: ازدحام القطارات لم يُذكر."),
        ("promptAr", "اختر الإجابة الصحيحة حسب الحوار."),
      ]),
      collections.OrderedDict([
        ("id", "dlg-b2-klimadebatte-q2"), ("type", "fill"),
        ("promptDe", "Ein Kompromiss: zuerst die Bahn ___, dann das Fliegen verteuern."),
        ("answer", ["stärken"]),
        ("explanationAr", "الدليل: »erst die Bahn stärken, dann das Fliegen verteuern« — خلاصة الميسّرة للتسوية."),
        ("promptAr", "أكمل الفراغ بالكلمة المناسبة من الحوار."),
      ]),
    ]),
    ("dictation", [
      "Fliegen ist heute oft billiger als Bahnfahren, obwohl es dem Klima viel mehr schadet.",
      "Klimaschutz funktioniert nur, wenn er für alle bezahlbar bleibt.",
      "zuerst bessere Züge, dann höhere Flugpreise.",
    ]),
    ("cultural_theme", "Klimapolitik - Climate policy"),
    ("cultural_note", "Theme: Klimapolitik - Climate policy"),
  ]),
]

added = 0
for d in NEW:
    if d["id"] in have:
        continue
    # فحوص ذاتية قبل الإضافة: الإملاءات من النص، المفاتيح في الخيارات، لا أرقام لاتينية في الألمانية
    import re
    for q in d["questions"]:
        assert q["promptAr"].strip() and q["explanationAr"].strip()
        if q["type"] == "mc":
            assert q["answer"] in q["options"] and len(set(q["options"])) == len(q["options"])
    for part in d["dictation"]:
        assert any(part in l["de"] for l in d["lines"]), part
    for l in d["lines"]:
        assert not re.search(r"\d|%|Prozent", l["de"]), l["de"]
    D.append(d)
    added += 1

json.dump(D, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"R146 dialogues added: {added} (bank now {len(D)})")
