#!/usr/bin/env python3
"""R141c: add A1 Fehler (10), A2 Lesetexte (2), A1/a0 decks."""
import json
from collections import OrderedDict, Counter

# ---- A1 Fehler ----
f = json.load(open('content/fehler.json',encoding='utf-8'))
if isinstance(f, dict): f = f['entries']

new_f = [
    OrderedDict([("id","f-a1-032"),("falsch","*ich gehe zu Hause"),("richtig","ich gehe nach Hause"),("regelAr","نستخدم nach Hause للذهاب إلى البيت (حركة)، و zu Hause للوجود فيه (استقرار)."),("level","A1"),("kategorie","Präposition / Haus")]),
    OrderedDict([("id","f-a1-033"),("falsch","*ich habe 25 Jahre alt"),("richtig","ich bin 25 Jahre alt"),("regelAr","العمر يأتي مع فعل sein، لا haben."),("level","A1"),("kategorie","Alter / sein")]),
    OrderedDict([("id","f-a1-034"),("falsch","*Mein Bruder wohnt in Berlin seit drei Jahren."),("richtig","Mein Bruder wohnt seit drei Jahren in Berlin."),("regelAr","حسب قاعدة TeKaMoLo يأتي الزمان (seit …) قبل المكان عادة."),("level","A1"),("kategorie","Wortstellung")]),
    OrderedDict([("id","f-a1-035"),("falsch","*Ich möchte trinken ein Wasser."),("richtig","Ich möchte ein Wasser trinken."),("regelAr","الفعل المصرف (möchte) في المرتبة الثانية، والمصدر في النهاية."),("level","A1"),("kategorie","Modalverb + Infinitiv")]),
    OrderedDict([("id","f-a1-036"),("falsch","*Das Buch ist gut, aber ich nicht lese es."),("richtig","Das Buch ist gut, aber ich lese es nicht."),("regelAr","الفعل يأتي بعد الفاعل في الجملة المستقلة بعد aber، و nicht في النهاية."),("level","A1"),("kategorie","Negation / Satzbau")]),
    OrderedDict([("id","f-a1-037"),("falsch","*Ich habe ein Apfel."),("richtig","Ich habe einen Apfel."),("regelAr","Apfel مذكّر؛ المفعول به المذكر النكرة يأخذ einen. Akkusativ: der → den / ein → einen."),("level","A1"),("kategorie","Akkusativ")]),
    OrderedDict([("id","f-a1-038"),("falsch","*Ich komme aus Türkei."),("richtig","Ich komme aus der Türkei."),("regelAr","أسماء الدول المؤنثة أو المذكّرة (معظمها مؤنثة مثل die Türkei, die Schweiz, die USA) تأخذ أداة بعد aus/in."),("level","A1"),("kategorie","Artikel / Länder")]),
    OrderedDict([("id","f-a1-039"),("falsch","*Gestern ich gehe ins Kino."),("richtig","Gestern bin ich ins Kino gegangen."),("regelAr","في زمن الماضي نستخدم Perfekt: sein + gegangen. وفي بداية الجملة بعنصر زمني يأتي الفعل في المرتبة الثانية مباشرة."),("level","A1"),("kategorie","Perfekt / Satzbau")]),
    OrderedDict([("id","f-a1-040"),("falsch","*Ich habe gegessen gestern einen Apfel."),("richtig","Gestern habe ich einen Apfel gegessen."),("regelAr","الترتيب: الزمان أولاً، ثم الفعل المساعد، الفاعل، بقية الجملة، ثم Partizip II في النهاية."),("level","A1"),("kategorie","Perfekt / Satzbau")]),
    OrderedDict([("id","f-a1-041"),("falsch","*Meine Schwester hat ein Auto neu."),("richtig","Meine Schwester hat ein neues Auto."),("regelAr","الصفة تأتي قبل الاسم وتتطابق معه في النوع والحالة."),("level","A1"),("kategorie","Adjektivdeklination")]),
]
existing = {e['id'] for e in f}
for n in new_f:
    if n['id'] not in existing: f.append(n)

