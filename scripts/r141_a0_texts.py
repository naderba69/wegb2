#!/usr/bin/env python3
"""R141b: add 5 A0 Lesetexte and 20 A0 Beispielsätze."""
import json
from collections import OrderedDict

t = json.load(open('content/texts.json',encoding='utf-8'))

new_texts = [
    OrderedDict([
        ("id","t-a0-011"),("level","A0"),
        ("titleDe","Meine Schultasche"),("titleAr","حقيبتي المدرسية"),
        ("bodyDe","Ich habe eine Schultasche. Sie ist blau und rot. In der Tasche sind drei Hefte, ein Kugelschreiber, ein Bleistift und ein Radiergummi. Ich habe auch ein Buch für Deutsch. Die Tasche ist nicht schwer. Ich nehme sie jeden Morgen in die Schule."),
        ("bodyAr","عندي حقيبة مدرسية. هي زرقاء وحمراء. في الحقيبة ثلاث دفاتر وقلم حبر وقلم رصاص وممحاة. عندي أيضاً كتاب للألمانية. الحقيبة ليست ثقيلة. آخذها كل صباح إلى المدرسة."),
        ("gloss",[("die Schultasche","الحقيبة المدرسية"),("das Heft,-e","الدفتر"),("der Kugelschreiber","قلم الحبر"),("das Radiergummi","الممحاة"),("schwer","ثقيل")]),
        ("comprehension",[OrderedDict([("frage_de","Was ist in der Schultasche?"),("frage_ar","ماذا يوجد في الحقيبة؟"),("options",["Ein Apfel","Drei Hefte und Stifte","Ein Telefon"]),("answer",1),("erklaerung_ar","في النص: drei Hefte, Kugelschreiber, Bleistift.")])]),
    ]),
    OrderedDict([
        ("id","t-a0-012"),("level","A0"),
        ("titleDe","Am Wochenende"),("titleAr","في نهاية الأسبوع"),
        ("bodyDe","Am Samstag stehe ich spät auf. Ich trinke Kaffee und lese die Zeitung. Am Nachmittag gehe ich mit meinem Hund im Park spazieren. Am Sonntag besuche ich meine Mutter. Wir essen zusammen Kuchen und trinken Tee. Das Wochenende ist schön."),
        ("bodyAr","يوم السبت أستيقظ متأخراً. أشرب القهوة وأقرأ الجريدة. بعد الظهر أتنزه مع كلبي في الحديقة. يوم الأحد أزور أمي. نأكل الكيك معاً ونشرب الشاي. نهاية الأسبوع جميلة."),
        ("gloss",[("spät aufstehen","يستيقظ متأخراً"),("der Hund,-e","الكلب"),("spazieren gehen","يتنزه"),("der Kuchen","الكيك/الكعك")]),
        ("comprehension",[OrderedDict([("frage_de","Was macht er am Sonntag?"),("frage_ar","ماذا يفعل يوم الأحد؟"),("options",["Er geht arbeiten","Er besucht seine Mutter","Er schläft den ganzen Tag"]),("answer",1),("erklaerung_ar","النص يقول: Am Sonntag besuche ich meine Mutter.")])]),
    ]),
    OrderedDict([
        ("id","t-a0-013"),("level","A0"),
        ("titleDe","Das Wetter heute"),("titleAr","الطقس اليوم"),
        ("bodyDe","Heute ist Montag. Der Himmel ist blau und die Sonne scheint. Es ist warm, etwa 20 Grad. Ich ziehe ein T-Shirt und eine Jeans an. Ich brauche keine Jacke. Ich freue mich auf den Nachmittag im Garten."),
        ("bodyAr","اليوم الإثنين. السماء زرقاء والشمس مشرقة. الجو دافئ، حوالي ٢٠ درجة. ألبس قميصاً وبنطلون جينز. لا أحتاج إلى سترة. أنا متشوق لقضاء بعد الظهر في الحديقة."),
        ("gloss",[("der Himmel","السماء"),("scheinen","تشرق/تسطع"),("anziehen","يلبس"),("die Jacke","السترة"),("sich freuen auf","يتشوق لـ")]),
        ("comprehension",[OrderedDict([("frage_de","Welche Temperatur hat es heute?"),("frage_ar","كم درجة الحرارة اليوم؟"),("options",["10 Grad","20 Grad","30 Grad"]),("answer",1),("erklaerung_ar","النص: etwa 20 Grad.")])]),
    ]),
    OrderedDict([
        ("id","t-a0-014"),("level","A0"),
        ("titleDe","Im Restaurant"),("titleAr","في المطعم"),
        ("bodyDe","Ich gehe gern ins Restaurant. Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln. Dazu trinke ich ein Wasser. Der Kellner ist freundlich. Das Essen schmeckt sehr gut. Ich bezahle und gehe nach Hause."),
        ("bodyAr","أحب الذهاب إلى المطعم. اليوم أطلب شوربة وشريحة لحم مع بطاطس. وأشرب معها ماءً. النادل لطيف. الأكل لذيذ جداً. أدفع وأذهب إلى البيت."),
        ("gloss",[("bestellen","يطلب"),("die Suppe","الشوربة"),("das Schnitzel","شريحة لحم مقلية"),("freundlich","لطيف"),("schmecken","يكون لذيذاً")]),
        ("comprehension",[OrderedDict([("frage_de","Was trinkt er?"),("frage_ar","ماذا يشرب؟"),("options",["Bier","Wasser","Cola"]),("answer",1),("erklaerung_ar","النص: Dazu trinke ich ein Wasser.")])]),
    ]),
    OrderedDict([
        ("id","t-a0-015"),("level","A0"),
        ("titleDe","Meine Wohnung"),("titleAr","شقتي"),
        ("bodyDe","Ich wohne in einer kleinen Wohnung in der Stadt. Die Wohnung hat ein Wohnzimmer, ein Schlafzimmer, eine Küche und ein Bad. Im Wohnzimmer steht ein Sofa vor dem Fernseher. In der Küche mache ich Kaffee. Die Wohnung ist ruhig und hell."),
        ("bodyAr","أسكن في شقة صغيرة في المدينة. فيها غرفة معيشة وغرفة نوم ومطبخ وحمّام. في غرفة المعيشة كنبة أمام التلفاز. في المطبخ أصنع القهوة. الشقة هادئة ومشرقة."),
        ("gloss",[("das Wohnzimmer","غرفة المعيشة"),("das Schlafzimmer","غرفة النوم"),("das Sofa","الكنبة"),("ruhig","هادئ"),("hell","مشرق")]),
        ("comprehension",[OrderedDict([("frage_de","Wie ist die Wohnung?"),("frage_ar","كيف هي الشقة؟"),("options",["Groß und laut","Klein, ruhig und hell","Dunkel und alt"]),("answer",1),("erklaerung_ar","النص: kleine Wohnung, ruhig und hell.")])]),
    ]),
]

