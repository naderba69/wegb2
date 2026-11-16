#!/usr/bin/env python3
"""Apply the bounded PA-034 batch 15 decisions without generating conjugations.

The reviewed fixture is the decision record. This closing batch contains only
confirmed-current identity guards. The patch is idempotent and refuses any
ID/deck/level/headword/posInfo or scope drift.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VOCAB_PATH = ROOT / "content" / "vocab.json"
FIXTURE_PATH = ROOT / "scripts" / "fixtures" / "vocab-posinfo-reviewed-15.json"
EXPECTED_DECKS = {
    "h05-staat-recht",
    "h06-studium-lernen",
    "h07-gefuehle-psyche",
    "i01-medien-meinung",
    "i04-energie-wende",
    "i05-ernaehrung-verbraucherschutz",
    "i08-erinnerungskultur",
    "j01-arbeit-vertieft",
    "j02-gesellschaft-recht",
    "j03-umwelt-energie",
    "j04-gesundheit-pflege",
    "j05-bildung-wissenschaft",
    "j06-medien-digital",
    "j07-geld-wirtschaft",
    "j08-gefuehle-beziehungen",
    "j09-stadt-wohnen-verkehr",
    "j10-meinung-diskussion",
    "j11-alltag-haus",
    "j12-natur-tiere",
    "j13-koerper-zeit",
    "j14-kultur-freizeit",
    "j15-berufe-dienste",
    "j16-wege-ziele",
}


def main() -> None:
    vocab = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    fixture = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    entries = fixture.get("entries", [])
    if (
        fixture.get("schema")
        != "wegb2-reviewed-vocab-posinfo-decision-batch-v1"
        or fixture.get("batch") != "PA-034-15"
        or len(entries) != 97
        or len({entry.get("id") for entry in entries}) != 97
    ):
        raise SystemExit("unexpected PA-034-15 fixture scope")
    if (
        any(entry.get("decision") != "confirmed-current" for entry in entries)
        or any(entry.get("previousPosInfo") != entry.get("posInfo") for entry in entries)
        or any(entry.get("level") != "B2" for entry in entries)
        or {entry.get("deck") for entry in entries} != EXPECTED_DECKS
    ):
        raise SystemExit("unexpected PA-034-15 decision or level/deck scope")

    locations = {
        card.get("id"): (deck_id, deck.get("level"), card)
        for deck_id, deck in vocab.items()
        for card in deck.get("cards", [])
        if card.get("id")
    }
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
        current = card.get("posInfo")
        if current != entry["posInfo"]:
            raise SystemExit(
                f"unexpected posInfo for {card_id}: {current!r}; "
                f"expected confirmed value {entry['posInfo']!r}"
            )

    print(f"PA-034-15: applied 0 corrections; {len(entries)} already current")


if __name__ == "__main__":
    main()
