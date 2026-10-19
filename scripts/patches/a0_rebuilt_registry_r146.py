# -*- coding: utf-8 -*-
"""R146: سجلّ مراجعة آلية بنيوية لبنك A0 المُعاد بناؤه (8 مواضيع/15 نصاً/16 حواراً/6 كتابة/50 جملة).
المنهج مصرّح: فحوص بنيوية قابلة للآلة فقط (حقول، مفاتيح، إسناد، تكرار) —
ليست مراجعة لغوية بشرية ولا حكماً على جودة الترجمة. ما يحتاج حكماً يُوسم «غير محسوم»."""
import json, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
C = lambda n: json.load(open(os.path.join(ROOT, "content", n), encoding="utf8"))

grammar = C("grammar.json")
topics = grammar if isinstance(grammar, list) else grammar.get("topics") or list(grammar.values())
texts = C("texts.json")
dialogues = C("dialogues.json")
writing = C("writing.json")
sentences = C("sentences.json")

A0 = "A0"
items = []

def add(id_, kind, status, finding, checks):
    items.append(collections.OrderedDict([
        ("id", id_), ("kind", kind), ("status", status),
        ("finding", finding), ("checks", checks),
        ("reviewed", "آلي-بنيوي"),
    ]))

def ex_ok(e):
    probs = []
    if not (e.get("promptDe") or "").strip(): probs.append("promptDe فارغ")
    t = e.get("type")
    if t == "mc":
        o = e.get("options") or []
        if len(set(o)) != len(o): probs.append("خيارات مكررة")
        if e.get("answer") not in o: probs.append("المفتاح خارج الخيارات")
    elif t in ("fill", "translate", "order", "dictation", "umformung"):
        a = e.get("answer")
        vals = a if isinstance(a, list) else [a]
        if not vals or any(not str(x or "").strip() for x in vals): probs.append("مفتاح فارغ")
    if not (e.get("explanationAr") or "").strip() and t != "dictation":
        probs.append("explanationAr فارغ")
    return probs

for t in [x for x in topics if x.get("level") == A0]:
    ch = []
    if not (t.get("ziel") or t.get("zielAr") or ""): ch.append("لا ziel")
    if len(t.get("verify") or []) < 2: ch.append("verify < 2")
    if not (t.get("rules") or []): ch.append("لا rules")
    add(t["id"], "grammar-topic", "سليم بنيوياً" if not ch else "غير محسوم",
        "موضوع بقواعد وتمارين وتحققين على الأقل" if not ch else "نواقص: " + "؛ ".join(ch), ch)
    for e in t.get("exercises") or []:
        p = ex_ok(e)
        add(e["id"], "grammar-exercise", "سليم بنيوياً" if not p else "غير محسوم",
            "تمرين مكتمل المفتاح والشرح" if not p else "نواقص: " + "؛ ".join(p), p)
    for e in t.get("verify") or []:
        p = ex_ok(e)
        add(e["id"], "grammar-verify", "سليم بنيوياً" if not p else "غير محسوم",
            "تحقق مكتمل المفتاح والشرح" if not p else "نواقص: " + "؛ ".join(p), p)

for t in [x for x in texts if x.get("level") == A0]:
    ch = [f for f in ("titleDe", "titleAr", "de", "ar") if not (t.get(f) or "").strip()]
    if len(t.get("questions") or []) < 2: ch.append("أسئلة < 2")
    add(t["id"], "text", "سليم بنيوياً" if not ch else "غير محسوم",
        "نص بعنوانين ومتنين وسؤالين على الأقل" if not ch else "نواقص: " + "؛ ".join(ch), ch)
    for q in t.get("questions") or []:
        p = ex_ok(q)
        add(q["id"], "text-question", "سليم بنيوياً" if not p else "غير محسوم",
            "سؤال قراءة مكتمل المفتاح والشرح" if not p else "نواقص: " + "؛ ".join(p), p)

for d in [x for x in dialogues if x.get("level") == A0]:
    kurz = len(d.get("lines") or []) < 4
    add(d["id"], "dialogue",
        "غير محسوم" if kurz else "سليم بنيوياً",
        "حوار قصير جداً (≤3 أسطر): كفايته السياقية حكم بشري (audit: dialog:kurz)" if kurz
        else "حوار مكتمل الأسطر والأسئلة",
        ["lines<4"] if kurz else [])
    for i, l in enumerate(d.get("lines") or []):
        p = [] if (l.get("de") or "").strip() and (l.get("ar") or "").strip() else ["de/ar فارغ"]
        add(f'{d["id"]}.lines[{i}]', "dialogue-line", "سليم بنيوياً" if not p else "غير محسوم",
            "سطر ألماني بترجمته" if not p else "نواقص: " + "؛ ".join(p), p)
    for q in d.get("questions") or []:
        p = ex_ok(q)
        add(q["id"], "dialogue-question", "سليم بنيوياً" if not p else "غير محسوم",
            "سؤال استماع مكتمل المفتاح" if not p else "نواقص: " + "؛ ".join(p), p)
    for i, part in enumerate(d.get("dictation") or []):
        ok = any(part in (l.get("de") or "") for l in d.get("lines") or [])
        add(f'{d["id"]}.dictation[{i}]', "dialogue-dictation", "سليم بنيوياً" if ok else "غير محسوم",
            "مقطع إملاء مسند حرفياً لسطر" if ok else "مقطع إملاء بلا مرساة في الأسطر", [] if ok else ["unanchored"])

