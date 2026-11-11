#!/usr/bin/env python3
"""Guarded, idempotent PED-03 patch for exact parenthetical answer leaks."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GRAMMAR = ROOT / "content" / "grammar.json"

# Explicit review decisions only. This is deliberately not a broad regex rewrite:
# derivational scaffolds such as (kommen) -> komme remain untouched for PED-31.
CHANGES: dict[str, tuple[str, str]] = {
    "a2-reflexiv-v1": (
        "Ich freue ___ auf den Urlaub. (mich)",
        "Ich freue ___ auf den Urlaub. (Reflexivpronomen zu „ich“)",
    ),
    "b1-pas-e5": (
        "Das lässt sich ___. (machen)",
        "Das lässt sich ___. (Synonym: tun)",
    ),
    "a0-begrussung-f4": (
        "Ich ___ aus Tunesien. (komme)",
        "Ich ___ aus Tunesien. (kommen)",
    ),
    "a1-modalverben-ex04": (
        "Ich kann gut Deutsch ___. (sprechen)",
        "Ich kann gut Deutsch ___. (mündlich kommunizieren)",
    ),
    "a1-imp-n1": (
        "___ Sie bitte Platz! (nehmen)",
        "___ Sie bitte Platz!",
    ),
    "b1-indir-n2": (
        "Sag mir bitte, ___ du wohnst. (wo)",
        "Sag mir bitte, ___ du wohnst. (Ort)",
    ),
    "b1-indir-n7": (
        "Weißt du, ___ das Konzert beginnt? (wann)",
        "Weißt du, ___ das Konzert beginnt? (Zeitpunkt)",
    ),
    "b2-redew-f2": (
        "Die Nachricht hat mich völlig aus der ___ gebracht. (Ruhe)",
        "Die Nachricht hat mich völlig aus der ___ gebracht. (innere Gelassenheit)",
    ),
    "b2-redew-f3": (
        "Es ist höchste ___, dass wir anfangen. (Zeit)",
        "Es ist höchste ___, dass wir anfangen. (es wird dringend)",
    ),
    "b2-redew-f4": (
        "Seine Rede hat mir den ___ gegeben, Deutsch zu lernen. (Anstoß)",
        "Seine Rede hat mir den ___ gegeben, Deutsch zu lernen. (Impuls)",
    ),
    "a2-verb-praep-q2": (
        "Wir sprechen ___ das Wochenende. (über)",
        "Wir sprechen ___ das Wochenende. (Thema)",
    ),
    "a2-verb-praep-q3": (
        "Ich denke oft ___ dich. (an)",
        "Ich denke oft ___ dich. (Bezug auf eine Person)",
    ),
    "a2-verb-praep-v1": (
        "Ich warte ___ den Bus. (auf)",
        "Ich warte ___ den Bus. (erwartete Ankunft)",
    ),
    "a1-weil-e2": (
        "Wir fahren nicht nach Berlin, weil wir kein Geld ___. (haben)",
        "Wir fahren nicht nach Berlin, weil wir kein Geld ___. (Besitz ausdrücken)",
    ),
    "a2-neben-n2": (
        "Wir bleiben zu Hause, ___ es regnet. (denn)",
        "Wir bleiben zu Hause, ___ es regnet. (Grund, Hauptsatzwortstellung)",
    ),
    "a2-neben-n6": (
        "Er ist müde, ___ er schläft nicht. (aber)",
        "Er ist müde, ___ er schläft nicht. (Gegensatz)",
    ),
    "a2-neben-v2": (
        "Sie lernt viel, ___ sie will bestehen. (denn)",
        "Sie lernt viel, ___ sie will bestehen. (Grund, Hauptsatzwortstellung)",
    ),
    "a2-demo-n1": (
        "___ Mann ist mein Vater. (dieser)",
        "___ Mann ist mein Vater.",
    ),
    "b1-absicht-n2": (
        "Ich helfe dir, ___ du bestehst. (damit)",
        "Ich helfe dir, ___ du bestehst. (Ziel, verschiedene Subjekte)",
    ),
    "b1-absicht-v1": (
        "Lern fleißig, ___ du bestehst! (damit)",
        "Lern fleißig, ___ du bestehst! (Ziel, verschiedene Subjekte)",
    ),
    "b1-konj2-vergangenheit-n1": (
        "Ich ___ gelernt. (hätte)",
        "Ich ___ gelernt.",
    ),
    "b1-konj2-vergangenheit-n2": (
        "Ich ___ gegangen. (wäre)",
        "Ich ___ gegangen.",
    ),
    "b1-konj2-vergangenheit-v1": (
        "Ohne dich ___ ich versagt. (hätte)",
        "Ohne dich ___ ich versagt. (haben, Konjunktiv II Vergangenheit)",
    ),
    "b2-textkonnektoren-n2": (
        "Er ___ blieb zu Hause. (hingegen)",
        "Er ___ blieb zu Hause. (Gegensatz nach dem Subjekt)",
    ),
    "b2-textkonnektoren-n6": (
        "___ regnete es, aber wir gingen. (zwar)",
        "___ regnete es, aber wir gingen.",
    ),
    "b2-textkonnektoren-v1": (
        "___ er müde war, arbeitete er. (Obgleich)",
        "___ er müde war, arbeitete er. (Konzessivkonnektor)",
    ),
    "a0-satzbau-v1": (
        "Heute ___ ich Kaffee. (trinke)",
        "Heute ___ ich Kaffee. (trinken)",
    ),
    "b2-k2vht-e2": (
        "Wäre er nicht krank gewesen, ___ er teilgenommen. (hätte)",
        "Wäre er nicht krank gewesen, ___ er teilgenommen. (haben, Konjunktiv II Vergangenheit)",
    ),
    "b2-k2vht-e7": (
        "Ohne deine Hilfe ___ ich es nicht geschafft. (hätte)",
        "Ohne deine Hilfe ___ ich es nicht geschafft. (haben, Konjunktiv II Vergangenheit)",
    ),
    "b2-k2vht-v1": (
        "Ohne dich ___ ich versagt. (hätte)",
        "Ohne dich ___ ich versagt. (haben, Konjunktiv II Vergangenheit)",
    ),
    "b2-nom-e2": (
        "___ seiner Erfahrung bekam er den Job. (aufgrund)",
        "___ seiner Erfahrung bekam er den Job. (Grund)",
    ),
    "b2-nom-e8": (
        "___ der Prüfung lernte er viel. (zum Zweck)",
        "___ der Prüfung lernte er viel. (Ziel)",
    ),
}


def main() -> None:
    data = json.loads(GRAMMAR.read_text(encoding="utf-8"))
    found: set[str] = set()
    changed = 0

    for topic in data.values():
        for section in ("exercises", "verify"):
            for exercise in topic.get(section, []):
                exercise_id = exercise.get("id")
                if exercise_id not in CHANGES:
                    continue
                found.add(exercise_id)
                old, new = CHANGES[exercise_id]
                fields = [field for field in ("promptDe", "text") if field in exercise]
                if not fields:
                    raise RuntimeError(f"{exercise_id}: no promptDe/text field")
                guarded_fields = 0
                for field in fields:
                    value = exercise[field]
                    if value == old:
                        exercise[field] = new
                        changed += 1
                        guarded_fields += 1
                    elif value == new:
                        guarded_fields += 1
                if guarded_fields == 0:
                    values = {field: exercise[field] for field in fields}
                    raise RuntimeError(
                        f"{exercise_id}: no field has the guarded old/new value; got {values!r}"
                    )

    missing = sorted(set(CHANGES) - found)
    if missing:
        raise RuntimeError(f"missing reviewed exercises: {', '.join(missing)}")

    if changed:
        GRAMMAR.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print(f"PED-03 exact-answer hints: {len(found)} reviewed ids, {changed} fields changed")


if __name__ == "__main__":
    main()
