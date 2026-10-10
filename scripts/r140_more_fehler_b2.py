#!/usr/bin/env python3
"""R140f: add more B2 Fehler entries to balance counts."""
import json
from collections import OrderedDict
f = json.load(open('content/fehler.json',encoding='utf-8'))
if isinstance(f, dict): f = f['entries']

new = [
    OrderedDict([("id","f-b2-028"),("falsch","*Obwohl er viel lernt, aber besteht er nicht."),("richtig","Obwohl er viel lernt, besteht er nicht."),("regelAr","obwohl في الجملة الثانوية يدفع الفعل للنهاية، ولا تستخدم aber معها (فهي تحمل التنازع وحدها)."),("level","B2"),("kategorie","Konzessivsatz")]),
    OrderedDict([("id","f-b2-029"),("falsch","*Der Mann, der ich ihn gestern gesehen habe."),("richtig","Der Mann, den ich gestern gesehen habe."),("regelAr","الاسم الموصول في حالة المفعول به المذكر يأخذ den، ولا نعيد الضمير ihn في الجملة النسبية."),("level","B2"),("kategorie","Relativsatz")]),
    OrderedDict([("id","f-b2-030"),("falsch","*Während ich studierte, habe ich viel gelernt."),("richtig","Während ich studierte, lernte ich viel / habe ich viel gelernt (wenn Betonung auf Ergebnis)."),("regelAr","Präteritum في جملة während يتناسب مع نص سردي في الماضي؛ Perfekt مقبول أيضاً لكن Präteritum أكثر أصالة في الكتابة الرسمية."),("level","B2"),("kategorie","Temporalsatz / Tempus")]),
    OrderedDict([("id","f-b2-031"),("falsch","*Ich freue mich auf, dass du kommst."),("richtig","Ich freue mich darauf, dass du kommst."),("regelAr","أفعال مع صرفة + dass تتطلب إشارية (darauf، darüber) قبل dass، لا حرف جر منفصل."),("level","B2"),("kategorie","Präpositionaladverb + dass")]),
    OrderedDict([("id","f-b2-032"),("falsch","*Je mehr du lernst, desto besser wirst du sprechen."),("richtig","Je mehr du lernst, desto besser sprichst du."),("regelAr","بعد je … desto يأتي الفعل في المرتبة الثانية ولا حاجة لـ werden إن كان الحال في الحاضر."),("level","B2"),("kategorie","Proportionalvergleich")]),
    OrderedDict([("id","f-b2-033"),("falsch","*Laut des Berichts gibt es mehr Arbeitslose."),("richtig","Laut dem Bericht gibt es mehr Arbeitslose."),("regelAr","laut تُستخدم مع Dativ غالباً (laut dem Bericht)؛ Genitiv (laut des Berichts) فصيح جداً ونادر في اللغة اليومية."),("level","B2"),("kategorie","Präposition")]),
    OrderedDict([("id","f-b2-034"),("falsch","*Das Buch ist wert zu lesen."),("richtig","Das Buch ist lesenswert / Es lohnt sich, das Buch zu lesen."),("regelAr","الصفة lesenswert هي الصياغة الصحيحة، «wert zu + Infinitiv» ليست ألمانية قياسية."),("level","B2"),("kategorie","Adjektiv / -wert")]),
    OrderedDict([("id","f-b2-035"),("falsch","*Dadurch, dass ich viel lese, verbessert sich mein Deutsch."),("richtig","Dadurch, dass ich viel lese, verbessere ich mein Deutsch."),("regelAr","sich verbessern يعود على الفاعل، وإن كان الفاعل Deutsch حيادياً لكن الفاعل الصحيح هو ich في صيغة aktive، أو: mein Deutsch verbessert sich."),("level","B2"),("kategorie","Reflexiv")]),
]

existing = {e['id'] for e in f}
for n in new:
    if n['id'] not in existing:
        f.append(n)

json.dump(f, open('content/fehler.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/fehler.json','a',encoding='utf-8').write('\n')
print('B2 fehler now:', len([e for e in f if e.get('level')=='B2']))
