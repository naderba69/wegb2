#!/usr/bin/env python3
"""
P-06/P-08: Add missing B2 grammar topics:
  - b2-genitiv-praep: Genitivpräpositionen (während, trotz, wegen, aufgrund, anlässlich, statt, trotz, während, innerhalb, außerhalb)
  - b2-konzessiv: Konzessivsätze (trotzdem vs obwohl vs auch wenn vs wenngleich vs bei+Dat)
  - b2-doppelkonn-neither: weder … noch, nicht nur … sondern auch
  - b2-relativ-genitiv: Relativsätze im Genitiv (deren/dessen)
"""
import json
from collections import OrderedDict

G = 'content/grammar.json'
g = json.load(open(G), object_pairs_hook=OrderedDict)

new_topics = {
    "b2-genitiv-praep": OrderedDict([
        ("id","b2-genitiv-praep"),
        ("titleDe","Genitivpräpositionen: wegen, trotz, während, aufgrund …"),
        ("titleAr","حروف جر Genitiv: wegen/trotz/während/aufgrund/anlässlich/innerhalb/außerhalb"),
        ("level","B2"),
        ("ziel","تستعمل حروف جر Genitiv في الكتابة الرسمية والصحفية والأكاديمية بدلاً من Dativ العامية، وتتقن صيغها في الكتابة."),
        ("voraus",["b1-genitiv"]),
        ("anwendung",OrderedDict([("ar","اكتب 5 جمل تستخدم فيها خمس حروف جر Genitiv مختلفة في موقف رسمي (شكوى، طلب، تقرير)."),("de","Schreibe 5 Sätze mit fünf verschiedenen Genitivpräpositionen in einem formellen Kontext (Beschwerde, Antrag, Bericht)."),("candoIds",[])])),
        ("verify",[
            OrderedDict([("id","b2-gp-v1"),("type","choice"),("promptDe","___ des Regens sind wir zu Hause geblieben."),("options",["Wegen","Trotz","Während"]),("answer",["Wegen"]),("explanationAr","Wegen + Genitiv = بسبب. Weil es regnete sind wir zu Hause geblieben.")]),
            OrderedDict([("id","b2-gp-v2"),("type","choice"),("promptDe","___ der Krankheit kam er zur Arbeit."),("options",["Wegen","Trotz","Während"]),("answer",["Trotz"]),("explanationAr","Trotz + Genitiv = رغم. Trotz der Krankheit = رغم المرض.")]),
            OrderedDict([("id","b2-gp-v3"),("type","choice"),("promptDe","___ des Krieges lebte die Familie im Ausland."),("options",["Wegen","Während","Aufgrund"]),("answer",["Während"]),("explanationAr","Während + Genitiv = أثناء/خلال. Während des Krieges = خلال الحرب.")]),
        ]),
        ("summaryAr","حروف جر Genitiv شائعة الاستخدام في الكتابة الرسمية: wegen (بسبب), trotz (رغم), während (خلال), aufgrund (بسبب/بناءً على), anlässlich (بمناسبة), statt/anstatt (بدلاً من), innerhalb (خلال/داخل), außerhalb (خارج). في اللغة المحكية يستعمل الألمان Dativ كثيراً مع هذه الأدوات، لكن Schriftdeutsch يتطلب Genitiv."),
        ("rules",[
            OrderedDict([("de","wegen + Genitiv: Wegen des Regens (بسبب المطر)"),("ar","تُستخدم في السبب: wegen + Genitiv.")]),
            OrderedDict([("de","trotz + Genitiv: Trotz des Regens ging er spazieren (رغم المطر)"),("ar","للمخالفة/التناقض: trotz + Genitiv.")]),
            OrderedDict([("de","während + Genitiv: Während des Krieges (خلال الحرب)"),("ar","للزمان المتزامن: während + Genitiv.")]),
            OrderedDict([("de","aufgrund + Genitiv: Aufgrund schlechten Wetters (بسبب سوء الأحوال الجوية)"),("ar","للسبب (رسمي): aufgrund + Genitiv.")]),
            OrderedDict([("de","(an)statt + Genitiv: Statt eines Briefes schickte er eine E-Mail (بدلاً من رسالة)"),("ar","للبديل: (an)statt + Genitiv.")]),
        ]),
        ("tables",[OrderedDict([("captionDe","Genitivpräpositionen"),("captionAr","قائمة حروف جر Genitiv"),("headers",["Präposition","Bedeutung","Beispiel"]),("rows",[["wegen","بسبب","wegen des Regens"],["trotz","رغم","trotz der Krankheit"],["während","خلال","während der Nacht"],["aufgrund","بناءً على","aufgrund des Berichts"],["anstatt","بدلاً من","anstatt eines Geschenks"],["innerhalb","خلال/داخل","innerhalb einer Woche"],["außerhalb","خارج","außerhalb der Stadt"]])])]),
        ("examples",[OrderedDict([("de","Wegen schlechten Wetters wurde der Flug abgesagt."),("ar","بسبب سوء الأحوال الجوية أُلغيت الرحلة.")]),OrderedDict([("de","Trotz großer Anstrengungen hat er die Prüfung nicht bestanden."),("ar","رغم الجهود الكبيرة، لم ينجح في الامتحان.")])]),
        ("eselsbruecke","تذكير: هذه الأدوات في الكتابة الرسمية تأخذ دائماً Genitiv — كأنها «تُضيف» -s/-en إلى الاسم بعدها كما في الإنجليزية because of the rain.")
    ]),

    "b2-konzessiv": OrderedDict([
        ("id","b2-konzessiv"),
        ("titleDe","Konzessivsätze: obwohl / trotzdem / auch wenn / wenngleich / bei + Dat"),
        ("titleAr","الجمل التناقضية: obwohl/trotzdem/auch wenn/wenngleich/bei+Dativ"),
        ("level","B2"),
        ("ziel","تفرّق بين أدوات التناقض وتستعملها في مواضعها الصحيحة: أداة ربط تُقدّم جملة ثانوية (obwohl/wenngleich/obgleich/auch wenn) مقابل ظرف يربط بين جملتين مستقلتين (trotzdem/dennoch/jedoch)."),
        ("voraus",["b1-konnektoren"]),
        ("anwendung",OrderedDict([("ar","اكتب فقرة قصيرة (6 جمل) عن موضوع مثير للجدل تستخدم فيها على الأقل أربع أدوات تناقض مختلفة."),("de","Schreibe einen kurzen Absatz (6 Sätze) zu einem kontroversen Thema und verwende mindestens vier verschiedene Konzessiv-Konnektoren."),("candoIds",[])])),
        ("verify",[
            OrderedDict([("id","b2-kk-v1"),("type","choice"),("promptDe","___ es regnete, gingen wir spazieren."),("options",["Obwohl","Trotzdem","Jedoch"]),("answer",["Obwohl"]),("explanationAr","Obwohl يربط جملة ثانوية في البداية: Obwohl es regnete, … (جملة ثانوية + جملة رئيسية).")]),
            OrderedDict([("id","b2-kk-v2"),("type","choice"),("promptDe","Es regnete stark. ___ gingen wir spazieren."),("options",["Obwohl","Trotzdem","Weil"]),("answer",["Trotzdem"]),("explanationAr","Trotzdem ظرف يربط جملتين مستقلتين (لا يغيّر ترتيب الفعل).")]),
        ]),
        ("summaryAr","أدوات التناقض نوعان: 1) روابط جمل ثانوية (تأتي في أول الجملة وتجعل الفعل في الآخر): obwohl (رغم أن), obgleich, wenngleich, auch wenn (حتى لو), selbst wenn (حتى ولو). 2) ظروف/روابط بين جمل مستقلة (الفعل يبقى في الموقع الثاني): trotzdem (مع ذلك), dennoch (مع ذلك), jedoch (لكن/إلا أن), allerdings (مع ذلك). 3) تراكيب جرّية: trotz + Genitiv, bei + Dat (bei schlechtem Wetter).",),
        ("rules",[
            OrderedDict([("de","Obwohl es regnet, gehe ich spazieren. (Nebensatz → Verb am Ende)"),("ar","obwohl يفتح جملة ثانوية (الفعل في الآخر).")]),
            OrderedDict([("de","Es regnet, trotzdem gehe ich spazieren. (Hauptsatz → Verb an Position 2)"),("ar","trotzdem جملة مستقلة بعدها الفعل في الموقع الثاني.")]),
            OrderedDict([("de","Auch wenn es regnet, gehe ich spazieren. (hypothetisch: حتى لو)"),("ar","auch wenn للاحتمال/الافتراض (حتى لو).")]),
            OrderedDict([("de","Bei Regen gehe ich trotzdem spazieren. (Präpositionalgruppe)"),("ar","bei + Dativ في صيغة قصيرة.")]),
        ]),
        ("tables",[OrderedDict([("captionDe","Konzessiv-Konnektoren im Überblick"),("captionAr","نظرة على أدوات التناقض"),("headers",["Typ","Wort","Stellung","Beispiel"]),("rows",[["Subjunktion","obwohl","Nebensatz V-Ende","Obwohl es regnet, …"],["Subjunktion","obgleich/wenngleich","Nebensatz V-Ende","Wenngleich er müde war, …"],["Subjunktion","auch wenn","Nebensatz, hypothetisch","Auch wenn es regnet, …"],["Subjunktion","selbst wenn","Nebensatz, stark betont","Selbst wenn ich wollte, …"],["Adverb","trotzdem","V2","Es regnet, trotzdem gehen wir."],["Adverb","dennoch","V2","Er hatte keine Zeit, dennoch kam er."],["Adverb","jedoch","V2 (förmlicher)","Das Ergebnis war gut, jedoch nicht perfekt."],["Präp.","trotz/bei","mit Genitiv/Dativ","Trotz des Regens / Bei Regen"]])])]),
        ("examples",[OrderedDict([("de","Obwohl das Buch lang ist, liest es sich sehr schnell. Trotzdem brauchte ich drei Tage dafür."),("ar","رغم أن الكتاب طويل، يُقرأ بسرعة. ومع ذلك احتجت ثلاثة أيام.")])]),
        ("eselsbruecke","trotzdem = trotzdem هي ظرف لا رابط: تحتاج نقطة/فاصلة قبلها، وبعدها يأتي الفعل ثانياً. أما obwohl فإنه يسحب الفعل إلى آخر الجملة.")
    ]),

    "b2-relativ-genitiv": OrderedDict([
        ("id","b2-relativ-genitiv"),
        ("titleDe","Relativsätze im Genitiv: dessen und deren"),
        ("titleAr","الجمل الموصولة في حالة Genitiv: dessen وderen"),
        ("level","B2"),
        ("ziel","تصف شخصاً أو شيئاً بملكيته أو علاقته عبر الضمير الموصول Genitiv (dessen للمفرد، deren للمؤنث والجمع)، وتكتب جملاً رسمية دقيقة كما في الصحف والتقارير."),
        ("voraus",["b1-relativ"]),
        ("anwendung",OrderedDict([("ar","اكتب أربع جمل موصولة بكل من dessen وderen تصف أشخاصاً ومنظمات."),("de","Schreibe vier Relativsätze mit dessen und deren über Personen und Organisationen."),("candoIds",[])])),
        ("verify",[
            OrderedDict([("id","b2-rg-v1"),("type","choice"),("promptDe","Der Mann, ___ Sohn in Berlin studiert, kommt aus Tunesien."),("options",["dessen","deren","dem"]),("answer",["dessen"]),("explanationAr","dessen للمفكر المذكر/المحايد: der Mann, dessen Sohn …")]),
            OrderedDict([("id","b2-rg-v2"),("type","choice"),("promptDe","Die Frau, ___ Kinder hier wohnen, arbeitet bei BMW."),("options",["dessen","deren","derer"]),("answer",["deren"]),("explanationAr","deren للمؤنث والجمع: die Frau, deren Kinder …")]),
        ]),
        ("summaryAr","dessen تُستعمل مع المفكر المذكر والمحايد (der/das + Genitiv)، وderen مع المؤنث والجمع (die/die Plural + Genitiv). هذان الضميران مهمان في الكتابة الرسمية لوصف العلاقات والملكية دون تكرار الأسماء.",),
        ("rules",[
            OrderedDict([("de","dessen ← maskulin/neutrum: Der Mann, dessen Auto vor der Tür steht, …"),("ar","للمذكر والمحايد المفرد: dessen.")]),
            OrderedDict([("de","deren ← feminin/plural: Die Frau, deren Mann Arzt ist, … / Die Leute, deren Kinder hier sind, …"),("ar","للمؤنث والجمع: deren.")]),
        ]),
        ("tables",[OrderedDict([("captionDe","Relativpronomen im Genitiv"),("captionAr","الضمائر الموصولة في Genitiv"),("headers",["Bezugswort","Genitiv","Beispiel"]),("rows",[["der (Mask.)","dessen","der Student, dessen Noten gut sind"],["das (Neutr.)","dessen","das Kind, dessen Eltern fehlen"],["die (Fem.)","deren","die Firma, deren Produkte weltweit verkauft werden"],["die (Plural)","deren","die Menschen, deren Häuser zerstört wurden"]])])]),
        ("examples",[OrderedDict([("de","Der Autor, dessen letztes Buch ein Bestseller war, liest heute Abend."),("ar","الكاتب الذي كان كتابه الأخير من الكتب الأكثر مبيعاً يقرأ هذا المساء.")])]),
        ("eselsbruecke","dessen يُذكّرك بـhis/its (للمفرد)، deren بـher/their (للمؤنث والجمع).")
    ]),
}

added=0
for tid, t in new_topics.items():
    if tid not in g:
        g[tid]=t
        added+=1
        print('+', tid)
    else:
        print('=',tid,'exists')

# Build exercises from verify
for tid in new_topics:
    t=g[tid]
    ex=[]
    for v in t.get('verify',[]):
        e=OrderedDict()
        for k in ('id','type','promptDe','options','answer','explanationAr'):
            if k in v: e[k]=v[k]
        e['promptAr']='اختر الإجابة الصحيحة.'
        ex.append(e)
    t['exercises']=ex
    t['pitfalls']=[]
    if 'eselsbruecke' in t and 'eselsbrueckeAr' not in t:
        t['eselsbrueckeAr']=t['eselsbruecke']
    if 'pronTippAr' not in t:
        t['pronTippAr']=''

with open(G,'w',encoding='utf-8') as f:
    json.dump(g,f,ensure_ascii=False,indent=2)
    f.write('\n')
print(f'\n{added} new B2 grammar topics added.')
