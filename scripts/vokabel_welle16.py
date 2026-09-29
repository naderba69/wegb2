#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ السادسةَ عشرة: B1 — العلمُ والتقنيةُ اليومية · الوقتُ والتنظيمُ الذاتي · أفعالُ الحركةِ المجازية."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Forschung","البحثُ العلمي","die","","Die Forschung braucht Geld und Zeit.","البحثُ يحتاجُ مالاً ووقتاً","wiss"),
 ("die Untersuchung durchführen","يُجري دراسة","","","Man hat eine Untersuchung durchgeführt.","أُجرِيت دراسة","wiss"),
 ("das Experiment","التجربة","das","die Experimente","Das Experiment wurde wiederholt.","أُعيدتِ التجربة","wiss"),
 ("die Erkenntnis","المعرفةُ المستخلَصة","die","die Erkenntnisse","Die neue Erkenntnis überrascht.","المعرفةُ الجديدةُ مفاجِئة","wiss"),
 ("beweisen","يبرهن","","","Das lässt sich nicht beweisen.","لا يمكنُ البرهنةُ على ذلك","wiss"),
 ("die Vermutung","الظنّ","die","die Vermutungen","Das ist nur eine Vermutung.","هذا مجرَّدُ ظن","wiss"),
 ("der Zusammenhang","الترابط","der","die Zusammenhänge","Es gibt einen klaren Zusammenhang.","ثمّةَ ترابطٌ واضح","wiss"),
 ("die Ursache","السبب","die","die Ursachen","Die Ursache ist bekannt.","السببُ معروف","wiss"),
 ("die Wirkung zeigen","يُظهِرُ أثراً","","","Die Maßnahme zeigt Wirkung.","الإجراءُ يُظهِرُ أثراً","wiss"),
 ("die Entwicklung verfolgen","يتابعُ التطوُّر","","","Ich verfolge die Entwicklung genau.","أتابعُ التطوُّرَ بدقة","wiss"),
 ("der Fortschritt in der Technik","التقدُّمُ التقني","der","","Der Fortschritt in der Technik ist rasant.","التقدُّمُ التقنيُّ سريعٌ جداً","wiss"),
 ("künstliche Intelligenz","الذكاءُ الاصطناعي","","","Künstliche Intelligenz verändert Berufe.","الذكاءُ الاصطناعيُّ يغيّرُ المهن","wiss"),
 ("die Maschine ersetzt","الآلةُ تحلُّ محلّ","","","Die Maschine ersetzt einfache Arbeit.","الآلةُ تحلُّ محلَّ العملِ البسيط","wiss"),
 ("die Bedienungsanleitung","دليلُ الاستعمال","die","die Bedienungsanleitungen","Lies zuerst die Bedienungsanleitung.","اقرأْ دليلَ الاستعمالِ أوّلاً","wiss"),
 ("die Garantie verlängern","يمدّدُ الضمان","","","Man kann die Garantie verlängern.","يمكنُ تمديدُ الضمان","wiss"),
 ("die Zeit einteilen","يوزّعُ وقتَه","","","Ich teile mir die Zeit besser ein.","أوزّعُ وقتي أفضل","zeit1"),
 ("die Prioritäten setzen","يرتّبُ الأولويات","","","Zuerst setze ich Prioritäten.","أوّلاً أرتّبُ الأولويات","zeit1"),
 ("den Überblick behalten","يحتفظُ بالصورةِ العامة","","","So behalte ich den Überblick.","هكذا أحتفظُ بالصورةِ العامة","zeit1"),
 ("in Verzug geraten","يتأخَّرُ عن الجدول","","","Wir sind in Verzug geraten.","تأخَّرنا عن الجدول","zeit1"),
 ("aufschieben","يسوّف","","","Ich schiebe unangenehme Aufgaben auf.","أسوّفُ المهامَّ المزعجة","zeit1"),
 ("sich ablenken lassen","يدعُ نفسَهُ تتشتَّت","","","Ich lasse mich leicht ablenken.","أتشتَّتُ بسهولة","zeit1"),
 ("konzentriert bleiben","يبقى مركّزاً","","","Vierzig Minuten bleibe ich konzentriert.","أبقى مركّزاً أربعينَ دقيقة","zeit1"),
 ("die Pause einplanen","يبرمجُ استراحة","","","Plane feste Pausen ein.","برمجْ استراحاتٍ ثابتة","zeit1"),
 ("die Gewohnheit aufbauen","يبني عادة","","","Eine Gewohnheit baut man in Wochen auf.","العادةُ تُبنى في أسابيع","zeit1"),
 ("den Anfang machen","يبدأُ بالخطوةِ الأولى","","","Das Schwerste ist, den Anfang zu machen.","الأصعبُ هو البدء","zeit1"),
 ("dranbleiben trotz Rückschlag","يواظبُ رغمَ الانتكاسة","","","Wichtig ist, trotz Rückschlag dranzubleiben.","المهمُّ المواظبةُ رغمَ الانتكاسة","zeit1"),
 ("der Rückschlag","الانتكاسة","der","die Rückschläge","Nach dem Rückschlag ging es weiter.","بعدَ الانتكاسةِ استمرَّ الأمر","zeit1"),
 ("etwas in Angriff nehmen","يشرعُ في أمر","","","Morgen nehme ich das Projekt in Angriff.","غداً أشرعُ في المشروع","bew"),
 ("auf etwas hinauslaufen","ينتهي الأمرُ إلى","","","Das läuft auf eine Absage hinaus.","ينتهي الأمرُ إلى رفض","bew"),
 ("hinter etwas stehen","يقفُ خلفَ أمرٍ مؤيِّداً","","","Ich stehe hinter dieser Entscheidung.","أقفُ خلفَ هذا القرار","bew"),
 ("auf jemanden zugehen","يبادرُ بالتقرُّب","","","Geh einfach auf sie zu.","بادرْ بالتقرُّبِ إليها","bew"),
 ("aus dem Weg gehen","يتحاشى","","","Er geht dem Streit aus dem Weg.","يتحاشى النزاع","bew"),
 ("den Faden verlieren","يفقدُ خيطَ الكلام","","","Mitten im Vortrag verlor ich den Faden.","في وسطِ العرضِ فقدتُ الخيط","bew"),
 ("ins Stocken geraten","يتعثَّر","","","Die Verhandlung geriet ins Stocken.","تعثَّرتِ المفاوضة","bew"),
 ("auf dem Laufenden bleiben","يبقى مطَّلِعاً","","","Ich bleibe auf dem Laufenden.","أبقى مطَّلِعاً","bew"),
 ("unter einen Hut bringen","يوفّقُ بينَ أمورٍ عدّة","","","Familie und Beruf unter einen Hut zu bringen ist schwer.","التوفيقُ بينَ الأسرةِ والعملِ صعب","bew"),
 ("den Überblick verlieren","يفقدُ الصورةَ العامة","","","Bei so vielen Terminen verliere ich den Überblick.","بكلِّ هذه المواعيدِ أفقدُ الصورة","bew"),
 ("zur Sprache kommen","يُطرَحُ للنقاش","","","Das Thema kam gestern zur Sprache.","طُرِحَ الموضوعُ أمس","bew"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vm-b1z-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-wissen-zeit-wendungen"]={"id":"b1-wissen-zeit-wendungen","titleAr":"العلم والتقنية · تنظيم الوقت · التعابير الاصطلاحية","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
