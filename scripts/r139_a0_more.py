#!/usr/bin/env python3
"""Final A0 filler: 5 more A0 dialogues to reach 13 + 5 more A0 reading texts to reach 10."""
import json
from collections import OrderedDict

TEXTS = [
    OrderedDict([("id","t-a0-06"),("level","A0"),
        ("titleDe","In der Klasse"),("titleAr","في الصف"),
        ("de","Das ist mein Klassenzimmer. Hier lerne ich Deutsch. Die Lehrerin heißt Frau Schulz. Sie ist sehr nett. Im Kurs sind 12 Studenten. Sie kommen aus Syrien, aus der Türkei, aus Polen und aus Italien. Wir sprechen zusammen Deutsch. Manchmal lachen wir viel."),
        ("ar","هذا فصلي. أتعلم فيه الألمانية. المعلمة اسمها فراوله شولتس وهي لطيفة جداً. في الدورة 12 طالباً من سوريا وتركيا وبولندا وإيطاليا. نتكلم الألمانية معاً، وأحياناً نضحك كثيراً."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wie heißt die Lehrerin?"),("promptAr","ما اسم المعلمة؟"),("options",["Frau Müller","Frau Schulz","Frau Becker","Frau Klein"]),("answer",1),("explanationAr","اسمها Frau Schulz.")]),
        ])]),
    OrderedDict([("id","t-a0-07"),("level","A0"),
        ("titleDe","Die Wochentage"),("titleAr","أيام الأسبوع"),
        ("de","Am Montag gehe ich zur Arbeit. Am Dienstag habe ich Deutschkurs. Am Mittwoch kaufe ich ein. Am Donnerstag treffe ich meine Freunde. Am Freitag sehe ich fern. Am Samstag schlafe ich lange. Am Sonntag besuche ich meine Familie."),
        ("ar","الاثنين أذهب إلى العمل. الثلاثاء لدي درس ألمانية. الأربعاء أتسوّق. الخميس أقابل أصدقائي. الجمعة أشاهد التلفاز. السبت أنام طويلاً. الأحد أزور عائلتي."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Was macht er am Mittwoch?"),("promptAr","ماذا يفعل الأربعاء؟"),("options",["Er arbeitet.","Er kauft ein.","Er sieht fern.","Er schläft."]),("answer",1),("explanationAr","يتسوّق.")]),
        ])]),
    OrderedDict([("id","t-a0-08"),("level","A0"),
        ("titleDe","Das Essen"),("titleAr","الطعام"),
        ("de","Ich esse gern Brot mit Käse zum Frühstück. Zum Mittag esse ich gern Reis mit Gemüse und Fleisch. Zum Abendbrot trinke ich Tee und esse Obst. Ich trinke nicht viel Kaffee. Mein Lieblingsobst ist Apfel. Ich mag Bananen und Orangen auch."),
        ("ar","أحب أكل الخبز مع الجبن في الفطور. في الغداء آكل الأرز مع الخضار واللحم. في العشاء أشرب الشاي وآكل فاكهة. لا أشرب الكثير من القهوة. فاكهتي المفضلة التفاح، وأحب الموز والبرتقال أيضاً."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Was ist sein Lieblingsobst?"),("promptAr","ما فاكهته المفضلة؟"),("options",["Banane","Apfel","Orange","Traube"]),("answer",1),("explanationAr","التفاح.")]),
        ])]),
    OrderedDict([("id","t-a0-09"),("level","A0"),
        ("titleDe","Die Uhrzeit"),("titleAr","الوقت"),
        ("de","Ich stehe um 7 Uhr auf. Um 8 Uhr frühstücke ich. Um 9 Uhr beginne ich mit der Arbeit. Um 12 Uhr esse ich zu Mittag. Um 17 Uhr gehe ich nach Hause. Um 19 Uhr esse ich zu Abend. Um 23 Uhr gehe ich ins Bett."),
        ("ar","أستيقظ في السابعة. أفطر في الثامنة. أبدأ العمل التاسعة. آكل الغداء 12. أذهب للبيت 17. أتعشى 19. أذهب للسرير 23."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Wann beginnt er zu arbeiten?"),("promptAr","متى يبدأ العمل؟"),("options",["Um 7","Um 8","Um 9","Um 12"]),("answer",2),("explanationAr","التاسعة.")]),
        ])]),
    OrderedDict([("id","t-a0-10"),("level","A0"),
        ("titleDe","Wetter und Jahreszeiten"),("titleAr","الطقس والفصول"),
        ("de","Im Winter ist es kalt und es schneit. Ich trage eine dicke Jacke. Im Frühling blühen die Blumen. Im Sommer ist es heiß, ich gehe schwimmen. Im Herbst sind die Blätter bunt: rot, gelb und braun. Ich mag den Frühling am liebsten."),
        ("ar","في الشتاء بارد ويتساقط الثلج، أرتدي سترة سميكة. في الربيع تتفتح الأزهار. في الصيف حار وأذهب للسباحة. في الخريف الأوراق ملونة: أحمر وأصفر وبني. أحب الربيع أكثر من غيره."),
        ("questions",[
            OrderedDict([("type","mc"),("promptDe","Welche Jahreszeit mag er am liebsten?"),("promptAr","أي فصل يحب أكثر؟"),("options",["Winter","Frühling","Sommer","Herbst"]),("answer",1),("explanationAr","الربيع.")]),
        ])]),
]

