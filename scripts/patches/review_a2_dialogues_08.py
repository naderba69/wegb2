#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply the guarded R110 corrections for A2 dialogues d-a2-19–d-a2-21.

R110 found 42 tracked units across three dialogues; German content and
question keys are sound. The single confirmed Arabic correction is a
parallelism fix in d-a2-21 line 4: the comparative "zum Facharzt, nicht
nur zum Hausarzt" needs the preposition repeated on both sides.

The patch is idempotent: before/after anchors protect every line, question,
dictation, and waisen list; any unexpected drift aborts the run.
"""
from copy import deepcopy
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"

DIALOGUE_CHANGES = [
    (
        "d-a2-21",
        "line",
        4,
        "ar",
        "إذن عليه غداً الذهاب إلى الطبيب المختص لا طبيب العائلة فقط.",
        "إذن عليه غداً الذهاب إلى الطبيب المختص لا إلى طبيب العائلة فقط.",
    ),
]


def get_dialogue(data, dialogue_id):
    matches = [item for item in data if item.get("id") == dialogue_id]
    if len(matches) != 1:
        raise SystemExit(f"Expected exactly one dialogue {dialogue_id}; found {len(matches)}")
    return matches[0]


def get_question(dialogue, question_id):
    matches = [
        item for item in dialogue.get("questions", []) if item.get("id") == question_id
    ]
    if len(matches) != 1:
        raise SystemExit(
            f"Expected exactly one question {question_id}; found {len(matches)}"
        )
    return matches[0]


def guarded_update(container, field, before, after, label):
    if field not in container:
        raise SystemExit(f"Expected field {label} is missing")
    value = container[field]
    if value == before:
        container[field] = after
    elif value != after:
        raise SystemExit(f"Refusing unexpected value for {label}: {value!r}")


def leaf_changes(before, after, prefix=""):
    changes = []
    if isinstance(before, dict) and isinstance(after, dict):
        for key in sorted(set(before) | set(after)):
            path = f"{prefix}.{key}" if prefix else str(key)
            if key not in before or key not in after:
                changes.append(path)
            else:
                changes.extend(leaf_changes(before[key], after[key], path))
    elif isinstance(before, list) and isinstance(after, list):
        if len(before) != len(after):
            changes.append(prefix)
        else:
            for index, (left, right) in enumerate(zip(before, after)):
                changes.extend(leaf_changes(left, right, f"{prefix}[{index}]"))
    elif before != after:
        changes.append(prefix)
    return changes


# Snapshots of every dialogue field that must NOT change. Used as an early
# guard against accidental edits during the guarded run.
PROTECTED_LINES = {
    # d-a2-19
    "d-a2-19": {
        "titleDe": "Im Bürgeramt: Ausweis verlängern",
        "titleAr": "في مكتب المواطنين: تمديد البطاقة",
        "level": "A2",
        "lines_de": [
            "Guten Tag. Sie möchten den Personalausweis verlängern?",
            "Ja, er läuft nächsten Monat ab. Sind meine Unterlagen vollständig?",
            "Fast. Das Foto ist da, aber die Unterschrift auf dem Formular fehlt. So ist der Antrag unvollständig.",
            "Oh, Entschuldigung. Hier, bitte. Wie lange ist die Bearbeitungszeit?",
            "Etwa drei Wochen. Sie bekommen dann einen Brief.",
            "Kann meine Frau den Ausweis abholen? Ich arbeite tagsüber.",
            "Ja, mit einer Vollmacht von Ihnen und ihrem eigenen Ausweis.",
            "Und wer ist mein Ansprechpartner, wenn ich eine Auskunft brauche?",
        ],
        "dictation": [
            "Sie möchten den Personalausweis verlängern?",
            "Etwa drei Wochen. Sie bekommen dann einen Brief.",
        ],
        "waisen": [
            "der Personalausweis",
            "verlängern",
            "die Bearbeitungszeit",
            "vollständig",
            "unvollständig",
            "die Unterschrift",
            "die Vollmacht",
            "der Ansprechpartner",
            "die Auskunft",
        ],
    },
    # d-a2-20
    "d-a2-20": {
        "titleDe": "Streit in der WG",
        "titleAr": "خلاف في السكن المشترك",
        "level": "A2",
        "lines_de": [
            "Jonas, wir müssen reden. Die Küche ist seit drei Tagen chaotisch.",
            "Ich weiß, tut mir leid. Ich hatte diese Woche viel Stress.",
            "Die Essensreste stehen auf dem Herd, und die Spülmaschine ist voll, aber niemand macht sie an.",
            "Okay. Ich wasche heute Abend alles ab und räume auf.",
            "Danke. In einer Wohngemeinschaft braucht man Rücksicht, sonst funktioniert es nicht.",
            "Du hast recht. Machen wir eine feste Absprache: Ich bin ordentlich in der Küche, du kümmerst dich ums Bad?",
            "Einverstanden. Und beim nächsten Problem: erst zuhören, dann streiten.",
            "Lieber gar nicht streiten.",
        ],
        "dictation": [
            "Die Küche ist seit drei Tagen chaotisch.",
            "Ich wasche heute Abend alles ab und räume auf.",
        ],
        "waisen": [
            "die Wohngemeinschaft",
            "aufräumen",
            "die Spülmaschine",
            "abwaschen",
            "die Essensreste",
            "die Rücksicht",
            "die Absprache",
            "ordentlich",
            "chaotisch",
            "zuhören",
        ],
    },
    # d-a2-21
    "d-a2-21": {
        "titleDe": "Nach dem Fußballspiel",
        "titleAr": "بعد مباراة كرة القدم",
        "level": "A2",
        "lines_de": [
            "Kopf hoch, Leute. Wir haben verloren, aber die Mannschaft hat gut gespielt.",
            "Zwei zu drei. Ohne die Verletzung von Ali hätten wir gewonnen.",
            "Wie geht es ihm? Hat er sich schlimm verletzt?",
            "Das Knie tut weh. Er hat starke Beschwerden beim Gehen.",
            "Dann muss er morgen zum Facharzt, nicht nur zum Hausarzt.",
            "Ich fahre ihn hin. Und heute Abend gehen wir alle zu ihm, um ihn zu trösten.",
            "Das ist hilfsbereit von euch. So gewinnt man auch nach einer Niederlage.",
            "Nächste Woche gewinnen wir dann richtig.",
        ],
        "dictation": [
            "Wir haben verloren, aber die Mannschaft hat gut gespielt.",
            "Er hat starke Beschwerden beim Gehen.",
        ],
        "waisen": [
            "die Mannschaft",
            "gewinnen",
            "verlieren",
            "die Verletzung",
            "sich verletzen",
            "der Facharzt",
            "die Beschwerden",
            "trösten",
            "hilfsbereit",
        ],
    },
}

# Question snapshots: only fields we pin; anchors verify that question text
# options and answers have not drifted.
PROTECTED_QUESTIONS = {
    "d-a2-19-q1": {
        "promptDe": "Warum ist der Antrag zuerst unvollständig?",
        "answer": "Die Unterschrift auf dem Formular fehlt.",
        "options": [
            "Das Foto fehlt.",
            "Die Vollmacht fehlt.",
            "Die Unterschrift auf dem Formular fehlt.",
        ],
    },
    "d-a2-19-q2": {
        "promptDe": "Was braucht die Frau von Amir zum Abholen?",
        "answer": "eine Vollmacht und ihren eigenen Ausweis",
        "options": [
            "eine Vollmacht und ihren eigenen Ausweis",
            "nur den Brief vom Amt",
            "das Foto und das Formular",
        ],
    },
    "d-a2-19-q3": {
        "promptDe": "Die Bearbeitungszeit beträgt etwa drei Tage.",
        "answer": "falsch",
        "options": ["richtig", "falsch"],
    },
    "d-a2-20-q1": {
        "promptDe": "Was ist das Problem mit der Spülmaschine?",
        "answer": "Sie ist voll, aber niemand macht sie an.",
        "options": [
            "Sie ist voll, aber niemand macht sie an.",
            "Sie steht voll mit Essensresten auf dem Herd.",
            "Jonas hat sie heute Abend angemacht.",
        ],
    },
    "d-a2-20-q2": {
        "promptDe": "Welche Absprache schlägt Jonas vor?",
        "answer": "Er macht die Küche, Nadia das Bad.",
        "options": [
            "Beide räumen die Küche zusammen auf.",
            "Er macht die Küche, Nadia das Bad.",
            "Nadia macht die Küche, er das Bad.",
        ],
    },
    "d-a2-20-q3": {
        "promptDe": "In einer Wohngemeinschaft braucht man ___, sonst funktioniert es nicht.",
        "answer": ["Rücksicht"],
    },
    "d-a2-21-q1": {
        "promptDe": "Wie ist das Spiel ausgegangen?",
        "answer": "Die Mannschaft hat zwei zu drei verloren.",
        "options": [
            "Die Mannschaft hat drei zu zwei gewonnen.",
            "Die Mannschaft hat zwei zu drei verloren.",
            "Das Spiel wurde wegen der Verletzung abgebrochen.",
        ],
    },
    "d-a2-21-q2": {
        "promptDe": "Wohin soll Ali morgen gehen?",
        "answer": "zum Facharzt",
        "options": [
            "nur zum Hausarzt",
            "zu Ali nach Hause",
            "zum Facharzt",
        ],
    },
    "d-a2-21-q3": {
        "promptDe": "Die Freunde besuchen Ali heute Abend.",
        "answer": "richtig",
        "options": ["richtig", "falsch"],
    },
}


def check_shape(dialogue):
    if (
        dialogue.get("level") != "A2"
        or len(dialogue.get("lines", [])) != 8
        or len(dialogue.get("questions", [])) != 3
        or len(dialogue.get("dictation", [])) != 2
    ):
        raise SystemExit(f"Refusing unexpected shape for {dialogue.get('id')}")


def main():
    dialogue_raw = DIALOGUES_PATH.read_text(encoding="utf-8")
    dialogues = json.loads(dialogue_raw)
    before_dialogues = deepcopy(dialogues)

    for dialogue_id, snapshot in PROTECTED_LINES.items():
        d = get_dialogue(dialogues, dialogue_id)
        check_shape(d)
        if d.get("titleDe") != snapshot["titleDe"]:
            raise SystemExit(f"Unexpected titleDe for {dialogue_id}")
        if d.get("titleAr") != snapshot["titleAr"]:
            raise SystemExit(f"Unexpected titleAr for {dialogue_id}")
        if d.get("level") != snapshot["level"]:
            raise SystemExit(f"Unexpected level for {dialogue_id}")
        if d.get("dictation") != snapshot["dictation"]:
            raise SystemExit(f"Unexpected dictation for {dialogue_id}")
        if d.get("waisen") != snapshot["waisen"]:
            raise SystemExit(f"Unexpected waisen list for {dialogue_id}")
        for idx, de in enumerate(snapshot["lines_de"]):
            if d["lines"][idx].get("de") != de:
                raise SystemExit(
                    f"Protected German line changed for {dialogue_id}[{idx}]: {d['lines'][idx].get('de')!r}"
                )

    for qid, snapshot in PROTECTED_QUESTIONS.items():
        dialogue_id = qid.rsplit("-q", 1)[0]
        d = get_dialogue(dialogues, dialogue_id)
        q = get_question(d, qid)
        for field, expected in snapshot.items():
            if q.get(field) != expected:
                raise SystemExit(
                    f"Protected question field changed for {qid}.{field}: {q.get(field)!r}"
                )

    # Apply only the enumerated Arabic corrections.
    for dialogue_id, kind, target, field, before, after in DIALOGUE_CHANGES:
        d = get_dialogue(dialogues, dialogue_id)
        if kind == "line":
            container = d["lines"][target]
        elif kind == "question":
            container = get_question(d, target)
        else:
            raise SystemExit(f"Unknown patch target kind: {kind}")
        guarded_update(container, field, before, after, f"{dialogue_id}.{target}.{field}")

    # Ensure the diff is limited to the single corrected Arabic field.
    changed_leaves = leaf_changes(before_dialogues, dialogues)
    changed = {re.sub(r"\[\d+\]$", "", p) for p in changed_leaves}
    expected = {"[{}].lines[4].ar".format(
        next(i for i, item in enumerate(dialogues) if item.get("id") == "d-a2-21")
    )}
    if changed and changed != expected:
        raise SystemExit(f"Unexpected dialogue diff size ({len(changed)}): {sorted(changed)}")

    dialogue_out = json.dumps(dialogues, ensure_ascii=False, indent=2) + "\n"
    if dialogue_raw != dialogue_out:
        DIALOGUES_PATH.write_text(dialogue_out, encoding="utf-8")
        print("R110 patch applied; files written: content/dialogues.json")
    else:
        print("R110 patch complete; dialogue fields changed=0, files written=none (already applied)")


if __name__ == "__main__":
    main()
