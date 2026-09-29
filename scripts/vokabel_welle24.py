#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الرابعةُ والعشرون: B1 — الإعلامُ والحِجاجُ المتقدّم · الرحلاتُ والطوارئ · أفعالٌ بحروفٍ مزدوجة."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Berichterstattung","التغطيةُ الإخبارية","die","","Die Berichterstattung war einseitig.","كانتِ التغطيةُ أحاديةَ الجانب","med2"),
 ("einseitig","أحاديُّ الجانب","","","Der Artikel ist einseitig.","المقالُ أحاديُّ الجانب","med2"),
 ("ausgewogen","متوازن","","","Wir brauchen ausgewogene Informationen.","نحتاجُ معلوماتٍ متوازنة","med2"),
 ("die Schlagzeile prüfen","يتحقَّقُ من العنوان","","","Prüfe die Schlagzeile, bevor du teilst.","تحقَّقْ من العنوانِ قبلَ المشاركة","med2"),
 ("teilen und kommentieren","يشاركُ ويعلّق","","","Viele teilen, ohne zu lesen.","كثيرونَ يشاركونَ بلا قراءة","med2"),
 ("die Leserzuschrift","رسالةُ القارئ","die","die Leserzuschriften","Die Leserzuschrift wurde gedruckt.","نُشِرت رسالةُ القارئ","med2"),
 ("der Kommentar","المقالُ الرأي","der","die Kommentare","Der Kommentar steht auf Seite zwei.","المقالُ في الصفحةِ الثانية","med2"),
 ("die Gegenposition","الموقفُ المضاد","die","die Gegenpositionen","Man sollte die Gegenposition hören.","ينبغي سماعُ الموقفِ المضاد","med2"),
 ("das Argument entkräften","يُضعِفُ الحجّة","","","Diese Zahl entkräftet sein Argument.","هذا الرقمُ يُضعِفُ حجّتَه","med2"),
 ("zu bedenken geben","يلفتُ إلى اعتبار","","","Ich gebe zu bedenken, dass die Kosten steigen.","ألفتُ إلى أنَّ التكاليفَ ترتفع","med2"),
 ("den Standpunkt untermauern","يدعّمُ الموقف","","","Studien untermauern diesen Standpunkt.","دراساتٌ تدعّمُ هذا الموقف","med2"),
 ("die Verallgemeinerung","التعميم","die","die Verallgemeinerungen","Diese Verallgemeinerung ist unfair.","هذا التعميمُ غيرُ منصف","med2"),
 ("der Einzelfall","الحالةُ الفردية","der","die Einzelfälle","Das ist ein Einzelfall, keine Regel.","هذه حالةٌ فرديةٌ لا قاعدة","med2"),
 ("die Reiserücktrittsversicherung","تأمينُ إلغاءِ السفر","die","","Eine Reiserücktrittsversicherung lohnt sich.","تأمينُ إلغاءِ السفرِ مجدٍ","reise2"),
 ("den Flug umbuchen","يغيّرُ حجزَ الرحلة","","","Ich musste den Flug umbuchen.","اضطُرِرتُ لتغييرِ حجزِ الرحلة","reise2"),
 ("die Verspätung entschädigen","يعوّضُ عن التأخير","","","Die Airline entschädigt die Verspätung.","الشركةُ تعوّضُ عن التأخير","reise2"),
 ("das Gepäck verloren gehen","تضيعُ الأمتعة","","","Mein Gepäck ist verloren gegangen.","ضاعت أمتعتي","reise2"),
 ("die Botschaft kontaktieren","يتّصلُ بالسفارة","","","Im Notfall kontaktiere die Botschaft.","في الطوارئ اتّصلْ بالسفارة","reise2"),
 ("den Pass verlieren","يفقدُ الجواز","","","Wer den Pass verliert, meldet es sofort.","مَن يفقدْ جوازَهُ يبلّغْ فوراً","reise2"),
 ("die Anzeige erstatten","يقدّمُ بلاغاً","","","Ich habe Anzeige erstattet.","قدَّمتُ بلاغاً","reise2"),
 ("die Auslandskrankenversicherung","تأمينُ المرضِ في الخارج","die","","Die Auslandskrankenversicherung ist Pflicht.","تأمينُ المرضِ في الخارجِ إلزامي","reise2"),
 ("der Notfallkontakt","جهةُ الاتصالِ الطارئة","der","die Notfallkontakte","Speichere einen Notfallkontakt.","احفظْ جهةَ اتصالٍ طارئة","reise2"),
 ("sich auskennen mit","يكونُ خبيراً بـ","","","Er kennt sich mit Verträgen aus.","هو خبيرٌ بالعقود","verb2"),
 ("es kommt an auf","العبرةُ بـ","","","Es kommt auf die Vorbereitung an.","العبرةُ بالاستعداد","verb2"),
 ("aufkommen für","يتحمَّلُ نفقةَ","","","Wer kommt für den Schaden auf?","مَن يتحمَّلُ نفقةَ الضرر؟","verb2"),
 ("hinweisen darauf, dass","ينبّهُ إلى أنّ","","","Ich weise darauf hin, dass die Frist endet.","أنبّهُ إلى أنَّ المهلةَ تنتهي","verb2"),
 ("sich auswirken auf die Kosten","ينعكسُ على التكاليف","","","Das wirkt sich auf die Kosten aus.","ينعكسُ ذلك على التكاليف","verb2"),
 ("darauf ankommen lassen","يجازفُ ويترُكُ الأمرَ للحظ","","","Ich will es nicht darauf ankommen lassen.","لا أريدُ المجازفة","verb2"),
 ("sich herausstellen als","يتبيَّنُ أنّه","","","Es stellte sich als Irrtum heraus.","تبيَّنَ أنَّهُ خطأ","verb2"),
 ("zurückgreifen auf","يلجأُ إلى","","","Wir greifen auf Ersparnisse zurück.","نلجأُ إلى المدَّخرات","verb2"),
 ("hinauszögern","يماطلُ في التأجيل","","","Er zögert die Entscheidung hinaus.","يماطلُ في القرار","verb2"),
 ("in Kraft treten","يدخلُ حيّزَ التنفيذ","","","Das Gesetz tritt im Juli in Kraft.","القانونُ يسري في يوليو","verb2"),
 ("zur Folge haben","يترتَّبُ عليه","","","Das hat höhere Kosten zur Folge.","يترتَّبُ عليهِ تكاليفُ أعلى","verb2"),
 ("Abstand halten","يحفظُ المسافة","","","Bitte Abstand halten!","حافظْ على المسافة!","verb2"),
 ("zur Kenntnis nehmen","يحيطُ علماً","","","Ich habe es zur Kenntnis genommen.","أحطتُ علماً بذلك","verb2"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vu-b1p-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-medien-reise-verben"]={"id":"b1-medien-reise-verben","titleAr":"الإعلام والحِجاج · السفر والطوارئ · تعابير فعلية متقدّمة","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
