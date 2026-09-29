#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الحاديةُ والعشرون: B1 — الرقمنةُ والخصوصية · التسوّقُ والاستهلاك · أسماءٌ من أفعال."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Digitalisierung im Alltag","الرقمنةُ في الحياةِ اليومية","die","","Die Digitalisierung im Alltag geht schnell.","الرقمنةُ اليوميةُ تمضي سريعاً","dig2"),
 ("die Online-Banking-App","تطبيقُ البنكِ الإلكتروني","die","","Die Online-Banking-App ist sicher.","تطبيقُ البنكِ آمن","dig2"),
 ("die Zwei-Faktor-Authentifizierung","التحقُّقُ بخطوتَين","die","","Die Zwei-Faktor-Authentifizierung schützt das Konto.","التحقُّقُ بخطوتَينِ يحمي الحساب","dig2"),
 ("das Passwort ändern","يغيّرُ كلمةَ المرور","","","Ändere dein Passwort regelmäßig.","غيّرْ كلمةَ مرورِكَ بانتظام","dig2"),
 ("der Betrugsversuch","محاولةُ احتيال","der","die Betrugsversuche","Das war ein Betrugsversuch per Mail.","كانت محاولةَ احتيالٍ بالبريد","dig2"),
 ("die Phishing-Mail","بريدُ التصيُّد","die","die Phishing-Mails","Öffne keine Phishing-Mails.","لا تفتحْ بريدَ التصيُّد","dig2"),
 ("die Datenschutzerklärung","بيانُ حمايةِ البيانات","die","","Die Datenschutzerklärung liest kaum jemand.","قلَّما يقرأُ أحدٌ بيانَ الحماية","dig2"),
 ("die Einwilligung","الموافقةُ الصريحة","die","die Einwilligungen","Ohne Einwilligung geht das nicht.","بلا موافقةٍ لا يجوز","dig2"),
 ("die Cookies ablehnen","يرفضُ الكوكيز","","","Ich lehne unnötige Cookies ab.","أرفضُ الكوكيزَ غيرَ الضرورية","dig2"),
 ("das Konto sperren lassen","يوقفُ الحساب","","","Ich habe die Karte sperren lassen.","أوقفتُ البطاقة","dig2"),
 ("der digitale Nachlass","التركةُ الرقمية","der","","Auch der digitale Nachlass will geregelt sein.","حتى التركةُ الرقميةُ تحتاجُ تنظيماً","dig2"),
 ("die Videosprechstunde","الاستشارةُ المرئية","die","die Videosprechstunden","Die Videosprechstunde spart Wege.","الاستشارةُ المرئيةُ توفّرُ التنقُّل","dig2"),
 ("die Bewertung abgeben","يترُكُ تقييماً","","","Ich gebe eine ehrliche Bewertung ab.","أتركُ تقييماً صادقاً","kauf"),
 ("der Testbericht","تقريرُ الاختبار","der","die Testberichte","Lies vorher den Testbericht.","اقرأْ تقريرَ الاختبارِ أوّلاً","kauf"),
 ("die Verfügbarkeit prüfen","يتحقَّقُ من التوفُّر","","","Prüfe zuerst die Verfügbarkeit.","تحقَّقْ من التوفُّرِ أوّلاً","kauf"),
 ("die Lieferzeit","مدّةُ التوصيل","die","die Lieferzeiten","Die Lieferzeit beträgt drei Tage.","مدّةُ التوصيلِ ثلاثةُ أيام","kauf"),
 ("die Sendung verfolgen","يتتبَّعُ الشحنة","","","Man kann die Sendung online verfolgen.","يمكنُ تتبُّعُ الشحنةِ إلكترونياً","kauf"),
 ("die Retoure","الإرجاعُ البريدي","die","die Retouren","Die Retoure ist kostenlos.","الإرجاعُ مجاني","kauf"),
 ("das Etikett","البطاقةُ اللاصقة","das","die Etiketten","Das Etikett klebt auf dem Paket.","البطاقةُ ملصقةٌ على الطرد","kauf"),
 ("die Ware beanstanden","يعترضُ على البضاعة","","","Ich beanstande die beschädigte Ware.","أعترضُ على البضاعةِ التالفة","kauf"),
 ("beschädigt","تالف","","","Das Gerät kam beschädigt an.","وصلَ الجهازُ تالفاً","kauf"),
 ("der Ersatzteil","قطعةُ الغيار","der","die Ersatzteile","Ersatzteile sind teuer geworden.","صارت قطعُ الغيارِ غالية","kauf"),
 ("die Reparatur lohnt sich nicht","التصليحُ غيرُ مجدٍ","","","Die Reparatur lohnt sich nicht mehr.","لم يعدِ التصليحُ مجدياً","kauf"),
 ("die Nachhaltigkeit beachten","يراعي الاستدامة","","","Beim Kauf beachte ich die Nachhaltigkeit.","عندَ الشراءِ أراعي الاستدامة","kauf"),
 ("die Entscheidung treffen müssen","يضطرُّ لاتّخاذِ قرار","","","Irgendwann muss man eine Entscheidung treffen.","في وقتٍ ما يجبُ اتّخاذُ قرار","subst"),
 ("die Durchführung","التنفيذُ العملي","die","","Die Durchführung beginnt nächste Woche.","التنفيذُ يبدأُ الأسبوعَ القادم","subst"),
 ("die Verbesserung","التحسين","die","die Verbesserungen","Wir schlagen Verbesserungen vor.","نقترحُ تحسينات","subst"),
 ("die Erhöhung","الزيادة","die","die Erhöhungen","Die Erhöhung tritt im Januar in Kraft.","الزيادةُ تسري في يناير","subst"),
 ("die Senkung","الخفض","die","die Senkungen","Eine Senkung der Kosten ist nötig.","خفضُ التكاليفِ ضروري","subst"),
 ("die Verzögerung","التأخير","die","die Verzögerungen","Es kam zu einer Verzögerung.","حدثَ تأخير","subst"),
 ("die Erweiterung","التوسيع","die","die Erweiterungen","Die Erweiterung ist geplant.","التوسيعُ مخطَّطٌ له","subst"),
 ("die Kürzung","التقليص","die","die Kürzungen","Kürzungen treffen die Schwächsten.","التقليصاتُ تصيبُ الأضعف","subst"),
 ("die Umstellung","التحويلُ إلى نظامٍ آخر","die","die Umstellungen","Die Umstellung dauert Monate.","التحويلُ يستغرقُ أشهراً","subst"),
 ("die Abstimmung","التنسيق / التصويت","die","die Abstimmungen","Nach der Abstimmung war es klar.","بعدَ التصويتِ اتّضحَ الأمر","subst"),
 ("die Fortsetzung","المتابعة / التتمّة","die","die Fortsetzungen","Die Fortsetzung folgt morgen.","التتمّةُ غداً","subst"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vr-b1s-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-digital-kauf-nomen"]={"id":"b1-digital-kauf-nomen","titleAr":"الرقمنة والخصوصية · التسوّق والإرجاع · أسماء من أفعال","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