ids_t = {x['id'] for x in t}
for n in new_texts:
    if n['id'] not in ids_t: t.append(n)

json.dump(t, open('content/texts.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/texts.json','a',encoding='utf-8').write('\n')

# ---- Sentences A0 ----
s = json.load(open('content/sentences.json',encoding='utf-8'))
new_s = [
    OrderedDict([("id","sat-a0-031"),("level","A0"),("de","Wie viel kostet das?"),("ar","بكم هذا؟")]),
    OrderedDict([("id","sat-a0-032"),("level","A0"),("de","Ich hätte gerne ein Wasser, bitte."),("ar","أريد ماءً من فضلك.")]),
    OrderedDict([("id","sat-a0-033"),("level","A0"),("de","Das schmeckt gut."),("ar","هذا لذيذ.")]),
    OrderedDict([("id","sat-a0-034"),("level","A0"),("de","Wo ist die Toilette?"),("ar","أين الحمام؟")]),
    OrderedDict([("id","sat-a0-035"),("level","A0"),("de","Ich verstehe nicht."),("ar","لا أفهم.")]),
    OrderedDict([("id","sat-a0-036"),("level","A0"),("de","Sprechen Sie bitte langsamer."),("ar","تكلم ببطء من فضلك.")]),
    OrderedDict([("id","sat-a0-037"),("level","A0"),("de","Heute ist das Wetter schön."),("ar","الجو جميل اليوم.")]),
    OrderedDict([("id","sat-a0-038"),("level","A0"),("de","Ich bin müde."),("ar","أنا متعب.")]),
    OrderedDict([("id","sat-a0-039"),("level","A0"),("de","Hast du morgen Zeit?"),("ar","هل لديك وقت غداً؟")]),
    OrderedDict([("id","sat-a0-040"),("level","A0"),("de","Der Kaffee ist zu heiß."),("ar","القهوة حارة جداً.")]),
    OrderedDict([("id","sat-a0-041"),("level","A0"),("de","Das Buch ist auf dem Tisch."),("ar","الكتاب على الطاولة.")]),
    OrderedDict([("id","sat-a0-042"),("level","A0"),("de","Meine Schwester wohnt in Hamburg."),("ar","أختي تسكن في هامبورغ.")]),
    OrderedDict([("id","sat-a0-043"),("level","A0"),("de","Was ist dein Hobby?"),("ar","ما هوايتك؟")]),
    OrderedDict([("id","sat-a0-044"),("level","A0"),("de","Ich spiele gern Fußball."),("ar","أحب لعب كرة القدم.")]),
    OrderedDict([("id","sat-a0-045"),("level","A0"),("de","Wie alt bist du?"),("ar","كم عمرك؟")]),
    OrderedDict([("id","sat-a0-046"),("level","A0"),("de","Der Unterricht beginnt um neun Uhr."),("ar","يبدأ الدرس الساعة التاسعة.")]),
    OrderedDict([("id","sat-a0-047"),("level","A0"),("de","Ich habe keinen Hunger."),("ar","لست جائعاً.")]),
    OrderedDict([("id","sat-a0-048"),("level","A0"),("de","Gute Besserung!"),("ar","شفاءً عاجلاً!")]),
    OrderedDict([("id","sat-a0-049"),("level","A0"),("de","Die Katze schläft auf dem Sofa."),("ar","القطة نائمة على الكنبة.")]),
    OrderedDict([("id","sat-a0-050"),("level","A0"),("de","Bis morgen!"),("ar","إلى غدٍ!")]),
]
ids_s = {x['id'] for x in s}
for n in new_s:
    if n['id'] not in ids_s: s.append(n)

json.dump(s, open('content/sentences.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/sentences.json','a',encoding='utf-8').write('\n')

from collections import Counter
c = Counter(x.get('level','?') for x in t)
cs = Counter(x.get('level','?') for x in s)
print('texts per level:', dict(c))
print('sentences per level:', dict(cs))
