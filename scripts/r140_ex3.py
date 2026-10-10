#!/usr/bin/env python3
import json
from collections import OrderedDict
g = json.load(open('content/grammar.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

LAST = {
    "a2-pruefungsstrategie": OrderedDict([("type","mc"),("promptDe","Worauf sollten Sie im Hörverstehen A2 zuerst achten?"),("promptAr","على ماذا تركز أولاً في فهم المسموع A2؟"),("options",["Auf jedes einzelne Wort","Auf Schlüsselwörter (Wer? Wo? Wann? Warum?)","Auf die Grammatik","Auf die Aussprache"]),("answer",1),("explanationAr","الكلمات المفتاحية كافية للإجابة، لا تحاول فهم كل كلمة.")]),
    "b1-pruefungsstrategie": OrderedDict([("type","mc"),("promptDe","Wenn Sie im Sprechen Teil 1 (Kontakt) ein Wort nicht wissen, was tun Sie?"),("promptAr","إذا لم تعرف كلمة في المحادثة الجزء 1، ماذا تفعل؟"),("options",["Schweigen","Auf Arabisch sagen","Umschreiben (Paraphrase)","Den Satz abbrechen"]),("answer",2),("explanationAr","عُبّر عنها بكلمات أخرى؛ التفاهم يُقاس لا الكلمة.")]),
    "b2-pruefungsstrategie": OrderedDict([("type","mc"),("promptDe","Wie lang soll die Vorbereitung auf die Präsentation (Teil 2) sein?"),("promptAr","كم طول وقت التحضير للعرض؟"),("options",["1 Minute","3 Minuten","10 Minuten","Keine Vorbereitung"]),("answer",1),("explanationAr","في Goethe B2 ثلاث دقائق للتحضير.")]),
}

for lid, ex in LAST.items():
    arr = g[lid].setdefault('exercises',[])
    if len(arr) < 3 and not any(e.get('promptDe')==ex.get('promptDe') for e in arr):
        arr.append(ex)

json.dump(g, open('content/grammar.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/grammar.json','a',encoding='utf-8').write('\n')

low = [(k,v['level'],len(v.get('exercises',[]))) for k,v in g.items() if len(v.get('exercises',[]))<3]
print('low:', low)
total = sum(len(v.get('exercises',[])) for v in g.values())
print('total exercises:', total)
