#!/usr/bin/env python3
"""R140e: beef up B2 vocab (thicken b2-medien-schule + add new deck b2-politik-demokratie)."""
import json
from collections import OrderedDict
v = json.load(open('content/vocab.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

# Thicken b2-medien-schule if < 45 cards
thicken = [
    OrderedDict([("de","der Kommentar, -e"),("ar","تعليق (رأي صحفي)")]),
    OrderedDict([("de","die Berichterstattung"),("ar","التغطية الإخبارية")]),
    OrderedDict([("de","die Quelle, -n"),("ar","مصدر")]),
    OrderedDict([("de","die Nachrichtensendung, -en"),("ar","نشرة الأخبار")]),
    OrderedDict([("de","die Talkshow, -s"),("ar","برنامج حواري")]),
    OrderedDict([("de","die Schlagzeile, -n"),("ar","عنوان بارز")]),
    OrderedDict([("de","das Boulevardblatt, -äer"),("ar","صحيفة شعبية")]),
    OrderedDict([("de","die Medienkompetenz"),("ar","الإعلامية التربوية (مهارة التعامل مع الإعلام)")]),
    OrderedDict([("de","der Schulabschluss, -schlüsse"),("ar","شهادة إنهاء المدرسة")]),
    OrderedDict([("de","das Abitur"),("ar","الشهادة الثانوية المؤهلة للجامعة")]),
    OrderedDict([("de","die Klassenarbeit, -en"),("ar","امتحان فصل")]),
    OrderedDict([("de","die Note, -n"),("ar","علامة / درجة")]),
    OrderedDict([("de","das Zeugnis, -se"),("ar","كشف علامات")]),
    OrderedDict([("de","der Lehrplan, -pläne"),("ar","المنهاج الدراسي")]),
    OrderedDict([("de","das Schulsystem, -e"),("ar","النظام المدرسي")]),
]
deck = v.get('b2-medien-schule')
if deck:
    existing = {c['de'] for c in deck['cards']}
    for c in thicken:
        if c['de'] not in existing:
            deck['cards'].append(c)
    print('b2-medien-schule now has', len(deck['cards']), 'cards')

# New deck b2-politik-demokratie
new_deck = OrderedDict([
    ("id","b2-politik-demokratie"),
    ("titelDe","Politik und Demokratie"),
    ("titelAr","السياسة والديمقراطية"),
    ("level","B2"),
    ("cards",[
        OrderedDict([("de","die Demokratie, -n"),("ar","الديمقراطية")]),
        OrderedDict([("de","die Wahl, -en"),("ar","الانتخاب")]),
        OrderedDict([("de","der Wähler/die Wählerin, -"),("ar","الناخب/ة")]),
        OrderedDict([("de","die Partei, -en"),("ar","الحزب")]),
        OrderedDict([("de","die Regierung, -en"),("ar","الحكومة")]),
        OrderedDict([("de","der Bundestag"),("ar","البوندستاغ")]),
        OrderedDict([("de","der Bundesrat"),("ar","البوندسرات")]),
        OrderedDict([("de","das Grundgesetz"),("ar","القانون الأساسي")]),
        OrderedDict([("de","der Bundeskanzler/die Bundeskanzlerin, -"),("ar","المستشار/ة الاتحادي/ة")]),
        OrderedDict([("de","der Bundespräsident/die Bundespräsidentin, -en"),("ar","الرئيس الاتحادي")]),
        OrderedDict([("de","die Koalition, -en"),("ar","الائتلاف")]),
        OrderedDict([("de","die Opposition"),("ar","المعارضة")]),
        OrderedDict([("de","das Wahlrecht"),("ar","حق الانتخاب")]),
        OrderedDict([("de","die Meinungsfreiheit"),("ar","حرية الرأي")]),
        OrderedDict([("de","die Pressefreiheit"),("ar","حرية الصحافة")]),
        OrderedDict([("de","das Gesetz, -e"),("ar","القانون")]),
        OrderedDict([("de","der Beschluss, -schlüsse"),("ar","قرار")]),
        OrderedDict([("de","die Abstimmung, -en"),("ar","تصويت")]),
        OrderedDict([("de","die Mehrheit, -en"),("ar","الأكثرية")]),
        OrderedDict([("de","die Minderheit, -en"),("ar","الأقلية")]),
        OrderedDict([("de","das Mitglied, -er"),("ar","عضو")]),
        OrderedDict([("de","der Abgeordnete/die Abgeordnete, -n"),("ar","النائب/ة")]),
        OrderedDict([("de","die Verfassung, -en"),("ar","الدستور")]),
        OrderedDict([("de","die Sozialversicherung, -en"),("ar","التأمين الاجتماعي")]),
        OrderedDict([("de","der Sozialstaat, -en"),("ar","دولة الرعاية")]),
        OrderedDict([("de","die Globalisierung"),("ar","العولمة")]),
        OrderedDict([("de","die EU (Europäische Union)"),("ar","الاتحاد الأوروبي")]),
        OrderedDict([("de","die Nachhaltigkeit"),("ar","الاستدامة")]),
        OrderedDict([("de","der Protest, -e"),("ar","احتجاج")]),
        OrderedDict([("de","die Demonstration, -en"),("ar","مظاهرة")]),
        OrderedDict([("de","die Rente, -n"),("ar","التقاعد")]),
        OrderedDict([("de","das Steuersystem, -e"),("ar","النظام الضريبي")]),
        OrderedDict([("de","die Inflation"),("ar","التضخم")]),
        OrderedDict([("de","die Arbeitslosigkeit"),("ar","البطالة")]),
        OrderedDict([("de","der Mindestlohn, -löhne"),("ar","الحد الأدنى للأجور")]),
    ]),
])
if 'b2-politik-demokratie' not in v:
    v['b2-politik-demokratie'] = new_deck
    print('added new deck b2-politik-demokratie with', len(new_deck['cards']), 'cards')

# Register in plan.ts
plan = open('lib/plan.ts','r',encoding='utf-8').read()
if '"b2-politik-demokratie"' not in plan:
    plan = plan.replace('"b2-medien-schule"', '"b2-medien-schule", "b2-politik-demokratie"', 1)
    open('lib/plan.ts','w',encoding='utf-8').write(plan)

json.dump(v, open('content/vocab.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/vocab.json','a',encoding='utf-8').write('\n')

# counts
by_level = {}
for k,d in v.items():
    lv = d.get('level','?')
    by_level.setdefault(lv, [0,0])
    by_level[lv][0] += 1
    by_level[lv][1] += len(d.get('cards',[]))
for lv in ['A0','A1','A2','B1','B2']:
    print(lv, by_level.get(lv,[0,0]))
