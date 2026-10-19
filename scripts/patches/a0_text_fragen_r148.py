# -*- coding: utf-8 -*-
"""R148: سؤال ثالث لكل نصّ A0 (15 نصاً) — مؤلّف من متن النصّ نفسه ومفتاحه حرفيّ فيه.
يُضاف فقط إن غاب (idempotent). يعيد K209j إلى معياره الأصلي ≥3 أسئلة لكلّ نصّ.
الفحوص الذاتية قبل الكتابة: mc مفتاحه ضمن خيارات فريدة، واقتباس الشرح موجود حرفياً في النصّ."""
import json, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, "content", "texts.json")
T = json.load(open(P, encoding="utf8"), object_pairs_hook=collections.OrderedDict)
by_id = {t["id"]: t for t in T}

def Q(tid, qtype, promptDe, promptAr, answer, expl, options=None):
    q = collections.OrderedDict()
    q["type"] = qtype
    q["promptDe"] = promptDe
    q["promptAr"] = promptAr
    if options is not None:
        q["options"] = options
    q["answer"] = answer
    q["explanationAr"] = expl
    q["id"] = f"{tid}-q3"
    return q

NEU = {
  "t-a0-01": Q("t-a0-01", "mc", "Woher kommt Ali?", "من أين يأتي علي؟",
               "Aus Tunesien", "النص يقول: «Ich komme aus Tunesien».",
               ["Aus Berlin", "Aus Tunesien", "Aus München", "Aus Köln"]),
  "t-a0-02": Q("t-a0-02", "fill", "Meine ___ ist 0176 12345678.", "أكمل الفراغ بالكلمة المناسبة من النص.",
               ["Telefonnummer"], "النص يقول: «Meine Telefonnummer ist 0176 12345678»."),
  "t-a0-03": Q("t-a0-03", "mc", "In welcher Straße wohnt Fatima?", "في أيّ شارع تسكن فاطمة؟",
               "In der Goethestraße", "النص يقول: «Ich wohne in der Goethestraße».",
               ["In der Schulstraße", "In der Goethestraße", "In der Bahnhofstraße", "In der Gartenstraße"]),
  "t-a0-04": Q("t-a0-04", "mc", "Welche Farbe hat die Schokolade?", "ما لون الشوكولاتة؟",
               "braun", "النص يقول: «Die Schokolade ist braun».",
               ["weiß", "grün", "braun", "schwarz"]),
  "t-a0-05": Q("t-a0-05", "mc", "Wo wohnen Karim und seine Familie?", "أين يسكن كريم وعائلته؟",
               "In Köln", "النص يقول: «Wir wohnen in Köln».",
               ["In Berlin", "In Hamburg", "In Köln", "In München"]),
  "t-a0-06": Q("t-a0-06", "mc", "Wie ist die Lehrerin?", "كيف هي المعلمة؟",
               "sehr nett", "النص يقول: «Sie ist sehr nett».",
               ["streng", "sehr nett", "alt", "laut"]),
  "t-a0-07": Q("t-a0-07", "mc", "Was macht er am Donnerstag?", "ماذا يفعل يوم الخميس؟",
               "Er trifft seine Freunde", "النص يقول: «Am Donnerstag treffe ich meine Freunde».",
               ["Er geht zur Arbeit", "Er kauft ein", "Er trifft seine Freunde", "Er schläft lange"]),
  "t-a0-08": Q("t-a0-08", "mc", "Was trinkt er zum Abendbrot?", "ماذا يشرب في العشاء؟",
               "Tee", "النص يقول: «Zum Abendbrot trinke ich Tee».",
               ["Kaffee", "Tee", "Wasser", "Saft"]),
  "t-a0-09": Q("t-a0-09", "mc", "Um wie viel Uhr geht er ins Bett?", "في أيّ ساعة يذهب إلى الفراش؟",
               "Um 23 Uhr", "النص يقول: «Um 23 Uhr gehe ich ins Bett».",
               ["Um 19 Uhr", "Um 17 Uhr", "Um 12 Uhr", "Um 23 Uhr"]),
  "t-a0-10": Q("t-a0-10", "mc", "Welche Jahreszeit mag er am liebsten?", "أيّ فصل يحبّه أكثر؟",
               "Den Frühling", "النص يقول: «Ich mag den Frühling am liebsten».",
               ["Den Winter", "Den Frühling", "Den Sommer", "Den Herbst"]),
  "t-a0-011": Q("t-a0-011", "mc", "Wie viele Hefte sind in der Tasche?", "كم دفتراً في الحقيبة؟",
                "drei", "النص يقول: «In der Tasche sind drei Hefte».",
                ["zwei", "drei", "vier", "fünf"]),
  "t-a0-012": Q("t-a0-012", "mc", "Wen besucht er am Sonntag?", "مَن يزور يوم الأحد؟",
                "Seine Mutter", "النص يقول: «Am Sonntag besuche ich meine Mutter».",
                ["Seinen Hund", "Seine Freunde", "Seine Mutter", "Seinen Vater"]),
  "t-a0-013": Q("t-a0-013", "mc", "Was braucht er heute nicht?", "ما الذي لا يحتاجه اليوم؟",
                "Eine Jacke", "النص يقول: «Ich brauche keine Jacke».",
                ["Ein T-Shirt", "Eine Jeans", "Eine Jacke", "Einen Garten"]),
  "t-a0-014": Q("t-a0-014", "mc", "Was bestellt er heute?", "ماذا يطلب اليوم؟",
                "Eine Suppe und ein Schnitzel", "النص يقول: «Heute bestelle ich eine Suppe und ein Schnitzel mit Kartoffeln».",
                ["Eine Pizza", "Einen Salat", "Ein Brot", "Eine Suppe und ein Schnitzel"]),
  "t-a0-015": Q("t-a0-015", "mc", "Was macht er in der Küche?", "ماذا يفعل في المطبخ؟",
                "Er macht Kaffee", "النص يقول: «In der Küche mache ich Kaffee».",
                ["Er schläft", "Er macht Kaffee", "Er sieht fern", "Er liest ein Buch"]),
}

import re
added = 0
for tid, q in NEU.items():
    t = by_id[tid]
    assert t["level"] == "A0"
    if any(x["id"] == q["id"] for x in t["questions"]):
        continue
    assert q["promptAr"].strip() and q["explanationAr"].strip()
    if q["type"] == "mc":
        assert q["answer"] in q["options"] and len(set(q["options"])) == len(q["options"]) == 4
    else:
        assert isinstance(q["answer"], list) and q["answer"] and all(a.strip() for a in q["answer"])
    for quote in re.findall(r"«([^»]+)»", q["explanationAr"]):
        assert quote in t["de"], (tid, quote)
    t["questions"].append(q)
    added += 1

json.dump(T, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"R148 A0 third questions added: {added} (A0 texts now all >=3 questions)")
