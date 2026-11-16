#!/usr/bin/env python3
"""Apply the bounded PA-038 batch 02 A1 dialogue decisions.

The fixture stores every complete A1 dialogue before and after review.
Corrected dialogues are replaced only on an exact match; confirmed-current
entries would be identity guards. The patch generates no language and refuses
content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "dialogues-reviewed-02.json"
EXPECTED_IDS = {
    "d-a1-01", "d-a1-02", "d-a1-03", "d-a1-04", "d-a1-05", "d-a1-06",
    "d-a1-07", "d-a1-08", "d-a1-09", "d-a1-10", "d-a1-11", "d-a1-12",
    "d-a1-13", "d-a1-14", "d-a1-15", "d-a1-16", "d-a1-17", "d-a1-18",
    "d-a1-19", "d-a1-20", "d-a1-21", "d-a1-22", "d-a1-23", "d-a1-24",
    "d-a1-25", "d-a1-26", "d-a1-27", "d-a1-31", "d-a1-32",
    "dlg-a1-fahrkarte", "hoer-a1-01", "hoer-a1-02", "d-a1-ht01",
    "d-a1-ht02", "d-a1-ht03", "dlg-a1-baeckerei",
}


def main() -> None:
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    corrected = [entry for entry in entries if entry.get("decision") == "corrected"]
    confirmed = [entry for entry in entries if entry.get("decision") == "confirmed-current"]
    if (
        fixture.get("schema") != "wegb2-reviewed-dialogue-decision-batch-v1"
        or fixture.get("batch") != "PA-038-02"
        or len(entries) != 36
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
        or len(corrected) != 36
        or confirmed
    ):
        raise SystemExit("unexpected PA-038-02 fixture scope")
    if any(entry.get("level") != "A1" or not str(entry.get("rationale", "")).strip() for entry in entries):
        raise SystemExit("unexpected PA-038-02 decision metadata")

    locations = {dialogue.get("id"): (index, dialogue) for index, dialogue in enumerate(dialogues)}
    if len(locations) != len(dialogues):
        raise SystemExit("duplicate dialogue ids in content/dialogues.json")
    changed = 0
    already_current = 0
    for entry in entries:
        dialogue_id = entry["id"]
        if dialogue_id not in locations:
            raise SystemExit(f"missing reviewed dialogue: {dialogue_id}")
        index, current = locations[dialogue_id]
        previous = entry["previous"]
        reviewed = entry["current"]
        decision = entry["decision"]
        if previous.get("id") != dialogue_id or reviewed.get("id") != dialogue_id:
            raise SystemExit(f"identity drift inside fixture: {dialogue_id}")
        if previous.get("level") != "A1" or reviewed.get("level") != "A1":
            raise SystemExit(f"level drift inside fixture: {dialogue_id}")
        if decision == "confirmed-current" and previous != reviewed:
            raise SystemExit(f"confirmed-current decision changes dialogue: {dialogue_id}")
        if decision == "corrected" and previous == reviewed:
            raise SystemExit(f"corrected decision does not change dialogue: {dialogue_id}")
        if current == reviewed:
            already_current += 1
            continue
        if current != previous:
            raise SystemExit(f"unexpected current dialogue: {dialogue_id}")
        dialogues[index] = reviewed
        locations[dialogue_id] = (index, reviewed)
        changed += 1

    if changed:
        DIALOGUES_PATH.write_text(
            json.dumps(dialogues, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print(f"PA-038-02: applied {changed} corrections; {already_current} already current")


if __name__ == "__main__":
    main()
