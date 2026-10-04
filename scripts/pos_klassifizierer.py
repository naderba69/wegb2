#!/usr/bin/env python3
# مصنّف نوع الكلمة (R30) — يوسم كل بطاقة مفردات بـ pos من مفردات محكومة.
# يعمل على نسخة: --dry يعرض المجموعات للمراجعة، --apply يكتب content/vocab.json.
# المفردات المحكومة: Nomen Verb Adjektiv Adverb Pronomen Präposition Konjunktion
#                    Artikel Zahl Interjektion Wendung Satz
import json, sys, collections

POS = ["Nomen","Verb","Adjektiv","Adverb","Pronomen","Präposition","Konjunktion",
       "Artikel","Zahl","Interjektion","Wendung","Satz"]

ZAHL = {"eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf",
        "dreizehn","fünfzehn","zwanzig","dreißig","fünfzig","hundert","hundertzwanzig","tausend",
        "erste","zweite","dritte","letzte","nächste","einmal","zweimal"}
ADVERB = {"heute","morgen","gestern","jetzt","bald","spät","immer","oft","manchmal","selten","nie",
          "vorgestern","übermorgen","zuerst","danach","zuletzt","morgens","mittags","abends","nachts",
          "täglich","wöchentlich","hier","dort","oben","unten","draußen","drinnen","überall","irgendwo",
          "nirgendwo","links","rechts","geradeaus","dann","deshalb","auch","nur","noch","schon","sehr",
          "wieder","vielleicht","leider","gern","damals","früher","plötzlich","schließlich","inzwischen",
          "seitdem","neulich","trotzdem","außerdem","jedoch","dennoch","allerdings","folglich","daher",
          "einerseits","zunächst","anschließend","abschließend","einleitend","letztlich","erstens","zweitens",
          "dabei","hierbei","früh","zusammen"}
PRAEP = {"an","auf","in","unter","über","neben","vor","hinter","gegenüber","bei","mit","ohne","für","nach",
         "zu","aus","seit","bis","um","durch","zwischen","aufgrund","infolge","anlässlich","mangels",
         "zwecks","gemäß","entgegen","dank","statt","außerhalb","bezüglich","unweit","binnen","hinsichtlich",
         "inklusive","mitten","jenseits","innerhalb"}
KONTRAHIERT = {"zum","zur","am","im","ins","ans","aufs","beim","vom"}
KONJ = {"und","aber","oder","denn","weil","damit","obwohl","während","bevor","nachdem","sobald"}
PRON = {"wer","was","wo","wohin","woher","wann","warum","wie","welcher","alle","etwas","nichts",
        "jemand","niemand","viel","wenig","genug"}
INTERJ = {"hallo","tschüss","danke","bitte"}
ARTIKEL = {"der","die","das"}
SATZ_START = {"ich","es","wir","das","da","so","deshalb","leider","genau","nehmen","wollen","darf",
              "kann","könnten","machen","verstehe","entschuldigen","wie","was","mir","soweit",
              "wenn","als","weil","dass","ob"}
ART_START = {"der","die","das","den","dem","des","ein","eine","einer","eines","einem","einen"}
# ما قبل المصدر ينفيه: صفة/أداة مصرّفة بعد حرف/أداة ليست مصدراً (jeden ← auf، einen ← der)
VOR_NICHT_INF = PRAEP | KONTRAHIERT | ART_START | {"kein","keine","keinen","keinem","keiner","keines",
    "mein","meine","meiner","meinen","meinem","meines","dein","deine","deiner","deinen","deinem","deines",
    "sein","seine","seiner","seinen","seinem","seines","ihr","ihre","ihrer","ihren","ihrem","ihres",
    "unser","unsere","euer","eure","dieser","diese","dieses","jeder","jede","jedes","alle","alles",
    "manche","manches","solche","solches","welche","welches"}


