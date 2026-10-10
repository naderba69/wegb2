#!/usr/bin/env python3
"""R140c: add A0 vocab decks (Zahlen/Farben/Obst-Gemuese) and A0 Fehler entries."""
import json
from collections import OrderedDict
import re

# ---- Vocab ----
v = json.load(open('content/vocab.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

new_decks = [
    OrderedDict([
        ("id","a0-zahlen"),
        ("titelDe","Zahlen 0–20 + Zehner"),
        ("titelAr","الأرقام من 0 إلى 20 والعشرات"),
        ("level","A0"),
        ("cards",[
            OrderedDict([("de","null"),("ar","٠")]),
            OrderedDict([("de","eins"),("ar","١")]),
            OrderedDict([("de","zwei"),("ar","٢")]),
            OrderedDict([("de","drei"),("ar","٣")]),
            OrderedDict([("de","vier"),("ar","٤")]),
            OrderedDict([("de","fünf"),("ar","٥")]),
            OrderedDict([("de","sechs"),("ar","٦")]),
            OrderedDict([("de","sieben"),("ar","٧")]),
            OrderedDict([("de","acht"),("ar","٨")]),
            OrderedDict([("de","neun"),("ar","٩")]),
            OrderedDict([("de","zehn"),("ar","١٠")]),
            OrderedDict([("de","elf"),("ar","١١")]),
            OrderedDict([("de","zwölf"),("ar","١٢")]),
            OrderedDict([("de","dreizehn"),("ar","١٣")]),
            OrderedDict([("de","zwanzig"),("ar","٢٠")]),
            OrderedDict([("de","dreißig"),("ar","٣٠")]),
            OrderedDict([("de","hundert"),("ar","١٠٠")]),
            OrderedDict([("de","einhundert"),("ar","مئة")]),
        ]),
    ]),
    OrderedDict([
        ("id","a0-farben"),
        ("titelDe","Farben"),
        ("titelAr","الألوان"),
        ("level","A0"),
        ("cards",[
            OrderedDict([("de","rot"),("ar","أحمر")]),
            OrderedDict([("de","blau"),("ar","أزرق")]),
            OrderedDict([("de","grün"),("ar","أخضر")]),
            OrderedDict([("de","gelb"),("ar","أصفر")]),
            OrderedDict([("de","schwarz"),("ar","أسود")]),
            OrderedDict([("de","weiß"),("ar","أبيض")]),
            OrderedDict([("de","orange"),("ar","برتقالي")]),
            OrderedDict([("de","lila"),("ar","بنفسجي")]),
            OrderedDict([("de","braun"),("ar","بني")]),
            OrderedDict([("de","grau"),("ar","رمادي")]),
            OrderedDict([("de","rosa"),("ar","وردي")]),
            OrderedDict([("de","dunkelblau"),("ar","أزرق داكن")]),
            OrderedDict([("de","hellgrün"),("ar","أخضر فاتح")]),
        ]),
    ]),
    OrderedDict([
        ("id","a0-obst-gemuese"),
        ("titelDe","Obst und Gemüse"),
        ("titelAr","الفاكهة والخضار"),
        ("level","A0"),
        ("cards",[
            OrderedDict([("de","der Apfel, Äpfel"),("ar","تفاحة")]),
            OrderedDict([("de","die Banane, -n"),("ar","موزة")]),
            OrderedDict([("de","die Orange, -n"),("ar","برتقالة")]),
            OrderedDict([("de","die Tomate, -n"),("ar","طماطم")]),
            OrderedDict([("de","die Kartoffel, -n"),("ar","بطاطس")]),
            OrderedDict([("de","der Salat, -e"),("ar","خسّ / سلطة")]),
            OrderedDict([("de","die Möhre, -n"),("ar","جزر")]),
            OrderedDict([("de","die Zwiebel, -n"),("ar","بصل")]),
            OrderedDict([("de","der Apfelsinensaft"),("ar","عصير البرتقال")]),
            OrderedDict([("de","die Gurke, -n"),("ar","خيار")]),
            OrderedDict([("de","die Erdbeere, -n"),("ar","فراولة")]),
            OrderedDict([("de","der Apfelstrudel"),("ar","سترودل التفاح")]),
            OrderedDict([("de","die Zitrone, -n"),("ar","ليمون")]),
            OrderedDict([("de","das Obst"),("ar","الفاكهة")]),
            OrderedDict([("de","das Gemüse"),("ar","الخضار")]),
            OrderedDict([("de","der Reis"),("ar","الأرز")]),
            OrderedDict([("de","das Brot, -e"),("ar","الخبز")]),
        ]),
    ]),
]

for d in new_decks:
    if d['id'] not in v:
        v[d['id']] = d

# register in plan.ts for A0
plan = open('lib/plan.ts','r',encoding='utf-8').read()
if '"a0-zahlen"' not in plan:
    plan = plan.replace('PHASE_DECKS = {', 'PHASE_DECKS = {\n  A0: ["a0-zahlen","a0-farben","a0-obst-gemuese"],')
    # but need to ensure no double A0 key
    if plan.count('A0: [') > 1:
        plan = open('lib/plan.ts','r',encoding='utf-8').read()
        plan = re.sub(r'  A0: \[[^\]]*\],', '  A0: ["a0-zahlen","a0-farben","a0-obst-gemuese"],', plan)
    open('lib/plan.ts','w',encoding='utf-8').write(plan)

json.dump(v, open('content/vocab.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/vocab.json','a',encoding='utf-8').write('\n')

# ---- Fehler A0 ----
fdata = json.load(open('content/fehler.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
# if list, wrap into {'entries': [...]}, else use as-is
if isinstance(fdata, list):
    f = OrderedDict([('entries', fdata)])
else:
    f = fdata
new_f = [
    OrderedDict([
        ("id","f-a0-001"),
        ("falsch","*ich bin gehen"),
        ("richtig","ich gehe"),
        ("regelAr","الفعل يصرف للمتكلم: gehen → ich gehe (لا نستخدم bin مع الفعل الرئيسي)."),
        ("level","A0"),
        ("kategorie","Verbkonjugation"),
    ]),
    OrderedDict([
        ("id","f-a0-002"),
        ("falsch","*ich habe 30 Jahr alt"),
        ("richtig","ich bin 30 Jahre alt"),
        ("regelAr","العمر يأتي مع فعل sein، والاسم Jahre بالجمع بعد رقم غير الواحد."),
        ("level","A0"),
        ("kategorie","Alter / sein"),
    ]),
    OrderedDict([
        ("id","f-a0-003"),
        ("falsch","*ich heiße Ali bin"),
        ("richtig","ich heiße Ali"),
        ("regelAr","heißen وحده يكفي لذكر الاسم؛ لا داعي لكلمة bin."),
        ("level","A0"),
        ("kategorie","heißen"),
    ]),
    OrderedDict([
        ("id","f-a0-004"),
        ("falsch","*ich bin ein Mann aus Syrien heiße Karim"),
        ("richtig","ich heiße Karim und komme aus Syrien"),
        ("regelAr","جملتان مستقلتان تربطهما und؛ لا تُجعل جملة واحدة بلا فعل رابط."),
        ("level","A0"),
        ("kategorie","Satzbau"),
    ]),
    OrderedDict([
        ("id","f-a0-005"),
        ("falsch","*ich wohne in Berlin seit 2022"),
        ("richtig","ich wohne seit 2022 in Berlin"),
        ("regelAr","الزمن/المدة (seit …) غالباً قبل المكان في الجملة البسيطة (حسب قواعد TeKaMoLo تمهيداً للA1)."),
        ("level","A0"),
        ("kategorie","Wortstellung"),
    ]),
    OrderedDict([
        ("id","f-a0-006"),
        ("falsch","*das ist ein Buch rot"),
        ("richtig","das ist ein rotes Buch"),
        ("regelAr","الصفة تأتي قبل الاسم في الألمانية، لا بعده."),
        ("level","A0"),
        ("kategorie","Adjektivstellung"),
    ]),
    OrderedDict([
        ("id","f-a0-007"),
        ("falsch","*ich nicht verstehe"),
        ("richtig","ich verstehe nicht"),
        ("regelAr","nicht في نهاية الجملة بعد الفعل المصرف في جملة بسيطة."),
        ("level","A0"),
        ("kategorie","Negation"),
    ]),
    OrderedDict([
        ("id","f-a0-008"),
        ("falsch","*ein Frau"),
        ("richtig","eine Frau"),
        ("regelAr","Frau اسم مؤنث → المُنكّر eine، der → ein، die → eine، das → ein."),
        ("level","A0"),
        ("kategorie","Artikel"),
    ]),
]
existing_f = {e['id'] for e in f['entries']}
for e in new_f:
    if e['id'] not in existing_f:
        f['entries'].append(e)

# preserve original shape if it was a list
if isinstance(fdata, list):
    out = f['entries']
else:
    out = f
json.dump(out, open('content/fehler.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/fehler.json','a',encoding='utf-8').write('\n')

a0decks = [v[k] for k in v if v[k].get('level')=='A0']
print('A0 decks now:', len(a0decks), 'with', sum(len(d.get('cards',[])) for d in a0decks), 'cards')
print('A0 fehler:', len([e for e in f['entries'] if e.get('level')=='A0']))
