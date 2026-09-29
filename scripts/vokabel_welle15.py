#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الخامسةَ عشرة: B1 — الرسائلُ الرسميةُ والتظلُّم · الاقتصادُ اليوميُّ · صفاتُ الحكمِ والتقويم."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("das Anschreiben formulieren","يصوغُ رسالةَ التقديم","","","Ich formuliere das Anschreiben neu.","أُعيدُ صياغةَ رسالةِ التقديم","brief"),
 ("Bezug nehmend auf","بالإشارةِ إلى","","","Bezug nehmend auf Ihr Schreiben vom 3. Mai …","بالإشارةِ إلى كتابِكم في 3 مايو…","brief"),
 ("hiermit teile ich Ihnen mit","أُعلِمُكم بهذا","","","Hiermit teile ich Ihnen meine neue Adresse mit.","أُعلِمُكم بهذا بعنواني الجديد","brief"),
 ("im Anhang finden Sie","تجدونَ في المرفق","","","Im Anhang finden Sie die Unterlagen.","تجدونَ الوثائقَ في المرفق","brief"),
 ("um Rückmeldung bitten","يطلبُ رداً","","","Ich bitte um kurze Rückmeldung.","أرجو رداً قصيراً","brief"),
 ("die Bearbeitung beschleunigen","يسرّعُ المعالجة","","","Könnten Sie die Bearbeitung beschleunigen?","أيمكنكم تسريعُ المعالجة؟","brief"),
 ("eine Frist einräumen","يمنحُ مهلة","","","Man hat mir eine Frist eingeräumt.","مُنِحتُ مهلة","brief"),
 ("Widerspruch einlegen gegen","يتظلَّمُ ضدّ","","","Ich lege Widerspruch gegen den Bescheid ein.","أتظلَّمُ ضدَّ القرار","brief"),
 ("die Begründung nachreichen","يستكملُ التعليل","","","Die Begründung reiche ich nach.","أستكملُ التعليلَ لاحقاً","brief"),
 ("die Bestätigung erhalten","يتلقّى التأكيد","","","Ich habe die Bestätigung erhalten.","تلقَّيتُ التأكيد","brief"),
 ("verbleiben mit freundlichen Grüßen","وتفضَّلوا بقبولِ التحيات","","","Ich verbleibe mit freundlichen Grüßen.","وتفضَّلوا بقبولِ فائقِ التحيات","brief"),
 ("das Schreiben aufsetzen","يحرّرُ كتاباً","","","Ich setze das Schreiben heute auf.","أحرّرُ الكتابَ اليوم","brief"),
 ("die Kündigung bestätigen","يؤكّدُ الإنهاء","","","Bitte bestätigen Sie die Kündigung schriftlich.","أكّدوا الإنهاءَ كتابةً","brief"),
 ("das Konto auflösen","يغلقُ الحساب","","","Ich möchte mein Konto auflösen.","أودُّ إغلاقَ حسابي","wirt"),
 ("der Vertrag läuft aus","العقدُ ينتهي","","","Mein Vertrag läuft im Juni aus.","عقدي ينتهي في يونيو","wirt"),
 ("die Preiserhöhung","رفعُ الأسعار","die","die Preiserhöhungen","Die Preiserhöhung kam ohne Vorwarnung.","جاءَ رفعُ الأسعارِ بلا إنذار","wirt"),
 ("die Kaufkraft","القدرةُ الشرائية","die","","Die Kaufkraft sinkt.","القدرةُ الشرائيةُ تنخفض","wirt"),
 ("das Angebot einholen","يستقدمُ عرضَ سعر","","","Ich hole drei Angebote ein.","أستقدمُ ثلاثةَ عروض","wirt"),
 ("der Kostenvoranschlag","تقديرُ الكلفة","der","die Kostenvoranschläge","Der Kostenvoranschlag ist unverbindlich.","تقديرُ الكلفةِ غيرُ مُلزِم","wirt"),
 ("die Anschaffung","الاقتناء","die","die Anschaffungen","Die Anschaffung lohnt sich langfristig.","الاقتناءُ مجدٍ على المدى الطويل","wirt"),
 ("sich rentieren","يكونُ مربحاً","","","Die Solaranlage rentiert sich nach acht Jahren.","المنظومةُ الشمسيةُ تُربِحُ بعدَ ثماني سنوات","wirt"),
 ("die Rücklage bilden","يكوّنُ احتياطياً","","","Man sollte eine Rücklage bilden.","ينبغي تكوينُ احتياطي","wirt"),
 ("der Verbrauch senken","يخفضُ الاستهلاك","","","Wir senken den Verbrauch um zehn Prozent.","نخفضُ الاستهلاكَ عشرةَ بالمئة","wirt"),
 ("die Nebenkosten abrechnen","يحاسبُ على التكاليف","","","Die Nebenkosten werden jährlich abgerechnet.","التكاليفُ الجانبيةُ تُحاسَبُ سنوياً","wirt"),
 ("die Rechnung anfechten","يعترضُ على الفاتورة","","","Ich fechte die Rechnung an.","أعترضُ على الفاتورة","wirt"),
 ("angemessen","مناسبٌ بقدرٍ عادل","","","Der Preis ist angemessen.","السعرُ مناسبٌ عادل","urteil"),
 ("übertrieben","مبالَغٌ فيه","","","Die Kritik war übertrieben.","كانَ النقدُ مبالَغاً فيه","urteil"),
 ("nachvollziehbar","مفهومُ المنطق","","","Deine Reaktion ist nachvollziehbar.","ردُّ فعلِكَ مفهوم","urteil"),
 ("fragwürdig","مشكوكٌ فيه","","","Die Methode ist fragwürdig.","الطريقةُ مشكوكٌ فيها","urteil"),
 ("überzeugend","مُقنِع","","","Sein Vortrag war überzeugend.","كانَ عرضُهُ مقنعاً","urteil"),
 ("umstritten","محلُّ خلاف","","","Die Maßnahme bleibt umstritten.","الإجراءُ يبقى محلَّ خلاف","urteil"),
 ("eindeutig","قاطعٌ لا لبسَ فيه","","","Das Ergebnis ist eindeutig.","النتيجةُ قاطعة","urteil"),
 ("voreilig","متسرِّع","","","Das Urteil war voreilig.","كانَ الحكمُ متسرِّعاً","urteil"),
 ("vertretbar","مقبولٌ يمكنُ الدفاعُ عنه","","","Der Aufwand ist noch vertretbar.","الجهدُ ما زالَ مقبولاً","urteil"),
 ("bedenklich","مقلق","","","Die Entwicklung ist bedenklich.","التطوُّرُ مقلق","urteil"),
 ("erheblich","جسيم","","","Der Schaden ist erheblich.","الضررُ جسيم","urteil"),
 ("geringfügig","طفيف","","","Die Änderung ist geringfügig.","التغييرُ طفيف","urteil"),
 ("vorläufig","مؤقّت","","","Das ist eine vorläufige Lösung.","هذا حلٌّ مؤقّت","urteil"),
 ("endgültig","نهائي","","","Die Entscheidung ist endgültig.","القرارُ نهائي","urteil"),
 ("zwangsläufig","حتميّ","","","Das führt zwangsläufig zu Kosten.","يؤدّي ذلك حتماً إلى تكاليف","urteil"),
 ("beabsichtigt","مقصود","","","Der Effekt war beabsichtigt.","كانَ الأثرُ مقصوداً","urteil"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vl-b1y-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-brief-wirtschaft"]={"id":"b1-brief-wirtschaft","titleAr":"الرسائل الرسمية والتظلّم · الاقتصاد اليومي · صفات الحكم والتقويم","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
