#!/usr/bin/env python3
"""Apply the bounded PA-035 batch 03 A2 writing decisions.

The fixture stores every full A2 card before and after review. Corrected cards
are replaced only on an exact match; confirmed-current cards are identity
guards. The patch generates no language and refuses scope or content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WRITING_PATH = ROOT / "content" / "writing.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "writing-reviewed-03.json"
EXPECTED_IDS = {f"w-a2-{number:02d}" for number in range(1, 21)}


def main() -> None:
    tasks = json.loads(WRITING_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if (
        fixture.get("schema") != "wegb2-reviewed-writing-decision-batch-v1"
        or fixture.get("batch") != "PA-035-03"
        or len(entries) != 20
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
    ):
        raise SystemExit("unexpected PA-035-03 fixture scope")
    decisions = [entry.get("decision") for entry in entries]
    if decisions.count("corrected") != 18 or decisions.count("confirmed-current") != 2:
        raise SystemExit("unexpected PA-035-03 decision counts")
    if any(entry.get("level") != "A2" for entry in entries):
        raise SystemExit("unexpected PA-035-03 level scope")

    locations = {task.get("id"): (index, task) for index, task in enumerate(tasks)}
    changed = 0
    already_current = 0
    for entry in entries:
        task_id = entry["id"]
        if task_id not in locations:
            raise SystemExit(f"missing reviewed writing task: {task_id}")
        index, current = locations[task_id]
        previous = entry["previous"]
        reviewed = entry["current"]
        decision = entry.get("decision")
        if previous.get("id") != task_id or reviewed.get("id") != task_id:
            raise SystemExit(f"identity drift inside fixture: {task_id}")
        if previous.get("level") != "A2" or reviewed.get("level") != "A2":
            raise SystemExit(f"level drift inside fixture: {task_id}")
        if decision == "confirmed-current" and previous != reviewed:
            raise SystemExit(f"confirmed-current decision changes task: {task_id}")
        if decision == "corrected" and previous == reviewed:
            raise SystemExit(f"corrected decision does not change task: {task_id}")
        if current == reviewed:
            already_current += 1
            continue
        if current != previous:
            raise SystemExit(f"unexpected current writing task: {task_id}")
        tasks[index] = reviewed
        locations[task_id] = (index, reviewed)
        changed += 1

    if changed:
        WRITING_PATH.write_text(
            json.dumps(tasks, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print(
        f"PA-035-03: applied {changed} corrections; "
        f"{already_current} already current"
    )


if __name__ == "__main__":
    main()
