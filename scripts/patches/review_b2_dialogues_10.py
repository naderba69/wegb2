#!/usr/bin/env python3
"""R132 — review patch for B2 dialogues d-b2-31..d-b2-32 (last batch)."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D_PATH = ROOT / "content/dialogues.json"
D = json.loads(D_PATH.read_text(encoding="utf-8"))

FIXES: dict[str, list[tuple[str, str]]] = {
    "d-b2-31": [
        ("بأيِّ معنىً نفعتْكَ هذه المدّةُ مهنياً؟",
         "كيف أفادتْكَ هذه المدةُ مهنياً؟"),
        ("تعلَّمتُ ترتيبَ الأولوياتِ تحتَ الضغط، وهو ما ينفعُني يومياً اليوم.",
         "تعلَّمتُ ترتيبَ الأولوياتِ تحتَ الضغط، وهو ما يفيدُني يومياً في عملي."),
        ("سأفحصُ المهامَّ أوّلاً ثمَّ أنسّقُ الأولوياتِ جماعياً.",
         "سأستعرضُ المهامَّ أوّلاً ثمَّ أنسّقُ الأولوياتِ جماعياً."),
    ],
    "d-b2-32": [
        ("تحديدُ سرعةٍ عامٌّ سينقذُ أرواحاً ويخفضُ الانبعاثات.",
         "حدُّ سرعةٍ عامٍّ سينقذُ أرواحاً ويخفضُ الانبعاثات."),
        ("بهذا أقبل. إذن نحنُ متّفقانِ من حيثُ المبدأ.",
         "أقبلُ بهذا. إذن نحنُ متّفقانِ من حيثُ المبدأ."),
    ],
}

EXPECTED_FIXES = 5
applied = 0
de_locked = 0
by_id = {d["id"]: d for d in D}

for did, pairs in FIXES.items():
    dlg = by_id[did]
    de_locked += sum(1 for ln in dlg["lines"])
    used: set[int] = set()
    for old, new in pairs:
        found_old = found_new = False
        for li, ln in enumerate(dlg["lines"]):
            if ln["ar"] == new and li not in used:
                found_new = True
                used.add(li); break
            if ln["ar"] == old and li not in used:
                ln["ar"] = new; used.add(li); applied += 1; found_old = True; break
        if not (found_old or found_new):
            print(f"!!! {did} old/new-string not found: {old[:60]!r}", file=sys.stderr); sys.exit(1)

remaining = 0
for did, pairs in FIXES.items():
    for old, _ in pairs:
        if any(ln["ar"] == old for ln in by_id[did]["lines"]):
            remaining += 1
if remaining:
    print(f"!!! remaining old strings: {remaining}", file=sys.stderr); sys.exit(1)
for did in FIXES:
    for ln in by_id[did]["lines"]:
        assert all(k in ln for k in ("who","de","ar"))
D_PATH.write_text(json.dumps(D, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"<R132> patch complete · changes applied: {applied} · locked DE lines: {de_locked} · remaining old strings: {remaining}")
