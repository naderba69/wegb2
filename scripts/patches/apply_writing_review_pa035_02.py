#!/usr/bin/env python3
"""Apply the bounded PA-035 batch 02 A0/A1 writing decisions.

The fixture stores each full task before and after review. Corrected tasks are
replaced only on an exact match; confirmed-current tasks are identity guards.
The patch generates no language and refuses scope or content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WRITING_PATH = ROOT / "content" / "writing.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "writing-reviewed-02.json"
EXPECTED_IDS = {
    "w-a0-01", "w-a0-02", "w-a0-03", "w-a0-04", "w-a0-05", "w-a0-06",
    "w-a1-01", "w-a1-02", "w-a1-03", "w-a1-04", "w-a1-05", "w-a1-06",
    "w-a1-07", "w-a1-08", "w-a1-09", "w-a1-10", "w-a1-11", "w-a1-12",
    "w-a1-13", "w-a1-14", "w-a1-15", "w-a1-16", "w-a1-17", "w-a1-18",
    "w-a1-19",
}


def main() -> None:
    tasks = json.loads(WRITING_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if (
        fixture.get("schema") != "wegb2-reviewed-writing-decision-batch-v1"
        or fixture.get("batch") != "PA-035-02"
        or len(entries) != 25
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
    ):
        raise SystemExit("unexpected PA-035-02 fixture scope")
    decisions = [entry.get("decision") for entry in entries]
    if decisions.count("corrected") != 17 or decisions.count("confirmed-current") != 8:
        raise SystemExit("unexpected PA-035-02 decision counts")
    if any(entry.get("level") not in {"A0", "A1"} for entry in entries):
        raise SystemExit("unexpected PA-035-02 level scope")

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
        if previous.get("level") != entry["level"] or reviewed.get("level") != entry["level"]:
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
        f"PA-035-02: applied {changed} corrections; "
        f"{already_current} already current"
    )


if __name__ == "__main__":
    main()
