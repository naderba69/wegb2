#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الرابعةَ عشرة: B1 — العملُ اليوميُّ والخدمات · الطبيعةُ والسفرُ والرياضة · وصفُ الصورةِ في الامتحان."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))

ROWS = [
 # العملُ اليوميُّ والخدمات
 ("die Dienstleistung","الخدمة","die","die Dienstleistungen","Der Sektor der Dienstleistungen wächst.","قطاعُ الخدماتِ ينمو","dienst"),
 ("der Auftrag","الطلبيّة / التكليف","der","die Aufträge","Wir haben einen großen Auftrag bekommen.","حصلنا على طلبيّةٍ كبيرة","dienst"),
 ("der Kundendienst","خدمةُ الزبائن","der","","Der Kundendienst ruft zurück.","خدمةُ الزبائنِ تعاودُ الاتصال","dienst"),
 ("die Beschwerde einreichen","يقدّمُ شكوى","","","Ich habe eine Beschwerde eingereicht.","قدَّمتُ شكوى","dienst"),
 ("die Bearbeitung","المعالجة","die","","Die Bearbeitung dauert zehn Tage.","المعالجةُ عشرةُ أيام","dienst"),
 ("der Ablauf","سيرُ العملية","der","die Abläufe","Der Ablauf ist klar geregelt.","سيرُ العمليةِ منظَّمٌ بوضوح","dienst"),
 ("die Zuständigkeit klären","يحدّدُ الاختصاص","","","Zuerst klären wir die Zuständigkeit.","أوّلاً نحدّدُ الاختصاص","dienst"),
 ("die Vertretung","النيابة","die","die Vertretungen","In meiner Abwesenheit übernimmt die Vertretung.","في غيابي تتولّى النيابة","dienst"),
 ("die Abwesenheit","الغياب","die","","Die Abwesenheit war angekündigt.","كانَ الغيابُ معلَناً","dienst"),
 ("die Dienstreise","رحلةُ العمل","die","die Dienstreisen","Die Dienstreise geht nach Wien.","رحلةُ العملِ إلى فيينّا","dienst"),
 ("die Spesen","نفقاتُ المهمّة","die","","Die Spesen werden erstattet.","نفقاتُ المهمّةِ تُستردّ","dienst"),
 ("erstatten","يعوّض مالياً","","","Die Firma erstattet die Fahrtkosten.","الشركةُ تعوّضُ مصاريفَ التنقُّل","dienst"),
 ("die Quittung einreichen","يقدّمُ الوصل","","","Bitte die Quittung einreichen.","قدّمِ الوصلَ من فضلك","dienst"),
 ("der Nachweis erbringen","يأتي بالإثبات","","","Sie müssen den Nachweis erbringen.","عليكَ الإتيانُ بالإثبات","dienst"),
 ("die Vollmacht erteilen","يمنحُ توكيلاً","","","Ich erteile ihm eine Vollmacht.","أمنحُهُ توكيلاً","dienst"),
 # الطبيعةُ والسفرُ والرياضة
 ("die Wanderung","الرحلةُ سيراً","die","die Wanderungen","Die Wanderung dauert vier Stunden.","الرحلةُ سيراً أربعُ ساعات","natur1"),
 ("der Gipfel","القمّة","der","die Gipfel","Vom Gipfel sieht man das Tal.","من القمّةِ يُرى الوادي","natur1"),
 ("das Tal","الوادي","das","die Täler","Im Tal liegt Nebel.","في الوادي ضباب","natur1"),
 ("die Küste","الساحل","die","die Küsten","Die Küste ist felsig.","الساحلُ صخري","natur1"),
 ("die Insel","الجزيرة","die","die Inseln","Die Insel erreicht man per Fähre.","تُبلَغُ الجزيرةُ بالعبّارة","natur1"),
 ("die Fähre","العبّارة","die","die Fähren","Die Fähre fährt stündlich.","العبّارةُ كلَّ ساعة","natur1"),
 ("die Ausrüstung","العتاد","die","","Ohne Ausrüstung geht es nicht.","بلا عتادٍ لا يمكن","natur1"),
 ("der Anfängerkurs","دورةُ المبتدئين","der","die Anfängerkurse","Ich mache einen Anfängerkurs im Schwimmen.","أحضرُ دورةَ مبتدئينَ في السباحة","natur1"),
 ("die Mitgliedschaft","العضوية","die","die Mitgliedschaften","Die Mitgliedschaft kostet monatlich zwanzig Euro.","العضويةُ عشرونَ يورو شهرياً","natur1"),
 ("der Wettbewerb","المسابقة","der","die Wettbewerbe","Der Wettbewerb findet im Juni statt.","المسابقةُ في يونيو","natur1"),
 ("teilnehmen am Wettbewerb","يشاركُ في المسابقة","","","Ich nehme am Wettbewerb teil.","أشاركُ في المسابقة","natur1"),
 ("das Training ausfallen lassen","يلغي التدريب","","","Heute lasse ich das Training ausfallen.","اليومَ أُلغي التدريب","natur1"),
 ("sich aufwärmen","يُحمّي عضلاتِه","","","Vor dem Sport wärme ich mich auf.","قبلَ الرياضةِ أُحمّي","natur1"),
 ("die Erschöpfung spüren","يحسُّ بالإنهاك","","","Nach zwei Stunden spürte ich Erschöpfung.","بعدَ ساعتَينِ أحسستُ بالإنهاك","natur1"),
 # وصفُ الصورةِ والرسمِ البياني في الامتحان
 ("auf dem Bild sieht man","في الصورةِ يُرى","","","Auf dem Bild sieht man eine volle Straße.","في الصورةِ يُرى شارعٌ مزدحم","bild"),
 ("im Vordergrund","في المقدّمة","","","Im Vordergrund steht eine Frau.","في المقدّمةِ تقفُ امرأة","bild"),
 ("im Hintergrund","في الخلفية","","","Im Hintergrund erkennt man ein Gebäude.","في الخلفيةِ يُلمَحُ مبنى","bild"),
 ("in der Mitte des Bildes","في وسطِ الصورة","","","In der Mitte des Bildes liegt ein Platz.","في وسطِ الصورةِ ساحة","bild"),
 ("es scheint, dass","يبدو أنّ","","","Es scheint, dass es regnet.","يبدو أنّها تمطر","bild"),
 ("vermutlich","على الأرجح","","","Vermutlich ist es Morgen.","على الأرجحِ الوقتُ صباح","bild"),
 ("das Bild erinnert mich an","الصورةُ تذكّرُني بـ","","","Das Bild erinnert mich an meine Stadt.","الصورةُ تذكّرُني بمدينتي","bild"),
 ("die Grafik zeigt","الرسمُ البيانيُّ يُظهِر","","","Die Grafik zeigt die Entwicklung seit 2010.","الرسمُ يُظهِرُ التطوُّرَ منذُ 2010","bild"),
 ("im Jahr","في سنةِ","","","Im Jahr 2020 lag der Wert am höchsten.","في 2020 بلغتِ القيمةُ ذروتَها","bild"),
 ("der Anteil","النسبة","der","die Anteile","Der Anteil der Frauen stieg.","ارتفعت نسبةُ النساء","bild"),
 ("im Vergleich dazu","بالمقارنةِ بذلك","","","Im Vergleich dazu ist die Zahl klein.","بالمقارنةِ بذلك العددُ صغير","bild"),
 ("deutlich steigen","يرتفعُ بوضوح","","","Die Kosten sind deutlich gestiegen.","ارتفعتِ التكاليفُ بوضوح","bild"),
 ("leicht sinken","ينخفضُ قليلاً","","","Die Zahl ist leicht gesunken.","انخفضَ العددُ قليلاً","bild"),
 ("konstant bleiben","يبقى ثابتاً","","","Der Wert blieb konstant.","بقيتِ القيمةُ ثابتة","bild"),
 ("zusammenfassend lässt sich sagen","خلاصةُ القول","","","Zusammenfassend lässt sich sagen: Der Trend hält an.","خلاصةُ القول: الاتّجاهُ مستمر","bild"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[]; dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vk-b1x-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-dienst-natur-bild"]={"id":"b1-dienst-natur-bild","titleAr":"الخدمات والعمل اليومي · الطبيعة والرياضة · وصف الصورة والرسم البياني","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp)
    print(dict(c),"| المجموع:",sum(c.values()))
main()
