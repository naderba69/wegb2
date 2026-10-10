#!/usr/bin/env python3
"""R140i: add 1 additional Schreibaufgabe per level (5 total) and expand Eselsbrücken."""
import json
from collections import OrderedDict
w = json.load(open('content/writing.json',encoding='utf-8'))

new = [
    OrderedDict([("id","w-a0-06"),("level","A0"),
        ("titleDe","Sich vorstellen (Postkarte)"),("titleAr","تقديم النفس (بطاقة بريدية)"),
        ("taskDe","Schreiben Sie 3–4 Sätze auf einer Postkarte: Name, Alter, Wohnort und Hobby."),
        ("taskAr","اكتب ٣–٤ جمل على بطاقة بريدية: الاسم، العمر، السكن، والهواية."),
        ("criteria",["اسمك واضح","العمر مع Jahre alt","مكان السكن mit in …","هواية واحدة بسيطة"]),
        ("sample","Hallo! Ich heiße Sara. Ich bin 22 Jahre alt. Ich wohne in Tunis. Ich schwimme gern."),
        ("noteAr",["استخدم جملاً بسيطة جداً في A0؛ لا تحتاج إلى موصولات أو جمل ثانوية."]),
        ("zielWort",25)]),
    OrderedDict([("id","w-a1-13"),("level","A1"),
        ("titleDe","Einladung zum Geburtstag"),("titleAr","دعوة عيد ميلاد"),
        ("taskDe","Schreiben Sie an Ihre Freundin Ayşe eine E-Mail (ca. 40 Wörter): Einladung zur Geburtstagsfeier – wann? wo? was soll sie mitbringen?"),
        ("taskAr","اكتب إيميلاً لصديقتك عائشة (حوالي ٤٠ كلمة): ادعُها لحفلة عيد ميلادك – متى؟ أين؟ ماذا تحضر معها؟"),
        ("criteria",["Anrede + Grußformel","Ort und Termin genannt","Bitte um Mitbringen / Antwort","Zeit: ca. 40 Wörter"]),
        ("sample","Liebe Ayşe, ich habe am Samstag Geburtstag und mache eine Party. Die Party beginnt um 18 Uhr bei mir zu Hause, Goethestraße 5. Kannst du kommen? Bitte sag mir bis Donnerstag Bescheid. Bring bitte deine neue CD mit! Viele Grüße, Deine Lena."),
        ("noteAr",["الموعد يسبق المكان عادة؛ اذكر العنوان في سطر واحد أو اثنين."]),
        ("zielWort",40)]),
    OrderedDict([("id","w-a2-12"),("level","A2"),
        ("titleDe","Beschwerde an Hotel"),("titleAr","شكوى إلى الفندق"),
        ("taskDe","Schreiben Sie an ein Hotel in München (ca. 80 Wörter): Sie waren letztes Wochenende dort – das Zimmer war kalt, das WLAN funktionierte nicht – bitten Sie um Entschuldigung / Teilrückerstattung."),
        ("taskAr","اكتب لفندق في ميونخ (حوالي ٨٠ كلمة): كنت هناك نهاية الأسبوع الماضي، الغرفة كانت باردة والواي فاي لا يعمل، اطلب اعتذاراً واسترداداً جزئياً."),
        ("criteria",["Betreffzeile","Sachliche Beschreibung (2 Probleme)","Konkrete Forderung","Freundliche Schlussformel"]),
        ("sample","Sehr geehrte Damen und Herren, ich war vom 3. bis 5. Oktober in Ihrem Hotel (Zimmer 214). Leider war das Zimmer sehr kalt, die Heizung funktionierte nicht. Außerdem hatte ich kein WLAN. Ich bitte um eine Entschuldigung und eine Rückerstattung von 50 Euro. Mit freundlichen Grüßen, Ali Mahdi."),
        ("noteAr",["Bleiben Sie sachlich – keine Emotionen. Konkrete Daten machen die Beschwerde glaubwürdig."]),
        ("zielWort",80)]),
    OrderedDict([("id","w-b1-13"),("level","B1"),
        ("titleDe","Meinung: Handyverbot in der Schule?"),("titleAr","رأي: هل يُمنع الهاتف في المدرسة؟"),
        ("taskDe","Schreiben Sie einen Forumsbeitrag (ca. 110 Wörter): Sind Sie für oder gegen ein Handyverbot in Schulen? Nennen Sie zwei Argumente und ein Beispiel."),
        ("taskAr","اكتب مشاركة منتدى (حوالي ١١٠ كلم): هل تؤيد أو تعارض منع الهاتف في المدارس؟ اذكر حجتين ومثالاً."),
        ("criteria",["Klare Position (Pro oder Contra)","Zwei Argumente mit Begründung","Konkretes Beispiel","Schlüssiger Schluss"]),
        ("sample","Ich bin für ein Handyverbot in der Schule, denn Handys lenken Schüler vom Unterricht ab. Viele Schüler schreiben während der Stunde Nachrichten oder schauen Videos – das stört die Konzentration. Ein Beispiel: In meiner alten Schule waren Handys erlaubt, aber viele Lehrer beschwerten sich, dass die Noten schlechter wurden. Natürlich kann ein Handy im Notfall nützlich sein; trotzdem überwiegen die Nachteile. Meiner Meinung nach sollten Handys in der Schultasche bleiben."),
        ("noteAr",["استخدم meiner Meinung nach / aus meiner Sicht لتحديد موقفك وأدوات الربط (denn, trotzdem, natürlich)."]),
        ("zielWort",110)]),
    OrderedDict([("id","w-b2-14"),("level","B2"),
        ("titleDe","Kommentar: Homeoffice – Chance oder Risiko?"),("titleAr","تعليق: العمل من البيت فرصة أم خطر؟"),
        ("taskDe","Schreiben Sie einen Kommentar für eine Online-Zeitung (ca. 160 Wörter): Vorteile und Risiken des Homeoffice für Arbeitnehmer und Arbeitgeber. Beziehen Sie klar Stellung."),
        ("taskAr","اكتب تعليقاً لصحيفة إلكترونية (حوالي ١٦٠ كلمة): إيجابيات ومخاطر العمل عن بُعد للموظفين وأصحاب العمل. عبّر عن موقف واضح."),
        ("criteria",["These erkennbar","Mind. zwei Pro- und zwei Contra-Argumente","Differenzierte Wortwahl","Schlüssige Schlussfolgerung"]),
        ("sample","Das Homeoffice hat die Arbeitswelt nachhaltig verändert – und das ist nicht nur positiv. Einerseits profitieren Arbeitnehmer von mehr Flexibilität: sie sparen den Pendelweg und können Familie und Beruf besser vereinbaren. Andererseits verschwimmen die Grenzen zwischen Arbeit und Privatleben, was zu Erschöpfung führen kann. Arbeitgeber wiederum sparen Büroflächen, doch riskieren sie den Verlust informellen Austauschs und damit der Teamkultur. Meiner Überzeugung nach ist eine Mischform – zwei bis drei Tage im Büro, Rest im Homeoffice – die zukunftsfähigste Lösung: sie kombiniert Flexibilität mit sozialem Zusammenhalt."),
        ("noteAr",["التعليق الصحفي يحتاج إلى أطروحة واضحة في البداية وحكم ختامي. استخدم einerseits/andererseits للتفريق."]),
        ("zielWort",160)]),
]
existing = {x['id'] for x in w}
for n in new:
    if n['id'] not in existing: w.append(n)
