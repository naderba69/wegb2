#!/usr/bin/env python3
"""Add a B2 deck on Wissenschaft, Digitalisierung und Zukunft."""
import json
from collections import OrderedDict

cards = [
    ("die Forschung", "الأبحاث العلمية", "die", "In Deutschland wird viel Forschung im Bereich Erneuerbare Energien betrieben.", "في ألمانيا تُجرى أبحاث كثيرة في مجال الطاقات المتجددة."),
    ("die Studie", "دراسة علمية", "die", "Eine aktuelle Studie zeigt, dass Bewegung das Lernen verbessert.", "تُظهر دراسة حديثة أن الحركة تحسّن التعلّم."),
    ("die Untersuchung", "فحص/تحقيق/دراسة", "die", "Die Untersuchung ergab keine Hinweise auf Nebenwirkungen.", "لم يُظهر التحقيق أي دليل على آثار جانبية."),
    ("die These", "أطروحة/فرضية علمية", "die", "Er stellte eine gewagte These über den Klimawandel auf.", "طرح فرضية جريئة حول تغيّر المناخ."),
    ("die Hypothese", "فرضية", "die", "Die Hypothese muss in Experimenten überprüft werden.", "يجب اختبار الفرضية في التجارب."),
    ("das Experiment", "تجربة علمية", "das", "Das Experiment wurde unter Laborbedingungen durchgeführt.", "أُجريت التجربة في ظروف مخبرية."),
    ("beweisen", "يُثبت", "", "Die Studie konnte die Wirkung noch nicht beweisen.", "لم تستطع الدراسة إثبات التأثير بعد."),
    ("nachweisen", "يُثبت/يُبرهن (بالدليل)", "", "Man konnte Schadstoffe im Wasser nachweisen.", "تم إثبات وجود مواد ضارة في الماء."),
    ("auswerten", "يُحلِّل/يُقيّم البيانات", "", "Die Daten werden derzeit ausgewertet.", "تُقيَّم البيانات حالياً."),
    ("das Ergebnis", "نتيجة", "das", "Das Ergebnis der Umfrage war überraschend.", "كانت نتيجة الاستطلاع مفاجئة."),
    ("die Auswirkung", "أثر/تأثير", "die", "Die Auswirkungen der Digitalisierung sind umstritten.", "آثار الرقمنة مُختلَف فيها."),
    ("die Folge", "نتيجة/عاقبة", "die", "Als Folge des Regens fiel der Unterricht aus.", "نتيجة المطر أُلغي الدرس."),
    ("der Fortschritt", "تقدّم", "der", "Technischer Fortschritt verändert die Arbeitswelt.", "التقدّم التقني يغير عالم العمل."),
    ("die Entwicklung", "تطوّر", "die", "Die Entwicklung der KI schreitet schnell voran.", "يتقدّم تطوير الذكاء الاصطناعي بسرعة."),
    ("die Zukunft", "المستقبل", "die", "Niemand weiß genau, was die Zukunft bringt.", "لا أحد يعرف بدقة ماذا سيجلب المستقبل."),
    ("die Künstliche Intelligenz", "الذكاء الاصطناعي", "die", "Künstliche Intelligenz wird immer häufiger im Alltag eingesetzt.", "يُستخدم الذكاء الاصطناعي بشكل متزايد في الحياة اليومية."),
    ("die Daten", "البيانات", "die", "Große Datenmengen werden in Echtzeit analysiert.", "تُحلَّل كميات ضخمة من البيانات لحظياً."),
    ("der Algorithmus", "الخوارزمية", "der", "Soziale Netzwerke nutzen komplexe Algorithmen.", "تستخدم الشبكات الاجتماعية خوارزميات معقّدة."),
    ("die Automatisierung", "الأتمتة", "die", "Die Automatisierung ersetzt manche Arbeitsplätze, schafft aber auch neue.", "تحل الأتمتة محل بعض الوظائف لكنها تخلق أيضاً وظائف جديدة."),
    ("die Globalisierung", "العولمة", "die", "Die Globalisierung verbindet Märkte weltweit.", "تربط العولمة الأسواق عالمياً."),
    ("die Nachhaltigkeit", "الاستدامة", "die", "Nachhaltigkeit bedeutet, Ressourcen schonend zu nutzen.", "تعني الاستدامة استخدام الموارد بحذر."),
    ("erneuerbar", "متجدّد", "", "Wind- und Solarenergie sind erneuerbare Energien.", "طاقة الرياح والشمس طاقتان متجدّدتان."),
    ("der Klimawandel", "تغيّر المناخ", "der", "Der Klimawandel führt zu häufigeren Extremwetterereignissen.", "يؤدي تغيّر المناخ إلى زيادة الظواهر الجوية المتطرفة."),
    ("die Krise", "أزمة", "die", "Während der Krise war die Solidarität groß.", "خلال الأزمة كان التضامن كبيراً."),
    ("die Lösung", "حل", "die", "Es gibt keine einfache Lösung für dieses Problem.", "لا يوجد حل بسيط لهذه المشكلة."),
]

v = json.load(open('content/vocab.json',encoding='utf-8'), object_pairs_hook=OrderedDict)
if 'b2-wissenschaft-zukunft' in v:
    print('deck already exists'); raise SystemExit

# Find the highest id
max_id = 0
import re
for deck in v.values():
    for c in deck.get('cards',[]):
        m = re.match(r'v(\d+)', c.get('id',''))
        if m:
            max_id = max(max_id, int(m.group(1)))

new_cards = []
for i,(de,ar,art,exde,exar) in enumerate(cards, start=1):
    max_id += 1
    pos = "Nomen" if art else ("Verb" if de.lower().endswith(('en','ern','eln')) else "Adjektiv")
    if pos == "Nomen":
        card = OrderedDict([
            ("id", f"v{max_id}"),
            ("de", de),
            ("ar", ar),
            ("pos", pos),
            ("level", "B2"),
            ("tags", ["wissenschaft", "zukunft"]),
            ("article", art),
            ("farbe", "BLAU"),
            ("exampleDe", exde),
            ("exampleAr", exar),
        ])
    else:
        card = OrderedDict([
            ("id", f"v{max_id}"),
            ("de", de),
            ("ar", ar),
            ("pos", pos),
            ("level", "B2"),
            ("tags", ["wissenschaft", "zukunft"]),
            ("exampleDe", exde),
            ("exampleAr", exar),
        ])
    new_cards.append(card)

v['b2-wissenschaft-zukunft'] = OrderedDict([
    ("id","b2-wissenschaft-zukunft"),
    ("titleDe","Wissenschaft · Digitalisierung · Zukunft"),
    ("titleAr","العلم · الرقمنة · المستقبل"),
    ("level","B2"),
    ("cards", new_cards),
])

# Write JSON preserving order
json.dump(v, open('content/vocab.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('content/vocab.json','a',encoding='utf-8').write('\n')
print(f"Added deck b2-wissenschaft-zukunft with {len(new_cards)} cards. Last id v{max_id}. Total decks: {len(v)}")
