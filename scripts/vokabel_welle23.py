#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الثالثةُ والعشرون: B1 — الطبيعةُ والمناخ · الرياضةُ والصحّةُ النفسية · نعوتٌ مركّبة."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Klimaanpassung","التكيُّفُ المناخي","die","","Städte brauchen Klimaanpassung.","المدنُ تحتاجُ تكيُّفاً مناخياً","klima"),
 ("die Hitzewelle","موجةُ الحر","die","die Hitzewellen","Die Hitzewelle dauerte zehn Tage.","استمرَّت موجةُ الحرِّ عشرةَ أيام","klima"),
 ("die Überschwemmung","الفيضان","die","die Überschwemmungen","Nach dem Regen kam die Überschwemmung.","بعدَ المطرِ جاءَ الفيضان","klima"),
 ("der Starkregen","المطرُ الغزير","der","","Starkregen überfordert die Kanäle.","المطرُ الغزيرُ يُرهِقُ المجاري","klima"),
 ("die Trockenheit","الجفاف","die","","Die Trockenheit schadet den Wäldern.","الجفافُ يضرُّ الغابات","klima"),
 ("der Wasserstand","منسوبُ المياه","der","die Wasserstände","Der Wasserstand ist niedrig.","منسوبُ المياهِ منخفض","klima"),
 ("die Artenvielfalt","التنوُّعُ الحيوي","die","","Artenvielfalt schützt das Gleichgewicht.","التنوُّعُ الحيويُّ يحفظُ التوازن","klima"),
 ("aussterben","ينقرض","","","Viele Arten sterben aus.","أنواعٌ كثيرةٌ تنقرض","klima"),
 ("der Lebensraum","الموئل","der","die Lebensräume","Der Lebensraum wird kleiner.","الموئلُ يضيق","klima"),
 ("die Aufforstung","التشجير","die","","Aufforstung braucht Jahrzehnte.","التشجيرُ يحتاجُ عقوداً","klima"),
 ("der Umweltschutzverband","جمعيةُ حمايةِ البيئة","der","die Umweltschutzverbände","Der Umweltschutzverband protestiert.","جمعيةُ حمايةِ البيئةِ تحتج","klima"),
 ("die Umstellung auf Ökostrom","التحوُّلُ إلى الكهرباءِ الخضراء","die","","Die Umstellung auf Ökostrom war einfach.","كانَ التحوُّلُ سهلاً","klima"),
 ("die Ausdauer trainieren","يدرّبُ التحمُّل","","","Laufen trainiert die Ausdauer.","الجريُ يدرّبُ التحمُّل","sport2"),
 ("der Muskelkater","وجعُ العضلات","der","","Nach dem Training habe ich Muskelkater.","بعدَ التدريبِ تؤلمُني عضلاتي","sport2"),
 ("die Dehnübung","تمرينُ الإطالة","die","die Dehnübungen","Dehnübungen beugen Verletzungen vor.","تماريُن الإطالةِ تقي الإصابات","sport2"),
 ("vorbeugen","يقي","","","Bewegung beugt Krankheiten vor.","الحركةُ تقي من الأمراض","sport2"),
 ("die Regeneration","الاستشفاء","die","","Regeneration ist Teil des Trainings.","الاستشفاءُ جزءٌ من التدريب","sport2"),
 ("der Schlafrhythmus","إيقاعُ النوم","der","","Ein fester Schlafrhythmus hilft.","إيقاعُ نومٍ ثابتٌ يفيد","sport2"),
 ("die innere Unruhe","القلقُ الداخلي","die","","Innere Unruhe raubt den Schlaf.","القلقُ الداخليُّ يسلبُ النوم","sport2"),
 ("die Entspannungstechnik","تقنيةُ الاسترخاء","die","die Entspannungstechniken","Entspannungstechniken kann man lernen.","تقنياتُ الاسترخاءِ تُتعلَّم","sport2"),
 ("die Therapie in Anspruch nehmen","يستفيدُ من العلاج","","","Man darf Therapie in Anspruch nehmen.","يحقُّ للمرءِ الاستفادةُ من العلاج","sport2"),
 ("das Stigma","الوصمة","das","","Psychische Krankheit trägt noch ein Stigma.","المرضُ النفسيُّ ما زالت عليهِ وصمة","sport2"),
 ("die Selbsthilfegruppe","مجموعةُ الدعمِ الذاتي","die","die Selbsthilfegruppen","Eine Selbsthilfegruppe hilft vielen.","مجموعةُ الدعمِ تفيدُ كثيرين","sport2"),
 ("umweltfreundlich","صديقٌ للبيئة","","","Wir kaufen umweltfreundliche Produkte.","نشتري منتجاتٍ صديقةً للبيئة","adj3"),
 ("kostenbewusst","واعٍ بالتكاليف","","","Er plant kostenbewusst.","يخطّطُ بوعيٍ بالتكاليف","adj3"),
 ("zeitaufwendig","مستهلِكٌ للوقت","","","Das Verfahren ist zeitaufwendig.","الإجراءُ مستهلِكٌ للوقت","adj3"),
 ("pflegeleicht","سهلُ العناية","","","Die Pflanze ist pflegeleicht.","النبتةُ سهلةُ العناية","adj3"),
 ("benutzerfreundlich","سهلُ الاستعمال","","","Die App ist benutzerfreundlich.","التطبيقُ سهلُ الاستعمال","adj3"),
 ("kinderfreundlich","ملائمٌ للأطفال","","","Das Viertel ist kinderfreundlich.","الحيُّ ملائمٌ للأطفال","adj3"),
 ("verkehrsgünstig","جيّدُ الربطِ بالمواصلات","","","Die Lage ist verkehrsgünstig.","الموقعُ جيّدُ الربط","adj3"),
 ("einkommensschwach","محدودُ الدخل","","","Einkommensschwache Familien bekommen Hilfe.","الأسرُ محدودةُ الدخلِ تُعان","adj3"),
 ("arbeitsintensiv","كثيفُ العمالة","","","Die Ernte ist arbeitsintensiv.","الحصادُ كثيفُ العمالة","adj3"),
 ("krisenfest","صامدٌ في الأزمات","","","Der Beruf gilt als krisenfest.","تُعَدُّ المهنةُ صامدةً في الأزمات","adj3"),
 ("lernbereit","مستعدٌّ للتعلُّم","","","Wir suchen lernbereite Mitarbeiter.","نبحثُ عن موظفينَ مستعدّينَ للتعلُّم","adj3"),
 ("teamfähig","قادرٌ على العملِ الجماعي","","","Ich bin teamfähig und flexibel.","أنا قادرٌ على العملِ الجماعيِّ ومرن","adj3"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vt-b1q-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-klima-sport-komposita"]={"id":"b1-klima-sport-komposita","titleAr":"المناخ والطبيعة · الرياضة والصحّة النفسية · النعوت المركّبة","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
