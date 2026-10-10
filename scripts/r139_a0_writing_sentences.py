#!/usr/bin/env python3
"""R139: fill A0 writing (more of them) + A0 sentences."""
import json
from collections import OrderedDict, Counter

WRITING_A0 = [
    OrderedDict([("id","w-a0-03"),("level","A0"),
        ("titleDe","Mich vorstellen (5 Sätze)"),("titleAr","تقديم نفسي (5 جمل)"),
        ("taskDe","Schreibe 5 einfache Sätze über dich: Name, Alter, Herkunft, Wohnort, Beruf/Studium. Nutze \"ich heiße\", \"ich bin\", \"ich komme aus\", \"ich wohne in\", \"ich bin (Beruf)\"."),
        ("taskAr","اكتب 5 جمل بسيطة عن نفسك: الاسم، العمر، البلد، السكن، المهنة/الدراسة. استخدم «اسمي»، «عمري»، «أنا من»، «أسكن في»، «أعمل/أدرس»."),
        ("criteria",["5 جمل بسيطة","استخدام sein/heißen/kommen/wohnen","جندر واضح للأسماء","علامات ترقيم صحيحة"]),
        ("sample","Ich heiße Layla. Ich bin 24 Jahre alt. Ich komme aus Syrien. Ich wohne in Köln. Ich bin Studentin."),
        ("noteAr","لا داعي لجمل طويلة. جملة واحدة قصيرة لكل نقطة كافية."),
        ("zielWort",25),
    ]),
    OrderedDict([("id","w-a0-04"),("level","A0"),
        ("titleDe","Meine Familie"),("titleAr","عائلتي"),
        ("taskDe","Schreibe 4–6 Sätze über deine Familie: Wie viele Personen? Wie heißen sie? Wie alt sind sie? Was machen sie beruflich?"),
        ("taskAr","اكتب 4–6 جمل عن عائلتك: كم فرداً؟ أسماؤهم؟ أعمارهم؟ مهنهم؟"),
        ("criteria",["4 جمل على الأقل","استخدام mein/meine","مهن مذكورة","أفعال بسيطة في زمن المضارع"]),
        ("sample","Meine Familie hat vier Personen. Das ist mein Vater, meine Mutter, mein Bruder und ich. Mein Vater ist Arzt. Meine Mutter ist Hausfrau."),
        ("noteAr","استعمل «das ist» أو «mein/meine»."),
        ("zielWort",30),
    ]),
    OrderedDict([("id","w-a0-05"),("level","A0"),
        ("titleDe","Zahlen und Farben"),("titleAr","الأرقام والألوان"),
        ("taskDe","Schreibe die Zahlen von 1 bis 20 auf Deutsch und nenne zu 5 Farben ein Beispiel (der Himmel ist blau usw.)."),
        ("taskAr","اكتب الأرقام من 1 إلى 20 بالألمانية، ثم اذكر 5 ألوان مع مثال لكل لون (السماء زرقاء…)."),
        ("criteria",["الأرقام 1–20 صحيحة","5 ألوان مع مثال","جنس الاسم في المثال صحيح"]),
        ("sample","eins, zwei, drei … zwanzig. Das Gras ist grün. Der Himmel ist blau."),
        ("noteAr","انتبه إلى جنس الأسماء: der/die/das في الأمثلة."),
        ("zielWort",30),
    ]),
]

SENTENCES_A0 = [
    OrderedDict([("id","s-a0-16"),("level","A0"),("de","Hallo! Wie geht es dir?"),("ar","مرحباً! كيف حالك؟"),("tags",["begrüßung"])]),
    OrderedDict([("id","s-a0-17"),("level","A0"),("de","Danke, es geht mir gut."),("ar","شكراً، أنا بخير."),("tags",["begrüßung"])]),
    OrderedDict([("id","s-a0-18"),("level","A0"),("de","Entschuldigung, wo ist die Toilette?"),("ar","عفواً، أين دورة المياه؟"),("tags",["fragen","ort"])]),
    OrderedDict([("id","s-a0-19"),("level","A0"),("de","Ich verstehe nicht. Langsamer bitte!"),("ar","لا أفهم. أبطأ من فضلك!"),("tags",["kommunikation"])]),
    OrderedDict([("id","s-a0-20"),("level","A0"),("de","Wie bitte? Können Sie das wiederholen?"),("ar","عفواً؟ هل يمكنك إعادة ذلك؟"),("tags",["kommunikation"])]),
    OrderedDict([("id","s-a0-21"),("level","A0"),("de","Ich habe Hunger und Durst."),("ar","أنا جائع وعطشان."),("tags",["bedürfnisse"])]),
    OrderedDict([("id","s-a0-22"),("level","A0"),("de","Wie viel kostet das?"),("ar","كم يكلف هذا؟"),("tags",["einkauf"])]),
    OrderedDict([("id","s-a0-23"),("level","A0"),("de","Ich möchte bitte einen Kaffee."),("ar","أريد قهوة من فضلك."),("tags",["bestellen"])]),
    OrderedDict([("id","s-a0-24"),("level","A0"),("de","Wo wohnst du?"),("ar","أين تسكن؟"),("tags",["wohnen","fragen"])]),
    OrderedDict([("id","s-a0-25"),("level","A0"),("de","Ich wohne in Berlin."),("ar","أسكن في برلين."),("tags",["wohnen"])]),
    OrderedDict([("id","s-a0-26"),("level","A0"),("de","Welche Sprachen sprichst du?"),("ar","أي لغات تتكلم؟"),("tags",["sprachen","fragen"])]),
    OrderedDict([("id","s-a0-27"),("level","A0"),("de","Ich spreche Arabisch, Französisch und ein bisschen Deutsch."),("ar","أتكلم العربية والفرنسية وقليلاً من الألمانية."),("tags",["sprachen"])]),
    OrderedDict([("id","s-a0-28"),("level","A0"),("de","Heute ist Montag."),("ar","اليوم هو الاثنين."),("tags",["tage"])]),
    OrderedDict([("id","s-a0-29"),("level","A0"),("de","Morgen habe ich Deutschunterricht."),("ar","غداً لدي درس ألمانية."),("tags",["lernen"])]),
    OrderedDict([("id","s-a0-30"),("level","A0"),("de","Auf Wiedersehen und einen schönen Tag!"),("ar","إلى اللقاء ويوماً سعيداً!"),("tags",["verabschiedung"])]),
]

# Writing
w = json.load(open('content/writing.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing_w = {x['id'] for x in w}
added_w = 0
for x in WRITING_A0:
    if x['id'] not in existing_w:
        w.append(x); added_w += 1
with open('content/writing.json','w',encoding='utf-8') as f:
    json.dump(w,f,ensure_ascii=False,indent=2); f.write('\n')

# Sentences
s = json.load(open('content/sentences.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing_s = {x['id'] for x in s}
added_s = 0
for x in SENTENCES_A0:
    if x['id'] not in existing_s:
        s.append(x); added_s += 1
with open('content/sentences.json','w',encoding='utf-8') as f:
    json.dump(s,f,ensure_ascii=False,indent=2); f.write('\n')

print(f"Added {added_w} A0 writing tasks (total {len(w)})")
print(f"Added {added_s} A0 sentences (total {len(s)})")
print("Writing per level:", dict(Counter(x['level'] for x in w)))
print("Sentences per level:", dict(Counter(x['level'] for x in s)))
