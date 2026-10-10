#!/usr/bin/env python3
"""دفعة 4: متلازمتان مساعدتان ومرادف سياقي موثّق لكل بطاقة A1 جديدة."""
import json
import re
from pathlib import Path

CONTEXT = Path("content/synonyme-kontext.json")
KOLLOK = Path("content/kollokationen.json")
ARABIC = re.compile(r"[\u0600-\u06ff]")
BEFORE = 30
AFTER = 40

# هذه البطاقات A1 لم تكن لها متلازمات. تُضاف متلازمتان فريدتان لكل بطاقة
# كي يبقى شرط R70–R72 (متلازمة أساس موجودة في بنك البطاقة) صادقاً بلا استثناء.
KOLLOCATION_PATCH = {
    "vx-haus--085": ["schnell fahren", "schnell schreiben"],
    "vx-haus--082": ["eine wichtige Frage", "eine wichtige Nachricht"],
    "vx-haus--078": ["die richtige Antwort", "das richtige Ergebnis"],
    "vx-haus--079": ["eine falsche Antwort", "eine falsche Angabe"],
    "vx-haus--081": ["eine leichte Aufgabe", "eine leichte Frage"],
    "vw-a1koe-037": ["billige Schuhe", "billiges Essen"],
    "vw-a1koe-038": ["teuer werden", "ein Hotel teuer finden"],
    "vy-natur-039": ["glücklich über die Nachricht", "glücklich über den Erfolg"],
    "vy-natur-040": ["traurig über den Abschied", "traurig nach der Absage"],
    "vw-a1koe-017": ["müde nach dem Sport", "am Abend müde"],
}