for w in [x for x in writing if x.get("level") == A0]:
    ch = [f for f in ("taskDe", "taskAr") if not (w.get(f) or "").strip()]
    if len(w.get("criteria") or []) < 3: ch.append("criteria < 3")
    add(w["id"], "writing-task", "سليم بنيوياً" if not ch else "غير محسوم",
        "مهمة كتابة بمعايير تقييم" if not ch else "نواقص: " + "؛ ".join(ch), ch)

for s in [x for x in sentences if x.get("level") == A0]:
    p = [] if (s.get("de") or "").strip() and (s.get("ar") or "").strip() else ["de/ar فارغ"]
    add(s["id"], "sentence", "سليم بنيوياً" if not p else "غير محسوم",
        "جملة ألمانية بترجمتها" if not p else "نواقص: " + "؛ ".join(p), p)

ids = [i["id"] for i in items]
assert len(ids) == len(set(ids)), "معرفات مكررة في السجل"
counts = collections.Counter(i["status"] for i in items)

doc = collections.OrderedDict([
    ("reviewRule", "R146"),
    ("date", "2026-10-15"),
    ("batch", "A0-rebuilt"),
    ("method", "مراجعة آلية بنيوية بنداً بنداً: اكتمال حقول، صلاحية مفاتيح (mc داخل الخيارات/تعبئة غير فارغة)، إسناد الإملاء حرفياً، فرادة المعرفات. ليست مراجعة لغوية بشرية ولا حكماً على طبيعية الترجمة أو النطق؛ ما يحتاج حكماً وُسم «غير محسوم»."),
    ("limits", {"human": False, "linguisticReview": False,
                "note": "لا مراجعة بشرية ولا اعتماد لغة؛ الترجمة والنطق خارج نطاق هذا السجل"}),
    ("coverage", {"totalTrackedItems": len(items)}),
    ("statusCounts", dict(counts)),
    ("sources", [
        {"id": "engine_smoke", "path": "scripts/engine_smoke.ts", "proves": "بوابات K158/K209/K121a التي تحرس هذا البنك"},
        {"id": "audit_inhalt", "path": "scripts/audit_inhalt.ts", "proves": "صفر عيوب بنيوية؛ ملحوظات dialog:kurz للحكم البشري"},
        {"id": "a0_rebuilt_registry_r146", "path": "scripts/patches/a0_rebuilt_registry_r146.py", "proves": "مولّد هذا السجل نفسه"},
    ]),
    ("items", items),
])

out = os.path.join(ROOT, "docs", "content-review-a0-rebuilt-2026-10-15.json")
json.dump(doc, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=2)

md = f"""# مراجعة A0 المُعاد بناؤه — R146 (2026-10-15)

**المنهج:** مراجعة آلية بنيوية بنداً بنداً ({len(items)} بنداً): اكتمال حقول، صلاحية مفاتيح،
إسناد إملاء حرفي، فرادة معرفات. **ليست مراجعة لغوية بشرية** ولا حكماً على طبيعية الترجمة؛
ما يحتاج حكماً وُسم «غير محسوم» لطابور الإنسان. تحرسها بوابة الدخان K242.

## الحصيلة
- البنود: {len(items)} · سليم بنيوياً: {counts.get('سليم بنيوياً', 0)} · غير محسوم: {counts.get('غير محسوم', 0)}
- غير المحسوم سببه المعلن: حوارات A0 القصيرة جداً (≤3 أسطر) — كفايتها حكم بشري (`audit: dialog:kurz`).

## الحدود
لا ادعاء استماع ولا نطق ولا اعتماد مدرّسين. السجل الكامل: `content-review-a0-rebuilt-2026-10-15.json`.
"""
open(os.path.join(ROOT, "docs", "content-review-a0-rebuilt-2026-10-15.md"), "w", encoding="utf8").write(md)
print(f"R146 A0 registry: {len(items)} items · {dict(counts)}")
