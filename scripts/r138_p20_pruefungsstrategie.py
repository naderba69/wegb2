#!/usr/bin/env python3
"""
P-20: Add Prüfungsstrategie (exam-strategy) units in the final 2 weeks before each phase exam.
Add 4 grammar/knowledge topics:
- a1-pruefungsstrategie (Start Deutsch 1)
- a2-pruefungsstrategie (Goethe A2)
- b1-pruefungsstrategie (Goethe B1 / telc B1)
- b2-pruefungsstrategie (Goethe B2)
These teach: Zeitmanagement, Lesetechnik, Schreiben-Aufbau, rate strategy.
They are added as ordinary grammar topics so they slot into the week before phase end.
"""
import json
from collections import OrderedDict

G='content/grammar.json'
g=json.load(open(G), object_pairs_hook=OrderedDict)

exam_topics = {
    "a1-pruefungsstrategie": OrderedDict([
        ("id","a1-pruefungsstrategie"),
        ("titleDe","Prüfungsstrategie: Start Deutsch A1"),
        ("titleAr","استراتيجية امتحان Start Deutsch A1 — إدارة الوقت والقراءة والكتابة"),
        ("level","A1"),
        ("ziel","تعرف بنية امتحان A1 (60 دقيقة + Sprechen 15 دقيقة) وكيفية توزيع الوقت وتقنيات القراءة السريعة وبناء الرسالة (30 كلمة) وكيفية التعامل مع الأسئلة الصعبة."),
        ("voraus",["a1-perfekt-einf","a1-zeitpraep"]),
        ("anwendung",OrderedDict([("ar","حاكِ امتحاناً تجريبياً في 60 دقيقة بدون توقف، ثم صحّح إجاباتك."),("de","Simuliere eine vollständige A1-Prüfung in 60 Minuten und korrigiere dich danach selbst."),("candoIds",[])])),
        ("verify",[
            OrderedDict([("id","a1-ps-v1"),("type","choice"),("promptDe","Wie viele Wörter sollten Sie im Prüfungsteil Schreiben (E-Mail) etwa schreiben?"),("options",["10 Wörter","30 Wörter","100 Wörter"]),("answer",["30 Wörter"]),("explanationAr","في كتابة A1 الهدف 30 كلمة تقريباً للرسالة القصيرة.")]),
            OrderedDict([("id","a1-ps-v2"),("type","choice"),("promptDe","Im Leseteil ist es am besten,…"),("options",["…jedes Wort im Wörterbuch nachzuschlagen","…zuerst die Fragen zu lesen und dann gezielt zu suchen","…den ganzen Text laut vorzulesen"]),("answer",["…zuerst die Fragen zu lesen und dann gezielt zu suchen"]),("explanationAr","اقرأ الأسئلة أولاً ثم ابحث عن الجواب في النص؛ هذا يوفر وقتاً كبيراً.")]),
        ]),
        ("summaryAr","بنية امتحان Goethe A1: Hören (20د) → Lesen (25د) → Schreiben (20د، رسالة 30 كلمة) → Sprechen (15د: تقديم النفس + قراءة/طرح أسئلة + طلب/شكر). نصائح ذهبية: 1) لا تقضِ أكثر من دقيقة على سؤال صعب — ضع علامة وعد لاحقاً. 2) في الكتابة: ابدأ بالتحية واختم بالوداع، واذكر النقاط الثلاث المطلوبة. 3) في التحدث: تحدّث ببطء وبوضوح، استخدم جملاً بسيطة صحيحة لا جملاً معقدة خاطئة."),
        ("rules",[
            OrderedDict([("de","Zeit: Hören 20 Min, Lesen 25 Min, Schreiben 20 Min, Sprechen 15 Min."),("ar","توزيع الوقت: استماع 20د، قراءة 25د، كتابة 20د، تحدث 15د.")]),
            OrderedDict([("de","Schreiben: 30 Wörter — Anrede + 3 Punkte + Gruß."),("ar","الكتابة: 30 كلمة — تحية + ثلاث نقاط المطلوب + وداع.")]),
            OrderedDict([("de","Sprechen Teil 1: sich vorstellen (Name, Alter, Land, Wohnort, Beruf, Hobby)."),("ar","التحدث الجزء 1: تقديم النفس (الاسم، العمر، البلد، السكن، المهنة، الهواية).")]),
            OrderedDict([("de","Tipp: Einfache, korrekte Sätze sind besser als komplizierte, falsche!"),("ar","نصيحة: جمل بسيطة صحيحة أفضل من جمل معقدة خاطئة!")]),
        ]),
        ("tables",[]),
        ("examples",[]),
        ("eselsbruecke","امتحان A1 لا يختبر ذكاءك بل مدى استخدامك الألمانية البسيطة بدقة — فكّر ببساطة واكتب بوضوح.")
    ]),
}