json.dump(w, open('content/writing.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/writing.json','a',encoding='utf-8').write('\n')
print('writing now:', {lv:len([x for x in w if x['level']==lv]) for lv in ['A0','A1','A2','B1','B2']})

# Eselsbrücken
e = json.load(open('content/eselsbruecken.json',encoding='utf-8'))
more_es = [
    OrderedDict([("id","es-b2-16"),("level","B2"),("stichwort","der/das/das Nutzen"),
        ("text_de","«Der Nutzen» (الفائدة/النفع) مذكّر. تذكَّر: «der Nutzen» نون، «das Nutzen» غير صحيحة."),
        ("text_ar","Nutzen بمعنى الفائدة مذكّر der، وينتهي بـ-en لكنه ليس مصدراً محايداً هنا.")]),
    OrderedDict([("id","es-b2-17"),("level","B2"),("stichwort","das Komma vor und/oder"),
        ("text_de","قبل und/oder لا فاصلة عادة إلا بين جملتين كاملتين بفاعلين مختلفين."),
        ("text_ar","لا فاصلة قبل und/oder في جملة بسيطة؛ فقط بين Hauptsätze مستقلين.")]),
]
if isinstance(e, dict):
    e2 = e.get('entries', list(e.values()))
else:
    e2 = e
existing_e = {x['id'] for x in e2}
for x in more_es:
    if x['id'] not in existing_e: e2.append(x)
if isinstance(e,dict):
    e['entries']=e2
else:
    e=e2
json.dump(e, open('content/eselsbruecken.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/eselsbruecken.json','a',encoding='utf-8').write('\n')
print('eselsbruecken total:', len(e2))
