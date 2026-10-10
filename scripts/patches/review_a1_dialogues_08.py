#!/usr/bin/env python3
"""Preflighted, exact-value correction for A1 dialogue audit batch 08.

The live JSON is the source of truth. The historical authoring file is only
compared in the report; it is never imported or used as replacement content.
Run without --apply to validate. --apply writes only if every exact before-value
matches, and refuses a mixed or unexpected state.
"""
from __future__ import annotations

import argparse
import copy
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "dialogues.json"
HISTORY = ROOT / "scripts" / "patches" / "dialoge_a1_neu2.py"

# (dialogue id, line index, field, exact previous value, reviewed replacement)
EDITS: tuple[tuple[str, int, str, str, str], ...] = (
    (
        "d-a1-22", 2, "ar",
        "نعم، الطائرة تصل في الثانية. زوجي يأخذهما.",
        "نعم، تصل الطائرة في الساعة الثانية بعد الظهر. سيذهب زوجي لاستقبالهما.",
    ),
    (
        "d-a1-22", 4, "ar",
        "نعم، أسبوعين. إخوتي يأتون للزيارة أيضاً.",
        "نعم، أسبوعين. إخوتي يأتون للزيارة حينها أيضاً.",
    ),
    (
        "d-a1-22", 7, "ar",
        "ما أجمل! إذن البيت ممتلئ. جدتك تفرح بالرضيعة بالتأكيد.",
        "ما أجمل! إذن البيت ممتلئ. جدتك تتطلع بالتأكيد إلى قدوم الطفلة.",
    ),
    (
        "d-a1-24", 1, "ar",
        "أمارس رياضة كثيرة. أسبح يومياً في السابعة صباحاً.",
        "أمارس الرياضة كثيراً. أسبح يومياً في السابعة صباحاً.",
    ),
)

BATCH_IDS = ("d-a1-22", "d-a1-23", "d-a1-24")


def dialogue_by_id(data: list[dict[str, Any]], dialogue_id: str) -> dict[str, Any]:
    matches = [item for item in data if item.get("id") == dialogue_id]
    if len(matches) != 1:
        raise ValueError(f"expected exactly one {dialogue_id}, found {len(matches)}")
    return matches[0]


def validate_shape(data: list[dict[str, Any]]) -> None:
    if not isinstance(data, list):
        raise ValueError("dialogues.json root must remain a list")
    for dialogue_id in BATCH_IDS:
        dialogue = dialogue_by_id(data, dialogue_id)
        if dialogue.get("level") != "A1":
            raise ValueError(f"{dialogue_id}: stored level changed; CEFR is outside this review")
        if len(dialogue.get("lines", [])) != 8:
            raise ValueError(f"{dialogue_id}: expected exactly 8 bilingual lines")
        if len(dialogue.get("questions", [])) != 3:
            raise ValueError(f"{dialogue_id}: expected exactly 3 questions")
        if len(dialogue.get("dictation", [])) != 2:
            raise ValueError(f"{dialogue_id}: expected exactly 2 dictation sentences")
        if not dialogue.get("titleDe") or not dialogue.get("titleAr") or not dialogue.get("waisen"):
            raise ValueError(f"{dialogue_id}: missing title or vocabulary anchors")
        question_ids = [question.get("id") for question in dialogue["questions"]]
        if len(set(question_ids)) != 3 or any(not question_id for question_id in question_ids):
            raise ValueError(f"{dialogue_id}: duplicate or missing question IDs")
        for index, line in enumerate(dialogue["lines"]):
            if not line.get("who") or not line.get("de") or not line.get("ar"):
                raise ValueError(f"{dialogue_id}.lines[{index}]: incomplete speaker or bilingual text")
        for question in dialogue["questions"]:
            question_id = question.get("id", "<missing-id>")
            if not question.get("promptDe") or not question.get("promptAr"):
                raise ValueError(f"{question_id}: missing German or Arabic prompt")
            explanation = question.get("explanationAr", "")
            if not explanation or not any("\u0600" <= char <= "\u06ff" for char in explanation):
                raise ValueError(f"{question_id}: missing Arabic explanation")
            if question.get("type") in {"mc", "truefalse"}:
                options = question.get("options", [])
                if not options or len(options) != len(set(options)) or question.get("answer") not in options:
                    raise ValueError(f"{question_id}: invalid options or answer key")
            elif question.get("type") == "fill":
                answer = question.get("answer")
                if not (isinstance(answer, str) or isinstance(answer, list) and answer and all(isinstance(item, str) for item in answer)):
                    raise ValueError(f"{question_id}: invalid fill answer")
            else:
                raise ValueError(f"{question_id}: unsupported question type {question.get('type')!r}")
        for index, sentence in enumerate(dialogue["dictation"]):
            if not any(sentence in line["de"] for line in dialogue["lines"]):
                raise ValueError(f"{dialogue_id}.dictation[{index}]: not grounded in a dialogue line")


