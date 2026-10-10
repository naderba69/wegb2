#!/usr/bin/env python3
"""R139: add more writing tasks for B1/B2 balance + A1 to reach 12 per level for higher levels."""
import json
from collections import OrderedDict, Counter

NEUE = [
    # A1 additional
    OrderedDict([("id","w-a1-11"),("level","A1"),
        ("titleDe","Mein Wochenplan"),("titleAr","برنامج أسبوعي"),
        ("taskDe","Schreibe 8–10 Sätze über deinen typischen Wochenablauf: Wann stehst du auf? Was machst du am Montag/Dienstag/...? Was machst du am Wochenende?"),
        ("taskAr","اكتب 8–10 جمل عن أسبوعك المعتاد: متى تستيقظ؟ ماذا تفعل أيام الاثنين/الثلاثاء…؟ ماذا تفعل في العطلة؟"),
        ("criteria",["8 جمل على الأقل","أيام الأسبوع مذكورة","أوقات صحيحة (um … Uhr)","أفعال في المضارع صحيحة"]),
        ("sample","Am Montag stehe ich um 7 Uhr auf. Ich trinke Kaffee und gehe zur Arbeit."),
        ("noteAr","استعمل «am Montag», «am Wochenende», «um … Uhr»."),
        ("zielWort",80),
    ]),
    OrderedDict([("id","w-a1-12"),("level","A1"),
        ("titleDe","Mein Lieblingsort"),("titleAr","مكاني المفضل"),
        ("taskDe","Beschreibe deinen Lieblingsort: Wo ist er? Warum gefällt er dir? Was machst du dort?"),
        ("taskAr","صِف مكانك المفضل: أين هو؟ لماذا يعجبك؟ ماذا تفعل هناك؟"),
        ("criteria",["وصف المكان","ذكر السبب","استخدام weil","صفات بسيطة"]),
        ("sample","Mein Lieblingsort ist der Park in meiner Stadt. Ich gehe gern dorthin, weil es dort ruhig ist."),
        ("noteAr","حاول استخدام weil في جملة واحدة."),
        ("zielWort",80),
    ]),
    # B1 additional — reaches 12
    OrderedDict([("id","w-b1-11"),("level","B1"),
        ("titleDe","Beschwerde-E-Mail an ein Online-Geschäft"),("titleAr","رسالة شكوى لمتجر إلكتروني"),
        ("taskDe","Du hast vor einer Woche online ein Smartphone bestellt. Es ist angekommen, aber das Display hat einen Kratzer. Schreibe eine E-Mail an den Kundenservice (ca. 100 Wörter): Grund für die Beschwerde, was passiert ist, was du verlangst (Umtausch/Rückerstattung), Frist."),
        ("taskAr","اشتريت هاتفاً ذكياً قبل أسبوع عبر الإنترنت، وعند وصوله وجدت خدشاً على الشاشة. اكتب رسالة إلى خدمة الزبائن (حوالي 100 كلمة): سبب الشكوى، ماذا حدث، ماذا تطلب (استبدال/استرداد)، ومهلة."),
        ("criteria",["تحية ونهاية رسمية","وصف المشكلة ووقتها","مطلب واضح (تبديل/استرداد)","نبرة مهذبة وحازمة"]),
        ("sample","Sehr geehrte Damen und Herren, vor einer Woche habe ich in Ihrem Online-Shop ein Smartphone bestellt. Als das Paket ankam, stellte ich fest, dass …"),
        ("noteAr","استخدم «als» و«dass» في جمل ثانوية."),
        ("zielWort",110),
    ]),
    OrderedDict([("id","w-b1-12"),("level","B1"),
        ("titleDe","Meine Meinung zum Lernen mit Apps"),("titleAr","رأيي في التعلّم بالتطبيقات"),
        ("taskDe","Schreibe einen Forumsbeitrag (ca. 100 Wörter) über das Sprachenlernen mit Apps: Vor- und Nachteile, deine Erfahrung, Empfehlung."),
        ("taskAr","اكتب مشاركة منتدى (100 كلمة) عن تعلّم اللغات عبر التطبيقات: إيجابيات وسلبيات، تجربتك، توصية."),
        ("criteria",["مقدمة وعرض وخاتمة","إيجابيتان وسلبيتان","تجربة شخصية","رأي معلَّل بـweil/meiner Meinung nach"]),
        ("sample","Immer mehr Menschen lernen Sprachen mit Apps wie Duolingo oder Babbel. Meiner Meinung nach hat das Vorteile, aber auch Nachteile …"),
        ("noteAr","استخدم Konnektoren: einerseits/andererseits/obwohl."),
        ("zielWort",110),
    ]),
    # B2 additional — reaches 13
    OrderedDict([("id","w-b2-12"),("level","B2"),
        ("titleDe","Kommentar zur Digitalisierung an Schulen"),("titleAr","تعليق حول الرقمنة في المدارس"),
        ("taskDe","Schreibe einen Kommentar (ca. 150 Wörter) für eine Online-Zeitung: Welche Chancen und Risiken birgt die Digitalisierung in Schulen? Nenne mindestens zwei Argumente pro und zwei contra sowie ein Beispiel. Schließe mit deiner begründeten Meinung."),
        ("taskAr","اكتب تعليقاً (150 كلمة) لجريدة إلكترونية عن فرص ومخاطر الرقمنة في المدارس. اذكر حجتين مؤيدتين وحجتين معارضتين على الأقل مع مثال، واختم برأيك المُعلَّل."),
        ("criteria",["بنية Kommentar واضحة","2 pro/2 contra mit Konzessivsatz","مثال ملموس","رأي ختامي مبرَّر","مستوى B2: Konjunktiv II / Nebensätze / Nominalstil"]),
        ("sample","Die Digitalisierung der Schulen wird seit Jahren kontrovers diskutiert. Befürworter argumentieren, dass … Kritiker hingegen warnen, dass …"),
        ("noteAr","استخدم: Einerseits/Andererseits, Obwohl/Trotz, Aus meiner Sicht, Zusammenfassend."),
        ("zielWort",160),
    ]),
    OrderedDict([("id","w-b2-13"),("level","B2"),
        ("titleDe","Formelle Beschwerde an den Vermieter"),("titleAr","شكوى رسمية للمؤجِّر"),
        ("taskDe","Seit Wochen ist die Heizung in deiner Wohnung defekt. Du hast den Vermieter bereits zweimal telefonisch informiert, aber nichts passiert. Schreibe einen formellen Brief (ca. 150 Wörter) mit genauer Schilderung, Verweis auf frühere Meldungen, angemessener Frist (14 Tage) und Ankündigung von Rechtsmitteln (Mietminderung) bei Nichterfüllung."),
        ("taskAr","التدفئة معطلة في شقتك منذ أسابيع، وأبلغتَ المؤجِّر هاتفياً مرتين ولم يحدث شيء. اكتب رسالة رسمية (150 كلمة) تصف فيها المشكلة بدقة، تشير إلى البلاغات السابقة، تحدد مهلة 14 يوماً، وتعلن اللجوء إلى تخفيض الإيجار إن لم تُحَل المشكلة."),
        ("criteria",["تنسيق رسمي كامل (تاريخ، عنوان، تحية، توقيع)","سرد زمني للمشكلة","إشارة إلى بلاغات سابقة بالتواريخ","مهلة واضحة وتحذير قانوني","لغة مهذبة وحازمة في آن واحد"]),
        ("sample","Sehr geehrter Herr Müller, ich schreibe Ihnen bezüglich der Heizung in meiner Wohnung in der Schillerstraße 14. Seit dem 11. Oktober funktioniert die Heizung im Wohnzimmer nicht mehr …"),
        ("noteAr","استخدم: bezüglich, trotz wiederholter Anfrage, mit Bedauern stelle ich fest, ich setze Ihnen eine Frist bis zum …"),
        ("zielWort",160),
    ]),
]

w = json.load(open('content/writing.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing = {x['id'] for x in w}
added = 0
for x in NEUE:
    if x['id'] not in existing:
        w.append(x); added += 1
with open('content/writing.json','w',encoding='utf-8') as f:
    json.dump(w,f,ensure_ascii=False,indent=2); f.write('\n')
print(f"Added {added} writing tasks (total {len(w)})")
print("Per level:", dict(Counter(x['level'] for x in w)))
