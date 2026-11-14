#!/usr/bin/env python3
"""Apply the bounded PA-034 batch 13 decisions without generating conjugations.

The reviewed fixture is the decision record. Corrected entries update only an
exact ID/deck/level/de/previousPosInfo match. Confirmed-current entries are
identity guards. The patch is idempotent and refuses scope drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VOCAB_PATH = ROOT / "content" / "vocab.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "vocab-posinfo-reviewed-13.json"


def main() -> None:
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if (
        fixture.get("schema")
        != "wegb2-reviewed-vocab-posinfo-decision-batch-v1"
        or fixture.get("batch") != "PA-034-13"
        or len(entries) != 119
        or len({entry.get("id") for entry in entries}) != 119
    ):
        raise SystemExit("unexpected PA-034-13 fixture scope")
    decisions = [entry.get("decision") for entry in entries]
    if decisions.count("corrected") != 2 or decisions.count("confirmed-current") != 117:
        raise SystemExit("unexpected PA-034-13 decision counts")
    if any(entry.get("level") != "B1" for entry in entries):
        raise SystemExit("unexpected PA-034-13 level scope")

    locations = {
        card.get("id"): (deck_id, deck.get("level"), card)
        for deck_id, deck in vocab.items()
        for card in deck.get("cards", [])
        if card.get("id")
    }
    changed = 0
    for entry in entries:
        card_id = entry["id"]
        if card_id not in locations:
            raise SystemExit(f"missing reviewed card: {card_id}")
        deck_id, level, card = locations[card_id]
        if (
            deck_id != entry["deck"]
            or level != entry["level"]
            or card.get("de") != entry["de"]
        ):
            raise SystemExit(f"identity drift for reviewed card: {card_id}")
        decision = entry.get("decision")
        if decision not in {"corrected", "confirmed-current"}:
            raise SystemExit(f"unexpected decision for reviewed card: {card_id}")
        if decision == "confirmed-current" and entry["previousPosInfo"] != entry["posInfo"]:
            raise SystemExit(f"confirmed-current decision changes posInfo: {card_id}")
        if decision == "corrected" and entry["previousPosInfo"] == entry["posInfo"]:
            raise SystemExit(f"corrected decision does not change posInfo: {card_id}")
        current = card.get("posInfo")
        if current == entry["posInfo"]:
            continue
        if current != entry["previousPosInfo"]:
            raise SystemExit(
                f"unexpected posInfo for {card_id}: {current!r}; "
                f"expected previous value {entry['previousPosInfo']!r}"
            )
        card["posInfo"] = entry["posInfo"]
        changed += 1

    VOCAB_PATH.write_text(
        json.dumps(vocab, ensure_ascii=False, indent=1) + "\n",
        encoding="utf-8",
    )
    print(f"PA-034-13: applied {changed} corrections; {len(entries) - changed} already current")


if __name__ == "__main__":
    main()
