#!/usr/bin/env python3
"""Apply the bounded PA-034 batch 06 review without generating conjugations.

The reviewed fixture is the decision record. This patch only updates an exact
ID/de/previousPosInfo match, is idempotent, and refuses scope drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VOCAB_PATH = ROOT / "content" / "vocab.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "vocab-posinfo-reviewed-06.json"


def main() -> None:
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if fixture.get("batch") != "PA-034-06" or len(entries) != 75:
        raise SystemExit("unexpected PA-034-06 fixture scope")

    locations = {
        card.get("id"): (deck_id, card)
        for deck_id, deck in vocab.items()
        for card in deck.get("cards", [])
        if card.get("id")
    }
    changed = 0
    for entry in entries:
        card_id = entry["id"]
        if card_id not in locations:
            raise SystemExit(f"missing reviewed card: {card_id}")
        deck_id, card = locations[card_id]
        if deck_id != entry["deck"] or card.get("de") != entry["de"]:
            raise SystemExit(f"identity drift for reviewed card: {card_id}")
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
    print(f"PA-034-06: applied {changed} corrections; {len(entries) - changed} already current")


if __name__ == "__main__":
    main()
