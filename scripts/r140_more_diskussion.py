#!/usr/bin/env python3
"""R140h: add Diskussion (Teil 3) cards for A1/A2/B1 levels."""
import json
from collections import OrderedDict
m = json.load(open('content/muendlich.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

disk = [
    OrderedDict([("id","mm-a1-06"),("level","A1"),("teil",3),
        ("titel_de","Kino oder Fernsehen?"),("titel_ar","السينما أم التلفاز؟"),
        ("auftrag_de","Diskutieren Sie mit Ihrem Partner: Was finden Sie besser – ins Kino gehen oder fernsehen? Warum?"),
        ("auftrag_ar","ناقش مع شريكك: أيهما تفضل الذهاب للسينما أم مشاهدة التلفاز؟ لماذا؟"),
        ("stuetzen",["Ich finde … besser, weil …","Was denkst du?","Ich bin anderer Meinung.","Einverstanden."]),
        ("kriterien",[OrderedDict([("de","Einfache Meinungsäußerung"),("ar","إبداء الرأي البسيط")]),
                      OrderedDict([("de","Begründung mit weil"),("ar","التعليل بـ weil")]),
                      OrderedDict([("de","Frage an den Partner"),("ar","سؤال للشريك")]),
                      OrderedDict([("de","Reaktion auf Partner"),("ar","التفاعل مع الشريك")])]),
        ("zeit_s",120)]),
    OrderedDict([("id","mm-a2-06"),("level","A2"),("teil",3),
        ("titel_de","Geschenk für Freundin"),("titel_ar","هدية لصديقة"),
        ("auftrag_de","Sie wollen einer Freundin zum Geburtstag ein Geschenk machen. Diskutieren Sie zwei Vorschläge und einigen Sie sich."),
        ("auftrag_ar","تريد إحضار هدية عيد ميلاد لصديقة. ناقش مقترحين وتوصّلا إلى اتفاق."),
        ("stuetzen",["Ich schlage vor, wir schenken ihr …","Das ist zu teuer / nicht praktisch.","Was hältst du von …?","Dann nehmen wir …"]),
        ("kriterien",[OrderedDict([("de","Vorschläge machen"),("ar","تقديم الاقتراحات")]),
                      OrderedDict([("de","Vor- und Nachteile nennen"),("ar","ذكر الإيجابيات والسلبيات")]),
                      OrderedDict([("de","Einigung erzielen"),("ar","التوصل لاتفاق")]),
                      OrderedDict([("de","A2-Wortschatz Einkauf"),("ar","مفردات A2 الشراء")])]),
        ("zeit_s",180)]),
    OrderedDict([("id","mm-b1-06"),("level","B1"),("teil",3),
        ("titel_de","Klassenausflug wählen"),("titel_ar","اختيار رحلة الصف"),
        ("auftrag_de","Ihre Klasse will einen Ausflug machen. Entscheiden Sie zwischen Museum und Tierpark: planen Sie Termin, Kosten und Treffpunkt."),
        ("auftrag_ar","صفكم يريد القيام برحلة. اختاروا بين المتحف وحديقة الحيوان: خططوا الموعد والتكلفة ونقطة اللقاء."),
        ("stuetzen",["Lieber ins Museum, denn …","Wann treffen wir uns?","Der Eintritt kostet …","Ich bin dafür, am … zu fahren."]),
        ("kriterien",[OrderedDict([("de","Argumentation"),("ar","الحجج")]),
                      OrderedDict([("de","Konkrete Planung (Zeit/Kosten)"),("ar","تخطيط عملي (وقت/تكلفة)")]),
                      OrderedDict([("de","Kompromiss finden"),("ar","إيجاد حل وسط")]),
                      OrderedDict([("de","Interaktion mit Fragen"),("ar","التفاعل بالأسئلة")])]),
        ("zeit_s",240)]),
]
ids = {k['id'] for k in m['karten']}
for k in disk:
    if k['id'] not in ids: m['karten'].append(k)

json.dump(m, open('content/muendlich.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/muendlich.json','a',encoding='utf-8').write('\n')
print('Added Diskussion cards for A1/A2/B1')
