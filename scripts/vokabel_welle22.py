#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثانيةُ والعشرون: B1 — الدراسةُ الذاتيةُ والامتحان · الزمنُ والترتيبُ في النصّ · أفعالٌ انعكاسيةٌ شائعة."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Prüfungsanmeldung","التسجيلُ للامتحان","die","die Prüfungsanmeldungen","Die Prüfungsanmeldung endet Freitag.","التسجيلُ للامتحانِ ينتهي الجمعة","pruef"),
 ("der Prüfungsteil","جزءُ الامتحان","der","die Prüfungsteile","Der schriftliche Prüfungsteil dauert drei Stunden.","الجزءُ الكتابيُّ ثلاثُ ساعات","pruef"),
 ("die Bearbeitungszeit beachten","يراعي زمنَ الإنجاز","","","Beachten Sie die Bearbeitungszeit.","راعِ زمنَ الإنجاز","pruef"),
 ("die Aufgabenstellung","نصُّ المطلوب","die","die Aufgabenstellungen","Lies die Aufgabenstellung zweimal.","اقرأْ نصَّ المطلوبِ مرّتَين","pruef"),
 ("die Musterlösung","الحلُّ النموذجي","die","die Musterlösungen","Die Musterlösung steht am Ende.","الحلُّ النموذجيُّ في الآخر","pruef"),
 ("die Bewertungskriterien","معاييرُ التقييم","die","","Die Bewertungskriterien sind öffentlich.","معاييرُ التقييمِ معلَنة","pruef"),
 ("die Punktzahl erreichen","يبلغُ العلامة","","","Ich habe die nötige Punktzahl erreicht.","بلغتُ العلامةَ المطلوبة","pruef"),
 ("die Prüfung wiederholen","يعيدُ الامتحان","","","Man darf die Prüfung zweimal wiederholen.","يجوزُ إعادةُ الامتحانِ مرّتَين","pruef"),
 ("das Zertifikat","الشهادةُ المعتمَدة","das","die Zertifikate","Das Zertifikat gilt unbegrenzt.","الشهادةُ صالحةٌ بلا حد","pruef"),
 ("der Prüfungsstress","توتُّرُ الامتحان","der","","Prüfungsstress lähmt manchmal.","توتُّرُ الامتحانِ يشلُّ أحياناً","pruef"),
 ("die Lernstrategie","استراتيجيةُ التعلُّم","die","die Lernstrategien","Jede Lernstrategie braucht Geduld.","كلُّ استراتيجيةٍ تحتاجُ صبراً","pruef"),
 ("das Lernziel formulieren","يصوغُ هدفاً تعلُّمياً","","","Formuliere ein klares Lernziel.","صُغْ هدفاً تعلُّمياً واضحاً","pruef"),
 ("die Selbsteinschätzung","التقييمُ الذاتي","die","","Die Selbsteinschätzung ist oft zu streng.","التقييمُ الذاتيُّ صارمٌ غالباً","pruef"),
 ("der Lernfortschritt messen","يقيسُ التقدُّم","","","Ich messe meinen Lernfortschritt wöchentlich.","أقيسُ تقدُّمي أسبوعياً","pruef"),
 ("zunächst","بادئَ الأمر","","","Zunächst sammle ich Ideen.","بادئَ الأمرِ أجمعُ الأفكار","text1"),
 ("anschließend","ثمَّ بعدَ ذلك","","","Anschließend schreibe ich den Entwurf.","ثمَّ أكتبُ المسوَّدة","text1"),
 ("abschließend","وختاماً","","","Abschließend fasse ich zusammen.","وختاماً أُلخِّص","text1"),
 ("einleitend","استهلالاً","","","Einleitend nenne ich das Thema.","استهلالاً أذكرُ الموضوع","text1"),
 ("hierbei","وفي هذا السياق","","","Hierbei ist die Frist wichtig.","وفي هذا السياقِ المهلةُ مهمّة","text1"),
 ("dabei","في الوقتِ ذاته","","","Dabei darf man die Kosten nicht vergessen.","وفي الوقتِ ذاتِهِ لا تُنسى التكاليف","text1"),
 ("darüber hinaus","فضلاً عن ذلك","","","Darüber hinaus fehlt das Personal.","فضلاً عن ذلك ينقصُ الموظفون","text1"),
 ("im Gegenzug","في المقابل","","","Im Gegenzug bekommt er mehr Urlaub.","في المقابلِ يحصلُ على إجازةٍ أطول","text1"),
 ("erstens","أوّلاً","","","Erstens ist es teuer, zweitens langsam.","أوّلاً غالٍ، ثانياً بطيء","text1"),
 ("zweitens","ثانياً","","","Zweitens fehlt die Erfahrung.","ثانياً تنقصُ الخبرة","text1"),
 ("letztlich","في نهايةِ الأمر","","","Letztlich zählt das Ergebnis.","في نهايةِ الأمرِ تهمُّ النتيجة","text1"),
 ("sich bemühen um","يسعى إلى","","","Ich bemühe mich um einen Platz.","أسعى إلى مقعد","refl"),
 ("sich erkundigen nach","يستفسرُ عن","","","Ich erkundige mich nach dem Preis.","أستفسرُ عن السعر","refl"),
 ("sich bewerben um","يترشَّحُ لـ","","","Sie bewirbt sich um ein Stipendium.","تترشَّحُ لمنحة","refl"),
 ("sich einigen auf","يتّفقانِ على","","","Wir haben uns auf einen Termin geeinigt.","اتّفقنا على موعد","refl"),
 ("sich verlassen können auf","يمكنُهُ الاعتمادُ على","","","Auf dich kann man sich verlassen.","يمكنُ الاعتمادُ عليك","refl"),
 ("sich gewöhnen an den Rhythmus","يعتادُ الإيقاع","","","Ich habe mich an den Rhythmus gewöhnt.","اعتدتُ الإيقاع","refl"),
 ("sich Zeit nehmen für","يخصّصُ وقتاً لـ","","","Nimm dir Zeit für die Wiederholung.","خصّصْ وقتاً للمراجعة","refl"),
 ("sich Notizen machen","يدوّنُ ملاحظات","","","Ich mache mir während des Vortrags Notizen.","أدوّنُ ملاحظاتٍ أثناءَ العرض","refl"),
 ("sich etwas merken","يحفظُ شيئاً","","","So merke ich mir neue Wörter.","هكذا أحفظُ كلماتٍ جديدة","refl"),
 ("sich verbessern in","يتحسَّنُ في","","","Ich habe mich im Hören verbessert.","تحسَّنتُ في الاستماع","refl"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vs-b1r-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-pruefung-text-reflexiv"]={"id":"b1-pruefung-text-reflexiv","titleAr":"الامتحان والتعلّم الذاتي · روابط ترتيب النصّ · أفعال انعكاسية","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
