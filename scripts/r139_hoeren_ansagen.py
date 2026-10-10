#!/usr/bin/env python3
"""R139: add Hörtexte (Ansagen/Durchsagen/Anrufbeantworter) per level for dedicated listening."""
import json
from collections import OrderedDict

HOER = [
    OrderedDict([("id","hoer-a1-01"),("level","A1"),
        ("titleDe","Ansage am Bahnhof"),
        ("titleAr","إعلان في محطة القطار"),
        ("sprecher","Lautsprecher"),
        ("textDe","Achtung, Achtung! Der Zug RE 10 nach Köln fährt heute um 14 Uhr 25 von Gleis 3. Verspätung: circa 10 Minuten. Wir bitten um Ihr Verständnis."),
        ("textAr","انتباه! قطار RE 10 المتجه إلى كولونيا سيغادر اليوم الساعة 14:25 من الرصيف 3. التأخير حوالي 10 دقائق. نرجو تفهّمكم."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Welcher Zug ist das?"),("promptAr","ما القطار؟"),("options",["ICE 10","RE 10","S-Bahn 3","RB 25"]),("answer",1),("explanationAr","قطار RE 10.")]),
            OrderedDict([("type","mc"),("promptDe","Wie viel Verspätung hat der Zug?"),("promptAr","ما مقدار التأخير؟"),("options",["5 Minuten","10 Minuten","20 Minuten","30 Minuten"]),("answer",1),("explanationAr","التأخير 10 دقائق.")]),
        ]),
        ("dictation",["Der Zug RE 10 nach Köln fährt um 14 Uhr 25."]),
    ]),
    OrderedDict([("id","hoer-a1-02"),("level","A1"),
        ("titleDe","Im Supermarkt"),
        ("titleAr","في السوبرماركت"),
        ("sprecher","Durchsage"),
        ("textDe","Sehr geehrte Kunden! Heute sind alle Äpfel im Angebot: ein Kilo für nur 99 Cent. Die Öffnungszeiten heute sind von 8 bis 20 Uhr. Vielen Dank für Ihren Besuch!"),
        ("textAr","أيها الزبائن الكرام! التفاح اليوم في عرض: كيلو بـ99 سنتاً فقط. ساعات العمل اليوم من 8 إلى 20. شكراً لزيارتكم!"),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Was ist im Angebot?"),("promptAr","ما في العرض؟"),("options",["Bananen","Äpfel","Brot","Milch"]),("answer",1),("explanationAr","التفاح في العرض.")]),
            OrderedDict([("type","mc"),("promptDe","Wann schließt der Markt?"),("promptAr","متى يغلق السوق؟"),("options",["Um 8 Uhr","Um 18 Uhr","Um 20 Uhr","Um 22 Uhr"]),("answer",2),("explanationAr","يغلق الساعة 20.")]),
        ]),
        ("dictation",["Heute sind alle Äpfel im Angebot."]),
    ]),
    OrderedDict([("id","hoer-a2-01"),("level","A2"),
        ("titleDe","Anrufbeantworter Arztpraxis"),
        ("titleAr","مجيب آلي في عيادة الطبيب"),
        ("sprecher","Anrufbeantworter"),
        ("textDe","Guten Tag, Sie haben die Praxis Dr. Müller erreicht. Unsere Sprechzeiten sind Montag bis Freitag von 8 bis 12 und Dienstag und Donnerstag von 15 bis 18 Uhr. In dringenden Fällen rufen Sie bitte den ärztlichen Notdienst unter der Nummer 116 117 an. Möchten Sie einen Termin vereinbaren, drücken Sie bitte die 1. Wiederhören Sie die Ansage mit der 9."),
        ("textAr","نهارك سعيد، اتصلت بعيادة الدكتور مولر. ساعات العمل من الاثنين إلى الجمعة 8–12، الثلاثاء والخميس 15–18. في الحالات الطارئة اتصل بالطوارئ الطبية على 116117. لحجز موعد اضغط 1. لإعادة الإعلان اضغط 9."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Welche Nummer wählt man in dringenden Fällen?"),("promptAr","ما رقم الطوارئ؟"),("options",["110","112","116 117","0180-1"]),("answer",2),("explanationAr","116117 هو رقم الطوارئ الطبية.")]),
            OrderedDict([("type","mc"),("promptDe","Wann ist die Praxis nachmittags geöffnet?"),("promptAr","متى تفتح العيادة بعد الظهر؟"),("options",["Mo/Fr","Di/Do","Mi/Fr","Mo/Mi"]),("answer",1),("explanationAr","الثلاثاء والخميس.")]),
        ]),
        ("dictation",["Unsere Sprechzeiten sind Montag bis Freitag von 8 bis 12."]),
    ]),
    OrderedDict([("id","hoer-a2-02"),("level","A2"),
        ("titleDe","Wettervorhersage im Radio"),
        ("titleAr","نشرة الطقس في الراديو"),
        ("sprecher","Radio"),
        ("textDe","Und nun das Wetter für morgen: Im Norden ist es bewölkt mit etwas Regen bei Temperaturen zwischen 12 und 15 Grad. In der Mitte Deutschlands scheint die Sonne bei bis zu 20 Grad. Im Süden bleibt es warm und trocken mit Höchstwerten bis 26 Grad. Am Abend kann es im Westen Gewitter geben."),
        ("textAr","والآن طقس الغد: في الشمال غائم مع بعض المطر، درجات الحرارة بين 12 و15. في الوسط تشرق الشمس وتصل الحرارة إلى 20. في الجنوب يظل الجو دافئاً وجافاً بحرارة تبلغ 26. في المساء قد تحدث عواصف رعدية في الغرب."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wo gibt es Gewitter?"),("promptAr","أين العواصف الرعدية؟"),("options",["Im Norden","In der Mitte","Im Süden","Im Westen"]),("answer",3),("explanationAr","العواصف في الغرب مساءً.")]),
            OrderedDict([("type","mc"),("promptDe","Wie warm wird es im Süden?"),("promptAr","كم تبلغ الحرارة في الجنوب؟"),("options",["15 Grad","20 Grad","26 Grad","30 Grad"]),("answer",2),("explanationAr","تصل إلى 26.")]),
        ]),
        ("dictation",["Im Süden bleibt es warm und trocken."]),
    ]),
    OrderedDict([("id","hoer-b1-01"),("level","B1"),
        ("titleDe","Nachricht auf der Mailbox"),
        ("titleAr","رسالة على البريد الصوتي"),
        ("sprecher","Kollegin"),
        ("textDe","Hallo Karim, hier ist Sarah von der Arbeit. Ich rufe an, weil der Termin mit Herrn Becker am Mittwoch leider ausfällt. Er ist krank geworden. Ich habe schon einen neuen Termin für den 18. November um 10 Uhr vorgeschlagen. Bitte sag mir bis morgen Bescheid, ob dir das passt. Ansonsten ruf mich zurück auf dem Handy. Danke, bis dann!"),
        ("textAr","مرحباً كريم، سارة من العمل. أتصل لأن موعد الأربعاء مع السيد بيكر أُلغيَ، فهو مريض. اقترحتُ موعداً جديداً في 18 نوفمبر الساعة 10. من فضلك أبلغني بحلول الغد إن كان يناسبك، وإلا فاتصل بي على الجوال. شكراً، إلى اللقاء."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Warum ruft Sarah an?"),("promptAr","لماذا تتصل سارة؟"),("options",["Um eine Rechnung zu besprechen","Weil der Termin ausfällt","Um sich zu bewerben","Wegen einer Party"]),("answer",1),("explanationAr","ألغت الموعد.")]),
            OrderedDict([("type","mc"),("promptDe","Was soll Karim bis morgen tun?"),("promptAr","ماذا على كريم أن يفعل حتى الغد؟"),("options",["Die Rechnung bezahlen","Zur Arbeit kommen","Bescheid sagen, ob der Termin passt","Den Vertrag unterschreiben"]),("answer",2),("explanationAr","يُعلمها إن كان الموعد مناسباً.")]),
        ]),
        ("dictation",["Ich habe schon einen neuen Termin für den 18. November vorgeschlagen."]),
    ]),
    OrderedDict([("id","hoer-b2-01"),("level","B2"),
        ("titleDe","Interviewausschnitt: Arbeiten in Deutschland"),
        ("titleAr","مقطع مقابلة: العمل في ألمانيا"),
        ("sprecher","Interviewer + Expertin"),
        ("textDe","F: Frau Dr. Weber, wie beurteilen Sie die Situation auf dem deutschen Arbeitsmarkt für ausländische Fachkräfte? – W: Grundsätzlich ist die Nachfrage hoch, insbesondere in technischen Berufen und im Gesundheitswesen. Das Problem liegt oft weniger in der Qualifikation als an der Anerkennung der Abschlüsse und an den Sprachkenntnissen. Viele Arbeitgeber fordern heute mindestens B2, in manchen Bereichen sogar C1. Außerdem spielt interkulturelle Kompetenz eine immer größere Rolle. Mein Rat: frühzeitig Deutsch lernen und die Anerkennung bereits im Heimatland beantragen."),
        ("textAr","س: د. فِبَر، كيف تقيّمين وضع سوق العمل الألماني للكفاءات الأجنبية؟ – ج: الطلب مرتفع أساساً، خصوصاً في المهن التقنية والصحة. المشكلة غالباً ليست في المؤهل بل في معادلة الشهادات ومستوى اللغة. كثير من أرباب العمل يطلبون B2 على الأقل، وفي بعض المجالات C1. كما تلعب الكفاءة بين الثقافات دوراً أكبر فأكبر. نصيحتي: تعلّم الألمانية مبكراً، وقدّم طلب المعادلة وأنت في بلدك."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Was ist nach Frau Weber das größere Problem?"),("promptAr","ما المشكلة الأكبر بحسب فِبَر؟"),("options",["Die fehlende Motivation","Die Anerkennung der Abschlüsse und die Sprache","Die zu hohen Steuern","Der Mangel an Jobs"]),("answer",1),("explanationAr","المشكلة في معادلة الشهادات واللغة.")]),
            OrderedDict([("type","mc"),("promptDe","Welches Sprachniveau fordern viele Arbeitgeber mindestens?"),("promptAr","ما المستوى اللغوي المطلوب على الأقل؟"),("options",["B1","B2","C1","A2"]),("answer",1),("explanationAr","B2 على الأقل، وأحياناً C1.")]),
        ]),
        ("dictation",["Die Nachfrage ist hoch, insbesondere in technischen Berufen."]),
    ]),
]

# Store as new key "hoertexte" in hoeren.json? Actually let's put them into dialogues.json with a flag.
# Simpler: add to dialogues with a special hoertext-only marker.
dlgs = json.load(open('content/dialogues.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing = {d['id'] for d in dlgs}
added = 0
for h in HOER:
    if h['id'] in existing: continue
    # Convert to dialogue format
    dlg = OrderedDict([
        ("id", h['id']),
        ("level", h['level']),
        ("titleDe", h['titleDe']),
        ("titleAr", h['titleAr']),
        ("ort", h['sprecher']),
        ("lines", [OrderedDict([("who",h['sprecher']),("de",h['textDe']),("ar",h['textAr'])])]),
        ("questions", h['questions']),
        ("dictation", h['dictation']),
        ("hoertext", True),  # marker for Ansagen/Mailbox
    ])
    dlgs.append(dlg); added += 1

with open('content/dialogues.json','w',encoding='utf-8') as f:
    json.dump(dlgs,f,ensure_ascii=False,indent=2); f.write('\n')
print(f"Added {added} Hörtexte. Total dialogues: {len(dlgs)}")
