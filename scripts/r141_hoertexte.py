#!/usr/bin/env python3
"""R141a: add 7 more Hoertexte to balance ~3 per level."""
import json
from collections import OrderedDict, Counter

d = json.load(open('content/dialogues.json',encoding='utf-8'))

def mk(lid, lv, sit_de, sit_ar, lines, comps):
    return OrderedDict([
        ("id", lid), ("level", lv), ("type", "hoer"),
        ("situationDe", sit_de), ("situationAr", sit_ar),
        ("lines", [OrderedDict([("speaker", sp), ("de", de), ("ar", ar)]) for (sp, de, ar) in lines]),
        ("comprehension", [OrderedDict([("frage_de", q), ("frage_ar", qa), ("options", o), ("answer", a), ("erklaerung_ar", ex)]) for (q, qa, o, a, ex) in comps]),
    ])

new = []
new.append(mk("d-a0-ht02", "A0",
    "Im Supermarkt: Ansage", "إعلان داخل السوبرماركت",
    [("Ansage", "Liebe Kunden! Heute sind die Bananen im Angebot: ein Kilo für einen Euro. Bitte bezahlen Sie an der Kasse.",
      "أيها الزبائن! الموز اليوم في العرض: كيلو بيورو واحد. الرجاء الدفع عند الصندوق.")],
    [("Was kostet ein Kilo Bananen heute?", "كم سعر كيلو الموز اليوم؟", ["zwei Euro", "ein Euro", "fünfzig Cent"], 1, "الإعلان يقول 1€.")]))
new.append(mk("d-a0-ht03", "A0",
    "Im Café: Bestellung", "طلب في المقهى",
    [("Kellner", "Guten Tag! Was möchten Sie?", "نهاركم سعيد، ماذا تريدون؟"),
     ("Gast", "Einen Kaffee, bitte. Mit Milch und Zucker.", "قهوة من فضلك، مع حليب وسكر."),
     ("Kellner", "Sonst noch etwas?", "أي شيء آخر؟"),
     ("Gast", "Nein, danke.", "لا، شكراً.")],
    [("Was bestellt der Gast?", "ماذا طلب الزبون؟", ["Tee", "Kaffee mit Milch und Zucker", "Wasser"], 1, "الزبون طلب Kaffee mit Milch und Zucker.")]))
new.append(mk("d-a1-ht03", "A1",
    "Ansage am Bahnsteig: Zug fährt ab", "إعلان على رصيف القطار",
    [("Ansage", "Achtung, Gleis 5! Der ICE 621 nach Frankfurt fährt in 5 Minuten ab. Wagen 15 bis 21 stehen im hinteren Bereich. Vorsicht bei der Einfahrt!",
      "انتباه، الرصيف 5! قطار ICE 621 إلى فرانكفورت سينطلق بعد 5 دقائق. العربات 15–21 في الخلف. انتبهوا عند دخول القطار."),
     ("Ansage", "Wir wünschen Ihnen eine angenehme Reise.", "نتمنى لكم رحلة سعيدة.")],
    [("Auf welchem Gleis fährt der ICE ab?", "على أي رصيف ينطلق القطار؟", ["Gleis 1", "Gleis 5", "Gleis 15"], 1, "الإعلان يقول Gleis 5.")]))
new.append(mk("d-a2-ht02", "A2",
    "Anrufbeantworter: Nachricht von der VHS", "رسالة من مركز تعليم الكبار",
    [("Frau Becker", "Hallo Ahmed, hier ist Sabine Becker von der Volkshochschule. Ihr Kurs beginnt am kommenden Montag um 18 Uhr in Raum 304. Bitte bringen Sie Ihr Buch und einen Stift mit. Rückfragen unter 0221-4711.",
      "مرحباً أحمد، معكِ زابينه بيكر من مركز تعليم الكبار. دورتك تبدأ الإثنين القادم الساعة 18 في القاعة 304. أحضر كتابك وقلم. للأسئلة اتصل على 0221-4711.")],
    [("Was soll Ahmed mitbringen?", "ماذا يجب أن يحضر أحمد؟", ["Seinen Pass", "Buch und Stift", "Nur Geld"], 1, "الرسالة: Buch und Stift.")]))
