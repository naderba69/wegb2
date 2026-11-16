#!/usr/bin/env python3
"""Apply the bounded PA-037 batch 02 A1 reading-text decisions.

The fixture stores every complete A1 text card before and after review.
Corrected cards are replaced only on an exact match; confirmed-current cards
are identity guards. The patch generates no language and refuses content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXTS_PATH = ROOT / "content" / "texts.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "texts-reviewed-02.json"
EXPECTED_IDS = {
    "t-a1-01", "t-a1-02", "t-a1-03", "t-a1-04", "t-a1-05",
    "t-a1-06", "t-a1-07", "t-a1-08", "t-a1-09", "t-a1-10",
    "t-a1-11", "t-a1-12", "t-a1-13", "t-a1-14", "t-a1-15",
    "t-a1-16", "t-a1-17", "t-a1-18", "t-a1-19", "t-a1-20",
    "t-a1-021", "t-a1-022", "t-a1-023", "t-a1-024", "t-a1-025",
    "t-a1-026", "t-a1-027", "t-a1-028", "t-a1-029", "t-a1-030",
    "t-a1-031", "t-a1-032", "t-a1-033", "t-a1-034", "t-a1-035",
}


def main() -> None:
    texts = json.loads(TEXTS_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    corrected = [entry for entry in entries if entry.get("decision") == "corrected"]
    confirmed = [entry for entry in entries if entry.get("decision") == "confirmed-current"]
    if (
        fixture.get("schema") != "wegb2-reviewed-text-decision-batch-v1"
        or fixture.get("batch") != "PA-037-02"
        or len(entries) != 35
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
        or len(corrected) != 25
        or len(confirmed) != 10
    ):
        raise SystemExit("unexpected PA-037-02 fixture scope")
    if any(entry.get("level") != "A1" or not str(entry.get("rationale", "")).strip() for entry in entries):
        raise SystemExit("unexpected PA-037-02 decision metadata")

    locations = {text.get("id"): (index, text) for index, text in enumerate(texts)}
    if len(locations) != len(texts):
        raise SystemExit("duplicate text ids in content/texts.json")
    changed = 0
    already_current = 0
    for entry in entries:
        text_id = entry["id"]
        if text_id not in locations:
            raise SystemExit(f"missing reviewed reading text: {text_id}")
        index, current = locations[text_id]
        previous = entry["previous"]
        reviewed = entry["current"]
        decision = entry["decision"]
        if previous.get("id") != text_id or reviewed.get("id") != text_id:
            raise SystemExit(f"identity drift inside fixture: {text_id}")
        if previous.get("level") != "A1" or reviewed.get("level") != "A1":
            raise SystemExit(f"level drift inside fixture: {text_id}")
        if decision == "confirmed-current" and previous != reviewed:
            raise SystemExit(f"confirmed-current decision changes text: {text_id}")
        if decision == "corrected" and previous == reviewed:
            raise SystemExit(f"corrected decision does not change text: {text_id}")
        if current == reviewed:
            already_current += 1
            continue
        if current != previous:
            raise SystemExit(f"unexpected current reading text: {text_id}")
        texts[index] = reviewed
        locations[text_id] = (index, reviewed)
        changed += 1

    if changed:
        TEXTS_PATH.write_text(
            json.dumps(texts, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print(f"PA-037-02: applied {changed} corrections; {already_current} already current")


if __name__ == "__main__":
    main()
