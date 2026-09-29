#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ العشرون: B1 — المالُ والتأمينُ المتقدّم · التطوُّعُ والمجتمعُ المحلّي · صفاتٌ من أفعال."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Haftpflichtversicherung","تأمينُ المسؤوليةِ المدنية","die","","Eine Haftpflichtversicherung ist fast Pflicht.","تأمينُ المسؤوليةِ شبهُ إلزامي","geld2"),
 ("die Selbstbeteiligung tragen","يتحمَّلُ الجزءَ الذاتي","","","Ich trage hundert Euro Selbstbeteiligung.","أتحمَّلُ مئةَ يورو","geld2"),
 ("den Schaden regulieren","يسوّي الضرر","","","Die Versicherung reguliert den Schaden.","التأمينُ يسوّي الضرر","geld2"),
 ("die Police","وثيقةُ التأمين","die","die Policen","Die Police liegt im Ordner.","الوثيقةُ في المصنّف","geld2"),
 ("der Beitragssatz","نسبةُ الاشتراك","der","die Beitragssätze","Der Beitragssatz steigt leicht.","نسبةُ الاشتراكِ ترتفعُ قليلاً","geld2"),
 ("die Beitragsrückerstattung","استردادُ الاشتراك","die","","Es gibt eine Beitragsrückerstattung.","هناكَ استردادٌ للاشتراك","geld2"),
 ("die Altersvorsorge","الادّخارُ للتقاعد","die","","Altersvorsorge beginnt früh.","الادّخارُ للتقاعدِ يبدأُ باكراً","geld2"),
 ("das Sparziel","هدفُ الادّخار","das","die Sparziele","Mein Sparziel sind dreitausend Euro.","هدفُ ادّخاري ثلاثةُ آلافِ يورو","geld2"),
 ("den Dauerauftrag einrichten","ينشئُ أمرَ دفعٍ دائماً","","","Ich richte einen Dauerauftrag ein.","أُنشِئُ أمرَ دفعٍ دائم","geld2"),
 ("die Lastschrift","الخصمُ المباشر","die","die Lastschriften","Die Miete geht per Lastschrift ab.","الإيجارُ يُخصَمُ مباشرةً","geld2"),
 ("den Betrag zurückbuchen","يستردُّ المبلغَ بنكياً","","","Man kann den Betrag zurückbuchen lassen.","يمكنُ استردادُ المبلغِ بنكياً","geld2"),
 ("die Kontoführungsgebühr","رسمُ إدارةِ الحساب","die","die Kontoführungsgebühren","Die Kontoführungsgebühr entfällt.","رسمُ إدارةِ الحسابِ ملغى","geld2"),
 ("die Freiwilligenarbeit","العملُ التطوّعي","die","","Freiwilligenarbeit verbindet Menschen.","العملُ التطوّعيُّ يجمعُ الناس","gem"),
 ("die Initiative ergreifen","يبادر","","","Sie hat die Initiative ergriffen.","بادرَت هي","gem"),
 ("die Mitgliederversammlung","الجمعُ العام","die","die Mitgliederversammlungen","Die Mitgliederversammlung ist im April.","الجمعُ العامُّ في أبريل","gem"),
 ("der Vorstand","الهيئةُ المديرة","der","die Vorstände","Der Vorstand wird neu gewählt.","تُنتخَبُ الهيئةُ المديرةُ من جديد","gem"),
 ("der Beitrag zum Verein","اشتراكُ الجمعية","der","","Der Beitrag zum Verein ist niedrig.","اشتراكُ الجمعيةِ زهيد","gem"),
 ("die Spende","التبرُّع","die","die Spenden","Die Spende ist steuerlich absetzbar.","التبرُّعُ يُخصَمُ ضريبياً","gem"),
 ("spenden","يتبرَّع","","","Viele spenden regelmäßig.","كثيرونَ يتبرَّعونَ بانتظام","gem"),
 ("die Hilfsbereitschaft","استعدادُ المساعدة","die","","Die Hilfsbereitschaft war groß.","كانَ استعدادُ المساعدةِ كبيراً","gem"),
 ("das Anliegen","المطلب / الشاغل","das","die Anliegen","Was ist Ihr Anliegen?","ما مطلبُك؟","gem"),
 ("sich einsetzen für","يناضلُ من أجل","","","Sie setzt sich für Kinder ein.","تناضلُ من أجلِ الأطفال","gem"),
 ("die Petition unterschreiben","يوقّعُ عريضة","","","Ich habe die Petition unterschrieben.","وقَّعتُ العريضة","gem"),
 ("die Versammlung leiten","يرأسُ الاجتماع","","","Wer leitet die Versammlung?","مَن يرأسُ الاجتماع؟","gem"),
 ("das Protokoll genehmigen","يصادقُ على المحضر","","","Das Protokoll wurde genehmigt.","صودِقَ على المحضر","gem"),
 ("überzeugt","مقتنع","","","Ich bin davon überzeugt.","أنا مقتنعٌ بذلك","adj2"),
 ("enttäuschend","مخيِّبٌ للأمل","","","Das Ergebnis war enttäuschend.","كانتِ النتيجةُ مخيِّبة","adj2"),
 ("beeindruckend","مُبهِر","","","Die Leistung war beeindruckend.","كانَ الأداءُ مُبهِراً","adj2"),
 ("anstrengend","مُرهِق","","","Der Tag war anstrengend.","كانَ اليومُ مُرهِقاً","adj2"),
 ("erholsam","مريحٌ مُجدِّد","","","Der Urlaub war erholsam.","كانتِ الإجازةُ مريحة","adj2"),
 ("aufregend","مثيرٌ للحماس","","","Das war ein aufregender Tag.","كانَ يوماً مثيراً","adj2"),
 ("beruhigend","مطمئِن","","","Deine Nachricht war beruhigend.","كانت رسالتُكَ مطمئِنة","adj2"),
 ("entscheidend","حاسم","","","Das war der entscheidende Punkt.","كانت تلكَ النقطةَ الحاسمة","adj2"),
 ("ausreichend","كافٍ","","","Die Zeit war ausreichend.","كانَ الوقتُ كافياً","adj2"),
 ("zutreffend","منطبق","","","Diese Aussage ist zutreffend.","هذه الإفادةُ منطبقة","adj2"),
 ("betroffen","متضرِّر / متأثِّر","","","Viele Familien sind betroffen.","أُسَرٌ كثيرةٌ متضرِّرة","adj2"),
 ("zuständig für","مختصٌّ بـ","","","Ich bin für den Einkauf zuständig.","أنا مختصٌّ بالشراء","adj2"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vq-b1t-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-geld-gemeinschaft-adj"]={"id":"b1-geld-gemeinschaft-adj","titleAr":"التأمين والمال المتقدّم · الجمعيات والتطوّع · صفات من أفعال","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