new.append(mk("d-a2-ht03", "A2",
    "Radiomeldung: Unfall auf der A3", "خبر: حادث على الطريق السريع A3",
    [("Sprecher", "Die Polizei meldet einen Unfall auf der A3 zwischen Köln und Bonn in Fahrtrichtung Süden. Drei Fahrzeuge sind beteiligt, die linke Spur ist gesperrt. Es gibt zur Zeit einen Stau von acht Kilometern. Autofahrer werden gebeten, bei Lohmar auszufahren.",
      "تُبلغ الشرطة عن حادث على A3 بين كولونيا وبون باتجاه الجنوب. اشتركت فيه 3 سيارات، المسار الأيسر مغلق، والازدحام 8 كم. يُرجى الخروج عند لومار.")],
    [("Warum sollen Autofahrer bei Lohmar ausfahren?", "لماذا الخروج عند لومار؟", ["Wegen Stau nach Unfall", "Wegen Baustelle", "Wegen Kontrolle"], 0, "بسبب الحادث والازدحام.")]))
new.append(mk("d-b1-ht03", "B1",
    "Interview mit Umweltschützerin", "مقابلة مع ناشطة بيئية",
    [("Moderator", "Frau Neumann, Sie protestieren gegen die neue Autobahn durch den Wald. Warum?",
      "السيدة نويمان، لماذا تحتجين على الطريق السريع الجديد عبر الغابة؟"),
     ("Frau Neumann", "Der Wald ist ein wichtiger CO₂-Speicher und Lebensraum für viele Tiere. Statt neuer Autobahnen brauchen wir mehr Bus und Bahn. Die Regierung sollte in den ÖPNV investieren.",
      "الغابة مخزن مهم لثاني أكسيد الكربون ومسكن للحيوانات. نحتاج حافلات وقطارات أكثر لا طرقاً جديدة. على الحكومة الاستثمار في النقل العام."),
     ("Moderator", "Aber die Autobahn würde den Verkehr entlasten.", "لكن الطريق سيُخفف الزحام."),
     ("Frau Neumann", "Studien zeigen: Neue Straßen ziehen mehr Autos an – nach fünf Jahren ist der Stau zurück. Nur öffentlicher Verkehr hilft dauerhaft.",
      "الطرق الجديدة تجذب سيارات أكثر فيعود الازدحام بعد 5 سنوات. النقل العام وحده هو الحل الدائم.")],
    [("Was schlägt Frau Neumann vor?", "ماذا تقترح نويمان؟", ["Mehr Autobahnen", "Mehr ÖPNV", "Weniger Radwege"], 1, "تقترح الاستثمار في النقل العام.")]))
new.append(mk("d-b2-ht03", "B2",
    "Wissenschaftsmeldung: KI am Arbeitsmarkt", "خبر علمي: الذكاء الاصطناعي وسوق العمل",
    [("Sprecher", "Laut einer IAB-Studie wird KI bis 2030 etwa 1,5 Millionen Arbeitsplätze in Deutschland verändern. Wegfallen werden davon nur rund 300.000; neue Stellen entstehen vor allem in Datenanalyse und Softwareentwicklung. Besonders betroffen sind Büroberufe und einfache Verwaltungsaufgaben. Die Forscher empfehlen mehr Weiterbildung für Beschäftigte über 45.",
      "وفقاً لدراسة معهد IAB، سيُغيّر الذكاء الاصطناعي حتى 2030 نحو 1.5 مليون وظيفة في ألمانيا. منها 300 ألف ستفقد، ووظائف جديدة في تحليل البيانات والبرمجة. الأكثر تضرراً وظائف المكاتب والمهام الإدارية. يُنصح بتدريب العاملين فوق 45 عاماً.")],
    [("Wie viele Jobs werden laut Studie BIS 2030 WEGFALLEN?", "كم وظيفة ستفقد حتى 2030؟",
      ["1,5 Millionen", "ca. 300.000", "keine"], 1, "300 ألف فقط، أما 1.5 مليون فالمتغير لا الفاقد.")]))

existing = {x.get('id') for x in d}
for n in new:
    if n['id'] not in existing:
        d.append(n)

json.dump(d, open('content/dialogues.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/dialogues.json','a',encoding='utf-8').write('\n')

c, h = Counter(), Counter()
for x in d:
    c[x.get('level','?')] += 1
    if x.get('type')=='hoer': h[x.get('level','?')] += 1
print('dialogues total:', dict(c))
print('hoer per level:', dict(h))
