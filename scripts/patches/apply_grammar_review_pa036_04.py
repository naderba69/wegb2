#!/usr/bin/env python3
"""Apply the bounded PA-036 batch 04 B1 grammar-topic decisions.

The fixture stores every complete B1 topic before and after review. Corrected
topics are replaced only on an exact match. The patch generates no language and
refuses scope or content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GRAMMAR_PATH = ROOT / "content" / "grammar.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "grammar-reviewed-04.json"
EXPECTED_IDS = {
    "b1-konj2", "b1-relativ", "b1-konnektoren", "b1-plusquamperfekt",
    "b1-genitiv", "b1-adjektivendungen", "b1-wortbildung", "b1-unbestimmte",
    "b1-verb-praeposition", "b1-passiv", "b1-indirekte-fragen",
    "b1-funktionsverben", "b1-absicht", "b1-konj2-vergangenheit",
    "b1-pruefungsstrategie",
}


def main() -> None:
    topics = json.loads(GRAMMAR_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    corrected = [entry for entry in entries if entry.get("decision") == "corrected"]
    confirmed = [entry for entry in entries if entry.get("decision") == "confirmed-current"]
    if (
        fixture.get("schema") != "wegb2-reviewed-grammar-decision-batch-v1"
        or fixture.get("batch") != "PA-036-04"
        or len(entries) != 15
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
        or len(corrected) != 15
        or len(confirmed) != 0
    ):
        raise SystemExit("unexpected PA-036-04 fixture scope")
    if any(entry.get("level") != "B1" or not str(entry.get("rationale", "")).strip() for entry in entries):
        raise SystemExit("unexpected PA-036-04 decision metadata")

    changed = 0
    already_current = 0
    for entry in entries:
        topic_id = entry["id"]
        if topic_id not in topics:
            raise SystemExit(f"missing reviewed grammar topic: {topic_id}")
        previous = entry["previous"]
        reviewed = entry["current"]
        if previous.get("id") != topic_id or reviewed.get("id") != topic_id:
            raise SystemExit(f"identity drift inside fixture: {topic_id}")
        if previous.get("level") != "B1" or reviewed.get("level") != "B1":
            raise SystemExit(f"level drift inside fixture: {topic_id}")
        if previous == reviewed:
            raise SystemExit(f"corrected decision does not change topic: {topic_id}")

        current = topics[topic_id]
        if current == reviewed:
            already_current += 1
            continue
        if current != previous:
            raise SystemExit(f"unexpected current grammar topic: {topic_id}")
        topics[topic_id] = reviewed
        changed += 1

    if changed:
        GRAMMAR_PATH.write_text(
            json.dumps(topics, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print(
        f"PA-036-04: applied {changed} corrections; "
        f"{already_current} corrected topics already current"
    )


if __name__ == "__main__":
    main()
