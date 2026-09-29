#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثامنةَ عشرة: B1 — الجسدُ والطبيعةُ المتقدّمة · الجيرةُ والسكنُ المشترك · حروفُ الجرِّ الثقيلة."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Beschwerden schildern","يصفُ الأوجاع","","","Schildern Sie bitte Ihre Beschwerden.","صِفْ أوجاعَكَ من فضلك","koerp1"),
 ("die Überweisung zum Facharzt","إحالةٌ إلى الأخصائي","die","","Ich brauche eine Überweisung zum Facharzt.","أحتاجُ إحالةً إلى الأخصائي","koerp1"),
 ("die Vorerkrankung","المرضُ السابق","die","die Vorerkrankungen","Haben Sie Vorerkrankungen?","أعندكَ أمراضٌ سابقة؟","koerp1"),
 ("die Dosis","الجرعة","die","die Dosen","Halten Sie die Dosis genau ein.","التزمْ بالجرعةِ بدقة","koerp1"),
 ("die Wechselwirkung","التداخلُ الدوائي","die","die Wechselwirkungen","Achten Sie auf Wechselwirkungen.","انتبهْ للتداخلاتِ الدوائية","koerp1"),
 ("der Befund","نتيجةُ الفحص","der","die Befunde","Der Befund ist unauffällig.","النتيجةُ سليمة","koerp1"),
 ("die Genesung abwarten","ينتظرُ التعافي","","","Wir warten die Genesung ab.","ننتظرُ التعافي","koerp1"),
 ("die Schonung","الراحةُ الوقائية","die","","Der Arzt hat Schonung verordnet.","وصفَ الطبيبُ راحةً وقائية","koerp1"),
 ("belastende Arbeit","عملٌ مُجهِد","","","Belastende Arbeit ist vorerst tabu.","العملُ المجهِدُ ممنوعٌ حالياً","koerp1"),
 ("das Klima im Haus","جوُّ البيت","das","","Das Klima im Haus ist angenehm.","جوُّ البيتِ مريح","wohn1"),
 ("die Hausgemeinschaft","جماعةُ السكّان","die","die Hausgemeinschaften","Die Hausgemeinschaft trifft sich jährlich.","جماعةُ السكّانِ تجتمعُ سنوياً","wohn1"),
 ("der Gemeinschaftsraum","الغرفةُ المشتركة","der","die Gemeinschaftsräume","Im Gemeinschaftsraum feiern wir.","نحتفلُ في الغرفةِ المشتركة","wohn1"),
 ("die Reinigungspflicht","واجبُ التنظيف","die","","Die Reinigungspflicht wechselt wöchentlich.","واجبُ التنظيفِ يتناوبُ أسبوعياً","wohn1"),
 ("den Müll rausbringen","يُخرِجُ القمامة","","","Wer bringt heute den Müll raus?","مَن يُخرِجُ القمامةَ اليوم؟","wohn1"),
 ("die Ruhezeiten beachten","يراعي أوقاتَ الهدوء","","","Bitte die Ruhezeiten beachten.","راعِ أوقاتَ الهدوء","wohn1"),
 ("der Schlüsseldienst","خدمةُ فتحِ الأقفال","der","die Schlüsseldienste","Ich musste den Schlüsseldienst rufen.","اضطُرِرتُ لاستدعاءِ خدمةِ الأقفال","wohn1"),
 ("die Renovierung übernehmen","يتولّى التجديد","","","Der Vermieter übernimmt die Renovierung.","المؤجِّرُ يتولّى التجديد","wohn1"),
 ("die Wohnung untervermieten","يؤجّرُ من الباطن","","","Untervermieten geht nur mit Erlaubnis.","التأجيرُ من الباطنِ بإذنٍ فقط","wohn1"),
 ("das Nachbarschaftsfest","حفلةُ الحيّ","das","die Nachbarschaftsfeste","Das Nachbarschaftsfest ist im Juni.","حفلةُ الحيِّ في يونيو","wohn1"),
 ("aufgrund","بسببِ (رسمي)","","","Aufgrund des Wetters fällt das Fest aus.","بسببِ الطقسِ أُلغيت الحفلة","praep2"),
 ("infolge","نتيجةً لـ","","","Infolge des Streiks kam der Zug nicht.","نتيجةً للإضرابِ لم يأتِ القطار","praep2"),
 ("anlässlich","بمناسبةِ","","","Anlässlich des Jubiläums gibt es Rabatt.","بمناسبةِ اليوبيلِ هناكَ حسم","praep2"),
 ("mangels","لانعدامِ","","","Mangels Beweisen wurde das Verfahren eingestellt.","لانعدامِ الأدلّةِ حُفِظَتِ الدعوى","praep2"),
 ("zwecks","بغرضِ","","","Zwecks Anmeldung bringen Sie den Pass mit.","بغرضِ التسجيلِ أحضِرِ الجواز","praep2"),
 ("laut","بحسبِ","","","Laut Vertrag zahlt der Mieter.","بحسبِ العقدِ يدفعُ المستأجر","praep2"),
 ("gemäß","وفقاً لـ","","","Gemäß den Regeln ist das erlaubt.","وفقاً للقواعدِ هذا مسموح","praep2"),
 ("entgegen","على عكسِ","","","Entgegen den Erwartungen klappte alles.","على عكسِ التوقُّعاتِ نجحَ كلُّ شيء","praep2"),
 ("dank","بفضلِ","","","Dank deiner Hilfe war es leicht.","بفضلِ مساعدتِكَ كانَ سهلاً","praep2"),
 ("statt","بدلاً من","","","Statt eines Autos kaufte er ein Rad.","بدلاً من سيارةٍ اشترى درّاجة","praep2"),
 ("außerhalb","خارجَ (حدودِ)","","","Außerhalb der Öffnungszeiten ist zu.","خارجَ أوقاتِ الفتحِ مغلق","praep2"),
 ("innerhalb der Frist","داخلَ المهلة","","","Innerhalb der Frist ist alles möglich.","داخلَ المهلةِ كلُّ شيءٍ ممكن","praep2"),
 ("bezüglich","بخصوصِ","","","Bezüglich Ihrer Anfrage: Wir prüfen sie.","بخصوصِ استفسارِكم: نحنُ ندرسُه","praep2"),
 ("jenseits von","فيما وراءَ","","","Jenseits der Stadt beginnt der Wald.","فيما وراءَ المدينةِ تبدأُ الغابة","praep2"),
 ("unweit","غيرَ بعيدٍ عن","","","Unweit des Bahnhofs gibt es ein Café.","غيرَ بعيدٍ عن المحطةِ مقهى","praep2"),
 ("binnen","في غضونِ","","","Binnen einer Woche kommt die Antwort.","في غضونِ أسبوعٍ يأتي الجواب","praep2"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vo-b1v-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-gesund-wohnen-praep"]={"id":"b1-gesund-wohnen-praep","titleAr":"العيادة المتقدّمة · الجيرة والسكن · حروف الجرّ الرسمية","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
