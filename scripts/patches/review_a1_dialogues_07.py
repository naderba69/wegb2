#!/usr/bin/env python3
"""Preflighted exact-value correction for A1 dialogue audit batch 07.

The live JSON is the starting authority. The historical authoring script is
searched separately and is not used as a replacement source. Run without
--apply to validate; --apply writes only after the exact before-value matches.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "content" / "dialogues.json"

# (dialogue id, section, selector, field, exact before value, exact after value)
EDITS: tuple[tuple[str, str, str | int | None, str, Any, Any], ...] = (
    (
        "d-a1-19", "line", 1, "ar",
        "هل يوجد فاكهة أيضاً؟ أريد موزة.",
        "هل توجد فاكهة أيضاً؟ أريد موزة.",
    ),
)


def dialogue_by_id(data: list[dict[str, Any]], dialogue_id: str) -> dict[str, Any]:
    matches = [item for item in data if item.get("id") == dialogue_id]
    if len(matches) != 1:
        raise ValueError(f"expected one {dialogue_id}, found {len(matches)}")
    return matches[0]


def target_for(
    data: list[dict[str, Any]],
    edit: tuple[str, str, str | int | None, str, Any, Any],
) -> tuple[dict[str, Any], int]:
    dialogue_id, section, selector, _field, _before, _after = edit
    if section != "line" or not isinstance(selector, int):
        raise ValueError(f"unsupported patch target {section}/{selector}")
    dialogue = dialogue_by_id(data, dialogue_id)
    if selector < 0 or selector >= len(dialogue.get("lines", [])):
        raise ValueError(f"invalid line selector for {dialogue_id}: {selector!r}")
    return dialogue, selector


def read_edit_value(data: list[dict[str, Any]], edit: tuple[str, str, str | int | None, str, Any, Any]) -> Any:
    _dialogue_id, _section, _selector, field, _before, _after = edit
    dialogue, index = target_for(data, edit)
    return dialogue["lines"][index].get(field)


def write_edit_value(
    data: list[dict[str, Any]],
    edit: tuple[str, str, str | int | None, str, Any, Any],
    value: Any,
) -> None:
    _dialogue_id, _section, _selector, field, _before, _after = edit
    dialogue, index = target_for(data, edit)
    dialogue["lines"][index][field] = value


def validate_shape(data: list[dict[str, Any]]) -> None:
    for dialogue_id in ("d-a1-19", "d-a1-20", "d-a1-21"):
        dialogue = dialogue_by_id(data, dialogue_id)
        if dialogue.get("level") != "A1":
            raise ValueError(f"{dialogue_id}: expected stored level A1; level is not being recalculated")
        if len(dialogue.get("lines", [])) != 8:
            raise ValueError(f"{dialogue_id}: expected exactly 8 lines")
        if len(dialogue.get("questions", [])) != 3:
            raise ValueError(f"{dialogue_id}: expected exactly 3 questions")
        if len(dialogue.get("dictation", [])) != 2:
            raise ValueError(f"{dialogue_id}: expected exactly 2 dictation sentences")
        if not dialogue.get("titleDe") or not dialogue.get("titleAr") or not dialogue.get("waisen"):
            raise ValueError(f"{dialogue_id}: missing title or vocabulary anchor")
        if len({question.get("id") for question in dialogue["questions"]}) != 3:
            raise ValueError(f"{dialogue_id}: duplicate/missing question IDs")
        for index, line in enumerate(dialogue["lines"]):
            if not line.get("de") or not line.get("ar") or not line.get("who"):
                raise ValueError(f"{dialogue_id}.lines[{index}]: incomplete bilingual line or speaker")
        for question in dialogue["questions"]:
            if not question.get("id") or not question.get("promptDe") or not question.get("promptAr"):
                raise ValueError(f"{dialogue_id}: question missing ID or prompt")
            explanation = question.get("explanationAr", "")
            if not explanation or not any("\u0600" <= char <= "\u06ff" for char in explanation):
                raise ValueError(f"{question.get('id')}: missing Arabic explanation")
            if question.get("type") in {"mc", "truefalse"}:
                options = question.get("options", [])
                if not options or len(options) != len(set(options)):
                    raise ValueError(f"{question.get('id')}: options missing or duplicated")
                if question.get("answer") not in options:
                    raise ValueError(f"{question.get('id')}: answer not among options")
            elif question.get("type") == "fill":
                answer = question.get("answer")
                if not (
                    isinstance(answer, str)
                    or isinstance(answer, list) and answer and all(isinstance(value, str) for value in answer)
                ):
                    raise ValueError(f"{question.get('id')}: invalid fill answer")
            else:
                raise ValueError(f"{question.get('id')}: unsupported question type {question.get('type')!r}")
        for index, sentence in enumerate(dialogue["dictation"]):
            if not any(sentence == line["de"] or sentence in line["de"] for line in dialogue["lines"]):
                raise ValueError(f"{dialogue_id}.dictation[{index}]: sentence is not grounded in the dialogue")


def validate_after(data: list[dict[str, Any]]) -> None:
    validate_shape(data)
    dialogue19 = dialogue_by_id(data, "d-a1-19")
    if dialogue19["lines"][1]["ar"] != "هل توجد فاكهة أيضاً؟ أريد موزة.":
        raise ValueError("d-a1-19 line 2: existential verb must agree with feminine فاكهة in the reviewed MSA translation")

    # Preserve the unresolved timeline verbatim: either relative-date word could
    # be the source typo, and the source text gives no date to choose between them.
    dialogue20 = dialogue_by_id(data, "d-a1-20")
    if dialogue20["lines"][2]["de"] != "Also übermorgen. Und die Uhrzeit?":
        raise ValueError("d-a1-20 line 3: leave unresolved übermorgen/vorgestern mismatch unchanged")
    if dialogue20["lines"][2]["ar"] != "إذن بعد غد. والساعة؟":
        raise ValueError("d-a1-20 line 3: preserve the current Arabic translation pending a contextual decision")
    if dialogue20["lines"][5]["de"] != "Vorgestern, am Montag. Das war kurz, nur eine Stunde.":
        raise ValueError("d-a1-20 line 6: preserve the other explicit relative-date anchor")
    if dialogue20["dictation"][0] != dialogue20["lines"][2]["de"]:
        raise ValueError("d-a1-20: dictation must remain an exact copy of its dialogue line")
    if "übermorgen" not in dialogue20["waisen"] or "vorgestern" not in dialogue20["waisen"]:
        raise ValueError("d-a1-20: retain both existing vocabulary anchors while the timeline is unresolved")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="write only after the exact before-value check passes")
    args = parser.parse_args()

    try:
        raw = TARGET.read_text(encoding="utf-8")
        data = json.loads(raw)
        validate_shape(data)
        states: list[str] = []
        for edit in EDITS:
            current = read_edit_value(data, edit)
            before, after = edit[-2], edit[-1]
            if current == before:
                states.append("before")
            elif current == after:
                states.append("after")
            else:
                dialogue_id, section, selector, field, *_ = edit
                raise ValueError(f"unexpected value at {dialogue_id}/{section}/{selector}/{field}: {current!r}")

        if all(state == "before" for state in states):
            for edit in EDITS:
                write_edit_value(data, edit, edit[-1])
            validate_after(data)
            state = "preflight passed; patch is ready"
            if args.apply:
                TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                persisted = json.loads(TARGET.read_text(encoding="utf-8"))
                validate_after(persisted)
                state = "patch applied and persisted JSON revalidated"
        elif all(state == "after" for state in states):
            validate_after(data)
            state = "already applied; no file written"
        else:
            raise ValueError("mixed before/after state; refusing partial application")

        print(f"{state}: {TARGET.relative_to(ROOT)}")
        print("exact fields checked: 1; dialogue IDs: d-a1-19")
        for dialogue_id, section, selector, field, before, after in EDITS:
            print(f"- {dialogue_id}/{section}/{selector}/{field}: {before!r} -> {after!r}")
        print("- d-a1-20 relative-date mismatch: preserved as unresolved; no speculative field edits")
        return 0
    except (OSError, json.JSONDecodeError, ValueError, KeyError, TypeError) as exc:
        print(f"preflight failed; no write performed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
