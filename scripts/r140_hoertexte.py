#!/usr/bin/env python3
"""R140d: add 8 new Hoertexte (dialogues with type=hoer) across levels."""
import json
from collections import OrderedDict
import re

d = json.load(open('content/dialogues.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

def make(lid, level, situation_de, situation_ar, lines, compr):
    return OrderedDict([
        ("id", lid),
        ("level", level),
        ("type", "hoer"),
        ("situationDe", situation_de),
        ("situationAr", situation_ar),
        ("lines", [OrderedDict([("speaker", sp),("de", de),("ar", ar)]) for (sp,de,ar) in lines]),
        ("comprehension", [OrderedDict([("frage_de", q),("frage_ar", qa),("options", opts),("answer", ans),("erklaerung_ar", expl)]) for (q,qa,opts,ans,expl) in compr]),
    ])

new = [
    make(
        "d-a0-ht01", "A0",
        "Ansage am Bahnhof (Zugverspätung)",
        "إعلان في محطة القطار عن تأخير",
        [("Ansage","Achtung, Gleis 3! Der Regionalzug nach Bonn fährt heute zehn Minuten später.", "انتباه، الرصيف ٣! القطار الإقليمي إلى بون يتأخر اليوم عشر دقائق."),
         ("Ansage","Der Zug hält auch in Köln-Süd. Bitte steigen Sie erst ein, wenn der Zug steht.", "القطار يتوقف أيضاً في كولونيا-جنوب. الرجاء الصعود فقط بعد توقف القطار.")],
        [("Wie viele Minuten hat der Zug Verspätung?", "كم دقيقة تأخير القطار؟", ["zwei Minuten", "fünf Minuten", "zehn Minuten"], 2, "الإعلان يقول: zehn Minuten später (عشر دقائق).")]
    ),
    make(
        "d-a1-ht01", "A1",
        "Anrufbeantworter: Arztpraxis Dr. Lehmann",
        "جهاز الرد الآلي في عيادة الدكتورة ليمان",
        [("Anrufbeantworter","Sie haben die Praxis von Dr. Lehmann erreicht. Unsere Öffnungszeiten sind Montag bis Freitag von 8 bis 12 Uhr und Dienstag und Donnerstag von 15 bis 18 Uhr.", "اتصلت بعيادة د. ليمان. ساعات العمل من الإثنين إلى الجمعة ٨–١٢، الثلاثاء والخميس ١٥–١٨."),
         ("Anrufbeantworter","Bei akuten Schmerzen rufen Sie bitte den Notdienst unter der Nummer 116 117 an. Vielen Dank.", "في حال الألم الحاد اتصل بالطوارئ على ١١٦١١٧. شكراً.")],
        [("Wann ist die Praxis Dienstag Nachmittag geöffnet?", "متى تفتح العيادة الثلاثاء بعد الظهر؟", ["8–12 Uhr", "15–18 Uhr", "geschlossen"], 1, "الإعلان: Dienstag und Donnerstag 15–18 Uhr.")]
    ),
    make(
        "d-a1-ht02", "A1",
        "Radiomeldung: Wetter",
        "نشرة الأحوال الجوية في الراديو",
        [("Sprecherin","Guten Morgen, liebe Hörerinnen und Hörer! Heute bleibt es im Norden bewölkt mit etwas Regen bei 12 Grad.", "صباح الخير أيها المستمعون! الجو اليوم غائم مع مطر خفيف في الشمال ١٢ درجة."),
         ("Sprecherin","Im Süden scheint die Sonne bei bis zu 22 Grad. Am Wochenende gibt es überall Sonnenschein.", "في الجنوب تشرق الشمس وتصل الحرارة إلى ٢٢ درجة. عطلة نهاية الأسبوع مشمسة في كل المناطق.")],
        [("Wie ist das Wetter am Wochenende?", "كيف الجو في نهاية الأسبوع؟", ["Regen", "Sonnenschein", "Schnee"], 1, "النشرة: Am Wochenende gibt es überall Sonnenschein.")]
    ),
    make(
        "d-a2-ht01", "A2",
        "Ansage im Kaufhaus: Sonderangebot",
        "إعلان داخل متجر عن عرض خاص",
        [("Ansage","Sehr geehrte Kundinnen und Kunden! Heute erhalten Sie auf alle Winterjacken 30 Prozent Rabatt.", "أيها الزبائن الكرام! اليوم خصم ٣٠٪ على جميع معاطف الشتاء."),
         ("Ansage","Das Angebot gilt nur heute bis Ladenschluss um 20 Uhr. Bitte beachten Sie auch unsere neue Damenabteilung im ersten Stock.", "العرض ساري اليوم فقط حتى إغلاق المتجر الساعة ٢٠. زوروا قسم النساء الجديد في الطابق الأول.")],
        [("Wie viel Rabatt gibt es auf Winterjacken?", "كم الخصم على معاطف الشتاء؟", ["10 Prozent", "20 Prozent", "30 Prozent"], 2, "الإعلان: 30 Prozent Rabatt.")]
    ),
    make(
        "d-b1-ht01", "B1",
        "Radiomeldung: Streik im ÖPNV",
        "خبر في الراديو: إضراب النقل العام",
        [("Moderator","Am morgigen Dienstag werden Busse und Bahnen in der Stadt wegen eines Warnstreiks der Gewerkschaft Verdi nur eingeschränkt fahren.", "غداً الثلاثاء، ستسير الحافلات والقطارات في المدينة بشكل محدود بسبب إضراب تحذيري لنقابة فيردي."),
         ("Moderator","Besonders die U-Bahn-Linien U1 und U3 sind betroffen. Die S-Bahn soll nach Angaben der Deutschen Bahn fast vollständig fahren. Der Streik dauert von 4 bis 10 Uhr.", "خطوط المترو U1 وU3 هي الأكثر تأثراً، بينما قطارات الـS-Bahn تسير شبه كاملة حسب تصريحات دويتشه بان. الإضراب من الساعة ٤ حتى ١٠ صباحاً.")],
        [("Wie lange dauert der Streik?", "كم يستمر الإضراب؟", ["Eine Stunde", "Sechs Stunden", "Zwölf Stunden"], 1, "من ٤ إلى ١٠ = ٦ ساعات.")]
    ),
    make(
        "d-b1-ht02", "B1",
        "Ansage im Zug: Verspätung wegen Personen auf der Strecke",
        "إعلان في القطار: تأخير بسبب أشخاص على السكة",
        [("Zugführer","Sehr geehrte Fahrgäste, wir bitten die Verspätung von etwa 15 Minuten zu entschuldigen. Grund sind Personen auf der Strecke, die die Bundespolizei gerade wegschickt.", "أيها الركاب، نعتذر عن التأخير بنحو ١٥ دقيقة بسبب أشخاص على السكة وتقوم الشرطة الاتحادية بإبعادهم."),
         ("Zugführer","Wir erreichen den Hauptbahaussichtlich um 17:45 Uhr. Der Anschluss nach Hamburg ist dadurch gefährdet.", "سنصل المحطة الرئيسية حوالي ١٧:٤٥. ربط هامبورغ مهدد بسبب التأخير.")],
        [("Warum verspätet sich der Zug?", "لماذا القطار متأخر؟", ["Wegen einer technischen Störung", "Wegen Personen auf der Strecke", "Wegen schlechten Wetters"], 1, "المذكور: Personen auf der Strecke.")]
    ),
    make(
        "d-b2-ht01", "B2",
        "Radiomeldung: Klimaprotest blockiert Autobahn",
        "خبر في الراديو: احتجاج مناخي يغلق طريقاً سريعاً",
        [("Nachrichtensprecher","Aktivisten der Gruppe «Letzte Generation» haben heute Morgen die A100 in Berlin blockiert, indem sie sich auf der Fahrbahn festklebten.", "ناشطون من مجموعة «الجيل الأخير» أغلقوا الطريق السريع A100 في برلين صباحاً بلصق أنفسهم على الطريق."),
         ("Nachrichtensprecher","Die Polizei hat mit der Räumung begonnen. Bislang kam es zu einem Stau von etwa 14 Kilometern. Die A100 ist stadteinwärts seit 7 Uhr gesperrt, die Räumung wird voraussichtlich bis zum Mittag dauern.", "بدأت الشرطة بالإخلاء. الازدحام يبلغ ١٤ كيلومتراً. الطريق مغلق باتجاه المدينة منذ الساعة ٧ ومن المتوقع أن يستمر الإخلاء حتى الظهيرة.")],
        [("Wie lange wird die Räumung voraussichtlich dauern?", "متى يتوقع انتهاء الإخلاء؟", ["Bis 8 Uhr", "Bis zum Mittag", "Bis zum Abend"], 1, "المذكور: bis zum Mittag.")]
    ),
    make(
        "d-b2-ht02", "B2",
        "Anrufbeantworter: Firma Müller & Söhne (Kundenrückruf)",
        "جهاز الرد الآلي لشركة مولر وأبناء (ردّ مكالمة عميل)",
        [("Anrufbeantworter","Guten Tag, Sie haben die Firma Müller & Söhne erreicht. Heute ist Freitag, der 10. Oktober, unser Büro ist bereits geschlossen.", "نهاركم سعيد، لقد اتصلتم بشركة مولر وأبناء. اليوم الجمعة ١٠ تشرين الأول ومكتبنا مغلق."),
         ("Anrufbeantworter","Unsere Öffnungszeiten am Montag sind 8 bis 17 Uhr. In dringenden Fällen erreichen Sie unseren Notdienst unter der 0228-900 100. Vielen Dank für Ihr Verständnis.", "ساعات العمل الإثنين من ٨ حتى ١٧. في الحالات الطارئة اتصل بخدمة الطوارئ على ٠٢٢٨-٩٠٠١٠٠. شكراً لتفهمكم.")],
        [("Welche Nummer wählt man in dringenden Fällen?", "ما الرقم المطلوب في الحالات الطارئة؟", ["0228-900 100", "110", "112"], 0, "المذكور: 0228-900 100.")]
    ),
]

# support both dict and list shapes
if isinstance(d, list):
    existing = {x['id'] for x in d}
    for n in new:
        if n['id'] not in existing: d.append(n)
else:
    for n in new:
        if n['id'] not in d: d[n['id']] = n

json.dump(d, open('content/dialogues.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/dialogues.json','a',encoding='utf-8').write('\n')
print('Added', len(new), 'Hoertexte')
