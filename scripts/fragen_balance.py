#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""توازنُ أنواعِ الأسئلة: سؤالُ صواب/خطأ رابعٌ لكلِّ نصوصِ B2 العشرين — مستخرَجٌ من متنِ النصِّ نفسِه."""
import json
P="content/texts.json"
TF = {
 "t-b2-01": ("Laut Text wirken digitale Medien auch ohne pädagogisches Konzept stark.", "falsch", "النصُّ يقول: «Ohne pädagogisches Konzept … bliebe der Effekt gering»."),
 "t-b2-02": ("Der Verkehrsminister und die Bürgermeisterin bewerten die Lage unterschiedlich.", "richtig", "الوزيرُ يقولُ منتظمةٌ وموثوقة، والعمدةُ تنقلُ تجربةً مغايرة — وهذا كلامٌ منقولٌ بصيغةِ Konjunktiv I."),
 "t-b2-03": ("Der Text hält Abwarten in der Klimafrage für verantwortungsvoll.", "falsch", "«Wer hier noch Abwarten propagiert, handelt verantwortungslos»."),
 "t-b2-04": ("Die Figuren des Romans werden als besonders stark gezeichnet gelobt.", "falsch", "«Einzig die Figuren bleiben etwas blass» — العيبُ الوحيدُ المذكور."),
 "t-b2-05": ("Fachwissen allein reicht laut Text für moderne Berufe aus.", "falsch", "«Fachwissen allein genügt längst nicht mehr»."),
 "t-b2-06": ("Wer bis spät in die Nacht lernt, erzielt laut Text oft das Gegenteil.", "richtig", "«Wer dagegen bis spät in die Nacht büffelt, erzielt oft das Gegenteil»."),
 "t-b2-07": ("Der Text fordert, die Digitalisierung zu bremsen.", "falsch", "«Es geht nicht darum, Bremsen zu legen, sondern darum, Ziele zu definieren»."),
 "t-b2-08": ("Der Text nennt drei Prüffragen für Nachrichten.", "richtig", "مَن يكتب؟ أيُّ مصادرَ تُذكَر؟ أترِدُ الوقائعُ في مكانٍ آخر؟"),
 "t-b2-09": ("Laut Text endet Bildung heute mit der Schule.", "falsch", "«Früher endete die Ausbildung mit der Schule, heute nicht mehr»."),
 "t-b2-10": ("Kritikerinnen bezweifeln die Übertragbarkeit des Versuchs auf Fabriken.", "richtig", "«… ließen sich nicht auf Fabriken übertragen» — Konjunktiv I في نقلِ الاعتراض."),
 "t-b2-11": ("Der Text verschweigt die Nachteile begrünter Dächer.", "falsch", "«Eingeweihte schweigen die Kehrseite nicht tot: Statik, Pflegekosten …»."),
 "t-b2-12": ("Die Studie behauptet, es werde heute weniger gelesen als früher.", "falsch", "بالعكس: «nie so viel gelesen wurde wie heute» — لكنَّ الشكلَ تغيَّر."),
 "t-b2-13": ("Studierende aus Akademikerhaushalten nutzen die Gebührenfreiheit überproportional.", "richtig", "هذه هي الظاهرةُ التي تُظهِرُها الأرقامُ الاسكندنافية."),
 "t-b2-14": ("Gegen Lärm gibt es laut Text ebenso klare Grenzwerte wie gegen Feinstaub.", "falsch", "«Gegen Feinstaub gibt es Grenzwerte …, gegen Schall fast nichts»."),
 "t-b2-15": ("Wer Fehler bestraft, bekommt laut Text weniger gemeldete Fehler.", "richtig", "«Wer Fehler bestraft, bekommt weniger gemeldete Fehler, nicht weniger Fehler»."),
 "t-b2-16": ("Die Auslastung zu Stoßzeiten verbesserte sich nach Einführung des Tickets.", "falsch", "«die Auslastung zu Stoßzeiten verschlechterte sich vielerorts»."),
 "t-b2-17": ("Analystinnen bezweifeln, dass Werbung die Haltestellen wirklich finanziert.", "richtig", "«Die Finanzierung decke bestenfalls die Rahmen» — Konjunktiv I في الاعتراض."),
 "t-b2-18": ("Die Verzögerung liegt laut Text vor allem an der Technik.", "falsch", "«nicht wegen der Technik, sondern weil die Behörde weiter persönlich die Identität prüfen muss»."),
 "t-b2-19": ("Der Fachkräftemangel hat laut Text eine einzige Ursache.", "falsch", "«lässt sich nicht auf eine einzige Ursache zurückführen»."),
 "t-b2-20": ("Befürworter der Mietpreisbremse sehen darin einen Schutz für Bestandsmieter.", "richtig", "«sie schütze Bestandsmieter» — نقلٌ بصيغةِ Konjunktiv I."),
}
def main():
    t=json.load(open(P,encoding="utf8"))
    n=0
    for x in t:
        if x["id"] in TF:
            prompt, answer, erklaerung = TF[x["id"]]
            qid = f'{x["id"]}-q4'
            assert all(q["id"]!=qid for q in x["questions"]), qid
            x["questions"].append({"id":qid,"type":"truefalse","promptDe":prompt,
                "options":["richtig","falsch"],"answer":answer,"explanationAr":erklaerung})
            n+=1
    json.dump(t,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    print("أُضيف:",n,"| الأسئلة:",sum(len(x["questions"]) for x in t),
          dict(collections.Counter(q["type"] for x in t for q in x["questions"])))
main()