BATCH = {
    "schnell": {
        "rasch": {
            "basisKollokation": "schnell fahren",
            "alternativKollokation": "rasch fahren",
            "basisDe": "Der Zug fährt heute schnell.",
            "basisAr": "يسير القطار اليوم بسرعة.",
            "alternativDe": "Der Zug fährt heute rasch.",
            "alternativAr": "ينطلق القطار اليوم بسرعة.",
            "nuanceAr": "في وصف السرعة يتقاربان؛ schnell أشيع ومحايد، أمّا rasch فأكثر رسمية أو أدبية، ولا يتبادلان في كل تركيب.",
        }
    },
    "wichtig": {
        "bedeutsam": {
            "basisKollokation": "eine wichtige Frage",
            "alternativKollokation": "eine bedeutsame Frage",
            "basisDe": "Das ist eine wichtige Frage.",
            "basisAr": "هذا سؤال مهم.",
            "alternativDe": "Das ist eine bedeutsame Frage.",
            "alternativAr": "هذا سؤال ذو أهمية كبيرة.",
            "nuanceAr": "كلاهما يصف أهمية السؤال؛ bedeutsam أميل إلى الرسمية ويؤكد أن للسؤال دلالة أو أثراً، بينما wichtig أعمّ وأشيع.",
        }
    },
    "richtig": {
        "korrekt": {
            "basisKollokation": "die richtige Antwort",
            "alternativKollokation": "die korrekte Antwort",
            "basisDe": "Das ist die richtige Antwort.",
            "basisAr": "هذه هي الإجابة الصحيحة.",
            "alternativDe": "Das ist die korrekte Antwort.",
            "alternativAr": "هذه هي الإجابة الصحيحة.",
            "nuanceAr": "في تصحيح إجابة يتقاربان جداً؛ korrekt أرسميّ وأكثر تحديداً لمعيار أو قاعدة، وrichtig أوسع استعمالاً.",
        }
    },
    "falsch": {
        "inkorrekt": {
            "basisKollokation": "eine falsche Angabe",
            "alternativKollokation": "eine inkorrekte Angabe",
            "basisDe": "Die Angabe auf dem Formular ist falsch.",
            "basisAr": "البيان في الاستمارة غير صحيح.",
            "alternativDe": "Die Angabe auf dem Formular ist inkorrekt.",
            "alternativAr": "البيان في الاستمارة غير مطابق للصواب.",
            "nuanceAr": "في تقييم معلومة أو بيان يتقاربان؛ falsch يومي وأوسع، أمّا inkorrekt فأرسميّ ويشيع عند الحكم على الدقة أو القواعد.",
        }
    },
    "leicht": {
        "einfach": {
            "basisKollokation": "eine leichte Aufgabe",
            "alternativKollokation": "eine einfache Aufgabe",
            "basisDe": "Das ist eine leichte Aufgabe.",
            "basisAr": "هذه مهمة سهلة.",
            "alternativDe": "Das ist eine einfache Aufgabe.",
            "alternativAr": "هذه مهمة بسيطة.",
            "nuanceAr": "في وصف صعوبة المهمة يتقاربان؛ leicht يركّز على قلة الجهد أو الصعوبة، وeinfach على بساطة الخطوات، وقد تعني leicht أيضاً خفيف الوزن.",
        }
    },
    "billig": {
        "preiswert": {
            "basisKollokation": "billige Schuhe",
            "alternativKollokation": "preiswerte Schuhe",
            "basisDe": "Diese Schuhe sind billig.",
            "basisAr": "هذه الأحذية رخيصة.",
            "alternativDe": "Diese Schuhe sind preiswert.",
            "alternativAr": "سعر هذه الأحذية مناسب قياساً بقيمتها.",
            "nuanceAr": "كلاهما يتصل بانخفاض السعر؛ billig قد يوحي أيضاً بجودة منخفضة، بينما preiswert يقدّم السعر غالباً على أنه مناسب لما يُنال مقابله.",
        }
    },
    "teuer": {
        "kostspielig": {
            "basisKollokation": "ein Hotel teuer finden",
            "alternativKollokation": "ein Hotel kostspielig finden",
            "basisDe": "Ich finde das Hotel für eine Nacht sehr teuer.",
            "basisAr": "أجد الفندق باهظاً جداً لليلة واحدة.",
            "alternativDe": "Ich finde das Hotel für eine Nacht sehr kostspielig.",
            "alternativAr": "أجد كلفة الفندق مرتفعة جداً لليلة واحدة.",
            "nuanceAr": "في وصف كلفة الإقامة يتقاربان؛ kostspielig أرسميّ ويركّز على عبء النفقات، أما teuer فأشيع وأوسع.",
        }
    },
    "glücklich": {
        "froh": {
            "basisKollokation": "glücklich über die Nachricht",
            "alternativKollokation": "froh über die Nachricht",
            "basisDe": "Ich bin glücklich über die Nachricht.",
            "basisAr": "أنا سعيد بهذا الخبر.",
            "alternativDe": "Ich bin froh über die Nachricht.",
            "alternativAr": "أنا مسرور بهذا الخبر.",
            "nuanceAr": "عند الاستجابة لخبر سار يتقاربان؛ glücklich قد يصف سعادة أعمق أو أطول، وfroh كثيراً ما يعبّر عن الارتياح أو السرور بسبب محدد.",
        }
    },
    "traurig": {
        "betrübt": {
            "basisKollokation": "traurig über den Abschied",
            "alternativKollokation": "betrübt über den Abschied",
            "basisDe": "Sie ist traurig über den Abschied.",
            "basisAr": "هي حزينة بسبب الوداع.",
            "alternativDe": "Sie ist betrübt über den Abschied.",
            "alternativAr": "هي مغمومة بسبب الوداع.",
            "nuanceAr": "في وصف الحزن على الوداع يتقاربان؛ traurig شائع ومحايد، أمّا betrübt فأفصح أو أدبيّ النبرة.",
        }
    },
    "müde": {
        "schläfrig": {
            "basisKollokation": "müde nach dem Sport",
            "alternativKollokation": "schläfrig nach dem Sport",
            "basisDe": "Nach dem Sport bin ich müde.",
            "basisAr": "أشعر بالتعب بعد الرياضة.",
            "alternativDe": "Nach dem Sport bin ich schläfrig.",
            "alternativAr": "أشعر بالنعاس بعد الرياضة.",
            "nuanceAr": "قد يتقاربان بعد مجهود إذا صاحبه نعاس؛ müde أوسع ويعني التعب، بينما schläfrig يحدد الميل إلى النوم.",
        }
    },
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def has_arabic(text: str) -> bool:
    return bool(ARABIC.search(text))


def main() -> None:
    assert CONTEXT.exists() and KOLLOK.exists(), "بنوك السياق والمتلازمات السابقة مطلوبة"
    current_context = load_json(CONTEXT)
    current_koll = load_json(KOLLOK)
    current_count = sum(len(items) for items in current_context.values())

    assert len(BATCH) == 10 and sum(map(len, BATCH.values())) == 10, "يجب أن تضم الدفعة الرابعة عشر علاقات"
    assert len(KOLLOCATION_PATCH) == 10 and all(len(items) == 2 for items in KOLLOCATION_PATCH.values()), "متلازمتان بالضبط لكل بطاقة مساندة"
    context_present = all(current_context.get(source, {}).get(target) == item for source, alternatives in BATCH.items() for target, item in alternatives.items())
    context_absent = all(source not in current_context for source in BATCH)
    assert context_present or context_absent, "حالة جزئية/متعارضة في سياقات الدفعة الرابعة"
    if context_present:
        assert current_count >= AFTER, f"الدفعة موجودة لكن عدد السياقات أقل من {AFTER}: {current_count}"
    else:
        assert current_count == BEFORE, f"المتوقع {BEFORE} سياقاً قبل الدفعة، الموجود {current_count}"

    coll_present = {card_id for card_id, phrases in KOLLOCATION_PATCH.items() if current_koll.get(card_id) == phrases}
    coll_absent = {card_id for card_id in KOLLOCATION_PATCH if card_id not in current_koll}
    coll_conflict = set(KOLLOCATION_PATCH) - coll_present - coll_absent
    assert not coll_conflict, f"متلازمات موجودة بصيغة مختلفة: {sorted(coll_conflict)}"

    vocab = load_json(Path("content/vocab.json"))
    packs = vocab if isinstance(vocab, list) else list(vocab.values())
    cards = [card for pack in packs for card in pack.get("cards", [])]
    by_id = {card["id"]: card for card in cards}
    by_de: dict[str, list[dict]] = {}
    for card in cards:
        by_de.setdefault(card["de"].strip().lower(), []).append(card)
    raw_syn = load_json(Path("content/synonyme.json"))
    assert sum(map(len, raw_syn.values())) == 70, "يجب أن تبقى قائمة syn الخام عند 70 علاقة"
    koll_a1a2 = load_json(Path("content/kollok-a1a2-soll.json"))
    protected_soll = {item["id"] for item in koll_a1a2["A1"]["karten"] + koll_a1a2["A2"]["karten"]}

    proposed = {phrase for phrases in KOLLOCATION_PATCH.values() for phrase in phrases}
    existing = {phrase for phrases in current_koll.values() for phrase in phrases}
    assert len(proposed) == 20 and len(existing) == sum(map(len, current_koll.values())), "صيغة بنك المتلازمات غير متوقعة"
    assert len(proposed & existing) == (20 if coll_present else len(coll_present) * 2), "متلازمة مساندة مكررة في البنك"

    final_koll = {card_id: list(phrases) for card_id, phrases in current_koll.items()}
    for card_id, phrases in KOLLOCATION_PATCH.items():
        card = by_id.get(card_id)
        assert card and card["level"] == "A1" and card["de"].lower() in {source.lower() for source in BATCH}, f"بطاقة مساندة غير متوقعة أو خارج A1: {card_id}"
        assert card_id not in protected_soll, f"البطاقة موجودة مسبقاً في قائمة SOLL الأساسية: {card_id}"
        assert card_id not in current_koll or current_koll[card_id] == phrases, f"لن تُستبدل متلازمات قائمة: {card_id}"
        for phrase in phrases:
            assert 2 <= len(phrase.split()) <= 6 and not has_arabic(phrase), f"متلازمة مساندة فارغة/طويلة/عربية: {card_id}/{phrase}"
            assert card["de"].lower() in phrase.lower(), f"كلمة البطاقة غائبة: {card['de']} / {phrase}"
        if card_id not in final_koll:
            final_koll[card_id] = list(phrases)

    for source, alternatives in BATCH.items():
        hits = by_de.get(source.lower(), [])
        assert len(hits) == 1, f"البطاقة «{source}» موجودة {len(hits)} مرة"
        card = hits[0]
        assert card["level"] == "A1", f"المستوى خارج الدفعة: {source}/{card['level']}"
        assert source in raw_syn and all(target in raw_syn[source] for target in alternatives), f"علاقة غير موجودة في syn الخام: {source}"
        for target, item in alternatives.items():
            assert target in (card.get("syn") or []), f"{source}→{target}: العلاقة غير موجودة على البطاقة"
            assert item["basisKollokation"] in final_koll.get(card["id"], []), f"{source}: متلازمة الأساس غير موجودة"
            assert target.lower() in item["alternativKollokation"].lower(), f"{source}→{target}: المقابل غائب عن المتلازمة البديلة"
            for key in ("basisDe", "alternativDe", "basisKollokation", "alternativKollokation"):
                assert item[key].strip() and not has_arabic(item[key]), f"حقل ألماني فارغ/عربي: {source}/{key}"
            for key in ("basisAr", "alternativAr", "nuanceAr"):
                assert has_arabic(item[key]), f"غياب العربية في {source}/{key}"

    all_phrases = [phrase for phrases in final_koll.values() for phrase in phrases]
    assert len(all_phrases) == len(set(all_phrases)), "تكرار متلازمة في البنك النهائي"
    merged_context = {source: dict(alternatives) for source, alternatives in current_context.items()}
    if not context_present:
        for source, alternatives in BATCH.items():
            assert source not in merged_context, f"مصدر متكرر: {source}"
            merged_context[source] = alternatives

    koll_text = json.dumps(final_koll, ensure_ascii=False, indent=1) + "\n"
    if KOLLOK.read_text(encoding="utf-8") != koll_text:
        KOLLOK.write_text(koll_text, encoding="utf-8")
    if not context_present:
        CONTEXT.write_text(json.dumps(merged_context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"نجح الفحص السابق للكتابة: متلازمات مساندة {len(KOLLOCATION_PATCH)} بطاقة/20 عبارة؛ سياقات {sum(map(len, merged_context.values()))}/70؛ القائمة الخام syn بقيت {sum(map(len, raw_syn.values()))}")


if __name__ == "__main__":
    main()
