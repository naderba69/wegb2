#!/usr/bin/env python3
"""R140g: expand muendlich bank with more Monolog (Teil 2) and Kontakt (Teil 1) cards so every level has multiple options."""
import json
from collections import OrderedDict

m = json.load(open('content/muendlich.json',encoding='utf-8'), object_pairs_hook=OrderedDict)

# New Monolog (Teil 2) cards
more_monolog = [
    OrderedDict([
        ("id","mm-a1-05"),("level","A1"),("teil",2),
        ("titel_de","Meine Familie"),("titel_ar","عائلتي"),
        ("auftrag_de","Stellen Sie Ihre Familie kurz vor: Wie viele Personen? Wer sind sie? Was machen sie?"),
        ("auftrag_ar","قدّم عائلتك باختصار: كم فرداً؟ مَن هم؟ ماذا يعملون؟"),
        ("stuetzen",["Meine Familie besteht aus … Personen.","Mein/Meine … ist …","Er/Sie arbeitet/lernt …","Wir wohnen in …"]),
        ("kriterien",[
            OrderedDict([("de","Verständlichkeit"),("ar","الفهم")]),
            OrderedDict([("de","Wortschatz Familie/Beruf"),("ar","مفردات الأسرة والعمل")]),
            OrderedDict([("de","Grammatik (Possessivartikel)"),("ar","القواعد (أدوات الملكية)")]),
            OrderedDict([("de","Flüssigkeit"),("ar","الطلاقة")]),
        ]),
        ("zeit_s",120),
    ]),
    OrderedDict([
        ("id","mm-a2-05"),("level","A2"),("teil",2),
        ("titel_de","Mein letzter Urlaub"),("titel_ar","عطلتي الأخيرة"),
        ("auftrag_de","Erzählen Sie von Ihrem letzten Urlaub: Wohin sind Sie gefahren? Was haben Sie gemacht?"),
        ("auftrag_ar","احكِ عن عطلتك الأخيرة: إلى أين سافرت؟ ماذا فعلت؟"),
        ("stuetzen",["Im letzten Urlaub war ich in …","Ich bin mit … gefahren.","Wir haben … besucht.","Das Wetter war …"]),
        ("kriterien",[
            OrderedDict([("de","Perfekt angewendet"),("ar","استخدام الماضي التام")]),
            OrderedDict([("de","Reisewortschatz"),("ar","مفردات السفر")]),
            OrderedDict([("de","Verständlichkeit"),("ar","الفهم")]),
            OrderedDict([("de","Zeitmanagement"),("ar","إدارة الزمن")]),
        ]),
        ("zeit_s",150),
    ]),
    OrderedDict([
        ("id","mm-b1-05"),("level","B1"),("teil",2),
        ("titel_de","Vor- und Nachteile des Online-Lernens"),("titel_ar","إيجابيات وسلبيات التعلم عبر الإنترنت"),
        ("auftrag_de","Sprechen Sie über das Lernen im Internet: Welche Vorteile und Nachteile gibt es? Nennen Sie eigene Erfahrungen."),
        ("auftrag_ar","تحدث عن التعلم عبر الإنترنت: ما الإيجابيات والسلبيات؟ اذكر تجربتك الشخصية."),
        ("stuetzen",["Ein Vorteil ist … / Ein Nachteil ist …","Ich habe die Erfahrung gemacht, dass …","Meiner Meinung nach …","Im Vergleich zum Präsenzunterricht …"]),
        ("kriterien",[
            OrderedDict([("de","Argumentationsaufbau"),("ar","بناء الحجة")]),
            OrderedDict([("de","Wortschatz Lernen/Digitales"),("ar","مفردات التعلم والرقمنة")]),
            OrderedDict([("de","Konnektoren (jedoch, außerdem)"),("ar","أدوات الربط")]),
            OrderedDict([("de","Eigene Meinung erkennbar"),("ar","وضوح الرأي الشخصي")]),
        ]),
        ("zeit_s",180),
    ]),
    OrderedDict([
        ("id","mm-b2-05"),("level","B2"),("teil",2),
        ("titel_de","Soll das Rauchen in der Öffentlichkeit verboten werden?"),("titel_ar","هل يُمنع التدخين في الأماكن العامة؟"),
        ("auftrag_de","Nehmen Sie Stellung: Nennen Sie Argumente für und gegen ein Rauchverbot in öffentlichen Räumen und begründen Sie Ihre Meinung."),
        ("auftrag_ar","عبّر عن موقفك: اذكر حججاً مع وضد منع التدخين في الأماكن العامة وبرر رأيك."),
        ("stuetzen",["Pro: Gesundheitsschutz / Passivrauchen","Contra: Persönliche Freiheit","Ein überzeugendes Argument ist …","Aus meiner Sicht überwiegt …"]),
        ("kriterien",[
            OrderedDict([("de","Pro- und Contra-Argumente"),("ar","الحجج المع والمضاد")]),
            OrderedDict([("de","Abstrakter Wortschatz"),("ar","مفردات مجردة")]),
            OrderedDict([("de","Konditional- und Konzessivsätze"),("ar","جمل الشرط والتنازع")]),
            OrderedDict([("de","Schlüssige Begründung"),("ar","الاستدلال المنطقي")]),
        ]),
        ("zeit_s",240),
    ]),
]