# Extend to A2, B1, B2 by cloning and adjusting
exam_topics["a2-pruefungsstrategie"] = OrderedDict([
    ("id","a2-pruefungsstrategie"),
    ("titleDe","Prüfungsstrategie: Goethe A2"),
    ("titleAr","استراتيجية امتحان Goethe A2 — 100 كلمة رسائل، فهم المقالات والاستماع"),
    ("level","A2"),
    ("ziel","تتقن بنية امتحان A2، توزيع الوقت، بناء رسالة خاصة 100 كلمة ورسالة رسمية 100 كلمة، وتقنيات التخمين الذكي."),
    ("voraus",["a2-futur","a2-weil-dass"]),
    ("anwendung",OrderedDict([("ar","اكتب رسالة إلى صديق (100 كلمة) ورسالة رسمية (100 كلمة) خلال 30 دقيقة."),("de","Schreibe eine private E-Mail (100 Wörter) und eine formelle E-Mail (100 Wörter) in 30 Minuten."),("candoIds",[])])),
    ("verify",[
        OrderedDict([("id","a2-ps-v1"),("type","choice"),("promptDe","Wie viele Wörter brauchen Sie im Prüfungsteil Schreiben A2?"),("options",["30 + 30","100 + 100","150 + 150"]),("answer",["100 + 100"]),("explanationAr","في A2: رسالة خاصة 100 كلمة ورسالة رسمية 100 كلمة.")]),
    ]),
    ("summaryAr","بنية Goethe A2: Hören 30د، Lesen 30د، Schreiben 30د (رسالة خاصة + رسمية كل منهما 100 كلمة)، Sprechen 15د. استراتيجيات: في القراءة ابدأ بالعناوين؛ في الاستماع لا تتوقف عند كلمة مجهولة؛ في الرسائل احترم التحية (Sehr geehrte Frau X / Lieber Omar) والختام (Mit freundlichen Grüßen / Liebe Grüße)؛ في التحدث قدّم رأيك ببساطة مع weil.",),
    ("rules",[]),("tables",[]),("examples",[]),
    ("eselsbruecke","النقاط الثلاث في الرسالة: اذكرها كلها بعبارة واحدة لكل منها، ولا تنسَ الختام.")
])

exam_topics["b1-pruefungsstrategie"] = OrderedDict([
    ("id","b1-pruefungsstrategie"),
    ("titleDe","Prüfungsstrategie: Goethe-/telc B1"),
    ("titleAr","استراتيجية امتحان B1 — المقالة والمناقشة مع الشريك"),
    ("level","B1"),
    ("ziel","تعرف كيفية بناء مقال رأي (80–100 كلمة) بمقدمة وصلب وخاتمة، وكيفية إدارة نقاش مع الشريك (Diskussion) وطرح أسئلة، وكيفية إدارة الوقت في Hören/Lesen."),
    ("voraus",["b1-konj2-vergangenheit","b1-adjektivendungen"]),
    ("anwendung",OrderedDict([("ar","حاكِ امتحاناً كاملاً مع كتابة المقال في 60 دقيقة وتمرّن على حوار الشريك مع صديق."),("de","Simuliere eine vollständige B1-Prüfung inkl. Monolog und Partnerdiskussion."),("candoIds",[])])),
    ("verify",[OrderedDict([("id","b1-ps-v1"),("type","choice"),("promptDe","Aufbau einer B1-Meinungsmail:"),("options",["Einleitung → Hauptteil (2-3 Argumente) → Schluss","Nur Schluss","Fließtext ohne Struktur"]),("answer",["Einleitung → Hauptteil (2-3 Argumente) → Schluss"]),("explanationAr","بنية المقال: مقدمة + 2-3 حجج + خاتمة.")])]),
    ("summaryAr","بنية B1: Lesen 65د، Hören 40د، Schreiben 60د (بريد شخصي + رأي/تعليق 80-100 كلمة)، Sprechen 15د (تقديم، مونولوج، نقاش مع الشريك). المقال: مقدمة بجملة عامة + حجتان أو ثلاث مع weil/deshalb/außerdem + خاتة برأي شخصي. في النقاش: استمع جيداً، واطرح سؤالاً وأبدِ موافقة أو اعتراضاً مهذباً (Ich bin anderer Meinung, weil… / Da stimme ich dir zu.).",),
    ("rules",[]),("tables",[]),("examples",[]),
    ("eselsbruecke","كلمة لإنقاذ نفسك عندما لا تعرف: «Könnten Sie das bitte wiederholen?» و«Ich bin nicht sicher, aber ich glaube,…».")
])

