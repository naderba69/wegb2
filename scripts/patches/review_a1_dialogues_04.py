#!/usr/bin/env python3
"""Preflighted content patch for A1 dialogue batch 04 (d-a1-10..12).

Default mode is a dry-run. Pass --apply only after checking every expected
before-value below; the script rejects partial or unexpected source states.
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
        "d-a1-11", "question", "d-a1-11-q1", "promptDe",
        "Was tut Frau Nasri weh?",
        "Welche Körperstelle nennt Frau Nasri zuerst?",
    ),
    (
        "d-a1-11", "question", "d-a1-11-q1", "explanationAr",
        "الدليل: «Der Rücken tut weh, und ich habe Husten». الفخّ 1: «Das Ohr nicht». الفخّ 2: «der Zahn ist gut».",
        "الدليل الأول: «Der Rücken tut weh, und ich habe Husten». تقول لاحقاً إن أنفها يؤلمها قليلاً؛ لذا يسأل عن موضع الجسم الذي ذكرته أولاً. الفخّ 1: الأذن لا تؤلمها. الفخّ 2: السن بخير.",
    ),
    (
        "d-a1-12", "line", 7, "de",
        "Gut. Das Hemd nehme ich nicht, ich habe nicht so viel Geld dabei.",
        "Gut. Die Socken nehme ich nicht. Ich habe nicht so viel Geld dabei.",
    ),
    (
        "d-a1-12", "line", 7, "ar",
        "حسناً. القميص لا آخذه، ليس معي مال كثير.",
        "حسناً. لن آخذ الجوارب. ليس معي مال كثير.",
    ),
    (
        "d-a1-12", "meta", None, "waisen",
        ["der Mantel", "die Mütze", "die Socke", "das Hemd", "die Größe", "die Farbe", "blau", "schwarz", "anziehen", "das Geld"],
        ["der Mantel", "die Mütze", "die Socke", "die Größe", "die Farbe", "blau", "schwarz", "anziehen", "das Geld"],
    ),
    (
        "d-a1-12", "question", "d-a1-12-q2", "options",
        ["die Mütze", "die Socken", "das Hemd"],
        ["die Mütze", "der Mantel", "die Socken"],
    ),
    (
        "d-a1-12", "question", "d-a1-12-q2", "answer",
        "das Hemd",
        "die Socken",
    ),
    (
        "d-a1-12", "question", "d-a1-12-q2", "explanationAr",
        "الدليل: «Das Hemd nehme ich nicht». الفخّ: القبعة والجوارب يأخذهما.",
        "الدليل: «Die Socken nehme ich nicht». الفخّ 1: القبعة قال إنه يحتاجها. الفخّ 2: طلب المعطف وحدد لونه وسعره.",
    ),
    (
        "d-a1-12", "question", "d-a1-12-q3", "promptAr",
        "أكمل الفراغ بالكلمة المناسبة من الحوار.",
        "أكمل الفراغ بالمبلغ الصحيح من الحوار.",
    ),
)


def dialogue_by_id(data: list[dict[str, Any]], dialogue_id: str) -> dict[str, Any]:
    matches = [item for item in data if item.get("id") == dialogue_id]
    if len(matches) != 1:
        raise ValueError(f"expected one {dialogue_id}, found {len(matches)}")
    return matches[0]


def target_for(data: list[dict[str, Any]], edit: tuple[str, str, str | int | None, str, Any, Any]) -> tuple[dict[str, Any], str | int | None, dict[str, Any] | None]:
    dialogue_id, section, selector, field, _before, _after = edit
    dialogue = dialogue_by_id(data, dialogue_id)
    if section == "meta":
        return dialogue, None, None
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
    _dialogue_id, section, selector, field, _before, _after = edit
    dialogue, line_index, question = target_for(data, edit)
    if section == "meta":
        return dialogue.get(field)
    if section == "line":
        return dialogue["lines"][line_index][field]  # type: ignore[index]
    assert question is not None
    return question.get(field)


def write_edit_value(data: list[dict[str, Any]], edit: tuple[str, str, str | int | None, str, Any, Any], value: Any) -> None:
    _dialogue_id, section, _selector, field, _before, _after = edit
    dialogue, line_index, question = target_for(data, edit)
    if section == "meta":
        dialogue[field] = value
    elif section == "line":
        dialogue["lines"][line_index][field] = value  # type: ignore[index]
    else:
        assert question is not None
        question[field] = value


def validate_shape(data: list[dict[str, Any]]) -> None:
    for dialogue_id in ("d-a1-10", "d-a1-11", "d-a1-12"):
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
        for question in dialogue["questions"]:
            if question.get("type") == "mc":
                if question.get("answer") not in question.get("options", []):
                    raise ValueError(f"{question.get('id')}: answer not among options")
                if len(question.get("options", [])) != len(set(question.get("options", []))):
                    raise ValueError(f"{question.get('id')}: duplicate options")
        for sentence in dialogue["dictation"]:
            if not any(sentence == line["de"] or sentence in line["de"] for line in dialogue["lines"]):
                raise ValueError(f"{dialogue_id}: dictation is not grounded in dialogue")


def validate_after(data: list[dict[str, Any]]) -> None:
    validate_shape(data)
    d11 = dialogue_by_id(data, "d-a1-11")
    q11 = next(q for q in d11["questions"] if q["id"] == "d-a1-11-q1")
    if q11["promptDe"] != "Welche Körperstelle nennt Frau Nasri zuerst?":
        raise ValueError("d-a1-11-q1: prompt does not ask which body part is named first")
    if q11["answer"] != "der Rücken" or "الأذن لا تؤلمها" not in q11["explanationAr"]:
        raise ValueError("d-a1-11-q1: answer/explanation is inconsistent with the first reported site")

    d12 = dialogue_by_id(data, "d-a1-12")
    if d12["lines"][7]["de"] != "Gut. Die Socken nehme ich nicht. Ich habe nicht so viel Geld dabei.":
        raise ValueError("d-a1-12 line 8 German: unexpected revised text")
    if d12["lines"][7]["ar"] != "حسناً. لن آخذ الجوارب. ليس معي مال كثير.":
        raise ValueError("d-a1-12 line 8 Arabic: unexpected revised translation")
    if "das Hemd" in d12["waisen"] or len(d12["waisen"]) < 8:
        raise ValueError("d-a1-12: waisen must omit the now-unmentioned shirt and retain >=8 entries")

    q12_2 = next(q for q in d12["questions"] if q["id"] == "d-a1-12-q2")
    if q12_2["answer"] != "die Socken" or q12_2["answer"] not in q12_2["options"]:
        raise ValueError("d-a1-12-q2: the sock refusal must be the unique keyed option")
    if "«Die Socken nehme ich nicht»" not in q12_2["explanationAr"]:
        raise ValueError("d-a1-12-q2: explanation must quote the exact evidence")

    q12_3 = next(q for q in d12["questions"] if q["id"] == "d-a1-12-q3")
    if q12_3["promptAr"] != "أكمل الفراغ بالمبلغ الصحيح من الحوار.":
        raise ValueError("d-a1-12-q3: Arabic instruction must ask for the amount")
    if q12_3["answer"] != ["89", "neunundachtzig"]:
        raise ValueError("d-a1-12-q3: do not change its two accepted numeric/word forms")


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
                raise ValueError(
                    f"unexpected value at {dialogue_id}/{section}/{selector}/{field}: {current!r}"
                )

        if all(state == "before" for state in states):
            for edit in EDITS:
                write_edit_value(data, edit, edit[-1])
            validate_after(data)
            state = "preflight passed; patch is ready"
            if args.apply:
                TARGET.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                # Re-read the persisted file so a successful exit verifies the actual target.
                persisted = json.loads(TARGET.read_text(encoding="utf-8"))
                validate_after(persisted)
                state = "patch applied and persisted JSON revalidated"
        elif all(state == "after" for state in states):
            validate_after(data)
            state = "already applied; no file written"
        else:
            raise ValueError("mixed before/after state; refusing partial application")

        print(f"{state}: {TARGET.relative_to(ROOT)}")
        print(f"exact fields checked: {len(EDITS)}; dialogue IDs: d-a1-11, d-a1-12")
        for edit in EDITS:
            dialogue_id, section, selector, field, before, after = edit
            print(f"- {dialogue_id}/{section}/{selector}/{field}: {before!r} -> {after!r}")
        return 0
    except (OSError, json.JSONDecodeError, ValueError, KeyError, TypeError) as exc:
        print(f"preflight failed; no write performed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
