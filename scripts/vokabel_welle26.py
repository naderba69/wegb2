#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ السادسةُ والعشرون: بلوغُ عتبةِ B1 التراكمية (2400) — التعليمُ المهنيُّ والمالُ والحياةُ اليوميةُ المتقدّمة."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Umschulung","إعادةُ التأهيلِ المهني","die","die Umschulungen","Mit vierzig machte er eine Umschulung.","في الأربعينَ أعادَ تأهيلَه","b1x"),
 ("der Quereinsteiger","المنتقلُ من مجالٍ آخر","der","die Quereinsteiger","Quereinsteiger sind willkommen.","المنتقلونَ من مجالاتٍ أخرى مرحَّبٌ بهم","b1x"),
 ("die Berufserfahrung sammeln","يراكمُ خبرةً مهنية","","","Ich sammle Berufserfahrung im Ausland.","أراكمُ خبرةً مهنيةً في الخارج","b1x"),
 ("die Anerkennung beantragen","يطلبُ معادلةَ الشهادة","","","Ich beantrage die Anerkennung meines Diploms.","أطلبُ معادلةَ شهادتي","b1x"),
 ("die Teilqualifikation","التأهيلُ الجزئي","die","die Teilqualifikationen","Teilqualifikationen helfen beim Einstieg.","التأهيلُ الجزئيُّ يعينُ على الولوج","b1x"),
 ("der Bildungsgutschein","قسيمةُ التكوين","der","die Bildungsgutscheine","Das Amt gab mir einen Bildungsgutschein.","أعطتني الدائرةُ قسيمةَ تكوين","b1x"),
 ("der Praktikumsplatz","مكانُ التربُّص","der","die Praktikumsplätze","Ich suche einen Praktikumsplatz.","أبحثُ عن مكانِ تربُّص","b1x"),
 ("die Bewerbungsmappe","ملفُّ الترشّح","die","die Bewerbungsmappen","Die Bewerbungsmappe ist vollständig.","ملفُّ الترشّحِ مكتمل","b1x"),
 ("der Berufsberater","مستشارُ التوجيهِ المهني","der","die Berufsberater","Der Berufsberater half mir sehr.","ساعدَني مستشارُ التوجيهِ كثيراً","b1x"),
 ("die Arbeitsagentur","وكالةُ التشغيل","die","die Arbeitsagenturen","Die Arbeitsagentur vermittelt Stellen.","وكالةُ التشغيلِ توسّطُ في الوظائف","b1x"),
 ("das Jobcenter","مركزُ التشغيل","das","die Jobcenter","Das Jobcenter zahlt die Miete teilweise.","مركزُ التشغيلِ يدفعُ جزءَ الإيجار","b1x"),
 ("die Eingliederungsvereinbarung","اتفاقُ الإدماج","die","","Die Eingliederungsvereinbarung wird unterschrieben.","يُوقَّعُ اتفاقُ الإدماج","b1x"),
 ("die Meldepflicht","واجبُ الإبلاغ","die","","Es besteht eine Meldepflicht bei Umzug.","ثمّةَ واجبُ إبلاغٍ عندَ الانتقال","b1x"),
 ("die Bedarfsgemeinschaft","الأسرةُ المستحقّة","die","die Bedarfsgemeinschaften","Die Leistung gilt für die Bedarfsgemeinschaft.","الإعانةُ للأسرةِ المستحقّة","b1x"),
 ("der Regelsatz","المبلغُ المعياري","der","die Regelsätze","Der Regelsatz wird jährlich angepasst.","المبلغُ المعياريُّ يُعدَّلُ سنوياً","b1x"),
 ("die Nebentätigkeit","العملُ الجانبي","die","die Nebentätigkeiten","Die Nebentätigkeit muss gemeldet werden.","يجبُ الإبلاغُ عن العملِ الجانبي","b1x"),
 ("der Freibetrag","الحدُّ المعفى","der","die Freibeträge","Bis zum Freibetrag zahlt man keine Steuer.","حتى الحدِّ المعفى لا ضريبة","b1x"),
 ("die Lohnsteuerklasse","فئةُ ضريبةِ الأجر","die","die Lohnsteuerklassen","Nach der Heirat ändert sich die Lohnsteuerklasse.","بعدَ الزواجِ تتغيَّرُ الفئة","b1x"),
 ("die Lohnabrechnung","كشفُ الراتب","die","die Lohnabrechnungen","Prüfe deine Lohnabrechnung monatlich.","افحصْ كشفَ راتبِكَ شهرياً","b1x"),
 ("der Nettolohn","صافي الأجر","der","die Nettolöhne","Vom Bruttolohn bleibt weniger Nettolohn.","من الأجرِ الإجماليِّ يبقى صافٍ أقل","b1x"),
 ("die Sozialabgaben","الاقتطاعاتُ الاجتماعية","die","","Sozialabgaben werden automatisch abgezogen.","الاقتطاعاتُ تُخصَمُ تلقائياً","b1x"),
 ("die Rentenversicherung","تأمينُ التقاعد","die","","Die Rentenversicherung ist Pflicht.","تأمينُ التقاعدِ إلزامي","b1x"),
 ("die Pflegeversicherung","تأمينُ الرعاية","die","","Die Pflegeversicherung zahlt bei Pflegebedarf.","تأمينُ الرعايةِ يدفعُ عندَ الحاجة","b1x"),
 ("der Kinderzuschlag","علاوةُ الأطفال","der","","Den Kinderzuschlag beantragt man online.","علاوةُ الأطفالِ تُطلَبُ إلكترونياً","b1x"),
 ("das Elterngeld","بدلُ الوالدَين","das","","Elterngeld gibt es bis zu vierzehn Monate.","بدلُ الوالدَينِ حتى أربعةَ عشرَ شهراً","b1x"),
 ("der Betreuungsplatz","مقعدُ الحضانة","der","die Betreuungsplätze","Ein Betreuungsplatz ist schwer zu finden.","يصعبُ إيجادُ مقعدِ حضانة","b1x"),
 ("die Anmeldung zur Schule","التسجيلُ في المدرسة","die","","Die Anmeldung zur Schule läuft im Januar.","التسجيلُ المدرسيُّ في يناير","b1x"),
 ("der Schulweg","طريقُ المدرسة","der","die Schulwege","Der Schulweg ist sicher.","طريقُ المدرسةِ آمن","b1x"),
 ("das Ganztagsangebot","برنامجُ اليومِ الكامل","das","die Ganztagsangebote","Das Ganztagsangebot entlastet Eltern.","برنامجُ اليومِ الكاملِ يخفّفُ عن الوالدَين","b1x"),
 ("die Klassenfahrt","الرحلةُ المدرسية","die","die Klassenfahrten","Die Klassenfahrt kostet hundert Euro.","الرحلةُ المدرسيةُ بمئةِ يورو","b1x"),
 ("der Förderunterricht","الدرسُ الداعم","der","","Mein Sohn bekommt Förderunterricht.","ابني يتلقّى درساً داعماً","b1x"),
 ("die Hausaufgabenbetreuung","مرافقةُ الواجبات","die","","Die Hausaufgabenbetreuung ist kostenlos.","مرافقةُ الواجباتِ مجانية","b1x"),
 ("die Mitschrift","التدوينُ في الحصّة","die","die Mitschriften","Ich brauche deine Mitschrift.","أحتاجُ تدوينَك","b1x"),
 ("der Wohnberechtigungsschein","شهادةُ استحقاقِ السكن","der","","Für diese Wohnung braucht man einen Wohnberechtigungsschein.","لهذه الشقّةِ تلزمُ شهادةُ استحقاق","b1x"),
 ("die Hausratversicherung abschließen","يبرمُ تأمينَ المحتويات","","","Ich habe eine Hausratversicherung abgeschlossen.","أبرمتُ تأمينَ المحتويات","b1x"),
 ("die Rundfunkgebühr","رسمُ الإعلامِ العمومي","die","","Die Rundfunkgebühr zahlt jeder Haushalt.","رسمُ الإعلامِ على كلِّ أسرة","b1x"),
 ("die Verbraucherzentrale","مركزُ حمايةِ المستهلك","die","","Die Verbraucherzentrale berät kostenlos.","مركزُ حمايةِ المستهلكِ يستشيرُ مجاناً","b1x"),
 ("den Anbieter wechseln","يغيّرُ المزوِّد","","","Ich wechsle jedes Jahr den Anbieter.","أغيّرُ المزوِّدَ كلَّ عام","b1x"),
 ("die Kündigungsbestätigung","تأكيدُ الإنهاء","die","die Kündigungsbestätigungen","Ich warte auf die Kündigungsbestätigung.","أنتظرُ تأكيدَ الإنهاء","b1x"),
 ("die Ratenzahlung vereinbaren","يتّفقُ على التقسيط","","","Wir haben Ratenzahlung vereinbart.","اتّفقنا على التقسيط","b1x"),
 ("der Zahlungsverzug","التأخُّرُ في السداد","der","","Zahlungsverzug kostet Gebühren.","التأخُّرُ في السدادِ يكلّفُ رسوماً","b1x"),
 ("die Schuldnerberatung","إرشادُ المدينين","die","","Die Schuldnerberatung hilft anonym.","إرشادُ المدينينَ يساعدُ بسرّية","b1x"),
 ("das Haushaltsbuch führen","يمسكُ دفترَ المصاريف","","","Ein Haushaltsbuch zu führen lohnt sich.","إمساكُ دفترِ المصاريفِ مجدٍ","b1x"),
 ("die Fixkosten","التكاليفُ الثابتة","die","","Die Fixkosten fressen das halbe Gehalt.","التكاليفُ الثابتةُ تلتهمُ نصفَ الراتب","b1x"),
 ("die Rücklage auflösen","يسحبُ من الاحتياطي","","","Ich musste die Rücklage auflösen.","اضطُرِرتُ للسحبِ من الاحتياطي","b1x"),
 ("die Versicherung kündigen","يُنهي التأمين","","","Ich kündige die Versicherung zum Jahresende.","أُنهي التأمينَ آخرَ السنة","b1x"),
 ("der Vertrag verlängert sich automatisch","العقدُ يتجدَّدُ تلقائياً","","","Achtung: Der Vertrag verlängert sich automatisch.","انتبه: العقدُ يتجدَّدُ تلقائياً","b1x"),
 ("die Preisbindung","تثبيتُ السعر","die","","Die Preisbindung gilt zwölf Monate.","تثبيتُ السعرِ اثنا عشرَ شهراً","b1x"),
 ("der Tarifwechsel","تغييرُ التعرفة","der","die Tarifwechsel","Ein Tarifwechsel spart oft Geld.","تغييرُ التعرفةِ يوفّرُ غالباً","b1x"),
 ("die Abschlagszahlung","الدفعةُ على الحساب","die","die Abschlagszahlungen","Die Abschlagszahlung ist monatlich.","الدفعةُ على الحسابِ شهرية","b1x"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vw-b1n-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-arbeit-familie-geld"]={"id":"b1-arbeit-familie-geld","titleAr":"التأهيل المهني والإعانات والمدرسة والمال — لغة الحياة الرسمية","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp)
    print(dict(c),"| المجموع:",sum(c.values()),"| تراكمي B1:",c["A1"]+c["A2"]+c["B1"])
main()