def edit_value(data: list[dict[str, Any]], edit: tuple[str, int, str, str, str]) -> Any:
    dialogue_id, line_index, field, _before, _after = edit
    dialogue = dialogue_by_id(data, dialogue_id)
    if line_index < 0 or line_index >= len(dialogue["lines"]):
        raise ValueError(f"invalid line selector {dialogue_id}.lines[{line_index}]")
    return dialogue["lines"][line_index].get(field)


def write_edit(data: list[dict[str, Any]], edit: tuple[str, int, str, str, str], value: str) -> None:
    dialogue_id, line_index, field, _before, _after = edit
    dialogue_by_id(data, dialogue_id)["lines"][line_index][field] = value


def validate_protected_context(data: list[dict[str, Any]]) -> None:
    """Keep the three unconfirmed fire-scene details and marked comma untouched."""
    fire = dialogue_by_id(data, "d-a1-23")
    protected = {
        (0, "de"): "Hallo, hier Weber, Gartenstraße 8. In der Küche ist Feuer!",
        (0, "ar"): "مرحباً، معك فيبر، شارع غارتن 8. في المطبخ حريق!",
        (3, "de"): "Gut. Die Feuerwehr ist schon unterwegs, fünf Minuten.",
        (3, "ar"): "حسناً. الإطفاء في الطريق، خمس دقائق.",
        (7, "de"): "Auf die andere Straßenseite. Warten Sie dort auf die Feuerwehr.",
        (7, "ar"): "إلى الجهة الأخرى من الشارع. انتظروا هناك الإطفاء.",
    }
    for (index, field), expected in protected.items():
        if fire["lines"][index].get(field) != expected:
            raise ValueError(f"d-a1-23.lines[{index}].{field}: unresolved context must remain unchanged")
    leisure = dialogue_by_id(data, "d-a1-24")
    if leisure["lines"][2].get("de") != "Jeden Tag? Ich gehe lieber spazieren, im Park.":
        raise ValueError("d-a1-24.lines[2]: keep the comma/afterthought construction pending context; no speculative edit")
    if leisure["lines"][2].get("ar") != "كل يوم؟ أنا أفضّل التنزّه مشياً في الحديقة.":
        raise ValueError("d-a1-24.lines[2]: keep the existing Arabic translation pending context; no speculative edit")


def validate_after(data: list[dict[str, Any]]) -> None:
    validate_shape(data)
    validate_protected_context(data)
    for dialogue_id, line_index, field, _before, after in EDITS:
        if edit_value(data, (dialogue_id, line_index, field, _before, after)) != after:
            raise ValueError(f"{dialogue_id}.lines[{line_index}].{field}: reviewed replacement not present")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="write after all exact-value and context checks pass")
    args = parser.parse_args()

    try:
        raw = TARGET.read_text(encoding="utf-8")
        data = json.loads(raw)
        validate_shape(data)
        validate_protected_context(data)
        if not HISTORY.is_file():
            raise ValueError("historical authoring file is missing; the report must not invent a comparison")
        history_text = HISTORY.read_text(encoding="utf-8")
        if not all(dialogue_id in history_text for dialogue_id in BATCH_IDS):
            raise ValueError("historical comparison preflight failed: not all three IDs are present")

        states: list[str] = []
        for edit in EDITS:
            current = edit_value(data, edit)
            before, after = edit[-2], edit[-1]
            if current == before:
                states.append("before")
            elif current == after:
                states.append("after")
            else:
                dialogue_id, line_index, field, *_ = edit
                raise ValueError(f"unexpected value at {dialogue_id}.lines[{line_index}].{field}: {current!r}")

        if all(state == "before" for state in states):
            original = copy.deepcopy(data)
            for edit in EDITS:
                write_edit(data, edit, edit[-1])
            expected = copy.deepcopy(original)
            for edit in EDITS:
                write_edit(expected, edit, edit[-1])
            validate_after(data)
            if data != expected:
                raise ValueError("patch changed a field outside the four reviewed Arabic lines")
            state = "preflight passed; patch is ready"
            if args.apply:
                TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                persisted = json.loads(TARGET.read_text(encoding="utf-8"))
                validate_after(persisted)
                if persisted != expected:
                    raise ValueError("persisted file differs from the four-field expected patch")
                state = "patch applied and persisted JSON revalidated"
        elif all(state == "after" for state in states):
            validate_after(data)
            state = "already applied; no file written"
        else:
            raise ValueError("mixed before/after state; refusing partial application")

        print(f"{state}: {TARGET.relative_to(ROOT)}")
        print("exact fields checked: 4; dialogue IDs: d-a1-22, d-a1-24")
        for dialogue_id, line_index, field, before, after in EDITS:
            print(f"- {dialogue_id}.lines[{line_index}].{field}: {before!r} -> {after!r}")
        print("- d-a1-23 lines 0, 3, 7 and d-a1-24.lines[2]: retained pending context; no speculative edits")
        return 0
    except (OSError, json.JSONDecodeError, ValueError, KeyError, TypeError) as exc:
        print(f"preflight failed; no write performed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
