#!/usr/bin/env python3
"""Add a0-satzbau grammar lesson and insert it into COURSE_TOPIC_ORDER A0 list."""
import json
from collections import OrderedDict

g = json.load(open('content/grammar.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
if 'a0-satzbau' in g:
    print('a0-satzbau already exists')
else:
    g['a0-satzbau'] = OrderedDict([
        ("id","a0-satzbau"),
        ("level","A0"),
        ("titleDe","Der einfache Satz: Wer → Verb → Was?"),
        ("titleAr","الجملة البسيطة: مَن → فِعل → ماذا؟"),
        ("ziel","تُكوِّن جملةً ألمانية قصيرة صحيحة الترتيب: الفعل في الموقع الثاني."),
        ("voraus",["a0-begrussung","a0-artikel"]),
        ("summaryDe","Im deutschen Hauptsatz steht das konjugierte Verb an zweiter Stelle. Subjekt, Verb, Rest."),
        ("summaryAr","في الجملة الألمانية الرئيسية، الفعل المُصرَّف في الموقع الثاني: فاعل → فعل → بقية."),
        ("rules",[
            OrderedDict([("de","Ich heiße Ali."),("ar","اسمي علي (فاعل → فعل → تكملة).")]),
            OrderedDict([("de","Ich wohne in Berlin."),("ar","أسكن في برلين (مكان).")]),
            OrderedDict([("de","Heute trinke ich Kaffee."),("ar","اليوم أشرب قهوة — بعد «Heute» يأتي الفعل مباشرة ثم الفاعل.")]),
            OrderedDict([("de","Mein Vater ist Arzt."),("ar","أبي طبيب.")]),
        ]),
        ("exercises",[
            OrderedDict([("type","mc"),("promptDe","Welcher Satz ist richtig?"),("promptAr","أي الجمل صحيحة؟"),("options",["Ich wohne in Berlin.","Ich in Berlin wohne.","Wohne ich in Berlin.","In Berlin ich wohne."]),("answer",0),("explanationAr","الفاعل أولاً ثم الفعل ثم المكان.")]),
            OrderedDict([("type","mc"),("promptDe","___ trinke ich Tee."),("promptAr","أكمِل: … أشرب شاياً."),("options",["Ich","Heute","Tee","Bin"]),("answer",1),("explanationAr","Heute trinke ich Tee — الفعل في المرتبة الثانية.")]),
        ]),
        ("commonErrors",[
            OrderedDict([("falsch","*Heute ich trinke Kaffee."),("richtig","Heute trinke ich Kaffee."),("ar","عند البدء بظرف، الفعل يبقى في الموقع الثاني.")]),
        ]),
        ("pitfalls",[OrderedDict([("de","Der häufigste Anfängerfehler: Verb an letzter Stelle oder nach dem Subjekt nach einem Adverb."),("ar","الأكثر شيوعاً: وضع الفعل في غير المرتبة الثانية.")])]),
        ("anwendung",OrderedDict([("de","Schreibe 3 Sätze über dich."),("ar","اكتب 3 جمل عن نفسك.")])),
        ("redemittel",["Ich heiße …","Ich bin … Jahre alt.","Ich wohne in …","Ich komme aus …"]),
    ])
    json.dump(g, open('content/grammar.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
    open('content/grammar.json','a',encoding='utf-8').write('\n')
    print('Added a0-satzbau')

# Update COURSE_TOPIC_ORDER in lib/plan.ts to include a0-satzbau after a0-artikel
plan = open('lib/plan.ts',encoding='utf-8').read()
old = 'A0: ["a0-begrussung", "a0-buchstaben", "a0-du-sie", "a0-artikel", "a0-aussprache-vowels", "a0-zahlen", "a0-aussprache-umlaut"'
new = 'A0: ["a0-begrussung", "a0-buchstaben", "a0-du-sie", "a0-artikel", "a0-satzbau", "a0-aussprache-vowels", "a0-zahlen", "a0-aussprache-umlaut"'
if old in plan and 'a0-satzbau' not in plan.split('PHASE_TOPICS')[1][:300]:
    plan2 = plan.replace(old,new,1)
    open('lib/plan.ts','w',encoding='utf-8').write(plan2)
    print('Inserted a0-satzbau into A0 topic order')
else:
    print('Plan already contains a0-satzbau or pattern mismatch')
