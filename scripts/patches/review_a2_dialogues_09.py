#!/usr/bin/env python3
"""R111 patch: review d-a2-22, d-a2-23, d-a2-24.

Single confirmed Arabic correction: d-a2-23.lines[5].ar — the singular
neuter noun (Die Dekoration / Das) should map to a feminine pronoun in Arabic
when the referent is a feminine noun (الزينة). The live Arabic uses the masculine
"هذا" (matching the original German neuter) but Arabic "الزينة" is feminine;
fix to "هذه" for gender agreement. No German, question, key, or explanation
changes.

The patch is guarded: it snapshots every dialogue/line/question/dictation for
the three targets before applying the change, then asserts that the resulting
leaf diff is limited to exactly the one Arabic field. It is idempotent: running
the script after the fix prints "R111 patch complete" with zero rewrites.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"

TARGET_IDS = ("d-a2-22", "d-a2-23", "d-a2-24")

# Before/after for the single corrected Arabic field.
CORRECTION = {
    "dialogue_id": "d-a2-23",
    "line_index": 5,
    "field": "ar",
    "before": "هذا يصنعه الأطفال. يجب أن تجرّبي الحلويات حتماً.",
    "after": "هذه يصنعها الأطفال. يجب أن تجرّبي الحلويات حتماً.",
}

# Full protected snapshot: every dialogue metadata, line, question, and dictation
# sentence must match these values before the patch runs. Any unexpected drift
# will raise SystemExit before writing.
EXPECTED: dict[str, dict[str, Any]] = {
    "d-a2-22": {
        "titleDe": "Die Stromrechnung",
        "titleAr": "فاتورة الكهرباء",
        "lines": [
            {"who": "Fatma", "de": "Schau, die Nebenkostenabrechnung ist gekommen. Wir müssen 240 Euro nachzahlen."},
            {"who": "Omar",  "de": "So viel? Letztes Jahr gab es eine Rückzahlung von 80 Euro."},
            {"who": "Fatma", "de": "Die Energiekosten sind gestiegen. Und wir haben im Winter zu viel geheizt."},
            {"who": "Omar",  "de": "Dann heizen wir nächsten Winter sparsam: 20 Grad im Wohnzimmer, nicht 23."},
            {"who": "Fatma", "de": "Und ich mache einen Preisvergleich. Vielleicht ist ein anderer Stromanbieter billiger."},
            {"who": "Omar",  "de": "Gute Idee. Wir sollten alle Ausgaben einmal vergleichen: Strom, Internet, Versicherung."},
            {"who": "Fatma", "de": "Machen wir am Sonntag. Ich drucke alle Rechnungen aus."},
            {"who": "Omar",  "de": "Und die 240 Euro? Können wir in Raten zahlen?"},
        ],
        "questions": [
            {"id": "d-a2-22-q1", "type": "mc",        "answer": "Es gab eine Rückzahlung von 80 Euro."},
            {"id": "d-a2-22-q2", "type": "mc",        "answer": "einen Preisvergleich der Stromanbieter"},
            {"id": "d-a2-22-q3", "type": "truefalse", "answer": "richtig"},
        ],
        "dictation": [
            "Die Energiekosten sind gestiegen.",
            "Vielleicht ist ein anderer Stromanbieter billiger.",
        ],
    },
    "d-a2-23": {
        "titleDe": "Einladung zum Fest",
        "titleAr": "دعوة إلى العيد",
        "lines": [
            {"who": "Lena",  "de": "Danke für die Einladung zum Ramadanfest, Salma! Was soll ich mitbringen?"},
            {"who": "Salma", "de": "Nur dich selbst. Die Vorbereitung machen wir in der Familie, das ist Tradition."},
            {"who": "Lena",  "de": "Wie viele Gäste kommen?"},
            {"who": "Salma", "de": "Ungefähr zwanzig. Meine Mutter bereitet seit gestern die Speisen vor."},
            {"who": "Lena",  "de": "Und die Dekoration? Die Lichter am Fenster sind wunderschön."},
            {"who": "Salma", "de": "Das machen die Kinder. Du musst unbedingt die süßen Speisen probieren."},
            {"who": "Lena",  "de": "Gern! Wie gratuliert man richtig?"},
            {"who": "Salma", "de": "Sag einfach „Frohes Fest“. Gastfreundschaft ist bei uns das Wichtigste."},
        ],
        "questions": [
            {"id": "d-a2-23-q1", "type": "mc",   "answer": "die Kinder"},
            {"id": "d-a2-23-q2", "type": "mc",   "answer": "nichts, nur sich selbst"},
            {"id": "d-a2-23-q3", "type": "fill", "answer": ["Gäste"]},
        ],
        "dictation": [
            "Die Vorbereitung machen wir in der Familie, das ist Tradition.",
            "Gastfreundschaft ist bei uns das Wichtigste.",
        ],
    },
    "d-a2-24": {
        "titleDe": "Bewerbung für das Stipendium",
        "titleAr": "طلب المنحة الدراسية",
        "lines": [
            {"who": "Beraterin", "de": "Sie möchten sich für das Stipendium bewerben? Erzählen Sie kurz von sich."},
            {"who": "Youssef",   "de": "Ich habe letztes Jahr den Abschluss am Gymnasium gemacht, mit guten Noten."},
            {"who": "Beraterin", "de": "Welche Note in Mathematik?"},
            {"who": "Youssef",   "de": "Eine Zwei. In der letzten Klassenarbeit sogar eine Eins."},
            {"who": "Beraterin", "de": "Gut. Das Stipendium ist für Studierende, die fleißig und selbstständig arbeiten. Warum brauchen Sie die Unterstützung?"},
            {"who": "Youssef",   "de": "Meine Eltern können das Studium nicht bezahlen. Ich arbeite nebenbei im Supermarkt."},
            {"who": "Beraterin", "de": "Verstehe. Schicken Sie die Bewerbungsunterlagen bis zum 15. März: Zeugnis, Lebenslauf und ein kurzes Motivationsschreiben."},
            {"who": "Youssef",   "de": "Und wie bereite ich mich auf das Gespräch vor?"},
        ],
        "questions": [
            {"id": "d-a2-24-q1", "type": "mc",        "answer": "eine Eins"},
            {"id": "d-a2-24-q2", "type": "mc",        "answer": "Seine Eltern können das Studium nicht bezahlen."},
            {"id": "d-a2-24-q3", "type": "truefalse", "answer": "falsch"},
        ],
        "dictation": [
            "Welche Note in Mathematik?",
            "Meine Eltern können das Studium nicht bezahlen.",
        ],
    },
}


def leaf_changes(before: Any, after: Any, path: str = "") -> set[str]:
    out: set[str] = set()
    if type(before) != type(after):
        out.add(path)
        return out
    if isinstance(before, dict):
        bkeys, akeys = set(before), set(after)
        for k in bkeys - akeys:
            out.add(f"{path}.{k}" if path else k)
        for k in akeys - bkeys:
            out.add(f"{path}.{k}" if path else k)
        for k in bkeys & akeys:
            sub = f"{path}.{k}" if path else k
            out |= leaf_changes(before[k], after[k], sub)
    elif isinstance(before, list):
        if len(before) != len(after):
            out.add(path)
        else:
            for i, (b, a) in enumerate(zip(before, after)):
                out |= leaf_changes(b, a, f"{path}[{i}]")
    else:
        if before != after:
            out.add(path)
    return out


def guarded_update(container: dict, field: str, before: str, after: str, loc: str) -> None:
    current = container.get(field)
    if current == after:
        return
    if current != before:
        raise SystemExit(
            f"Guard mismatch at {loc}: expected {before!r}, found {current!r}"
        )
    container[field] = after


def main() -> None:
    dialogue_raw = DIALOGUES_PATH.read_text(encoding="utf-8")
    dialogues = json.loads(dialogue_raw)
    by_id = {d.get("id"): d for d in dialogues if isinstance(d, dict) and "id" in d}
    before_dialogues = json.loads(dialogue_raw)

    # Verify all three targets exist and snapshot-protected fields match expectations.
    for tid, exp in EXPECTED.items():
        d = by_id.get(tid)
        if d is None:
            raise SystemExit(f"Missing dialogue {tid}")
        if d.get("titleDe") != exp["titleDe"] or d.get("titleAr") != exp["titleAr"]:
            raise SystemExit(f"Unexpected title for {tid}")
        if len(d.get("lines", [])) != len(exp["lines"]):
            raise SystemExit(f"Unexpected line count for {tid}")
        for i, exp_line in enumerate(exp["lines"]):
            line = d["lines"][i]
            if line.get("who") != exp_line["who"]:
                raise SystemExit(f"{tid}.lines[{i}].who drifted: {line.get('who')!r}")
            if line.get("de") != exp_line["de"]:
                raise SystemExit(f"{tid}.lines[{i}].de drifted: {line.get('de')!r}")
        if len(d.get("questions", [])) != len(exp["questions"]):
            raise SystemExit(f"Unexpected question count for {tid}")
        for qi, exp_q in enumerate(exp["questions"]):
            q = d["questions"][qi]
            if q.get("id") != exp_q["id"] or q.get("type") != exp_q["type"]:
                raise SystemExit(f"{tid} question[{qi}] id/type mismatch")
            if q.get("answer") != exp_q["answer"]:
                raise SystemExit(f"{tid} question[{qi}] answer drifted: {q.get('answer')!r}")
        if d.get("dictation", []) != exp["dictation"]:
            raise SystemExit(f"{tid} dictation drifted")

    # Apply the single guarded correction.
    c = CORRECTION
    target_d = by_id[c["dialogue_id"]]
    guarded_update(target_d["lines"][c["line_index"]], c["field"], c["before"], c["after"],
                   f"{c['dialogue_id']}.lines[{c['line_index']}].{c['field']}")

    # Ensure the diff is limited to the single corrected Arabic field.
    changed_leaves = leaf_changes(before_dialogues, dialogues)
    changed = {re.sub(r"\[\d+\]$", "", p) for p in changed_leaves}
    idx = next(i for i, d in enumerate(dialogues) if d.get("id") == c["dialogue_id"])
    expected = {f"[{idx}].lines[{c['line_index']}].ar"}
    if changed and changed != expected:
        raise SystemExit(f"Unexpected dialogue diff size ({len(changed)}): {sorted(changed)}")

    dialogue_out = json.dumps(dialogues, ensure_ascii=False, indent=2) + "\n"
    if dialogue_raw != dialogue_out:
        DIALOGUES_PATH.write_text(dialogue_out, encoding="utf-8")
        print("R111 patch applied; files written: content/dialogues.json")
    else:
        print("R111 patch complete; dialogue fields changed=0, files written=none (already applied)")


if __name__ == "__main__":
    main()
