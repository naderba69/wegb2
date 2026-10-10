#!/usr/bin/env python3
"""R140b: add 1–2 extra exercises to any grammar lesson with fewer than 3 exercises."""
import json
from collections import OrderedDict

g = json.load(open('content/grammar.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

# Map of lesson id -> extra exercises (multiple choice)
EXTRAS = {
    "a0-aussprache-umlaut": [
        OrderedDict([("type","mc"),("promptDe","Welches Wort enthält ö?"),("promptAr","أي كلمة تحتوي على ö؟"),("options",["Glück","schön","Haus","Tür"]),("answer",1),("explanationAr","schön فيها ö.")]),
        OrderedDict([("type","mc"),("promptDe","Welches Wort enthält ü?"),("promptAr","أي كلمة تحتوي على ü؟"),("options",["schön","Männer","Tür","Heft"]),("answer",2),("explanationAr","Tür فيها ü.")]),
    ],
    "a0-satzbau": [
        OrderedDict([("type","mc"),("promptDe","Wo steht das Verb im deutschen Satz?"),("promptAr","أين يقع الفعل المصرف في الجملة الألمانية الرئيسية؟"),("options",["Am Anfang","An zweiter Stelle","Am Ende","Vor dem Subjekt"]),("answer",1),("explanationAr","الفعل في المرتبة الثانية دائماً في الجملة الخبرية.")]),
    ],
    "a1-aussprache-ch": [
        OrderedDict([("type","mc"),("promptDe","In welchem Wort klingt ch «weich» (ich-Laut)?"),("promptAr","في أي كلمة ينطق ch ناعماً (ich-Laut)؟"),("options",["Buch","ich","Nacht","Kuchen"]),("answer",1),("explanationAr","بعد i/e/ä/ö/ü/ei/eu ينطق ch ناعماً.")]),
    ],
    "a1-aussprache-r": [
        OrderedDict([("type","mc"),("promptDe","Wie klingt r am Silbenende (Vater) oft?"),("promptAr","كيف يُنطَق r في نهاية المقطع (Vater)؟"),("options",["Gerollt (wie im Italienischen)","Dunkles a (Vokal)","Wie l","Wie ch"]),("answer",1),("explanationAr","في نهاية المقطع يُنطَق r كحرف علة داكن.")]),
    ],
    "a2-pruefungsstrategie": [
        OrderedDict([("type","mc"),("promptDe","Wie viel Zeit sollten Sie sich pro Aufgabe in der Prüfung ungefähr nehmen?"),("promptAr","كم من الوقت ينبغي أن تأخذ لكل تمرين في الامتحان تقريباً؟"),("options",["So viel Zeit wie nötig","Pro Aufgabe im Verhältnis zur Punktzahl","Immer 5 Minuten","Nur die schwierigen Aufgaben zuerst"]),("answer",1),("explanationAr","وزّع الوقت على التمارين بحسب الدرجات، لا تحبس نفسك على سؤال واحد.")]),
    ],
    "b1-pruefungsstrategie": [
        OrderedDict([("type","mc"),("promptDe","Wie viele Wörter brauchen Sie im Schreiben-Teil B1 Goethe ungefähr?"),("promptAr","كم كلمة يجب أن تكتب في جزء الكتابة B1 Goethe تقريباً؟"),("options",["ca. 30 Wörter","ca. 80 Wörter","ca. 100–120 Wörter","ca. 300 Wörter"]),("answer",2),("explanationAr","المطلوب B1 حوالي 100 كلمة (بريد إلكتروني 40 + رسالة 80 تقريباً).")]),
    ],
    "b2-pruefungsstrategie": [
        OrderedDict([("type","mc"),("promptDe","Was ist im B2-Sprechen Teil 2 verlangt?"),("promptAr","ماذا يُطلب في جزء الكلام B2 Teil 2؟"),("options",["Nur Begrüßung","Präsentation (Monolog) mit Begründung","Vorlesen eines Textes","Wortschatztest"]),("answer",1),("explanationAr","عرض (مونولوج) مدعّم بالحجج.")]),
    ],
}

added_total = 0
for lid, extras in EXTRAS.items():
    if lid not in g:
        print('not found:', lid); continue
    ex = g[lid].setdefault('exercises', [])
    existing_prompts = {e.get('promptDe','') for e in ex}
    for e in extras:
        if e.get('promptDe') not in existing_prompts:
            ex.append(e); added_total += 1

json.dump(g, open('content/grammar.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/grammar.json','a',encoding='utf-8').write('\n')
print(f'Added {added_total} extra exercises.')

# Verify min per lesson
low = []
for k,v in g.items():
    if len(v.get('exercises',[])) < 3:
        low.append((k, v.get('level'), len(v.get('exercises',[]))))
print(f'Lessons still w/ <3 exercises: {len(low)}')
for x in low[:10]: print(' ', x)
