#!/usr/bin/env python3
import json
from collections import OrderedDict
g = json.load(open('content/grammar.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

MORE = {
    "a0-aussprache-vowels": [
        OrderedDict([("type","mc"),("promptDe","Welcher Vokal ist kurz?"),("promptAr","أي حرف علة قصير؟"),("options",["der Bann","der Bahn","der Sohn","die Uhr"]),("answer",0),("explanationAr","في Bann الحرف a قصير (متبوع بحرفين ساكنين)، أما Bahn فالـa طويل.")]),
    ],
    "b2-konzessiv": [
        OrderedDict([("type","mc"),("promptDe","Welche Konjunktion leitet einen Konzessivsatz ein?"),("promptAr","أي أداة تُدخل جملة تنازعية؟"),("options",["weil","obwohl","wenn","dass"]),("answer",1),("explanationAr","obwohl / obgleich / auch wenn كلها أدوات تنازع.")]),
    ],
    "b2-relativ-genitiv": [
        OrderedDict([("type","mc"),("promptDe","Welcher Relativsatz ist richtig?"),("promptAr","أي جملة نسب صحيحة؟"),("options",["Der Mann, dessen Auto rot ist, fährt weg.","Der Mann, sein Auto rot ist, fährt weg.","Der Mann, das Auto rot ist, fährt weg.","Der Mann, denen Auto rot ist, fährt weg."]),("answer",0),("explanationAr","dessen لملكية المذكر/المحايد، deren للمؤنث والجمع.")]),
    ],
    "a1-pruefungsstrategie": [
        OrderedDict([("type","mc"),("promptDe","Wie lesen Sie lange Texte in der Prüfung am besten?"),("promptAr","ما أفضل طريقة لقراءة النصوص الطويلة في الامتحان؟"),("options",["Jedes Wort übersetzen","Erst Aufgaben lesen, dann Text gezielt durchsuchen","Den Text auswendig lernen","Schnell einmal lesen ohne Aufgaben"]),("answer",1),("explanationAr","اقرأ الأسئلة أولاً ثم ابحث في النص عن الجواب.")]),
    ],
}

added = 0
for lid, extras in MORE.items():
    ex = g[lid].setdefault('exercises',[])
    prompts = {e.get('promptDe','') for e in ex}
    for e in extras:
        if e.get('promptDe') not in prompts:
            ex.append(e); added += 1

json.dump(g, open('content/grammar.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/grammar.json','a',encoding='utf-8').write('\n')
print('added', added)
low = [(k,v['level'],len(v.get('exercises',[]))) for k,v in g.items() if len(v.get('exercises',[]))<3]
print('still low:', len(low))
for x in low: print(' ', x)
