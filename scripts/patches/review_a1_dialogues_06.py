#!/usr/bin/env python3
"""Preflighted, exact-value corrections for A1 dialogue audit batch 06.

The live JSON is authoritative for the starting values. The historical authoring
script is compared separately and is not used as the source of truth. Run without
--apply to validate; --apply writes only after every exact before-value passes.
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
        "d-a1-16", "line", 1, "ar",
        "انظر، عصفور على الشجرة! يغرّد.",
        "انظر، طائر على الشجرة! يغرّد.",
    ),
    (
        "d-a1-16", "question", "d-a1-16-q1", "explanationAr",
        "الدليل: «dort am Fluss stehen zwei Pferde». الفخّ 1: العصفور على الشجرة. الفخّ 2: الغابة هدف النزهة.",
        "الدليل: «dort am Fluss stehen zwei Pferde». الفخّ 1: الطائر على الشجرة. الفخّ 2: الغابة هدف النزهة.",
    ),
    (
        "d-a1-16", "line", 7, "de",
        "Können wir morgen wieder kommen?",
        "Können wir morgen wiederkommen?",
    ),
    (
        "d-a1-17", "question", "d-a1-17-q1", "promptDe",
        "Was macht der Sohn zuerst?",
        "Welche Aufgabe nennt die Mutter zuerst?",
    ),
    (
        "d-a1-17", "question", "d-a1-17-q1", "explanationAr",
        "الدليل: «Du kehrst die Küche». الفخّ 1: القدر تغسله الأم. الفخّ 2: الكيّ «danach».",
        "الدليل: «Du kehrst die Küche»؛ هذه أول مهمة محددة تذكرها الأم، لا دليلاً على ترتيب تنفيذ الأعمال. الفخّ 1: الأم تغسل القدر. الفخّ 2: الكيّ ذُكر «danach».",
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
) -> tuple[dict[str, Any], int | None, dict[str, Any] | None]:
    dialogue_id, section, selector, _field, _before, _after = edit
    dialogue = dialogue_by_id(data, dialogue_id)
    if section == "line":
        if not isinstance(selector, int) or selector < 0 or selector >= len(dialogue.get("lines", [])):
            raise ValueError(f"invalid line selector for {dialogue_id}: {selector!r}")
        return dialogue, selector, None
    if section == "question":
        matches = [question for question in dialogue.get("questions", []) if question.get("id") == selector]
        if len(matches) != 1:
            raise ValueError(f"expected one question {selector}, found {len(matches)}")
        return dialogue, None, matches[0]
    raise ValueError(f"unknown section: {section}")


def read_edit_value(data: list[dict[str, Any]], edit: tuple[str, str, str | int | None, str, Any, Any]) -> Any:
    _dialogue_id, section, _selector, field, _before, _after = edit
    dialogue, line_index, question = target_for(data, edit)
    if section == "line":
        assert line_index is not None
        return dialogue["lines"][line_index].get(field)
    assert question is not None
    return question.get(field)


def write_edit_value(
    data: list[dict[str, Any]],
    edit: tuple[str, str, str | int | None, str, Any, Any],
    value: Any,
) -> None:
    _dialogue_id, section, _selector, field, _before, _after = edit
    dialogue, line_index, question = target_for(data, edit)
    if section == "line":
        assert line_index is not None
        dialogue["lines"][line_index][field] = value
    else:
        assert question is not None
        question[field] = value


def validate_shape(data: list[dict[str, Any]]) -> None:
    for dialogue_id in ("d-a1-16", "d-a1-17", "d-a1-18"):
        dialogue = dialogue_by_id(data, dialogue_id)
        if dialogue.get("level") != "A1":
            raise ValueError(f"{dialogue_id}: expected stored level A1")
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
                if not (isinstance(answer, str) or isinstance(answer, list) and answer and all(isinstance(value, str) for value in answer)):
                    raise ValueError(f"{question.get('id')}: invalid fill answer")
            else:
                raise ValueError(f"{question.get('id')}: unsupported question type {question.get('type')!r}")
        for sentence in dialogue["dictation"]:
            if not any(sentence == line["de"] or sentence in line["de"] for line in dialogue["lines"]):
                raise ValueError(f"{dialogue_id}: dictation is not grounded in the dialogue")


def validate_after(data: list[dict[str, Any]]) -> None:
    validate_shape(data)
    dialogue16 = dialogue_by_id(data, "d-a1-16")
    if dialogue16["lines"][1]["ar"] != "انظر، طائر على الشجرة! يغرّد.":
        raise ValueError("d-a1-16 line 2: generic Vogel must not be narrowed to a sparrow")
    if dialogue16["lines"][7]["de"] != "Können wir morgen wiederkommen?":
        raise ValueError("d-a1-16 line 8: wiederkommen spelling is not joined")
    question16 = next(question for question in dialogue16["questions"] if question["id"] == "d-a1-16-q1")
    if "الطائر على الشجرة" not in question16["explanationAr"] or "العصفور" in question16["explanationAr"]:
        raise ValueError("d-a1-16-q1: explanation must use the same generic bird noun as the line")

    dialogue17 = dialogue_by_id(data, "d-a1-17")
    question17 = next(question for question in dialogue17["questions"] if question["id"] == "d-a1-17-q1")
    if question17["promptDe"] != "Welche Aufgabe nennt die Mutter zuerst?":
        raise ValueError("d-a1-17-q1: ask which task is first mentioned, not which one is first performed")
    if question17["answer"] != "Er kehrt die Küche." or question17["answer"] not in question17["options"]:
        raise ValueError("d-a1-17-q1: answer must remain the first concrete task the mother assigns")
    if "لا دليلاً على ترتيب تنفيذ الأعمال" not in question17["explanationAr"]:
        raise ValueError("d-a1-17-q1: explanation must distinguish mention order from execution order")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="write only after all exact before-value checks pass")
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
        print(f"exact fields checked: {len(EDITS)}; dialogue IDs: d-a1-16, d-a1-17")
        for dialogue_id, section, selector, field, before, after in EDITS:
            print(f"- {dialogue_id}/{section}/{selector}/{field}: {before!r} -> {after!r}")
        return 0
    except (OSError, json.JSONDecodeError, ValueError, KeyError, TypeError) as exc:
        print(f"preflight failed; no write performed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
