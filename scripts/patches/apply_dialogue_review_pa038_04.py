#!/usr/bin/env python3
"""Apply the bounded PA-038 batch 04 B1 dialogue decisions.

The fixture stores every complete B1 dialogue before and after review.
Corrected dialogues are replaced only on an exact match; confirmed-current
entries would be identity guards. The patch generates no language and refuses
content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "dialogues-reviewed-04.json"
EXPECTED_IDS = {
    "d-b1-01", "d-b1-02", "d-b1-03", "d-b1-04", "d-b1-05", "d-b1-06",
    "d-b1-07", "d-b1-08", "d-b1-09", "d-b1-10", "d-b1-11", "d-b1-12",
    "d-b1-13", "d-b1-14", "d-b1-15", "d-b1-16", "d-b1-17", "d-b1-18",
    "d-b1-19", "d-b1-20", "d-b1-21", "d-b1-22", "d-b1-23", "d-b1-24",
    "d-b1-25", "d-b1-26", "d-b1-27", "d-b1-31", "d-b1-32",
    "dlg-b1-kontoeroeffnung", "hoer-b1-01", "d-b1-ht01", "d-b1-ht02",
    "d-b1-ht03", "dlg-b1-wohnungssuche", "dlg-b1-berufsberatung",
    "dlg-b1-elterngespraech",
}


def main() -> None:
    dialogues = json.loads(DIALOGUES_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    corrected = [entry for entry in entries if entry.get("decision") == "corrected"]
    confirmed = [entry for entry in entries if entry.get("decision") == "confirmed-current"]
    if (
        fixture.get("schema") != "wegb2-reviewed-dialogue-decision-batch-v1"
        or fixture.get("batch") != "PA-038-04"
        or len(entries) != 37
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
        or len(corrected) != 37
        or confirmed
    ):
        raise SystemExit("unexpected PA-038-04 fixture scope")
    if any(entry.get("level") != "B1" or not str(entry.get("rationale", "")).strip() for entry in entries):
        raise SystemExit("unexpected PA-038-04 decision metadata")

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
        if previous.get("level") != "B1" or reviewed.get("level") != "B1":
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
    print(f"PA-038-04: applied {changed} corrections; {already_current} already current")


if __name__ == "__main__":
    main()
