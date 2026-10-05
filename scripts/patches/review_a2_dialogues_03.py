#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Two confirmed Arabic corrections from the source-based A2 dialogue review batch 03.

The script is intentionally narrow and idempotent: it changes only the Arabic
translations of d-a2-05.lines[3] and d-a2-06.lines[0], and refuses unexpected
source text.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "dialogues.json"
PATCHES = [
    (
        "d-a2-05",
        3,
        "أوه! لا مشكلة. هل كنت مريضاً؟",
        "أوه! لا مشكلة. هل كنتِ مريضة؟",
    ),
    (
        "d-a2-06",
        0,
        "طاب يومكم. اشتريت هذه السترة أمس لكنها صغيرة.",
        "طاب يومكم. اشتريت هذه الكنزة أمس، لكنها أصغر من اللازم.",
    ),
]

raw = TARGET.read_text(encoding="utf-8")
data = json.loads(raw)
for dialogue_id, line_index, expected_before, expected_after in PATCHES:
    dialogue = next((item for item in data if item.get("id") == dialogue_id), None)
    if dialogue is None or len(dialogue.get("lines", [])) <= line_index:
        raise SystemExit(f"Expected live line not found: {dialogue_id}.lines[{line_index}]")
    current = dialogue["lines"][line_index].get("ar")
    if current not in {expected_before, expected_after}:
        raise SystemExit(
            f"Refusing unexpected text in {dialogue_id}.lines[{line_index}].ar: {current!r}"
        )

# Apply each exact serialized string only once; JSON is parsed again before write.
updated = raw
for dialogue_id, line_index, expected_before, expected_after in PATCHES:
    if data[next(i for i, item in enumerate(data) if item.get("id") == dialogue_id)]["lines"][line_index]["ar"] == expected_after:
        continue
    old_literal = json.dumps(expected_before, ensure_ascii=False)
    new_literal = json.dumps(expected_after, ensure_ascii=False)
    if updated.count(old_literal) != 1:
        raise SystemExit(f"Expected exactly one serialized occurrence of {old_literal!r}")
    updated = updated.replace(old_literal, new_literal, 1)

parsed = json.loads(updated)
for dialogue_id, line_index, _, expected_after in PATCHES:
    patched = next(item for item in parsed if item.get("id") == dialogue_id)
    if patched["lines"][line_index].get("ar") != expected_after:
        raise SystemExit(
            f"Post-edit verification failed for {dialogue_id}.lines[{line_index}]; file was not written"
        )
if updated != raw:
    TARGET.write_text(updated, encoding="utf-8")
    print("Corrected: d-a2-05.lines[3].ar and d-a2-06.lines[0].ar")
else:
    print("Already applied: d-a2-05.lines[3].ar and d-a2-06.lines[0].ar")
