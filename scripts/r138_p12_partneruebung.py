#!/usr/bin/env python3
"""
P-12: Partnerübung (Diskussion mit Partner) — dialogue-prompt cards for B1/B2.
These teach the third Sprechen teil of Goethe B1/B2: contact talk + monologue + Diskussion/Partneraufgabe.
Each card has:
- situationDe/Ar (e.g. "Wollen wir am Wochenende zusammen kochen?")
- optionA, optionB (two Vorschläge to negotiate)
- redemittelList (helpful phrases: Ich schlage vor … / Meinst du nicht, dass … / Einverstanden / Ich bin dagegen, weil …)
"""
import json
from collections import OrderedDict

partner = [
    OrderedDict([
        ("id", "p-b1-01"),
        ("level", "B1"),
        ("situationDe", "Sie und Ihr Kollege möchten am Freitag nach der Arbeit zusammen essen gehen."),
        ("situationAr", "تريد أنت وزميلك تناول الطعام معاً الجمعة بعد العمل. تفاهَما على المكان والوقت والطعام."),
        ("vorschlagA", "Italienisches Restaurant um 19 Uhr"),
        ("vorschlagB", "Imbiss um 18 Uhr (schnell, günstig)"),
        ("redemittel", ["Ich schlage vor, …","Was hältst du von …?","Einverstanden!","Tut mir leid, aber ich kann nicht, weil …","Das passt mir gut."]),
        ("tippAr", "ابدأ بعرض، ثم اسأل رأي الزميل، واتفقا على حل وسط. لا تنسَ التحية في البداية والختام.")
    ]),
    OrderedDict([
        ("id", "p-b1-02"),
        ("level", "B1"),
        ("situationDe", "Sie und Ihr Freund/Ihre Freundin planen einen Wochenendausflug."),
        ("situationAr", "تخطط أنت وصديقك لرحلة نهاية أسبوع."),
        ("vorschlagA", "Wandern in den Bergen"),
        ("vorschlagB", "Städtetrip nach Hamburg"),
        ("redemittel", ["Lass uns …","Ich würde lieber …","Meiner Meinung nach …","Das ist eine gute Idee, aber …","Einigen wir uns auf …"]),
        ("tippAr", "قدّم اقتراحك وبرّره بجملة weil، واعترض مهذباً، وصِفا الحل الذي اتفقتما عليه.")
    ]),
    OrderedDict([
        ("id", "p-b1-03"),
        ("level", "B1"),
        ("situationDe", "Sie möchten zusammen mit Ihrem Nachbarn eine Party im Hausflur organisieren."),
        ("situationAr", "تريد تنظيم حفلة مع جارك في مدخل البيت."),
        ("vorschlagA", "Samstag um 20 Uhr, laute Musik"),
        ("vorschlagB", "Freitag um 18 Uhr, ruhig mit Nachbarn einladen"),
        ("redemittel", ["Ich würde vorschlagen …","Hast du etwas dagegen, wenn …?","Ich habe eine Bitte: …","Das finde ich nicht gut, weil …"]),
        ("tippAr", "ناقش: متى؟ الموسيقى؟ هل تدعو الجيران؟ اتّفق على قرار واسبُره.")
    ]),
    OrderedDict([
        ("id", "p-b2-01"),
        ("level", "B2"),
        ("situationDe", "Diskutieren Sie mit Ihrem Partner / Ihrer Partnerin, ob man in der Stadt Autos verbieten sollte."),
        ("situationAr", "ناقش مع شريكك: هل يجب منع السيارات من وسط المدينة؟"),
        ("vorschlagA", "Autos in der Innenstadt verbieten, mehr Fahrradwege"),
        ("vorschlagB", "Autos erlauben, aber strengere Emissionsnormen"),
        ("redemittel", ["Ich bin der Meinung, dass …","Da stimme ich dir nicht zu, weil …","Andererseits …","Einerseits … andererseits …","Um einen Kompromiss zu finden, könnten wir …"]),
        ("tippAr", "قدّم حجتين مؤيدتين وحجتين معارضتين، واتفقا على حل وسط.")
    ]),
    OrderedDict([
        ("id", "p-b2-02"),
        ("level", "B2"),
        ("situationDe", "Sie planen einen Klassenausflug mit Ihrer Deutschkursgruppe."),
        ("situationAr", "تخطط لرحلة صف مع مجموعة دروس الألمانية."),
        ("vorschlagA", "Besuch eines Museums (z.B. Technik-Museum)"),
        ("vorschlagB", "Picknick und Grillen am See"),
        ("redemittel", ["Ich möchte einen Vorschlag machen.","Obwohl … ist, bin ich für …","Das überzeugt mich nicht ganz.","Ein guter Kompromiss wäre …"]),
        ("tippAr", "استخدم obwohl/obgleich und حججاً مضادة، وصِغ اتفاقية واضحة.")
    ]),
    OrderedDict([
        ("id", "p-b2-03"),
        ("level", "B2"),
        ("situationDe", "Sie diskutieren, ob soziale Medien für Jugendliche unter 16 verboten werden sollten."),
        ("situationAr", "ناقش: هل تُمنَع وسائل التواصل الاجتماعي عن المراهقين دون السادسة عشرة؟"),
        ("vorschlagA", "Verbot unter 16 Jahren"),
        ("vorschlagB", "Kein Verbot, sondern Medienkompetenz in der Schule"),
        ("redemittel", ["Aus meiner Sicht …","Gegen diese Ansicht spricht, dass …","Man muss auch bedenken, dass …","Meines Erachtens wäre es besser, …"]),
        ("tippAr", "استخدم تعابير مهذبة للاعتراض und mindestens einen Konzessivsatz (obwohl/trotz/auch wenn).")
    ]),
]

out = 'content/muendlich.json'
try:
    existing = json.load(open(out), object_pairs_hook=OrderedDict)
except FileNotFoundError:
    existing = OrderedDict([("version",1),("partner",[])])
if not isinstance(existing, dict):
    existing = OrderedDict([("version",1),("partner",[])])
if "partner" not in existing:
    existing["partner"]=[]
existing_ids = {p['id'] for p in existing['partner']}
added=0
for p in partner:
    if p['id'] not in existing_ids:
        existing['partner'].append(p)
        added+=1

with open(out,'w',encoding='utf-8') as f:
    json.dump(existing,f,ensure_ascii=False,indent=2)
    f.write('\n')
print(f'Partnerübungen: {added} hinzugefügt. Total: {len(existing["partner"])}')