exam_topics["b2-pruefungsstrategie"] = OrderedDict([
    ("id","b2-pruefungsstrategie"),
    ("titleDe","Prüfungsstrategie: Goethe B2"),
    ("titleAr","استراتيجية امتحان B2 — المقالة الرأيية، التلخيص، والمناقشة المعمّقة"),
    ("level","B2"),
    ("ziel","تتقن بنية امتحان B2 (كتابة تعليق رأي 120-180 كلمة، رسالة رسمية، تلخيص نص، نقاش موسّع)، وتعرف استراتيجيات التعامل مع النصوص الطويلة والمصطلحات المعقدة."),
    ("voraus",["b2-nominalstil","b2-textkonnektoren"]),
    ("anwendung",OrderedDict([("ar","حاكِ امتحان B2 كاملاً وركّز على حفظ 10 روابط مزدوجة و10 عبارات افتتاحية/ختامية."),("de","Trainiere eine vollständige B2-Prüfung und lerne 10 Doppelkonnektoren sowie 10 Einleitungs-/Schlusssätze auswendig."),("candoIds",[])])),
    ("verify",[OrderedDict([("id","b2-ps-v1"),("type","choice"),("promptDe","Wie lang sollte der B2-Meinungsaufsatz sein?"),("options",["30 Wörter","120–180 Wörter","300–400 Wörter"]),("answer",["120–180 Wörter"]),("explanationAr","مقال الرأي في B2 بين 120 و180 كلمة.")])]),
    ("summaryAr","بنية B2: Lesen 80د، Hören 30د، Schreiben 75د (بريد رسمي + تعليق رأي 120-180 كلمة)، Sprechen 15د (مقارنة، عرض رأي، مناقشة). استراتيجيات: 1) اقرأ الأسئلة قبل النص. 2) لا تترجم كل كلمة، استنتج من السياق. 3) المقال: مقدمة (أعيد صياغة السؤال) + حجتان أو ثلاث مضادة ومؤيدة بأمثلة + خاتة مع خلاصة وتوصية. 4) في النقاش: ابدأ بالموافقة الجزئية ثم اعترض مهذباً مع حجج.",),
    ("rules",[]),("tables",[]),("examples",[]),
    ("eselsbruecke","في B2 يُقيّم التعقيد المناسب (Konjunktiv II، Nominalstil، Doppelkonnektoren) — لا تكتب جملاً أبسط من مستوى B2.")
])

added=0
for tid,t in exam_topics.items():
    if tid not in g:
        # Build exercises from verify
        ex=[]
        for v in t.get('verify',[]):
            e=OrderedDict()
            for k in ('id','type','promptDe','options','answer','explanationAr'):
                if k in v: e[k]=v[k]
            e['promptAr']='اختر الإجابة الصحيحة.'
            ex.append(e)
        t['exercises']=ex
        t['pitfalls']=[]
        t['eselsbrueckeAr']=t['eselsbruecke']
        t['pronTippAr']=''
        g[tid]=t
        added+=1
        print('+',tid)

with open(G,'w',encoding='utf-8') as f:
    json.dump(g,f,ensure_ascii=False,indent=2)
    f.write('\n')
print(f'{added} Prüfungsstrategie-Themen hinzugefügt.')
