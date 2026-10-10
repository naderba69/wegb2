#!/usr/bin/env python3
"""R139: beef up grammar lessons with only 1–2 exercises to have at least 3."""
import json
from collections import OrderedDict

g = json.load(open('content/grammar.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

def add_ex(lesson_id, ex):
    if lesson_id not in g: return 0
    lst = g[lesson_id].setdefault('exercises',[])
    # avoid duplicate by checking promptDe
    existing_prompts = {e.get('promptDe','') for e in lst}
    added = 0
    for e in ex:
        if e.get('promptDe') in existing_prompts: continue
        lst.append(e); added += 1
    return added

added = 0

# a0-aussprache-umlaut
added += add_ex('a0-aussprache-umlaut', [
    OrderedDict([("type","mc"),("promptDe","Welches Wort enthält ein ü?"),("promptAr","أي كلمة تحتوي على ü؟"),("options",["der Hut","die Tür","das Ohr","der Apfel"]),("answer",1),("explanationAr","die Tür كلمة فيها ü.")]),
    OrderedDict([("type","mc"),("promptDe","Welches Wort klingt wie «offenes e» (ä)?"),("promptAr","أي كلمة فيها ä؟"),("options",["schön","Männer","Uhr","Fuß"]),("answer",1),("explanationAr","Männer = مِنَر، فيها ä.")]),
])

# a1-aussprache-ch
added += add_ex('a1-aussprache-ch', [
    OrderedDict([("type","mc"),("promptDe","Wo klingt ch wie in «ich» (weich)?"),("promptAr","أين ينطق ch ناعماً كـich؟"),("options",["nach a/o/u (Buch)","nach e/i/ä/ö/ü/ei/eu (ich)","nach s","immer gleich"]),("answer",1),("explanationAr","بعد حروف e/i/ä/ö/ü/ei/eu يُنطَق ch ناعماً.")]),
])

# a1-aussprache-r
added += add_ex('a1-aussprache-r', [
    OrderedDict([("type","mc"),("promptDe","Wie wird das r am Silbenende oft im Hochdeutschen ausgesprochen?"),("promptAr","كيف يُنطَق r في نهاية المقطع في الفصحى؟"),("options",["Wie ein gerolltes Zungen-r","Wie ein dunkler a-Laut (Vokal)","Wie ein ch","Wie ein sch"]),("answer",1),("explanationAr","نهاية المقطع r تنطق كصوت حرف علة داكن شبيه بـa، مثل «Vater».")]),
])

# a1-aussprache-sp-st
added += add_ex('a1-aussprache-sp-st', [
    OrderedDict([("type","mc"),("promptDe","Wie spricht man <sp> am Wortanfang aus?"),("promptAr","كيف ينطق sp في أول الكلمة؟"),("options",["sp wie in Italienisch","schp","sb","ʃp نعم — shp"]),("answer",1),("explanationAr","في أول الكلمة تنطق shp (Schprache, Stadt=Shtadt).")]),
    OrderedDict([("type","mc"),("promptDe","Welches Wort wird mit «schp» ausgesprochen?"),("promptAr","أي كلمة تنطق «shp»؟"),("options",["Sport","Fest","Wespe","Haus"]),("answer",0),("explanationAr","Sport تنطق «Schport» لأن sp في أول الكلمة.")]),
])

# a1-aussprache-auslaut
added += add_ex('a1-aussprache-auslaut', [
    OrderedDict([("type","mc"),("promptDe","Wie spricht man das <b> am Wortende aus?"),("promptAr","كيف ينطق b في آخر الكلمة؟"),("options",["immer b","wie p","wie m","wie f"]),("answer",1),("explanationAr","في آخر الكلمة ينطق b→p وd→t وg→k (Auslautverhärtung).")]),
    OrderedDict([("type","mc"),("promptDe","Welches Wort zeigt Auslautverhärtung?"),("promptAr","أي كلمة تُظهر قلب نهاية المقطع؟"),("options",["Ball","Tag → Tak","Hund","Katze"]),("answer",1),("explanationAr","Tag ينطق Tak.")]),
])

# a0-satzbau (we only added 2 exercises — add more)
added += add_ex('a0-satzbau', [
    OrderedDict([("type","mc"),("promptDe","Ordne richtig: komme / aus / ich / Tunesien"),("promptAr","رتِّب: komme / aus / ich / Tunesien"),("options",["Aus ich komme Tunesien","Ich komme aus Tunesien","Ich aus Tunesien komme","Komme ich aus Tunesien"]),("answer",1),("explanationAr","الفاعل Ich أولاً ثم الفعل komme ثم aus Tunesien.")]),
    OrderedDict([("type","mc"),("promptDe","Welches Satz ist richtig?"),("promptAr","أي الجمل صحيح؟"),("options",["Morgen ich gehe zum Arzt.","Morgen gehe ich zum Arzt.","Ich zum Arzt gehe morgen.","Gehe ich zum Arzt morgen."]),("answer",1),("explanationAr","بعد ظرف الزمان Morgen يأتي الفعل في الموقع الثاني.")]),
])

json.dump(g, open('content/grammar.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/grammar.json','a',encoding='utf-8').write('\n')
print(f"Added {added} extra exercises")
