# -*- coding: utf-8 -*-
"""R145/K121a: إكمال تحقّق الاستقلال الثاني للدروس الثمانية الناقصة + متطلب a0-begrussung.
تشغيل متكرر بلا أثر (يتخطى الموجود)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, "content", "grammar.json")
g = json.load(open(P, encoding="utf8"))

NEU = {
 "a0-aussprache-umlaut": [
   {"id": "a0-au-v2", "type": "mc",
    "promptDe": "Welches Wort hat den Umlaut ü?",
    "options": ["Tür", "Tor", "Tag"], "answer": "Tür",
    "explanationAr": "Tür فيها ü (باب)؛ Tor بـ o وTag بـ a — لا تخلط بين ü وu/o."}],
 "a1-aussprache-r": [
   {"id": "a1-ar-v2", "type": "mc",
    "promptDe": "Wie klingt das r in »rot« am Wortanfang?",
    "options": ["wie ein gerolltes arabisches r", "als schwacher Reibelaut hinten im Hals", "gar nicht — es bleibt stumm"],
    "answer": "als schwacher Reibelaut hinten im Hals",
    "explanationAr": "في بداية الكلمة r الألمانية رخوة من الحلق، لا تُلفّ كما في العربية: rot لا تُنطق براء مكررة."}],
 "a1-aussprache-sp-st": [
   {"id": "a1-as-v2", "type": "mc",
    "promptDe": "Wie wird »sprechen« ausgesprochen?",
    "options": ["s-preschen", "schprechen", "sp-rechen"], "answer": "schprechen",
    "explanationAr": "sp في بداية الكلمة = shp (شب): sprechen تُنطق شبريشن تقريباً — وكذلك spielen."}],
 "a1-aussprache-auslaut": [
   {"id": "a1-al-v2", "type": "mc",
    "promptDe": "Wie wird »Hund« am Ende ausgesprochen?",
    "options": ["mit weichem d", "mit t (Hunt)", "das d fällt weg"],
    "answer": "mit t (Hunt)",
    "explanationAr": "Auslautverhärtung: d في آخر الكلمة تُنطق t — Hund تُنطق «هونت»، وKind «كينت»."}],
 "a2-pruefungsstrategie": [
   {"id": "a2-ps-v2", "type": "mc",
    "promptDe": "Was tun Sie im Prüfungsteil Lesen zuerst?",
    "options": ["Die Aufgabe lesen und Schlüsselwörter markieren", "Sofort alle Antworten raten", "Nur den letzten Absatz lesen"],
    "answer": "Die Aufgabe lesen und Schlüsselwörter markieren",
    "explanationAr": "اقرأ المطلوب أولاً وعلّم الكلمات المفتاحية، ثم ابحث عنها في النص — لا تقرأ النص كاملاً قبل أن تعرف ما تبحث عنه."}],
 "b1-pruefungsstrategie": [
   {"id": "b1-ps-v2", "type": "mc",
    "promptDe": "Was gehört in den Hauptteil eines B1-Meinungsbeitrags?",
    "options": ["Argumente mit Begründung und Beispiel", "Nur die Schlussformel", "Die Adresse des Empfängers"],
    "answer": "Argumente mit Begründung und Beispiel",
    "explanationAr": "صلب المقال: حجج معلّلة مدعومة بمثال — المقدمة قبله والخاتمة بعده، لا خاتمة وحدها."}],
 "b2-pruefungsstrategie": [
   {"id": "b2-ps-v2", "type": "mc",
    "promptDe": "Was steigert die Bewertung Ihres B2-Kommentars am meisten?",
    "options": ["Gegenposition abwägen und dann ein klares Fazit ziehen", "Möglichst viele Fremdwörter aneinanderreihen", "Sehr lange Sätze ohne erkennbare Struktur schreiben"],
    "answer": "Gegenposition abwägen und dann ein klares Fazit ziehen",
    "explanationAr": "النضج الحجاجي: موازنة الرأي المقابل بإنصاف ثم خلاصة واضحة — هذا ما يميّز B2 عن B1."}],
 "a0-satzbau": [
   {"id": "a0-satzbau-v1", "type": "fill",
    "promptDe": "Heute ___ ich Kaffee. (trinke)",
    "text": "Heute ___ ich Kaffee.",
    "answer": ["trinke"],
    "explanationAr": "حين يبدأ الظرف الجملة يأتي الفعل أولاً ثم الفاعل: Heute trinke ich … ولا نقول Heute ich trinke."},
   {"id": "a0-satzbau-v2", "type": "translate",
    "promptDe": "قُل بالألمانية: أنا أسكن في برلين.",
    "answer": "Ich wohne in Berlin.",
    "keywords": ["wohne", "in", "Berlin"],
    "explanationAr": "الترتيب الثابت: فاعل ثم فعل ثم المكان: Ich wohne in Berlin."}],
}

n = 0
for tid, items in NEU.items():
    t = g[tid]
    t.setdefault("verify", [])
    have = {e["id"] for e in t["verify"]}
    for it in items:
        if it["id"] not in have:
            t["verify"].append(it); n += 1
if not g["a0-begrussung"].get("voraus"):
    g["a0-begrussung"]["voraus"] = ["a0-buchstaben"]; n += 1

json.dump(g, open(P, "w", encoding="utf8"), ensure_ascii=False, indent=2)
print(f"أُضيف {n} عنصراً — K121a: كل درس بهدف ومتطلب وتطبيق وتحققين")
