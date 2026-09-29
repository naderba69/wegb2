#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ الخامسةُ والعشرون: إغلاقُ عتبةِ B1 التراكمية — الإدارةُ والسياسة · العملُ الحرفيّ والتقنيّ · المشاعرُ الدقيقةُ وأفعالُ الرأي."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))

A=[ # الإدارةُ والحقوقُ والسياسةُ المحلّية
 ("die Verwaltung","الإدارة","die","die Verwaltungen","Die Verwaltung arbeitet langsam.","الإدارةُ تعملُ ببطء","verw"),
 ("der Sachbearbeiter","الموظفُ المكلَّف","der","die Sachbearbeiter","Der Sachbearbeiter ruft zurück.","الموظفُ المكلَّفُ سيعاودُ الاتصال","verw"),
 ("die Akteneinsicht","الاطّلاعُ على الملف","die","","Ich beantrage Akteneinsicht.","أطلبُ الاطّلاعَ على الملف","verw"),
 ("das Formular ausfüllen lassen","يستعينُ بمن يملأُ الاستمارة","","","Ich lasse das Formular ausfüllen.","أستعينُ بمن يملأُ الاستمارة","verw"),
 ("die Gebühr entrichten","يسدّدُ الرسم","","","Die Gebühr ist vor Ort zu entrichten.","الرسمُ يُسدَّدُ في المكان","verw"),
 ("der Rechtsanspruch","الحقُّ القانوني","der","die Rechtsansprüche","Es besteht ein Rechtsanspruch auf Betreuung.","ثمّةَ حقٌّ قانونيٌّ في الرعاية","verw"),
 ("die Frist wahren","يحفظُ المهلة","","","Mit der Mail wahre ich die Frist.","بالبريدِ أحفظُ المهلة","verw"),
 ("das Schreiben zustellen","يبلّغُ الكتاب","","","Der Bescheid wurde gestern zugestellt.","بُلِّغَ القرارُ أمس","verw"),
 ("die Rechtsmittelbelehrung","إرشادُ طرقِ الطعن","die","","Unten steht die Rechtsmittelbelehrung.","في الأسفلِ إرشادُ طرقِ الطعن","verw"),
 ("der Gemeinderat","المجلسُ البلدي","der","die Gemeinderäte","Der Gemeinderat tagt monatlich.","المجلسُ البلديُّ يجتمعُ شهرياً","verw"),
 ("die Bürgersprechstunde","ساعةُ استقبالِ المواطنين","die","die Bürgersprechstunden","Die Bürgersprechstunde ist mittwochs.","ساعةُ الاستقبالِ الأربعاء","verw"),
 ("die Beschlussvorlage","مشروعُ القرار","die","die Beschlussvorlagen","Die Beschlussvorlage liegt vor.","مشروعُ القرارِ جاهز","verw"),
 ("abstimmen über","يصوّتُ على","","","Wir stimmen über den Antrag ab.","نصوّتُ على الطلب","verw"),
 ("die Mehrheit erreichen","يبلغُ الأغلبية","","","Der Vorschlag erreichte die Mehrheit.","بلغَ الاقتراحُ الأغلبية","verw"),
 ("in Kraft bleiben","يبقى ساري المفعول","","","Die Regel bleibt bis Juni in Kraft.","القاعدةُ ساريةٌ حتى يونيو","verw"),
 ("die Auflage","الشرطُ المفروض","die","die Auflagen","Die Genehmigung hat Auflagen.","للترخيصِ شروطٌ مفروضة","verw"),
 ("die Ausnahme genehmigen","يرخّصُ استثناءً","","","Die Behörde genehmigte eine Ausnahme.","رخَّصتِ الإدارةُ استثناءً","verw"),
 ("die Einsprache","الاعتراض","die","die Einsprachen","Die Einsprache muss schriftlich sein.","يجبُ أن يكونَ الاعتراضُ كتابياً","verw"),
 ("das Verfahren einstellen","يحفظُ الإجراء","","","Das Verfahren wurde eingestellt.","حُفِظَ الإجراء","verw"),
 ("die Zuständigkeit abgeben","يحيلُ الاختصاص","","","Das Amt gab die Zuständigkeit ab.","أحالتِ الدائرةُ الاختصاص","verw"),
]
B=[ # العملُ الحرفيُّ والتقنيّ
 ("der Handwerksbetrieb","المنشأةُ الحرفية","der","die Handwerksbetriebe","Der Handwerksbetrieb sucht Lehrlinge.","المنشأةُ الحرفيةُ تبحثُ عن متدرّبين","hand"),
 ("der Lehrling","المتدرِّب","der","die Lehrlinge","Der Lehrling lernt drei Jahre.","المتدرِّبُ يتعلَّمُ ثلاثَ سنوات","hand"),
 ("die Meisterprüfung","امتحانُ الأستاذية","die","die Meisterprüfungen","Nach der Meisterprüfung darf man ausbilden.","بعدَ الأستاذيةِ يجوزُ التدريب","hand"),
 ("das Werkzeug","العُدَّة","das","die Werkzeuge","Das Werkzeug liegt im Wagen.","العُدَّةُ في السيارة","hand"),
 ("die Bohrmaschine","المثقاب","die","die Bohrmaschinen","Leih mir bitte die Bohrmaschine.","أعِرْني المثقاب","hand"),
 ("die Leiter","السلّم","die","die Leitern","Halt die Leiter fest!","أمسكِ السلّمَ جيداً!","hand"),
 ("das Kabel verlegen","يمدُّ الكابل","","","Der Elektriker verlegt das Kabel.","الكهربائيُّ يمدُّ الكابل","hand"),
 ("die Sicherung herausspringen","القاطعُ يفصل","","","Die Sicherung ist herausgesprungen.","فصلَ القاطع","hand"),
 ("der Wasserhahn tropft","الحنفيةُ تنقّط","","","Der Wasserhahn tropft seit Tagen.","الحنفيةُ تنقّطُ منذُ أيام","hand"),
 ("die Dichtung wechseln","يبدّلُ الجلدة","","","Man muss die Dichtung wechseln.","يجبُ تبديلُ الجلدة","hand"),
 ("den Voranschlag prüfen","يفحصُ التقديرَ المالي","","","Prüfe den Voranschlag genau.","افحصِ التقديرَ بدقة","hand"),
 ("die Arbeitsstunde berechnen","يحسبُ ساعةَ العمل","","","Er berechnet fünfzig Euro pro Arbeitsstunde.","يحسبُ خمسينَ يورو للساعة","hand"),
 ("die Materialkosten","تكاليفُ المواد","die","","Die Materialkosten sind gestiegen.","ارتفعت تكاليفُ المواد","hand"),
 ("die Abnahme","تسلُّمُ العمل","die","die Abnahmen","Nach der Abnahme wird gezahlt.","يُدفَعُ بعدَ التسلُّم","hand"),
 ("die Gewährleistungsfrist","مدّةُ ضمانِ الإنجاز","die","","Die Gewährleistungsfrist beträgt fünf Jahre.","مدّةُ الضمانِ خمسُ سنوات","hand"),
 ("die Baustelle sichern","يؤمّنُ الورشة","","","Die Baustelle muss gesichert sein.","يجبُ تأمينُ الورشة","hand"),
 ("die Schutzbrille","نظّارةُ الحماية","die","die Schutzbrillen","Ohne Schutzbrille wird nicht geschliffen.","بلا نظّارةِ حمايةٍ لا صنفرة","hand"),
 ("der Staub","الغبار","der","","Der Staub setzt sich überall ab.","الغبارُ يستقرُّ في كلِّ مكان","hand"),
 ("die Entsorgung","التخلُّصُ من المخلَّفات","die","","Die Entsorgung kostet extra.","التخلُّصُ من المخلَّفاتِ بمقابلٍ إضافي","hand"),
 ("termingerecht","في الموعدِ المحدَّد","","","Die Arbeit wurde termingerecht fertig.","أُنجِزَ العملُ في موعدِه","hand"),
]
C=[ # المشاعرُ الدقيقةُ وأفعالُ الرأي
 ("die Zuversicht","الثقةُ بالمستقبل","die","","Ich habe Zuversicht, dass es klappt.","لديَّ ثقةٌ أنَّهُ سينجح","gef2"),
 ("die Erleichterung","الارتياحُ بعدَ قلق","die","","Nach der Nachricht kam die Erleichterung.","بعدَ الخبرِ جاءَ الارتياح","gef2"),
 ("die Verunsicherung","التزعزُع","die","","Die Lage sorgt für Verunsicherung.","الوضعُ يسبّبُ تزعزُعاً","gef2"),
 ("die Überforderung","الإرهاقُ بما يفوقُ الطاقة","die","","Überforderung macht krank.","الإرهاقُ الزائدُ يُمرِض","gef2"),
 ("die Dankbarkeit","الامتنان","die","","Ich empfinde große Dankbarkeit.","أشعرُ بامتنانٍ كبير","gef2"),
 ("die Neugier","الفضول","die","","Neugier treibt das Lernen an.","الفضولُ يدفعُ التعلُّم","gef2"),
 ("die Gleichgültigkeit","اللامبالاة","die","","Gleichgültigkeit ist schlimmer als Streit.","اللامبالاةُ أسوأُ من الخصام","gef2"),
 ("die Ungeduld","نفادُ الصبر","die","","Meine Ungeduld war ein Fehler.","كانَ نفادُ صبري خطأً","gef2"),
 ("die Rücksichtslosigkeit","عدمُ المراعاة","die","","Rücksichtslosigkeit ärgert die Nachbarn.","عدمُ المراعاةِ يُغضِبُ الجيران","gef2"),
 ("der Groll","الضغينة","der","","Er trägt keinen Groll.","لا يحملُ ضغينة","gef2"),
 ("die Genugtuung","الرضا بعدَ إنصاف","die","","Das Urteil gab ihr Genugtuung.","الحكمُ أعطاها رضاً","gef2"),
 ("vermuten","يرجّح","","","Ich vermute, er kommt später.","أرجّحُ أنَّهُ سيأتي لاحقاً","mein2"),
 ("bezweifeln","يشكُّ في","","","Ich bezweifle diese Zahl.","أشكُّ في هذا الرقم","mein2"),
 ("einschätzen als","يقيّمُ بأنّه","","","Ich schätze das als riskant ein.","أقيّمُ ذلك بأنَّهُ محفوف","mein2"),
 ("betonen","يشدّد","","","Ich betone die Bedeutung der Frist.","أشدّدُ على أهميةِ المهلة","mein2"),
 ("relativieren","ينسّب / يخفّف","","","Er relativierte seine Aussage.","نسَّبَ إفادتَه","mein2"),
 ("zugeben","يعترف","","","Ich gebe zu, dass ich mich geirrt habe.","أعترفُ بأنّي أخطأت","mein2"),
 ("bestreiten","ينكر","","","Er bestreitet die Vorwürfe.","ينكرُ الاتهامات","mein2"),
 ("nahelegen","يُرجّحُ ويشير","","","Die Daten legen das nahe.","البياناتُ تُرجّحُ ذلك","mein2"),
 ("offenlassen","يترُكُ مفتوحاً","","","Die Frage lassen wir offen.","نتركُ السؤالَ مفتوحاً","mein2"),
]
NEUE=[("b1-verwaltung-politik","B1","الإدارة والحقوق والسياسة المحلّية",A),
 ("b1-handwerk-technik","B1","العمل الحرفي والتقني وورشة البيت",B),
 ("b1-gefuehle-meinung","B1","المشاعر الدقيقة وأفعال الرأي",C)]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    n=0; dopp=[]
    for deckId,level,titel,rows in NEUE:
        karten=[]
        for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(rows):
            if de.lower() in vor: dopp.append(de); continue
            vor.add(de.lower())
            kid=f"vv-{deckId[3:9]}-{j:03d}"; assert kid not in ids; ids.add(kid)
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
    print("أُضيف:",n,"| مكرَّر:",len(dopp),dopp[:6])
    print(dict(c),"| المجموع:",sum(c.values()),"| تراكمي B1:",c["A1"]+c["A2"]+c["B1"])
main()
