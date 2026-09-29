#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""سؤالُ ملءِ فراغٍ رابعٌ لكلِّ نصوصِ A1 العشرين — كلُّ جوابٍ منقولٌ حرفياً من النصّ."""
import json
P="content/texts.json"
FILL = {
 "t-a1-01": ("Youssef steht um ___ sieben auf.", ["halb"], "«Jeden Tag stehe ich um halb sieben auf» — halb sieben = 6:30."),
 "t-a1-02": ("Am ___ essen wir immer zusammen.", ["Freitag"], "«Am Freitag essen wir immer zusammen»."),
 "t-a1-03": ("Das Brot kostet ___ Euro.", ["zwei", "2"], "«Das Brot kostet zwei Euro»."),
 "t-a1-04": ("Der Bahnhof ist gegenüber vom ___.", ["Hotel"], "«gegenüber vom Hotel» — gegenüber معَ الداتيف."),
 "t-a1-05": ("Sara studiert ___.", ["Informatik"], "«Ich bin 24 Jahre alt und studiere Informatik»."),
 "t-a1-06": ("An der Wand ___ ein Bild von meiner Familie.", ["hängt"], "hängen للمعلَّقِ على الجدار، لا liegen ولا stehen."),
 "t-a1-07": ("Amir ist ___ von Beruf.", ["Taxifahrer"], "«Amir ist Taxifahrer»."),
 "t-a1-08": ("Die Fahrt dauert ___ Minuten.", ["zwanzig", "20"], "«Die Fahrt dauert zwanzig Minuten»."),
 "t-a1-09": ("An der Kasse bezahle ich mit ___.", ["Karte"], "«An der Kasse bezahle ich mit Karte»."),
 "t-a1-10": ("Das WLAN im Café ist ___.", ["kostenlos"], "«Das WLAN ist kostenlos»."),
 "t-a1-11": ("Am Sonntag fahre ich mit dem Bus in den ___.", ["Stadtpark"], "«Ich fahre mit dem Bus in den Stadtpark» — in + أكوزاتيف لأنَّهُ اتّجاه."),
 "t-a1-12": ("Heute ist die Temperatur nur ___ Grad.", ["acht", "8"], "«Die Temperatur ist nur acht Grad»."),
 "t-a1-13": ("Die Wohnung hat zwei Zimmer und eine ___.", ["Küche"], "«Sie hat zwei Zimmer und eine Küche»."),
 "t-a1-14": ("Die Post ist gegenüber vom ___.", ["Krankenhaus"], "«die Post ist gegenüber vom Krankenhaus»."),
 "t-a1-15": ("Wir trainieren ___ pro Woche.", ["zweimal", "2-mal"], "«Wir trainieren zweimal pro Woche»."),
 "t-a1-16": ("Im Supermarkt kostet alles zusammen ___ Euro.", ["fünfundzwanzig", "25"], "«fünfundzwanzig Euro» — والرقمُ يُنطَقُ من الآحادِ ثمَّ العشرات."),
 "t-a1-17": ("Am Flughafen hat mich mein ___ abgeholt.", ["Onkel"], "«hat mich mein Onkel abgeholt»."),
 "t-a1-18": ("Karim lernt Deutsch für die ___-Prüfung.", ["B2"], "«Am Abend lernt er Deutsch für die B2-Prüfung»."),
 "t-a1-19": ("Am Nachmittag besuche ich meinen Freund ___.", ["Karim"], "«Am Nachmittag besuche ich meinen Freund Karim»."),
 "t-a1-20": ("Der Arzt schreibt ein ___.", ["Rezept"], "«Er schreibt ein Rezept» — الوصفةُ الطبية."),
}
def main():
    t=json.load(open(P,encoding="utf8"))
    n=0
    for x in t:
        if x["id"] in FILL:
            prompt, answers, erkl = FILL[x["id"]]
            qid=f'{x["id"]}-q4'
            assert all(q["id"]!=qid for q in x["questions"]), qid
            x["questions"].append({"id":qid,"type":"fill","promptDe":prompt,"answer":answers,"explanationAr":erkl})
            n+=1
    json.dump(t,open(P,"w",encoding="utf8"),ensure_ascii=False,indent=1)
    import collections
    print("أُضيف:",n,"| الأسئلة:",sum(len(x["questions"]) for x in t),
          dict(collections.Counter(q["type"] for x in t for q in x["questions"])))
main()
