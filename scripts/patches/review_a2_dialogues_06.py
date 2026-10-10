#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply the single confirmed Arabic correction in A2 review batch 06.

Only d-a2-13.lines[2].ar changes. Ambiguous or merely stylistic suggestions
for d-a2-14 and d-a2-15 are deliberately left untouched and guarded below.
This patch is idempotent and refuses unexpected live text.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "dialogues.json"
DIALOGUE_ID = "d-a2-13"
LINE_INDEX = 2
FIELD = "ar"
EXPECTED_DE = "Die Einarbeitung dauert vier Wochen. In dieser Zeit gibt es keinen Zeitdruck."
BEFORE = "فترة التأهيل تدوم أربعة أسابيع. في هذه الفترة لا ضغط وقت."
AFTER = "تستغرق فترة التهيئة في العمل أربعة أسابيع. وخلالها لا يوجد ضغط زمني."


def dialogue_by_id(data, dialogue_id):
    dialogue = next((item for item in data if item.get("id") == dialogue_id), None)
    if dialogue is None:
        raise SystemExit(f"Expected dialogue not found: {dialogue_id}")
    return dialogue


def check_protected_content(data):
    dialogue14 = dialogue_by_id(data, "d-a2-14")
    line = dialogue14["lines"][2]
    if line.get("de") != "Lang, aber die Landung war pünktlich. Ich habe nur ein kleines Gepäck.":
        raise SystemExit("Refusing to alter the ambiguous luggage wording without confirmed intent")
    if line.get("ar") != "طويلة، لكن الهبوط كان في موعده. معي أمتعة صغيرة فقط.":
        raise SystemExit("Refusing to alter the corresponding Arabic without confirmed intent")
    question = next((item for item in dialogue14["questions"] if item.get("id") == "d-a2-14-q2"), None)
    if question is None or question.get("promptDe") != "Wie viele Übernachtungen bleibt er?":
        raise SystemExit("Refusing to apply an optional style alternative as a confirmed correction")
    if question.get("options") != ["zwei", "drei", "eine Übernachtung"] or question.get("answer") != "drei":
        raise SystemExit("Refusing unexpected options/key for d-a2-14-q2")
    dialogue15 = dialogue_by_id(data, "d-a2-15")
    if dialogue15["lines"][1].get("de") != "Ja. Das Fleisch habe ich gestern aus dem Gefrierfach genommen, es ist aufgetaut.":
        raise SystemExit("Unexpected meat-thawing source text")
    if dialogue15["lines"][2].get("de") != "Gut. Zuerst den Backofen vorheizen, 180 Grad.":
        raise SystemExit("Unexpected recipe instruction; review the source before patching")


raw = TARGET.read_text(encoding="utf-8")
data = json.loads(raw)
dialogue13 = dialogue_by_id(data, DIALOGUE_ID)
line = dialogue13["lines"][LINE_INDEX]
if line.get("de") != EXPECTED_DE:
    raise SystemExit("Refusing unexpected German source text for d-a2-13.lines[2]")
if line.get(FIELD) not in (BEFORE, AFTER):
    raise SystemExit(f"Refusing unexpected Arabic text for {DIALOGUE_ID}.lines[{LINE_INDEX}]")
check_protected_content(data)

updated = raw
if line[FIELD] == BEFORE:
    before_json = json.dumps(BEFORE, ensure_ascii=False)
    after_json = json.dumps(AFTER, ensure_ascii=False)
    if updated.count(before_json) != 1:
        raise SystemExit("Expected one serialized occurrence of the guarded Arabic before-text")
    updated = updated.replace(before_json, after_json, 1)

parsed = json.loads(updated)
new_line = dialogue_by_id(parsed, DIALOGUE_ID)["lines"][LINE_INDEX]
if new_line.get("de") != EXPECTED_DE or new_line.get(FIELD) != AFTER:
    raise SystemExit("Post-edit verification failed for d-a2-13.lines[2]")
check_protected_content(parsed)

if updated != raw:
    TARGET.write_text(updated, encoding="utf-8")
    print("Applied the single confirmed Arabic correction for A2 dialogue batch 06")
else:
    print("The confirmed Arabic correction for A2 dialogue batch 06 is already applied")
