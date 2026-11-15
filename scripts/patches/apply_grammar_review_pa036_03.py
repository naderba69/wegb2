#!/usr/bin/env python3
"""Apply the bounded PA-036 batch 03 A2 grammar-topic decisions.

The fixture stores every complete A2 topic before and after review. Corrected
topics are replaced only on an exact match; confirmed-current topics must still
match exactly. The patch generates no language and refuses scope or content
drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GRAMMAR_PATH = ROOT / "content" / "grammar.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "grammar-reviewed-03.json"
EXPECTED_IDS = {
    "a2-praeteritum", "a2-perfekt", "a2-weil-dass", "a2-wechsel", "a2-modal",
    "a2-dativ", "a2-negation", "a2-imperativ", "a2-reflexiv", "a2-steigerung",
    "a2-futur", "a1-futur-einf", "a2-praeteritum-grund", "a2-konj2-hoflich",
    "a2-verb-praep", "a2-adjektiv-einfach", "a1-weil-dass", "a2-verschmolzene",
    "a2-neben", "a2-demo", "a2-wasfuer", "a2-pruefungsstrategie",
}


def main() -> None:
    topics = json.loads(GRAMMAR_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    corrected = [entry for entry in entries if entry.get("decision") == "corrected"]
    confirmed = [entry for entry in entries if entry.get("decision") == "confirmed-current"]
    if (
        fixture.get("schema") != "wegb2-reviewed-grammar-decision-batch-v1"
        or fixture.get("batch") != "PA-036-03"
        or len(entries) != 22
        or {entry.get("id") for entry in entries} != EXPECTED_IDS
        or len(corrected) != 18
        or len(confirmed) != 4
    ):
        raise SystemExit("unexpected PA-036-03 fixture scope")
    if any(entry.get("level") != "A2" or not str(entry.get("rationale", "")).strip() for entry in entries):
        raise SystemExit("unexpected PA-036-03 decision metadata")

    changed = 0
    already_current = 0
    confirmed_current = 0
    for entry in entries:
        topic_id = entry["id"]
        if topic_id not in topics:
            raise SystemExit(f"missing reviewed grammar topic: {topic_id}")
        previous = entry["previous"]
        reviewed = entry["current"]
        if previous.get("id") != topic_id or reviewed.get("id") != topic_id:
            raise SystemExit(f"identity drift inside fixture: {topic_id}")
        if previous.get("level") != "A2" or reviewed.get("level") != "A2":
            raise SystemExit(f"level drift inside fixture: {topic_id}")

        current = topics[topic_id]
        if entry["decision"] == "confirmed-current":
            if previous != reviewed or current != reviewed:
                raise SystemExit(f"confirmed-current grammar topic drifted: {topic_id}")
            confirmed_current += 1
            continue
        if previous == reviewed:
            raise SystemExit(f"corrected decision does not change topic: {topic_id}")
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
        f"PA-036-03: applied {changed} corrections; "
        f"{already_current} corrected topics already current; "
        f"{confirmed_current} confirmed current"
    )


if __name__ == "__main__":
    main()
