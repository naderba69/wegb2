# -*- coding: utf-8 -*-
"""ξ7 — الدمجُ القابلُ للإعادة: 36 قديماً كما هي + 36 وافداً من /tmp/d18+d28."""
import json
ROOT = "/home/user/weg-nach-b2"
VF = f"{ROOT}/content/dialogues.json"
bank = json.load(open(VF, encoding="utf8"))
old, newz = bank[:36], []
ids = {d["id"] for d in old}
for tag, path in (("b1", "/tmp/d18.json"), ("b2", "/tmp/d28.json")):
    for (n, td, ta, A, B, lines, qs, dic) in json.load(open(path, encoding="utf8")):
        did = f"d-{tag}-{n:02d}"
        assert did not in ids, did
        ids.add(did)
        lvl = "B1" if tag == "b1" else "B2"
        e = {"id": did, "level": lvl, "titleDe": td, "titleAr": ta,
             "lines": [{"who": (A if i % 2 == 0 else B), "de": d, "ar": a} for i, (d, a) in enumerate(lines)],
             "questions": [{"id": f"{did}-q{j+1}", "type": "mc", "promptDe": p, "options": [o1, o2, o3],
                            "answer": (o1, o2, o3)[ai], "explanationAr": ex}
                           for j, (p, o1, o2, o3, ai, ex) in enumerate(qs)],
             "dictation": list(dic)}
        lde = {l["de"] for l in e["lines"]}
        for d in e["dictation"]:
            assert d in lde, (did, d[:30])
        for q in e["questions"]:
            assert q["answer"] in q["options"]
        newz.append(e)
assert len(old) == 36 and len(newz) == 36
json.dump(old + newz, open(VF, "w", encoding="utf8"), ensure_ascii=False, indent=1)
# نصوصُ الأصوات
texts = {}
for x in newz:
    parts = [x["titleDe"] + "."] + [f"{l['who']}: {l['de']}" for l in x["lines"]]
    t = " ".join(parts)
    assert len(t) <= 1500, (x["id"], len(t))
    texts[x["id"]] = {"t": t, "level": x["level"]}
json.dump(texts, open("/tmp/dialog_texts.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
print("البنك ← 72 · النصوصُ ← 36")
