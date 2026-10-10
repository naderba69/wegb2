#!/usr/bin/env python3
"""
P-21: du/ihr/Sie explicit lesson mid-A1 / late A0.
Add a grammar topic a0-du-sie teaching the formal/informal distinction, inserted
after a0-begrussung so students know which form to use with strangers from day one.
"""
import json
from collections import OrderedDict

GRAMMAR = 'content/grammar.json'
with open(GRAMMAR, 'r', encoding='utf-8') as f:
    g = json.load(f, object_pairs_hook=OrderedDict)

if 'a0-du-sie' not in g:
    g['a0-du-sie'] = OrderedDict([
        ("id", "a0-du-sie"),
        ("titleDe", "du · ihr · Sie — formell und informell"),
        ("titleAr", "أنتَ وأنتم وأنتم (الرسمي): du وihr وSie"),
        ("level", "A0"),
        ("ziel", "تميّز بين مخاطبة الصديق/الطفل بـ du، مجموعة أصدقاء بـ ihr، والغرباء والكبار بـ Sie (صيغة رسمية دائماً كبيرة)."),
        ("voraus", ["a0-begrussung", "a0-buchstaben"]),
        ("anwendung", OrderedDict([
            ("ar", "تدرّب: قل جملة لصديق (Wie heißt du?), لمجموعة أصدقاء (Woher kommt ihr?), ولشخص غريب (Wie heißen Sie?)."),
            ("de", "Übe: Sag einen Satz zu einem Freund (Wie heißt du?), zu Freunden (Woher kommt ihr?), zu einem Fremden (Wie heißen Sie?)."),
            ("candoIds", ["a0-1", "a0-4"])
        ])),
        ("verify", [
            OrderedDict([
                ("id", "a0-du-sie-v1"),
                ("type", "choice"),
                ("promptDe", "Guten Tag, Frau Schmidt, wie geht es ___?"),
                ("options", ["du", "ihr", "Ihnen"]),
                ("answer", ["Ihnen"]),
                ("explanationAr", "مع Frau Schmidt (شخص أكبر/غريب) نستخدم الصيغة الرسمية: Wie geht es Ihnen?")
            ]),
            OrderedDict([
                ("id", "a0-du-sie-v2"),
                ("type", "choice"),
                ("promptDe", "Hallo Anna, wo wohnst ___?"),
                ("options", ["du", "ihr", "Sie"]),
                ("answer", ["du"]),
                ("explanationAr", "مع صديق/طفل نستخدم du: Wo wohnst du?")
            ]),
            OrderedDict([
                ("id", "a0-du-sie-v3"),
                ("type", "choice"),
                ("promptDe", "Woher kommt ___ (ihr zwei)?"),
                ("options", ["du", "ihr", "Sie"]),
                ("answer", ["ihr"]),
                ("explanationAr", "لمجموعة أصدقاء (أنتما/أنتم غير الرسمي) نستخدم ihr: Woher kommt ihr?")
            ])
        ]),
        ("summaryAr", "في الألمانية ثلاث صيغ للمخاطب: du (أنتَ/أنتِ غير الرسمي للأصدقاء والأطفال)، ihr (أنتم غير الرسمي لمجموعة أصدقاء)، Sie (أنتم الرسمي — دائماً بحرف كبير! — للغرباء والكبار وزملاء العمل والرؤساء والطبيب والموظفين). متى Sie؟ أول لقاء، أكبر سناً، لقب رسمي (Herr/Frau/Dr.). متى du؟ الأصدقاء، الطلبة، الأطفال، أفراد الأسرة."),
        ("rules", [
            OrderedDict([
                ("de", "du = أنتَ/أنتِ (صديق، طفل، قريب)"),
                ("ar", "صيغة غير رسمية للمفرد: تُستعمل مع الأصدقاء، الأطفال، أفراد الأسرة، الطلبة.")
            ]),
            OrderedDict([
                ("de", "ihr = أنتم (مجموعة أصدقاء/أطفال)"),
                ("ar", "صيغة غير رسمية للجمع: لمجموعة من الأصدقاء أو الأطفال.")
            ]),
            OrderedDict([
                ("de", "Sie = أنتَ/أنتِ/أنتم (رسمي) — IMMER großgeschrieben!"),
                ("ar", "صيغة الرسمي للمفرد والجمع معاً: للغرباء، الكبار، زملاء العمل، الموظفين، الطبيب. تكتب دائماً بحرف كبير S.")
            ]),
            OrderedDict([
                ("de", "Faustregel: Bei ersten Begegnungen immer Sie — der Partner sagt schnell \"Du kannst du sagen\"."),
                ("ar", "قاعدة ذهبية: في أول لقاء استخدم Sie دائماً، والطرف الآخر سيقول فوراً «بإمكانك قول du» إذا أراد الصداقة.")
            ])
        ]),
        ("tables", [
            OrderedDict([
                ("captionDe", "du / ihr / Sie im Vergleich"),
                ("captionAr", "مقارنة du وihr وSie"),
                ("headers", ["Situationsbeispiel", "Form", "Arabisch", "Beispiel"]),
                ("rows", [
                    ["Freund(in)", "du", "أنتَ/أنتِ (ودّي)", "Wie heißt du?"],
                    ["Freundesgruppe", "ihr", "أنتم (ودّي)", "Woher kommt ihr?"],
                    ["Fremder/Chef/Arzt", "Sie", "حضرتك/سيادتك (رسمي)", "Wie heißen Sie?"],
                ])
            ])
        ]),
        ("examples", [
            OrderedDict([("de", "Guten Tag, Herr Doktor! Wie geht es Ihnen?"), ("ar", "نهار سعيد يا دكتور! كيف حال حضرتك؟")]),
            OrderedDict([("de", "Hallo Omar! Wie geht es dir?"), ("ar", "أهلاً عمر! كيف حالك؟")]),
            OrderedDict([("de", "Wo wohnt ihr, Anna und Ali?"), ("ar", "أين تسكنان يا آنا وعلي؟")]),
        ]),
        ("eselsbruecke", "تخيل «Sie» مثل «سيادتك» — تبدأ بحرف S كبير دائماً لأن الشخص يستحق احتراماً زائداً. مع الأصدقاء الصغار: du (أنتَ صغير = du = كلمتان قصيرتان)."),
    ])
    print('+ Added a0-du-sie topic')
else:
    print('a0-du-sie already exists')

# Update prerequisites on a0-begrussung examples to reflect that Sie is taught in this lesson (begrussung is already du/Sie examples, no change needed)
# Add a0-du-sie to A0 topic list in plan.ts is done separately.

with open(GRAMMAR, 'w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(f'Wrote {GRAMMAR}')