DLGS = [
    OrderedDict([("id","d-a0-09"),("level","A0"),("titleDe","Zahlen und Preise"),("titleAr","الأرقام والأسعار"),("ort","Bäckerei"),
        ("lines",[
            OrderedDict([("who","Kunde"),("de","Guten Tag! Ein Brot, bitte."),("ar","نهارك سعيد! خبز من فضلك.")]),
            OrderedDict([("who","Verkäuferin"),("de","Das macht 2,50 Euro."),("ar","هذا يساوي 2.50 يورو.")]),
            OrderedDict([("who","Kunde"),("de","Und zwei Brötchen, bitte."),("ar","ورغيفي خبز صغير أيضاً من فضلك.")]),
            OrderedDict([("who","Verkäuferin"),("de","Zusammen 3,40 Euro."),("ar","المجموع 3.40 يورو.")]),
            OrderedDict([("who","Kunde"),("de","Hier sind 5 Euro. Stimmt so!"),("ar","هذه 5 يورو. الباقي بقشيش!")]),
        ]),
        ("questions",[OrderedDict([("type","mc"),("promptDe","Wie viel kostet das Brot?"),("promptAr","كم ثمن الخبز؟"),("options",["1,50","2,50","3,40","5,00"]),("answer",1),("explanationAr","2.50 يورو.")])]),
        ("dictation",["Das macht 2,50 Euro."]),
    ]),
    OrderedDict([("id","d-a0-10"),("level","A0"),("titleDe","Uhrzeit fragen"),("titleAr","السؤال عن الوقت"),("ort","Straße"),
        ("lines",[
            OrderedDict([("who","A"),("de","Entschuldigung! Wie spät ist es bitte?"),("ar","عفواً، كم الساعة من فضلك؟")]),
            OrderedDict([("who","B"),("de","Es ist halb drei."),("ar","الساعة الثالثة والنصف.")]),
            OrderedDict([("who","A"),("de","Danke! Wann kommt der Bus?"),("ar","شكراً! متى يأتي الباص؟")]),
            OrderedDict([("who","B"),("de","Um Viertel nach drei."),("ar","في الثالثة والربع.")]),
        ]),
        ("questions",[OrderedDict([("type","mc"),("promptDe","Wann kommt der Bus?"),("promptAr","متى يأتي الباص؟"),("options",["Halb drei","Viertel nach drei","Drei Uhr","Viertel vor drei"]),("answer",1),("explanationAr","الثالثة والربع.")])]),
        ("dictation",["Es ist halb drei."]),
    ]),
    OrderedDict([("id","d-a0-11"),("level","A0"),("titleDe","Beim Arzt — einfacher Termin"),("titleAr","عند الطبيب — موعد بسيط"),("ort","Arztpraxis"),
        ("lines",[
            OrderedDict([("who","Arzt"),("de","Guten Tag! Was fehlt Ihnen?"),("ar","نهارك سعيد! بم تشكو؟")]),
            OrderedDict([("who","Patient"),("de","Ich habe Kopfschmerzen und Fieber."),("ar","عندي صداع وحرارة.")]),
            OrderedDict([("who","Arzt"),("de","Haben Sie Husten?"),("ar","هل لديك سعال؟")]),
            OrderedDict([("who","Patient"),("de","Nein, kein Husten."),("ar","لا، لا سعال.")]),
            OrderedDict([("who","Arzt"),("de","Gut, trinken Sie viel Wasser und ruhen Sie sich aus."),("ar","جيد، اشرب ماء كثيراً واسترح.")]),
        ]),
        ("questions",[OrderedDict([("type","mc"),("promptDe","Was hat der Patient?"),("promptAr","ما يشكو المريض؟"),("options",["Husten","Kopfschmerzen und Fieber","Bauchschmerzen","Halsschmerzen"]),("answer",1),("explanationAr","صداع وحرارة.")])]),
        ("dictation",["Ich habe Kopfschmerzen und Fieber."]),
    ]),
    OrderedDict([("id","d-a0-12"),("level","A0"),("titleDe","Familie vorstellen"),("titleAr","تقديم العائلة"),("ort","Im Kurs"),
        ("lines",[
            OrderedDict([("who","A"),("de","Hast du Geschwister?"),("ar","هل لديك إخوة؟")]),
            OrderedDict([("who","B"),("de","Ja, ich habe einen Bruder und zwei Schwestern."),("ar","نعم، عندي أخ وأختان.")]),
            OrderedDict([("who","A"),("de","Wie alt sind sie?"),("ar","كم أعمارهم؟")]),
            OrderedDict([("who","B"),("de","Mein Bruder ist 20, meine Schwestern sind 15 und 10."),("ar","أخي في العشرين، وأختاي 15 و10.")]),
        ]),
        ("questions",[OrderedDict([("type","mc"),("promptDe","Wie viele Geschwister hat B?"),("promptAr","كم أخاً وأختاً لدى B؟"),("options",["Einen Bruder","Zwei Schwestern","Drei: einen Bruder und zwei Schwestern","Keine"]),("answer",2),("explanationAr","أخ وأختان = ثلاثة.")])]),
        ("dictation",["Ich habe einen Bruder und zwei Schwestern."]),
    ]),
    OrderedDict([("id","d-a0-13"),("level","A0"),("titleDe","Nach dem Weg fragen"),("titleAr","السؤال عن الطريق"),("ort","Straße"),
        ("lines",[
            OrderedDict([("who","Tourist"),("de","Entschuldigung! Wo ist der Bahnhof?"),("ar","عفواً، أين المحطة؟")]),
            OrderedDict([("who","Passant"),("de","Gehen Sie geradeaus, dann rechts."),("ar","امشِ مستقيماً ثم يميناً.")]),
            OrderedDict([("who","Tourist"),("de","Weit?"),("ar","بعيد؟")]),
            OrderedDict([("who","Passant"),("de","Nein, fünf Minuten zu Fuß."),("ar","لا، خمس دقائق مشياً.")]),
        ]),
        ("questions",[OrderedDict([("type","mc"),("promptDe","Wie lange dauert es?"),("promptAr","كم تستغرق؟"),("options",["Eine Stunde","10 Minuten","5 Minuten","20 Minuten"]),("answer",2),("explanationAr","خمس دقائق.")])]),
        ("dictation",["Fünf Minuten zu Fuß."]),
    ]),
]

# Texts
t = json.load(open('content/texts.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing_t = {x['id'] for x in t}
at = 0
for x in TEXTS:
    if x['id'] not in existing_t:
        t.append(x); at += 1
with open('content/texts.json','w',encoding='utf-8') as f:
    json.dump(t,f,ensure_ascii=False,indent=2); f.write('\n')

# Dialogues
d = json.load(open('content/dialogues.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing_d = {x['id'] for x in d}
ad = 0
for x in DLGS:
    if x['id'] not in existing_d:
        d.append(x); ad += 1
with open('content/dialogues.json','w',encoding='utf-8') as f:
    json.dump(d,f,ensure_ascii=False,indent=2); f.write('\n')
print(f"Added {at} A0 texts, {ad} A0 dialogues. Total texts={len(t)}, dialogues={len(d)}")