# تجاوزات صريحة (مراجَعة يدوياً واحدة واحدة)
OVERRIDE = {
  # مفرد كبير غير اسمي
  "Einverstanden": "Adjektiv", "Zusammengefasst": "Adjektiv", "Glücklicherweise": "Adverb",
  # أفعال منعكسة بصيغة مصدر+ضمير في الوسط/الأخير تُمسكها القواعد؛ ما بقي:
  "um zu": "Konjunktion", "mitten in": "Präposition", "jenseits von": "Präposition",
  "wie viel": "Wendung",
  # صفة+حرف/صفة مركبة
  "stolz auf": "Adjektiv", "gut gelaunt": "Adjektiv", "gentechnisch verändert": "Adjektiv",
  "dicht bebaut": "Adjektiv", "zuständig für": "Adjektiv",
  # جمل كاملة لا تبدأ ببادئة Satz
  "auf dem Bild sieht man": "Satz", "zusammenfassend lässt sich sagen": "Satz",
  "hiermit teile ich Ihnen mit": "Satz", "im Anhang finden Sie": "Satz",
  "bestellen wir getrennt": "Satz", "Es ist halb acht": "Satz",
  "Bezug nehmend auf": "Wendung",
  "Viertel vor": "Wendung", "Viertel nach": "Wendung", "Punkt zwölf": "Wendung",
  "Schade, dass": "Wendung", "Kein Problem": "Wendung", "Kein Wunder": "Wendung",
  "Alles klar": "Wendung",
  # بادئة Das لكنها جمل (أداة+فعل محدود لا اسم)
  "Das Wichtigste ist": "Satz", "Das führt dazu, dass": "Satz",
  "Das hängt davon ab, ob": "Satz", "Das ist eine gute Frage": "Satz",
  "Das ist mir zu teuer": "Satz", "Das ist sehr aufmerksam von Ihnen": "Satz",
  "Das kommt darauf an": "Satz", "Das sehe ich anders": "Satz",
  "Das war nicht meine Absicht": "Satz",
  # صيغ ثابتة وأشباه جمل
  "Vielen Dank im Voraus": "Wendung", "herzlichen Dank im Voraus": "Wendung",
  "Herzlichen Glückwunsch": "Wendung", "verbleiben mit freundlichen Grüßen": "Wendung",
  "es kommt an auf": "Verb", "laut Aussage": "Wendung",
  # مفردات خادعة
  "angesichts": "Präposition", "hoffentlich": "Adverb", "vermutlich": "Adverb",
  # صفات/أسماء بصيغة -en خادعة (ليست مصادر)
  "zufrieden": "Adjektiv", "trocken": "Adjektiv", "schüchtern": "Adjektiv",
  "geborgen": "Adjektiv",
  # صفات بصيغة اسم المفعول -en (مراجعة قائمة الأفعال المفردة)
  "angemessen": "Adjektiv", "ausgeschlossen": "Adjektiv", "ausgewogen": "Adjektiv",
  "betroffen": "Adjektiv", "bildungsfern": "Adjektiv", "gelassen": "Adjektiv",
  "geschlossen": "Adjektiv", "umstritten": "Adjektiv", "übertrieben": "Adjektiv",
  "verboten": "Adjektiv",
}


def ist_infinitiv(tok, prev=None):
    s0 = tok.strip(".,!?;:()")
    if not s0 or s0[0].isupper():
        return False  # المصدر الألماني صغير دائماً؛ الكبير اسم أو تصريف
    t = s0.lower()
    if prev is not None and prev.strip(".,!?;:()").lower() in VOR_NICHT_INF:
        return False  # بعد حرف/أداة: تصريف لا مصدر
    if t in ("sein", "tun"):
        return True
    if len(t) < 4 or t in ADVERB or t in PRAEP or t in ZAHL or t in KONJ or t in PRON:
        return False
    return t.endswith(("en", "ern", "eln"))


