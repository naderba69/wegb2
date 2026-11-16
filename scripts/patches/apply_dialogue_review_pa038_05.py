#!/usr/bin/env python3
"""Apply the bounded PA-038 batch 05 B2 dialogue decisions.

The fixture stores every complete B2 dialogue before and after review.
Corrected dialogues are replaced only on an exact match; confirmed-current
entries would be identity guards. The patch generates no language and refuses
content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "dialogues-reviewed-05.json"
EXPECTED_IDS = {
    "d-b2-01", "d-b2-02", "d-b2-03", "d-b2-04", "d-b2-05", "d-b2-06",
    "d-b2-07", "d-b2-08", "d-b2-09", "d-b2-10", "d-b2-11", "d-b2-12",
    "d-b2-13", "d-b2-14", "d-b2-15", "d-b2-16", "d-b2-17", "d-b2-18",
    "d-b2-19", "d-b2-20", "d-b2-21", "d-b2-22", "d-b2-23", "d-b2-24",
    "d-b2-25", "d-b2-26", "d-b2-27", "d-b2-31", "d-b2-32",
    "dlg-b2-mietvertrag", "hoer-b2-01", "d-b2-ht01", "d-b2-ht02", "d-b2-ht03",
    "dlg-b2-homeoffice", "dlg-b2-klimadebatte", "dlg-b2-ki-arbeit",
    "d-b2-38", "d-b2-39", "d-b2-40", "d-b2-41", "d-b2-42", "d-b2-43",
    "d-b2-44", "d-b2-45", "d-b2-46", "d-b2-47", "d-b2-48", "d-b2-49",
}


def main() -> None:
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    corrected = [entry for entry in entries if entry.get("decision") == "corrected"]
    confirmed = [entry for entry in entries if entry.get("decision") == "confirmed-current"]
    if (
        fixture.get("schema") != "wegb2-reviewed-dialogue-decision-batch-v1"
        or fixture.get("batch") != "PA-038-05"
        or len(entries) != 49
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
        or len(corrected) != 49
        or confirmed
    ):
        raise SystemExit("unexpected PA-038-05 fixture scope")
    if any(entry.get("level") != "B2" or not str(entry.get("rationale", "")).strip() for entry in entries):
        raise SystemExit("unexpected PA-038-05 decision metadata")

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
        if previous.get("level") != "B2" or reviewed.get("level") != "B2":
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
    print(f"PA-038-05: applied {changed} corrections; {already_current} already current")


if __name__ == "__main__":
    main()
