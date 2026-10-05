#!/usr/bin/env python3
"""Preflighted, exact-value correction for the A1 dialogue audit batch 05.

The live dialogue JSON is the target. Historical authoring data is not trusted
as the source of truth. Run without --apply to validate; --apply writes only if
all five audited fields are still exactly at their expected pre-correction values.
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
        "d-a1-14", "line", 3, "de",
        "Neun Euro. Und für den Brief brauchen Sie eine Briefmarke für 85 Cent.",
        "Der Paketpreis hängt von Größe und Gewicht ab. Für einen Standardbrief ins Ausland bis 20 Gramm brauchen Sie eine Briefmarke für 1,25 Euro.",
    ),
    (
        "d-a1-14", "line", 3, "ar",
        "تسعة يورو. وللرسالة تحتاجين طابعاً بـ85 سنتاً.",
        "تعتمد كلفة الطرد على حجمه ووزنه. ولإرسال رسالة عادية إلى الخارج لا يزيد وزنها على 20 غراماً، تحتاجين إلى طابع بريدي بقيمة 1.25 يورو.",
    ),
    (
        "d-a1-14", "question", "d-a1-14-q2", "options",
        ["20 Cent", "85 Cent", "neun Euro"],
        ["20 Cent", "1,80 Euro", "1,25 Euro"],
    ),
    (
        "d-a1-14", "question", "d-a1-14-q2", "answer",
        "85 Cent",
        "1,25 Euro",
    ),
    (
        "d-a1-14", "question", "d-a1-14-q2", "explanationAr",
        "الدليل: «eine Briefmarke für 85 Cent». الفخّ 1: 20 سنتاً الظرف. الفخّ 2: تسعة يورو الطرد.",
        "الدليل: «Für einen Standardbrief ins Ausland bis 20 Gramm brauchen Sie eine Briefmarke für 1,25 Euro». الفخّ 1: 20 سنتاً ثمن الظرف. الفخّ 2: 1,80 يورو لتعرفة الرسالة المدمجة حتى 50 غراماً، لا الرسالة المعيارية حتى 20 غراماً.",
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
        matches = [q for q in dialogue.get("questions", []) if q.get("id") == selector]
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
    for dialogue_id in ("d-a1-13", "d-a1-14", "d-a1-15"):
        dialogue = dialogue_by_id(data, dialogue_id)
        if dialogue.get("level") != "A1":
            raise ValueError(f"{dialogue_id}: expected A1 level")
        if len(dialogue.get("lines", [])) != 8:
            raise ValueError(f"{dialogue_id}: expected exactly 8 lines")
        if len(dialogue.get("questions", [])) != 3:
            raise ValueError(f"{dialogue_id}: expected exactly 3 questions")
        if len(dialogue.get("dictation", [])) != 2:
            raise ValueError(f"{dialogue_id}: expected exactly 2 dictation sentences")
        if len({q.get("id") for q in dialogue["questions"]}) != 3:
            raise ValueError(f"{dialogue_id}: duplicate/missing question IDs")
        for line_index, line in enumerate(dialogue["lines"]):
            if not line.get("de") or not line.get("ar") or not line.get("who"):
                raise ValueError(f"{dialogue_id}.lines[{line_index}]: incomplete bilingual line")
        for question in dialogue["questions"]:
            if not question.get("id") or not question.get("promptDe") or not question.get("promptAr"):
                raise ValueError(f"{dialogue_id}: question missing id or prompt")
            if not question.get("explanationAr") or not any("\u0600" <= char <= "\u06ff" for char in question["explanationAr"]):
                raise ValueError(f"{question.get('id')}: missing Arabic explanation")
            if question.get("type") in {"mc", "truefalse"}:
                options = question.get("options", [])
                if not options or len(options) != len(set(options)):
                    raise ValueError(f"{question.get('id')}: options missing or duplicated")
                if question.get("answer") not in options:
                    raise ValueError(f"{question.get('id')}: answer not among options")
            elif question.get("type") == "fill":
                answer = question.get("answer")
                if not (isinstance(answer, str) or isinstance(answer, list) and answer and all(isinstance(x, str) for x in answer)):
                    raise ValueError(f"{question.get('id')}: invalid fill answer")
            else:
                raise ValueError(f"{question.get('id')}: unsupported question type {question.get('type')!r}")
        for sentence in dialogue["dictation"]:
            if not any(sentence == line["de"] or sentence in line["de"] for line in dialogue["lines"]):
                raise ValueError(f"{dialogue_id}: dictation is not grounded in dialogue")


def validate_after(data: list[dict[str, Any]]) -> None:
    validate_shape(data)
    dialogue = dialogue_by_id(data, "d-a1-14")
    expected_de = "Der Paketpreis hängt von Größe und Gewicht ab. Für einen Standardbrief ins Ausland bis 20 Gramm brauchen Sie eine Briefmarke für 1,25 Euro."
    expected_ar = "تعتمد كلفة الطرد على حجمه ووزنه. ولإرسال رسالة عادية إلى الخارج لا يزيد وزنها على 20 غراماً، تحتاجين إلى طابع بريدي بقيمة 1.25 يورو."
    if dialogue["lines"][3]["de"] != expected_de or dialogue["lines"][3]["ar"] != expected_ar:
        raise ValueError("d-a1-14 line 4: unexpected German/Arabic price-scoped revision")
    q = next(q for q in dialogue["questions"] if q["id"] == "d-a1-14-q2")
    if q["answer"] != "1,25 Euro" or q["answer"] not in q["options"]:
        raise ValueError("d-a1-14-q2: key must match the specified international standard-letter rate")
    if q["options"] != ["20 Cent", "1,80 Euro", "1,25 Euro"]:
        raise ValueError("d-a1-14-q2: unexpected price distractors")
    if "1,25 Euro" not in q["explanationAr"] or "1,80 يورو" not in q["explanationAr"]:
        raise ValueError("d-a1-14-q2: explanation is not aligned to the sourced tariffs")


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
        print(f"exact fields checked: {len(EDITS)}; dialogue IDs: d-a1-14")
        for edit in EDITS:
            dialogue_id, section, selector, field, before, after = edit
            print(f"- {dialogue_id}/{section}/{selector}/{field}: {before!r} -> {after!r}")
        return 0
    except (OSError, json.JSONDecodeError, ValueError, KeyError, TypeError) as exc:
        print(f"preflight failed; no write performed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
