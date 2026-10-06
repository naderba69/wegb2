#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply the guarded R109 corrections for A2 dialogues d-a2-16–d-a2-18.

The patch is idempotent and deliberately changes only the enumerated dialogue
fields, the vd-wohnen-021 card, its source row, and its plural-map entry.
Contextual/legal limits and style alternatives remain unchanged and are recorded
in report_a2_dialogues_07.py. This script does not regenerate an entire deck.
"""
from copy import deepcopy
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DIALOGUES_PATH = ROOT / "content" / "dialogues.json"
VOCAB_PATH = ROOT / "content" / "vocab.json"
WAVE_PATH = ROOT / "scripts" / "vokabel_welle7.py"
PLURALS_PATH = ROOT / "scripts" / "patches" / "apply_plurals.py"

# Dialogue-only field corrections: exact reviewed before/after values.
DIALOGUE_CHANGES = [
    ("d-a2-16", "question", "d-a2-16-q2", "promptDe",
     "Wo ist der Erste-Hilfe-Kasten?",
     "Welche Aussage zum Erste-Hilfe-Kasten stimmt?"),
    ("d-a2-16", "question", "d-a2-16-q2", "promptAr",
     "اختر الإجابة الصحيحة حسب الحوار.",
     "أيّ وصف لصندوق الإسعافات الأولية يطابق الحوار؟"),
    ("d-a2-16", "question", "d-a2-16-q2", "options",
     ["neben der Tür", "in der Halle beim gelben Schild", "beim Meister"],
     [
         "Der Erste-Hilfe-Kasten hängt neben der Tür und ist rot.",
         "Der Erste-Hilfe-Kasten steht neben der Tür und ist rot.",
         "Der Erste-Hilfe-Kasten hängt neben der Tür und ist gelb.",
     ]),
    ("d-a2-16", "question", "d-a2-16-q2", "answer",
     "neben der Tür",
     "Der Erste-Hilfe-Kasten hängt neben der Tür und ist rot."),
    ("d-a2-16", "question", "d-a2-16-q2", "explanationAr",
     "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». الفخّ 1: اللافتة الصفراء تحذير. الفخّ 2: المعلّم يُبلَّغ بعد الإسعاف.",
     "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». يثبت السطر مكان الصندوق وطريقة تعليقه ولونه. الفخّ: اعتبار «das gelbe Schild» دليلاً على أن الصندوق أصفر أو أن اللافتة تحذير؛ لا يذكر الحوار ذلك."),
    ("d-a2-17", "line", 6, "de",
     "Der Akzent ist kein Problem, wenn Sie langsam sprechen. Wichtig ist: dranbleiben.",
     "Ein Akzent ist normal. Sprechen Sie langsam und deutlich. Wenn man Sie nicht versteht, wiederholen Sie den Satz. Wichtig ist: dranbleiben."),
    ("d-a2-17", "line", 6, "ar",
     "اللكنة ليست مشكلة إذا تكلمت ببطء. المهم: الاستمرار.",
     "اللكنة أمر طبيعي. تحدّث ببطء ووضوح. وإذا لم يفهمك الآخرون، فأعِد الجملة. المهم: واصل التعلّم."),
    ("d-a2-17", "question", "d-a2-17-q1", "explanationAr",
     "الدليل: «Ihr Problem ist der Wortschatz: zu wenige Wörter». الفخّ 1: القواعد «kennen Sie». الفخّ 2: اللكنة «kein Problem».",
     "الدليل: «Ihr Problem ist der Wortschatz: zu wenige Wörter». الفخّ 1: القواعد «kennen Sie». أمّا اللكنة فهي موضوع نصيحة لاحقة، لا السبب الذي سمّته المعلمة."),
    ("d-a2-18", "line", 2, "de",
     "Sehr gut, das sehe ich. Die Wohnfläche sind 54 Quadratmeter, alles sauber.",
     "Sehr gut, das sehe ich. Die Wohnfläche ist 54 Quadratmeter, alles sauber."),
    ("d-a2-18", "line", 4, "ar",
     "نعم، خلال أربعة أسابيع، بعد آخر تسوية للإيجار الشامل.",
     "نعم، بعد أربعة أسابيع، عقب آخر تسوية للإيجار الشامل."),
    ("d-a2-18", "line", 7, "ar",
     "لا، إدارة العقار وجدته. يدخل في الأول من الشهر.",
     "لا، إدارة العقار وجدته. سينتقل إلى الشقة في الأول من الشهر."),
    ("d-a2-18", "question", "d-a2-18-q2", "explanationAr",
     "الدليل: «in vier Wochen, nach der letzten Abrechnung der Warmmiete». الفخّ 1: الأول من الشهر موعد دخول المستأجر التالي. الفخّ 2: التسليم الآن.",
     "الدليل: «in vier Wochen, nach der letzten Abrechnung der Warmmiete». الفخّ: موعد «am Ersten» هو انتقال المستأجر التالي إلى الشقة، لا موعد ردّ الكفالة."),
    ("d-a2-18", "question", "d-a2-18-q3", "promptDe",
     "Die Wohnfläche sind 54 Quadratmeter.",
     "Die Wohnfläche ist 54 Quadratmeter."),
    ("d-a2-18", "question", "d-a2-18-q3", "explanationAr",
     "الدليل: «Die Wohnfläche sind 54 Quadratmeter, alles sauber».",
     "الدليل: «Die Wohnfläche ist 54 Quadratmeter, alles sauber». الفاعل المفرد «Die Wohnfläche» يقتضي «ist»؛ وتبقى الإجابة «richtig» لأن المعلومة صحيحة بعد التصحيح."),
    ("d-a2-18", "dialogue", "d-a2-18", "waisen[8]",
     "die Nachmieter suchen",
     "der Nachmieter"),
]

# A previous local draft of this same guarded patch used this explanation.
# Accept it as an intermediate state so the final patch remains safely rerunnable
# while the report preserves the original pre-R109 snapshot above.
PREVIOUS_APPLIED_VALUES = {
    ("d-a2-16", "question", "d-a2-16-q2", "explanationAr"):
        (
            "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». يثبت السطر مكان الصندوق وطريقة تعليقه ولونه؛ ولا يفترض أن اللافتة الصفراء تصفه.",
            "الدليل: «Der Erste-Hilfe-Kasten hängt neben der Tür, rot». يثبت السطر مكان الصندوق وطريقة تعليقه ولونه. الفخّ: اعتبار «gelbe Schild» دليلاً على أن الصندوق أصفر أو أن اللافتة تحذير؛ لا يذكر الحوار ذلك.",
        ),
    ("d-a2-18", "question", "d-a2-18-q2", "explanationAr"):
        "الدليل: «in vier Wochen, nach der letzten Abrechnung der Warmmiete». موعد «am Ersten» هو انتقال المستأجر التالي إلى الشقة، لا موعد ردّ الكفالة.",
}

CARD_BEFORE = {
    "de": "die Nachmieter suchen",
    "ar": "يبحثُ عن مستأجرٍ بديل",
    "article": None,
    "plural": None,
    "farbe": None,
    "exampleDe": "Ich suche Nachmieter für die Wohnung.",
    "exampleAr": "أبحثُ عن مستأجرٍ بديل",
}
CARD_AFTER = {
    "de": "der Nachmieter",
    "ar": "المستأجرُ البديلُ",
    "article": "der",
    "plural": "die Nachmieter",
    "farbe": "BLAU",
    "exampleDe": "Ich suche einen Nachmieter für die Wohnung.",
    "exampleAr": "أبحثُ عن مستأجرٍ بديلٍ للشقة.",
}
CARD_ID = "vd-wohnen-021"

OLD_WAVE_ROW = ' ("die Nachmieter suchen","يبحثُ عن مستأجرٍ بديل","","","Ich suche Nachmieter für die Wohnung.","أبحثُ عن مستأجرٍ بديل","wohnen"),'
NEW_WAVE_ROW = ' ("der Nachmieter","المستأجرُ البديلُ","der","die Nachmieter","Ich suche einen Nachmieter für die Wohnung.","أبحثُ عن مستأجرٍ بديلٍ للشقة.","wohnen"),'
PLURAL_ANCHOR = '    "vd-wohnen-019": "die Hausratversicherungen",\n'
PLURAL_ENTRY = '    "vd-wohnen-021": "die Nachmieter",\n'


def get_dialogue(data, dialogue_id):
    matches = [item for item in data if item.get("id") == dialogue_id]
    if len(matches) != 1:
        raise SystemExit(f"Expected exactly one dialogue {dialogue_id}; found {len(matches)}")
    return matches[0]


def get_question(dialogue, question_id):
    matches = [item for item in dialogue.get("questions", []) if item.get("id") == question_id]
    if len(matches) != 1:
        raise SystemExit(f"Expected exactly one question {question_id}; found {len(matches)}")
    return matches[0]


def guarded_update(container, field, before, after, label, missing_ok=False, accepted_intermediate=()):
    if field == "waisen[8]":
        value = container["waisen"][8]
        if value == before or value in accepted_intermediate:
            container["waisen"][8] = after
        elif value != after:
            raise SystemExit(f"Refusing unexpected value for {label}: {value!r}")
        return
    if field not in container:
        if missing_ok and before is None:
            container[field] = after
            return
        raise SystemExit(f"Expected field {label} is missing")
    value = container[field]
    if value == before or value in accepted_intermediate:
        container[field] = after
    elif value != after:
        raise SystemExit(f"Refusing unexpected value for {label}: {value!r}")


def find_card(vocab):
    matches = [card for deck in vocab.values() for card in deck.get("cards", []) if card.get("id") == CARD_ID]
    if len(matches) != 1:
        raise SystemExit(f"Expected exactly one vocabulary card {CARD_ID}; found {len(matches)}")
    return matches[0]


def update_source_row(text):
    old_count = text.count(OLD_WAVE_ROW)
    new_count = text.count(NEW_WAVE_ROW)
    if old_count == 1 and new_count == 0:
        return text.replace(OLD_WAVE_ROW, NEW_WAVE_ROW, 1)
    if old_count == 0 and new_count == 1:
        return text
    raise SystemExit(f"Refusing unexpected A2_WOHNEN_VERTRAG source row (old={old_count}, new={new_count})")


def update_plural_map(text):
    entry_count = text.count(PLURAL_ENTRY)
    if entry_count == 1:
        return text
    if entry_count != 0 or text.count(PLURAL_ANCHOR) != 1:
        raise SystemExit("Refusing unexpected apply_plurals.py map state")
    return text.replace(PLURAL_ANCHOR, PLURAL_ANCHOR + PLURAL_ENTRY, 1)


def protect(data, dialogue_id, kind, target, field, expected):
    dialogue = get_dialogue(data, dialogue_id)
    if kind == "line":
        actual = dialogue["lines"][target].get(field)
    elif kind == "question":
        actual = get_question(dialogue, target).get(field)
    else:
        actual = dialogue.get(field)
    if actual != expected:
        raise SystemExit(f"Protected R109 content changed unexpectedly: {dialogue_id}/{target}/{field}: {actual!r}")


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


def main():
    dialogue_raw = DIALOGUES_PATH.read_text(encoding="utf-8")
    vocab_raw = VOCAB_PATH.read_text(encoding="utf-8")
    wave_raw = WAVE_PATH.read_text(encoding="utf-8")
    plurals_raw = PLURALS_PATH.read_text(encoding="utf-8")
    dialogues = json.loads(dialogue_raw)
    vocab = json.loads(vocab_raw)
    before_dialogues = deepcopy(dialogues)
    before_vocab = deepcopy(vocab)

    # Shape and immutable-context guards.
    for dialogue_id in ("d-a2-16", "d-a2-17", "d-a2-18"):
        dialogue = get_dialogue(dialogues, dialogue_id)
        if dialogue.get("level") != "A2" or len(dialogue.get("lines", [])) != 8 or len(dialogue.get("questions", [])) != 3 or len(dialogue.get("dictation", [])) != 2:
            raise SystemExit(f"Refusing unexpected shape for {dialogue_id}")
    protect(dialogues, "d-a2-16", "line", 7, "de", "Verstanden. Und das gelbe Schild dort ist eine Warnung?")
    protect(dialogues, "d-a2-16", "line", 7, "ar", "مفهوم. واللافتة الصفراء هناك تحذير؟")
    protect(dialogues, "d-a2-17", "line", 5, "de", "Und mein Akzent? Die Leute verstehen mich nicht immer.")
    protect(dialogues, "d-a2-17", "line", 5, "ar", "ولكنتي؟ الناس لا يفهمونني دائماً.")
    protect(dialogues, "d-a2-17", "question", "d-a2-17-q1", "answer", "der Wortschatz")
    protect(dialogues, "d-a2-17", "question", "d-a2-17-q1", "options", ["der Wortschatz", "die Grammatikregeln", "der Akzent"])
    protect(dialogues, "d-a2-18", "line", 2, "ar", "ممتاز، أرى ذلك. مساحة السكن 54 متراً مربعاً، كل شيء نظيف.")
    protect(dialogues, "d-a2-18", "line", 3, "de", "Bekomme ich die Kaution bald zurück?")
    protect(dialogues, "d-a2-18", "line", 3, "ar", "هل أسترد الضمانة قريباً؟")
    protect(dialogues, "d-a2-18", "line", 4, "de", "Ja, in vier Wochen, nach der letzten Abrechnung der Warmmiete.")
    protect(dialogues, "d-a2-18", "line", 6, "de", "Danke. Haben Sie eigentlich den Nachmieter gefunden?")
    protect(dialogues, "d-a2-18", "question", "d-a2-18-q2", "answer", "in vier Wochen, nach der Abrechnung")
    protect(dialogues, "d-a2-18", "question", "d-a2-18-q2", "options", ["am Ersten, wenn der Nachmieter einzieht", "sofort bei der Übergabe", "in vier Wochen, nach der Abrechnung"])
    protect(dialogues, "d-a2-18", "question", "d-a2-18-q3", "options", ["richtig", "falsch"])
    protect(dialogues, "d-a2-18", "question", "d-a2-18-q3", "answer", "richtig")

    # Apply only the listed dialogue fields.
    for dialogue_id, kind, target, field, before, after in DIALOGUE_CHANGES:
        dialogue = get_dialogue(dialogues, dialogue_id)
        if kind == "line":
            container = dialogue["lines"][target]
        elif kind == "question":
            container = get_question(dialogue, target)
        elif kind == "dialogue":
            container = dialogue
        else:
            raise SystemExit(f"Unknown patch target kind: {kind}")
        intermediate = PREVIOUS_APPLIED_VALUES.get((dialogue_id, kind, target, field), ())
        if isinstance(intermediate, str):
            intermediate = (intermediate,)
        guarded_update(container, field, before, after, f"{dialogue_id}.{target}.{field}", accepted_intermediate=intermediate)

    card = find_card(vocab)
    if card.get("pos") != "Nomen" or card.get("level") != "A2" or card.get("tags") != ["wohnen"]:
        raise SystemExit("Refusing unexpected POS, level, or tag on vd-wohnen-021")
    if card.get("aussprache") != "ch بعدَ a/o/u = خاء، وبعدَ i/e = «هش» رقيقة":
        raise SystemExit("Refusing unexpected pronunciation note on vd-wohnen-021")
    for field, after in CARD_AFTER.items():
        before = CARD_BEFORE[field]
        guarded_update(card, field, before, after, f"{CARD_ID}.{field}", missing_ok=True)

    new_wave = update_source_row(wave_raw)
    new_plurals = update_plural_map(plurals_raw)

    # Ensure no dialogue/vocabulary field outside the explicit patch changed.
    expected_dialogue_count = 15
    expected_vocab_count = 7
    changed_dialogue_leaves = leaf_changes(before_dialogues, dialogues)
    changed_vocab = leaf_changes(before_vocab, vocab)
    # A JSON array is one logical options field even though the diff walker
    # sees one leaf per alternative.
    changed_dialogue = {
        re.sub(r"(\.options)\[\d+\]$", r"\1", path)
        for path in changed_dialogue_leaves
    }
    dialogue_index_16 = next(index for index, item in enumerate(dialogues) if item.get("id") == "d-a2-16")
    dialogue_index_18 = next(index for index, item in enumerate(dialogues) if item.get("id") == "d-a2-18")
    expected_intermediate_diffs = {
        f"[{dialogue_index_16}].questions[1].explanationAr",
        f"[{dialogue_index_18}].questions[1].explanationAr",
    }
    is_expected_intermediate = len(changed_dialogue) == 1 and changed_dialogue.issubset(expected_intermediate_diffs)
    if len(changed_dialogue) not in (0, expected_dialogue_count) and not is_expected_intermediate:
        raise SystemExit(f"Unexpected dialogue diff size ({len(changed_dialogue)}): {sorted(changed_dialogue)}")
    if len(changed_vocab) not in (0, expected_vocab_count):
        raise SystemExit(f"Unexpected vocabulary diff size ({len(changed_vocab)}): {changed_vocab}")
    if changed_dialogue and len(changed_dialogue) != expected_dialogue_count and not is_expected_intermediate:
        raise SystemExit("Partial dialogue patch detected")
    if changed_vocab and len(changed_vocab) != expected_vocab_count:
        raise SystemExit("Partial vocabulary-card patch detected")

    q16 = get_question(get_dialogue(dialogues, "d-a2-16"), "d-a2-16-q2")
    if q16["answer"] not in q16["options"] or len(set(q16["options"])) != 3:
        raise SystemExit("Post-patch d-a2-16-q2 options/key check failed")
    if "gelben Schild" in q16["explanationAr"]:
        raise SystemExit("The corrected first-aid question must not infer anything from the yellow sign")
    q18 = get_question(get_dialogue(dialogues, "d-a2-18"), "d-a2-18-q3")
    if q18["answer"] != "richtig" or q18["promptDe"] != "Die Wohnfläche ist 54 Quadratmeter.":
        raise SystemExit("Post-patch grammar-question guard failed")
    if card.get("de") != "der Nachmieter" or card.get("article") != "der" or card.get("plural") != "die Nachmieter" or card.get("farbe") != "BLAU":
        raise SystemExit("Post-patch Nachmieter card metadata check failed")

    dialogue_out = json.dumps(dialogues, ensure_ascii=False, indent=2) + "\n"
    vocab_out = json.dumps(vocab, ensure_ascii=False, indent=1)
    changes = []
    for path, old, new in (
        (DIALOGUES_PATH, dialogue_raw, dialogue_out),
        (VOCAB_PATH, vocab_raw, vocab_out),
        (WAVE_PATH, wave_raw, new_wave),
        (PLURALS_PATH, plurals_raw, new_plurals),
    ):
        if old != new:
            path.write_text(new, encoding="utf-8")
            changes.append(path.relative_to(ROOT).as_posix())
    print(
        "R109 patch complete; dialogue fields changed="
        f"{len(changed_dialogue)}, vocabulary fields changed={len(changed_vocab)}, "
        f"files written={changes or 'none (already applied)'}"
    )


if __name__ == "__main__":
    main()
