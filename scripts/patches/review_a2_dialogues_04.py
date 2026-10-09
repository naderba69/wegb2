#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply the two source-confirmed Arabic corrections from A2 dialogue batch 04.

This narrow, idempotent patch changes only d-a2-08-q2.explanationAr and
 d-a2-09.lines[1].ar, and refuses unexpected source text.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "dialogues.json"
PATCHES = [
    (
        "d-a2-08",
        "question",
        "d-a2-08-q2",
        "explanationAr",
        "الدليل: «Ich gebe Ihnen Lutschtabletten und einen Tee». الفخّ 1: الماء نصيحة للشرب لا دواء. الفخّ 2: «schlucken» ذُكر كألم. الفخّ 3: الماء لا يُباع هنا.",
        "الدليل: «Ich gebe Ihnen Lutschtabletten und einen Tee». الفخّ 1: «Trinken Sie viel Wasser!» نصيحة للشرب، لا ضمن ما قالت الصيدلانية إنها ستعطيه. الفخّ 2: «schlucken» ورد في وصف ألم البلع، لا كنوع الأقراص. الفخّ 3: لا يذكر الحوار شراء الماء.",
    ),
    (
        "d-a2-09",
        "line",
        1,
        "ar",
        "الثانية عشرة والنصف، الرصيف الخامس.",
        "الساعة الثانية والنصف بعد الظهر، على الرصيف الخامس.",
    ),
]

raw = TARGET.read_text(encoding="utf-8")
data = json.loads(raw)

def field_value(dialogue_id, collection, key, field):
    dialogue = next((item for item in data if item.get("id") == dialogue_id), None)
    if dialogue is None:
        raise SystemExit(f"Expected live dialogue not found: {dialogue_id}")
    entries = dialogue.get("questions" if collection == "question" else "lines", [])
    entry = next((item for item in entries if item.get("id") == key), None) if collection == "question" else (
        entries[key] if isinstance(key, int) and 0 <= key < len(entries) else None
    )
    if entry is None:
        raise SystemExit(f"Expected live {collection} not found: {dialogue_id}/{key}")
    return entry.get(field)

for dialogue_id, collection, key, field, expected_before, expected_after in PATCHES:
    current = field_value(dialogue_id, collection, key, field)
    if current not in {expected_before, expected_after}:
        raise SystemExit(
            f"Refusing unexpected text in {dialogue_id}/{key}.{field}: {current!r}"
        )

updated = raw
for dialogue_id, collection, key, field, expected_before, expected_after in PATCHES:
    if field_value(dialogue_id, collection, key, field) == expected_after:
        continue
    old_literal = json.dumps(expected_before, ensure_ascii=False)
    new_literal = json.dumps(expected_after, ensure_ascii=False)
    if updated.count(old_literal) != 1:
        raise SystemExit(f"Expected exactly one serialized occurrence of {old_literal!r}")
    updated = updated.replace(old_literal, new_literal, 1)

parsed = json.loads(updated)
for dialogue_id, collection, key, field, _, expected_after in PATCHES:
    dialogue = next(item for item in parsed if item.get("id") == dialogue_id)
    entries = dialogue["questions" if collection == "question" else "lines"]
    entry = next(item for item in entries if item.get("id") == key) if collection == "question" else entries[key]
    if entry.get(field) != expected_after:
        raise SystemExit(
            f"Post-edit verification failed for {dialogue_id}/{key}.{field}; file was not written"
        )

if updated != raw:
    TARGET.write_text(updated, encoding="utf-8")
    print("Corrected: d-a2-08-q2.explanationAr and d-a2-09.lines[1].ar")
else:
    print("Already applied: d-a2-08-q2.explanationAr and d-a2-09.lines[1].ar")
