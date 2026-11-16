#!/usr/bin/env python3
"""Apply the bounded PA-036 batch 01 A0 grammar-topic decisions.

The fixture stores every complete A0 topic before and after review. Corrected
topics are replaced only on an exact match. The patch generates no language
and refuses scope, identity, or content drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GRAMMAR_PATH = ROOT / "content" / "grammar.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "grammar-reviewed-01.json"
EXPECTED_IDS = {
    "a0-begrussung",
    "a0-buchstaben",
    "a0-zahlen",
    "a0-artikel",
    "a0-du-sie",
    "a0-aussprache-vowels",
    "a0-aussprache-umlaut",
    "a0-satzbau",
}


def main() -> None:
    topics = json.loads(GRAMMAR_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if (
        fixture.get("schema") != "wegb2-reviewed-grammar-decision-batch-v1"
        or fixture.get("batch") != "PA-036-01"
        or len(entries) != 8
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
    ):
        raise SystemExit("unexpected PA-036-01 fixture scope")
    if any(
        entry.get("level") != "A0"
        or entry.get("decision") != "corrected"
        or not str(entry.get("rationale", "")).strip()
        for entry in entries
    ):
        raise SystemExit("unexpected PA-036-01 decision metadata")

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
        if previous.get("level") != "A0" or reviewed.get("level") != "A0":
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
        f"PA-036-01: applied {changed} corrections; "
        f"{already_current} already current"
    )


if __name__ == "__main__":
    main()
