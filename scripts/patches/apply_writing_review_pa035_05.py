#!/usr/bin/env python3
"""Apply the bounded PA-035 batch 05 B2 writing decisions.

The fixture stores every full B2 card before and after review. Corrected cards
are replaced only on an exact match. The patch generates no language and
refuses scope or content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WRITING_PATH = ROOT / "content" / "writing.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "writing-reviewed-05.json"
EXPECTED_IDS = {
    "w-b2-01", "w-b2-02", "w-b2-03", "w-b2-04", "w-b2-05", "w-b2-06",
    "w-b2-07", "w-b2-08", "w-b2-09", "w-b2-10", "w-b2-11", "w-b2-12",
    "w-b2-13", "w-b2-14", "w-b2-15", "w-b2-16", "w-b2-17", "w-b2-18",
    "w-b2-19", "w-b2-20", "w-b2-21", "w-b2-22", "w-b2-23", "w-b2-24",
    "w-b2-25", "w-b2-26", "w-b2-27", "w-b2-28", "w-b2-41", "w-b2-42",
    "w-b2-43", "w-b2-44", "w-b2-45",
}


def main() -> None:
    tasks = json.loads(WRITING_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if (
        fixture.get("schema") != "wegb2-reviewed-writing-decision-batch-v1"
        or fixture.get("batch") != "PA-035-05"
        or len(entries) != 33
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
    ):
        raise SystemExit("unexpected PA-035-05 fixture scope")
    if any(entry.get("decision") != "corrected" for entry in entries):
        raise SystemExit("unexpected PA-035-05 decision counts")
    if any(entry.get("level") != "B2" for entry in entries):
        raise SystemExit("unexpected PA-035-05 level scope")

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
        if previous.get("id") != task_id or reviewed.get("id") != task_id:
            raise SystemExit(f"identity drift inside fixture: {task_id}")
        if previous.get("level") != "B2" or reviewed.get("level") != "B2":
            raise SystemExit(f"level drift inside fixture: {task_id}")
        if previous == reviewed:
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
        f"PA-035-05: applied {changed} corrections; "
        f"{already_current} already current"
    )


if __name__ == "__main__":
    main()
