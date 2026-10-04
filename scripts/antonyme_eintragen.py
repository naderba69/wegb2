#!/usr/bin/env python3
# إدخال المرادفات والأضداد (R29) — يحلّ de إلى البطاقة ويكتب syn/ant.
# يفشل بصوت عالٍ عند: de مفقود/مكرر، صفة بلا ضدّ ولا استثناء، استثناء بلا بطاقة.
import json, collections

def laden():
    v = json.load(open("content/vocab.json", encoding="utf-8"))
    packs = v if isinstance(v, list) else list(v.values())
    karten = [c for p in packs for c in p.get("cards", [])]
    return v, karten

def main():
    v, karten = laden()
    nach_de = collections.defaultdict(list)
    for c in karten:
        nach_de[c["de"]].append(c)
    ant = json.load(open("content/antonyme.json", encoding="utf-8"))
    syn = json.load(open("content/synonyme.json", encoding="utf-8"))
    aus = json.load(open("content/ant-ausnahmen.json", encoding="utf-8"))["ausnahmen"]
    aus_de = {a["de"] for a in aus}

    def einzige(de, quelle):
        treffer = nach_de.get(de, [])
        assert len(treffer) == 1, f"{quelle}: «{de}» يطابق {len(treffer)} بطاقة (مطلوب 1)"
        return treffer[0]

    for de, worte in ant.items():
        c = einzige(de, "antonyme")
        assert isinstance(worte, list) and worte and all(isinstance(w, str) and w.strip() for w in worte), de
        c["ant"] = worte
    for de, worte in syn.items():
        c = einzige(de, "synonyme")
        assert isinstance(worte, list) and worte and all(isinstance(w, str) and w.strip() for w in worte), de
        c["syn"] = worte

    # تغطية الصفات: كل صفة لها ضدّ أو استثناء معلَن
    nackt = [c["de"] for c in karten if c.get("pos") == "Adjektiv" and not c.get("ant") and c["de"] not in aus_de]
    assert not nackt, f"صفات بلا ضدّ ولا استثناء ({len(nackt)}): {nackt[:10]}"
    for a in aus:
        treffer = nach_de.get(a["de"], [])
        assert len(treffer) == 1 and treffer[0].get("pos") == "Adjektiv", f"استثناء بلا صفة: {a['de']}"
        assert len(a.get("grund", "")) >= 10, f"استثناء بلا تعليل: {a['de']}"
    assert len(aus) <= 15, f"الاستثناءات {len(aus)} تتجاوز السقف 15"
    # لا بطاقة تحمل الكلمة نفسها مرادفاً/ضدّاً لذاتها
    for c in karten:
        for w in (c.get("syn") or []) + (c.get("ant") or []):
            assert w.strip().lower() != c["de"].strip().lower(), f"مرادفة ذاتية: {c['de']}"

    raw0 = open("content/vocab.json", encoding="utf-8").read()
    indent = 2 if '{\n  "' in raw0[:400] else None
    with open("content/vocab.json", "w", encoding="utf-8") as f:
        json.dump(v, f, ensure_ascii=False, indent=indent)
        f.write("\n")
    n_ant = sum(1 for c in karten if c.get("ant"))
    n_syn = sum(1 for c in karten if c.get("syn"))
    print(f"EINGETRAGEN ant={n_ant} syn={n_syn} ausnahmen={len(aus)}")

if __name__ == "__main__":
    main()