json.dump(f, open('content/fehler.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/fehler.json','a',encoding='utf-8').write('\n')

# ---- A2 Lesetexte (2) ----
t = json.load(open('content/texts.json',encoding='utf-8'))
new_t = [
    OrderedDict([
        ("id","t-a2-031"),("level","A2"),
        ("titleDe","Ein Umzug nach Leipzig"),("titleAr","انتقال إلى لايبزيغ"),
        ("bodyDe","Letzten Monat ist Sara von München nach Leipzig gezogen. Sie hatte eine neue Stelle als Grafikdesignerin gefunden. Die Miete in München war zu hoch, deshalb suchte sie eine Wohnung im Osten. In Leipzig fand sie eine schöne Altbauwohnung mit drei Zimmern und Balkon für 650 Euro warm. Am Anfang vermisste sie ihre Freunde in München, aber sie hat schnell neue Kollegen kennengelernt. Jetzt gefällt ihr Leipzig gut: Die Stadt ist grün, die Menschen sind freundlich und die Mieten sind bezahlbar. Am Wochenende erkundet sie mit dem Fahrrad die Viertel und probiert neue Cafés aus."),
        ("bodyAr","انتقلت سارة الشهر الماضي من ميونخ إلى لايبزيغ. وجدت وظيفة جديدة كمصممة جرافيك. كانت الإيجارات في ميونخ مرتفعة جدًا، فبحثت عن شقة في الشرق. وجدت في لايبزيغ شقة جميلة في مبنى قديم بثلاث غرف وشرفة بـ 650 يورو شاملة التدفئة. في البداية افتقدت أصدقائها في ميونخ، لكنها سرعان ما تعرفت على زملاء جدد. والآن تعجبها لايبزيغ: المدينة خضراء، الناس لطفاء، والإيجارات معقولة. في نهاية الأسبوع تستكشف الأحياء بالدراجة وتجرب مقاهي جديدة."),
        ("gloss",[("umziehen","ينتقل"),("die Stelle,-n","الوظيفة"),("die Altbauwohnung,-en","شقة في مبنى قديم"),("warm","شاملة التدفئة"),("bezahlbar","يمكن دفعه/معقول"),("erkunden","يستكشف")]),
        ("comprehension",[OrderedDict([("frage_de","Warum ist Sara nach Leipzig gezogen?"),("frage_ar","لماذا انتقلت إلى لايبزيغ؟"),("options",["Wegen einer neuen Stelle und niedrigeren Mieten","Wegen des Wetters","Weil ihre Familie dort wohnt"]),("answer",0),("erklaerung_ar","وجدت وظيفة جديدة وكانت إيجارات ميونخ عالية.")])]),
    ]),
    OrderedDict([
        ("id","t-a2-032"),("level","A2"),
        ("titleDe","Ein gesunder Tagesablauf"),("titleAr","يوم صحي"),
        ("bodyDe","Lukas hat seinen Tagesablauf in den letzten Monaten stark verändert. Früher stand er spät auf, trank drei Tassen Kaffee zum Frühstück und aß mittags oft Fast Food. Abends saß er stundenlang vor dem Fernseher. Jetzt steht er um sieben Uhr auf, macht zwanzig Minuten Yoga und frühstückt Müsli mit Obst. Mittags kocht er selbst Gemüse mit Reis. Er geht dreimal pro Woche laufen und schläft vor Mitternacht. Seitdem fühlt er sich viel fitter und ist in der Arbeit konzentrierter. Er sagt, die größte Schwierigkeit war, abends keine Schokolade zu essen."),
        ("bodyAr","غيّر لوكاس روتينه اليومي في الأشهر الماضية بشكل كبير. سابقاً كان يستيقظ متأخراً، يشرب ثلاثة فناجين قهوة على الفطور، ويأكل وجبات سريعة في الغداء. في المساء يجلس ساعات أمام التلفاز. الآن يستيقظ السابعة، يمارس اليوغا عشرين دقيقة، ويفطر موسلي بالفاكهة. يطبخ في الغداء خضاراً مع الأرز، يركض ثلاث مرات أسبوعياً، وينام قبل منتصف الليل. منذ ذلك يشعر بأكثر نشاطاً وأعلى تركيزاً في العمل. ويقول إن الصعوبة الأكبر كانت عدم أكل الشوكولاتة مساءً."),
        ("gloss",[("der Tagesablauf","الروتين اليومي"),("verändern","يغيّر"),("das Fast Food","الوجبات السريعة"),("fitter","أكثر نشاطاً/لياقة"),("konzentriert","مُركِّز")]),
        ("comprehension",[OrderedDict([("frage_de","Was war Lukas' größte Schwierigkeit bei der Umstellung?"),("frage_ar","ما كانت أكبر صعوبة؟"),("options",["Früher aufzustehen","Keine Schokolade abends zu essen","Täglich Sport zu machen"]),("answer",1),("erklaerung_ar","النص يقول إن أصعب شيء كان عدم أكل الشوكولاتة مساءً.")])]),
    ]),
]
ids_t = {x['id'] for x in t}
for n in new_t:
    if n['id'] not in ids_t: t.append(n)

json.dump(t, open('content/texts.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/texts.json','a',encoding='utf-8').write('\n')

# ---- A0 vocab deck: Alltag / Begrüßung & Klassenraum (Körper bereits teilweise) ----
v = json.load(open('content/vocab.json',encoding='utf-8'))
new_deck = OrderedDict([
    ("id","a0-klassenzimmer"),("titelDe","Im Klassenzimmer"),("titelAr","في غرفة الصف"),("level","A0"),
    ("cards",[
        OrderedDict([("de","der Stuhl, -ühe"),("ar","كرسي")]),
        OrderedDict([("de","der Tisch, -e"),("ar","طاولة")]),
        OrderedDict([("de","die Tafel, -n"),("ar","سبورة")]),
        OrderedDict([("de","die Kreide, -n"),("ar","طبشور")]),
        OrderedDict([("de","der Kugelschreiber, -"),("ar","قلم حبر")]),
        OrderedDict([("de","das Heft, -e"),("ar","دفتر")]),
        OrderedDict([("de","das Buch, -ücher"),("ar","كتاب")]),
        OrderedDict([("de","der Lehrer/die Lehrerin, -"),("ar","المعلم/ة")]),
        OrderedDict([("de","der Schüler/die Schülerin, -"),("ar","التلميذ/ة")]),
        OrderedDict([("de","die Tür, -en"),("ar","باب")]),
        OrderedDict([("de","das Fenster, -"),("ar","نافذة")]),
        OrderedDict([("de","die Lampe, -n"),("ar","مصباح")]),
        OrderedDict([("de","die Tasche, -n"),("ar","حقيبة")]),
        OrderedDict([("de","der Bleistift, -e"),("ar","قلم رصاص")]),
        OrderedDict([("de","das Papier, -e"),("ar","ورقة")]),
        OrderedDict([("de","öffnen"),("ar","يفتح")]),
        OrderedDict([("de","schließen"),("ar","يغلق")]),
        OrderedDict([("de","schreiben"),("ar","يكتب")]),
        OrderedDict([("de","lesen"),("ar","يقرأ")]),
        OrderedDict([("de","hören"),("ar","يسمع")]),
    ]),
])
if 'a0-klassenzimmer' not in v:
    v['a0-klassenzimmer'] = new_deck
    # add to PHASE_DECKS.A0
    plan = open('lib/plan.ts','r',encoding='utf-8').read()
    plan = plan.replace('A0: ["a0-start", "a0-zahlen", "a0-farben", "a0-obst-gemuese"]',
                        'A0: ["a0-start", "a0-zahlen", "a0-farben", "a0-obst-gemuese", "a0-klassenzimmer"]')
    open('lib/plan.ts','w',encoding='utf-8').write(plan)
json.dump(v, open('content/vocab.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/vocab.json','a',encoding='utf-8').write('\n')

# Print stats
cf = Counter(e.get('level','?') for e in f)
ct = Counter(x.get('level','?') for x in t)
cv_deck = Counter(v[k].get('level','?') for k in v)
cv_card = {}
for k,d in v.items():
    lv=d.get('level','?')
    cv_card[lv]=cv_card.get(lv,0)+len(d.get('cards',[]))
print('fehler:', dict(cf))
print('texts:', dict(ct))
print('vocab decks:', dict(cv_deck))
print('vocab cards:', cv_card)
