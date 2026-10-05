#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply the one source-confirmed Arabic precision correction for A2 batch 05.

Only d-a2-12.lines[3].ar changes: steigen auf 27 Grad must retain the
meaning of a rise, not merely a value being reached. The weather value itself
remains unverified because the dialogue gives no forecast location/date.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "dialogues.json"
DIALOGUE_ID = "d-a2-12"
LINE_INDEX = 3
FIELD = "ar"
EXPECTED_BEFORE = "تصل الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل."
EXPECTED_AFTER = "ترتفع درجة الحرارة إلى 27 درجة. ليس حرّاً شديداً لكنه دافئ جداً لشهر أبريل."

raw = TARGET.read_text(encoding="utf-8")
data = json.loads(raw)
dialogue = next((item for item in data if item.get("id") == DIALOGUE_ID), None)
if dialogue is None or len(dialogue.get("lines", [])) <= LINE_INDEX:
    raise SystemExit(f"Expected live line not found: {DIALOGUE_ID}.lines[{LINE_INDEX}]")
line = dialogue["lines"][LINE_INDEX]
if line.get("de") != "Die Temperatur steigt auf 27 Grad. Das ist keine Hitze, aber sehr warm für April.":
    raise SystemExit("Refusing unexpected German source text in d-a2-12.lines[3]")
if line.get(FIELD) not in {EXPECTED_BEFORE, EXPECTED_AFTER}:
    raise SystemExit(f"Refusing unexpected Arabic text in d-a2-12.lines[3]: {line.get(FIELD)!r}")

updated = raw
if line[FIELD] == EXPECTED_BEFORE:
    old_literal = json.dumps(EXPECTED_BEFORE, ensure_ascii=False)
    new_literal = json.dumps(EXPECTED_AFTER, ensure_ascii=False)
    if updated.count(old_literal) != 1:
        raise SystemExit("Expected exactly one serialized occurrence of the reviewed Arabic text")
    updated = updated.replace(old_literal, new_literal, 1)

parsed = json.loads(updated)
updated_dialogue = next(item for item in parsed if item.get("id") == DIALOGUE_ID)
updated_line = updated_dialogue["lines"][LINE_INDEX]
if updated_line.get("de") != line.get("de") or updated_line.get(FIELD) != EXPECTED_AFTER:
    raise SystemExit("Post-edit verification failed; file was not written")

if updated != raw:
    TARGET.write_text(updated, encoding="utf-8")
    print("Corrected only d-a2-12.lines[3].ar")
else:
    print("Already applied d-a2-12.lines[3].ar")
