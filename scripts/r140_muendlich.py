#!/usr/bin/env python3
"""R140a: tag old monolog cards with proper level; add Kontaktgespräch (Teil 1) cards per level; add more monolog cards to balance."""
import json
from collections import OrderedDict, Counter

m = json.load(open('content/muendlich.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

# Tag untagged cards (mm01–mm06 Bildbeschreibung = B2, mm07–mm12 Stellungnahme = B2)
for k in m['karten']:
    if 'level' not in k:
        k['level'] = 'B2'
        k['teil'] = 2

KONTAKT = [
    # A1 Kontakt — Vorstellung
    OrderedDict([("id","mk-a1-01"),("level","A1"),("teil",1),
        ("titel_de","Sich vorstellen"),("titel_ar","تقديم نفسك"),
        ("auftrag_de","Stellen Sie sich vor: Name, Alter, Herkunft, Wohnort, Sprachen, Beruf, Hobby. Sprechen Sie 2–3 Minuten. Ihr Partner stellt Ihnen danach 2–3 einfache Fragen."),
        ("auftrag_ar","قدّم نفسك: الاسم، العمر، البلد، السكن، اللغات، المهنة، الهواية. تحدّث 2–3 دقائق. ثم يسألك الشريك سؤالين أو ثلاثة بسيطين."),
        ("stuetzen",["Ich heiße …","Ich bin … Jahre alt.","Ich komme aus …","Ich wohne in …","Ich spreche …","In meiner Freizeit … ich gern."]),
        ("kriterien",[
            {"de":"alle Basisdaten genannt","ar":"ذكر البيانات الأساسية"},
            {"de":"3–4 Sätze pro Punkt","ar":"3–4 جمل لكل نقطة"},
            {"de":"einfache Fragen beantwortet","ar":"الإجابة على أسئلة بسيطة"},
        ]),
        ("zeit_s",120),
    ]),
    OrderedDict([("id","mk-a1-02"),("level","A1"),("teil",1),
        ("titel_de","Wohnen und Alltag"),("titel_ar","السكن والحياة اليومية"),
        ("auftrag_de","Erzählen Sie: Wo wohnen Sie? Mit wem? Wie groß ist Ihre Wohnung? Was machen Sie jeden Tag?"),
        ("auftrag_ar","تحدّث: أين تسكن؟ مع من؟ كم حجم شقتك؟ ماذا تفعل كل يوم؟"),
        ("stuetzen",["Ich wohne in …","Meine Wohnung hat … Zimmer.","Jeden Tag stehe ich um … auf.","Dann …"]),
        ("kriterien",[{"de":"Ordnung mit zuerst/dann","ar":"ترتيب بـzuerst/dann"},{"de":"Wohnort und Größe","ar":"مكان السكن وحجمه"}],),
        ("zeit_s",120),
    ]),
    # A2 Kontakt — Fragen zu Urlaub/Essen/Familie
    OrderedDict([("id","mk-a2-01"),("level","A2"),("teil",1),
        ("titel_de","Mein letzter Urlaub"),("titel_ar","عطلتي الأخيرة"),
        ("auftrag_de","Erzählen Sie im Perfekt von Ihrem letzten Urlaub: Wohin? Mit wem? Wie lange? Was haben Sie gemacht? Was war gut/schlecht? Stellen Sie Ihrem Partner danach eine Frage."),
        ("auftrag_ar","تحدّث بصيغة الماضي التام عن عطلتك الأخيرة: إلى أين؟ مع من؟ كم استمرت؟ ماذا فعلت؟ ما الذي كان جيداً وسيئاً؟ ثم اسأل شريكك سؤالاً."),
        ("stuetzen",["Letzten Sommer bin ich nach … gefahren.","Ich war dort mit …","Wir haben … besichtigt.","Am besten hat mir … gefallen."]),
        ("kriterien",[{"de":"Perfekt korrekt verwendet","ar":"استخدام Perfekt صحيحاً"},{"de":"Orte und Aktivitäten","ar":"أماكن وأنشطة"},{"de":"Frage an Partner","ar":"سؤال للشريك"}],),
        ("zeit_s",180),
    ]),
    OrderedDict([("id","mk-a2-02"),("level","A2"),("teil",1),
        ("titel_de","Einladung zum Geburtstag"),("titel_ar","دعوة عيد الميلاد"),
        ("auftrag_de","Sie planen einen Geburtstag. Laden Sie Ihren Partner ein: Wann? Wo? Was mitbringen? Reagieren Sie auf seine/ihre Fragen (z.B. darf ich jemanden mitbringen? Geschenk?)."),
        ("auftrag_ar","تخطط لعيد ميلادك. ادعُ شريكك: متى؟ أين؟ ماذا يحضر؟ رد على أسئلته (هل أحضر شخصاً معي؟ هدية؟)."),
        ("stuetzen",["Ich möchte dich zu meinem Geburtstag einladen.","Die Party ist am … um … bei mir zu Hause.","Du kannst gern … mitbringen.","Toll, bis dann!"]),
        ("kriterien",[{"de":"Einladung mit Ort/Zeit","ar":"دعوة بمكان ووقت"},{"de":"Reaktion auf Frage","ar":"رد على سؤال"},{"de":"Modalverb möchten/können","ar":"فعل مساعد möchten/können"}],),
        ("zeit_s",180),
    ]),
    # B1 Kontakt — Planung + Meinung
    OrderedDict([("id","mk-b1-01"),("level","B1"),("teil",1),
        ("titel_de","Ein Wochenendausflug planen"),("titel_ar","تخطيط نزهة عطلة"),
        ("auftrag_de","Planen Sie zusammen mit Ihrem Partner einen Wochenendausflug. Schlagen Sie ein Ziel vor (Stadt/Land/See/Berge), vereinbaren Sie Zeit und Treffpunkt, schlagen Sie Aktivitäten vor und reagieren Sie auf Einwände. Sprechen Sie ca. 3 Minuten."),
        ("auftrag_ar","خطّط مع شريكك لنزهة نهاية أسبوع. اقترح هدفاً، اتفق على الوقت ومكان اللقاء، اقترح أنشطة، وتجاوب مع اعتراضات. تحدّث حوالي 3 دقائق."),
        ("stuetzen",["Ich schlage vor, …","Was hältst du von …?","Da bin ich dagegen, weil …","Einverstanden, dann …","Wir könnten auch …"]),
        ("kriterien",[{"de":"Vorschlag+Reaktion+Einigung","ar":"اقتراح وتجاوب واتفاق"},{"de":"Begründungen mit weil","ar":"تعليل بـweil"},{"de":"3 Minuten Redezeit","ar":"3 دقائق كلام"}],),
        ("zeit_s",180),
    ]),
    OrderedDict([("id","mk-b1-02"),("level","B1"),("teil",1),
        ("titel_de","Über das Deutschlernen sprechen"),("titel_ar","الحديث عن تعلّم الألمانية"),
        ("auftrag_de","Erzählen Sie: Seit wann lernen Sie Deutsch? Warum? Was fällt Ihnen schwer? Wie lernen Sie außerhalb des Kurses? Welches Ziel haben Sie? Geben Sie Ihrem Partner danach einen Tipp."),
        ("auftrag_ar","تحدّث: منذ متى تتعلم الألمانية؟ لماذا؟ ما الصعب؟ كيف تتعلم خارج الدرس؟ ما هدفك؟ ثم قدّم نصيحة لشريكك."),
        ("stuetzen",["Seit … lerne ich Deutsch.","Am schwierigsten finde ich …","Mir hilft besonders, …","Mein Tipp wäre, …"]),
        ("kriterien",[{"de":"Zeit/Angaben mit seit","ar":"توقيت بـseit"},{"de":"Begründungen","ar":"تعليلات"},{"de":"Tipp an Partner","ar":"نصيحة للشريك"}],),
        ("zeit_s",180),
    ]),
    # B2 Kontakt — Smalltalk + Planung komplex
    OrderedDict([("id","mk-b2-01"),("level","B2"),("teil",1),
        ("titel_de","Ein gemeinsames Projekt planen"),("titel_ar","تخطيط مشروع مشترك"),
        ("auftrag_de","Sie und Ihr Partner wollen gemeinsam eine Veranstaltung in Ihrer Deutschkursgruppe organisieren (z.B. ein internationales Buffet oder eine Filmnacht). Verhandeln Sie: Ort, Datum, Kosten, Aufgabenverteilung, Werbung. Rechnen Sie mit Einwänden und finden Sie einen Kompromiss. Sprechen Sie 3–4 Minuten."),
        ("auftrag_ar","تريد أنت وشريكك تنظيم فعالية في مجموعة الألمانية (بوفيه دولي أو ليلة أفلام). تفاوضا على المكان والتاريخ والتكلفة وتوزيع المهام والدعاية. تعامل مع الاعتراضات وتوصلا لحل وسط. 3–4 دقائق."),
        ("stuetzen",["Ich bin der Meinung, dass wir …","Einerseits …, andererseits …","Das überzeugt mich nicht ganz, weil …","Einen guten Kompromiss fände ich …","Also einigen wir uns auf …"]),
        ("kriterien",[{"de":"Verhandlungsführung mit Pro/Contra","ar":"تفاوض بحجج مؤيدة ومعارضة"},{"de":"Kompromissformulierung","ar":"صياغة حل وسط"},{"de":"Höfliche Einwände","ar":"اعتراضات مهذبة"}],),
        ("zeit_s",240),
    ]),
    OrderedDict([("id","mk-b2-02"),("level","B2"),("teil",1),
        ("titel_de","Smalltalk auf einer Party"),("titel_ar","حديث عابر في حفلة"),
        ("auftrag_de","Sie treffen Ihren Partner zum ersten Mal auf einer Party. Beginnen Sie ein Gespräch: Woher? Was machen Sie? Wie gefällt die Party? Wie ist das Wetter? Reagieren Sie auf eine überraschende Nachricht. Sprechen Sie 3 Minuten, auch wenn es mal stockt."),
        ("auftrag_ar","تقابل شريكك أول مرة في حفلة. افتح حديثاً: من أين؟ ماذا تفعل؟ كيف الحفلة؟ كيف الطقس؟ تفاعل مع خبر مفاجئ. 3 دقائق حتى لو توقف الكلام."),
        ("stuetzen",["Ich glaube, wir kennen uns noch nicht. Ich bin …","Was für ein Zufall!","Wirklich? Das hätte ich nicht gedacht.","Übrigens, …"]),
        ("kriterien",[{"de":"Natürlicher Gesprächsaufbau","ar":"بناء محادثة طبيعي"},{"de":"Überraschung und Reaktion","ar":"مفاجأة وتفاعل"},{"de":"Füllphrasen bei Stockung","ar":"عبارات ملء عند التوقف"}],),
        ("zeit_s",180),
    ]),
]

# Additional monolog cards to reach ~5 per level
MONOLOG_ADD = [
    OrderedDict([("id","mm-a1-03"),("level","A1"),("teil",2),
        ("titel_de","Mein Lieblingsessen"),("titel_ar","أكلتي المفضلة"),
        ("auftrag_de","Beschreibe dein Lieblingsessen: Was ist es? Wo kommt es her? Wann isst du es? Warum magst du es? Magst du kochen? Wer kocht in deiner Familie?"),
        ("auftrag_ar","صف طبختك المفضلة: ما هي؟ من أين؟ متى تأكلها؟ لماذا تحبها؟ هل تطبخ؟ من يطبخ في عائلتك؟"),
        ("stuetzen",["Mein Lieblingsessen ist …","Es kommt aus …","Ich esse es am liebsten …","Ich mag es, weil …"]),
        ("kriterien",[{"de":"5+ Sätze","ar":"5 جمل فأكثر"},{"de":"Nahrungsmittel-Wortschatz","ar":"مفردات الطعام"}],),
        ("zeit_s",90),
    ]),
    OrderedDict([("id","mm-a1-04"),("level","A1"),("teil",2),
        ("titel_de","Mein typischer Tag"),("titel_ar","يومي المعتاد"),
        ("auftrag_de","Erzähle von deinem typischen Tag: Aufstehen, Frühstück, Arbeit/Schule, Mittagessen, Abend, Schlafen. Nutze zuerst/dann/nach dem/später."),
        ("auftrag_ar","تحدث عن يومك المعتاد: استيقاظ، فطور، عمل/مدرسة، غداء، مساء، نوم. استخدم zuerst/dann/nach dem/später."),
        ("stuetzen",["Zuerst stehe ich um … auf.","Dann frühstücke ich …","Nach dem Frühstück …","Später …"]),
        ("kriterien",[{"de":"5 Schritte im Tagesablauf","ar":"5 خطوات في اليوم"},{"de":"Temporaladverbien","ar":"ظروف الزمان"}],),
        ("zeit_s",90),
    ]),
    OrderedDict([("id","mm-a2-03"),("level","A2"),("teil",2),
        ("titel_de","Ein kleines Problem im Alltag"),("titel_ar","مشكلة بسيطة في الحياة اليومية"),
        ("auftrag_de","Erzähle von einem kleinen Problem der letzten Woche (z.B. Bus verpasst, Handy leer, Regen ohne Schirm). Was ist passiert? Wie hast du reagiert? Wie ist die Situation ausgegangen?"),
        ("auftrag_ar","تحدث عن مشكلة بسيطة الأسبوع الماضي (فوات الباص، نفاذ بطارية الهاتف، مطر بلا مظلة). ماذا حدث؟ كيف تصرفت؟ كيف انتهى الموقف؟"),
        ("stuetzen",["Letzte Woche habe ich …","Plötzlich …","Zum Glück …","Am Ende …"]),
        ("kriterien",[{"de":"Perfekt-Erzählung","ar":"سرد بـPerfekt"},{"de":"Reaktion geschildert","ar":"وصف رد الفعل"}],),
        ("zeit_s",120),
    ]),
    OrderedDict([("id","mm-a2-04"),("level","A2"),("teil",2),
        ("titel_de","Bild: Ein Kaffeehaus"),("titel_ar","صورة: مقهى"),
        ("auftrag_de","Beschreibe das Bild: Wo? Wer ist da? Was machen die Leute? Was trinken/essen sie? Warum gehen Leute gern ins Café?"),
        ("auftrag_ar","صف الصورة: أين؟ مَن هناك؟ ماذا يفعلون؟ ماذا يشربون/يأكلون؟ لماذا يحب الناس ارتياد المقهى؟"),
        ("stuetzen",["Im Vordergrund sehe ich …","Hinten …","Die Leute … wahrscheinlich","Ich gehe gern ins Café, weil …"]),
        ("kriterien",[{"de":"Vordergrund/Hintergrund","ar":"مقدمة/خلفية"},{"de":"eine Vermutung mit vielleicht","ar":"تخمين بـvielleicht"}],),
        ("zeit_s",120),
    ]),
    OrderedDict([("id","mm-b1-04"),("level","B1"),("teil",2),
        ("titel_de","Bild: Eine Party mit vielen Leuten"),("titel_ar","صورة: حفلة كثيرة الناس"),
        ("auftrag_de","Beschreiben Sie das Bild: Was für eine Party ist das? Wer feiert? Was machen die Personen im Vordergrund? Welche Stimmung haben sie? Würden Sie selbst gern auf dieser Party sein? Warum (nicht)?"),
        ("auftrag_ar","صف الصورة: أي حفلة؟ من يحتفل؟ ماذا يفعل الأشخاص في المقدمة؟ كيف تبدو الأجواء؟ هل تحب أن تكون في هذه الحفلة؟ لماذا؟"),
        ("stuetzen",["Im Vordergrund ist … zu sehen.","Die Stimmung wirkt …","Vermutlich handelt es sich um …","Ich würde (nicht) gern dort sein, weil …"]),
        ("kriterien",[{"de":"Bildebenen + Stimmung","ar":"طبقات وأجواء"},{"de":"Vermutungen mit vermutlich","ar":"تخمينات بـvermutlich"},{"de":"begründete Meinung","ar":"رأي معلَّل"}],),
        ("zeit_s",180),
    ]),
    OrderedDict([("id","mm-b2-04"),("level","B2"),("teil",2),
        ("titel_de","Bild: Eine lange Schlange vor einer Behörde"),("titel_ar","صورة: طابور طويل أمام مصلحة حكومية"),
        ("auftrag_de","Beschreiben Sie das Bild. Welche Situation zeigt es? Warum warten die Leute? Wie ist ihre Stimmung? Welche Erfahrungen haben Sie mit Ämtern in Deutschland? Welche Probleme sehen Sie im Bild?"),
        ("auftrag_ar","صف الصورة. أي موقف؟ لماذا ينتظر الناس؟ كيف حالهم النفسية؟ ما خبرتك مع الدوائر في ألمانيا؟ ما المشاكل التي تراها؟"),
        ("stuetzen",["Im Vordergrund steht …","Auffällig ist …","Meiner Erfahrung nach …","Das Grundproblem besteht darin, dass …"]),
        ("kriterien",[{"de":"Detaillierte Beschreibung","ar":"وصف تفصيلي"},{"de":"Eigene Erfahrung einbezogen","ar":"دمج الخبرة الشخصية"},{"de":"Problemanalyse","ar":"تحليل المشكلة"}],),
        ("zeit_s",240),
    ]),
]

existing_ids = {k['id'] for k in m['karten']}
add_mono = 0
for k in MONOLOG_ADD:
    if k['id'] not in existing_ids:
        m['karten'].append(k); add_mono += 1

existing_kontakt = {k['id'] for k in m.get('kontakt', [])}
if 'kontakt' not in m:
    m['kontakt'] = []
add_kontakt = 0
for k in KONTAKT:
    if k['id'] not in existing_kontakt:
        m['kontakt'].append(k); add_kontakt += 1

json.dump(m, open('content/muendlich.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/muendlich.json','a',encoding='utf-8').write('\n')

per_level_mono = Counter(k.get('level','?') for k in m['karten'])
per_level_kontakt = Counter(k.get('level','?') for k in m['kontakt'])
per_level_partner = Counter(k.get('level','?') for k in m['partner'])
print(f"Tagged 12 monolog cards as B2")
print(f"Added {add_mono} monolog cards")
print(f"Added {add_kontakt} Kontaktgespräch cards (neuer Schlüssel 'kontakt')")
print(f"Monolog per level: {dict(per_level_mono)}")
print(f"Kontakt per level: {dict(per_level_kontakt)}")
print(f"Partner per level: {dict(per_level_partner)}")
