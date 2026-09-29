#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""سؤالٌ رابعٌ لكلِّ نصوصِ A2 العشرين: ملءُ فراغٍ أو صواب/خطأ — من متنِ النصِّ حرفياً."""
import json
P="content/texts.json"
Q = {
 "t-a2-01": ("fill","Am Samstag bin ich früh ___.", ["aufgestanden"], "الماضي المركّبُ لفعلِ الحركةِ يأخذُ sein: «bin ich früh aufgestanden»."),
 "t-a2-02": ("fill","Nehmen Sie die Medizin ___ am Tag.", ["dreimal","3-mal"], "«Nehmen Sie die Medizin dreimal am Tag nach dem Essen»."),
 "t-a2-03": ("tf","Das Flugzeug ist billiger als der Zug.", "falsch", "القطارُ بثمانينَ يورو والطائرةُ بمئةٍ وعشرين — فالقطارُ أرخص."),
 "t-a2-04": ("fill","Ich lerne Deutsch, ___ ich in Deutschland studieren möchte.", ["weil"], "weil تدفعُ الفعلَ المصرَّفَ إلى آخرِ الجملة."),
 "t-a2-05": ("fill","Die Party beginnt um ___ Uhr.", ["18","achtzehn"], "«Die Party beginnt um 18 Uhr bei mir zu Hause»."),
 "t-a2-06": ("tf","Am Sonntag hat die Gruppe den ganzen Tag am Strand verbracht.", "falsch", "«Leider hat es am Sonntag geregnet, deshalb sind wir früher nach Hause gefahren»."),
 "t-a2-07": ("fill","Dreimal pro Woche eine halbe ___ bewegen reicht schon.", ["Stunde"], "«Dreimal pro Woche eine halbe Stunde bewegen reicht schon»."),
 "t-a2-08": ("fill","Ich hätte gern einen ___.", ["Termin"], "صيغةُ طلبٍ مهذّبة: hätte gern + مفعولٌ أكوزاتيف."),
 "t-a2-09": ("fill","Die Fahrt dauert ___ Stunden.", ["drei","3"], "«Die Fahrt dauert drei Stunden»."),
 "t-a2-10": ("tf","Die neue Wohnung ist teurer als die alte.", "falsch", "«Dafür ist die Miete günstiger als vorher»."),
 "t-a2-11": ("fill","Der Verkäufer hat mir ___ geholfen.", ["geduldig"], "«hat mir ein Verkäufer geduldig geholfen»."),
 "t-a2-12": ("tf","Der Nachbar hat versprochen, später anzufangen.", "richtig", "«Er hat sich entschuldigt und versprochen, später anzufangen»."),
 "t-a2-13": ("fill","Nach ___ Wochen konnte ich allein schwimmen.", ["acht","8"], "«Nach acht Wochen konnte ich zum ersten Mal allein … schwimmen»."),
 "t-a2-14": ("fill","Am zweiten Tag sind wir mit dem ___ durch die Stadt gefahren.", ["Fahrrad"], "«am zweiten Tag sind wir mit dem Fahrrad durch die Stadt gefahren»."),
 "t-a2-15": ("tf","Er hat ein neues Fahrrad gekauft.", "falsch", "«Also habe ich mich entschieden, es reparieren zu lassen»."),
 "t-a2-16": ("fill","In der Bewerbung habe ich geschrieben, dass ich ___ bin.", ["zuverlässig"], "«dass ich zuverlässig bin und gerne früh aufstehe»."),
 "t-a2-17": ("fill","Wir ersetzen die alten Glühbirnen durch ___-Lampen.", ["LED"], "«ersetzen wir durch LED-Lampen, die viel weniger Strom verbrauchen»."),
 "t-a2-18": ("fill","Die Vertragslaufzeit beträgt ___ Jahre.", ["zwei","2"], "«dass die Vertragslaufzeit zwei Jahre beträgt»."),
 "t-a2-19": ("tf","Die Wohnung liegt im dritten Stock und hat einen Aufzug.", "falsch", "«im dritten Stock, ohne Aufzug»."),
 "t-a2-20": ("tf","Der Chef hat laut geschimpft.", "falsch", "«Der Chef war ruhig»."),
}
def main():
    t=json.load(open(P,encoding="utf8")); n=0
    for x in t:
        if x["id"] in Q:
            typ, *rest = Q[x["id"]]
            qid=f'{x["id"]}-q4'
            assert all(q["id"]!=qid for q in x["questions"]), qid
            if typ=="fill":
                prompt, answers, erkl = rest
                x["questions"].append({"id":qid,"type":"fill","promptDe":prompt,"answer":answers,"explanationAr":erkl})
            else:
                prompt, answer, erkl = rest
                x["questions"].append({"id":qid,"type":"truefalse","promptDe":prompt,"options":["richtig","falsch"],"answer":answer,"explanationAr":erkl})
            n+=1
    json.dump(t,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    print("أُضيف:",n,"| الأسئلة:",sum(len(x["questions"]) for x in t), dict(collections.Counter(q["type"] for x in t for q in x["questions"])))
main()
