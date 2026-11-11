#!/usr/bin/env python3
"""R161: remove three parenthetical cues duplicated completely by MC options.

The patch is deliberately ID-scoped and idempotent. It changes prompts only;
answers, options, exercise types, plural fields, and vocabulary are guarded.
"""

from __future__ import annotations

import json
from pathlib import Path

PATH = Path("content/grammar.json")

CHANGES = {
    "b1-absicht-n6": {
        "old": "Ich lerne, um ___. (anfangen)",
        "new": "Ich lerne, um ___.",
        "answer": "anzufangen",
        "options": ["anzufangen", "an zu fangen", "zu anfangen"],
    },
    "g16e2": {
        "old": "die von Experten ___ (beschließen) Pläne",
        "new": "die von Experten ___ Pläne",
        "answer": "beschlossenen",
        "options": ["beschlossenen", "beschlossende", "beschließen"],
    },
    "b2-n-dekl-v2": {
        "old": "Kennst du ___ (der Kollege) von Anna?",
        "new": "Kennst du ___ von Anna?",
        "answer": "den Kollegen",
        "options": ["den Kollege", "den Kollegen", "dem Kollegen"],
    },
}


def exercises_by_id(bank: dict[str, object]) -> dict[str, dict[str, object]]:
    result: dict[str, dict[str, object]] = {}
    for topic in bank.values():
        if not isinstance(topic, dict):
            continue
        for bucket in ("exercises", "verify"):
            entries = topic.get(bucket, [])
            if not isinstance(entries, list):
                continue
            for exercise in entries:
                if isinstance(exercise, dict) and isinstance(exercise.get("id"), str):
                    exercise_id = exercise["id"]
                    if exercise_id in result:
                        raise SystemExit(f"duplicate exercise id: {exercise_id}")
                    result[exercise_id] = exercise
    return result


def main() -> None:
    raw = PATH.read_text(encoding="utf-8")
    bank = json.loads(raw)
    indexed = exercises_by_id(bank)
    changed = 0

    for exercise_id, contract in CHANGES.items():
        exercise = indexed.get(exercise_id)
        if exercise is None:
            raise SystemExit(f"missing guarded exercise: {exercise_id}")
        if exercise.get("type") != "mc":
            raise SystemExit(f"{exercise_id}: expected mc, got {exercise.get('type')!r}")
        if exercise.get("answer") != contract["answer"] or exercise.get("options") != contract["options"]:
            raise SystemExit(f"{exercise_id}: answer/options guard failed")

        current = exercise.get("promptDe")
        if current == contract["new"]:
            continue
        if current != contract["old"]:
            raise SystemExit(f"{exercise_id}: prompt guard failed: {current!r}")

        old_json = json.dumps(contract["old"], ensure_ascii=False)
        new_json = json.dumps(contract["new"], ensure_ascii=False)
        if raw.count(old_json) != 1:
            raise SystemExit(f"{exercise_id}: expected one literal prompt, found {raw.count(old_json)}")
        raw = raw.replace(old_json, new_json, 1)
        changed += 1

    reparsed = json.loads(raw)
    checked = exercises_by_id(reparsed)
    for exercise_id, contract in CHANGES.items():
        exercise = checked[exercise_id]
        if exercise.get("promptDe") != contract["new"] or exercise.get("answer") != contract["answer"] or exercise.get("options") != contract["options"]:
            raise SystemExit(f"{exercise_id}: post-write guard failed")

    if changed:
        PATH.write_text(raw, encoding="utf-8")
    print(f"R161 scaffold review: {changed} prompt(s) changed; {len(CHANGES) - changed} already current")


if __name__ == "__main__":
    main()