# New Kontakt (Teil 1) cards
more_kontakt = [
    OrderedDict([
        ("id","kt-a1-03"),("level","A1"),("teil",1),
        ("titel_de","Nach dem Weg fragen"),("titel_ar","السؤال عن الطريق"),
        ("auftrag_de","Fragen Sie eine Passantin / einen Passanten nach dem Weg zum Hauptbahnhof."),
        ("auftrag_ar","اسأل أحد المارّة عن الطريق إلى المحطة المركزية."),
        ("stuetzen",["Entschuldigung, ich suche den Hauptbahnhof.","Wie komme ich dorthin?","Gehe ich links oder rechts?","Vielen Dank!"]),
        ("kriterien",[
            OrderedDict([("de","Höfliche Anrede"),("ar","المناداة المهذبة")]),
            OrderedDict([("de","Richtungsangaben verstehen"),("ar","فهم اتجاهات الطريق")]),
            OrderedDict([("de","W-Fragen"),("ar","أسئلة W")]),
            OrderedDict([("de","Danken"),("ar","الشكر")]),
        ]),
        ("zeit_s",90),
    ]),
    OrderedDict([
        ("id","kt-a2-03"),("level","A2"),("teil",1),
        ("titel_de","Einen Arzttermin vereinbaren"),("titel_ar","حجز موعد عند الطبيب"),
        ("auftrag_de","Rufen Sie die Arztpraxis an und vereinbaren Sie einen Termin. Sagen Sie, warum Sie kommen."),
        ("auftrag_ar","اتصل بالعيادة واحجز موعداً واذكر سبب الزيارة."),
        ("stuetzen",["Guten Tag, ich möchte einen Termin.","Ich habe Schmerzen im … / Ich habe … seit …","Haben Sie am … um … Uhr frei?","Mein Name ist …"]),
        ("kriterien",[
            OrderedDict([("de","Terminwunsch klar formulieren"),("ar","تحديد طلب الموعد")]),
            OrderedDict([("de","Symptome nennen"),("ar","ذكر الأعراض")]),
            OrderedDict([("de","Zeit-/Datumsangaben"),("ar","التاريخ والوقت")]),
            OrderedDict([("de","Telefonische Höflichkeit"),("ar","آداب المكالمة")]),
        ]),
        ("zeit_s",120),
    ]),
    OrderedDict([
        ("id","kt-b1-03"),("level","B1"),("teil",1),
        ("titel_de","Eine Wohnung besichtigen (Fragen an den Vermieter)"),("titel_ar","معاينة شقة: أسئلة للمؤجر"),
        ("auftrag_de","Sie besichtigen eine Mietwohnung. Fragen Sie den Vermieter nach Miete, Nebenkosten, Kaution und Haustieren."),
        ("auftrag_ar","أنت تعاين شقة للإيجار؛ اسأل المؤجر عن الإيجار والتكاليف الإضافية والتأمين وحيازة الحيوانات الأليفة."),
        ("stuetzen",["Wie hoch ist die Kaltmiete und die Nebenkosten?","Ist die Kaution drei Kaltmieten?","Sind Haustiere erlaubt?","Wie ist die Anbindung an die Öffis?"]),
        ("kriterien",[
            OrderedDict([("de","Wohnungswortschatz"),("ar","مفردات السكن")]),
            OrderedDict([("de","Präzise Fragen"),("ar","أسئلة دقيقة")]),
            OrderedDict([("de","Höflicher Umgangston"),("ar","اللهجة المهذبة")]),
            OrderedDict([("de","Verstehen der Antworten"),("ar","فهم الأجوبة")]),
        ]),
        ("zeit_s",180),
    ]),
    OrderedDict([
        ("id","kt-b2-03"),("level","B2"),("teil",2),
        ("titel_de","Feedback-Gespräch mit dem Chef"),("titel_ar","محادثة تقييم مع المدير"),
        ("auftrag_de","Führen Sie ein Feedback-Gespräch mit Ihrem Vorgesetzten. Sprechen Sie über Ihre Stärken, Wünsche und nächste Schritte."),
        ("auftrag_ar","أجرِ محادثة تقييم مع مديرك: تحدث عن نقاط قوتك ورغباتك والخطوات التالية."),
        ("stuetzen",["In den letzten Monaten habe ich … erreicht.","Ich wünsche mir mehr Verantwortung für …","Wo sehen Sie noch Entwicklungspotenzial?","Wichtig ist mir auch …"]),
        ("kriterien",[
            OrderedDict([("de","Arbeitsweltwortschatz"),("ar","مفردات عالم العمل")]),
            OrderedDict([("de","Konstruktive Selbstreflexion"),("ar","تأمل ذاتي بنّاء")]),
            OrderedDict([("de","Höfliche, aber bestimmte Formulierungen"),("ar","صياغات مهذبة وحازمة")]),
            OrderedDict([("de","Gesprächssteuerung"),("ar","إدارة الحوار")]),
        ]),
        ("zeit_s",180),
    ]),
]

existing_ids = {k['id'] for k in m['karten']}
for k in more_monolog:
    if k['id'] not in existing_ids:
        m['karten'].append(k)

k2ids = {k['id'] for k in m.get('kontakt',[])}
kontakt = m.setdefault('kontakt',[])
for k in more_kontakt:
    if k['id'] not in k2ids:
        # fix B2 Feedback: it's still Teil 1 (Gespräch)
        if k.get('teil') == 2: k['teil'] = 1
        kontakt.append(k)

json.dump(m, open('content/muendlich.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/muendlich.json','a',encoding='utf-8').write('\n')

total_monolog = len(m['karten'])
total_kontakt = len(m['kontakt'])
print('monolog/diskussion cards:', total_monolog)
print('kontakt cards:', total_kontakt)
by = {}
for k in m['karten']:
    lv = k.get('level','?'); t = k['teil']
    by.setdefault(lv,[0,0,0])[t-1]+=1
for k in m['kontakt']:
    by.setdefault(k.get('level','?'),[0,0,0])[0]+=1
for lv,c in sorted(by.items()):
    print(' ',lv,'Kontakt/T1=%d, Monolog/T2=%d, Disk/T3=%d'%tuple(c))
