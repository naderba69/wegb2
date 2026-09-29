#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ التاسعةَ عشرة: B1 — سوقُ الشغلِ العمليّ · المرورُ والسيارة · أفعالٌ بادئتُها تغيّرُ المعنى."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Stellenanzeige","إعلانُ الوظيفة","die","die Stellenanzeigen","Die Stellenanzeige steht online.","إعلانُ الوظيفةِ على الإنترنت","job"),
 ("das Anforderungsprofil","مواصفاتُ الوظيفة","das","die Anforderungsprofile","Ich erfülle das Anforderungsprofil.","أستوفي مواصفاتِ الوظيفة","job"),
 ("die Einstellung","التعيين","die","die Einstellungen","Die Einstellung erfolgt zum ersten März.","التعيينُ في أوّلِ مارس","job"),
 ("das Arbeitsverhältnis","علاقةُ العمل","das","die Arbeitsverhältnisse","Das Arbeitsverhältnis ist unbefristet.","علاقةُ العملِ غيرُ محدَّدةِ المدّة","job"),
 ("unbefristet","غيرُ محدَّدِ المدّة","","","Ich habe einen unbefristeten Vertrag.","لديَّ عقدٌ غيرُ محدَّدِ المدّة","job"),
 ("die Gehaltsvorstellung","الراتبُ المتوقَّع","die","die Gehaltsvorstellungen","Nennen Sie Ihre Gehaltsvorstellung.","اذكرْ راتبَكَ المتوقَّع","job"),
 ("die Einarbeitungszeit","فترةُ التأهيل","die","","Die Einarbeitungszeit beträgt vier Wochen.","فترةُ التأهيلِ أربعةُ أسابيع","job"),
 ("die Fortbildung finanzieren","يموّلُ التكوين","","","Der Betrieb finanziert die Fortbildung.","المنشأةُ تموّلُ التكوين","job"),
 ("die Arbeitszeiterfassung","تسجيلُ ساعاتِ العمل","die","","Die Arbeitszeiterfassung ist digital.","تسجيلُ الساعاتِ رقمي","job"),
 ("der Gleitzeitrahmen","نطاقُ الدوامِ المرن","der","","Wir haben einen großen Gleitzeitrahmen.","لدينا نطاقُ دوامٍ مرنٌ واسع","job"),
 ("die Urlaubssperre","منعُ الإجازات","die","","Im Dezember gilt eine Urlaubssperre.","في ديسمبرَ تُمنَعُ الإجازات","job"),
 ("die Abmahnung","الإنذارُ الوظيفي","die","die Abmahnungen","Nach zwei Abmahnungen droht die Kündigung.","بعدَ إنذارَينِ يلوحُ الفصل","job"),
 ("der Betriebsausflug","رحلةُ المنشأة","der","die Betriebsausflüge","Der Betriebsausflug ist freiwillig.","رحلةُ المنشأةِ طوعية","job"),
 ("die Führerscheinprüfung","امتحانُ رخصةِ السياقة","die","die Führerscheinprüfungen","Die Führerscheinprüfung war schwer.","كانَ امتحانُ الرخصةِ صعباً","auto"),
 ("die Fahrstunde","حصّةُ السياقة","die","die Fahrstunden","Eine Fahrstunde kostet fünfzig Euro.","حصّةُ السياقةِ بخمسينَ يورو","auto"),
 ("die Verkehrsregel","قاعدةُ المرور","die","die Verkehrsregeln","Verkehrsregeln gelten für alle.","قواعدُ المرورِ للجميع","auto"),
 ("die Geschwindigkeitsbegrenzung","تحديدُ السرعة","die","die Geschwindigkeitsbegrenzungen","Hier gilt eine Geschwindigkeitsbegrenzung.","هنا تحديدُ سرعة","auto"),
 ("das Bußgeld","الغرامةُ المرورية","das","die Bußgelder","Das Bußgeld beträgt achtzig Euro.","الغرامةُ ثمانونَ يورو","auto"),
 ("der Punkt in Flensburg","النقطةُ السوداء","der","","Dafür gibt es einen Punkt in Flensburg.","على ذلك نقطةٌ في السجل","auto"),
 ("die Hauptuntersuchung","الفحصُ الفنّي الدوري","die","","Die Hauptuntersuchung ist alle zwei Jahre.","الفحصُ الدوريُّ كلَّ سنتَين","auto"),
 ("die Werkstatt beauftragen","يكلّفُ الورشة","","","Ich beauftrage die Werkstatt mit der Reparatur.","أكلّفُ الورشةَ بالتصليح","auto"),
 ("der Kostenvoranschlag einholen","يطلبُ تقديرَ كلفة","","","Ich hole einen Kostenvoranschlag ein.","أطلبُ تقديرَ كلفة","auto"),
 ("die Panne","العطلُ على الطريق","die","die Pannen","Wir hatten eine Panne auf der Autobahn.","تعطَّلنا على الطريقِ السريع","auto"),
 ("der Abschleppdienst","خدمةُ السحب","der","die Abschleppdienste","Der Abschleppdienst kam nach einer Stunde.","جاءت خدمةُ السحبِ بعدَ ساعة","auto"),
 ("die Versicherung melden","يبلّغُ التأمين","","","Den Schaden muss man der Versicherung melden.","يجبُ إبلاغُ التأمينِ بالضرر","auto"),
 ("beschreiben","يصف","","","Beschreib bitte den Unfall genau.","صِفِ الحادثَ بدقة","praefix"),
 ("verschreiben","يصفُ دواءً","","","Der Arzt hat mir Tabletten verschrieben.","وصفَ لي الطبيبُ حبوباً","praefix"),
 ("aufschreiben","يدوّن","","","Schreib dir die Adresse auf.","دوّنِ العنوان","praefix"),
 ("unterschreiben lassen","يجعلُهُ يوقّع","","","Ich lasse den Vertrag unterschreiben.","أجعلُهم يوقّعونَ العقد","praefix"),
 ("zuschreiben","يَنسِبُ إلى","","","Man schreibt ihm den Erfolg zu.","يُنسَبُ إليهِ النجاح","praefix"),
 ("bestehen bleiben","يبقى قائماً","","","Das Problem bleibt bestehen.","المشكلةُ تبقى قائمة","praefix"),
 ("entstehen","ينشأ","","","Dabei entstehen zusätzliche Kosten.","تنشأُ بذلك تكاليفُ إضافية","praefix"),
 ("verstehen sich","يتفاهمان","","","Die beiden verstehen sich gut.","الاثنانِ يتفاهمانِ جيداً","praefix"),
 ("gestehen","يعترف","","","Er gestand den Fehler.","اعترفَ بالخطأ","praefix"),
 ("widerstehen","يقاوم","","","Ich konnte dem Angebot nicht widerstehen.","لم أستطعْ مقاومةَ العرض","praefix"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vp-b1u-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-job-auto-praefix"]={"id":"b1-job-auto-praefix","titleAr":"سوق الشغل العملي · المرور والسيارة · بوادئ الأفعال","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
