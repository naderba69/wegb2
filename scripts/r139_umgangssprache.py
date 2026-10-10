#!/usr/bin/env python3
"""R139: add colloquial phrases / Redemittel for B1/B2 in sprichwort/redemittel bank — use sentences.json entries tagged 'umgang'."""
import json
from collections import OrderedDict, Counter

NEUE = [
    # B1 umgangssprachliche Redewendungen
    OrderedDict([("id","s-b1-200"),("level","B1"),("de","Das ist mir egal."),("ar","هذا لا يهمني (عامّي)."),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-201"),("level","B1"),("de","Keine Sorge, das schaffen wir!"),("ar","لا تقلق، سننجز ذلك!"),("tags",["umgang","ermutigung"])]),
    OrderedDict([("id","s-b1-202"),("level","B1"),("de","Das kannst du laut sagen!"),("ar","يمكنك قول ذلك بصوت عالٍ (أي: أنا أتفق تماماً)."),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-203"),("level","B1"),("de","Ich glaube, ich spinne!"),("ar","أظنني أُجنّ! (للتعبير عن الذهول)."),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-204"),("level","B1"),("de","Mensch, das habe ich total vergessen!"),("ar","يا إلهي، لقد نسيت ذلك تماماً!"),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-205"),("level","B1"),("de","Na also, geht doch!"),("ar","هيا بنا، يُحَلُّ الأمر! (عند إصلاح مشكلة)."),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-206"),("level","B1"),("de","Schauen wir mal!"),("ar","لنرَ!"),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-207"),("level","B1"),("de","Da kann man nichts machen."),("ar","لا يمكن فعل شيء حيال ذلك."),("tags",["umgang"])]),
    OrderedDict([("id","s-b1-208"),("level","B1"),("de","Ich habe die Nase voll."),("ar","لقد طفح بي الكيل."),("tags",["umgang","redewendung"])]),
    OrderedDict([("id","s-b1-209"),("level","B1"),("de","Das ist doch kein Weltuntergang."),("ar","هذه ليست نهاية العالم."),("tags",["umgang","redewendung"])]),
    OrderedDict([("id","s-b1-210"),("level","B1"),("de","Kopf hoch!"),("ar","ارفع رأسك! (تشجيع)."),("tags",["umgang","ermutigung"])]),
    OrderedDict([("id","s-b1-211"),("level","B1"),("de","Es ist höchste Eisenbahn."),("ar","حان الوقت تماماً (لم يعد هناك وقت)."),("tags",["umgang","redewendung"])]),
    # B2
    OrderedDict([("id","s-b2-200"),("level","B2"),("de","Das ist weder Fisch noch Fleisch."),("ar","لا سمك ولا لحم (لا هو هذا ولا ذاك)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-201"),("level","B2"),("de","Ich bin fix und fertig."),("ar","أنا مُنهَك تماماً."),("tags",["umgang"])]),
    OrderedDict([("id","s-b2-202"),("level","B2"),("de","Na klar, kein Problem!"),("ar","طبعاً، لا مشكلة!"),("tags",["umgang"])]),
    OrderedDict([("id","s-b2-203"),("level","B2"),("de","Das schlägt dem Fass den Boden aus!"),("ar","هذا يُفجّر البرميل (تجاوز كل الحدود)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-204"),("level","B2"),("de","Das ist ein Katzensprung."),("ar","على قفزة قطة (مسافة قصيرة جداً)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-205"),("level","B2"),("de","Tomaten auf den Augen haben."),("ar","أن يكون لديك طماطم على عينيك (لا ترى الواضح)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-206"),("level","B2"),("de","Da liegt der Hase im Pfeffer."),("ar","هنا يكمن الأرنب في الفلفل (هنا بيت القصيد/المشكلة)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-207"),("level","B2"),("de","Das ist nicht mein Bier."),("ar","هذا ليس شأني/ليست بيرتي."),("tags",["umgang","redewendung"])]),
    OrderedDict([("id","s-b2-208"),("level","B2"),("de","Hals- und Beinbruch!"),("ar","كسراً للعنق والرجل (كناية بالتوفيق قبل مهمة/امتحان)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-209"),("level","B2"),("de","Ich drücke dir die Daumen!"),("ar","أعصر إبهامي لك (أتمنى لك الحظ)."),("tags",["redewendung"])]),
    OrderedDict([("id","s-b2-210"),("level","B2"),("de","Jetzt mal Butter bei die Fische!"),("ar","الآن نضع الزبد على السمك (لنتكلم بصراحة/بجد)."),("tags",["redewendung"])]),
]

s = json.load(open('content/sentences.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing = {x['id'] for x in s}
added = 0
for x in NEUE:
    if x['id'] not in existing:
        s.append(x); added += 1
with open('content/sentences.json','w',encoding='utf-8') as f:
    json.dump(s,f,ensure_ascii=False,indent=2); f.write('\n')
print(f"Added {added} colloquial/redewendung sentences. Total: {len(s)}")
print("Per level:", dict(Counter(x['level'] for x in s)))
