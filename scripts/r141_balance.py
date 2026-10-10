#!/usr/bin/env python3
"""R141d: balance B1/B2 Fehler (+10 each) and add 10 A1/A2 example sentences."""
import json
from collections import OrderedDict, Counter

# ---- B1 + B2 Fehler (10 each) ----
f = json.load(open('content/fehler.json',encoding='utf-8'))

new_b1 = [
    OrderedDict([("id","f-b1-046"),("falsch","*Wenn ich viel Geld habe, würde ich eine Reise machen."),("richtig","Wenn ich viel Geld hätte, würde ich eine Reise machen."),("regelAr","شرط غير واقعي في الحاضر: Konjunktiv II في جملة الشرط، وwürde + Infinitiv في الجواب."),("level","B1"),("kategorie","Konjunktiv II")]),
    OrderedDict([("id","f-b1-047"),("falsch","*Ich freue mich auf den Urlaub, weil ich will mich ausruhen."),("richtig","Ich freue mich auf den Urlaub, weil ich mich ausruhen will."),("regelAr","في weil-Satz يذهب الفعل المُصرف إلى النهاية."),("level","B1"),("kategorie","Nebensatz Wortstellung")]),
    OrderedDict([("id","f-b1-048"),("falsch","*Der Mann, der ich ihn getroffen habe."),("richtig","Der Mann, den ich getroffen habe."),("regelAr","في جملة Relativ للمفعول به المذكر: den ولا نعيد الضمير ihn."),("level","B1"),("kategorie","Relativsatz Akkusativ")]),
    OrderedDict([("id","f-b1-049"),("falsch","*Trotz dem Regen gehen wir spazieren."),("richtig","Trotz des Regens gehen wir spazieren."),("regelAr","trotz + Genitiv (des Regens)."),("level","B1"),("kategorie","Genitiv / trotz")]),
    OrderedDict([("id","f-b1-050"),("falsch","*Während ich ferngesehen habe, hat das Telefon geläutet."),("richtig","Während ich ferngesehen habe, hat das Telefon geläutet. / Während ich fernsah, klingelte das Telefon."),("regelAr","الصيغة صحيحة لغوياً لكن في السرد المكتوب يُفضّل Präteritum للخلفية (klingelte / sah fern)."),("level","B1"),("kategorie","Tempus")]),
    OrderedDict([("id","f-b1-051"),("falsch","*Ich habe mein Handy zu Hause vergisst."),("richtig","Ich habe mein Handy zu Hause vergessen."),("regelAr","Partizip II من vergessen هو vergessen (لا vergisst)."),("level","B1"),("kategorie","Perfekt starke Verben")]),
    OrderedDict([("id","f-b1-052"),("falsch","*Am besten lernst du Deutsch mit viel sprechen."),("richtig","Am besten lernst du Deutsch, indem du viel sprichst."),("regelAr","تُستخدم indem-Satz أو Infinitiv mit zu (durch vieles Sprechen)، لا mit + Infinitiv بهذا المعنى."),("level","B1"),("kategorie","indem-Satz")]),
    OrderedDict([("id","f-b1-053"),("falsch","*Das Buch ist langweilig, oder?"),("richtig","Das Buch ist langweilig, nicht wahr? / …, findest du nicht?"),("regelAr","«oder» تستخدم علامة استفهام لكنها ليست سؤالاً مؤكداً بقدر nicht wahr/findest du nicht. مقبولة شفاهياً لكن الكتابة الرسمية تفضّل البدائل."),("level","B1"),("kategorie","Gesprächspartikel")]),
    OrderedDict([("id","f-b1-054"),("falsch","*Ich bin langweilig."),("richtig","Mir ist langweilig."),("regelAr","للتعبير عن الشعور بالملل نستخدم Dativ + sein + langweilig: mir ist langweilig. Ich bin langweilig تعني أنا شخص ممل."),("level","B1"),("kategorie","Dativ / Adjektiv")]),
    OrderedDict([("id","f-b1-055"),("falsch","*Entweder du kommst mit, und du bleibst zu Hause."),("richtig","Entweder du kommst mit, oder du bleibst zu Hause."),("regelAr","entweder … oder رابطان مزدوجان لا يأتي معهما und."),("level","B1"),("kategorie","Doppelkonnektor")]),
]
new_b2 = [
    OrderedDict([("id","f-b2-036"),("falsch","*Im Vergleich zu dem letzten Jahr ist die Zahl gestiegen."),("richtig","Im Vergleich zum letzten Jahr ist die Zahl gestiegen."),("regelAr","Vergleich zu + Dativ، و zum آخر اختصار شائع؛ الأكثر فصاحة: im Vergleich zu dem مقبول لكن يُفضّل «verglichen mit» أو «gegenüber dem Vorjahr» في الرسمية."),("level","B2"),("kategorie","Präpositionalgebrauch")]),
    OrderedDict([("id","f-b2-037"),("falsch","*Indem er hart arbeitete, konnte er die Prüfung bestehen."),("richtig","Weil er hart arbeitete, konnte er die Prüfung bestehen / Durch harte Arbeit bestand er die Prüfung."),("regelAr","indem تشرح الوسيلة/الكيفية لا السبب. هنا السببية بweil oder durch أفضل."),("level","B2"),("kategorie","indem vs. weil")]),
    OrderedDict([("id","f-b2-038"),("falsch","*Dies ist ein Grund, warum ich dagegen bin."),("richtig","Dies ist ein Grund, weshalb / aus dem ich dagegen bin."),("regelAr","لماذا في الجملة النسبية: weshalb/weswegen أو aus dem أكثر فصاحة من warum.")]),
    OrderedDict([("id","f-b2-039"),("falsch","*Es besteht kein Zweifel daran, dass er hat Recht."),("richtig","Es besteht kein Zweifel daran, dass er Recht hat."),("regelAr","بعد dass الفعل في آخر الجملة الثانوية.")]),
    OrderedDict([("id","f-b2-040"),("falsch","*Die Frage, die sich stellt, ist ob das Projekt finanzierbar ist."),("richtig","Die Frage, die sich stellt, ist, ob das Projekt finanzierbar ist."),("regelAr","قبل ob جملة ثانوية تُفصل بفاصلة بعد فعل الكينونة.")]),
    OrderedDict([("id","f-b2-041"),("falsch","*Er sagte, dass er morgen kommt und er den Bericht mitbringt."),("richtig","Er sagte, dass er morgen kommt und den Bericht mitbringt."),("regelAr","عند اشتراك dass-سات لا يُعاد dass قبل الفعل الثاني، ويتشارك الفاعل بينهما.")]),
    OrderedDict([("id","f-b2-042"),("falsch","*Nachdem er die Prüfung bestanden hat, kann er jetzt arbeiten."),("richtig","Nachdem er die Prüfung bestanden hatte, konnte er arbeiten."),("regelAr","nachdem في الماضي تتطلب Plusquamperfekt في الجملة الأولى وPräteritum في الثانية (سبق ماضٍ).")]),
    OrderedDict([("id","f-b2-043"),("falsch","*Je schneller, desto gut."),("richtig","Je schneller, desto besser."),("regelAr","بعد je … desto يأتي الصفة بصيغة المقارنة في الجزأين (Kompärativ).")]),
    OrderedDict([("id","f-b2-044"),("falsch","*Ich bin daran interessiert an dem Projekt mitzuarbeiten."),("richtig","Ich bin daran interessiert, an dem Projekt mitzuarbeiten / Ich bin interessiert an der Mitarbeit an dem Projekt."),("regelAr","interessiert an + Dat./an … mitzuarbeiten يتطلب فاصلة و zu؛ لا تُخلط بين daran und an.")]),
    OrderedDict([("id","f-b2-045"),("falsch","*Das ist besser als letztes Jahr."),("richtig","Das ist besser als im letzten Jahr."),("regelAr","عند المقارنة بفترة زمنية نستخدم في (im letzten Jahr) كظرف لا كاسم مجرد.")]),
]
for n in new_b1+new_b2:
    if not any(e['id']==n['id'] for e in f):
        # fix missing fields
        n.setdefault('regelAr', ''); n.setdefault('kategorie','')
        f.append(n)