def klassifiziere(de):
    d = de.strip()
    if d in OVERRIDE:
        return OVERRIDE[d]
    toks = d.split()
    if len(toks) == 1:
        w = toks[0]
        if w[0].isupper():
            return "Nomen"
        wl = w.lower()
        if wl in ZAHL:
            return "Zahl"
        if wl in ADVERB:
            return "Adverb"
        if wl in PRAEP:
            return "Präposition"
        if wl in KONJ:
            return "Konjunktion"
        if wl in PRON:
            return "Pronomen"
        if wl in INTERJ:
            return "Interjektion"
        if wl in ARTIKEL:
            return "Artikel"
        if wl.endswith("erweise"):
            return "Adverb"
        if ist_infinitiv(w):
            return "Verb"
        return "Adjektiv"
    # متعدد الكلمات
    if "?" in d or "!" in d:
        return "Satz"
    t0 = toks[0].lower().strip(".,")
    if t0 in ART_START:
        return "Nomen"
    if t0 in ("kein", "keine", "keinen", "keinem", "keiner", "keines"):
        return "Wendung"
    if t0 == "sich" or any(t.lower() == "sich" for t in toks[1:]):
        pass  # يُفحص بعد بوادئ الجمل (Machen Sie sich … جملة)
    if t0 in SATZ_START:
        return "Satz"
    if t0 == "sich" or any(t.lower() == "sich" for t in toks[1:]):
        return "Verb"
    if any(ist_infinitiv(t, toks[i - 1] if i else None) for i, t in enumerate(toks)):
        return "Verb"
    if t0 in PRAEP or t0 in KONTRAHIERT:
        return "Wendung"
    first_low = toks[0][0].islower()
    last_cap = toks[-1][0].isupper()
    if first_low and last_cap:
        return "Nomen"
    return "Wendung"


def alle_karten():
    v = json.load(open("content/vocab.json", encoding="utf-8"))
    packs = v if isinstance(v, list) else list(v.values())
    out = []
    for p in packs:
        for c in p.get("cards", []):
            out.append(c)
    return packs, out


def main():
    dry = "--dry" in sys.argv
    v = json.load(open("content/vocab.json", encoding="utf-8"))
    packs = v if isinstance(v, list) else list(v.values())
    cards = [c for p in packs for c in p.get("cards", [])]
    print(f"CARDS {len(cards)}")
    cnt = collections.Counter()
    gruppen = collections.defaultdict(list)
    for c in cards:
        p = klassifiziere(c["de"])
        assert p in POS, p
        cnt[p] += 1
        if not dry:
            continue
        toks = c["de"].split()
        if len(toks) > 1:
            gruppen[p].append(c["de"])  # كل متعدد الكلمات للمراجعة
        elif c["de"][0].islower() and p == "Adjektiv":
            gruppen["ADJ-1"].append(c["de"])  # مفرد افتراضي=صفة للمراجعة
    print("VERTEILUNG " + " ".join(f"{k}={cnt[k]}" for k in POS if cnt[k]))
    if dry:
        for k in ("Satz", "Wendung", "Nomen", "Verb", "Adjektiv", "Adverb", "ADJ-1"):
            items = sorted(set(gruppen[k]))
            if not items:
                continue
            print(f"--- {k} ({len(items)}) ---")
            for w in items:
                print("  " + w)
        return
    # --apply: اكتب pos (+posInfo من القيم القديمة) مع الحفاظ على ترتيب المفاتيح
    n_info = 0
    for c in cards:
        alt = (c.get("pos") or "").strip()
        info = None
        if alt.startswith("V ") or alt.startswith("V("):
            inner = alt[1:].strip()
            if inner.startswith("(") and inner.endswith(")"):
                inner = inner[1:-1]
            info = inner or None
        neu = klassifiziere(c["de"])
        ordered = {}
        for k, val in c.items():
            if k == "pos":
                continue
            ordered[k] = val
            if k == "ar":
                ordered["pos"] = neu
                if info:
                    ordered["posInfo"] = info
                    n_info += 1
        if "pos" not in ordered:
            ordered["pos"] = neu
        c.clear()
        c.update(ordered)
    raw0 = open("content/vocab.json", encoding="utf-8").read()
    indent = 2 if '{\n  "' in raw0[:400] else None
    with open("content/vocab.json", "w", encoding="utf-8") as f:
        json.dump(v, f, ensure_ascii=False, indent=indent)
        f.write("\n")
    print(f"APPLIED posInfo={n_info}")


if __name__ == "__main__":
    main()
