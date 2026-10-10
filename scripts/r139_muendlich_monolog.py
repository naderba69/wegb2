#!/usr/bin/env python3
"""R139: add more mündlich monolog (Teil 2 Bildbeschreibung + Teil 1 Kontaktgespräch + Teil 3 Diskussion) cards.
Covers A1/A2/B1/B2 levels (not only B2)."""
import json
from collections import OrderedDict, Counter

# Add per-level cards
KARTEN = [
    # A1 — einfache Bildbeschreibung
    OrderedDict([("id","mm-a1-01"),("level","A1"),("teil",2),
        ("titel_de","Mein Zimmer"),("titel_ar","غرفتي"),
        ("auftrag_de","Beschreibe das Bild: Was siehst du? Wo steht der Tisch? Was liegt auf dem Bett? Was machst du gern im Zimmer?"),
        ("stuetzen",["Im Zimmer sehe ich …","Links steht …","Rechts liegt …","Ich mache gern …"]),
        ("kriterien",[
            {"de":"3–4 Dinge benannt","ar":"تسمية 3–4 أشياء"},
            {"de":"einfache Lage (links/rechts/auf/unter)","ar":"الموقع البسيط (يسار/يمين/فوق/تحت)"},
            {"de":"einfache Satzstruktur","ar":"تركيب جمل بسيط"},
        ]),
        ("zeit_s",90),
    ]),
    OrderedDict([("id","mm-a1-02"),("level","A1"),("teil",2),
        ("titel_de","Meine Familie"),("titel_ar","عائلتي"),
        ("auftrag_de","Beschreibe das Bild: Wer sind die Personen? Wie alt sind sie? Was machen sie beruflich? Hast du auch eine Familie?"),
        ("stuetzen",["Das ist …","Er/Sie ist … Jahre alt.","Er/Sie arbeitet als …","Ich habe auch …"]),
        ("kriterien",[{"de":"3 Personen vorgestellt","ar":"تقديم 3 أشخاص"},{"de":"Beruf-Alter-Wohnort","ar":"المهنة والعمر والمكان"},{"de":"eigene Familie","ar":"عائلة المتكلّم"}],),
        ("zeit_s",90),
    ]),
    # A2 — Bild + Alltagssituation
    OrderedDict([("id","mm-a2-01"),("level","A2"),("teil",2),
        ("titel_de","Am Bahnhof"),("titel_ar","في محطة القطار"),
        ("auftrag_de","Beschreibe das Bild: Wo sind die Leute? Was machen sie? Welche Probleme könnten sie haben? Wann hast du zuletzt einen Zug genommen?"),
        ("stuetzen",["Im Vordergrund …","Hinten …","Vielleicht möchte er/sie …","Ich bin letztes Mal … gefahren."]),
        ("kriterien",[{"de":"Vordergrund/Hintergrund","ar":"مقدمة/خلفية"},{"de":"eine Vermutung mit vielleicht","ar":"تخمين بـvielleicht"},{"de":"eigene Erfahrung","ar":"تجربة شخصية"}],),
        ("zeit_s",120),
    ]),
    OrderedDict([("id","mm-a2-02"),("level","A2"),("teil",2),
        ("titel_de","Beim Arzt"),("titel_ar","عند الطبيب"),
        ("auftrag_de","Beschreibe das Bild: Was ist passiert? Welche Beschwerden hat der Patient? Was sagt der Arzt? Was machst du, wenn du krank bist?"),
        ("stuetzen",["Der Mann/die Frau hat …","Er/Sie klagt über …","Der Arzt rät, …","Wenn ich krank bin, …"]),
        ("kriterien",[{"de":"Beschwerden genannt","ar":"ذكر الشكاوى"},{"de":"Ratschlag des Arztes","ar":"نصيحة الطبيب"},{"de":"eigene Erfahrung","ar":"تجربة شخصية"}],),
        ("zeit_s",120),
    ]),
    # B1 — Monolog zu einem Thema (Themenkarte, Goethe Teil 2)
    OrderedDict([("id","mm-b1-01"),("level","B1"),("teil",2),
        ("titel_de","Thema: Freizeit"),("titel_ar","الموضوع: وقت الفراغ"),
        ("auftrag_de","Sprechen Sie über Ihre Freizeit: Was machen Sie gern? Wie oft? Mit wem? Warum? Was haben Sie letztes Wochenende gemacht? Was planen Sie für nächstes Wochenende?"),
        ("stuetzen",["In meiner Freizeit … ich gern.","Am liebsten …, weil …","Letztes Wochenende habe ich …","Nächstes Wochenende möchte ich …"]),
        ("kriterien",[{"de":"Präsens + Perfekt + Futur","ar":"مضارع + ماضي تام + مستقبل"},{"de":"Begründung mit weil","ar":"التعليل بـweil"},{"de":"flüssig 2–3 Minuten","ar":"سلس لمدة 2–3 دقائق"}],),
        ("zeit_s",180),
    ]),
    OrderedDict([("id","mm-b1-02"),("level","B1"),("teil",2),
        ("titel_de","Thema: Meine Deutschlernreise"),("titel_ar","الموضوع: رحلتي في تعلّم الألمانية"),
        ("auftrag_de","Sprechen Sie darüber: Seit wann lernen Sie Deutsch? Warum? Was ist leicht, was ist schwer? Wie lernen Sie jeden Tag? Welches Ziel haben Sie?"),
        ("stuetzen",["Seit … lerne ich Deutsch.","Am Anfang war … schwierig.","Mir hilft besonders, …","Mein Ziel ist es, …"]),
        ("kriterien",[{"de":"Seit/vor Zeitangaben","ar":"منذ/قبل للتوقيت"},{"de":"Vergleich leicht/schwer","ar":"مقارنة صعب/سهل"},{"de":"Ziel formuliert","ar":"صياغة الهدف"}],),
        ("zeit_s",180),
    ]),
    OrderedDict([("id","mm-b1-03"),("level","B1"),("teil",2),
        ("titel_de","Bild: Eine Wohngemeinschaft"),("titel_ar","صورة: شقة مشتركة"),
        ("auftrag_de","Beschreiben Sie das Bild: Wer ist da? Was passiert? Wer macht welche Hausarbeit? Wäre eine WG etwas für Sie? Warum (nicht)?"),
        ("stuetzen",["Im Vordergrund/Hintergrund …","Die eine Person …, während …","Vermutlich …","Ich würde (nicht) in einer WG wohnen, weil …"]),
        ("kriterien",[{"de":"Bildebenen + Personen","ar":"طبقات الصورة والأشخاص"},{"de":"Vermutungen mit vermutlich/dürfte","ar":"تخمينات بـvermutlich/dürfte"},{"de":"begründete Meinung","ar":"رأي معلَّل"}],),
        ("zeit_s",180),
    ]),
    # B2 — Monolog mit kontroverser Stellungnahme
    OrderedDict([("id","mm-b2-02"),("level","B2"),("teil",2),
        ("titel_de","Thema: Arbeiten im Homeoffice"),("titel_ar","الموضوع: العمل من المنزل"),
        ("auftrag_de","Sprechen Sie 3–4 Minuten über Homeoffice: Vorteile, Nachteile, Ihre Erfahrung. Welche Regeln sollte ein Unternehmen aufstellen? Wie wird Arbeit in 20 Jahren aussehen?"),
        ("stuetzen",["Einerseits …, andererseits …","Aus eigener Erfahrung kann ich sagen, dass …","Ein gravierender Nachteil besteht darin, dass …","Zusammenfassend bin ich der Meinung, dass …"]),
        ("kriterien",[{"de":"Pro-Contra-Bilanz","ar":"ميزان إيجابيات/سلبيات"},{"de":"Konnektoren: andererseits/obwohl/trotz","ar":"أدوات ربط"},{"de":"Zukunftsprognose","ar":"توقّع مستقبلي"},{"de":"begründete Stellungnahme","ar":"موقف معلَّل"}],),
        ("zeit_s",240),
    ]),
    OrderedDict([("id","mm-b2-03"),("level","B2"),("teil",2),
        ("titel_de","Bild: Demonstration auf dem Marktplatz"),("titel_ar","صورة: مظاهرة في ساحة السوق"),
        ("auftrag_de","Beschreiben Sie das Bild. Um welches Thema könnte es gehen? Welche Argumente haben Demonstranten/Gegner? Würden Sie selbst demonstrieren gehen? Wofür?"),
        ("stuetzen",["Im Vordergrund ist … zu sehen.","Im Hintergrund …","Es könnte sich um … handeln, weil …","Die Befürworter argumentieren, dass …, während die Gegner einwenden, dass …"]),
        ("kriterien",[{"de":"detaillierte Bildbeschreibung","ar":"وصف تفصيلي"},{"de":"Hypothese mit Begründung","ar":"فرضية مبرَّرة"},{"de":"zwei Seiten einer Debatte","ar":"طرفا النقاش"},{"de":"begründete eigene Position","ar":"موقف شخصي معلَّل"}],),
        ("zeit_s",240),
    ]),
]

m = json.load(open('content/muendlich.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
existing = {k['id'] for k in m['karten']}
added = 0
for k in KARTEN:
    if k['id'] not in existing:
        m['karten'].append(k); added += 1
with open('content/muendlich.json','w',encoding='utf-8') as f:
    json.dump(m,f,ensure_ascii=False,indent=2); f.write('\n')
print(f"Added {added} monolog cards. Total: {len(m['karten'])}")
per_level = Counter()
for k in m['karten']:
    per_level[k.get('level','?')] += 1
print("Per level:", dict(per_level))