json.dump(f, open('content/fehler.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/fehler.json','a',encoding='utf-8').write('\n')

# ---- 10 Sätze mehr (A1/A2) ----
s = json.load(open('content/sentences.json',encoding='utf-8'))
new_s = [
    OrderedDict([("id","sat-a1-103"),("level","A1"),("de","Könnten Sie mir bitte helfen?"),("ar","هل يمكنك مساعدتي من فضلك؟")]),
    OrderedDict([("id","sat-a1-104"),("level","A1"),("de","Ich suche einen Schlüssel."),("ar","أنا أبحث عن مفتاح.")]),
    OrderedDict([("id","sat-a1-105"),("level","A1"),("de","Das Konzert beginnt um 20 Uhr."),("ar","تبدأ الحفلة الساعة 20.")]),
    OrderedDict([("id","sat-a1-106"),("level","A1"),("de","Ich habe mein Portemonnaie zu Hause vergessen."),("ar","نسيت محفظتي في البيت.")]),
    OrderedDict([("id","sat-a1-107"),("level","A1"),("de","Der Unterricht fällt heute aus."),("ar","الحصة ملغاة اليوم.")]),
    OrderedDict([("id","sat-a2-111"),("level","A2"),("de","Könnten Sie mir bitte das Salz reichen?"),("ar","هل من الممكن أن تناولني الملح؟")]),
    OrderedDict([("id","sat-a2-112"),("level","A2"),("de","Ich habe mich gestern beim Joggen verletzt."),("ar","أُصبتُ نفسي أمس أثناء الجري.")]),
    OrderedDict([("id","sat-a2-113"),("level","A2"),("de","Der Bus kommt in fünf Minuten an."),("ar","تصل الحافلة بعد خمس دقائق.")]),
    OrderedDict([("id","sat-a2-114"),("level","A2"),("de","Ich möchte einen Termin bei Herrn Dr. Schmidt vereinbaren."),("ar","أودّ حجز موعد لدى الدكتور شميت.")]),
    OrderedDict([("id","sat-a2-115"),("level","A2"),("de","Die Party hat mir viel Spaß gemacht."),("ar","استمتعت كثيراً في الحفلة.")]),
]
for n in new_s:
    if not any(x['id']==n['id'] for x in s): s.append(n)

json.dump(s, open('content/sentences.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/sentences.json','a',encoding='utf-8').write('\n')

print('fehler:', Counter(e['level'] for e in f))
print('sentences:', Counter(x['level'] for x in s))
