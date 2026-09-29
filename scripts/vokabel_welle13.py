#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثالثةَ عشرة: B1 — الدراسةُ والتكوين · الهجرةُ والاندماج · الأسرةُ والتربية."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))

B1_BILDUNG = [
 ("die Berufsorientierung","التوجيهُ المهني","die","","Die Schule bietet Berufsorientierung an.","المدرسةُ تقدّمُ توجيهاً مهنياً","bil"),
 ("der Bildungsweg","المسارُ التعليمي","der","die Bildungswege","Sein Bildungsweg war nicht gerade.","لم يكنْ مسارُهُ التعليميُّ مستقيماً","bil"),
 ("die Hochschule","المعهدُ العالي","die","die Hochschulen","Sie studiert an einer Hochschule.","تدرسُ في معهدٍ عالٍ","bil"),
 ("die Zulassung","القبول","die","die Zulassungen","Die Zulassung kam im Juli.","جاءَ القبولُ في يوليو","bil"),
 ("der Numerus clausus","الحدُّ الأدنى للمعدّل","der","","Medizin hat einen strengen Numerus clausus.","للطبِّ حدٌّ صارمٌ للمعدّل","bil"),
 ("das Semester","الفصلُ الجامعي","das","die Semester","Das Semester beginnt im Oktober.","الفصلُ يبدأُ في أكتوبر","bil"),
 ("die Vorlesung","المحاضرة","die","die Vorlesungen","Die Vorlesung ist überfüllt.","المحاضرةُ مكتظّة","bil"),
 ("das Seminar","الحلقةُ الدراسية","das","die Seminare","Im Seminar müssen alle reden.","في الحلقةِ على الجميعِ الكلام","bil"),
 ("die Hausarbeit abgeben","يسلّمُ البحث","","","Ich gebe die Hausarbeit Freitag ab.","أسلّمُ البحثَ الجمعة","bil"),
 ("die Note verbessern","يرفعُ الدرجة","","","Ich möchte meine Note verbessern.","أودُّ رفعَ درجتي","bil"),
 ("der Abschluss machen","ينالُ الشهادة","","","Nächstes Jahr mache ich meinen Abschluss.","العامَ القادمَ أنالُ شهادتي","bil"),
 ("die Fachrichtung","التخصُّص","die","die Fachrichtungen","Welche Fachrichtung wählst du?","أيَّ تخصُّصٍ تختار؟","bil"),
 ("der Lehrplan","المنهجُ الدراسي","der","die Lehrpläne","Der Lehrplan ist überladen.","المنهجُ مثقَل","bil"),
 ("das Lerntempo","سرعةُ التعلُّم","das","","Jeder hat sein eigenes Lerntempo.","لكلٍّ سرعتُهُ في التعلُّم","bil"),
 ("der Nachhilfeunterricht","الدروسُ الخصوصية","der","","Nachhilfeunterricht ist teuer.","الدروسُ الخصوصيةُ غالية","bil"),
 ("die Schulpflicht","إلزاميةُ التعليم","die","","In Deutschland gilt die Schulpflicht.","في ألمانيا التعليمُ إلزامي","bil"),
 ("der Schulabbruch","تركُ المدرسة","der","","Schulabbruch hat viele Ursachen.","لتركِ المدرسةِ أسبابٌ كثيرة","bil"),
 ("die Chance nutzen","يغتنمُ الفرصة","","","Er hat seine Chance genutzt.","اغتنمَ فرصتَه","bil"),
 ("lebenslanges Lernen","التعلُّمُ مدى الحياة","","","Lebenslanges Lernen ist heute normal.","التعلُّمُ مدى الحياةِ صارَ عادياً","bil"),
 ("die Bescheinigung vorlegen","يقدّمُ الإفادة","","","Bitte die Bescheinigung vorlegen.","قدّمِ الإفادةَ من فضلك","bil"),
]
B1_MIGRATION = [
 ("die Zuwanderung","الوفودُ والهجرة","die","","Zuwanderung verändert Städte.","الهجرةُ تغيّرُ المدن","mig"),
 ("der Aufenthaltstitel","تصريحُ الإقامة","der","die Aufenthaltstitel","Mein Aufenthaltstitel läuft im Mai ab.","تصريحُ إقامتي ينتهي في مايو","mig"),
 ("die Verlängerung beantragen","يطلبُ التمديد","","","Ich beantrage die Verlängerung rechtzeitig.","أطلبُ التمديدَ في وقتِه","mig"),
 ("die Niederlassungserlaubnis","الإقامةُ الدائمة","die","","Nach fünf Jahren ist die Niederlassungserlaubnis möglich.","بعدَ خمسِ سنواتٍ تمكنُ الإقامةُ الدائمة","mig"),
 ("die Einbürgerung","التجنُّس","die","die Einbürgerungen","Die Einbürgerung dauert oft lange.","التجنُّسُ يطولُ غالباً","mig"),
 ("die Anerkennung des Abschlusses","الاعترافُ بالشهادة","die","","Die Anerkennung des Abschlusses ist entscheidend.","الاعترافُ بالشهادةِ حاسم","mig"),
 ("der Integrationskurs","دورةُ الاندماج","der","die Integrationskurse","Der Integrationskurs endet mit einer Prüfung.","دورةُ الاندماجِ تنتهي بامتحان","mig"),
 ("die Teilnahmepflicht","إلزاميةُ الحضور","die","","Es besteht Teilnahmepflicht.","الحضورُ إلزامي","mig"),
 ("sich zurechtfinden","يهتدي إلى تدبُّرِ أمرِه","","","Nach einem Monat fand ich mich zurecht.","بعدَ شهرٍ تدبَّرتُ أمري","mig"),
 ("die Kultur vermitteln","ينقلُ الثقافة","","","Eltern vermitteln ihre Kultur.","الوالدانِ ينقلانِ ثقافتَهما","mig"),
 ("die Mehrsprachigkeit","تعدُّدُ اللغات","die","","Mehrsprachigkeit ist ein Vorteil.","تعدُّدُ اللغاتِ ميزة","mig"),
 ("die Diskriminierung","التمييز","die","","Diskriminierung ist verboten.","التمييزُ ممنوع","mig"),
 ("sich beschweren bei","يشتكي لدى","","","Man kann sich bei der Stelle beschweren.","يمكنُ الشكوى لدى الجهة","mig"),
 ("der Neuanfang","البدايةُ الجديدة","der","die Neuanfänge","Ein Neuanfang kostet Kraft.","البدايةُ الجديدةُ تكلّفُ جهداً","mig"),
 ("das Netzwerk aufbauen","يبني شبكةَ علاقات","","","Ich baue mir ein Netzwerk auf.","أبني شبكةَ علاقات","mig"),
 ("die Wurzeln","الجذور","die","","Man vergisst seine Wurzeln nicht.","لا ينسى المرءُ جذورَه","mig"),
 ("die Anpassung","التكيُّف","die","","Anpassung heißt nicht Aufgabe.","التكيُّفُ ليسَ تخلّياً","mig"),
]
B1_FAMILIE = [
 ("die Erziehung","التربية","die","","Erziehung braucht Konsequenz.","التربيةُ تحتاجُ ثباتاً","fam"),
 ("erziehen","يربّي","","","Sie erziehen ihre Kinder streng.","يربّيانِ أولادَهما بصرامة","fam"),
 ("die Grenzen setzen","يضعُ الحدود","","","Kinder brauchen Grenzen.","الأطفالُ يحتاجونَ حدوداً","fam"),
 ("das Vorbild","القدوة","das","die Vorbilder","Eltern sind Vorbilder.","الوالدانِ قدوة","fam"),
 ("der Streit schlichten","يفضُّ النزاع","","","Die Mutter schlichtet den Streit.","الأمُّ تفضُّ النزاع","fam"),
 ("die Geduld verlieren","ينفدُ صبرُه","","","Manchmal verliere ich die Geduld.","أحياناً ينفدُ صبري","fam"),
 ("die Aufgabenteilung","تقسيمُ الأدوار","die","","Die Aufgabenteilung zu Hause ist wichtig.","تقسيمُ الأدوارِ في البيتِ مهم","fam"),
 ("der Haushalt führen","يدبّرُ البيت","","","Wir führen den Haushalt gemeinsam.","ندبّرُ البيتَ معاً","fam"),
 ("die Betreuung organisieren","ينظّمُ الرعاية","","","Wir organisieren die Betreuung selbst.","ننظّمُ الرعايةَ بأنفسِنا","fam"),
 ("das Taschengeld","المصروف","das","","Taschengeld lehrt den Umgang mit Geld.","المصروفُ يعلّمُ التعاملَ مع المال","fam"),
 ("die Pubertät","المراهقة","die","","In der Pubertät wird alles lauter.","في المراهقةِ يعلو كلُّ شيء","fam"),
 ("das Vertrauen aufbauen","يبني الثقة","","","Vertrauen baut man langsam auf.","الثقةُ تُبنى ببطء","fam"),
 ("die Regel einhalten","يلتزمُ بالقاعدة","","","Wer die Regel einhält, hat Ruhe.","مَن التزمَ بالقاعدةِ ارتاح","fam"),
 ("das Familienleben","الحياةُ الأسرية","das","","Das Familienleben kommt oft zu kurz.","الحياةُ الأسريةُ تُهمَلُ غالباً","fam"),
 ("die Pflege der Eltern","رعايةُ الوالدَين","die","","Die Pflege der Eltern ist eine Aufgabe.","رعايةُ الوالدَينِ مهمّة","fam"),
 ("die Unterstützung leisten","يقدّمُ الدعم","","","Der Staat leistet Unterstützung.","الدولةُ تقدّمُ الدعم","fam"),
 ("die Alleinerziehende","الأمُّ المعيلة","die","die Alleinerziehenden","Alleinerziehende haben es schwer.","الأمّهاتُ المعيلاتُ حالُهُنَّ صعب","fam"),
 ("die Kinderbetreuung sichern","يؤمّنُ رعايةَ الأطفال","","","Ohne gesicherte Kinderbetreuung geht es nicht.","بلا رعايةٍ مؤمَّنةٍ لا يمكن","fam"),
]
NEUE=[("b1-bildung-weg","B1","الدراسة والتكوين والمسار التعليمي",B1_BILDUNG),
 ("b1-migration-familie","B1","الهجرة والاندماج · الأسرة والتربية",B1_MIGRATION+B1_FAMILIE)]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    n=0; dopp=[]
    for deckId,level,titel,zeilen in NEUE:
        karten=[]
        for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(zeilen):
            if de.lower() in vor: dopp.append(de); continue
            vor.add(de.lower())
            kid=f"vj-{deckId[3:10]}-{j:03d}"; assert kid not in ids; ids.add(kid)
            k={"id":kid,"de":de,"ar":ar}
            if art:k["article"]=art
            if pl:k["plural"]=pl
            k.update({"exampleDe":exDe,"exampleAr":exAr,"level":level,"tags":[tag]})
            b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
            if b in BILDER: k["img"]="/cards/"+b
            karten.append(k); n+=1
        v[deckId]={"id":deckId,"titleAr":titel,"level":level,"cards":karten}
        print(f"  {deckId}: {len(karten)}")
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("أُضيف:",n,"| مكرَّر:",len(dopp),dopp[:6]); print(dict(c),"| المجموع:",sum(c.values()))
main()
