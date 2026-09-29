#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""الموجةُ السابعةَ عشرة: B1 — الطعامُ والمطعمُ المتقدّم · الفنُّ والترفيه · الاعتذارُ والمجاملةُ الاجتماعية."""
import json, re, os
P="content/vocab.json"; BILDER=set(os.listdir("public/cards"))
ROWS=[
 ("die Vorspeise","المقبّلات","die","die Vorspeisen","Als Vorspeise nehme ich Suppe.","كمقبّلاتٍ آخذُ شوربة","essen1"),
 ("die Hauptspeise","الطبقُ الرئيس","die","die Hauptspeisen","Die Hauptspeise war reichlich.","كانَ الطبقُ الرئيسُ وفيراً","essen1"),
 ("die Nachspeise","التحلية","die","die Nachspeisen","Zur Nachspeise gibt es Eis.","للتحليةِ مثلَّجات","essen1"),
 ("die Beilage","الطبقُ الجانبي","die","die Beilagen","Als Beilage nehme ich Salat.","كطبقٍ جانبيٍّ آخذُ سلطة","essen1"),
 ("die Zutatenliste","قائمةُ المكوّنات","die","die Zutatenlisten","Lies die Zutatenliste genau.","اقرأْ قائمةَ المكوّناتِ بدقة","essen1"),
 ("die Unverträglichkeit","عدمُ التحمُّل","die","die Unverträglichkeiten","Ich habe eine Laktoseunverträglichkeit.","لديَّ عدمُ تحمُّلٍ للّاكتوز","essen1"),
 ("bestellen wir getrennt","نطلبُ منفصلَين","","","Bestellen wir getrennt oder zusammen?","أنطلبُ منفصلَينِ أم معاً؟","essen1"),
 ("die Rechnung getrennt zahlen","يدفعُ منفصلاً","","","Wir zahlen die Rechnung getrennt.","ندفعُ الفاتورةَ منفصلَين","essen1"),
 ("das Trinkgeld geben","يعطي بقشيشاً","","","In Deutschland gibt man etwa zehn Prozent Trinkgeld.","في ألمانيا يُعطى نحوُ عشرةَ بالمئةِ بقشيشاً","essen1"),
 ("den Tisch reservieren lassen","يحجزُ طاولةً بواسطة","","","Ich habe den Tisch reservieren lassen.","حجزتُ الطاولةَ مسبقاً","essen1"),
 ("die Bedienung rufen","ينادي النادل","","","Können Sie bitte die Bedienung rufen?","أيمكنكَ نداءُ النادل؟","essen1"),
 ("das Gericht empfehlen","ينصحُ بطبق","","","Was können Sie empfehlen?","بماذا تنصح؟","essen1"),
 ("die Ausstellung besuchen","يزورُ معرضاً","","","Wir besuchen die Ausstellung am Sonntag.","نزورُ المعرضَ يومَ الأحد","kunst1"),
 ("der Eintritt frei","الدخولُ مجاني","","","Für Kinder ist der Eintritt frei.","للأطفالِ الدخولُ مجاني","kunst1"),
 ("die Führung","الجولةُ المرشَدة","die","die Führungen","Die Führung beginnt um vierzehn Uhr.","الجولةُ تبدأُ الثانيةَ ظهراً","kunst1"),
 ("die Vorstellung ausverkauft","العرضُ نفدت تذاكرُه","","","Die Vorstellung ist ausverkauft.","نفدت تذاكرُ العرض","kunst1"),
 ("die Kritik lesen","يقرأُ النقد","","","Ich lese vorher die Kritiken.","أقرأُ النقدَ مسبقاً","kunst1"),
 ("der Regisseur","المخرج","der","die Regisseure","Der Regisseur ist bekannt.","المخرجُ معروف","kunst1"),
 ("die Handlung","الحبكة","die","die Handlungen","Die Handlung ist spannend.","الحبكةُ مشوِّقة","kunst1"),
 ("die Hauptrolle","الدورُ الرئيس","die","die Hauptrollen","Sie spielt die Hauptrolle.","تؤدّي الدورَ الرئيس","kunst1"),
 ("das Werk","العمل الفني","das","die Werke","Das Werk stammt aus dem 19. Jahrhundert.","العملُ من القرنِ التاسعَ عشر","kunst1"),
 ("die Epoche","الحقبة","die","die Epochen","Diese Epoche war unruhig.","كانت هذه الحقبةُ مضطربة","kunst1"),
 ("Entschuldigen Sie bitte die Störung","معذرةً على الإزعاج","","","Entschuldigen Sie bitte die Störung, haben Sie kurz Zeit?","معذرةً على الإزعاج، أعندكَ وقتٌ قصير؟","hoefl"),
 ("Das war nicht meine Absicht","لم يكنْ ذلك قصدي","","","Das war wirklich nicht meine Absicht.","لم يكنْ ذلك قصدي حقاً","hoefl"),
 ("Ich bitte um Verzeihung","أرجو المعذرة","","","Ich bitte um Verzeihung für die Verspätung.","أرجو المعذرةَ عن التأخير","hoefl"),
 ("Es tut mir aufrichtig leid","يؤسفُني صدقاً","","","Es tut mir aufrichtig leid.","يؤسفُني صدقاً","hoefl"),
 ("Kann ich das wiedergutmachen","أيمكنني التعويض","","","Kann ich das irgendwie wiedergutmachen?","أيمكنني التعويضُ بطريقةٍ ما؟","hoefl"),
 ("Darf ich Ihnen helfen","أيمكنني مساعدتُك","","","Darf ich Ihnen mit dem Koffer helfen?","أيمكنني مساعدتُكَ بالحقيبة؟","hoefl"),
 ("Machen Sie sich keine Umstände","لا تُكلِّفْ نفسَك","","","Machen Sie sich bitte keine Umstände.","لا تُكلِّفْ نفسَكَ من فضلك","hoefl"),
 ("Das ist sehr aufmerksam von Ihnen","هذا لطفٌ منك","","","Das ist sehr aufmerksam von Ihnen, danke.","هذا لطفٌ منك، شكراً","hoefl"),
 ("Ich weiß das zu schätzen","أُقدِّرُ ذلك","","","Ich weiß deine Hilfe zu schätzen.","أُقدِّرُ مساعدتَك","hoefl"),
 ("bei Gelegenheit","عندَ سنوحِ الفرصة","","","Wir treffen uns bei Gelegenheit.","نلتقي عندَ سنوحِ الفرصة","hoefl"),
 ("wenn es Ihnen recht ist","إن ناسبَك","","","Wenn es Ihnen recht ist, komme ich um vier.","إن ناسبَكَ آتي الرابعة","hoefl"),
 ("ich melde mich rechtzeitig","أتواصلُ في الوقتِ المناسب","","","Ich melde mich rechtzeitig bei Ihnen.","أتواصلُ معكَ في الوقتِ المناسب","hoefl"),
 ("herzlichen Dank im Voraus","جزيلُ الشكرِ مقدَّماً","","","Herzlichen Dank im Voraus für Ihre Mühe.","جزيلُ الشكرِ مقدَّماً على جهدِك","hoefl"),
 ("ich hoffe auf Ihr Verständnis","أرجو تفهُّمَكم","","","Ich hoffe auf Ihr Verständnis.","أرجو تفهُّمَكم","hoefl"),
 ("nichts für ungut","لا مؤاخذة","","","Nichts für ungut, ich meinte es anders.","لا مؤاخذة، قصدتُ غيرَ ذلك","hoefl"),
 ("das lässt sich einrichten","يمكنُ ترتيبُ ذلك","","","Das lässt sich sicher einrichten.","يمكنُ ترتيبُ ذلك بالتأكيد","hoefl"),
]
def main():
    v=json.load(open(P,encoding="utf8"))
    vor={c["de"].lower() for d in v.values() for c in d["cards"]}
    ids={c["id"] for d in v.values() for c in d["cards"]}
    karten=[];dopp=[]
    for j,(de,ar,art,pl,exDe,exAr,tag) in enumerate(ROWS):
        if de.lower() in vor: dopp.append(de); continue
        vor.add(de.lower())
        kid=f"vn-b1w-{j:03d}"; assert kid not in ids
        k={"id":kid,"de":de,"ar":ar}
        if art:k["article"]=art
        if pl:k["plural"]=pl
        k.update({"exampleDe":exDe,"exampleAr":exAr,"level":"B1","tags":[tag]})
        b=re.sub(r"[^a-z]","",de.split()[-1].lower().replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","ss"))+".png"
        if b in BILDER: k["img"]="/cards/"+b
        karten.append(k)
    v["b1-essen-kunst-hoeflichkeit"]={"id":"b1-essen-kunst-hoeflichkeit","titleAr":"المطعم والطعام · الفن والعروض · لغة الاعتذار والمجاملة","level":"B1","cards":karten}
    json.dump(v,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    c=collections.Counter(x["level"] for d in v.values() for x in d["cards"])
    print("الحزمة:",len(karten),"| مكرَّر:",dopp); print(dict(c),"| المجموع:",sum(c.values()))
main()
